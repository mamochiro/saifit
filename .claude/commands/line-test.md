# /line-test — Test LINE bot locally

Test the LINE bot webhook and cron handlers running via Wrangler dev on :8787.

## 1. Check Wrangler is running
Verify `wrangler dev` is running on port 8787. If not, instruct user to run:
```
cd apps/line-bot && pnpm dev
```

## 2. Signature verification test
Send a test POST to `http://localhost:8787/webhook` with:
- Invalid signature → expect 401
- Valid signature (use test secret from .env) → expect 200

Use curl:
```bash
# Invalid signature (expect 401)
curl -s -o /dev/null -w "%{http_code}" \
  -X POST http://localhost:8787/webhook \
  -H "x-line-signature: invalid" \
  -H "Content-Type: application/json" \
  -d '{"events":[]}'

# Check response is 401
```

## 3. Follow event test
Send a mock LINE follow event to the webhook. Verify:
- Response is 200
- `lineUserId` is saved to the users table in local Postgres

```bash
# Check DB after sending follow event
docker exec gympal-postgres psql -U gympal -c \
  "SELECT line_user_id FROM users WHERE line_user_id IS NOT NULL;"
```

## 4. Cron handler test
Manually trigger each cron handler via HTTP:
```bash
curl -X POST http://localhost:8787/__scheduled?cron=0+11+*+*+*
curl -X POST http://localhost:8787/__scheduled?cron=0+14+*+*+*
curl -X POST http://localhost:8787/__scheduled?cron=0+13+*+*+0
```
Verify `reminderLog` is populated:
```bash
docker exec gympal-postgres psql -U gympal -c \
  "SELECT type, sent_at, delivered FROM reminder_log ORDER BY sent_at DESC LIMIT 10;"
```

## 5. Report
List which tests passed/failed with response codes and DB state.
