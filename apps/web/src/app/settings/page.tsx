"use client";

import { signOut } from "@/lib/auth-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface User {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  unitsPreference: "kg" | "lb";
  locale: "th" | "en";
  reminderEnabled: boolean;
  reminderTime: string;
}

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

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="px-4 pt-6 pb-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide leading-[1.7]">
        {title}
      </p>
    </div>
  );
}

function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mx-4 flex gap-0 bg-secondary rounded-xl p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 h-9 rounded-lg text-sm font-medium transition-colors ${
            value === opt.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({
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
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-secondary border border-border"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-background shadow-sm transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SettingsSkeleton() {
  return (
    <div className="min-h-screen bg-background px-4 pt-10">
      <div className="animate-pulse space-y-6">
        <div className="h-7 bg-border rounded w-1/3" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 bg-border rounded w-16" />
            <div className="h-12 bg-secondary rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const t = useTranslations("settings");
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<User>({
    queryKey: ["me"],
    queryFn: () => fetch("/api/me").then((r) => r.json()),
    staleTime: 60_000,
  });

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

  async function handleUnitChange(units: string) {
    await patchMe({ unitsPreference: units });
    queryClient.setQueryData<User>(["me"], (old) =>
      old ? { ...old, unitsPreference: units as "kg" | "lb" } : old,
    );
  }

  async function handleLocaleChange(locale: string) {
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

  async function handleSignOut() {
    await signOut();
    router.push("/sign-in");
  }

  if (isLoading || !data) return <SettingsSkeleton />;

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="px-4 pt-10 pb-4">
        <h1 className="text-xl font-bold leading-[1.7]">{t("title")}</h1>
      </div>

      {/* Profile */}
      <SectionHeader title={t("profile")} />
      <div className="mx-4 bg-secondary rounded-2xl overflow-hidden">
        <div className="px-4 py-3">
          <label
            htmlFor="displayName"
            className="text-xs text-muted-foreground leading-[1.7] block mb-1"
          >
            {t("displayName")}
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full h-11 px-3 bg-background border border-border rounded-xl text-sm outline-none focus:ring-1 focus:ring-ring leading-[1.7]"
          />
        </div>
      </div>

      {/* Units */}
      <SectionHeader title={t("units")} />
      <SegmentedControl
        options={[
          { value: "kg", label: t("kg") },
          { value: "lb", label: t("lb") },
        ]}
        value={data.unitsPreference}
        onChange={handleUnitChange}
      />

      {/* Language */}
      <SectionHeader title={t("language")} />
      <SegmentedControl
        options={[
          { value: "th", label: t("thai") },
          { value: "en", label: t("english") },
        ]}
        value={data.locale}
        onChange={handleLocaleChange}
      />

      {/* Reminders */}
      <SectionHeader title={t("reminders")} />
      <div className="mx-4 bg-secondary rounded-2xl overflow-hidden divide-y divide-border">
        <div className="px-4 flex items-center justify-between min-h-14">
          <span className="text-sm leading-[1.7]">{t("reminderEnabled")}</span>
          <Toggle checked={data.reminderEnabled} onChange={handleReminderEnabled} />
        </div>
        {data.reminderEnabled && (
          <div className="px-4 py-3">
            <label
              htmlFor="reminderTime"
              className="text-xs text-muted-foreground leading-[1.7] block mb-1"
            >
              {t("reminderTime")}
            </label>
            <input
              id="reminderTime"
              type="time"
              value={data.reminderTime}
              onChange={(e) => handleReminderTime(e.target.value)}
              className="w-full h-11 px-3 bg-background border border-border rounded-xl text-sm outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        )}
      </div>

      {/* LINE Connection */}
      <SectionHeader title={t("lineConnected")} />
      <div className="mx-4 bg-secondary rounded-2xl overflow-hidden">
        <div className="px-4 flex items-center justify-between min-h-14">
          <span className="text-sm leading-[1.7]">LINE</span>
          <span className="text-xs bg-background text-muted-foreground px-2.5 py-1 rounded-full border border-border leading-[1.7]">
            {t("lineComingSoon")}
          </span>
        </div>
      </div>

      {/* Sign Out */}
      <div className="px-4 mt-8">
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full min-h-14 rounded-2xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors leading-[1.7]"
        >
          {t("signOut")}
        </button>
      </div>
    </div>
  );
}
