export function StrengthIcon({
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
      {/* Head */}
      <circle cx="16" cy="5" r="2" />
      {/* Spine — curved forward */}
      <path d="M15 7 C13 9 11 10 9 10" />
      {/* Bar */}
      <line x1="5" y1="12" x2="13" y2="12" strokeWidth="2" />
      {/* Arms gripping bar */}
      <path d="M9 10 L7 12" />
      <path d="M11 10 L11 12" />
      {/* Legs wide stance */}
      <path d="M9 10 L7 16 L6 17" />
      <path d="M9 10 L12 15 L13 16" />
    </svg>
  );
}
