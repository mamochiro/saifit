"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface WorkoutRow {
  id: string;
  name: string;
  startedAt: string;
  completedAt: string | null;
  durationSeconds: number | null;
  exerciseCount: number;
  totalSets: number;
  totalVolume: string | number;
  abandonedWorkout: boolean;
}

interface ListResponse {
  data: WorkoutRow[];
  nextCursor: string | null;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  return `${m} นาที`;
}

function formatVolume(vol: string | number): string {
  const n = typeof vol === "string" ? Number.parseFloat(vol) : vol;
  return `${new Intl.NumberFormat("th-TH").format(Math.round(n))} กก.`;
}

function getWeekGroup(dateStr: string, t: (key: string) => string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - now.getDay());
  startOfThisWeek.setHours(0, 0, 0, 0);
  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

  if (d >= startOfThisWeek) return t("thisWeek");
  if (d >= startOfLastWeek) return t("lastWeek");
  return d.toLocaleDateString("th-TH", { month: "long", year: "numeric" });
}

function HistorySkeleton() {
  return (
    <div className="px-4 py-4 space-y-0">
      {Array.from({ length: 5 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
        <div key={i} className="py-4 border-b border-border animate-pulse">
          <div className="h-4 bg-border rounded w-3/4 mb-2" />
          <div className="h-3 bg-border rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="px-4 py-12">
      <p className="text-foreground font-medium leading-[1.7] mb-2">{t("empty")}</p>
      <Link
        href="/templates"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {t("startNow")} →
      </Link>
    </div>
  );
}

export default function WorkoutHistoryPage() {
  const t = useTranslations("history");
  const router = useRouter();
  const queryClient = useQueryClient();
  const observerRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<ListResponse>({
      queryKey: ["workouts"],
      queryFn: ({ pageParam }) =>
        fetch(
          `/api/workouts${pageParam ? `?cursor=${encodeURIComponent(pageParam as string)}` : ""}`,
        ).then((r) => r.json() as Promise<ListResponse>),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
    });

  // Infinite scroll observer
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

  const allWorkouts = data?.pages.flatMap((p) => p.data) ?? [];

  // Find first abandoned workout
  const abandonedWorkout = allWorkouts.find((w) => w.abandonedWorkout) ?? null;

  async function handleResume() {
    if (!abandonedWorkout) return;
    router.push(`/workout/${abandonedWorkout.id}`);
  }

  async function handleDiscard() {
    if (!abandonedWorkout) return;
    await fetch(`/api/workouts/${abandonedWorkout.id}`, { method: "DELETE" });
    queryClient.invalidateQueries({ queryKey: ["workouts"] });
  }

  const handleTouchStart = (id: string) => {
    longPressTimer.current = setTimeout(() => setDeletingId(id), 600);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  async function handleDeleteConfirm(id: string) {
    setDeleteLoading(true);
    await fetch(`/api/workouts/${id}`, { method: "DELETE" });
    setDeletingId(null);
    setDeleteLoading(false);
    queryClient.invalidateQueries({ queryKey: ["workouts"] });
  }

  // Group workouts by week label
  const workoutList = (() => {
    let lastGroup = "";
    return allWorkouts.map((workout) => {
      const group = getWeekGroup(workout.startedAt, t);
      const showHeader = group !== lastGroup;
      lastGroup = group;
      return { workout, group, showHeader };
    });
  })();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-4 pt-10 pb-4 border-b border-border">
        <h1 className="text-xl font-semibold leading-[1.7]">{t("title")}</h1>
      </div>

      {/* Abandoned workout banner — full-width, NO side-stripe border */}
      {abandonedWorkout && (
        <div className="px-4 py-4 bg-card border-b border-border flex items-center justify-between">
          <p className="text-sm leading-[1.7] text-foreground">{t("abandoned")}</p>
          <div className="flex gap-2 shrink-0 ml-4">
            <button
              type="button"
              onClick={handleResume}
              className="h-9 px-4 text-sm font-semibold bg-primary text-primary-foreground rounded-lg"
            >
              {t("resume")}
            </button>
            <button
              type="button"
              onClick={handleDiscard}
              className="h-9 px-4 text-sm text-muted-foreground border border-border rounded-lg"
            >
              {t("discard")}
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <HistorySkeleton />
      ) : allWorkouts.length === 0 ? (
        <EmptyState t={t} />
      ) : (
        <div>
          {workoutList.map(({ workout, group, showHeader }) => (
            <div key={workout.id} className="border-b border-border last:border-b-0">
              {/* Week header — only when group changes */}
              {showHeader && (
                <div className="px-4 pt-6 pb-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide leading-[1.7]">
                    {group}
                  </p>
                </div>
              )}

              {/* Row */}
              <button
                type="button"
                onClick={() => deletingId !== workout.id && router.push(`/workout/${workout.id}`)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setDeletingId(workout.id);
                }}
                onTouchStart={() => handleTouchStart(workout.id)}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchEnd}
                className="w-full px-4 py-4 flex items-center justify-between text-left min-h-14 hover:bg-card/50 active:bg-card transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground leading-[1.7] truncate">
                    {workout.name}
                  </p>
                  <p className="text-xs text-muted-foreground leading-[1.7]">
                    {formatDate(workout.startedAt)} · {t("exercises", { n: workout.exerciseCount })}{" "}
                    · {t("sets", { n: workout.totalSets })}
                  </p>
                </div>
                <div className="text-right ml-4 shrink-0">
                  <p className="font-display tabular-nums text-sm text-foreground">
                    {formatVolume(workout.totalVolume)}
                  </p>
                  {workout.durationSeconds && (
                    <p className="text-xs text-muted-foreground">
                      {formatDuration(workout.durationSeconds)}
                    </p>
                  )}
                </div>
              </button>

              {/* Inline delete confirmation */}
              {deletingId === workout.id && (
                <div className="px-4 pb-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setDeletingId(null)}
                    className="flex-1 h-10 border border-border rounded-lg text-sm text-muted-foreground"
                  >
                    {t("discard")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteConfirm(workout.id)}
                    disabled={deleteLoading}
                    className="flex-1 h-10 bg-destructive text-white font-semibold rounded-lg text-sm disabled:opacity-50"
                  >
                    {deleteLoading ? "..." : t("deleteConfirm")}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Infinite scroll sentinel */}
      <div ref={observerRef} className="h-4" />
      {isFetchingNextPage && (
        <div className="py-4 text-center text-sm text-muted-foreground">กำลังโหลด...</div>
      )}
    </div>
  );
}
