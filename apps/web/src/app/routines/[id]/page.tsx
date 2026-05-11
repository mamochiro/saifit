"use client";

import { ExercisePicker } from "@/app/workout/[id]/components/exercise-picker";
import type { PickedExercise } from "@/app/workout/[id]/components/exercise-picker";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { ExerciseRow, type RoutineExEntry } from "../exercise-row";
import {
  type RoutineExercise,
  useDeleteRoutine,
  useRoutine,
  useStartRoutine,
  useUpdateRoutine,
} from "../hooks";

function toEditEx(ex: RoutineExercise): RoutineExEntry {
  return {
    exerciseId: ex.exerciseId,
    nameEn: ex.nameEn,
    nameTh: ex.nameTh,
    targetSets: ex.targetSets,
    targetReps: ex.targetReps,
    targetWeightKg: ex.targetWeightKg != null ? Number(ex.targetWeightKg) : null,
  };
}

export default function RoutineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations("routines");
  const router = useRouter();
  const { data: routine, isLoading } = useRoutine(id);
  const updateRoutine = useUpdateRoutine(id);
  const deleteRoutine = useDeleteRoutine();
  const startRoutine = useStartRoutine();

  const [name, setName] = useState("");
  const [exercises, setExercises] = useState<RoutineExEntry[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [starting, setStarting] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (routine && !dirty) {
      setName(routine.name);
      setExercises(routine.exercises.map(toEditEx));
    }
  }, [routine, dirty]);

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
    setDirty(true);
  }

  function moveEx(index: number, dir: -1 | 1) {
    setExercises((prev) => {
      const next = [...prev];
      const swap = next[index + dir];
      const cur = next[index];
      if (!cur || !swap) return prev;
      next[index] = swap;
      next[index + dir] = cur;
      return next;
    });
    setDirty(true);
  }

  async function handleSave() {
    if (!name.trim()) return;
    await updateRoutine.mutateAsync({
      name: name.trim(),
      exercises: exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        targetSets: ex.targetSets,
        targetReps: ex.targetReps,
        targetWeightKg: ex.targetWeightKg,
      })),
    });
    setDirty(false);
  }

  async function handleStart() {
    setStarting(true);
    try {
      const workoutId = await startRoutine.mutateAsync(id);
      router.push(`/workout/${workoutId}`);
    } finally {
      setStarting(false);
    }
  }

  async function handleDelete() {
    await deleteRoutine.mutateAsync(id);
    router.push("/routines");
  }

  if (isLoading || !routine) {
    return (
      <div className="saifit-bg" style={{ minHeight: "100vh", padding: "40px 24px 0" }}>
        <div
          style={{
            height: 40,
            width: "50%",
            borderRadius: 10,
            background: "rgba(255,255,255,0.04)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            marginTop: 20,
            height: 200,
            borderRadius: 20,
            background: "rgba(255,255,255,0.04)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      </div>
    );
  }

  return (
    <div className="saifit-bg" style={{ minHeight: "100vh", paddingBottom: 110 }}>
      <div style={{ padding: "40px 24px 0", display: "flex", alignItems: "center", gap: 12 }}>
        <button
          type="button"
          onClick={() => router.push("/routines")}
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
        <div style={{ flex: 1, minWidth: 0 }}>
          <span className="t-label">{t("pageLabel")}</span>
          <h1
            style={{
              fontFamily: "K2D, sans-serif",
              fontWeight: 700,
              fontSize: 22,
              color: "var(--ink)",
              lineHeight: 1.2,
              margin: "2px 0 0",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {t("editTitle")}
          </h1>
        </div>
      </div>

      <div style={{ padding: "20px 24px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        <button
          type="button"
          className="btn-primary"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
          onClick={handleStart}
          disabled={starting || exercises.length === 0}
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
            <path d="M4 3l9 5-9 5V3z" fill="currentColor" stroke="none" />
          </svg>
          {starting ? t("starting") : t("startWorkout")}
        </button>

        <div>
          <label
            htmlFor="routine-name-edit"
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
            id="routine-name-edit"
            className="glass-input"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setDirty(true);
            }}
            style={{ width: "100%" }}
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
                onChange={(patch) => {
                  setExercises((p) => p.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
                  setDirty(true);
                }}
                onMove={(dir) => moveEx(i, dir)}
                onRemove={() => {
                  setExercises((p) => p.filter((_, idx) => idx !== i));
                  setDirty(true);
                }}
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

        {dirty && (
          <button
            type="button"
            className="btn-primary"
            style={{ width: "100%" }}
            onClick={handleSave}
            disabled={!name.trim() || updateRoutine.isPending}
          >
            {updateRoutine.isPending ? t("saving") : t("save")}
          </button>
        )}

        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              fontFamily: "K2D, sans-serif",
              fontSize: 13,
              color: "var(--ink-soft)",
              cursor: "pointer",
              padding: "8px 0",
            }}
          >
            {t("delete")}
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              className="btn-glass"
              style={{ flex: 1 }}
              onClick={() => setConfirmDelete(false)}
            >
              {t("cancel")}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              style={{
                flex: 1,
                height: 44,
                borderRadius: 14,
                background: "var(--danger)",
                color: "white",
                fontFamily: "K2D, sans-serif",
                fontWeight: 700,
                fontSize: 14,
                border: "none",
                cursor: "pointer",
              }}
            >
              {t("delete")}
            </button>
          </div>
        )}
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
              workoutId="routine-editor"
              onClose={() => setShowPicker(false)}
              onSelect={handlePickExercise}
            />
          </div>
        </div>
      )}
    </div>
  );
}
