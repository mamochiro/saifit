"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useLogRun, useRunSummary } from "./hooks";

type RunKind = "easy" | "tempo" | "interval" | "long" | "race" | "rest";

const KIND_COLOR: Record<RunKind, string> = {
  easy: "rgba(255,255,255,0.10)",
  tempo: "rgba(140,100,255,0.60)",
  interval: "rgba(120,180,255,0.65)",
  long: "rgba(80,140,255,0.55)",
  race: "rgba(220,80,120,0.65)",
  rest: "rgba(255,255,255,0.04)",
};

const KIND_GLOW: Partial<Record<RunKind, string>> = {
  tempo: "0 0 10px rgba(120,90,255,0.5)",
  long: "0 0 10px rgba(120,90,255,0.5)",
  race: "0 0 12px rgba(200,80,120,0.6)",
};

function formatPace(secPerKm: number | null | undefined): string {
  if (!secPerKm) return "—";
  const min = Math.floor(secPerKm / 60);
  const sec = secPerKm % 60;
  return `${min}:${String(sec).padStart(2, "0")}`;
}

function StatTile({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="glass" style={{ padding: "14px 12px", textAlign: "left" }}>
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 9,
          letterSpacing: "0.14em",
          color: "var(--ink-soft)",
        }}
      >
        {label}
      </div>
      <div
        className="t-num"
        style={{ fontSize: 22, color: "var(--ink)", marginTop: 4, lineHeight: 1 }}
      >
        {value}
      </div>
      {unit && (
        <div
          style={{
            fontFamily: "K2D, sans-serif",
            fontSize: 10,
            color: "var(--ink-soft)",
            marginTop: 2,
          }}
        >
          {unit}
        </div>
      )}
    </div>
  );
}

interface LogFormData {
  distanceKm: string;
  durationMin: string;
  durationSec: string;
  runType: "easy" | "tempo" | "interval" | "long" | "race";
}

export default function RunPage() {
  const t = useTranslations("run");
  const { data: summary, isLoading } = useRunSummary();
  const logRun = useLogRun();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<LogFormData>({
    distanceKm: "",
    durationMin: "",
    durationSec: "",
    runType: "easy",
  });

  const todayBkk = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });

  const todayPlan = summary?.weekPlan.find((d) => d.isToday);
  const totalKm = summary?.totalKm ?? 0;
  const latestPace = summary?.latestPace ?? null;

  async function handleLog() {
    const km = Number(form.distanceKm.replace(",", "."));
    const mins = Number(form.durationMin) || 0;
    const secs = Number(form.durationSec) || 0;
    const totalSec = mins * 60 + secs;
    if (!km || !totalSec) return;

    await logRun.mutateAsync({
      runDate: todayBkk,
      distanceKm: km,
      durationSeconds: totalSec,
      runType: form.runType,
    });
    setShowForm(false);
    setForm({ distanceKm: "", durationMin: "", durationSec: "", runType: "easy" });
  }

  return (
    <div className="saifit-bg" style={{ minHeight: "100vh", paddingBottom: 110 }}>
      <div style={{ padding: "40px 24px 0" }}>
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

      {/* Hero — today */}
      <div style={{ padding: "16px 24px 0" }}>
        <div
          className="glass glass-glow"
          style={{ padding: "20px 22px", position: "relative", overflow: "hidden" }}
        >
          <div
            style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
          >
            <div className="t-label">
              {todayPlan?.session
                ? `${t("today")} · ${todayPlan.session.runType.toUpperCase()}`
                : t("today")}
            </div>
            {todayPlan?.session && (
              <span className="tag-violet">{todayPlan.session.distanceKm.toFixed(1)} KM</span>
            )}
          </div>

          {todayPlan?.session ? (
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 14 }}>
              <span className="t-num" style={{ fontSize: 56, lineHeight: 0.9 }}>
                {formatPace(todayPlan.session.avgPaceSecPerKm)}
              </span>
              <span
                style={{ fontFamily: "K2D, sans-serif", fontSize: 13, color: "var(--ink-mute)" }}
              >
                min/km
              </span>
            </div>
          ) : (
            <div
              style={{
                marginTop: 14,
                fontFamily: "K2D, sans-serif",
                fontSize: 15,
                color: "var(--ink-mute)",
                lineHeight: 1.6,
              }}
            >
              {isLoading ? "..." : t("noSessionToday")}
            </div>
          )}

          <svg
            viewBox="0 0 200 30"
            style={{
              position: "absolute",
              right: -20,
              bottom: 60,
              width: 180,
              opacity: 0.5,
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            <path
              d="M0 25 Q20 5, 40 18 T80 12 T120 20 T160 8 T200 18"
              stroke="var(--violet-bright)"
              strokeWidth="1.4"
              fill="none"
            />
          </svg>

          <button
            type="button"
            className="btn-primary"
            style={{
              width: "100%",
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            onClick={() => setShowForm(true)}
          >
            <svg
              viewBox="0 0 16 16"
              width={14}
              height={14}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M8 3v10M3 8h10" />
            </svg>
            {t("logRun")}
          </button>
        </div>
      </div>

      {/* Weekly grid */}
      <div style={{ padding: "14px 24px 0" }}>
        <div className="glass" style={{ padding: 18 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <span className="t-label">{t("today")}</span>
            <span
              style={{
                fontFamily: "Chakra Petch, monospace",
                fontWeight: 700,
                fontSize: 12,
                color: "var(--violet-bright)",
                letterSpacing: "0.08em",
              }}
            >
              {isLoading ? "..." : `${totalKm.toFixed(1)} KM`}
            </span>
          </div>

          {(summary?.weekPlan ?? Array.from({ length: 7 })).length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(summary?.weekPlan ?? []).map((w) => {
                const kind = (w.session?.runType as RunKind) ?? "rest";
                const km = w.session?.distanceKm ?? 0;
                const maxKm = Math.max(
                  ...(summary?.weekPlan.map((d) => d.session?.distanceKm ?? 0) ?? [1]),
                );
                return (
                  <div
                    key={w.en}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "32px 1fr auto auto",
                      alignItems: "center",
                      gap: 12,
                      padding: "8px 10px",
                      borderRadius: 10,
                      background: w.isToday ? "rgba(140,100,255,0.08)" : "transparent",
                      border: `1px solid ${w.isToday ? "var(--violet-edge)" : "transparent"}`,
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontFamily: "K2D, sans-serif",
                          fontWeight: 700,
                          fontSize: 13,
                          color: w.isToday ? "var(--violet-bright)" : "var(--ink)",
                        }}
                      >
                        {w.th}
                      </div>
                      <div
                        style={{
                          fontFamily: "system-ui, sans-serif",
                          fontSize: 8,
                          color: "var(--ink-mute)",
                          letterSpacing: "0.10em",
                        }}
                      >
                        {w.en}
                      </div>
                    </div>
                    <div
                      style={{
                        height: 22,
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          height: 8,
                          borderRadius: 4,
                          width: `${Math.max(8, (km / (maxKm || 1)) * 100)}%`,
                          background: KIND_COLOR[kind],
                          boxShadow: KIND_GLOW[kind] ?? "none",
                          transition: "width 0.4s ease-out",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontFamily: "K2D, sans-serif",
                        fontSize: 11,
                        color: "var(--ink-soft)",
                        minWidth: 70,
                        textAlign: "right",
                      }}
                    >
                      {w.session?.runType ? t(w.session.runType as Parameters<typeof t>[0]) : "—"}
                    </span>
                    <span
                      className="t-num"
                      style={{
                        fontSize: 14,
                        color: km ? "var(--ink)" : "var(--ink-mute)",
                        minWidth: 36,
                        textAlign: "right",
                      }}
                    >
                      {km ? km.toFixed(1) : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                padding: "20px 0",
                textAlign: "center",
                fontFamily: "K2D, sans-serif",
                fontSize: 13,
                color: "var(--ink-mute)",
                lineHeight: 1.6,
              }}
            >
              {t("noRunsThisWeek")}
            </div>
          )}
        </div>
      </div>

      {/* Stat tiles */}
      <div
        style={{
          padding: "12px 24px 0",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
          gap: 8,
        }}
      >
        <StatTile label={t("weekly")} value={isLoading ? "—" : `${totalKm.toFixed(1)}`} unit="km" />
        <StatTile
          label={t("longest")}
          value={isLoading ? "—" : `${(summary?.longestKm ?? 0).toFixed(1)}`}
          unit="km"
        />
        <StatTile
          label={t("latestPace")}
          value={isLoading ? "—" : (latestPace ?? "—")}
          unit="min/km"
        />
      </div>

      {/* Log form */}
      {showForm && (
        <div style={{ padding: "14px 24px 0" }}>
          <div className="glass" style={{ padding: 18 }}>
            <div className="t-label" style={{ marginBottom: 14 }}>
              {t("logRunTitle")}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label
                  htmlFor="run-distance"
                  style={{
                    fontFamily: "system-ui",
                    fontSize: 9,
                    color: "var(--ink-soft)",
                    letterSpacing: "0.14em",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  {t("distance")}
                </label>
                <input
                  id="run-distance"
                  className="glass-input"
                  inputMode="decimal"
                  value={form.distanceKm}
                  onChange={(e) => setForm((f) => ({ ...f, distanceKm: e.target.value }))}
                  placeholder="0.0"
                  style={{ width: "100%", textAlign: "right" }}
                />
              </div>
              <div>
                <label
                  htmlFor="run-duration-min"
                  style={{
                    fontFamily: "system-ui",
                    fontSize: 9,
                    color: "var(--ink-soft)",
                    letterSpacing: "0.14em",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  {t("duration")}
                </label>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input
                    id="run-duration-min"
                    className="glass-input"
                    inputMode="numeric"
                    value={form.durationMin}
                    onChange={(e) => setForm((f) => ({ ...f, durationMin: e.target.value }))}
                    placeholder="0"
                    style={{ flex: 1, textAlign: "right" }}
                  />
                  <span
                    style={{
                      fontFamily: "K2D, sans-serif",
                      fontSize: 11,
                      color: "var(--ink-mute)",
                    }}
                  >
                    min
                  </span>
                  <input
                    id="run-duration-sec"
                    className="glass-input"
                    inputMode="numeric"
                    value={form.durationSec}
                    onChange={(e) => setForm((f) => ({ ...f, durationSec: e.target.value }))}
                    placeholder="0"
                    style={{ flex: 1, textAlign: "right" }}
                  />
                  <span
                    style={{
                      fontFamily: "K2D, sans-serif",
                      fontSize: 11,
                      color: "var(--ink-mute)",
                    }}
                  >
                    sec
                  </span>
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "system-ui",
                    fontSize: 9,
                    color: "var(--ink-soft)",
                    letterSpacing: "0.14em",
                    marginBottom: 6,
                  }}
                >
                  {t("runType")}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {(["easy", "tempo", "interval", "long", "race"] as const).map((kind) => (
                    <button
                      key={kind}
                      type="button"
                      className={`pill${form.runType === kind ? " is-active" : ""}`}
                      onClick={() => setForm((f) => ({ ...f, runType: kind }))}
                    >
                      {t(kind)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button
                type="button"
                className="btn-glass"
                style={{ flex: 1 }}
                onClick={() => setShowForm(false)}
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{ flex: 2 }}
                onClick={handleLog}
                disabled={logRun.isPending}
              >
                {logRun.isPending ? t("saving") : t("save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
