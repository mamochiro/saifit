"use client";

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
    <div className="px-4 pt-6 space-y-6 animate-pulse">
      <div className="h-16 bg-border rounded-xl" />
      <div className="h-24 bg-border rounded-xl" />
      <div className="h-48 bg-border rounded-xl" />
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
    <div className="overflow-x-auto">
      <div style={{ minWidth: `${weeks.length * 14 + 30}px` }}>
        {/* Month labels */}
        <div className="flex mb-1 ml-8">
          {weeks.map((_, col) => {
            const label = monthLabels.find((m) => m.col === col);
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: static positional grid
              <div key={col} style={{ width: 14, flexShrink: 0 }}>
                {label && <span className="text-[9px] text-muted-foreground">{label.label}</span>}
              </div>
            );
          })}
        </div>
        {/* Day rows */}
        <div className="flex gap-0">
          {/* Day-of-week labels */}
          <div className="flex flex-col mr-1" style={{ gap: 2 }}>
            {["", "M", "", "W", "", "F", ""].map((d, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static day labels
              <div key={i} style={{ width: 24, height: 12 }}>
                <span className="text-[9px] text-muted-foreground">{d}</span>
              </div>
            ))}
          </div>
          {/* Weeks columns */}
          <div className="flex gap-0.5">
            {weeks.map((week, col) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static positional grid
              <div key={col} className="flex flex-col gap-0.5">
                {Array.from({ length: 7 }).map((_, row) => {
                  const cell = week[row];
                  const count = cell?.count ?? 0;
                  const cellKey = cell?.date ?? `${col}-${row}`;
                  return (
                    <div
                      key={cellKey}
                      title={cell ? `${cell.date}: ${count} workout${count !== 1 ? "s" : ""}` : ""}
                      style={{ width: 12, height: 12, borderRadius: 2 }}
                      className={
                        count === 0 ? "bg-border" : count === 1 ? "bg-secondary" : "bg-foreground"
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

  const latestPR = prs
    ?.flatMap((g) => g.records.map((r) => ({ ...r, nameTh: g.nameTh, slug: g.slug })))
    .sort((a, b) => new Date(b.achievedAt).getTime() - new Date(a.achievedAt).getTime())[0];

  return (
    <div className="px-4 pt-6 space-y-8">
      {/* 1. Streak section */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide leading-[1.7] mb-3">
          {t("streak")}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="font-display tabular-nums text-5xl font-bold">
            {summary?.currentStreak ?? 0}
          </span>
          <span className="text-lg text-muted-foreground leading-[1.7]">{t("streakUnit")}</span>
        </div>
        <p className="text-sm text-muted-foreground leading-[1.7] mt-1">
          {t("longestStreak")}: {summary?.longestStreak ?? 0} {t("streakUnit")}
        </p>
        {summary?.lastWorkoutDate && (
          <p className="text-xs text-muted-foreground leading-[1.7]">
            {t("lastWorkout")}:{" "}
            {new Date(summary.lastWorkoutDate).toLocaleDateString("th-TH", {
              day: "numeric",
              month: "long",
            })}
          </p>
        )}
      </div>

      {/* 2. Latest PR highlight */}
      {latestPR ? (
        <div className="border border-border rounded-xl p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide leading-[1.7] mb-2">
            {t(
              `pr.${latestPR.recordType === "max_weight" ? "maxWeight" : "estimated1rm"}` as
                | "pr.maxWeight"
                | "pr.estimated1rm",
            )}
          </p>
          <p className="text-base font-medium leading-[1.7]">{latestPR.nameTh}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-display tabular-nums text-3xl font-bold">
              {latestPR.value.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">kg</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-[1.7]">
            {new Date(latestPR.achievedAt).toLocaleDateString("th-TH", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-muted-foreground leading-[1.7]">{t("noPRs")}</p>
        </div>
      )}

      {/* 3. All PRs table */}
      {prs && prs.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide leading-[1.7] mb-3">
            {t("pr.maxWeight")}
          </p>
          <div className="border border-border rounded-xl overflow-hidden">
            {prs.map((group, idx) => {
              const maxWeightRecord = group.records.find((r) => r.recordType === "max_weight");
              const est1rmRecord = group.records.find((r) => r.recordType === "estimated_1rm");
              return (
                <div
                  key={group.exerciseId}
                  className={`flex items-center justify-between px-4 py-3 ${
                    idx < prs.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <p className="text-sm leading-[1.7] truncate flex-1">{group.nameTh}</p>
                  <div className="text-right ml-4 shrink-0">
                    {maxWeightRecord && (
                      <p className="font-display tabular-nums text-sm font-semibold">
                        {maxWeightRecord.value.toFixed(1)} kg
                      </p>
                    )}
                    {est1rmRecord && (
                      <p className="font-display tabular-nums text-xs text-muted-foreground">
                        1RM {est1rmRecord.value.toFixed(1)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
    {
      label: t("totalWorkouts"),
      value: String(summary?.totalWorkouts ?? 0),
    },
    {
      label: t("totalVolume"),
      value: summary
        ? `${new Intl.NumberFormat("th-TH").format(Math.round(summary.totalVolume))} กก.`
        : "—",
    },
    {
      label: t("streak"),
      value: `${summary?.currentStreak ?? 0} ${t("streakUnit")}`,
    },
    {
      label: "เฉลี่ย/สัปดาห์",
      value: `${avgPerWeek} ครั้ง`,
    },
  ];

  return (
    <div className="px-4 pt-6 space-y-10 pb-8">
      {/* Stats 2×2 grid — left-aligned chips */}
      <div className="grid grid-cols-2 gap-3">
        {statChips.map(({ label, value }) => (
          <div key={label} className="border border-border rounded-xl px-4 py-3">
            <p className="text-xs text-muted-foreground leading-[1.7]">{label}</p>
            <p className="font-display tabular-nums text-xl font-semibold mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      {/* Weekly volume bar chart */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide leading-[1.7] mb-4">
          {t("weeklyVolume")}
        </p>
        {weeklyChartData.length < 2 ? (
          <p className="text-sm text-muted-foreground leading-[1.7]">{t("noData")}</p>
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
                itemStyle={{
                  color: "oklch(97% 0.003 90)",
                  fontFamily: "var(--font-display)",
                }}
                labelStyle={{ color: "oklch(60% 0.002 90)" }}
              />
              <Bar dataKey="volume" fill="oklch(97% 0.003 90)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Muscle group stacked bar */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide leading-[1.7] mb-4">
          {t("muscleVolume")}
        </p>
        {muscleChartData.length < 2 ? (
          <p className="text-sm text-muted-foreground leading-[1.7]">{t("noData")}</p>
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
            {/* Monochrome legend with opacity squares */}
            <div className="flex flex-wrap gap-3 mt-3">
              {CATEGORIES.map((cat, i) => (
                <div key={cat} className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{
                      backgroundColor: `oklch(97% 0.003 90 / ${OPACITY_LEVELS[i] ?? 0.1})`,
                    }}
                  />
                  <span className="text-xs text-muted-foreground">{cat}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 52-week activity heatmap */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide leading-[1.7] mb-4">
          {t("heatmap")}
        </p>
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
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-4 pt-10 pb-4 border-b border-border">
        <h1 className="text-xl font-semibold leading-[1.7]">{t("title")}</h1>
      </div>

      {/* Segmented tab switcher */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex gap-0 bg-secondary rounded-xl p-1">
          {(["records", "trends"] as const).map((tabKey) => (
            <button
              key={tabKey}
              type="button"
              onClick={() => setTab(tabKey)}
              className={`flex-1 h-9 rounded-lg text-sm font-medium transition-colors ${
                tab === tabKey ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
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
