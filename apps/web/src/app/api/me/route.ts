import { auth } from "@/lib/auth";
import { getDb, users } from "@gympal/db";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import * as v from "valibot";

const patchSchema = v.object({
  goal: v.optional(
    v.picklist(["build_muscle", "lose_fat", "get_stronger", "stay_active"] as const),
  ),
  experienceLevel: v.optional(v.picklist(["beginner", "intermediate", "advanced"] as const)),
  daysPerWeek: v.optional(
    v.pipe(
      v.number(),
      v.check((n) => Number.isInteger(n) && n >= 1 && n <= 7, "Days per week must be 1–7"),
    ),
  ),
  gymType: v.optional(v.picklist(["commercial", "home_equipment", "home_no_equipment"] as const)),
  onboardingCompleted: v.optional(v.boolean()),
});

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const user = await db.query.users.findFirst({
    where: eq(users.betterAuthId, session.user.id),
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(user);
}

export async function PATCH(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = v.safeParse(patchSchema, body);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { goal, experienceLevel, daysPerWeek, gymType, onboardingCompleted } = result.output;
  const updateData = Object.fromEntries(
    Object.entries({ goal, experienceLevel, daysPerWeek, gymType, onboardingCompleted }).filter(
      ([, val]) => val !== undefined,
    ),
  );

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ ok: true });
  }

  const db = getDb();
  await db
    .update(users)
    .set({ ...updateData, updatedAt: new Date() })
    .where(eq(users.betterAuthId, session.user.id));

  return NextResponse.json({ ok: true });
}
