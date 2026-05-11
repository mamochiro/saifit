import { STROKE } from "./_shared";

interface Props {
  size?: number;
  paused?: boolean;
}

export function AnimPlank({ size = 200, paused = false }: Props) {
  return (
    <svg width={size} height={size * 1.05} viewBox="0 0 100 120" fill="none" aria-hidden="true">
      <circle cx="22" cy="60" r="6" stroke={STROKE} strokeWidth="1.4" fill="none" />
      <path
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        d="M28 56 L84 60 L84 68 L28 64 Z"
      >
        {!paused && (
          <animate
            attributeName="d"
            dur="3s"
            repeatCount="indefinite"
            values="M28 56 L84 60 L84 68 L28 64 Z;M28 54 L84 58 L84 70 L28 66 Z;M28 56 L84 60 L84 68 L28 64 Z"
          />
        )}
      </path>
      <path d="M28 60 L24 84" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" />
      <line
        x1="14"
        y1="84"
        x2="34"
        y2="84"
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M84 64 L96 76" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" />
      <line
        x1="92"
        y1="80"
        x2="100"
        y2="80"
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* countdown ring — depletes over 60s */}
      <circle
        cx="50"
        cy="62"
        r="46"
        stroke="oklch(72% 0.20 270 / 30%)"
        strokeWidth="0.8"
        fill="none"
        strokeDasharray="289"
        strokeDashoffset="0"
      >
        {!paused && (
          <animate
            attributeName="stroke-dashoffset"
            from="289"
            to="0"
            dur="60s"
            repeatCount="indefinite"
          />
        )}
      </circle>
    </svg>
  );
}
