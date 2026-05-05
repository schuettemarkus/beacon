# Security & Data Policy

## Data Classification

Beacon handles three types of data with different trust levels:

### Sourced (High Confidence)
- Real cybersecurity events (breaches, CVEs, threat actor campaigns)
- Real regulations and compliance deadlines (HIPAA, PCI DSS, NIS2, DORA, CMMC, etc.)
- Public company facts available via SEC filings

### Inferred (Medium Confidence)
- Tech stack deductions based on domain/industry heuristics
- Regulatory applicability based on sector tags
- Fit scores computed from ICP matching
- Threat surface assessments

### Synthetic (Demo Only)
- Company profiles in seed data are **fictional** — they mirror real buyer archetypes
- Contact names and emails are **placeholder** — never use for real outreach
- AI-generated email drafts require human review before sending

## UI Trust Indicators

Every data point in Beacon's UI carries a confidence badge:
- 🟢 **Sourced** — from a verified external source (SEC, CISA KEV, news)
- 🟡 **Inferred** — deduced from patterns, not directly confirmed
- 🔴 **Synthetic** — generated for demo purposes only

## Contact Data Policy

**Beacon does NOT fabricate email addresses for real public-company employees.**

- Seed data contacts are fictional personas at fictional companies
- The Research Studio's "Buying Committee" section clearly labels contacts as "needs enrichment via Apollo/Clearbit/Hunter"
- Production deployments must integrate with a licensed enrichment provider before enabling outreach

## Responsible Disclosure

If you discover a security vulnerability in Beacon, please email security@beacon.app (or open a private security advisory on GitHub).

## API Keys & Secrets

- Never commit `.env` files (enforced via `.gitignore`)
- Use `.env.example` as a template
- In production, use environment-variable injection (Vercel, Railway, etc.)
- The default `GITHUB_TOKEN` in GitHub Actions is sufficient for release-please

## Dependencies

- Run `pnpm audit` regularly
- Dependabot is recommended for automated CVE patching
- Prisma handles SQL injection prevention via parameterized queries
