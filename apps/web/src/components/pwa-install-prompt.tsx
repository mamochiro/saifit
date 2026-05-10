"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallPrompt() {
  const t = useTranslations("pwa");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("pwa-dismissed") === "1") return undefined;

    // Increment visit count once per calendar day to avoid double-counting
    const dateKey = "pwa-visit-date";
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem(dateKey);
    let visits = Number(localStorage.getItem("pwa-visits") ?? "0");

    if (lastVisit !== today) {
      visits += 1;
      localStorage.setItem("pwa-visits", String(visits));
      localStorage.setItem(dateKey, today);
    }

    if (visits < 2) return undefined;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      localStorage.setItem("pwa-dismissed", "1");
    }
    setShow(false);
    setDeferredPrompt(null);
  }

  function handleDismiss() {
    setShow(false);
    localStorage.setItem("pwa-dismissed", "1");
  }

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 96,
        zIndex: 40,
        padding: "0 16px",
        animation: "slideUp 0.25s ease-out",
      }}
    >
      <div className="glass glass-glow" style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
          {/* App icon mark */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "linear-gradient(135deg, oklch(65% 0.22 280), oklch(60% 0.20 240))",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 4px 12px -4px rgba(120,90,255,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width={22}
              height={22}
              fill="none"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 5v14M18 5v14M3 8h3M18 8h3M3 16h3M18 16h3M6 8h12M6 16h12" />
            </svg>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontFamily: "K2D, sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: "var(--ink)",
                lineHeight: 1.3,
                margin: 0,
              }}
            >
              {t("installTitle")}
            </p>
            <p
              style={{
                fontFamily: "K2D, sans-serif",
                fontSize: 12,
                color: "var(--ink-mute)",
                lineHeight: 1.5,
                marginTop: 4,
              }}
            >
              {t("installDescription")}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={handleDismiss}
            className="btn-glass"
            style={{ flex: 1, height: 44, fontSize: 13 }}
          >
            {t("dismiss")}
          </button>
          <button
            type="button"
            onClick={handleInstall}
            className="btn-primary"
            style={{ flex: 2, height: 44, fontSize: 14 }}
          >
            {t("install")}
          </button>
        </div>
      </div>
    </div>
  );
}
