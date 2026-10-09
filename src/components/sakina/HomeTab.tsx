"use client";

/**
 * خانه — لوکس عکس‌محور
 * هیرو عکس‌دار (آیه روز) ← ادامه گوش دادن ← حالت خواب عکس‌دار ← کولکشن‌ها با کاور واقعی ← قاری‌ها با عکس
 */

import { useEffect, useState } from "react";
import Image from "next/image";
import { surahs } from "@/data/quran";
import { reciters, collections } from "@/data/audio";
import { getVerseOfDay, toPersianDigits, type VerseOfDay } from "@/data/verses";
import { usePlayerStore } from "@/store/player";
import { useSettingsStore } from "@/store/settings";
import { StarMark } from "./Logo";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Moon, Sparkles } from "lucide-react";
import { PauseGlyph, PlayGlyph } from "./PlayPauseIcon";

export function HomeTab({ onOpenSleep }: { onOpenSleep: () => void }) {
  const { play, isPlaying, surahId, ayah, toggle, setReciter, reciterId } =
    usePlayerStore();
  const { streamQuality } = useSettingsStore();

  const [vod, setVod] = useState<VerseOfDay | null>(null);
  const [vodLoading, setVodLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getVerseOfDay()
      .then((v) => alive && setVod(v))
      .catch(() => {})
      .finally(() => alive && setVodLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const lastPlayedAt = usePlayerStore((s) => s.lastPlayedAt);
  const lastSurah = usePlayerStore((s) => s.surahId);
  const lastAyah = usePlayerStore((s) => s.ayah);
  const showResume = lastPlayedAt > 0 && Date.now() - lastPlayedAt < 7 * 86400_000;
  const resumeSurah = surahs.find((s) => s.id === lastSurah);

  const bitrate = streamQuality === "high" ? "۱۹۲" : "۶۴";
  const vodPlaying = vod && isPlaying && surahId === vod.surahId;

  return (
    <div className="pb-44">
      {/* سربرگ */}
      <header className="px-5 pt-9 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl gold-cta flex items-center justify-center">
            <StarMark className="w-6 h-6" strokeWidth={2.4} />
          </div>
          <div>
            <h1 className="text-[22px] font-black leading-7">سَکینه</h1>
            <p className="text-[11px] text-brand-ink-muted">
              سلام بر تو — جایی برای نفس کشیدن
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-[#C9A45C] border border-[#C9A45C]/30 bg-[#C9A45C]/10 rounded-full px-3 py-1.5">
          {bitrate}k · Hi-Fi
        </span>
      </header>

      {/* آیه روز — هیرو عکس‌دار */}
      <section className="px-4 mt-3" aria-label="آیه روز">
        <div className="photo-card rounded-[28px] shadow-elevated animate-fade-up">
          <Image
            src="/images/collections/night.jpg"
            alt=""
            width={800}
            height={500}
            priority
            className="opacity-90"
          />
          <div className="relative p-6 pt-20 min-h-[300px] flex flex-col">
            <div className="flex items-center justify-between mb-auto">
              <span className="glass inline-flex items-center gap-1.5 text-[11px] font-bold text-[#E2C288] rounded-full px-3 py-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                آیه‌ی امروز
              </span>
              {vod && (
                <span className="text-[11px] text-white/70">{vod.ref}</span>
              )}
            </div>
            {vodLoading || !vod ? (
              <div className="space-y-3 animate-pulse py-6">
                <div className="h-7 bg-white/20 rounded-xl w-3/4 mx-auto" />
                <div className="h-4 bg-white/10 rounded-lg w-1/2 mx-auto" />
              </div>
            ) : (
              <>
                <p className="font-quran text-[22px] leading-[2] text-white text-center mt-6 drop-shadow-lg">
                  {vod.arabic}
                </p>
                <p className="mt-2 text-[12px] text-white/75 leading-6 text-center">
                  {vod.persian}
                </p>
                <button
                  onClick={() => (vodPlaying ? toggle() : play(vod.surahId, vod.ayah))}
                  className="gold-cta mt-5 mx-auto flex items-center gap-2 rounded-full pl-6 pr-4 h-12 font-bold text-sm"
                >
                  {vodPlaying ? (
                    <PauseGlyph className="w-4.5 h-4.5" />
                  ) : (
                    <PlayGlyph className="w-4.5 h-4.5" />
                  )}
                  {vodPlaying ? "در حال پخش — اینجا هستی" : "گوش دادن به آیه"}
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ادامه گوش دادن */}
      {showResume && resumeSurah && (
        <section className="px-4 mt-4" aria-label="ادامه گوش دادن">
          <button
            onClick={() => play(lastSurah, lastAyah)}
            className="w-full glass rounded-3xl p-2.5 text-right flex items-center gap-3 hover:border-white/25 transition-colors"
          >
            <span className="w-12 h-12 rounded-2xl gold-cta flex items-center justify-center shrink-0">
              <PlayGlyph className="w-5 h-5" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[10px] font-bold text-[#C9A45C] tracking-wide">
                ادامه‌ی گوش دادن
              </span>
              <span className="block text-sm font-bold truncate mt-0.5">
                {resumeSurah.arabicName} — {resumeSurah.persianName}
              </span>
              <span className="block text-[11px] text-brand-ink-muted">
                از آیه‌ی {toPersianDigits(lastAyah)}
              </span>
            </span>
          </button>
        </section>
      )}

      {/* حالت خواب — عکس‌دار */}
      <section className="px-4 mt-4" aria-label="حالت خواب">
        <button
          onClick={onOpenSleep}
          className="photo-card w-full rounded-[28px] text-right shadow-card active:scale-[0.99] transition-transform block"
        >
          <Image
            src="/images/collections/mosque.jpg"
            alt=""
            width={800}
            height={340}
            className="opacity-80"
          />
          <div className="relative p-5 py-7 flex items-center gap-4 min-h-[128px]">
            <span className="w-14 h-14 rounded-2xl glass flex items-center justify-center shrink-0 text-[#E2C288]">
              <Moon className="w-7 h-7" />
            </span>
            <span className="flex-1 text-white">
              <span className="block text-base font-black">حالت خواب</span>
              <span className="block text-[11px] text-white/75 mt-1 leading-6">
                تلاوتِ نرم + صدای شب + محو تدریجی با تایمر
              </span>
            </span>
          </div>
        </button>
      </section>

      {/* کولکشن‌ها — کاور واقعی */}
      <section className="mt-6" aria-label="پلی‌لیست‌های کیوریت‌شده">
        <h2 className="text-[15px] font-black px-4 mb-3">برای حال‌وهوای تو</h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2">
          {collections.slice(0, 6).map((c) => (
            <button
              key={c.id}
              onClick={() => {
                if (c.premium) {
                  toast.info("این کولکشن بخشی از پریمیوم است");
                  return;
                }
                play(c.surahIds[0], 1, c.reciterId);
              }}
              className="photo-card w-44 shrink-0 rounded-3xl text-right shadow-card hover:shadow-elevated transition-shadow"
            >
              <Image
                src={c.image}
                alt=""
                width={352}
                height={200}
                className="opacity-90"
              />
              <div className="relative p-3.5 pt-14 min-h-[120px] flex flex-col justify-end">
                <div className="text-[13px] font-bold text-white leading-5">
                  {c.title}
                </div>
                <div className="text-[10px] text-white/70 mt-1">
                  {toPersianDigits(c.surahIds.length)} سوره
                </div>
              </div>
              <span className="absolute bottom-3 left-3 w-9 h-9 rounded-full gold-cta flex items-center justify-center">
                <PlayGlyph className="w-4 h-4" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* قاری‌ها — عکس واقعی */}
      <section className="mt-6" aria-label="قاری‌های منتخب">
        <h2 className="text-[15px] font-black px-4 mb-3">صدای قاری‌ها</h2>
        <div className="flex gap-3.5 overflow-x-auto no-scrollbar px-4 pb-2">
          {reciters.filter((r) => !r.premium).map((r) => {
            const active = reciterId === r.id;
            return (
              <button
                key={r.id}
                onClick={() => {
                  setReciter(r.id);
                  toast.success(`قاری پیش‌فرض: ${r.name}`);
                }}
                className="flex flex-col items-center gap-2 w-[76px] shrink-0"
              >
                <span
                  className={cn(
                    "relative w-[68px] h-[68px] rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-background transition-all shadow-card",
                    active ? "ring-[#C9A45C]" : "ring-transparent"
                  )}
                >
                  <Image
                    src={r.image}
                    alt={r.name}
                    width={136}
                    height={136}
                    className="object-cover w-full h-full"
                  />
                  {active && (
                    <span className="absolute inset-0 ring-1 ring-inset ring-white/40 rounded-full" />
                  )}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-bold text-center leading-4 line-clamp-2",
                    active ? "text-[#C9A45C]" : "text-brand-ink-muted"
                  )}
                >
                  {r.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
