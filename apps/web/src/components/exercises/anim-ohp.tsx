import { STROKE, smilAttr } from "./_shared";

interface Props {
  size?: number;
  showMotion?: boolean;
  paused?: boolean;
}

// Start = bar at shoulder (y=26)  →  Peak = bar overhead (y=6)
export function AnimOHP({ size = 200, showMotion = true, paused = false }: Props) {
  const barY = ["26", "26", "6", "6", "26", "26"].join(";");

  return (
    <svg width={size} height={size * 1.05} viewBox="0 0 100 120" fill="none" aria-hidden="true">
      {/* motion path */}
      {showMotion && (
        <line
          x1="50"
          y1="8"
          x2="50"
          y2="28"
          stroke="oklch(72% 0.20 270 / 45%)"
          strokeWidth="0.8"
          strokeDasharray="1.5 1.5"
          strokeLinecap="round"
        />
      )}

      {/* head — static */}
      <circle cx="50" cy="14" r="6" fill="none" stroke={STROKE} strokeWidth="1.4" />

      {/* torso — static standing */}
      <path
        d="M40 22 L40 56 Q50 60 60 56 L60 22"
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* legs — static */}
      <path
        d="M42 56 L42 90 L42 116"
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M58 56 L58 90 L58 116"
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* arms: from shoulders (y=24) up to bar */}
      <line x1="40" y1="24" x2="40" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round">
        {!paused && <animate {...smilAttr("y2", barY)} />}
      </line>
      <line x1="60" y1="24" x2="60" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round">
        {!paused && <animate {...smilAttr("y2", barY)} />}
      </line>

      {/* bar */}
      <line x1="24" x2="76" stroke={STROKE} strokeWidth="1.8" strokeLinecap="round">
        {!paused && <animate {...smilAttr("y1", barY)} />}
        {!paused && <animate {...smilAttr("y2", barY)} />}
      </line>
      <circle cx="24" r="2.8" fill={STROKE}>
        {!paused && <animate {...smilAttr("cy", barY)} />}
      </circle>
      <circle cx="76" r="2.8" fill={STROKE}>
        {!paused && <animate {...smilAttr("cy", barY)} />}
      </circle>
    </svg>
  );
}
