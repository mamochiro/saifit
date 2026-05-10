"use client";

import { FlameIcon } from "@/components/icons";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface Summary {
  totalWorkouts: number;
  totalVolume: number;
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string | null;
}

interface PRRecord {
  recordType: string;
  value: number;
  achievedAt: string;
}

interface PRGroup {
  exerciseId: string;
  slug: string;
  nameEn: string;
  nameTh: string;
  records: PRRecord[];
}

interface HeatmapEntry {
  date: string;
  count: number;
}

interface WeeklyEntry {
  weekStart: string;
  totalVolume: number;
  byCategory: Record<string, number>;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ProgressSkeleton() {
  return (
    <div style={{ padding: "24px 24px 0", display: "flex", flexDirection: "column", gap: 16 }}>
      {(["skel-a", "skel-b", "skel-c"] as const).map((key) => (
        <div
          key={key}
          style={{
            borderRadius: 20,
            background: "rgba(255,255,255,0.04)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
          className={key === "skel-a" ? "" : key === "skel-b" ? "" : ""}
          // heights vary
        />
      ))}
      <div
        style={{
          height: 80,
          borderRadius: 20,
          background: "rgba(255,255,255,0.04)",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <div
        style={{
          height: 120,
          borderRadius: 20,
          background: "rgba(255,255,255,0.04)",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <div
        style={{
          height: 200,
          borderRadius: 20,
          background: "rgba(255,255,255,0.04)",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
    </div>
  );
}

// ─── HeatmapGrid ──────────────────────────────────────────────────────────────

function HeatmapGrid({ cells }: { cells: Array<{ date: string; count: number }> }) {
  const weeks: Array<Array<{ date: string; count: number }>> = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const monthLabels: Array<{ col: number; label: string }> = [];
  let lastMonth = -1;
  weeks.forEach((week, col) => {
    const firstDay = week[0];
    if (firstDay) {
      const month = new Date(firstDay.date).getMonth();
      if (month !== lastMonth) {
        monthLabels.push({
          col,
          label: new Date(firstDay.date).toLocaleDateString("th-TH", { month: "short" }),
        });
        lastMonth = month;
      }
    }
  });

  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ minWidth: `${weeks.length * 14 + 30}px` }}>
        {/* Month labels */}
        <div style={{ display: "flex", marginBottom: 4, marginLeft: 32 }}>
          {weeks.map((_, col) => {
            const label = monthLabels.find((m) => m.col === col);
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: static positional grid
              <div key={col} style={{ width: 14, flexShrink: 0 }}>
                {label && (
                  <span
                    style={{ fontFamily: "K2D, sans-serif", fontSize: 9, color: "var(--ink-soft)" }}
                  >
                    {label.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 0 }}>
          {/* Day-of-week labels */}
          <div style={{ display: "flex", flexDirection: "column", marginRight: 4, gap: 2 }}>
            {["", "M", "", "W", "", "F", ""].map((d, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static day labels
              <div key={i} style={{ width: 24, height: 12 }}>
                <span
                  style={{ fontFamily: "K2D, sans-serif", fontSize: 9, color: "var(--ink-soft)" }}
                >
                  {d}
                </span>
              </div>
            ))}
          </div>
          {/* Weeks columns */}
          <div style={{ display: "flex", gap: 2 }}>
            {weeks.map((week, col) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static positional grid
              <div key={col} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {Array.from({ length: 7 }).map((_, row) => {
                  const cell = week[row];
                  const count = cell?.count ?? 0;
                  const cellKey = cell?.date ?? `${col}-${row}`;
                  return (
                    <div
                      key={cellKey}
                      title={cell ? `${cell.date}: ${count}` : ""}
                      className="heatmap-cell"
                      style={
                        count > 0
                          ? {
                              background: count >= 2 ? "var(--violet)" : "rgba(140,100,255,0.35)",
                              border: "1px solid var(--violet-edge)",
                            }
                          : undefined
                      }
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 72;
  const h = 28;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      <polyline
        points={pts}
        fill="none"
        stroke="var(--violet)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── RecordsTab ───────────────────────────────────────────────────────────────

function RecordsTab({
  summary,
  prs,
  isLoading,
}: {
  summary: Summary | undefined;
  prs: PRGroup[] | undefined;
  isLoading: boolean;
}) {
  const t = useTranslations("progress");

  if (isLoading) return <ProgressSkeleton />;

  return (
    <div style={{ padding: "20px 24px 0", display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Streak card */}
      <div className="glass glass-glow" style={{ padding: "20px 22px 18px" }}>
        <div
          style={{
            position: "absolute",
            right: -14,
            bottom: -14,
            opacity: 0.08,
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          <FlameIcon size={96} />
        </div>
        <span className="t-label">{t("streak")}</span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "4px 0 8px" }}>
          <span className="t-num" style={{ fontSize: 96, lineHeight: 1, color: "var(--ink)" }}>
            {summary?.currentStreak ?? 0}
          </span>
          <span
            style={{
              fontFamily: "K2D, sans-serif",
              fontSize: 14,
              color: "var(--ink-mute)",
              marginBottom: 10,
            }}
          >
            {t("streakUnit")}
          </span>
        </div>
        <p style={{ fontFamily: "K2D, sans-serif", fontSize: 13, color: "var(--ink-soft)" }}>
          {t("longestStreak")}{" "}
          <span className="t-num" style={{ fontSize: 14, color: "var(--ink-mute)" }}>
            {summary?.longestStreak ?? 0}
          </span>{" "}
          {t("streakUnit")}
        </p>
      </div>

      {/* PR cards */}
      {prs && prs.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span className="t-label" style={{ paddingLeft: 2 }}>
            {t("pr.maxWeight")}
          </span>
          {prs.map((group) => {
            const maxW = group.records.find((r) => r.recordType === "max_weight");
            const est1rm = group.records.find((r) => r.recordType === "estimated_1rm");
            const sparkValues = group.records
              .filter((r) => r.recordType === "max_weight")
              .map((r) => r.value);
            return (
              <div key={group.exerciseId} className="glass" style={{ padding: "16px 20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <span className="t-label" style={{ display: "block", marginBottom: 6 }}>
                      {group.nameTh}
                    </span>
                    {maxW && (
                      <span className="t-num" style={{ fontSize: 36, color: "var(--ink)" }}>
                        {maxW.value.toFixed(1)}
                        <span
                          style={{
                            fontFamily: "K2D, sans-serif",
                            fontSize: 14,
                            color: "var(--ink-mute)",
                            marginLeft: 4,
                          }}
                        >
                          kg
                        </span>
                      </span>
                    )}
                    {est1rm && (
                      <p
                        style={{
                          fontFamily: "K2D, sans-serif",
                          fontSize: 12,
                          color: "var(--ink-soft)",
                          marginTop: 4,
                        }}
                      >
                        e1RM{" "}
                        <span className="t-num" style={{ fontSize: 13, color: "var(--ink-mute)" }}>
                          {est1rm.value.toFixed(1)}
                        </span>{" "}
                        kg
                      </p>
                    )}
                  </div>
                  <Sparkline values={sparkValues} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        !isLoading && (
          <div style={{ padding: "48px 0", textAlign: "center" }}>
            <p style={{ fontFamily: "K2D, sans-serif", fontSize: 15, color: "var(--ink-mute)" }}>
              {t("noPRs")}
            </p>
          </div>
        )
      )}
    </div>
  );
}

// ─── TrendsTab ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "chest",
  "back",
  "legs",
  "shoulders",
  "arms",
  "core",
  "cardio",
  "full_body",
] as const;

const OPACITY_LEVELS = [1, 0.8, 0.65, 0.5, 0.38, 0.28, 0.2, 0.14] as const;

function TrendsTab({
  summary,
  weekly,
  heatmap,
}: {
  summary: Summary | undefined;
  weekly: WeeklyEntry[] | undefined;
  heatmap: HeatmapEntry[] | undefined;
}) {
  const t = useTranslations("progress");

  const avgPerWeek =
    summary && weekly && weekly.length > 0
      ? (summary.totalWorkouts / Math.max(weekly.length, 1)).toFixed(1)
      : "0";

  const weeklyChartData = (weekly ?? []).map((w) => ({
    week: new Date(w.weekStart).toLocaleDateString("th-TH", { month: "short", day: "numeric" }),
    volume: Math.round(w.totalVolume),
  }));

  const muscleChartData = (weekly ?? []).map((w) => ({
    week: new Date(w.weekStart).toLocaleDateString("th-TH", { month: "short", day: "numeric" }),
    ...Object.fromEntries(CATEGORIES.map((cat) => [cat, Math.round(w.byCategory[cat] ?? 0)])),
  }));

  const heatmapMap = new Map((heatmap ?? []).map((h) => [h.date, h.count]));
  const today = new Date();
  const heatmapCells: Array<{ date: string; count: number }> = [];
  for (let i = 363; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0] ?? "";
    heatmapCells.push({ date: dateStr, count: heatmapMap.get(dateStr) ?? 0 });
  }

  const statChips = [
    { label: t("totalWorkouts"), value: String(summary?.totalWorkouts ?? 0) },
    {
      label: t("totalVolume"),
      value: summary
        ? `${new Intl.NumberFormat("th-TH").format(Math.round(summary.totalVolume))} กก.`
        : "—",
    },
    { label: t("streak"), value: `${summary?.currentStreak ?? 0} ${t("streakUnit")}` },
    { label: "เฉลี่ย/สัปดาห์", value: `${avgPerWeek} ครั้ง` },
  ];

  return (
    <div style={{ padding: "20px 24px 32px", display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Stats 2×2 grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {statChips.map(({ label, value }) => (
          <div key={label} className="glass" style={{ padding: "14px 16px" }}>
            <p style={{ fontFamily: "K2D, sans-serif", fontSize: 12, color: "var(--ink-soft)" }}>
              {label}
            </p>
            <p className="t-num" style={{ fontSize: 20, color: "var(--ink)", marginTop: 2 }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Weekly volume bar chart */}
      <div>
        <span className="t-label" style={{ display: "block", marginBottom: 16 }}>
          {t("weeklyVolume")}
        </span>
        {weeklyChartData.length < 2 ? (
          <p style={{ fontFamily: "K2D, sans-serif", fontSize: 14, color: "var(--ink-mute)" }}>
            {t("noData")}
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weeklyChartData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(25% 0.003 90)" vertical={false} />
              <XAxis
                dataKey="week"
                tick={{ fill: "oklch(40% 0.003 90)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "oklch(40% 0.003 90)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(14% 0.005 90)",
                  border: "1px solid oklch(25% 0.003 90)",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
                itemStyle={{ color: "oklch(97% 0.003 90)", fontFamily: "var(--font-display)" }}
                labelStyle={{ color: "oklch(60% 0.002 90)" }}
              />
              <Bar dataKey="volume" fill="var(--violet)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Muscle group stacked bar */}
      <div>
        <span className="t-label" style={{ display: "block", marginBottom: 16 }}>
          {t("muscleVolume")}
        </span>
        {muscleChartData.length < 2 ? (
          <p style={{ fontFamily: "K2D, sans-serif", fontSize: 14, color: "var(--ink-mute)" }}>
            {t("noData")}
          </p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={muscleChartData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(25% 0.003 90)"
                  vertical={false}
                />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "oklch(40% 0.003 90)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "oklch(40% 0.003 90)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(14% 0.005 90)",
                    border: "1px solid oklch(25% 0.003 90)",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "oklch(60% 0.002 90)" }}
                />
                {CATEGORIES.map((cat, i) =>
                  i === CATEGORIES.length - 1 ? (
                    <Bar
                      key={cat}
                      dataKey={cat}
                      stackId="muscle"
                      fill={`oklch(97% 0.003 90 / ${OPACITY_LEVELS[i] ?? 0.1})`}
                      radius={[3, 3, 0, 0]}
                    />
                  ) : (
                    <Bar
                      key={cat}
                      dataKey={cat}
                      stackId="muscle"
                      fill={`oklch(97% 0.003 90 / ${OPACITY_LEVELS[i] ?? 0.1})`}
                    />
                  ),
                )}
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
              {CATEGORIES.map((cat, i) => (
                <div key={cat} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: `oklch(97% 0.003 90 / ${OPACITY_LEVELS[i] ?? 0.1})`,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "K2D, sans-serif",
                      fontSize: 11,
                      color: "var(--ink-soft)",
                    }}
                  >
                    {cat}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 52-week heatmap */}
      <div>
        <span className="t-label" style={{ display: "block", marginBottom: 12 }}>
          {t("heatmap")}
        </span>
        <HeatmapGrid cells={heatmapCells} />
      </div>
    </div>
  );
}

// ─── ProgressPage (default export) ───────────────────────────────────────────

export default function ProgressPage() {
  const t = useTranslations("progress");
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = (searchParams.get("tab") ?? "records") as "records" | "trends";

  const setTab = (next: "records" | "trends") => {
    const p = new URLSearchParams(searchParams.toString());
    p.set("tab", next);
    router.replace(`?${p.toString()}`);
  };

  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ["progress-summary"],
    queryFn: () =>
      fetch("/api/progress/summary")
        .then((r) => r.json())
        .then((r: { data: Summary }) => r.data),
  });

  const { data: prsData, isLoading: prsLoading } = useQuery({
    queryKey: ["progress-prs"],
    queryFn: () =>
      fetch("/api/progress/prs")
        .then((r) => r.json())
        .then((r: { data: PRGroup[] }) => r.data),
  });

  const { data: heatmapData } = useQuery({
    queryKey: ["progress-heatmap"],
    queryFn: () =>
      fetch("/api/progress/heatmap")
        .then((r) => r.json())
        .then((r: { data: HeatmapEntry[] }) => r.data),
    enabled: tab === "trends",
  });

  const { data: weeklyData } = useQuery({
    queryKey: ["progress-weekly"],
    queryFn: () =>
      fetch("/api/progress/weekly")
        .then((r) => r.json())
        .then((r: { data: WeeklyEntry[] }) => r.data),
    enabled: tab === "trends",
  });

  return (
    <div className="saifit-bg" style={{ minHeight: "100vh", paddingBottom: 110 }}>
      {/* Header */}
      <div style={{ padding: "40px 24px 0" }}>
        <span className="t-label">PROGRESS</span>
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

        {/* Glass segmented control */}
        <div
          className="glass"
          style={{
            display: "flex",
            padding: 4,
            gap: 4,
            borderRadius: 14,
          }}
        >
          {(["records", "trends"] as const).map((tabKey) => (
            <button
              key={tabKey}
              type="button"
              onClick={() => setTab(tabKey)}
              style={{
                flex: 1,
                height: 36,
                borderRadius: 10,
                fontFamily: "K2D, sans-serif",
                fontWeight: 600,
                fontSize: 13,
                border: 0,
                cursor: "pointer",
                transition: "background 0.15s, color 0.15s",
                background: tab === tabKey ? "rgba(140,100,255,0.18)" : "transparent",
                color: tab === tabKey ? "var(--ink)" : "var(--ink-soft)",
                boxShadow:
                  tab === tabKey
                    ? "0 0 0 1px var(--violet-edge), inset 0 1px 0 rgba(255,255,255,0.08)"
                    : "none",
              }}
            >
              {t(`tabs.${tabKey}` as "tabs.records" | "tabs.trends")}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {tab === "records" ? (
        <RecordsTab summary={summaryData} prs={prsData} isLoading={summaryLoading || prsLoading} />
      ) : (
        <TrendsTab summary={summaryData} weekly={weeklyData} heatmap={heatmapData} />
      )}
    </div>
  );
}
