"use client";

import { BookOpen, Dumbbell, Home, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

const HIDDEN_PATHS = ["/sign-in", "/sign-up", "/welcome"];

const NAV_ITEMS = [
  { href: "/", icon: Home, labelKey: "home" as const },
  { href: "/workout/history", icon: Dumbbell, labelKey: "log" as const },
  { href: "/progress", icon: TrendingUp, labelKey: "progress" as const },
  { href: "/exercises", icon: BookOpen, labelKey: "exercises" as const },
] as const;

export function BottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center bg-background border-t border-border"
      style={{ minHeight: 56 }}
    >
      {NAV_ITEMS.map(({ href, icon: Icon, labelKey }) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center flex-1 gap-1 py-2 min-h-14 transition-colors ${
              isActive ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.75} aria-hidden="true" />
            <span className="text-[10px] leading-none">{t(labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
