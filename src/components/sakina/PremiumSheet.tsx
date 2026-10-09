"use client";

/**
 * شیت پریمیوم — مزایا + بسته‌های قیمتی (فعال‌سازی واقعی در فاز ۳)
 */

import { motion, AnimatePresence } from "framer-motion";
import { premiumPackages } from "@/data/audio";
import { toPersianDigits } from "@/data/verses";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Check, Crown, X } from "lucide-react";

const BENEFITS = [
  "بیش از ۱۰۰ قاری منتخب جهان",
  "کیفیت ۱۹۲k و دانلود آفلاین نامحدود",
  "میکسر کامل سه‌لایه + همه پریست‌ها",
  "تایمر خواب پیشرفته + تم‌های برنزی",
  "بدون تبلیغ — همیشه، حتی در نسخه رایگان",
];

export function PremiumSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[85] bg-black/40 flex items-end"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.34, ease: [0.32, 0.72, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-card rounded-t-3xl p-6 pb-8 max-h-[90vh] overflow-y-auto nice-scroll"
          >
            <div className="w-10 h-1 rounded-full bg-border mx-auto mb-5" />

            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-bl from-[#C9A45C] to-[#A2813F] text-white flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Crown className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black">سکینه پریمیوم</h2>
              <p className="text-xs text-brand-ink-muted mt-2 leading-6">
                تجربه کامل — بدون اینکه متن قرآن هرگز قفل شود
              </p>
            </div>

            <ul className="space-y-2.5 mb-6">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-3 text-[13px]">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {premiumPackages.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() =>
                    toast.success("انتخاب شد!", {
                      description: "پرداخت در فاز انتشار فعال می‌شود — فعلاً رایگان لذت ببر",
                    })
                  }
                  className={cn(
                    "relative rounded-2xl border p-3.5 text-center transition-all min-h-24",
                    i === 0
                      ? "border-primary bg-primary/5 shadow-primary"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  {i === 0 && (
                    <span className="absolute -top-2 right-1/2 translate-x-1/2 text-[9px] font-black bg-primary text-primary-foreground rounded-full px-2 py-0.5 whitespace-nowrap">
                      پیشنهاد ما
                    </span>
                  )}
                  <div className="text-[11px] font-bold text-brand-ink-muted leading-4 line-clamp-1">
                    {p.name}
                  </div>
                  <div className="text-sm font-black mt-1.5 text-primary">
                    {toPersianDigits(p.price.toLocaleString("en-US"))}
                  </div>
                  <div className="text-[10px] text-brand-ink-muted mt-0.5">تومان</div>
                  <div className="text-[9px] text-brand-ink-muted mt-1 leading-4 line-clamp-2">
                    {p.description}
                  </div>
                </button>
              ))}
            </div>

            <p className="text-[10px] text-brand-ink-muted text-center leading-5 mb-4">
              تریال ۷ روزه بعد از ساخت اولین میکس — لغو هر زمان، بدون سوال
            </p>

            <button
              onClick={() => onOpenChange(false)}
              aria-label="بستن"
              className="w-full h-11 rounded-2xl border border-border text-brand-ink-muted text-xs font-bold flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              فعلاً نه، ممنون
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
