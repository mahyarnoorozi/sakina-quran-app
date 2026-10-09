"use client";

/**
 * اسلایدر عمودی میکسر — سگمنت‌های لمسی (رفع مشکل range عمودی مرورگرها)
 * کلیک/درگ روی نوار → مقدار ۰-۱۰۰
 */

import { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { toPersianDigits } from "@/data/verses";

export function VSlider({
  value,
  onChange,
  active,
  accent = "var(--brand-emerald)",
  label,
}: {
  value: number; // ۰-۱۰۰
  onChange: (v: number) => void;
  active: boolean;
  accent?: string;
  label: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromEvent = useCallback(
    (clientY: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // از پایین به بالا
      const pct = 1 - (clientY - rect.top) / rect.height;
      onChange(Math.round(Math.min(100, Math.max(0, pct * 100))));
    },
    [onChange]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setFromEvent(e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setFromEvent(e.clientY);
  };

  const stop = () => {
    dragging.current = false;
  };

  const segments = Array.from({ length: 14 }, (_, i) => 13 - i); // از پایین به بالا
  const filledSegments = Math.round((value / 100) * 14);

  return (
    <div className="flex flex-col items-center gap-2 select-none" role="slider" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} tabIndex={0}>
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stop}
        onPointerCancel={stop}
        className={cn(
          "relative w-12 h-[136px] rounded-2xl flex flex-col justify-end gap-[3px] p-[6px] transition-colors touch-none",
          active ? "bg-secondary" : "bg-muted/60"
        )}
      >
        {segments.map((seg) => {
          const isFilled = seg < filledSegments && active;
          return (
            <div
              key={seg}
              className="flex-1 rounded-full transition-colors duration-150"
              style={{
                background: isFilled
                  ? accent
                  : "color-mix(in srgb, var(--brand-ink-muted) 22%, transparent)",
                opacity: isFilled ? 1 : 1,
              }}
            />
          );
        })}
      </div>
      <div className="text-center">
        <div
          className={cn(
            "text-xs font-bold tabular-nums",
            active ? "text-foreground" : "text-brand-ink-muted"
          )}
        >
          {toPersianDigits(value)}
        </div>
      </div>
    </div>
  );
}
