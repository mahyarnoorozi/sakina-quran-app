"use client";

/**
 * پلیر تمام‌صفحه — الگوی Quranify با هویت سکینه
 * glow گرادیانی + عکس قاری محو، کارت قاری با آواتار، نوار پیشرفت قابل‌کشیدن،
 * کنترل‌های رسپانسیو (clamp) با safe-area، گلیف‌های دقیقاً وسط‌چین.
 * سوایپ پایین می‌بندد بدون توقف پخش.
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { surahs } from "@/data/quran";
import { reciters } from "@/data/audio";
import { getVerses, toPersianDigits, type Verse } from "@/data/verses";
import { usePlayerStore } from "@/store/player";
import { useLibraryStore } from "@/store/library";
import { AudioEngine } from "@/lib/audio-engine";
import { ReciterSheet } from "./ReciterSheet";
import { cn } from "@/lib/utils";
import {
  AudioWaveform, ChevronDown, Clock, Heart, Repeat, Repeat1, RotateCcw,
  SkipBack, SkipForward, UserRound, Gauge,
} from "lucide-react";
import { PauseGlyph, PlayGlyph } from "./PlayPauseIcon";

const SPEEDS = [0.75, 1, 1.25];

export function PlayerFull() {
  const {
    isPlaying, surahId, ayah, reciterId, repeatMode, playbackSpeed,
    sleepTimer, expanded, setExpanded, toggle, nextAyah, prevAyah,
    cycleRepeat, setPlaybackSpeed, setMixerOpen,
  } = usePlayerStore();

  const [verses, setVerses] = useState<Verse[] | null>(null);
  const [reciterSheet, setReciterSheet] = useState(false);
  const [progress, setProgress] = useState({ current: 0, duration: 0 });
  const [scrub, setScrub] = useState<number | null>(null);
  const dragControls = useDragControls();

  const surah = surahs.find((s) => s.id === surahId);
  const reciter = reciters.find((r) => r.id === reciterId);
  const verse = verses?.[ayah - 1] ?? null;

  const fav = useLibraryStore((s) =>
    s.favorites.some((f) => f.surahId === surahId && f.ayah == null)
  );
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite);

  // لود متن سوره جاری
  useEffect(() => {
    if (!expanded) return;
    let alive = true;
    getVerses(surahId).then((v) => alive && setVerses(v));
    return () => {
      alive = false;
    };
  }, [surahId, expanded]);

  // پروگرس و تایمر باقیمانده — ۲۵۰ms برای حس آنیِ seek
  useEffect(() => {
    if (!expanded) return;
    const t = setInterval(() => {
      const p = AudioEngine.progress;
      if (p.surahId === surahId) setProgress({ current: p.currentTime, duration: p.duration });
    }, 250);
    return () => clearInterval(t);
  }, [expanded, surahId]);

  const fmt = (s: number) => {
    if (!s || !isFinite(s)) return "۰:۰۰";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${toPersianDigits(m)}:${toPersianDigits(String(sec).padStart(2, "0"))}`;
  };

  const pct = scrub ?? (progress.duration > 0 ? (progress.current / progress.duration) * 100 : 0);

  const skip = (sec: number) => {
    AudioEngine.seekBy(sec);
    // بازخورد آنی در UI — بدون منتظر ماندن برای تیک بعدی
    setProgress((p) => ({
      ...p,
      current: Math.min(Math.max(0, p.current + sec), p.duration || p.current + sec),
    }));
  };

  /** دکمه قبلی هوشمند: بالای ۳ ثانیه → از اول آیه؛ وگرنه آیه قبل (الگوی پلیرهای استاندارد) */
  const smartPrev = () => {
    if (progress.current > 3) {
      AudioEngine.seekAyahStart();
      setProgress((p) => ({ ...p, current: 0 }));
    } else {
      prevAyah();
    }
  };

  if (!expanded) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="player-full"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.4 }}
        dragListener={false}
        dragControls={dragControls}
        onDragEnd={(_, info) => {
          if (info.offset.y > 110) setExpanded(false);
        }}
        className="player-stage fixed inset-0 z-[70] flex flex-col stage-ink"
        style={{ position: "fixed", top: 0, bottom: 0, left: 0, right: 0, zIndex: 70 }}
      >
        {reciter?.image && (
          <img src={reciter.image} alt="" className="stage-photo" aria-hidden />
        )}

        {/* ستون محتوایی — روی دسکتاپ وسط، روی موبایل تمام‌عرض؛ در لنداسکیپ پهن‌تر */}
        <div
          className="player-content relative mx-auto flex w-full max-w-lg flex-1 flex-col min-h-0"
          style={{
            paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)",
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 18px)",
          }}
        >
          {/* هدر — ناحیه درگ برای بستن با سوایپ پایین */}
          <div
            className="flex items-center justify-between px-1 shrink-0 touch-none"
            onPointerDown={(e) => {
              if (e.pointerType === "mouse" && e.button !== 0) return;
              dragControls.start(e);
            }}
          >
            <button
              onClick={() => setExpanded(false)}
              aria-label="بستن پلیر"
              className="glass w-11 h-11 rounded-full flex items-center justify-center transition-colors shrink-0"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
            <div className="text-center min-w-0 px-2">
              <div className="text-[10px] font-semibold stage-ink-muted tracking-wide">
                در حال پخش
              </div>
              <div className="text-[15px] font-black truncate">{surah?.arabicName}</div>
            </div>
            <button
              onClick={() => setMixerOpen(true)}
              aria-label="میکسر صدا"
              className="glass w-11 h-11 rounded-full flex items-center justify-center transition-colors shrink-0"
            >
              <AudioWaveform className="w-5 h-5" />
            </button>
          </div>

          {/* آیه زنده + کنترل‌ها — در صفحه‌های کوتاه (لنداسکیپ) دو ستونه می‌شود */}
          <div className="player-cols flex flex-1 min-h-0 flex-col">
          {/* آیه زنده — فضای منعطف و قابل اسکرول در صفحه‌های کوتاه */}
          <div className="verse-col flex-1 min-h-0 flex flex-col items-center justify-center px-5 text-center overflow-y-auto nice-scroll py-4">
            {verse ? (
              <>
                <p
                  key={ayah}
                  className="font-quran animate-fade-in max-w-xl"
                  style={{ fontSize: "clamp(21px, 5.8vw, 28px)", lineHeight: 2.1 }}
                >
                  {verse.arabic}
                </p>
                <p
                  className="mt-4 stage-translation leading-7 max-w-md"
                  style={{ fontSize: "clamp(12px, 3.4vw, 14px)" }}
                >
                  {verse.persian}
                </p>
              </>
            ) : (
              <div className="animate-pulse stage-ink-muted text-sm">در حال بارگذاری آیه…</div>
            )}
            <div className="mt-5 inline-flex shrink-0 items-center gap-2 text-[11px] font-semibold text-brand-brass glass rounded-full px-4 py-1.5">
              آیه {toPersianDigits(ayah)} از {toPersianDigits(surah?.versesCount ?? 0)}
            </div>
          </div>

          {/* ستون کنترل‌ها */}
          <div className="controls-col flex flex-col shrink-0">
          {/* کارت قاری — الگوی Quranify */}
          <div className="glass rounded-2xl p-2.5 flex items-center gap-3 mx-1 shrink-0">
            {reciter?.image ? (
              <img
                src={reciter.image}
                alt=""
                className="w-11 h-11 rounded-full object-cover shrink-0 border border-border"
              />
            ) : (
              <span className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <UserRound className="w-5 h-5 stage-ink-muted" />
              </span>
            )}
            <div className="flex-1 min-w-0 text-right">
              <div className="text-[13px] font-bold truncate">
                {surah?.arabicName} · آیه {toPersianDigits(ayah)}
              </div>
              <div className="text-[11px] stage-ink-muted truncate">{reciter?.name}</div>
            </div>
            <button
              onClick={() => toggleFavorite(surahId)}
              aria-label={fav ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
              aria-pressed={fav}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
                fav ? "text-brand-brass bg-brand-brass/15" : "stage-ink-muted hover:bg-secondary/60"
              )}
            >
              <Heart className={cn("w-5 h-5", fav && "fill-current")} />
            </button>
          </div>

          {/* پیشرفت قابل‌کشیدن */}
          <div className="px-5 mt-4 shrink-0">
            <SeekBar pct={pct} onScrub={setScrub} onCommit={(r) => AudioEngine.seekToRatio(r)} />
            <div className="flex justify-between mt-1.5 text-[10px] tabular-nums stage-ink-muted">
              <span>{fmt(progress.current)}</span>
              <span>{fmt(progress.duration)}</span>
            </div>
          </div>

          {/* کنترل‌های اصلی */}
          <div className="px-4 mt-2 shrink-0">
            <div className="flex items-center justify-between gap-1">
              <button
                onClick={smartPrev}
                aria-label="آیه قبل"
                className="w-12 h-12 shrink-0 rounded-full flex items-center justify-center stage-ink hover:bg-secondary/60 active:scale-95 transition-transform"
              >
                <SkipBack className="w-[22px] h-[22px]" />
              </button>
              <button
                onClick={() => skip(-10)}
                aria-label="۱۰ ثانیه عقب"
                className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center stage-ink-muted hover:bg-secondary/60 active:scale-95 transition-transform"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={toggle}
                aria-label={isPlaying ? "توقف" : "پخش"}
                className="gold-cta rounded-full flex items-center justify-center active:scale-95 transition-transform shadow-glow shrink-0"
                style={{
                  width: "clamp(64px, 18vw, 78px)",
                  height: "clamp(64px, 18vw, 78px)",
                }}
              >
                {isPlaying ? (
                  <PauseGlyph className="w-8 h-8" />
                ) : (
                  <PlayGlyph className="w-8 h-8" />
                )}
              </button>
              <button
                onClick={() => skip(10)}
                aria-label="۱۰ ثانیه جلو"
                className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center stage-ink-muted hover:bg-secondary/60 active:scale-95 transition-transform"
              >
                <RotateCcw className="w-5 h-5 scale-x-[-1]" />
              </button>
              <button
                onClick={nextAyah}
                aria-label="آیه بعد"
                className="w-12 h-12 shrink-0 rounded-full flex items-center justify-center stage-ink hover:bg-secondary/60 active:scale-95 transition-transform"
              >
                <SkipForward className="w-[22px] h-[22px]" />
              </button>
            </div>
          </div>

          {/* ردیف ثانویه — تک‌خطیِ قابل اسکرول (رسپانسیو در همه عرض‌ها) */}
          <div
            className="mt-4 flex items-center gap-2 px-4 shrink-0 overflow-x-auto no-scrollbar fade-x"
            role="group"
            aria-label="تنظیمات پخش"
          >
            <PillButton
              active={repeatMode !== "off"}
              onClick={cycleRepeat}
              label={
                repeatMode === "one"
                  ? "تکرار آیه"
                  : repeatMode === "surah"
                    ? "تکرار سوره"
                    : "تکرار خاموش"
              }
            >
              {repeatMode === "one" ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
              <span className="text-[11px]">
                {repeatMode === "one" ? "تکرار آیه" : repeatMode === "surah" ? "تکرار سوره" : "تکرار"}
              </span>
            </PillButton>

            <PillButton
              active={playbackSpeed !== 1}
              onClick={() =>
                setPlaybackSpeed(SPEEDS[(SPEEDS.indexOf(playbackSpeed) + 1) % SPEEDS.length])
              }
              label="سرعت پخش"
            >
              <Gauge className="w-4 h-4" />
              <span className="text-[11px] tabular-nums">
                {toPersianDigits(playbackSpeed)}×
              </span>
            </PillButton>

            <PillButton
              active={!!sleepTimer.minutes}
              onClick={() => {
                if (sleepTimer.minutes) {
                  usePlayerStore.getState().cancelSleepTimer();
                } else {
                  usePlayerStore.getState().startSleepTimer(30);
                }
              }}
              label="تایمر خواب"
            >
              <Clock className="w-4 h-4" />
              <span className="text-[11px] tabular-nums">
                {sleepTimer.minutes && sleepTimer.endsAt
                  ? fmtTime(sleepTimer.endsAt - Date.now())
                  : "خواب"}
              </span>
            </PillButton>

            <PillButton onClick={() => setReciterSheet(true)} label="تغییر قاری">
              <UserRound className="w-4 h-4" />
              <span className="text-[11px] max-w-24 truncate">{reciter?.name}</span>
            </PillButton>
          </div>
          </div>{/* /controls-col */}
          </div>{/* /player-cols */}
        </div>

        <ReciterSheet open={reciterSheet} onOpenChange={setReciterSheet} />
      </motion.div>
    </AnimatePresence>
  );
}

/** نوار پیشرفت قابل‌کشیدن — RTL: پرشدن از راست به چپ */
function SeekBar({
  pct,
  onScrub,
  onCommit,
}: {
  pct: number;
  onScrub: (r: number | null) => void;
  onCommit: (ratio: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const lastRatio = useRef(0);

  const ratioFrom = (clientX: number) => {
    const el = ref.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const r = (rect.right - clientX) / rect.width;
    return Math.min(1, Math.max(0, r));
  };

  return (
    <div
      ref={ref}
      role="slider"
      aria-label="پیشرفت آیه"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      className="relative h-6 flex items-center cursor-pointer touch-none select-none"
      onPointerDown={(e) => {
        setDragging(true);
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        const r = ratioFrom(e.clientX);
        lastRatio.current = r;
        onScrub(r * 100);
      }}
      onPointerMove={(e) => {
        if (!dragging) return;
        const r = ratioFrom(e.clientX);
        lastRatio.current = r;
        onScrub(r * 100);
      }}
      onPointerUp={() => {
        if (!dragging) return;
        setDragging(false);
        onCommit(lastRatio.current);
        onScrub(null);
      }}
      onPointerCancel={() => {
        setDragging(false);
        onScrub(null);
      }}
    >
      <div className="relative w-full h-[5px] rounded-full seek-track">
        <div
          className="absolute top-0 bottom-0 right-0 rounded-full seek-fill"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ right: `calc((100% - 14px) * ${pct} / 100)` }}
        >
          <span
            className={cn(
              "block w-[14px] h-[14px] rounded-full seek-thumb",
              dragging ? "scale-125" : "scale-100"
            )}
          />
        </div>
      </div>
    </div>
  );
}

function fmtTime(ms: number) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${toPersianDigits(m)}:${toPersianDigits(String(s).padStart(2, "0"))}`;
}

function PillButton({
  children,
  active,
  onClick,
  label,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-3.5 h-9 border transition-colors shrink-0",
        active
          ? "border-brand-brass/60 bg-brand-brass/15 text-brand-brass"
          : "border-border bg-secondary/60 stage-ink-muted hover:bg-secondary"
      )}
    >
      {children}
    </button>
  );
}

/* ===== شیت تایمر خواب (فلوهای دیگر) ===== */

const TIMER_OPTIONS = [15, 30, 45, 60];

export function SleepTimerSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const { startSleepTimer, cancelSleepTimer, sleepTimer } = usePlayerStore();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-black/40 flex items-end"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-card rounded-t-3xl p-5 pb-8 text-foreground"
          >
            <div className="w-10 h-1 rounded-full bg-border mx-auto mb-5" />
            <h3 className="text-base font-black mb-1">تایمر خواب</h3>
            <p className="text-xs text-brand-ink-muted mb-5 leading-6">
              در پایان زمان، صدا طی ۹۰ ثانیه به‌نرمی محو می‌شود — قطع ناگهانی نداریم.
            </p>
            <div className="grid grid-cols-4 gap-2">
              {TIMER_OPTIONS.map((m) => {
                const active = sleepTimer.minutes === m;
                return (
                  <button
                    key={m}
                    onClick={() => {
                      startSleepTimer(m);
                      onOpenChange(false);
                    }}
                    className={cn(
                      "h-16 rounded-2xl border text-center transition-all",
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-secondary hover:border-primary/40"
                    )}
                  >
                    <div className="text-lg font-black tabular-nums">{toPersianDigits(m)}</div>
                    <div className="text-[10px] text-brand-ink-muted">دقیقه</div>
                  </button>
                );
              })}
            </div>
            {sleepTimer.minutes && (
              <button
                onClick={() => {
                  cancelSleepTimer();
                  onOpenChange(false);
                }}
                className="mt-4 w-full h-11 rounded-2xl border border-destructive/40 text-destructive text-sm font-bold"
              >
                لغو تایمر فعال
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
