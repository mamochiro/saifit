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

export function ExercisePicker({
  workoutId: _workoutId,
  onClose,
  onSelect,
}: {
  workoutId: string;
  onClose: () => void;
  onSelect: (exerciseId: string) => void;
}) {
  const t = useTranslations("exercises");
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (val: string) => {
    setQ(val);
    if (timer) clearTimeout(timer);
    setTimer(setTimeout(() => setDebouncedQ(val), 300));
  };

  const { data, isLoading } = useQuery<{ data: Exercise[] }>({
    queryKey: ["exercises", debouncedQ],
    queryFn: () =>
      fetch(`/api/exercises?q=${encodeURIComponent(debouncedQ)}&limit=30`).then((r) => r.json()),
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
                  onClick={() => onSelect(ex.id)}
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
