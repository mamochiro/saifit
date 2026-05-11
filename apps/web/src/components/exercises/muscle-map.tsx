type MuscleKey =
  | "chest"
  | "abs"
  | "quads"
  | "shoulders"
  | "biceps"
  | "traps"
  | "lats"
  | "lowerback"
  | "glutes"
  | "hamstrings"
  | "triceps";

interface Props {
  size?: number;
  primary?: string[];
  secondary?: string[];
  view?: "front" | "back";
  label?: string;
}

function fill(key: MuscleKey, primary: string[], secondary: string[]) {
  if (primary.includes(key)) return "oklch(72% 0.20 270 / 70%)";
  if (secondary.includes(key)) return "oklch(72% 0.20 270 / 30%)";
  return "rgba(255,255,255,0.10)";
}

export function MuscleMap({
  size = 140,
  primary = [],
  secondary = [],
  view = "front",
  label,
}: Props) {
  const f = (k: MuscleKey) => fill(k, primary, secondary);
  const defaultLabel = view === "front" ? "FRONT · ด้านหน้า" : "BACK · ด้านหลัง";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={size} height={size * 1.5} viewBox="0 0 100 150" aria-hidden="true">
        <circle cx="50" cy="14" r="7" fill="none" stroke="rgba(255,255,255,0.30)" strokeWidth="1" />
        <path
          d="M36 26 L36 34 L30 38 L30 60 L36 66 L36 90 L42 92 L42 122 L46 148 L42 148 L40 124 L36 96 L30 96 L30 60 L24 56 L24 36 L34 24 Z M64 26 L64 34 L70 38 L70 60 L64 66 L64 90 L58 92 L58 122 L54 148 L58 148 L60 124 L64 96 L70 96 L70 60 L76 56 L76 36 L66 24 Z"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.8"
        />
        <path
          d="M36 26 Q50 22 64 26 L64 90 Q50 92 36 90 Z"
          fill="rgba(255,255,255,0.03)"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="0.8"
        />

        {view === "front" ? (
          <>
            <path d="M37 32 L49 32 L49 50 L37 48 Z" fill={f("chest")} />
            <path d="M51 32 L63 32 L63 48 L51 50 Z" fill={f("chest")} />
            <rect x="44" y="52" width="12" height="28" fill={f("abs")} />
            <path d="M40 92 L48 94 L46 122 L40 120 Z" fill={f("quads")} />
            <path d="M52 94 L60 92 L60 120 L54 122 Z" fill={f("quads")} />
            <ellipse cx="32" cy="32" rx="6" ry="7" fill={f("shoulders")} />
            <ellipse cx="68" cy="32" rx="6" ry="7" fill={f("shoulders")} />
            <ellipse cx="26" cy="50" rx="4" ry="9" fill={f("biceps")} />
            <ellipse cx="74" cy="50" rx="4" ry="9" fill={f("biceps")} />
          </>
        ) : (
          <>
            <path d="M40 26 L60 26 L56 38 L44 38 Z" fill={f("traps")} />
            <path d="M37 40 L46 40 L42 70 L36 60 Z" fill={f("lats")} />
            <path d="M54 40 L63 40 L64 60 L58 70 Z" fill={f("lats")} />
            <rect x="44" y="62" width="12" height="22" fill={f("lowerback")} />
            <ellipse cx="44" cy="92" rx="6" ry="6" fill={f("glutes")} />
            <ellipse cx="56" cy="92" rx="6" ry="6" fill={f("glutes")} />
            <path d="M40 100 L48 100 L46 122 L40 120 Z" fill={f("hamstrings")} />
            <path d="M52 100 L60 100 L60 120 L54 122 Z" fill={f("hamstrings")} />
            <ellipse cx="26" cy="50" rx="4" ry="9" fill={f("triceps")} />
            <ellipse cx="74" cy="50" rx="4" ry="9" fill={f("triceps")} />
          </>
        )}
      </svg>
      <span
        style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 9,
          letterSpacing: "0.18em",
          color: "var(--ink-soft)",
          fontWeight: 600,
        }}
      >
        {label ?? defaultLabel}
      </span>
    </div>
  );
}

// Maps exercise muscleGroup category values → MuscleMap highlight keys
export const MUSCLE_GROUP_TO_MAP: Record<string, string[]> = {
  chest: ["chest"],
  back: ["lats", "traps", "lowerback"],
  legs: ["quads", "hamstrings", "glutes"],
  shoulders: ["shoulders"],
  arms: ["biceps", "triceps"],
  core: ["abs"],
  cardio: [],
  full_body: ["chest", "abs", "quads", "shoulders", "lats", "glutes"],
};
