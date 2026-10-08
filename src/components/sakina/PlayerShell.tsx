"use client";

import { useEffect, useState, useRef } from "react";
import { usePlayerStore } from "@/store/player";
import { surahs } from "@/data/quran";
import { reciters, natureSounds } from "@/data/audio";
import { audioEngine } from "@/lib/audio-engine";
import { cn } from "@/lib/utils";

import { Play, Pause, SkipBack, SkipForward, Sliders, ChevronUp } from "lucide-react";
import { Home, BookOpen, Sliders as MixerIcon, Library, User } from "lucide-react";

const tabs = [
  { id: "home", label: "خانه", icon: Home },
  { id: "quran", label: "قرآن", icon: BookOpen },
  { id: "mixer", label: "میکسر", icon: MixerIcon },
  { id: "library", label: "کتابخانه", icon: Library },
  { id: "profile", label: "پروفایل", icon: User },
] as const;

export type TabId = (typeof tabs)[number]["id"];

export function PlayerShell({
  activeTab,
  onTabChange,
  children,
  onOpenPlayer,
}: {
  activeTab: TabId;
  onTabChange: (t: TabId) => void;
  children: React.ReactNode;
  onOpenPlayer?: () => void;
}) {
  const {
    isPlaying,
    currentSurahId,
    currentReciterId,
    defaultReciterId,
    currentVerse,
    progress,
    currentTime,
    duration,
    pause,
    resume,
    nextVerse,
    prevVerse,
    setMixerOpen,
    mixerOpen,
    setProgress,
    incrementListening,
    checkSleepTimer,
    ambientSoundId,
    backgroundSoundId,
    ambientEnabled,
    backgroundEnabled,
    ambientVolume,
    backgroundVolume,
    reciterVolume,
  } = usePlayerStore();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setIsClient(true), 0);
    return () => clearTimeout(id);
  }, []);

  const surah = currentSurahId ? surahs.find((s) => s.id === currentSurahId) : null;
  const reciter = reciters.find((r) => r.id === currentReciterId) || reciters.find((r) => r.id === defaultReciterId) || reciters[0];
  const ambientSound = natureSounds.find((s) => s.id === ambientSoundId);
  const bgSound = natureSounds.find((s) => s.id === backgroundSoundId);

  const lastPlayState = useRef(false);
  const lastSurahId = useRef<number | null>(null);
  const lastReciterId = useRef<string>("");

  useEffect(() => {
    if (!isClient) return;

    const shouldPlay = isPlaying && currentSurahId !== null;
    const surahChanged = lastSurahId.current !== currentSurahId;
    const reciterChanged = lastReciterId.current !== currentReciterId;
    const playStateChanged = lastPlayState.current !== isPlaying;

    if (shouldPlay) {
      if (surahChanged || reciterChanged) {
        if (reciter) {
          audioEngine.playRecitation(
            reciter.everyayahId,
            currentSurahId!,
            currentVerse,
            () => {
              usePlayerStore.getState().nextVerse();
            }
          );
        }
        if (ambientEnabled && ambientSoundId) {
          audioEngine.playAmbient(ambientSoundId, ambientVolume);
        }
        if (backgroundEnabled && backgroundSoundId) {
          audioEngine.playBackground(backgroundSoundId, backgroundVolume);
        }
      } else if (playStateChanged) {
        audioEngine.resumeAll();
      }
    } else {
      if (playStateChanged && lastPlayState.current) {
        audioEngine.pauseAll();
      }
    }

    lastPlayState.current = isPlaying;
    lastSurahId.current = currentSurahId;
    lastReciterId.current = currentReciterId;
    lastVerse.current = currentVerse;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, currentSurahId, currentReciterId, isClient]);

  const lastVerse = useRef(1);

  useEffect(() => {
    if (!isPlaying || !isClient) return;
    const interval = setInterval(() => {
      const state = usePlayerStore.getState();
      const newTime = state.currentTime + 1;
      const dur = state.duration || 180;
      if (newTime >= dur) {
        state.setProgress(0, 0, dur);
      } else {
        state.setProgress((newTime / dur) * 100, newTime, dur);
      }
      state.incrementListening(1);
      state.checkSleepTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, isClient]);

  useEffect(() => {
    return () => {
      audioEngine.stopAll();
    };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
      audioEngine.pauseAll();
    } else {
      resume();
      audioEngine.resumeAll();
    }
  };

  const handleNext = () => {
    nextVerse();
    audioEngine.setAyah(currentVerse + 1);
  };

  const handlePrev = () => {
    if (currentVerse > 1) {
      prevVerse();
      audioEngine.setAyah(currentVerse - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative" dir="rtl">
      {/* پس‌زمینه mesh gradient ظریف */}
      <div
        className="fixed inset-0 pointer-events-none opacity-50"
        style={{
          background:
            "radial-gradient(at 0% 0%, rgba(184, 148, 90, 0.08) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(11, 61, 46, 0.06) 0px, transparent 50%)",
        }}
      />

      {/* محتوای اصلی */}
      <main className="flex-1 pb-40 overflow-y-auto relative z-10">{children}</main>

      {/* Mini Player — شناور، glassmorphism */}
      {isClient && surah && (
        <div className="fixed bottom-24 left-0 right-0 z-40 px-4 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto animate-slide-up">
            <div
              className="glass-strong rounded-3xl overflow-hidden cursor-pointer hover:scale-[1.01] transition-transform"
              onClick={(e) => {
                // فقط اگر روی دکمه‌ها کلیک نشده بود، صفحه پخش رو باز کن
                const target = e.target as HTMLElement;
                if (!target.closest("button")) {
                  onOpenPlayer?.();
                }
              }}
            >
              {/* Progress bar نازک */}
              <div className="h-[3px] bg-foreground/10 relative">
                <div
                  className="absolute top-0 right-0 h-full bg-gradient-to-l from-amber-600 to-amber-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center gap-3 p-3">
                {/* آواتار قاری یا آیکون */}
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 shadow-md">
                  {reciter?.image ? (
                    <img
                      src={reciter.image}
                      alt={reciter.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-transparent" />
                  {isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="wave-bars text-white scale-75">
                        <span></span><span></span><span></span><span></span><span></span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-foreground truncate">
                      {surah.persianName}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">آیه {currentVerse}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-muted-foreground truncate">{reciter?.name}</span>
                    {(ambientEnabled || backgroundEnabled) && (
                      <span className="text-[9px] text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                        +{(ambientEnabled ? 1 : 0) + (backgroundEnabled ? 1 : 0)} صدا
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] text-muted-foreground font-mono tabular-nums">
                      {formatTime(currentTime)}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-mono tabular-nums">
                      / {formatTime(duration || 180)}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <button
                  onClick={handlePrev}
                  className="w-9 h-9 rounded-full hover:bg-foreground/5 flex items-center justify-center transition-colors active:scale-90"
                  aria-label="آیه قبلی"
                >
                  <SkipForward className="w-4 h-4 text-foreground" />
                </button>

                <button
                  onClick={handlePlayPause}
                  className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-900/30 transition-all active:scale-95"
                  aria-label={isPlaying ? "توقف" : "پخش"}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" fill="currentColor" />
                  ) : (
                    <Play className="w-5 h-5 text-white mr-0.5" fill="currentColor" />
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className="w-9 h-9 rounded-full hover:bg-foreground/5 flex items-center justify-center transition-colors active:scale-90"
                  aria-label="آیه بعدی"
                >
                  <SkipBack className="w-4 h-4 text-foreground" />
                </button>

                <button
                  onClick={() => setMixerOpen(!mixerOpen)}
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90",
                    mixerOpen
                      ? "bg-amber-600 text-white shadow-md"
                      : "hover:bg-foreground/5 text-foreground"
                  )}
                  aria-label="میکسر"
                >
                  <Sliders className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenPlayer?.()}
                  className="w-9 h-9 rounded-full bg-amber-600/20 hover:bg-amber-600/30 text-amber-700 dark:text-amber-400 flex items-center justify-center transition-all active:scale-90"
                  aria-label="نمایش کامل"
                >
                  <ChevronUp className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* نوار ناوبری شناور - glassmorphism لوکس */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-4 safe-bottom pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <div className="glass-strong rounded-3xl px-2 py-2 flex items-center justify-around">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all min-w-[60px]",
                    isActive ? "text-white" : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-label={tab.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl shadow-md shadow-emerald-900/30" />
                  )}
                  <Icon className={cn("w-5 h-5 transition-transform relative", isActive && "scale-110")} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={cn("text-[10px] font-semibold relative", isActive && "font-bold")}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
