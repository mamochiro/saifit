"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Exercise {
  id: string;
  slug: string;
  nameEn: string;
  nameTh: string;
  category: string;
  muscleGroups: string[];
  equipment: string;
  isBodyweight: boolean;
}

interface ListResponse {
  data: Exercise[];
  nextCursor: string | null;
}

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

function ExerciseSkeleton() {
  return (
    <div>
      {Array.from({ length: 5 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
        <div key={i} className="px-4 py-4 border-b border-border animate-pulse">
          <div className="h-4 bg-border rounded w-2/3 mb-2" />
          <div className="h-3 bg-border rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}

export default function ExercisesPage() {
  const t = useTranslations("exercises");
  const [rawQ, setRawQ] = useState("");
  const [q, setQ] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  const handleSearch = (val: string) => {
    setRawQ(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setQ(val), 300);
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<ListResponse>({
      queryKey: ["exercises-list", q, selectedMuscle],
      queryFn: ({ pageParam }) => {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (selectedMuscle) params.set("muscle", selectedMuscle);
        if (pageParam) params.set("cursor", pageParam as string);
        return fetch(`/api/exercises?${params.toString()}`).then(
          (r) => r.json() as Promise<ListResponse>,
        );
      },
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
      staleTime: 60_000,
    });

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allExercises = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header + search */}
      <div className="px-4 pt-10 pb-3 border-b border-border">
        <h1 className="text-xl font-semibold leading-[1.7] mb-3">{t("title")}</h1>
        <input
          type="search"
          placeholder={t("search")}
          value={rawQ}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full h-12 px-4 bg-secondary border border-border rounded-xl text-sm outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Muscle filter chips — horizontal scroll */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-none border-b border-border">
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

      {/* Content */}
      {isLoading ? (
        <ExerciseSkeleton />
      ) : allExercises.length === 0 ? (
        <div className="px-4 py-12">
          <p className="text-foreground font-medium leading-[1.7] mb-2">{t("noResults")}</p>
          {(q || selectedMuscle) && (
            <button
              type="button"
              onClick={() => {
                setRawQ("");
                setQ("");
                setSelectedMuscle("");
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("clearFilters")}
            </button>
          )}
        </div>
      ) : (
        <div>
          {allExercises.map((ex) => (
            <Link
              key={ex.id}
              href={`/exercises/${ex.slug}`}
              className="block border-b border-border last:border-b-0"
            >
              <div className="px-4 py-4 min-h-14 hover:bg-card/50 transition-colors">
                <p className="text-sm font-medium text-foreground leading-[1.7]">{ex.nameTh}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {ex.muscleGroups.map((mg) => (
                    <span
                      key={mg}
                      className="bg-secondary text-muted-foreground rounded-full px-2 py-0.5 text-xs leading-[1.7]"
                    >
                      {mg}
                    </span>
                  ))}
                  <span className="bg-secondary text-muted-foreground rounded-full px-2 py-0.5 text-xs leading-[1.7]">
                    {ex.equipment}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Infinite scroll sentinel */}
      <div ref={observerRef} className="h-4" />
      {isFetchingNextPage && (
        <div className="py-4 text-center text-sm text-muted-foreground">{t("search")}...</div>
      )}
    </div>
  );
}
