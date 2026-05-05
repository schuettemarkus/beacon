# Contributing to Beacon

## Getting Started

```bash
# Clone the repo
git clone https://github.com/schuettemarkus/beacon.git
cd beacon

# Install dependencies
pnpm install

# Set up the database
cp .env.example .env
pnpm db:push
pnpm db:seed

# Start the dev server
pnpm dev
```

## Development Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Ensure `pnpm lint` and `pnpm tsc --noEmit` pass
4. Submit a PR against `main`

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New feature
- `fix:` — Bug fix
- `chore:` — Maintenance (deps, config, tooling)
- `docs:` — Documentation only
- `refactor:` — Code change that neither fixes a bug nor adds a feature
- `perf:` — Performance improvement
- `test:` — Adding or fixing tests

Examples:
```
feat: add threat-surface heatmap to lead detail
fix: correct fit-score calculation for healthcare vertical
chore: update prisma to v5.22
docs: add API swap guide to README
```

## Architecture

```
src/
├── app/              # Next.js App Router pages + API routes
├── components/       # React components (by feature domain)
│   ├── layout/       # Shell, sidebar, command bar
│   ├── inbox/        # Lead cards, groups, daily briefing
│   ├── leads/        # Detail page components
│   └── research/     # Research studio components
├── lib/              # Shared utilities (db client, utils)
├── services/         # Business logic (AI, enrichment, research)
└── store/            # Zustand stores
```

## Swapping Mocks for Real APIs

See the README's "Swapping Mocks" section for details on:
- Enrichment providers (Apollo, Clearbit, Hunter)
- AI providers (OpenAI, Anthropic)
- Company research (SEC EDGAR, NewsAPI, GDELT)

## Code Style

- TypeScript strict mode
- Tailwind CSS for styling (no CSS modules)
- shadcn/ui as the component substrate
- Framer Motion for animations
- Prefer server components; use "use client" only when needed

## Data Policy

Read `SECURITY.md` before contributing. Key rules:
- Never fabricate email addresses for real people
- Always label confidence levels (sourced / inferred / synthetic)
- Keep seed data companies fictional
