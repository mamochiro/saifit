export function Avatar({ name, size = 38 }: { name: string; size?: number }) {
  const initial = name.charAt(0).toUpperCase();
  const fontSize = Math.round(size * 0.39);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, oklch(65% 0.22 280), oklch(60% 0.20 240))",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow: "0 6px 14px -4px rgba(120,90,255,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: "Chakra Petch, monospace",
          fontWeight: 700,
          fontSize,
          color: "white",
        }}
      >
        {initial}
      </span>
    </div>
  );
}
