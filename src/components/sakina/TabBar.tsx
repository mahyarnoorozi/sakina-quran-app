"use client";

/**
 * تب‌بار ۵گانه — مات، با منطقه‌ی لمسی ۴۴px، آیکون خطی
 */

import { Home, BookOpen, AudioWaveform, Library, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { toPersianDigits } from "@/data/verses";

export type TabId = "home" | "quran" | "mixer" | "library" | "profile";

export const TABS: Array<{ id: TabId; label: string; icon: typeof Home }> = [
  { id: "home", label: "خانه", icon: Home },
  { id: "quran", label: "قرآن", icon: BookOpen },
  { id: "mixer", label: "میکسر", icon: AudioWaveform },
  { id: "library", label: "کتابخانه", icon: Library },
  { id: "profile", label: "پروفایل", icon: User },
];

export function TabBar({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (t: TabId) => void;
}) {
  return (
    <nav
      aria-label="ناوبری اصلی"
      className="fixed bottom-0 inset-x-0 z-50 safe-bottom"
    >
      <div className="mx-auto max-w-lg px-3 pb-2">
        <div className="matte-bar border border-border rounded-[26px] shadow-float flex items-stretch justify-around">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onChange(t.id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 min-h-[58px] flex-1 min-w-11 py-2 rounded-[22px] transition-all duration-200",
                  isActive ? "bg-primary/10" : "hover:bg-secondary/60"
                )}
              >
                <Icon
                  className={cn(
                    "w-[22px] h-[22px] transition-colors",
                    isActive ? "text-primary" : "text-brand-ink-muted"
                  )}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                <span
                  className={cn(
                    "text-[10px] font-semibold transition-colors",
                    isActive ? "text-primary" : "text-brand-ink-muted"
                  )}
                >
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <span className="sr-only">{`تب فعال: ${TABS.find((t) => t.id === active)?.label} از ${toPersianDigits(5)}`}</span>
    </nav>
  );
}
