# Saifit — Deployment Guide

End-to-end deployment: Neon → Vercel → Cloudflare Workers → LINE Console.

---

## Prerequisites Checklist

Accounts required before starting:

- [ ] [Neon](https://neon.tech) — serverless Postgres (free tier is sufficient to start)
- [ ] [Vercel](https://vercel.com) — Next.js hosting
- [ ] [Cloudflare](https://dash.cloudflare.com) — Workers (LINE bot)
- [ ] [LINE Developers Console](https://developers.line.biz) — two channels needed
- [ ] [Google Cloud Console](https://console.cloud.google.com) — OAuth 2.0 credentials

---

## 1. Neon — Database

### Create project

1. Sign in to [neon.tech](https://neon.tech)
2. New Project → name it `saifit` → Region: `Asia Pacific (Singapore)` (closest to Bangkok)
3. Copy the **connection string** — it looks like:
   ```
   postgresql://saifit_owner:PASS@ep-xxx-xxx.ap-southeast-1.aws.neon.tech/saifit?sslmode=require
   ```

### Run migrations

Set `DATABASE_URL` to the Neon connection string, then:

```bash
pnpm db:migrate
pnpm db:seed
```

Verify:

```bash
# Open Drizzle Studio pointed at Neon
DATABASE_URL=<neon-url> pnpm db:studio
```

### Branch strategy (recommended)

Neon supports database branches (like git branches). Use:

- `main` branch → production (`DATABASE_URL` on Vercel)
- `dev` branch → staging/preview (`DATABASE_URL` on Vercel preview deployments)

Create via Neon Console → Branches → New Branch.

---

## 2. Better Auth — Secret Generation

Generate a secure secret (minimum 32 characters):

```bash
openssl rand -base64 32
```

Save the output as `BETTER_AUTH_SECRET`. This signs all sessions — rotate it only if compromised (all existing sessions will be invalidated).

`BETTER_AUTH_URL` must be your production URL (e.g. `https://saifit.vercel.app`).

---

## 3. LINE Developers Console

You need **two separate LINE channels**:

### Channel 1: LINE Login (for Better Auth OAuth)

1. LINE Developers Console → Create new channel → **LINE Login**
2. Channel name: `Saifit`
3. App type: `Web app`
4. Callback URL: `https://YOUR_VERCEL_URL/api/auth/callback/line`
5. Collect from **Basic settings** tab:
   ```
   LINE_LOGIN_CHANNEL_ID=xxxxxxxxxx
   LINE_LOGIN_CHANNEL_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### Channel 2: Messaging API (for the LINE bot)

1. LINE Developers Console → Create new channel → **Messaging API**
2. Channel name: `Saifit Bot`
3. From **Messaging API** tab → Issue **Channel access token (long-lived)**:
   ```
   LINE_CHANNEL_ACCESS_TOKEN=<long token from console>
   LINE_CHANNEL_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. Webhook URL is set **after** Cloudflare deployment (see Step 6).

---

## 4. Google OAuth (optional)

If you want Google login:

1. [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID → Web application
3. Authorized redirect URIs: `https://YOUR_VERCEL_URL/api/auth/callback/google`
4. Copy:
   ```
   GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-xxxx
   ```

---

## 5. Vercel — Web App

### Connect repository

1. [vercel.com/new](https://vercel.com/new) → Import Git Repository
2. Select the `saifit` repo
3. Framework Preset: **Next.js**
4. Root Directory: `apps/web`
5. Build Command: `cd ../.. && pnpm build --filter=@saifit/web`
6. Output Directory: `.next`

### Environment variables

Add all of these in Vercel → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Neon connection string (main branch) |
| `BETTER_AUTH_SECRET` | Output of `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | `https://your-app.vercel.app` |
| `LINE_LOGIN_CHANNEL_ID` | From LINE Login channel |
| `LINE_LOGIN_CHANNEL_SECRET` | From LINE Login channel |
| `GOOGLE_CLIENT_ID` | From Google Cloud (optional) |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud (optional) |

### Deploy

```bash
# First deploy via Vercel dashboard, then subsequent deploys on git push.
# Or deploy manually:
npx vercel --prod
```

Note your production URL (e.g. `https://saifit.vercel.app`). Update:
- `BETTER_AUTH_URL` → production URL
- Google OAuth redirect URI → production URL
- LINE Login callback URL → production URL

---

## 6. Cloudflare Workers — LINE Bot

### Install Wrangler

```bash
pnpm add -g wrangler
wrangler login
```

### Set secrets

```bash
cd apps/line-bot

wrangler secret put DATABASE_URL
# Paste: postgresql://...@ep-xxx.neon.tech/saifit?sslmode=require

wrangler secret put LINE_CHANNEL_ACCESS_TOKEN
# Paste: long-lived token from Messaging API channel

wrangler secret put LINE_CHANNEL_SECRET
# Paste: channel secret

wrangler secret put WEB_APP_URL
# Paste: https://saifit.vercel.app
```

### Deploy

```bash
wrangler deploy
```

Output will show your Worker URL:
```
https://saifit-line-bot.YOUR_SUBDOMAIN.workers.dev
```

### Cron triggers

The four cron jobs are already defined in `wrangler.toml`:

| Cron (UTC) | Bangkok time | Purpose |
|-----------|-------------|---------|
| `0 11 * * *` | 18:00 daily | Daily workout reminder |
| `0 14 * * *` | 21:00 daily | Check-in (no workout logged) |
| `0 13 * * 0` | 20:00 Sunday | Weekly summary |
| `30 13 * * *` | 20:30 daily | Streak warning |

These are activated automatically on `wrangler deploy`.

---

## 7. Set Webhook URL in LINE Console

After Cloudflare deployment:

1. LINE Developers Console → your **Messaging API** channel
2. Messaging API tab → Webhook settings
3. Webhook URL:
   ```
   https://saifit-line-bot.YOUR_SUBDOMAIN.workers.dev/webhook
   ```
4. Enable **Use webhook** toggle
5. Click **Verify** — you should see a green success response

---

## 8. Post-Deploy Smoke Test

Run through this checklist on production after every deployment:

- [ ] **Sign up** — open `https://your-app.vercel.app/sign-in`, create account with LINE Login
- [ ] **Onboard** — complete all 4 onboarding questions (goal, experience, days/week, gym type)
- [ ] **Select program** — browse `/templates`, activate "Beginner Full Body 3-Day"
- [ ] **Log workout** — start workout, log 3 sets with weight + reps, complete workout
- [ ] **Check history** — navigate to `/workout/history`, verify workout appears with correct volume
- [ ] **Check progress** — navigate to `/progress`, verify streak and workout count are correct
- [ ] **LINE reminder** — trigger a cron manually via Cloudflare Dashboard → Workers → Triggers; verify LINE message received
- [ ] **Install PWA** — visit site twice on mobile Chrome/Safari, confirm install prompt appears

---

## Cost Estimates

| Scale | Neon | Vercel | Cloudflare Workers | Total |
|-------|------|--------|--------------------|-------|
| **100 users** | Free (0.5 GB storage, 190 compute hours/mo) | Hobby (free) | Free (100k req/day) | **$0/mo** |
| **1,000 users** | Free tier may hit connection limits — consider [connection pooling](https://neon.tech/docs/connect/connection-pooling) or upgrade to Launch ($19/mo) | Pro ($20/mo) for better build minutes + bandwidth | Free tier covers typical usage | **$20–39/mo** |
| **10,000 users** | Launch ($19/mo) — 10 GB storage, 300 compute hours, connection pooling | Pro ($20/mo) | Paid ($5/mo) — 10M req/mo included | **~$44/mo** |

**What breaks first at scale:**
- Neon free tier: 5 simultaneous connections, 0.5 GB storage — hits at ~200 active users
- Vercel Hobby: 100 GB bandwidth/mo, limited build minutes
- Cloudflare Workers free: 100k requests/day — LINE messaging volume determines this

**Cost optimization tips:**
- Enable Neon [connection pooling](https://neon.tech/docs/connect/connection-pooling) (PgBouncer) before upgrading tier
- Use Vercel's `DATABASE_URL` preview environment pointing at a Neon `dev` branch to avoid prod traffic in CI
- Cache exercise library responses (they're public + static) with `stale-time: Infinity` in TanStack Query
