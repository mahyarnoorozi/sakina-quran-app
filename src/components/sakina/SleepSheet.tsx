"use client";

/**
 * حالت خواب — فلو ۳ لمسی: قاری (پیش‌فرض) + صدای شب + تایمر (پیش‌فرض ۳۰) → پخش
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { soundNameOf } from "@/data/audio";
import { usePlayerStore } from "@/store/player";
import { toPersianDigits } from "@/data/verses";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Moon } from "lucide-react";
import { PlayGlyph } from "./PlayPauseIcon";

const SLEEP_SOUNDS = ["rain-light", "ocean-waves", "fire-camp", "forest-birds"];
const SLEEP_SURAHS = [112, 36, 67, 55];

export function SleepSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const { play, setAmbient, setAmbientVolume, startSleepTimer } = usePlayerStore();
  const [sound, setSound] = useState(SLEEP_SOUNDS[0]);
  const [surah, setSurah] = useState(SLEEP_SURAHS[0]);
  const [timer, setTimer] = useState(30);

  const start = () => {
    setAmbient(sound);
    setAmbientVolume(45);
    play(surah, 1);
    startSleepTimer(timer);
    onOpenChange(false);
  };

  const soundName = (id: string) => soundNameOf(id);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/50 flex items-end"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.36, ease: [0.32, 0.72, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-card rounded-t-3xl p-6 pb-9"
          >
            <div className="w-10 h-1 rounded-full bg-border mx-auto mb-6" />

            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-bl from-[#31594D] to-[#101513] text-[#C9A45C] flex items-center justify-center mx-auto mb-3">
                <Moon className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-black">حالت خواب</h2>
              <p className="text-xs text-brand-ink-muted mt-1.5">
                در پایان تایمر، صدا طی ۹۰ ثانیه محو می‌شود
              </p>
            </div>

            {/* سوره */}
            <div className="mb-4">
              <div className="text-xs font-bold text-brand-ink-muted mb-2">تلاوت</div>
              <div className="grid grid-cols-4 gap-2">
                {SLEEP_SURAHS.map((id) => {
                  const active = surah === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setSurah(id)}
                      className={cn(
                        "h-11 rounded-xl border text-xs font-bold transition-all",
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-brand-ink-muted"
                      )}
                    >
                      {id === 112 ? "اخلاص" : id === 36 ? "یس" : id === 67 ? "ملک" : "رحمن"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* صدا */}
            <div className="mb-4">
              <div className="text-xs font-bold text-brand-ink-muted mb-2">صدای شب</div>
              <div className="flex gap-2 flex-wrap">
                {SLEEP_SOUNDS.map((id) => {
                  const active = sound === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setSound(id)}
                      className={cn(
                        "h-9 px-4 rounded-full text-[11px] font-bold border transition-all",
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-brand-ink-muted"
                      )}
                    >
                      {soundName(id)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* تایمر */}
            <div className="mb-6">
              <div className="text-xs font-bold text-brand-ink-muted mb-2">تایمر</div>
              <div className="grid grid-cols-4 gap-2">
                {[15, 30, 45, 60].map((m) => (
                  <button
                    key={m}
                    onClick={() => setTimer(m)}
                    className={cn(
                      "h-10 rounded-xl border text-xs font-black tabular-nums transition-all",
                      timer === m
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-brand-ink-muted"
                    )}
                  >
                    {toPersianDigits(m)}′
                  </button>
                ))}
              </div>
            </div>

            <Button size="lg" className="w-full h-12 rounded-2xl text-base" onClick={start}>
              <PlayGlyph className="w-5 h-5" />
              شب آرام شروع شود
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
