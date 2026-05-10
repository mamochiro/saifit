---
name: saifit-test
description: Run Saifit tests (unit and/or E2E) and fix any failures. Covers Vitest unit tests and Playwright E2E.
user_invocable: true
---

# Run Saifit Tests

## Unit tests (Vitest)

```bash
cd apps/web && pnpm vitest run
```

For a specific file:
```bash
cd apps/web && pnpm vitest run src/lib/__tests__/calculations.test.ts
```

## E2E tests (Playwright)

```bash
cd apps/web && pnpm test:e2e
```

Requires:
- `pnpm docker:up` (Postgres + Redis running)
- `pnpm dev` (Next.js on :3000)
- Dev seed user present (`pnpm db:seed`)

## Package-level tests

```bash
cd packages/db && pnpm test        # DB client tests
cd apps/line-bot && pnpm test      # LINE bot tests (Wrangler + Vitest)
```

## On failure

1. Read the error output — find the failing assertion
2. Read the source file AND the test file
3. Determine: is the code wrong, or is the test wrong?
   - If the code is wrong → fix the code, re-run
   - If the test is testing the wrong thing → fix the test
   - Never suppress a test just to make it pass
4. Re-run until green

## Critical tests to never skip

- `estimate1RM` with reps > 12 returning null (Brzycki limit)
- `normalizeDecimal` with Thai comma input (`"60,5"` → `60.5`)
- API routes returning 401 when unauthenticated
- IndexedDB queue reconciliation (not blind replay)
- Streak grace day logic

## Report

After running: N passed, N failed, N skipped.
For each failure: file, test name, assertion that failed, suggested fix.
