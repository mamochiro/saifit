import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { WorkoutDetailView } from "./components/workout-detail-view";
import { WorkoutLoggerView } from "./components/workout-logger-view";

export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const res = await fetch(
    `${process.env.BETTER_AUTH_URL ?? "http://localhost:3000"}/api/workouts/${id}`,
    {
      headers: { cookie: (await headers()).get("cookie") ?? "" },
      cache: "no-store",
    },
  );

  if (res.status === 404) notFound();
  if (!res.ok) throw new Error("Failed to load workout");

  const { data: initialWorkout } = await res.json();

  if (initialWorkout.completedAt) {
    return <WorkoutDetailView workout={initialWorkout} />;
  }

  return <WorkoutLoggerView workoutId={id} initialData={initialWorkout} />;
}
