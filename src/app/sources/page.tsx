import type { Metadata } from "next";
import Link from "next/link";
import { BeaconLogo } from "@/components/layout/beacon-logo";
import { InfoPageFooter } from "@/components/layout/info-page-footer";

export const metadata: Metadata = {
  title: "Data Sources — Beacon",
  description: "Data sources and attribution for Beacon's research pipeline.",
};

const sources = [
  {
    name: "SEC EDGAR",
    url: "https://www.sec.gov/edgar",
    description:
      "US public company filings including 10-K and 10-Q reports. Beacon extracts financial data, risk factors, cybersecurity disclosures, and executive information from annual and quarterly filings.",
    dataProvided: "Financial statements, risk factors, cybersecurity disclosures, executive officers",
    cost: "Free",
    freshness: "Filings updated as companies submit (quarterly/annually)",
  },
  {
    name: "Wikipedia / Wikidata",
    url: "https://www.wikipedia.org",
    description:
      "Open-source encyclopedia and structured knowledge base. Beacon pulls company overviews, industry classification, founding year, headquarters location, and employee counts.",
    dataProvided: "Company overview, industry, headquarters, employee count, founding date",
    cost: "Free",
    freshness: "Community-maintained, generally current for public companies",
  },
  {
    name: "CISA KEV",
    url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
    description:
      "The Cybersecurity and Infrastructure Security Agency's catalog of Known Exploited Vulnerabilities. Beacon scans this daily to detect active threats relevant to a prospect's technology stack.",
    dataProvided: "Actively exploited vulnerabilities with vendor, product, and remediation deadlines",
    cost: "Free",
    freshness: "Updated daily by CISA as new exploited vulnerabilities are confirmed",
  },
  {
    name: "NVD / CVE (NIST)",
    url: "https://nvd.nist.gov",
    description:
      "The National Vulnerability Database maintained by NIST. Provides comprehensive CVE data including severity scores (CVSS), affected products, and detailed descriptions.",
    dataProvided: "CVE records, CVSS severity scores, affected products, vulnerability descriptions",
    cost: "Free",
    freshness: "Updated continuously as new CVEs are published and analyzed",
  },
  {
    name: "Google News RSS",
    url: "https://news.google.com",
    description:
      "RSS feeds from Google News filtered for cybersecurity-related topics. Beacon monitors for breach reports, ransomware incidents, compliance changes, and security news mentioning target companies.",
    dataProvided: "Recent news headlines, publication dates, source outlets, article summaries",
    cost: "Free",
    freshness: "Real-time news aggregation",
  },
  {
    name: "Clearbit",
    url: "https://clearbit.com",
    description:
      "Business intelligence platform. Beacon uses Clearbit's logo API to display company logos throughout the interface for visual recognition.",
    dataProvided: "Company logos",
    cost: "Free tier (logo API)",
    freshness: "Logos cached and refreshed periodically",
  },
  {
    name: "Anthropic Claude Sonnet",
    url: "https://www.anthropic.com",
    description:
      "Large language model by Anthropic. Beacon uses Claude Sonnet for research synthesis (combining multi-source data into structured profiles), personalized email generation, the Co-Pilot chat assistant, and AI-powered lead discovery recommendations.",
    dataProvided: "AI synthesis, email drafts, conversational research, lead recommendations",
    cost: "Paid (API usage)",
    freshness: "Processing on-demand per research query",
  },
];

export default function SourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50/50">
      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center gap-3">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            <BeaconLogo size={40} />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Data Sources
          </h1>
          <p className="text-muted-foreground">
            Where Beacon gets its data and how it&apos;s used
          </p>
        </div>

        {/* Sources List */}
        <div className="space-y-6">
          {sources.map((source) => (
            <div
              key={source.name}
              className="rounded-lg border border-border/60 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-semibold text-foreground">
                  {source.name}
                </h2>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs font-medium text-primary hover:underline"
                >
                  Visit source &rarr;
                </a>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {source.description}
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    Data Provided
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {source.dataProvided}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    Cost
                  </p>
                  <p className="mt-1 text-sm text-foreground">{source.cost}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    Freshness
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {source.freshness}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <InfoPageFooter />
      </div>
    </div>
  );
}
