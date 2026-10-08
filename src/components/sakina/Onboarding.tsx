"use client";

import { useState } from "react";
import { reciters } from "@/data/audio";
import { usePlayerStore } from "@/store/player";
import { SakinaLogo } from "@/components/sakina/Logo";
import { cn } from "@/lib/utils";
import { ChevronLeft, Play, Bell, Sparkles } from "lucide-react";

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const { setDefaultReciter, setHasOnboarded } = usePlayerStore();
  const [step, setStep] = useState(0);
  const [selectedReciter, setSelectedReciter] = useState("abdulbasit");
  const [enableNotifications, setEnableNotifications] = useState(true);

  const handleComplete = () => {
    setDefaultReciter(selectedReciter);
    setHasOnboarded(true);
    if (enableNotifications && "Notification" in window) {
      Notification.requestPermission();
    }
    onComplete();
  };

  // اسپلش
  if (step === 0) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center"
        style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F2EDE4 100%)" }}
        onClick={() => setStep(1)}
      >
        <div className="animate-fade-in flex flex-col items-center">
          <div className="animate-glow rounded-full p-6">
            <SakinaLogo size={120} />
          </div>
          <h1 className="text-4xl font-bold text-foreground mt-6" style={{ fontFamily: "var(--font-sans)" }}>
            سَکینه
          </h1>
          <p className="text-sm text-muted-foreground mt-2">قرآن و آرامش</p>
          <div className="wave-bars mt-8 scale-150">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
      </div>
    );
  }

  // اسلایدهای معرفی
  if (step === 1 || step === 2) {
    const slides = [
      {
        title: "قرآن با صدای دلخواهت",
        desc: "بین قاری‌های ایرانی و بین‌المللی انتخاب کن، تلاوت رو آیه‌به‌آیه گوش بده",
        bg: "linear-gradient(135deg, #0F5132 0%, #1A6B47 100%)",
        image: "/images/collections/quran-book.jpg",
      },
      {
        title: "میکسر صداهای آرامش‌بخش",
        desc: "باران، آتش، امواج... صداهای طبیعت رو با تلاوت ترکیب کن و ترکیب دلخواهت رو بساز",
        bg: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)",
        image: "/images/collections/night.jpg",
      },
    ];
    const slide = slides[step - 1];

    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center p-8 text-center text-white"
        style={{ background: slide.bg }}
      >
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 30% 30%, #C9A961 0%, transparent 50%), radial-gradient(circle at 70% 70%, #C9A961 0%, transparent 50%)"
        }} />
        <div className="relative max-w-xs">
          <div className="relative w-40 h-40 mx-auto mb-8 rounded-3xl overflow-hidden shadow-2xl animate-fade-in-scale">
            <img src={slide.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <h2 className="text-2xl font-bold mb-3">{slide.title}</h2>
          <p className="text-sm text-white/80 leading-relaxed mb-12">{slide.desc}</p>
          <div className="flex items-center justify-center gap-2 mb-8">
            {slides.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === step - 1 ? "w-8 bg-accent" : "w-1.5 bg-white/30"
                )}
              />
            ))}
          </div>
          <button
            onClick={() => setStep(step + 1)}
            className="w-full py-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            ادامه
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setStep(3)}
            className="mt-3 text-xs text-white/60"
          >
            رد کردن
          </button>
        </div>
      </div>
    );
  }

  // انتخاب قاری پیش‌فرض
  if (step === 3) {
    return (
      <div className="fixed inset-0 bg-background overflow-y-auto">
        <div className="max-w-md mx-auto p-5 pt-10">
          <h2 className="text-2xl font-bold text-foreground mb-2">قاری پیش‌فرض خودت رو انتخاب کن</h2>
          <p className="text-sm text-muted-foreground mb-6">
            بعداً هم می‌تونی عوضش کنی
          </p>

          <div className="space-y-2 mb-6">
            {reciters.map((r) => (
              <button
                key={r.id}
                onClick={() => !r.premium && setSelectedReciter(r.id)}
                disabled={r.premium}
                className={cn(
                  "w-full p-3 rounded-2xl flex items-center gap-3 text-right transition-all",
                  selectedReciter === r.id
                    ? "bg-primary/10 border-2 border-primary"
                    : "bg-card border border-border",
                  r.premium && "opacity-50"
                )}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                  style={{ backgroundColor: r.color }}
                >
                  {r.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    {r.name}
                    {r.premium && <span className="text-[9px] bg-accent/20 text-accent-foreground px-1.5 py-0.5 rounded-full">پرمیوم</span>}
                  </div>
                  <div className="text-xs text-muted-foreground">{r.nationality}</div>
                  <div className="text-[10px] text-muted-foreground/70 line-clamp-1">{r.description}</div>
                </div>
                {selectedReciter === r.id && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 20 20" fill="white" className="w-3 h-3">
                      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0z" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep(4)}
            className="w-full py-3 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            ادامه
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // نوتیفیکیشن
  if (step === 4) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Bell className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">آیه روزانه دریافت کن</h2>
        <p className="text-sm text-muted-foreground mb-8 max-w-xs leading-relaxed">
          هر روز یک آیه زیبا از قرآن با تلاوت دلنشین دریافت کن تا روزت با نور شروع شه
        </p>

        <div className="w-full max-w-xs space-y-3">
          <button
            onClick={handleComplete}
            className="w-full py-3 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            <Bell className="w-4 h-4" />
            بله، آره فعال کن
          </button>
          <button
            onClick={() => {
              setEnableNotifications(false);
              handleComplete();
            }}
            className="w-full py-3 bg-muted text-foreground rounded-2xl font-medium"
          >
            شاید بعداً
          </button>
        </div>

        <p className="text-[10px] text-muted-foreground/60 mt-6 max-w-xs">
          می‌تونی بعداً از تنظیمات این گزینه رو تغییر بدی
        </p>
      </div>
    );
  }

  return null;
}
