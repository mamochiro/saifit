import { validateSignature } from "@line/bot-sdk";
import type { MiddlewareHandler } from "hono";
import type { Env, Variables } from "../types";

export const verifySignature: MiddlewareHandler<{
  Bindings: Env;
  Variables: Variables;
}> = async (c, next) => {
  const body = await c.req.text();
  const signature = c.req.header("x-line-signature") ?? "";

  if (!validateSignature(body, c.env.LINE_CHANNEL_SECRET, signature)) {
    return c.json({ error: "Invalid signature" }, 401);
  }

  c.set("rawBody", body);
  await next();
  return;
};
