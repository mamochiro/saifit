import { auth } from "@/lib/auth";
import { exercises, getDb, users, workoutSets, workouts } from "@saifit/db";
import { and, asc, eq, gte, sql } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const user = await db.query.users.findFirst({ where: eq(users.betterAuthId, session.user.id) });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const since = new Date();
  since.setDate(since.getDate() - 84); // 12 weeks

  const rows = await db
    .select({
      weekStart: sql<string>`DATE_TRUNC('week', ${workouts.startedAt} AT TIME ZONE 'Asia/Bangkok')`,
      category: exercises.category,
      volume: sql<string>`SUM(${workoutSets.reps} * COALESCE(${workoutSets.weightKg}::numeric, 0))`,
    })
    .from(workoutSets)
    .innerJoin(workouts, eq(workoutSets.workoutId, workouts.id))
    .innerJoin(exercises, eq(workoutSets.exerciseId, exercises.id))
    .where(and(eq(workouts.userId, user.id), gte(workouts.startedAt, since)))
    .groupBy(
      sql`DATE_TRUNC('week', ${workouts.startedAt} AT TIME ZONE 'Asia/Bangkok')`,
      exercises.category,
    )
    .orderBy(asc(sql`DATE_TRUNC('week', ${workouts.startedAt} AT TIME ZONE 'Asia/Bangkok')`));

  const weekMap = new Map<
    string,
    { weekStart: string; totalVolume: number; byCategory: Record<string, number> }
  >();

  for (const row of rows) {
    const weekKey = row.weekStart;
    if (!weekMap.has(weekKey)) {
      weekMap.set(weekKey, { weekStart: weekKey, totalVolume: 0, byCategory: {} });
    }
    const entry = weekMap.get(weekKey);
    if (entry) {
      const vol = Number.parseFloat(row.volume ?? "0");
      entry.totalVolume += vol;
      entry.byCategory[row.category] = (entry.byCategory[row.category] ?? 0) + vol;
    }
  }

  return NextResponse.json({ data: Array.from(weekMap.values()) });
}
