# /db-reset — Full database reset and reseed

Resets the local Docker Postgres and re-seeds from scratch. Steps:

1. Warn the user: "This will wipe all local data. Confirm? (y/n)"
2. Run `docker compose down -v` to remove volumes
3. Run `docker compose up -d` to restart services
4. Wait for Postgres to be ready: `until docker exec gympal-postgres pg_isready -U gympal; do sleep 1; done`
5. Run `pnpm db:migrate` to apply all migrations
6. Run `pnpm db:seed` to seed exercises + templates + dev user
7. Verify:
   - `SELECT COUNT(*) FROM exercises` returns ≥ 100
   - `SELECT COUNT(*) FROM templates` returns 12
   - `SELECT email FROM auth.users WHERE email = 'dev@gympal.local'` returns 1 row
8. Report success or failure with counts.

All commands run from `/Users/sarawut/github/gympal`.
