"use client";

import { useState } from "react";
import { usePlayerStore } from "@/store/player";
import { premiumPackages } from "@/data/audio";
import { reciters } from "@/data/audio";
import { cn } from "@/lib/utils";
import { User, Crown, Bell, Palette, Type, Globe, Info, ChevronLeft, Check, X, Volume2, Moon, Sun, Sparkles, Sliders, Gem, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { SakinaLogo } from "@/components/sakina/Logo";

export function ProfilePage() {
  const {
    isPremium,
    purchasedPackages,
    purchasePackage,
    defaultReciterId,
    setDefaultReciter,
    showTranslation,
    setShowTranslation,
    arabicFontSize,
    setArabicFontSize,
    dailyVerseEnabled,
    setDailyVerseEnabled,
    dailyVerseTime,
    setDailyVerseTime,
    theme,
    setTheme,
    hasOnboarded,
    setHasOnboarded,
    resetAll,
  } = usePlayerStore();

  const [showPremium, setShowPremium] = useState(false);
  const [showSettings, setShowSettings] = useState<"audio" | "appearance" | "notifications" | null>(null);

  return (
    <div className="max-w-md mx-auto px-5 pt-10 pb-6">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">پروفایل</h1>
        <p className="text-sm text-muted-foreground mt-1">حساب کاربری و تنظیمات</p>
      </header>

      {/* کارت کاربر - hero */}
      <div className="glass-strong rounded-3xl p-5 mb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-30" style={{
          background: "radial-gradient(circle, rgba(184, 148, 90, 0.4) 0%, transparent 70%)"
        }} />
        <div className="relative flex items-center gap-3">
          <div className="relative w-16 h-16 rounded-3xl overflow-hidden shadow-lg shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 to-emerald-900" />
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-foreground text-lg tracking-tight">کاربر سَکینه</div>
            <div className="text-xs text-muted-foreground">حساب محلی</div>
          </div>
          {isPremium ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full shadow-md">
              <Crown className="w-3.5 h-3.5 text-white" />
              <span className="text-[10px] font-bold text-white">پرمیوم</span>
            </div>
          ) : (
            <button
              onClick={() => setShowPremium(true)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white text-xs rounded-full font-bold shadow-md"
            >
              ارتقا
            </button>
          )}
        </div>
      </div>

      {/* بخش پرمیوم */}
      {!isPremium && (
        <button
          onClick={() => setShowPremium(true)}
          className="w-full mb-4 relative rounded-3xl p-5 text-right overflow-hidden shadow-lg active:scale-[0.98] transition-transform shine"
          style={{ background: "linear-gradient(135deg, #B8945A 0%, #D4B274 50%, #8B5A3C 100%)" }}
        >
          <div className="absolute inset-0 opacity-30" style={{
            background: "radial-gradient(at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 50%)"
          }} />
          <div className="relative flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-base tracking-tight">سَکینه پلاس</h3>
              <p className="text-xs text-white/80 mt-0.5">قاری‌های بیشتر، صداهای اضافه</p>
            </div>
            <ChevronLeft className="w-5 h-5 text-white" />
          </div>
        </button>
      )}

      {/* منوی تنظیمات */}
      <div className="glass rounded-3xl overflow-hidden mb-4">
        <SettingsRow icon={<Volume2 className="w-5 h-5" />} label="تنظیمات صدا" onClick={() => setShowSettings("audio")} />
        <div className="h-px bg-border/40 mx-4" />
        <SettingsRow icon={<Palette className="w-5 h-5" />} label="ظاهر و تم" onClick={() => setShowSettings("appearance")} />
        <div className="h-px bg-border/40 mx-4" />
        <SettingsRow icon={<Bell className="w-5 h-5" />} label="نوتیفیکیشن‌ها" onClick={() => setShowSettings("notifications")} />
        <div className="h-px bg-border/40 mx-4" />
        <SettingsRow icon={<Type className="w-5 h-5" />} label="زبان" value="فارسی" />
        <div className="h-px bg-border/40 mx-4" />
        <SettingsRow icon={<Info className="w-5 h-5" />} label="درباره و پشتیبانی" onClick={() => toast.info("سَکینه نسخه ۴ • ساخته‌شده با عشق")} />
      </div>

      {/* بازنشانی */}
      <button
        onClick={() => {
          if (confirm("همه داده‌ها پاک شود؟")) {
            resetAll();
            toast.success("داده‌ها پاک شد");
          }
        }}
        className="w-full py-3 glass rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-500/5 transition-colors"
      >
        بازنشانی کامل اپ
      </button>

      {/* پاورقی */}
      <div className="text-center mt-8">
        <SakinaLogo size={28} className="mx-auto opacity-30" />
        <p className="text-[10px] text-muted-foreground mt-3 font-medium">سَکینه نسخه ۴.۰.۰</p>
      </div>

      {/* مودال پرمیوم */}
      {showPremium && (
        <PremiumModal
          onClose={() => setShowPremium(false)}
          onPurchase={(id) => {
            purchasePackage(id);
            toast.success("بسته فعال شد!");
            setShowPremium(false);
          }}
          purchasedPackages={purchasedPackages}
        />
      )}

      {/* مودال‌های تنظیمات */}
      {showSettings === "audio" && (
        <SettingsModal title="تنظیمات صدا" onClose={() => setShowSettings(null)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider block mb-2">قاری پیش‌فرض</label>
              <div className="grid grid-cols-2 gap-2">
                {reciters.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setDefaultReciter(r.id)}
                    className={cn(
                      "p-2.5 rounded-2xl flex items-center gap-2 text-right transition-all",
                      defaultReciterId === r.id ? "bg-emerald-600/10 border-2 border-emerald-600" : "glass border-2 border-transparent"
                    )}
                  >
                    <img src={r.image} alt="" className="w-9 h-9 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-foreground truncate">{r.name}</div>
                      <div className="text-[9px] text-muted-foreground">{r.nationality}</div>
                    </div>
                    {defaultReciterId === r.id && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between p-3 glass rounded-2xl">
              <span className="text-sm text-foreground font-medium">نمایش ترجمه</span>
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={cn("w-11 h-6 rounded-full transition-colors", showTranslation ? "bg-emerald-600" : "bg-muted")}
              >
                <div className={cn("w-4 h-4 rounded-full bg-white shadow-sm transition-all mt-1", showTranslation ? "mr-1" : "mr-5")} />
              </button>
            </div>
            <div className="p-3 glass rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground font-medium">اندازه متن عربی</span>
                <span className="text-xs text-muted-foreground font-mono">{arabicFontSize}px</span>
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
        </SettingsModal>
      )}

      {showSettings === "appearance" && (
        <SettingsModal title="ظاهر و تم" onClose={() => setShowSettings(null)}>
          <div className="space-y-2.5">
            {[
              { id: "light" as const, label: "روشن", desc: "پس‌زمینه روشن گرم", icon: Sun },
              { id: "dark" as const, label: "تاریک", desc: "پس‌زمینه تیره عمیق", icon: Moon },
              { id: "system" as const, label: "خودکار", desc: "بر اساس سیستم", icon: Palette },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    if (t.id === "dark") document.documentElement.classList.add("dark");
                    else document.documentElement.classList.remove("dark");
                    toast.success(`تم ${t.label} فعال شد`);
                  }}
                  className={cn(
                    "w-full p-3 rounded-2xl flex items-center gap-3 transition-all text-right",
                    theme === t.id ? "bg-emerald-600/10 border-2 border-emerald-600" : "glass border-2 border-transparent"
                  )}
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-foreground">{t.label}</div>
                    <div className="text-[11px] text-muted-foreground">{t.desc}</div>
                  </div>
                  {theme === t.id && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </SettingsModal>
      )}

      {showSettings === "notifications" && (
        <SettingsModal title="نوتیفیکیشن‌ها" onClose={() => setShowSettings(null)}>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 glass rounded-2xl">
              <div>
                <div className="text-sm font-bold text-foreground">آیه روزانه</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">هر روز یک آیه دریافت کنید</div>
              </div>
              <button
                onClick={() => setDailyVerseEnabled(!dailyVerseEnabled)}
                className={cn("w-11 h-6 rounded-full transition-colors", dailyVerseEnabled ? "bg-emerald-600" : "bg-muted")}
              >
                <div className={cn("w-4 h-4 rounded-full bg-white shadow-sm transition-all mt-1", dailyVerseEnabled ? "mr-1" : "mr-5")} />
              </button>
            </div>
            {dailyVerseEnabled && (
              <div className="p-3 glass rounded-2xl">
                <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider block mb-2">ساعت دریافت</label>
                <input
                  type="time"
                  value={dailyVerseTime}
                  onChange={(e) => setDailyVerseTime(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
            )}
            <button
              onClick={() => {
                if ("Notification" in window) {
                  Notification.requestPermission().then((p) => {
                    if (p === "granted") toast.success("نوتیفیکیشن فعال شد");
                    else toast.error("اجازه داده نشد");
                  });
                }
              }}
              className="w-full py-3 btn-luxury text-white rounded-2xl text-sm font-bold"
            >
              فعال‌سازی نوتیفیکیشن
            </button>
          </div>
        </SettingsModal>
      )}
    </div>
  );
}

function SettingsRow({
  icon,
  label,
  value,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className="w-full flex items-center gap-3 p-4 hover:bg-foreground/5 transition-colors text-right disabled:opacity-70"
    >
      <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
        {icon}
      </div>
      <span className="flex-1 text-sm font-bold text-foreground">{label}</span>
      {value && <span className="text-xs text-muted-foreground">{value}</span>}
      {onClick && <ChevronLeft className="w-4 h-4 text-muted-foreground" />}
    </button>
  );
}

function SettingsModal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-end" onClick={onClose}>
      <div
        className="glass-strong w-full rounded-t-3xl p-5 max-w-md mx-auto max-h-[85vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5 sticky top-0">
          <h3 className="font-bold text-foreground text-lg">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-foreground/5 flex items-center justify-center">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function PremiumModal({
  onClose,
  onPurchase,
  purchasedPackages,
}: {
  onClose: () => void;
  onPurchase: (id: string) => void;
  purchasedPackages: string[];
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-50 flex items-end" onClick={onClose}>
      <div
        className="glass-strong w-full rounded-t-3xl max-w-md mx-auto max-h-[92vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر */}
        <div className="relative p-6 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #062418 0%, #0B3D2E 50%, #14785B 100%)" }}
        >
          <div className="absolute inset-0 opacity-40" style={{
            background: "radial-gradient(at 20% 20%, rgba(184, 148, 90, 0.5) 0%, transparent 50%), radial-gradient(at 80% 80%, rgba(45, 161, 127, 0.4) 0%, transparent 50%)"
          }} />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Crown className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white tracking-tight">سَکینه پلاس</h2>
                <p className="text-xs text-white/70">تجربه کامل قرآن و آرامش</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* بسته‌ها */}
        <div className="p-5 space-y-2.5">
          {premiumPackages.map((pkg) => {
            const purchased = purchasedPackages.includes(pkg.id);
            const isPopular = pkg.popular;
            return (
              <button
                key={pkg.id}
                onClick={() => !purchased && setSelected(pkg.id)}
                className={cn(
                  "w-full p-4 rounded-2xl border-2 text-right transition-all",
                  selected === pkg.id
                    ? "border-emerald-600 bg-emerald-600/5"
                    : isPopular
                    ? "border-amber-500/40 bg-amber-500/5"
                    : "border-border glass",
                  purchased && "opacity-60"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: pkg.color + "20" }}
                    >
                      {pkg.icon === "Crown" ? <Crown className="w-5 h-5" style={{ color: pkg.color }} /> :
                       pkg.icon === "Sparkles" ? <Sparkles className="w-5 h-5" style={{ color: pkg.color }} /> :
                       pkg.icon === "Sliders" ? <Sliders className="w-5 h-5" style={{ color: pkg.color }} /> :
                       pkg.icon === "Moon" ? <Moon className="w-5 h-5" style={{ color: pkg.color }} /> :
                       <Gem className="w-5 h-5" style={{ color: pkg.color }} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                        {pkg.name}
                        {isPopular && (
                          <span className="text-[9px] bg-gradient-to-r from-amber-500 to-amber-700 text-white px-1.5 py-0.5 rounded-full font-bold">
                            محبوب
                          </span>
                        )}
                      </h3>
                      <p className="text-[10px] text-muted-foreground">{pkg.description}</p>
                    </div>
                  </div>
                  {purchased ? (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> فعال
                    </span>
                  ) : (
                    <div className="text-left">
                      <div className="text-sm font-extrabold text-foreground">
                        {pkg.price.toLocaleString("fa-IR")}
                      </div>
                      <div className="text-[10px] text-muted-foreground">تومان</div>
                      {pkg.originalPrice && (
                        <div className="text-[10px] text-muted-foreground line-through">
                          {pkg.originalPrice.toLocaleString("fa-IR")}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <ul className="text-[11px] text-muted-foreground space-y-1 mt-2">
                  {pkg.features.slice(0, 4).map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 mt-0.5">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                  {pkg.features.length > 4 && (
                    <li className="text-emerald-700 dark:text-emerald-400 font-medium">+ {pkg.features.length - 4} مورد دیگر</li>
                  )}
                </ul>
              </button>
            );
          })}
        </div>

        {/* دکمه خرید */}
        <div className="sticky bottom-0 glass-strong border-t border-border p-4">
          {selected ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full py-3.5 btn-luxury text-white rounded-2xl font-bold"
            >
              خرید بسته انتخابی
            </button>
          ) : (
            <p className="text-center text-xs text-muted-foreground">یک بسته را انتخاب کنید</p>
          )}
        </div>

        {/* تأیید خرید */}
        {showConfirm && selected && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[60] flex items-center justify-center p-5" onClick={() => setShowConfirm(false)}>
            <div className="glass-strong rounded-3xl p-6 max-w-sm w-full animate-fade-in-scale" onClick={(e) => e.stopPropagation()}>
              <div className="text-center mb-5">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center mb-3 shadow-lg">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-foreground text-lg">تأیید خرید</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {premiumPackages.find((p) => p.id === selected)?.name}
                </p>
                <p className="text-3xl font-extrabold text-foreground mt-3 tracking-tight">
                  {premiumPackages.find((p) => p.id === selected)?.price.toLocaleString("fa-IR")}
                  <span className="text-sm text-muted-foreground font-normal"> تومان</span>
                </p>
              </div>
              <div className="bg-muted/50 rounded-2xl p-3 mb-4 text-xs text-muted-foreground text-center">
                در نسخه دمو، خرید شبیه‌سازی می‌شود
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 bg-muted text-foreground rounded-2xl font-bold"
                >
                  انصراف
                </button>
                <button
                  onClick={() => { onPurchase(selected); setShowConfirm(false); }}
                  className="flex-1 py-3 btn-luxury text-white rounded-2xl font-bold"
                >
                  تأیید
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
