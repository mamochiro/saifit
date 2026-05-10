"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface FoodLog {
  id: string;
  userId: string;
  logDate: string;
  targetKcal: number;
  targetProteinG: number;
  targetCarbsG: number;
  targetFatG: number;
  createdAt: string;
}

export interface MealItem {
  id: string;
  foodLogId: string;
  mealType: string;
  name: string;
  kcal: number;
  proteinG: string;
  carbsG: string;
  fatG: string;
  isDone: boolean;
  loggedAt: string;
}

export interface FoodLogResponse {
  log: FoodLog;
  items: MealItem[];
}

export interface AddMealItemInput {
  date: string;
  mealType: "breakfast" | "lunch" | "snack" | "dinner";
  name: string;
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export function useFoodLog(date: string) {
  return useQuery<FoodLogResponse>({
    queryKey: ["food-log", date],
    queryFn: async () => {
      const res = await fetch(`/api/food/logs?date=${date}`);
      if (!res.ok) throw new Error("Failed to load food log");
      return res.json() as Promise<FoodLogResponse>;
    },
  });
}

export function useAddMealItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ date, ...body }: AddMealItemInput) => {
      const res = await fetch(`/api/food/logs/${date}/meals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to add meal item");
      return res.json() as Promise<{ data: MealItem }>;
    },
    onSuccess: (_data, vars) => {
      void qc.invalidateQueries({ queryKey: ["food-log", vars.date] });
    },
  });
}

export function useToggleMealItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ date, id, isDone }: { date: string; id: string; isDone: boolean }) => {
      const res = await fetch(`/api/food/logs/${date}/meals`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isDone }),
      });
      if (!res.ok) throw new Error("Failed to update meal item");
    },
    onMutate: async ({ date, id, isDone }) => {
      await qc.cancelQueries({ queryKey: ["food-log", date] });
      const prev = qc.getQueryData<FoodLogResponse>(["food-log", date]);
      if (prev) {
        qc.setQueryData<FoodLogResponse>(["food-log", date], {
          ...prev,
          items: prev.items.map((item) => (item.id === id ? { ...item, isDone } : item)),
        });
      }
      return { prev };
    },
    onError: (_err, vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["food-log", vars.date], ctx.prev);
    },
    onSettled: (_data, _err, vars) => {
      void qc.invalidateQueries({ queryKey: ["food-log", vars.date] });
    },
  });
}

export function useDeleteMealItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ date, id }: { date: string; id: string }) => {
      const res = await fetch(`/api/food/logs/${date}/meals`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete meal item");
    },
    onMutate: async ({ date, id }) => {
      await qc.cancelQueries({ queryKey: ["food-log", date] });
      const prev = qc.getQueryData<FoodLogResponse>(["food-log", date]);
      if (prev) {
        qc.setQueryData<FoodLogResponse>(["food-log", date], {
          ...prev,
          items: prev.items.filter((item) => item.id !== id),
        });
      }
      return { prev };
    },
    onError: (_err, vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["food-log", vars.date], ctx.prev);
    },
    onSettled: (_data, _err, vars) => {
      void qc.invalidateQueries({ queryKey: ["food-log", vars.date] });
    },
  });
}
