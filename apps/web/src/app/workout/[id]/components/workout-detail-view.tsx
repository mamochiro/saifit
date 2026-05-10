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
      <div style={{ display: "flex", gap: 12 }}>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="btn-glass"
          style={{ flex: 1, height: 52 }}
        >
          ยกเลิก
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          style={{
            flex: 1,
            height: 52,
            borderRadius: 14,
            background: "var(--danger)",
            color: "white",
            fontFamily: "K2D, sans-serif",
            fontWeight: 700,
            fontSize: 15,
            border: "none",
            cursor: "pointer",
            opacity: loading ? 0.5 : 1,
          }}
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
      className="btn-glass"
      style={{ width: "100%", height: 52 }}
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
    <div className="saifit-bg" style={{ minHeight: "100vh", paddingBottom: 110 }}>
      {/* Summary card */}
      <div style={{ padding: "40px 24px 0" }}>
        <span className="t-label">SUMMARY</span>
        <div className="glass glass-glow" style={{ padding: "20px 22px", marginTop: 10 }}>
          <h1
            style={{
              fontFamily: "K2D, sans-serif",
              fontWeight: 700,
              fontSize: 20,
              color: "var(--ink)",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {workout.name}
          </h1>
          <p
            style={{
              fontFamily: "K2D, sans-serif",
              fontSize: 12,
              color: "var(--ink-soft)",
              marginTop: 4,
            }}
          >
            {formatDate(workout.startedAt)}
            {workout.durationSeconds ? ` · ${formatDuration(workout.durationSeconds)}` : ""}
          </p>
          {totalVolume > 0 && (
            <div style={{ marginTop: 12 }}>
              <span className="t-num" style={{ fontSize: 36, color: "var(--ink)" }}>
                {formatVolume(totalVolume)}
              </span>
              <span
                style={{
                  fontFamily: "K2D, sans-serif",
                  fontSize: 13,
                  color: "var(--ink-mute)",
                  marginLeft: 6,
                }}
              >
                กก. รวม
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Exercise sections */}
      <div style={{ padding: "16px 24px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        {exerciseGroups.map(({ exercise, sets }) => (
          <div
            key={exercise?.id ?? sets[0]?.exerciseId}
            className="glass"
            style={{ padding: "16px 18px" }}
          >
            <p
              style={{
                fontFamily: "K2D, sans-serif",
                fontWeight: 600,
                fontSize: 15,
                color: "var(--ink)",
                lineHeight: 1.3,
                marginBottom: 2,
              }}
            >
              {exercise?.nameTh ?? exercise?.nameEn ?? "Exercise"}
            </p>
            {exercise?.muscleGroups && exercise.muscleGroups.length > 0 && (
              <p
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--ink-soft)",
                  marginBottom: 12,
                }}
              >
                {exercise.muscleGroups.join(" · ")}
              </p>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {sets.map((set, idx) => (
                <div
                  key={set.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: idx < sets.length - 1 ? "1px solid var(--glass-line)" : "none",
                  }}
                >
                  <span
                    className="t-num"
                    style={{ fontSize: 13, color: "var(--ink-soft)", width: 20 }}
                  >
                    {set.setNumber}
                  </span>
                  <span className="t-num" style={{ fontSize: 15, color: "var(--ink)" }}>
                    {set.isBodyweight ? "BW" : (set.weightKg ?? "—")} kg × {set.reps}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Delete button */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "12px 24px",
          background: "rgba(8, 8, 16, 0.75)",
          WebkitBackdropFilter: "blur(20px) saturate(140%)",
          backdropFilter: "blur(20px) saturate(140%)",
          borderTop: "1px solid var(--glass-line)",
        }}
      >
        <DeleteWorkoutButton workoutId={workout.id} />
      </div>
    </div>
  );
}
