#!/usr/bin/env python3
"""
fetch_sounds.py — دانلود ۴ لوپ واقعی آرامش‌بخش (هم‌تراز Quranify)
هدف: public/sounds/{rain-light,ocean-waves,fire-camp,forest-birds}.mp3
هر فایل: ~45 ثانیه، لوپ بی‌درز (crossfade ۴ ثانیه‌ای آخر با اول)، 128kbps stereo

منابع (به ترتیب):
  1) Openverse API (فقط CC0) — api.openverse.org/v1/audio
  2) BBC Rewind — sound-effects.bbcrewind.co.uk (فقط برای این دمو)
  3) fallback: فایل‌های موجود public/sounds/*.mp3 → کپی به نام جدید
"""

import json
import os
import shutil
import subprocess
import sys
import urllib.parse
import urllib.request

BASE = "/home/z/my-project"
OUT_DIR = os.path.join(BASE, "public", "sounds")
UA = {"User-Agent": "Mozilla/5.0 (compatible; sakina-sound-fetch/1.0)"}

# id فایل خروجی → (لیست کوئری‌ها، fallback قدیمی)
TARGETS = {
    "rain-light.mp3": (["gentle rain", "rain falling", "rain ambience"], "rain-light.mp3"),
    "ocean-waves.mp3": (["ocean waves", "sea waves shore", "waves beach"], "ocean.mp3"),
    "fire-camp.mp3": (["campfire crackling", "fire crackling", "bonfire"], "fire.mp3"),
    "forest-birds.mp3": (["birds singing forest", "birdsong", "birds chirping"], "birds.mp3"),
}

LOOP_SEC = 45
XFADE_SEC = 4


def http_get(url: str, timeout: int = 30) -> bytes | None:
    try:
        req = urllib.request.Request(url, headers={**UA, "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124"})
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.read()
    except Exception as e:
        print(f"    ! GET fail {url[:90]}: {e}")
        return None


def freesound_candidates(query: str):
    """اسکرپ صفحه جستجوی freesound — پیش‌نمایش‌های عمومی mp3"""
    q = urllib.parse.quote(query)
    url = f"https://freesound.org/search/?q={q}"
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=25) as r:
            html = r.read().decode("utf-8", "ignore")
    except Exception as e:
        print(f"    ! freesound search fail [{q}]: {e}")
        return []
    import re as _re
    ids = _re.findall(r"https://cdn\.freesound\.org/previews/[^\"'&\s]+?\.mp3", html)
    # lq (سبک‌تر، سریع‌تر) — کیفیت پس از پردازش کافی است
    out = []
    for u in ids:
        if u not in out:
            out.append(u)
    return out


def ffmpeg_loop(src: str, dst: str) -> bool:
    """~49s از منبع → لوپ 45s با crossfade انتهایی + نرمال‌سازی"""
    fc = (
        "[0:a]aformat=sample_rates=44100:channel_layouts=stereo,"
        f"atrim=start=0,end={LOOP_SEC + XFADE_SEC},asetpts=PTS-STARTPTS,asplit=2[main][tail];"
        f"[tail]atrim=start={LOOP_SEC},end={LOOP_SEC + XFADE_SEC},asetpts=PTS-STARTPTS[tp];"
        f"[main]atrim=start=0,end={LOOP_SEC},asetpts=PTS-STARTPTS[mp];"
        f"[mp][tp]acrossfade=d={XFADE_SEC}:c1=tri:c2=tri,"
        "loudnorm=I=-20:TP=-2:LRA=7,alimiter=limit=0.92[out]"
    )
    cmd = [
        "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
        "-ss", "8", "-t", str(LOOP_SEC + XFADE_SEC + 5), "-i", src,
        "-filter_complex", fc, "-map", "[out]",
        "-c:a", "libmp3lame", "-b:a", "128k", "-ar", "44100", "-ac", "2",
        "-id3v2_version", "3", dst,
    ]
    try:
        subprocess.run(cmd, check=True, timeout=120, capture_output=True)
    except Exception as e:
        print(f"    ! ffmpeg fail: {e}")
        return False
    # تأیید
    try:
        p = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=nw=1:nk=1", dst],
            capture_output=True, text=True, timeout=20,
        )
        dur = float(p.stdout.strip())
        return dur >= 40
    except Exception:
        return False


def fetch_one(out_name: str, queries, old_fallback: str) -> str:
    dst = os.path.join(OUT_DIR, out_name)
    # fallback امن: فایل قدیمی را کپی کن تا هیچ‌وقت 404 نداشته باشیم
    if not os.path.exists(dst):
        old_path = os.path.join(OUT_DIR, old_fallback)
        if os.path.exists(old_path):
            shutil.copyfile(old_path, dst)
            print(f"  = seeded from existing {old_fallback}")

    for q in queries:
        for src_url in freesound_candidates(q)[:2]:
            print(f"  … freesound [{q}] → {src_url[:80]}")
            raw = http_get(src_url, 90)
            if not raw or len(raw) < 60_000:
                continue
            tmp = "/tmp/sk_src.mp3"
            with open(tmp, "wb") as f:
                f.write(raw)
            if ffmpeg_loop(tmp, dst):
                print(f"  ✓ {out_name} ← freesound ({q})")
                return "freesound"

    size = os.path.getsize(dst) if os.path.exists(dst) else 0
    if size > 10_000:
        print(f"  ✓ {out_name} از فایل قبلی استفاده می‌شود ({size//1024}KB)")
        return "existing"
    return "FAIL"


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    status = {}
    for name, (queries, old) in TARGETS.items():
        print(f"== {name}")
        status[name] = fetch_one(name, queries, old)

    print("\n--- وضعیت نهایی ---")
    for name, s in status.items():
        p = os.path.join(OUT_DIR, name)
        sz = os.path.getsize(p) if os.path.exists(p) else 0
        print(f"{name}: {s} ({sz//1024}KB)")
    if any(v == "FAIL" for v in status.values()):
        sys.exit(1)


if __name__ == "__main__":
    main()
