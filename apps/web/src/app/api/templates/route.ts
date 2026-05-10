import { getDb, templates } from "@saifit/db";
import { and, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const goalParam = searchParams.get("goal");
  const difficultyParam = searchParams.get("difficulty");
  const daysParam = searchParams.get("daysPerWeek");

  const db = getDb();
  const conditions = [];

  if (goalParam)
    conditions.push(
      eq(templates.goal, goalParam as "build_muscle" | "lose_fat" | "get_stronger" | "stay_active"),
    );
  if (difficultyParam)
    conditions.push(
      eq(templates.difficulty, difficultyParam as "beginner" | "intermediate" | "advanced"),
    );
  if (daysParam) {
    const days = Number.parseInt(daysParam, 10);
    if (!Number.isNaN(days)) conditions.push(eq(templates.daysPerWeek, days));
  }

  const rows = await db
    .select({
      id: templates.id,
      slug: templates.slug,
      nameEn: templates.nameEn,
      nameTh: templates.nameTh,
      goal: templates.goal,
      difficulty: templates.difficulty,
      daysPerWeek: templates.daysPerWeek,
      isAdvanced: templates.isAdvanced,
    })
    .from(templates)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  return NextResponse.json({ data: rows });
}
