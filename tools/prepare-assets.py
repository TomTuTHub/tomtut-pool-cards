#!/usr/bin/env python3
"""
Erzeugt die ausgelieferten PNGs in dist/ aus dem Original-Artwork.

Das Original-Artwork liegt bewusst NICHT im Repo — HACS laedt den
Plugin-Ordner in jede Home-Assistant-Installation, deshalb enthaelt dist/
nur die optimierten Dateien. Quelle sind seit Iteration 7 ausschliesslich
Selinas handgezeichnete Originale (© TomTuT); KI-generierte Geraetebilder
gibt es nicht mehr.

Aufruf:
    python3 tools/prepare-assets.py <quellordner> [weiterer quellordner ...] [--ziel dist]

Mehrere Quellordner werden der Reihe nach durchsucht, der erste Treffer
gewinnt. Typischer Aufruf auf der Werkbank:

    python3 tools/prepare-assets.py \\
        /mnt/nas/proxmox-container/studio/vorgaenge/ka-973/assets/selina \\
        /mnt/nas/proxmox-container/studio/vorgaenge/ka-973/assets/generiert

(Die Becken ausser dem Oval liegen noch im zweiten Ordner; alle Geraete,
Sprites, Marker UND das Solar-Panel kommen aus dem ersten. Der Ordner
assets/thomas-fotos wird seit Iteration 13 nicht mehr gebraucht: das
Solarfeld ist wieder Selinas Zeichnung OKU_Panel.png statt Thomas' Foto
OKU.png — die Card ist durchgehend im Zeichenstil, ein Foto faellt heraus.)

Was passiert:
  * Becken   — auf max. 1280 px Breite skaliert, auf eine Palette reduziert
               (Skizzen-Artwork, daher ohne sichtbaren Verlust)
  * Geraete  — dasselbe auf max. 1200 px, ausschliesslich transparent. Helle
               und dunkle Varianten gibt es seit Iteration 2 nicht mehr: der
               Hintergrund kommt aus der Card-Option `frame.fill`.
  * Solar    — KEIN eigenes Bild, sondern eine Komposition aus drei
               gezeichneten OKU-Panels (s.u.)
  * Sprites  — Skimmer, Bodenablauf und Einlaufduese liegen nur klein auf dem
               Becken (HERO_SPRITES in src/shared/assets.js) -> 640 px reichen
  * Marker   — die beiden Richtungspfeile des Solar-Slots, klein (200 px) und
               um 90 Grad im Uhrzeigersinn gedreht, damit sie im Bild nach
               RECHTS zeigen (seit Iteration 14: links unten hinein, rechts
               oben hinaus)
  * Trim     — transparente Raender werden weggeschnitten, damit die
               Prozent-Positionen der Overlays am Motiv haengen und nicht am
               Rand der Leinwand
  * UV-Lampe — zwei Bildvarianten (Anschlussvariante 1 / 2); NICHT
               beschneiden, sonst laegen die beiden nicht mehr deckungsgleich

Nach einem neuen Geraetebild gehoert das Seitenverhaeltnis in DEVICE_RATIOS
(src/shared/assets.js) und die Overlay-Defaults des Slots wollen am neuen
Motiv nachgemessen werden; nach einem neuen Beckenbild einmal
`node tools/becken-zonen.mjs --anker` laufen lassen, die Anker in SHAPES
uebernehmen und `node tools/becken-zonen.mjs` die Test-Fixture neu schreiben
lassen.

Benoetigt Pillow (Debian: apt install python3-pil) und zopflipng
(Debian: apt install zopfli) fuer die verlustfreie Nachkompression.
"""
import hashlib
import json
import os
import shutil
import subprocess
import sys
from PIL import Image

MAX_WIDTH = 1280
MAX_DEVICE_WIDTH = 1200
# Reine Becken-Sprites werden nie gross angezeigt (rund 10 % der Beckenbreite),
# deshalb reicht ihnen ein Bruchteil der Aufloesung — spart ueber 100 kB, die
# HACS sonst in jede Home-Assistant-Installation kopiert.
MAX_SPRITE_WIDTH = 640
# Die Richtungspfeile sind noch kleiner (rund 8 % der Bildbreite).
MAX_MARKER_WIDTH = 200
COLORS = 192

HIER = os.path.dirname(os.path.abspath(__file__))
FIXTURE = os.path.join(HIER, "..", "test", "fixtures", "solar-komposition.json")

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
    ("Pumpe.png", "poolpumpe_transparent.png", True),
    ("UV_C_Lampe.png", "uv_lampe_transparent.png", False),
    ("UV_C_Lampe_2.png", "uv_lampe_transparent_2.png", False),
]

# Nur Sprites auf dem Becken, nie als grosses Geraetebild — kleiner ausgeliefert.
SPRITES = [
    ("Skimmer.png", "skimmer_transparent.png"),
    ("Bodenablauf.png", "bodenablauf_transparent.png"),
    ("Einlaufduese.png", "einlaufduese_transparent.png"),
]

# Richtungspfeile des Solar-Slots. Gezeichnet zeigen sie nach oben; geliefert
# werden sie gedreht (seit Iteration 14 Spitze nach rechts: kalt links unten
# hinein, warm rechts oben hinaus) — so braucht das Markup keine
# Transformation und der Render-Test misst genau das, was zu sehen ist.
MARKER = [
    ("Pfeil_Blau_1.png", "pfeil_blau.png"),
    ("Pfeil_Rot_1.png", "pfeil_rot.png"),
]

# ---------------------------------------------------------------------------
# Solar-Komposition
#
# Es gibt kein einzelnes Solar-Artwork: eine Solarheizung ist ein FELD aus
# mehreren Absorbern. Deshalb wird das ausgelieferte Bild deterministisch aus
# drei Kopien von OKU_Panel.png gebaut — nebeneinander in Perspektive, jedes
# um UEBERLAPP der Panelbreite ueber seinem linken Nachbarn und um VERSATZ_HOCH
# der Panelhoehe tiefer. Gezeichnet wird von hinten nach vorne (das hinterste,
# oberste, am weitesten links liegende Panel zuerst), damit der vordere Rand
# jeweils oben liegt.
#
# Gewollt ist eine Landschafts-Kachel in der Groessenordnung der anderen
# Geraetebilder (Ratio ~1,3–1,5). Wer den flachen Stapel statt der Reihe will,
# setzt UEBERLAPP auf 0,88 — dann liegen die Panels fast deckungsgleich
# uebereinander und das Bild wird hochkant (und der Slot entsprechend hoch).
# ---------------------------------------------------------------------------
# Quelle ist Selinas handgezeichnetes Panel (assets/selina). In Iteration 9
# stand hier kurz Thomas' Echtfoto OKU.png; seit Iteration 13 ist es wieder die
# Zeichnung, weil der Rest der Card durchgehend Selinas Strich ist und das Foto
# sichtbar herausfiel. Beide Motive sind fast gleich proportioniert (~0,55
# Breite/Hoehe getrimmt), die Komposition bleibt damit unveraendert.
SOLAR_PANEL = "OKU_Panel.png"
SOLAR_ZIEL = "solar_transparent.png"
SOLAR_ANZAHL = 3
SOLAR_UEBERLAPP = 0.12
SOLAR_VERSATZ_HOCH = 0.04


def finde(quellen, name):
    for ordner in quellen:
        pfad = os.path.join(ordner, name)
        if os.path.exists(pfad):
            return pfad
    raise SystemExit(f"Quelldatei nicht gefunden: {name} (gesucht in {', '.join(quellen)})")


def load(pfad, trim=False, max_width=MAX_WIDTH, drehen=0):
    im = Image.open(pfad).convert("RGBA")
    if drehen:
        im = im.rotate(drehen, expand=True)
    if trim:
        box = im.getbbox()
        if box:
            im = im.crop(box)
    if im.width > max_width:
        im = im.resize((max_width, round(im.height * max_width / im.width)), Image.LANCZOS)
    return im


# Verlustfreie Nachkompression (seit dem Prod-Rollout 2026-09-25): zopflipng
# packt dieselben Palettenpixel nur dichter (~7 % kleiner). --lossy_transparent
# setzt lediglich die Farbe VOLL transparenter Pixel neu — unsichtbar, jeder
# sichtbare Pixel bleibt bit-gleich. Deterministisch, damit die Solar-Fixture
# (sha256) reproduzierbar bleibt.
ZOPFLIPNG = ["zopflipng", "-y", "-m", "--lossy_transparent"]


def save(im, pfad):
    im.quantize(colors=COLORS, method=Image.FASTOCTREE).save(pfad, optimize=True)
    if not shutil.which(ZOPFLIPNG[0]):
        raise SystemExit("zopflipng fehlt (Debian: apt install zopfli)")
    subprocess.run(ZOPFLIPNG + [pfad, pfad], check=True, stdout=subprocess.DEVNULL)
    return os.path.getsize(pfad)


def solarfeld(quellen):
    """Drei gezeichnete OKU-Panels nebeneinander in Perspektive — reine Rechnung."""
    # Das Panel wird VORHER so weit verkleinert, dass das ganze Feld in
    # MAX_DEVICE_WIDTH passt — so wird nur einmal skaliert, und die Leinwand
    # ist exakt Panel + 2 Versaetze (das prueft der Smoke-Test nach).
    passt = int(MAX_DEVICE_WIDTH / (1 + (SOLAR_ANZAHL - 1) * (1 - SOLAR_UEBERLAPP)))
    panel = load(finde(quellen, SOLAR_PANEL), trim=True, max_width=passt)
    breit, hoch = panel.size
    dx = round(breit * (1 - SOLAR_UEBERLAPP))
    dy = round(hoch * SOLAR_VERSATZ_HOCH)
    feld = Image.new("RGBA", (breit + dx * (SOLAR_ANZAHL - 1), hoch + dy * (SOLAR_ANZAHL - 1)))
    for i in range(SOLAR_ANZAHL):
        feld.alpha_composite(panel, (i * dx, i * dy))
    if feld.width > MAX_DEVICE_WIDTH:
        feld = feld.resize(
            (MAX_DEVICE_WIDTH, round(feld.height * MAX_DEVICE_WIDTH / feld.width)), Image.LANCZOS
        )
    return feld, {"panel": [breit, hoch], "dx": dx, "dy": dy}


def sha256(pfad):
    with open(pfad, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()


def main():
    argv = sys.argv[1:]
    ziel = "dist"
    if "--ziel" in argv:
        i = argv.index("--ziel")
        ziel = argv[i + 1]
        argv = argv[:i] + argv[i + 2 :]
    quellen = argv
    if not quellen:
        print(__doc__)
        return 1
    for ordner in quellen:
        if not os.path.isdir(ordner):
            raise SystemExit(f"Kein Quellordner: {ordner}")
    os.makedirs(ziel, exist_ok=True)
    total = 0

    def schreiben(im, name):
        nonlocal total
        groesse = save(im, os.path.join(ziel, name))
        total += groesse
        print(f"{name:34s} {im.size[0]:5d}x{im.size[1]:<5d} {groesse/1024:8.1f} kB")

    for quelle, name in BECKEN.items():
        schreiben(load(finde(quellen, quelle)), name)

    for quelle, name, trim in GERAETE:
        schreiben(load(finde(quellen, quelle), trim=trim, max_width=MAX_DEVICE_WIDTH), name)

    feld, masse = solarfeld(quellen)
    schreiben(feld, SOLAR_ZIEL)

    for quelle, name in SPRITES:
        schreiben(load(finde(quellen, quelle), trim=True, max_width=MAX_SPRITE_WIDTH), name)

    for quelle, name in MARKER:
        schreiben(
            load(finde(quellen, quelle), trim=True, max_width=MAX_MARKER_WIDTH, drehen=-90), name
        )

    # Beleg fuer den Test: dasselbe Rezept muss dasselbe Bild ergeben.
    fixture = {
        "_hinweis": "geschrieben von tools/prepare-assets.py — nicht von Hand aendern",
        "quelle": SOLAR_PANEL,
        "panels": SOLAR_ANZAHL,
        "ueberlapp": SOLAR_UEBERLAPP,
        "versatz_hoch": SOLAR_VERSATZ_HOCH,
        "panel_groesse": masse["panel"],
        "versatz_px": [masse["dx"], masse["dy"]],
        "datei": SOLAR_ZIEL,
        "groesse": list(feld.size),
        "sha256": sha256(os.path.join(ziel, SOLAR_ZIEL)),
    }
    with open(FIXTURE, "w", encoding="utf-8") as f:
        json.dump(fixture, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"\nFixture geschrieben: {os.path.normpath(FIXTURE)}")
    print(f"Summe: {total/1024/1024:.2f} MB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
