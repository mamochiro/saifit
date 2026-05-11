import { STROKE, smilAttr } from "./_shared";

interface Props {
  size?: number;
  showMotion?: boolean;
  paused?: boolean;
}

export function AnimBench({ size = 200, showMotion = true, paused = false }: Props) {
  const barY = ["56", "56", "38", "38", "56", "56"].join(";");

  return (
    <svg width={size} height={size * 1.05} viewBox="0 0 100 120" fill="none" aria-hidden="true">
      {/* bench */}
      <line
        x1="14"
        y1="78"
        x2="86"
        y2="78"
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <line x1="20" y1="78" x2="20" y2="100" stroke={STROKE} strokeWidth="1.2" />
      <line x1="80" y1="78" x2="80" y2="100" stroke={STROKE} strokeWidth="1.2" />
      {showMotion && (
        <line
          x1="50"
          y1="40"
          x2="50"
          y2="58"
          stroke="oklch(72% 0.20 270 / 45%)"
          strokeWidth="0.8"
          strokeDasharray="1.5 1.5"
          strokeLinecap="round"
        />
      )}
      <circle cx="22" cy="62" r="6" fill="none" stroke={STROKE} strokeWidth="1.4" />
      <path
        d="M28 64 Q50 62 72 64 L72 74 Q50 76 28 74 Z"
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M70 74 L80 90 L82 102"
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M64 74 L72 92 L74 104"
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* arms */}
      <line x1="44" y1="64" x2="44" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round">
        {!paused && <animate {...smilAttr("y2", barY)} />}
      </line>
      <line x1="58" y1="64" x2="58" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round">
        {!paused && <animate {...smilAttr("y2", barY)} />}
      </line>
      {/* bar */}
      <line x1="32" x2="70" stroke={STROKE} strokeWidth="1.8" strokeLinecap="round">
        {!paused && <animate {...smilAttr("y1", barY)} />}
        {!paused && <animate {...smilAttr("y2", barY)} />}
      </line>
      <circle cx="32" r="2.6" fill={STROKE}>
        {!paused && <animate {...smilAttr("cy", barY)} />}
      </circle>
      <circle cx="70" r="2.6" fill={STROKE}>
        {!paused && <animate {...smilAttr("cy", barY)} />}
      </circle>
    </svg>
  );
}
