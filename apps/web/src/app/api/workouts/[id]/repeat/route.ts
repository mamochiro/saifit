import { auth } from "@/lib/auth";
import { getDb, users, workouts } from "@saifit/db";
import { and, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const user = await db.query.users.findFirst({ where: eq(users.betterAuthId, session.user.id) });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const original = await db.query.workouts.findFirst({
    where: and(eq(workouts.id, id), eq(workouts.userId, user.id)),
  });
  if (!original) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [newWorkout] = await db
    .insert(workouts)
    .values({ userId: user.id, name: original.name, startedAt: new Date() })
    .returning();

  if (!newWorkout) return NextResponse.json({ error: "Failed to create" }, { status: 500 });

  return NextResponse.json({ data: { id: newWorkout.id } }, { status: 201 });
}
