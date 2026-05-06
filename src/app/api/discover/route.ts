import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { anthropic } from "@/lib/anthropic";
import { fetchWikipediaInfo } from "@/services/data-sources/wikipedia";
import { getIndustryConfig } from "@/config/industries";
import { scoreLead } from "@/services/lead-scorer";
import type { ICPProfile } from "@/services/lead-scorer";

export async function POST(request: Request) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { icp } = await request.json();
  if (!icp) {
    return NextResponse.json({ error: "ICP description is required" }, { status: 400 });
  }

  const config = getIndustryConfig(user.industry);

  // Load seller profile + ICP for strict filtering context
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { sellerProfile: true, icpProfile: true },
  });

  let sellerContext = "";
  let strictFilters = "";

  if (userData?.sellerProfile) {
    try {
      const sp = JSON.parse(userData.sellerProfile as string);
      const parts: string[] = [];
      if (sp.products?.length)
        parts.push(`The seller offers: ${sp.products.join(", ")}.`);
      if (sp.territory?.states?.length)
        parts.push(`ONLY suggest companies headquartered in these states: ${sp.territory.states.join(", ")}.`);
      else if (sp.territory?.description && sp.territory.description !== "National")
        parts.push(`Focus on companies in ${sp.territory.description}.`);
      if (parts.length) sellerContext = parts.join(" ");
    } catch { /* ignore */ }
  }

  if (userData?.icpProfile) {
    try {
      const icpProfile = JSON.parse(userData.icpProfile as string);
      const filters: string[] = [];
      if (icpProfile.verticals?.length)
        filters.push(`ONLY suggest organizations in these verticals/sectors: ${icpProfile.verticals.join(", ")}. DO NOT suggest companies outside these verticals.`);
      if (icpProfile.buyerTitles?.length)
        filters.push(`Target buyer persona: ${icpProfile.buyerTitles.join(", ")}.`);
      if (icpProfile.accountType === "new_business")
        filters.push(`Focus on organizations that are likely NOT existing customers of the seller.`);
      if (filters.length) strictFilters = filters.join(" ");
    } catch { /* ignore */ }
  }

  // Step 1: Ask Claude to suggest real companies matching the ICP
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    system: [
      {
        type: "text",
        text: `${config.discoveryRole} The user will describe their ideal customer profile (ICP). ${sellerContext} ${strictFilters}

STRICT RULES:
- ONLY suggest real organizations that genuinely match the ICP description.
- If the ICP specifies verticals (e.g., SLED, government, healthcare), EVERY suggestion must be in that vertical. Do NOT suggest companies outside the specified verticals.
- If territory/states are specified, ONLY suggest companies headquartered in those regions.
- Quality over quantity — suggest fewer if needed rather than irrelevant matches.

Return ONLY a valid JSON array of up to 8 real companies that match ALL criteria. For each: "name" (string), "domain" (string), "industry" (string), "employees" (estimated number), "reasons" (array of 2-3 short strings explaining why they match). Only suggest companies you are confident actually exist. No markdown, no code fences, just the JSON array.`,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: `Find companies matching this ICP: ${icp}` }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "[]";

  let suggestions: any[];
  try {
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    suggestions = JSON.parse(cleaned);
  } catch {
    return NextResponse.json({ error: "Failed to parse suggestions" }, { status: 500 });
  }

  // Parse ICP for deterministic scoring
  let parsedIcp: ICPProfile | null = null;
  if (userData?.icpProfile) {
    try {
      parsedIcp = JSON.parse(userData.icpProfile as string);
    } catch { /* ignore */ }
  }

  // Step 2: Validate top suggestions via Wikipedia (verify they exist)
  const verified = await Promise.all(
    suggestions.slice(0, 8).map(async (s: any) => {
      const wiki = await fetchWikipediaInfo(s.name);
      let fitScore: number;
      if (parsedIcp) {
        const breakdown = scoreLead(
          {
            industry: s.industry || "",
            employees: s.employees || 0,
            funding: "",
            techStack: [],
            hq: wiki?.hq || "",
            revenueBand: "",
          },
          parsedIcp
        );
        fitScore = breakdown.total;
      } else {
        fitScore = calculateFitScore(s, icp);
      }
      return {
        ...s,
        verified: !!wiki,
        description: wiki?.description?.slice(0, 200) || null,
        hq: wiki?.hq || null,
        fitScore,
      };
    })
  );

  // Sort by fit score, filter to verified companies
  const results = verified
    .filter((v) => v.verified)
    .sort((a, b) => b.fitScore - a.fitScore);

  // If fewer than 3 verified, include unverified with lower confidence
  if (results.length < 3) {
    const unverified = verified
      .filter((v) => !v.verified)
      .map((v) => ({ ...v, fitScore: Math.max(v.fitScore - 15, 30) }));
    results.push(...unverified.slice(0, 5 - results.length));
  }

  return NextResponse.json(results);
}

function calculateFitScore(suggestion: any, icp: string): number {
  let score = 60; // base

  const icpLower = icp.toLowerCase();
  const reasons = (suggestion.reasons || []).join(" ").toLowerCase();

  // Boost for specific matching criteria
  if (icpLower.includes("cloud") && reasons.includes("cloud")) score += 10;
  if (icpLower.includes("series") && reasons.includes("series")) score += 10;
  if (suggestion.employees > 200 && suggestion.employees < 5000) score += 5;
  if (reasons.includes("compliance") || reasons.includes("regulation")) score += 10;

  // Boost when ICP keywords match reasons
  const icpWords = icpLower.split(/\s+/).filter((w: string) => w.length > 4);
  for (const word of icpWords) {
    if (reasons.includes(word)) {
      score += 3;
    }
  }

  return Math.min(score, 95);
}
