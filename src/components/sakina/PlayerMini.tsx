"use client";

/**
 * پلیر مینی — نوار مات پایین، بالای تب‌بار
 * هیچ‌وقت شفاف روی متن نیست (اصلاح باگ نسخه ۱)
 */

import { surahs } from "@/data/quran";
import { reciters } from "@/data/audio";
import { usePlayerStore } from "@/store/player";
import { toPersianDigits } from "@/data/verses";
import { AudioWaveform, ChevronUp } from "lucide-react";
import { PauseGlyph, PlayGlyph } from "./PlayPauseIcon";

export function PlayerMini() {
  const { isPlaying, surahId, ayah, toggle, setExpanded } = usePlayerStore();
  const reciterId = usePlayerStore((s) => s.reciterId);
  const surah = surahs.find((s) => s.id === surahId);
  const reciter = reciters.find((r) => r.id === reciterId);

  if (!surah) return null;

  return (
    <div
      className="fixed inset-x-0 z-40 animate-fade-up px-3"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 86px)" }}
      role="button"
      aria-label="باز کردن پلیر تمام‌صفحه"
      onClick={() => setExpanded(true)}
    >
      <div className="matte-bar border border-border rounded-2xl shadow-float p-2 flex items-center gap-2 cursor-pointer max-w-lg mx-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(true);
          }}
          aria-label="باز کردن پلیر"
          className="w-11 h-11 rounded-xl bg-white/10 text-white/75 flex items-center justify-center shrink-0"
        >
          <ChevronUp className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0 text-right">
          <div className="text-[13px] font-bold truncate">
            {surah.arabicName} · آیه {toPersianDigits(ayah)}
          </div>
          <div className="text-[11px] text-brand-ink-muted truncate">
            {reciter?.name ?? "قاری"}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
          aria-label={isPlaying ? "توقف" : "پخش"}
          className="w-11 h-11 rounded-full gold-cta flex items-center justify-center shrink-0 active:scale-95 transition-transform"
        >
          {isPlaying ? (
            <PauseGlyph className="w-5 h-5" />
          ) : (
            <PlayGlyph className="w-5 h-5" />
          )}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            usePlayerStore.getState().setMixerOpen(true);
          }}
          aria-label="میکسر"
          className="w-11 h-11 rounded-xl text-brand-ink-muted hover:text-foreground flex items-center justify-center shrink-0"
        >
          <AudioWaveform className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
