"use client";

import { useTranslations } from "next-intl";

export interface RoutineExEntry {
  exerciseId: string;
  nameEn: string;
  nameTh: string;
  targetSets: number;
  targetReps: string;
  targetWeightKg: number | null;
}

export function ExerciseRow({
  ex,
  index,
  total,
  onChange,
  onMove,
  onRemove,
}: {
  ex: RoutineExEntry;
  index: number;
  total: number;
  onChange: (patch: Partial<RoutineExEntry>) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  const t = useTranslations("routines");
  return (
    <div className="glass" style={{ padding: "12px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: "K2D, sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--ink)",
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {ex.nameTh}
          </p>
          <p
            style={{
              fontFamily: "system-ui",
              fontSize: 10,
              color: "var(--ink-soft)",
              marginTop: 1,
            }}
          >
            {ex.nameEn}
          </p>
        </div>
        <div style={{ display: "flex", gap: 4, marginLeft: 8, flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid var(--glass-line)",
              color: index === 0 ? "var(--ink-faint)" : "var(--ink-soft)",
              cursor: index === 0 ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="move up"
          >
            <svg
              viewBox="0 0 12 12"
              width={10}
              height={10}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M2 8l4-4 4 4" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid var(--glass-line)",
              color: index === total - 1 ? "var(--ink-faint)" : "var(--ink-soft)",
              cursor: index === total - 1 ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="move down"
          >
            <svg
              viewBox="0 0 12 12"
              width={10}
              height={10}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M2 4l4 4 4-4" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onRemove}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "none",
              border: "none",
              color: "var(--ink-soft)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="remove"
          >
            <svg
              viewBox="0 0 16 16"
              width={13}
              height={13}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
        <div>
          <div
            style={{
              fontFamily: "system-ui",
              fontSize: 9,
              color: "var(--ink-soft)",
              letterSpacing: "0.12em",
              marginBottom: 4,
            }}
          >
            {t("sets")}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button
              type="button"
              onClick={() => onChange({ targetSets: Math.max(1, ex.targetSets - 1) })}
              className="glass"
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              −
            </button>
            <span
              className="t-num"
              style={{ fontSize: 16, color: "var(--ink)", flex: 1, textAlign: "center" }}
            >
              {ex.targetSets}
            </span>
            <button
              type="button"
              onClick={() => onChange({ targetSets: Math.min(20, ex.targetSets + 1) })}
              className="glass"
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              +
            </button>
          </div>
        </div>
        <div>
          <div
            style={{
              fontFamily: "system-ui",
              fontSize: 9,
              color: "var(--ink-soft)",
              letterSpacing: "0.12em",
              marginBottom: 4,
            }}
          >
            {t("reps")}
          </div>
          <input
            className="glass-input"
            value={ex.targetReps}
            onChange={(e) => onChange({ targetReps: e.target.value })}
            placeholder="8-12"
            style={{ width: "100%", textAlign: "center" }}
          />
        </div>
        <div>
          <div
            style={{
              fontFamily: "system-ui",
              fontSize: 9,
              color: "var(--ink-soft)",
              letterSpacing: "0.12em",
              marginBottom: 4,
            }}
          >
            {t("weight")}
          </div>
          <input
            className="glass-input"
            inputMode="decimal"
            value={ex.targetWeightKg ?? ""}
            onChange={(e) => {
              const v = e.target.value.replace(",", ".");
              onChange({ targetWeightKg: v === "" ? null : Number(v) });
            }}
            placeholder="—"
            style={{ width: "100%", textAlign: "center" }}
          />
        </div>
      </div>
    </div>
  );
}
