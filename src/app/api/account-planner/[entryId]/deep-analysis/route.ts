import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { anthropic } from "@/lib/anthropic";
import { getIndustryConfig } from "@/config/industries";
import { fetchWikipediaInfo } from "@/services/data-sources/wikipedia";
import { fetchSECFilings } from "@/services/data-sources/sec-edgar";
import { fetchIndustryNews } from "@/services/data-sources/news";
import { findCVEsForTechStack } from "@/services/data-sources/cisa-kev";
import { findContactsAtDomain } from "@/services/enrichment-service";

const TECH_KEYWORDS = [
  "AWS", "Azure", "GCP", "Kubernetes", "Docker", "Salesforce",
  "SAP", "Oracle", "Microsoft 365", "Okta", "CrowdStrike",
  "Palo Alto", "Cisco", "VMware", "Snowflake", "Splunk",
  "Cloudflare", "Datadog", "MongoDB", "PostgreSQL", "Redis",
  "Fortinet", "SentinelOne", "Zscaler", "Wiz", "Tanium",
];

function inferTechStack(description: string, company: string): string[] {
  const text = `${description} ${company}`.toLowerCase();
  const found = TECH_KEYWORDS.filter((t) => text.includes(t.toLowerCase()));
  return found.length > 0 ? found : ["Microsoft 365", "Active Directory"];
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ entryId: string }> }
) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { entryId } = await params;

  const entry = await (prisma as any).accountPlanEntry.findFirst({
    where: {
      id: entryId,
      accountPlan: { userId: user.id },
    },
    include: { accountPlan: true },
  });

  if (!entry)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const config = getIndustryConfig(user.industry);

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { sellerProfile: true, icpProfile: true },
  });

  let sellerContext = "";
  if (userData?.sellerProfile) {
    try {
      const sp = JSON.parse(userData.sellerProfile as string);
      const parts: string[] = [];
      if (sp.company) parts.push(`Seller company: ${sp.company}.`);
      if (sp.products?.length)
        parts.push(`Products/services: ${sp.products.join(", ")}.`);
      if (sp.valueProps?.length)
        parts.push(`Key value propositions: ${sp.valueProps}.`);
      if (parts.length) sellerContext = parts.join(" ");
    } catch {}
  }

  const [wikiInfo, secFilings, news, contacts] = await Promise.all([
    fetchWikipediaInfo(entry.company),
    fetchSECFilings(entry.company),
    fetchIndustryNews(entry.company, config.newsKeywords),
    findContactsAtDomain(entry.domain),
  ]);

  const inferredTechStack = inferTechStack(
    wikiInfo?.description || "",
    entry.company
  );

  const cisaVulns = config.useVulnSources
    ? await findCVEsForTechStack(inferredTechStack)
    : [];

  const rawData = {
    company: entry.company,
    domain: entry.domain,
    state: entry.state,
    wikipedia: wikiInfo,
    secFilings: secFilings.slice(0, 5),
    news: news.slice(0, 8),
    cisaVulnerabilities: cisaVulns.slice(0, 8),
    inferredTechStack,
    contacts: contacts.slice(0, 10),
  };

  const systemPrompt = `You are a ${config.analystRole}. Write in a natural, conversational tone — not like a generic AI response. Be direct and specific. The AM needs actionable intelligence, not corporate boilerplate.

${sellerContext}

Analyze this company and return ONLY valid JSON matching this schema (no markdown, no code fences):
{
  "annualReportTalkingPoints": ["string (5 key bullets the seller can use in conversation)"],
  "cyberBreaches": [{ "date": "string", "description": "string", "impact": "string" }],
  "itInitiatives": [{ "initiative": "string", "status": "string", "relevance": "string" }],
  "businessExpansions": ["string"],
  "acquisitions": [{ "target": "string", "date": "string", "relevance": "string" }],
  "vendorIntel": {
    "itVendors": ["string"],
    "cyberVendors": ["string"],
    "detectionSource": "string (how you inferred these vendors)"
  },
  "leadershipChanges": [{ "name": "string", "fromRole": "string", "toRole": "string", "date": "string", "significance": "string" }],
  "winStrategy": {
    "approach": "string",
    "keyMessages": ["string"],
    "timingConsiderations": "string",
    "riskFactors": ["string"]
  }
}

RULES:
- annualReportTalkingPoints: exactly 5 bullets grounded in SEC filings or public financials
- cyberBreaches: only include incidents from the past 2 years with real dates
- leadershipChanges: only past 12 months
- vendorIntel: be specific about known IT and cybersecurity vendors, cite how you know
- winStrategy: tailor to the seller's products and value props
- If data is sparse, use your knowledge of the company. Don't return empty arrays for well-known companies.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Deep analysis for: ${entry.company} (${entry.domain})\n\nRaw intelligence:\n${JSON.stringify(rawData, null, 2)}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "{}";

  let analysis;
  try {
    let cleaned = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    if (!cleaned.startsWith("{")) {
      const jsonStart = cleaned.indexOf("{");
      const jsonEnd = cleaned.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleaned = cleaned.slice(jsonStart, jsonEnd + 1);
      }
    }

    analysis = JSON.parse(cleaned);
  } catch {
    return NextResponse.json(
      { error: "Failed to parse analysis" },
      { status: 500 }
    );
  }

  await (prisma as any).accountPlanEntry.update({
    where: { id: entryId },
    data: {
      deepAnalysis: JSON.stringify(analysis),
      status: "researched",
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(analysis);
}
