"use client";

import { useState } from "react";
import { usePlayerStore } from "@/store/player";
import { reciters, natureSounds, mixerPresets } from "@/data/audio";
import { surahs } from "@/data/quran";
import { audioEngine } from "@/lib/audio-engine";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Heart, Timer, Save, X, Play, Pause, Moon, Clock, Volume2, Sliders, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function MixerSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const {
    ambientSoundId,
    backgroundSoundId,
    reciterVolume,
    ambientVolume,
    backgroundVolume,
    ambientEnabled,
    backgroundEnabled,
    isPlaying,
    setAmbientSound,
    setBackgroundSound,
    setReciterVolume,
    setAmbientVolume,
    setBackgroundVolume,
    setAmbientEnabled,
    setBackgroundEnabled,
    applyPreset,
    saveCurrentMix,
    setSleepTimer,
    sleepTimerMinutes,
    sleepTimerActive,
    pause,
    resume,
    play,
    currentSurahId,
    currentReciterId,
    defaultReciterId,
    setDefaultReciter,
  } = usePlayerStore();

  const [showPresets, setShowPresets] = useState(true);
  const [showSleepTimer, setShowSleepTimer] = useState(false);
  const [mixName, setMixName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const ambientSound = natureSounds.find((s) => s.id === ambientSoundId);
  const bgSound = natureSounds.find((s) => s.id === backgroundSoundId);
  const currentReciter = reciters.find((r) => r.id === (currentReciterId || defaultReciterId)) || reciters[0];

  const handleAmbientToggle = (enabled: boolean) => {
    setAmbientEnabled(enabled);
    if (enabled && ambientSoundId) {
      audioEngine.playAmbient(ambientSoundId, ambientVolume);
    } else {
      audioEngine.stopAmbient();
    }
  };

  const handleBackgroundToggle = (enabled: boolean) => {
    setBackgroundEnabled(enabled);
    if (enabled && backgroundSoundId) {
      audioEngine.playBackground(backgroundSoundId, backgroundVolume);
    } else {
      audioEngine.stopBackground();
    }
  };

  const handleAmbientChange = (id: string) => {
    setAmbientSound(id);
    setAmbientEnabled(true);
    audioEngine.playAmbient(id, ambientVolume);
  };

  const handleBackgroundChange = (id: string) => {
    setBackgroundSound(id);
    setBackgroundEnabled(true);
    audioEngine.playBackground(id, backgroundVolume);
  };

  const handleReciterVol = (v: number) => {
    setReciterVolume(v);
    audioEngine.setRecitationVolume(v);
  };

  const handleAmbientVol = (v: number) => {
    setAmbientVolume(v);
    audioEngine.setAmbientVolume(v);
  };

  const handleBgVol = (v: number) => {
    setBackgroundVolume(v);
    audioEngine.setBackgroundVolume(v);
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
    toast.success("ترکیب شما ذخیره شد");
  };

  const sleepTimerOptions = [
    { label: "خاموش", value: 0 },
    { label: "۱۰ دقیقه", value: 10 },
    { label: "۲۰ دقیقه", value: 20 },
    { label: "۳۰ دقیقه", value: 30 },
    { label: "۴۵ دقیقه", value: 45 },
    { label: "۶۰ دقیقه", value: 60 },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[92vh] max-h-[900px] p-0 flex flex-col bg-background border-0 rounded-t-3xl"
      >
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center shadow-lg shadow-primary/20">
                <Sliders className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <SheetTitle className="text-lg font-bold text-foreground">
                  میکسر صدا
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  صداهای طبیعت رو با تلاوت ترکیب کن
                </SheetDescription>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSaveDialog(true)}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="ذخیره ترکیب"
              >
                <Save className="w-5 h-5 text-primary" />
              </button>
              <button
                onClick={() => setShowSleepTimer(!showSleepTimer)}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  sleepTimerActive ? "bg-primary/10" : "hover:bg-muted"
                )}
                aria-label="تایمر خواب"
              >
                <Timer className={cn("w-5 h-5", sleepTimerActive ? "text-primary" : "text-muted-foreground")} />
              </button>
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="بستن"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* لایه ۱: تلاوت */}
          <div className="bg-card border border-border/60 rounded-3xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0">
                  <img src={currentReciter.image} alt={currentReciter.name} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">لایه ۱: تلاوت</h3>
                  <p className="text-[10px] text-muted-foreground">صدای قاری</p>
                </div>
              </div>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">اصلی</span>
            </div>

            <Label className="text-[11px] text-muted-foreground mb-2 block">قاری</Label>
            <Select
              value={currentReciterId || defaultReciterId}
              onValueChange={(v) => setDefaultReciter(v)}
            >
              <SelectTrigger className="mb-4 bg-background h-10">
                <SelectValue placeholder="انتخاب قاری" />
              </SelectTrigger>
              <SelectContent>
                {reciters.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    <div className="flex items-center gap-2">
                      <img src={r.image} alt="" className="w-5 h-5 rounded-full object-cover" />
                      <span>{r.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center justify-between mb-2">
              <Label className="text-[11px] text-muted-foreground">حجم صدا</Label>
              <span className="text-xs font-mono text-primary font-bold">{reciterVolume}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={reciterVolume}
              onChange={(e) => handleReciterVol(Number(e.target.value))}
              className="mixer-slider w-full"
              style={{ "--value": `${reciterVolume}%` } as React.CSSProperties}
            />
          </div>

          {/* لایه ۲: صدای محیط */}
          <div className={cn(
            "bg-card border rounded-3xl p-4 shadow-sm transition-opacity",
            ambientEnabled ? "border-border/60" : "border-border/30 opacity-70"
          )}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0">
                  {ambientSound ? (
                    <img src={ambientSound.image} alt={ambientSound.name} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-muted" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">لایه ۲: صدای محیط</h3>
                  <p className="text-[10px] text-muted-foreground">
                    {ambientSound ? ambientSound.name : "غیرفعال"}
                  </p>
                </div>
              </div>
              <Switch checked={ambientEnabled} onCheckedChange={handleAmbientToggle} />
            </div>

            {ambientEnabled && (
              <>
                <Label className="text-[11px] text-muted-foreground mb-2 block">نوع صدا</Label>
                <Select value={ambientSoundId || ""} onValueChange={handleAmbientChange}>
                  <SelectTrigger className="mb-4 bg-background h-10">
                    <SelectValue placeholder="انتخاب صدا" />
                  </SelectTrigger>
                  <SelectContent>
                    {natureSounds.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        <div className="flex items-center gap-2">
                          <img src={s.image} alt="" className="w-5 h-5 rounded object-cover" />
                          <span>{s.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center justify-between mb-2">
                  <Label className="text-[11px] text-muted-foreground">حجم صدا</Label>
                  <span className="text-xs font-mono text-primary font-bold">{ambientVolume}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={ambientVolume}
                  onChange={(e) => handleAmbientVol(Number(e.target.value))}
                  className="mixer-slider w-full"
                  style={{ "--value": `${ambientVolume}%` } as React.CSSProperties}
                />
              </>
            )}
          </div>

          {/* لایه ۳: صدای زمینه */}
          <div className={cn(
            "bg-card border rounded-3xl p-4 shadow-sm transition-opacity",
            backgroundEnabled ? "border-border/60" : "border-border/30 opacity-70"
          )}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0">
                  {bgSound ? (
                    <img src={bgSound.image} alt={bgSound.name} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-muted" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">لایه ۳: صدای زمینه</h3>
                  <p className="text-[10px] text-muted-foreground">
                    {bgSound ? bgSound.name : "غیرفعال"}
                  </p>
                </div>
              </div>
              <Switch checked={backgroundEnabled} onCheckedChange={handleBackgroundToggle} />
            </div>

            {backgroundEnabled && (
              <>
                <Label className="text-[11px] text-muted-foreground mb-2 block">نوع صدا</Label>
                <Select value={backgroundSoundId || ""} onValueChange={handleBackgroundChange}>
                  <SelectTrigger className="mb-4 bg-background h-10">
                    <SelectValue placeholder="انتخاب صدا" />
                  </SelectTrigger>
                  <SelectContent>
                    {natureSounds.filter((s) => ["wind-soft", "wind-chimes", "white-noise", "brown-noise", "pink-noise", "thunder", "deep-forest", "cricket-night", "forest-birds"].includes(s.id)).map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        <div className="flex items-center gap-2">
                          <img src={s.image} alt="" className="w-5 h-5 rounded object-cover" />
                          <span>{s.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center justify-between mb-2">
                  <Label className="text-[11px] text-muted-foreground">حجم صدا</Label>
                  <span className="text-xs font-mono text-primary font-bold">{backgroundVolume}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={backgroundVolume}
                  onChange={(e) => handleBgVol(Number(e.target.value))}
                  className="mixer-slider w-full"
                  style={{ "--value": `${backgroundVolume}%` } as React.CSSProperties}
                />
              </>
            )}
          </div>

          {/* تایمر خواب */}
          {showSleepTimer && (
            <div className="bg-gradient-to-br from-indigo-950/5 to-primary/5 border border-primary/20 rounded-3xl p-4 animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <Moon className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground text-sm">تایمر خواب</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {sleepTimerOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSleepTimer(opt.value === 0 ? null : opt.value);
                      if (opt.value > 0) toast.success(`تایمر خواب ${opt.label} فعال شد`);
                      else toast.success("تایمر لغو شد");
                    }}
                    className={cn(
                      "py-2.5 px-3 rounded-2xl border text-xs font-medium transition-all",
                      (opt.value === 0 && !sleepTimerActive) || sleepTimerMinutes === opt.value
                        ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                        : "bg-background text-foreground border-border hover:bg-muted"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-3 text-center">
                صداها به‌صورت تدریجی (fade-out) کم می‌شوند
              </p>
            </div>
          )}

          {/* پریست‌ها */}
          <div className="bg-card border border-border/60 rounded-3xl p-4 shadow-sm">
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="flex items-center justify-between w-full mb-3"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">پریست‌های آماده</h3>
                  <p className="text-[10px] text-muted-foreground">ترکیب‌های از پیش تنظیم‌شده</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {showPresets ? "▲" : "▼"}
              </span>
            </button>

            {showPresets && (
              <div className="grid grid-cols-2 gap-2">
                {mixerPresets.map((preset) => {
                  const presetAmbient = natureSounds.find((s) => s.id === preset.ambientSoundId);
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handlePreset(preset.id)}
                      className="rounded-2xl overflow-hidden border border-border/60 hover:border-primary/40 transition-all text-right active:scale-95 bg-background"
                    >
                      <div className="relative h-14 overflow-hidden">
                        <img
                          src={presetAmbient?.image}
                          alt={preset.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0" style={{
                          background: `linear-gradient(135deg, ${preset.iconColor}99 0%, ${preset.iconColor}55 100%)`
                        }} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{preset.name}</span>
                        </div>
                      </div>
                      <div className="p-2">
                        <div className="text-[10px] text-muted-foreground line-clamp-1">{preset.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* پخش/توقف پایین */}
        <div className="shrink-0 border-t border-border p-4 bg-card/80 backdrop-blur-xl">
          <button
            onClick={() => {
              if (isPlaying) {
                pause();
                audioEngine.pauseAll();
              } else {
                if (!currentSurahId) {
                  play(1, currentReciterId || defaultReciterId);
                } else {
                  resume();
                  audioEngine.resumeAll();
                }
              }
            }}
            className="w-full py-3.5 bg-gradient-to-r from-primary to-emerald-700 hover:shadow-lg hover:shadow-primary/30 text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5" fill="currentColor" />
                توقف پخش
              </>
            ) : (
              <>
                <Play className="w-5 h-5" fill="currentColor" />
                شروع پخش
              </>
            )}
          </button>
        </div>

        {/* دیالوگ ذخیره ترکیب */}
        {showSaveDialog && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-end z-50" onClick={() => setShowSaveDialog(false)}>
            <div
              className="bg-card w-full rounded-t-3xl p-5 animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground">ذخیره ترکیب</h3>
                <button onClick={() => setShowSaveDialog(false)}>
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <Input
                value={mixName}
                onChange={(e) => setMixName(e.target.value)}
                placeholder="مثلاً: شب‌های زمستانی"
                className="mb-4"
                autoFocus
              />
              <Button onClick={handleSaveMix} className="w-full">
                <Heart className="w-4 h-4 ml-2" />
                ذخیره ترکیب
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
