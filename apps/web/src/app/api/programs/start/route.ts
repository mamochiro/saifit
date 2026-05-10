import { auth } from "@/lib/auth";
import { getDb, userPrograms, users } from "@saifit/db";
import { and, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import * as v from "valibot";

const startSchema = v.object({
  templateId: v.pipe(v.string(), v.uuid()),
});

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = v.safeParse(startSchema, body);
  if (!result.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const db = getDb();
  const user = await db.query.users.findFirst({ where: eq(users.betterAuthId, session.user.id) });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Deactivate any existing active program
  await db
    .update(userPrograms)
    .set({ isActive: false, endedAt: new Date() })
    .where(and(eq(userPrograms.userId, user.id), eq(userPrograms.isActive, true)));

  // Create new program
  const [newProgram] = await db
    .insert(userPrograms)
    .values({
      userId: user.id,
      templateId: result.output.templateId,
      isActive: true,
    })
    .returning();

  return NextResponse.json({ data: newProgram }, { status: 201 });
}
