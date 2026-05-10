import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

type DrizzleDb =
  | ReturnType<typeof drizzleNeon<typeof schema>>
  | ReturnType<typeof drizzlePg<typeof schema>>;

let _db: DrizzleDb | null = null;

export function getDb(): DrizzleDb {
  if (_db) return _db;

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  if (url.includes("neon.tech")) {
    const sql = neon(url);
    _db = drizzleNeon(sql, { schema });
  } else {
    const pool = new Pool({ connectionString: url });
    _db = drizzlePg(pool, { schema });
  }

  return _db;
}
