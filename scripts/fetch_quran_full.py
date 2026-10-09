#!/usr/bin/env python3
"""Fetch full Quran (Uthmani Arabic + Makarem Persian) and build compact JSON.
Output: public/data/quran-full.json  → { "1": [[ar, fa], ...], ... }
"""
import json, urllib.request, sys
from pathlib import Path

OUT = Path("/home/z/my-project/public/data/quran-full.json")

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "sakina-app/1.0"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.loads(r.read().decode("utf-8"))

def main():
    ar = fetch("https://api.alquran.cloud/v1/quran/quran-uthmani")["data"]["surahs"]
    fa = fetch("https://api.alquran.cloud/v1/quran/fa.makarem")["data"]["surahs"]
    assert len(ar) == 114 and len(fa) == 114, f"surah count mismatch {len(ar)}/{len(fa)}"

    out = {}
    total = 0
    for a, f in zip(ar, fa):
        assert a["number"] == f["number"]
        verses = []
        for va, vf in zip(a["ayahs"], f["ayahs"]):
            assert va["numberInSurah"] == vf["numberInSurah"]
            verses.append([va["text"], vf["text"]])
        out[str(a["number"])] = verses
        total += len(verses)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"OK surahs={len(out)} verses={total} size={OUT.stat().st_size/1024:.0f}KB")

if __name__ == "__main__":
    sys.exit(main())
