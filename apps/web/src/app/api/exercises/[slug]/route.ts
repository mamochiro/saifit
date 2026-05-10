import { auth } from "@/lib/auth";
import { exercises, getDb, users, workoutSets, workouts } from "@saifit/db";
import { and, desc, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const db = getDb();

  // 1. Fetch exercise by slug (full row)
  const exercise = await db.query.exercises.findFirst({
    where: eq(exercises.slug, slug),
  });

  if (!exercise) {
    return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
  }

  // 2. Try session (optional — no 401 if absent)
  let history: Array<{
    workoutId: string;
    date: string;
    sets: Array<{ setNumber: number; weightKg: string | null; reps: number }>;
  }> | null = null;

  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (session) {
      // Look up our app user by betterAuthId
      const user = await db.query.users.findFirst({
        where: eq(users.betterAuthId, session.user.id),
      });

      if (user) {
        // Fetch last 50 sets for this exercise by this user
        const recentSets = await db
          .select({
            setId: workoutSets.id,
            workoutId: workoutSets.workoutId,
            setNumber: workoutSets.setNumber,
            reps: workoutSets.reps,
            weightKg: workoutSets.weightKg,
            completedAt: workoutSets.completedAt,
            workoutStartedAt: workouts.startedAt,
          })
          .from(workoutSets)
          .innerJoin(workouts, eq(workoutSets.workoutId, workouts.id))
          .where(and(eq(workoutSets.exerciseId, exercise.id), eq(workouts.userId, user.id)))
          .orderBy(desc(workoutSets.completedAt))
          .limit(50);

        // Group by workoutId (insertion order = most-recent first)
        const groupMap = new Map<
          string,
          {
            workoutId: string;
            date: string;
            sets: Array<{ setNumber: number; weightKg: string | null; reps: number }>;
          }
        >();

        for (const s of recentSets) {
          if (!groupMap.has(s.workoutId)) {
            groupMap.set(s.workoutId, {
              workoutId: s.workoutId,
              date:
                s.workoutStartedAt instanceof Date
                  ? s.workoutStartedAt.toISOString()
                  : String(s.workoutStartedAt),
              sets: [],
            });
          }
          groupMap.get(s.workoutId)?.sets.push({
            setNumber: s.setNumber,
            weightKg: s.weightKg !== null ? String(s.weightKg) : null,
            reps: s.reps,
          });
        }

        history = Array.from(groupMap.values()).slice(0, 10);
      }
    }
  } catch {
    // Session check failed — treat as unauthenticated, history stays null
  }

  return NextResponse.json({ data: { ...exercise, history } });
}
