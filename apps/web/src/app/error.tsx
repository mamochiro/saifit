"use client";

import Link from "next/link";
import { useEffect } from "react";

function Illo500() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <rect
        x="36"
        y="40"
        width="88"
        height="18"
        rx="3"
        fill="rgba(255,255,255,0.04)"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="1.4"
      />
      <circle cx="46" cy="49" r="2" fill="oklch(70% 0.16 150)" />
      <circle cx="54" cy="49" r="2" fill="rgba(255,255,255,0.30)" />
      <line x1="100" y1="45" x2="118" y2="45" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="100" y1="49" x2="118" y2="49" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="100" y1="53" x2="115" y2="53" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <rect
        x="36"
        y="64"
        width="88"
        height="18"
        rx="3"
        fill="rgba(255,255,255,0.04)"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth="1.4"
        opacity="0.88"
      />
      <circle cx="46" cy="73" r="2" fill="var(--danger)" />
      <circle cx="54" cy="73" r="2" fill="rgba(255,255,255,0.30)" />
      <line x1="100" y1="69" x2="118" y2="69" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="100" y1="73" x2="118" y2="73" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="100" y1="77" x2="115" y2="77" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <rect
        x="36"
        y="88"
        width="88"
        height="18"
        rx="3"
        fill="rgba(255,255,255,0.04)"
        stroke="rgba(255,255,255,0.65)"
        strokeWidth="1.4"
        opacity="0.76"
      />
      <circle cx="46" cy="97" r="2" fill="oklch(70% 0.16 150)" />
      <circle cx="54" cy="97" r="2" fill="rgba(255,255,255,0.30)" />
      <line x1="100" y1="93" x2="118" y2="93" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="100" y1="97" x2="118" y2="97" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="100" y1="101" x2="115" y2="101" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <path
        d="M84 38 L72 60 L82 60 L66 88 L78 70 L70 70 L84 38 Z"
        fill="var(--danger)"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="0.6"
        style={{ filter: "drop-shadow(0 0 8px var(--danger))" }}
      />
    </svg>
  );
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="th">
      <body>
        <div
          className="saifit-bg"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            padding: "24px 24px 48px",
            fontFamily: "K2D, sans-serif",
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
                  background: "radial-gradient(circle, var(--danger) 0%, transparent 60%)",
                  opacity: 0.18,
                  filter: "blur(20px)",
                }}
              />
              <div style={{ position: "relative" }}>
                <Illo500 />
              </div>
            </div>

            <div style={{ marginTop: 8 }}>
              <div
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  color: "var(--danger)",
                  marginBottom: 8,
                }}
              >
                500 · SERVER ERROR
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
                ระบบขัดข้องชั่วคราว
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
                ทีมของเรากำลังแก้ไข ลองใหม่อีกครั้งใน 1–2 นาที
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button
              type="button"
              onClick={reset}
              style={{
                width: "100%",
                height: 56,
                borderRadius: 14,
                border: 0,
                background: "linear-gradient(135deg, oklch(62% 0.20 25), oklch(58% 0.18 15))",
                color: "#fff",
                fontFamily: "K2D, sans-serif",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08) inset",
              }}
            >
              ลองใหม่
            </button>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: 48,
                borderRadius: 12,
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.7)",
                fontFamily: "K2D, sans-serif",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              กลับหน้าแรก
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
