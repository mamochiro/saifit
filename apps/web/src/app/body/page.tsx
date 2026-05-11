"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useBodySummary, useLogMeasurement } from "./hooks";

type MuscleId =
  | "shoulders"
  | "chest"
  | "biceps"
  | "abs"
  | "quads"
  | "lats"
  | "glutes"
  | "hamstrings";

function MuscleMap({ primary, secondary }: { primary: MuscleId[]; secondary: MuscleId[] }) {
  const color = (id: MuscleId) => {
    if (primary.includes(id)) return "rgba(140,100,255,0.70)";
    if (secondary.includes(id)) return "rgba(140,100,255,0.30)";
    return "rgba(255,255,255,0.10)";
  };

  return (
    <svg width="100" height="150" viewBox="0 0 100 150" fill="none" aria-hidden="true">
      <ellipse cx="50" cy="12" rx="8" ry="9" fill="rgba(255,255,255,0.15)" />
      <rect x="46" y="20" width="8" height="7" rx="2" fill="rgba(255,255,255,0.10)" />
      <path
        d="M30 28 Q22 32 20 50 L18 78 L82 78 L80 50 Q78 32 70 28 Z"
        fill="rgba(255,255,255,0.06)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="0.8"
      />
      <ellipse cx="24" cy="32" rx="9" ry="7" fill={color("shoulders")} />
      <ellipse cx="76" cy="32" rx="9" ry="7" fill={color("shoulders")} />
      <path d="M30 30 Q50 28 70 30 L68 50 Q50 54 32 50 Z" fill={color("chest")} />
      <path d="M20 42 L30 40 L28 68 L18 66 Z" fill={color("lats")} />
      <path d="M80 42 L70 40 L72 68 L82 66 Z" fill={color("lats")} />
      <path d="M36 52 L64 52 L62 76 L38 76 Z" fill={color("abs")} />
      <ellipse cx="17" cy="52" rx="5" ry="12" fill={color("biceps")} />
      <ellipse cx="83" cy="52" rx="5" ry="12" fill={color("biceps")} />
      <rect x="13" y="63" width="8" height="14" rx="3" fill="rgba(255,255,255,0.07)" />
      <rect x="79" y="63" width="8" height="14" rx="3" fill="rgba(255,255,255,0.07)" />
      <path d="M30 76 L70 76 L74 90 L26 90 Z" fill="rgba(255,255,255,0.08)" />
      <ellipse cx="36" cy="88" rx="10" ry="8" fill={color("glutes")} />
      <ellipse cx="64" cy="88" rx="10" ry="8" fill={color("glutes")} />
      <path d="M27 88 L42 88 L44 128 L24 128 Z" fill={color("quads")} />
      <path d="M73 88 L58 88 L56 128 L76 128 Z" fill={color("quads")} />
      <path d="M24 100 L40 100 L42 128 L22 128 Z" fill={color("hamstrings")} opacity="0.6" />
      <path d="M76 100 L60 100 L58 128 L78 128 Z" fill={color("hamstrings")} opacity="0.6" />
      <ellipse cx="33" cy="130" rx="8" ry="5" fill="rgba(255,255,255,0.07)" />
      <ellipse cx="67" cy="130" rx="8" ry="5" fill="rgba(255,255,255,0.07)" />
      <path d="M27 134 L38 134 L36 150 L28 150 Z" fill="rgba(255,255,255,0.07)" />
      <path d="M62 134 L73 134 L72 150 L64 150 Z" fill="rgba(255,255,255,0.07)" />
    </svg>
  );
}

function DeltaBadge({ delta }: { delta: number | null }) {
  if (delta == null || delta === 0) return null;
  const positive = delta > 0;
  const color = positive ? "var(--success)" : "var(--violet-bright)";
  const sign = positive ? "+" : "";
  return (
    <div
      style={{
        marginTop: 4,
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontFamily: "Chakra Petch, monospace",
        fontSize: 11,
        fontWeight: 600,
        color,
      }}
    >
      <span aria-hidden="true">{positive ? "▲" : "▼"}</span>
      {sign}
      {delta}
    </div>
  );
}

function buildTrendPath(
  points: Array<{ date: string; weightKg: number | null }>,
  width = 300,
  height = 80,
): { path: string; fill: string; latest: { x: number; y: number } } | null {
  const valid = points.filter((p) => p.weightKg != null) as Array<{
    date: string;
    weightKg: number;
  }>;
  if (valid.length < 2) return null;

  const weights = valid.map((p) => p.weightKg);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const range = maxW - minW || 1;

  const dates = valid.map((p) => new Date(p.date).getTime());
  const minD = Math.min(...dates);
  const maxD = Math.max(...dates) - minD || 1;

  const pts = valid.map((p) => ({
    x: ((new Date(p.date).getTime() - minD) / maxD) * width,
    y: height - ((p.weightKg - minW) / range) * (height - 10) - 5,
  }));

  const d = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const fill = `${d} L${width} ${height} L0 ${height} Z`;
  const latestPt = pts[pts.length - 1];
  if (!latestPt) return null;
  return { path: d, fill, latest: latestPt };
}

interface LogFormData {
  weightKg: string;
  bodyFatPct: string;
  chestCm: string;
  waistCm: string;
  armCm: string;
  thighCm: string;
}

function toNum(s: string): number | null {
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function BodySkeleton() {
  return (
    <div className="saifit-bg" style={{ minHeight: "100vh", paddingBottom: 110 }}>
      <div style={{ padding: "40px 24px 16px" }}>
        <div
          style={{
            height: 10,
            width: 140,
            borderRadius: 4,
            background: "rgba(255,255,255,0.04)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: 28,
            width: "60%",
            borderRadius: 8,
            marginTop: 10,
            background: "rgba(255,255,255,0.06)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      </div>
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {(["b-a", "b-b", "b-c"] as const).map((k, i) => (
          <div
            key={k}
            style={{
              height: i === 0 ? 160 : 100,
              borderRadius: 20,
              background: "rgba(255,255,255,0.04)",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function BodyPage() {
  const t = useTranslations("body");
  const tCommon = useTranslations("common");
  const { data: summary, isLoading, isError, refetch } = useBodySummary();
  const logMeasurement = useLogMeasurement();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<LogFormData>({
    weightKg: "",
    bodyFatPct: "",
    chestCm: "",
    waistCm: "",
    armCm: "",
    thighCm: "",
  });

  const todayBkk = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });

  const latest = summary?.latest;
  const deltas = summary?.deltas;
  const trend90 = summary?.trend90 ?? [];

  const trendPath = buildTrendPath(trend90);

  const weightDelta90 = (() => {
    const valid = trend90.filter((p) => p.weightKg != null);
    const firstEl = valid[0];
    const lastEl = valid[valid.length - 1];
    if (!firstEl || !lastEl || valid.length < 2) return null;
    const first = firstEl.weightKg ?? 0;
    const last = lastEl.weightKg ?? 0;
    return Math.round((last - first) * 10) / 10;
  })();

  const canSubmit = Object.values(form).some((v) => toNum(v) !== null);

  async function handleLog() {
    if (!canSubmit) return;
    await logMeasurement.mutateAsync({
      recordedAt: todayBkk,
      weightKg: toNum(form.weightKg),
      bodyFatPct: toNum(form.bodyFatPct),
      chestCm: toNum(form.chestCm),
      waistCm: toNum(form.waistCm),
      armCm: toNum(form.armCm),
      thighCm: toNum(form.thighCm),
    });
    setShowForm(false);
    setForm({ weightKg: "", bodyFatPct: "", chestCm: "", waistCm: "", armCm: "", thighCm: "" });
  }

  const field = (key: keyof LogFormData, label: string, unit: string) => (
    <div>
      <label
        htmlFor={`body-${key}`}
        style={{
          fontFamily: "system-ui",
          fontSize: 9,
          color: "var(--ink-soft)",
          letterSpacing: "0.14em",
          display: "block",
          marginBottom: 4,
        }}
      >
        {label}
      </label>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <input
          id={`body-${key}`}
          className="glass-input"
          inputMode="decimal"
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          placeholder="0"
          style={{ flex: 1, textAlign: "right" }}
        />
        <span
          style={{
            fontFamily: "K2D, sans-serif",
            fontSize: 11,
            color: "var(--ink-mute)",
            minWidth: 24,
          }}
        >
          {unit}
        </span>
      </div>
    </div>
  );

  if (isLoading) return <BodySkeleton />;

  if (isError) {
    return (
      <div
        className="saifit-bg"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "K2D, sans-serif",
              fontSize: 15,
              color: "var(--ink-mute)",
              lineHeight: 1.6,
              marginBottom: 16,
            }}
          >
            {tCommon("loadError")}
          </div>
          <button
            type="button"
            className="btn-glass"
            style={{ minHeight: 56 }}
            onClick={() => refetch()}
          >
            {tCommon("retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="saifit-bg" style={{ minHeight: "100vh", paddingBottom: 110 }}>
      <div style={{ padding: "40px 24px 0" }}>
        <span className="t-label">{t("trendLabel")}</span>
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

      {/* Composition card */}
      <div style={{ padding: "16px 24px 0" }}>
        <div
          className="glass glass-glow"
          style={{ padding: "20px 22px", display: "flex", gap: 18 }}
        >
          <div
            style={{
              width: 110,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MuscleMap
              primary={["chest", "quads", "lats"]}
              secondary={["shoulders", "biceps", "abs", "glutes", "hamstrings"]}
            />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <div className="t-label">{t("bodyFat")}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
                <span className="t-num" style={{ fontSize: 32, color: "var(--ink)" }}>
                  {isLoading
                    ? "—"
                    : latest?.bodyFatPct != null
                      ? Number(latest.bodyFatPct).toFixed(1)
                      : "—"}
                </span>
                <span
                  style={{ fontFamily: "K2D, sans-serif", fontSize: 12, color: "var(--ink-mute)" }}
                >
                  % {t("bodyFat").toLowerCase()}
                </span>
              </div>
              {deltas?.bodyFatPct != null && <DeltaBadge delta={deltas.bodyFatPct} />}
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "system-ui, sans-serif",
                  fontSize: 9,
                  color: "var(--ink-soft)",
                  letterSpacing: "0.12em",
                  marginBottom: 4,
                }}
              >
                <span>{t("fatEssential")}</span>
                <span>{t("fatHealthy")}</span>
                <span>{t("fatHigh")}</span>
              </div>
              <div
                style={{
                  position: "relative",
                  height: 10,
                  borderRadius: 5,
                  overflow: "hidden",
                  background:
                    "linear-gradient(90deg, var(--success), rgba(140,100,255,0.60) 25%, rgba(140,100,255,0.60) 75%, var(--danger))",
                }}
              >
                {latest?.bodyFatPct != null && (
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: -3,
                      left: `${Math.min(Math.max((Number(latest.bodyFatPct) / 35) * 100, 2), 98)}%`,
                      width: 3,
                      height: 16,
                      borderRadius: 2,
                      background: "#fff",
                      boxShadow: "0 0 10px #fff",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stat tiles */}
      <div
        style={{ padding: "14px 24px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
      >
        {[
          {
            key: t("weight"),
            val: latest?.weightKg != null ? Number(latest.weightKg).toFixed(1) : "—",
            unit: "kg",
            delta: deltas?.weightKg ?? null,
          },
          {
            key: t("bodyFat"),
            val: latest?.bodyFatPct != null ? Number(latest.bodyFatPct).toFixed(1) : "—",
            unit: "%",
            delta: deltas?.bodyFatPct ?? null,
          },
          {
            key: `CHEST · ${t("chest")}`,
            val: latest?.chestCm != null ? Number(latest.chestCm).toFixed(0) : "—",
            unit: "cm",
            delta: deltas?.chestCm ?? null,
          },
          {
            key: `WAIST · ${t("waist")}`,
            val: latest?.waistCm != null ? Number(latest.waistCm).toFixed(0) : "—",
            unit: "cm",
            delta: deltas?.waistCm ?? null,
          },
        ].map((s) => (
          <div key={s.key} className="glass" style={{ padding: 14 }}>
            <div className="t-label">{s.key}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
              <span className="t-num" style={{ fontSize: 22, color: "var(--ink)" }}>
                {isLoading ? "—" : s.val}
              </span>
              <span
                style={{ fontFamily: "K2D, sans-serif", fontSize: 11, color: "var(--ink-soft)" }}
              >
                {s.unit}
              </span>
            </div>
            <DeltaBadge delta={s.delta} />
          </div>
        ))}
      </div>

      {/* Weight trend chart */}
      <div style={{ padding: "14px 24px 0" }}>
        <div className="glass" style={{ padding: 18 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 12,
            }}
          >
            <div className="t-label">{t("weightTrend")}</div>
            {weightDelta90 != null && (
              <span
                className="t-num"
                style={{
                  fontSize: 12,
                  color: weightDelta90 < 0 ? "var(--success)" : "var(--danger)",
                }}
              >
                {weightDelta90 > 0 ? "+" : ""}
                {weightDelta90} kg
              </span>
            )}
          </div>
          {trendPath ? (
            <svg
              width="100%"
              height="80"
              viewBox="0 0 300 80"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="wtFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(140,100,255,0.35)" />
                  <stop offset="100%" stopColor="rgba(140,100,255,0)" />
                </linearGradient>
              </defs>
              <path d={trendPath.fill} fill="url(#wtFill)" />
              <path
                d={trendPath.path}
                stroke="var(--violet)"
                strokeWidth="1.6"
                fill="none"
                style={{ filter: "drop-shadow(0 0 6px var(--violet))" }}
              />
              <circle
                cx={trendPath.latest.x}
                cy={trendPath.latest.y}
                r="3"
                fill="#fff"
                style={{ filter: "drop-shadow(0 0 6px var(--violet))" }}
              />
            </svg>
          ) : (
            <div
              style={{
                height: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "K2D, sans-serif",
                fontSize: 12,
                color: "var(--ink-mute)",
              }}
            >
              {t("noWeightData")}
            </div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 4,
              fontFamily: "system-ui, sans-serif",
              fontSize: 9,
              color: "var(--ink-mute)",
              letterSpacing: "0.10em",
            }}
          >
            <span>{t("trendDays90")}</span>
            <span>{t("trendDays60")}</span>
            <span>{t("trendDays30")}</span>
            <span>{t("trendToday")}</span>
          </div>
        </div>
      </div>

      {/* Measurements grid */}
      <div style={{ padding: "14px 24px 0" }}>
        <div className="glass" style={{ padding: 18 }}>
          <div className="t-label" style={{ marginBottom: 12 }}>
            {t("measurements")}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { key: `ARM · ${t("arm")}`, val: latest?.armCm, delta: deltas?.armCm },
              { key: `THIGH · ${t("thigh")}`, val: latest?.thighCm, delta: deltas?.thighCm },
            ].map((m) => (
              <div
                key={m.key}
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid var(--glass-line)",
                }}
              >
                <div
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: 9,
                    color: "var(--ink-soft)",
                    letterSpacing: "0.14em",
                    fontWeight: 600,
                  }}
                >
                  {m.key}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 2 }}>
                  <span className="t-num" style={{ fontSize: 20, color: "var(--ink)" }}>
                    {isLoading ? "—" : m.val != null ? Number(m.val).toFixed(0) : "—"}
                  </span>
                  {m.delta != null && (
                    <span
                      style={{
                        fontFamily: "Chakra Petch, monospace",
                        fontSize: 11,
                        fontWeight: 600,
                        color: m.delta > 0 ? "var(--success)" : "var(--violet-bright)",
                      }}
                    >
                      {m.delta > 0 ? "+" : ""}
                      {m.delta}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Empty state — no measurements logged yet */}
      {!latest && !isLoading && (
        <div style={{ padding: "14px 24px 0" }}>
          <div className="glass" style={{ padding: "20px 22px", textAlign: "center" }}>
            <div
              style={{
                fontFamily: "K2D, sans-serif",
                fontSize: 15,
                color: "var(--ink)",
                fontWeight: 600,
                lineHeight: 1.5,
              }}
            >
              {t("emptyTitle")}
            </div>
            <div
              style={{
                fontFamily: "K2D, sans-serif",
                fontSize: 13,
                color: "var(--ink-mute)",
                lineHeight: 1.6,
                marginTop: 6,
              }}
            >
              {t("emptyHint")}
            </div>
          </div>
        </div>
      )}

      {/* Log measurement button / form */}
      <div style={{ padding: "14px 24px 0" }}>
        {!showForm ? (
          <button
            type="button"
            className="btn-glass"
            style={{
              width: "100%",
              minHeight: 56,
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
            {t("logMeasurement")}
          </button>
        ) : (
          <div className="glass" style={{ padding: 18 }}>
            <div className="t-label" style={{ marginBottom: 14 }}>
              {t("logToday")}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {field("weightKg", `${t("weight")} · kg`, "kg")}
              {field("bodyFatPct", `${t("bodyFat")} · %`, "%")}
              {field("chestCm", `${t("chest")} · cm`, "cm")}
              {field("waistCm", `${t("waist")} · cm`, "cm")}
              {field("armCm", `${t("arm")} · cm`, "cm")}
              {field("thighCm", `${t("thigh")} · cm`, "cm")}
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
                disabled={!canSubmit || logMeasurement.isPending}
              >
                {logMeasurement.isPending ? t("saving") : t("save")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
