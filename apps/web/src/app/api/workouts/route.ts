import { auth } from "@/lib/auth";
import { getDb, userPrograms, users, workouts } from "@saifit/db";
import { and, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import * as v from "valibot";

const createSchema = v.object({
  name: v.optional(v.pipe(v.string(), v.maxLength(256))),
  userProgramId: v.optional(v.pipe(v.string(), v.uuid())),
});

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const parsed = v.safeParse(createSchema, body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const db = getDb();
  const user = await db.query.users.findFirst({ where: eq(users.betterAuthId, session.user.id) });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Verify program belongs to user if provided
  if (parsed.output.userProgramId) {
    const prog = await db.query.userPrograms.findFirst({
      where: and(
        eq(userPrograms.id, parsed.output.userProgramId),
        eq(userPrograms.userId, user.id),
      ),
    });
    if (!prog) return NextResponse.json({ error: "Program not found" }, { status: 404 });
  }

  const [workout] = await db
    .insert(workouts)
    .values({
      userId: user.id,
      userProgramId: parsed.output.userProgramId ?? null,
      name: parsed.output.name ?? "Workout",
      startedAt: new Date(),
    })
    .returning();

  return NextResponse.json({ data: workout }, { status: 201 });
}
