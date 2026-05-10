type MuscleId =
  | "shoulders"
  | "chest"
  | "biceps"
  | "abs"
  | "quads"
  | "lats"
  | "glutes"
  | "hamstrings";

function MuscleMap({
  primary,
  secondary,
}: {
  primary: MuscleId[];
  secondary: MuscleId[];
}) {
  const color = (id: MuscleId) => {
    if (primary.includes(id)) return "oklch(72% 0.20 270 / 70%)";
    if (secondary.includes(id)) return "oklch(72% 0.20 270 / 30%)";
    return "rgba(255,255,255,0.10)";
  };

  return (
    <svg width="100" height="150" viewBox="0 0 100 150" fill="none" aria-hidden="true">
      {/* Body outline */}
      <ellipse cx="50" cy="12" rx="8" ry="9" fill="rgba(255,255,255,0.15)" />
      {/* Neck */}
      <rect x="46" y="20" width="8" height="7" rx="2" fill="rgba(255,255,255,0.10)" />
      {/* Torso */}
      <path
        d="M30 28 Q22 32 20 50 L18 78 L82 78 L80 50 Q78 32 70 28 Z"
        fill="rgba(255,255,255,0.06)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="0.8"
      />

      {/* Shoulders */}
      <ellipse cx="24" cy="32" rx="9" ry="7" fill={color("shoulders")} />
      <ellipse cx="76" cy="32" rx="9" ry="7" fill={color("shoulders")} />

      {/* Chest */}
      <path d="M30 30 Q50 28 70 30 L68 50 Q50 54 32 50 Z" fill={color("chest")} />

      {/* Lats (side torso, visible from front) */}
      <path d="M20 42 L30 40 L28 68 L18 66 Z" fill={color("lats")} />
      <path d="M80 42 L70 40 L72 68 L82 66 Z" fill={color("lats")} />

      {/* Abs */}
      <path d="M36 52 L64 52 L62 76 L38 76 Z" fill={color("abs")} />

      {/* Biceps */}
      <ellipse cx="17" cy="52" rx="5" ry="12" fill={color("biceps")} />
      <ellipse cx="83" cy="52" rx="5" ry="12" fill={color("biceps")} />

      {/* Forearms */}
      <rect x="13" y="63" width="8" height="14" rx="3" fill="rgba(255,255,255,0.07)" />
      <rect x="79" y="63" width="8" height="14" rx="3" fill="rgba(255,255,255,0.07)" />

      {/* Hips */}
      <path d="M30 76 L70 76 L74 90 L26 90 Z" fill="rgba(255,255,255,0.08)" />

      {/* Glutes (partially visible from front) */}
      <ellipse cx="36" cy="88" rx="10" ry="8" fill={color("glutes")} />
      <ellipse cx="64" cy="88" rx="10" ry="8" fill={color("glutes")} />

      {/* Quads */}
      <path d="M27 88 L42 88 L44 128 L24 128 Z" fill={color("quads")} />
      <path d="M73 88 L58 88 L56 128 L76 128 Z" fill={color("quads")} />

      {/* Hamstrings (partially front) */}
      <path d="M24 100 L40 100 L42 128 L22 128 Z" fill={color("hamstrings")} opacity="0.6" />
      <path d="M76 100 L60 100 L58 128 L78 128 Z" fill={color("hamstrings")} opacity="0.6" />

      {/* Knees */}
      <ellipse cx="33" cy="130" rx="8" ry="5" fill="rgba(255,255,255,0.07)" />
      <ellipse cx="67" cy="130" rx="8" ry="5" fill="rgba(255,255,255,0.07)" />

      {/* Calves */}
      <path d="M27 134 L38 134 L36 150 L28 150 Z" fill="rgba(255,255,255,0.07)" />
      <path d="M62 134 L73 134 L72 150 L64 150 Z" fill="rgba(255,255,255,0.07)" />
    </svg>
  );
}

interface StatTile {
  key: string;
  value: string;
  unit: string;
  delta: string;
  dpos: boolean | null;
}

const STATS: StatTile[] = [
  { key: "BODY FAT", value: "18.4", unit: "%", delta: "−1.2%", dpos: true },
  { key: "WEIGHT", value: "72.4", unit: "kg", delta: "−0.6 kg", dpos: true },
  { key: "MUSCLE", value: "34.2", unit: "kg", delta: "+0.4 kg", dpos: true },
  { key: "BMR", value: "1,684", unit: "kcal", delta: "", dpos: null },
];

interface Measurement {
  key: string;
  value: string;
  delta: string;
}

const MEASURES: Measurement[] = [
  { key: "CHEST · อก", value: "102", delta: "+1" },
  { key: "WAIST · เอว", value: "82", delta: "−2" },
  { key: "ARM · แขน", value: "36", delta: "+0.5" },
  { key: "THIGH · ขา", value: "58", delta: "+1" },
];

const PHOTO_DATES = ["10 ก.พ.", "10 มี.ค.", "10 เม.ย.", "10 พ.ค."];

export default function BodyPage() {
  return (
    <div className="saifit-bg" style={{ minHeight: "100vh", paddingBottom: 110 }}>
      {/* Header */}
      <div style={{ padding: "40px 24px 0" }}>
        <span className="t-label">MAY 10 · 4-WEEK TREND</span>
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
          วิเคราะห์ร่างกาย
        </h1>
      </div>

      {/* Composition card */}
      <div style={{ padding: "16px 24px 0" }}>
        <div
          className="glass glass-glow"
          style={{ padding: "20px 22px", display: "flex", gap: 18 }}
        >
          {/* Left — muscle map */}
          <div
            style={{
              width: 110,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MuscleMap
              primary={["chest", "quads", "lats"]}
              secondary={["shoulders", "biceps", "abs", "glutes", "hamstrings"]}
            />
          </div>

          {/* Right — stats */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <div className="t-label">COMPOSITION</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
                <span className="t-num" style={{ fontSize: 32, color: "var(--ink)" }}>
                  18.4
                </span>
                <span
                  style={{
                    fontFamily: "K2D, sans-serif",
                    fontSize: 12,
                    color: "var(--ink-mute)",
                  }}
                >
                  % body fat
                </span>
              </div>
            </div>

            {/* Body-fat gradient bar */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "system-ui, sans-serif",
                  fontSize: 9,
                  color: "var(--ink-soft)",
                  letterSpacing: "0.12em",
                  marginBottom: 4,
                }}
              >
                <span>ESSENTIAL · 6%</span>
                <span>HEALTHY 14–24%</span>
                <span>· 30%+</span>
              </div>
              <div
                style={{
                  position: "relative",
                  height: 10,
                  borderRadius: 5,
                  overflow: "hidden",
                  background:
                    "linear-gradient(90deg, oklch(60% 0.20 240), oklch(72% 0.20 270 / 60%) 25%, oklch(72% 0.20 270 / 60%) 75%, oklch(62% 0.20 25))",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: -3,
                    left: "52%",
                    width: 3,
                    height: 16,
                    borderRadius: 2,
                    background: "#fff",
                    boxShadow: "0 0 10px #fff",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  fontFamily: "Chakra Petch, monospace",
                  fontSize: 10,
                  color: "var(--ink-mute)",
                  marginTop: 4,
                }}
              >
                <span style={{ color: "var(--violet-bright)" }}>YOU · OPTIMAL ZONE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2×2 Stat tiles */}
      <div
        style={{
          padding: "14px 24px 0",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        {STATS.map((s) => (
          <div key={s.key} className="glass" style={{ padding: 14 }}>
            <div className="t-label">{s.key}</div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 4,
                marginTop: 4,
              }}
            >
              <span className="t-num" style={{ fontSize: 22, color: "var(--ink)" }}>
                {s.value}
              </span>
              <span
                style={{
                  fontFamily: "K2D, sans-serif",
                  fontSize: 11,
                  color: "var(--ink-soft)",
                }}
              >
                {s.unit}
              </span>
            </div>
            {s.delta && (
              <div
                style={{
                  marginTop: 4,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontFamily: "Chakra Petch, monospace",
                  fontSize: 11,
                  fontWeight: 600,
                  color: s.dpos ? "oklch(70% 0.16 150)" : "var(--danger)",
                }}
              >
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  {s.dpos ? (
                    <path
                      d="M2 8l4-4 4 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  ) : (
                    <path
                      d="M2 4l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  )}
                </svg>
                {s.delta}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Weight trend chart */}
      <div style={{ padding: "14px 24px 0" }}>
        <div className="glass" style={{ padding: 18 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 12,
            }}
          >
            <div className="t-label">WEIGHT TREND · 90 DAYS</div>
            <span className="t-num" style={{ fontSize: 12, color: "var(--violet-bright)" }}>
              −3.2 kg
            </span>
          </div>
          <svg
            width="100%"
            height="80"
            viewBox="0 0 300 80"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="wtFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(72% 0.20 270 / 35%)" />
                <stop offset="100%" stopColor="oklch(72% 0.20 270 / 0%)" />
              </linearGradient>
            </defs>
            <path
              d="M0 20 Q30 22 50 28 T100 38 T160 44 T220 52 T300 60 L300 80 L0 80 Z"
              fill="url(#wtFill)"
            />
            <path
              d="M0 20 Q30 22 50 28 T100 38 T160 44 T220 52 T300 60"
              stroke="oklch(72% 0.20 270)"
              strokeWidth="1.6"
              fill="none"
              style={{ filter: "drop-shadow(0 0 6px var(--violet))" }}
            />
            <circle
              cx="300"
              cy="60"
              r="3"
              fill="#fff"
              style={{ filter: "drop-shadow(0 0 6px var(--violet))" }}
            />
          </svg>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 4,
              fontFamily: "system-ui, sans-serif",
              fontSize: 9,
              color: "var(--ink-mute)",
              letterSpacing: "0.10em",
            }}
          >
            <span>FEB 10</span>
            <span>MAR 10</span>
            <span>APR 10</span>
            <span>MAY 10</span>
          </div>
        </div>
      </div>

      {/* Measurements grid */}
      <div style={{ padding: "14px 24px 0" }}>
        <div className="glass" style={{ padding: 18 }}>
          <div className="t-label" style={{ marginBottom: 12 }}>
            MEASUREMENTS · cm
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {MEASURES.map((m) => (
              <div
                key={m.key}
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid var(--glass-line)",
                }}
              >
                <div
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: 9,
                    color: "var(--ink-soft)",
                    letterSpacing: "0.14em",
                    fontWeight: 600,
                  }}
                >
                  {m.key}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 8,
                    marginTop: 2,
                  }}
                >
                  <span className="t-num" style={{ fontSize: 20, color: "var(--ink)" }}>
                    {m.value}
                  </span>
                  <span
                    style={{
                      fontFamily: "Chakra Petch, monospace",
                      fontSize: 11,
                      fontWeight: 600,
                      color: m.delta.startsWith("+")
                        ? "oklch(70% 0.16 150)"
                        : "var(--violet-bright)",
                    }}
                  >
                    {m.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress photos */}
      <div style={{ padding: "14px 24px 0" }}>
        <div className="glass" style={{ padding: 18 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div className="t-label">PROGRESS PHOTOS</div>
            <span
              style={{
                fontFamily: "Chakra Petch, monospace",
                fontSize: 11,
                color: "var(--violet-bright)",
                cursor: "pointer",
              }}
            >
              + ถ่ายใหม่
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 8,
            }}
          >
            {PHOTO_DATES.map((d) => (
              <div
                key={d}
                style={{
                  aspectRatio: "3/4",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--glass-line)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  padding: 6,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <svg
                  width="60%"
                  height="60%"
                  viewBox="0 0 100 150"
                  style={{ position: "absolute", top: "15%", opacity: 0.35 }}
                  aria-hidden="true"
                >
                  <circle cx="50" cy="14" r="8" fill="rgba(255,255,255,0.4)" />
                  <path
                    d="M36 26 Q50 22 64 26 L66 70 L62 122 L58 148 L42 148 L38 122 L34 70 Z"
                    fill="rgba(255,255,255,0.15)"
                  />
                </svg>
                <span
                  style={{
                    fontFamily: "Chakra Petch, monospace",
                    fontSize: 10,
                    color: "var(--ink-mute)",
                    position: "relative",
                  }}
                >
                  {d}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
