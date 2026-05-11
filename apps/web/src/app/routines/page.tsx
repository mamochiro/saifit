"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDeleteRoutine, useRoutines, useStartRoutine } from "./hooks";

function formatLastUsed(dateStr: string | null, tNever: string): string {
  if (!dateStr) return tNever;
  return new Date(dateStr).toLocaleDateString("th-TH", { day: "numeric", month: "short" });
}

export default function RoutinesPage() {
  const t = useTranslations("routines");
  const { data: routines, isLoading } = useRoutines();
  const deleteRoutine = useDeleteRoutine();
  const startRoutine = useStartRoutine();
  const router = useRouter();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [startingId, setStartingId] = useState<string | null>(null);

  async function handleStart(id: string) {
    setStartingId(id);
    try {
      const workoutId = await startRoutine.mutateAsync(id);
      router.push(`/workout/${workoutId}`);
    } finally {
      setStartingId(null);
    }
  }

  return (
    <div className="saifit-bg" style={{ minHeight: "100vh", paddingBottom: 110 }}>
      <div style={{ padding: "40px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <span className="t-label">{t("pageLabel")}</span>
            <h1
              style={{
                fontFamily: "K2D, sans-serif",
                fontWeight: 700,
                fontSize: 26,
                color: "var(--ink)",
                letterSpacing: "-0.01em",
                lineHeight: 1.3,
                margin: "6px 0 0",
              }}
            >
              {t("title")}
            </h1>
          </div>
          <Link
            href="/routines/new"
            style={{
              marginTop: 36,
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "var(--violet)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: "0 0 14px var(--violet-glow)",
              flexShrink: 0,
            }}
            aria-label={t("new")}
          >
            <svg
              viewBox="0 0 16 16"
              width={16}
              height={16}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M8 3v10M3 8h10" />
            </svg>
          </Link>
        </div>
      </div>

      <div style={{ padding: "16px 24px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {isLoading ? (
          <>
            {(["r-a", "r-b", "r-c"] as const).map((k) => (
              <div
                key={k}
                style={{
                  height: 88,
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.04)",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </>
        ) : !routines || routines.length === 0 ? (
          <div className="glass" style={{ padding: 32, textAlign: "center" }}>
            <div
              style={{
                fontFamily: "K2D, sans-serif",
                fontSize: 14,
                color: "var(--ink-mute)",
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            >
              {t("empty")}
              <br />
              <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>{t("emptyHint")}</span>
            </div>
            <Link href="/routines/new" className="btn-primary" style={{ display: "inline-block" }}>
              {t("new")}
            </Link>
          </div>
        ) : (
          routines.map((routine) => (
            <div key={routine.id}>
              <div className="glass" style={{ padding: "16px 18px", position: "relative" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <Link
                    href={`/routines/${routine.id}`}
                    style={{ flex: 1, minWidth: 0, textDecoration: "none" }}
                  >
                    <p
                      style={{
                        fontFamily: "K2D, sans-serif",
                        fontSize: 16,
                        fontWeight: 600,
                        color: "var(--ink)",
                        lineHeight: 1.3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {routine.name}
                    </p>
                    <p
                      style={{
                        fontFamily: "K2D, sans-serif",
                        fontSize: 11,
                        color: "var(--ink-soft)",
                        marginTop: 3,
                      }}
                    >
                      {t("exerciseCount", { n: routine.exerciseCount })} ·{" "}
                      {formatLastUsed(routine.lastUsedAt, t("never"))}
                    </p>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleStart(routine.id)}
                    disabled={startingId === routine.id}
                    className="btn-primary"
                    style={{
                      height: 36,
                      padding: "0 16px",
                      fontSize: 13,
                      marginLeft: 12,
                      flexShrink: 0,
                    }}
                  >
                    {startingId === routine.id ? t("starting") : t("startWorkout")}
                  </button>
                </div>

                {confirmDeleteId === routine.id && (
                  <div
                    style={{
                      marginTop: 12,
                      display: "flex",
                      gap: 8,
                      padding: "10px 0 0",
                      borderTop: "1px solid var(--glass-line)",
                    }}
                  >
                    <button
                      type="button"
                      className="btn-glass"
                      style={{ flex: 1, height: 36, fontSize: 13 }}
                      onClick={() => setConfirmDeleteId(null)}
                    >
                      {t("cancel")}
                    </button>
                    <button
                      type="button"
                      style={{
                        flex: 1,
                        height: 36,
                        fontSize: 13,
                        borderRadius: 12,
                        background: "var(--danger)",
                        color: "white",
                        fontFamily: "K2D, sans-serif",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={async () => {
                        await deleteRoutine.mutateAsync(routine.id);
                        setConfirmDeleteId(null);
                      }}
                    >
                      {t("delete")}
                    </button>
                  </div>
                )}
              </div>

              {confirmDeleteId !== routine.id && (
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(routine.id)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                    fontFamily: "K2D, sans-serif",
                    fontSize: 11,
                    color: "var(--ink-faint)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px 0",
                  }}
                >
                  {t("delete")}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
