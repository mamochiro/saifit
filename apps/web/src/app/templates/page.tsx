"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

type Goal = "build_muscle" | "lose_fat" | "get_stronger" | "stay_active";
type Difficulty = "beginner" | "intermediate" | "advanced";

interface Template {
  id: string;
  nameEn: string;
  nameTh: string;
  goal: Goal;
  difficulty: Difficulty;
  daysPerWeek: number;
  isAdvanced: boolean;
}

const GOAL_LABELS: Record<Goal, string> = {
  build_muscle: "สร้างกล้าม",
  lose_fat: "ลดไขมัน",
  get_stronger: "แข็งแรง",
  stay_active: "กระฉับกระเฉง",
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: "มือใหม่",
  intermediate: "ระดับกลาง",
  advanced: "ขั้นสูง",
};

export default function TemplatesPage() {
  const t = useTranslations("templates");
  const [goal, setGoal] = useState<Goal | "">("");
  const [difficulty, setDifficulty] = useState<Difficulty | "">("");
  const [days, setDays] = useState<number | "">("");

  const params = new URLSearchParams();
  if (goal) params.set("goal", goal);
  if (difficulty) params.set("difficulty", difficulty);
  if (days) params.set("daysPerWeek", String(days));

  const { data, isLoading } = useQuery<{ data: Template[] }>({
    queryKey: ["templates", goal, difficulty, days],
    queryFn: () => fetch(`/api/templates?${params}`).then((r) => r.json()),
  });

  const templates = data?.data ?? [];

  const goalFilters: Array<{ value: Goal | ""; label: string }> = [
    { value: "", label: t("filter.all") },
    { value: "build_muscle", label: "สร้างกล้าม" },
    { value: "lose_fat", label: "ลดไขมัน" },
    { value: "get_stronger", label: "แข็งแรง" },
    { value: "stay_active", label: "กระฉับกระเฉง" },
  ];

  const difficultyFilters: Array<{ value: Difficulty | ""; label: string }> = [
    { value: "", label: t("filter.all") },
    { value: "beginner", label: "มือใหม่" },
    { value: "intermediate", label: "ระดับกลาง" },
    { value: "advanced", label: "ขั้นสูง" },
  ];

  const dayFilters: Array<{ value: number | ""; label: string }> = [
    { value: "", label: t("filter.all") },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-4 pt-10 pb-4">
        <h1 className="text-2xl font-bold leading-[1.7]">{t("title")}</h1>
      </div>

      {/* Filter rows */}
      <div className="space-y-3 px-4 pb-4">
        {/* Goal filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {goalFilters.map((f) => (
            <button
              key={String(f.value)}
              type="button"
              onClick={() => setGoal(f.value)}
              className={`shrink-0 px-4 h-9 rounded-full text-sm font-medium border transition-colors ${
                goal === f.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:border-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Difficulty filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {difficultyFilters.map((f) => (
            <button
              key={String(f.value)}
              type="button"
              onClick={() => setDifficulty(f.value)}
              className={`shrink-0 px-4 h-9 rounded-full text-sm font-medium border transition-colors ${
                difficulty === f.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:border-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Days/week filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="shrink-0 self-center text-xs text-muted-foreground pr-1">
            {t("filter.days")}:
          </span>
          {dayFilters.map((f) => (
            <button
              key={String(f.value)}
              type="button"
              onClick={() => setDays(f.value)}
              className={`shrink-0 px-4 h-9 rounded-full text-sm font-medium border transition-colors tabular-nums ${
                days === f.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:border-foreground"
              }`}
            >
              {f.value === "" ? f.label : `${f.label} วัน`}
            </button>
          ))}
        </div>
      </div>

      {/* Template grid */}
      <div className="px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
              <div key={i} className="h-32 rounded-2xl bg-secondary animate-pulse" />
            ))}
          </div>
        ) : templates.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <p className="text-foreground font-medium">{t("empty")}</p>
            <p className="text-sm text-muted-foreground leading-[1.7]">ลองเปลี่ยนตัวกรองใหม่</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {templates.map((tmpl) => (
              <Link
                key={tmpl.id}
                href={`/templates/${tmpl.id}`}
                className="block bg-card border border-border rounded-2xl p-5 hover:border-foreground/30 transition-colors active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-semibold leading-[1.7] text-foreground">{tmpl.nameTh}</h2>
                  <span className="shrink-0 text-xs border border-border rounded-full px-2.5 py-0.5 text-muted-foreground">
                    {DIFFICULTY_LABELS[tmpl.difficulty]}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="tabular-nums">
                    <span className="font-display">{tmpl.daysPerWeek}</span> วัน/สัปดาห์
                  </span>
                  <span>{GOAL_LABELS[tmpl.goal]}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
