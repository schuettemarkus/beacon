# Beacon

AI-powered B2B lead-generation and outreach cockpit for cybersecurity sales teams.

Open the app in the morning, see a curated stack of high-fit prospects with everything needed to close — contact info, threat-relevance signals, talk tracks, and a ready-to-send email — and get to "hit reply" in under 60 seconds per lead.

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm db:push
pnpm db:seed
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

1. **Smart Lead Inbox** — Grouped feed (Today, This Week, Snoozed) with fit scores and threat hooks
2. **AI Lead Discovery** — Describe your ICP, get ranked prospects with reasoning
3. **360° Lead Detail** — Firmographics, threat surface, buying committee, signals, drafted emails
4. **AI-Drafted Outreach** — Three email variants per lead (Cold Intro, Threat-Anchored, Executive Brief)
5. **Threat-Relevance Engine** — Real CVEs, breaches, and regulatory deadlines tied to each prospect
6. **Pipeline Analytics** — Recharts dashboards: funnel, lead volume, reply rates, score distribution
7. **Multi-Channel Cadences** — Visual sequence builder (Email → LinkedIn → Call)
8. **CRM-Lite Pipeline** — Drag-and-drop Kanban (New → Closed)
9. **Command Bar (⌘K)** — Search anything, jump anywhere, trigger actions
10. **Daily Briefing** — Morning-prep summary card
11. **Research Studio** — Real-company research with Co-Pilot chat

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animation**: Framer Motion
- **Charts**: Recharts
- **State**: Zustand (client) + TanStack Query (server)
- **Database**: Prisma + SQLite (swap-ready for Postgres)
- **Package Manager**: pnpm

## Architecture

```
src/
├── app/              # Pages + API routes
├── components/       # UI components by domain
├── lib/              # DB client, utilities
├── services/         # AI, enrichment, research services
└── store/            # Zustand stores
```

## Swapping Mocks for Real APIs

### AI Service (`src/services/ai-service.ts`)
Set `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` in `.env`. The `aiService` module checks for these and routes to the appropriate provider.

### Enrichment (`src/services/enrichment-service.ts`)
Set `APOLLO_API_KEY`, `CLEARBIT_API_KEY`, or `HUNTER_API_KEY`. The enrichment layer is typed to the Apollo/Clearbit/Hunter response shape.

### Company Research (`src/services/company-research.ts`)
Set `BEACON_USE_REAL_RESEARCH=true` and provide:
- `SEC_EDGAR_USER_AGENT` — for 10-K/8-K filings
- `NEWSAPI_KEY` — for news signals
- `CRUNCHBASE_API_KEY` — for funding data

### Database
Change `DATABASE_URL` in `.env` to a Postgres connection string. Run `pnpm db:push` to apply the schema.

## Release Flow

This repo uses [release-please](https://github.com/googleapis/release-please) for automated versioning and changelog generation.

1. Push conventional commits to `main`
2. Release-please opens a Release PR with changelog
3. Merge the Release PR → GitHub Release is created with a tag
4. The tag triggers `release-build.yml` which builds and uploads artifacts

**Local setup**: Run `gh auth login` once. CI handles everything else via the default `GITHUB_TOKEN`.

## Data Policy

See [SECURITY.md](./SECURITY.md) for full details. Key points:
- Seed data companies are **fictional**
- Contacts are **placeholder** — never use for real outreach without enrichment
- Signals reference **real** public cybersecurity events and regulations
- All data in the UI is labeled with confidence badges (sourced / inferred / synthetic)

## License

MIT — see [LICENSE](./LICENSE).
