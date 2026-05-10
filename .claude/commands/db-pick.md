# /db-pick — Database & Auth provider decision helper

Evaluate the best database + auth stack for GymPal. The user is concerned about cost and vendor lock-in with Supabase. Run this analysis and give a clear recommendation.

## Step 1 — Ask the user two questions before analyzing

1. "Do you already have a Supabase project, or starting fresh?"
2. "How important is LINE Login on day 1 vs. email/password first?"

## Step 2 — Present the comparison table

Evaluate these 3 stacks against GymPal's specific needs:

### Option A — Supabase (original plan)
**DB:** Supabase Postgres  
**Auth:** Supabase Auth (supports LINE Login via custom OAuth)  
**Lock-in risk:** HIGH — Auth, Storage, RLS, and real-time are all Supabase-specific  
**Free tier:** 500MB DB, pauses after 1 week inactivity (big problem for dev), 50K MAU  
**Migration cost:** Auth migration is painful — users tied to Supabase JWTs  
**Complexity:** LOW — everything pre-wired  
**LINE Login:** Supported via custom OAuth provider config  

### Option B — Neon + Better Auth (recommended for low lock-in)
**DB:** Neon serverless Postgres (free: 512MB, no pause, branching for dev)  
**Auth:** Better Auth (open source, self-hosted, supports LINE OAuth natively)  
**Lock-in risk:** LOW — standard Postgres, open-source auth, Drizzle adapter available  
**Free tier:** Neon free is genuinely free (auto-suspend on idle, not project pause)  
**Migration cost:** Almost zero — standard Postgres dump/restore  
**Complexity:** MEDIUM — wire up Better Auth manually, enforce auth at API middleware layer  
**LINE Login:** Better Auth has LINE provider built-in  
**RLS:** Enforce at Next.js middleware layer (not DB layer) — simpler but less secure  

Better Auth docs: https://better-auth.com  
Better Auth LINE provider: built-in OAuth  
Neon free tier: https://neon.tech  

### Option C — Local Postgres only + migrate later
**DB:** Docker Postgres locally → migrate to Neon/Supabase when ready  
**Auth:** Better Auth from day 1  
**Lock-in risk:** NONE during MVP  
**Free tier:** Free (your machine)  
**Complexity:** MEDIUM — same as Option B but no cloud DB until you need it  
**Best for:** If you want to build and test before committing to any cloud provider  

## Step 3 — Recommendation logic

Apply this decision tree:

- If user wants LINE Login on day 1 AND wants minimal setup → **Option A (Supabase)** with a migration exit plan
- If user is worried about lock-in and okay with a bit more wiring → **Option B (Neon + Better Auth)**
- If user wants zero cloud commitment during MVP → **Option C**

**Default recommendation:** Option B — Neon + Better Auth  
Reason: Neon doesn't pause, Drizzle works natively, Better Auth is portable, LINE Login supported, and the escape hatch is a pg_dump.

## Step 4 — If user picks Option B, update the plan

Change these items in CLAUDE.md and SPRINT.md:
- Replace all `Supabase Auth` references with `Better Auth`
- Replace `drizzle-orm/postgres-js` (Supabase) with `drizzle-orm/neon-http` for Neon
- Replace RLS policies with Next.js middleware auth guards
- Phase 5 auth setup: install `better-auth`, configure LINE OAuth provider, wire Drizzle adapter
- Remove Supabase-specific: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Add Neon env vars: `DATABASE_URL` (Neon connection string)

### Better Auth install for GymPal:
```bash
bun add better-auth
```

### Better Auth config skeleton (apps/web/src/lib/auth.ts):
```ts
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@gympal/db"

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  socialProviders: {
    line: {
      clientId: process.env.LINE_LOGIN_CHANNEL_ID!,
      clientSecret: process.env.LINE_LOGIN_CHANNEL_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
})
```

### New .env.example additions:
```
# Neon
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/gympal?sslmode=require

# Better Auth
BETTER_AUTH_SECRET=generate-with-openssl-rand-base64-32
BETTER_AUTH_URL=http://localhost:3000

# LINE Login (for Better Auth)
LINE_LOGIN_CHANNEL_ID=
LINE_LOGIN_CHANNEL_SECRET=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Step 5 — Output

Give the user:
1. A clear recommendation with one-line rationale
2. What changes if they pick Option B (files to update, packages to swap)
3. Ask: "Should I update CLAUDE.md and SPRINT.md with the new stack?"
