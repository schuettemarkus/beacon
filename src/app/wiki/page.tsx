import type { Metadata } from "next";
import Link from "next/link";
import { BeaconLogo } from "@/components/layout/beacon-logo";
import { InfoPageFooter } from "@/components/layout/info-page-footer";

export const metadata: Metadata = {
  title: "Wiki — Beacon",
  description: "Product documentation and how Beacon works.",
};

export default function WikiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50/50">
      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center gap-3">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            <BeaconLogo size={40} />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Beacon Wiki
          </h1>
          <p className="text-muted-foreground">
            Product documentation and reference guide
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none prose-headings:tracking-tight prose-a:text-primary">
          <section className="mb-12">
            <h2>What is Beacon?</h2>
            <p>
              Beacon is an intelligent outbound sales platform built for cybersecurity vendors.
              It combines real-time threat intelligence, public company data, and AI-powered
              research to help sales teams identify, score, and engage the right prospects at
              the right time.
            </p>
            <p>
              Rather than relying on stale contact databases, Beacon synthesizes live data from
              SEC filings, vulnerability databases, and news sources to build rich prospect
              profiles and generate personalized outreach.
            </p>
          </section>

          <section className="mb-12">
            <h2>How It Works</h2>
            <p>Beacon follows a three-stage workflow:</p>

            <h3>1. Research</h3>
            <p>
              Enter a company name and Beacon kicks off a Claude-powered research pipeline. It
              pulls data from multiple public sources simultaneously:
            </p>
            <ul>
              <li><strong>SEC EDGAR</strong> — 10-K/10-Q filings for financials, risk factors, and cybersecurity disclosures</li>
              <li><strong>Wikipedia / Wikidata</strong> — Company overview, industry, headquarters, employee count</li>
              <li><strong>CISA KEV</strong> — Known exploited vulnerabilities affecting the company&apos;s technology stack</li>
              <li><strong>NVD / CVE</strong> — Broader vulnerability data from NIST&apos;s National Vulnerability Database</li>
              <li><strong>Google News RSS</strong> — Recent cybersecurity news and incidents</li>
            </ul>
            <p>
              Claude Sonnet synthesizes all of this into a structured company profile with an
              executive summary, key findings, and actionable talking points.
            </p>

            <h3>2. Score</h3>
            <p>
              Each researched company is scored against your Ideal Customer Profile (ICP) using
              a deterministic 6-factor scoring engine. The fit score (0-100) tells you at a
              glance how well a prospect matches what you&apos;re looking for.
            </p>

            <h3>3. Outreach</h3>
            <p>
              Save a lead to your inbox and Beacon auto-generates personalized email drafts
              using the research data. Build multi-step cadences, enroll leads, and track
              activity over time.
            </p>
          </section>

          <section className="mb-12">
            <h2>Key Concepts</h2>

            <h3>Ideal Customer Profile (ICP)</h3>
            <p>
              Your ICP defines the perfect prospect. Beacon lets you configure six weighted
              factors: target industries, company size range, funding stage, technology stack,
              signal types, and geographic preferences. The scoring engine uses these weights
              to rank every lead.
            </p>

            <h3>Fit Score</h3>
            <p>
              A 0-100 score computed deterministically from your ICP settings. The six factors
              are: <strong>industry match</strong>, <strong>company size</strong>,{" "}
              <strong>funding/revenue</strong>, <strong>technology overlap</strong>,{" "}
              <strong>signal strength</strong>, and <strong>geographic fit</strong>. Each
              factor is individually weighted and combined into a final score with a letter
              grade (A through F).
            </p>

            <h3>Signals</h3>
            <p>
              Signals are real-time events that indicate a prospect may be in-market for
              cybersecurity solutions. Beacon monitors CISA KEV and NVD daily to detect new
              vulnerabilities, and scans Google News for breach reports, compliance changes,
              and security incidents.
            </p>

            <h3>Cadences</h3>
            <p>
              A cadence is a multi-step outreach sequence. Define the steps (email, follow-up,
              check-in), set delays between them, and enroll leads. Beacon tracks where each
              lead is in the cadence and logs all activity.
            </p>

            <h3>Threat Surface</h3>
            <p>
              The combination of known vulnerabilities (from CISA KEV and NVD) and recent
              security incidents that affect a prospect. A larger threat surface means more
              urgency and more relevant talking points for outreach.
            </p>
          </section>

          <section className="mb-12">
            <h2>Getting Started</h2>
            <ol>
              <li><strong>Create an account</strong> — Sign up with your name, email, and password.</li>
              <li><strong>Set your ICP</strong> — Go to Settings and configure your ideal customer profile with target industries, company sizes, and other preferences.</li>
              <li><strong>Research a company</strong> — Use the Research tab to look up any company. Beacon pulls live data and generates a full profile.</li>
              <li><strong>Save to Inbox</strong> — Promising prospects get saved as leads with auto-generated email drafts.</li>
              <li><strong>Build cadences</strong> — Create outreach sequences and enroll leads to systematize your follow-up.</li>
              <li><strong>Monitor signals</strong> — Check the Discover tab for AI-recommended leads and the latest threat signals.</li>
              <li><strong>Track in Pipeline</strong> — Use the Kanban board to move leads through your sales pipeline stages.</li>
            </ol>
          </section>
        </div>

        <InfoPageFooter />
      </div>
    </div>
  );
}
