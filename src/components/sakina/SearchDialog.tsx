"use client";

import { useState, useMemo, useEffect } from "react";
import { surahs, dailyVerses } from "@/data/quran";
import { reciters } from "@/data/audio";
import { cn } from "@/lib/utils";
import { Search, X, BookOpen, User } from "lucide-react";

export function SearchDialog({
  open,
  onOpenChange,
  onOpenSurah,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onOpenSurah: (id: number) => void;
}) {
  const [query, setQuery] = useState("");

  // reset query when dialog closes
  useEffect(() => {
    if (!open) {
      const id = setTimeout(() => setQuery(""), 100);
      return () => clearTimeout(id);
    }
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return { surahs: [], reciters: [], verses: [] };

    const surahResults = surahs.filter((s) =>
      s.persianName.includes(query) ||
      s.arabicName.includes(query) ||
      s.englishName.toLowerCase().includes(query.toLowerCase()) ||
      String(s.id) === query
    ).slice(0, 10);

    const reciterResults = reciters.filter((r) =>
      r.name.includes(query)
    ).slice(0, 5);

    const verseResults = dailyVerses.filter((v) =>
      v.arabic.includes(query) || v.persian.includes(query)
    ).slice(0, 5);

    return { surahs: surahResults, reciters: reciterResults, verses: verseResults };
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* هدر جستجو */}
      <header className="border-b border-border p-4 safe-top">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی سوره، قاری، آیه..."
              className="w-full bg-card border border-border rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-primary"
              autoFocus
            />
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-full hover:bg-muted"
            aria-label="بستن"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-md mx-auto space-y-6">
          {!query.trim() ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                برای شروع جستجو چیزی تایپ کنید
              </p>
            </div>
          ) : (
            <>
              {/* سوره‌ها */}
              {results.surahs.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    سوره‌ها ({results.surahs.length})
                  </h3>
                  <div className="space-y-1">
                    {results.surahs.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => onOpenSurah(s.id)}
                        className="w-full bg-card border border-border rounded-xl p-3 flex items-center gap-3 hover:bg-muted/50 text-right"
                      >
                        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                          {s.id}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm text-foreground">سوره {s.persianName}</div>
                          <div className="text-xs text-muted-foreground">
                            {s.versesCount} آیه • {s.type}
                          </div>
                        </div>
                        <span className="font-quran text-base text-foreground/70">{s.arabicName}</span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* قاری‌ها */}
              {results.reciters.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    قاری‌ها ({results.reciters.length})
                  </h3>
                  <div className="space-y-1">
                    {results.reciters.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          // هدایت به صفحه میکسر با این قاری
                          onOpenChange(false);
                        }}
                        className="w-full bg-card border border-border rounded-xl p-3 flex items-center gap-3 hover:bg-muted/50 text-right"
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                          style={{ backgroundColor: r.color }}
                        >
                          {r.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm text-foreground">{r.name}</div>
                          <div className="text-xs text-muted-foreground">{r.nationality}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* آیات */}
              {results.verses.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    آیات ({results.verses.length})
                  </h3>
                  <div className="space-y-1">
                    {results.verses.map((v) => {
                      const s = surahs.find((su) => su.id === v.surahId);
                      return (
                        <button
                          key={`${v.surahId}-${v.verseNumber}`}
                          onClick={() => onOpenSurah(v.surahId)}
                          className="w-full bg-card border border-border rounded-xl p-3 hover:bg-muted/50 text-right"
                        >
                          <p className="font-quran text-base text-foreground mb-1" dir="rtl">
                            {v.arabic}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{v.persian}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {s?.persianName} • آیه {v.verseNumber}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* نتیجه‌ای نیست */}
              {results.surahs.length === 0 && results.reciters.length === 0 && results.verses.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground mb-1">نتیجه‌ای پیدا نشد</p>
                  <p className="text-xs text-muted-foreground/70">
                    عبارت دیگری را امتحان کنید
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
