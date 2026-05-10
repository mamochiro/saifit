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
      className="fixed inset-0 z-50 flex items-end justify-center pb-32 pointer-events-none"
      aria-live="assertive"
    >
      <div className="pointer-events-auto animate-in slide-in-from-bottom-4 fade-in duration-200">
        <div className="bg-card border border-border rounded-2xl px-6 py-5 mx-4 text-center shadow-2xl">
          <p className="text-xs text-muted-foreground mb-1">{t("newRecord")}</p>
          <p className="font-display tabular-nums text-4xl font-bold text-foreground">
            {value % 1 === 0 ? value : value.toFixed(1)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {type === "estimated_1rm" ? t("estimated1rm") : t("maxWeight")}
          </p>
          <p className="text-sm font-medium mt-2 leading-[1.7]">{exerciseName}</p>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}
