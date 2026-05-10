import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface RestTimerState {
  isActive: boolean;
  duration: number; // seconds, configurable per exercise
  startedAt: number | null; // Date.now() when started
  pausedAt: number | null; // Date.now() when paused
  elapsed: number; // seconds elapsed when paused
  workoutId: string | null;
  exerciseName: string | null;
  setNumber: number | null;
}

interface RestTimerActions {
  start: (opts: {
    duration: number;
    workoutId: string;
    exerciseName: string;
    setNumber: number;
  }) => void;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
  addSeconds: (delta: number) => void;
  getRemaining: () => number;
}

const DEFAULT_REST = 90; // seconds

const initialState: RestTimerState = {
  isActive: false,
  duration: DEFAULT_REST,
  startedAt: null,
  pausedAt: null,
  elapsed: 0,
  workoutId: null,
  exerciseName: null,
  setNumber: null,
};

export const useRestTimerStore = create<RestTimerState & RestTimerActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      start: ({ duration, workoutId, exerciseName, setNumber }) =>
        set({
          isActive: true,
          duration,
          startedAt: Date.now(),
          pausedAt: null,
          elapsed: 0,
          workoutId,
          exerciseName,
          setNumber,
        }),

      pause: () => {
        const { startedAt, elapsed } = get();
        if (!startedAt) return;
        const nowElapsed = elapsed + (Date.now() - startedAt) / 1000;
        set({ pausedAt: Date.now(), elapsed: nowElapsed, startedAt: null });
      },

      resume: () => {
        set({ startedAt: Date.now(), pausedAt: null });
      },

      cancel: () => set({ ...initialState }),

      addSeconds: (delta: number) => {
        const { duration } = get();
        set({ duration: Math.max(5, duration + delta) });
      },

      getRemaining: () => {
        const { isActive, duration, startedAt, elapsed, pausedAt } = get();
        if (!isActive) return 0;
        if (pausedAt !== null) return Math.max(0, duration - elapsed);
        if (!startedAt) return duration;
        const totalElapsed = elapsed + (Date.now() - startedAt) / 1000;
        return Math.max(0, duration - totalElapsed);
      },
    }),
    {
      name: "saifit-rest-timer",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? sessionStorage : localStorage,
      ),
    },
  ),
);
