import { serve } from "@hono/node-server";
import { Hono } from "hono";
import cron from "node-cron";
import { scheduledHandler } from "./handlers/scheduled";
import { webhookHandler } from "./handlers/webhook";
import { getDb } from "./lib/db";
import { verifySignature } from "./middleware/verify-signature";
import { type Env, type Variables, envFromProcess } from "./types";

const env: Env = envFromProcess();

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.get("/", (c) => c.text("Saifit LINE Bot"));
app.post("/webhook", verifySignature, webhookHandler);

if (process.env.NODE_ENV !== "production") {
  app.post("/test/trigger-cron", async (c) => {
    const { cron: cronExpr } = await c.req.json<{ cron: string }>();
    await scheduledHandler({ cron: cronExpr, env });
    return c.json({ ok: true });
  });
}

const PORT = Number(process.env.PORT ?? 3001);
serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`LINE bot listening on :${PORT}`);
});

// Cron jobs — UTC times matching Bangkok UTC+7 schedule
cron.schedule("0 11 * * *", () => scheduledHandler({ cron: "0 11 * * *", env })); // 18:00 Bangkok daily reminder
cron.schedule("0 14 * * *", () => scheduledHandler({ cron: "0 14 * * *", env })); // 21:00 Bangkok check-in
cron.schedule("0 13 * * 0", () => scheduledHandler({ cron: "0 13 * * 0", env })); // Sun 20:00 Bangkok weekly summary
cron.schedule("30 13 * * *", () => scheduledHandler({ cron: "30 13 * * *", env })); // 20:30 Bangkok streak warning

getDb(env.DATABASE_URL);
