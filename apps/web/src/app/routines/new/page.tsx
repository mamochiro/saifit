"use client";

import { ExercisePicker } from "@/app/workout/[id]/components/exercise-picker";
import type { PickedExercise } from "@/app/workout/[id]/components/exercise-picker";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExerciseRow, type RoutineExEntry } from "../exercise-row";
import { useCreateRoutine } from "../hooks";

export default function NewRoutinePage() {
  const t = useTranslations("routines");
  const router = useRouter();
  const createRoutine = useCreateRoutine();

  const [name, setName] = useState("");
  const [exercises, setExercises] = useState<RoutineExEntry[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  function handlePickExercise(ex: PickedExercise) {
    if (exercises.some((e) => e.exerciseId === ex.id)) return;
    setExercises((prev) => [
      ...prev,
      {
        exerciseId: ex.id,
        nameEn: ex.nameEn,
        nameTh: ex.nameTh,
        targetSets: 3,
        targetReps: "10",
        targetWeightKg: null,
      },
    ]);
    setShowPicker(false);
  }

  function moveExercise(index: number, dir: -1 | 1) {
    setExercises((prev) => {
      const next = [...prev];
      const swap = next[index + dir];
      const cur = next[index];
      if (!cur || !swap) return prev;
      next[index] = swap;
      next[index + dir] = cur;
      return next;
    });
  }

  async function handleSave() {
    if (!name.trim()) return;
    const id = await createRoutine.mutateAsync({
      name: name.trim(),
      exercises: exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        targetSets: ex.targetSets,
        targetReps: ex.targetReps,
        targetWeightKg: ex.targetWeightKg,
      })),
    });
    router.push(`/routines/${id}`);
  }

  return (
    <div className="saifit-bg" style={{ minHeight: "100vh", paddingBottom: 110 }}>
      <div style={{ padding: "40px 24px 0", display: "flex", alignItems: "center", gap: 12 }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid var(--glass-line)",
            color: "var(--ink-mute)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          aria-label={t("cancel")}
        >
          <svg
            viewBox="0 0 24 24"
            width={17}
            height={17}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div>
          <span className="t-label">{t("pageLabel")}</span>
          <h1
            style={{
              fontFamily: "K2D, sans-serif",
              fontWeight: 700,
              fontSize: 22,
              color: "var(--ink)",
              lineHeight: 1.2,
              margin: "2px 0 0",
            }}
          >
            {t("newTitle")}
          </h1>
        </div>
      </div>

      <div style={{ padding: "20px 24px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label
            htmlFor="routine-name"
            style={{
              fontFamily: "system-ui",
              fontSize: 9,
              color: "var(--ink-soft)",
              letterSpacing: "0.14em",
              display: "block",
              marginBottom: 6,
            }}
          >
            {t("name")}
          </label>
          <input
            id="routine-name"
            className="glass-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("namePlaceholder")}
            style={{ width: "100%" }}
            // biome-ignore lint/a11y/noAutofocus: intentional — new routine sheet opens for naming
            autoFocus
          />
        </div>

        <div>
          <div
            style={{
              fontFamily: "system-ui",
              fontSize: 9,
              color: "var(--ink-soft)",
              letterSpacing: "0.14em",
              marginBottom: 8,
            }}
          >
            {t("exercisesLabel")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {exercises.length === 0 && (
              <div
                className="glass"
                style={{
                  padding: 20,
                  textAlign: "center",
                  fontFamily: "K2D, sans-serif",
                  fontSize: 13,
                  color: "var(--ink-soft)",
                }}
              >
                {t("noExercises")}
              </div>
            )}
            {exercises.map((ex, i) => (
              <ExerciseRow
                key={ex.exerciseId}
                ex={ex}
                index={i}
                total={exercises.length}
                onChange={(patch) =>
                  setExercises((prev) => prev.map((e, idx) => (idx === i ? { ...e, ...patch } : e)))
                }
                onMove={(dir) => moveExercise(i, dir)}
                onRemove={() => setExercises((prev) => prev.filter((_, idx) => idx !== i))}
              />
            ))}
            <button
              type="button"
              className="btn-glass"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              onClick={() => setShowPicker(true)}
            >
              <svg
                viewBox="0 0 16 16"
                width={13}
                height={13}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M8 3v10M3 8h10" />
              </svg>
              {t("addExercise")}
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 24px 0" }}>
        <button
          type="button"
          className="btn-primary"
          style={{ width: "100%" }}
          onClick={handleSave}
          disabled={!name.trim() || createRoutine.isPending}
        >
          {createRoutine.isPending ? t("saving") : t("save")}
        </button>
      </div>

      {showPicker && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismiss — mobile touch only
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setShowPicker(false)}
        >
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: inner sheet stop-propagation */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "80vh",
              borderRadius: "20px 20px 0 0",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ExercisePicker
              workoutId="routine-builder"
              onClose={() => setShowPicker(false)}
              onSelect={handlePickExercise}
            />
          </div>
        </div>
      )}
    </div>
  );
}
