import { validateSignature } from "@line/bot-sdk";
import type { MiddlewareHandler } from "hono";
import type { Env, Variables } from "../types";

export const verifySignature: MiddlewareHandler<{
  Bindings: Env;
  Variables: Variables;
}> = async (c, next) => {
  const body = await c.req.text();
  const signature = c.req.header("x-line-signature") ?? "";

  const secret = c.env?.LINE_CHANNEL_SECRET ?? process.env.LINE_CHANNEL_SECRET ?? "";
  if (!validateSignature(body, secret, signature)) {
    return c.json({ error: "Invalid signature" }, 401);
  }

  c.set("rawBody", body);
  await next();
  return;
};
