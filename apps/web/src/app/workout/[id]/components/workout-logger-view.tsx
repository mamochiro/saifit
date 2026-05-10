"use client";

import { getPending, getPendingCount, markSynced } from "@/lib/workout-queue";
import { useRestTimerStore } from "@/stores/rest-timer-store";
import { useViewportStore } from "@/stores/viewport-store";
import { normalizeDecimal } from "@saifit/shared";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { CompleteWorkoutBar } from "./complete-workout-bar";
import { ExercisePicker, type PickedExercise } from "./exercise-picker";
import { PRCelebrationOverlay } from "./pr-celebration-overlay";
import { RestTimer } from "./rest-timer";
import { SetRow } from "./set-row";

interface WorkoutSet {
  id: string;
  workoutId: string;
  exerciseId: string;
  setNumber: number;
  reps: number;
  weightKg: string | null;
  isBodyweight: boolean;
  notes: string | null;
  clientSetId: string | null;
  completedAt: string;
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

// Inline form for the first set of a newly picked exercise
function FirstSetRow({
  exercise,
  workoutId,
  setNumber,
  onCompleted,
  onPR,
}: {
  exercise: PickedExercise;
  workoutId: string;
  setNumber: number;
  onCompleted: () => void;
  onPR: (name: string, value: number, type: string) => void;
}) {
  const t = useTranslations("workout");
  const qc = useQueryClient();
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [saving, setSaving] = useState(false);

  const handleComplete = async () => {
    const repsNum = Number.parseInt(reps, 10);
    if (Number.isNaN(repsNum) || repsNum <= 0) return;
    const weightKg = weight ? normalizeDecimal(weight) : null;
    setSaving(true);
    try {
      const res = await fetch(`/api/workouts/${workoutId}/sets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientSetId: crypto.randomUUID(),
          exerciseId: exercise.id,
          setNumber,
          weightKg,
          reps: repsNum,
          isBodyweight: !weightKg,
          completedAt: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        const { data } = await res.json();
        if (data.prBeaten && data.newPrValue !== null) {
          onPR(
            exercise.nameTh || exercise.nameEn,
            data.newPrValue,
            data.prTypes[0] ?? "max_weight",
          );
        }
        qc.invalidateQueries({ queryKey: ["workout", workoutId] });
        onCompleted();
      }
    } catch {
      // Silently fail — user can retry
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary min-h-14">
      <span className="text-sm text-muted-foreground tabular-nums w-6 shrink-0 font-display">
        {setNumber}
      </span>

      <input
        type="text"
        inputMode="decimal"
        placeholder="0"
        value={weight}
        onChange={(e) => setWeight(normalizeDecimal(e.target.value))}
        className="flex-1 bg-transparent text-center font-display tabular-nums text-lg font-semibold outline-none min-w-0 min-h-14"
        aria-label="น้ำหนัก (kg)"
      />

      <span className="text-muted-foreground text-sm shrink-0">×</span>

      <input
        type="text"
        inputMode="numeric"
        placeholder="0"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        className="flex-1 bg-transparent text-center font-display tabular-nums text-lg font-semibold outline-none min-w-0 min-h-14"
        aria-label="จำนวนครั้ง"
      />

      <button
        type="button"
        onClick={handleComplete}
        disabled={saving}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 active:scale-95 transition-transform disabled:opacity-50"
        aria-label={t("complete")}
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

export function WorkoutLoggerView({
  workoutId,
  initialData,
}: {
  workoutId: string;
  initialData: WorkoutData;
}) {
  const t = useTranslations("workout");
  const qc = useQueryClient();
  const initViewport = useViewportStore((s) => s.init);
  const restActive = useRestTimerStore((s) => s.isActive);
  const restWorkoutId = useRestTimerStore((s) => s.workoutId);

  const [pendingCount, setPendingCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pendingExercises, setPendingExercises] = useState<PickedExercise[]>([]);
  const [prResult, setPrResult] = useState<{
    exerciseName: string;
    value: number;
    type: string;
  } | null>(null);
  const flushingRef = useRef(false);

  const { data } = useQuery<WorkoutData>({
    queryKey: ["workout", workoutId],
    queryFn: () =>
      fetch(`/api/workouts/${workoutId}`)
        .then((r) => r.json())
        .then((r) => r.data),
    initialData,
    staleTime: 5000,
  });

  const workout = data ?? initialData;

  // Group sets by exerciseId to render exercise sections
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

  // Remove pending exercise once it appears in server data
  useEffect(() => {
    const serverIds = new Set(exerciseGroups.map((g) => g.exercise?.id));
    setPendingExercises((prev) => prev.filter((p) => !serverIds.has(p.id)));
  }, [exerciseGroups]);

  // Flush IndexedDB pending ops to server
  const flush = useCallback(async () => {
    if (flushingRef.current || !navigator.onLine) return;
    const pending = await getPending(workoutId);
    if (pending.length === 0) return;
    flushingRef.current = true;
    try {
      const ops = pending
        .filter((e): e is typeof e & { id: number } => e.id !== undefined)
        .map((e) => ({
          seq: e.id,
          type: e.operation.type,
          payload: e.operation.payload,
        }));
      const res = await fetch(`/api/workouts/${workoutId}/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: pending[0]?.clientId ?? "",
          lastSyncSeq: 0,
          pendingOps: ops,
        }),
      });
      if (res.ok) {
        const { data: result } = await res.json();
        if (result.accepted?.length) await markSynced(result.accepted);
        qc.invalidateQueries({ queryKey: ["workout", workoutId] });
      }
    } catch {
      // Silent — will retry on next flush
    } finally {
      flushingRef.current = false;
      const count = await getPendingCount(workoutId);
      setPendingCount(count);
    }
  }, [workoutId, qc]);

  // Online/offline + visibilitychange listeners
  useEffect(() => {
    const onOnline = () => {
      setIsOnline(true);
      flush();
    };
    const onOffline = () => setIsOnline(false);
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    document.addEventListener("visibilitychange", onVisibility);
    setIsOnline(navigator.onLine);

    const cleanup = initViewport();
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      document.removeEventListener("visibilitychange", onVisibility);
      cleanup();
    };
  }, [flush, initViewport]);

  // Poll pending count every 3s
  useEffect(() => {
    const iv = setInterval(async () => {
      const count = await getPendingCount(workoutId);
      setPendingCount(count);
    }, 3000);
    return () => clearInterval(iv);
  }, [workoutId]);

  const showSavedLocally = !isOnline || pendingCount > 0;

  const handleExercisePicked = (exercise: PickedExercise) => {
    setPickerOpen(false);
    const alreadyInGroups = exerciseGroups.some((g) => g.exercise?.id === exercise.id);
    const alreadyPending = pendingExercises.some((p) => p.id === exercise.id);
    if (!alreadyInGroups && !alreadyPending) {
      setPendingExercises((prev) => [...prev, exercise]);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="px-4 pt-10 pb-4 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold leading-[1.7]">{workout.name}</h1>
          {showSavedLocally && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {isOnline ? t("syncing") : t("savedLocally")}
            </p>
          )}
        </div>
      </div>

      {/* Exercise sections */}
      <div className="px-4 space-y-8">
        {exerciseGroups.map(({ exercise, sets }) => (
          <div key={sets[0]?.exerciseId ?? exercise?.id}>
            <h2 className="text-base font-semibold mb-1 leading-[1.7]">
              {exercise?.nameTh ?? exercise?.nameEn ?? "Exercise"}
            </h2>
            {exercise?.muscleGroups && exercise.muscleGroups.length > 0 && (
              <p className="text-xs text-muted-foreground mb-3">
                {exercise.muscleGroups.join(" · ")}
              </p>
            )}
            <div className="space-y-2">
              {sets.map((set) => (
                <SetRow
                  key={set.id}
                  set={set}
                  workoutId={workoutId}
                  onPR={(exerciseName, value, type) => setPrResult({ exerciseName, value, type })}
                  onSetComplete={(exerciseName, setNumber) => {
                    useRestTimerStore.getState().start({
                      duration: 90,
                      workoutId,
                      exerciseName,
                      setNumber,
                    });
                  }}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Pending exercises (picked but no sets yet) */}
        {pendingExercises.map((exercise) => (
          <div key={exercise.id}>
            <h2 className="text-base font-semibold mb-1 leading-[1.7]">
              {exercise.nameTh || exercise.nameEn}
            </h2>
            {exercise.muscleGroups.length > 0 && (
              <p className="text-xs text-muted-foreground mb-3">
                {exercise.muscleGroups.join(" · ")}
              </p>
            )}
            <div className="space-y-2">
              <FirstSetRow
                exercise={exercise}
                workoutId={workoutId}
                setNumber={1}
                onCompleted={() =>
                  setPendingExercises((prev) => prev.filter((p) => p.id !== exercise.id))
                }
                onPR={(name, value, type) => setPrResult({ exerciseName: name, value, type })}
              />
            </div>
          </div>
        ))}

        {/* Add exercise button */}
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="w-full h-14 border border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-foreground/30 transition-colors"
        >
          + {t("addExercise")}
        </button>
      </div>

      {/* Rest timer — docked above keyboard */}
      {restActive && restWorkoutId === workoutId && <RestTimer workoutId={workoutId} />}

      {/* Fixed bottom bar */}
      <CompleteWorkoutBar workoutId={workoutId} startedAt={workout.startedAt} />

      {/* Exercise picker sheet */}
      {pickerOpen && (
        <ExercisePicker
          workoutId={workoutId}
          onClose={() => setPickerOpen(false)}
          onSelect={handleExercisePicked}
        />
      )}

      {/* PR celebration */}
      {prResult && (
        <PRCelebrationOverlay
          exerciseName={prResult.exerciseName}
          value={prResult.value}
          type={prResult.type}
          onDismiss={() => setPrResult(null)}
        />
      )}
    </div>
  );
}
