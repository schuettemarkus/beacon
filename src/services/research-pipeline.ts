import { anthropic } from "@/lib/anthropic";
import { prisma } from "@/lib/db";
import { fetchSECFilings } from "./data-sources/sec-edgar";
import { fetchWikipediaInfo } from "./data-sources/wikipedia";
import { findCVEsForTechStack } from "./data-sources/cisa-kev";
import { fetchCVEsByProduct } from "./data-sources/nvd-cve";
import { fetchIndustryNews } from "./data-sources/news";
import { getCompanyLogoUrl } from "./data-sources/clearbit-logo";
import { getIndustryConfig } from "@/config/industries";
import type { CompanyResearchPayload } from "./company-research";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface SellerContext {
  company: string;
  products: string[];
  valueProps: string;
  territory?: { type: string; states?: string[]; description?: string };
}

export async function runResearchPipeline(
  query: string,
  userId?: string,
  industry: string = "cybersecurity",
  sellerProfile?: SellerContext,
  icpProfile?: any
): Promise<CompanyResearchPayload> {
  const config = getIndustryConfig(industry);

  // Check cache: reuse recent research for the same query
  if (userId) {
    const cached = await prisma.researchRun.findFirst({
      where: {
        userId,
        query: { equals: query },
        createdAt: { gte: new Date(Date.now() - CACHE_TTL_MS) },
      },
      orderBy: { createdAt: "desc" },
    });

    if (cached) {
      try {
        return JSON.parse(cached.payload);
      } catch {
        // Corrupted cache, continue with fresh research
      }
    }
  }

  // Step 1: Fetch data from all sources in parallel
  const [wikiInfo, secFilings, news] = await Promise.all([
    fetchWikipediaInfo(query),
    fetchSECFilings(query),
    fetchIndustryNews(query, config.newsKeywords),
  ]);

  // Infer domain from query
  const domain = inferDomain(query);
  const logoUrl = getCompanyLogoUrl(domain);

  // Step 2: Get CVE data based on inferred tech stack (only for industries that use vuln sources)
  const inferredTechStack = inferTechStack(wikiInfo?.description || "", query);
  const [cisaVulns, nvdVulns] = config.useVulnSources
    ? await Promise.all([
        findCVEsForTechStack(inferredTechStack),
        inferredTechStack.length > 0
          ? fetchCVEsByProduct(inferredTechStack[0])
          : Promise.resolve([]),
      ])
    : [[], []];

  // Step 3: Send all raw data to Claude for structured synthesis
  const rawData: Record<string, any> = {
    query,
    wikipedia: wikiInfo,
    secFilings: secFilings.slice(0, 5),
    news: news.slice(0, 8),
    cisaVulnerabilities: cisaVulns.slice(0, 8),
    nvdVulnerabilities: nvdVulns.slice(0, 5),
    inferredTechStack,
    logoUrl,
    domain,
    industryContext: config.displayName,
    newsKeywords: config.newsKeywords,
    industry,
    analystRole: config.analystRole,
    signalTypes: config.signalTypes,
    typicalBuyerTitles: config.typicalBuyerTitles,
    keyRegulations: config.keyRegulations,
  };

  if (sellerProfile) {
    rawData.sellerContext = {
      company: sellerProfile.company,
      products: sellerProfile.products,
      valueProps: sellerProfile.valueProps,
      territory: sellerProfile.territory,
    };
  }

  rawData.icpContext = icpProfile ? {
    buyerTitles: icpProfile.buyerTitles,
    verticals: icpProfile.verticals,
    geoTargets: icpProfile.geoTargets,
    accountType: icpProfile.accountType,
  } : null;

  const payload = await synthesizeWithClaude(rawData);
  payload.logoUrl = logoUrl;
  return payload;
}

async function synthesizeWithClaude(
  rawData: any
): Promise<CompanyResearchPayload> {
  const signalTypesStr = (rawData.signalTypes || []).map((s: string) => `"${s}"`).join("|");
  const buyerTitlesStr = (rawData.typicalBuyerTitles || []).join(", ");
  const regulationsStr = (rawData.keyRegulations || []).join(", ");
  const industryDisplay = rawData.industryContext || "Cybersecurity";

  const sellerCtx = rawData.sellerContext;
  const sellerInsert = sellerCtx
    ? `\nYou are researching this company on behalf of a salesperson at ${sellerCtx.company} who sells ${(sellerCtx.products || []).join(", ")}. Highlight how their solutions (${sellerCtx.valueProps}) would solve problems for this company. When inferring contacts, prioritize titles matching the seller's target buyers.`
    : "";

  const icpContext = rawData.icpContext;
  let icpInsert = "";
  if (icpContext?.buyerTitles?.length) {
    icpInsert += `\nWhen inferring contacts, ONLY suggest people with these titles: ${icpContext.buyerTitles.join(", ")}. Do NOT suggest other titles.`;
  }
  if (icpContext?.verticals?.length) {
    icpInsert += `\nThis company is being evaluated for the ${icpContext.verticals.join(", ")} vertical. Focus signals and regulatory analysis on this sector.`;
  }

  const systemPrompt = `You are a ${rawData.analystRole || "cybersecurity sales intelligence analyst"}.${sellerInsert}${icpInsert} Given raw data about a company from SEC filings, Wikipedia, vulnerability databases, and news, produce a detailed structured JSON analysis.

CRITICAL: If the raw data is sparse or missing, use your own knowledge about this company. You know about most major companies — their HQ, employee count, industry, revenue, tech stack, etc. Fill in what you know confidently. Do NOT return "Unknown" for well-known companies.

Return ONLY valid JSON matching this TypeScript type (no markdown, no code fences):
{
  "company": string,
  "domain": string,
  "industry": string,
  "hq": string,
  "employees": number,
  "revenueBand": string (e.g. "$100M-$500M", "$1B+"),
  "techStack": string[] (be specific — include cloud providers, security tools, SaaS platforms, databases),
  "funding": string,
  "fitScore": number (0-100),
  "overview": string (2-3 paragraph executive overview of this company — include recent major events, security posture, key initiatives, leadership, and why a salesperson should care. Write in a direct, conversational tone. Include specific facts, dates, and dollar amounts when available. This should read like a knowledgeable colleague briefing you, not like a corporate summary.),
  "signals": [{
    "type": ${signalTypesStr || '"regulatory"|"peer_breach"|"industry_breach"|"tech_vuln"|"hiring"|"funding"|"ma"|"compliance_audit"|"news"'},
    "severity": "low"|"medium"|"high"|"critical",
    "source": string (the news outlet or source name — e.g. "Reuters", "SC Magazine", "CISA KEV", "NVD", "SEC EDGAR"),
    "sourceUrl": string (copy the EXACT link/URL from the raw news data for news-based signals. For CVE signals use https://nvd.nist.gov/vuln/detail/{CVE-ID}. For CISA use https://www.cisa.gov/known-exploited-vulnerabilities-catalog. For SEC use the SEC EDGAR URL. NEVER make up a URL — if no real URL exists, use "https://${rawData.domain}"),
    "title": string (specific headline: include the company name, dates, dollar amounts, or affected systems. Example: "Nevada DMV hit by 28-day ransomware attack in August 2025" not "Recent cyber incident"),
    "body": string (5-8 sentences of rich detail: What specifically happened? When exactly (month/year)? What was the financial or operational impact? Who was affected (employees, citizens, patients)? What systems or data were compromised? What was the response? Why does this create a selling opportunity for the AM's products? Be a journalist, not a summarizer — every sentence should add new information)
  }],
  "contacts": [] (ALWAYS return an empty array — contacts are sourced from verified databases, not generated),
  "regulatoryProfile": [{
    "regulation": string (e.g. ${regulationsStr || "HIPAA, PCI DSS 4.0, SOX, GDPR, NIS2, DORA, CMMC 2.0"}),
    "status": string (e.g. "Applicable", "Likely applicable", "Under review"),
    "deadline": string or null (e.g. "2025-04-01"),
    "relevance": string (1 sentence on why this matters for a ${industryDisplay} sale)
  }],
  "recentNews": [{
    "title": string,
    "source": string,
    "url": string (use actual URLs from the news data provided, or construct plausible source URLs),
    "date": string (ISO date or approximate)
  }],
  "peerComparison": [{
    "company": string (3-5 real peer companies in the same industry/size),
    "industry": string,
    "employees": number (estimated),
    "fitScore": number (0-100, estimated)
  }]
}

IMPORTANT RULES:
- Every signal MUST have a real, clickable sourceUrl. Use URLs from the raw data when available.
- For CVE signals, use https://nvd.nist.gov/vuln/detail/{CVE-ID}
- For CISA KEV signals, use https://www.cisa.gov/known-exploited-vulnerabilities-catalog
- For SEC signals, use https://www.sec.gov/cgi-bin/browse-edgar?company={company}&CIK=&type=10-K&dateb=&owner=include&count=10&search_text=&action=getcompany
- For news signals, use the actual article URLs from the raw data
- Generate 8-12 detailed signals that a ${industryDisplay} salesperson would find actionable
- Each signal body should be 4-6 sentences with specific facts, dates, and impact — not generic summaries
- ONLY use real URLs from the raw data for sourceUrl. If no real URL exists for a signal, use the company's domain URL as a fallback
- Include at least 3 regulatory items relevant to the company's industry
- The peer comparison should include real, well-known companies
- Be thorough but factual. Mark inferences clearly.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 6000,
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
        content: `Research this company: "${rawData.query}"\n\nRaw data collected:\n${JSON.stringify(rawData, null, 2)}`,
      },
    ],
  });

  if (response.stop_reason === "max_tokens") {
    console.warn("Claude response truncated (hit max_tokens) for query:", rawData.query);
  }

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  try {
    let cleaned = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Try to extract JSON object if there's surrounding text
    if (!cleaned.startsWith("{")) {
      const jsonStart = cleaned.indexOf("{");
      const jsonEnd = cleaned.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleaned = cleaned.slice(jsonStart, jsonEnd + 1);
      }
    }

    const parsed = JSON.parse(cleaned);

    // Post-process signals: validate URLs against real data sources
    if (parsed.signals?.length) {
      // Build lookup of real URLs from raw data
      const realNewsUrls = (rawData.news || []).map((n: any) => ({
        title: (n.title || "").toLowerCase(),
        link: n.link,
        source: n.source,
      }));
      const realCveUrls = (rawData.cisaVulnerabilities || []).concat(rawData.nvdVulnerabilities || [])
        .filter((v: any) => v.cveId || v.id)
        .map((v: any) => ({
          id: (v.cveId || v.id || "").toLowerCase(),
          link: `https://nvd.nist.gov/vuln/detail/${v.cveId || v.id}`,
        }));

      parsed.signals = parsed.signals.map((signal: any) => {
        const titleLower = (signal.title || "").toLowerCase();
        const bodyLower = (signal.body || "").toLowerCase();

        // Try to match to a real news URL by title similarity
        const newsMatch = realNewsUrls.find((n: any) =>
          titleLower.includes(n.title.slice(0, 30)) ||
          n.title.includes(titleLower.slice(0, 30))
        );
        if (newsMatch?.link) {
          signal.sourceUrl = newsMatch.link;
          signal.source = newsMatch.source || signal.source;
        }

        // Try to match CVE signals to real NVD URLs
        if (signal.type === "tech_vuln") {
          const cveMatch = realCveUrls.find((c: any) =>
            titleLower.includes(c.id) || bodyLower.includes(c.id)
          );
          if (cveMatch) signal.sourceUrl = cveMatch.link;
        }

        // Validate URL: must start with http
        if (signal.sourceUrl && !signal.sourceUrl.startsWith("http")) {
          signal.sourceUrl = `https://${rawData.domain}`;
        }

        // If no source URL at all, use company domain
        if (!signal.sourceUrl) {
          signal.sourceUrl = `https://${rawData.domain}`;
        }

        return signal;
      });
    }

    return parsed;
  } catch (parseError) {
    console.error("Claude JSON parse failed, raw text:", text.slice(0, 200));
    return {
      company: rawData.query,
      domain: rawData.domain,
      industry: rawData.wikipedia?.description?.match(/is (?:a|an) ([^.]+)/i)?.[1] || "Unknown",
      hq: rawData.wikipedia?.hq || "Unknown",
      employees: rawData.wikipedia?.employees || 0,
      revenueBand: "Unknown",
      techStack: rawData.inferredTechStack,
      funding: "Unknown",
      fitScore: 50,
      signals:
        rawData.news?.slice(0, 3).map((n: any) => ({
          type: "news",
          severity: "medium" as const,
          source: n.source || "Google News",
          sourceUrl: n.link || "",
          title: n.title,
          body: n.title,
        })) || [],
      contacts: [],
    };
  }
}

function inferDomain(query: string): string {
  const cleaned = query.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${cleaned}.com`;
}

function inferTechStack(description: string, company: string): string[] {
  const techKeywords = [
    "AWS", "Azure", "GCP", "Kubernetes", "Docker", "Salesforce",
    "SAP", "Oracle", "Microsoft 365", "Okta", "CrowdStrike",
    "Palo Alto", "Cisco", "VMware", "Snowflake", "Splunk",
    "Cloudflare", "Datadog", "MongoDB", "PostgreSQL", "Redis",
    "Fortinet", "SentinelOne", "Zscaler", "Wiz", "Tanium",
  ];

  const found: string[] = [];
  const text = `${description} ${company}`.toLowerCase();

  for (const tech of techKeywords) {
    if (text.includes(tech.toLowerCase())) {
      found.push(tech);
    }
  }

  if (found.length === 0) {
    return ["Microsoft 365", "Active Directory"];
  }

  return found;
}
