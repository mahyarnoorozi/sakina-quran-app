"use client";

/**
 * شیت انتخاب سوره — از جلسه‌ساز خانه
 * جستجوی فوری + فیلتر مکی/مدنی + فهرست کامل ۱۱۴ سوره
 * ضربه = پخش فوری همان سوره (لایه آرامش فعال دست‌نخورده می‌ماند)
 */

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { surahs, type Surah } from "@/data/quran";
import { usePlayerStore } from "@/store/player";
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

export function SurahPickerSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const { play, isPlaying, surahId: currentSurah } = usePlayerStore();

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
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[90] bg-black/50 flex items-end"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.34, ease: [0.32, 0.72, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="انتخاب سوره"
            className="w-full bg-card rounded-t-3xl text-foreground max-h-[80vh] flex flex-col"
          >
            <div className="w-10 h-1 rounded-full bg-border mx-auto mt-3 shrink-0" />

            <div className="px-5 pt-4 pb-3 shrink-0">
              <h3 className="text-base font-black">انتخاب سوره</h3>
              <p className="text-[11px] text-brand-ink-muted mt-0.5">
                ضربه بزنی، همان لحظه پخش می‌شود
              </p>

              <div className="relative mt-3">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-ink-muted" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجو: نام، معنی یا شماره…"
                  aria-label="جستجوی سوره"
                  className="w-full h-11 rounded-2xl border border-border bg-secondary/60 pr-11 pl-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="flex gap-2 mt-2.5">
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

            <ul
              className="flex-1 overflow-y-auto nice-scroll px-3 pb-8 pt-1"
              role="listbox"
              aria-label="فهرست سوره‌ها"
            >
              {list.map((s) => (
                <PickerRow
                  key={s.id}
                  surah={s}
                  playing={isPlaying && currentSurah === s.id}
                  onPick={() => {
                    play(s.id, 1);
                    onOpenChange(false);
                  }}
                />
              ))}
              {list.length === 0 && (
                <li className="text-center py-12 text-sm text-brand-ink-muted">
                  چیزی پیدا نشد؛ شاید املای دیگری را امتحان کنی؟
                </li>
              )}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PickerRow({
  surah,
  playing,
  onPick,
}: {
  surah: Surah;
  playing: boolean;
  onPick: () => void;
}) {
  return (
    <li
      className={cn(
        "rounded-2xl transition-colors",
        playing ? "bg-primary/5" : "hover:bg-secondary/60"
      )}
    >
      <button
        onClick={onPick}
        role="option"
        aria-selected={playing}
        className="w-full flex items-center gap-3 py-2.5 pr-2 pl-2 text-right min-h-11"
      >
        <StarBadge number={surah.id} className={playing ? "text-primary" : undefined} />
        <span className="flex-1 min-w-0">
          <span
            className={cn(
              "block font-quran text-[17px] leading-7",
              playing ? "text-primary font-bold" : "font-medium"
            )}
          >
            {surah.arabicName}
          </span>
          <span className="block text-[11px] text-brand-ink-muted mt-0.5 truncate">
            {surah.persianName} · {toPersianDigits(surah.versesCount)} آیه · {surah.type}
          </span>
        </span>
        <span
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
            playing ? "bg-primary text-primary-foreground" : "text-brand-ink-muted"
          )}
          aria-hidden
        >
          {playing ? <PauseGlyph className="w-4 h-4" /> : <PlayGlyph className="w-4 h-4" />}
        </span>
      </button>
    </li>
  );
}
