export function BodyFrontIcon({
  className,
  size = 24,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Head */}
      <circle cx="12" cy="4.5" r="2.5" />
      {/* Neck */}
      <line x1="12" y1="7" x2="12" y2="8.5" />
      {/* Shoulders */}
      <path d="M7 9 Q12 8 17 9" />
      {/* Torso sides */}
      <path d="M8 9 L7.5 16 L9 16 M16 9 L16.5 16 L15 16" />
      {/* Waist */}
      <path d="M9 16 Q12 15 15 16" />
      {/* Hips */}
      <path d="M9 16 L8 19 M15 16 L16 19" />
      {/* Left arm */}
      <path d="M7 9 L5 14 L5.5 15" />
      {/* Right arm */}
      <path d="M17 9 L19 14 L18.5 15" />
      {/* Left leg */}
      <path d="M8 19 L7.5 23" />
      {/* Right leg */}
      <path d="M16 19 L16.5 23" />
    </svg>
  );
}
