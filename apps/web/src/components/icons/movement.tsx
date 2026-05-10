export function MovementIcon({
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
      {/* Main motion path */}
      <path d="M3 12 C5 8 7 6 9 8 C11 10 11 14 13 14 C15 14 15 10 17 9 C19 8 21 10 21 12" />
      {/* Speed echo — lower */}
      <path d="M3 15 C5 13 7 12 9 13" opacity="0.5" />
      {/* Speed echo — upper */}
      <path d="M3 9 C5 7 7 8 9 7" opacity="0.5" />
    </svg>
  );
}
