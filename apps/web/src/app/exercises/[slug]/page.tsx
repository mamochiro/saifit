"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface HistoryEntry {
  date: string;
  workoutId: string;
  sets: Array<{ setNumber: number; weightKg: string | null; reps: number }>;
}

interface ExerciseDetail {
  id: string;
  slug: string;
  nameEn: string;
  nameTh: string;
  category: string;
  muscleGroups: string[];
  equipment: string;
  isBodyweight: boolean;
  difficulty: string;
  beginnerCueTh: string;
  beginnerCueEn: string;
  commonMistakeTh: string;
  commonMistakeEn: string;
  history: HistoryEntry[] | null;
}

interface ChartPoint {
  date: string;
  maxWeight: number;
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-background px-4 pt-10">
      <div className="animate-pulse space-y-4">
        <div className="h-5 bg-border rounded w-20 mb-6" />
        <div className="h-7 bg-border rounded w-3/4" />
        <div className="h-4 bg-border rounded w-1/2" />
        <div className="flex gap-2 mt-4">
          <div className="h-6 bg-border rounded-full w-16" />
          <div className="h-6 bg-border rounded-full w-20" />
        </div>
        <div className="h-48 bg-secondary rounded-xl mt-6" />
      </div>
    </div>
  );
}

export default function ExerciseDetailPage() {
  const t = useTranslations("exercises");
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [lang, setLang] = useState<"th" | "en">("th");

  const { data, isLoading } = useQuery<{ data: ExerciseDetail }>({
    queryKey: ["exercise", slug],
    queryFn: () => fetch(`/api/exercises/${slug}`).then((r) => r.json()),
    staleTime: 5 * 60_000,
  });

  if (isLoading) {
    return <DetailSkeleton />;
  }

  const exercise = data?.data;
  if (!exercise) return null;

  // Build chart data — oldest first for time-series display
  const chartData: ChartPoint[] = (exercise.history ?? [])
    .map((h) => ({
      date: new Date(h.date).toLocaleDateString("th-TH", { month: "short", day: "numeric" }),
      maxWeight: Math.max(...h.sets.map((s) => Number.parseFloat(s.weightKg ?? "0") || 0)),
    }))
    .reverse();

  const beginnerCue = lang === "th" ? exercise.beginnerCueTh : exercise.beginnerCueEn;
  const commonMistake = lang === "th" ? exercise.commonMistakeTh : exercise.commonMistakeEn;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Back + header */}
      <div className="px-4 pt-10 pb-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1 min-h-10 -ml-1 px-1"
        >
          ← {t("title")}
        </button>

        {/* Exercise name */}
        <h1 className="text-xl font-bold leading-[1.7]">{exercise.nameTh}</h1>
        <p className="text-sm text-muted-foreground leading-[1.7]">{exercise.nameEn}</p>

        {/* Muscle + equipment chips */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {exercise.muscleGroups.map((mg) => (
            <span
              key={mg}
              className="bg-secondary text-muted-foreground rounded-full px-2.5 py-1 text-xs leading-[1.7]"
            >
              {mg}
            </span>
          ))}
          <span className="bg-secondary text-muted-foreground rounded-full px-2.5 py-1 text-xs leading-[1.7]">
            {exercise.equipment}
          </span>
        </div>
      </div>

      {/* GIF placeholder — no border, bg-secondary, centered text */}
      <div className="mx-4 mb-6 h-48 bg-secondary rounded-xl flex flex-col items-center justify-center">
        <p className="text-sm text-muted-foreground leading-[1.7]">{t("gifPlaceholder")}</p>
        <p className="text-xs text-muted-foreground/60 mt-1">(coming soon)</p>
      </div>

      {/* Thai/English segmented control */}
      <div className="px-4 mb-6">
        <div className="flex gap-0 bg-secondary rounded-xl p-1">
          <button
            type="button"
            onClick={() => setLang("th")}
            className={`flex-1 h-9 rounded-lg text-sm font-medium transition-colors ${
              lang === "th"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("thai")}
          </button>
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`flex-1 h-9 rounded-lg text-sm font-medium transition-colors ${
              lang === "en"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("english")}
          </button>
        </div>
      </div>

      {/* Beginner cue */}
      <div className="px-4 mb-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 leading-[1.7]">
          {t("beginner")}
        </h2>
        <p className="text-sm text-foreground leading-[1.7]">{beginnerCue}</p>
      </div>

      {/* Common mistakes */}
      <div className="px-4 mb-8 border-t border-border pt-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 leading-[1.7]">
          {t("mistakes")}
        </h2>
        <p className="text-sm text-foreground leading-[1.7]">{commonMistake}</p>
      </div>

      {/* History chart */}
      <div className="px-4 pb-8 border-t border-border pt-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4 leading-[1.7]">
          {t("history")}
        </h2>
        {!exercise.history || exercise.history.length === 0 ? (
          <p className="text-sm text-muted-foreground leading-[1.7]">{t("noHistory")}</p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(25% 0.003 90)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "oklch(40% 0.003 90)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{
                  fill: "oklch(40% 0.003 90)",
                  fontSize: 11,
                  fontFamily: "var(--font-display)",
                }}
                axisLine={false}
                tickLine={false}
                unit=" kg"
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(14% 0.005 90)",
                  border: "1px solid oklch(25% 0.003 90)",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
                labelStyle={{ color: "oklch(60% 0.002 90)" }}
                itemStyle={{ color: "oklch(97% 0.003 90)" }}
              />
              <Line
                type="monotone"
                dataKey="maxWeight"
                stroke="oklch(97% 0.003 90)"
                strokeWidth={2}
                dot={{ fill: "oklch(97% 0.003 90)", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
