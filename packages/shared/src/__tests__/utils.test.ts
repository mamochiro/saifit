import { describe, expect, it } from "vitest";
import { calculateVolume, computeStreakUpdate, estimate1RM, normalizeDecimal } from "../utils";

describe("estimate1RM", () => {
  it("returns weight unchanged for 1 rep (identity)", () => {
    expect(estimate1RM(100, 1)).toBe(100);
  });

  it("calculates Brzycki 1RM for 8 reps at 100kg", () => {
    const result = estimate1RM(100, 8);
    expect(result).not.toBeNull();
    expect(result as number).toBeCloseTo(124.14, 1);
  });

  it("returns null for reps > 12", () => {
    expect(estimate1RM(80, 13)).toBeNull();
    expect(estimate1RM(80, 20)).toBeNull();
  });

  it("returns a value (not null) for exactly 12 reps", () => {
    const result = estimate1RM(80, 12);
    expect(result).not.toBeNull();
    expect(result as number).toBeGreaterThan(80);
  });
});

describe("normalizeDecimal", () => {
  it("replaces comma with dot", () => {
    expect(normalizeDecimal("60,5")).toBe("60.5");
  });

  it("leaves existing dot unchanged", () => {
    expect(normalizeDecimal("60.5")).toBe("60.5");
  });

  it("leaves integers unchanged", () => {
    expect(normalizeDecimal("100")).toBe("100");
  });
});

describe("calculateVolume", () => {
  it("sums reps × weightKg for all sets", () => {
    expect(
      calculateVolume([
        { reps: 10, weightKg: 100 },
        { reps: 8, weightKg: 80 },
      ]),
    ).toBe(1640);
  });

  it("treats null weightKg as 0 contribution", () => {
    expect(
      calculateVolume([
        { reps: 10, weightKg: null },
        { reps: 5, weightKg: 50 },
      ]),
    ).toBe(250);
  });

  it("returns 0 for empty array", () => {
    expect(calculateVolume([])).toBe(0);
  });
});

describe("computeStreakUpdate (streak grace-day)", () => {
  const base = { currentStreak: 5, longestStreak: 10, lastWorkoutDate: "2025-05-08" };

  it("no change when today already logged", () => {
    const r = computeStreakUpdate(base, "2025-05-08");
    expect(r).toEqual({ newCurrent: 5, newLongest: 10 });
  });

  it("increments streak on consecutive day", () => {
    const r = computeStreakUpdate(base, "2025-05-09");
    expect(r).toEqual({ newCurrent: 6, newLongest: 10 });
  });

  it("grace day — 1-day gap keeps streak alive", () => {
    // Missed 2025-05-09; logging on 2025-05-10 still extends
    const r = computeStreakUpdate(base, "2025-05-10");
    expect(r.newCurrent).toBe(6);
    expect(r.newLongest).toBe(10);
  });

  it("resets to 1 after 2-day gap (no grace available)", () => {
    const r = computeStreakUpdate(base, "2025-05-11");
    expect(r).toEqual({ newCurrent: 1, newLongest: 10 });
  });

  it("starts streak at 1 when no previous workout", () => {
    const r = computeStreakUpdate(
      { currentStreak: 0, longestStreak: 0, lastWorkoutDate: null },
      "2025-05-10",
    );
    expect(r).toEqual({ newCurrent: 1, newLongest: 1 });
  });

  it("updates longestStreak when current exceeds it", () => {
    const r = computeStreakUpdate(
      { currentStreak: 10, longestStreak: 10, lastWorkoutDate: "2025-05-09" },
      "2025-05-10",
    );
    expect(r).toEqual({ newCurrent: 11, newLongest: 11 });
  });

  it("longestStreak preserved (not overwritten) on reset", () => {
    const r = computeStreakUpdate(base, "2025-05-15"); // 7-day gap
    expect(r.newCurrent).toBe(1);
    expect(r.newLongest).toBe(10); // unchanged
  });
});
