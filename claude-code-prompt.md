# Claude Code Prompt — Build "Beacon"

## Role & Mission

You are a senior product engineer building **Beacon**, an AI-powered B2B lead-generation and outreach cockpit for cybersecurity sales teams. Target user: a founder, AE, or SDR selling SOC, MDR, pen-testing, vCISO, GRC, or SaaS security products into mid-market and enterprise. The promise: open the app in the morning, see a curated stack of high-fit prospects with everything needed to close — contact info, threat-relevance signals, talk tracks, and a ready-to-send email — and get to "hit reply" in under 60 seconds per lead.

The name **Beacon** carries the product's two jobs: a beacon *attracts* (the right accounts surface themselves) and a beacon *warns* (it points at real cybersecurity risk the buyer can't ignore). Lean into that duality in copy, empty states, and the loading animations (a soft pulsing beacon ring).

Build a production-quality web app. Treat this like a $100k engagement: pixel-precise, fast, accessible, mobile-first, and impressively polished. No placeholder lorem ipsum — the repo includes a fully realized seed data file (50 cybersecurity-buyer companies with realistic firmographics, 150 contacts, 300 real-context signals, and 100 pre-written email drafts referencing real CVEs, breaches, and regulations). Use that data on first load.

## Repository

- **GitHub remote**: `https://github.com/schuettemarkus/beacon`
- Initialize git, add the remote, push to `main` on first commit.
- Use Conventional Commits from commit one (`feat:`, `fix:`, `chore:`, `docs:`).
- Include `LICENSE` (MIT), `README.md`, `CONTRIBUTING.md`, `.gitignore`, `.env.example`.

## Automated Release Pipeline

Every release must be tagged and pushed to GitHub automatically. Use **release-please** (Google's tool — handles versioning, changelog, GitHub Releases via PRs):

1. Add `.github/workflows/release-please.yml` running on every push to `main`. The action opens a release PR; merging it cuts a tagged GitHub Release with a generated changelog.
2. Add `.github/workflows/release-build.yml` triggered on tag push (`v*`). It runs `pnpm build` (or `npm run build`) and uploads the Next.js standalone build output as a release asset.
3. Add `.github/workflows/ci.yml` for every PR: lint, typecheck, build.
4. Configure `release-please-config.json` for a `node` package release type.
5. The default `GITHUB_TOKEN` provided to Actions is sufficient — no extra secrets required for release-please.
6. Document the release flow in `README.md` so the user can run `gh auth login` once locally and let CI handle subsequent releases.

## Design Language — "Google Inbox, modernized"

Channel the original Google Inbox (2014–2019) — the grouped bundles, the swipe-to-action gestures, the floating compose FAB, the airy typography, the bright accent colors against pure white surfaces, the satisfying micro-animations.

- **Layout**: Three-pane on desktop (left rail nav, center inbox/list, right detail drawer). Single-pane stack on mobile with smooth back-stack transitions.
- **Type**: Inter or Geist Sans, generous line-height, large display weights for headlines.
- **Color**: White/near-white surfaces, deep ink text (`#1a1a1a`), one bold accent (electric indigo `#4F46E5`) for primary actions, semantic colors only for risk/score chips. Dark mode toggle that actually looks designed, not inverted.
- **Brand mark**: A simple concentric-ring beacon glyph that subtly pulses on idle screens and during loading states. Use it in the favicon, the splash, and the empty-inbox illustration.
- **Motion**: Framer Motion or equivalent — every list item animates in with a subtle stagger, drawers slide rather than pop, swipe-to-archive uses a real spring curve, FAB has a soft elevation lift on hover.
- **Density**: Roomy. Generous padding. Cards have a faint 1px border + soft shadow rather than heavy strokes.
- **Mobile**: Thumb-zone primary actions, bottom sheet drawers, swipe gestures (right = qualify, left = dismiss), pull-to-refresh, haptics where supported.

Accessibility: WCAG AA, full keyboard navigation, focus rings, prefers-reduced-motion respected.

## Tech Stack

- Next.js 14 (App Router) + TypeScript + pnpm
- Tailwind CSS + shadcn/ui as the component substrate, restyled to match the Inbox aesthetic
- Framer Motion for transitions
- Recharts for data viz
- Zustand for client state, TanStack Query for server state
- Prisma + SQLite for local persistence (swap-ready for Postgres)
- Mock LLM calls via a typed `aiService` layer (env-flag swap to OpenAI / Anthropic / Bedrock)
- Mock enrichment via a typed `enrichmentService` (Apollo / Clearbit / Hunter shape) seeded with realistic data
- Mock company-lookup via a typed `companyResearchService` (see Feature 11)

## The 11 Must-Have Features

**1. Smart Lead Inbox (the home screen).** Inbox-style grouped feed: "Today," "This Week," "Snoozed," "Closed-Won," "Archived." Each lead is a card showing company logo, name, industry, employee count, a colored **Fit Score** chip (0–100), a one-line **threat hook** ("Recent breach in adjacent vendor," "SOC 2 audit due Q3," "Hiring 4 security engineers"), and a quick-action row (Open · Email · Snooze · Archive). Bulk-select with a floating action bar.

**2. AI Lead Discovery Engine.** A "Find me leads" composer where the user describes their ICP in plain English ("Series B–D fintechs, US, no CISO yet, recent cloud migration"). The engine returns a ranked list with reasoning chips per lead explaining *why* it scored high. Saved searches become recurring "hunts" that auto-populate the inbox each morning.

**3. 360° Lead Detail Page.** Right-drawer (desktop) / full-page (mobile) with tabbed sections: **Overview** (firmographics, tech stack, funding), **Threat Surface** (CVE exposure inferred from tech stack, recent industry breaches, compliance gaps), **People** (3–5 buying-committee contacts with role, email, LinkedIn, mobile if available, and a "decision-maker likelihood" badge), **Signals** (job postings, news, GitHub activity, breach mentions), **Activity** (your touchpoints), **Notes**.

**4. AI-Drafted Outreach Sequences.** For each lead, generate three email variants — *Cold Intro*, *Threat-Anchored* (cites a specific signal), *Executive Brief* (CFO/CEO-grade) — each with subject line, preview text, and 80–120 word body. Show predicted open rate, predicted reply rate, and a tone slider (Direct / Consultative / Provocative) that regenerates in place. One-click "Send via Gmail" / "Copy" / "Open in Outlook." Include a 3-touch follow-up cadence preview.

**5. Threat-Relevance Engine.** Beacon's signature feature — for each lead, surface 3–5 cybersecurity-specific selling points, each backed by a citation or signal: ransomware activity in their vertical, a peer's recent breach, regulatory deadlines (HIPAA, PCI, NIS2, DORA, CMMC, NYDFS, NERC CIP), tech-stack vulnerabilities (real CVEs from CISA KEV), M&A-driven attack-surface expansion. This is what makes Beacon better than generic sales tools.

**6. Pipeline Analytics Dashboard.** Recharts-powered: weekly leads sourced (area chart), fit-score distribution (histogram), conversion funnel (Sourced → Contacted → Replied → Booked → Closed), reply-rate by email variant (bar), heatmap of best send times, leaderboard of top-performing talk tracks. Period selector top-right, exportable.

**7. Multi-Channel Cadence Builder.** Drag-and-drop sequence builder — Email → Wait 2d → LinkedIn DM → Wait 3d → Email → Wait 5d → Call. Per-step AI drafting. Real-time sequence-performance preview pulled from analogous past sequences.

**8. CRM-Lite Workspace.** Kanban deal board (New → Contacted → Engaged → Demo Booked → Proposal → Closed) with drag-and-drop, deal-value field, expected close date, and a side-rail of activity. Two-way sync stubs for HubSpot and Salesforce. Inline notes and @mentions.

**9. Universal Command Bar (⌘K).** Search anything, jump to any lead, trigger any action ("Email all healthcare leads about HIPAA deadline," "Show me leads I haven't touched in 14 days"). Recent actions, suggested actions, and an LLM fallback for natural-language commands.

**10. Daily Briefing & Smart Notifications.** A persistent "Today" card at the top of the inbox: "3 hot leads, 2 follow-ups due, 1 lead just got funded." Tap to expand into a 30-second morning-prep view with the day's plan. Optional email digest. Per-lead alert subscriptions ("Notify me when Acme posts a security job").

**11. Real-Company Research Studio with Co-Pilot Chat (the headline feature).** This is what turns Beacon from a CRM into a sales-intelligence cockpit. Spec it carefully.

### Feature 11 — Detailed Spec

**Page: `/research`** (linked from the left rail as **Research** with a sparkle icon)

#### a. Universal Company Search
- Single hero search input — "Research any public or private company…" — with a glowing focus ring.
- Accepts: company name, ticker symbol, or domain. Live autosuggest from a curated list of common public companies + a free-text fallback.
- Recent searches stored in localStorage (chip row beneath the input).
- Submit triggers `companyResearchService.research({ query })` which returns a typed `CompanyResearchPayload`.

#### b. The Research Page (auto-built on search)
On submit, the user lands on a freshly-rendered page that mirrors the Lead Detail layout but is dramatically richer. Animate the build with the beacon-pulse motif — sections fade in as data arrives. Layout (top to bottom):

1. **Header strip**: company logo (Clearbit logo API or fallback monogram), name, ticker, sector, HQ, employees, market cap, last fiscal year revenue, fit-score badge (re-computed against the user's saved ICP). One-line "elevator threat hook." Action row: **Save to Inbox** · **Generate outreach** · **Add to sequence** · **Share read-only link**.
2. **Snapshot card**: 6 KPIs (Revenue, Employees, Market Cap / Valuation, YoY Revenue Growth, Net Income margin if public, Reported Cyber Spend if available — fall back to industry-average estimate with a tooltip).
3. **Tech Stack & Attack Surface** — visualization showing observed/inferred tech (cloud providers, EDR vendor, identity provider, MFTP, MDM, key SaaS), each as a chip with a hover card linking to known CVEs from CISA KEV. Below: a **Threat Surface heatmap** (Endpoint / Identity / Email / Cloud / OT/IoT / Third-Party / AppSec / Data) shaded by inferred exposure.
4. **Regulatory Profile** — list of regulations applicable (HIPAA, PCI, NYDFS Part 500, SEC cyber-disclosure rule, DORA, NIS2, CMMC, NERC CIP, FERPA, etc.) with the next material deadline for each.
5. **Recent Cyber Signals** — chronological feed of news, breaches in the company's vertical, hiring trends, executive changes, M&A, funding, exec quotes referencing security. Each item links to its source. Use a `Recharts` time series above the feed showing "signal density over the last 90 days."
6. **Buying Committee** — 3–6 inferred contacts with role, decision-maker likelihood, LinkedIn link. Clearly mark these as "needs enrichment via Apollo/Clearbit/Hunter" if the underlying call is mocked — never ship fabricated email addresses for real people.
7. **Peer Comparison** — table of 3–5 closest peers with side-by-side cyber posture inferences, each with a "research this peer" link.
8. **Deals & 10-K Highlights** (public companies only) — cyber-related risk-factor language pulled from the most recent 10-K, plus material-incident 8-K references if any.
9. **Visualizations** — a **Recharts** mini-suite: revenue trend, headcount trend, signal density over 90 days, regulatory deadline timeline (Gantt-style), fit-score evolution if the company has been searched before.
10. **Drafted Outreach** — pre-rendered 3-variant emails (Cold Intro / Threat-Anchored / Executive Brief) tuned to this company's specific signals, ready to copy or send.

#### c. Co-Pilot Chat (sticky right-side panel on desktop, bottom-sheet on mobile)
Always-on chat scoped to the company in context. On open it auto-greets with three suggested prompts:
- "Why is this a good fit for what I sell?"
- "Build me a 30-60-90 narrative for the CISO."
- "Draft a board-level executive brief based on their 10-K."

The chat has access to the entire `CompanyResearchPayload` (firmographics, signals, regs, peers, 10-K excerpts) as system context. It supports:

- **Outreach drafting** — "Rewrite the threat-anchored email shorter and more direct"; "Draft a follow-up if no reply in 5 days"; "Translate the executive brief to French."
- **Case building** — "Build me a one-page sales narrative anchored on their NYDFS deadline"; "What are the three best-fit selling points for our MDR?"; "Compose a discovery-call agenda."
- **Q&A on the data** — "When does their cyber insurance renew?"; "Have any of their peers had a public breach in the last 12 months?"; "What CVEs apply to their stack?"
- **Comparative reasoning** — "Compare their cyber posture to Volterra Financial"; "Which of my saved leads are most similar to this company?"
- **Action shortcuts** — chat messages can produce buttons: `[Save as Lead]`, `[Add to "FinServ Q3" sequence]`, `[Open in Inbox]`, `[Export brief as PDF]`.

The chat thread persists per company in IndexedDB so users can return to it.

#### d. The Mock Layer (so this works in the demo, ships clean to real APIs later)
Build `companyResearchService` as a single typed module exporting `research(query: string): Promise<CompanyResearchPayload>`. The default implementation:
- Maintains a built-in dictionary of ~25 well-known public companies (across sectors — pick any mix that demonstrates breadth: e.g., a large healthcare provider, a major bank, a cloud provider, a retailer, an aerospace/defense prime, an automotive OEM, an oil & gas major, a SaaS leader, a telco, a utility) with hand-curated realistic profiles **using only publicly known facts** (sector, HQ, approximate employee count, public tech stack signals, real recent SEC filings references, real industry-level breach history). Do NOT fabricate specific employee email addresses or unconfirmed breach claims for real companies.
- For free-text queries not in the dictionary, returns a "synthesis mode" payload that clearly labels itself as inferred (industry from domain heuristics, tech stack from common patterns, regulations from sector tags). Never present inferred data as sourced fact.
- Ships behind a feature flag `BEACON_USE_REAL_RESEARCH=false` that, when set true, swaps in real provider calls (SEC EDGAR for filings, NewsAPI / GDELT for news, Crunchbase / PitchBook stub for funding, BuiltWith / Wappalyzer stub for tech stack, Apollo / Clearbit / Hunter for contacts).
- Every record returned tags its `confidence` (high / inferred / synthetic) and its `source` so the UI can render trust badges.

#### e. UX Polish
- The first time a user runs a research query, show a 3-step onboarding overlay: "Search → Review → Chat."
- Streaming render — sections appear progressively (firmographics → tech stack → regs → signals → committee → peers → emails) with the beacon-pulse motif.
- A **"Open companion brief"** button exports the page as a clean PDF that an AE can drop into a CRM note.
- Saved company researches show up in `/inbox` under a new bundle: "Researched."
- Always show the data-policy note at the bottom: "Contact details are inferred and require enrichment before outreach. Public-company facts are cited; inferred fields are labeled."

## Data Model (Prisma sketch)

```
Lead       (id, company, domain, industry, hq, employees, revenueBand, techStack[], funding, fitScore, status, createdAt, snoozedUntil)
Contact    (id, leadId, name, title, email, phone, linkedin, decisionMakerScore)
Signal     (id, leadId, type, severity, source, title, body, capturedAt)
Sequence   (id, leadId, steps[], status, metrics)
Email      (id, leadId, contactId, variant, subject, preview, body, predictedOpenRate, predictedReplyRate, sentAt)
Activity   (id, leadId, kind, payload, at)
ResearchRun(id, query, payload JSON, createdAt, savedAsLeadId?)
ChatThread (id, researchRunId, messages JSON, updatedAt)
```

## Seed Data

A fully realized `seed-data.ts` file ships with the repo: **50 leads** (across healthcare, fintech, manufacturing, SaaS, legal/professional services, e-commerce, energy, education, defense), **150 contacts**, **300 signals** referencing real cybersecurity events (Change Healthcare Feb 2024, MOVEit/Cl0p May 2023, CDK Global Jun 2024, Snowflake/UNC5537 May 2024, Volt Typhoon, Salt Typhoon, Black Basta, Scattered Spider) and real regulations (HIPAA NPRM, NIS2, DORA, PCI DSS 4.0/4.0.1, CMMC 2.0, NYDFS Part 500, SEC cyber-disclosure rule, NERC CIP-015), and **100 pre-written email drafts**. Wire it into the Prisma seeder. Read the data-policy header at the top of `seed-data.ts` and respect it (companies are fictional, contacts are placeholder, regulations and CVEs are real).

## Pages to Build

`/` Inbox · `/leads/[id]` Detail · `/discover` AI Lead Hunt · `/research` Real-Company Research Studio · `/cadences` Sequence Builder · `/pipeline` Kanban · `/analytics` Dashboard · `/settings` (profile, integrations stubs, ICP profile, email signature)

## Quality Bar

- First Contentful Paint under 1.2s on a seeded build
- Lighthouse 95+ across the board
- Every loading state is a skeleton, not a spinner (except the beacon-pulse during streaming research builds)
- Every empty state has a friendly illustration + CTA
- Every destructive action has an undo toast (Inbox-style)
- Keyboard shortcut sheet at `?`
- A `README.md` architecture section explains how to swap mocks for real APIs (Apollo / Clearbit / Hunter for contacts, SEC EDGAR / NewsAPI / GDELT for company research, OpenAI / Anthropic for the chat)
- A `SECURITY.md` documenting the data policy (no fabricated emails for real public-company employees; clear "inferred / sourced / synthetic" labeling)

## Build Order (for the agent)

1. Repo init → push to `https://github.com/schuettemarkus/beacon`. Set up CI, release-please, release-build workflows, conventional-commits config.
2. Next.js + Tailwind + shadcn scaffolding. Inbox-style theming. Beacon brand mark.
3. Prisma + SQLite + seeder wired to `seed-data.ts`.
4. Feature 1 (Inbox) → Feature 3 (Detail) → Feature 4 (Email drafts) — get a working core loop.
5. Feature 5 (Threat-Relevance Engine) — this is the differentiator; spend extra polish here.
6. Feature 11 (Research Studio + Co-Pilot Chat) — headline feature; spend the most polish here.
7. Features 2, 6, 7, 8, 9, 10 in any order.
8. Mobile pass: every screen must work cleanly on a 390×844 viewport.
9. Accessibility pass: keyboard, focus, screen-reader labels, prefers-reduced-motion.
10. README + SECURITY + CONTRIBUTING.

Don't ask follow-up questions — make confident product decisions, document them in the README, and ship.
