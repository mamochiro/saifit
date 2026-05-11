import { STROKE, smilAttr } from "./_shared";

interface Props {
  size?: number;
  paused?: boolean;
}

export function AnimPullUp({ size = 200, paused = false }: Props) {
  const headCY = ["32", "32", "16", "16", "32", "32"].join(";");
  const torsoY = ["38", "38", "22", "22", "38", "38"].join(";");

  return (
    <svg width={size} height={size * 1.05} viewBox="0 0 100 120" fill="none" aria-hidden="true">
      {/* bar */}
      <line
        x1="20"
        y1="10"
        x2="80"
        y2="10"
        stroke={STROKE}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="34" cy="12" r="2.5" fill={STROKE} />
      <circle cx="66" cy="12" r="2.5" fill={STROKE} />
      {/* arms */}
      <line x1="34" y1="12" x2="34" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round">
        {!paused && <animate {...smilAttr("y2", torsoY)} />}
      </line>
      <line x1="66" y1="12" x2="66" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round">
        {!paused && <animate {...smilAttr("y2", torsoY)} />}
      </line>
      {/* head */}
      <circle cx="50" r="6" fill="none" stroke={STROKE} strokeWidth="1.4">
        {!paused && <animate {...smilAttr("cy", headCY)} />}
      </circle>
    </svg>
  );
}
