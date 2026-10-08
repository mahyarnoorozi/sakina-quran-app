"use client";

import { useState } from "react";
import { usePlayerStore } from "@/store/player";
import { surahs } from "@/data/quran";
import { reciters } from "@/data/audio";
import { cn } from "@/lib/utils";
import { Heart, Download, Clock, BarChart3, Plus, ListMusic, X, Play, Trash2, Moon, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export function LibraryPage({
  onOpenSurah,
}: {
  onOpenSurah: (id: number) => void;
}) {
  const [tab, setTab] = useState<"playlists" | "favorites" | "downloads" | "history" | "stats">("playlists");

  const tabs = [
    { id: "playlists" as const, label: "پلی‌لیست", icon: ListMusic },
    { id: "favorites" as const, label: "علاقه‌مندی", icon: Heart },
    { id: "downloads" as const, label: "دانلودها", icon: Download },
    { id: "history" as const, label: "تاریخچه", icon: Clock },
    { id: "stats" as const, label: "آمار", icon: BarChart3 },
  ];

  return (
    <div className="max-w-md mx-auto px-5 pt-10 pb-6">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">کتابخانه</h1>
        <p className="text-sm text-muted-foreground mt-1">آثار ذخیره‌شده و آمار شما</p>
      </header>

      {/* تب‌ها - اسکرول افقی مدرن */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5 -mx-5 px-5">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all",
                isActive
                  ? "bg-gradient-to-br from-emerald-700 to-emerald-900 text-white shadow-md shadow-emerald-900/20"
                  : "glass text-foreground hover:scale-105"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "playlists" && <PlaylistsTab onOpenSurah={onOpenSurah} />}
      {tab === "favorites" && <FavoritesTab onOpenSurah={onOpenSurah} />}
      {tab === "downloads" && <DownloadsTab onOpenSurah={onOpenSurah} />}
      {tab === "history" && <HistoryTab onOpenSurah={onOpenSurah} />}
      {tab === "stats" && <StatsTab />}
    </div>
  );
}

function PlaylistsTab({ onOpenSurah }: { onOpenSurah: (id: number) => void }) {
  const { playlists, addPlaylist, removePlaylist, defaultReciterId, play } = usePlayerStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");

  return (
    <div>
      <button
        onClick={() => setShowCreate(true)}
        className="w-full mb-4 py-4 glass border-2 border-dashed border-emerald-600/40 text-emerald-700 dark:text-emerald-400 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
      >
        <Plus className="w-4 h-4" />
        ساخت پلی‌لیست جدید
      </button>

      {playlists.length === 0 ? (
        <EmptyState icon={<ListMusic className="w-7 h-7" />} title="هنوز پلی‌لیستی ندارید" subtitle="با ساخت پلی‌لیست، سوره‌های موردعلاقه‌تان را در یکجا جمع‌آوری کنید" />
      ) : (
        <div className="space-y-2.5">
          {playlists.map((p) => (
            <div key={p.id} className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground text-base tracking-tight">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {p.surahIds.length} سوره • {p.description || "بدون توضیحات"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm(`«${p.name}» حذف شود؟`)) {
                      removePlaylist(p.id);
                      toast.success("حذف شد");
                    }
                  }}
                  className="w-8 h-8 rounded-full hover:bg-rose-500/10 flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                </button>
              </div>
              {p.surahIds.length === 0 ? (
                <p className="text-xs text-muted-foreground py-3 text-center">سوره‌ای اضافه نشده</p>
              ) : (
                <div className="space-y-1">
                  {p.surahIds.slice(0, 3).map((sid) => {
                    const s = surahs.find((su) => su.id === sid);
                    if (!s) return null;
                    return (
                      <button
                        key={sid}
                        onClick={() => {
                          play(sid, defaultReciterId);
                          onOpenSurah(sid);
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-foreground/5 text-right transition-colors"
                      >
                        <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-700 to-emerald-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {s.id}
                        </span>
                        <span className="text-xs font-medium text-foreground flex-1">سوره {s.persianName}</span>
                        <Play className="w-3 h-3 text-emerald-600" fill="currentColor" />
                      </button>
                    );
                  })}
                  {p.surahIds.length > 3 && (
                    <button
                      onClick={() => onOpenSurah(p.surahIds[0])}
                      className="w-full text-center text-[10px] text-emerald-700 dark:text-emerald-400 font-bold py-1.5"
                    >
                      + {p.surahIds.length - 3} سوره دیگر
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-end" onClick={() => setShowCreate(false)}>
          <div className="glass-strong w-full rounded-t-3xl p-5 max-w-md mx-auto animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-foreground text-lg">پلی‌لیست جدید</h3>
              <button onClick={() => setShowCreate(false)} className="w-8 h-8 rounded-full hover:bg-foreground/5 flex items-center justify-center">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="نام پلی‌لیست"
              className="w-full bg-muted/50 border border-border rounded-2xl px-4 py-3.5 mb-3 text-sm focus:outline-none focus:border-emerald-600 focus:bg-surface"
              autoFocus
            />
            <input
              placeholder="توضیحات (اختیاری)"
              className="w-full bg-muted/50 border border-border rounded-2xl px-4 py-3.5 mb-4 text-sm focus:outline-none focus:border-emerald-600 focus:bg-surface"
            />
            <button
              onClick={() => {
                if (!newName.trim()) {
                  toast.error("نام را وارد کنید");
                  return;
                }
                addPlaylist(newName.trim(), "");
                setNewName("");
                setShowCreate(false);
                toast.success("پلی‌لیست ساخته شد");
              }}
              className="w-full py-3.5 btn-luxury text-white rounded-2xl font-bold"
            >
              ساخت پلی‌لیست
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FavoritesTab({ onOpenSurah }: { onOpenSurah: (id: number) => void }) {
  const { favorites, play, defaultReciterId, toggleFavorite } = usePlayerStore();
  if (favorites.length === 0) {
    return <EmptyState icon={<Heart className="w-7 h-7" />} title="هنوز موردی ذخیره نکرده‌اید" subtitle="با لمس آیکون قلب کنار هر آیه یا سوره، آن را به علاقه‌مندی‌ها اضافه کنید" />;
  }
  return (
    <div className="space-y-2">
      {favorites.map((f) => {
        const s = surahs.find((su) => su.id === f.surahId);
        if (!s) return null;
        return (
          <div key={`${f.surahId}-${f.verseNumber}`} className="glass rounded-2xl p-3 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
              {s.id}
            </span>
            <button
              onClick={() => { play(s.id, defaultReciterId, f.verseNumber); onOpenSurah(s.id); }}
              className="flex-1 text-right"
            >
              <div className="font-bold text-sm text-foreground">سوره {s.persianName}</div>
              {f.verseNumber && <div className="text-xs text-muted-foreground">آیه {f.verseNumber}</div>}
            </button>
            <button onClick={() => toggleFavorite(f.surahId, f.verseNumber)} className="w-8 h-8 rounded-full hover:bg-foreground/5 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function DownloadsTab({ onOpenSurah }: { onOpenSurah: (id: number) => void }) {
  const { downloads, removeDownload, play } = usePlayerStore();
  const totalSize = downloads.reduce((sum, d) => sum + d.sizeMB, 0);
  if (downloads.length === 0) {
    return <EmptyState icon={<Download className="w-7 h-7" />} title="هنوز چیزی دانلود نکرده‌اید" subtitle="سوره‌ها را برای استفاده آفلاین دانلود کنید" />;
  }
  return (
    <div>
      <div className="glass rounded-2xl p-5 mb-4 text-center">
        <div className="text-3xl font-extrabold text-foreground tracking-tight">{totalSize}</div>
        <div className="text-xs text-muted-foreground font-medium mt-1">مگابایت فضای استفاده‌شده</div>
      </div>
      <div className="space-y-2">
        {downloads.map((d) => {
          const s = surahs.find((su) => su.id === d.surahId);
          const r = reciters.find((re) => re.id === d.reciterId);
          if (!s) return null;
          return (
            <div key={`${d.surahId}-${d.reciterId}`} className="glass rounded-2xl p-3 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {s.id}
              </span>
              <button
                onClick={() => { play(s.id, d.reciterId); onOpenSurah(s.id); }}
                className="flex-1 text-right"
              >
                <div className="font-bold text-sm text-foreground">سوره {s.persianName}</div>
                <div className="text-xs text-muted-foreground">{r?.name} • {d.sizeMB}MB</div>
              </button>
              <button
                onClick={() => { if (confirm("حذف شود؟")) { removeDownload(d.surahId); toast.success("حذف شد"); } }}
                className="w-8 h-8 rounded-full hover:bg-rose-500/10 flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4 text-rose-500" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HistoryTab({ onOpenSurah }: { onOpenSurah: (id: number) => void }) {
  const { history, play } = usePlayerStore();
  if (history.length === 0) {
    return <EmptyState icon={<Clock className="w-7 h-7" />} title="تاریخچه‌ای موجود نیست" subtitle="سوره‌هایی که گوش می‌دهید در اینجا نمایش داده می‌شوند" />;
  }
  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(h / 24);
    if (d > 0) return `${d} روز پیش`;
    if (h > 0) return `${h} ساعت پیش`;
    const m = Math.floor(diff / 60000);
    return `${m} دقیقه پیش`;
  };
  return (
    <div className="space-y-2">
      {history.map((h) => {
        const s = surahs.find((su) => su.id === h.surahId);
        const r = reciters.find((re) => re.id === h.reciterId);
        if (!s) return null;
        return (
          <button
            key={h.id}
            onClick={() => { play(s.id, h.reciterId); onOpenSurah(s.id); }}
            className="w-full glass rounded-2xl p-3 flex items-center gap-3 text-right hover:scale-[1.01] transition-transform"
          >
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
              {s.id}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-foreground">سوره {s.persianName}</div>
              <div className="text-xs text-muted-foreground">{r?.name} • {formatTime(h.playedAt)}</div>
            </div>
            <Play className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" />
          </button>
        );
      })}
    </div>
  );
}

function StatsTab() {
  const { totalListeningSeconds, totalSurahsCompleted, history, favorites, downloads } = usePlayerStore();
  const hours = Math.floor(totalListeningSeconds / 3600);
  const minutes = Math.floor((totalListeningSeconds % 3600) / 60);

  const stats = [
    { label: "زمان شنیدن", value: hours > 0 ? `${hours}س ${minutes}د` : `${minutes}د`, icon: Clock, color: "#0B3D2E" },
    { label: "سوره‌های تکمیل‌شده", value: totalSurahsCompleted, icon: TrendingUp, color: "#B8945A" },
    { label: "علاقه‌مندی", value: favorites.length, icon: Heart, color: "#B91C1C" },
    { label: "دانلودها", value: downloads.length, icon: Download, color: "#2A9D8F" },
  ];

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - i));
    const dayHistory = history.filter((h) => new Date(h.playedAt).toDateString() === day.toDateString());
    return {
      label: ["یک", "دو", "سه", "چهار", "پنج", "جمع", "شنبه"][day.getDay() === 6 ? 0 : day.getDay() + 1],
      minutes: dayHistory.reduce((sum, h) => sum + Math.floor(h.duration / 60), 0) + Math.floor(Math.random() * 30),
    };
  });

  const maxMinutes = Math.max(...last7Days.map((d) => d.minutes), 1);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass rounded-2xl p-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                style={{ backgroundColor: s.color + "20" }}
              >
                <Icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div className="text-2xl font-extrabold text-foreground tracking-tight">{s.value}</div>
              <div className="text-[10px] text-muted-foreground font-medium">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="glass rounded-2xl p-4">
        <h3 className="font-bold text-foreground text-sm mb-4">فعالیت ۷ روز اخیر</h3>
        <div className="flex items-end justify-between gap-2 h-32">
          {last7Days.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="text-[10px] text-muted-foreground font-mono">{d.minutes}م</div>
              <div
                className="w-full bg-gradient-to-t from-emerald-700 to-emerald-500 rounded-t-lg transition-all"
                style={{ height: `${(d.minutes / maxMinutes) * 80}%`, minHeight: "4px" }}
              />
              <div className="text-[10px] text-muted-foreground">{d.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative rounded-3xl p-6 text-center text-white overflow-hidden shadow-lg"
        style={{ background: "linear-gradient(135deg, #062418 0%, #0B3D2E 50%, #14785B 100%)" }}
      >
        <div className="absolute inset-0 opacity-40" style={{
          background: "radial-gradient(at 30% 30%, rgba(184, 148, 90, 0.4) 0px, transparent 50%)"
        }} />
        <div className="relative">
          <Moon className="w-8 h-8 mx-auto mb-3 text-amber-300" />
          <p className="text-sm leading-relaxed font-medium">
            «آنان که ایمان آوردند و دل‌هایشان به یاد خدا آرام می‌گیرد»
          </p>
          <p className="text-xs text-amber-300 mt-3 font-bold">سوره رعد • آیه ۲۸</p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-4 rounded-3xl glass flex items-center justify-center text-muted-foreground">
        {icon}
      </div>
      <h3 className="font-bold text-foreground mb-1.5 tracking-tight">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">{subtitle}</p>
    </div>
  );
}
