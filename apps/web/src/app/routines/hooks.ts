"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface RoutineExercise {
  id: string;
  exerciseId: string;
  nameEn: string;
  nameTh: string;
  muscleGroups: string[];
  orderIndex: number;
  targetSets: number;
  targetReps: string;
  targetWeightKg: string | null;
}

export interface RoutineRow {
  id: string;
  name: string;
  notes: string | null;
  lastUsedAt: string | null;
  createdAt: string;
  exerciseCount: number;
}

export interface RoutineDetail extends RoutineRow {
  exercises: RoutineExercise[];
}

export interface SaveExercise {
  exerciseId: string;
  targetSets: number;
  targetReps: string;
  targetWeightKg: number | null;
}

export function useRoutines() {
  return useQuery<RoutineRow[]>({
    queryKey: ["routines"],
    queryFn: async () => {
      const res = await fetch("/api/routines");
      if (!res.ok) throw new Error("Failed to load routines");
      const json = (await res.json()) as { data: RoutineRow[] };
      return json.data;
    },
  });
}

export function useRoutine(id: string) {
  return useQuery<RoutineDetail>({
    queryKey: ["routines", id],
    queryFn: async () => {
      const res = await fetch(`/api/routines/${id}`);
      if (!res.ok) throw new Error("Failed to load routine");
      const json = (await res.json()) as { data: RoutineDetail };
      return json.data;
    },
  });
}

export function useCreateRoutine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      name: string;
      notes?: string | null;
      exercises: SaveExercise[];
    }) => {
      const res = await fetch("/api/routines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to create routine");
      const json = (await res.json()) as { data: { id: string } };
      return json.data.id;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["routines"] }),
  });
}

export function useUpdateRoutine(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      name?: string;
      notes?: string | null;
      exercises?: SaveExercise[];
    }) => {
      const res = await fetch(`/api/routines/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to update routine");
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["routines"] });
      void qc.invalidateQueries({ queryKey: ["routines", id] });
    },
  });
}

export function useDeleteRoutine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/routines/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete routine");
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["routines"] }),
  });
}

export function useStartRoutine() {
  return useMutation({
    mutationFn: async (routineId: string) => {
      const res = await fetch(`/api/routines/${routineId}/start`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to start workout");
      const json = (await res.json()) as { data: { workoutId: string } };
      return json.data.workoutId;
    },
  });
}
