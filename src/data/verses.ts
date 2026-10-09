"use client";

/**
 * لودر متن کامل قرآن — ۱۱۴ سوره، ۶۲۳۶ آیه + ترجمه فارسی (مکارم)
 * داده از /data/quran-full.json (۲.۸MB) یک‌بار لود و در حافظه کش می‌شود.
 */

export interface Verse {
  number: number;
  arabic: string;
  persian: string;
}

type FullQuran = Record<string, [string, string][]>;

let cache: FullQuran | null = null;
let pending: Promise<FullQuran> | null = null;

export function loadFullQuran(): Promise<FullQuran> {
  if (cache) return Promise.resolve(cache);
  if (pending) return pending;
  pending = fetch("/data/quran-full.json")
    .then((r) => {
      if (!r.ok) throw new Error(`load failed: ${r.status}`);
      return r.json() as Promise<FullQuran>;
    })
    .then((data) => {
      cache = data;
      return data;
    })
    .catch((e) => {
      pending = null;
      throw e;
    });
  return pending;
}

export function getCachedVerses(surahId: number): Verse[] | null {
  if (!cache) return null;
  const raw = cache[String(surahId)];
  if (!raw) return null;
  return raw.map(([arabic, persian], i) => ({ number: i + 1, arabic, persian }));
}

export async function getVerses(surahId: number): Promise<Verse[]> {
  await loadFullQuran();
  return getCachedVerses(surahId) ?? [];
}

/* ===== آیه روز — قطعی بر اساس تاریخ ===== */

export interface VerseOfDay {
  surahId: number;
  ayah: number;
  arabic: string;
  persian: string;
  ref: string;
}

// سوره‌های کوتاه‌به‌میانه با آیه‌های معنادار برای نمایش روزانه
const VOD_POOL: Array<[number, number]> = [
  [94, 5], [94, 6], [13, 28], [2, 152], [2, 153], [2, 286], [3, 139], [3, 173],
  [8, 46], [12, 87], [14, 7], [16, 97], [16, 128], [17, 70], [20, 114], [25, 74],
  [28, 24], [29, 69], [30, 21], [33, 56], [39, 53], [40, 60], [41, 33], [47, 24],
  [50, 16], [55, 13], [57, 4], [57, 20], [59, 22], [59, 23], [65, 2], [65, 3],
  [67, 2], [73, 9], [76, 9], [87, 7], [89, 27], [91, 9], [93, 5], [96, 1],
  [99, 7], [103, 3], [107, 3], [110, 3], [112, 1], [113, 1], [114, 1],
  [2, 255], [2, 186], [2, 45], [7, 56], [7, 199], [9, 51], [10, 62], [24, 35],
  [26, 80], [31, 18], [35, 10], [39, 23], [42, 43], [48, 4], [53, 43], [58, 22],
];

const PERSIAN_SURAH_NAMES: Record<number, string> = {
  1: "فاتحه", 2: "بقره", 3: "آل عمران", 7: "اعراف", 8: "انفال", 9: "توبه",
  10: "یونس", 12: "یوسف", 13: "رعد", 14: "ابراهیم", 16: "نحل", 17: "اسراء",
  20: "طه", 24: "نور", 25: "فرقان", 26: "شعرا", 28: "قصص", 29: "عنکبوت",
  30: "روم", 31: "لقمان", 33: "احزاب", 35: "فاطر", 36: "یس", 39: "زمر",
  40: "غافر", 41: "فصلت", 42: "شوری", 43: "زخرف", 47: "محمد", 48: "فتح",
  50: "ق", 53: "نجم", 55: "رحمن", 57: "حدید", 58: "مجادله", 59: "حشر",
  65: "طلاق", 67: "ملک", 73: "مزمل", 76: "انسان", 87: "اعلی", 89: "فجر",
  91: "شمس", 93: "ضحی", 94: "شرح", 96: "علق", 99: "زلزله", 103: "عصر",
  107: "ماعون", 110: "نصر", 112: "اخلاص", 113: "فلق", 114: "ناس",
};

export async function getVerseOfDay(): Promise<VerseOfDay> {
  const now = new Date();
  const dayIndex =
    Math.floor(
      (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) -
        Date.UTC(2025, 0, 1)) /
        86400000
    ) % VOD_POOL.length;
  const [surahId, ayah] = VOD_POOL[dayIndex];
  const verses = await getVerses(surahId);
  const v = verses[ayah - 1];
  return {
    surahId,
    ayah,
    arabic: v?.arabic ?? "",
    persian: v?.persian ?? "",
    ref: `سوره ${PERSIAN_SURAH_NAMES[surahId] ?? surahId} · آیه ${toPersianDigits(ayah)}`,
  };
}

export function toPersianDigits(n: number | string): string {
  return String(n).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}
