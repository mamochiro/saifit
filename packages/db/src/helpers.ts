import { and, eq, gt, isNotNull, sql } from "drizzle-orm";
import { getDb } from "./client";
import { streaks, templates, userPrograms, users, workoutSets, workouts } from "./schema";

type Db = ReturnType<typeof getDb>;

// ─── Existing helper ──────────────────────────────────────────────────────────

/**
 * Returns the user's active program with its template nested, or null if none exists.
 * Uses an INNER JOIN so the result is only returned when a template is linked.
 */
export async function getUserActiveProgram(userId: string) {
  const db = getDb();

  const [row] = await db
    .select({
      id: userPrograms.id,
      userId: userPrograms.userId,
      templateId: userPrograms.templateId,
      startedAt: userPrograms.startedAt,
      endedAt: userPrograms.endedAt,
      isActive: userPrograms.isActive,
      template: {
        id: templates.id,
        nameEn: templates.nameEn,
        nameTh: templates.nameTh,
        descriptionEn: templates.descriptionEn,
        descriptionTh: templates.descriptionTh,
        goal: templates.goal,
        difficulty: templates.difficulty,
        daysPerWeek: templates.daysPerWeek,
        splitJson: templates.splitJson,
      },
    })
    .from(userPrograms)
    .innerJoin(templates, eq(userPrograms.templateId, templates.id))
    .where(and(eq(userPrograms.userId, userId), eq(userPrograms.isActive, true)))
    .limit(1);

  return row ?? null;
}

export type ActiveProgram = NonNullable<Awaited<ReturnType<typeof getUserActiveProgram>>>;

// ─── LINE bot cron helpers (neon-http compatible) ─────────────────────────────

/**
 * Returns users whose reminder hour matches currentHour and who have not already
 * received a 'daily' reminder today (Bangkok time).
 */
export async function getUsersDueForReminder(
  db: Db,
  currentHour: number,
): Promise<Array<{ userId: string; lineUserId: string | null; locale: string }>> {
  return db
    .select({
      userId: users.id,
      lineUserId: users.lineUserId,
      locale: users.locale,
    })
    .from(users)
    .where(
      and(
        eq(users.reminderEnabled, true),
        isNotNull(users.lineUserId),
        sql`EXTRACT(HOUR FROM ${users.reminderTime}::time) = ${currentHour}`,
        sql`NOT EXISTS (
          SELECT 1 FROM reminder_log rl
          WHERE rl.user_id = ${users.id}
          AND rl.reminder_type = 'daily'
          AND DATE(rl.sent_at AT TIME ZONE 'Asia/Bangkok') = DATE(NOW() AT TIME ZONE 'Asia/Bangkok')
        )`,
      ),
    );
}

/**
 * Returns users who have reminders enabled, a LINE user ID, and no workout started
 * today (Bangkok midnight) — indicating they should be nudged.
 */
export async function getUsersWithNoWorkoutToday(
  db: Db,
): Promise<Array<{ userId: string; lineUserId: string | null; locale: string }>> {
  return db
    .select({
      userId: users.id,
      lineUserId: users.lineUserId,
      locale: users.locale,
    })
    .from(users)
    .where(
      and(
        isNotNull(users.lineUserId),
        eq(users.reminderEnabled, true),
        sql`NOT EXISTS (
          SELECT 1 FROM workouts w
          WHERE w.user_id = ${users.id}
          AND w.started_at >= DATE_TRUNC('day', NOW() AT TIME ZONE 'Asia/Bangkok') AT TIME ZONE 'Asia/Bangkok'
        )`,
      ),
    );
}

/**
 * Returns a weekly summary for a user: workout count, total volume (kg × reps),
 * current streak days, and longest streak. Uses 3 separate queries.
 */
export async function getWeeklySummary(
  db: Db,
  userId: string,
): Promise<{
  workoutCount: number;
  totalVolume: number;
  streakDays: number;
  longestStreak: number;
}> {
  const [countRow] = await db
    .select({ value: sql<number>`COUNT(*)::int` })
    .from(workouts)
    .where(
      and(
        eq(workouts.userId, userId),
        isNotNull(workouts.completedAt),
        sql`${workouts.completedAt} >= NOW() - INTERVAL '7 days'`,
      ),
    );

  const [volRow] = await db
    .select({
      value: sql<number>`COALESCE(SUM(${workoutSets.weightKg}::numeric * ${workoutSets.reps}::numeric), 0)::float`,
    })
    .from(workoutSets)
    .innerJoin(workouts, eq(workoutSets.workoutId, workouts.id))
    .where(
      and(
        eq(workouts.userId, userId),
        isNotNull(workouts.completedAt),
        sql`${workouts.completedAt} >= NOW() - INTERVAL '7 days'`,
        isNotNull(workoutSets.weightKg),
      ),
    );

  const [streakRow] = await db
    .select({ currentStreak: streaks.currentStreak, longestStreak: streaks.longestStreak })
    .from(streaks)
    .where(eq(streaks.userId, userId))
    .limit(1);

  return {
    workoutCount: Number(countRow?.value ?? 0),
    totalVolume: Number(volRow?.value ?? 0),
    streakDays: streakRow?.currentStreak ?? 0,
    longestStreak: streakRow?.longestStreak ?? 0,
  };
}

/**
 * Returns users with an active streak (currentStreak > 0) and a LINE user ID,
 * who have not yet completed a workout today (Bangkok time).
 */
export async function getUsersWithActiveStreak(db: Db): Promise<
  Array<{
    userId: string;
    lineUserId: string | null;
    locale: string;
    currentStreak: number;
  }>
> {
  return db
    .select({
      userId: users.id,
      lineUserId: users.lineUserId,
      locale: users.locale,
      currentStreak: streaks.currentStreak,
    })
    .from(users)
    .innerJoin(streaks, eq(streaks.userId, users.id))
    .where(
      and(
        gt(streaks.currentStreak, 0),
        isNotNull(users.lineUserId),
        sql`NOT EXISTS (
          SELECT 1 FROM workouts w
          WHERE w.user_id = ${users.id}
          AND w.completed_at >= DATE_TRUNC('day', NOW() AT TIME ZONE 'Asia/Bangkok') AT TIME ZONE 'Asia/Bangkok'
        )`,
      ),
    );
}
