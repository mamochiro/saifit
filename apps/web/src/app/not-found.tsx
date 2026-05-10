import Link from "next/link";

function Illo404() {
  return (
    <svg width="180" height="160" viewBox="0 0 180 160" fill="none" aria-hidden="true">
      <text
        x="90"
        y="100"
        textAnchor="middle"
        fontFamily="Chakra Petch"
        fontWeight="700"
        fontSize="78"
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.2"
      >
        404
      </text>
      <text
        x="90"
        y="100"
        textAnchor="middle"
        fontFamily="Chakra Petch"
        fontWeight="700"
        fontSize="78"
        fill="oklch(72% 0.20 270 / 30%)"
      >
        404
      </text>
      <g
        transform="translate(132 100)"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      >
        <circle cx="10" cy="0" r="5" />
        <path d="M10 5 L10 26" />
        <path d="M10 12 L2 18" />
        <path d="M10 12 L18 18" />
        <path d="M10 26 L4 40" />
        <path d="M10 26 L16 40" />
      </g>
    </svg>
  );
}

export default function NotFound() {
  return (
    <div
      className="saifit-bg"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "24px 24px 48px",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 200,
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "radial-gradient(circle, var(--violet) 0%, transparent 60%)",
              opacity: 0.22,
              filter: "blur(20px)",
            }}
          />
          <div style={{ position: "relative" }}>
            <Illo404 />
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          <div
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.22em",
              color: "var(--violet)",
              marginBottom: 8,
            }}
          >
            404 · NOT FOUND
          </div>
          <h2
            style={{
              margin: 0,
              fontFamily: "K2D, sans-serif",
              fontWeight: 700,
              fontSize: 24,
              color: "var(--ink)",
              letterSpacing: "-0.01em",
              lineHeight: 1.25,
            }}
          >
            ไม่พบหน้าที่คุณต้องการ
          </h2>
          <p
            style={{
              margin: "10px auto 0",
              maxWidth: 290,
              fontFamily: "K2D, sans-serif",
              fontSize: 14,
              lineHeight: 1.6,
              color: "var(--ink-mute)",
            }}
          >
            ลิงก์อาจจะหมดอายุ หรือหน้านี้ถูกลบออกแล้ว
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: 56,
            borderRadius: 14,
            background: "linear-gradient(135deg, oklch(65% 0.22 280), oklch(60% 0.20 240))",
            color: "#fff",
            fontFamily: "K2D, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            textDecoration: "none",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08) inset",
          }}
        >
          กลับหน้าแรก
        </Link>
        <Link
          href="/templates"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: 48,
            borderRadius: 12,
            background: "transparent",
            border: "1px solid var(--glass-line)",
            color: "var(--ink)",
            fontFamily: "K2D, sans-serif",
            fontWeight: 600,
            fontSize: 14,
            textDecoration: "none",
          }}
        >
          ดูโปรแกรมทั้งหมด
        </Link>
      </div>
    </div>
  );
}
