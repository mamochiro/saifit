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
      // Optimistic cache update
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

    // Optimistic complete
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
      // Queue for offline sync
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

  // Completed row: static display with optional undo
  if (completed) {
    return (
      <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-card min-h-14">
        <span className="text-sm text-muted-foreground tabular-nums w-6 font-display">
          {set.setNumber}
        </span>
        <span className="flex-1 text-sm text-muted-foreground tabular-nums font-display">
          {weight || "—"} kg × {reps}
        </span>
        {undoVisible && (
          <button
            type="button"
            onClick={() => {
              setCompleted(false);
              setUndoVisible(false);
            }}
            className="text-xs text-muted-foreground px-3 h-8 border border-border rounded-lg"
          >
            {t("undoAdvance")}
          </button>
        )}
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
            <path
              d="M1 5L5 9L13 1"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    );
  }

  // Active row: editable inputs
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary min-h-14">
      <span className="text-sm text-muted-foreground tabular-nums w-6 shrink-0 font-display">
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
        className="flex-1 bg-transparent text-center font-display tabular-nums text-lg font-semibold outline-none min-w-0 min-h-14"
        aria-label="น้ำหนัก (kg)"
      />

      <span className="text-muted-foreground text-sm shrink-0">×</span>

      <input
        type="text"
        inputMode="numeric"
        placeholder="0"
        value={reps}
        onChange={(e) => {
          setReps(e.target.value);
          debouncedSave(weight, e.target.value);
        }}
        className="flex-1 bg-transparent text-center font-display tabular-nums text-lg font-semibold outline-none min-w-0 min-h-14"
        aria-label="จำนวนครั้ง"
      />

      {/* Complete Set button — thumb zone, bottom-right, 56px */}
      <button
        type="button"
        onClick={handleComplete}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 active:scale-95 transition-transform"
        aria-label="เสร็จ"
      >
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
          <path
            d="M1 7L7 13L17 1"
            stroke="black"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
