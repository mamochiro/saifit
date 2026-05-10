import { auth } from "@/lib/auth";
import { bodyMeasurements, getDb, users } from "@saifit/db";
import { and, desc, eq, gte } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import * as v from "valibot";

const postSchema = v.object({
  recordedAt: v.pipe(v.string(), v.regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD")),
  weightKg: v.optional(v.nullable(v.pipe(v.number(), v.minValue(0)))),
  bodyFatPct: v.optional(v.nullable(v.pipe(v.number(), v.minValue(0), v.maxValue(100)))),
  chestCm: v.optional(v.nullable(v.pipe(v.number(), v.minValue(0)))),
  waistCm: v.optional(v.nullable(v.pipe(v.number(), v.minValue(0)))),
  armCm: v.optional(v.nullable(v.pipe(v.number(), v.minValue(0)))),
  thighCm: v.optional(v.nullable(v.pipe(v.number(), v.minValue(0)))),
});

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const user = await db.query.users.findFirst({
    where: eq(users.betterAuthId, session.user.id),
    columns: { id: true },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const since = new Date();
  since.setDate(since.getDate() - 90);
  const sinceStr = since.toISOString().slice(0, 10);

  const rows = await db
    .select()
    .from(bodyMeasurements)
    .where(and(eq(bodyMeasurements.userId, user.id), gte(bodyMeasurements.recordedAt, sinceStr)))
    .orderBy(desc(bodyMeasurements.recordedAt));

  return NextResponse.json({ data: rows });
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = v.safeParse(postSchema, body);
  if (!result.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const db = getDb();
  const user = await db.query.users.findFirst({
    where: eq(users.betterAuthId, session.user.id),
    columns: { id: true },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { recordedAt, weightKg, bodyFatPct, chestCm, waistCm, armCm, thighCm } = result.output;

  const [row] = await db
    .insert(bodyMeasurements)
    .values({
      userId: user.id,
      recordedAt,
      weightKg: weightKg != null ? String(weightKg) : null,
      bodyFatPct: bodyFatPct != null ? String(bodyFatPct) : null,
      chestCm: chestCm != null ? String(chestCm) : null,
      waistCm: waistCm != null ? String(waistCm) : null,
      armCm: armCm != null ? String(armCm) : null,
      thighCm: thighCm != null ? String(thighCm) : null,
    })
    .onConflictDoNothing()
    .returning();

  if (!row) {
    await db
      .update(bodyMeasurements)
      .set({
        weightKg: weightKg != null ? String(weightKg) : null,
        bodyFatPct: bodyFatPct != null ? String(bodyFatPct) : null,
        chestCm: chestCm != null ? String(chestCm) : null,
        waistCm: waistCm != null ? String(waistCm) : null,
        armCm: armCm != null ? String(armCm) : null,
        thighCm: thighCm != null ? String(thighCm) : null,
      })
      .where(
        and(eq(bodyMeasurements.userId, user.id), eq(bodyMeasurements.recordedAt, recordedAt)),
      );
  }

  return NextResponse.json({ ok: true });
}
