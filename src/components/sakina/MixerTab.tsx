"use client";

/**
 * میکسر — الگوی Quranify
 * پنل شیشه‌ای واحد: اسلایدر تلاوت + اسلایدر صدای طبیعت + ردیف ۵ آیکونی
 * (خاموش / باران / امواج / آتش / پرندگان) + پریست‌های حس‌محور + تایمر خواب
 */

import { mixerPresets, soundNameOf, reciters } from "@/data/audio";
import { surahs } from "@/data/quran";
import { usePlayerStore } from "@/store/player";
import { toPersianDigits } from "@/data/verses";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  AudioWaveform, Bird, CloudRain, Crown, Flame, Mic, Moon, Waves, VolumeX,
} from "lucide-react";
import { HSlider } from "./HSlider";
import { PauseGlyph, PlayGlyph } from "./PlayPauseIcon";

/** چیپ آیکونی صدا — دقیقاً مثل ردیف آیکون‌های Quranify */
const SOUND_CHIPS = [
  { id: null, icon: VolumeX, label: "خاموش" },
  { id: "rain-light", icon: CloudRain, label: "باران" },
  { id: "ocean-waves", icon: Waves, label: "امواج" },
  { id: "fire-camp", icon: Flame, label: "آتش" },
  { id: "forest-birds", icon: Bird, label: "پرندگان" },
] as const;

export function MixerTab() {
  const {
    isPlaying, toggle, surahId, ayah, reciterId,
    volume, setVolume,
    ambientSoundId, setAmbient, ambientVolume, setAmbientVolume,
    sleepTimer, startSleepTimer, cancelSleepTimer, setExpanded,
  } = usePlayerStore();

  const applyPreset = (p: typeof mixerPresets[number]) => {
    if (p.premium) {
      toast.info("پریست‌های ویژه بخشی از پریمیوم‌اند", {
        description: `${p.name} به‌زودی با فعال‌سازی پریمیوم در دسترس می‌شود`,
      });
      return;
    }
    setAmbient(p.ambientSoundId || null);
    setAmbientVolume(p.ambientVolume || 50);
    setVolume(p.reciterVolume);
    toast.success(`پریست «${p.name}» فعال شد`);
  };

  const pickSound = (id: string | null) => {
    setAmbient(id);
    if (id && ambientVolume <= 5) setAmbientVolume(55);
    if (id) toast.success(`صدای «${soundNameOf(id)}» اضافه شد`, { duration: 1600 });
  };

  const cover =
    ambientSoundId
      ? `/images/sounds/${ambientSoundId}.jpg`
      : "/images/collections/night.jpg";

  return (
    <div className="pb-44">
      <header className="px-5 pt-8 pb-4">
        <h1 className="text-2xl font-black">میکسر صدا</h1>
        <p className="text-xs text-brand-ink-muted mt-1 leading-6">
          صدای طبیعت را زیر تلاوت اضافه کن و ولوم هرکدام را جدا تنظیم کن.
        </p>
      </header>

      {/* پریست‌های آرامش */}
      <section className="px-5" aria-label="پریست‌ها">
        <h2 className="text-sm font-bold text-brand-ink-muted mb-3">پریست‌های آماده</h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {mixerPresets.map((p) => {
            const pc =
              p.ambientSoundId
                ? `/images/sounds/${p.ambientSoundId}.jpg`
                : "/images/collections/quran-book.jpg";
            return (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                className="photo-card relative w-40 shrink-0 rounded-3xl text-right shadow-card hover:shadow-elevated transition-shadow"
              >
                <img src={pc} alt="" width={320} height={200} className="opacity-85" />
                <div className="relative p-3.5 pt-16 min-h-[128px] flex flex-col justify-end">
                  {p.premium && (
                    <span className="absolute top-3 left-3 glass w-7 h-7 rounded-full flex items-center justify-center text-[#E2C288]">
                      <Crown className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <div className="text-[13px] font-bold text-white">{p.name}</div>
                  <div className="text-[10px] text-white/70 mt-1 leading-4">
                    {p.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* پنل میکسر — الگوی Quranify */}
      <section className="px-5 mt-6" aria-label="میکسر صداها">
        <div className="glass-strong rounded-3xl p-5 shadow-float">
          {/* اسلایدر تلاوت */}
          <HSlider
            value={volume}
            onChange={setVolume}
            active={isPlaying}
            label="ولوم تلاوت"
            icon={<Mic className="w-5 h-5" />}
            suffix={<span>{toPersianDigits(volume)}</span>}
          />

          {/* اسلایدر صدای طبیعت */}
          <div className="mt-4">
            <HSlider
              value={ambientSoundId ? ambientVolume : 0}
              onChange={setAmbientVolume}
              active={!!ambientSoundId}
              label="ولوم صدای طبیعت"
              icon={<AudioWaveform className="w-5 h-5" />}
              suffix={<span>{toPersianDigits(ambientSoundId ? ambientVolume : 0)}</span>}
            />
          </div>

          {/* وضعیت صدا فعال */}
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className={cn("font-semibold", ambientSoundId ? "text-[#E2C288]" : "text-white/40")}>
              {ambientSoundId ? `در حال پخش: ${soundNameOf(ambientSoundId)}` : "صدای طبیعت خاموش است"}
            </span>
            <span className="text-white/40">{reciters.find((r) => r.id === reciterId)?.name}</span>
          </div>

          {/* ردیف آیکون‌ها — هم‌تراز Quranify */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between gap-1.5">
              {SOUND_CHIPS.map(({ id, icon: Icon, label }) => {
                const active = ambientSoundId === id;
                return (
                  <button
                    key={label}
                    onClick={() => pickSound(id)}
                    aria-pressed={active}
                    aria-label={label}
                    className={cn(
                      "flex flex-col items-center gap-1.5 flex-1 min-w-0 py-2 rounded-2xl transition-all active:scale-95",
                      active
                        ? "bg-[#C9A45C] text-[#14100A] shadow-[0_2px_16px_rgba(201,164,92,0.4)]"
                        : "text-white/55 hover:bg-white/8 hover:text-white/80"
                    )}
                  >
                    <Icon className="w-[22px] h-[22px]" strokeWidth={active ? 2.2 : 1.8} />
                    <span className={cn("text-[10px] font-bold", !active && "opacity-80")}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ویژوالایزر ظریف */}
          <div className="mt-4 flex items-end justify-center gap-1 h-6" aria-hidden>
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                className={cn("w-1.5 rounded-full origin-bottom", isPlaying && "animate-pulse")}
                style={{
                  height: isPlaying ? `${6 + ((i * 29) % 16)}px` : "3px",
                  background: i % 4 === 0 ? "#E2C288" : "#2E9B7F",
                  opacity: isPlaying ? 0.55 + ((i % 4) * 0.1) : 0.22,
                  animationDelay: `${(i % 5) * 0.15}s`,
                  animationDuration: "1.5s",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* کنترل پخش + تایمر خواب */}
      <section className="px-5 mt-6" aria-label="پخش و تایمر">
        <div className="rounded-3xl bg-gradient-to-l from-[#14231F] via-[#1D352E] to-[#31594D] text-[#F6F5F1] p-5 shadow-card">
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              aria-label={isPlaying ? "توقف" : "پخش"}
              className="w-14 h-14 rounded-full bg-[#C9A45C] text-[#101513] flex items-center justify-center shadow-glow active:scale-95 transition-transform shrink-0"
            >
              {isPlaying ? (
                <PauseGlyph className="w-6 h-6" />
              ) : (
                <PlayGlyph className="w-6 h-6" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold truncate">
                {surahs.find((s) => s.id === surahId)?.arabicName} · آیه {toPersianDigits(ayah)}
              </div>
              <div className="text-[11px] text-[#9DB8AC] truncate">
                {reciters.find((r) => r.id === reciterId)?.name}
              </div>
            </div>
            <button
              onClick={() => setExpanded(true)}
              className="text-[11px] font-bold text-[#C9A45C] border border-[#C9A45C]/40 rounded-full px-4 h-9"
            >
              پلیر
            </button>
          </div>

          {/* تایمر خواب */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 mb-3 text-[#9DB8AC] text-xs font-bold">
              <Moon className="w-4 h-4" />
              تایمر خواب — محو تدریجی در پایان
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[15, 30, 45, 60].map((m) => {
                const active = sleepTimer.minutes === m;
                return (
                  <button
                    key={m}
                    onClick={() => {
                      startSleepTimer(m);
                      toast.success(`تایمر ${toPersianDigits(m)} دقیقه‌ای فعال شد`);
                    }}
                    className={cn(
                      "h-10 rounded-xl text-xs font-black tabular-nums border transition-all",
                      active
                        ? "border-[#C9A45C] bg-[#C9A45C]/20 text-[#C9A45C]"
                        : "border-white/15 text-[#9DB8AC] hover:bg-white/10"
                    )}
                  >
                    {toPersianDigits(m)}′
                  </button>
                );
              })}
              <button
                onClick={cancelSleepTimer}
                disabled={!sleepTimer.minutes}
                className="h-10 rounded-xl text-[11px] font-bold border border-white/15 text-[#9DB8AC] hover:bg-white/10 disabled:opacity-40"
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
