/**
 * Verifies that every authenticated API route returns 401 when no session exists.
 * auth.api.getSession is mocked to return null; getDb is never reached.
 */
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

// ─── Mocks ─────────────────────────────────────────────────────────────────

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue(null),
    },
  },
}));

vi.mock("@saifit/db", () => ({
  getDb: vi.fn(),
  users: {},
  workouts: {},
  workoutSets: {},
  exercises: {},
  streaks: {},
  personalRecords: {},
  subscriptions: {},
  reminderLog: {},
  userPrograms: {},
  templates: {},
  routines: {},
  routineExercises: {},
  bodyMeasurements: {},
}));

// next/server is a real Next.js module — import after mocks are declared.

// ─── Helpers ────────────────────────────────────────────────────────────────

function req(url: string, method = "GET", body?: unknown): NextRequest {
  return new NextRequest(`http://localhost${url}`, {
    method,
    headers: { "Content-Type": "application/json" },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}

// ─── Route imports (after mocks) ────────────────────────────────────────────

const { GET: getMe, PATCH: patchMe } = await import("@/app/api/me/route");
const { GET: getWorkouts, POST: postWorkout } = await import("@/app/api/workouts/route");
const { GET: getPrograms } = await import("@/app/api/programs/active/route");
const { GET: getSummary } = await import("@/app/api/progress/summary/route");
const { GET: getPrs } = await import("@/app/api/progress/prs/route");
const { GET: getRoutines, POST: postRoutine } = await import("@/app/api/routines/route");

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("API routes — unauthenticated → 401", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /api/me → 401", async () => {
    const res = await getMe(req("/api/me"));
    expect(res.status).toBe(401);
  });

  it("PATCH /api/me → 401", async () => {
    const res = await patchMe(req("/api/me", "PATCH", {}));
    expect(res.status).toBe(401);
  });

  it("GET /api/workouts → 401", async () => {
    const res = await getWorkouts(req("/api/workouts"));
    expect(res.status).toBe(401);
  });

  it("POST /api/workouts → 401", async () => {
    const res = await postWorkout(req("/api/workouts", "POST", {}));
    expect(res.status).toBe(401);
  });

  it("GET /api/programs/active → 401", async () => {
    const res = await getPrograms(req("/api/programs/active"));
    expect(res.status).toBe(401);
  });

  it("GET /api/progress/summary → 401", async () => {
    const res = await getSummary(req("/api/progress/summary"));
    expect(res.status).toBe(401);
  });

  it("GET /api/progress/prs → 401", async () => {
    const res = await getPrs(req("/api/progress/prs"));
    expect(res.status).toBe(401);
  });

  it("GET /api/routines → 401", async () => {
    const res = await getRoutines(req("/api/routines"));
    expect(res.status).toBe(401);
  });

  it("POST /api/routines → 401", async () => {
    const res = await postRoutine(req("/api/routines", "POST", {}));
    expect(res.status).toBe(401);
  });
});
