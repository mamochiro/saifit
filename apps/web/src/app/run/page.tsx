type RunKind = "easy" | "tempo" | "interval" | "long" | "rest";

interface WeekDay {
  th: string;
  en: string;
  kind: RunKind;
  km: number;
  pace: string;
  label: string;
  isToday?: boolean;
}

const WEEK: WeekDay[] = [
  { th: "จ", en: "MON", kind: "easy", km: 5, pace: "6:30", label: "Easy run" },
  { th: "อ", en: "TUE", kind: "rest", km: 0, pace: "—", label: "Rest" },
  { th: "พ", en: "WED", kind: "tempo", km: 8, pace: "5:10", label: "Tempo", isToday: true },
  { th: "พฤ", en: "THU", kind: "easy", km: 6, pace: "6:30", label: "Easy run" },
  { th: "ศ", en: "FRI", kind: "rest", km: 0, pace: "—", label: "Cross train" },
  { th: "ส", en: "SAT", kind: "interval", km: 7, pace: "4:40", label: "6×800m" },
  { th: "อา", en: "SUN", kind: "long", km: 16, pace: "6:00", label: "Long run" },
];

const KIND_COLOR: Record<RunKind, string> = {
  easy: "rgba(255,255,255,0.10)",
  tempo: "oklch(72% 0.20 270 / 60%)",
  interval: "oklch(78% 0.20 285)",
  long: "oklch(60% 0.20 240)",
  rest: "rgba(255,255,255,0.04)",
};

const KIND_GLOW: Partial<Record<RunKind, string>> = {
  tempo: "0 0 10px rgba(120,90,255,0.5)",
  long: "0 0 10px rgba(120,90,255,0.5)",
};

function StatTile({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="glass" style={{ padding: "14px 12px", textAlign: "left" }}>
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 9,
          letterSpacing: "0.14em",
          color: "var(--ink-soft)",
        }}
      >
        {label}
      </div>
      <div
        className="t-num"
        style={{ fontSize: 22, color: "var(--ink)", marginTop: 4, lineHeight: 1 }}
      >
        {value}
      </div>
      {unit && (
        <div
          style={{
            fontFamily: "K2D, sans-serif",
            fontSize: 10,
            color: "var(--ink-soft)",
            marginTop: 2,
          }}
        >
          {unit}
        </div>
      )}
    </div>
  );
}

export default function RunPage() {
  return (
    <div className="saifit-bg" style={{ minHeight: "100vh", paddingBottom: 110 }}>
      {/* Header */}
      <div style={{ padding: "40px 24px 0" }}>
        <span className="t-label">WEEK 4 / 12 · 5K SUB-22</span>
        <h1
          style={{
            fontFamily: "K2D, sans-serif",
            fontWeight: 700,
            fontSize: 26,
            color: "var(--ink)",
            letterSpacing: "-0.01em",
            lineHeight: 1.15,
            margin: "6px 0 0",
          }}
        >
          แผนวิ่ง
        </h1>
      </div>

      {/* Hero — today's session */}
      <div style={{ padding: "16px 24px 0" }}>
        <div
          className="glass glass-glow"
          style={{ padding: "20px 22px", position: "relative", overflow: "hidden" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div className="t-label">วันนี้ · TEMPO</div>
            <span className="tag-violet">8 KM</span>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 14 }}>
            <span className="t-num" style={{ fontSize: 56, lineHeight: 0.9 }}>
              5:10
            </span>
            <span style={{ fontFamily: "K2D, sans-serif", fontSize: 13, color: "var(--ink-mute)" }}>
              min/km · เป้าหมาย
            </span>
          </div>

          <div
            style={{
              marginTop: 10,
              fontFamily: "K2D, sans-serif",
              fontSize: 13,
              color: "var(--ink-mute)",
              lineHeight: 1.6,
            }}
          >
            วอร์มอัพ 1km · เทมโป 6km · คูลดาวน์ 1km
          </div>

          {/* Terrain wave decoration */}
          <svg
            viewBox="0 0 200 30"
            style={{
              position: "absolute",
              right: -20,
              bottom: 60,
              width: 180,
              opacity: 0.5,
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            <path
              d="M0 25 Q20 5, 40 18 T80 12 T120 20 T160 8 T200 18"
              stroke="var(--violet-bright)"
              strokeWidth="1.4"
              fill="none"
            />
          </svg>

          <button
            type="button"
            className="btn-primary"
            style={{
              width: "100%",
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <svg viewBox="0 0 16 16" width={14} height={14} fill="currentColor" aria-hidden="true">
              <path d="M4 2.5v11l9-5.5L4 2.5Z" />
            </svg>
            เริ่มวิ่ง
          </button>
        </div>
      </div>

      {/* Weekly grid */}
      <div style={{ padding: "14px 24px 0" }}>
        <div className="glass" style={{ padding: 18 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <span className="t-label">สัปดาห์นี้</span>
            <span
              style={{
                fontFamily: "Chakra Petch, monospace",
                fontWeight: 700,
                fontSize: 12,
                color: "var(--violet-bright)",
                letterSpacing: "0.08em",
              }}
            >
              42 KM PLANNED
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {WEEK.map((w) => (
              <div
                key={w.en}
                style={{
                  display: "grid",
                  gridTemplateColumns: "32px 1fr auto auto",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 10px",
                  borderRadius: 10,
                  background: w.isToday ? "rgba(140,100,255,0.08)" : "transparent",
                  border: `1px solid ${w.isToday ? "var(--violet-edge)" : "transparent"}`,
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "K2D, sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      color: w.isToday ? "var(--violet-bright)" : "var(--ink)",
                    }}
                  >
                    {w.th}
                  </div>
                  <div
                    style={{
                      fontFamily: "system-ui, sans-serif",
                      fontSize: 8,
                      color: "var(--ink-mute)",
                      letterSpacing: "0.10em",
                    }}
                  >
                    {w.en}
                  </div>
                </div>

                <div
                  style={{
                    height: 22,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      height: 8,
                      borderRadius: 4,
                      width: `${Math.max(8, (w.km / 16) * 100)}%`,
                      background: KIND_COLOR[w.kind],
                      boxShadow: KIND_GLOW[w.kind] ?? "none",
                    }}
                  />
                </div>

                <span
                  style={{
                    fontFamily: "K2D, sans-serif",
                    fontSize: 11,
                    color: "var(--ink-soft)",
                    minWidth: 70,
                    textAlign: "right",
                  }}
                >
                  {w.label}
                </span>
                <span
                  className="t-num"
                  style={{
                    fontSize: 14,
                    color: w.km ? "var(--ink)" : "var(--ink-mute)",
                    minWidth: 36,
                    textAlign: "right",
                  }}
                >
                  {w.km || "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stat tiles */}
      <div
        style={{
          padding: "12px 24px 0",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
        }}
      >
        <StatTile label="VO₂ MAX" value="48.2" unit="ml/kg" />
        <StatTile label="WEEKLY" value="32" unit="km" />
        <StatTile label="PR · 5K" value="22:14" unit="" />
      </div>
    </div>
  );
}
