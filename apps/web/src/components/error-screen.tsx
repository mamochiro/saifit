"use client";

import Link from "next/link";
import type { ReactNode } from "react";

interface ErrorScreenProps {
  kicker: string;
  illustration: ReactNode;
  title: string;
  body: string;
  primaryLabel: string;
  primaryHref?: string;
  primaryAction?: () => void;
  secondaryLabel?: string;
  secondaryHref?: string;
  secondaryAction?: () => void;
  variant?: "default" | "warning" | "danger";
  extra?: ReactNode;
}

const accentByVariant = {
  default: "var(--violet)",
  warning: "oklch(78% 0.15 80)",
  danger: "var(--danger)",
};

export function ErrorScreen({
  kicker,
  illustration,
  title,
  body,
  primaryLabel,
  primaryHref,
  primaryAction,
  secondaryLabel,
  secondaryHref,
  secondaryAction,
  variant = "default",
  extra,
}: ErrorScreenProps) {
  const accent = accentByVariant[variant];
  const primaryBg =
    variant === "danger"
      ? "linear-gradient(135deg, oklch(62% 0.20 25), oklch(58% 0.18 15))"
      : "linear-gradient(135deg, oklch(65% 0.22 280), oklch(60% 0.20 240))";

  return (
    <div
      className="saifit-bg"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "24px 24px 110px",
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
              background: `radial-gradient(circle, ${accent} 0%, transparent 60%)`,
              opacity: variant === "default" ? 0.22 : 0.18,
              filter: "blur(20px)",
            }}
          />
          <div style={{ position: "relative" }}>{illustration}</div>
        </div>

        <div style={{ marginTop: 8 }}>
          <div
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.22em",
              color: accent,
              marginBottom: 8,
            }}
          >
            {kicker}
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
            {title}
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
            {body}
          </p>
        </div>

        {extra}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {primaryHref ? (
          <Link
            href={primaryHref}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: 56,
              borderRadius: 14,
              background: primaryBg,
              color: "#fff",
              fontFamily: "K2D, sans-serif",
              fontWeight: 700,
              fontSize: 16,
              textDecoration: "none",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08) inset",
            }}
          >
            {primaryLabel}
          </Link>
        ) : (
          <button
            type="button"
            onClick={primaryAction}
            style={{
              width: "100%",
              height: 56,
              borderRadius: 14,
              border: 0,
              background: primaryBg,
              color: "#fff",
              fontFamily: "K2D, sans-serif",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08) inset",
            }}
          >
            {primaryLabel}
          </button>
        )}

        {secondaryLabel &&
          (secondaryHref ? (
            <Link
              href={secondaryHref}
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
              {secondaryLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={secondaryAction}
              style={{
                width: "100%",
                height: 48,
                borderRadius: 12,
                background: "transparent",
                border: "1px solid var(--glass-line)",
                color: "var(--ink)",
                fontFamily: "K2D, sans-serif",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {secondaryLabel}
            </button>
          ))}
      </div>
    </div>
  );
}

function IlloOffline() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <path
        d="M40 92 Q80 56 120 92"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="3 4"
      />
      <path
        d="M52 100 Q80 76 108 100"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="3 4"
      />
      <path
        d="M64 108 Q80 96 96 108"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="3 4"
      />
      <circle cx="80" cy="118" r="4" fill="rgba(255,255,255,0.25)" />
      <line
        x1="38"
        y1="38"
        x2="122"
        y2="122"
        stroke="oklch(78% 0.15 80)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <g
        transform="translate(54 54) scale(0.7)"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      >
        <rect x="6" y="20" width="10" height="20" rx="2" />
        <rect x="60" y="20" width="10" height="20" rx="2" />
        <line x1="16" y1="30" x2="60" y2="30" />
      </g>
    </svg>
  );
}

function IlloMaintenance() {
  const gearTeeth = [0, 60, 120, 180, 240, 300];
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <circle
        cx="80"
        cy="80"
        r="30"
        fill="none"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="1.6"
      />
      <circle
        cx="80"
        cy="80"
        r="10"
        fill="none"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="1.6"
      />
      {gearTeeth.map((a) => (
        <rect
          key={a}
          x="76"
          y="44"
          width="8"
          height="10"
          rx="1.5"
          fill="rgba(255,255,255,0.08)"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="1.4"
          transform={`rotate(${a} 80 80)`}
        />
      ))}
    </svg>
  );
}

function IlloPermission() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <circle
        cx="80"
        cy="80"
        r="56"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.4"
        strokeDasharray="2 4"
      />
      <g
        transform="translate(80 76)"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M-22 14 Q-22 -14 0 -16 Q22 -14 22 14 L26 18 L-26 18 Z" />
        <path d="M0 -16 L0 -22" />
        <path d="M-6 22 Q-6 30 0 30 Q6 30 6 22" />
      </g>
      <circle
        cx="116"
        cy="44"
        r="14"
        fill="oklch(8% 0.005 240)"
        stroke="oklch(78% 0.15 80)"
        strokeWidth="2"
      />
      <line
        x1="106"
        y1="34"
        x2="126"
        y2="54"
        stroke="oklch(78% 0.15 80)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IlloSyncConflict() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <g
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="1.6"
        fill="rgba(255,255,255,0.04)"
        strokeLinejoin="round"
      >
        <path d="M30 80 Q22 80 22 70 Q22 60 32 60 Q34 50 46 50 Q56 50 58 60 Q66 60 66 70 Q66 80 58 80 Z" />
        <path d="M94 80 Q86 80 86 70 Q86 60 96 60 Q98 50 110 50 Q120 50 122 60 Q130 60 130 70 Q130 80 122 80 Z" />
      </g>
      <path d="M68 64 L82 64" stroke="oklch(78% 0.15 80)" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M82 64 L78 60 M82 64 L78 68"
        stroke="oklch(78% 0.15 80)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M82 76 L68 76"
        stroke="oklch(78% 0.15 80)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="3 3"
      />
      <path
        d="M68 76 L72 72 M68 76 L72 80"
        stroke="oklch(78% 0.15 80)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="80"
        cy="110"
        r="14"
        fill="oklch(78% 0.15 80 / 18%)"
        stroke="oklch(78% 0.15 80)"
        strokeWidth="1.6"
      />
      <line
        x1="80"
        y1="104"
        x2="80"
        y2="112"
        stroke="oklch(78% 0.15 80)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="80" cy="116" r="1.2" fill="oklch(78% 0.15 80)" />
    </svg>
  );
}

function IlloEmptyDumbbell() {
  return (
    <svg width="180" height="120" viewBox="0 0 180 120" fill="none" aria-hidden="true">
      <line
        x1="20"
        y1="100"
        x2="160"
        y2="100"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1"
        strokeDasharray="2 4"
      />
      <g stroke="rgba(255,255,255,0.85)" strokeWidth="1.6" fill="none" strokeLinecap="round">
        <line x1="40" y1="80" x2="140" y2="80" />
        <rect x="20" y="64" width="22" height="32" rx="3" />
        <rect x="138" y="64" width="22" height="32" rx="3" />
        <rect x="14" y="60" width="6" height="40" rx="2" />
        <rect x="160" y="60" width="6" height="40" rx="2" />
      </g>
      <path
        d="M0 -10 L2 -2 L10 0 L2 2 L0 10 L-2 2 L-10 0 L-2 -2 Z"
        fill="oklch(72% 0.20 270 / 60%)"
        transform="translate(90 36)"
      />
    </svg>
  );
}

function IlloEmptyChart() {
  return (
    <svg width="180" height="140" viewBox="0 0 180 140" fill="none" aria-hidden="true">
      <line x1="30" y1="20" x2="30" y2="110" stroke="rgba(255,255,255,0.25)" strokeWidth="1.4" />
      <line x1="30" y1="110" x2="160" y2="110" stroke="rgba(255,255,255,0.25)" strokeWidth="1.4" />
      <path
        d="M40 96 Q70 90 90 80 T140 50"
        stroke="oklch(72% 0.20 270 / 30%)"
        strokeWidth="1.6"
        strokeDasharray="3 3"
        fill="none"
      />
      <g
        transform="translate(90 60)"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      >
        <path d="M-14 -16 L14 -16 L12 4 Q0 14 -12 4 Z" />
        <path d="M-14 -10 Q-22 -10 -22 0 Q-22 6 -14 6" />
        <path d="M14 -10 Q22 -10 22 0 Q22 6 14 6" />
        <line x1="-6" y1="6" x2="6" y2="6" />
        <line x1="0" y1="6" x2="0" y2="14" />
        <rect x="-8" y="14" width="16" height="4" rx="1" />
      </g>
    </svg>
  );
}

export function OfflineScreen() {
  return (
    <ErrorScreen
      variant="warning"
      illustration={<IlloOffline />}
      kicker="OFFLINE · 503"
      title="ไม่มีการเชื่อมต่ออินเทอร์เน็ต"
      body="ไม่ต้องห่วง — เซ็ตของคุณยังถูกบันทึกในเครื่อง เราจะซิงค์ให้อัตโนมัติเมื่อกลับมาออนไลน์"
      primaryLabel="ลองอีกครั้ง"
      primaryAction={() => window.location.reload()}
      secondaryLabel="ทำงานแบบออฟไลน์ต่อ"
      secondaryAction={() => window.history.back()}
    />
  );
}

export function PermissionScreen() {
  return (
    <ErrorScreen
      variant="warning"
      illustration={<IlloPermission />}
      kicker="NOTIFICATIONS · OFF"
      title="เปิดการแจ้งเตือนเพื่อใช้งานเต็มรูปแบบ"
      body="เราจะเตือนเมื่อพักครบ ส่ง streak reminder และแจ้งเมื่อทำ PR ใหม่"
      primaryLabel="เปิดการแจ้งเตือน"
      primaryAction={() => Notification.requestPermission()}
      secondaryLabel="ใช้แบบไม่มีการแจ้งเตือน"
      secondaryAction={() => window.history.back()}
    />
  );
}

export function SyncConflictScreen({
  onKeepLatest,
  onMerge,
}: {
  onKeepLatest: () => void;
  onMerge: () => void;
}) {
  return (
    <ErrorScreen
      variant="warning"
      illustration={<IlloSyncConflict />}
      kicker="CONFLICT · 2 VERSIONS"
      title="พบเซ็ตที่บันทึกซ้ำกัน"
      body="คุณแก้ไขเซ็ตจากอุปกรณ์อื่น เลือกเวอร์ชันที่ต้องการเก็บ"
      primaryLabel="เก็บเวอร์ชันล่าสุด"
      primaryAction={onKeepLatest}
      secondaryLabel="รวมทั้งสองเวอร์ชัน"
      secondaryAction={onMerge}
    />
  );
}

export function EmptyWorkoutsScreen() {
  return (
    <ErrorScreen
      illustration={<IlloEmptyDumbbell />}
      kicker="วันแรกของคุณ"
      title="ยังไม่มีการออกกำลังกาย"
      body="เริ่มจากโปรแกรมที่เราแนะนำ หรือสร้างของคุณเอง — เซ็ตแรกอยู่ห่างไปแค่หนึ่งคลิก"
      primaryLabel="เลือกโปรแกรมแนะนำ"
      primaryHref="/templates"
    />
  );
}

export function EmptyPRsScreen() {
  return (
    <ErrorScreen
      illustration={<IlloEmptyChart />}
      kicker="STATS · NO RECORDS YET"
      title="PR แรกของคุณรออยู่"
      body="บันทึกเซ็ตให้ครบ 5 ครั้ง แล้วเราจะเริ่มติดตามสถิติส่วนตัวให้คุณ"
      primaryLabel="ดูโปรแกรม"
      primaryHref="/templates"
    />
  );
}

export function MaintenanceScreen() {
  return (
    <ErrorScreen
      variant="warning"
      illustration={<IlloMaintenance />}
      kicker="MAINTENANCE"
      title="กำลังอัปเดตระบบ"
      body="เรากำลังเพิ่มฟีเจอร์ใหม่ ใช้เวลาประมาณ 5 นาที ขอบคุณที่อดทนรอ"
      primaryLabel="รีโหลดหน้า"
      primaryAction={() => window.location.reload()}
    />
  );
}
