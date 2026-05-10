"use client";

import { getPending, getPendingCount, markSynced } from "@/lib/workout-queue";
import { useRestTimerStore } from "@/stores/rest-timer-store";
import { useViewportStore } from "@/stores/viewport-store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { CompleteWorkoutBar } from "./complete-workout-bar";
import { ExercisePicker } from "./exercise-picker";
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
      <CompleteWorkoutBar workoutId={workoutId} />

      {/* Exercise picker sheet */}
      {pickerOpen && (
        <ExercisePicker
          workoutId={workoutId}
          onClose={() => setPickerOpen(false)}
          onSelect={(_exerciseId) => {
            setPickerOpen(false);
            qc.invalidateQueries({ queryKey: ["workout", workoutId] });
          }}
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
