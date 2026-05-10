---
name: saifit-feature
description: Add a new feature to Saifit end-to-end. Runs saifit-feature-architect first to produce a blueprint, then implements it following the project conventions.
user_invocable: true
---

# Add a New Saifit Feature

## Step 1 — Blueprint first

Use the `saifit-feature-architect` agent to design the feature before writing any code. Do not skip this step — coding without a blueprint causes architectural drift.

Review the blueprint with the user. Confirm:
- DB schema changes (if any)
- API contract
- Component tree
- Which SPRINT.md phase this belongs to

## Step 2 — DB changes (if any)

Run `/migrate <description>` to safely create and apply the migration.
Verify schema with `/schema-check`.

## Step 3 — API routes

For each new route, use `/new-api` to scaffold it with auth + Valibot + Drizzle.

Rules:
- Auth check is always first
- `userId` always from `session.user.id`
- Validate all inputs with Valibot
- Return `{ data: ... }` or `{ error: "..." }`

## Step 4 — UI

For each new page, use `/new-page` to scaffold it with loading/error/i18n boilerplate.

Rules:
- Server Components for data fetching
- Client Components for interactivity
- TanStack Query for all data fetching
- Optimistic updates for mutations
- Empty state required on every list

## Step 5 — i18n

Run `/i18n-sync` to verify all new keys exist in both `th.json` and `en.json`.
Thai default — never hardcode strings.

## Step 6 — Thai UX

Run `/thai-check` to verify:
- Line-height ≥ `leading-relaxed`
- Decimal inputs normalize `,` → `.`
- Number format uses `Intl.NumberFormat`
- Tap targets ≥56px

## Step 7 — Tests

Use the `saifit-test-writer` agent to write:
- Vitest unit tests for calculations and API routes
- Playwright E2E for the critical user flow

## Step 8 — Quality gate

```bash
pnpm biome check .
pnpm vitest run
```

Both must pass before committing.

## Step 9 — Commit + update SPRINT.md

Run `/commit` for a conventional commit message.
Run `/phase-done <N>` if the phase is complete.
