#!/usr/bin/env python3
"""
Erzeugt die ausgelieferten PNGs in dist/ aus dem Original-Artwork.

Das Original-Artwork (grosse, verlustfreie PNGs) liegt bewusst NICHT im Repo —
HACS laedt den Plugin-Ordner in jede Home-Assistant-Installation, deshalb
enthaelt dist/ nur die optimierten Dateien.

Aufruf:
    python3 tools/prepare-assets.py <quellordner> [zielordner]

Was passiert:
  * Becken   — auf max. 1280 px Breite skaliert, auf eine Palette reduziert
               (Skizzen-Artwork, daher ohne sichtbaren Verlust) -> ca. 1/9 der Groesse
  * Geraete  — dieselbe Optimierung, ausschliesslich transparent. Helle und
               dunkle Varianten gibt es seit Iteration 2 nicht mehr: der
               Hintergrund kommt aus der Card-Option `frame.fill`.
  * Poolpumpe — transparente Raender werden vorher weggeschnitten
  * UV-Lampe  — zwei Bildvarianten (Anschluss seitlich / oben); NICHT
               beschneiden, sonst laegen die beiden nicht mehr deckungsgleich

Nach einem neuen Geraetebild gehoert das Seitenverhaeltnis in DEVICE_RATIOS
(src/shared/assets.js); nach einem neuen Beckenbild einmal
`node tools/becken-zonen.mjs --anker` laufen lassen und die Anker in SHAPES
uebernehmen.

Benoetigt Pillow (pip install pillow).
"""
import os
import sys
from PIL import Image

MAX_WIDTH = 1280
COLORS = 192

BECKEN = {
    "Poolbecken_Oval.png": "poolbecken_oval.png",
    "Poolbecken_Rechteck.png": "poolbecken_rechteck.png",
    "Poolbecken_Achtform.png": "poolbecken_achtform.png",
    "Poolbecken_Rund.png": "poolbecken_rund.png",
    "Poolbecken_Nierenform.png": "poolbecken_nierenform.png",
    "Poolbecken_Freiform.png": "poolbecken_freiform.png",
}

# Quelle -> Zieldatei, trim = transparente Raender abschneiden
GERAETE = [
    ("Waermepumpe.png", "waermepumpe_transparent.png", False),
    ("poolpumpe_platzhalter_vigipoolstil.png", "poolpumpe_transparent.png", True),
    ("UV_C_Lampe.png", "uv_lampe_transparent.png", False),
    ("UV_C_Lampe_2.png", "uv_lampe_transparent_2.png", False),
]


def load(path, trim=False):
    im = Image.open(path).convert("RGBA")
    if trim:
        box = im.getbbox()
        if box:
            im = im.crop(box)
    if im.width > MAX_WIDTH:
        im = im.resize((MAX_WIDTH, round(im.height * MAX_WIDTH / im.width)), Image.LANCZOS)
    return im


def save(im, path):
    im.quantize(colors=COLORS, method=Image.FASTOCTREE).save(path, optimize=True)
    return os.path.getsize(path)


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 1
    src = sys.argv[1]
    dst = sys.argv[2] if len(sys.argv) > 2 else "dist"
    os.makedirs(dst, exist_ok=True)
    total = 0

    for quelle, ziel in BECKEN.items():
        im = load(os.path.join(src, quelle))
        size = save(im, os.path.join(dst, ziel))
        total += size
        print(f"{ziel:34s} {im.size[0]:5d}x{im.size[1]:<5d} {size/1024:8.1f} kB")

    for quelle, ziel, trim in GERAETE:
        im = load(os.path.join(src, quelle), trim=trim)
        size = save(im, os.path.join(dst, ziel))
        total += size
        print(f"{ziel:34s} {im.size[0]:5d}x{im.size[1]:<5d} {size/1024:8.1f} kB")

    print(f"\nSumme: {total/1024/1024:.2f} MB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
