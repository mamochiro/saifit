"use client";

import { BookOpen, ClipboardList, Dumbbell, Home, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

const HIDDEN_PATHS = ["/sign-in", "/sign-up", "/welcome"];

const NAV_ITEMS = [
  { href: "/", icon: Home, labelKey: "home" as const },
  { href: "/workout/history", icon: Dumbbell, labelKey: "log" as const },
  { href: "/routines", icon: ClipboardList, labelKey: "routines" as const },
  { href: "/progress", icon: TrendingUp, labelKey: "progress" as const },
  { href: "/exercises", icon: BookOpen, labelKey: "exercises" as const },
] as const;

export function BottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "0 16px 16px",
      }}
    >
      <nav className="tabbar">
        {NAV_ITEMS.map(({ href, icon: Icon, labelKey }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={`tab${isActive ? " is-active" : ""}`}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75} aria-hidden="true" />
              <span>{t(labelKey)}</span>
              <span className="tab-dot" aria-hidden="true" />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
