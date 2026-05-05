import { anthropic } from "@/lib/anthropic";
import { fetchSECFilings } from "./data-sources/sec-edgar";
import { fetchWikipediaInfo } from "./data-sources/wikipedia";
import { findCVEsForTechStack } from "./data-sources/cisa-kev";
import { fetchCVEsByProduct } from "./data-sources/nvd-cve";
import { fetchCyberNews } from "./data-sources/news";
import { getCompanyLogoUrl } from "./data-sources/clearbit-logo";
import type { CompanyResearchPayload } from "./company-research";

export async function runResearchPipeline(
  query: string
): Promise<CompanyResearchPayload> {
  // Step 1: Fetch data from all sources in parallel
  const [wikiInfo, secFilings, news] = await Promise.all([
    fetchWikipediaInfo(query),
    fetchSECFilings(query),
    fetchCyberNews(query),
  ]);

  // Infer domain from query
  const domain = inferDomain(query);
  const logoUrl = getCompanyLogoUrl(domain);

  // Step 2: If we found tech stack hints from wiki, get CVE data
  const inferredTechStack = inferTechStack(wikiInfo?.description || "", query);
  const [cisaVulns, nvdVulns] = await Promise.all([
    findCVEsForTechStack(inferredTechStack),
    inferredTechStack.length > 0
      ? fetchCVEsByProduct(inferredTechStack[0])
      : Promise.resolve([]),
  ]);

  // Step 3: Send all raw data to Claude for structured synthesis
  const rawData = {
    query,
    wikipedia: wikiInfo,
    secFilings: secFilings.slice(0, 5),
    news: news.slice(0, 6),
    cisaVulnerabilities: cisaVulns.slice(0, 5),
    nvdVulnerabilities: nvdVulns.slice(0, 5),
    inferredTechStack,
    logoUrl,
    domain,
  };

  const payload = await synthesizeWithClaude(rawData);
  return payload;
}

async function synthesizeWithClaude(rawData: any): Promise<CompanyResearchPayload> {
  const systemPrompt = `You are a cybersecurity sales intelligence analyst. Given raw data about a company from SEC filings, Wikipedia, CVE databases, and news, produce a structured JSON analysis.

Return ONLY valid JSON matching this exact TypeScript type (no markdown, no code fences):
{
  "company": string,
  "domain": string,
  "industry": string,
  "hq": string,
  "employees": number,
  "revenueBand": string,
  "techStack": string[],
  "funding": string,
  "fitScore": number (0-100, how good a fit for cybersecurity sales),
  "signals": [{ "type": string, "severity": "low"|"medium"|"high"|"critical", "source": string, "title": string, "body": string }],
  "contacts": [{ "name": string, "title": string, "email": string, "decisionMakerScore": number }]
}

Rules:
- For "contacts": infer likely titles (CISO, VP Security, CTO) but use placeholder emails like "contact@domain.com". Never fabricate real people's emails.
- For "signals": synthesize from the CVE data, news, SEC filings, and regulatory landscape. Each signal should be actionable for a cybersecurity salesperson.
- For "techStack": combine what you know about the company with the inferred tech. Be specific.
- For "fitScore": score based on company size, industry risk, tech exposure, and regulatory burden.
- For "revenueBand": use ranges like "$100M-$500M", "$1B+", etc.
- If data is limited, make reasonable inferences clearly labeled, but still return complete JSON.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
    messages: [
      {
        role: "user",
        content: `Research this company: "${rawData.query}"\n\nRaw data collected:\n${JSON.stringify(rawData, null, 2)}`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  try {
    // Try to parse the response as JSON
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    // Fallback if Claude doesn't return valid JSON
    return {
      company: rawData.query,
      domain: rawData.domain,
      industry: "Unknown",
      hq: rawData.wikipedia?.hq || "Unknown",
      employees: rawData.wikipedia?.employees || 0,
      revenueBand: "Unknown",
      techStack: rawData.inferredTechStack,
      funding: "Unknown",
      fitScore: 50,
      signals: rawData.news?.slice(0, 3).map((n: any) => ({
        type: "news",
        severity: "medium" as const,
        source: n.source || "Google News",
        title: n.title,
        body: n.title,
      })) || [],
      contacts: [],
    };
  }
}

function inferDomain(query: string): string {
  // Simple heuristic: lowercase, remove spaces, add .com
  const cleaned = query.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${cleaned}.com`;
}

function inferTechStack(description: string, company: string): string[] {
  const techKeywords = [
    "AWS", "Azure", "GCP", "Kubernetes", "Docker", "Salesforce",
    "SAP", "Oracle", "Microsoft 365", "Okta", "CrowdStrike",
    "Palo Alto", "Cisco", "VMware", "Snowflake", "Splunk",
    "Cloudflare", "Datadog", "MongoDB", "PostgreSQL", "Redis",
  ];

  const found: string[] = [];
  const text = `${description} ${company}`.toLowerCase();

  for (const tech of techKeywords) {
    if (text.includes(tech.toLowerCase())) {
      found.push(tech);
    }
  }

  // If nothing found, infer common enterprise stack
  if (found.length === 0) {
    return ["Microsoft 365", "Active Directory"];
  }

  return found;
}
