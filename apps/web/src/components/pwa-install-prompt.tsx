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
    if (localStorage.getItem("pwa-dismissed") === "1") return;

    const visits = Number(localStorage.getItem("pwa-visits") ?? "0") + 1;
    localStorage.setItem("pwa-visits", String(visits));

    const handler = (e: Event) => {
      e.preventDefault();
      const prompt = e as BeforeInstallPromptEvent;
      setDeferredPrompt(prompt);
      if (visits >= 2) setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShow(false);
      localStorage.setItem("pwa-dismissed", "1");
    }
    setDeferredPrompt(null);
  }

  function handleDismiss() {
    setShow(false);
    localStorage.setItem("pwa-dismissed", "1");
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 px-4">
      <div className="bg-secondary border border-border rounded-2xl p-4 shadow-2xl">
        <p className="text-sm font-semibold leading-[1.7]">{t("installTitle")}</p>
        <p className="text-xs text-muted-foreground mt-1 leading-[1.7]">
          {t("installDescription")}
        </p>
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={handleDismiss}
            className="flex-1 min-h-11 rounded-xl border border-border text-sm text-muted-foreground hover:bg-background transition-colors"
          >
            {t("dismiss")}
          </button>
          <button
            type="button"
            onClick={handleInstall}
            className="flex-1 min-h-11 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
          >
            {t("install")}
          </button>
        </div>
      </div>
    </div>
  );
}
