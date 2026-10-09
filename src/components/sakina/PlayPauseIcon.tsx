"use client";

/**
 * گلیف پخش/توقف — مرکز دقیق هندسی
 *
 * چرا سفارشی؟ آیکون Play لوسید مثلثِ نامتقارن دارد (x=6→20) و با fill-current
 * جرم بصری به چپ می‌افتد؛ جابه‌جایی دستی با translate هم در همه سایزها جواب
 * نمی‌دهد. این گلیف‌ها حول مرکز viewBox (12,12) بالانس شده‌اند:
 * Play مثلثی با قاعده x=6.6 و رأس x=17.55 → مرکز جعبه ≈ 12.05 (وسط دقیق؛
 * نسخه قبلی x=9→20.43 بود و ~۴px به راست شیفت دیده می‌شد).
 */

export function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6.6 5.5v13c0 .9.98 1.44 1.75.96l9.2-6.5a1.12 1.12 0 0 0 0-1.92L8.35 4.54C7.58 4.06 6.6 4.6 6.6 5.5Z" />
    </svg>
  );
}

export function PauseGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="7.1" y="5.3" width="3.2" height="13.4" rx="1.35" />
      <rect x="13.7" y="5.3" width="3.2" height="13.4" rx="1.35" />
    </svg>
  );
}
