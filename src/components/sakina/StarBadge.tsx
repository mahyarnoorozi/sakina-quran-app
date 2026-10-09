"use client";

import { cn } from "@/lib/utils";
import { toPersianDigits } from "@/data/verses";

/** شماره سوره داخل نشان ستاره هشت‌پر */
export function StarBadge({
  number,
  className,
  size = 44,
}: {
  number: number;
  className?: string;
  size?: number;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 text-primary",
        className
      )}
      style={{ width: size, height: size }}
      aria-label={`سوره ${toPersianDigits(number)}`}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden>
        <g fill="none" stroke="currentColor" strokeWidth="3">
          <rect x="20" y="20" width="60" height="60" rx="3" />
          <rect x="20" y="20" width="60" height="60" rx="3" transform="rotate(45 50 50)" />
        </g>
      </svg>
      <span className="relative text-[13px] font-bold tabular-nums">
        {toPersianDigits(number)}
      </span>
    </div>
  );
}

/** نشان شماره آیه — دایره برنزی ظریف */
export function AyahBadge({ number }: { number: number }) {
  return (
    <span className="inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-full border border-brand-brass/40 bg-brand-brass/10 text-brand-brass text-[11px] font-bold tabular-nums mx-1 align-middle">
      {toPersianDigits(number)}
    </span>
  );
}
