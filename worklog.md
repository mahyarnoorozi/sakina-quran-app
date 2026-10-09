
---
Task ID: 8
Agent: main
Task: بازطراحی جامع طبق MASTER PROMPT (v9) — Audit + Design System + جلسه‌ساز خانه + QA

Work Log:
- بحرانی: workspace به v1 ریست شده بود (src، public/data، worklog همه پاک) → بازیابی کامل از snapshot /tmp/my-project (Oct 8 21:55) + bun install + ری‌استارت دیمون؛ بلافاصله commit شد (5061ed3) و .next به gitignore اضافه شد تا تکرار نشود
- Audit: تمام صفحات/استورها/موتور خوانده شد؛ lint پایه ۰ خطا؛ ۱۰ کامپوننت مرده v1 (HomePage/PlayerPage/MixerPage/...) از src حذف شد (در backup و تاریخ git موجود)
- Design System v9 در globals.css: .ds-card / .ds-chip (+data-active) / .ds-chip--glass (روی عکس) / .ds-section-title / .ds-icon-btn / .tap / حلقه focus-visible برای کیبورد / احترام به prefers-reduced-motion؛ قاعده: برنز فقط CTA اصلی و حالت فعال، زمردی رنگ تعامل پیش‌فرض
- خانه v9 «جلسه‌ساز» بازنویسی شد (HomeTab.tsx کامل): مسیر کاربر = انتخاب تلاوت (چیپ سوره‌های محبوب + شیت ۱۱۴ سوره‌ای) → لایه آرامش (۴ صدای Quranify + بدون) → CTA طلایی؛ هر ضربه همان لحظه اعمال می‌شود (استور = منبع حقیقت، بدون state محلی)
  • سلام و تیتر هیرو ساعت‌محور (صبح/بعدازظهر/شب)
  • بج «زنده» هنگام پخش؛ ولوم لایه فعال درجا زیر چیپ‌ها (HSlider)
  • CTA داینامیک: «پخش یس با باران» / «در حال پخش» — توقف، هر دو لایه را با هم متوقف می‌کند
  • کپشن قاری + «تغییر قاری» (ReciterSheet) داخل هیرو
  • حذف بج «۱۹۲k Hi-Fi» و طلای تزئینی هدر؛ «ادامه گوش دادن» کم‌ارتفاع با اکسنت زمردی؛ حالت خواب + آیه امروز دو کارت نیم‌عرض؛ کولکشن/قاری‌ها حفظ شدند
- SurahPickerSheet.tsx جدید: بات‌شیت با جستجوی فوری (عربی/فارسی/معنی/انگلیسی/شماره) + فیلتر مکی/مدنی + ضربه=پخش فوری
- QuranTab: «ادامه خوانش» حالا واکنش‌گرا (قبلاً getState در render بود)؛ فیلترها → ds-chip یکدست
- MixerTab: ویژوالایزر تقلبی حذف → نشانگر واقعی لایه‌ها (LayerDot تلاوت/طبیعت از استور)
- layout.tsx: themeColor دوتایی (تیره/روشن) — تیره پیش‌فرض اپ است
- QA واقعی (agent-browser، ۳۹۰×۸۴۴):
  • ضربه یس → تلاوت پخش و آیه‌به‌آیه جلو می‌رود (036001→036006، preload 036003) ✓
  • ضربه باران → لوپ rain-light با ولوم ۰٫۵۵ همزمان روی تلاوت (دو لایه واقعی) ✓
  • CTA توقف → هر دو لایه paused ✓؛ انتخاب کوثر از شیت → surahId=108 و پخش 108001 ✓
  • هر ۵ تب رندر سالم؛ console error = 0 ✓
  • overflowX=0 در ۳۶۰ و لنداسکیپ ۸۴۴×۳۹۰ ✓
- lint نهایی: ۰ خطا ۰ هشدار

Stage Summary:
- فرآیند سه‌مرحله‌ای MASTER PROMPT (Audit→DS→Implementation) انجام و QA شد؛ اسکرین‌شات‌ها: screenshots/v9-*.png (۱۰ تصویر)
- باقی‌مانده صادقانه: بازطراحی عمیق Library/Profile/Onboarding/Premium/Reciter/Sleep فقط هم‌ترازسازی توکن بود؛ در لنداسکیپ کوتاه مینی‌پلیر+تب‌بار فضای عمودی زیادی می‌گیرند؛ اپ وابسته به CDN everyayah است (آفلاین فقط با دانلود)
- همه تغییرات commit شده (v9-*) — از این پس هر مرحله باید commit شود تا ریست workspace خسارت نزند

---
Task ID: 10
Agent: main (Super Z)
Task: بازطراحی جامع v10 بر اساس Mission نهایی کاربر (research→audit→roadmap→DS→implement→QA)

Work Log:
- Audit واقعی: ۱۲+ اسکرین‌شات agent-browser + بازخوانی PlayerFull/PlayerMini/TabBar/HomeTab/MixerTab/globals.css/page.tsx/settings
- باگ‌های P0 شناسایی و رفع: (۱) ReciterSheet زیر PlayerFull نامرئی بود → z-[95]؛ (۲) بریدگی چیپ فعال در لبه کارت هیرو → POPULAR=[1,36,...] + fade-x + scrollIntoView؛ (۳) دو نوار انباشته پایین → دوک یکپارچه h-56 با mini-progress
- DS v10 در globals.css: توکن‌های --veil/--veil-strong/--veil-border/--live/--stage-*/--star-pattern-url، session-surface، fade-x، seek-track/fill/thumb، ds-list-row، stage-ink
- پاک‌سازی hard-code رنگ‌ها در ۸ کامپوننت (ProfileTab/SleepSheet/PremiumSheet/LibraryTab/Onboarding/Mixer/HSlider/Home) → توکن برند
- PlayerMini بازنویسی: play+عنوان+آیه بعد + خط پیشرفت 1Hz + حذف دکمه میکسر زائد
- PlayerFull: پس‌زمینه گرادیان توکنی (عکس قاری فقط ۱۸٪ هاله)، سیک‌بار توکنی، ردیف پایین fade-x
- MixerTab: LayerDot با sr-only + برچسب، حذف ردیف وضعیت مبهم، پریست fade-x، کارت پخش ds-card
- HomeTab: هیرو session-surface بدون عکس، میانبرها کارت آیکونی، alt="" قاری‌ها
- reciter switch وسط پخش تست شد (ayah=52 حفظ شد)؛ dual-layer واقعی (rain-light vol55) تأیید شد
- Radix DialogContent warnings با aria-describedby={undefined} رفع شد
- lint ۰/۰ + build موفق + overflow 0 در ۳۶۰ و لنداسکیپ + console error ۰
- REDESIGN_ROADMAP.md نوشته شد (۱۳ بخش، شامل نتیجه اجرا)
- GitHub: ریپو پاک شد (filter-branch، ۱۵۴MB→۵۰MB)، force-push + push v10

Stage Summary:
- v10 commit 24bc6ba روی github.com/mahyarnoorozi/sakina-quran-app
- اسکرین‌شات‌ها: screenshots/v10-01..13 (دارک/لایت/پلیر/شیت/۳۶۰/لنداسکیپ)
- باقی‌مانده: MediaSession قفل صفحه، دانلود کامل آفلاین، روی‌داد آفلاین CDN — مستند در roadmap §13
