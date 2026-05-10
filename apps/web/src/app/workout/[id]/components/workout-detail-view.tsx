"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface WorkoutSet {
  id: string;
  exerciseId: string;
  setNumber: number;
  reps: number;
  weightKg: string | null;
  isBodyweight: boolean;
  exercise: {
    id: string;
    nameEn: string;
    nameTh: string;
    slug: string;
    muscleGroups: string[];
  } | null;
}

interface WorkoutData {
  id: string;
  name: string;
  userId: string;
  startedAt: string;
  completedAt: string | null;
  durationSeconds: number | null;
  notes: string | null;
  sets: WorkoutSet[];
}

function formatDate(s: string): string {
  return new Date(s).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDuration(secs: number): string {
  return `${Math.floor(secs / 60)} นาที`;
}

function formatVolume(n: number): string {
  return new Intl.NumberFormat("th-TH").format(Math.round(n));
}

function DeleteWorkoutButton({ workoutId }: { workoutId: string }) {
  const t = useTranslations("history");
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await fetch(`/api/workouts/${workoutId}`, { method: "DELETE" });
    router.push("/workout/history");
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="flex-1 h-14 border border-border rounded-xl text-sm text-muted-foreground"
        >
          ยกเลิก
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="flex-1 h-14 bg-destructive text-white font-semibold rounded-xl text-sm disabled:opacity-50"
        >
          {loading ? "..." : t("deleteConfirm")}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="w-full h-14 border border-border rounded-xl text-sm text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"
    >
      {t("deleteWorkout")}
    </button>
  );
}

export function WorkoutDetailView({ workout }: { workout: WorkoutData }) {
  const totalVolume = workout.sets.reduce(
    (s, set) => s + set.reps * (Number.parseFloat(set.weightKg ?? "0") || 0),
    0,
  );

  // Group sets by exerciseId in insertion order
  const exerciseGroups = (() => {
    const groups: Map<string, { exercise: WorkoutSet["exercise"]; sets: WorkoutSet[] }> = new Map();
    for (const set of workout.sets) {
      const key = set.exerciseId;
      if (!groups.has(key)) {
        groups.set(key, { exercise: set.exercise, sets: [] });
      }
      const group = groups.get(key);
      if (group) group.sets.push(set);
    }
    return Array.from(groups.values());
  })();

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="px-4 pt-10 pb-6 border-b border-border">
        <h1 className="text-xl font-bold leading-[1.7]">{workout.name}</h1>
        <p className="text-xs text-muted-foreground mt-1 leading-[1.7]">
          {formatDate(workout.startedAt)}
          {workout.durationSeconds ? ` · ${formatDuration(workout.durationSeconds)}` : ""}
        </p>
        {totalVolume > 0 && (
          <p className="font-display tabular-nums text-2xl font-bold mt-2">
            {formatVolume(totalVolume)}{" "}
            <span className="text-sm font-body font-normal text-muted-foreground">กก. รวม</span>
          </p>
        )}
      </div>

      {/* Exercise sections — read-only rows */}
      <div className="px-4 pt-6 space-y-8">
        {exerciseGroups.map(({ exercise, sets }) => (
          <div key={exercise?.id ?? sets[0]?.exerciseId}>
            <h2 className="text-base font-semibold leading-[1.7] mb-1">
              {exercise?.nameTh ?? exercise?.nameEn ?? "Exercise"}
            </h2>
            {exercise?.muscleGroups && exercise.muscleGroups.length > 0 && (
              <p className="text-xs text-muted-foreground mb-3">
                {exercise.muscleGroups.join(" · ")}
              </p>
            )}
            <div className="space-y-0 border border-border rounded-xl overflow-hidden">
              {sets.map((set) => (
                <div
                  key={set.id}
                  className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0"
                >
                  <span className="text-sm text-muted-foreground font-display tabular-nums w-6">
                    {set.setNumber}
                  </span>
                  <span className="flex-1 text-right font-display tabular-nums text-sm">
                    {set.isBodyweight ? "BW" : (set.weightKg ?? "—")} kg × {set.reps}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Fixed delete button at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <DeleteWorkoutButton workoutId={workout.id} />
      </div>
    </div>
  );
}
