"use client";

/**
 * کتابخانه — پلی‌لیست / علاقه‌مندی / دانلودها / تاریخچه / آمار
 * حالت‌های خالی گرم با دعوت به شروع
 */

import { useEffect, useMemo, useState } from "react";
import { surahs } from "@/data/quran";
import { reciters } from "@/data/audio";
import { getVerses, toPersianDigits } from "@/data/verses";
import { usePlayerStore } from "@/store/player";
import { useLibraryStore, type Playlist } from "@/store/library";
import { StarBadge } from "./StarBadge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PlayGlyph } from "./PlayPauseIcon";
import {
  Clock, Download, Heart, History, ListMusic, Plus, BarChart3, Trash2, Loader2, BookOpen,
} from "lucide-react";

type SubTab = "playlists" | "favorites" | "downloads" | "history" | "stats";

const SUB_TABS: Array<{ id: SubTab; label: string; icon: typeof Heart }> = [
  { id: "playlists", label: "پلی‌لیست", icon: ListMusic },
  { id: "favorites", label: "علاقه‌مندی", icon: Heart },
  { id: "downloads", label: "دانلودها", icon: Download },
  { id: "history", label: "تاریخچه", icon: History },
  { id: "stats", label: "آمار", icon: BarChart3 },
];

export function LibraryTab({ onOpenSurah }: { onOpenSurah: (id: number) => void }) {
  const [sub, setSub] = useState<SubTab>("playlists");
  const [newPlaylistOpen, setNewPlaylistOpen] = useState(false);

  return (
    <div className="pb-44">
      <header className="px-5 pt-8 pb-3">
        <h1 className="text-2xl font-black">کتابخانه</h1>
        <p className="text-xs text-brand-ink-muted mt-1">محتوای شخصی تو</p>
      </header>

      <div className="px-5">
        <div className="flex gap-1 rounded-2xl bg-secondary p-1">
          {SUB_TABS.map((t) => {
            const Icon = t.icon;
            const active = sub === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSub(t.id)}
                aria-pressed={active}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-1 h-14 rounded-xl text-[10px] font-bold transition-all",
                  active
                    ? "bg-card text-primary shadow-soft"
                    : "text-brand-ink-muted hover:text-foreground"
                )}
              >
                <Icon className="w-4.5 h-4.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5 mt-5">
        {sub === "playlists" && <PlaylistsView onOpenSurah={onOpenSurah} />}
        {sub === "favorites" && <FavoritesView onOpenSurah={onOpenSurah} />}
        {sub === "downloads" && <DownloadsView />}
        {sub === "history" && <HistoryView onOpenSurah={onOpenSurah} />}
        {sub === "stats" && <StatsView />}
      </div>
    </div>
  );
}

function EmptyState({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 rounded-3xl bg-secondary text-brand-ink-muted flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <div className="text-sm font-bold">{title}</div>
      <p className="text-xs text-brand-ink-muted mt-2 leading-6 max-w-56 mx-auto">{body}</p>
    </div>
  );
}

function PlaylistsView({ onOpenSurah }: { onOpenSurah: (id: number) => void }) {
  const { playlists, createPlaylist, deletePlaylist } = useLibraryStore();
  const play = usePlayerStore((s) => s.play);
  const [name, setName] = useState("");

  const curated: Playlist[] = useMemo(
    () =>
      playlists.map((p) => ({
        ...p,
      })),
    [playlists]
  );

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          createPlaylist(name.trim());
          toast.success(`پلی‌لیست «${name.trim()}» ساخته شد`);
          setName("");
        }}
        className="flex gap-2 mb-4"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="نام پلی‌لیست جدید…"
          className="flex-1 h-11 rounded-2xl border border-border bg-card px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          aria-label="ساخت پلی‌لیست"
          className="w-11 h-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shrink-0"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      {curated.length === 0 ? (
        <EmptyState
          icon={<ListMusic className="w-7 h-7" />}
          title="هنوز پلی‌لیستی نداری"
          body="اولین پلی‌لیستت را بساز و سوره‌های مورد علاقه‌ات را در آن جمع کن"
        />
      ) : (
        <ul className="space-y-2">
          {curated.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
            >
              <button
                onClick={() => {
                  if (p.surahIds.length === 0) {
                    toast.info("پلی‌لیست خالی است؛ از فهرست قرآن سوره اضافه کن");
                    return;
                  }
                  play(p.surahIds[0], 1);
                  toast.success(`پخش «${p.name}»`);
                }}
                aria-label={`پخش ${p.name}`}
                className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0"
              >
                <PlayGlyph className="w-5 h-5" />
              </button>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold truncate">{p.name}</div>
                <div className="text-[11px] text-brand-ink-muted">
                  {toPersianDigits(p.surahIds.length)} سوره
                </div>
              </div>
              <button
                onClick={() => {
                  deletePlaylist(p.id);
                  toast.success("پلی‌لیست حذف شد");
                }}
                aria-label="حذف پلی‌لیست"
                className="w-9 h-9 rounded-full text-brand-ink-muted hover:bg-secondary flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => onOpenSurah(1)}
        className="mt-4 w-full h-11 rounded-2xl border border-primary/40 text-primary text-xs font-bold"
      >
        افزودن سوره از فهرست قرآن
      </button>
    </div>
  );
}

function FavoritesView({ onOpenSurah }: { onOpenSurah: (id: number) => void }) {
  const favorites = useLibraryStore((s) => s.favorites);
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite);
  const play = usePlayerStore((s) => s.play);
  const [verseTexts, setVerseTexts] = useState<Record<string, string>>({});

  // متن آیه‌های علاقه‌مندی (فقط آیه‌ای‌ها)
  useEffect(() => {
    const verseFavs = favorites.filter((f) => f.ayah);
    if (verseFavs.length === 0) return;
    const surahIds = Array.from(new Set(verseFavs.map((f) => f.surahId)));
    Promise.all(surahIds.map((sid) => getVerses(sid))).then((all) => {
      const map: Record<string, string> = {};
      verseFavs.forEach((f) => {
        const verses = all[surahIds.indexOf(f.surahId)];
        const v = verses?.[(f.ayah ?? 1) - 1];
        if (v) map[`${f.surahId}:${f.ayah}`] = v.arabic;
      });
      setVerseTexts(map);
    });
  }, [favorites]);

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon={<Heart className="w-7 h-7" />}
        title="چیزی برای گوش دادن نداری"
        body="قلب هر آیه‌ای را لمس کن تا به علاقه‌مندی‌هایت اضافه شود"
      />
    );
  }

  return (
    <ul className="space-y-2">
      {favorites.map((f) => {
        const s = surahs.find((x) => x.id === f.surahId);
        const key = `${f.surahId}:${f.ayah ?? ""}`;
        const text = f.ayah ? verseTexts[key] : null;
        return (
          <li
            key={key}
            className="flex items-start gap-3 rounded-2xl border border-border bg-card p-3"
          >
            <button
              onClick={() => (f.ayah ? play(f.surahId, f.ayah) : onOpenSurah(f.surahId))}
              aria-label="پخش"
              className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0"
            >
              <PlayGlyph className="w-4 h-4" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-primary">
                {s?.persianName}
                {f.ayah ? ` · آیه ${toPersianDigits(f.ayah)}` : ""}
              </div>
              {text && (
                <p className="font-quran text-[15px] leading-8 mt-1 line-clamp-2">{text}</p>
              )}
            </div>
            <button
              onClick={() => toggleFavorite(f.surahId, f.ayah)}
              aria-label="حذف از علاقه‌مندی"
              className="w-9 h-9 rounded-full text-destructive hover:bg-destructive/10 flex items-center justify-center shrink-0"
            >
              <Heart className="w-4 h-4 fill-current" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function DownloadsView() {
  const downloads = useLibraryStore((s) => s.downloads);
  const removeDownload = useLibraryStore((s) => s.removeDownload);
  const play = usePlayerStore((s) => s.play);

  if (downloads.length === 0) {
    return (
      <EmptyState
        icon={<Download className="w-7 h-7" />}
        title="نسخه آفلاینی نداری"
        body="از صفحه خوانش هر سوره، دکمه دانلود را بزن تا بدون اینترنت هم گوش بدهی"
      />
    );
  }

  const totalMB = downloads.reduce((a, d) => a + d.sizeKB, 0) / 1024;

  return (
    <div>
      <p className="text-xs text-brand-ink-muted mb-3">
        فضای مصرفی: حدود {toPersianDigits(totalMB.toFixed(1))} مگابایت
      </p>
      <ul className="space-y-2">
        {downloads.map((d) => {
          const s = surahs.find((x) => x.id === d.surahId);
          const r = reciters.find((x) => x.id === d.reciterId);
          return (
            <li key={d.surahId} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
              <button
                onClick={() => d.status === "done" && play(d.surahId, 1, d.reciterId)}
                className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0"
                aria-label="پخش آفلاین"
              >
                {d.status === "downloading" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <PlayGlyph className="w-5 h-5" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold truncate">{s?.persianName}</div>
                <div className="text-[11px] text-brand-ink-muted">
                  {r?.name} · {toPersianDigits((d.sizeKB / 1024).toFixed(1))}MB
                  {d.status === "downloading" && ` · ${toPersianDigits(d.progress)}٪`}
                </div>
                {d.status === "downloading" && (
                  <div className="mt-1.5 h-1 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${d.progress}%` }} />
                  </div>
                )}
              </div>
              <button
                onClick={async () => {
                  removeDownload(d.surahId);
                  toast.success("دانلود حذف شد");
                }}
                aria-label="حذف دانلود"
                className="w-9 h-9 rounded-full text-brand-ink-muted hover:bg-secondary flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function HistoryView({ onOpenSurah }: { onOpenSurah: (id: number) => void }) {
  const history = useLibraryStore((s) => s.history);
  const clearHistory = useLibraryStore((s) => s.clearHistory);
  const play = usePlayerStore((s) => s.play);

  if (history.length === 0) {
    return (
      <EmptyState
        icon={<History className="w-7 h-7" />}
        title="تاریخچه خالی است"
        body="به‌زودی چیزی که شنیده‌ای اینجا جمع می‌شود تا هر وقت خواستی ادامه بدهی"
      />
    );
  }

  return (
    <div>
      <button
        onClick={clearHistory}
        className="text-[11px] font-bold text-brand-ink-muted hover:text-destructive mb-3"
      >
        پاک‌سازی تاریخچه
      </button>
      <ul className="space-y-2">
        {history.slice(0, 30).map((h) => {
          const s = surahs.find((x) => x.id === h.surahId);
          const r = reciters.find((x) => x.id === h.reciterId);
          const date = new Date(h.playedAt);
          const time = `${toPersianDigits(date.getHours())}:${toPersianDigits(String(date.getMinutes()).padStart(2, "0"))}`;
          return (
            <li key={h.id}>
              <button
                onClick={() => play(h.surahId, h.ayah)}
                className="w-full flex items-center gap-3 rounded-2xl border border-border bg-card p-3 text-right hover:border-primary/40 transition-colors"
              >
                <StarBadge number={h.surahId} size={40} />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-bold truncate">
                    {s?.persianName} · آیه {toPersianDigits(h.ayah)}
                  </span>
                  <span className="block text-[11px] text-brand-ink-muted">
                    {r?.name} — {time}
                  </span>
                </span>
                <Clock className="w-4 h-4 text-brand-ink-muted/50 shrink-0" />
              </button>
            </li>
          );
        })}
      </ul>
      <button
        onClick={() => onOpenSurah(history[0].surahId)}
        className="mt-4 w-full h-11 rounded-2xl border border-primary/40 text-primary text-xs font-bold"
      >
        باز کردن صفحه خوانش آخرین سوره
      </button>
    </div>
  );
}

function StatsView() {
  const { history, favorites, downloads } = useLibraryStore();
  const play = usePlayerStore((s) => s.play);

  const totalSeconds = history.reduce((a, h) => a + h.seconds, 0);
  const weekAgo = Date.now() - 7 * 86400_000;
  const weekSeconds = history
    .filter((h) => h.playedAt >= weekAgo)
    .reduce((a, h) => a + h.seconds, 0);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const weekHours = (weekSeconds / 3600).toFixed(1);

  const days = new Set(
    history.map((h) => new Date(h.playedAt).toDateString())
  ).size;

  const friendly =
    weekSeconds >= 3600
      ? `این هفته ${toPersianDigits(weekHours)} ساعت با قرآن بودی — ادامه بده`
      : weekSeconds > 0
        ? "این هفته هم مهمان قرآن بودی؛ همین امشب هم چند آیه گوش بده"
        : "امشب اولین قدم را بردار؛ یک آیه کافی است";

  return (
    <div>
      <div className="rounded-3xl bg-gradient-to-bl from-[#2A4A40] to-[#145A48] text-[#F6F5F1] p-6 text-center shadow-card">
        <BookOpen className="w-8 h-8 mx-auto text-[#C9A45C] mb-3" />
        <p className="text-sm leading-7">{friendly}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <StatCard
          value={totalSeconds > 0 ? `${toPersianDigits(hours)}:${toPersianDigits(String(minutes).padStart(2, "0"))}` : "۰"}
          label="کل زمان شنیدن (ساعت:دقیقه)"
        />
        <StatCard value={toPersianDigits(days)} label="روزهای همراهی" />
        <StatCard value={toPersianDigits(favorites.length)} label="آیه‌های علاقه‌مندی" />
        <StatCard value={toPersianDigits(downloads.filter((d) => d.status === "done").length)} label="سوره‌های آفلاین" />
      </div>

      {history.length > 0 && (
        <button
          onClick={() => play(history[0].surahId, history[0].ayah)}
          className="mt-5 w-full h-12 rounded-2xl bg-primary text-primary-foreground text-sm font-bold shadow-primary"
        >
          ادامه‌ی آخرین شنیده
        </button>
      )}
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-center">
      <div className="text-xl font-black text-primary tabular-nums">{value}</div>
      <div className="text-[11px] text-brand-ink-muted mt-1 leading-5">{label}</div>
    </div>
  );
}
