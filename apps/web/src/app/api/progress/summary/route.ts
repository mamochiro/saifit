import { auth } from "@/lib/auth";
import { getDb, streaks, users, workoutSets, workouts } from "@saifit/db";
import { count, eq, sql } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const user = await db.query.users.findFirst({ where: eq(users.betterAuthId, session.user.id) });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const [streak, workoutStats] = await Promise.all([
    db.query.streaks.findFirst({ where: eq(streaks.userId, user.id) }),
    db
      .select({
        totalWorkouts: count(workouts.id),
        totalVolume: sql<string>`COALESCE(SUM(${workoutSets.reps} * COALESCE(${workoutSets.weightKg}::numeric, 0)), 0)`,
      })
      .from(workouts)
      .leftJoin(workoutSets, eq(workoutSets.workoutId, workouts.id))
      .where(eq(workouts.userId, user.id)),
  ]);

  const stats = workoutStats[0];

  return NextResponse.json({
    data: {
      totalWorkouts: stats?.totalWorkouts ?? 0,
      totalVolume: Number.parseFloat(stats?.totalVolume ?? "0"),
      currentStreak: streak?.currentStreak ?? 0,
      longestStreak: streak?.longestStreak ?? 0,
      lastWorkoutDate:
        streak?.lastWorkoutDate instanceof Date
          ? streak.lastWorkoutDate.toISOString()
          : streak?.lastWorkoutDate
            ? String(streak.lastWorkoutDate)
            : null,
    },
  });
}
