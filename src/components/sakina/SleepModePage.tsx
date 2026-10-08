"use client";

import { useState } from "react";
import { usePlayerStore } from "@/store/player";
import { surahs } from "@/data/quran";
import { reciters, natureSounds, mixerPresets } from "@/data/audio";
import { audioEngine } from "@/lib/audio-engine";
import { cn } from "@/lib/utils";
import {
  Play, Pause, ChevronLeft, Moon, Clock, Cloud, CloudRain,
  Shuffle, Heart, Sliders, X, Wind, Volume2,
} from "lucide-react";
import { toast } from "sonner";

const SLEEP_SURAHS = [
  { id: 67, name: "الملک", reason: "حفظ از عذاب قبر" },
  { id: 36, name: "یس", reason: "قلب قرآن" },
  { id: 55, name: "الرحمن", reason: "آرامش رحمانی" },
  { id: 2, name: "البقرة (آخر)", reason: "حفظ از شیطان" },
  { id: 112, name: "الإخلاص", reason: "توحید خالص" },
  { id: 113, name: "الفلق", reason: "پناه از شر" },
  { id: 114, name: "الناس", reason: "پناه از وسواس" },
  { id: 78, name: "النبأ", reason: "آرامش شب" },
];

export function SleepModePage({ onBack }: { onBack: () => void }) {
  const {
    play, isPlaying, currentSurahId, currentVerse, pause, resume,
    defaultReciterId, setDefaultReciter,
    ambientSoundId, setAmbientSound, ambientEnabled, setAmbientEnabled,
    ambientVolume, setAmbientVolume,
    backgroundSoundId, setBackgroundSound, backgroundEnabled, setBackgroundEnabled,
    backgroundVolume, setBackgroundVolume,
    setSleepTimer, sleepTimerActive, sleepTimerMinutes,
    setMixerOpen, toggleFavorite, isFavorite,
  } = usePlayerStore();

  const [filter, setFilter] = useState<"all" | "short" | "long">("all");
  const [selectedSounds, setSelectedSounds] = useState<string[]>(["rain-light"]);
  const [showSoundPicker, setShowSoundPicker] = useState(false);

  const reciter = reciters.find((r) => r.id === defaultReciterId) || reciters[0];

  const filteredSurahs = SLEEP_SURAHS.filter((s) => {
    if (filter === "short") return s.id >= 112;
    if (filter === "long") return s.id === 67 || s.id === 36 || s.id === 55 || s.id === 2;
    return true;
  });

  const handlePlayAll = () => {
    // پخش اولین سوره با صدای آرام + باران
    const firstSurah = filteredSurahs[0];
    if (!firstSurah) return;

    play(firstSurah.id, reciter.id);

    // فعال کردن صداهای انتخاب‌شده
    setTimeout(() => {
      if (selectedSounds.length > 0) {
        setAmbientSound(selectedSounds[0]);
        setAmbientEnabled(true);
        audioEngine.playAmbient(selectedSounds[0], ambientVolume);
      }
      if (selectedSounds.length > 1) {
        setBackgroundSound(selectedSounds[1]);
        setBackgroundEnabled(true);
        audioEngine.playBackground(selectedSounds[1], backgroundVolume);
      }
    }, 300);

    toast.success("حالت خواب فعال شد 🌙");
  };

  const handlePlaySurah = (surahId: number) => {
    if (isPlaying && currentSurahId === surahId) {
      pause();
      audioEngine.pauseAll();
    } else {
      play(surahId, reciter.id);
      setTimeout(() => {
        if (selectedSounds.length > 0) {
          setAmbientSound(selectedSounds[0]);
          setAmbientEnabled(true);
          audioEngine.playAmbient(selectedSounds[0], ambientVolume);
        }
        if (selectedSounds.length > 1) {
          setBackgroundSound(selectedSounds[1]);
          setBackgroundEnabled(true);
          audioEngine.playBackground(selectedSounds[1], backgroundVolume);
        }
      }, 300);
    }
  };

  const toggleSound = (soundId: string) => {
    if (selectedSounds.includes(soundId)) {
      const newSounds = selectedSounds.filter((s) => s !== soundId);
      setSelectedSounds(newSounds);
      // اگر صدای محیط بود، خاموش کن
      if (ambientSoundId === soundId) {
        audioEngine.stopAmbient();
        setAmbientEnabled(false);
      }
    } else {
      if (selectedSounds.length < 2) {
        setSelectedSounds([...selectedSounds, soundId]);
        // اگر در حال پخش بود، صدا رو هم فعال کن
        if (isPlaying) {
          if (selectedSounds.length === 0) {
            setAmbientSound(soundId);
            setAmbientEnabled(true);
            audioEngine.playAmbient(soundId, ambientVolume);
          } else {
            setBackgroundSound(soundId);
            setBackgroundEnabled(true);
            audioEngine.playBackground(soundId, backgroundVolume);
          }
        }
      } else {
        toast.info("حداکثر ۲ صدا می‌توانید انتخاب کنید");
      }
    }
  };

  const sleepTimerOptions = [0, 15, 30, 45, 60, 90];

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto" dir="rtl"
      style={{ background: "linear-gradient(180deg, #050407 0%, #0A0E0B 50%, #0B3D2E 100%)" }}
    >
      {/* پس‌زمینه ستاره‌ای */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-20 right-10 w-1 h-1 rounded-full bg-white animate-pulse" />
        <div className="absolute top-32 left-20 w-0.5 h-0.5 rounded-full bg-white animate-pulse" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-40 right-1/3 w-1 h-1 rounded-full bg-white animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-60 left-1/4 w-0.5 h-0.5 rounded-full bg-white animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-80 right-1/4 w-1 h-1 rounded-full bg-amber-200 animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-24 left-1/3 w-0.5 h-0.5 rounded-full bg-white animate-pulse" style={{ animationDelay: "2.5s" }} />
      </div>

      {/* محتوا */}
      <div className="relative z-10 max-w-md mx-auto w-full px-5 pt-8 pb-40">
        {/* هدر */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-transform active:scale-90"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(184,148,90,0.25)",
            }}
          >
            <ChevronLeft className="w-5 h-5 rotate-180 text-amber-100" />
          </button>
          <div className="text-center">
            <div className="text-[10px] tracking-[3px] uppercase font-bold text-amber-300/60">Sleep Mode</div>
            <div className="text-base font-bold text-amber-100">حالت خواب</div>
          </div>
          <button
            onClick={() => setMixerOpen(true)}
            className="w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-transform active:scale-90"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(184,148,90,0.25)",
            }}
          >
            <Sliders className="w-4 h-4 text-amber-100" />
          </button>
        </div>

        {/* Hero - ماه */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full mx-auto relative" style={{
              background: "radial-gradient(circle at 30% 30%, #F5F2EA, #D4B274 60%, #8A6B2E)",
              boxShadow: "0 0 60px rgba(212,178,116,0.4), 0 0 120px rgba(212,178,116,0.2)",
            }}>
              {/* حفره‌های ماه */}
              <div className="absolute top-6 left-8 w-4 h-4 rounded-full bg-amber-900/20" />
              <div className="absolute top-12 right-6 w-3 h-3 rounded-full bg-amber-900/20" />
              <div className="absolute bottom-8 left-12 w-2 h-2 rounded-full bg-amber-900/20" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-amber-100 mb-2 tracking-tight">آرامش شب</h1>
          <p className="text-sm text-amber-100/60 leading-relaxed">
            تلاوت آرام قرآن با صدای طبیعت<br />
            برای خوابی عمیق و آرامش دل
          </p>
        </div>

        {/* دکمه پخش بزرگ */}
        <button
          onClick={handlePlayAll}
          className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2.5 transition-all active:scale-95 mb-6"
          style={{
            background: "linear-gradient(135deg, #D4B274 0%, #A8843F 100%)",
            boxShadow: "0 8px 24px rgba(184,148,90,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
            color: "#050407",
          }}
        >
          <Play className="w-5 h-5" fill="currentColor" />
          شروع آرامش شب
        </button>

        {/* صداهای انتخاب‌شده */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-100/80 uppercase tracking-wider">صداهای پس‌زمینه</span>
            <button
              onClick={() => setShowSoundPicker(true)}
              className="text-xs text-amber-300 font-bold"
            >
              + افزودن
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedSounds.length === 0 && (
              <span className="text-xs text-amber-100/40">هیچ صدایی انتخاب نشده</span>
            )}
            {selectedSounds.map((soundId) => {
              const sound = natureSounds.find((s) => s.id === soundId);
              if (!sound) return null;
              return (
                <button
                  key={soundId}
                  onClick={() => toggleSound(soundId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-transform active:scale-95"
                  style={{
                    background: "rgba(184,148,90,0.15)",
                    border: "1px solid rgba(184,148,90,0.4)",
                    color: "#D4B274",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: sound.color }} />
                  {sound.name}
                  <X className="w-3 h-3" />
                </button>
              );
            })}
          </div>
        </div>

        {/* تایمر خواب */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-bold text-amber-100/80 uppercase tracking-wider">تایمر خواب</span>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {sleepTimerOptions.map((m) => (
              <button
                key={m}
                onClick={() => {
                  setSleepTimer(m === 0 ? null : m);
                  if (m > 0) toast.success(`تایمر ${m} دقیقه فعال شد`);
                  else toast.success("تایمر لغو شد");
                }}
                className={cn(
                  "py-2.5 rounded-xl text-xs font-bold transition-all",
                  (m === 0 && !sleepTimerActive) || sleepTimerMinutes === m
                    ? "text-amber-900"
                    : "text-amber-100/70 hover:text-amber-100"
                )}
                style={{
                  background: (m === 0 && !sleepTimerActive) || sleepTimerMinutes === m
                    ? "linear-gradient(135deg, #D4B274, #A8843F)"
                    : "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(184,148,90,0.2)",
                }}
              >
                {m === 0 ? "خاموش" : m}
              </button>
            ))}
          </div>
          {sleepTimerActive && (
            <p className="text-[10px] text-amber-300/70 mt-2 text-center">
              پخش پس از {sleepTimerMinutes} دقیقه متوقف می‌شود
            </p>
          )}
        </div>

        {/* فیلترها */}
        <div className="flex gap-2 mb-4">
          {[
            { id: "all" as const, label: "همه" },
            { id: "short" as const, label: "کوتاه" },
            { id: "long" as const, label: "بلند" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold transition-all",
                filter === f.id ? "text-amber-900" : "text-amber-100/70"
              )}
              style={{
                background: filter === f.id
                  ? "linear-gradient(135deg, #D4B274, #A8843F)"
                  : "rgba(255,255,255,0.06)",
                border: "1px solid rgba(184,148,90,0.2)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* لیست سوره‌ها */}
        <div className="space-y-2">
          {filteredSurahs.map((s) => {
            const surah = surahs.find((su) => su.id === s.id);
            if (!surah) return null;
            const isActive = isPlaying && currentSurahId === s.id;
            const fav = isFavorite(s.id);

            return (
              <div
                key={s.id}
                onClick={() => handlePlaySurah(s.id)}
                className={cn(
                  "rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-all",
                  isActive ? "bg-amber-500/15 border border-amber-500/40" : "bg-white/5 border border-white/5 hover:bg-white/8"
                )}
              >
                {/* شماره دایره‌ای */}
                <div className="relative w-11 h-11 shrink-0">
                  <div
                    className={cn(
                      "w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold",
                      isActive ? "bg-gradient-to-br from-amber-400 to-amber-700 text-amber-900" : "bg-white/10 text-amber-200"
                    )}
                  >
                    {isActive ? (
                      <div className="wave-bars text-amber-900 scale-75">
                        <span></span><span></span><span></span><span></span><span></span>
                      </div>
                    ) : (
                      surah.id
                    )}
                  </div>
                </div>

                {/* اطلاعات */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-quran text-base text-amber-100" dir="rtl">{surah.arabicName}</span>
                    <span className="text-xs text-amber-100/50">•</span>
                    <span className="text-xs text-amber-100/70">{surah.versesCount} آیه</span>
                  </div>
                  <div className="text-[10px] text-amber-100/50 mt-0.5">{s.reason}</div>
                </div>

                {/* علاقه‌مندی */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(s.id);
                  }}
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center shrink-0"
                >
                  <Heart className={cn("w-4 h-4", fav ? "fill-amber-400 text-amber-400" : "text-amber-100/40")} />
                </button>

                {/* پخش */}
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: isActive ? "rgba(212,178,116,0.2)" : "rgba(255,255,255,0.06)",
                  }}
                >
                  {isActive ? (
                    <Pause className="w-4 h-4 text-amber-300" fill="currentColor" />
                  ) : (
                    <Play className="w-4 h-4 text-amber-200 mr-0.5" fill="currentColor" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* توضیحات */}
        <div className="mt-6 p-4 rounded-2xl" style={{
          background: "rgba(184,148,90,0.08)",
          border: "1px solid rgba(184,148,90,0.2)",
        }}>
          <div className="flex items-start gap-2.5">
            <Moon className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-amber-100/80 leading-relaxed">
                خواندن سوره ملک هر شب، انسان را از عذاب قبر محافظت می‌کند. سوره‌های یس، Rahman و معوذتین نیز برای آرامش شبانه توصیه شده‌اند.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* انتخاب‌گر صدا */}
      {showSoundPicker && (
        <div
          className="fixed inset-0 z-[60] flex items-end"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)" }}
          onClick={() => setShowSoundPicker(false)}
        >
          <div
            className="w-full max-w-md mx-auto rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto animate-slide-up"
            style={{ background: "rgba(15,14,19,0.95)", border: "1px solid rgba(184,148,90,0.2)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-amber-100 text-base">انتخاب صدای پس‌زمینه</h3>
              <button
                onClick={() => setShowSoundPicker(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-amber-100/60" />
              </button>
            </div>
            <p className="text-[10px] text-amber-100/50 mb-4">حداکثر ۲ صدا می‌توانید انتخاب کنید</p>
            <div className="grid grid-cols-2 gap-2.5">
              {natureSounds.filter((s) => ["rain-light", "rain-heavy", "ocean-waves", "river-flow", "waterfall", "wind-soft", "forest-birds", "cricket-night", "fire-camp", "white-noise", "pink-noise", "brown-noise"].includes(s.id)).map((s) => {
                const isSelected = selectedSounds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleSound(s.id)}
                    className={cn(
                      "rounded-2xl overflow-hidden border-2 transition-all text-right",
                      isSelected ? "border-amber-500 shadow-lg shadow-amber-500/20" : "border-transparent"
                    )}
                  >
                    <div className="relative h-20 overflow-hidden">
                      <img src={s.image} alt={s.name} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{
                        background: `linear-gradient(135deg, ${s.color}aa, ${s.color}55)`
                      }} />
                      {isSelected && (
                        <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                          <svg viewBox="0 0 20 20" fill="white" className="w-3 h-3">
                            <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-2.5" style={{ background: "rgba(15,14,19,0.8)" }}>
                      <div className="font-bold text-xs text-amber-100 truncate">{s.name}</div>
                      <div className="text-[9px] text-amber-100/50 line-clamp-1">{s.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
