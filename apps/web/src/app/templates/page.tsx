"use client";

import { BarbellIcon, FlameIcon, MovementIcon, StrengthIcon } from "@/components/icons";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type React from "react";
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
  get_stronger: "แข็งแกร่ง",
  stay_active: "กระฉับกระเฉง",
};

const GOAL_ICONS: Record<Goal, React.FC<{ size?: number; className?: string }>> = {
  build_muscle: BarbellIcon,
  lose_fat: FlameIcon,
  get_stronger: StrengthIcon,
  stay_active: MovementIcon,
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: "มือใหม่",
  intermediate: "ระดับกลาง",
  advanced: "ขั้นสูง",
};

export default function TemplatesPage() {
  const t = useTranslations("templates");
  const [goal, setGoal] = useState<Goal | "">("");

  const params = new URLSearchParams();
  if (goal) params.set("goal", goal);

  const { data, isLoading } = useQuery<{ data: Template[] }>({
    queryKey: ["templates", goal],
    queryFn: () => fetch(`/api/templates?${params}`).then((r) => r.json()),
  });

  const templates = data?.data ?? [];

  const goalFilters: Array<{ value: Goal | ""; label: string }> = [
    { value: "", label: t("filter.all") },
    { value: "build_muscle", label: "สร้างกล้าม" },
    { value: "lose_fat", label: "ลดไขมัน" },
    { value: "get_stronger", label: "แข็งแกร่ง" },
    { value: "stay_active", label: "กระฉับกระเฉง" },
  ];

  return (
    <div className="saifit-bg" style={{ minHeight: "100vh", paddingBottom: 110 }}>
      {/* Header */}
      <div style={{ padding: "40px 24px 0" }}>
        <span className="t-label">LIBRARY</span>
        <h1
          style={{
            fontFamily: "K2D, sans-serif",
            fontWeight: 700,
            fontSize: 26,
            color: "var(--ink)",
            letterSpacing: "-0.01em",
            lineHeight: 1.15,
            margin: "6px 0 4px",
          }}
        >
          {t("title")}
        </h1>
        <p
          style={{
            fontFamily: "K2D, sans-serif",
            fontSize: 13,
            color: "var(--ink-soft)",
            lineHeight: 1.5,
          }}
        >
          เลือกโปรแกรมที่เหมาะกับเป้าหมายของคุณ
        </p>
      </div>

      {/* Filter pills */}
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "20px 24px 0",
          overflowX: "auto",
          flexWrap: "nowrap",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {goalFilters.map((f) => (
          <button
            key={String(f.value)}
            type="button"
            onClick={() => setGoal(f.value)}
            className={`pill${goal === f.value ? " is-active" : ""}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Template cards */}
      <div style={{ padding: "14px 24px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        {isLoading ? (
          (["skel-1", "skel-2", "skel-3", "skel-4"] as const).map((key) => (
            <div
              key={key}
              style={{
                height: 110,
                borderRadius: 20,
                background: "rgba(255,255,255,0.04)",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))
        ) : templates.length === 0 ? (
          <div style={{ padding: "64px 0", textAlign: "center" }}>
            <p style={{ fontFamily: "K2D, sans-serif", fontSize: 15, color: "var(--ink-mute)" }}>
              {t("empty")}
            </p>
            <p
              style={{
                fontFamily: "K2D, sans-serif",
                fontSize: 13,
                color: "var(--ink-soft)",
                marginTop: 6,
                lineHeight: 1.5,
              }}
            >
              ลองเปลี่ยนตัวกรองใหม่
            </p>
          </div>
        ) : (
          templates.map((tmpl) => {
            const GoalIcon = GOAL_ICONS[tmpl.goal];
            return (
              <Link
                key={tmpl.id}
                href={`/templates/${tmpl.id}`}
                className="glass"
                style={{
                  display: "block",
                  padding: "20px 22px",
                  position: "relative",
                  textDecoration: "none",
                }}
              >
                {/* Ghost background icon */}
                {GoalIcon && (
                  <div
                    style={{
                      position: "absolute",
                      right: -10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "white",
                      opacity: 0.1,
                      pointerEvents: "none",
                    }}
                    aria-hidden="true"
                  >
                    <GoalIcon size={120} />
                  </div>
                )}

                <div style={{ position: "relative" }}>
                  {/* Title row */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Chakra Petch, monospace",
                        fontWeight: 700,
                        fontSize: 22,
                        color: "var(--ink)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {tmpl.nameTh}
                    </span>
                    <span
                      style={{
                        fontFamily: "system-ui, sans-serif",
                        fontSize: 10,
                        letterSpacing: "0.12em",
                        color: "var(--ink-soft)",
                        textTransform: "uppercase",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "Chakra Petch, monospace",
                          fontWeight: 700,
                        }}
                      >
                        {tmpl.daysPerWeek}
                      </span>{" "}
                      วัน/สัปดาห์
                    </span>
                  </div>

                  {/* Goal sub-line */}
                  <p
                    style={{
                      fontFamily: "K2D, sans-serif",
                      fontSize: 14,
                      color: "var(--ink-mute)",
                      marginTop: 4,
                      marginBottom: 14,
                      lineHeight: 1.4,
                    }}
                  >
                    {GOAL_LABELS[tmpl.goal]}
                  </p>

                  {/* Footer row */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span className="tag-violet">{DIFFICULTY_LABELS[tmpl.difficulty]}</span>
                    {/* Arrow */}
                    <svg
                      viewBox="0 0 20 20"
                      width={18}
                      height={18}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: "var(--ink-mute)" }}
                      aria-hidden="true"
                    >
                      <path d="M4 10h12M10 4l6 6-6 6" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
