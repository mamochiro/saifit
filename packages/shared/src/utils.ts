export function estimate1RM(weight: number, reps: number): number | null {
  if (reps === 1) return weight;
  if (reps > 12) return null;
  return weight * (36 / (37 - reps));
}

export function normalizeDecimal(value: string): string {
  return value.replace(",", ".");
}

export function calculateVolume(sets: Array<{ reps: number; weightKg: number | null }>): number {
  return sets.reduce((sum, s) => sum + s.reps * (s.weightKg ?? 0), 0);
}

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string | null; // YYYY-MM-DD Bangkok local date
}

/**
 * Pure streak calculation with 1 grace day (miss exactly 1 day → streak continues).
 * todayStr must be a YYYY-MM-DD string in Bangkok local time.
 * Returns new values only; caller is responsible for persisting them.
 */
export function computeStreakUpdate(
  state: StreakState,
  todayStr: string,
): { newCurrent: number; newLongest: number } {
  const { lastWorkoutDate, currentStreak, longestStreak } = state;

  if (lastWorkoutDate === todayStr) {
    return { newCurrent: currentStreak, newLongest: longestStreak };
  }

  if (!lastWorkoutDate) {
    return { newCurrent: 1, newLongest: Math.max(longestStreak, 1) };
  }

  const last = new Date(`${lastWorkoutDate}T00:00:00Z`);
  const today = new Date(`${todayStr}T00:00:00Z`);
  const diffDays = Math.round((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Consecutive day
    const newCurrent = currentStreak + 1;
    return { newCurrent, newLongest: Math.max(longestStreak, newCurrent) };
  }

  if (diffDays === 2) {
    // Grace day: 1-day gap allowed — streak continues
    const newCurrent = currentStreak + 1;
    return { newCurrent, newLongest: Math.max(longestStreak, newCurrent) };
  }

  // Missed 2+ consecutive days → reset
  return { newCurrent: 1, newLongest: longestStreak };
}
