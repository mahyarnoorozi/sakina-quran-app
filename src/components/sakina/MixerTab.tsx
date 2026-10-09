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

/** نشانگر واقعی لایه فعال — روشن/خاموش از استور؛ با sr-only برای اسکرین‌ریدر */
function LayerDot({ on, label }: { on: boolean; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[10px] font-bold rounded-full px-2.5 py-1 border transition-colors",
        on
          ? "border-primary/50 bg-primary/10 text-primary"
          : "border-border bg-secondary/60 text-brand-ink-muted"
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          on ? "bg-primary animate-pulse" : "bg-brand-ink-muted/40"
        )}
      />
      {label}
      <span className="sr-only">{on ? "فعال" : "خاموش"}</span>
    </span>
  );
}

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
        <div className="flex gap-3 overflow-x-auto no-scrollbar fade-x pb-2">
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
                    <span className="absolute top-3 left-3 glass w-7 h-7 rounded-full flex items-center justify-center text-brand-brass">
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

          {/* وضعیت واقعی لایه‌ها — با برچسب واضح، قابل خواندن توسط اسکرین‌ریدر */}
          <div className="mt-3 flex items-center gap-2">
            <LayerDot on={isPlaying} label="تلاوت" />
            <LayerDot on={!!ambientSoundId} label="طبیعت" />
            <span className="text-[10px] text-brand-ink-muted truncate mr-auto">
              {reciters.find((r) => r.id === reciterId)?.name}
            </span>
          </div>

          {/* ردیف آیکون‌ها — هم‌تراز الگوی میکسر */}
          <div className="mt-4 pt-4 border-t border-border">
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
                        ? "gold-cta shadow-[0_2px_16px_rgba(201,164,92,0.4)]"
                        : "text-brand-ink-muted hover:bg-secondary/60 hover:text-foreground"
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
        </div>
      </section>

      {/* کنترل پخش + تایمر خواب */}
      <section className="px-5 mt-6" aria-label="پخش و تایمر">
        <div className="ds-card rounded-3xl p-5 shadow-card">
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              aria-label={isPlaying ? "توقف" : "پخش"}
              className="w-14 h-14 rounded-full gold-cta flex items-center justify-center active:scale-95 transition-transform shrink-0"
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
              <div className="text-[11px] text-brand-ink-muted truncate">
                {reciters.find((r) => r.id === reciterId)?.name}
              </div>
            </div>
            <button
              onClick={() => setExpanded(true)}
              className="text-[11px] font-bold text-brand-brass border border-brand-brass/40 rounded-full px-4 h-9"
            >
              پلیر
            </button>
          </div>

          {/* تایمر خواب */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-3 text-brand-ink-muted text-xs font-bold">
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
                        ? "border-brand-brass bg-brand-brass/15 text-brand-brass"
                        : "border-border text-brand-ink-muted hover:bg-secondary/60"
                    )}
                  >
                    {toPersianDigits(m)}′
                  </button>
                );
              })}
              <button
                onClick={cancelSleepTimer}
                disabled={!sleepTimer.minutes}
                className="h-10 rounded-xl text-[11px] font-bold border border-border text-brand-ink-muted hover:bg-secondary/60 disabled:opacity-40"
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
