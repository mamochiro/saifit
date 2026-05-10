"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface BodyMeasurement {
  id: string;
  userId: string;
  recordedAt: string;
  weightKg: string | null;
  bodyFatPct: string | null;
  chestCm: string | null;
  waistCm: string | null;
  armCm: string | null;
  thighCm: string | null;
  createdAt: string;
}

export interface BodySummary {
  latest: BodyMeasurement | null;
  deltas: {
    weightKg: number | null;
    bodyFatPct: number | null;
    chestCm: number | null;
    waistCm: number | null;
    armCm: number | null;
    thighCm: number | null;
  };
  trend90: Array<{ date: string; weightKg: number | null }>;
}

export interface LogMeasurementInput {
  recordedAt: string;
  weightKg?: number | null;
  bodyFatPct?: number | null;
  chestCm?: number | null;
  waistCm?: number | null;
  armCm?: number | null;
  thighCm?: number | null;
}

export function useBodySummary() {
  return useQuery<BodySummary>({
    queryKey: ["body-summary"],
    queryFn: async () => {
      const res = await fetch("/api/body/summary");
      if (!res.ok) throw new Error("Failed to load body summary");
      return res.json() as Promise<BodySummary>;
    },
  });
}

export function useBodyMeasurements() {
  return useQuery<BodyMeasurement[]>({
    queryKey: ["body-measurements"],
    queryFn: async () => {
      const res = await fetch("/api/body/measurements");
      if (!res.ok) throw new Error("Failed to load measurements");
      const json = (await res.json()) as { data: BodyMeasurement[] };
      return json.data;
    },
  });
}

export function useLogMeasurement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: LogMeasurementInput) => {
      const res = await fetch("/api/body/measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to log measurement");
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["body-summary"] });
      void qc.invalidateQueries({ queryKey: ["body-measurements"] });
    },
  });
}
