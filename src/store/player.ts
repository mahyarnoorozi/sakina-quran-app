"use client";

/**
 * استور پلیر سکینه v5 — وضعیت پخش، میکسر سه‌لایه، تایمر خواب
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type RepeatMode = "off" | "one" | "surah";

interface SleepTimerState {
  /** دقیقه انتخابی (۱۵/۳۰/۴۵/۶۰) */
  minutes: number | null;
  /** زمان پایان مطلق (ms) */
  endsAt: number | null;
}

export interface PlayerState {
  // پخش
  isPlaying: boolean;
  surahId: number;
  ayah: number;
  reciterId: string;
  repeatMode: RepeatMode;
  playbackSpeed: number;
  volume: number; // ۰-۱۰۰ لایه تلاوت

  // میکسر — لایه ۲ و ۳
  ambientSoundId: string | null;
  ambientVolume: number;
  backgroundSoundId: string | null;
  backgroundVolume: number;

  // تایمر خواب
  sleepTimer: SleepTimerState;

  // UI
  expanded: boolean; // پلیر تمام‌صفحه باز است
  mixerOpen: boolean;

  // آخرین موقعیت برای «ادامه گوش دادن»
  lastPlayedAt: number;

  // اکشن‌ها
  play: (surahId: number, ayah?: number, reciterId?: string) => void;
  pause: () => void;
  resume: () => void;
  toggle: () => void;
  setAyah: (ayah: number) => void;
  setSurah: (surahId: number, restart?: boolean) => void;
  nextAyah: () => void;
  prevAyah: () => void;
  setReciter: (id: string) => void;
  cycleRepeat: () => void;
  setPlaybackSpeed: (s: number) => void;
  setVolume: (v: number) => void;
  setAmbient: (id: string | null) => void;
  setAmbientVolume: (v: number) => void;
  setBackground: (id: string | null) => void;
  setBackgroundVolume: (v: number) => void;
  startSleepTimer: (minutes: number) => void;
  cancelSleepTimer: () => void;
  setExpanded: (open: boolean) => void;
  setMixerOpen: (open: boolean) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      isPlaying: false,
      surahId: 1,
      ayah: 1,
      reciterId: "abdulbasit",
      repeatMode: "surah",
      playbackSpeed: 1,
      volume: 80,

      ambientSoundId: null,
      ambientVolume: 55,
      backgroundSoundId: null,
      backgroundVolume: 22,

      sleepTimer: { minutes: null, endsAt: null },

      expanded: false,
      mixerOpen: false,

      lastPlayedAt: 0,

      play: (surahId, ayah, reciterId) =>
        set((s) => ({
          surahId,
          ayah: ayah ?? (s.surahId === surahId ? s.ayah : 1),
          reciterId: reciterId ?? s.reciterId,
          isPlaying: true,
          lastPlayedAt: Date.now(),
        })),

      pause: () => set({ isPlaying: false }),
      resume: () =>
        set({ isPlaying: true, lastPlayedAt: Date.now() }),
      toggle: () =>
        set((s) => ({
          isPlaying: !s.isPlaying,
          lastPlayedAt: s.isPlaying ? s.lastPlayedAt : Date.now(),
        })),

      setAyah: (ayah) => set({ ayah, lastPlayedAt: Date.now() }),

      setSurah: (surahId, restart = false) =>
        set((s) => ({
          surahId,
          ayah: restart || s.surahId !== surahId ? 1 : s.ayah,
          lastPlayedAt: Date.now(),
        })),

      nextAyah: () => set((s) => ({ ayah: s.ayah + 1 })),
      prevAyah: () => set((s) => ({ ayah: Math.max(1, s.ayah - 1) })),

      setReciter: (id) => set({ reciterId: id }),
      cycleRepeat: () =>
        set((s) => ({
          repeatMode:
            s.repeatMode === "off"
              ? "surah"
              : s.repeatMode === "surah"
                ? "one"
                : "off",
        })),
      setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
      setVolume: (v) => set({ volume: v }),

      setAmbient: (id) => set({ ambientSoundId: id }),
      setAmbientVolume: (v) => set({ ambientVolume: v }),
      setBackground: (id) => set({ backgroundSoundId: id }),
      setBackgroundVolume: (v) => set({ backgroundVolume: v }),

      startSleepTimer: (minutes) =>
        set({ sleepTimer: { minutes, endsAt: Date.now() + minutes * 60_000 } }),
      cancelSleepTimer: () =>
        set({ sleepTimer: { minutes: null, endsAt: null } }),

      setExpanded: (open) => set({ expanded: open, mixerOpen: open ? false : get().mixerOpen }),
      setMixerOpen: (open) => set({ mixerOpen: open }),
    }),
    {
      name: "sakina-player-v5",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        surahId: s.surahId,
        ayah: s.ayah,
        reciterId: s.reciterId,
        repeatMode: s.repeatMode,
        playbackSpeed: s.playbackSpeed,
        volume: s.volume,
        ambientSoundId: s.ambientSoundId,
        ambientVolume: s.ambientVolume,
        backgroundSoundId: s.backgroundSoundId,
        backgroundVolume: s.backgroundVolume,
        lastPlayedAt: s.lastPlayedAt,
      }),
    }
  )
);
