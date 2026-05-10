import { exercises, getDb } from "@saifit/db";
import { ilike, or } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

const exerciseColumns = {
  id: exercises.id,
  slug: exercises.slug,
  nameEn: exercises.nameEn,
  nameTh: exercises.nameTh,
  category: exercises.category,
  muscleGroups: exercises.muscleGroups,
  equipment: exercises.equipment,
} as const;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q") ?? "";
  const limit = Math.min(Number.parseInt(searchParams.get("limit") ?? "20", 10), 50);

  const db = getDb();

  const rows = await db
    .select(exerciseColumns)
    .from(exercises)
    .where(
      q.trim()
        ? or(
            ilike(exercises.nameEn, `%${q}%`),
            ilike(exercises.nameTh, `%${q}%`),
            ilike(exercises.slug, `%${q}%`),
          )
        : undefined,
    )
    .limit(limit);

  return NextResponse.json({ data: rows });
}
