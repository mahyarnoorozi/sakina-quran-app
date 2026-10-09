"use client";

/**
 * پلیر مینی v10 — دوکِ لاغرِ تک‌ردیفی که مستقیم روی تب‌بار می‌نشیند
 * یک واحد بصری با تب‌بار (هم‌عرض، فاصله ۶px) + خط پیشرفت زنده برنزی
 * سه ناحیه: پخش/توقف · عنوان (ضربه=باز کردن پلیر) · پرش آیه
 */

import { useEffect, useState } from "react";
import { surahs } from "@/data/quran";
import { reciters } from "@/data/audio";
import { usePlayerStore } from "@/store/player";
import { toPersianDigits } from "@/data/verses";
import { AudioEngine } from "@/lib/audio-engine";
import { SkipForward } from "lucide-react";
import { PauseGlyph, PlayGlyph } from "./PlayPauseIcon";

export function PlayerMini() {
  const { isPlaying, surahId, ayah, toggle, setExpanded, nextAyah } =
    usePlayerStore();
  const reciterId = usePlayerStore((s) => s.reciterId);
  const surah = surahs.find((s) => s.id === surahId);
  const reciter = reciters.find((r) => r.id === reciterId);

  const [pct, setPct] = useState(0);

  // خط پیشرفت — ۱Hz کافی و کم‌هزینه است
  useEffect(() => {
    if (!isPlaying) return;
    const t = setInterval(() => {
      const p = AudioEngine.progress;
      if (p.surahId === surahId && p.duration > 0) {
        setPct(Math.min(100, (p.currentTime / p.duration) * 100));
      }
    }, 1000);
    return () => clearInterval(t);
  }, [isPlaying, surahId]);

  if (!surah) return null;

  return (
    <div
      className="fixed inset-x-0 z-40 animate-fade-up px-3"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 82px)" }}
      role="button"
      aria-label="باز کردن پلیر تمام‌صفحه"
      onClick={() => setExpanded(true)}
    >
      <div className="matte-bar relative overflow-hidden border border-border rounded-2xl shadow-float pl-1.5 pr-1.5 py-1.5 flex items-center gap-1 cursor-pointer max-w-lg mx-auto">
        <span
          className="mini-progress"
          style={{ width: isPlaying ? `${pct}%` : "0%" }}
          aria-hidden
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
          aria-label={isPlaying ? "توقف" : "پخش"}
          className="w-10 h-10 rounded-full gold-cta flex items-center justify-center shrink-0 active:scale-95 transition-transform"
        >
          {isPlaying ? (
            <PauseGlyph className="w-[18px] h-[18px]" />
          ) : (
            <PlayGlyph className="w-[18px] h-[18px]" />
          )}
        </button>

        <div className="flex-1 min-w-0 text-right px-1">
          <div className="text-[12.5px] font-bold truncate leading-4">
            {surah.arabicName} · آیه {toPersianDigits(ayah)}
          </div>
          <div className="text-[10px] text-brand-ink-muted truncate leading-4">
            {reciter?.name ?? "قاری"}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            nextAyah();
          }}
          aria-label="آیه بعد"
          className="w-10 h-10 rounded-xl text-brand-ink-muted hover:text-foreground hover:bg-secondary/60 flex items-center justify-center shrink-0"
        >
          <SkipForward className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  );
}
