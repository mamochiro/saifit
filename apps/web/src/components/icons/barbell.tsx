export function BarbellIcon({
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
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Bar */}
      <line x1="1" y1="12" x2="23" y2="12" />
      {/* Left collar */}
      <rect x="4" y="9" width="1" height="6" />
      {/* Right collar */}
      <rect x="19" y="9" width="1" height="6" />
      {/* Left outer plate */}
      <circle cx="3" cy="12" r="3.5" />
      {/* Left inner ring */}
      <circle cx="3" cy="12" r="2" />
      {/* Right outer plate */}
      <circle cx="21" cy="12" r="3.5" />
      {/* Right inner ring */}
      <circle cx="21" cy="12" r="2" />
    </svg>
  );
}
