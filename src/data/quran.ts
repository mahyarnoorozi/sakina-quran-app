// دیتای کامل ۱۱۴ سوره قرآن با مشخصات کامل
export interface Surah {
  id: number;
  arabicName: string;
  persianName: string;
  englishName: string;
  meaning: string;
  versesCount: number;
  type: "مکی" | "مدنی";
  revelationOrder: number;
  juz: string;
}

export const surahs: Surah[] = [
  { id: 1, arabicName: "الفاتحة", persianName: "فاتحه", englishName: "Al-Fatihah", meaning: "سوره گشایش", versesCount: 7, type: "مکی", revelationOrder: 5, juz: "۱" },
  { id: 2, arabicName: "البقرة", persianName: "بقرة", englishName: "Al-Baqarah", meaning: "گاو", versesCount: 286, type: "مدنی", revelationOrder: 87, juz: "۱-۳" },
  { id: 3, arabicName: "آل عمران", persianName: "آل عمران", englishName: "Aal-i-Imraan", meaning: "خانواده عمران", versesCount: 200, type: "مدنی", revelationOrder: 89, juz: "۳-۴" },
  { id: 4, arabicName: "النساء", persianName: "نساء", englishName: "An-Nisaa", meaning: "زنان", versesCount: 176, type: "مدنی", revelationOrder: 92, juz: "۴-۶" },
  { id: 5, arabicName: "المائدة", persianName: "مائده", englishName: "Al-Maaida", meaning: "سفره", versesCount: 120, type: "مدنی", revelationOrder: 112, juz: "۶-۷" },
  { id: 6, arabicName: "الأنعام", persianName: "انعام", englishName: "Al-An'aam", meaning: "چارپایان", versesCount: 165, type: "مکی", revelationOrder: 55, juz: "۷-۸" },
  { id: 7, arabicName: "الأعراف", persianName: "اعراف", englishName: "Al-A'raaf", meaning: "بلندی‌ها", versesCount: 206, type: "مکی", revelationOrder: 39, juz: "۸-۹" },
  { id: 8, arabicName: "الأنفال", persianName: "انفال", englishName: "Al-Anfaal", meaning: "غنائم", versesCount: 75, type: "مدنی", revelationOrder: 88, juz: "۹-۱۰" },
  { id: 9, arabicName: "التوبة", persianName: "توبه", englishName: "At-Tawba", meaning: "بازگشت", versesCount: 129, type: "مدنی", revelationOrder: 113, juz: "۱۰-۱۱" },
  { id: 10, arabicName: "يونس", persianName: "یونس", englishName: "Yunus", meaning: "یونس پیامبر", versesCount: 109, type: "مکی", revelationOrder: 51, juz: "۱۱" },
  { id: 11, arabicName: "هود", persianName: "هود", englishName: "Hud", meaning: "هود پیامبر", versesCount: 123, type: "مکی", revelationOrder: 52, juz: "۱۱-۱۲" },
  { id: 12, arabicName: "يوسف", persianName: "یوسف", englishName: "Yusuf", meaning: "یوسف پیامبر", versesCount: 111, type: "مکی", revelationOrder: 53, juz: "۱۲-۱۳" },
  { id: 13, arabicName: "الرعد", persianName: "رعد", englishName: "Ar-Ra'd", meaning: "رعد", versesCount: 43, type: "مدنی", revelationOrder: 96, juz: "۱۳" },
  { id: 14, arabicName: "إبراهيم", persianName: "ابراهیم", englishName: "Ibrahim", meaning: "ابراهیم پیامبر", versesCount: 52, type: "مکی", revelationOrder: 72, juz: "۱۳" },
  { id: 15, arabicName: "الحجر", persianName: "حجر", englishName: "Al-Hijr", meaning: "سرزمین حجر", versesCount: 99, type: "مکی", revelationOrder: 54, juz: "۱۴" },
  { id: 16, arabicName: "النحل", persianName: "نحل", englishName: "An-Nahl", meaning: "زنبور", versesCount: 128, type: "مکی", revelationOrder: 70, juz: "۱۴" },
  { id: 17, arabicName: "الإسراء", persianName: "اسراء", englishName: "Al-Israa", meaning: "شب‌گردی", versesCount: 111, type: "مکی", revelationOrder: 50, juz: "۱۵" },
  { id: 18, arabicName: "الكهف", persianName: "کهف", englishName: "Al-Kahf", meaning: "غار", versesCount: 110, type: "مکی", revelationOrder: 69, juz: "۱۵-۱۶" },
  { id: 19, arabicName: "مريم", persianName: "مریم", englishName: "Maryam", meaning: "مریم", versesCount: 98, type: "مکی", revelationOrder: 44, juz: "۱۶" },
  { id: 20, arabicName: "طه", persianName: "طه", englishName: "Taa-Haa", meaning: "طه", versesCount: 135, type: "مکی", revelationOrder: 45, juz: "۱۶" },
  { id: 21, arabicName: "الأنبياء", persianName: "انبیاء", englishName: "Al-Anbiyaa", meaning: "پیامبران", versesCount: 112, type: "مکی", revelationOrder: 73, juz: "۱۷" },
  { id: 22, arabicName: "الحج", persianName: "حج", englishName: "Al-Hajj", meaning: "حج", versesCount: 78, type: "مدنی", revelationOrder: 103, juz: "۱۷" },
  { id: 23, arabicName: "المؤمنون", persianName: "مؤمنون", englishName: "Al-Muminoon", meaning: "مؤمنان", versesCount: 118, type: "مکی", revelationOrder: 74, juz: "۱۸" },
  { id: 24, arabicName: "النور", persianName: "نور", englishName: "An-Noor", meaning: "نور", versesCount: 64, type: "مدنی", revelationOrder: 102, juz: "۱۸" },
  { id: 25, arabicName: "الفرقان", persianName: "فرقان", englishName: "Al-Furqaan", meaning: "معیار حق و باطل", versesCount: 77, type: "مکی", revelationOrder: 42, juz: "۱۸-۱۹" },
  { id: 26, arabicName: "الشعراء", persianName: "شعراء", englishName: "Ash-Shu'araa", meaning: "شاعران", versesCount: 227, type: "مکی", revelationOrder: 47, juz: "۱۹" },
  { id: 27, arabicName: "النمل", persianName: "نمل", englishName: "An-Naml", meaning: "مورچه", versesCount: 93, type: "مکی", revelationOrder: 48, juz: "۱۹-۲۰" },
  { id: 28, arabicName: "القصص", persianName: "قصص", englishName: "Al-Qasas", meaning: "داستان‌ها", versesCount: 88, type: "مکی", revelationOrder: 49, juz: "۲۰" },
  { id: 29, arabicName: "العنكبوت", persianName: "عنکبوت", englishName: "Al-Ankaboot", meaning: "عنکبوت", versesCount: 69, type: "مکی", revelationOrder: 85, juz: "۲۰-۲۱" },
  { id: 30, arabicName: "الروم", persianName: "روم", englishName: "Ar-Room", meaning: "روم", versesCount: 60, type: "مکی", revelationOrder: 84, juz: "۲۱" },
  { id: 31, arabicName: "لقمان", persianName: "لقمان", englishName: "Luqman", meaning: "لقمان", versesCount: 34, type: "مکی", revelationOrder: 57, juz: "۲۱" },
  { id: 32, arabicName: "السجدة", persianName: "سجده", englishName: "As-Sajda", meaning: "سجده", versesCount: 30, type: "مکی", revelationOrder: 75, juz: "۲۱" },
  { id: 33, arabicName: "الأحزاب", persianName: "احزاب", englishName: "Al-Ahzaab", meaning: "گروه‌ها", versesCount: 73, type: "مدنی", revelationOrder: 90, juz: "۲۱-۲۲" },
  { id: 34, arabicName: "سبأ", persianName: "سبأ", englishName: "Saba", meaning: "سبأ", versesCount: 54, type: "مکی", revelationOrder: 58, juz: "۲۲" },
  { id: 35, arabicName: "فاطر", persianName: "فاطر", englishName: "Faatir", meaning: "آفریننده", versesCount: 45, type: "مکی", revelationOrder: 43, juz: "۲۲" },
  { id: 36, arabicName: "يس", persianName: "یس", englishName: "Yaseen", meaning: "یس", versesCount: 83, type: "مکی", revelationOrder: 41, juz: "۲۲-۲۳" },
  { id: 37, arabicName: "الصافات", persianName: "صافات", englishName: "As-Saaffaat", meaning: "صف‌آرایان", versesCount: 182, type: "مکی", revelationOrder: 56, juz: "۲۳" },
  { id: 38, arabicName: "ص", persianName: "ص", englishName: "Saad", meaning: "ص", versesCount: 88, type: "مکی", revelationOrder: 38, juz: "۲۳" },
  { id: 39, arabicName: "الزمر", persianName: "زمر", englishName: "Az-Zumar", meaning: "گروه‌ها", versesCount: 75, type: "مکی", revelationOrder: 59, juz: "۲۳-۲۴" },
  { id: 40, arabicName: "غافر", persianName: "غافر", englishName: "Ghaafir", meaning: "آمرزنده", versesCount: 85, type: "مکی", revelationOrder: 60, juz: "۲۴" },
  { id: 41, arabicName: "فصلت", persianName: "فصلت", englishName: "Fussilat", meaning: "تفصیل‌شده", versesCount: 54, type: "مکی", revelationOrder: 61, juz: "۲۴-۲۵" },
  { id: 42, arabicName: "الشورى", persianName: "شوری", englishName: "Ash-Shura", meaning: "مشورت", versesCount: 53, type: "مکی", revelationOrder: 62, juz: "۲۵" },
  { id: 43, arabicName: "الزخرف", persianName: "زخرف", englishName: "Az-Zukhruf", meaning: "زینت‌ها", versesCount: 89, type: "مکی", revelationOrder: 63, juz: "۲۵" },
  { id: 44, arabicName: "الدخان", persianName: "دخان", englishName: "Ad-Dukhaan", meaning: "دود", versesCount: 59, type: "مکی", revelationOrder: 64, juz: "۲۵" },
  { id: 45, arabicName: "الجاثية", persianName: "جاثیه", englishName: "Al-Jaathiya", meaning: "زانوزدگان", versesCount: 37, type: "مکی", revelationOrder: 65, juz: "۲۵" },
  { id: 46, arabicName: "الأحقاف", persianName: "احقاف", englishName: "Al-Ahqaf", meaning: "تپه‌های شنی", versesCount: 35, type: "مکی", revelationOrder: 66, juz: "۲۶" },
  { id: 47, arabicName: "محمد", persianName: "محمد", englishName: "Muhammad", meaning: "محمد ﷺ", versesCount: 38, type: "مدنی", revelationOrder: 95, juz: "۲۶" },
  { id: 48, arabicName: "الفتح", persianName: "فتح", englishName: "Al-Fath", meaning: "پیروزی", versesCount: 29, type: "مدنی", revelationOrder: 111, juz: "۲۶" },
  { id: 49, arabicName: "الحجرات", persianName: "حجرات", englishName: "Al-Hujuraat", meaning: "اتاق‌ها", versesCount: 18, type: "مدنی", revelationOrder: 106, juz: "۲۶" },
  { id: 50, arabicName: "ق", persianName: "ق", englishName: "Qaaf", meaning: "ق", versesCount: 45, type: "مکی", revelationOrder: 34, juz: "۲۶" },
  { id: 51, arabicName: "الذاريات", persianName: "ذاریات", englishName: "Adh-Dhaariyaat", meaning: "پراکندگان", versesCount: 60, type: "مکی", revelationOrder: 67, juz: "۲۶-۲۷" },
  { id: 52, arabicName: "الطور", persianName: "طور", englishName: "At-Tur", meaning: "کوه طور", versesCount: 49, type: "مکی", revelationOrder: 76, juz: "۲۷" },
  { id: 53, arabicName: "النجم", persianName: "نجم", englishName: "An-Najm", meaning: "ستاره", versesCount: 62, type: "مکی", revelationOrder: 23, juz: "۲۷" },
  { id: 54, arabicName: "القمر", persianName: "قمر", englishName: "Al-Qamar", meaning: "ماه", versesCount: 55, type: "مکی", revelationOrder: 37, juz: "۲۷" },
  { id: 55, arabicName: "الرحمن", persianName: "رحمن", englishName: "Ar-Rahmaan", meaning: "رحمان", versesCount: 78, type: "مدنی", revelationOrder: 97, juz: "۲۷" },
  { id: 56, arabicName: "الواقعة", persianName: "واقعه", englishName: "Al-Waaqia", meaning: "واقعه", versesCount: 96, type: "مکی", revelationOrder: 46, juz: "۲۷" },
  { id: 57, arabicName: "الحديد", persianName: "حدید", englishName: "Al-Hadid", meaning: "آهن", versesCount: 29, type: "مدنی", revelationOrder: 94, juz: "۲۷" },
  { id: 58, arabicName: "المجادلة", persianName: "مجادله", englishName: "Al-Mujaadila", meaning: "بحث‌کننده", versesCount: 22, type: "مدنی", revelationOrder: 105, juz: "۲۸" },
  { id: 59, arabicName: "الحشر", persianName: "حشر", englishName: "Al-Hashr", meaning: "گردآوری", versesCount: 24, type: "مدنی", revelationOrder: 101, juz: "۲۸" },
  { id: 60, arabicName: "الممتحنة", persianName: "ممتحنه", englishName: "Al-Mumtahana", meaning: "آزمایش‌شده", versesCount: 13, type: "مدنی", revelationOrder: 91, juz: "۲۸" },
  { id: 61, arabicName: "الصف", persianName: "صف", englishName: "As-Saff", meaning: "صف", versesCount: 14, type: "مدنی", revelationOrder: 109, juz: "۲۸" },
  { id: 62, arabicName: "الجمعة", persianName: "جمعه", englishName: "Al-Jumu'a", meaning: "جمعه", versesCount: 11, type: "مدنی", revelationOrder: 110, juz: "۲۸" },
  { id: 63, arabicName: "المنافقون", persianName: "منافقون", englishName: "Al-Munaafiqoon", meaning: "منافقان", versesCount: 11, type: "مدنی", revelationOrder: 104, juz: "۲۸" },
  { id: 64, arabicName: "التغابن", persianName: "تغابن", englishName: "At-Taghaabun", meaning: "فریب‌خوردگی", versesCount: 18, type: "مدنی", revelationOrder: 108, juz: "۲۸" },
  { id: 65, arabicName: "الطلاق", persianName: "طلاق", englishName: "At-Talaaq", meaning: "طلاق", versesCount: 12, type: "مدنی", revelationOrder: 99, juz: "۲۸" },
  { id: 66, arabicName: "التحريم", persianName: "تحریم", englishName: "At-Tahrim", meaning: "حرام‌کردن", versesCount: 12, type: "مدنی", revelationOrder: 107, juz: "۲۸" },
  { id: 67, arabicName: "الملك", persianName: "ملک", englishName: "Al-Mulk", meaning: "پادشاهی", versesCount: 30, type: "مکی", revelationOrder: 77, juz: "۲۹" },
  { id: 68, arabicName: "القلم", persianName: "قلم", englishName: "Al-Qalam", meaning: "قلم", versesCount: 52, type: "مکی", revelationOrder: 2, juz: "۲۹" },
  { id: 69, arabicName: "الحاقة", persianName: "حاقه", englishName: "Al-Haaqqa", meaning: "حقیقت", versesCount: 52, type: "مکی", revelationOrder: 78, juz: "۲۹" },
  { id: 70, arabicName: "المعارج", persianName: "معارج", englishName: "Al-Ma'aarij", meaning: "درجات عروج", versesCount: 44, type: "مکی", revelationOrder: 79, juz: "۲۹" },
  { id: 71, arabicName: "نوح", persianName: "نوح", englishName: "Nooh", meaning: "نوح پیامبر", versesCount: 28, type: "مکی", revelationOrder: 71, juz: "۲۹" },
  { id: 72, arabicName: "الجن", persianName: "جن", englishName: "Al-Jinn", meaning: "جن", versesCount: 28, type: "مکی", revelationOrder: 40, juz: "۲۹" },
  { id: 73, arabicName: "المزمل", persianName: "مزمل", englishName: "Al-Muzzammil", meaning: "پیچیده در جامه", versesCount: 20, type: "مکی", revelationOrder: 3, juz: "۲۹" },
  { id: 74, arabicName: "المدثر", persianName: "مدثر", englishName: "Al-Muddaththir", meaning: "پوشیده در جامه", versesCount: 56, type: "مکی", revelationOrder: 4, juz: "۲۹" },
  { id: 75, arabicName: "القيامة", persianName: "قیامت", englishName: "Al-Qiyaama", meaning: "قیامت", versesCount: 40, type: "مکی", revelationOrder: 31, juz: "۲۹" },
  { id: 76, arabicName: "الانسان", persianName: "انسان", englishName: "Al-Insaan", meaning: "انسان", versesCount: 31, type: "مدنی", revelationOrder: 98, juz: "۲۹" },
  { id: 77, arabicName: "المرسلات", persianName: "مرسلات", englishName: "Al-Mursalaat", meaning: "فرستاده‌شدگان", versesCount: 50, type: "مکی", revelationOrder: 33, juz: "۲۹" },
  { id: 78, arabicName: "النبأ", persianName: "نبأ", englishName: "An-Naba", meaning: "خبر بزرگ", versesCount: 40, type: "مکی", revelationOrder: 80, juz: "۳۰" },
  { id: 79, arabicName: "النازعات", persianName: "نازعات", englishName: "An-Naazi'aat", meaning: "برآورندگان", versesCount: 46, type: "مکی", revelationOrder: 81, juz: "۳۰" },
  { id: 80, arabicName: "عبس", persianName: "عبس", englishName: "Abasa", meaning: "پیچاندن چهره", versesCount: 42, type: "مکی", revelationOrder: 24, juz: "۳۰" },
  { id: 81, arabicName: "التكوير", persianName: "تکویر", englishName: "At-Takwir", meaning: "پیچیده‌شدن", versesCount: 29, type: "مکی", revelationOrder: 7, juz: "۳۰" },
  { id: 82, arabicName: "الانفطار", persianName: "انفطار", englishName: "Al-Infitaar", meaning: "شکافته‌شدن", versesCount: 19, type: "مکی", revelationOrder: 82, juz: "۳۰" },
  { id: 83, arabicName: "المطففين", persianName: "مطففین", englishName: "Al-Mutaffifin", meaning: "کاهش‌دهندگان", versesCount: 36, type: "مکی", revelationOrder: 86, juz: "۳۰" },
  { id: 84, arabicName: "الانشقاق", persianName: "انشقاق", englishName: "Al-Inshiqaaq", meaning: "شکافته‌شدن", versesCount: 25, type: "مکی", revelationOrder: 83, juz: "۳۰" },
  { id: 85, arabicName: "البروج", persianName: "بروج", englishName: "Al-Burooj", meaning: "برج‌ها", versesCount: 22, type: "مکی", revelationOrder: 27, juz: "۳۰" },
  { id: 86, arabicName: "الطارق", persianName: "طارق", englishName: "At-Taariq", meaning: "شب‌آمد", versesCount: 17, type: "مکی", revelationOrder: 36, juz: "۳۰" },
  { id: 87, arabicName: "الأعلى", persianName: "اعلی", englishName: "Al-A'laa", meaning: "بالاترین", versesCount: 19, type: "مکی", revelationOrder: 8, juz: "۳۰" },
  { id: 88, arabicName: "الغاشية", persianName: "غاشیه", englishName: "Al-Ghaashiya", meaning: "پوشاننده", versesCount: 26, type: "مکی", revelationOrder: 68, juz: "۳۰" },
  { id: 89, arabicName: "الفجر", persianName: "فجر", englishName: "Al-Fajr", meaning: "سپیده‌دم", versesCount: 30, type: "مکی", revelationOrder: 10, juz: "۳۰" },
  { id: 90, arabicName: "البلد", persianName: "بلد", englishName: "Al-Balad", meaning: "شهر", versesCount: 20, type: "مکی", revelationOrder: 35, juz: "۳۰" },
  { id: 91, arabicName: "الشمس", persianName: "شمس", englishName: "Ash-Shams", meaning: "خورشید", versesCount: 15, type: "مکی", revelationOrder: 26, juz: "۳۰" },
  { id: 92, arabicName: "الليل", persianName: "لیل", englishName: "Al-Lail", meaning: "شب", versesCount: 21, type: "مکی", revelationOrder: 9, juz: "۳۰" },
  { id: 93, arabicName: "الضحى", persianName: "ضحی", englishName: "Ad-Dhuhaa", meaning: "پیش‌ازظهر", versesCount: 11, type: "مکی", revelationOrder: 11, juz: "۳۰" },
  { id: 94, arabicName: "الشرح", persianName: "شرح", englishName: "Ash-Sharh", meaning: "گشودن", versesCount: 8, type: "مکی", revelationOrder: 12, juz: "۳۰" },
  { id: 95, arabicName: "التين", persianName: "تین", englishName: "At-Tin", meaning: "انجیر", versesCount: 8, type: "مکی", revelationOrder: 28, juz: "۳۰" },
  { id: 96, arabicName: "العلق", persianName: "علق", englishName: "Al-Alaq", meaning: "خون بسته", versesCount: 19, type: "مکی", revelationOrder: 1, juz: "۳۰" },
  { id: 97, arabicName: "القدر", persianName: "قدر", englishName: "Al-Qadr", meaning: "قدر", versesCount: 5, type: "مکی", revelationOrder: 25, juz: "۳۰" },
  { id: 98, arabicName: "البينة", persianName: "بینه", englishName: "Al-Bayyina", meaning: "دلیل روشن", versesCount: 8, type: "مدنی", revelationOrder: 100, juz: "۳۰" },
  { id: 99, arabicName: "الزلزلة", persianName: "زلزله", englishName: "Az-Zalzala", meaning: "زلزله", versesCount: 8, type: "مدنی", revelationOrder: 93, juz: "۳۰" },
  { id: 100, arabicName: "العاديات", persianName: "عادیات", englishName: "Al-Aadiyaat", meaning: "تندروندگان", versesCount: 11, type: "مکی", revelationOrder: 14, juz: "۳۰" },
  { id: 101, arabicName: "القارعة", persianName: "قارعه", englishName: "Al-Qaari'a", meaning: "کوبنده", versesCount: 11, type: "مکی", revelationOrder: 30, juz: "۳۰" },
  { id: 102, arabicName: "التكاثر", persianName: "تکاثر", englishName: "At-Takaathur", meaning: "افزون‌طلبی", versesCount: 8, type: "مکی", revelationOrder: 16, juz: "۳۰" },
  { id: 103, arabicName: "العصر", persianName: "عصر", englishName: "Al-Asr", meaning: "عصر", versesCount: 3, type: "مکی", revelationOrder: 13, juz: "۳۰" },
  { id: 104, arabicName: "الهمزة", persianName: "همزه", englishName: "Al-Humaza", meaning: "طعنه‌زننده", versesCount: 9, type: "مکی", revelationOrder: 32, juz: "۳۰" },
  { id: 105, arabicName: "الفيل", persianName: "فیل", englishName: "Al-Fil", meaning: "فیل", versesCount: 5, type: "مکی", revelationOrder: 19, juz: "۳۰" },
  { id: 106, arabicName: "قريش", persianName: "قریش", englishName: "Quraish", meaning: "قبیله قریش", versesCount: 4, type: "مکی", revelationOrder: 29, juz: "۳۰" },
  { id: 107, arabicName: "الماعون", persianName: "ماعون", englishName: "Al-Maa'un", meaning: "وسیله کمک", versesCount: 7, type: "مکی", revelationOrder: 17, juz: "۳۰" },
  { id: 108, arabicName: "الكوثر", persianName: "کوثر", englishName: "Al-Kawthar", meaning: "فراوانی", versesCount: 3, type: "مکی", revelationOrder: 15, juz: "۳۰" },
  { id: 109, arabicName: "الكافرون", persianName: "کافرون", englishName: "Al-Kaafiroon", meaning: "کافران", versesCount: 6, type: "مکی", revelationOrder: 18, juz: "۳۰" },
  { id: 110, arabicName: "النصر", persianName: "نصر", englishName: "An-Nasr", meaning: "یاری", versesCount: 3, type: "مدنی", revelationOrder: 114, juz: "۳۰" },
  { id: 111, arabicName: "المسد", persianName: "مسد", englishName: "Al-Masad", meaning: "طناب‌های پیچیده", versesCount: 5, type: "مکی", revelationOrder: 6, juz: "۳۰" },
  { id: 112, arabicName: "الإخلاص", persianName: "اخلاص", englishName: "Al-Ikhlaas", meaning: "خالص‌کردن", versesCount: 4, type: "مکی", revelationOrder: 22, juz: "۳۰" },
  { id: 113, arabicName: "الفلق", persianName: "فلق", englishName: "Al-Falaq", meaning: "سپیده‌دم", versesCount: 5, type: "مکی", revelationOrder: 20, juz: "۳۰" },
  { id: 114, arabicName: "الناس", persianName: "ناس", englishName: "An-Naas", meaning: "مردم", versesCount: 6, type: "مکی", revelationOrder: 21, juz: "۳۰" },
];

export interface Verse {
  number: number;
  arabic: string;
  persian: string;
}

// نمونه آیات کامل برای سوره‌های کلیدی
export const sampleVerses: Record<number, Verse[]> = {
  1: [
    { number: 1, arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", persian: "به نام خداوند رحمتگر مهربان" },
    { number: 2, arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", persian: "ستایش مخصوص خداوند پروردگار جهانیان است" },
    { number: 3, arabic: "الرَّحْمَٰنِ الرَّحِيمِ", persian: "همان رحمتگر مهربان" },
    { number: 4, arabic: "مَالِكِ يَوْمِ الدِّينِ", persian: "صاحب روز جزا" },
    { number: 5, arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", persian: "تنها تو را می‌پرستیم و تنها از تو یاری می‌جوییم" },
    { number: 6, arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", persian: "ما را به راه راست هدایت کن" },
    { number: 7, arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", persian: "راه کسانی که به آنان نعمت داده‌ای، نه مغضوب‌بر آنان و نه گمراهان" },
  ],
  112: [
    { number: 1, arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", persian: "بگو: او خدای یکتاست" },
    { number: 2, arabic: "اللَّهُ الصَّمَدُ", persian: "خدای بی‌نیاز (که همه به او نیاز دارند)" },
    { number: 3, arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ", persian: "نه زاییده شده و نه زاییده می‌شود" },
    { number: 4, arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", persian: "و هیچ‌کس همتای او نیست" },
  ],
  113: [
    { number: 1, arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", persian: "بگو: به پروردگار سپیده‌دم پناه می‌برم" },
    { number: 2, arabic: "مِن شَرِّ مَا خَلَقَ", persian: "از شر آنچه آفرید" },
    { number: 3, arabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", persian: "و از شر تاریکی چون فرا رسد" },
    { number: 4, arabic: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", persian: "و از شر زنان جادوگر در گره‌ها" },
    { number: 5, arabic: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", persian: "و از شر حسود چون حسد ورزد" },
  ],
  114: [
    { number: 1, arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", persian: "بگو: به پروردگار مردم پناه می‌برم" },
    { number: 2, arabic: "مَلِكِ النَّاسِ", persian: "پادشاه مردم" },
    { number: 3, arabic: "إِلَٰهِ النَّاسِ", persian: "معبود مردم" },
    { number: 4, arabic: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", persian: "از شر وسوسه‌کننده پنهان‌شونده" },
    { number: 5, arabic: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", persian: "که در سینه‌های مردم وسوسه می‌کند" },
    { number: 6, arabic: "مِنَ الْجِنَّةِ وَالنَّاسِ", persian: "از جن و انس" },
  ],
  108: [
    { number: 1, arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", persian: "ما به تو کوثر (خیر فراوان) دادیم" },
    { number: 2, arabic: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", persian: "پس برای پروردگارت نماز بخوان و قربانی کن" },
    { number: 3, arabic: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", persian: "همانا دشمن توست که بی‌فرزند است" },
  ],
  103: [
    { number: 1, arabic: "وَالْعَصْرِ", persian: "سوگند به عصر (زمان)" },
    { number: 2, arabic: "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ", persian: "که انسان قطعا در زیان است" },
    { number: 3, arabic: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ", persian: "مگر کسانی که ایمان آوردند و کار شایسته کردند و یکدیگر را به حق و صبر توصیه نمودند" },
  ],
  67: [
    { number: 1, arabic: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", persian: "پربرکت است آن کسی که فرمانروایی به دست اوست و او بر هر چیز تواناست" },
    { number: 2, arabic: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا وَهُوَ الْعَزِيزُ الْغَفُورُ", persian: "همان کسی که مرگ و زندگی را آفرید تا شما را بیازماید که کدام یک نیکوکارترید و او توانای آمرزنده است" },
    { number: 3, arabic: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ", persian: "همان کسی که هفت آسمان را طبقه طبقه آفرید، هیچ نقصانی در آفرینش رحمان نمی‌بینی" },
  ],
  36: [
    { number: 1, arabic: "يس ۚ وَالْقُرْآنِ الْحَكِيمِ", persian: "یس. سوگند به قرآن حکیم" },
    { number: 2, arabic: "إِنَّكَ لَمِنَ الْمُرْسَلِينَ", persian: "تو قطعا از فرستادگانی" },
    { number: 3, arabic: "عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ", persian: "بر راه راست" },
    { number: 4, arabic: "تَنزِيلَ الْعَزِيزِ الرَّحِيمِ", persian: "نازل شده از سوی توانای مهربان" },
    { number: 5, arabic: "لِتُنذِرَ قَوْمًا مَّا أُنذِرَ آبَاؤُهُمْ فَهُمْ غَافِلُونَ", persian: "تا قومی را که پدرانشان انذار نشده‌اند بترسانی و آنان غافلند" },
  ],
  55: [
    { number: 1, arabic: "الرَّحْمَٰنُ", persian: "خداوند رحمان" },
    { number: 2, arabic: "عَلَّمَ الْقُرْآنَ", persian: "قرآن را آموخت" },
    { number: 3, arabic: "خَلَقَ الْإِنسَانَ", persian: "انسان را آفرید" },
    { number: 4, arabic: "عَلَّمَهُ الْبَيَانَ", persian: "او را بیان آموخت" },
    { number: 5, arabic: "الشَّمْسُ وَالْقَمَرُ بِحُسْبَانٍ", persian: "خورشید و ماه به حساب (معین)" },
    { number: 13, arabic: "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ", persian: "پس کدامین نعمت‌های پروردگارتان را دروغ می‌شمارید" },
  ],
  97: [
    { number: 1, arabic: "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ", persian: "ما آن را در شب قدر نازل کردیم" },
    { number: 2, arabic: "وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ", persian: "و چه می‌دانی شب قدر چیست" },
    { number: 3, arabic: "لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ", persian: "شب قدر بهتر از هزار ماه است" },
    { number: 4, arabic: "تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ", persian: "فرشتگان و روح در آن به اذن پروردگارشان برای هر کاری فرود می‌آیند" },
    { number: 5, arabic: "سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ", persian: "سلام است تا طلوع سپیده‌دم" },
  ],
  109: [
    { number: 1, arabic: "قُلْ يَا أَيُّهَا الْكَافِرُونَ", persian: "بگو: ای کافران" },
    { number: 2, arabic: "لَا أَعْبُدُ مَا تَعْبُدُونَ", persian: "من آنچه را شما می‌پرستید نمی‌پرستم" },
    { number: 3, arabic: "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ", persian: "و شما نیز پرستنده آنچه من می‌پرستم نیستید" },
    { number: 4, arabic: "وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ", persian: "و من پرستنده آنچه شما پرستیده‌اید نیستم" },
    { number: 5, arabic: "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ", persian: "و شما پرستنده آنچه من می‌پرستم نیستید" },
    { number: 6, arabic: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ", persian: "برای شما دین شما و برای من دین من" },
  ],
};

export interface DailyVerse {
  day: number;
  surahId: number;
  verseNumber: number;
  arabic: string;
  persian: string;
}

export const dailyVerses: DailyVerse[] = [
  { day: 1, surahId: 1, verseNumber: 1, arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", persian: "به نام خداوند رحمتگر مهربان" },
  { day: 2, surahId: 2, verseNumber: 152, arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ", persian: "پس مرا یاد کنید تا شما را یاد کنم و شکر نعمت من کنید و کفران نکنید" },
  { day: 3, surahId: 13, verseNumber: 28, arabic: "الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", persian: "همان کسانی که ایمان آوردند و دل‌هایشان به یاد خدا آرام می‌گیرد آگاه باشد که با یاد خدا دل‌ها آرامش می‌یابد" },
  { day: 4, surahId: 94, verseNumber: 5, arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", persian: "پس همگان با سختی آسانی است" },
  { day: 5, surahId: 94, verseNumber: 6, arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", persian: "همانا با سختی آسانی است" },
  { day: 6, surahId: 65, verseNumber: 3, arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", persian: "و هر کس بر خدا توکل کند او کفایتش را می‌کند" },
  { day: 7, surahId: 39, verseNumber: 53, arabic: "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ", persian: "از رحمت خدا ناامید نشوید" },
  { day: 8, surahId: 40, verseNumber: 60, arabic: "ادْعُونِي أَسْتَجِبْ لَكُمْ", persian: "مرا بخوانید تا اجابت کنم شما را" },
  { day: 9, surahId: 2, verseNumber: 286, arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", persian: "خداوند هیچ‌کس را جز به اندازه توانایی‌اش تکلیف نمی‌کند" },
  { day: 10, surahId: 17, verseNumber: 80, arabic: "وَقُل رَّبِّ أَدْخِلْنِي مُدْخَلَ صِدْقٍ وَأَخْرِجْنِي مُخْرَجَ صِدْقٍ", persian: "و بگو پروردگارا مرا با صدق درآور و با صدق بیرون آور" },
];
