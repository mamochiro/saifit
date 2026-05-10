"use client";

import { useRestTimerStore } from "@/stores/rest-timer-store";
import { useViewportStore } from "@/stores/viewport-store";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function RestTimer({ workoutId: _workoutId }: { workoutId: string }) {
  const t = useTranslations("restTimer");
  const { duration, cancel, addSeconds, getRemaining } = useRestTimerStore();
  const keyboardHeight = useViewportStore((s) => s.keyboardHeight);
  const [remaining, setRemaining] = useState(getRemaining());
  const hapticFiredRef = useRef(false);

  useEffect(() => {
    hapticFiredRef.current = false;
    const iv = setInterval(() => {
      const r = getRemaining();
      setRemaining(r);
      if (r <= 0 && !hapticFiredRef.current) {
        hapticFiredRef.current = true;
        if ("vibrate" in navigator) navigator.vibrate([200, 100, 200]);
      }
    }, 100);
    return () => clearInterval(iv);
  }, [getRemaining]);

  const progress = Math.max(0, Math.min(1, remaining / duration));
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const mins = Math.floor(remaining / 60);
  const secs = Math.floor(remaining % 60);
  const timeStr = `${mins}:${secs.toString().padStart(2, "0")}`;
  const isDone = remaining <= 0;

  return (
    <div
      className="fixed left-0 right-0 z-40 flex flex-col items-center gap-3 px-4 py-4 bg-background border-t border-border"
      style={{ bottom: keyboardHeight }}
    >
      <p className="text-xs text-muted-foreground">{isDone ? t("done") : t("resting")}</p>

      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
          {/* Track ring */}
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="oklch(25% 0.003 90)"
            strokeWidth="6"
          />
          {/* Progress arc */}
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="oklch(97% 0.003 90)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.1s linear" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-display tabular-nums text-2xl font-bold">
          {isDone ? t("done") : timeStr}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => addSeconds(-15)}
          className="h-10 px-4 border border-border rounded-full text-sm text-muted-foreground hover:border-foreground/30 transition-colors"
        >
          {t("minus15")}
        </button>
        <button
          type="button"
          onClick={cancel}
          className="h-10 px-5 bg-primary text-primary-foreground font-semibold rounded-full text-sm"
        >
          {t("skip")}
        </button>
        <button
          type="button"
          onClick={() => addSeconds(15)}
          className="h-10 px-4 border border-border rounded-full text-sm text-muted-foreground hover:border-foreground/30 transition-colors"
        >
          {t("add15")}
        </button>
      </div>
    </div>
  );
}
