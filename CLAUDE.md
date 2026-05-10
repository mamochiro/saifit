# Saifit — Claude Code Project Instructions

## Role
Senior full-stack engineer building a production-ready fitness tracking PWA + LINE OA bot for the Thailand market. Solo developer, MVP in 6 weeks, Docker-based local development.

Work autonomously. Plan first, then build. Ask only when blocked. Make sensible decisions.

## Project overview
Fast workout-tracking PWA for Bangkok gym-goers. Pick a template, log sets/reps/weight in 3 seconds, see progress. Bilingual Thai/English. Installable PWA. Companion LINE OA sends reminders and weekly summaries.

**Core value:** "Track workouts in seconds. See your gains. Stay consistent."
**Target user:** Bangkok gym-goers, ages 20–40, beginner to intermediate, primarily Thai speakers.

## Tech stack

### Frontend
- Next.js 15 (App Router, React 19, Server Components)
- TypeScript strict mode
- Tailwind CSS v4 + shadcn/ui
- TanStack Query v5
- TanStack Form + Valibot
- Recharts
- serwist (PWA — NOT next-pwa, which is unmaintained on App Router)
- next-intl (i18n)
- Lucide React

### Backend / Database
- Local dev: Postgres 16 (Docker), Redis 7 (Docker)
- Production: Neon (serverless Postgres — no vendor lock-in, no project pause)
- Auth: Better Auth (open-source, self-hosted, LINE OAuth built-in)
- Drizzle ORM (same schema for all envs)

### LINE Bot
- Cloudflare Workers + Hono + @line/bot-sdk
- Cloudflare Cron Triggers

### Tooling
- Bun (pin version in .tool-versions)
- Biome (lint + format)
- Vitest (tests)
- Turborepo + pnpm workspaces
- Conventional Commits

## Repo structure
```
saifit/
├── apps/
│   ├── web/          # Next.js PWA
│   └── line-bot/     # Cloudflare Workers
├── packages/
│   ├── db/           # Drizzle schema + migrations + seed
│   └── shared/       # Shared types + schemas + utils
├── docker/
│   └── postgres/init.sql
├── docker-compose.yml
├── CLAUDE.md
└── SPRINT.md
```

## Local dev architecture
Next.js and Wrangler run natively (NOT in Docker — kills HMR on Mac).
Docker Compose runs only stateful services.

```
Native:  Next.js :3000  |  Wrangler :8787
Docker:  Postgres :5432 |  Redis :6379 |  pgAdmin :5050 |  Mailhog :8025
```

## Database notes
- Local dev: `node-postgres` (Docker Postgres)
- Production: `drizzle-orm/neon-http` (Neon serverless — HTTP-based, edge-compatible)
- CRITICAL: neon-http returns dates as strings; node-postgres returns Date objects — add explicit Drizzle date coercions in schema to normalize both
- Run integration tests against both drivers in CI
- Neon connection string format: `postgresql://user:pass@ep-xxx.neon.tech/saifit?sslmode=require`

### Schema amendments from review
- `workoutSets.weightKg`: nullable + `isBodyweight` boolean (for pull-ups, dips)
- `exercises.muscleGroups`: string array not single string (RDL = ['legs','back'])
- Streak: allow one grace day per 7-day window before reset
- 1RM: suppress display when reps > 12 (Brzycki formula unreliable above 12 reps)

## Critical implementation rules

### Workout logger (Phase 7 — the product)
- Debounced auto-save 300ms
- `inputmode="decimal"` on all weight/rep inputs
- Normalize both `.` and `,` as decimal separators (Thai locale keyboards)
- Tap targets ≥56px
- Optimistic UI via TanStack Query
- IndexedDB write queue with sequence numbers — NOT blind replay; reconcile with server on reconnect
- Persist state on `visibilitychange` (phone call, app backgrounding)
- Auto-advance to next set with undo path (1-tap undo)
- Rest timer: dock above keyboard, persistent across navigation, haptic fallback for silent mode
- "Complete set" button: bottom-right thumb zone

### PWA — use serwist, not next-pwa
- Offline shell service worker
- Install prompt after 2nd visit
- Icons: 192/256/384/512px

### i18n
- Thai is the HARD DEFAULT — not a toggle on top of English
- Thai script needs +20% line-height — test every button in Thai or labels clip
- Decimal input: normalize `,` → `.` for Thai locale keyboards
- Number format: 1,000 kg not 1000 kg

### Auth — Better Auth
- LINE Login is PRIMARY (Bangkok users won't create email accounts for a gym app)
- Better Auth handles: LINE OAuth, Google OAuth, email/password
- Config file: `apps/web/src/lib/auth.ts` — use `betterAuth()` with `drizzleAdapter`
- Better Auth creates its own tables (user, session, account, verification) via Drizzle adapter — these live alongside our app tables
- Session validated in Next.js middleware via `auth.api.getSession()`
- LINE OAuth redirect: add "returning in 3 seconds" interstitial (prevents PWA reinstall prompt on Android)
- Auto-populate displayName from LINE profile, editable before home screen
- Env vars needed: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `LINE_LOGIN_CHANNEL_ID`, `LINE_LOGIN_CHANNEL_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

### Auth protection (replaces DB-level RLS)
- All API routes check session via `auth.api.getSession()` in route handler
- Middleware protects all routes except `/sign-in`, `/sign-up`, `/api/auth/**`
- Query filtering: always `WHERE userId = session.user.id` — never trust client-sent userId
- Public tables (exercises, templates): no auth required on GET routes
- No DB-level RLS needed — auth enforced at API layer

### Progress dashboard
- Two tabs: "Trends" (charts) and "Records" (PRs + streak + heatmap)
- Lead with streak + most recent PR (emotional hooks that drive return visits)

### Onboarding UX
- Days/week: tap chips 1–7, not number input
- Gym type: visual icon cards, not dropdown
- After Q4: show preview of personalized home screen

## Key calculations

```ts
// Brzycki — returns null when reps > 12
function estimate1RM(weight: number, reps: number): number | null {
  if (reps === 1) return weight;
  if (reps > 12) return null;
  return weight * (36 / (37 - reps));
}

// Volume — skip null weightKg (bodyweight sets)
function calculateVolume(sets: WorkoutSet[]): number {
  return sets.reduce((s, x) => s + x.reps * (x.weightKg ?? 0), 0);
}
```

## Must-have empty/error states
- Empty workout history → encouraging prompt, not blank list
- Abandoned workout → resume prompt on next open
- Offline pending sync → visible "saved locally" badge
- PR beaten → celebration (confetti + haptic)
- LINE auth expiry during active workout → graceful recovery, not logout

## What NOT to do
- No AI features, nutrition, social, or payments in MVP
- No `any` types outside SDK boundaries
- No Express, Prisma, or Zod — use Hono, Drizzle, Valibot
- No next-pwa — use serwist
- Do NOT put Next.js in Docker
- Do NOT ship Phase 7 with a blind IndexedDB replay

## After every phase
1. Run `biome check .`
2. Run `vitest`
3. Commit with conventional commit message
4. Check off the phase in SPRINT.md
