"use client";

/**
 * پروفایل — کارت پریمیوم، صدا و پخش، نمایش (تم/فونت/ترجمه)، یادآوری، حساب
 */

import { useState } from "react";
import { useSettingsStore, type ThemeChoice } from "@/store/settings";
import { usePlayerStore } from "@/store/player";
import { useLibraryStore } from "@/store/library";
import { AudioEngine } from "@/lib/audio-engine";
import { Logo, StarMark } from "./Logo";
import { toPersianDigits } from "@/data/verses";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import {
  Bell, ChevronLeft, Crown, Headphones, Info, LifeBuoy, Moon,
  Palette, RefreshCcw, Sun, SunMoon,
} from "lucide-react";

const THEMES: Array<{ id: ThemeChoice; label: string; icon: typeof Sun }> = [
  { id: "light", label: "روشن", icon: Sun },
  { id: "dark", label: "تیره", icon: Moon },
  { id: "system", label: "خودکار", icon: SunMoon },
];

export function ProfileTab() {
  const settings = useSettingsStore();
  const { theme, setTheme } = useTheme();
  const [premiumOpen, setPremiumOpen] = useState(false);

  // همگام‌سازی تم استور با next-themes
  useEffect(() => {
    if (settings.theme && theme !== settings.theme) {
      setTheme(settings.theme);
    }
  }, []);

  const chooseTheme = (t: ThemeChoice) => {
    settings.setTheme(t);
    setTheme(t);
  };

  return (
    <div className="pb-44">
      <header className="px-5 pt-8 pb-3">
        <h1 className="text-2xl font-black">پروفایل</h1>
      </header>

      {/* کارت کاربر/پریمیوم */}
      <section className="px-5">
        <button
          onClick={() => setPremiumOpen(true)}
          className="w-full relative overflow-hidden rounded-3xl text-right shadow-card active:scale-[0.99] transition-transform"
        >
          <div className="absolute inset-0 bg-gradient-to-l from-[#7A5A1E] via-[#A2813F] to-[#C9A45C]" />
          <div className="star-pattern absolute inset-0 opacity-10" />
          <div className="relative p-5 flex items-center gap-4">
            <span className="w-14 h-14 rounded-2xl bg-white/15 text-white flex items-center justify-center shrink-0">
              <Crown className="w-7 h-7" />
            </span>
            <span className="flex-1 text-white">
              <span className="block text-base font-black">ارتقا به سکینه پریمیوم</span>
              <span className="block text-[11px] opacity-90 mt-1 leading-6">
                ۱۰۰+ قاری · ۱۹۲k + دانلود نامحدود · میکسر کامل
              </span>
            </span>
            <ChevronLeft className="w-5 h-5 text-white/80 shrink-0" />
          </div>
        </button>
      </section>

      <Group title="صدا و پخش" icon={<Headphones className="w-4 h-4" />}>
        <Row label="کیفیت پخش">
          <div className="flex gap-1 rounded-xl bg-secondary p-1">
            {[
              { id: "high" as const, label: "۱۹۲k" },
              { id: "economy" as const, label: "۶۴k" },
            ].map((q) => (
              <button
                key={q.id}
                onClick={() => settings.setStreamQuality(q.id)}
                aria-pressed={settings.streamQuality === q.id}
                className={cn(
                  "px-4 h-8 rounded-lg text-[11px] font-bold transition-all",
                  settings.streamQuality === q.id
                    ? "bg-card text-primary shadow-soft"
                    : "text-brand-ink-muted"
                )}
              >
                {q.label}
              </button>
            ))}
          </div>
        </Row>
        <Row label="گذار بدون فاصله بین آیات">
          <Toggle
            checked={settings.gapless}
            onChange={settings.setGapless}
          />
        </Row>
        <Row label="پاک‌سازی نسخه‌های آفلاین">
          <button
            onClick={async () => {
              await AudioEngine.clearCache();
              toast.success("کش آفلاین پاک شد");
            }}
            className="text-[11px] font-bold text-brand-ink-muted hover:text-destructive"
          >
            پاک‌سازی
          </button>
        </Row>
      </Group>

      <Group title="نمایش" icon={<Palette className="w-4 h-4" />}>
        <Row label="تم">
          <div className="flex gap-1 rounded-xl bg-secondary p-1">
            {THEMES.map((t) => {
              const Icon = t.icon;
              const active = settings.theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => chooseTheme(t.id)}
                  aria-pressed={active}
                  className={cn(
                    "flex items-center gap-1.5 px-3 h-8 rounded-lg text-[11px] font-bold transition-all",
                    active ? "bg-card text-primary shadow-soft" : "text-brand-ink-muted"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </Row>
        <Row label="اندازه متن عربی">
          <div className="flex items-center gap-2">
            <button
              onClick={() => settings.setFontSize(Math.max(18, settings.fontSize - 2))}
              aria-label="کوچک‌تر"
              className="w-9 h-9 rounded-full border border-border text-sm font-bold"
            >
              −
            </button>
            <span className="text-sm font-bold tabular-nums w-8 text-center">
              {toPersianDigits(settings.fontSize)}
            </span>
            <button
              onClick={() => settings.setFontSize(Math.min(36, settings.fontSize + 2))}
              aria-label="بزرگ‌تر"
              className="w-9 h-9 rounded-full border border-border text-sm font-bold"
            >
              +
            </button>
          </div>
        </Row>
        <Row label="نمایش ترجمه فارسی">
          <Toggle checked={settings.showTranslation} onChange={settings.setShowTranslation} />
        </Row>
        <Row label="اسکرول خودکار به آیه در حال پخش">
          <Toggle checked={settings.autoScroll} onChange={settings.setAutoScroll} />
        </Row>
      </Group>

      <Group title="یادآوری‌ها" icon={<Bell className="w-4 h-4" />}>
        <Row label="آیه‌ی آرامش هر صبح">
          <span className="text-[10px] font-bold text-brand-brass border border-brand-brass/40 rounded-full px-2.5 py-1">
            به‌زودی
          </span>
        </Row>
        <Row label="حالت آرامش شبانه">
          <span className="text-[10px] font-bold text-brand-brass border border-brand-brass/40 rounded-full px-2.5 py-1">
            به‌زودی
          </span>
        </Row>
      </Group>

      <Group title="حساب" icon={<Info className="w-4 h-4" />}>
        <Row label="بازیابی خرید پریمیوم">
          <button
            onClick={() => toast.info("خرید بازیابی شد", { description: "نسخه پریمیوم به‌زودی فعال می‌شود" })}
            className="text-[11px] font-bold text-brand-ink-muted hover:text-primary"
          >
            بازیابی
          </button>
        </Row>
        <Row label="پشتیبانی">
          <a
            href="mailto:salam@sakina.app"
            className="text-[11px] font-bold text-brand-ink-muted hover:text-primary inline-flex items-center gap-1"
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            salam@sakina.app
          </a>
        </Row>
        <Row label="بازنشانی کل اپ">
          <button
            onClick={() => {
              settings.resetAll();
              useLibraryStore.getState().clearHistory();
              usePlayerStore.getState().cancelSleepTimer();
              usePlayerStore.getState().pause();
              toast.success("سکینه به حالت اول بازگشت");
            }}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-destructive"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            بازنشانی
          </button>
        </Row>
      </Group>

      {/* درباره */}
      <div className="mt-8 flex flex-col items-center gap-3 opacity-80">
        <StarMark className="w-10 h-10 text-primary" />
        <p className="text-[11px] text-brand-ink-muted text-center leading-6 max-w-60">
          سَکینه — پلیر قرآنی لوکس
          <br />
          نسخه {toPersianDigits("1.0")} · ساخته‌شده با آرامش
        </p>
      </div>
    </div>
  );
}

function Group({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="px-5 mt-6" aria-label={title}>
      <h2 className="flex items-center gap-2 text-sm font-bold text-brand-ink-muted mb-3">
        {icon}
        {title}
      </h2>
      <div className="rounded-3xl border border-border bg-card divide-y divide-border overflow-hidden shadow-soft">
        {children}
      </div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5 min-h-12">
      <span className="text-[13px] font-medium">{label}</span>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (b: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-12 h-7 rounded-full transition-colors shrink-0",
        checked ? "bg-primary" : "bg-border"
      )}
    >
      <span
        className={cn(
          "absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all",
          checked ? "right-1" : "right-6"
        )}
      />
    </button>
  );
}
