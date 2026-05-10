"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
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

const GOALS: { value: Goal; label: string; emoji: string }[] = [
  { value: "build_muscle", label: "เพิ่มกล้ามเนื้อ", emoji: "💪" },
  { value: "lose_fat", label: "ลดไขมัน", emoji: "🔥" },
  { value: "get_stronger", label: "เพิ่มแรง", emoji: "🏋️" },
  { value: "stay_active", label: "ออกกำลังกายสม่ำเสมอ", emoji: "🏃" },
];

const EXPERIENCE: { value: ExperienceLevel; label: string; sub: string }[] = [
  { value: "beginner", label: "มือใหม่", sub: "< 1 ปี" },
  { value: "intermediate", label: "ระดับกลาง", sub: "1–3 ปี" },
  { value: "advanced", label: "ขั้นสูง", sub: "> 3 ปี" },
];

const GYM_TYPES: { value: GymType; label: string; emoji: string; sub: string }[] = [
  { value: "commercial", label: "ฟิตเนสทั่วไป", emoji: "🏢", sub: "Commercial Gym" },
  { value: "home_equipment", label: "ที่บ้าน (มีอุปกรณ์)", emoji: "🏠", sub: "Home + Equipment" },
  { value: "home_no_equipment", label: "ที่บ้าน (ไม่มีอุปกรณ์)", emoji: "🧘", sub: "No Equipment" },
];

function ProgressDots({ step }: { step: Step }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {[1, 2, 3, 4].map((s) => (
        <div
          key={s}
          className={cn(
            "rounded-full transition-all duration-300",
            step > s
              ? "w-2 h-2 bg-primary"
              : step === s
                ? "w-6 h-2 bg-primary"
                : "w-2 h-2 bg-border",
          )}
        />
      ))}
    </div>
  );
}

export default function WelcomePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
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
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col px-4 pt-10 pb-6 max-w-sm mx-auto w-full">
        {step < 5 && (
          <div className="mb-8">
            <ProgressDots step={step} />
          </div>
        )}

        {step === 1 && (
          <div className="flex-1 flex flex-col">
            <div className="mb-8 space-y-1">
              <h2 className="text-2xl font-bold">เป้าหมายของคุณ</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                เราจะแนะนำโปรแกรมที่เหมาะกับคุณ
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 flex-1">
              {GOALS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => {
                    setState((s) => ({ ...s, goal: g.value }));
                    nextStep();
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all min-h-[120px]",
                    state.goal === g.value
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary hover:border-primary/50",
                  )}
                >
                  <span className="text-4xl">{g.emoji}</span>
                  <span className="text-sm font-medium text-center leading-relaxed">{g.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 flex flex-col">
            <div className="mb-8 space-y-1">
              <h2 className="text-2xl font-bold">ระดับประสบการณ์</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                คุณออกกำลังกายมานานแค่ไหนแล้ว?
              </p>
            </div>
            <div className="space-y-3 flex-1">
              {EXPERIENCE.map((e) => (
                <button
                  key={e.value}
                  type="button"
                  onClick={() => {
                    setState((s) => ({ ...s, experienceLevel: e.value }));
                    nextStep();
                  }}
                  className={cn(
                    "w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left min-h-[72px]",
                    state.experienceLevel === e.value
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary hover:border-primary/50",
                  )}
                >
                  <div>
                    <p className="font-semibold leading-relaxed">{e.label}</p>
                    <p className="text-xs text-muted-foreground">{e.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex-1 flex flex-col">
            <div className="mb-8 space-y-1">
              <h2 className="text-2xl font-bold">กี่วันต่อสัปดาห์?</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">คุณวางแผนออกกำลังกายกี่วัน</p>
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setState((s) => ({ ...s, daysPerWeek: d }));
                    nextStep();
                  }}
                  className={cn(
                    "w-14 h-14 rounded-full border-2 font-bold text-lg transition-all",
                    state.daysPerWeek === d
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-secondary hover:border-primary/50",
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-6 leading-relaxed">
              แนะนำ 3–4 วัน สำหรับผลลัพธ์ที่ดีที่สุด
            </p>
          </div>
        )}

        {step === 4 && (
          <div className="flex-1 flex flex-col">
            <div className="mb-8 space-y-1">
              <h2 className="text-2xl font-bold">ประเภทยิม</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">คุณออกกำลังกายที่ไหน?</p>
            </div>
            <div className="space-y-3 flex-1">
              {GYM_TYPES.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => {
                    setState((s) => ({ ...s, gymType: g.value }));
                    nextStep();
                  }}
                  className={cn(
                    "w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left min-h-[72px]",
                    state.gymType === g.value
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary hover:border-primary/50",
                  )}
                >
                  <span className="text-3xl">{g.emoji}</span>
                  <div>
                    <p className="font-semibold leading-relaxed">{g.label}</p>
                    <p className="text-xs text-muted-foreground">{g.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <div className="text-7xl">🎉</div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">โปรแกรมของคุณพร้อมแล้ว!</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                เราจะปรับโปรแกรมให้เหมาะสมกับเป้าหมายของคุณ
              </p>
            </div>

            <div className="w-full bg-secondary rounded-2xl p-4 space-y-3 text-sm text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">เป้าหมาย</span>
                <span className="font-medium">
                  {GOALS.find((g) => g.value === state.goal)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ประสบการณ์</span>
                <span className="font-medium">
                  {EXPERIENCE.find((e) => e.value === state.experienceLevel)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">วันต่อสัปดาห์</span>
                <span className="font-medium">{state.daysPerWeek} วัน</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">สถานที่</span>
                <span className="font-medium">
                  {GYM_TYPES.find((g) => g.value === state.gymType)?.label}
                </span>
              </div>
            </div>

            {submitError && <p className="text-sm text-red-400 leading-relaxed">{submitError}</p>}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full h-14 bg-primary hover:bg-primary/90 active:bg-primary/80 disabled:opacity-50 text-primary-foreground font-bold text-lg rounded-xl transition-colors"
            >
              {submitting ? "กำลังบันทึก..." : "เริ่มเลย"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
