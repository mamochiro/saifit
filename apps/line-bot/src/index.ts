import { Hono } from "hono";
import { scheduledHandler } from "./handlers/scheduled";
import { webhookHandler } from "./handlers/webhook";
import { verifySignature } from "./middleware/verify-signature";
import type { Env, Variables } from "./types";

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.get("/", (c) => c.text("GymPal LINE Bot"));
app.post("/webhook", verifySignature, webhookHandler);

export default {
  fetch: app.fetch,
  scheduled: scheduledHandler,
};
