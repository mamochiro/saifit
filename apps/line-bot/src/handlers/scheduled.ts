import { messagingApi } from "@line/bot-sdk";
import { and, eq, isNotNull } from "drizzle-orm";
import {
  getUsersDueForReminder,
  getUsersWithActiveStreak,
  getUsersWithNoWorkoutToday,
  getWeeklySummary,
} from "../../../../packages/db/src/helpers";
import { reminderLog, users } from "../../../../packages/db/src/schema";
import { getDb } from "../lib/db";
import type { Env } from "../types";

async function handleDailyReminder(env: Env): Promise<void> {
  const db = getDb(env.DATABASE_URL);
  const client = new messagingApi.MessagingApiClient({
    channelAccessToken: env.LINE_CHANNEL_ACCESS_TOKEN,
  });

  const currentHour = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
  ).getHours();

  const dueUsers = await getUsersDueForReminder(db, currentHour);

  for (const user of dueUsers) {
    if (!user.lineUserId) continue;

    const text =
      user.locale === "en"
        ? `Time to work out! 💪 Start here: ${env.WEB_APP_URL}`
        : `สวัสดี! ถึงเวลาออกกำลังกายแล้ว 💪 เริ่มเลยที่: ${env.WEB_APP_URL}`;

    let success = true;
    try {
      await client.pushMessage({
        to: user.lineUserId,
        messages: [{ type: "text", text }],
      });
    } catch (err) {
      success = false;
      console.error("Daily reminder failed for", user.lineUserId, err);
    }

    await db.insert(reminderLog).values({
      userId: user.userId,
      lineUserId: user.lineUserId,
      reminderType: "daily",
      success,
    });
  }
}

async function handleCheckIn(env: Env): Promise<void> {
  const db = getDb(env.DATABASE_URL);
  const client = new messagingApi.MessagingApiClient({
    channelAccessToken: env.LINE_CHANNEL_ACCESS_TOKEN,
  });

  const missedUsers = await getUsersWithNoWorkoutToday(db);

  for (const user of missedUsers) {
    if (!user.lineUserId) continue;

    const text =
      user.locale === "en"
        ? `No workout logged today. Even one set counts! 🏋️ ${env.WEB_APP_URL}`
        : `วันนี้ยังไม่ได้ออกกำลังกายใช่ไหม? บันทึกสักเซ็ตก็ยังดี 🏋️ ${env.WEB_APP_URL}`;

    let success = true;
    try {
      await client.pushMessage({
        to: user.lineUserId,
        messages: [{ type: "text", text }],
      });
    } catch (err) {
      success = false;
      console.error("Check-in failed for", user.lineUserId, err);
    }

    await db.insert(reminderLog).values({
      userId: user.userId,
      lineUserId: user.lineUserId,
      reminderType: "checkin",
      success,
    });
  }
}

async function handleWeeklySummary(env: Env): Promise<void> {
  const db = getDb(env.DATABASE_URL);
  const client = new messagingApi.MessagingApiClient({
    channelAccessToken: env.LINE_CHANNEL_ACCESS_TOKEN,
  });

  const optedInUsers = await db
    .select({ id: users.id, lineUserId: users.lineUserId, locale: users.locale })
    .from(users)
    .where(and(isNotNull(users.lineUserId), eq(users.reminderEnabled, true)));

  for (const user of optedInUsers) {
    if (!user.lineUserId) continue;

    const summary = await getWeeklySummary(db, user.id);
    if (summary.workoutCount === 0) continue;

    const vol = Math.round(summary.totalVolume).toLocaleString();
    const text =
      user.locale === "en"
        ? `This week 📊\n✅ Workouts: ${summary.workoutCount}\n💪 Total volume: ${vol} kg\n🔥 Streak: ${summary.streakDays} days`
        : `สรุปสัปดาห์นี้ 📊\n✅ ออกกำลังกาย: ${summary.workoutCount} ครั้ง\n💪 ปริมาณรวม: ${vol} กก.\n🔥 Streak: ${summary.streakDays} วัน`;

    let success = true;
    try {
      await client.pushMessage({
        to: user.lineUserId,
        messages: [{ type: "text", text }],
      });
    } catch (err) {
      success = false;
      console.error("Weekly summary failed for", user.lineUserId, err);
    }

    await db.insert(reminderLog).values({
      userId: user.id,
      lineUserId: user.lineUserId,
      reminderType: "weekly",
      success,
    });
  }
}

async function handleStreakWarning(env: Env): Promise<void> {
  const db = getDb(env.DATABASE_URL);
  const client = new messagingApi.MessagingApiClient({
    channelAccessToken: env.LINE_CHANNEL_ACCESS_TOKEN,
  });

  const atRiskUsers = await getUsersWithActiveStreak(db);

  for (const user of atRiskUsers) {
    if (!user.lineUserId) continue;

    const text =
      user.locale === "en"
        ? `🔥 Your ${user.currentStreak}-day streak is at risk! Log a set before midnight → ${env.WEB_APP_URL}`
        : `🔥 Streak ${user.currentStreak} วันของคุณกำลังจะหายไป! ออกสักเซ็ตก่อนเที่ยงคืนนะ → ${env.WEB_APP_URL}`;

    let success = true;
    try {
      await client.pushMessage({
        to: user.lineUserId,
        messages: [{ type: "text", text }],
      });
    } catch (err) {
      success = false;
      console.error("Streak warning failed for", user.lineUserId, err);
    }

    await db.insert(reminderLog).values({
      userId: user.userId,
      lineUserId: user.lineUserId,
      reminderType: "streak_warning",
      success,
    });
  }
}

export async function scheduledHandler(
  event: ScheduledEvent,
  env: Env,
  _ctx: ExecutionContext,
): Promise<void> {
  switch (event.cron) {
    case "0 11 * * *":
      await handleDailyReminder(env);
      break;
    case "0 14 * * *":
      await handleCheckIn(env);
      break;
    case "0 13 * * 0":
      await handleWeeklySummary(env);
      break;
    case "30 13 * * *":
      await handleStreakWarning(env);
      break;
    default:
      console.log("Unknown cron:", event.cron);
  }
}
