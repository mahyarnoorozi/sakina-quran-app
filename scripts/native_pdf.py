#!/usr/bin/env python3
"""HTML -> PDF via Playwright Chromium native print engine (RTL-safe).

Usage: python3 native_pdf.py <input.html> <output.pdf>
"""
import sys, os, json
from pathlib import Path

def main():
    src = Path(sys.argv[1]).resolve()
    out = Path(sys.argv[2]).resolve()
    assert src.exists(), f"missing {src}"

    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--force-color-profile=srgb"])
        page = browser.new_page(viewport={"width": 720, "height": 1020})
        page.goto(src.as_uri(), wait_until="networkidle")
        # Wait for all fonts (Vazirmatn/Amiri woff2) to be fully loaded
        page.evaluate("document.fonts.ready.then(()=>true)")
        page.wait_for_timeout(1200)
        # Native Chromium print — honors @page size + break rules, RTL safe
        page.pdf(path=str(out), print_background=True, prefer_css_page_size=True)
        browser.close()

    # Report stats
    try:
        from pypdf import PdfReader
        r = PdfReader(str(out))
        n = len(r.pages)
        box = r.pages[0].mediabox
        print(json.dumps({"pages": n, "width_pt": float(box.width), "height_pt": float(box.height),
                          "bytes": out.stat().st_size, "out": str(out)}, ensure_ascii=False))
    except Exception as e:
        print(f"pdf written: {out} ({out.stat().st_size} bytes); stats failed: {e}")

if __name__ == "__main__":
    main()
