import type { Env } from "../types";

// TODO: Phase 13 — send daily workout reminders to opted-in users
async function handleDailyReminder(env: Env): Promise<void> {
  console.log("handleDailyReminder: stub", env.WEB_APP_URL);
}

// TODO: Phase 13 — send evening check-in nudge
async function handleCheckIn(env: Env): Promise<void> {
  console.log("handleCheckIn: stub", env.WEB_APP_URL);
}

// TODO: Phase 13 — send weekly workout summary to opted-in users
async function handleWeeklySummary(env: Env): Promise<void> {
  console.log("handleWeeklySummary: stub", env.WEB_APP_URL);
}

// TODO: Phase 13 — warn users whose streak is at risk
async function handleStreakWarning(env: Env): Promise<void> {
  console.log("handleStreakWarning: stub", env.WEB_APP_URL);
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
