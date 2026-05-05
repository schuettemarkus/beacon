import type { Metadata } from "next";
import Link from "next/link";
import { BeaconLogo } from "@/components/layout/beacon-logo";
import { InfoPageFooter } from "@/components/layout/info-page-footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Beacon",
  description: "How Beacon collects, stores, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50/50">
      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center gap-3">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            <BeaconLogo size={40} />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            How we collect, store, and protect your data
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none prose-headings:tracking-tight">
          <p>
            <em>Last updated: May 2026</em>
          </p>
          <p>
            Beacon is committed to protecting your privacy. This policy explains
            what data we collect, how we use it, and your rights regarding your
            information.
          </p>

          <h2>Data We Collect</h2>
          <h3>Account Information</h3>
          <ul>
            <li>
              <strong>Name</strong> — used to personalize your experience
            </li>
            <li>
              <strong>Email address</strong> — used for login and account
              identification
            </li>
            <li>
              <strong>Password</strong> — hashed with bcrypt before storage; we
              never store or see your plain-text password
            </li>
          </ul>

          <h3>Application Data</h3>
          <p>
            When you use Beacon, we store the following data associated with your
            account:
          </p>
          <ul>
            <li>Leads and contact information you save</li>
            <li>Signal alerts and monitoring results</li>
            <li>Generated email drafts and templates</li>
            <li>Research runs and company profiles</li>
            <li>Co-Pilot chat threads and messages</li>
            <li>Cadence definitions and enrollment records</li>
            <li>Activity logs (actions taken on leads)</li>
            <li>ICP profile settings and fit scores</li>
            <li>Pipeline stage assignments</li>
          </ul>

          <h2>Third-Party Data Sources</h2>
          <p>
            During research, Beacon queries the following public data sources on
            your behalf:
          </p>
          <ul>
            <li>
              <strong>SEC EDGAR</strong> — Public company filings (free, US
              government data)
            </li>
            <li>
              <strong>Wikipedia / Wikidata</strong> — Public encyclopedia and
              knowledge base (free, open data)
            </li>
            <li>
              <strong>CISA KEV</strong> — Known exploited vulnerabilities (free,
              US government data)
            </li>
            <li>
              <strong>NVD / CVE</strong> — National Vulnerability Database (free,
              US government data)
            </li>
            <li>
              <strong>Google News RSS</strong> — Public news articles (free, public
              feeds)
            </li>
            <li>
              <strong>Clearbit</strong> — Company logos (free tier)
            </li>
            <li>
              <strong>Anthropic Claude</strong> — AI processing for research
              synthesis, email generation, chat, and recommendations. Your queries
              and research data are sent to Anthropic for processing.
            </li>
          </ul>

          <h2>Contact Data Disclaimer</h2>
          <p>
            Contact email addresses generated during the research process are{" "}
            <strong>inferred or placeholder values</strong> based on common
            corporate email patterns (e.g., firstname.lastname@company.com). These
            emails are <strong>not verified</strong> against real inboxes and
            should not be treated as confirmed contact information.
          </p>
          <p>
            Beacon never fabricates real people&apos;s email addresses. Always
            verify contact information through your own channels before sending
            outreach.
          </p>

          <h2>Data Storage</h2>
          <p>
            All application data is stored in a{" "}
            <strong>Turso (LibSQL) database</strong> hosted in the US region.
            Authentication uses httpOnly session cookies with a 7-day expiry.
            Passwords are hashed with bcrypt and never stored in plain text.
          </p>

          <h2>Data Sharing</h2>
          <p>
            <strong>We do not sell your data.</strong> Your data is not shared with
            third parties for marketing or advertising purposes. The only
            third-party data processing occurs through Anthropic Claude for AI
            features (research, email generation, chat).
          </p>

          <h2>Your Rights</h2>
          <ul>
            <li>
              <strong>Access</strong> — You can view all your data within the
              Beacon application at any time.
            </li>
            <li>
              <strong>Deletion</strong> — You can delete your account and all
              associated data. This is a permanent action that removes your
              profile, leads, contacts, emails, research, chat threads, cadences,
              and all activity history.
            </li>
            <li>
              <strong>Export</strong> — You can access your data through the
              application interface.
            </li>
          </ul>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Any changes will
            be reflected on this page with an updated &quot;Last updated&quot;
            date.
          </p>

          <h2>Questions</h2>
          <p>
            If you have questions about this privacy policy or how your data is
            handled, please reach out through the app&apos;s feedback channel.
          </p>
        </div>

        <InfoPageFooter />
      </div>
    </div>
  );
}
