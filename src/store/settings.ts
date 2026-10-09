"use client";

/**
 * استور تنظیمات سکینه v5 — تم، نمایش، صدا، آنبوردینگ
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ThemeChoice = "light" | "dark" | "system";
export type StreamQuality = "high" | "economy";

interface SettingsState {
  onboardingDone: boolean;

  theme: ThemeChoice;
  fontSize: number; // ۱۸ تا ۳۶ — متن عربی
  showTranslation: boolean;
  autoScroll: boolean;

  streamQuality: StreamQuality;
  gapless: boolean;

  setOnboardingDone: (done: boolean) => void;
  setTheme: (t: ThemeChoice) => void;
  setFontSize: (n: number) => void;
  setShowTranslation: (b: boolean) => void;
  setAutoScroll: (b: boolean) => void;
  setStreamQuality: (q: StreamQuality) => void;
  setGapless: (b: boolean) => void;

  resetAll: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      onboardingDone: false,

      theme: "dark",
      fontSize: 24,
      showTranslation: true,
      autoScroll: true,

      streamQuality: "high",
      gapless: true,

      setOnboardingDone: (onboardingDone) => set({ onboardingDone }),
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setShowTranslation: (showTranslation) => set({ showTranslation }),
      setAutoScroll: (autoScroll) => set({ autoScroll }),
      setStreamQuality: (streamQuality) => set({ streamQuality }),
      setGapless: (gapless) => set({ gapless }),

      resetAll: () =>
        set({
          onboardingDone: false,
          theme: "dark",
          fontSize: 24,
          showTranslation: true,
          autoScroll: true,
          streamQuality: "high",
          gapless: true,
        }),
    }),
    {
      name: "sakina-settings-v5",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
