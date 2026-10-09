"use client";

/**
 * خوانش — متن کامل عربی (امیری) + ترجمه مکارم
 * هایلایت همگام + اسکرول نرم + نوار اکشن آیه + دانلود آفلاین + اندازه فونت
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { surahs } from "@/data/quran";
import { reciters } from "@/data/audio";
import { getVerses, toPersianDigits, type Verse } from "@/data/verses";
import { AyahBadge } from "./StarBadge";
import { usePlayerStore } from "@/store/player";
import { useSettingsStore } from "@/store/settings";
import { useLibraryStore } from "@/store/library";
import { AudioEngine } from "@/lib/audio-engine";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PlayGlyph } from "./PlayPauseIcon";
import {
  ArrowRight, Check, Copy, Download, Heart, Minus, Plus, Share2, Type, Loader2, X,
} from "lucide-react";

export function ReaderSheet({
  surahId,
  onClose,
}: {
  surahId: number | null;
  onClose: () => void;
}) {
  const { isPlaying, surahId: playSurah, ayah, play, pause } = usePlayerStore();
  const { fontSize, setFontSize, showTranslation, setShowTranslation, autoScroll } =
    useSettingsStore();
  const { toggleFavorite, favorites, downloads, setDownload, removeDownload } =
    useLibraryStore();

  const [data, setData] = useState<{ surah: number; verses: Verse[] } | null>(null);
  const [actionsFor, setActionsFor] = useState<number | null>(null);
  const [dlProgress, setDlProgress] = useState<number | null>(null);
  const [fontSheet, setFontSheet] = useState(false);

  const surah = surahs.find((s) => s.id === surahId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const verses = data && data.surah === surahId ? data.verses : null;

  // لود متن (setState فقط در callback async)
  useEffect(() => {
    if (!surahId) return;
    let alive = true;
    getVerses(surahId)
      .then((v) => alive && setData({ surah: surahId, verses: v }))
      .catch(() => alive && setData({ surah: surahId, verses: [] }));
    return () => {
      alive = false;
    };
  }, [surahId]);

  // اسکرول نرم به آیه در حال پخش
  useEffect(() => {
    if (!autoScroll || !isPlaying || playSurah !== surahId || !activeRef.current) return;
    activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [ayah, isPlaying, playSurah, surahId, autoScroll]);

  const favSet = useMemo(
    () =>
      new Set(
        favorites.filter((f) => f.surahId === surahId && f.ayah).map((f) => f.ayah)
      ),
    [favorites, surahId]
  );

  const download = downloads.find((d) => d.surahId === surahId);

  const handleDownload = async () => {
    if (!surahId || !surah) return;
    const reciterId = usePlayerStore.getState().reciterId;
    if (download?.status === "done") {
      // حذف دانلود
      removeDownload(surahId);
      await AudioEngine.clearCache();
      toast.success("نسخه آفلاین حذف شد");
      return;
    }
    setDlProgress(0);
    const everyayahId = reciters.find((r) => r.id === reciterId)?.everyayahId ?? reciterId;
    const { ok, cached } = await AudioEngine.downloadSurah(
      everyayahId,
      surahId,
      (pct) => setDlProgress(pct)
    );
    setDlProgress(null);
    if (ok || cached > 0) {
      setDownload(surahId, reciterId, {
        status: ok ? "done" : "error",
        progress: 100,
        sizeKB: surah.versesCount * 240,
        downloadedAt: Date.now(),
      });
      toast.success(
        ok ? "سوره برای شنیدن آفلاین ذخیره شد" : `${toPersianDigits(cached)} آیه ذخیره شد`
      );
    } else {
      toast.error("دانلود ناموفق بود؛ اتصال اینترنت را بررسی کن");
    }
  };

  if (!surahId || !surah) return null;

  const isCurrent = (n: number) => isPlaying && playSurah === surahId && ayah === n;

  return (
    <AnimatePresence>
      <motion.div
        key="reader"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.34, ease: [0.32, 0.72, 0, 1] }}
        className="fixed inset-0 z-[60] bg-background flex flex-col"
      >
        {/* هدر */}
        <header className="flex items-center gap-1 px-3 py-3 border-b border-border bg-card/80 backdrop-blur shrink-0">
          <button
            onClick={onClose}
            aria-label="بازگشت"
            className="w-11 h-11 rounded-full flex items-center justify-center hover:bg-secondary"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="flex-1 text-center min-w-0">
            <div className="text-base font-black truncate">
              سوره {surah.persianName}
            </div>
            <div className="text-[11px] text-brand-ink-muted">
              {surah.type} · {toPersianDigits(surah.versesCount)} آیه
            </div>
          </div>
          <button
            onClick={() => setFontSheet((v) => !v)}
            aria-label="تنظیم نمایش"
            className={cn(
              "w-11 h-11 rounded-full flex items-center justify-center hover:bg-secondary",
              fontSheet && "text-primary"
            )}
          >
            <Type className="w-5 h-5" />
          </button>
          <button
            onClick={handleDownload}
            disabled={dlProgress !== null}
            aria-label={download?.status === "done" ? "حذف آفلاین" : "دانلود آفلاین"}
            className="relative w-11 h-11 rounded-full flex items-center justify-center hover:bg-secondary"
          >
            {dlProgress !== null ? (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            ) : download?.status === "done" ? (
              <Check className="w-5 h-5 text-primary" />
            ) : (
              <Download className="w-5 h-5" />
            )}
          </button>
        </header>

        {/* شیت تنظیم نمایش */}
        {fontSheet && (
          <div className="mx-4 mt-3 rounded-2xl border border-border bg-card p-4 shadow-card animate-fade-up">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold">اندازه متن عربی</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFontSize(Math.max(18, fontSize - 2))}
                  aria-label="کوچک‌تر"
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold tabular-nums w-8 text-center">
                  {toPersianDigits(fontSize)}
                </span>
                <button
                  onClick={() => setFontSize(Math.min(36, fontSize + 2))}
                  aria-label="بزرگ‌تر"
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <label className="flex items-center justify-between">
              <span className="text-xs font-bold">نمایش ترجمه فارسی</span>
              <input
                type="checkbox"
                checked={showTranslation}
                onChange={(e) => setShowTranslation(e.target.checked)}
                className="w-5 h-5 accent-[var(--brand-emerald)]"
              />
            </label>
          </div>
        )}

        {/* پیشرفت دانلود */}
        {dlProgress !== null && (
          <div className="mx-5 mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-primary transition-[width]"
              style={{ width: `${dlProgress}%` }}
            />
          </div>
        )}

        {/* متن آیات */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto nice-scroll px-5 py-5 pb-44">
          {verses === null ? (
            <div className="space-y-8 animate-pulse">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-6 bg-secondary rounded-lg w-5/6" />
                  <div className="h-4 bg-secondary/70 rounded-lg w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* بسم‌الله */}
              {surahId !== 1 && surahId !== 9 && (
                <p className="font-quran text-center text-[22px] text-brand-emerald mb-8">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              )}
              <div className="space-y-4 max-w-2xl mx-auto">
                {verses.map((v) => {
                  const current = isCurrent(v.number);
                  return (
                    <div key={v.number}>
                      <div
                        ref={current ? activeRef : undefined}
                        onClick={() => setActionsFor(actionsFor === v.number ? null : v.number)}
                        className={cn(
                          "rounded-2xl px-4 py-3.5 transition-colors cursor-pointer border-r-[3px]",
                          current
                            ? "bg-primary/[0.07] border-primary"
                            : "border-transparent hover:bg-secondary/50"
                        )}
                      >
                        <p
                          className="font-quran text-right"
                          style={{ fontSize, lineHeight: 2.15 }}
                          dir="rtl"
                          lang="ar"
                        >
                          {v.arabic}
                          <AyahBadge number={v.number} />
                        </p>
                        {showTranslation && (
                          <p className="text-[13px] text-brand-ink-muted leading-7 mt-2 text-justify">
                            {v.persian}
                          </p>
                        )}
                      </div>

                      {/* نوار اکشن آیه */}
                      {actionsFor === v.number && (
                        <div className="mx-2 mb-2 flex items-center gap-1 rounded-2xl border border-border bg-card p-1.5 shadow-soft animate-fade-up">
                          <ActionButton
                            label="پخش از این آیه"
                            onClick={() => {
                              if (isPlaying && playSurah === surahId && ayah === v.number) {
                                pause();
                              } else {
                                play(surahId, v.number);
                                toast.success(`پخش از آیه ${toPersianDigits(v.number)}`);
                              }
                            }}
                          >
                            <PlayGlyph className="w-4 h-4" />
                          </ActionButton>
                          <ActionButton
                            label="علاقه‌مندی"
                            active={favSet.has(v.number)}
                            onClick={() => {
                              const added = toggleFavorite(surahId, v.number);
                              toast.success(
                                added ? "به علاقه‌مندی‌ها اضافه شد" : "از علاقه‌مندی‌ها حذف شد"
                              );
                            }}
                          >
                            <Heart className={cn("w-4 h-4", favSet.has(v.number) && "fill-current")} />
                          </ActionButton>
                          <ActionButton
                            label="کپی متن"
                            onClick={() => {
                              navigator.clipboard
                                .writeText(`${v.arabic}\n${v.persian}\n(${surah.persianName}: ${toPersianDigits(v.number)})`)
                                .then(() => toast.success("متن آیه کپی شد"));
                            }}
                          >
                            <Copy className="w-4 h-4" />
                          </ActionButton>
                          <ActionButton
                            label="اشتراک‌گذاری"
                            onClick={async () => {
                              const text = `${v.arabic}\n\n${v.persian} — ${surah.persianName}: ${toPersianDigits(v.number)}\n\nاز اپ سکینه`;
                              try {
                                if (navigator.share) {
                                  await navigator.share({ title: "آیه از سکینه", text });
                                } else {
                                  await navigator.clipboard.writeText(text);
                                  toast.success("متن آیه برای اشتراک کپی شد");
                                }
                              } catch {}
                            }}
                          >
                            <Share2 className="w-4 h-4" />
                          </ActionButton>
                          <span className="flex-1" />
                          <ActionButton
                            label="بستن"
                            onClick={() => setActionsFor(null)}
                          >
                            <span className="text-[11px] font-bold px-1">بستن</span>
                          </ActionButton>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-center text-[11px] text-brand-ink-muted mt-10">
                صدق الله العلی العظیم — ترجمه مکارم شیرازی
              </p>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ActionButton({
  children,
  label,
  active,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "w-11 h-11 rounded-xl flex items-center justify-center transition-colors",
        active ? "bg-primary/10 text-primary" : "text-brand-ink-muted hover:bg-secondary"
      )}
    >
      {children}
    </button>
  );
}

