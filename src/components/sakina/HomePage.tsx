"use client";

import { usePlayerStore } from "@/store/player";
import { surahs, dailyVerses } from "@/data/quran";
import { collections, reciters } from "@/data/audio";
import { audioEngine } from "@/lib/audio-engine";
import { SakinaLogo } from "@/components/sakina/Logo";
import { cn } from "@/lib/utils";
import { Search, Play, Clock, Sparkles, ChevronLeft, BookOpen, Moon, TrendingUp, Heart, ArrowLeft } from "lucide-react";
import { useState } from "react";

export function HomePage({
  onNavigateQuran,
  onOpenSurah,
  onOpenSearch,
  onOpenSleepMode,
}: {
  onNavigateQuran: () => void;
  onOpenSurah: (id: number) => void;
  onOpenSearch: () => void;
  onOpenSleepMode: () => void;
}) {
  const { play, isPlaying, currentSurahId, history, favorites, defaultReciterId, ambientSoundId, ambientEnabled, backgroundSoundId, backgroundEnabled, ambientVolume, backgroundVolume, addHistory } = usePlayerStore();
  const [showVerseModal, setShowVerseModal] = useState(false);

  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const dailyVerse = dailyVerses[dayOfYear % dailyVerses.length];

  const continueSurah = history.length > 0 ? surahs.find((s) => s.id === history[0].surahId) : null;

  const handleQuickPlay = (surahId: number) => {
    play(surahId, defaultReciterId);
    addHistory(surahId, defaultReciterId, 180);
    onOpenSurah(surahId);
    setTimeout(() => {
      if (ambientEnabled && ambientSoundId) {
        audioEngine.playAmbient(ambientSoundId, ambientVolume);
      }
      if (backgroundEnabled && backgroundSoundId) {
        audioEngine.playBackground(backgroundSoundId, backgroundVolume);
      }
    }, 300);
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-8 pb-6 space-y-7 overflow-x-hidden">
      {/* هدر */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-md">
            <SakinaLogo size={44} className="absolute inset-0" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight leading-none">سَکینه</h1>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">قرآن و آرامش</p>
          </div>
        </div>
        <button
          onClick={onOpenSearch}
          className="w-11 h-11 rounded-2xl glass flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shrink-0"
          aria-label="جستجو"
        >
          <Search className="w-5 h-5 text-foreground" strokeWidth={2.2} />
        </button>
      </header>

      {/* نوار جستجو */}
      <button
        onClick={onOpenSearch}
        className="w-full flex items-center gap-2 glass rounded-2xl px-4 py-3 text-right hover:bg-foreground/5 transition-colors"
      >
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="text-sm text-muted-foreground">جستجوی سوره، آیه، قاری...</span>
      </button>

      {/* کارت آیه روزانه */}
      <button
        onClick={() => setShowVerseModal(true)}
        className="block w-full text-right rounded-3xl p-6 relative overflow-hidden transition-transform active:scale-[0.98]"
        style={{ background: "linear-gradient(135deg, #0B3D2E 0%, #14785B 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(at 20% 20%, rgba(184, 148, 90, 0.35) 0px, transparent 50%), radial-gradient(at 80% 80%, rgba(45, 161, 127, 0.4) 0px, transparent 50%)",
          }}
        />
        <div className="absolute top-4 left-4 w-20 h-20 rounded-full opacity-20" style={{
          background: "radial-gradient(circle, #D4B274 0%, transparent 70%)"
        }} />

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            </div>
            <span className="text-[11px] text-amber-200 font-bold uppercase tracking-widest">آیه روز</span>
          </div>

          <p className="font-quran text-2xl text-white leading-loose mb-3" dir="rtl">
            {dailyVerse.arabic}
          </p>
          <p className="text-sm text-white/75 leading-relaxed mb-5 line-clamp-2">
            {dailyVerse.persian}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-white/15">
            <span className="text-xs text-white/60 font-medium">
              {surahs.find((s) => s.id === dailyVerse.surahId)?.persianName} • آیه {dailyVerse.verseNumber}
            </span>
            <div className="flex items-center gap-1 text-amber-200">
              <span className="text-xs font-bold">مشاهده</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </button>

      {/* کارت Sleep Mode */}
      <button
        onClick={onOpenSleepMode}
        className="block w-full text-right rounded-3xl p-5 relative overflow-hidden transition-transform active:scale-[0.98]"
        style={{ background: "linear-gradient(135deg, #050407 0%, #0A0E0B 50%, #0B3D2E 100%)" }}
      >
        <div className="absolute inset-0 opacity-40" style={{
          background: "radial-gradient(at 80% 20%, rgba(212,178,116,0.3) 0%, transparent 50%)"
        }} />
        {/* ستاره‌ها */}
        <div className="absolute top-4 right-6 w-0.5 h-0.5 rounded-full bg-white/60" />
        <div className="absolute top-8 right-12 w-0.5 h-0.5 rounded-full bg-white/40" />
        <div className="absolute top-12 right-4 w-0.5 h-0.5 rounded-full bg-white/50" />

        <div className="relative flex items-center gap-4">
          {/* ماه */}
          <div className="w-14 h-14 rounded-full shrink-0 relative" style={{
            background: "radial-gradient(circle at 30% 30%, #F5F2EA, #D4B274 60%, #8A6B2E)",
            boxShadow: "0 0 30px rgba(212,178,116,0.3)",
          }}>
            <div className="absolute top-3 left-4 w-2 h-2 rounded-full bg-amber-900/20" />
            <div className="absolute top-7 right-3 w-1.5 h-1.5 rounded-full bg-amber-900/20" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <Moon className="w-3 h-3 text-amber-300" />
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-widest">Sleep Mode</span>
            </div>
            <h3 className="font-bold text-white text-base tracking-tight">آرامش شب</h3>
            <p className="text-[11px] text-white/60 mt-0.5">تلاوت آرام + صدای باران برای خواب عمیق</p>
          </div>

          <ArrowLeft className="w-5 h-5 text-amber-300 shrink-0" />
        </div>
      </button>

      {/* ادامه شنیدن */}
      {continueSurah && (
        <div
          onClick={() => onOpenSurah(continueSurah.id)}
          className="w-full surface rounded-3xl p-4 flex items-center gap-3 hover:scale-[1.01] transition-transform active:scale-[0.99] text-right cursor-pointer"
        >
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 to-emerald-900" />
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">ادامه شنیدن</span>
            </div>
            <div className="font-bold text-foreground text-base truncate">
              سوره {continueSurah.persianName}
            </div>
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-l from-emerald-600 to-emerald-400 rounded-full" style={{ width: "35%" }} />
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleQuickPlay(continueSurah.id); }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/30 active:scale-90 transition-transform"
            aria-label="پخش"
          >
            <Play className="w-5 h-5 text-white mr-0.5" fill="currentColor" />
          </button>
        </div>
      )}

      {/* پیشنهاد امروز */}
      <section>
        <h2 className="text-xl font-extrabold text-foreground tracking-tight mb-3">پیشنهاد امروز</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleQuickPlay(67)}
            className="relative h-44 rounded-3xl overflow-hidden active:scale-95 transition-transform"
          >
            <img
              src="/images/collections/night.jpg"
              alt="آرامش قبل از خواب"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <div className="w-9 h-9 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 border border-white/20">
                <Moon className="w-4 h-4 text-blue-200" />
              </div>
              <div className="text-base font-bold text-white">آرامش خواب</div>
              <div className="text-[11px] text-white/70 mt-0.5">سوره ملک + باران</div>
            </div>
          </button>

          <button
            onClick={() => handleQuickPlay(55)}
            className="relative h-44 rounded-3xl overflow-hidden active:scale-95 transition-transform"
          >
            <img
              src="/images/collections/mosque.jpg"
              alt="تلاوت طلایی"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <div className="w-9 h-9 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 border border-white/20">
                <Sparkles className="w-4 h-4 text-amber-200" />
              </div>
              <div className="text-base font-bold text-white">تلاوت طلایی</div>
              <div className="text-[11px] text-white/70 mt-0.5">سوره رحمن</div>
            </div>
          </button>
        </div>
      </section>

      {/* مجموعه‌ها */}
      <section>
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">مجموعه‌ها</h2>
          <button
            onClick={onNavigateQuran}
            className="text-xs text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 shrink-0"
          >
            همه
            <ChevronLeft className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2.5">
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => col.surahIds[0] && onOpenSurah(col.surahIds[0])}
              className="w-full surface rounded-2xl overflow-hidden flex items-center hover:scale-[1.01] transition-transform active:scale-[0.99] text-right"
            >
              <div className="relative w-20 h-20 shrink-0 overflow-hidden">
                <img
                  src={col.image}
                  alt={col.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="flex-1 min-w-0 p-3.5">
                <div className="font-bold text-foreground text-[15px] tracking-tight truncate">
                  {col.title}
                </div>
                <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                  {col.description}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1.5 font-medium">
                  {col.surahIds.length} سوره
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-muted-foreground ml-3 shrink-0" />
            </button>
          ))}
        </div>
      </section>

      {/* قاری‌ها - اسکرول افقی درست */}
      <section>
        <h2 className="text-xl font-extrabold text-foreground tracking-tight mb-3">قاری‌ها</h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
          {reciters.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                usePlayerStore.getState().setDefaultReciter(r.id);
                onOpenSurah(1);
              }}
              className="shrink-0 w-32 text-center active:scale-95 transition-transform"
            >
              <div className="relative w-32 h-40 rounded-3xl overflow-hidden shadow-lg mb-2 group">
                <img
                  src={r.image}
                  alt={r.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-xs font-bold text-white truncate">{r.name}</div>
                  <div className="text-[9px] text-white/70">{r.nationality}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* علاقه‌مندی‌ها */}
      {favorites.length > 0 && (
        <section>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight mb-3">علاقه‌مندی‌ها</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {favorites.slice(0, 4).map((fav) => {
              const s = surahs.find((su) => su.id === fav.surahId);
              if (!s) return null;
              return (
                <button
                  key={`${fav.surahId}-${fav.verseNumber}`}
                  onClick={() => onOpenSurah(s.id)}
                  className="surface rounded-2xl p-3.5 text-right hover:scale-[1.02] transition-transform active:scale-[0.98]"
                >
                  <div className="text-sm font-bold text-foreground truncate">سوره {s.persianName}</div>
                  {fav.verseNumber && (
                    <div className="text-[10px] text-muted-foreground mt-0.5">آیه {fav.verseNumber}</div>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* پاورقی */}
      <footer className="text-center pt-8 pb-2">
        <SakinaLogo size={28} className="mx-auto opacity-30" />
        <p className="text-[10px] text-muted-foreground mt-3 font-medium">سَکینه • نسخه ۶</p>
      </footer>

      {/* مودال آیه روزانه */}
      {showVerseModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-5"
          onClick={() => setShowVerseModal(false)}
        >
          <div
            className="glass-strong rounded-3xl p-7 max-w-sm w-full animate-fade-in-scale relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 right-0 w-32 h-32 opacity-20" style={{
              background: "radial-gradient(circle, #D4B274 0%, transparent 70%)"
            }} />
            <div className="relative">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <span className="text-[11px] text-amber-700 dark:text-amber-400 font-bold uppercase tracking-widest">آیه روز</span>
                </div>
                <button onClick={() => setShowVerseModal(false)} className="w-7 h-7 rounded-full hover:bg-foreground/5 flex items-center justify-center">
                  <span className="text-muted-foreground text-lg">×</span>
                </button>
              </div>

              <p className="font-quran text-2xl text-foreground leading-loose text-center mb-5" dir="rtl">
                {dailyVerse.arabic}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed text-center mb-5">
                {dailyVerse.persian}
              </p>

              <div className="text-xs text-muted-foreground text-center mb-5 pb-5 border-b border-border">
                {surahs.find((s) => s.id === dailyVerse.surahId)?.persianName} • آیه {dailyVerse.verseNumber}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleQuickPlay(dailyVerse.surahId);
                    setShowVerseModal(false);
                  }}
                  className="flex-1 py-3 btn-luxury text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <Play className="w-4 h-4" fill="currentColor" />
                  پخش
                </button>
                <button
                  onClick={() => onOpenSurah(dailyVerse.surahId)}
                  className="flex-1 py-3 bg-muted text-foreground rounded-2xl font-bold hover:bg-muted/70 transition-colors"
                >
                  رفتن به سوره
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
