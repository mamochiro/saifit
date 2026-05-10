# /migrate — Safe Drizzle migration workflow

Usage: `/migrate <description>`
Example: `/migrate add-grace-day-to-streaks`

Safe workflow for creating and applying a Drizzle migration. Never run destructive migrations without following this process.

## Step 1 — Check current state
```bash
# Show current migration files
ls packages/db/drizzle/migrations/

# Show tables in local DB
docker exec saifit-postgres psql -U saifit -c "\dt public.*"
```

## Step 2 — Edit schema
Before generating the migration, confirm with the user exactly what changed in `packages/db/src/schema.ts`. Show a diff of the schema change.

## Step 3 — Generate migration
```bash
cd packages/db && pnpm db:generate
```

Show the generated SQL from the new migration file. Ask: "Does this SQL look correct? Any destructive operations?"

**STOP if the generated SQL contains:**
- `DROP TABLE` — requires explicit user confirmation
- `DROP COLUMN` — requires explicit user confirmation  
- `ALTER COLUMN ... TYPE` — could lose data, requires explicit user confirmation
- `TRUNCATE` — always stop

## Step 4 — Apply to local DB
```bash
cd packages/db && pnpm db:migrate
```

Verify the migration applied:
```bash
docker exec saifit-postgres psql -U saifit -c "\d public.<affected_table>"
```

## Step 5 — Test that seed still works
```bash
pnpm db:seed
```

If seed fails, the schema change broke something — investigate before proceeding.

## Step 6 — Check for Drizzle type errors
```bash
cd packages/db && bunx tsc --noEmit
cd apps/web && bunx tsc --noEmit
```

Fix any TypeScript errors caused by the schema change before committing.

## Step 7 — Commit
```bash
git add packages/db/drizzle/migrations/ packages/db/src/schema.ts
git commit -m "feat(db): <description>"
```

## Report
After each step: ✅ success / ❌ failed with error message.
Never skip Step 3's destructive-operation check.
