import { auth } from "@/lib/auth";
import { getDb, routines, users, workouts } from "@saifit/db";
import { and, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const user = await db.query.users.findFirst({ where: eq(users.betterAuthId, session.user.id) });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { id } = await params;
  const routine = await db.query.routines.findFirst({
    where: and(eq(routines.id, id), eq(routines.userId, user.id)),
  });
  if (!routine) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const now = new Date();
  const [workout] = await db
    .insert(workouts)
    .values({
      userId: user.id,
      name: routine.name,
      startedAt: now,
    })
    .returning();

  if (!workout) return NextResponse.json({ error: "Failed to create workout" }, { status: 500 });

  await db.update(routines).set({ lastUsedAt: now }).where(eq(routines.id, routine.id));

  return NextResponse.json({ data: { workoutId: workout.id, routineId: routine.id } });
}
