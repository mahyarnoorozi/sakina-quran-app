"use client";

import { cn } from "@/lib/utils";

// لوگوی «سَکینه» — هلال ماه سبز + قطره آب طلایی در قاب ۸ ضلعی
export function SakinaLogo({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block", className)}
    >
      <defs>
        <linearGradient id="sakina-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FAF7F2" />
          <stop offset="100%" stopColor="#F2EDE4" />
        </linearGradient>
        <linearGradient id="sakina-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D4B572" />
          <stop offset="100%" stopColor="#A8893E" />
        </linearGradient>
        <linearGradient id="sakina-emerald" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A6B47" />
          <stop offset="100%" stopColor="#0F5132" />
        </linearGradient>
      </defs>

      <rect width="512" height="512" rx="110" fill="url(#sakina-bg)" />

      <polygon
        points="180,40 332,40 472,180 472,332 332,472 180,472 40,332 40,180"
        fill="none"
        stroke="url(#sakina-gold)"
        strokeWidth="6"
        opacity="0.7"
      />

      <polygon
        points="200,70 312,70 442,200 442,312 312,442 200,442 70,312 70,200"
        fill="none"
        stroke="#C9A961"
        strokeWidth="2"
        opacity="0.4"
      />

      <g transform="translate(256, 220)">
        <circle cx="0" cy="0" r="95" fill="url(#sakina-emerald)" />
        <circle cx="25" cy="-10" r="80" fill="url(#sakina-bg)" />
      </g>

      <g transform="translate(256, 350)">
        <path
          d="M 0,-30 C 18,-10 22,8 22,18 C 22,30 12,38 0,38 C -12,38 -22,30 -22,18 C -22,8 -18,-10 0,-30 Z"
          fill="url(#sakina-gold)"
        />
        <ellipse cx="-6" cy="10" rx="4" ry="8" fill="#FFFFFF" opacity="0.4" />
      </g>

      <g fill="#C9A961" opacity="0.5">
        <circle cx="120" cy="120" r="2.5" />
        <circle cx="392" cy="120" r="2.5" />
        <circle cx="120" cy="392" r="2.5" />
        <circle cx="392" cy="392" r="2.5" />
      </g>
    </svg>
  );
}

// آیکون آیتم صدای طبیعت — بر اساس نام
export function NatureIcon({ name, className, size = 24 }: { name: string; className?: string; size?: number }) {
  // نگاشت نام به کاراکتر یونیکد/آیکون (با استفاده از lucide در کامپوننت اصلی)
  const map: Record<string, string> = {
    "CloudRain": "🌧",
    "CloudLightning": "⛈",
    "Flame": "🔥",
    "Waves": "🌊",
    "Wind": "💨",
    "Bird": "🐦",
    "Droplets": "💧",
    "Zap": "⚡",
    "Bug": "🦗",
    "Snowflake": "❄️",
    "Coffee": "☕",
    "Bell": "🔔",
    "Sparkles": "✨",
    "Circle": "⚪",
    "Square": "⬛",
    "Disc": "💿",
    "Tent": "⛺",
    "Trees": "🌲",
    "Fish": "🐋",
  };
  return (
    <span className={cn("inline-block leading-none", className)} style={{ fontSize: size }}>
      {map[name] || "🔊"}
    </span>
  );
}
