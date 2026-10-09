"use client";

/**
 * خانه v9 — «جلسه‌ساز»
 * مسیر کاربر (پیش‌بینی‌شده):
 *   ۱) می‌آید بالا ← دو گام جلوی چشمش است: تلاوت + لایه آرامش
 *   ۲) سوره محبوب را می‌زند (یا از شیت، هر ۱۱۴ سوره) → همان لحظه پخش
 *   ۳) صدای باران/دریا/آتش/پرنده را می‌زند → همان لحظه روی تلاوت سوار می‌شود
 *   ۴) ولوم لایه را همان‌جا کم‌وزیاد می‌کند؛ یا از ادامه گوش دادن برمی‌دارد
 * هیچ حالت محلی برای «انتخاب» نداریم — استور پلیر منبع حقیقت است؛
 * هر ضربه از طریق PlayerBridge همان فریم به AudioEngine می‌رسد.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { surahs } from "@/data/quran";
import { reciters, collections, soundNameOf } from "@/data/audio";
import { getVerseOfDay, toPersianDigits, type VerseOfDay } from "@/data/verses";
import { usePlayerStore } from "@/store/player";
import { StarMark } from "./Logo";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Bird, BookOpenText, ChevronLeft, CloudRain, Flame, ListMusic, Moon, Sparkles, VolumeX, Waves,
} from "lucide-react";
import { PauseGlyph, PlayGlyph } from "./PlayPauseIcon";
import { HSlider } from "./HSlider";
import { SurahPickerSheet } from "./SurahPickerSheet";
import { ReciterSheet } from "./ReciterSheet";

/** سوره‌های محبوب — دسترسی یک‌ضربی؛ فاتحه اول تا چیپ فعال همیشه جلوی چشم باشد */
const POPULAR = [1, 36, 67, 55, 56, 18] as const;

/** چیپ‌های لایه آرامش — هم‌تعداد Quranify (۴ صدا) + خاموش */
const SOUND_CHIPS = [
  { id: null, icon: VolumeX, label: "بدون" },
  { id: "rain-light", icon: CloudRain, label: "باران" },
  { id: "ocean-waves", icon: Waves, label: "امواج" },
  { id: "fire-camp", icon: Flame, label: "آتش" },
  { id: "forest-birds", icon: Bird, label: "پرندگان" },
] as const;

export function HomeTab({ onOpenSleep }: { onOpenSleep: () => void }) {
  const {
    isPlaying, surahId, ayah, reciterId,
    ambientSoundId, ambientVolume, setAmbientVolume,
    play, toggle, setReciter,
  } = usePlayerStore();

  const [vod, setVod] = useState<VerseOfDay | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [reciterSheet, setReciterSheet] = useState(false);

  useEffect(() => {
    let alive = true;
    getVerseOfDay()
      .then((v) => alive && setVod(v))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const lastPlayedAt = usePlayerStore((s) => s.lastPlayedAt);
  const setAmbient = usePlayerStore((s) => s.setAmbient);
  const showResume = lastPlayedAt > 0 && Date.now() - lastPlayedAt < 7 * 86400_000;
  const surahChipRef = useRef<HTMLDivElement>(null);

  const surah = surahs.find((s) => s.id === surahId) ?? surahs[0];
  const reciter = reciters.find((r) => r.id === reciterId);
  const resumeSurah = surahs.find((s) => s.id === surahId);

  // سلامِ ساعت‌محور — HomeTab فقط بعد از hydration رندر می‌شود (AppShell گیت دارد)
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "صبحت بخیر" : hour < 17 ? "بعدازظهرت بخیر" : "شب بخیر";
  const heroTitle =
    hour < 12
      ? "روز را با قرآن شروع کن"
      : hour < 17
        ? "یه مکث کوتاه در روز شلوغ"
        : "شب آرام، با قرآن و صدای طبیعت";

  const activeSound = ambientSoundId ? soundNameOf(ambientSoundId) : null;
  const ctaLabel = isPlaying
    ? "در حال پخش"
    : `پخش ${surah.persianName}${activeSound ? ` با ${activeSound}` : ""}`;

  // چیپ فعال همیشه داخل دید باشد (اصلاح A3 — بدون بریدگی در لبه)
  useEffect(() => {
    if (typeof surahId !== "number") return;
    const el = surahChipRef.current?.querySelector<HTMLElement>(
      `[data-surah-chip="${surahId}"]`
    );
    el?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [surahId]);

  const pickSound = (id: string | null) => {
    setAmbient(id);
    if (id && ambientVolume <= 5) setAmbientVolume(55);
    if (id) toast.success(`لایه «${soundNameOf(id)}» اضافه شد`, { duration: 1500 });
  };

  const vodPlaying = vod && isPlaying && surahId === vod.surahId;

  return (
    <div className="pb-44">
      {/* سربرگ مینیمال — بدون نشان‌های تبلیغاتی */}
      <header className="px-5 pt-9 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-secondary border border-border flex items-center justify-center">
            <StarMark className="w-5.5 h-5.5 text-brand-emerald" strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-[11px] text-brand-ink-muted leading-4">{greeting}</p>
            <h1 className="text-[20px] font-black leading-6">سَکینه</h1>
          </div>
        </div>
      </header>

      {/* ===== جلسه‌ساز ===== */}
      <section className="px-4 mt-2" aria-label="ساخت جلسه شنیدن">
        <div className="session-surface rounded-[28px] animate-fade-up">
          <div className="relative p-5 pt-6 flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-brass rounded-full px-3 py-1.5 bg-brand-brass/10 border border-brand-brass/25">
                <Sparkles className="w-3.5 h-3.5" />
                جلسه‌ات را بساز
              </span>
              {isPlaying && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold rounded-full px-3 py-1.5 border" style={{ color: "var(--live)", borderColor: "color-mix(in srgb, var(--live) 40%, transparent)", background: "color-mix(in srgb, var(--live) 10%, transparent)" }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--live)" }} />
                  زنده
                </span>
              )}
            </div>

            <h2 className="mt-4 text-[20px] font-black leading-8">
              {heroTitle}
            </h2>

            {/* گام ۱ — تلاوت */}
            <div className="mt-4" role="group" aria-label="انتخاب تلاوت">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-brand-ink-muted">
                  ۱ · تلاوت
                </span>
                <span className="text-[11px] font-bold text-brand-brass">
                  {surah.persianName} · آیه {toPersianDigits(ayah)}
                </span>
              </div>
              <div ref={surahChipRef} className="flex gap-2 overflow-x-auto no-scrollbar fade-x pb-0.5">
                {POPULAR.map((id) => {
                  const s = surahs.find((x) => x.id === id)!;
                  return (
                    <button
                      key={id}
                      data-surah-chip={id}
                      onClick={() => play(id, 1)}
                      aria-pressed={surahId === id}
                      className="ds-chip ds-chip--glass"
                      data-active={surahId === id}
                    >
                      {s.persianName}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPickerOpen(true)}
                  className="ds-chip ds-chip--glass"
                  aria-label="همه سوره‌ها"
                >
                  <ListMusic className="w-3.5 h-3.5" />
                  همه سوره‌ها
                </button>
              </div>
            </div>

            {/* گام ۲ — لایه آرامش */}
            <div className="mt-4" role="group" aria-label="لایه آرامش">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-brand-ink-muted">
                  ۲ · لایه‌ی آرامش
                </span>
                {activeSound && (
                  <span className="text-[11px] font-bold text-brand-brass">
                    {activeSound}
                  </span>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar fade-x pb-0.5">
                {SOUND_CHIPS.map(({ id, icon: Icon, label }) => {
                  const active = ambientSoundId === id;
                  return (
                    <button
                      key={label}
                      onClick={() => pickSound(id)}
                      aria-pressed={active}
                      className="ds-chip ds-chip--glass"
                      data-active={active}
                    >
                      <Icon className="w-3.5 h-3.5" strokeWidth={active ? 2.2 : 1.8} />
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* ولوم لایه فعال — درجا تنظیم می‌شود */}
              {ambientSoundId && (
                <div className="glass rounded-2xl px-3 py-2 mt-2.5 animate-fade-in">
                  <HSlider
                    value={ambientVolume}
                    onChange={setAmbientVolume}
                    active
                    label={`ولوم ${soundNameOf(ambientSoundId)}`}
                    icon={<Waves className="w-5 h-5" />}
                    suffix={<span>{toPersianDigits(ambientVolume)}</span>}
                  />
                </div>
              )}
            </div>

            {/* CTA اصلی */}
            <div className="mt-auto pt-5">
              <button
                onClick={() => (isPlaying ? toggle() : play(surahId, ayah))}
                className="gold-cta tap w-full h-[52px] rounded-full flex items-center justify-center gap-2.5 font-black text-[15px]"
                aria-label={ctaLabel}
              >
                {isPlaying ? (
                  <PauseGlyph className="w-5 h-5" />
                ) : (
                  <PlayGlyph className="w-5 h-5" />
                )}
                {ctaLabel}
              </button>
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-brand-ink-muted">
                <span>با صدای {reciter?.name ?? "قاری"}</span>
                <button
                  onClick={() => setReciterSheet(true)}
                  className="font-bold text-brand-brass inline-flex items-center gap-0.5"
                >
                  تغییر قاری
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ادامه گوش دادن — شرطی و کم‌ارتفاع */}
      {showResume && resumeSurah && (
        <section className="px-4 mt-3" aria-label="ادامه گوش دادن">
          <button
            onClick={() => play(surahId, ayah)}
            className="ds-card tap w-full p-2.5 text-right flex items-center gap-3 hover:border-primary/30 transition-colors"
          >
            <span className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <PlayGlyph className="w-4.5 h-4.5" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[10px] font-bold text-primary tracking-wide">
                ادامه‌ی گوش دادن
              </span>
              <span className="block text-sm font-bold truncate mt-0.5">
                {resumeSurah.arabicName} — {resumeSurah.persianName}
              </span>
              <span className="block text-[11px] text-brand-ink-muted">
                از آیه‌ی {toPersianDigits(ayah)}
              </span>
            </span>
          </button>
        </section>
      )}

      {/* دو کارت نیم‌عرض: حالت خواب + آیه امروز — بدون عکس، آرام و یکدست */}
      <section className="px-4 mt-4 grid grid-cols-2 gap-3" aria-label="میانبرها">
        <button
          onClick={onOpenSleep}
          className="ds-card tap rounded-3xl text-right p-4 min-h-[116px] flex flex-col items-start justify-between hover:border-primary/30 transition-colors"
          aria-label="حالت خواب"
        >
          <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Moon className="w-[18px] h-[18px]" />
          </span>
          <span>
            <span className="block text-[13px] font-black">حالت خواب</span>
            <span className="block text-[10.5px] text-brand-ink-muted mt-0.5">
              تلاوت نرم + محو تدریجی
            </span>
          </span>
        </button>

        <button
          onClick={() => vod && (vodPlaying ? toggle() : play(vod.surahId, vod.ayah))}
          className="ds-card tap rounded-3xl text-right p-4 min-h-[116px] flex flex-col items-start justify-between hover:border-primary/30 transition-colors"
          aria-label="آیه امروز"
        >
          <span className="w-9 h-9 rounded-xl bg-brand-brass/12 text-brand-brass flex items-center justify-center">
            <BookOpenText className="w-[18px] h-[18px]" />
          </span>
          <span className="min-w-0">
            <span className="block text-[13px] font-black">آیه‌ی امروز</span>
            <span className="block text-[10.5px] text-brand-ink-muted mt-0.5 truncate">
              {vod ? vod.ref : "…"}
            </span>
          </span>
        </button>
      </section>

      {/* کولکشن‌ها */}
      <section className="mt-6" aria-label="پلی‌لیست‌های کیوریت‌شده">
        <h2 className="ds-section-title px-4 mb-3">برای حال‌وهوای تو</h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar fade-x px-4 pb-2">
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
              className="photo-card tap w-44 shrink-0 rounded-3xl text-right shadow-card hover:shadow-elevated transition-shadow"
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

      {/* قاری‌ها */}
      <section className="mt-6" aria-label="قاری‌های منتخب">
        <h2 className="ds-section-title px-4 mb-3">صدای قاری‌ها</h2>
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
                className="flex flex-col items-center gap-2 w-[76px] shrink-0 tap"
              >
                <span
                  className={cn(
                    "relative w-[68px] h-[68px] rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-background transition-all shadow-card",
                    active ? "ring-brand-brass" : "ring-transparent"
                  )}
                >
                  <Image
                    src={r.image}
                    alt=""
                    width={136}
                    height={136}
                    className="object-cover w-full h-full"
                  />
                </span>
                <span
                  className={cn(
                    "text-[10px] font-bold text-center leading-4 line-clamp-2",
                    active ? "text-brand-brass" : "text-brand-ink-muted"
                  )}
                >
                  {r.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <SurahPickerSheet open={pickerOpen} onOpenChange={setPickerOpen} />
      <ReciterSheet open={reciterSheet} onOpenChange={setReciterSheet} />
    </div>
  );
}
