"use client";

/**
 * AudioEngine v5 — موتور صوتی «سَکینه»
 *
 * لایه ۱ تلاوت: everyayah (HTML5 Audio) — آیه‌به‌آیه با preload آیه بعد
 * لایه ۲ طبیعت: لوپ MP3 محلی با ولوم مستقل
 * لایه ۳ پس‌زمینه هارمونیک: لوپ MP3 محلی با ولوم پایین
 * تایمر خواب: فیدآوت تدریجی ۹۰ ثانیه‌ای
 * دانلود آفلاین: Cache API + fallback استریم
 */

import { getAyahUrl } from "@/data/audio";
import { surahs } from "@/data/quran";

const SOUND_FILES: Record<string, string> = {
  // ۴ صدای اصلی — دقیقاً هم‌تعداد Quranify (باران/امواج/آتش/پرندگان)
  // هر شناسه به فایل واقعی موجود در public/sounds اشاره می‌کند (بدون 404)
  "rain-light": "/sounds/rain-light.mp3",
  "ocean-waves": "/sounds/ocean-waves.mp3",
  "fire-camp": "/sounds/fire-camp.mp3",
  "forest-birds": "/sounds/birds.mp3",
  // نگاشت شناسه‌های قدیمی برای سازگاری استور persist‌شده
  "rain-heavy": "/sounds/rain-light.mp3",
  "rain-tent": "/sounds/rain-light.mp3",
  "thunder": "/sounds/thunder.mp3",
  "river-flow": "/sounds/river.mp3",
  "waterfall": "/sounds/waterfall.mp3",
  "wind-soft": "/sounds/wind.mp3",
  "deep-forest": "/sounds/birds.mp3",
  "cricket-night": "/sounds/crickets.mp3",
  "crystal-bowls": "/sounds/ocean-waves.mp3",
  "singing-bowl": "/sounds/ocean-waves.mp3",
  "wind-chimes": "/sounds/wind.mp3",
  "white-noise": "/sounds/rain-light.mp3",
  "brown-noise": "/sounds/rain-light.mp3",
  "pink-noise": "/sounds/rain-light.mp3",
};

const AUDIO_CACHE = "sakina-audio-v5";
const FADE_SECONDS = 90;

class AudioEngineClass {
  private recitation: HTMLAudioElement | null = null;
  private preload: HTMLAudioElement | null = null;
  private ambient: HTMLAudioElement | null = null;
  private background: HTMLAudioElement | null = null;

  private onAyahListener: ((ayah: number) => void) | null = null;
  private onEndedListener: (() => void) | null = null;

  // وضعیت جاری که engine خودش نگه می‌دارد
  private reciterEveryayahId = "";
  private surahId = 1;
  private ayah = 1;
  private playing = false;
  private volume = 0.8;

  private sleepEndsAt: number | null = null;
  private fadeInterval: ReturnType<typeof setInterval> | null = null;
  private watchdog: ReturnType<typeof setInterval> | null = null;

  /**
   * توکن نسلِ پخش — هر دستور توقف/پخش جدید آن را بالا می‌برد.
   * playRecitation بعد از هر await چک می‌کند؛ اگر توکن عوض شده باشد
   * یعنی کاربر وسط لود، توقف/مسیر عوض کرده → آدیو ساخته نمی‌شود.
   * (رفع باگ «استپ فوری نمی‌شود»: بدون این، آدیویی که بعد از pause
   * از await بیرون می‌آمد دوباره پخش می‌شد.)
   */
  private playSeq = 0;

  private startedAt = 0;
  private accumulated = 0;

  // ===== callbacks از استور =====
  setHandlers(onAyah: (ayah: number) => void, onEnded: () => void) {
    this.onAyahListener = onAyah;
    this.onEndedListener = onEnded;
  }

  // ===== دانلود آفلاین =====
  private async cacheMatch(url: string): Promise<string | null> {
    try {
      if (typeof caches === "undefined") return null;
      const cache = await caches.open(AUDIO_CACHE);
      const hit = await cache.match(url);
      if (!hit) return null;
      const blob = await hit.blob();
      return URL.createObjectURL(blob);
    } catch {
      return null;
    }
  }

  async downloadSurah(
    reciterEveryayahId: string,
    surahId: number,
    onProgress?: (pct: number) => void
  ): Promise<{ ok: boolean; cached: number }> {
    const surah = surahs.find((s) => s.id === surahId);
    if (!surah) return { ok: false, cached: 0 };
    if (typeof caches === "undefined") return { ok: false, cached: 0 };
    const cache = await caches.open(AUDIO_CACHE);
    const total = surah.versesCount;
    let done = 0;
    let cached = 0;
    // دانلود موازی دسته‌ای (۶تا۶تا) برای سرعت
    const CONCURRENCY = 6;
    const list = Array.from({ length: total }, (_, i) => i + 1);
    let cursor = 0;
    const worker = async () => {
      while (cursor < list.length) {
        const a = list[cursor++];
        const url = getAyahUrl(reciterEveryayahId, surahId, a);
        try {
          const hit = await cache.match(url);
          if (!hit) {
            const res = await fetch(url, { mode: "cors" });
            if (res.ok) {
              await cache.put(url, res.clone());
              cached++;
            }
          } else {
            cached++;
          }
        } catch {}
        done++;
        onProgress?.(Math.round((done / total) * 100));
      }
    };
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    return { ok: cached === total, cached };
  }

  /** دانلود و کش صداهای محیطی (همین‌origin) */
  async downloadSounds(soundIds: string[], onProgress?: (pct: number) => void): Promise<boolean> {
    if (typeof caches === "undefined") return false;
    const cache = await caches.open(AUDIO_CACHE);
    let done = 0;
    for (const id of soundIds) {
      const file = SOUND_FILES[id];
      if (file) {
        try {
          const hit = await cache.match(file);
          if (!hit) {
            const res = await fetch(file);
            if (res.ok) await cache.put(file, res.clone());
          }
        } catch {}
      }
      done++;
      onProgress?.(Math.round((done / soundIds.length) * 100));
    }
    return true;
  }

  async clearCache(): Promise<void> {
    try {
      if (typeof caches !== "undefined") await caches.delete(AUDIO_CACHE);
    } catch {}
  }

  // ===== لایه ۱: تلاوت =====

  private async buildRecitationUrl(surahId: number, ayah: number): Promise<string> {
    const remote = getAyahUrl(this.reciterEveryayahId, surahId, ayah);
    const local = await this.cacheMatch(remote);
    return local ?? remote;
  }

  async playRecitation(opts: {
    reciterEveryayahId: string;
    surahId: number;
    ayah: number;
    volume: number; // ۰-۱۰۰
    speed?: number;
  }) {
    // فرمان پخش جدید → نسل قبلی باطل
    this.playSeq++;
    const seq = this.playSeq; // نسل این فرمان
    const changedTrack =
      this.surahId !== opts.surahId ||
      this.ayah !== opts.ayah ||
      this.reciterEveryayahId !== opts.reciterEveryayahId;

    this.reciterEveryayahId = opts.reciterEveryayahId;
    this.surahId = opts.surahId;
    this.ayah = opts.ayah;
    this.volume = Math.min(100, Math.max(0, opts.volume)) / 100;
    this.playing = true;

    if (!changedTrack && this.recitation) {
      this.recitation.play().catch(() => {});
      this.startWatchdog();
      return;
    }

    // توقف داخلی — بدون بالا بردن playSeq (وگرنه گارد نسل پایین همیشه رد می‌شد)
    this.stopRecitation(false, false);
    // stopRecitation فلگ playing را false می‌کند؛ فرمان پخشِ فعال را دوباره ثبت کن
    // (وگرنه گارد بعد از await همیشه early-return می‌شد: پخش هیچ‌وقت شروع نمی‌شد)
    this.playing = true;

    const remote = getAyahUrl(this.reciterEveryayahId, opts.surahId, opts.ayah);
    const local = await this.cacheMatch(remote);

    // گارد نسل: در فاصله‌ی await، توقف/فرمان پخش جدید آمده → بی‌خیال این آدیو
    if (seq !== this.playSeq || !this.playing) return;

    let audio: HTMLAudioElement;
    if (local) {
      audio = new Audio(local);
    } else {
      // استفاده از پیش‌بارگذاری موجود → جلو‌رفتن آیه فوری شروع می‌شود
      const pre = this.takePreloadFor(remote);
      audio = pre ?? new Audio(remote);
      if (!pre) {
        audio.preload = "auto";
      }
    }
    audio.volume = this.currentFadeFactor() * this.volume;
    audio.playbackRate = opts.speed ?? 1;

    audio.addEventListener("ended", () => {
      this.accumulated += audio.duration || 0;
      this.onAyahListener?.(this.ayah + 1);
      this.onEndedListener?.();
    });

    this.recitation = audio;
    this.startedAt = Date.now();
    audio.play().catch(() => {
      // خطای پخش — تلاش برای آیه بعد نمی‌کنیم، کاربر می‌بیند
    });
    this.preloadNext();
    this.startWatchdog();
  }

  /** اگر آدیوی پیش‌بارگذاری‌شده دقیقاً همان آدرس است، مصرفش کن (شروع آنی) */
  private takePreloadFor(remoteUrl: string): HTMLAudioElement | null {
    if (this.preload && this.preload.src === remoteUrl) {
      const el = this.preload;
      this.preload = null;
      return el;
    }
    if (this.preload) {
      this.preload.src = "";
      this.preload = null;
    }
    return null;
  }

  private preloadNext() {
    try {
      const nextAyah = this.ayah + 1;
      const surah = surahs.find((s) => s.id === this.surahId);
      if (!surah || nextAyah > surah.versesCount) return;
      const url = getAyahUrl(this.reciterEveryayahId, this.surahId, nextAyah);
      const p = new Audio();
      p.preload = "auto";
      p.src = url;
      this.preload = p;
    } catch {}
  }

  pauseRecitation() {
    this.playSeq++; // باطل‌کردن هر playRecitation در جریان
    this.playing = false;
    this.recitation?.pause();
    this.stopWatchdog();
  }

  /**
   * stopRecitation — bumpSeq فقط برای فرمان‌های کاربری/خارجی true است.
   * فراخوانی داخلی playRecitation (false, false) نسل را عوض نمی‌کند تا
   * گارد نسل، فرمان خودش را باطل نکند.
   */
  stopRecitation(clearListeners = true, bumpSeq = true) {
    if (bumpSeq) this.playSeq++;
    if (this.recitation) {
      this.recitation.pause();
      this.recitation.src = "";
      this.recitation = null;
    }
    if (this.preload) {
      this.preload.src = "";
      this.preload = null;
    }
    this.playing = false;
    if (clearListeners) {
      this.onAyahListener = null;
      this.onEndedListener = null;
    }
    this.stopWatchdog();
    this.stopFade();
    this.sleepEndsAt = null;
  }

  setRecitationVolume(v: number) {
    this.volume = Math.min(100, Math.max(0, v)) / 100;
    if (this.recitation && !this.sleepEndsAt) {
      this.recitation.volume = this.volume;
    }
  }

  setRecitationSpeed(speed: number) {
    if (this.recitation) this.recitation.playbackRate = speed;
  }

  seekAyahStart() {
    if (this.recitation) {
      this.recitation.currentTime = 0;
      this.recitation.play().catch(() => {});
    }
  }

  /** پرش به نسبت ۰-۱ از آیه جاری — برای نوار پیشرفت قابل‌کشیدن */
  seekToRatio(ratio: number) {
    const el = this.recitation;
    if (!el) return;
    const apply = () => {
      const d = el.duration;
      if (!isFinite(d) || d <= 0) return;
      const r = Math.min(1, Math.max(0, ratio));
      try {
        el.currentTime = r * Math.max(0, d - 0.2);
      } catch {}
    };
    if (el.readyState >= 1) apply();
    else el.addEventListener("loadedmetadata", apply, { once: true });
  }

  /** آیا تلاوت واقعاً در حال پخش است؟ (رفع باگ توقف ناقص) */
  hasActiveRecitation(): boolean {
    return !!this.recitation && !this.recitation.paused;
  }

  /** جابه‌جایی نسبی روی فایل آیه جاری (ثانیه) — فوری، حتی قبل از لود متادیتا */
  seekBy(seconds: number) {
    const el = this.recitation;
    if (!el) return;
    const apply = () => {
      const d = el.duration;
      const max = isFinite(d) && d > 0 ? Math.max(0, d - 0.15) : Number.MAX_SAFE_INTEGER;
      const target = Math.min(Math.max(0, el.currentTime + seconds), max);
      try {
        el.currentTime = target;
      } catch {
        // هنوز قابل seek نیست — بی‌خیال
      }
    };
    if (el.readyState >= 1) {
      apply();
    } else {
      // متادیتا هنوز نرسیده — به‌محض رسیدن اعمال کن
      el.addEventListener("loadedmetadata", apply, { once: true });
    }
  }

  // ===== لایه ۲/۳: محیط =====

  private buildLoop(soundId: string, volume: number): HTMLAudioElement | null {
    const file = SOUND_FILES[soundId];
    if (!file) return null;
    const audio = new Audio(file);
    audio.loop = true;
    audio.volume = Math.min(1, Math.max(0, volume / 100));
    return audio;
  }

  setAmbient(soundId: string | null, volume: number, force = true) {
    if (!soundId) {
      if (this.ambient) {
        this.ambient.pause();
        this.ambient = null;
      }
      return;
    }
    const file = SOUND_FILES[soundId];
    if (this.ambient && file && this.ambient.src.includes(file)) {
      this.ambient.volume = Math.min(1, volume / 100);
      return;
    }
    if (this.ambient) {
      this.ambient.pause();
      this.ambient = null;
    }
    const el = this.buildLoop(soundId, volume);
    // پخش مستقل — بدون نیاز به تلاوت فعال (رفع باگ گزارش کاربر)
    if (el && force) el.play().catch(() => {});
    this.ambient = el;
    this.ambientWasPlaying = !!el;
  }

  setBackground(soundId: string | null, volume: number, force = true) {
    if (!soundId) {
      if (this.background) {
        this.background.pause();
        this.background = null;
      }
      return;
    }
    const file = SOUND_FILES[soundId];
    if (this.background && file && this.background.src.includes(file)) {
      this.background.volume = Math.min(1, volume / 100);
      return;
    }
    if (this.background) {
      this.background.pause();
      this.background = null;
    }
    const el = this.buildLoop(soundId, volume);
    if (el && force) el.play().catch(() => {});
    this.background = el;
  }

  private ambientWasPlaying = false;

  // ===== شروع/توقف کل =====

  playAll() {
    this.playing = true;
    this.ambientWasPlaying = true;
    this.recitation?.play().catch(() => {});
    this.ambient?.play().catch(() => {});
    this.background?.play().catch(() => {});
    this.startWatchdog();
  }

  pauseAll() {
    this.playSeq++; // بی‌درز: هر پخش در جریان (حتی وسط await) را باطل می‌کند
    this.playing = false;
    this.ambientWasPlaying = false;
    this.recitation?.pause();
    this.ambient?.pause();
    this.background?.pause();
    this.stopWatchdog();
  }

  /** فقط لایه‌های محیط (حالت خواب بدون تلاوت) */
  playAmbientOnly() {
    this.ambientWasPlaying = true;
    this.ambient?.play().catch(() => {});
    this.background?.play().catch(() => {});
  }

  stopAll() {
    this.stopRecitation();
    if (this.ambient) {
      this.ambient.pause();
      this.ambient = null;
    }
    if (this.background) {
      this.background.pause();
      this.background = null;
    }
    this.playing = false;
    this.ambientWasPlaying = false;
  }

  /** ضریب ولوم لحظه‌ای هنگام فید خواب (۰-۱) — برای آدیوهای تازه‌ساخته */
  private currentFadeFactor(): number {
    if (!this.sleepEndsAt) return 1;
    const remainSec = Math.max(0, (this.sleepEndsAt - Date.now()) / 1000);
    if (remainSec >= FADE_SECONDS) return 1;
    return Math.max(0, remainSec / FADE_SECONDS);
  }

  // ===== تایمر خواب با فیدآوت =====

  startSleepTimer(minutes: number, onEnd?: () => void) {
    this.stopFade();
    this.sleepEndsAt = Date.now() + minutes * 60_000;
    this.fadeInterval = setInterval(() => {
      if (!this.sleepEndsAt) return;
      const remainMs = this.sleepEndsAt - Date.now();
      const remainSec = remainMs / 1000;
      if (remainSec <= 0) {
        this.stopFade();
        this.stopAll();
        this.sleepEndsAt = null;
        onEnd?.();
        return;
      }
      if (remainSec < FADE_SECONDS) {
        const factor = Math.max(0, remainSec / FADE_SECONDS);
        if (this.recitation) this.recitation.volume = this.volume * factor;
        if (this.ambient) this.ambient.volume = (this.ambientVolume0 ?? 0.5) * factor;
        if (this.background) this.background.volume = (this.backgroundVolume0 ?? 0.2) * factor;
      }
    }, 1000);
  }

  cancelSleepTimer() {
    this.stopFade();
    this.sleepEndsAt = null;
    if (this.recitation) this.recitation.volume = this.volume;
  }

  private ambientVolume0: number | null = null;
  private backgroundVolume0: number | null = null;

  setAmbientBaseVolume(v: number) {
    this.ambientVolume0 = Math.min(1, Math.max(0, v / 100));
    if (this.ambient && !this.sleepEndsAt) this.ambient.volume = this.ambientVolume0;
  }

  setBackgroundBaseVolume(v: number) {
    this.backgroundVolume0 = Math.min(1, Math.max(0, v / 100));
    if (this.background && !this.sleepEndsAt) this.background.volume = this.backgroundVolume0;
  }

  private stopFade() {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
  }

  get sleepRemainingMs(): number {
    if (!this.sleepEndsAt) return 0;
    return Math.max(0, this.sleepEndsAt - Date.now());
  }

  // ===== watchdog — پخش گیرکرده را ادامه می‌دهد =====

  private lastTime = 0;
  private stallCount = 0;

  private startWatchdog() {
    this.stopWatchdog();
    this.lastTime = this.recitation?.currentTime ?? 0;
    this.stallCount = 0;
    this.watchdog = setInterval(() => {
      if (!this.playing || !this.recitation) return;
      const t = this.recitation.currentTime;
      if (Math.abs(t - this.lastTime) < 0.05) {
        this.stallCount++;
        if (this.stallCount >= 4) {
          // ۴ ثانیه بدون پیشرفت → retry
          this.stallCount = 0;
          if (this.recitation.paused) this.recitation.play().catch(() => {});
        }
      } else {
        this.stallCount = 0;
      }
      this.lastTime = t;
    }, 1000);
  }

  private stopWatchdog() {
    if (this.watchdog) {
      clearInterval(this.watchdog);
      this.watchdog = null;
    }
  }

  // آمار شنیدن این نشست (ثانیه تقریبی)
  sessionSeconds(): number {
    let total = this.accumulated;
    if (this.playing && this.startedAt) {
      total += (Date.now() - this.startedAt) / 1000;
    }
    return Math.round(total);
  }

  get progress(): { surahId: number; ayah: number; currentTime: number; duration: number } {
    return {
      surahId: this.surahId,
      ayah: this.ayah,
      currentTime: this.recitation?.currentTime ?? 0,
      duration: this.recitation?.duration || 0,
    };
  }

  /** وضعیت داخلی برای دیباگ/E2E */
  get debugState() {
    return {
      playSeq: this.playSeq,
      playing: this.playing,
      hasRecitation: !!this.recitation,
      recitationSrc: this.recitation?.src?.slice(-20) ?? null,
      recitationPaused: this.recitation?.paused ?? null,
      recitationReady: this.recitation?.readyState ?? null,
      recitationError: this.recitation?.error?.code ?? null,
      preloadSrc: this.preload?.src?.slice(-20) ?? null,
    };
  }
}

export const AudioEngine = new AudioEngineClass();
