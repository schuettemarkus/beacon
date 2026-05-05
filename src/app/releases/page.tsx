import type { Metadata } from "next";
import Link from "next/link";
import { BeaconLogo } from "@/components/layout/beacon-logo";
import { InfoPageFooter } from "@/components/layout/info-page-footer";

export const metadata: Metadata = {
  title: "Releases — Beacon",
  description: "Feature release changelog for Beacon.",
};

const releases = [
  {
    sprint: 6,
    title: "ICP Scoring",
    date: "May 2026",
    features: [
      "Editable Ideal Customer Profile with 6 configurable factors",
      "Deterministic scoring engine: industry, size, funding, tech, signals, geo",
      "Fit score breakdown showing individual factor contributions",
      "Letter grades (A through F) for quick prospect assessment",
      "Auto-score on research save — leads are scored as they enter the inbox",
    ],
  },
  {
    sprint: 5,
    title: "Cadences",
    date: "May 2026",
    features: [
      "Real cadence builder with multi-step outreach sequences",
      "Configurable step types, delays, and notes",
      "Lead enrollment into cadences with progress tracking",
      "Activity timeline showing all interactions per lead",
      "Notes on leads for team context and follow-up reminders",
    ],
  },
  {
    sprint: 4,
    title: "Lead Actions",
    date: "May 2026",
    features: [
      "Working snooze, archive, and email action buttons",
      "Toast notifications with undo support",
      "Email actions: copy to clipboard, open in Gmail, open in Outlook",
      "Regenerate email drafts with Claude for different angles",
      "Activity logging for all lead interactions",
    ],
  },
  {
    sprint: 3,
    title: "Intelligence",
    date: "May 2026",
    features: [
      "Signal monitoring with daily CISA KEV and NVD vulnerability scans",
      "Claude-powered lead discovery and AI recommendations",
      "Real analytics dashboard with pipeline metrics",
      "Persistent Kanban pipeline board for deal tracking",
    ],
  },
  {
    sprint: 2,
    title: "Real Data",
    date: "May 2026",
    features: [
      "Claude-powered research pipeline with multi-source synthesis",
      "SEC EDGAR integration for financial filings and risk factors",
      "Wikipedia/Wikidata integration for company profiles",
      "CISA KEV and NVD integration for vulnerability intelligence",
      "Google News RSS integration for cybersecurity news monitoring",
      "Save to Inbox with auto-generated personalized email drafts",
      "Streaming Co-Pilot chat for conversational research",
    ],
  },
  {
    sprint: 1,
    title: "Foundation",
    date: "May 2026",
    features: [
      "Vercel hosting with auto-deploy from GitHub",
      "Turso (LibSQL) database with Prisma ORM",
      "Server-side authentication with bcrypt and httpOnly cookies",
      "Leads CRUD API with full create/read/update/delete",
      "Base application shell with sidebar navigation",
    ],
  },
];

export default function ReleasesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50/50">
      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center gap-3">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            <BeaconLogo size={40} />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Releases
          </h1>
          <p className="text-muted-foreground">
            Feature changelog and sprint history
          </p>
        </div>

        {/* Timeline */}
        <div className="relative space-y-8">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border/60" />

          {releases.map((release) => (
            <div key={release.sprint} className="relative pl-12">
              {/* Dot */}
              <div className="absolute left-3 top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-white" />

              <div className="rounded-lg border border-border/60 bg-white p-6 shadow-sm">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    Sprint {release.sprint}: {release.title}
                  </h2>
                  <span className="shrink-0 text-sm text-muted-foreground">
                    {release.date}
                  </span>
                </div>
                <ul className="mt-4 space-y-2">
                  {release.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <InfoPageFooter />
      </div>
    </div>
  );
}
