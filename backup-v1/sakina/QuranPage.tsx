"use client";

import { useState, useMemo } from "react";
import { usePlayerStore } from "@/store/player";
import { surahs, sampleVerses, type Surah } from "@/data/quran";
import { reciters } from "@/data/audio";
import { audioEngine } from "@/lib/audio-engine";
import { cn } from "@/lib/utils";
import { Search, X, Play, BookOpen, Heart, Share2, Copy, Bookmark, Plus, ChevronLeft, Settings2 } from "lucide-react";
import { toast } from "sonner";

export function QuranPage({
  onOpenSurah,
  initialSearch,
}: {
  onOpenSurah: (id: number) => void;
  initialSearch?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "مکی" | "مدنی">("all");

  const filtered = useMemo(() => {
    return surahs.filter((s) => {
      const matchQuery = !query ||
        s.persianName.includes(query) ||
        s.arabicName.includes(query) ||
        s.englishName.toLowerCase().includes(query.toLowerCase()) ||
        String(s.id) === query;
      const matchFilter = filter === "all" || s.type === filter;
      return matchQuery && matchFilter;
    });
  }, [query, filter]);

  return (
    <div className="max-w-md mx-auto px-5 pt-10 pb-6">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">قرآن کریم</h1>
        <p className="text-sm text-muted-foreground mt-1">۱۱۴ سوره • ۶۲۳۶ آیه</p>
      </header>

      <div className="relative mb-3">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجوی سوره..."
          className="w-full glass rounded-2xl pr-11 pl-11 py-3.5 text-sm focus:outline-none transition-all"
          autoFocus={initialSearch}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute left-4 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-5">
        {[
          { id: "all" as const, label: "همه" },
          { id: "مکی" as const, label: "مکی" },
          { id: "مدنی" as const, label: "مدنی" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold transition-all",
              filter === f.id
                ? "bg-gradient-to-br from-emerald-700 to-emerald-900 text-white shadow-md shadow-emerald-900/20"
                : "glass text-foreground hover:scale-105"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((s) => (
          <SurahRow key={s.id} surah={s} onOpen={() => onOpenSurah(s.id)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl glass flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">سوره‌ای پیدا نشد</p>
        </div>
      )}
    </div>
  );
}

function SurahRow({ surah, onOpen }: { surah: Surah; onOpen: () => void }) {
  const { play, isPlaying, currentSurahId, defaultReciterId, isDownloaded, toggleFavorite, isFavorite, addHistory, ambientSoundId, ambientEnabled, backgroundSoundId, backgroundEnabled, ambientVolume, backgroundVolume } = usePlayerStore();
  const fav = isFavorite(surah.id);

  const handleQuickPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    play(surah.id, defaultReciterId);
    addHistory(surah.id, defaultReciterId, 180);
    setTimeout(() => {
      if (ambientEnabled && ambientSoundId) audioEngine.playAmbient(ambientSoundId, ambientVolume);
      if (backgroundEnabled && backgroundSoundId) audioEngine.playBackground(backgroundSoundId, backgroundVolume);
    }, 300);
  };

  const isActive = isPlaying && currentSurahId === surah.id;

  return (
    <div
      className={cn(
        "glass rounded-2xl p-3 flex items-center gap-3 hover:scale-[1.01] transition-all cursor-pointer",
        isActive && "ring-2 ring-emerald-600/40"
      )}
      onClick={onOpen}
    >
      <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 48 48" className="absolute inset-0">
          <polygon
            points="18,2 30,2 46,18 46,30 30,46 18,46 2,30 2,18"
            fill={isActive ? "url(#activeGrad)" : "none"}
            stroke={isActive ? "transparent" : "#B8945A"}
            strokeWidth="1.5"
            opacity="0.7"
          />
          <defs>
            <linearGradient id="activeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0B3D2E" />
              <stop offset="100%" stopColor="#14785B" />
            </linearGradient>
          </defs>
        </svg>
        <span className={cn(
          "text-sm font-bold relative",
          isActive ? "text-white" : "text-emerald-700 dark:text-emerald-400"
        )}>{surah.id}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-foreground text-sm tracking-tight">سوره {surah.persianName}</h3>
          {isDownloaded(surah.id) && (
            <span className="text-[9px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-full font-bold">
              آفلاین
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5 font-medium">
          <span>{surah.versesCount} آیه</span>
          <span>·</span>
          <span>{surah.type}</span>
          <span>·</span>
          <span>جزء {surah.juz}</span>
        </div>
      </div>

      <span className="font-quran text-lg text-foreground/80" dir="rtl">
        {surah.arabicName}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(surah.id);
          toast.success(fav ? "حذف شد" : "اضافه شد");
        }}
        className="w-9 h-9 rounded-full hover:bg-foreground/5 flex items-center justify-center active:scale-90 transition-all"
        aria-label="علاقه‌مندی"
      >
        <Heart className={cn("w-4 h-4 transition-all", fav ? "fill-rose-500 text-rose-500" : "text-muted-foreground")} />
      </button>

      <button
        onClick={handleQuickPlay}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90",
          isActive
            ? "bg-gradient-to-br from-emerald-700 to-emerald-900 text-white shadow-md shadow-emerald-900/30"
            : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20"
        )}
        aria-label="پخش سریع"
      >
        <Play className="w-4 h-4" fill="currentColor" />
      </button>
    </div>
  );
}

export function SurahDetailPage({
  surahId,
  onBack,
}: {
  surahId: number;
  onBack: () => void;
}) {
  const surah = surahs.find((s) => s.id === surahId);
  const verses = sampleVerses[surahId] || [];
  const {
    play, isPlaying, currentSurahId, currentVerse, currentReciterId, defaultReciterId, setDefaultReciter,
    showTranslation, arabicFontSize, persianFontSize, setShowTranslation, setArabicFontSize,
    toggleFavorite, isFavorite, addHistory, downloadSurah, isDownloaded, addPlaylist, addToPlaylist, playlists,
    ambientSoundId, ambientEnabled, backgroundSoundId, backgroundEnabled, ambientVolume, backgroundVolume,
  } = usePlayerStore();

  const [showSettings, setShowSettings] = useState(false);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);

  if (!surah) return null;

  const currentReciter = reciters.find((r) => r.id === (currentReciterId || defaultReciterId)) || reciters[0];

  const handlePlay = () => {
    if (isPlaying && currentSurahId === surahId) return;
    play(surahId, currentReciterId || defaultReciterId);
    addHistory(surahId, currentReciterId || defaultReciterId, 180);
    setTimeout(() => {
      if (ambientEnabled && ambientSoundId) audioEngine.playAmbient(ambientSoundId, ambientVolume);
      if (backgroundEnabled && backgroundSoundId) audioEngine.playBackground(backgroundSoundId, backgroundVolume);
    }, 300);
  };

  return (
    <div className="max-w-md mx-auto pb-6">
      {/* هدر */}
      <header className="sticky top-0 z-20 glass-strong border-b border-border/40">
        <div className="px-5 pt-8 pb-4">
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-2xl glass flex items-center justify-center active:scale-90 transition-transform"
              aria-label="بازگشت"
            >
              <ChevronLeft className="w-5 h-5 text-foreground rotate-180" />
            </button>
            <div className="text-center">
              <h1 className="font-quran text-2xl text-foreground" dir="rtl">{surah.arabicName}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {surah.persianName} • {surah.versesCount} آیه • {surah.type}
              </p>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center active:scale-90 transition-all",
                showSettings ? "bg-emerald-600 text-white" : "glass"
              )}
              aria-label="تنظیمات"
            >
              <Settings2 className="w-5 h-5" />
            </button>
          </div>

          {/* انتخاب قاری */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-xs text-muted-foreground shrink-0 font-medium">قاری:</span>
            {reciters.map((r) => (
              <button
                key={r.id}
                onClick={() => setDefaultReciter(r.id)}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all",
                  (currentReciterId || defaultReciterId) === r.id
                    ? "bg-gradient-to-br from-emerald-700 to-emerald-900 text-white shadow-md"
                    : "glass text-foreground hover:scale-105"
                )}
              >
                <img src={r.image} alt="" className="w-5 h-5 rounded-full object-cover" />
                {r.name}
              </button>
            ))}
          </div>

          {showSettings && (
            <div className="mt-3 glass rounded-2xl p-4 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground font-medium">نمایش ترجمه</span>
                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  className={cn(
                    "w-11 h-6 rounded-full transition-colors",
                    showTranslation ? "bg-emerald-600" : "bg-muted"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full bg-white shadow-sm transition-all mt-1",
                    showTranslation ? "mr-1" : "mr-5"
                  )} />
                </button>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-foreground font-medium">اندازه متن عربی</span>
                  <span className="text-xs text-muted-foreground font-mono">{arabicFontSize}</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={40}
                  value={arabicFontSize}
                  onChange={(e) => setArabicFontSize(Number(e.target.value))}
                  className="mixer-slider w-full"
                  style={{ "--value": `${((arabicFontSize - 20) / 20) * 100}%` } as React.CSSProperties}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* کارت قاری */}
      <div className="px-5 mt-5 mb-4">
        <div className="glass rounded-3xl p-4 flex items-center gap-3">
          <img src={currentReciter.image} alt={currentReciter.name} className="w-14 h-14 rounded-2xl object-cover shrink-0 shadow-md" />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">در حال پخش با</div>
            <div className="font-bold text-foreground text-base mt-0.5 tracking-tight">{currentReciter.name}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{currentReciter.description}</div>
          </div>
        </div>
      </div>

      {/* دکمه پخش */}
      <div className="px-5 mb-4">
        <button
          onClick={handlePlay}
          className="w-full btn-luxury text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2.5 active:scale-95 transition-transform"
        >
          <Play className="w-5 h-5" fill="currentColor" />
          {isPlaying && currentSurahId === surahId ? "در حال پخش..." : "پخش سوره کامل"}
        </button>
      </div>

      {/* اطلاعات سوره */}
      <div className="px-5 mb-4">
        <div className="glass rounded-2xl p-4 flex items-center justify-around text-center">
          <div>
            <div className="text-xl font-extrabold text-foreground tracking-tight">{surah.versesCount}</div>
            <div className="text-[10px] text-muted-foreground font-medium">آیه</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div>
            <div className="text-xl font-extrabold text-foreground tracking-tight">{surah.type}</div>
            <div className="text-[10px] text-muted-foreground font-medium">نوع</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div>
            <div className="text-xl font-extrabold text-foreground tracking-tight">{surah.juz}</div>
            <div className="text-[10px] text-muted-foreground font-medium">جزء</div>
          </div>
        </div>
      </div>

      {/* بسم الله */}
      {surahId !== 9 && surahId !== 1 && (
        <div className="text-center py-6">
          <p className="font-quran text-2xl text-foreground" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      )}

      {/* آیات */}
      <div className="px-5 space-y-3">
        {verses.length > 0 ? (
          verses.map((v) => {
            const isCurrent = isPlaying && currentSurahId === surahId && currentVerse === v.number;
            const fav = isFavorite(surahId, v.number);
            return (
              <div
                key={v.number}
                className={cn(
                  "glass rounded-2xl p-4 transition-all",
                  isCurrent && "ring-2 ring-emerald-600/40 bg-emerald-500/5"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                      {v.number}
                    </span>
                    {isCurrent && (
                      <div className="wave-bars text-emerald-600 dark:text-emerald-400 scale-75">
                        <span></span><span></span><span></span><span></span><span></span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => { toggleFavorite(surahId, v.number); toast.success(fav ? "حذف شد" : "اضافه شد"); }}
                      className="w-8 h-8 rounded-full hover:bg-foreground/5 flex items-center justify-center active:scale-90 transition-all"
                      aria-label="علاقه‌مندی"
                    >
                      <Heart className={cn("w-4 h-4", fav ? "fill-rose-500 text-rose-500" : "text-muted-foreground")} />
                    </button>
                    <button
                      onClick={() => { navigator.clipboard.writeText(`${v.arabic}\n${v.persian}`); toast.success("کپی شد"); }}
                      className="w-8 h-8 rounded-full hover:bg-foreground/5 flex items-center justify-center active:scale-90 transition-all"
                      aria-label="کپی"
                    >
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => {
                        navigator.share?.({ text: `${v.arabic}\n\n${v.persian}\n\nسوره ${surah.persianName} • آیه ${v.number}` }).catch(() => toast.error("پشتیبانی نمی‌شود"));
                      }}
                      className="w-8 h-8 rounded-full hover:bg-foreground/5 flex items-center justify-center active:scale-90 transition-all"
                      aria-label="اشتراک"
                    >
                      <Share2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => setShowAddToPlaylist(true)}
                      className="w-8 h-8 rounded-full hover:bg-foreground/5 flex items-center justify-center active:scale-90 transition-all"
                      aria-label="افزودن به پلی‌لیست"
                    >
                      <Plus className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                <p
                  className="font-quran text-foreground leading-loose text-right mb-3"
                  style={{ fontSize: `${arabicFontSize}px`, lineHeight: 2.2 }}
                  dir="rtl"
                >
                  {v.arabic}
                </p>

                {showTranslation && (
                  <p className="text-muted-foreground leading-relaxed" style={{ fontSize: `${persianFontSize}px` }}>
                    {v.persian}
                  </p>
                )}

                <button
                  onClick={() => {
                    play(surahId, currentReciterId || defaultReciterId, v.number);
                    setTimeout(() => {
                      if (ambientEnabled && ambientSoundId) audioEngine.playAmbient(ambientSoundId, ambientVolume);
                      if (backgroundEnabled && backgroundSoundId) audioEngine.playBackground(backgroundSoundId, backgroundVolume);
                    }, 300);
                  }}
                  className="mt-3 text-xs text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3" fill="currentColor" />
                  پخش این آیه
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl glass flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">متن کامل این سوره در نسخه نهایی</p>
            <p className="text-xs text-muted-foreground/70">اما می‌توانید صوت آن را گوش دهید!</p>
          </div>
        )}
      </div>

      {/* دانلود */}
      <div className="px-5 mt-6">
        <button
          onClick={() => {
            if (isDownloaded(surahId)) {
              toast.success("قبلاً دانلود شده");
            } else {
              downloadSurah(surahId, currentReciterId || defaultReciterId);
              toast.success("دانلود شد");
            }
          }}
          className="w-full py-3 glass rounded-2xl text-sm font-bold text-foreground hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
        >
          <Bookmark className="w-4 h-4" />
          {isDownloaded(surahId) ? "دانلود شده" : "دانلود آفلاین"}
        </button>
      </div>

      {/* مودال پلی‌لیست */}
      {showAddToPlaylist && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-end" onClick={() => setShowAddToPlaylist(false)}>
          <div className="glass-strong w-full rounded-t-3xl p-5 max-w-md mx-auto animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-foreground text-lg">افزودن به پلی‌لیست</h3>
              <button onClick={() => setShowAddToPlaylist(false)} className="w-8 h-8 rounded-full hover:bg-foreground/5 flex items-center justify-center">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            {playlists.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6 mb-3">هنوز پلی‌لیستی نساخته‌اید</p>
            ) : (
              <div className="space-y-2 mb-3 max-h-60 overflow-y-auto">
                {playlists.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      addToPlaylist(p.id, surahId);
                      toast.success(`به «${p.name}» اضافه شد`);
                      setShowAddToPlaylist(false);
                    }}
                    className="w-full p-3 glass rounded-xl text-right hover:scale-[1.01] transition-transform"
                  >
                    <div className="font-bold text-sm text-foreground">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.surahIds.length} سوره</div>
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => {
                const id = addPlaylist(`پلی‌لیست ${playlists.length + 1}`, "");
                addToPlaylist(id, surahId);
                toast.success("پلی‌لیست جدید ساخته شد");
                setShowAddToPlaylist(false);
              }}
              className="w-full py-3 btn-luxury text-white rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4" />
              ساخت پلی‌لیست جدید
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
