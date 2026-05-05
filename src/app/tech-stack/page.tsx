import type { Metadata } from "next";
import Link from "next/link";
import { BeaconLogo } from "@/components/layout/beacon-logo";
import { InfoPageFooter } from "@/components/layout/info-page-footer";

export const metadata: Metadata = {
  title: "Tech Stack — Beacon",
  description: "Technical architecture and technologies powering Beacon.",
};

const categories = [
  {
    title: "Framework",
    items: [
      { name: "Next.js 16", detail: "App Router with React Server Components" },
      { name: "React 19", detail: "Latest stable with concurrent features" },
      { name: "TypeScript", detail: "Strict mode, end-to-end type safety" },
    ],
  },
  {
    title: "Styling & UI",
    items: [
      { name: "Tailwind CSS 4", detail: "Utility-first CSS framework" },
      { name: "shadcn/ui", detail: "Accessible component primitives" },
      { name: "Framer Motion", detail: "Layout and micro-interaction animations" },
    ],
  },
  {
    title: "Database",
    items: [
      { name: "Turso", detail: "Edge-replicated LibSQL database" },
      { name: "Prisma 5.22", detail: "Type-safe ORM with migration support" },
    ],
  },
  {
    title: "AI",
    items: [
      {
        name: "Anthropic Claude Sonnet",
        detail: "Research synthesis, email generation, Co-Pilot chat, lead discovery — via @anthropic-ai/sdk",
      },
    ],
  },
  {
    title: "State Management",
    items: [
      { name: "TanStack React Query", detail: "Server state caching, mutations, and optimistic updates" },
      { name: "Zustand", detail: "Lightweight client state for UI preferences" },
    ],
  },
  {
    title: "Visualization",
    items: [
      { name: "Recharts", detail: "Composable chart components for the analytics dashboard" },
    ],
  },
  {
    title: "Authentication",
    items: [
      { name: "bcrypt", detail: "Password hashing with salt rounds" },
      { name: "Server-side cookie sessions", detail: "httpOnly, sameSite: lax, 7-day expiry" },
    ],
  },
  {
    title: "Hosting",
    items: [
      { name: "Vercel", detail: "Auto-deploy from GitHub on push to main" },
    ],
  },
  {
    title: "Data Sources",
    items: [
      { name: "SEC EDGAR", detail: "Public company filings (10-K, 10-Q)" },
      { name: "Wikipedia / Wikidata", detail: "Company overviews and structured data" },
      { name: "CISA KEV", detail: "Known exploited vulnerabilities catalog" },
      { name: "NVD / CVE", detail: "National Vulnerability Database" },
      { name: "Google News RSS", detail: "Cybersecurity news monitoring" },
      { name: "Clearbit", detail: "Company logo API" },
    ],
  },
];

export default function TechStackPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50/50">
      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center gap-3">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            <BeaconLogo size={40} />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Tech Stack
          </h1>
          <p className="text-muted-foreground">
            Technologies and architecture powering Beacon
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category.title}>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground/60">
                {category.title}
              </h2>
              <div className="space-y-3">
                {category.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-baseline gap-3 rounded-lg border border-border/60 bg-white px-5 py-3.5 shadow-sm"
                  >
                    <span className="font-medium text-foreground">
                      {item.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {item.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <InfoPageFooter />
      </div>
    </div>
  );
}
