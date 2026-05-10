// IndexedDB write queue for offline-first workout logging.
// Sequence numbers (IDs) are autoincrement — order is preserved.

export type Operation =
  | { type: "create_set"; payload: CreateSetPayload }
  | { type: "update_set"; payload: UpdateSetPayload }
  | { type: "delete_set"; payload: DeleteSetPayload }
  | { type: "complete_workout"; payload: CompleteWorkoutPayload }
  | { type: "update_workout"; payload: UpdateWorkoutPayload };

export interface CreateSetPayload {
  clientSetId: string;
  workoutId: string;
  exerciseId: string;
  setNumber: number;
  weightKg: string | null;
  reps: number;
  isBodyweight: boolean;
  completedAt: string;
}

export interface UpdateSetPayload {
  setId: string;
  weightKg?: string;
  reps?: number;
  notes?: string;
}

export interface DeleteSetPayload {
  setId: string;
}

export interface CompleteWorkoutPayload {
  workoutId: string;
  completedAt: string;
  durationSeconds: number;
}

export interface UpdateWorkoutPayload {
  workoutId: string;
  name?: string;
  notes?: string;
}

export interface QueueEntry {
  id?: number;
  clientId: string;
  workoutId: string;
  operation: Operation;
  createdAt: string;
  syncedAt: string | null;
  retryCount: number;
  lastError: string | null;
}

const DB_NAME = "saifit_workout";
const DB_VERSION = 1;
const STORE_NAME = "writeQueue";
const CLIENT_ID_KEY = "saifit_client_id";
const GC_AGE_MS = 48 * 60 * 60 * 1000; // 48 hours

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("workoutId", "workoutId", { unique: false });
        store.createIndex("syncedAt", "syncedAt", { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function getClientId(): string {
  let id = localStorage.getItem(CLIENT_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(CLIENT_ID_KEY, id);
  }
  return id;
}

export async function enqueue(workoutId: string, operation: Operation): Promise<number> {
  const db = await openDB();
  const clientId = getClientId();

  const entry: QueueEntry = {
    clientId,
    workoutId,
    operation,
    createdAt: new Date().toISOString(),
    syncedAt: null,
    retryCount: 0,
    lastError: null,
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.add(entry);
    req.onsuccess = () => resolve(req.result as number);
    req.onerror = () => reject(req.error);
  });
}

export async function getPending(workoutId: string): Promise<QueueEntry[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const idx = store.index("workoutId");
    const req = idx.getAll(workoutId);
    req.onsuccess = () => resolve((req.result as QueueEntry[]).filter((e) => e.syncedAt === null));
    req.onerror = () => reject(req.error);
  });
}

export async function markSynced(ids: number[]): Promise<void> {
  if (ids.length === 0) return;
  const db = await openDB();
  const now = new Date().toISOString();
  await Promise.all(
    ids.map(
      (id) =>
        new Promise<void>((resolve, reject) => {
          const tx = db.transaction(STORE_NAME, "readwrite");
          const store = tx.objectStore(STORE_NAME);
          const getReq = store.get(id);
          getReq.onsuccess = () => {
            const entry = getReq.result as QueueEntry;
            if (!entry) {
              resolve();
              return;
            }
            const putReq = store.put({ ...entry, syncedAt: now });
            putReq.onsuccess = () => resolve();
            putReq.onerror = () => reject(putReq.error);
          };
          getReq.onerror = () => reject(getReq.error);
        }),
    ),
  );
}

export async function markFailed(id: number, error: string): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const entry = getReq.result as QueueEntry;
      if (!entry) {
        resolve();
        return;
      }
      const putReq = store.put({
        ...entry,
        retryCount: entry.retryCount + 1,
        lastError: error,
      });
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

export async function gcSynced(): Promise<void> {
  const db = await openDB();
  const cutoff = new Date(Date.now() - GC_AGE_MS).toISOString();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const idx = store.index("syncedAt");
    const range = IDBKeyRange.upperBound(cutoff);
    const req = idx.openCursor(range);
    req.onsuccess = (e) => {
      const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        if (cursor.value.syncedAt !== null) {
          cursor.delete();
        }
        cursor.continue();
      } else {
        resolve();
      }
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getPendingCount(workoutId: string): Promise<number> {
  const pending = await getPending(workoutId);
  return pending.length;
}
