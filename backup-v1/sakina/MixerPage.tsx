"use client";

import { useState } from "react";
import { usePlayerStore } from "@/store/player";
import { reciters, natureSounds, mixerPresets } from "@/data/audio";
import { surahs } from "@/data/quran";
import { audioEngine } from "@/lib/audio-engine";
import { cn } from "@/lib/utils";
import { Play, Pause, Heart, Save, Moon, Sparkles, X, ChevronLeft, Sliders, Disc3, Cloud, Wind, Flame } from "lucide-react";
import { toast } from "sonner";
import { SakinaLogo } from "@/components/sakina/Logo";

export function MixerPage({
  onOpenSurah,
}: {
  onOpenSurah: (id: number) => void;
}) {
  const {
    isPlaying,
    currentSurahId,
    currentReciterId,
    defaultReciterId,
    setDefaultReciter,
    ambientSoundId,
    backgroundSoundId,
    reciterVolume,
    ambientVolume,
    backgroundVolume,
    ambientEnabled,
    backgroundEnabled,
    setAmbientSound,
    setBackgroundSound,
    setReciterVolume,
    setAmbientVolume,
    setBackgroundVolume,
    setAmbientEnabled,
    setBackgroundEnabled,
    applyPreset,
    saveCurrentMix,
    savedMixes,
    setSleepTimer,
    sleepTimerMinutes,
    sleepTimerActive,
    play,
    pause,
    resume,
    currentVerse,
  } = usePlayerStore();

  const [showSoundPicker, setShowSoundPicker] = useState<"ambient" | "background" | null>(null);
  const [showSurahPicker, setShowSurahPicker] = useState(false);
  const [showReciterPicker, setShowReciterPicker] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showSleepTimer, setShowSleepTimer] = useState(false);
  const [mixName, setMixName] = useState("");

  const ambientSound = natureSounds.find((s) => s.id === ambientSoundId);
  const bgSound = natureSounds.find((s) => s.id === backgroundSoundId);
  const currentSurah = currentSurahId ? surahs.find((s) => s.id === currentSurahId) : null;
  const currentReciter = reciters.find((r) => r.id === (currentReciterId || defaultReciterId)) || reciters[0];

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
      audioEngine.pauseAll();
    } else {
      if (!currentSurahId) {
        play(1, currentReciterId || defaultReciterId);
        setTimeout(() => {
          if (ambientEnabled && ambientSoundId) audioEngine.playAmbient(ambientSoundId, ambientVolume);
          if (backgroundEnabled && backgroundSoundId) audioEngine.playBackground(backgroundSoundId, backgroundVolume);
        }, 300);
      } else {
        resume();
        audioEngine.resumeAll();
      }
    }
  };

  const handleAmbientToggle = (enabled: boolean) => {
    setAmbientEnabled(enabled);
    if (enabled && ambientSoundId) {
      audioEngine.playAmbient(ambientSoundId, ambientVolume);
      toast.success(`«${ambientSound?.name}» فعال شد`);
    } else {
      audioEngine.stopAmbient();
    }
  };

  const handleBackgroundToggle = (enabled: boolean) => {
    setBackgroundEnabled(enabled);
    if (enabled && backgroundSoundId) {
      audioEngine.playBackground(backgroundSoundId, backgroundVolume);
      toast.success(`«${bgSound?.name}» فعال شد`);
    } else {
      audioEngine.stopBackground();
    }
  };

  const handlePreset = (presetId: string) => {
    const preset = mixerPresets.find((p) => p.id === presetId);
    if (!preset) return;
    applyPreset(preset);
    play(preset.surahId, preset.reciterId);
    setTimeout(() => {
      audioEngine.playAmbient(preset.ambientSoundId, preset.ambientVolume);
      audioEngine.playBackground(preset.backgroundSoundId, preset.backgroundVolume);
    }, 300);
    toast.success(`پریست «${preset.name}» اعمال شد`);
  };

  const handleSaveMix = () => {
    if (!mixName.trim()) {
      toast.error("نام ترکیب را وارد کنید");
      return;
    }
    saveCurrentMix(mixName.trim());
    setMixName("");
    setShowSaveDialog(false);
    toast.success("ترکیب ذخیره شد");
  };

  const handleAmbienceOnly = () => {
    if (!ambientEnabled && !backgroundEnabled) {
      toast.info("ابتدا یک صدای محیط یا زمینه فعال کنید");
      return;
    }
    pause();
    audioEngine.stopRecitation();
    if (ambientEnabled && ambientSoundId) audioEngine.playAmbient(ambientSoundId, ambientVolume);
    if (backgroundEnabled && backgroundSoundId) audioEngine.playBackground(backgroundSoundId, backgroundVolume);
    toast.success("حالت آرامش فقط فعال شد");
  };

  const sleepOptions = [0, 10, 20, 30, 45, 60];

  return (
    <div className="max-w-md mx-auto px-5 pt-10 pb-6">
      {/* هدر */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">میکسر</h1>
          <p className="text-sm text-muted-foreground mt-1">ترکیب صداهای آرامش‌بخش</p>
        </div>
        <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-md">
          <SakinaLogo size={44} className="w-full h-full" />
        </div>
      </header>

      {/* کارت در حال پخش - hero card */}
      <div className="relative rounded-3xl p-6 mb-5 overflow-hidden shadow-2xl shine"
        style={{ background: "linear-gradient(135deg, #062418 0%, #0B3D2E 50%, #14785B 100%)" }}
      >
        <div className="absolute inset-0 opacity-50" style={{
          background: "radial-gradient(at 20% 20%, rgba(184, 148, 90, 0.4) 0px, transparent 50%), radial-gradient(at 80% 80%, rgba(45, 161, 127, 0.4) 0px, transparent 50%)"
        }} />

        <div className="relative">
          <div className="flex items-center justify-between mb-5">
            <span className="text-[10px] text-amber-200 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span className={cn(
                "w-1.5 h-1.5 rounded-full",
                isPlaying ? "bg-amber-300 animate-pulse-soft" : "bg-white/30"
              )} />
              {isPlaying ? "در حال پخش" : "آماده"}
            </span>
            {isPlaying && (
              <div className="wave-bars text-amber-200 scale-75">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowSurahPicker(true)}
            className="block text-right w-full mb-3"
          >
            <p className="font-quran text-3xl text-white leading-tight mb-1" dir="rtl">
              {currentSurah ? currentSurah.arabicName : "انتخاب سوره"}
            </p>
            <p className="text-xs text-white/60">
              {currentSurah ? `${currentSurah.persianName} • آیه ${currentVerse}` : "برای شروع یک سوره انتخاب کنید"}
            </p>
          </button>

          <button
            onClick={() => setShowReciterPicker(true)}
            className="inline-flex items-center gap-2 text-[11px] text-amber-200 font-medium bg-white/10 hover:bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full transition-colors mb-5 border border-white/10"
          >
            {currentReciter && (
              <img src={currentReciter.image} alt="" className="w-5 h-5 rounded-full object-cover" />
            )}
            {currentReciter?.name}
            <ChevronLeft className="w-3 h-3" />
          </button>

          {/* chips صداهای فعال */}
          {(ambientEnabled || backgroundEnabled) && (
            <div className="flex items-center gap-1.5 flex-wrap mb-5">
              {ambientEnabled && ambientSound && (
                <span className="text-[10px] text-white/90 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                  {ambientSound.name}
                </span>
              )}
              {backgroundEnabled && bgSound && (
                <span className="text-[10px] text-white/90 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                  {bgSound.name}
                </span>
              )}
            </div>
          )}

          {/* دکمه پخش بزرگ */}
          <button
            onClick={handlePlayPause}
            className="w-full py-4 bg-white/15 hover:bg-white/20 backdrop-blur-md rounded-2xl font-bold text-white flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] border border-white/10"
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5" fill="currentColor" />
                توقف پخش
              </>
            ) : (
              <>
                <Play className="w-5 h-5" fill="currentColor" />
                شروع پخش همزمان
              </>
            )}
          </button>
        </div>
      </div>

      {/* لایه‌های صوتی */}
      <div className="space-y-3 mb-5">
        <LayerCard
          imageUrl={currentReciter?.image}
          fallbackColor="#0B3D2E"
          title="لایه ۱: تلاوت"
          subtitle={currentReciter?.name || "انتخاب قاری"}
          volume={reciterVolume}
          onVolumeChange={(v) => { setReciterVolume(v); audioEngine.setRecitationVolume(v); }}
          onPick={() => setShowReciterPicker(true)}
          color="#0B3D2E"
          isActive={true}
          icon={<Disc3 className="w-4 h-4 text-white" />}
        />

        <LayerCard
          imageUrl={ambientSound?.image}
          fallbackColor={ambientSound?.color || "#4A6FA5"}
          title="لایه ۲: صدای محیط"
          subtitle={ambientSound?.name || "انتخاب صدا"}
          volume={ambientVolume}
          enabled={ambientEnabled}
          isActive={ambientEnabled}
          onToggle={handleAmbientToggle}
          onVolumeChange={(v) => { setAmbientVolume(v); audioEngine.setAmbientVolume(v); }}
          onPick={() => setShowSoundPicker("ambient")}
          color={ambientSound?.color || "#4A6FA5"}
          icon={<Cloud className="w-4 h-4 text-white" />}
        />

        <LayerCard
          imageUrl={bgSound?.image}
          fallbackColor={bgSound?.color || "#52B788"}
          title="لایه ۳: صدای زمینه"
          subtitle={bgSound?.name || "انتخاب صدا"}
          volume={backgroundVolume}
          enabled={backgroundEnabled}
          isActive={backgroundEnabled}
          onToggle={handleBackgroundToggle}
          onVolumeChange={(v) => { setBackgroundVolume(v); audioEngine.setBackgroundVolume(v); }}
          onPick={() => setShowSoundPicker("background")}
          color={bgSound?.color || "#52B788"}
          icon={<Wind className="w-4 h-4 text-white" />}
        />
      </div>

      {/* دکمه‌های ابزار - Bento */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <button
          onClick={() => setShowSaveDialog(true)}
          className="surface rounded-2xl py-4 flex flex-col items-center gap-1.5 hover:scale-[1.02] transition-transform active:scale-95"
        >
          <Save className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <span className="text-[10px] text-foreground font-bold">ذخیره</span>
        </button>
        <button
          onClick={() => setShowSleepTimer(!showSleepTimer)}
          className={cn(
            "rounded-2xl py-4 flex flex-col items-center gap-1.5 transition-all active:scale-95",
            sleepTimerActive ? "bg-gradient-to-br from-emerald-700 to-emerald-900 text-white shadow-lg shadow-emerald-900/30" : "surface hover:scale-[1.02]"
          )}
        >
          <Moon className={cn("w-5 h-5", sleepTimerActive ? "text-white" : "text-muted-foreground")} />
          <span className={cn("text-[10px] font-bold", sleepTimerActive ? "text-white" : "text-foreground")}>خواب</span>
        </button>
        <button
          onClick={handleAmbienceOnly}
          className="surface rounded-2xl py-4 flex flex-col items-center gap-1.5 hover:scale-[1.02] transition-transform active:scale-95"
        >
          <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <span className="text-[10px] text-foreground font-bold">آرامش</span>
        </button>
      </div>

      {/* تایمر خواب */}
      {showSleepTimer && (
        <div className="surface rounded-3xl p-4 mb-5 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Moon className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <h3 className="font-bold text-foreground text-sm">تایمر خواب</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {sleepOptions.map((m) => (
              <button
                key={m}
                onClick={() => {
                  setSleepTimer(m === 0 ? null : m);
                  if (m > 0) toast.success(`تایمر ${m} دقیقه فعال شد`);
                  else toast.success("تایمر لغو شد");
                }}
                className={cn(
                  "py-3 rounded-2xl text-sm font-bold transition-all",
                  (m === 0 && !sleepTimerActive) || sleepTimerMinutes === m
                    ? "bg-gradient-to-br from-emerald-700 to-emerald-900 text-white shadow-md shadow-emerald-900/20"
                    : "bg-muted/50 text-foreground hover:bg-muted"
                )}
              >
                {m === 0 ? "خاموش" : `${m} دقیقه`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* پریست‌های آماده */}
      <section className="mb-5">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-foreground tracking-tight">پریست‌ها</h2>
            <p className="text-xs text-muted-foreground mt-0.5">ترکیب‌های آماده و تنظیم‌شده</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {mixerPresets.map((preset) => {
            const presetReciter = reciters.find((r) => r.id === preset.reciterId);
            const presetAmbient = natureSounds.find((s) => s.id === preset.ambientSoundId);
            return (
              <button
                key={preset.id}
                onClick={() => handlePreset(preset.id)}
                className="rounded-2xl overflow-hidden surface hover:scale-[1.02] transition-transform active:scale-95 text-left"
              >
                <div className="relative h-24 overflow-hidden">
                  <img
                    src={presetAmbient?.image}
                    alt={preset.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0" style={{
                    background: `linear-gradient(135deg, ${preset.iconColor}cc 0%, ${preset.iconColor}66 100%)`
                  }} />
                  {presetReciter && (
                    <img
                      src={presetReciter.image}
                      alt={presetReciter.name}
                      className="absolute bottom-2 right-2 w-9 h-9 rounded-full object-cover border-2 border-white shadow-lg"
                    />
                  )}
                </div>
                <div className="p-3">
                  <div className="font-bold text-sm text-foreground tracking-tight">{preset.name}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{preset.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ترکیب‌های ذخیره‌شده */}
      {savedMixes.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xl font-extrabold text-foreground tracking-tight mb-4">ترکیب‌های من</h2>
          <div className="space-y-2">
            {savedMixes.map((mix) => {
              const s = surahs.find((su) => su.id === mix.surahId);
              const r = reciters.find((re) => re.id === mix.reciterId);
              const amb = natureSounds.find((n) => n.id === mix.ambientSoundId);
              return (
                <button
                  key={mix.id}
                  onClick={() => {
                    applyPreset({
                      id: mix.id,
                      name: mix.name,
                      description: "",
                      reciterId: mix.reciterId,
                      surahId: mix.surahId,
                      ambientSoundId: mix.ambientSoundId,
                      ambientVolume: mix.ambientVolume,
                      backgroundSoundId: mix.backgroundSoundId,
                      backgroundVolume: mix.backgroundVolume,
                      reciterVolume: mix.reciterVolume,
                      premium: false,
                      iconColor: "#B8945A",
                    });
                    play(mix.surahId, mix.reciterId);
                    setTimeout(() => {
                      audioEngine.playAmbient(mix.ambientSoundId, mix.ambientVolume);
                      audioEngine.playBackground(mix.backgroundSoundId, mix.backgroundVolume);
                    }, 300);
                    toast.success(`ترکیب «${mix.name}» پخش شد`);
                  }}
                  className="w-full surface rounded-2xl p-3 text-right hover:scale-[1.01] transition-transform flex items-center gap-3"
                >
                  {r && (
                    <img src={r.image} alt="" className="w-11 h-11 rounded-xl object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-foreground truncate">{mix.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">
                      {s?.persianName} • {r?.name} • {amb?.name}
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center shrink-0 shadow-md">
                    <Play className="w-4 h-4 text-white mr-0.5" fill="currentColor" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* انتخاب‌گرها */}
      {showSoundPicker && (
        <SoundPicker
          title={showSoundPicker === "ambient" ? "صدای محیط" : "صدای زمینه"}
          onClose={() => setShowSoundPicker(null)}
          onSelect={(id) => {
            if (showSoundPicker === "ambient") {
              setAmbientSound(id);
              setAmbientEnabled(true);
              audioEngine.playAmbient(id, ambientVolume);
            } else {
              setBackgroundSound(id);
              setBackgroundEnabled(true);
              audioEngine.playBackground(id, backgroundVolume);
            }
            toast.success(`«${natureSounds.find((s) => s.id === id)?.name}» فعال شد`);
            setShowSoundPicker(null);
          }}
          currentId={showSoundPicker === "ambient" ? ambientSoundId : backgroundSoundId}
        />
      )}

      {showReciterPicker && (
        <ReciterPicker
          onClose={() => setShowReciterPicker(false)}
          onSelect={(id) => {
            setDefaultReciter(id);
            setShowReciterPicker(false);
            toast.success(`قاری تغییر کرد`);
          }}
          currentId={currentReciterId || defaultReciterId}
        />
      )}

      {showSurahPicker && (
        <SurahPicker
          onClose={() => setShowSurahPicker(false)}
          onSelect={(id) => {
            play(id, currentReciterId || defaultReciterId);
            setTimeout(() => {
              if (ambientEnabled && ambientSoundId) audioEngine.playAmbient(ambientSoundId, ambientVolume);
              if (backgroundEnabled && backgroundSoundId) audioEngine.playBackground(backgroundSoundId, backgroundVolume);
            }, 300);
            setShowSurahPicker(false);
          }}
        />
      )}

      {/* دیالوگ ذخیره */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-end" onClick={() => setShowSaveDialog(false)}>
          <div className="glass-strong w-full rounded-t-3xl p-5 max-w-md mx-auto animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-foreground text-lg">ذخیره ترکیب</h3>
              <button onClick={() => setShowSaveDialog(false)} className="w-8 h-8 rounded-full hover:bg-foreground/5 flex items-center justify-center">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <input
              value={mixName}
              onChange={(e) => setMixName(e.target.value)}
              placeholder="نام ترکیب (مثلاً: شب‌های زمستانی)"
              className="w-full bg-muted/50 border border-border rounded-2xl px-4 py-3.5 mb-4 text-sm focus:outline-none focus:border-emerald-600 focus:bg-surface transition-colors"
              autoFocus
            />
            <button
              onClick={handleSaveMix}
              className="w-full py-3.5 btn-luxury text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Heart className="w-4 h-4" />
              ذخیره ترکیب
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function LayerCard({
  imageUrl,
  fallbackColor,
  title,
  subtitle,
  volume,
  enabled = true,
  isActive = true,
  onToggle,
  onVolumeChange,
  onPick,
  color,
  icon,
}: {
  imageUrl?: string;
  fallbackColor: string;
  title: string;
  subtitle: string;
  volume: number;
  enabled?: boolean;
  isActive?: boolean;
  onToggle?: (e: boolean) => void;
  onVolumeChange: (v: number) => void;
  onPick: () => void;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div className={cn(
      "surface rounded-3xl p-4 transition-all",
      !isActive && "opacity-60"
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 shadow-md">
            {imageUrl ? (
              <img src={imageUrl} alt={subtitle} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${fallbackColor}, ${fallbackColor}cc)` }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              {icon}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-foreground text-sm tracking-tight">{title}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>
          </div>
        </div>
        {onToggle && (
          <button
            onClick={() => onToggle(!enabled)}
            className={cn(
              "relative w-12 h-7 rounded-full transition-colors shrink-0",
              enabled ? "bg-gradient-to-r from-emerald-600 to-emerald-700" : "bg-muted"
            )}
            aria-label={enabled ? "خاموش" : "روشن"}
          >
            <div className={cn(
              "absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all",
              enabled ? "right-1" : "right-6"
            )} />
          </button>
        )}
      </div>

      <button
        onClick={onPick}
        disabled={!enabled && !!onToggle}
        className="w-full flex items-center justify-between p-3 bg-muted/40 hover:bg-muted rounded-2xl mb-3 text-right disabled:opacity-50 transition-colors"
      >
        <span className="text-sm text-foreground font-medium">{subtitle}</span>
        <ChevronLeft className="w-4 h-4 text-muted-foreground" />
      </button>

      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-muted-foreground font-medium">حجم صدا</span>
        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">{volume}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={volume}
        onChange={(e) => onVolumeChange(Number(e.target.value))}
        disabled={!enabled && !!onToggle}
        className="mixer-slider w-full disabled:opacity-50"
        style={{ "--value": `${volume}%` } as React.CSSProperties}
      />
    </div>
  );
}

function SoundPicker({
  title,
  onClose,
  onSelect,
  currentId,
}: {
  title: string;
  onClose: () => void;
  onSelect: (id: string) => void;
  currentId: string | null;
}) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-end" onClick={onClose}>
      <div
        className="glass-strong w-full rounded-t-3xl p-5 max-w-md mx-auto max-h-[85vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5 sticky top-0">
          <h3 className="font-bold text-foreground text-lg">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-foreground/5 flex items-center justify-center">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {natureSounds.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={cn(
                "rounded-2xl overflow-hidden border-2 transition-all text-left",
                currentId === s.id ? "border-emerald-600 shadow-lg shadow-emerald-600/20" : "border-transparent hover:border-border"
              )}
            >
              <div className="relative h-24 overflow-hidden">
                <img src={s.image} alt={s.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{
                  background: `linear-gradient(135deg, ${s.color}aa, ${s.color}55)`
                }} />
                {currentId === s.id && (
                  <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
                    <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4">
                      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-2.5">
                <div className="font-bold text-xs text-foreground truncate">{s.name}</div>
                <div className="text-[9px] text-muted-foreground line-clamp-1 mt-0.5">{s.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReciterPicker({
  onClose,
  onSelect,
  currentId,
}: {
  onClose: () => void;
  onSelect: (id: string) => void;
  currentId: string;
}) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-end" onClick={onClose}>
      <div
        className="glass-strong w-full rounded-t-3xl p-5 max-w-md mx-auto max-h-[85vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5 sticky top-0">
          <h3 className="font-bold text-foreground text-lg">انتخاب قاری</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-foreground/5 flex items-center justify-center">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {reciters.map((r) => (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              className={cn(
                "rounded-2xl overflow-hidden border-2 transition-all text-left",
                currentId === r.id ? "border-emerald-600 shadow-lg shadow-emerald-600/20" : "border-transparent hover:border-border"
              )}
            >
              <div className="relative aspect-square overflow-hidden">
                <img src={r.image} alt={r.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {currentId === r.id && (
                  <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
                    <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4">
                      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0z" />
                    </svg>
                  </div>
                )}
                <div className="absolute bottom-3 right-3 left-3">
                  <div className="font-bold text-xs text-white truncate">{r.name}</div>
                  <div className="text-[9px] text-white/70">{r.nationality}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SurahPicker({ onClose, onSelect }: { onClose: () => void; onSelect: (id: number) => void }) {
  const [query, setQuery] = useState("");
  const filtered = surahs.filter((s) =>
    !query || s.persianName.includes(query) || s.arabicName.includes(query) || String(s.id) === query
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-end" onClick={onClose}>
      <div
        className="glass-strong w-full rounded-t-3xl p-5 max-w-md mx-auto max-h-[90vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground text-lg">انتخاب سوره</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-foreground/5 flex items-center justify-center">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجوی سوره..."
          className="w-full bg-muted/50 border border-border rounded-2xl px-4 py-3 mb-3 text-sm focus:outline-none focus:border-emerald-600 focus:bg-surface"
        />
        <div className="flex-1 overflow-y-auto space-y-1">
          {filtered.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className="w-full p-3 rounded-2xl flex items-center gap-3 text-right hover:bg-muted/50 transition-colors"
            >
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-md">
                {s.id}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-foreground">سوره {s.persianName}</div>
                <div className="text-[10px] text-muted-foreground">{s.versesCount} آیه • {s.type}</div>
              </div>
              <span className="font-quran text-base text-foreground/70">{s.arabicName}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
