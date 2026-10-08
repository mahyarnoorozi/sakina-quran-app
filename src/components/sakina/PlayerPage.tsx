"use client";

import { useState } from "react";
import { usePlayerStore } from "@/store/player";
import { reciters, natureSounds } from "@/data/audio";
import { surahs } from "@/data/quran";
import { audioEngine } from "@/lib/audio-engine";
import { cn } from "@/lib/utils";
import {
  Play, Pause, SkipBack, SkipForward, Repeat, Heart,
  ChevronLeft, ListMusic, Clock, Sliders, X, ChevronDown,
  Volume2, BookOpen,
} from "lucide-react";
import { toast } from "sonner";

export function PlayerPage({ onBack }: { onBack: () => void }) {
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
    ambientSoundId,
    backgroundSoundId,
    ambientEnabled,
    backgroundEnabled,
    ambientVolume,
    backgroundVolume,
    reciterVolume,
    setMixerOpen,
    toggleFavorite,
    isFavorite,
    setReciterVolume,
    setAmbientVolume,
    setBackgroundVolume,
  } = usePlayerStore();

  const [speed, setSpeed] = useState(1.0);
  const [repeatAyah, setRepeatAyah] = useState(false);
  const [showMixerPanel, setShowMixerPanel] = useState(false);

  const surah = currentSurahId ? surahs.find((s) => s.id === currentSurahId) : null;
  const reciter = reciters.find((r) => r.id === (currentReciterId || defaultReciterId)) || reciters[0];
  const ambientSound = natureSounds.find((s) => s.id === ambientSoundId);
  const bgSound = natureSounds.find((s) => s.id === backgroundSoundId);

  if (!surah) {
    return (
      <div className="max-w-md mx-auto px-5 pt-20 text-center">
        <p className="text-muted-foreground">هنوز سوره‌ای انتخاب نشده</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 glass rounded-xl">بازگشت</button>
      </div>
    );
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
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

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
  const nextSpeed = () => {
    const idx = speedOptions.indexOf(speed);
    const next = speedOptions[(idx + 1) % speedOptions.length];
    setSpeed(next);
    toast.success(`سرعت: ${next}×`);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col" dir="rtl">
      {/* Background - عکس قاری blurred */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src={reciter.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "blur(60px) brightness(0.3) saturate(1.4)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,14,11,0.7) 0%, rgba(10,14,11,0.9) 60%, var(--bg) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full max-w-md mx-auto w-full">
        {/* Top bar */}
        <div className="px-5 pt-6 pb-2 flex justify-between items-center">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-transform active:scale-90"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(184,148,90,0.25)",
              color: "var(--cream, #F5F2EA)",
            }}
          >
            <ChevronDown className="w-5 h-5" />
          </button>
          <div className="text-center">
            <div
              className="text-[10px] tracking-[2px] uppercase font-bold"
              style={{ color: "var(--muted, #A8A29A)" }}
            >
              در حال پخش
            </div>
            <div className="text-xs font-bold" style={{ color: "var(--cream, #F5F2EA)" }}>
              سوره {surah.persianName}
            </div>
          </div>
          <button
            onClick={() => setMixerOpen(true)}
            className="w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-transform active:scale-90"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(184,148,90,0.25)",
              color: "var(--cream, #F5F2EA)",
            }}
          >
            <ListMusic className="w-4 h-4" />
          </button>
        </div>

        {/* عکس قاری - circular بزرگ با glow */}
        <div className="py-6 flex justify-center flex-1 items-center">
          <div className="relative">
            <div
              className="w-[220px] h-[220px] rounded-full overflow-hidden border-4 transition-all"
              style={{
                width: "min(220px, 56vw)",
                height: "min(220px, 56vw)",
                borderColor: "var(--bg, #0A0E0B)",
                boxShadow: isPlaying
                  ? "0 20px 60px rgba(184,148,90,0.45), 0 0 80px rgba(184,148,90,0.25)"
                  : "0 20px 40px rgba(0,0,0,0.5)",
              }}
            >
              <img
                src={reciter.image}
                alt={reciter.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* gold ring */}
            <div
              className="absolute inset-[-8px] rounded-full border"
              style={{
                borderColor: isPlaying ? "rgba(184,148,90,0.5)" : "rgba(184,148,90,0.2)",
              }}
            />
            {/* pulse rings */}
            {isPlaying && (
              <>
                <div
                  className="absolute inset-[-16px] rounded-full border animate-ping"
                  style={{ borderColor: "rgba(184,148,90,0.3)", animationDuration: "3s" }}
                />
                <div
                  className="absolute inset-[-24px] rounded-full border animate-ping"
                  style={{ borderColor: "rgba(184,148,90,0.15)", animationDuration: "4s", animationDelay: "0.5s" }}
                />
              </>
            )}
          </div>
        </div>

        {/* Now playing */}
        <div className="px-6 pb-3 text-center">
          <div className="text-2xl font-extrabold mb-1 tracking-tight" style={{ color: "var(--cream, #F5F2EA)" }}>
            آیه {currentVerse}
          </div>
          <div
            className="text-sm flex items-center justify-center gap-2 font-medium"
            style={{ color: "var(--gold, #B8945A)" }}
          >
            <span
              className={cn("w-1.5 h-1.5 rounded-full", isPlaying && "animate-pulse-soft")}
              style={{ background: "var(--gold, #B8945A)" }}
            />
            {reciter.name}
          </div>
          <div className="text-[11px] mt-1" style={{ color: "var(--muted, #A8A29A)" }}>
            {reciter.style} • {reciter.nationality}
          </div>
        </div>

        {/* صداهای فعال */}
        {(ambientEnabled || backgroundEnabled) && (
          <div className="px-4 pb-3">
            <div className="flex flex-wrap justify-center gap-2">
              {ambientEnabled && ambientSound && (
                <button
                  onClick={() => setShowMixerPanel(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-medium transition-transform active:scale-95"
                  style={{
                    background: "rgba(184,148,90,0.15)",
                    border: "1px solid rgba(184,148,90,0.4)",
                    color: "var(--gold, #B8945A)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: ambientSound.color }} />
                  {ambientSound.name}
                  <div
                    className="w-8 h-[2px] rounded-full overflow-hidden"
                    style={{ background: "rgba(184,148,90,0.3)" }}
                  >
                    <div
                      className="h-full"
                      style={{ width: `${ambientVolume}%`, background: "var(--gold, #B8945A)" }}
                    />
                  </div>
                </button>
              )}
              {backgroundEnabled && bgSound && (
                <button
                  onClick={() => setShowMixerPanel(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-medium transition-transform active:scale-95"
                  style={{
                    background: "rgba(184,148,90,0.15)",
                    border: "1px solid rgba(184,148,90,0.4)",
                    color: "var(--gold, #B8945A)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: bgSound.color }} />
                  {bgSound.name}
                  <div
                    className="w-8 h-[2px] rounded-full overflow-hidden"
                    style={{ background: "rgba(184,148,90,0.3)" }}
                  >
                    <div
                      className="h-full"
                      style={{ width: `${backgroundVolume}%`, background: "var(--gold, #B8945A)" }}
                    />
                  </div>
                </button>
              )}
              <button
                onClick={() => setShowMixerPanel(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full backdrop-blur-md text-xs"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "var(--cream-2, #D8D2C4)",
                }}
              >
                <Sliders className="w-3 h-3" />
                میکسر
              </button>
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="px-6 pb-3">
          <div
            className="h-1.5 rounded-full overflow-hidden w-full"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <div
              className="h-full rounded-full relative transition-all"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #A8843F, #D4B274)",
              }}
            >
              <div
                className="absolute -left-1.5 -top-1.5 w-4 h-4 rounded-full shadow-lg"
                style={{
                  background: "#D4B274",
                  border: "2px solid var(--bg, #0A0E0B)",
                  boxShadow: "0 0 12px rgba(212,178,116,0.6)",
                }}
              />
            </div>
          </div>
          <div
            className="flex justify-between mt-2.5 text-[10px] font-mono font-medium tabular-nums"
            style={{ color: "var(--muted, #A8A29A)" }}
          >
            <span>{formatTime(currentTime)}</span>
            <span style={{ color: "var(--gold, #B8945A)" }}>
              {formatTime(Math.max(0, (duration || 180) - currentTime))} باقی‌مانده
            </span>
            <span>{formatTime(duration || 180)}</span>
          </div>
        </div>

        {/* Main controls */}
        <div className="px-6 pb-4 flex items-center justify-between">
          <button
            onClick={() => {
              setRepeatAyah(!repeatAyah);
              toast.success(repeatAyah ? "تکرار خاموش" : "تکرار روشن");
            }}
            className="w-11 h-11 flex items-center justify-center transition-transform active:scale-90"
            style={{
              color: repeatAyah ? "var(--gold, #B8945A)" : "var(--cream-2, #D8D2C4)",
            }}
          >
            <Repeat className="w-5 h-5" fill={repeatAyah ? "currentColor" : "none"} />
          </button>

          <button
            onClick={handlePrev}
            className="w-12 h-12 flex items-center justify-center transition-transform active:scale-90"
            style={{ color: "var(--cream, #F5F2EA)" }}
          >
            <SkipBack className="w-6 h-6" fill="currentColor" />
          </button>

          <button
            onClick={handlePlayPause}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg, #D4B274 0%, #A8843F 100%)",
              boxShadow:
                "0 8px 24px rgba(184,148,90,0.4), 0 4px 12px rgba(184,148,90,0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
            }}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7" fill="currentColor" strokeWidth={2.5} style={{ color: "#0A0E0B" }} />
            ) : (
              <Play className="w-7 h-7 ml-[-2px]" fill="currentColor" strokeWidth={2.5} style={{ color: "#0A0E0B" }} />
            )}
          </button>

          <button
            onClick={handleNext}
            className="w-12 h-12 flex items-center justify-center transition-transform active:scale-90"
            style={{ color: "var(--cream, #F5F2EA)" }}
          >
            <SkipForward className="w-6 h-6" fill="currentColor" />
          </button>

          <button
            onClick={() => {
              toggleFavorite(surah.id, currentVerse);
              toast.success("به علاقه‌مندی اضافه شد");
            }}
            className="w-11 h-11 flex items-center justify-center transition-transform active:scale-90"
            style={{
              color: isFavorite(surah.id, currentVerse)
                ? "var(--gold, #B8945A)"
                : "var(--cream-2, #D8D2C4)",
            }}
          >
            <Heart
              className="w-5 h-5"
              fill={isFavorite(surah.id, currentVerse) ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Bottom controls */}
        <div className="px-4 pb-8 flex gap-2 justify-center">
          <button
            onClick={nextSpeed}
            className="px-3.5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-transform active:scale-95"
            style={{
              background: "rgba(184,148,90,0.15)",
              border: "1px solid rgba(184,148,90,0.4)",
              color: "var(--gold, #B8945A)",
            }}
          >
            <Clock className="w-3 h-3" />
            {speed}×
          </button>

          <button
            onClick={() => setShowMixerPanel(true)}
            className="px-3.5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-medium backdrop-blur-md transition-transform active:scale-95"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--cream-2, #D8D2C4)",
            }}
          >
            <Sliders className="w-3 h-3" />
            میکسر صدا
          </button>

          <button
            onClick={onBack}
            className="px-3.5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-medium backdrop-blur-md transition-transform active:scale-95"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--cream-2, #D8D2C4)",
            }}
          >
            <BookOpen className="w-3 h-3" />
            متن سوره
          </button>
        </div>
      </div>

      {/* پنل میکسر شناور - glassmorphism */}
      {showMixerPanel && (
        <div
          className="absolute inset-0 z-20 flex items-end"
          onClick={() => setShowMixerPanel(false)}
        >
          <div
            className="w-full max-w-md mx-auto rounded-t-3xl p-5 animate-slide-up backdrop-blur-2xl"
            style={{
              background: "rgba(20, 24, 20, 0.85)",
              border: "1px solid rgba(184,148,90,0.2)",
              borderTop: "1px solid rgba(184,148,90,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: "rgba(255,255,255,0.2)" }} />
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white text-base">میکسر صدا</h3>
              <button
                onClick={() => setShowMixerPanel(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>

            {/* اسلایدر تلاوت */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">تلاوت</span>
                </div>
                <span className="text-xs text-amber-400 font-mono">{reciterVolume}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={reciterVolume}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setReciterVolume(v);
                  audioEngine.setRecitationVolume(v);
                }}
                className="mixer-slider w-full"
                style={{ "--value": `${reciterVolume}%` } as React.CSSProperties}
              />
            </div>

            {/* اسلایدر صدای محیط */}
            {ambientEnabled && ambientSound && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: ambientSound.color }} />
                    <span className="text-xs font-bold text-white">{ambientSound.name}</span>
                  </div>
                  <span className="text-xs text-amber-400 font-mono">{ambientVolume}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={ambientVolume}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setAmbientVolume(v);
                    audioEngine.setAmbientVolume(v);
                  }}
                  className="mixer-slider w-full"
                  style={{ "--value": `${ambientVolume}%` } as React.CSSProperties}
                />
              </div>
            )}

            {/* اسلایدر صدای زمینه */}
            {backgroundEnabled && bgSound && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: bgSound.color }} />
                    <span className="text-xs font-bold text-white">{bgSound.name}</span>
                  </div>
                  <span className="text-xs text-amber-400 font-mono">{backgroundVolume}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={backgroundVolume}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setBackgroundVolume(v);
                    audioEngine.setBackgroundVolume(v);
                  }}
                  className="mixer-slider w-full"
                  style={{ "--value": `${backgroundVolume}%` } as React.CSSProperties}
                />
              </div>
            )}

            {/* دکمه افزودن صدا */}
            <button
              onClick={() => {
                setShowMixerPanel(false);
                setMixerOpen(true);
              }}
              className="w-full py-3 rounded-2xl text-xs font-bold text-amber-400"
              style={{
                background: "rgba(184,148,90,0.15)",
                border: "1px solid rgba(184,148,90,0.4)",
              }}
            >
              + افزودن صدای طبیعت
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
