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
    <div style={{ padding: "14px 24px 0", display: "flex", flexDirection: "column", gap: 10 }}>
      {(["h-a", "h-b", "h-c", "h-d", "h-e"] as const).map((k) => (
        <div
          key={k}
          style={{
            height: 72,
            borderRadius: 20,
            background: "rgba(255,255,255,0.04)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      ))}
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
    <div className="saifit-bg" style={{ minHeight: "100vh", paddingBottom: 110 }}>
      {/* Header */}
      <div style={{ padding: "40px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <span className="t-label">HISTORY</span>
            <h1
              style={{
                fontFamily: "K2D, sans-serif",
                fontWeight: 700,
                fontSize: 26,
                color: "var(--ink)",
                letterSpacing: "-0.01em",
                lineHeight: 1.15,
                margin: "6px 0 20px",
              }}
            >
              {t("title")}
            </h1>
          </div>
          <Link
            href="/settings"
            aria-label="ตั้งค่า"
            style={{
              marginTop: 36,
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid var(--glass-line)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--ink-mute)",
              flexShrink: 0,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width={17}
              height={17}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </Link>
        </div>

        {/* Abandoned workout banner */}
        {abandonedWorkout && (
          <div
            className="glass"
            style={{
              padding: "14px 18px",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p
              style={{
                fontFamily: "K2D, sans-serif",
                fontSize: 14,
                color: "var(--ink)",
                flex: 1,
              }}
            >
              {t("abandoned")}
            </p>
            <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: 12 }}>
              <button
                type="button"
                onClick={handleResume}
                className="btn-primary"
                style={{ height: 36, padding: "0 14px", fontSize: 13 }}
              >
                {t("resume")}
              </button>
              <button
                type="button"
                onClick={handleDiscard}
                className="btn-glass"
                style={{ height: 36, padding: "0 14px", fontSize: 13 }}
              >
                {t("discard")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <HistorySkeleton />
      ) : allWorkouts.length === 0 ? (
        <div style={{ padding: "64px 24px", textAlign: "center" }}>
          <p
            style={{
              fontFamily: "K2D, sans-serif",
              fontSize: 15,
              color: "var(--ink-mute)",
              marginBottom: 12,
            }}
          >
            {t("empty")}
          </p>
          <Link
            href="/templates"
            style={{
              fontFamily: "K2D, sans-serif",
              fontSize: 13,
              color: "var(--violet-bright)",
              textDecoration: "none",
            }}
          >
            {t("startNow")} →
          </Link>
        </div>
      ) : (
        <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 8 }}>
          {workoutList.map(({ workout, group, showHeader }) => (
            <div key={workout.id}>
              {showHeader && (
                <div style={{ padding: "16px 0 6px" }}>
                  <span className="t-label">{group}</span>
                </div>
              )}

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
                className="glass"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  textAlign: "left",
                  cursor: "pointer",
                  background: deletingId === workout.id ? "rgba(255,60,60,0.08)" : undefined,
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p
                    style={{
                      fontFamily: "K2D, sans-serif",
                      fontSize: 15,
                      fontWeight: 500,
                      color: "var(--ink)",
                      lineHeight: 1.3,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {workout.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "K2D, sans-serif",
                      fontSize: 11,
                      color: "var(--ink-soft)",
                      marginTop: 3,
                    }}
                  >
                    {formatDate(workout.startedAt)} · {t("exercises", { n: workout.exerciseCount })}{" "}
                    · {t("sets", { n: workout.totalSets })}
                  </p>
                </div>
                <div style={{ textAlign: "right", marginLeft: 14, flexShrink: 0 }}>
                  <p className="t-num" style={{ fontSize: 14, color: "var(--ink)" }}>
                    {formatVolume(workout.totalVolume)}
                  </p>
                  {workout.durationSeconds ? (
                    <p
                      style={{
                        fontFamily: "K2D, sans-serif",
                        fontSize: 11,
                        color: "var(--ink-soft)",
                        marginTop: 2,
                      }}
                    >
                      {formatDuration(workout.durationSeconds)}
                    </p>
                  ) : null}
                </div>
              </button>

              {/* Inline delete confirmation */}
              {deletingId === workout.id && (
                <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                  <button
                    type="button"
                    onClick={() => setDeletingId(null)}
                    className="btn-glass"
                    style={{ flex: 1, height: 44 }}
                  >
                    {t("discard")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteConfirm(workout.id)}
                    disabled={deleteLoading}
                    style={{
                      flex: 1,
                      height: 44,
                      borderRadius: 14,
                      background: "var(--danger)",
                      color: "white",
                      fontFamily: "K2D, sans-serif",
                      fontWeight: 700,
                      fontSize: 14,
                      border: "none",
                      cursor: "pointer",
                      opacity: deleteLoading ? 0.5 : 1,
                    }}
                  >
                    {deleteLoading ? "..." : t("deleteConfirm")}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

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
          กำลังโหลด...
        </div>
      )}
    </div>
  );
}
