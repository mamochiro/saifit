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
