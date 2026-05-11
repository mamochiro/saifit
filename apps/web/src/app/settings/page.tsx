"use client";

import { Avatar } from "@/components/avatar";
import { signIn, signOut } from "@/lib/auth-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface User {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  unitsPreference: "kg" | "lb";
  locale: "th" | "en";
  reminderEnabled: boolean;
  reminderTime: string;
  goal: "build_muscle" | "lose_fat" | "get_stronger" | "stay_active" | null;
  gymType: "commercial" | "home_equipment" | "home_no_equipment" | null;
  daysPerWeek: number | null;
  defaultTargetKcal: number | null;
  defaultTargetProteinG: number | null;
  defaultTargetCarbsG: number | null;
  defaultTargetFatG: number | null;
}

interface ConnectedAccount {
  id: string;
  provider?: string;
  providerId?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

async function patchMe(data: Record<string, unknown>): Promise<void> {
  await fetch("/api/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

// ─── PillRow ─────────────────────────────────────────────────────────────────

function PillRow({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string | number | null;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`pill${String(value) === opt.value ? " is-active" : ""}`}
          style={{ height: 44 }}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── GlassSegmented ──────────────────────────────────────────────────────────

function GlassSegmented({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      className="glass"
      style={{ display: "flex", padding: 4, gap: 4, borderRadius: 14, margin: "0 24px" }}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          style={{
            flex: 1,
            height: 36,
            borderRadius: 10,
            fontFamily: "K2D, sans-serif",
            fontWeight: 600,
            fontSize: 13,
            border: 0,
            cursor: "pointer",
            transition: "background 0.15s, color 0.15s",
            background: value === opt.value ? "rgba(140,100,255,0.18)" : "transparent",
            color: value === opt.value ? "var(--ink)" : "var(--ink-soft)",
            boxShadow:
              value === opt.value
                ? "0 0 0 1px var(--violet-edge), inset 0 1px 0 rgba(255,255,255,0.08)"
                : "none",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── VioletToggle ────────────────────────────────────────────────────────────

function VioletToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        position: "relative",
        display: "inline-flex",
        width: 48,
        height: 28,
        alignItems: "center",
        borderRadius: 999,
        border: 0,
        cursor: "pointer",
        transition: "background 0.2s",
        background: checked
          ? "linear-gradient(135deg, oklch(65% 0.22 280), oklch(60% 0.20 240))"
          : "rgba(255,255,255,0.08)",
        boxShadow: checked ? "0 0 14px var(--violet-glow)" : "none",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "white",
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
          transition: "transform 0.2s",
          transform: checked ? "translateX(24px)" : "translateX(4px)",
        }}
      />
    </button>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SettingsSkeleton() {
  return (
    <div className="saifit-bg" style={{ minHeight: "100vh", padding: "40px 24px 0" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            height: 28,
            width: "40%",
            borderRadius: 8,
            background: "rgba(255,255,255,0.06)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        {(["s1", "s2", "s3", "s4", "s5", "s6"] as const).map((k) => (
          <div key={k} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                height: 10,
                width: 64,
                borderRadius: 4,
                background: "rgba(255,255,255,0.04)",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
            <div
              style={{
                height: 52,
                borderRadius: 14,
                background: "rgba(255,255,255,0.06)",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SettingsPage ─────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const t = useTranslations("settings");
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<User>({
    queryKey: ["me"],
    queryFn: () => fetch("/api/me").then((r) => r.json()),
    staleTime: 60_000,
  });

  // Section 3 — connected accounts
  const { data: accounts, isLoading: accountsLoading } = useQuery<ConnectedAccount[]>({
    queryKey: ["auth-accounts"],
    queryFn: () => fetch("/api/auth/list-accounts").then((r) => r.json()),
    staleTime: 30_000,
  });

  // Profile display name (debounced auto-save)
  const [displayName, setDisplayName] = useState("");
  const debouncedName = useDebounce(displayName, 300);
  const nameInitialized = useRef(false);
  const prevDebouncedName = useRef("");

  useEffect(() => {
    if (data && !nameInitialized.current) {
      setDisplayName(data.displayName);
      prevDebouncedName.current = data.displayName;
      nameInitialized.current = true;
    }
  }, [data]);

  useEffect(() => {
    if (!nameInitialized.current) return;
    if (debouncedName === prevDebouncedName.current) return;
    prevDebouncedName.current = debouncedName;
    patchMe({ displayName: debouncedName });
  }, [debouncedName]);

  // Section 2 — nutrition local state (persisted on blur via PATCH /api/me)
  const [nutritionSaved, setNutritionSaved] = useState(false);
  const [kcal, setKcal] = useState(2100);
  const [protein, setProtein] = useState(150);
  const [carbs, setCarbs] = useState(220);
  const [fat, setFat] = useState(70);
  const nutritionInitialized = useRef(false);

  useEffect(() => {
    if (data && !nutritionInitialized.current) {
      if (data.defaultTargetKcal != null) setKcal(data.defaultTargetKcal);
      if (data.defaultTargetProteinG != null) setProtein(data.defaultTargetProteinG);
      if (data.defaultTargetCarbsG != null) setCarbs(data.defaultTargetCarbsG);
      if (data.defaultTargetFatG != null) setFat(data.defaultTargetFatG);
      nutritionInitialized.current = true;
    }
  }, [data]);

  // Push notifications
  const [pushStatus, setPushStatus] = useState<"idle" | "subscribed" | "denied" | "unsupported">(
    "idle",
  );
  const [pushLoading, setPushLoading] = useState(false);
  const [pushTestSent, setPushTestSent] = useState(false);

  useEffect(() => {
    if (!("PushManager" in window) || !("serviceWorker" in navigator)) {
      setPushStatus("unsupported");
      return;
    }
    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        setPushStatus(sub ? "subscribed" : "idle");
      });
    });
  }, []);

  async function handlePushSubscribe() {
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) return;
    setPushLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();
      if (permission === "denied") {
        setPushStatus("denied");
        return;
      }
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey).buffer as ArrayBuffer,
      });
      const { endpoint, keys: subKeys } = sub.toJSON() as {
        endpoint: string;
        keys: { p256dh: string; auth: string };
      };
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint, p256dh: subKeys.p256dh, auth: subKeys.auth }),
      });
      setPushStatus("subscribed");
    } finally {
      setPushLoading(false);
    }
  }

  async function handlePushUnsubscribe() {
    setPushLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setPushStatus("idle");
    } finally {
      setPushLoading(false);
    }
  }

  async function handlePushSendTest() {
    setPushLoading(true);
    try {
      await fetch("/api/push/send-test", { method: "POST" });
      setPushTestSent(true);
      setTimeout(() => setPushTestSent(false), 3000);
    } finally {
      setPushLoading(false);
    }
  }

  // Section 4 — data actions
  const [exporting, setExporting] = useState(false);
  const [deleteConfirming, setDeleteConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ── Handlers ──────────────────────────────────────────────

  async function handleUnitChange(units: string) {
    await patchMe({ unitsPreference: units });
    queryClient.setQueryData<User>(["me"], (old) =>
      old ? { ...old, unitsPreference: units as "kg" | "lb" } : old,
    );
  }

  async function handleLocaleChange(locale: string) {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    await patchMe({ locale });
    queryClient.setQueryData<User>(["me"], (old) =>
      old ? { ...old, locale: locale as "th" | "en" } : old,
    );
    router.refresh();
  }

  async function handleReminderEnabled(enabled: boolean) {
    await patchMe({ reminderEnabled: enabled });
    queryClient.setQueryData<User>(["me"], (old) =>
      old ? { ...old, reminderEnabled: enabled } : old,
    );
  }

  async function handleReminderTime(time: string) {
    await patchMe({ reminderTime: time });
    queryClient.setQueryData<User>(["me"], (old) => (old ? { ...old, reminderTime: time } : old));
  }

  async function handleNutritionBlur() {
    const res = await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        defaultTargetKcal: kcal,
        defaultTargetProteinG: protein,
        defaultTargetCarbsG: carbs,
        defaultTargetFatG: fat,
      }),
    });
    if (res.ok) {
      setNutritionSaved(true);
      setTimeout(() => setNutritionSaved(false), 2000);
    }
  }

  async function handleTrainingField(field: "goal" | "gymType" | "daysPerWeek", value: string) {
    const payload = field === "daysPerWeek" ? { daysPerWeek: Number(value) } : { [field]: value };
    await patchMe(payload);
    queryClient.setQueryData<User>(["me"], (old) => (old ? { ...old, ...payload } : old));
  }

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch("/api/me/export");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "saifit-export.json";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      await fetch("/api/me", { method: "DELETE" });
      await signOut();
      router.push("/sign-in");
    } finally {
      setDeleting(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.push("/sign-in");
  }

  const isAccountConnected = (provider: string) =>
    accounts?.some((a) => (a.provider ?? a.providerId) === provider) ?? false;

  if (isLoading || !data) return <SettingsSkeleton />;

  const GOAL_OPTIONS = [
    { value: "build_muscle", label: t("goalBuildMuscle") },
    { value: "lose_fat", label: t("goalLoseFat") },
    { value: "get_stronger", label: t("goalGetStronger") },
    { value: "stay_active", label: t("goalStayActive") },
  ];

  const goalLabel = GOAL_OPTIONS.find((o) => o.value === data.goal)?.label ?? "";

  const GYM_OPTIONS = [
    { value: "commercial", label: t("gymCommercial") },
    { value: "home_equipment", label: t("gymHomeEquipment") },
    { value: "home_no_equipment", label: t("gymHomeNoEquipment") },
  ];

  const DAY_OPTIONS = Array.from({ length: 7 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));

  const NUTRITION_FIELDS = [
    { id: "kcal", label: t("nutritionKcal"), value: kcal, set: setKcal, min: 1000, max: 5000 },
    {
      id: "protein",
      label: t("nutritionProtein"),
      value: protein,
      set: setProtein,
      min: 50,
      max: 400,
    },
    { id: "carbs", label: t("nutritionCarbs"), value: carbs, set: setCarbs, min: 50, max: 600 },
    { id: "fat", label: t("nutritionFat"), value: fat, set: setFat, min: 20, max: 200 },
  ] as const;

  return (
    <div className="saifit-bg" style={{ minHeight: "100vh", paddingBottom: 110 }}>
      <div style={{ padding: "40px 24px 0" }}>
        <span className="t-label">ACCOUNT</span>
        <h1
          style={{
            fontFamily: "K2D, sans-serif",
            fontWeight: 700,
            fontSize: 26,
            color: "var(--ink)",
            letterSpacing: "-0.01em",
            lineHeight: 1.15,
            margin: "6px 0 28px",
          }}
        >
          {t("title")}
        </h1>
      </div>

      {/* ── Profile ──────────────────────────────────────────── */}
      <div style={{ margin: "0 24px 6px" }}>
        <span className="t-label" style={{ paddingLeft: 2 }}>
          {t("profile")}
        </span>
      </div>
      <div className="glass" style={{ margin: "8px 24px", padding: "4px 0" }}>
        {/* Avatar + name header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "16px 18px 14px",
            borderBottom: "1px solid var(--glass-line)",
          }}
        >
          <Avatar name={data.displayName} size={52} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontFamily: "K2D, sans-serif",
                fontWeight: 600,
                fontSize: 16,
                color: "var(--ink)",
                lineHeight: 1.3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {data.displayName}
            </p>
            <p
              style={{
                fontFamily: "K2D, sans-serif",
                fontSize: 12,
                color: "var(--ink-soft)",
                marginTop: 2,
              }}
            >
              {goalLabel}
            </p>
          </div>
        </div>
        <div style={{ padding: "12px 18px" }}>
          <label
            htmlFor="displayName"
            style={{
              fontFamily: "K2D, sans-serif",
              fontSize: 12,
              color: "var(--ink-soft)",
              display: "block",
              marginBottom: 6,
            }}
          >
            {t("displayName")}
          </label>
          <div className="glass-input" style={{ height: 44 }}>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── Section 1: Training ──────────────────────────────── */}
      <div style={{ margin: "20px 24px 6px" }}>
        <span className="t-label" style={{ paddingLeft: 2 }}>
          {t("training")}
        </span>
      </div>
      <div className="glass" style={{ margin: "8px 24px", padding: "4px 0" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--glass-line)" }}>
          <p
            style={{
              fontFamily: "K2D, sans-serif",
              fontSize: 12,
              color: "var(--ink-soft)",
              marginBottom: 10,
            }}
          >
            {t("trainingGoal")}
          </p>
          <PillRow
            options={GOAL_OPTIONS}
            value={data.goal}
            onChange={(v) => handleTrainingField("goal", v)}
          />
        </div>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--glass-line)" }}>
          <p
            style={{
              fontFamily: "K2D, sans-serif",
              fontSize: 12,
              color: "var(--ink-soft)",
              marginBottom: 10,
            }}
          >
            {t("trainingGymType")}
          </p>
          <PillRow
            options={GYM_OPTIONS}
            value={data.gymType}
            onChange={(v) => handleTrainingField("gymType", v)}
          />
        </div>
        <div style={{ padding: "14px 18px" }}>
          <p
            style={{
              fontFamily: "K2D, sans-serif",
              fontSize: 12,
              color: "var(--ink-soft)",
              marginBottom: 10,
            }}
          >
            {t("trainingDaysPerWeek")}
          </p>
          <PillRow
            options={DAY_OPTIONS}
            value={data.daysPerWeek}
            onChange={(v) => handleTrainingField("daysPerWeek", v)}
          />
        </div>
      </div>

      {/* ── Section 2: Nutrition ─────────────────────────────── */}
      <div style={{ margin: "20px 24px 6px", display: "flex", alignItems: "center", gap: 8 }}>
        <span className="t-label" style={{ paddingLeft: 2 }}>
          {t("nutrition")}
        </span>
        {nutritionSaved && (
          <span
            style={{
              fontFamily: "K2D, sans-serif",
              fontSize: 11,
              color: "var(--success)",
              transition: "opacity 0.3s",
            }}
          >
            {t("saveSuccess")}
          </span>
        )}
      </div>
      <div className="glass" style={{ margin: "8px 24px", padding: "4px 0" }}>
        {NUTRITION_FIELDS.map((field, idx) => (
          <div
            key={field.id}
            style={{
              padding: "12px 18px",
              ...(idx < NUTRITION_FIELDS.length - 1
                ? { borderBottom: "1px solid var(--glass-line)" }
                : {}),
            }}
          >
            <label
              htmlFor={`nutrition-${field.id}`}
              style={{
                fontFamily: "K2D, sans-serif",
                fontSize: 12,
                color: "var(--ink-soft)",
                display: "block",
                marginBottom: 6,
              }}
            >
              {field.label}
            </label>
            <div className="glass-input" style={{ height: 44 }}>
              <input
                id={`nutrition-${field.id}`}
                type="number"
                inputMode="numeric"
                min={field.min}
                max={field.max}
                value={field.value}
                onChange={(e) => field.set(Number(e.target.value) as never)}
                onBlur={handleNutritionBlur}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Units ────────────────────────────────────────────── */}
      <div style={{ margin: "20px 24px 6px" }}>
        <span className="t-label" style={{ paddingLeft: 2 }}>
          {t("units")}
        </span>
      </div>
      <GlassSegmented
        options={[
          { value: "kg", label: t("kg") },
          { value: "lb", label: t("lb") },
        ]}
        value={data.unitsPreference}
        onChange={handleUnitChange}
      />

      {/* ── Language ─────────────────────────────────────────── */}
      <div style={{ margin: "20px 24px 6px" }}>
        <span className="t-label" style={{ paddingLeft: 2 }}>
          {t("language")}
        </span>
      </div>
      <GlassSegmented
        options={[
          { value: "th", label: t("thai") },
          { value: "en", label: t("english") },
        ]}
        value={data.locale}
        onChange={handleLocaleChange}
      />

      {/* ── Push Notifications ───────────────────────────────── */}
      {pushStatus !== "unsupported" && (
        <>
          <div style={{ margin: "20px 24px 6px" }}>
            <span className="t-label" style={{ paddingLeft: 2 }}>
              {t("pushNotifications")}
            </span>
          </div>
          <div className="glass" style={{ margin: "8px 24px", padding: "4px 0" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 18px",
                minHeight: 56,
                borderBottom: pushStatus === "subscribed" ? "1px solid var(--glass-line)" : "none",
              }}
            >
              <div>
                <span style={{ fontFamily: "K2D, sans-serif", fontSize: 14, color: "var(--ink)" }}>
                  {t("pushLabel")}
                </span>
                {pushStatus === "denied" && (
                  <p
                    style={{
                      fontFamily: "K2D, sans-serif",
                      fontSize: 11,
                      color: "var(--danger)",
                      marginTop: 2,
                      lineHeight: "var(--leading-relaxed)",
                    }}
                  >
                    {t("pushDenied")}
                  </p>
                )}
              </div>
              {pushStatus === "subscribed" ? (
                <button
                  type="button"
                  className="btn-glass"
                  style={{ height: 36, padding: "0 14px", fontSize: 12 }}
                  disabled={pushLoading}
                  onClick={handlePushUnsubscribe}
                >
                  {t("pushOff")}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-glass"
                  style={{
                    height: 36,
                    padding: "0 14px",
                    fontSize: 12,
                    background: "rgba(140,100,255,0.12)",
                    borderColor: "var(--violet-edge)",
                  }}
                  disabled={pushLoading || pushStatus === "denied"}
                  onClick={handlePushSubscribe}
                >
                  {pushLoading ? "..." : t("pushOn")}
                </button>
              )}
            </div>
            {pushStatus === "subscribed" && (
              <div style={{ padding: "12px 18px" }}>
                <button
                  type="button"
                  className="btn-glass"
                  style={{ width: "100%", fontSize: 13 }}
                  disabled={pushLoading || pushTestSent}
                  onClick={handlePushSendTest}
                >
                  {pushTestSent ? t("pushTestSent") : t("pushTest")}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Reminders ────────────────────────────────────────── */}
      <div style={{ margin: "20px 24px 6px" }}>
        <span className="t-label" style={{ paddingLeft: 2 }}>
          {t("reminders")}
        </span>
      </div>
      <div className="glass" style={{ margin: "8px 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 18px",
            minHeight: 56,
          }}
        >
          <span style={{ fontFamily: "K2D, sans-serif", fontSize: 14, color: "var(--ink)" }}>
            {t("reminderEnabled")}
          </span>
          <VioletToggle checked={data.reminderEnabled} onChange={handleReminderEnabled} />
        </div>
        {data.reminderEnabled && (
          <div style={{ borderTop: "1px solid var(--glass-line)", padding: "12px 18px" }}>
            <label
              htmlFor="reminderTime"
              style={{
                fontFamily: "K2D, sans-serif",
                fontSize: 12,
                color: "var(--ink-soft)",
                display: "block",
                marginBottom: 6,
              }}
            >
              {t("reminderTime")}
            </label>
            <div className="glass-input" style={{ height: 44 }}>
              <input
                id="reminderTime"
                type="time"
                value={data.reminderTime}
                onChange={(e) => handleReminderTime(e.target.value)}
                style={{ colorScheme: "dark" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Section 3: Connected Accounts ────────────────────── */}
      <div style={{ margin: "20px 24px 6px" }}>
        <span className="t-label" style={{ paddingLeft: 2 }}>
          {t("accounts")}
        </span>
      </div>
      <div className="glass" style={{ margin: "8px 24px" }}>
        {accountsLoading ? (
          <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
            {(["line-sk", "google-sk"] as const).map((k) => (
              <div
                key={k}
                style={{
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.04)",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        ) : (
          [
            { provider: "line", label: "LINE" },
            { provider: "google", label: "Google" },
          ].map((acct, idx, arr) => {
            const connected = isAccountConnected(acct.provider);
            return (
              <div
                key={acct.provider}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 18px",
                  minHeight: 56,
                  ...(idx < arr.length - 1 ? { borderBottom: "1px solid var(--glass-line)" } : {}),
                }}
              >
                <span style={{ fontFamily: "K2D, sans-serif", fontSize: 14, color: "var(--ink)" }}>
                  {acct.label}
                </span>
                {connected ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: acct.provider === "line" ? "#00B900" : "var(--success)",
                        boxShadow:
                          acct.provider === "line" ? "0 0 8px #00B900" : "0 0 8px var(--success)",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "K2D, sans-serif",
                        fontSize: 12,
                        color: "var(--ink-soft)",
                      }}
                    >
                      {t("accountConnected")}
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn-glass"
                    style={{ height: 36, padding: "0 16px", fontSize: 13 }}
                    onClick={() =>
                      signIn.social({
                        provider: acct.provider as "line" | "google",
                        callbackURL: "/settings",
                      })
                    }
                  >
                    {t("accountConnect")}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── Section 4: Data & Account ─────────────────────────── */}
      <div style={{ margin: "20px 24px 6px" }}>
        <span className="t-label" style={{ paddingLeft: 2 }}>
          {t("data")}
        </span>
      </div>
      <div className="glass" style={{ margin: "8px 24px", padding: "4px 0" }}>
        <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--glass-line)" }}>
          <button
            type="button"
            className="btn-glass"
            style={{ width: "100%" }}
            disabled={exporting}
            onClick={handleExport}
          >
            {exporting ? t("exporting") : t("exportData")}
          </button>
        </div>
        <div style={{ padding: "12px 18px" }}>
          {!deleteConfirming ? (
            <button
              type="button"
              className="btn-glass"
              style={{
                width: "100%",
                color: "var(--danger)",
                borderColor: "var(--danger)",
              }}
              onClick={() => setDeleteConfirming(true)}
            >
              {t("deleteAccount")}
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p
                style={{
                  fontFamily: "K2D, sans-serif",
                  fontSize: 14,
                  color: "var(--ink)",
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
              >
                {t("deleteConfirmMsg")}
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  className="btn-glass"
                  style={{ flex: 1, color: "var(--ink-soft)" }}
                  onClick={() => setDeleteConfirming(false)}
                  disabled={deleting}
                >
                  {t("deleteConfirmNo")}
                </button>
                <button
                  type="button"
                  className="btn-glass"
                  style={{ flex: 1, color: "var(--danger)", borderColor: "var(--danger)" }}
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                >
                  {deleting ? t("deleting") : t("deleteConfirmYes")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Sign Out ──────────────────────────────────────────── */}
      <div style={{ padding: "28px 24px 0" }}>
        <button
          type="button"
          onClick={handleSignOut}
          className="btn-glass"
          style={{ width: "100%" }}
        >
          {t("signOut")}
        </button>
      </div>
    </div>
  );
}
