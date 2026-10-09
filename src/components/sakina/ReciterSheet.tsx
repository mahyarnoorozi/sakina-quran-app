"use client";

/**
 * شیت انتخاب قاری — پیش‌فرض ۵ قاری رایگان؛ قاری‌های ویژه با نشان برنزی
 */

import { reciters } from "@/data/audio";
import { usePlayerStore } from "@/store/player";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";
import { Check, Crown, Sparkles } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function ReciterSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const reciterId = usePlayerStore((s) => s.reciterId);
  const setReciter = usePlayerStore((s) => s.setReciter);

  const handleSelect = (id: string, premium: boolean, name: string) => {
    if (premium) {
      toast.info("قاری‌های ویژه بخشی از سکینه پریمیوم‌اند", {
        description: `${name} به‌زودی با فعال‌سازی پریمیوم در دسترس می‌شود`,
      });
      return;
    }
    setReciter(id);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent aria-describedby={undefined} side="bottom" className="z-[95] rounded-t-3xl max-h-[82vh] p-0 gap-0">
        <SheetHeader className="p-5 pb-3 text-right">
          <SheetTitle className="text-lg font-black">انتخاب قاری</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto nice-scroll px-4 pb-8">
          <div className="space-y-2">
            {reciters.map((r) => {
              const active = reciterId === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => handleSelect(r.id, r.premium, r.name)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-2xl border p-2.5 min-h-[72px] transition-all text-right",
                    active
                      ? "border-brand-brass/60 bg-brand-brass/5"
                      : "border-border bg-card hover:border-primary/40"
                  )}
                >
                  <span
                    className={cn(
                      "relative w-14 h-14 rounded-2xl overflow-hidden shrink-0",
                      !active && "opacity-90"
                    )}
                  >
                    <Image
                      src={r.image}
                      alt=""
                      width={112}
                      height={112}
                      className="object-cover w-full h-full"
                    />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-bold truncate">{r.name}</span>
                      {r.premium && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-brass border border-brand-brass/40 rounded-full px-2 py-0.5">
                          <Crown className="w-3 h-3" /> ویژه
                        </span>
                      )}
                    </span>
                    <span className="block text-xs text-brand-ink-muted truncate mt-0.5">
                      {r.description} · {r.bitrate}
                    </span>
                  </span>
                  {active ? (
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground shrink-0">
                      <Check className="w-4 h-4" />
                    </span>
                  ) : (
                    r.premium && <Sparkles className="w-4 h-4 text-brand-brass shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
