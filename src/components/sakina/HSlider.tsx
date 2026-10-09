"use client";

/**
 * اسلایدر افقی RTL — الگوی میکسر Quranify
 * مسیر پرشدن از راست (شروع RTL) به چپ؛ پرش با گرادیان برنزی و انگشت شیشه‌ای.
 * input[type=range] با dir="rtl" در کروم/سافاری مدرن درست برعکس می‌شود،
 * ولی برای قطعیت عرض fill را خودمان با گرادیان می‌سازیم.
 */

import { cn } from "@/lib/utils";

export function HSlider({
  value,
  onChange,
  active = true,
  label,
  icon,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  active?: boolean;
  label: string;
  icon: React.ReactNode;
  suffix?: React.ReactNode;
}) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="flex items-center gap-3 w-full min-w-0" dir="rtl">
      <span
        className={cn(
          "shrink-0 w-10 h-10 rounded-full flex items-center justify-center border transition-colors",
          active
            ? "border-border bg-secondary text-brand-brass"
            : "border-white/10 bg-white/5 text-white/40"
        )}
        aria-hidden
      >
        {icon}
      </span>

      <div className="flex-1 min-w-0 flex items-center gap-2.5">
        <div className="relative flex-1 h-10 flex items-center min-w-0">
          {/* track */}
          <div className="absolute inset-x-0 h-[6px] rounded-full bg-white/12 overflow-hidden" />
          {/* fill */}
          <div
            className="absolute top-1/2 -translate-y-1/2 right-0 h-[6px] rounded-full"
            style={{
              width: `${pct}%`,
              background: active
                ? "linear-gradient(to left, var(--brand-brass-bright) 0%, var(--brand-brass) 100%)"
                : "rgba(255,255,255,0.25)",
              boxShadow: active ? "0 0 12px rgba(201,164,92,0.45)" : "none",
              transition: "width 90ms linear",
            }}
          />
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={pct}
            aria-label={label}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-0 w-full h-10 opacity-0 cursor-pointer"
            style={{ direction: "rtl" }}
          />
          {/* thumb — لبه راست: right = (100% - 22px) * pct/100 → مرکز دقیق */}
          <div
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ right: `calc((100% - 22px) * ${pct} / 100)` }}
            aria-hidden
          >
            <span
              className={cn(
                "block w-[22px] h-[22px] rounded-full border transition-colors",
                active
                  ? "bg-white border-brand-brass shadow-[0_2px_10px_rgba(0,0,0,0.25)]"
                  : "bg-white/40 border-white/30"
              )}
            />
          </div>
        </div>
        {suffix && (
          <span className="shrink-0 text-[11px] tabular-nums text-white/60 font-semibold w-8 text-center">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
