"use client";

import {
  BarbellIcon,
  BodyFrontIcon,
  FlameIcon,
  MovementIcon,
  StrengthIcon,
} from "@/components/icons";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

type Goal = "build_muscle" | "lose_fat" | "get_stronger" | "stay_active";
type ExperienceLevel = "beginner" | "intermediate" | "advanced";
type GymType = "commercial" | "home_equipment" | "home_no_equipment";
type Step = 1 | 2 | 3 | 4 | 5;

interface OnboardingState {
  goal: Goal | null;
  experienceLevel: ExperienceLevel | null;
  daysPerWeek: number | null;
  gymType: GymType | null;
}

function ProgressDots({ step }: { step: Step }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
      <span className="t-label" style={{ marginRight: 10 }}>
        {step < 5 ? `${step} / 4` : ""}
      </span>
      {[1, 2, 3, 4].map((s) => (
        <div
          key={s}
          style={{
            borderRadius: 999,
            transition: "all 0.3s",
            background:
              s < step ? "var(--violet)" : s === step ? "var(--violet)" : "rgba(255,255,255,0.12)",
            width: s === step ? 24 : 8,
            height: 8,
            boxShadow: s <= step ? "0 0 8px var(--violet-glow)" : "none",
          }}
        />
      ))}
    </div>
  );
}

export default function WelcomePage() {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);

  const GOALS: {
    value: Goal;
    label: string;
    Icon: React.FC<{ size?: number; className?: string }>;
  }[] = [
    { value: "build_muscle", label: t("buildMuscle"), Icon: BarbellIcon },
    { value: "lose_fat", label: t("loseFat"), Icon: FlameIcon },
    { value: "get_stronger", label: t("getStronger"), Icon: StrengthIcon },
    { value: "stay_active", label: t("stayActive"), Icon: MovementIcon },
  ];

  const EXPERIENCE: { value: ExperienceLevel; label: string; sub: string }[] = [
    { value: "beginner", label: t("beginner"), sub: "< 1 ปี" },
    { value: "intermediate", label: t("intermediate"), sub: "1–3 ปี" },
    { value: "advanced", label: t("advanced"), sub: "> 3 ปี" },
  ];

  const GYM_TYPES: {
    value: GymType;
    label: string;
    Icon: React.FC<{ size?: number; className?: string }>;
    sub: string;
  }[] = [
    { value: "commercial", label: t("commercial"), Icon: BarbellIcon, sub: "Commercial Gym" },
    {
      value: "home_equipment",
      label: t("homeEquipment"),
      Icon: BodyFrontIcon,
      sub: "Home + Equipment",
    },
    {
      value: "home_no_equipment",
      label: t("homeNoEquipment"),
      Icon: MovementIcon,
      sub: "No Equipment",
    },
  ];

  const [state, setState] = useState<OnboardingState>({
    goal: null,
    experienceLevel: null,
    daysPerWeek: null,
    gymType: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function nextStep() {
    setStep((s) => (s < 5 ? ((s + 1) as Step) : s));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: state.goal,
          experienceLevel: state.experienceLevel,
          daysPerWeek: state.daysPerWeek,
          gymType: state.gymType,
          onboardingCompleted: true,
        }),
      });
      if (!res.ok) throw new Error("บันทึกไม่สำเร็จ");
      router.push("/");
      router.refresh();
    } catch {
      setSubmitError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="saifit-bg"
      style={{ minHeight: "100svh", display: "flex", flexDirection: "column" }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "40px 24px 32px",
          maxWidth: 420,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {step < 5 && (
          <div style={{ marginBottom: 40 }}>
            <ProgressDots step={step} />
          </div>
        )}

        {/* Step 1 — Goal */}
        {step === 1 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: 32 }}>
              <h2
                style={{
                  fontFamily: "K2D, sans-serif",
                  fontWeight: 700,
                  fontSize: 26,
                  color: "var(--ink)",
                  margin: "0 0 6px",
                  lineHeight: 1.2,
                }}
              >
                {t("goal")}
              </h2>
              <p
                style={{
                  fontFamily: "K2D, sans-serif",
                  fontSize: 14,
                  color: "var(--ink-mute)",
                  lineHeight: 1.5,
                }}
              >
                เราจะแนะนำโปรแกรมที่เหมาะกับคุณ
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                flex: 1,
              }}
            >
              {GOALS.map((g) => {
                const isSelected = state.goal === g.value;
                return (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => {
                      setState((s) => ({ ...s, goal: g.value }));
                      nextStep();
                    }}
                    className="glass"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 12,
                      padding: 20,
                      minHeight: 120,
                      cursor: "pointer",
                      border: isSelected
                        ? "1px solid var(--violet-edge)"
                        : "1px solid var(--glass-line)",
                      boxShadow: isSelected
                        ? "0 0 0 1px var(--violet-glow), inset 0 0 20px rgba(130,100,255,0.08)"
                        : undefined,
                      transition: "all 0.2s",
                      background: isSelected ? "rgba(130,100,255,0.10)" : undefined,
                    }}
                  >
                    <g.Icon size={36} className="opacity-80" />
                    <span
                      style={{
                        fontFamily: "K2D, sans-serif",
                        fontSize: 14,
                        fontWeight: 600,
                        color: isSelected ? "var(--ink)" : "var(--ink-mute)",
                        textAlign: "center",
                        lineHeight: 1.4,
                      }}
                    >
                      {g.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2 — Experience */}
        {step === 2 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: 32 }}>
              <h2
                style={{
                  fontFamily: "K2D, sans-serif",
                  fontWeight: 700,
                  fontSize: 26,
                  color: "var(--ink)",
                  margin: "0 0 6px",
                }}
              >
                {t("experience")}
              </h2>
              <p
                style={{
                  fontFamily: "K2D, sans-serif",
                  fontSize: 14,
                  color: "var(--ink-mute)",
                  lineHeight: 1.5,
                }}
              >
                คุณออกกำลังกายมานานแค่ไหนแล้ว?
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
              {EXPERIENCE.map((e) => {
                const isSelected = state.experienceLevel === e.value;
                return (
                  <button
                    key={e.value}
                    type="button"
                    onClick={() => {
                      setState((s) => ({ ...s, experienceLevel: e.value }));
                      nextStep();
                    }}
                    className="glass"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "18px 20px",
                      minHeight: 72,
                      cursor: "pointer",
                      textAlign: "left",
                      border: isSelected
                        ? "1px solid var(--violet-edge)"
                        : "1px solid var(--glass-line)",
                      boxShadow: isSelected ? "0 0 0 1px var(--violet-glow)" : undefined,
                      background: isSelected ? "rgba(130,100,255,0.10)" : undefined,
                      transition: "all 0.2s",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontFamily: "K2D, sans-serif",
                          fontWeight: 600,
                          fontSize: 16,
                          color: "var(--ink)",
                          lineHeight: 1.4,
                        }}
                      >
                        {e.label}
                      </p>
                      <p
                        style={{
                          fontFamily: "Chakra Petch, monospace",
                          fontSize: 11,
                          color: "var(--ink-soft)",
                          marginTop: 2,
                          letterSpacing: "0.06em",
                        }}
                      >
                        {e.sub}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3 — Days per week */}
        {step === 3 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: 32 }}>
              <h2
                style={{
                  fontFamily: "K2D, sans-serif",
                  fontWeight: 700,
                  fontSize: 26,
                  color: "var(--ink)",
                  margin: "0 0 6px",
                }}
              >
                {t("daysPerWeek")}?
              </h2>
              <p
                style={{
                  fontFamily: "K2D, sans-serif",
                  fontSize: 14,
                  color: "var(--ink-mute)",
                  lineHeight: 1.5,
                }}
              >
                คุณวางแผนออกกำลังกายกี่วัน
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                justifyContent: "center",
                flex: 1,
                alignContent: "flex-start",
                paddingTop: 8,
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7].map((d) => {
                const isSelected = state.daysPerWeek === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setState((s) => ({ ...s, daysPerWeek: d }));
                      nextStep();
                    }}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      border: isSelected
                        ? "1px solid var(--violet-edge)"
                        : "1px solid var(--glass-line)",
                      background: isSelected
                        ? "linear-gradient(135deg, oklch(65% 0.22 280), oklch(60% 0.20 240))"
                        : "rgba(255,255,255,0.05)",
                      color: isSelected ? "#fff" : "var(--ink-mute)",
                      fontFamily: "Chakra Petch, monospace",
                      fontWeight: 700,
                      fontSize: 20,
                      cursor: "pointer",
                      boxShadow: isSelected
                        ? "0 0 0 1px var(--violet-glow), 0 8px 20px -6px rgba(120,90,255,0.5)"
                        : undefined,
                      transition: "all 0.2s",
                    }}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
            <p
              style={{
                textAlign: "center",
                fontFamily: "K2D, sans-serif",
                fontSize: 12,
                color: "var(--ink-faint)",
                marginTop: 24,
                lineHeight: 1.5,
              }}
            >
              แนะนำ 3–4 วัน สำหรับผลลัพธ์ที่ดีที่สุด
            </p>
          </div>
        )}

        {/* Step 4 — Gym type */}
        {step === 4 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: 32 }}>
              <h2
                style={{
                  fontFamily: "K2D, sans-serif",
                  fontWeight: 700,
                  fontSize: 26,
                  color: "var(--ink)",
                  margin: "0 0 6px",
                }}
              >
                {t("gymType")}
              </h2>
              <p
                style={{
                  fontFamily: "K2D, sans-serif",
                  fontSize: 14,
                  color: "var(--ink-mute)",
                  lineHeight: 1.5,
                }}
              >
                คุณออกกำลังกายที่ไหน?
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
              {GYM_TYPES.map((g) => {
                const isSelected = state.gymType === g.value;
                return (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => {
                      setState((s) => ({ ...s, gymType: g.value }));
                      nextStep();
                    }}
                    className="glass"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "18px 20px",
                      minHeight: 72,
                      cursor: "pointer",
                      textAlign: "left",
                      border: isSelected
                        ? "1px solid var(--violet-edge)"
                        : "1px solid var(--glass-line)",
                      boxShadow: isSelected ? "0 0 0 1px var(--violet-glow)" : undefined,
                      background: isSelected ? "rgba(130,100,255,0.10)" : undefined,
                      transition: "all 0.2s",
                    }}
                  >
                    <g.Icon size={28} className="shrink-0 opacity-70" />
                    <div>
                      <p
                        style={{
                          fontFamily: "K2D, sans-serif",
                          fontWeight: 600,
                          fontSize: 16,
                          color: "var(--ink)",
                          lineHeight: 1.4,
                        }}
                      >
                        {g.label}
                      </p>
                      <p
                        style={{
                          fontFamily: "system-ui, sans-serif",
                          fontSize: 11,
                          letterSpacing: "0.08em",
                          color: "var(--ink-soft)",
                          marginTop: 2,
                        }}
                      >
                        {g.sub}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5 — Ready */}
        {step === 5 && (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: 24,
            }}
          >
            <p
              style={{
                fontFamily: "Chakra Petch, monospace",
                fontWeight: 700,
                fontSize: 80,
                color: "var(--ink)",
                letterSpacing: "-0.03em",
                lineHeight: 0.9,
                margin: 0,
              }}
            >
              READY
            </p>
            <div>
              <h2
                style={{
                  fontFamily: "K2D, sans-serif",
                  fontWeight: 700,
                  fontSize: 22,
                  color: "var(--ink)",
                  margin: "0 0 6px",
                }}
              >
                โปรแกรมของคุณพร้อมแล้ว!
              </h2>
              <p
                style={{
                  fontFamily: "K2D, sans-serif",
                  fontSize: 14,
                  color: "var(--ink-mute)",
                  lineHeight: 1.5,
                }}
              >
                เราจะปรับโปรแกรมให้เหมาะสมกับเป้าหมายของคุณ
              </p>
            </div>

            {/* Summary card */}
            <div
              className="glass"
              style={{ width: "100%", padding: "18px 20px", textAlign: "left" }}
            >
              {[
                { label: "เป้าหมาย", value: GOALS.find((g) => g.value === state.goal)?.label },
                {
                  label: "ประสบการณ์",
                  value: EXPERIENCE.find((e) => e.value === state.experienceLevel)?.label,
                },
                { label: "วันต่อสัปดาห์", value: `${state.daysPerWeek} วัน` },
                { label: "สถานที่", value: GYM_TYPES.find((g) => g.value === state.gymType)?.label },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--glass-line)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "K2D, sans-serif",
                      fontSize: 13,
                      color: "var(--ink-soft)",
                    }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "K2D, sans-serif",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--ink)",
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {submitError && (
              <p
                style={{
                  fontFamily: "K2D, sans-serif",
                  fontSize: 13,
                  color: "var(--danger)",
                  lineHeight: 1.5,
                }}
              >
                {submitError}
              </p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary"
              style={{ width: "100%" }}
            >
              {submitting ? "กำลังบันทึก..." : "เริ่มเลย"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
