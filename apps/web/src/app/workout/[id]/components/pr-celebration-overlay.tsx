"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export function PRCelebrationOverlay({
  exerciseName,
  value,
  type,
  onDismiss,
}: {
  exerciseName: string;
  value: number;
  type: string;
  onDismiss: () => void;
}) {
  const t = useTranslations("pr");

  useEffect(() => {
    const timer = setTimeout(onDismiss, 2500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const content = (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: 128,
        pointerEvents: "none",
      }}
      aria-live="assertive"
    >
      <div
        className="glass glass-glow"
        style={{
          pointerEvents: "auto",
          margin: "0 24px",
          padding: "20px 28px",
          textAlign: "center",
          animation: "slide-up 0.25s ease-out",
        }}
      >
        <p className="t-label" style={{ marginBottom: 8 }}>
          {t("newRecord")}
        </p>
        <span
          className="t-num"
          style={{ fontSize: 48, color: "var(--violet-bright)", display: "block" }}
        >
          {value % 1 === 0 ? value : value.toFixed(1)}
        </span>
        <p
          style={{
            fontFamily: "K2D, sans-serif",
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "var(--ink-soft)",
            textTransform: "uppercase",
            marginTop: 4,
          }}
        >
          {type === "estimated_1rm" ? t("estimated1rm") : t("maxWeight")}
        </p>
        <p
          style={{
            fontFamily: "K2D, sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: "var(--ink)",
            marginTop: 8,
            lineHeight: 1.4,
          }}
        >
          {exerciseName}
        </p>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}
