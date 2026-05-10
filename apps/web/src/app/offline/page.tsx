"use client";

export default function OfflinePage() {
  return (
    <div
      className="saifit-bg"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 32px",
        textAlign: "center",
        gap: 24,
      }}
    >
      {/* No-signal icon */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid var(--glass-line)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width={32}
          height={32}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: "var(--ink-mute)" }}
          aria-hidden="true"
        >
          <path d="M1 1l22 22" />
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
          <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <path d="M12 20h.01" />
        </svg>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <h1
          style={{
            fontFamily: "K2D, sans-serif",
            fontWeight: 700,
            fontSize: 22,
            color: "var(--ink)",
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          ไม่มีการเชื่อมต่อ
        </h1>
        <p
          style={{
            fontFamily: "K2D, sans-serif",
            fontSize: 14,
            color: "var(--ink-mute)",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต
          <br />
          แล้วลองอีกครั้ง
        </p>
      </div>

      <button
        type="button"
        onClick={() => window.location.reload()}
        className="btn-primary"
        style={{ minWidth: 160 }}
      >
        ลองอีกครั้ง
      </button>
    </div>
  );
}
