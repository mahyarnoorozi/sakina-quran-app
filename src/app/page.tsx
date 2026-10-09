"use client";

/**
 * سَکینه v5 — قاب اصلی اپ
 * آنبوردینگ ← ۵ تب + پلیر مینی/تمام‌صفحه + خوانش
 * PlayerBridge: استور را با AudioEngine همگام نگه می‌دارد (استور = منبع حقیقت)
 */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ThemeProvider } from "next-themes";
import { usePlayerStore } from "@/store/player";
import { useSettingsStore } from "@/store/settings";
import { useLibraryStore } from "@/store/library";
import { AudioEngine } from "@/lib/audio-engine";
import { surahs } from "@/data/quran";
import { reciters } from "@/data/audio";
import { Logo } from "@/components/sakina/Logo";
import { Onboarding } from "@/components/sakina/Onboarding";
import { TabBar, type TabId } from "@/components/sakina/TabBar";
import { HomeTab } from "@/components/sakina/HomeTab";
import { QuranTab } from "@/components/sakina/QuranTab";
import { ReaderSheet } from "@/components/sakina/ReaderSheet";
import { MixerTab } from "@/components/sakina/MixerTab";
import { LibraryTab } from "@/components/sakina/LibraryTab";
import { ProfileTab } from "@/components/sakina/ProfileTab";
import { PlayerMini } from "@/components/sakina/PlayerMini";
import { PlayerFull } from "@/components/sakina/PlayerFull";
import { SleepSheet } from "@/components/sakina/SleepSheet";

export default function SakinaApp() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AppShell />
    </ThemeProvider>
  );
}

function AppShell() {
  // تشخیص hydration بدون setState در effect
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [tab, setTab] = useState<TabId>("home");
  const [readerSurah, setReaderSurah] = useState<number | null>(null);
  const [sleepOpen, setSleepOpen] = useState(false);

  const onboardingDone = useSettingsStore((s) => s.onboardingDone);

  // هوک دیباگ/E2E — دسترسی به موتور و استور از کنسول
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as Record<string, unknown>).__sakina = {
        AudioEngine,
        usePlayerStore,
        useSettingsStore,
      };
    }
  }, []);

  if (!mounted) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <Logo size={80} />
      </div>
    );
  }

  if (!onboardingDone) {
    return <Onboarding onDone={() => undefined} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ستون موبایل روی دسکتاپ */}
      <div className="ambient-bg relative mx-auto max-w-lg min-h-screen">
        <main className="pb-44 min-h-screen">
          {tab === "home" && <HomeTab onOpenSleep={() => setSleepOpen(true)} />}
          {tab === "quran" && <QuranTab onOpenSurah={setReaderSurah} />}
          {tab === "mixer" && <MixerTab />}
          {tab === "library" && <LibraryTab onOpenSurah={setReaderSurah} />}
          {tab === "profile" && <ProfileTab />}
        </main>

        <PlayerBridge />

        <PlayerMiniWrapper />
        <PlayerFull />
        <MixerOverlay />
        <TabBar active={tab} onChange={setTab} />
        <ReaderSheet surahId={readerSurah} onClose={() => setReaderSurah(null)} />
        <SleepSheet open={sleepOpen} onOpenChange={setSleepOpen} />
      </div>
    </div>
  );
}

/** اورلی میکسر داخل پلیر — بستن → بازگشت به پلیر */
function MixerOverlay() {
  const mixerOpen = usePlayerStore((s) => s.mixerOpen);
  const setMixerOpen = usePlayerStore((s) => s.setMixerOpen);
  if (!mixerOpen) return null;
  return (
    <div className="fixed inset-0 z-[75] bg-background overflow-y-auto nice-scroll animate-fade-in">
      <div className="mx-auto max-w-lg">
        <header className="flex items-center gap-2 px-4 pt-5 pb-2">
          <button
            onClick={() => setMixerOpen(false)}
            aria-label="بازگشت به پلیر"
            className="w-11 h-11 rounded-full border border-border flex items-center justify-center hover:bg-secondary"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
          <span className="text-sm font-bold">میکسر صدا</span>
        </header>
        <MixerTab />
      </div>
    </div>
  );
}

/** پلیر مینی فقط وقتی چیزی در جریان است (یا تازگی متوقف شده) */
function PlayerMiniWrapper() {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const lastPlayedAt = usePlayerStore((s) => s.lastPlayedAt);
  const expanded = usePlayerStore((s) => s.expanded);

  const showMini =
    isPlaying ||
    (!!lastPlayedAt && Date.now() - lastPlayedAt < 3600_000 && !expanded);

  if (!showMini || expanded) return null;
  return <PlayerMini />;
}

/**
 * پل استور ↔ موتور صوتی
 * هر تغییر پلیر در استور به موتور اعمال می‌شود؛ رویداد «پایان آیه» منطق پیشروی را اجرا می‌کند.
 */
function PlayerBridge() {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const surahId = usePlayerStore((s) => s.surahId);
  const ayah = usePlayerStore((s) => s.ayah);
  const reciterId = usePlayerStore((s) => s.reciterId);
  const volume = usePlayerStore((s) => s.volume);
  const playbackSpeed = usePlayerStore((s) => s.playbackSpeed);
  const ambientSoundId = usePlayerStore((s) => s.ambientSoundId);
  const ambientVolume = usePlayerStore((s) => s.ambientVolume);
  const backgroundSoundId = usePlayerStore((s) => s.backgroundSoundId);
  const backgroundVolume = usePlayerStore((s) => s.backgroundVolume);
  const sleepMinutes = usePlayerStore((s) => s.sleepTimer.minutes);

  // هندلرهای موتور — یک‌بار
  useEffect(() => {
    AudioEngine.setHandlers(
      (nextAyah) => {
        // پایان آیه: پیشروی با توجه به repeatMode
        const st = usePlayerStore.getState();
        const surah = surahs.find((x) => x.id === st.surahId);
        if (st.repeatMode === "one") return; // موتور همان آیه را دوباره پخش نمی‌کند؛ bridge می‌کند
        if (!surah) return;
        if (nextAyah > surah.versesCount) {
          if (st.repeatMode === "off") {
            st.pause();
            return;
          }
          // پایان سوره → سوره بعد
          const nextSurah = st.surahId + 1;
          if (nextSurah > 114) {
            st.pause();
            return;
          }
          st.setSurah(nextSurah, true);
          st.setAyah(1);
        } else {
          st.setAyah(nextAyah);
        }
      },
      () => {
        // onEnded: مدیریت تکرار تک‌آیه
        const st = usePlayerStore.getState();
        if (st.repeatMode === "one") {
          AudioEngine.playRecitation({
            reciterEveryayahId: reciters.find((r) => r.id === st.reciterId)?.everyayahId ?? "",
            surahId: st.surahId,
            ayah: st.ayah,
            volume: st.volume,
            speed: st.playbackSpeed,
          });
        }
      }
    );
  }, []);

  // پخش/توقف بر اساس استور
  const playKeyRef = useRef("");
  useEffect(() => {
    const key = `${surahId}:${ayah}:${reciterId}:${isPlaying}`;
    const everyayahId = reciters.find((r) => r.id === reciterId)?.everyayahId ?? "";

    if (isPlaying) {
      // کلید تغییر مسیر: سوره/آیه/قاری تغییر کرده یا از توقف به پخش رسیده‌ایم
      const trackChanged = !playKeyRef.current.startsWith(`${surahId}:${ayah}:${reciterId}`);
      if (trackChanged || !playKeyRef.current.endsWith(":1")) {
        AudioEngine.playRecitation({
          reciterEveryayahId: everyayahId,
          surahId,
          ayah,
          volume,
          speed: playbackSpeed,
        });
      } else {
        AudioEngine.playAll();
      }
      playKeyRef.current = key;
    } else {
      // توقف بی‌درز: هم وقتی قبلاً در حال پخش بودیم، هم اگر آدیو سرگردان
      // (مثلاً وسط race بارگذاری) فعلاً در حال پخش است
      if (playKeyRef.current.endsWith(":1") || AudioEngine.hasActiveRecitation()) {
        AudioEngine.pauseAll();
      }
      playKeyRef.current = key;
    }
  }, [isPlaying, surahId, ayah, reciterId]);

  // ولوم و سرعت
  useEffect(() => {
    AudioEngine.setRecitationVolume(volume);
  }, [volume]);

  useEffect(() => {
    AudioEngine.setRecitationSpeed(playbackSpeed);
  }, [playbackSpeed]);

  // لایه‌های محیط
  useEffect(() => {
    AudioEngine.setAmbient(ambientSoundId, ambientVolume);
    AudioEngine.setAmbientBaseVolume(ambientVolume);
  }, [ambientSoundId, ambientVolume]);

  useEffect(() => {
    AudioEngine.setBackground(backgroundSoundId, backgroundVolume);
    AudioEngine.setBackgroundBaseVolume(backgroundVolume);
  }, [backgroundSoundId, backgroundVolume]);

  // تایمر خواب
  useEffect(() => {
    if (sleepMinutes) {
      AudioEngine.startSleepTimer(sleepMinutes, () => {
        const st = usePlayerStore.getState();
        st.pause();
        st.cancelSleepTimer();
      });
    } else {
      AudioEngine.cancelSleepTimer();
    }
  }, [sleepMinutes]);

  // ثبت تاریخچه هر ۳۰ ثانیه در حال پخش
  useEffect(() => {
    if (!isPlaying) return;
    const t = setInterval(() => {
      const st = usePlayerStore.getState();
      const sec = AudioEngine.sessionSeconds();
      if (sec > 0) {
        useLibraryStore.getState().logPlay(st.surahId, st.ayah, st.reciterId, sec);
      }
    }, 30_000);
    return () => clearInterval(t);
  }, [isPlaying]);

  return null;
}
