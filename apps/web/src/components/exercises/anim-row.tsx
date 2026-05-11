import { STROKE, smilAttr } from "./_shared";

interface Props {
  size?: number;
  showMotion?: boolean;
  paused?: boolean;
}

// Figure stays bent over throughout; bar pulls from hanging (y=92) → belly (y=66)
export function AnimRow({ size = 200, showMotion = true, paused = false }: Props) {
  const barY = ["92", "92", "66", "66", "92", "92"].join(";");

  return (
    <svg width={size} height={size * 1.05} viewBox="0 0 100 120" fill="none" aria-hidden="true">
      {/* motion path */}
      {showMotion && (
        <line
          x1="50"
          y1="68"
          x2="50"
          y2="92"
          stroke="oklch(72% 0.20 270 / 45%)"
          strokeWidth="0.8"
          strokeDasharray="1.5 1.5"
          strokeLinecap="round"
        />
      )}

      {/* head — bent forward, static */}
      <circle cx="68" cy="36" r="6" fill="none" stroke={STROKE} strokeWidth="1.4" />

      {/* spine — angled ~45° forward, static */}
      <line
        x1="64"
        y1="42"
        x2="44"
        y2="68"
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      {/* legs — static bent-knee stance */}
      <path
        d="M42 68 L36 90 L42 116"
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M54 68 L62 90 L54 116"
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* arms: from shoulder (top of spine ≈ 64,42) down to bar */}
      <line x1="62" y1="44" x2="40" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round">
        {!paused && <animate {...smilAttr("y2", barY)} />}
      </line>
      <line x1="62" y1="44" x2="62" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round">
        {!paused && <animate {...smilAttr("y2", barY)} />}
      </line>

      {/* bar */}
      <line x1="28" x2="72" stroke={STROKE} strokeWidth="1.8" strokeLinecap="round">
        {!paused && <animate {...smilAttr("y1", barY)} />}
        {!paused && <animate {...smilAttr("y2", barY)} />}
      </line>
      <circle cx="28" r="2.8" fill={STROKE}>
        {!paused && <animate {...smilAttr("cy", barY)} />}
      </circle>
      <circle cx="72" r="2.8" fill={STROKE}>
        {!paused && <animate {...smilAttr("cy", barY)} />}
      </circle>
    </svg>
  );
}
