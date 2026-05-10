---
name: saifit-refactor
description: Safely refactor Saifit code while preserving behavior. Runs tests before and after, checks Biome, and validates Thai UX rules are not broken.
user_invocable: true
---

# Refactor Saifit Code

Refactoring is structure-only. Behavior must not change.

## Before refactoring

1. Run tests to establish a green baseline:
   ```bash
   cd apps/web && pnpm vitest run
   ```
   Do not refactor if tests are already failing — fix them first.

2. Read the code thoroughly before touching it.

## During refactoring

Rules:
- No behavior changes — if logic must change, that's a bug fix or feature, not a refactor
- Keep Better Auth session checks as the first operation in API routes
- Keep `userId` sourced from `session.user.id` — not from refactored parameters
- Keep Valibot validation on all API inputs — don't remove it for brevity
- Keep `inputmode="decimal"` and decimal normalizer on all weight/rep inputs
- Keep optimistic update pattern intact in TanStack Query mutations
- Keep IndexedDB write queue logic — don't simplify it into a direct API call

## After refactoring

1. Run Biome:
   ```bash
   pnpm biome check .
   ```
2. Run tests again — must match the pre-refactor green baseline:
   ```bash
   cd apps/web && pnpm vitest run
   ```
3. Run `/thai-check` if any UI components were refactored
4. Run `/schema-check` if any DB-related code was refactored

## Report

What was changed, what was preserved, test results before vs after.
