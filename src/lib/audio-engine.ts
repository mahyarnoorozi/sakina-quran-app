"use client";

/**
 * AudioEngine v3 — موتور صوتی «سَکینه»
 *
 * - تلاوت: everyayah.com (HTML5 Audio)
 * - صداهای طبیعت: فایل‌های MP3 واقعی از /sounds/
 * - توقف صحیح همه صداها
 * - کنترل مستقل حجم هر لایه
 */

import { getAyahUrl } from "@/data/audio";
import { surahs } from "@/data/quran";

// نگاشت sound ID به فایل محلی
const SOUND_FILES: Record<string, string> = {
  "rain-light": "/sounds/rain-light.mp3",
  "rain-heavy": "/sounds/rain-light.mp3",
  "rain-tent": "/sounds/rain-light.mp3",
  "fire-camp": "/sounds/fire.mp3",
  "ocean-waves": "/sounds/ocean.mp3",
  "river-flow": "/sounds/river.mp3",
  "waterfall": "/sounds/waterfall.mp3",
  "wind-soft": "/sounds/wind.mp3",
  "forest-birds": "/sounds/birds.mp3",
  "deep-forest": "/sounds/birds.mp3",
  "cricket-night": "/sounds/crickets.mp3",
  "thunder": "/sounds/thunder.mp3",
  "crystal-bowls": "/sounds/wind.mp3", // fallback
  "singing-bowl": "/sounds/wind.mp3",
  "wind-chimes": "/sounds/wind.mp3",
  "white-noise": "/sounds/wind.mp3",
  "brown-noise": "/sounds/wind.mp3",
  "pink-noise": "/sounds/wind.mp3",
};

class AudioEngineClass {
  // لایه تلاوت - HTML5 Audio
  private recitationAudio: HTMLAudioElement | null = null;
  private currentReciterId: string = "";
  private currentSurahId: number = 0;
  private currentAyah: number = 1;
  private recitationVolume: number = 80;
  private recitationPlaying: boolean = false;
  private onAyahChange?: (ayah: number) => void;

  // لایه صدای محیط - HTML5 Audio (loop)
  private ambientAudio: HTMLAudioElement | null = null;
  private ambientVolume: number = 50;

  // لایه صدای زمینه - HTML5 Audio (loop)
  private backgroundAudio: HTMLAudioElement | null = null;
  private backgroundVolume: number = 30;

  // ===== لایه ۱: تلاوت قرآن =====

  playRecitation(reciterEveryayahId: string, surahId: number, startAyah: number = 1, onAyahChange?: (ayah: number) => void) {
    this.stopRecitation();
    this.currentReciterId = reciterEveryayahId;
    this.currentSurahId = surahId;
    this.currentAyah = startAyah;
    this.onAyahChange = onAyahChange;
    this.recitationPlaying = true;
    this.loadAndPlayAyah();
  }

  private loadAndPlayAyah() {
    if (!this.currentReciterId || !this.currentSurahId) return;

    const surah = surahs.find((s) => s.id === this.currentSurahId);
    if (!surah) return;

    if (this.currentAyah > surah.versesCount) {
      this.currentAyah = 1;
    }

    const url = getAyahUrl(this.currentReciterId, this.currentSurahId, this.currentAyah);
    console.log("🎵 Loading ayah:", url);

    if (this.recitationAudio) {
      this.recitationAudio.pause();
      this.recitationAudio.src = "";
    }

    const audio = new Audio();
    audio.volume = this.recitationVolume / 100;
    audio.preload = "auto";

    let hasEnded = false;
    let hasErrored = false;

    audio.addEventListener("loadedmetadata", () => {
      console.log("✅ Audio loaded, duration:", audio.duration);
    });

    audio.addEventListener("playing", () => {
      console.log("▶️ Audio started playing");
    });

    audio.addEventListener("ended", () => {
      if (hasEnded || hasErrored) return;
      hasEnded = true;
      if (audio.duration > 0 && audio.currentTime > 0) {
        console.log("⏭️ Ayah ended, going to next");
        this.currentAyah++;
        this.onAyahChange?.(this.currentAyah);
        if (this.recitationPlaying) {
          setTimeout(() => this.loadAndPlayAyah(), 300);
        }
      }
    });

    audio.addEventListener("error", (e) => {
      if (hasErrored || hasEnded) return;
      if (audio.error && audio.currentTime === 0) {
        hasErrored = true;
        console.warn(`❌ Error loading ayah ${this.currentAyah} surah ${this.currentSurahId}`);
        if (this.recitationPlaying) {
          setTimeout(() => {
            if (this.recitationPlaying) {
              hasErrored = false;
              this.loadAndPlayAyah();
            }
          }, 2000);
        }
      }
    });

    audio.src = url;
    audio.load();

    audio.play().then(() => {
      console.log("✅ Play promise resolved");
    }).catch((err) => {
      console.warn("❌ Play promise rejected:", err.message);
    });

    this.recitationAudio = audio;
  }

  pauseRecitation() {
    this.recitationPlaying = false;
    if (this.recitationAudio) {
      this.recitationAudio.pause();
    }
  }

  resumeRecitation() {
    this.recitationPlaying = true;
    if (this.recitationAudio) {
      this.recitationAudio.play().catch(() => {});
    }
  }

  stopRecitation() {
    this.recitationPlaying = false;
    if (this.recitationAudio) {
      this.recitationAudio.pause();
      this.recitationAudio.src = "";
      this.recitationAudio.load();
      this.recitationAudio = null;
    }
  }

  setRecitationVolume(volume: number) {
    this.recitationVolume = volume;
    if (this.recitationAudio) {
      this.recitationAudio.volume = volume / 100;
    }
  }

  setAyah(ayah: number) {
    this.currentAyah = ayah;
    if (this.recitationPlaying) {
      this.loadAndPlayAyah();
    }
  }

  // ===== لایه ۲: صدای محیط =====

  playAmbient(soundId: string, volume: number) {
    this.stopAmbient();
    this.ambientVolume = volume;

    const fileUrl = SOUND_FILES[soundId];
    if (!fileUrl) {
      console.warn("No sound file for:", soundId);
      return;
    }

    console.log("🌧️ Playing ambient:", fileUrl);
    const audio = new Audio(fileUrl);
    audio.loop = true;
    audio.volume = volume / 100;
    audio.preload = "auto";

    audio.play().then(() => {
      console.log("✅ Ambient playing");
    }).catch((err) => {
      console.warn("❌ Ambient failed:", err.message);
    });

    this.ambientAudio = audio;
  }

  stopAmbient() {
    if (this.ambientAudio) {
      this.ambientAudio.pause();
      this.ambientAudio.src = "";
      this.ambientAudio = null;
    }
  }

  setAmbientVolume(volume: number) {
    this.ambientVolume = volume;
    if (this.ambientAudio) {
      this.ambientAudio.volume = volume / 100;
    }
  }

  isAmbientPlaying() {
    return this.ambientAudio !== null && !this.ambientAudio.paused;
  }

  // ===== لایه ۳: صدای زمینه =====

  playBackground(soundId: string, volume: number) {
    this.stopBackground();
    this.backgroundVolume = volume;

    const fileUrl = SOUND_FILES[soundId];
    if (!fileUrl) {
      console.warn("No sound file for:", soundId);
      return;
    }

    console.log("🍃 Playing background:", fileUrl);
    const audio = new Audio(fileUrl);
    audio.loop = true;
    audio.volume = volume / 100;
    audio.preload = "auto";

    audio.play().then(() => {
      console.log("✅ Background playing");
    }).catch((err) => {
      console.warn("❌ Background failed:", err.message);
    });

    this.backgroundAudio = audio;
  }

  stopBackground() {
    if (this.backgroundAudio) {
      this.backgroundAudio.pause();
      this.backgroundAudio.src = "";
      this.backgroundAudio = null;
    }
  }

  setBackgroundVolume(volume: number) {
    this.backgroundVolume = volume;
    if (this.backgroundAudio) {
      this.backgroundAudio.volume = volume / 100;
    }
  }

  isBackgroundPlaying() {
    return this.backgroundAudio !== null && !this.backgroundAudio.paused;
  }

  // ===== توقف همه =====

  stopAll() {
    this.stopRecitation();
    this.stopAmbient();
    this.stopBackground();
  }

  pauseAll() {
    this.pauseRecitation();
    if (this.ambientAudio) this.ambientAudio.pause();
    if (this.backgroundAudio) this.backgroundAudio.pause();
  }

  resumeAll() {
    this.resumeRecitation();
    if (this.ambientAudio) this.ambientAudio.play().catch(() => {});
    if (this.backgroundAudio) this.backgroundAudio.play().catch(() => {});
  }
}

export const audioEngine = new AudioEngineClass();
