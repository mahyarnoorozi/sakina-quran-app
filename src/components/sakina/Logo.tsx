"use client";

import { cn } from "@/lib/utils";

export function StarMark({ className, strokeWidth = 2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
        <rect x="22" y="22" width="56" height="56" rx="2" />
        <rect x="22" y="22" width="56" height="56" rx="2" transform="rotate(45 50 50)" />
        <circle cx="50" cy="50" r="13" />
      </g>
    </svg>
  );
}

export function Logo({
  size = 64,
  withText = true,
  className,
}: {
  size?: number;
  withText?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div
        className="relative flex items-center justify-center rounded-[28%] bg-primary text-primary-foreground shadow-primary"
        style={{ width: size, height: size }}
      >
        <StarMark className="w-[62%] h-[62%] animate-breathing" strokeWidth={2.6} />
      </div>
      {withText && (
        <div className="text-center">
          <div className="text-2xl font-black tracking-tight">سَکینه</div>
          <div className="text-[10px] font-medium text-brand-ink-muted tracking-[0.35em] uppercase">
            Quran · Calm
          </div>
        </div>
      )}
    </div>
  );
}
