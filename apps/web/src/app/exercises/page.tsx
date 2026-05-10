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
    <div style={{ padding: "14px 24px 0", display: "flex", flexDirection: "column", gap: 10 }}>
      {(["sk-a", "sk-b", "sk-c", "sk-d", "sk-e"] as const).map((k) => (
        <div
          key={k}
          style={{
            height: 68,
            borderRadius: 20,
            background: "rgba(255,255,255,0.04)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
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
    <div className="saifit-bg" style={{ minHeight: "100vh", paddingBottom: 110 }}>
      {/* Header */}
      <div style={{ padding: "40px 24px 0" }}>
        <span className="t-label">EXERCISE</span>
        <h1
          style={{
            fontFamily: "K2D, sans-serif",
            fontWeight: 700,
            fontSize: 26,
            color: "var(--ink)",
            letterSpacing: "-0.01em",
            lineHeight: 1.15,
            margin: "6px 0 16px",
          }}
        >
          {t("title")}
        </h1>

        {/* Search input */}
        <div className="glass-input">
          <svg
            viewBox="0 0 20 20"
            width={16}
            height={16}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--ink-soft)", flexShrink: 0 }}
            aria-hidden="true"
          >
            <circle cx="8.5" cy="8.5" r="5.5" />
            <path d="M15 15l-3-3" />
          </svg>
          <input
            type="search"
            placeholder={t("search")}
            value={rawQ}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Muscle filter pills */}
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "16px 24px 0",
          overflowX: "auto",
          flexWrap: "nowrap",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {MUSCLE_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setSelectedMuscle(f.value)}
            className={`pill${selectedMuscle === f.value ? " is-active" : ""}`}
          >
            {t(f.labelKey)}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <ExerciseSkeleton />
      ) : allExercises.length === 0 ? (
        <div style={{ padding: "64px 24px", textAlign: "center" }}>
          <p
            style={{
              fontFamily: "K2D, sans-serif",
              fontSize: 15,
              color: "var(--ink-mute)",
            }}
          >
            {t("noResults")}
          </p>
          {(q || selectedMuscle) && (
            <button
              type="button"
              onClick={() => {
                setRawQ("");
                setQ("");
                setSelectedMuscle("");
              }}
              style={{
                fontFamily: "K2D, sans-serif",
                fontSize: 13,
                color: "var(--ink-soft)",
                marginTop: 12,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {t("clearFilters")}
            </button>
          )}
        </div>
      ) : (
        <div style={{ padding: "14px 24px 0", display: "flex", flexDirection: "column", gap: 8 }}>
          {allExercises.map((ex) => (
            <Link
              key={ex.id}
              href={`/exercises/${ex.slug}`}
              className="glass"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                textDecoration: "none",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: "K2D, sans-serif",
                    fontSize: 15,
                    fontWeight: 500,
                    color: "var(--ink)",
                    lineHeight: 1.3,
                  }}
                >
                  {ex.nameTh}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 4,
                    marginTop: 6,
                  }}
                >
                  {ex.muscleGroups.map((mg) => (
                    <span
                      key={mg}
                      className="tag-violet"
                      style={{ fontSize: 10, padding: "2px 8px" }}
                    >
                      {mg}
                    </span>
                  ))}
                  <span
                    style={{
                      fontFamily: "system-ui, sans-serif",
                      fontSize: 10,
                      letterSpacing: "0.08em",
                      color: "var(--ink-soft)",
                      textTransform: "uppercase",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {ex.equipment}
                  </span>
                </div>
              </div>
              <svg
                viewBox="0 0 20 20"
                width={16}
                height={16}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "var(--ink-mute)", flexShrink: 0, marginLeft: 12 }}
                aria-hidden="true"
              >
                <path d="M4 10h12M10 4l6 6-6 6" />
              </svg>
            </Link>
          ))}
        </div>
      )}

      {/* Infinite scroll sentinel */}
      <div ref={observerRef} style={{ height: 16 }} />
      {isFetchingNextPage && (
        <div
          style={{
            padding: "16px 0",
            textAlign: "center",
            fontFamily: "K2D, sans-serif",
            fontSize: 13,
            color: "var(--ink-mute)",
          }}
        >
          ...
        </div>
      )}
    </div>
  );
}
