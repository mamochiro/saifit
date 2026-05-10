import { describe, expect, it } from "vitest";
import { calculateVolume, estimate1RM, normalizeDecimal } from "../utils";

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
