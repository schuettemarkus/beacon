import type { Metadata } from "next";
import Link from "next/link";
import { BeaconLogo } from "@/components/layout/beacon-logo";
import { InfoPageFooter } from "@/components/layout/info-page-footer";

export const metadata: Metadata = {
  title: "FAQ — Beacon",
  description: "Frequently asked questions about Beacon.",
};

const faqs = [
  {
    question: "What data sources does Beacon use?",
    answer:
      "Beacon pulls from multiple public data sources during research: SEC EDGAR for financial filings and cybersecurity disclosures, Wikipedia/Wikidata for company overviews, CISA KEV for known exploited vulnerabilities, NIST NVD for broader CVE data, and Google News RSS for recent cybersecurity news. Company logos come from Clearbit. All AI synthesis, email generation, and chat are powered by Anthropic Claude Sonnet.",
  },
  {
    question: "Is my data private?",
    answer:
      "Yes. Your account data (leads, contacts, emails, research, chat threads) is stored securely in a Turso database in the US region. We do not sell or share your data with third parties. Authentication uses bcrypt-hashed passwords and httpOnly session cookies. The only third-party AI processing is through Anthropic Claude, which processes research queries and generates email drafts.",
  },
  {
    question: "How does the fit score work?",
    answer:
      "The fit score is a deterministic 0-100 score based on six weighted factors from your Ideal Customer Profile (ICP): industry match, company size, funding/revenue stage, technology stack overlap, signal strength, and geographic fit. You configure the target values and weights in Settings, and every lead is scored against those criteria. The score updates automatically when you save research to your inbox.",
  },
  {
    question: "Can I send emails directly from Beacon?",
    answer:
      "Beacon generates personalized email drafts based on your research data, but it doesn't send emails directly. Instead, you can copy the email text to your clipboard, or open it directly in Gmail or Outlook with one click. You can also regenerate drafts with different tones or angles using Claude.",
  },
  {
    question: "What is a cadence?",
    answer:
      "A cadence is a multi-step outreach sequence you build in Beacon. Each step defines the type of touch (e.g., initial email, follow-up, check-in), the delay between steps, and optional notes. You enroll leads into cadences and Beacon tracks where each lead is in the sequence, logging all activity along the way.",
  },
  {
    question: "How do signals work?",
    answer:
      "Signals are real-time events that indicate a prospect may need cybersecurity solutions. Beacon runs daily scans of CISA KEV (newly exploited vulnerabilities) and NIST NVD (new CVEs), and monitors Google News for breach reports and security incidents. When a signal matches a lead in your pipeline, it surfaces on the Discover tab and can boost the lead's fit score.",
  },
  {
    question: "Is the contact data real?",
    answer:
      "Contact emails generated during research are inferred or placeholder values based on common corporate email patterns (e.g., firstname.lastname@company.com). They are not verified against real inboxes. Beacon never fabricates real people's email addresses. Always verify contact information through your own channels before sending outreach.",
  },
  {
    question: "What AI model powers Beacon?",
    answer:
      "Beacon uses Anthropic Claude Sonnet via the official @anthropic-ai/sdk. Claude handles research synthesis (combining data from multiple sources into structured profiles), email draft generation (personalized outreach based on research findings), the Co-Pilot chat (conversational research assistant), and lead discovery recommendations.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50/50">
      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center gap-3">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            <BeaconLogo size={40} />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground">
            Common questions about Beacon
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group rounded-lg border border-border/60 bg-white px-6 py-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <summary className="cursor-pointer select-none text-base font-semibold text-foreground list-none flex items-center justify-between gap-4">
                <span>{faq.question}</span>
                <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-45 text-xl leading-none">
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        <InfoPageFooter />
      </div>
    </div>
  );
}
