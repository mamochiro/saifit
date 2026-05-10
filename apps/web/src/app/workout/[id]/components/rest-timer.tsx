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
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: keyboardHeight,
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        padding: "16px 24px",
        background: "rgba(8, 8, 16, 0.85)",
        WebkitBackdropFilter: "blur(24px) saturate(140%)",
        backdropFilter: "blur(24px) saturate(140%)",
        borderTop: "1px solid var(--glass-line)",
      }}
    >
      <p
        style={{
          fontFamily: "K2D, sans-serif",
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--ink-soft)",
        }}
      >
        {isDone ? t("done") : t("resting")}
      </p>

      <div style={{ position: "relative", width: 112, height: 112 }}>
        <svg
          style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          {/* Track ring */}
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="5"
          />
          {/* Progress arc */}
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke={isDone ? "var(--violet)" : "var(--violet-bright)"}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.1s linear" }}
          />
        </svg>
        <span
          className="t-num"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            color: isDone ? "var(--violet-bright)" : "var(--ink)",
          }}
        >
          {isDone ? t("done") : timeStr}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          type="button"
          onClick={() => addSeconds(-15)}
          style={{
            height: 40,
            padding: "0 16px",
            borderRadius: 999,
            fontFamily: "K2D, sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--ink-soft)",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid var(--glass-line)",
            cursor: "pointer",
          }}
        >
          {t("minus15")}
        </button>
        <button
          type="button"
          onClick={cancel}
          className="btn-primary"
          style={{ height: 40, padding: "0 20px", fontSize: 13 }}
        >
          {t("skip")}
        </button>
        <button
          type="button"
          onClick={() => addSeconds(15)}
          style={{
            height: 40,
            padding: "0 16px",
            borderRadius: 999,
            fontFamily: "K2D, sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--ink-soft)",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid var(--glass-line)",
            cursor: "pointer",
          }}
        >
          {t("add15")}
        </button>
      </div>
    </div>
  );
}
