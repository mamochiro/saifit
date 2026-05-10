import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../../../../packages/db/src/schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;
const pools = new Map<string, Db>();

export function getDb(databaseUrl: string): Db {
  if (!pools.has(databaseUrl)) {
    const pool = new pg.Pool({ connectionString: databaseUrl });
    pools.set(databaseUrl, drizzle(pool, { schema }));
  }
  return pools.get(databaseUrl) as Db;
}
