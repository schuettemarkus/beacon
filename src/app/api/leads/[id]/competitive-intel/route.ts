import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { anthropic } from "@/lib/anthropic";
import { getIndustryConfig } from "@/config/industries";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const lead = await prisma.lead.findFirst({
    where: { id, userId: user.id },
  });

  if (!lead)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { sellerProfile: true },
  });

  const config = getIndustryConfig(user.industry);
  const techStack = JSON.parse(lead.techStack);

  let sellerContext = "";
  if (userData?.sellerProfile) {
    try {
      const sp = JSON.parse(userData.sellerProfile as string);
      const parts: string[] = [];
      if (sp.company) parts.push(`Seller company: ${sp.company}.`);
      if (sp.products?.length)
        parts.push(`Products/services: ${sp.products.join(", ")}.`);
      if (sp.valueProps?.length)
        parts.push(`Key value propositions: ${sp.valueProps.join("; ")}.`);
      if (parts.length) sellerContext = parts.join(" ");
    } catch {}
  }

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2500,
    system: [
      {
        type: "text",
        text: `You are a ${config.analystRole} specializing in competitive intelligence for sales teams.

${sellerContext}

Analyze the prospect's tech stack and industry to identify likely incumbent vendors that the seller would need to displace. For each competitor, provide actionable intelligence including weaknesses relative to the seller's offering and a talk track the account manager can use on a call.

Return ONLY valid JSON matching this schema (no markdown, no code fences):
{
  "competitors": [
    {
      "name": "string",
      "category": "string (e.g. Endpoint Security, SIEM, etc.)",
      "strengths": ["string"],
      "weaknesses": ["string (relative to seller's product)"],
      "talkTrack": "string (2-3 sentences the AM can say on a call to position against this competitor)"
    }
  ],
  "positioning": "string (2-3 sentence overall competitive positioning summary for the seller)"
}

Identify 2-4 likely incumbent vendors. Be specific and actionable.`,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Generate competitive intelligence for selling into this company:

Company: ${lead.company}
Domain: ${lead.domain}
Industry: ${lead.industry}
Employees: ${lead.employees || "Unknown"}
HQ: ${lead.hq || "Unknown"}
Tech Stack: ${techStack.join(", ")}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "{}";

  try {
    const cleaned = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const intel = JSON.parse(cleaned);
    return NextResponse.json(intel);
  } catch {
    return NextResponse.json(
      { error: "Failed to generate competitive intelligence" },
      { status: 500 }
    );
  }
}
