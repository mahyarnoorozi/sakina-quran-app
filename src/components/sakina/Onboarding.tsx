"use client";

/**
 * آنبوردینگ سکینه — اسپلش + ۳ اسلاید + انتخاب قاری
 * هیچ مسیر بدون شخصی‌سازی وجود ندارد؛ رد کردن اسلایدها هم به انتخاب قاری می‌رسد.
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { reciters } from "@/data/audio";
import { useSettingsStore } from "@/store/settings";
import { usePlayerStore } from "@/store/player";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, Volume2 } from "lucide-react";
import { toast } from "sonner";

const SLIDES = [
  {
    title: "آرامش با قرآن",
    body: "سکینه جای نفس‌کشیدن است؛ تلاوت، طبیعت و سکوت در یک فضای شخصی و آرام.",
    emoji: "﴾",
  },
  {
    title: "صدای باکیفیت، آفلاین",
    body: "تلاوت با بالاترین کیفیت ممکن و دانلود آفلاین سوره‌های مورد علاقه‌ات.",
    emoji: "◈",
  },
  {
    title: "فقط برای تو",
    body: "حالت خواب، میکسر صدا و آیه‌ی روز — سکینه را به عادت آرام روزانه‌ات تبدیل کن.",
    emoji: "✦",
  },
];

export function Onboarding({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"splash" | "slides" | "reciter">("splash");
  const [slide, setSlide] = useState(0);
  const [reciter, setReciter] = useState<string>("abdulbasit");

  // اسپلش فقط ~۱٫۲ ثانیه — بعد خودکار به اسلایدها
  useEffect(() => {
    if (phase !== "splash") return;
    const t = setTimeout(() => setPhase("slides"), 1300);
    return () => clearTimeout(t);
  }, [phase]);

  const setOnboardingDone = useSettingsStore((s) => s.setOnboardingDone);
  const setDefaultReciter = usePlayerStore((s) => s.setReciter);

  const freeReciters = reciters.filter((r) => !r.premium).slice(0, 6);

  const finish = () => {
    setDefaultReciter(reciter);
    setOnboardingDone(true);
    toast.success("سکینه آماده است؛ جایی برای نفس کشیدن", {
      icon: <Volume2 className="w-4 h-4" />,
    });
  };

  if (phase === "splash") {
    return (
      <div
        className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
        onClick={() => setPhase("slides")}
      >
        <div className="animate-fade-in">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <Logo size={92} />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-8 text-center text-sm text-brand-ink-muted"
          >
            پناهگاه آرام تو، برای هر لحظه‌ی روز
          </motion.p>
        </div>
      </div>
    );
  }

  if (phase === "slides") {
    const s = SLIDES[slide];
    const photos = ["/images/collections/night.jpg", "/images/collections/quran-book.jpg", "/images/collections/sunrise.jpg"];
    return (
      <div className="fixed inset-0 z-[100] bg-background flex flex-col safe-bottom">
        <div className="flex justify-end p-5">
          <button
            onClick={() => setPhase("reciter")}
            className="text-sm text-brand-ink-muted hover:text-foreground min-h-11 px-3"
          >
            رد کردن
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-sm"
            >
              <div className="photo-card rounded-[32px] overflow-hidden shadow-elevated">
                { }
                <img src={photos[slide]} alt="" className="w-full h-64 object-cover opacity-85" />
                <div className="relative p-6 pt-8 min-h-[190px] flex flex-col items-center justify-end">
                  <div className="text-4xl text-brand-brass mb-4 font-quran">{s.emoji}</div>
                  <h1 className="text-2xl font-black text-white mb-3">{s.title}</h1>
                  <p className="text-[13px] text-white/75 leading-7">{s.body}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="pb-10 flex flex-col items-center gap-8">
          <div className="flex gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`اسلاید ${i + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all duration-300 min-h-2 min-w-2",
                  i === slide ? "w-7 bg-brand-brass" : "w-2 bg-border"
                )}
              />
            ))}
          </div>
          <div className="w-full max-w-xs px-4">
            <Button
              size="lg"
              className="w-full h-12 rounded-2xl text-base gold-cta border-0"
              onClick={() =>
                slide < SLIDES.length - 1 ? setSlide(slide + 1) : setPhase("reciter")
              }
            >
              {slide < SLIDES.length - 1 ? "ادامه" : "شروع کنیم"}
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col safe-bottom">
      <div className="pt-14 pb-4 text-center px-6">
        <Logo size={56} withText={false} className="scale-90" />
        <h1 className="text-2xl font-black mt-5">صدای دلخواهت را انتخاب کن</h1>
        <p className="text-sm text-brand-ink-muted mt-2 leading-7">
          قاری پیش‌فرض تلاوت‌هایت — هر وقت بخواهی قابل تغییر است
        </p>
      </div>

      <div className="flex-1 overflow-y-auto nice-scroll px-5 pb-4">
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          {freeReciters.map((r) => {
            const selected = reciter === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setReciter(r.id)}
                className={cn(
                  "relative rounded-2xl border p-3 text-right transition-all duration-200 min-h-[110px]",
                  selected
                    ? "border-brand-brass/70 bg-brand-brass/5 shadow-glow"
                    : "border-border bg-card hover:border-primary/40"
                )}
              >
                {selected && (
                  <span className="absolute top-3 left-3 flex items-center justify-center w-5 h-5 rounded-full bg-brand-brass text-[#14100A]">
                    <Check className="w-3 h-3" />
                  </span>
                )}
                <div className="relative w-12 h-12 rounded-full overflow-hidden mb-3">
                  { }
                  <img
                    src={r.image}
                    alt={r.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="text-sm font-bold leading-5">{r.name}</div>
                <div className="text-[11px] text-brand-ink-muted mt-1 line-clamp-2 leading-4">
                  {r.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5 border-t border-border">
        <div className="max-w-xs mx-auto">
          <Button
            size="lg"
            className="w-full h-12 rounded-2xl text-base gold-cta border-0"
            onClick={finish}
          >
            وارد سکینه شو
          </Button>
        </div>
      </div>
    </div>
  );
}
