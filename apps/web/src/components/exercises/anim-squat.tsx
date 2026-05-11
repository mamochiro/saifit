import { STROKE, smilAttr, smilD } from "./_shared";

interface Props {
  size?: number;
  showMotion?: boolean;
  paused?: boolean;
}

export function AnimSquat({ size = 200, showMotion = true, paused = false }: Props) {
  const torsoVals = [
    "M40 32 L40 56 Q50 60 60 56 L60 32",
    "M40 32 L40 56 Q50 60 60 56 L60 32",
    "M40 38 L42 60 Q50 64 58 60 L60 38",
    "M40 38 L42 60 Q50 64 58 60 L60 38",
    "M40 32 L40 56 Q50 60 60 56 L60 32",
    "M40 32 L40 56 Q50 60 60 56 L60 32",
  ].join(";");
  const lLegVals = [
    "M42 56 L42 90 L42 116",
    "M42 56 L42 90 L42 116",
    "M42 60 L34 84 L42 116",
    "M42 60 L34 84 L42 116",
    "M42 56 L42 90 L42 116",
    "M42 56 L42 90 L42 116",
  ].join(";");
  const rLegVals = [
    "M58 56 L58 90 L58 116",
    "M58 56 L58 90 L58 116",
    "M58 60 L66 84 L58 116",
    "M58 60 L66 84 L58 116",
    "M58 56 L58 90 L58 116",
    "M58 56 L58 90 L58 116",
  ].join(";");
  const headCY = ["14", "14", "20", "20", "14", "14"].join(";");
  const barY = ["30", "30", "36", "36", "30", "30"].join(";");

  return (
    <svg width={size} height={size * 1.05} viewBox="0 0 100 120" fill="none" aria-hidden="true">
      {showMotion && (
        <line
          x1="20"
          y1="84"
          x2="80"
          y2="84"
          stroke="oklch(72% 0.20 270 / 50%)"
          strokeWidth="0.6"
          strokeDasharray="3 2"
        />
      )}
      {showMotion && (
        <line
          x1="50"
          y1="55"
          x2="50"
          y2="65"
          stroke="oklch(72% 0.20 270 / 45%)"
          strokeWidth="0.8"
          strokeDasharray="1.5 1.5"
          strokeLinecap="round"
        />
      )}
      <circle cx="50" r="6" fill="none" stroke={STROKE} strokeWidth="1.4">
        {!paused && <animate {...smilAttr("cy", headCY)} />}
      </circle>
      <line x1="22" x2="78" stroke={STROKE} strokeWidth="1.6" strokeLinecap="round">
        {!paused && <animate {...smilAttr("y1", barY)} />}
        {!paused && <animate {...smilAttr("y2", barY)} />}
      </line>
      <path
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        d={torsoVals.split(";")[0]}
      >
        {!paused && <animate {...smilD(torsoVals)} />}
      </path>
      <path
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        d={lLegVals.split(";")[0]}
      >
        {!paused && <animate {...smilD(lLegVals)} />}
      </path>
      <path
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        d={rLegVals.split(";")[0]}
      >
        {!paused && <animate {...smilD(rLegVals)} />}
      </path>
      <circle cx="42" cy="56" r="1.6" fill={STROKE} />
      <circle cx="58" cy="56" r="1.6" fill={STROKE} />
    </svg>
  );
}
