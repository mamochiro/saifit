import { auth } from "@/lib/auth";
import { exercises, getDb, users, workoutSets, workouts } from "@saifit/db";
import { and, asc, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import * as v from "valibot";

const patchSchema = v.object({
  name: v.optional(v.pipe(v.string(), v.maxLength(256))),
  notes: v.optional(v.string()),
  completedAt: v.optional(v.pipe(v.string(), v.isoTimestamp())),
  durationSeconds: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0))),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const user = await db.query.users.findFirst({ where: eq(users.betterAuthId, session.user.id) });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const workout = await db.query.workouts.findFirst({
    where: and(eq(workouts.id, id), eq(workouts.userId, user.id)),
  });
  if (!workout) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const sets = await db
    .select({
      id: workoutSets.id,
      workoutId: workoutSets.workoutId,
      exerciseId: workoutSets.exerciseId,
      setNumber: workoutSets.setNumber,
      reps: workoutSets.reps,
      weightKg: workoutSets.weightKg,
      isBodyweight: workoutSets.isBodyweight,
      notes: workoutSets.notes,
      clientSetId: workoutSets.clientSetId,
      completedAt: workoutSets.completedAt,
      exercise: {
        id: exercises.id,
        nameEn: exercises.nameEn,
        nameTh: exercises.nameTh,
        slug: exercises.slug,
        muscleGroups: exercises.muscleGroups,
      },
    })
    .from(workoutSets)
    .leftJoin(exercises, eq(workoutSets.exerciseId, exercises.id))
    .where(eq(workoutSets.workoutId, id))
    .orderBy(asc(workoutSets.setNumber));

  return NextResponse.json({ data: { ...workout, sets } });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = v.safeParse(patchSchema, body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const db = getDb();
  const user = await db.query.users.findFirst({ where: eq(users.betterAuthId, session.user.id) });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const workout = await db.query.workouts.findFirst({
    where: and(eq(workouts.id, id), eq(workouts.userId, user.id)),
  });
  if (!workout) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (parsed.output.name !== undefined) updateData.name = parsed.output.name;
  if (parsed.output.notes !== undefined) updateData.notes = parsed.output.notes;
  if (parsed.output.completedAt !== undefined)
    updateData.completedAt = new Date(parsed.output.completedAt);
  if (parsed.output.durationSeconds !== undefined)
    updateData.durationSeconds = parsed.output.durationSeconds;

  await db.update(workouts).set(updateData).where(eq(workouts.id, id));
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const user = await db.query.users.findFirst({ where: eq(users.betterAuthId, session.user.id) });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const workout = await db.query.workouts.findFirst({
    where: and(eq(workouts.id, id), eq(workouts.userId, user.id)),
  });
  if (!workout) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.delete(workoutSets).where(eq(workoutSets.workoutId, id));
  await db.delete(workouts).where(and(eq(workouts.id, id), eq(workouts.userId, user.id)));

  return NextResponse.json({ ok: true });
}
