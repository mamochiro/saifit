import { messagingApi } from "@line/bot-sdk";
import type { WebhookEvent, WebhookRequestBody } from "@line/bot-sdk";
import { eq } from "drizzle-orm";
import type { Context } from "hono";
import { users } from "../../../../packages/db/src/schema";
import { getDb } from "../lib/db";
import type { Env, Variables } from "../types";

type HonoEnv = { Bindings: Env; Variables: Variables };

async function handleFollowEvent(
  event: Extract<WebhookEvent, { type: "follow" }>,
  env: Env,
): Promise<void> {
  const lineUserId = event.source.userId;
  if (!lineUserId) return;

  console.log("Follow event from LINE user:", lineUserId);

  const db = getDb(env.DATABASE_URL);
  const user = await db.query.users.findFirst({
    where: eq(users.lineUserId, lineUserId),
  });

  if (user) {
    console.log("Matched existing user:", user.id);
  }
}

async function handleUnfollowEvent(
  event: Extract<WebhookEvent, { type: "unfollow" }>,
  env: Env,
): Promise<void> {
  const lineUserId = event.source.userId;
  if (!lineUserId) return;

  const db = getDb(env.DATABASE_URL);
  await db.update(users).set({ reminderEnabled: false }).where(eq(users.lineUserId, lineUserId));

  console.log("Unfollow: disabled reminders for LINE user:", lineUserId);
}

async function handleMessageEvent(
  event: Extract<WebhookEvent, { type: "message" }>,
  env: Env,
): Promise<void> {
  if (event.message.type !== "text") return;

  const text = event.message.text.toLowerCase().trim();
  const client = new messagingApi.MessagingApiClient({
    channelAccessToken: env.LINE_CHANNEL_ACCESS_TOKEN,
  });

  let replyText: string;

  if (text === "help" || text === "ช่วยด้วย") {
    replyText = `GymPal — บันทึกการออกกำลังกายในไม่กี่วินาที\n\nเปิดแอปได้ที่: ${env.WEB_APP_URL}`;
  } else if (text === "status" || text === "สถิติ") {
    replyText = `ดูสถิติของคุณได้ที่: ${env.WEB_APP_URL}/progress`;
  } else {
    replyText = `บันทึกการออกกำลังกายที่: ${env.WEB_APP_URL}`;
  }

  await client.replyMessage({
    replyToken: event.replyToken,
    messages: [{ type: "text", text: replyText }],
  });
}

export async function webhookHandler(c: Context<HonoEnv>): Promise<Response> {
  const rawBody = c.get("rawBody");
  const body = JSON.parse(rawBody) as WebhookRequestBody;

  await Promise.all(
    body.events.map(async (event) => {
      if (event.type === "follow") {
        await handleFollowEvent(event, c.env);
      } else if (event.type === "unfollow") {
        await handleUnfollowEvent(event, c.env);
      } else if (event.type === "message") {
        await handleMessageEvent(event, c.env);
      }
    }),
  );

  return c.json({ status: "ok" });
}
