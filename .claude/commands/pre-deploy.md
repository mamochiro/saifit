# /pre-deploy — Pre-deployment checklist

Run this before any production deploy. Check each item and report status.

## Code quality
- [ ] `biome check .` passes with zero errors
- [ ] `vitest run` passes with zero failures
- [ ] No `console.log` left in production code (search: `grep -r "console\.log" apps/ packages/ --include="*.ts" --include="*.tsx"`)
- [ ] No hardcoded `localhost` URLs outside of `.env.example` (search: `grep -r "localhost" apps/ --include="*.ts" --include="*.tsx" | grep -v "\.env"`)
- [ ] No `any` types outside SDK boundary files (search: `grep -rn ": any" apps/ packages/ --include="*.ts" --include="*.tsx"`)

## Environment variables
- [ ] All vars in `.env.example` are documented
- [ ] Supabase URL + anon key set in Vercel env
- [ ] Supabase service role key set (NOT exposed to client)
- [ ] LINE_CHANNEL_ACCESS_TOKEN set in Cloudflare Workers secrets
- [ ] LINE_CHANNEL_SECRET set in Cloudflare Workers secrets
- [ ] NEXT_PUBLIC_APP_URL set to production URL (not localhost)

## Database
- [ ] All migrations applied to Supabase production DB
- [ ] RLS enabled on all user-scoped tables
- [ ] E2E auth test passes against Supabase (not just local mock)
- [ ] Seed data NOT in production (dev user dev@saifit.local does not exist in prod)

## PWA
- [ ] Manifest icons present at 192/256/384/512px
- [ ] Service worker registers correctly (check DevTools → Application → Service Workers)
- [ ] Offline shell loads without network

## LINE
- [ ] Webhook URL set in LINE Developers Console (production Workers URL)
- [ ] LINE Login redirect URI updated to production URL
- [ ] Bot sends test message successfully

## Thai locale
- [ ] Run `/thai-check` — all items pass
- [ ] Default locale is `th`

## Performance
- [ ] Lighthouse PWA score ≥ 90
- [ ] Lighthouse Performance score ≥ 80 on mobile throttled

## Smoke test (manual)
- [ ] Sign up with LINE Login → onboarding → home
- [ ] Select template → start program
- [ ] Log a workout (3 sets) → auto-save fires → check DB
- [ ] Go offline → log a set → go online → verify sync
- [ ] View progress → charts render with data
- [ ] Trigger LINE reminder → receive message → deep-link opens app
- [ ] Install PWA → open from home screen → offline shell works

Report: ✅ pass / ❌ fail / ⚠️ warning. Block deploy on any ❌.
