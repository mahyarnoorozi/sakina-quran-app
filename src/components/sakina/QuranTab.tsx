"use client";

/**
 * فهرست قرآن — جستجوی فوری (نام عربی/فارسی/معنی) + فیلتر مکی/مدنی + نشان دانلود
 */

import { useMemo, useState } from "react";
import { surahs, type Surah } from "@/data/quran";
import { usePlayerStore } from "@/store/player";
import { useLibraryStore } from "@/store/library";
import { StarBadge } from "./StarBadge";
import { toPersianDigits } from "@/data/verses";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { PauseGlyph, PlayGlyph } from "./PlayPauseIcon";

type Filter = "all" | "مکی" | "مدنی";

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "همه" },
  { id: "مکی", label: "مکی" },
  { id: "مدنی", label: "مدنی" },
];

export function QuranTab({ onOpenSurah }: { onOpenSurah: (id: number) => void }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const { play, isPlaying, surahId: currentSurah } = usePlayerStore();
  const downloads = useLibraryStore((s) => s.downloads);
  const downloadedSet = useMemo(
    () => new Set(downloads.filter((d) => d.status === "done").map((d) => d.surahId)),
    [downloads]
  );

  const list = useMemo(() => {
    const q = query.trim();
    return surahs.filter((s) => {
      if (filter !== "all" && s.type !== filter) return false;
      if (!q) return true;
      return (
        s.arabicName.includes(q) ||
        s.persianName.includes(q) ||
        s.meaning.includes(q) ||
        s.englishName.toLowerCase().includes(q.toLowerCase()) ||
        String(s.id) === q
      );
    });
  }, [query, filter]);

  return (
    <div className="pb-40">
      <header className="px-5 pt-8 pb-3">
        <h1 className="text-2xl font-black">قرآن کریم</h1>
        <p className="text-xs text-brand-ink-muted mt-1">
          {toPersianDigits(114)} سوره · متن کامل با ترجمه مکارم
        </p>
      </header>

      {/* جستجو */}
      <div className="px-5">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-ink-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی سوره: نام، معنی یا شماره…"
            aria-label="جستجوی سوره"
            className="w-full h-12 rounded-2xl border border-border bg-card pr-11 pl-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      {/* فیلترها */}
        <div className="flex gap-2 mt-3">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className="ds-chip min-h-9"
              data-active={filter === f.id}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ادامه خوانش سنجاق‌شده — واکنش‌گرا به استور */}
      <div className="px-5 mt-3">
        <button
          onClick={() => onOpenSurah(currentSurah)}
          className="w-full flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/5 px-4 h-12 text-sm font-bold text-primary tap"
        >
          <span>ادامه‌ی خوانش</span>
          <span className="text-xs font-semibold">
            {surahs.find((s) => s.id === currentSurah)?.persianName}
          </span>
        </button>
      </div>

      {/* فهرست */}
      <ul className="px-3 mt-2" role="list">
        {list.map((s) => (
          <SurahRow
            key={s.id}
            surah={s}
            playing={isPlaying && currentSurah === s.id}
            downloaded={downloadedSet.has(s.id)}
            onOpen={() => onOpenSurah(s.id)}
            onPlay={() => play(s.id, 1)}
          />
        ))}
        {list.length === 0 && (
          <li className="text-center py-16 text-sm text-brand-ink-muted">
            چیزی پیدا نشد؛ شاید املای دیگری را امتحان کنی؟
          </li>
        )}
      </ul>
    </div>
  );
}

function SurahRow({
  surah,
  playing,
  downloaded,
  onOpen,
  onPlay,
}: {
  surah: Surah;
  playing: boolean;
  downloaded: boolean;
  onOpen: () => void;
  onPlay: () => void;
}) {
  return (
    <li
      className={cn(
        "group flex items-center gap-2 rounded-2xl transition-colors",
        playing ? "bg-primary/5" : "hover:bg-secondary/60"
      )}
    >
      <button
        onClick={onOpen}
        className="flex items-center gap-3 flex-1 min-w-0 py-2.5 pr-2 text-right min-h-11"
      >
        <StarBadge number={surah.id} className={playing ? "text-primary" : undefined} />
        <span className="flex-1 min-w-0">
          <span className="flex items-center gap-2">
            <span
              className={cn(
                "font-quran text-[17px] leading-7",
                playing ? "text-primary font-bold" : "font-medium"
              )}
            >
              {surah.arabicName}
            </span>
            {downloaded && (
              <span className="text-[9px] font-bold text-primary bg-primary/10 rounded-full px-2 py-0.5">
                آفلاین
              </span>
            )}
          </span>
          <span className="block text-[11px] text-brand-ink-muted mt-0.5 truncate">
            {surah.persianName} · {surah.meaning} · {toPersianDigits(surah.versesCount)} آیه
          </span>
        </span>
      </button>
      <span className="text-[10px] text-brand-ink-muted/70 px-1 shrink-0">{surah.type}</span>
      <button
        onClick={onPlay}
        aria-label={`پخش سوره ${surah.persianName}`}
        className={cn(
          "w-11 h-11 rounded-full flex items-center justify-center mr-1 ml-2 shrink-0 transition-colors",
          playing
            ? "bg-primary text-primary-foreground"
            : "text-brand-ink-muted hover:bg-primary/10 hover:text-primary"
        )}
      >
        {playing ? (
          <PauseGlyph className="w-4.5 h-4.5" />
        ) : (
          <PlayGlyph className="w-4.5 h-4.5" />
        )}
      </button>
    </li>
  );
}
