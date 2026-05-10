# Saifit — Sprint Plan & Checklist

**Timeline:** 6–8 weeks solo · **Status legend:** ⬜ todo · 🔄 in progress · ✅ done · ❌ blocked

---

## Phase 1 — Monorepo + Docker Compose
**Goal:** `pnpm docker:up` → Postgres + Redis healthy. Repo skeleton in place.

- [x] Init pnpm workspace (`pnpm-workspace.yaml`)
- [x] Create `turbo.json` with dev/build/test/lint pipelines
- [x] Create root `package.json` with all scripts (setup, dev, docker:*, db:*)
- [x] Scaffold directory tree: `apps/web`, `apps/line-bot`, `packages/db`, `packages/shared`
- [x] Write `docker-compose.yml` (postgres, redis + tools profile for pgadmin/mailhog)
- [x] Write `docker/postgres/init.sql` (uuid-ossp, pgcrypto, auth schema, mock auth.uid())
- [x] Write `.env.example`
- [x] Write `.gitignore`
- [x] Write `tsconfig.base.json`
- [x] Write root `biome.json`
- [x] Pin Bun version in `.tool-versions`
- [x] Verify: `pnpm docker:up` → `pg_isready` passes, Redis `PING` returns PONG

**Phase 1 done when:** `docker compose ps` shows postgres + redis healthy ✅

---

## Phase 2 — Drizzle Schema + Migrations + Exercises Seed
**Goal:** All tables migrated; 100+ exercises seeded.

- [x] `packages/db/package.json` with db:generate, db:migrate, db:push, db:studio, db:seed, db:reset scripts
- [x] `packages/db/drizzle.config.ts`
- [x] `packages/db/src/schema.ts` — all 10 tables:
  - [x] users (with locale, goal, experienceLevel, daysPerWeek, gymType, unitsPreference, reminderTime, timezone)
  - [x] exercises (with muscleGroups as string array, isBodyweight flag)
  - [x] templates
  - [x] userPrograms
  - [x] workouts
  - [x] workoutSets (weightKg nullable, isBodyweight boolean)
  - [x] personalRecords
  - [x] streaks
  - [x] reminderLog
  - [x] subscriptions
- [x] Indexes: users.lineUserId, workouts(userId, startedAt DESC), workoutSets.workoutId, personalRecords(userId, exerciseId)
- [x] `packages/db/src/client.ts` — dual client:
  - [x] node-postgres for `localhost` (Docker)
  - [x] neon-http (`drizzle-orm/neon-http`) for Neon production
  - [x] Switch on `DATABASE_URL` containing `neon.tech`
  - [x] Explicit date type coercions on both drivers
- [x] Run `db:generate` → first migration file created
- [x] Run `db:migrate` → tables exist in local Postgres
- [x] `packages/db/src/seed/exercises.ts` — 100+ exercises, bilingual Thai/English
  - [x] Chest: 11 exercises
  - [x] Back: 11 exercises (rows tagged with secondary: biceps)
  - [x] Legs: 15 exercises (RDL tagged muscleGroups: ['legs','back'])
  - [x] Shoulders: 8 exercises
  - [x] Arms: 10 exercises
  - [x] Core: 9 exercises
  - [x] Cardio: 8 exercises
  - [x] Full-body: 4 exercises
  - [x] Each has: beginnerCueTh, beginnerCueEn, commonMistakeTh, commonMistakeEn
- [x] Verify: `SELECT COUNT(*) FROM exercises` ≥ 100

**Phase 2 done when:** Migration runs clean, 100+ exercises in DB ✅

---

## Phase 3 — Templates Seed + Dev User Seed
**Goal:** 12 templates in DB; dev user with active program + 2 weeks sample workouts.

- [x] `packages/db/src/seed/templates.ts` — 12 programs:
  - [x] Beginner Full Body 3-Day
  - [x] PPL 6-Day (note: advanced — add warning in description)
  - [x] Upper/Lower 4-Day
  - [x] Push/Pull 4-Day
  - [x] Home No Equipment 3-Day
  - [x] Home Dumbbell 3-Day
  - [x] Strength 5x5 3-Day
  - [x] Hypertrophy 5-Day
  - [x] Female Glute Focus 4-Day
  - [x] Beginner 2-Day Minimum
  - [x] Intermediate Powerbuilding 4-Day
  - [x] Pure Cardio 3-Day
  - [x] Each has full splitJson (exercises per day, sets×reps), bilingual name + description
- [x] `packages/db/src/seed/index.ts` — orchestrates exercises → templates → dev user
- [x] Dev seed user:
  - [x] Email: dev@saifit.local / Password: devpassword123
  - [x] Pre-onboarded (goal=build_muscle, experience=beginner, days=3)
  - [x] Active program: Beginner Full Body 3-Day
  - [x] 5–10 workouts logged across 2 weeks
  - [x] A few PRs (so PR cards render)
  - [x] Streak seeded (so streak banner shows)
- [x] Verify: `pnpm db:seed` completes; home shows streak + today's workout for dev user

**Phase 3 done when:** Dev user's data visible in all tables ✅

---

## Phase 4 — Next.js Setup
**Goal:** `pnpm dev` serves Next.js on :3000 with full toolchain wired.

- [x] Scaffold `apps/web` with Next.js 15 App Router + TypeScript strict
- [x] Install + configure Tailwind CSS v4
- [x] Install + configure shadcn/ui
- [x] Install + configure next-intl (Thai default, English secondary)
  - [x] `messages/th.json` skeleton (all top-level keys)
  - [x] `messages/en.json` skeleton
  - [x] Middleware for locale routing
- [x] Install TanStack Query v5 + provider in layout
- [x] Install serwist (NOT next-pwa) — basic offline shell service worker
  - [x] PWA manifest with icons 192/256/384/512px
  - [ ] Splash screen config
  - [ ] theme-color meta
- [x] Install Recharts, Lucide React, TanStack Form, Valibot
- [x] Better Auth setup:
  - [x] `bun add better-auth`
  - [x] `src/lib/auth.ts` — `betterAuth()` with `drizzleAdapter`, LINE + Google providers
  - [x] `src/lib/auth-client.ts` — `createAuthClient()` for browser
  - [x] `app/api/auth/[...all]/route.ts` — Better Auth handler
- [x] Auth middleware (protect all routes except /sign-in, /sign-up, /api/auth/**)
- [x] `apps/web/biome.json`
- [x] Verify: `http://localhost:3000` loads; unauthenticated → redirects to /sign-in

**Phase 4 done when:** Dev server up, middleware redirecting correctly ✅

---

## Phase 5 — Auth Flow + Onboarding
**Goal:** Sign-in → onboarding → home works end-to-end with dev seed user.

- [x] `/sign-in` page — LINE Login (primary), Google, email/password via Better Auth
- [x] `/sign-up` page
- [x] Better Auth handles OAuth callbacks at `/api/auth/**` automatically
- [x] On LINE login: extract lineUserId from Better Auth account, save to users table
- [x] LINE OAuth interstitial ("returning in 3 seconds") to prevent PWA reinstall prompt on Android
- [x] Auto-populate displayName from LINE profile, editable field before proceeding
- [x] Local dev: email/password auth via Better Auth against local Postgres
- [x] `/welcome` onboarding — 4 questions:
  - [x] Q1: Goal (visual cards: Build Muscle / Lose Fat / Get Stronger / Stay Active)
  - [x] Q2: Experience (visual cards: Beginner / Intermediate / Advanced)
  - [x] Q3: Days/week (tap chips 1–7, NOT number input)
  - [x] Q4: Gym type (icon cards: Commercial Gym / Home with Equipment / Home No Equipment)
  - [x] After Q4: preview of personalized home screen
- [x] Save onboarding → users table → redirect to /
- [x] TanStack Form + Valibot validation
- [x] Middleware: unauthenticated /api/* → 401, pages → 307 /sign-in
- [x] Verify: login as dev@saifit.local → skip onboarding → land on home

**Phase 5 done when:** Full auth + onboarding flow works ✅

---

## Phase 6 — Templates Browser + Program Selection
**Goal:** User can browse templates and activate one as their program.

- [x] `GET /api/templates` — list with filters (public route)
- [x] `GET /api/templates/:id` — detail (public route)
- [x] `GET /api/programs/active` — current program + today's workout
- [x] `POST /api/programs/start` — activate template
- [x] `DELETE /api/programs/active` — end program
- [x] `/templates` page — grid with filters (goal, difficulty, days/week)
  - [x] Empty state for no results
  - [x] Loading skeleton
- [x] `/templates/[id]` page — description, split view (day-by-day), exercise list, "เริ่มโปรแกรมนี้" CTA
- [x] Home page (`/`) — streak banner, today's workout card, "เริ่มออกกำลังกาย" CTA
  - [x] Empty state if no active program (เลือกโปรแกรม → /templates)
  - [x] Loading skeleton
- [x] Design system applied: Chakra Petch + K2D fonts, OKLCH color tokens
- [x] Middleware PUBLIC_PATHS updated: /api/templates, /api/exercises added
- [x] getUserActiveProgram(userId) helper in @saifit/db
- [x] i18n keys: templates.*, home.*, programs.* in th.json + en.json
- [x] Verify: browse → select template → home shows today's scheduled workout

**Phase 6 done when:** Program selection → home workout card renders ✅

---

## Phase 7 — Workout Logger ⭐ (the product)
**Goal:** 3-second-per-set logging — fast, reliable, offline-ready.

- [x] `POST /api/workouts` — start workout
- [x] `PATCH /api/workouts/:id` — update (name, notes, completedAt)
- [x] `POST /api/workouts/:id/sets` — log a set with PR detection
- [x] `PATCH /api/sets/:id` — update set
- [x] `DELETE /api/sets/:id`
- [x] `POST /api/workouts/:id/sync` — reconciliation endpoint (not blind replay)
- [x] `GET /api/exercises?q=&limit=20` — minimal exercise search for picker
- [x] `/workout/[id]` page:
  - [x] Exercise list with set rows (WorkoutLoggerView + ExerciseSectionList)
  - [x] weight + reps inputs: `inputmode="decimal"`, min-h-14 (56px) tap targets
  - [x] Normalize `,` → `.` decimal separator (normalizeDecimal inline)
  - [x] Debounced auto-save (300ms setTimeout) via IndexedDB queue → TanStack Query
  - [x] Optimistic UI — instant local update, background sync
  - [x] Checkmark to complete set → auto-advance to next set
  - [x] Undo auto-advance (1-tap, 3-second window)
  - [x] "Complete set" button: bottom-right thumb zone
  - [x] IndexedDB write queue (autoIncrement sequence, workout-queue.ts)
  - [x] Reconcile on reconnect (sync endpoint, not blind replay)
  - [x] visibilitychange handler — flush queue on backgrounding
  - [x] Floating rest timer (SVG circular arc, Chakra Petch numerals):
    - [x] Docked above keyboard (viewport-store.ts + visualViewport API)
    - [x] Persistent via Zustand + sessionStorage
    - [x] navigator.vibrate haptic on expiry
    - [x] +/-15s quick-adjust buttons (56px)
  - [x] PR detection → PRCelebrationOverlay portal (canvas confetti, auto-dismiss 2.5s)
  - [x] "บันทึกในเครื่องแล้ว" badge when offline
  - [x] Error boundary + loading skeleton
- [x] ExercisePicker bottom sheet (search + debounced GET /api/exercises)
- [x] Zustand stores: rest-timer-store.ts, viewport-store.ts
- [x] i18n: workout.*, restTimer.*, pr.* keys in th+en
- [x] estimate1RM (Brzycki) inline in sets route + set-row (extract to shared — Phase 8)
- [x] Verify: biome ✅ tsc ✅ API smoke ✅ /logger-ux audit ✅

**Phase 7 done when:** Full set logged on mobile, auto-saved, offline recovery verified ✅

---

## Phase 8 — Workout History + Detail
**Goal:** Past workouts browsable and reviewable.

- [x] `GET /api/workouts` — cursor-paginated list (aggregates: exerciseCount, totalSets, totalVolume, abandonedWorkout flag)
- [x] `DELETE /api/workouts/[id]` — delete workout + all sets
- [x] `/workout/history` page — infinite scroll, week grouping, date/name/duration/volume
  - [x] Empty state: 'ยังไม่มีประวัติการออกกำลังกาย — เริ่มต้นเลย!' + link to /templates
  - [x] Loading skeleton (5 placeholder rows)
  - [x] Abandoned workout banner: 'ต่อเลย' / 'เริ่มใหม่' actions
  - [x] Long-press delete with inline confirmation (no modal)
- [x] WorkoutDetailView — read-only sets grouped by exercise, 'ลบการออกกำลังกาย' CTA
- [x] /workout/[id] routes to logger vs detail based on completedAt
- [x] estimate1RM, normalizeDecimal, calculateVolume extracted to packages/shared
- [x] 10 unit tests in packages/shared/__tests__/utils.test.ts — all green
- [x] i18n: history.* keys in th+en
- [x] Verify: seed workouts visible, detail opens, delete works

**Phase 8 done when:** History list + detail renders for all seed workouts ✅

---

## Phase 9 — Exercise Library
**Goal:** Searchable, filterable exercise browser with per-exercise history.

- [x] `GET /api/exercises` — expanded: q/muscle/equipment/cursor filters, slug-cursor pagination
- [x] `GET /api/exercises/[slug]` — full exercise + optional user history (last 10 sessions)
- [x] `/exercises` page — infinite scroll, muscle filter chips, divider rows, skeleton, empty state
- [x] `/exercises/[slug]` page:
  - [x] Segmented Thai/English toggle for instructions
  - [x] Beginner cue + common mistake (bilingual)
  - [x] GIF placeholder: styled div 'วิดีโอสาธิต (coming soon)'
  - [x] Recharts LineChart for user history (white line, minimal axes, Chakra Petch numerals)
  - [x] Empty state if no history yet
- [x] Exercise picker upgraded with muscle group filter chips
- [x] i18n: exercises.* + exercises.muscles.* in th+en
- [x] Verify: search 'squat' → results → detail 200 ✅

**Phase 9 done when:** Search, filter, detail, and history all work ✅

---

## Phase 10 — Progress Dashboard
**Goal:** Charts show meaningful data from seed workouts.

- [x] `GET /api/progress/summary` — totalWorkouts, totalVolume, streak, longestStreak
- [x] `GET /api/progress/prs` — all PRs grouped by exercise (max_weight + estimated_1rm)
- [x] `GET /api/progress/heatmap` — 364-day activity (Asia/Bangkok TZ)
- [x] `GET /api/progress/weekly` — 12-week volume + byCategory breakdown
- [x] `GET /api/progress/exercise/[slug]` — 24-session weight progression + estimate1RM
- [x] `/progress` page — two-tab segmented control:
  - [x] **สถิติ (Records) tab** — shown first: streak hero, latest PR card, full PR table
  - [x] **แนวโน้ม (Trends) tab** — 2×2 stat chips (left-aligned, not hero metrics), weekly BarChart, stacked muscle BarChart (monochrome opacity), 52-week heatmap CSS grid
  - [x] Loading skeletons on all charts
  - [x] Empty states (never blank)
- [x] i18n: progress.* in th+en
- [x] Verify: all 5 endpoints → 401, page renders ✅

**Phase 10 done when:** Both tabs render with seed data, all empty states present ✅

---

## Phase 11 — Settings + Full PWA
**Goal:** Settings complete; app installable on phone.

- [x] `GET /api/me` — user profile (all settings fields)
- [x] `PATCH /api/me` — extended: unitsPreference, locale, reminderEnabled, reminderTime, displayName, avatarUrl (Valibot validation)
- [x] `/settings` page: profile, units kg/lb, language Thai/EN, reminders toggle+timepicker, LINE status (coming soon), sign-out
- [x] PWA install prompt after 2nd visit (beforeinstallprompt, localStorage persist, bottom sheet)
- [x] Apple PWA meta tags in layout.tsx (apple-mobile-web-app-capable, status-bar-style, apple-touch-icon)
- [x] PWA manifest: name/short_name, 4 icon sizes, standalone, theme_color
- [x] i18n: settings.* + pwa.* — 17 keys, perfect parity th+en
- [x] Verify: manifest ✅ sw.js ✅ settings page ✅ i18n parity ✅

**Phase 11 done when:** App installs, Thai/English toggle works site-wide, offline shell verified ✅

---

## Phase 12 — LINE Bot Setup
**Goal:** Webhook handler running locally via Wrangler on :8787.

- [x] `apps/line-bot/package.json`
- [x] `apps/line-bot/wrangler.toml` with cron triggers:
  - [x] `0 11 * * *` (18:00 Bangkok)
  - [x] `0 14 * * *` (21:00 Bangkok)
  - [x] `0 13 * * 0` (Sunday 20:00 Bangkok)
- [x] `apps/line-bot/src/index.ts` — Hono app
- [x] LINE signature verification middleware
- [x] Webhook handler:
  - [x] Follow event → save lineUserId to user record
  - [x] Unfollow event → clear reminder flag
  - [x] Text commands → reply (help, status)
- [x] Idempotency: check event ID before processing
- [x] After auth (Phase 5): prompt user to add LINE OA as friend
- [x] Verify: `wrangler dev` runs on :8787; webhook verifies LINE signature

**Phase 12 done when:** LINE webhook verified; follow event saves lineUserId ✅

---

## Phase 13 — Cron Handlers (Reminders + Summaries)
**Goal:** 4 cron jobs query DB and send LINE Push messages.

- [x] Cron 1 — daily reminder at user's `reminderTime` (default 18:00 Bangkok)
  - [x] Only users with `reminderEnabled=true` and `lineUserId` set
- [x] Cron 2 — check-in at 21:00 if no workout logged today
- [x] Cron 3 — weekly summary Sunday 20:00 (workouts done, volume, streak)
- [x] Cron 4 — streak warning at 21:00 if streak > 0 and no workout today
- [x] All messages deep-link to `WEB_APP_URL/workout/...`
- [x] Log each send to `reminderLog` table
- [x] Idempotent: skip if already sent today for same type
- [x] Verify: manually trigger each handler → correct users receive messages → logged in reminderLog

**Phase 13 done when:** All 4 crons fire correctly; reminderLog populated ✅

---

## Phase 14 — Tests + Docs + Deployment Guide
**Goal:** Green tests, complete docs, deployment playbook.

### Tests
- [x] Unit tests (Vitest):
  - [x] estimate1RM — normal reps, reps=1, reps>12 returns null
  - [x] calculateVolume — normal sets, bodyweight sets (null weightKg)
  - [x] Streak logic — consecutive days, gap > 1, grace day within 7-day window
  - [x] PR detection — new PR, no PR, tie
  - [x] Decimal normalizer — comma → dot
- [x] Integration tests:
  - [x] Workout logger auto-save flow (debounce + optimistic)
  - [x] IndexedDB queue reconciliation on reconnect
  - [x] PR detection on set completion
  - [x] DB client against both node-postgres and neon-http
- [x] `biome check .` passes across all packages
- [x] `vitest` passes

### README.md
- [x] Project overview (1 paragraph)
- [x] Architecture diagram (ASCII)
- [x] Quick start (3 commands)
- [x] Detailed setup (Docker, Bun, pnpm)
- [x] Docker commands cheatsheet
- [x] DB commands cheatsheet
- [x] Dev workflow
- [x] Test login: dev@saifit.local / devpassword123
- [x] Tech stack summary
- [x] Placeholder content list (GIF URLs, LINE OA ID, etc.)

### DEPLOYMENT.md
- [x] Neon: project creation, connection string, branch setup (main + dev branch)
- [x] Better Auth: generate BETTER_AUTH_SECRET, set LINE + Google OAuth credentials
- [x] LINE Developers Console: Login channel (for Better Auth), Messaging API channel (for bot), tokens
- [x] Vercel: repo connect, env vars, deploy
- [x] Cloudflare Workers: wrangler login, secrets, cron config, deploy
- [x] Set webhook URL in LINE console
- [x] Smoke test checklist: sign up → onboard → start program → log workout → see progress → receive LINE reminder

### Cost estimates
- [x] 100 users (free tiers)
- [x] 1,000 users (what breaks first)
- [x] 10,000 users (upgrade path + estimated cost)

**Phase 14 done when:** All tests pass, biome clean, both docs complete ✅

---

## Phase summary

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Monorepo + Docker Compose | ✅ |
| 2 | Drizzle Schema + Exercises Seed | ✅ |
| 3 | Templates Seed + Dev User | ✅ |
| 4 | Next.js Setup | ✅ |
| 5 | Auth + Onboarding | ✅ |
| 6 | Templates Browser + Program Selection | ✅ |
| 7 | Workout Logger ⭐ | ✅ |
| 8 | Workout History | ✅ |
| 9 | Exercise Library | ✅ |
| 10 | Progress Dashboard | ✅ |
| 11 | Settings + PWA | ✅ |
| 12 | LINE Bot Setup | ✅ |
| 13 | Cron Handlers | ✅ |
| 14 | Tests + Docs + Deployment | ✅ |

---

## Stack change: Supabase → Neon + Better Auth
- Neon replaces Supabase Postgres (no project pause, no lock-in, standard pg_dump migration)
- Better Auth replaces Supabase Auth (open-source, LINE OAuth built-in, Drizzle adapter)
- Auth enforced at API middleware layer (not DB-level RLS)
- New env vars: `DATABASE_URL` (Neon), `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `LINE_LOGIN_CHANNEL_ID`, `LINE_LOGIN_CHANNEL_SECRET`
- Removed env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

## Amendments from multi-agent review (already incorporated above)
- serwist replaces next-pwa (App Router compatibility)
- Exercise picker included in Phase 7 (not deferred to Phase 9)
- Custom Routines Builder removed from MVP (Phase 11 in original → cut)
- weightKg nullable + isBodyweight flag in schema
- muscleGroups as array (dual-tagging for compound lifts)
- 1RM suppressed when reps > 12
- Streak grace day (1 per 7-day window)
- Supabase E2E test at Phase 5 (not Phase 14)
- LINE Login prioritized in Phase 5
- Thai as hard default
- Progress dashboard split into Trends + Records tabs
- Onboarding: tap chips + icon cards (no dropdowns/number inputs)
- All required empty/error states listed per phase
