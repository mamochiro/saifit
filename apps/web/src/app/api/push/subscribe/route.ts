import { auth } from "@/lib/auth";
import { getDb, pushSubscriptions, users } from "@saifit/db";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import * as v from "valibot";

const subscribeSchema = v.object({
  endpoint: v.pipe(v.string(), v.minLength(1), v.maxLength(2048)),
  p256dh: v.pipe(v.string(), v.minLength(1), v.maxLength(512)),
  auth: v.pipe(v.string(), v.minLength(1), v.maxLength(256)),
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

  const result = v.safeParse(subscribeSchema, body);
  if (!result.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const db = getDb();
  const user = await db.query.users.findFirst({
    where: eq(users.betterAuthId, session.user.id),
    columns: { id: true },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { endpoint, p256dh, auth: authKey } = result.output;

  await db
    .insert(pushSubscriptions)
    .values({ userId: user.id, endpoint, p256dh, auth: authKey })
    .onConflictDoUpdate({
      target: pushSubscriptions.endpoint,
      set: { userId: user.id, p256dh, auth: authKey },
    });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = v.safeParse(v.object({ endpoint: v.pipe(v.string(), v.minLength(1)) }), body);
  if (!result.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const db = getDb();
  await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, result.output.endpoint));

  return NextResponse.json({ ok: true });
}
