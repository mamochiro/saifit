"use client";

import { enqueue, getClientId } from "@/lib/workout-queue";
import { normalizeDecimal } from "@saifit/shared";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";

interface WorkoutSet {
  id: string;
  workoutId: string;
  exerciseId: string;
  setNumber: number;
  reps: number;
  weightKg: string | null;
  isBodyweight: boolean;
  completedAt: string;
  exercise: { nameTh: string; nameEn: string } | null;
}

export function SetRow({
  set,
  workoutId,
  onPR,
  onSetComplete,
}: {
  set: WorkoutSet;
  workoutId: string;
  onPR: (exerciseName: string, value: number, type: string) => void;
  onSetComplete: (exerciseName: string, setNumber: number) => void;
}) {
  const t = useTranslations("workout");
  const qc = useQueryClient();

  const [weight, setWeight] = useState(set.weightKg ?? "");
  const [reps, setReps] = useState(String(set.reps));
  const [completed, setCompleted] = useState(!!set.completedAt && set.reps > 0);
  const [undoVisible, setUndoVisible] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveSet = useCallback(
    async (w: string, r: string) => {
      const repsNum = Number.parseInt(r, 10);
      if (Number.isNaN(repsNum) || repsNum < 0) return;
      await enqueue(workoutId, {
        type: "update_set",
        payload: {
          setId: set.id,
          ...(w ? { weightKg: w } : {}),
          reps: repsNum,
        },
      });
      qc.setQueryData<{ sets: WorkoutSet[] }>(["workout", workoutId], (old) => {
        if (!old) return old;
        return {
          ...old,
          sets: old.sets.map((s) =>
            s.id === set.id ? { ...s, weightKg: w || null, reps: repsNum } : s,
          ),
        };
      });
    },
    [set.id, workoutId, qc],
  );

  const debouncedSave = useCallback(
    (w: string, r: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => saveSet(w, r), 300);
    },
    [saveSet],
  );

  const handleComplete = useCallback(async () => {
    const repsNum = Number.parseInt(reps, 10);
    if (Number.isNaN(repsNum) || repsNum <= 0) return;
    const weightKg = weight ? normalizeDecimal(weight) : null;
    const clientSetId = `${getClientId()}-${set.id}`;

    setCompleted(true);
    setUndoVisible(true);
    setTimeout(() => setUndoVisible(false), 3000);

    try {
      const res = await fetch(`/api/workouts/${workoutId}/sets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientSetId,
          exerciseId: set.exerciseId,
          setNumber: set.setNumber,
          weightKg,
          reps: repsNum,
          isBodyweight: set.isBodyweight,
          completedAt: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        const { data } = await res.json();
        if (data.prBeaten && data.newPrValue !== null) {
          const name = set.exercise?.nameTh ?? set.exercise?.nameEn ?? "";
          onPR(name, data.newPrValue, data.prTypes[0] ?? "max_weight");
        }
        qc.invalidateQueries({ queryKey: ["workout", workoutId] });
        const exerciseName = set.exercise?.nameTh ?? set.exercise?.nameEn ?? "";
        onSetComplete(exerciseName, set.setNumber);
      }
    } catch {
      const clientSetId2 = crypto.randomUUID();
      await enqueue(workoutId, {
        type: "create_set",
        payload: {
          clientSetId: clientSetId2,
          workoutId,
          exerciseId: set.exerciseId,
          setNumber: set.setNumber,
          weightKg,
          reps: repsNum,
          isBodyweight: set.isBodyweight ?? false,
          completedAt: new Date().toISOString(),
        },
      });
    }
  }, [reps, weight, set, workoutId, qc, onPR, onSetComplete]);

  // Completed row
  if (completed) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          borderRadius: 14,
          background: "rgba(140,100,255,0.08)",
          border: "1px solid var(--violet-edge)",
          minHeight: 52,
        }}
      >
        <span
          className="t-num"
          style={{ fontSize: 14, color: "var(--ink-soft)", width: 20, flexShrink: 0 }}
        >
          {set.setNumber}
        </span>
        <span className="t-num" style={{ flex: 1, fontSize: 15, color: "var(--ink-mute)" }}>
          {weight || "—"} kg × {reps}
        </span>
        {undoVisible && (
          <button
            type="button"
            onClick={() => {
              setCompleted(false);
              setUndoVisible(false);
            }}
            style={{
              fontFamily: "K2D, sans-serif",
              fontSize: 11,
              color: "var(--ink-soft)",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid var(--glass-line)",
              borderRadius: 8,
              padding: "4px 10px",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            {t("undoAdvance")}
          </button>
        )}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg, oklch(65% 0.22 280), oklch(60% 0.20 240))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="12" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
            <path
              d="M1 5L5 9L13 1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    );
  }

  // Active row
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 14,
        background: "rgba(255,255,255,0.05)",
        border: "1px solid var(--glass-line)",
        minHeight: 56,
      }}
    >
      <span
        className="t-num"
        style={{ fontSize: 14, color: "var(--ink-soft)", width: 20, flexShrink: 0 }}
      >
        {set.setNumber}
      </span>

      <input
        type="text"
        inputMode="decimal"
        placeholder="0"
        value={weight}
        onChange={(e) => {
          const v = normalizeDecimal(e.target.value);
          setWeight(v);
          debouncedSave(v, reps);
        }}
        className="t-num"
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          textAlign: "center",
          fontSize: 20,
          fontWeight: 700,
          color: "var(--ink)",
          minWidth: 0,
          minHeight: 56,
        }}
        aria-label="น้ำหนัก (kg)"
      />

      <span style={{ color: "var(--ink-soft)", fontSize: 16, flexShrink: 0 }}>×</span>

      <input
        type="text"
        inputMode="numeric"
        placeholder="0"
        value={reps}
        onChange={(e) => {
          setReps(e.target.value);
          debouncedSave(weight, e.target.value);
        }}
        className="t-num"
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          textAlign: "center",
          fontSize: 20,
          fontWeight: 700,
          color: "var(--ink)",
          minWidth: 0,
          minHeight: 56,
        }}
        aria-label="จำนวนครั้ง"
      />

      <button
        type="button"
        onClick={handleComplete}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg, oklch(65% 0.22 280), oklch(60% 0.20 240))",
          boxShadow: "0 8px 20px -8px rgba(120,90,255,0.55)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "transform 0.1s",
        }}
        aria-label="เสร็จ"
      >
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
          <path
            d="M1 7L7 13L17 1"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
