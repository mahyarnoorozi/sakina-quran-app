// دیتای قاری‌ها و صداهای طبیعت و پریست‌ها
// همه صداها در حالت تست رایگان هستند

export interface Reciter {
  id: string;
  name: string;
  arabicName: string;
  nationality: "ایرانی" | "عرب" | "مصری" | "سعودی" | "کویتی";
  description: string;
  premium: boolean;
  color: string;
  everyayahId: string;
  bitrate: string;
  image: string;
  bio?: string;
  rating?: number;
  downloads?: string;
  style?: string;
}

export const reciters: Reciter[] = [
  {
    id: "abdulbasit",
    name: "عبدالباسط عبدالصمد",
    arabicName: "عبد الباسط عبد الصمد",
    nationality: "مصری",
    description: "استاد بزرگ قرن، صدای نفس‌گیر و احساسی",
    premium: false,
    color: "#8B5A3C",
    everyayahId: "Abdul_Basit_Murattal_192kbps",
    bitrate: "192kbps",
    image: "/images/reciters-real/abdulbasit.jpg",
    bio: "استاد بزرگ قرن، صدای نفس‌گیر و احساسی. برنده سه مسابقه جهانی قیرات در دهه ۱۹۷۰.",
    rating: 5.0,
    downloads: "۵.۲M",
    style: "مجود + مرتل",
  },
  {
    id: "minshawi",
    name: "محمد صدیق منشاوی",
    arabicName: "محمد صدیق المنشاوي",
    nationality: "مصری",
    description: "قاری بزرگ مصری با صدای ناله‌گونه، مناسب خواب",
    premium: false,
    color: "#52796F",
    everyayahId: "Minshawy_Murattal_128kbps",
    bitrate: "128kbps",
    image: "/images/reciters-real/minshawi.jpg",
    bio: "قاری بزرگ مصری با صدای ناله‌گونه، مناسب خواندن با حالت انفعال و اشک.",
    rating: 4.9,
    downloads: "۳.۸M",
    style: "مرتل + مجود",
  },
  {
    id: "husary",
    name: "محمود خلیل الحصری",
    arabicName: "محمود خليل الحصري",
    nationality: "مصری",
    description: "استاد بزرگ و قاری رسمی، صدای علمی و دقیق",
    premium: false,
    color: "#A8893E",
    everyayahId: "Husary_128kbps",
    bitrate: "128kbps",
    image: "/images/reciters-real/husary.jpg",
    bio: "استاد بزرگ و قاری رسمی مسجد حسین قاهره. صدای علمی و دقیق، مناسب آموزش تجوید.",
    rating: 4.9,
    downloads: "۲.۱M",
    style: "مرتل + معلم",
  },
  {
    id: "sudais",
    name: "عبدالرحمن سودایس",
    arabicName: "عبد الرحمن السديس",
    nationality: "سعودی",
    description: "امام مسجدالحرام، صدای معبور و رسمی",
    premium: false,
    color: "#0B3D2E",
    everyayahId: "Abdurrahmaan_As-Sudais_192kbps",
    bitrate: "192kbps",
    image: "/images/reciters-real/sudais.jpg",
    bio: "امام مسجدالحرام، صدای معبور و رسمی. یکی از محبوب‌ترین قاریان جهان اسلام.",
    rating: 4.9,
    downloads: "۸.۱M",
    style: "مرتل",
  },
  {
    id: "shuraim",
    name: "سعود الشريم",
    arabicName: "سعود الشريم",
    nationality: "سعودی",
    description: "امام مسجدالحرام، صدای آرام و رسمی",
    premium: false,
    color: "#1A6B47",
    everyayahId: "Saood_ash-Shuraym_128kbps",
    bitrate: "128kbps",
    image: "/images/reciters-real/shuraim.jpg",
    bio: "امام مسجدالحرام، صدای آرام و رسمی.",
    rating: 4.8,
    downloads: "۳.۵M",
    style: "مرتل",
  },
  {
    id: "ghamadi",
    name: "سعد الغامدی",
    arabicName: "سعد الغامدي",
    nationality: "سعودی",
    description: "قاری عربستانی با صدای ملایم و آرام، مناسب خواب",
    premium: false,
    color: "#2A9D8F",
    everyayahId: "Ghamadi_40kbps",
    bitrate: "40kbps",
    image: "/images/reciters-real/ghamdi.jpg",
    bio: "قاری عربستانی با صدای ملایم و آرام، مناسب گوش‌دادن قبل از خواب.",
    rating: 4.8,
    downloads: "۴.۵M",
    style: "مرتل",
  },
  {
    id: "afasy",
    name: "مشاری راشد العفاسی",
    arabicName: "مشاري راشد العفاسي",
    nationality: "کویتی",
    description: "قاری چندزبانه با ۱۰۰ میلیون فالوور، صدای رسا",
    premium: false,
    color: "#B8945A",
    everyayahId: "Alafasy_128kbps",
    bitrate: "128kbps",
    image: "/images/reciters-real/afasy.jpg",
    bio: "قاری چندزبانه با ۱۰۰ میلیون فالوور در شبکه‌های اجتماعی. صدای رسا و حرفه‌ای.",
    rating: 4.9,
    downloads: "۱۲M",
    style: "مرتل + إناشاد",
  },
  {
    id: "ajamy",
    name: "أحمد العجمی",
    arabicName: "أحمد العجمي",
    nationality: "سعودی",
    description: "قاری محبوب جوانان، صدای گرم و دلنشین",
    premium: false,
    color: "#7A5C3E",
    everyayahId: "Ahmed_ibn_Ali_al-Ajamy_128kbps_ketaballah.net",
    bitrate: "128kbps",
    image: "/images/reciters-real/ajamy.jpg",
    bio: "قاری محبوب جوانان، صدای گرم و دلنشین.",
    rating: 4.7,
    downloads: "۲.۸M",
    style: "مرتل",
  },
];

// ساخت URL صوتی آیه از everyayah.com
export function getAyahUrl(reciterEveryayahId: string, surahId: number, ayahNumber: number): string {
  const surah = String(surahId).padStart(3, "0");
  const ayah = String(ayahNumber).padStart(3, "0");
  return `https://everyayah.com/data/${reciterEveryayahId}/${surah}${ayah}.mp3`;
}

export interface NatureSound {
  id: string;
  name: string;
  description: string;
  category: "rain" | "fire" | "water" | "nature" | "instrument" | "silence";
  premium: boolean;
  icon: string;
  color: string;
  image: string;
}

/**
 * ۴ صدای آرامش — دقیقاً هم‌تراز Quranify (باران، امواج دریا، آتش، پرندگان)
 * هر صدا فایل واقعی لوپ‌شده اختصاصی دارد: /sounds/{id}.mp3
 */
export const natureSounds: NatureSound[] = [
  { id: "rain-light", name: "باران", description: "باران آرام و مداوم", category: "rain", premium: false, icon: "CloudRain", color: "#5a7894", image: "/images/sounds/rain-light.jpg" },
  { id: "ocean-waves", name: "امواج دریا", description: "موج آرام ساحل", category: "water", premium: false, icon: "Waves", color: "#5a7894", image: "/images/sounds/ocean-waves.jpg" },
  { id: "fire-camp", name: "آتش هیزم", description: "ترق‌تروق شومینه", category: "fire", premium: false, icon: "Flame", color: "#C5884A", image: "/images/sounds/fire-camp.jpg" },
  { id: "forest-birds", name: "پرندگان", description: "جنگل و آواز پرندگان", category: "nature", premium: false, icon: "Bird", color: "#5c7a4c", image: "/images/sounds/forest-birds.jpg" },
];

/** نام فارسی هر شناسه صدا — شامل شناسه‌های قدیمی استورهای persist‌شده */
const LEGACY_SOUND_NAMES: Record<string, string> = {
  "rain-heavy": "رگبار شدید",
  "rain-tent": "باران روی چادر",
  "thunder": "رعد و برق",
  "river-flow": "رودخانه",
  "waterfall": "آبشار",
  "wind-soft": "باد ملایم",
  "deep-forest": "جنگل عمیق",
  "cricket-night": "سوسک‌های شب",
  "crystal-bowls": "کاسه‌های کریستال",
  "singing-bowl": "سنگ آواز تبت",
  "wind-chimes": "زنگ باد",
  "white-noise": "نویز سفید",
  "brown-noise": "نویز قهوه‌ای",
  "pink-noise": "نویز صورتی",
};

export function soundNameOf(id: string | null): string {
  if (!id) return "خاموش";
  return natureSounds.find((s) => s.id === id)?.name ?? LEGACY_SOUND_NAMES[id] ?? id;
}

export interface MixerPreset {
  id: string;
  name: string;
  description: string;
  reciterId: string;
  surahId: number;
  ambientSoundId: string;
  ambientVolume: number;
  backgroundSoundId: string;
  backgroundVolume: number;
  reciterVolume: number;
  premium: boolean;
  iconColor: string;
}

export const mixerPresets: MixerPreset[] = [
  {
    id: "rainy-night",
    name: "شب بارانی",
    description: "تلاوت آرام زیر باران",
    reciterId: "ghamadi",
    surahId: 67,
    ambientSoundId: "rain-light",
    ambientVolume: 55,
    backgroundSoundId: "",
    backgroundVolume: 0,
    reciterVolume: 80,
    premium: false,
    iconColor: "#5a7894",
  },
  {
    id: "fire-place",
    name: "کنار آتش",
    description: "تلاوت گرم کنار هیزم",
    reciterId: "abdulbasit",
    surahId: 55,
    ambientSoundId: "fire-camp",
    ambientVolume: 50,
    backgroundSoundId: "",
    backgroundVolume: 0,
    reciterVolume: 80,
    premium: false,
    iconColor: "#C5884A",
  },
  {
    id: "ocean-calm",
    name: "ساحل دریا",
    description: "آرامش امواج بی‌کران",
    reciterId: "afasy",
    surahId: 36,
    ambientSoundId: "ocean-waves",
    ambientVolume: 55,
    backgroundSoundId: "",
    backgroundVolume: 0,
    reciterVolume: 75,
    premium: false,
    iconColor: "#5a7894",
  },
  {
    id: "morning-forest",
    name: "صبح جنگل",
    description: "آواز پرندگان و تلاوت صبحگاهی",
    reciterId: "sudais",
    surahId: 93,
    ambientSoundId: "forest-birds",
    ambientVolume: 45,
    backgroundSoundId: "",
    backgroundVolume: 0,
    reciterVolume: 80,
    premium: false,
    iconColor: "#5c7a4c",
  },
  {
    id: "ocean-rain",
    name: "باران ساحلی",
    description: "ترکیب باران و امواج",
    reciterId: "minshawi",
    surahId: 36,
    ambientSoundId: "ocean-waves",
    ambientVolume: 45,
    backgroundSoundId: "",
    backgroundVolume: 0,
    reciterVolume: 75,
    premium: false,
    iconColor: "#4a7a94",
  },
  {
    id: "quiet-recite",
    name: "فقط تلاوت",
    description: "بدون صدای محیط، فقط قرآن",
    reciterId: "husary",
    surahId: 112,
    ambientSoundId: "",
    ambientVolume: 0,
    backgroundSoundId: "",
    backgroundVolume: 0,
    reciterVolume: 90,
    premium: false,
    iconColor: "#A2813F",
  },
];

export interface Collection {
  id: string;
  title: string;
  description: string;
  surahIds: number[];
  reciterId: string;
  cover: string;
  premium: boolean;
  image: string;
}

export const collections: Collection[] = [
  {
    id: "sleep-collection",
    title: "آرامش قبل از خواب",
    description: "تلاوت‌های آرام برای شب‌های عمیق",
    surahIds: [67, 36, 55, 112, 113, 114],
    reciterId: "ghamadi",
    cover: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)",
    premium: false,
    image: "/images/collections/night.jpg",
  },
  {
    id: "30day-khatm",
    title: "ختم قرآن ۳۰ روزه",
    description: "برنامه روزانه برای ختم کامل قرآن",
    surahIds: Array.from({ length: 30 }, (_, i) => i + 1),
    reciterId: "afasy",
    cover: "linear-gradient(135deg, #0F5132 0%, #1A6B47 100%)",
    premium: false,
    image: "/images/collections/quran-book.jpg",
  },
  {
    id: "relaxing-recitations",
    title: "تلاوت‌های آرامش‌بخش",
    description: "انتخابی از زیباترین تلاوت‌ها",
    surahIds: [1, 36, 55, 67, 78, 109, 112],
    reciterId: "abdulbasit",
    cover: "linear-gradient(135deg, #8B5A3C 0%, #C9A961 100%)",
    premium: false,
    image: "/images/collections/mosque.jpg",
  },
  {
    id: "morning-verses",
    title: "آیات صبحگاهی",
    description: "شروع روز با نور قرآن",
    surahIds: [1, 2, 18, 36, 55, 67, 93],
    reciterId: "sudais",
    cover: "linear-gradient(135deg, #C9A961 0%, #FAF7F2 100%)",
    premium: false,
    image: "/images/collections/sunrise.jpg",
  },
];

// بسته‌های پرمیوم
export interface PremiumPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  features: string[];
  icon: string;
  color: string;
  popular?: boolean;
}

export const premiumPackages: PremiumPackage[] = [
  {
    id: "reciters-pack",
    name: "پک قاری طلایی",
    description: "قاری‌های برتر جهان اسلام",
    price: 89000,
    originalPrice: 120000,
    features: [
      "عبدالباسط عبدالصمد (مصری)",
      "عبدالرحمن سودایس (سعودی)",
      "مشاری العفاسی (کویتی)",
      "محمود خلیل الحصری",
      "سعد الغامدی",
      "و ۴ قاری دیگر",
    ],
    icon: "Crown",
    color: "#B8945A",
  },
  {
    id: "ambient-pack",
    name: "پک صداهای آرامش",
    description: "۱۲ صدای طبیعت اضافه",
    price: 69000,
    originalPrice: 95000,
    features: [
      "جیرجیرک شبانه",
      "طوفان زمستانی",
      "چایخانه سنتی",
      "زنگ باد",
      "کاسه‌های کریستال",
      "و ۷ صدای دیگر",
    ],
    icon: "Sparkles",
    color: "#9B5DE5",
  },
  {
    id: "mixer-pro-pack",
    name: "پک میکسر حرفه‌ای",
    description: "میکسر ۳ لایه + امکانات کامل",
    price: 79000,
    features: [
      "میکسر ۳ لایه همزمان",
      "ذخیره ترکیب نامحدود",
      "۱۰ پریست اضافی",
      "اکولایزر ۵ باند",
      "ضبط ترکیب صوتی",
      "حالت wake-up هوشمند",
    ],
    icon: "Sliders",
    color: "#0B3D2E",
  },
  {
    id: "full-pack",
    name: "بسته کامل «سکینه پلاس»",
    description: "همه پک‌ها + آپدیت سالانه",
    price: 249000,
    originalPrice: 345000,
    features: [
      "✓ پک قاری طلایی",
      "✓ پک صداهای آرامش",
      "✓ پک میکسر حرفه‌ای",
      "✓ ویجت‌های متنوع",
      "✓ آفلاین نامحدود",
      "✓ آپدیت‌های سالانه",
    ],
    icon: "Gem",
    color: "#B8945A",
    popular: true,
  },
];
