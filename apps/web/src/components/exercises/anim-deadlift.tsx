import { STROKE, smilAttr, smilD } from "./_shared";

interface Props {
  size?: number;
  paused?: boolean;
}

// Start = bent over, bar at floor  →  Peak = standing, bar at hip
export function AnimDeadlift({ size = 200, paused = false }: Props) {
  // Head
  const headCX = ["50", "50", "64", "64", "50", "50"].join(";");
  const headCY = ["14", "14", "40", "40", "14", "14"].join(";");

  // Spine: x1/y1 = neck, x2/y2 = hips
  const spineX1 = ["50", "50", "60", "60", "50", "50"].join(";");
  const spineY1 = ["22", "22", "36", "36", "22", "22"].join(";");
  const spineX2 = ["50", "50", "46", "46", "50", "50"].join(";");
  const spineY2 = ["58", "58", "64", "64", "58", "58"].join(";");

  // Bar
  const barY = ["62", "62", "100", "100", "62", "62"].join(";");

  // Arms: upper endpoint tracks neck, lower endpoint tracks bar
  const armX1 = spineX1; // arms attach at neck/shoulder
  const armY1 = spineY1;
  const lArmX2 = ["36", "36", "36", "36", "36", "36"].join(";");
  const rArmX2 = ["64", "64", "56", "56", "64", "64"].join(";");

  // Legs (path morph): M hip-x hip-y L knee-x knee-y L foot-x foot-y
  const lLegVals = [
    "M46 58 L42 90 L46 116",
    "M46 58 L42 90 L46 116",
    "M44 64 L36 88 L46 116",
    "M44 64 L36 88 L46 116",
    "M46 58 L42 90 L46 116",
    "M46 58 L42 90 L46 116",
  ].join(";");
  const rLegVals = [
    "M54 58 L58 90 L54 116",
    "M54 58 L58 90 L54 116",
    "M56 64 L64 88 L54 116",
    "M56 64 L64 88 L54 116",
    "M54 58 L58 90 L54 116",
    "M54 58 L58 90 L54 116",
  ].join(";");

  return (
    <svg width={size} height={size * 1.05} viewBox="0 0 100 120" fill="none" aria-hidden="true">
      {/* motion path */}
      <line
        x1="50"
        y1="64"
        x2="50"
        y2="100"
        stroke="oklch(72% 0.20 270 / 45%)"
        strokeWidth="0.8"
        strokeDasharray="1.5 1.5"
        strokeLinecap="round"
      />

      {/* head */}
      <circle r="6" fill="none" stroke={STROKE} strokeWidth="1.4" cx="50" cy="14">
        {!paused && <animate {...smilAttr("cx", headCX)} />}
        {!paused && <animate {...smilAttr("cy", headCY)} />}
      </circle>

      {/* spine */}
      <line stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" x1="50" y1="22" x2="50" y2="58">
        {!paused && <animate {...smilAttr("x1", spineX1)} />}
        {!paused && <animate {...smilAttr("y1", spineY1)} />}
        {!paused && <animate {...smilAttr("x2", spineX2)} />}
        {!paused && <animate {...smilAttr("y2", spineY2)} />}
      </line>

      {/* left arm */}
      <line stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" x1="50" y1="22" x2="36" y2="62">
        {!paused && <animate {...smilAttr("x1", armX1)} />}
        {!paused && <animate {...smilAttr("y1", armY1)} />}
        {!paused && <animate {...smilAttr("x2", lArmX2)} />}
        {!paused && <animate {...smilAttr("y2", barY)} />}
      </line>

      {/* right arm */}
      <line stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" x1="50" y1="22" x2="64" y2="62">
        {!paused && <animate {...smilAttr("x1", armX1)} />}
        {!paused && <animate {...smilAttr("y1", armY1)} />}
        {!paused && <animate {...smilAttr("x2", rArmX2)} />}
        {!paused && <animate {...smilAttr("y2", barY)} />}
      </line>

      {/* bar */}
      <line x1="28" x2="72" stroke={STROKE} strokeWidth="1.8" strokeLinecap="round">
        {!paused && <animate {...smilAttr("y1", barY)} />}
        {!paused && <animate {...smilAttr("y2", barY)} />}
      </line>
      <circle cx="28" r="3" fill={STROKE}>
        {!paused && <animate {...smilAttr("cy", barY)} />}
      </circle>
      <circle cx="72" r="3" fill={STROKE}>
        {!paused && <animate {...smilAttr("cy", barY)} />}
      </circle>

      {/* legs */}
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
    </svg>
  );
}
