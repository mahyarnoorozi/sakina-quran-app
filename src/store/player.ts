import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Reciter, NatureSound, MixerPreset } from "@/data/audio";

// ===== Audio Engine Store =====
interface MixerLayer {
  enabled: boolean;
  volume: number; // 0-100
}

interface SavedMix {
  id: string;
  name: string;
  reciterId: string;
  surahId: number;
  ambientSoundId: string;
  backgroundSoundId: string;
  reciterVolume: number;
  ambientVolume: number;
  backgroundVolume: number;
  createdAt: number;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  surahIds: number[];
  reciterId: string;
  createdAt: number;
  cover?: string;
}

interface HistoryItem {
  id: string;
  surahId: number;
  reciterId: string;
  playedAt: number;
  duration: number; // ثانیه
}

interface FavoriteItem {
  surahId: number;
  verseNumber?: number;
  addedAt: number;
}

interface DownloadedSurah {
  surahId: number;
  reciterId: string;
  sizeMB: number;
  downloadedAt: number;
}

interface PlayerState {
  // وضعیت پخش
  isPlaying: boolean;
  currentSurahId: number | null;
  currentReciterId: string;
  currentVerse: number;
  progress: number; // 0-100
  duration: number; // ثانیه
  currentTime: number; // ثانیه

  // میکسر
  mixerOpen: boolean;
  ambientSoundId: string | null;
  backgroundSoundId: string | null;
  reciterVolume: number;
  ambientVolume: number;
  backgroundVolume: number;
  ambientEnabled: boolean;
  backgroundEnabled: boolean;

  // تایمر خواب
  sleepTimerMinutes: number | null;
  sleepTimerStartedAt: number | null;
  sleepTimerActive: boolean;

  // کتابخانه
  playlists: Playlist[];
  favorites: FavoriteItem[];
  downloads: DownloadedSurah[];
  history: HistoryItem[];

  // ترکیب‌های ذخیره‌شده
  savedMixes: SavedMix[];

  // تنظیمات
  defaultReciterId: string;
  showTranslation: boolean;
  arabicFontSize: number;
  persianFontSize: number;
  arabicFont: "uthman" | "naskh" | "dewani";
  dailyVerseEnabled: boolean;
  dailyVerseTime: string; // "08:00"
  theme: "light" | "dark" | "system";

  // پرمیوم
  purchasedPackages: string[];
  isPremium: boolean;

  // onboarding
  hasOnboarded: boolean;

  // آمار
  totalListeningSeconds: number;
  totalSurahsCompleted: number;

  // اکشن‌ها
  play: (surahId: number, reciterId?: string, verse?: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  seek: (time: number) => void;
  nextVerse: () => void;
  prevVerse: () => void;
  setProgress: (progress: number, currentTime: number, duration: number) => void;

  setMixerOpen: (open: boolean) => void;
  setAmbientSound: (id: string | null) => void;
  setBackgroundSound: (id: string | null) => void;
  setReciterVolume: (v: number) => void;
  setAmbientVolume: (v: number) => void;
  setBackgroundVolume: (v: number) => void;
  setAmbientEnabled: (e: boolean) => void;
  setBackgroundEnabled: (e: boolean) => void;
  applyPreset: (preset: MixerPreset) => void;
  saveCurrentMix: (name: string) => void;
  deleteSavedMix: (id: string) => void;

  setSleepTimer: (minutes: number | null) => void;
  checkSleepTimer: () => boolean;

  toggleFavorite: (surahId: number, verseNumber?: number) => void;
  isFavorite: (surahId: number, verseNumber?: number) => boolean;

  addPlaylist: (name: string, description: string) => string;
  removePlaylist: (id: string) => void;
  addToPlaylist: (playlistId: string, surahId: number) => void;
  removeFromPlaylist: (playlistId: string, surahId: number) => void;

  downloadSurah: (surahId: number, reciterId: string) => void;
  removeDownload: (surahId: number) => void;
  isDownloaded: (surahId: number) => boolean;

  addHistory: (surahId: number, reciterId: string, duration: number) => void;
  incrementListening: (seconds: number) => void;
  markSurahCompleted: (surahId: number) => void;

  setDefaultReciter: (id: string) => void;
  setShowTranslation: (show: boolean) => void;
  setArabicFontSize: (size: number) => void;
  setPersianFontSize: (size: number) => void;
  setArabicFont: (font: "uthman" | "naskh" | "dewani") => void;
  setDailyVerseEnabled: (enabled: boolean) => void;
  setDailyVerseTime: (time: string) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;

  purchasePackage: (id: string) => void;

  setHasOnboarded: (v: boolean) => void;
  resetAll: () => void;
}

const initialPlayerState = {
  isPlaying: false,
  currentSurahId: null,
  currentReciterId: "abdulbasit",
  currentVerse: 1,
  progress: 0,
  duration: 0,
  currentTime: 0,

  mixerOpen: false,
  ambientSoundId: null,
  backgroundSoundId: null,
  reciterVolume: 80,
  ambientVolume: 50,
  backgroundVolume: 30,
  ambientEnabled: false,
  backgroundEnabled: false,

  sleepTimerMinutes: null,
  sleepTimerStartedAt: null,
  sleepTimerActive: false,

  playlists: [],
  favorites: [],
  downloads: [],
  history: [],

  savedMixes: [],

  defaultReciterId: "abdulbasit",
  showTranslation: true,
  arabicFontSize: 28,
  persianFontSize: 18,
  arabicFont: "uthman" as const,
  dailyVerseEnabled: true,
  dailyVerseTime: "08:00",
  theme: "light" as const,

  purchasedPackages: [],
  isPremium: true, // در حالت تست، همه امکانات فعالند

  hasOnboarded: false,

  totalListeningSeconds: 0,
  totalSurahsCompleted: 0,
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      ...initialPlayerState,

      play: (surahId, reciterId, verse = 1) => {
        // اطمینان از reciterId معتبر
        const validReciterIds = ["abdulbasit", "minshawi", "husary", "sudais", "shuraim", "ghamadi", "afasy", "ajamy"];
        const safeReciterId = reciterId && validReciterIds.includes(reciterId)
          ? reciterId
          : validReciterIds.includes(get().defaultReciterId) ? get().defaultReciterId : "abdulbasit";

        set((s) => ({
          isPlaying: true,
          currentSurahId: surahId,
          currentReciterId: safeReciterId,
          currentVerse: verse,
          progress: 0,
          currentTime: 0,
        }));
      },

      pause: () => set({ isPlaying: false }),
      resume: () => set({ isPlaying: true }),
      stop: () =>
        set({
          isPlaying: false,
          progress: 0,
          currentTime: 0,
          currentVerse: 1,
        }),

      seek: (time) =>
        set((s) => ({
          currentTime: time,
          progress: s.duration > 0 ? (time / s.duration) * 100 : 0,
        })),

      nextVerse: () => set((s) => ({ currentVerse: s.currentVerse + 1 })),
      prevVerse: () => set((s) => ({ currentVerse: Math.max(1, s.currentVerse - 1) })),

      setProgress: (progress, currentTime, duration) =>
        set({ progress, currentTime, duration }),

      setMixerOpen: (open) => set({ mixerOpen: open }),
      setAmbientSound: (id) => set({ ambientSoundId: id, ambientEnabled: !!id }),
      setBackgroundSound: (id) => set({ backgroundSoundId: id, backgroundEnabled: !!id }),
      setReciterVolume: (v) => set({ reciterVolume: v }),
      setAmbientVolume: (v) => set({ ambientVolume: v }),
      setBackgroundVolume: (v) => set({ backgroundVolume: v }),
      setAmbientEnabled: (e) => set({ ambientEnabled: e }),
      setBackgroundEnabled: (e) => set({ backgroundEnabled: e }),

      applyPreset: (preset) =>
        set({
          ambientSoundId: preset.ambientSoundId,
          backgroundSoundId: preset.backgroundSoundId,
          ambientVolume: preset.ambientVolume,
          backgroundVolume: preset.backgroundVolume,
          reciterVolume: preset.reciterVolume,
          ambientEnabled: true,
          backgroundEnabled: true,
          currentReciterId: preset.reciterId,
        }),

      saveCurrentMix: (name) =>
        set((s) => ({
          savedMixes: [
            ...s.savedMixes,
            {
              id: `mix-${Date.now()}`,
              name,
              reciterId: s.currentReciterId,
              surahId: s.currentSurahId || 1,
              ambientSoundId: s.ambientSoundId || "rain-light",
              backgroundSoundId: s.backgroundSoundId || "wind-soft",
              reciterVolume: s.reciterVolume,
              ambientVolume: s.ambientVolume,
              backgroundVolume: s.backgroundVolume,
              createdAt: Date.now(),
            },
          ],
        })),

      deleteSavedMix: (id) =>
        set((s) => ({ savedMixes: s.savedMixes.filter((m) => m.id !== id) })),

      setSleepTimer: (minutes) =>
        set({
          sleepTimerMinutes: minutes,
          sleepTimerStartedAt: minutes ? Date.now() : null,
          sleepTimerActive: !!minutes,
        }),

      checkSleepTimer: () => {
        const s = get();
        if (!s.sleepTimerActive || !s.sleepTimerStartedAt || !s.sleepTimerMinutes) return false;
        const elapsed = (Date.now() - s.sleepTimerStartedAt) / 1000 / 60;
        if (elapsed >= s.sleepTimerMinutes) {
          set({ sleepTimerActive: false, sleepTimerMinutes: null, sleepTimerStartedAt: null, isPlaying: false });
          return true;
        }
        return false;
      },

      toggleFavorite: (surahId, verseNumber) =>
        set((s) => {
          const exists = s.favorites.find(
            (f) => f.surahId === surahId && f.verseNumber === verseNumber
          );
          if (exists) {
            return {
              favorites: s.favorites.filter(
                (f) => !(f.surahId === surahId && f.verseNumber === verseNumber)
              ),
            };
          }
          return {
            favorites: [...s.favorites, { surahId, verseNumber, addedAt: Date.now() }],
          };
        }),

      isFavorite: (surahId, verseNumber) => {
        const s = get();
        return s.favorites.some(
          (f) => f.surahId === surahId && f.verseNumber === verseNumber
        );
      },

      addPlaylist: (name, description) => {
        const id = `pl-${Date.now()}`;
        set((s) => ({
          playlists: [
            ...s.playlists,
            {
              id,
              name,
              description,
              surahIds: [],
              reciterId: s.defaultReciterId,
              createdAt: Date.now(),
            },
          ],
        }));
        return id;
      },

      removePlaylist: (id) =>
        set((s) => ({ playlists: s.playlists.filter((p) => p.id !== id) })),

      addToPlaylist: (playlistId, surahId) =>
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === playlistId && !p.surahIds.includes(surahId)
              ? { ...p, surahIds: [...p.surahIds, surahId] }
              : p
          ),
        })),

      removeFromPlaylist: (playlistId, surahId) =>
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === playlistId
              ? { ...p, surahIds: p.surahIds.filter((id) => id !== surahId) }
              : p
          ),
        })),

      downloadSurah: (surahId, reciterId) =>
        set((s) => {
          if (s.downloads.some((d) => d.surahId === surahId)) return s;
          return {
            downloads: [
              ...s.downloads,
              {
                surahId,
                reciterId,
                sizeMB: Math.round(2 + Math.random() * 8),
                downloadedAt: Date.now(),
              },
            ],
          };
        }),

      removeDownload: (surahId) =>
        set((s) => ({ downloads: s.downloads.filter((d) => d.surahId !== surahId) })),

      isDownloaded: (surahId) => {
        const s = get();
        return s.downloads.some((d) => d.surahId === surahId);
      },

      addHistory: (surahId, reciterId, duration) =>
        set((s) => ({
          history: [
            { id: `h-${Date.now()}`, surahId, reciterId, playedAt: Date.now(), duration },
            ...s.history,
          ].slice(0, 100),
        })),

      incrementListening: (seconds) =>
        set((s) => ({ totalListeningSeconds: s.totalListeningSeconds + seconds })),

      markSurahCompleted: () =>
        set((s) => ({ totalSurahsCompleted: s.totalSurahsCompleted + 1 })),

      setDefaultReciter: (id) => set({ defaultReciterId: id, currentReciterId: id }),
      setShowTranslation: (show) => set({ showTranslation: show }),
      setArabicFontSize: (size) => set({ arabicFontSize: size }),
      setPersianFontSize: (size) => set({ persianFontSize: size }),
      setArabicFont: (font) => set({ arabicFont: font }),
      setDailyVerseEnabled: (enabled) => set({ dailyVerseEnabled: enabled }),
      setDailyVerseTime: (time) => set({ dailyVerseTime: time }),
      setTheme: (theme) => set({ theme }),

      purchasePackage: (id) =>
        set((s) => ({
          purchasedPackages: s.purchasedPackages.includes(id)
            ? s.purchasedPackages
            : [...s.purchasedPackages, id],
          isPremium: id === "full-pack" ? true : s.isPremium || s.purchasedPackages.length >= 3,
        })),

      setHasOnboarded: (v) => set({ hasOnboarded: v }),
      resetAll: () => set(initialPlayerState),
    }),
    {
      name: "sakina-storage",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : (undefined as unknown as Storage))),
      partialize: (state) => ({
        playlists: state.playlists,
        favorites: state.favorites,
        downloads: state.downloads,
        history: state.history,
        savedMixes: state.savedMixes,
        defaultReciterId: state.defaultReciterId,
        showTranslation: state.showTranslation,
        arabicFontSize: state.arabicFontSize,
        persianFontSize: state.persianFontSize,
        arabicFont: state.arabicFont,
        dailyVerseEnabled: state.dailyVerseEnabled,
        dailyVerseTime: state.dailyVerseTime,
        theme: state.theme,
        purchasedPackages: state.purchasedPackages,
        isPremium: state.isPremium,
        hasOnboarded: state.hasOnboarded,
        totalListeningSeconds: state.totalListeningSeconds,
        totalSurahsCompleted: state.totalSurahsCompleted,
        reciterVolume: state.reciterVolume,
        ambientVolume: state.ambientVolume,
        backgroundVolume: state.backgroundVolume,
        ambientSoundId: state.ambientSoundId,
        backgroundSoundId: state.backgroundSoundId,
        ambientEnabled: state.ambientEnabled,
        backgroundEnabled: state.backgroundEnabled,
      }),
    }
  )
);
