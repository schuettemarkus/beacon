@AGENTS.md

## Pre-Push Checklist

Before every push to main, review and update these admin pages to stay current with the codebase:

1. **src/app/wiki/page.tsx** — Product documentation. Update if features, workflows, or key concepts change.
2. **src/app/faq/page.tsx** — FAQ. Update answers if implementation details change (data sources, scoring, etc).
3. **src/app/sources/page.tsx** — Data sources. Update if new APIs are added or removed.
4. **src/app/releases/page.tsx** — Feature changelog. Add a new entry for each sprint/release.
5. **src/app/tech-stack/page.tsx** — Tech stack. Update if dependencies, frameworks, or hosting changes.
6. **src/app/cookies/page.tsx** — Cookie policy. Update if new cookies or storage mechanisms are added.
7. **src/app/privacy/page.tsx** — Privacy policy. Update if data collection, storage, or third-party services change.

These are public pages (no auth required) and serve as the source of truth for users, prospects, and compliance.
