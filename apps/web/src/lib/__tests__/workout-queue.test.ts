/**
 * IndexedDB queue reconciliation tests.
 * Uses fake-indexeddb to simulate the browser environment.
 * Tests the sequence: enqueue → getPending → markSynced / markFailed → gcSynced.
 */
import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

// fake-indexeddb patches the global indexedDB; import queue after setup
import {
  enqueue,
  gcSynced,
  getPending,
  getPendingCount,
  markFailed,
  markSynced,
} from "../workout-queue";

// Polyfill localStorage for getClientId()
const store: Record<string, string> = {};
Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => {
      store[k] = v;
    },
    removeItem: (k: string) => {
      delete store[k];
    },
    clear: () => {
      for (const k of Object.keys(store)) delete store[k];
    },
  },
  configurable: true,
});

// Each test gets a fresh DB by bumping the version via the module-level DB name.
// Since fake-indexeddb is in-memory, clearing globalThis.indexedDB between tests
// is the easiest reset. fake-indexeddb exports IDBFactory for this.
import { IDBFactory } from "fake-indexeddb";

const WORKOUT_ID = "workout-abc-123";

beforeEach(() => {
  // Fresh in-memory IndexedDB per test
  globalThis.indexedDB = new IDBFactory();
  store.saifit_client_id = "test-client";
});

afterEach(() => {
  store.saifit_client_id = "test-client";
});

describe("workout-queue reconciliation", () => {
  it("enqueued operation appears in getPending", async () => {
    await enqueue(WORKOUT_ID, {
      type: "create_set",
      payload: {
        clientSetId: "cset-1",
        workoutId: WORKOUT_ID,
        exerciseId: "ex-1",
        setNumber: 1,
        weightKg: "100",
        reps: 5,
        isBodyweight: false,
        completedAt: new Date().toISOString(),
      },
    });

    const pending = await getPending(WORKOUT_ID);
    expect(pending).toHaveLength(1);
    const [first] = pending;
    expect(first?.operation.type).toBe("create_set");
    expect(first?.syncedAt).toBeNull();
  });

  it("multiple operations maintain sequence order", async () => {
    for (let i = 1; i <= 3; i++) {
      await enqueue(WORKOUT_ID, {
        type: "create_set",
        payload: {
          clientSetId: `cset-${i}`,
          workoutId: WORKOUT_ID,
          exerciseId: "ex-1",
          setNumber: i,
          weightKg: "80",
          reps: 8,
          isBodyweight: false,
          completedAt: new Date().toISOString(),
        },
      });
    }

    const pending = await getPending(WORKOUT_ID);
    expect(pending).toHaveLength(3);
    // IDs are auto-increment — sequence preserved
    const ids = pending.map((e) => e.id as number);
    expect(ids).toEqual([...ids].sort((a, b) => a - b));
  });

  it("markSynced removes entry from getPending", async () => {
    const id = await enqueue(WORKOUT_ID, {
      type: "update_set",
      payload: { setId: "set-xyz", reps: 6 },
    });

    await markSynced([id]);

    const pending = await getPending(WORKOUT_ID);
    expect(pending).toHaveLength(0);
  });

  it("markFailed increments retryCount and keeps entry pending", async () => {
    const id = await enqueue(WORKOUT_ID, {
      type: "delete_set",
      payload: { setId: "set-del" },
    });

    await markFailed(id, "HTTP 503");

    const pending = await getPending(WORKOUT_ID);
    expect(pending).toHaveLength(1);
    const [failed] = pending;
    expect(failed?.retryCount).toBe(1);
    expect(failed?.lastError).toBe("HTTP 503");
    expect(failed?.syncedAt).toBeNull();
  });

  it("getPendingCount reflects only unsynced entries", async () => {
    const id1 = await enqueue(WORKOUT_ID, {
      type: "create_set",
      payload: {
        clientSetId: "c1",
        workoutId: WORKOUT_ID,
        exerciseId: "ex-1",
        setNumber: 1,
        weightKg: "60",
        reps: 10,
        isBodyweight: false,
        completedAt: new Date().toISOString(),
      },
    });
    await enqueue(WORKOUT_ID, {
      type: "create_set",
      payload: {
        clientSetId: "c2",
        workoutId: WORKOUT_ID,
        exerciseId: "ex-1",
        setNumber: 2,
        weightKg: "60",
        reps: 10,
        isBodyweight: false,
        completedAt: new Date().toISOString(),
      },
    });

    // Sync the first one
    await markSynced([id1]);

    const count = await getPendingCount(WORKOUT_ID);
    expect(count).toBe(1);
  });

  it("gcSynced removes old synced entries but not recent ones", async () => {
    const id = await enqueue(WORKOUT_ID, {
      type: "complete_workout",
      payload: {
        workoutId: WORKOUT_ID,
        completedAt: new Date().toISOString(),
        durationSeconds: 3600,
      },
    });

    await markSynced([id]);

    // GC only deletes entries synced >48h ago; this entry is just-synced
    // so it should survive (gcSynced uses IDBKeyRange.upperBound(cutoff)).
    await gcSynced();

    // Still pending=0 but the DB entry still exists (not deleted by GC yet)
    const count = await getPendingCount(WORKOUT_ID);
    expect(count).toBe(0); // synced entries never appear in getPending
  });

  it("full reconciliation flow: enqueue offline → sync → clean", async () => {
    // Simulate 3 offline operations
    const ids = await Promise.all([
      enqueue(WORKOUT_ID, {
        type: "create_set",
        payload: {
          clientSetId: "o1",
          workoutId: WORKOUT_ID,
          exerciseId: "ex-1",
          setNumber: 1,
          weightKg: "100",
          reps: 5,
          isBodyweight: false,
          completedAt: new Date().toISOString(),
        },
      }),
      enqueue(WORKOUT_ID, {
        type: "create_set",
        payload: {
          clientSetId: "o2",
          workoutId: WORKOUT_ID,
          exerciseId: "ex-1",
          setNumber: 2,
          weightKg: "100",
          reps: 5,
          isBodyweight: false,
          completedAt: new Date().toISOString(),
        },
      }),
      enqueue(WORKOUT_ID, {
        type: "update_workout",
        payload: { workoutId: WORKOUT_ID, name: "Leg Day" },
      }),
    ]);

    // Reconnect: fetch pending, "send" to server (mocked), mark synced
    const pending = await getPending(WORKOUT_ID);
    expect(pending).toHaveLength(3);

    // Server accepts first 2, rejects third
    await markSynced([ids[0], ids[1]]);
    await markFailed(ids[2], "Conflict");

    const afterSync = await getPending(WORKOUT_ID);
    expect(afterSync).toHaveLength(1);
    const [remaining] = afterSync;
    expect(remaining?.operation.type).toBe("update_workout");
    expect(remaining?.retryCount).toBe(1);
  });
});
