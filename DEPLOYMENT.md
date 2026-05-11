# Saifit — Deployment Guide

End-to-end deployment: VPS (Docker Compose + Caddy) → LINE Console.

---

## Prerequisites Checklist

- [ ] VPS with Docker + Docker Compose installed (Ubuntu 24 LTS recommended; 1 vCPU / 1 GB RAM minimum)
- [ ] Domain name with DNS A record pointing to your VPS IP
- [ ] [LINE Developers Console](https://developers.line.biz) — two channels needed
- [ ] [Google Cloud Console](https://console.cloud.google.com) — OAuth 2.0 credentials (optional)

---

## 1. VPS — Initial Setup

SSH into your server and install Docker:

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
```

Clone the repo and enter the project root:

```bash
git clone https://github.com/YOUR_ORG/saifit.git
cd saifit
```

---

## 2. Environment Variables

Copy the production env template and fill in all values:

```bash
cp .env.prod.example .env.prod
nano .env.prod
```

Key variables to set:

| Variable | Description |
|----------|-------------|
| `DOMAIN` | Your domain (e.g. `saifit.app`) |
| `CADDY_EMAIL` | Email for Let's Encrypt (auto-HTTPS) |
| `POSTGRES_USER` | Postgres username |
| `POSTGRES_PASSWORD` | Strong random password |
| `POSTGRES_DB` | Database name (e.g. `saifit`) |
| `REDIS_PASSWORD` | Strong random password |
| `BETTER_AUTH_SECRET` | Run `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | `https://yourdomain.com` |
| `LINE_LOGIN_CHANNEL_ID` | From LINE Login channel (Step 4) |
| `LINE_LOGIN_CHANNEL_SECRET` | From LINE Login channel (Step 4) |
| `LINE_CHANNEL_ACCESS_TOKEN` | From Messaging API channel (Step 4) |
| `LINE_CHANNEL_SECRET` | From Messaging API channel (Step 4) |
| `VAPID_PUBLIC_KEY` | Run `node scripts/generate-vapid.mjs` |
| `VAPID_PRIVATE_KEY` | Same script |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Same value as `VAPID_PUBLIC_KEY` |
| `WEB_APP_URL` | `https://yourdomain.com` |

Generate VAPID keys for web push:

```bash
node scripts/generate-vapid.mjs
```

---

## 3. Better Auth — Secret

```bash
openssl rand -base64 32
```

Save as `BETTER_AUTH_SECRET`. Rotate only if compromised — all active sessions will be invalidated.

`BETTER_AUTH_URL` must be your production domain (e.g. `https://saifit.app`).

---

## 4. LINE Developers Console

You need **two separate LINE channels**.

### Channel 1: LINE Login (for Better Auth OAuth)

1. LINE Developers Console → Create new channel → **LINE Login**
2. Channel name: `Saifit`
3. App type: `Web app`
4. Callback URL: `https://YOUR_DOMAIN/api/auth/callback/line`
5. Collect:
   ```
   LINE_LOGIN_CHANNEL_ID=xxxxxxxxxx
   LINE_LOGIN_CHANNEL_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### Channel 2: Messaging API (for the LINE bot)

1. LINE Developers Console → Create new channel → **Messaging API**
2. Channel name: `Saifit Bot`
3. Messaging API tab → Issue **Channel access token (long-lived)**:
   ```
   LINE_CHANNEL_ACCESS_TOKEN=<long token from console>
   LINE_CHANNEL_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. Webhook URL is set **after** deployment (see Step 7).

---

## 5. Google OAuth (optional)

1. [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID → Web application
3. Authorized redirect URIs: `https://YOUR_DOMAIN/api/auth/callback/google`
4. Copy:
   ```
   GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-xxxx
   ```

---

## 6. Deploy — Docker Compose

### Run migrations first (one-time)

```bash
# Spin up only Postgres to run migrations
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d postgres
sleep 5

# Run migrations against the production DB
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}" \
  pnpm db:migrate

DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}" \
  pnpm db:seed
```

### Build and start all services

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

This starts:
- `web` — Next.js PWA on port 3000 (internal)
- `line-bot` — Hono/Node.js bot on port 3001 (internal)
- `postgres` — Postgres 16
- `redis` — Redis 7
- `caddy` — Reverse proxy on ports 80/443, auto-HTTPS via Let's Encrypt

Caddy routes:
- `https://yourdomain.com` → `web:3000`
- `https://line.yourdomain.com/webhook` → `line-bot:3001`

> **DNS**: create an A record for `line.yourdomain.com` pointing to the same VPS IP.

### Verify all containers are healthy

```bash
docker compose -f docker-compose.prod.yml ps
```

All services should show `healthy` or `running`.

### View logs

```bash
docker compose -f docker-compose.prod.yml logs -f line-bot
docker compose -f docker-compose.prod.yml logs -f web
```

---

## 7. Set Webhook URL in LINE Console

After deployment:

1. LINE Developers Console → your **Messaging API** channel
2. Messaging API tab → Webhook settings
3. Webhook URL:
   ```
   https://line.yourdomain.com/webhook
   ```
4. Enable **Use webhook** toggle
5. Click **Verify** — you should see a green success response

---

## 8. Cron Jobs

The LINE bot runs four scheduled jobs via `node-cron` (no external scheduler needed):

| Cron (UTC) | Bangkok time | Purpose |
|-----------|-------------|---------|
| `0 11 * * *` | 18:00 daily | Daily workout reminder |
| `0 14 * * *` | 21:00 daily | Check-in (no workout logged) |
| `0 13 * * 0` | 20:00 Sunday | Weekly summary |
| `30 13 * * *` | 20:30 daily | Streak warning |

Jobs start automatically when the `line-bot` container starts.

To trigger a cron manually in development:

```bash
curl -X POST http://localhost:8787/test/trigger-cron \
  -H "Content-Type: application/json" \
  -d '{"cron": "0 11 * * *"}'
```

---

## 9. Updates and Redeploys

```bash
git pull
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build web line-bot
```

Only rebuilds the two app containers; Postgres, Redis, and Caddy stay running.

If there are DB schema changes:

```bash
# Run new migrations before redeploying app containers
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}" \
  pnpm db:migrate

docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build web line-bot
```

---

## 10. Post-Deploy Smoke Test

- [ ] **Sign in** — open `https://yourdomain.com/sign-in`, sign in with LINE Login
- [ ] **Onboard** — complete all 4 onboarding questions (goal, experience, days/week, gym type)
- [ ] **Select program** — browse `/templates`, activate "Beginner Full Body 3-Day"
- [ ] **Log workout** — start workout, log 3 sets with weight + reps, complete workout
- [ ] **Check history** — navigate to `/workout/history`, verify workout appears with correct volume
- [ ] **Check progress** — navigate to `/progress`, verify streak and workout count are correct
- [ ] **LINE reminder** — POST to `/test/trigger-cron` in dev, or wait for 18:00 Bangkok; verify LINE message received
- [ ] **Install PWA** — visit site twice on mobile Chrome/Safari, confirm install prompt appears

---

## 11. Optional: Neon (managed Postgres)

If you prefer managed Postgres instead of self-hosting:

1. Sign up at [neon.tech](https://neon.tech) → New Project → Region: `Asia Pacific (Singapore)`
2. Copy the connection string:
   ```
   postgresql://saifit_owner:PASS@ep-xxx.ap-southeast-1.aws.neon.tech/saifit?sslmode=require
   ```
3. Set `DATABASE_URL` to the Neon string in `.env.prod`
4. In `docker-compose.prod.yml`, remove the `postgres` service and the `DATABASE_URL` build substitution — pass the Neon URL directly to `web` and `line-bot` environment blocks
5. Run `pnpm db:migrate` with the Neon `DATABASE_URL`

> Note: Neon free tier limits: 5 simultaneous connections, 0.5 GB storage. Enable connection pooling before hitting ~200 active users.

---

## 12. Cost Estimates

| Scale | VPS | Domain | Total |
|-------|-----|--------|-------|
| **100 users** | Hetzner CX22 €4/mo (2 vCPU / 4 GB) or DigitalOcean Droplet $6/mo | ~$12/yr | **~$5–6/mo** |
| **1,000 users** | CX32 €9/mo (4 vCPU / 8 GB) — add Neon Launch $19/mo if DB outgrows disk | ~$12/yr | **~$28–30/mo** |
| **10,000 users** | Dedicated or multiple VPS behind load balancer | varies | **custom** |

**What breaks first at scale:**
- Postgres connections: add PgBouncer or switch to Neon with pooling
- Redis memory: default `maxmemory 128mb` in compose — raise on larger plans
- Disk: Postgres data volume on VPS — monitor with `df -h` and expand or offload to Neon
