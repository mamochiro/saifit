import { auth } from "@/lib/auth";
import { getDb, users, workouts } from "@saifit/db";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const user = await db.query.users.findFirst({
    where: eq(users.betterAuthId, session.user.id),
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const workoutRows = await db.query.workouts.findMany({
    where: eq(workouts.userId, user.id),
    with: { sets: true },
    orderBy: (w, { desc }) => [desc(w.startedAt)],
  });

  const payload = JSON.stringify({ user, workouts: workoutRows }, null, 2);

  return new NextResponse(payload, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": 'attachment; filename="saifit-export.json"',
    },
  });
}
