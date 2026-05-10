"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface Exercise {
  id: string;
  slug: string;
  nameEn: string;
  nameTh: string;
  category: string;
  muscleGroups: string[];
  equipment: string;
}

export type PickedExercise = Pick<Exercise, "id" | "nameTh" | "nameEn" | "muscleGroups">;

const MUSCLE_FILTERS = [
  { value: "", labelKey: "filterAll" },
  { value: "chest", labelKey: "muscles.chest" },
  { value: "back", labelKey: "muscles.back" },
  { value: "legs", labelKey: "muscles.legs" },
  { value: "shoulders", labelKey: "muscles.shoulders" },
  { value: "arms", labelKey: "muscles.arms" },
  { value: "core", labelKey: "muscles.core" },
  { value: "cardio", labelKey: "muscles.cardio" },
  { value: "full_body", labelKey: "muscles.fullBody" },
] as const;

export function ExercisePicker({
  workoutId: _workoutId,
  onClose,
  onSelect,
}: {
  workoutId: string;
  onClose: () => void;
  onSelect: (exercise: PickedExercise) => void;
}) {
  const t = useTranslations("exercises");
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [selectedMuscle, setSelectedMuscle] = useState("");

  const handleSearch = (val: string) => {
    setQ(val);
    if (timer) clearTimeout(timer);
    setTimer(setTimeout(() => setDebouncedQ(val), 300));
  };

  const { data, isLoading } = useQuery<{ data: Exercise[] }>({
    queryKey: ["exercises", debouncedQ, selectedMuscle],
    queryFn: () => {
      const params = new URLSearchParams();
      if (debouncedQ) params.set("q", debouncedQ);
      if (selectedMuscle) params.set("muscle", selectedMuscle);
      params.set("limit", "30");
      return fetch(`/api/exercises?${params.toString()}`).then((r) => r.json());
    },
    staleTime: 60_000,
  });

  const exercises = data?.data ?? [];

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-label="Close"
      />

      {/* Sheet */}
      <div className="relative mt-auto bg-background border-t border-border rounded-t-2xl max-h-[80vh] flex flex-col">
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold leading-[1.7]">{t("search")}</h2>
            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 flex items-center justify-center text-muted-foreground"
            >
              ✕
            </button>
          </div>
          <input
            type="search"
            placeholder={t("search")}
            value={q}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full h-12 px-4 bg-secondary border border-border rounded-xl text-sm outline-none focus:ring-1 focus:ring-ring"
            // biome-ignore lint/a11y/noAutofocus: intentional — sheet opens for search
            autoFocus
          />
        </div>

        {/* Muscle filter chips */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-none">
          {MUSCLE_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setSelectedMuscle(f.value)}
              className={`shrink-0 h-8 px-3 rounded-full text-xs font-medium transition-colors ${
                selectedMuscle === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {t(f.labelKey)}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 px-4 pb-6">
          {isLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">กำลังโหลด...</div>
          ) : exercises.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">{t("noResults")}</div>
          ) : (
            <div className="space-y-1 mt-2">
              {exercises.map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() =>
                    onSelect({
                      id: ex.id,
                      nameTh: ex.nameTh,
                      nameEn: ex.nameEn,
                      muscleGroups: ex.muscleGroups,
                    })
                  }
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-secondary transition-colors text-left min-h-14"
                >
                  <div>
                    <p className="text-sm font-medium leading-[1.7]">{ex.nameTh}</p>
                    <p className="text-xs text-muted-foreground">{ex.muscleGroups.join(" · ")}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
