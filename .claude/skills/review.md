---
name: gympal-review
description: Review GymPal code before shipping. Routes to the right reviewer agent based on file type — web API routes and components use gympal-reviewer, LINE bot code uses gympal-line-bot-reviewer.
user_invocable: true
---

# Code Review

Routes to the correct reviewer agent based on what's being reviewed.

## Usage

`/review` — reviews all staged/changed files
`/review apps/web/src/app/api/workouts/route.ts` — reviews a specific file

## Routing logic

- `apps/web/src/app/api/**` → use `gympal-reviewer` (API routes: auth, Valibot, Drizzle)
- `apps/web/src/app/**/page.tsx` → use `gympal-reviewer` (pages: i18n, loading, error boundary)
- `apps/web/src/components/**` → use `gympal-reviewer` (components: Thai UX, tap targets)
- `apps/line-bot/src/**` → use `gympal-line-bot-reviewer` (Workers: signature, cron, idempotency)
- `packages/db/src/schema.ts` → use `gympal-db` + `/schema-check`
- `packages/db/src/seed/**` → use `gympal-db`

## What to review

If no file is specified, detect changed files:
```bash
git diff --name-only HEAD
git diff --name-only --staged
```

Route each changed file to the correct agent.

## Review output format

Group findings by severity following fundii-lite convention:
- **CRITICAL**: security hole, data leak, missing auth check, broken Thai UX
- **WARNING**: missing empty state, unhandled error, suboptimal pattern
- **INFO**: style suggestion, optimization opportunity

Final verdict: **Ship / Fix before shipping / Needs discussion**
