#!/usr/bin/env python3
"""Rasterize each PDF page to PNG for visual QA."""
import sys
from pathlib import Path
import fitz  # pymupdf

pdf = Path(sys.argv[1])
outdir = Path(sys.argv[2]); outdir.mkdir(parents=True, exist_ok=True)
doc = fitz.open(pdf)
for i, pg in enumerate(doc, 1):
    pix = pg.get_pixmap(dpi=96)
    pix.save(outdir / f"page-{i:02d}.png")
print(f"rendered {len(doc)} pages -> {outdir}")
