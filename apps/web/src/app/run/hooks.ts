"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface RunSession {
  id: string;
  userId: string;
  runDate: string;
  distanceKm: string;
  durationSeconds: number;
  avgPaceSecPerKm: number | null;
  runType: string;
  notes: string | null;
  createdAt: string;
}

export interface WeekDayPlan {
  th: string;
  en: string;
  date: string;
  isToday: boolean;
  session: {
    distanceKm: number;
    durationSeconds: number;
    avgPaceSecPerKm: number | null;
    runType: string;
  } | null;
}

export interface RunSummary {
  weekPlan: WeekDayPlan[];
  totalKm: number;
  longestKm: number;
  latestPace: string | null;
  weekRange: { from: string; to: string };
}

export interface LogRunInput {
  runDate: string;
  distanceKm: number;
  durationSeconds: number;
  runType?: "easy" | "tempo" | "interval" | "long" | "race";
  notes?: string | null;
}

export function useRunSummary() {
  return useQuery<RunSummary>({
    queryKey: ["run-summary"],
    queryFn: async () => {
      const res = await fetch("/api/run/summary");
      if (!res.ok) throw new Error("Failed to load run summary");
      return res.json() as Promise<RunSummary>;
    },
  });
}

export function useRunSessions() {
  return useQuery<RunSession[]>({
    queryKey: ["run-sessions"],
    queryFn: async () => {
      const res = await fetch("/api/run/sessions");
      if (!res.ok) throw new Error("Failed to load run sessions");
      const json = (await res.json()) as { data: RunSession[] };
      return json.data;
    },
  });
}

export function useLogRun() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: LogRunInput) => {
      const res = await fetch("/api/run/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to log run");
      return res.json() as Promise<{ data: RunSession }>;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["run-summary"] });
      void qc.invalidateQueries({ queryKey: ["run-sessions"] });
    },
  });
}
