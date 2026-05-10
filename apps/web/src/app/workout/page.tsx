import { auth } from "@/lib/auth";
import { getDb, users } from "@saifit/db";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function WorkoutIndexPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const db = getDb();
  const user = await db.query.users.findFirst({
    where: eq(users.betterAuthId, session.user.id),
  });
  if (!user) redirect("/sign-in");

  // Create a new workout via direct DB insert
  const [newWorkout] = await db
    .insert((await import("@saifit/db")).workouts)
    .values({
      userId: user.id,
      name: "Workout",
      startedAt: new Date(),
    })
    .returning();

  if (!newWorkout) redirect("/");
  redirect(`/workout/${newWorkout.id}`);
}
