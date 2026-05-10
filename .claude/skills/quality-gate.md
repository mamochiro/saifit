---
name: saifit-quality-gate
description: Run the full Saifit quality gate — Biome lint, TypeScript check, Vitest unit tests, and optionally E2E — before pushing or marking a phase done.
user_invocable: true
---

# Saifit Quality Gate

Run this before every push and before marking a phase done in SPRINT.md.

## Step 1 — Biome lint + format check
```bash
pnpm biome check .
```
Must exit 0. If it fails, run `/biome-fix` first.

## Step 2 — TypeScript strict check
```bash
cd apps/web && pnpm tsc --noEmit
cd packages/db && pnpm tsc --noEmit
cd packages/shared && pnpm tsc --noEmit
cd apps/line-bot && pnpm tsc --noEmit
```
No errors. No `any` outside SDK boundaries.

## Step 3 — Unit tests
```bash
pnpm vitest run
```
All must pass. Zero skipped tests unless explicitly annotated with reason.

## Step 4 — E2E (optional, ask user)
```bash
cd apps/web && pnpm test:e2e
```
Run when: auth flow changed, workout logger changed, or pre-deploy.

## Step 5 — Report

```
Biome       ✅ / ❌
TypeScript  ✅ / ❌
Unit tests  ✅ N passed / ❌ N failed
E2E         ✅ / ❌ / ⏭️ skipped
```

Gate decision:
- All ✅ → `✅ Gate passed — safe to push`
- Any ❌ → `❌ Gate failed — do not push`

Fix failures before declaring a phase complete or raising a PR.
