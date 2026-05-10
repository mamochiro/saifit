export function FlameIcon({
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
      <path d="M12 2 C12 2 17 8 17 13 C17 16.5 14.5 19 12 19 C9.5 19 7 16.5 7 13 C7 10 9 7 10 6 C10 9 12 10 12 13 C12 11 13 8 12 2 Z" />
      <path d="M12 22 L12 19" strokeWidth="1.5" />
    </svg>
  );
}
