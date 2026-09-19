#!/usr/bin/env node
/*
 * Vermisst die Becken-Artworks in dist/ und beantwortet zwei Fragen:
 *
 *   1. Wo liegt auf jedem Bild die Wasserfläche, wo die vordere Beckenwand?
 *   2. Welche Anker (Thermometer, pH, RX, Bodenablauf, Freitext) folgen daraus?
 *
 * Die Anker aus `--anker` stehen fest in src/shared/assets.js (SHAPES); die
 * Zonenkarte landet als Fixture in test/fixtures/becken-zonen.json, damit der
 * Smoke-Test prüfen kann, dass jeder Anker in seiner Zone liegt — jsdom kann
 * keine Bilder lesen, die Fixture schon.
 *
 * Aufruf:
 *   node tools/becken-zonen.mjs            Fixture neu schreiben
 *   node tools/becken-zonen.mjs --anker    Ankertabelle ausgeben
 *   node tools/becken-zonen.mjs --debug    Kontrollbilder nach /tmp schreiben
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";
import { pngLesen } from "./png-lesen.mjs";

const hier = dirname(fileURLToPath(import.meta.url));
const wurzel = join(hier, "..");

/* Reihenfolge = Reihenfolge in SHAPES */
export const FORMEN = [
  ["oval", "poolbecken_oval.png"],
  ["rechteck", "poolbecken_rechteck.png"],
  ["achtform", "poolbecken_achtform.png"],
  ["rund", "poolbecken_rund.png"],
  ["niere", "poolbecken_nierenform.png"],
  ["freiform", "poolbecken_freiform.png"],
];

/* Kantenlänge einer Zelle der Zonenkarte in Pixeln */
export const ZELLE = 10;

/* Zonen-Codes */
export const AUSSEN = 0;
export const WASSER = 1;
export const WAND = 2;
const ZEICHEN = { [AUSSEN]: ".", [WASSER]: "w", [WAND]: "m" };

/*
 * Ankerregeln — einmal am Oval kalibriert (Thomas' von Hand gesetzte Werte)
 * und dann unverändert auf alle Formen angewandt:
 *   Thermometer  links auf der Wasserfläche, im oberen Drittel der Spalte
 *   pH / RX      nebeneinander mittig auf der vorderen Beckenwand
 *   Bodenablauf  rechts unten auf dem Wasser, kurz vor der Wandkante
 *   Freitext     oben mittig über dem Becken
 */
export const REGELN = {
  /* Thermometer: links auf dem Wasser, im oberen Drittel der Wasserspalte */
  thermo: { x: 0.07, y: 0.3 },
  /* Bodenablauf: rechts unten auf dem Wasser, kurz vor der Wandkante */
  drain: { x: 0.86, y: 0.85 },
  /* pH und RX: nebeneinander auf der Wand, auf gemeinsamer Höhe */
  ph: { x: 0.3 },
  rx: { x: 0.68 },
};

/* 5x5-Mehrheitsfilter über ein Integralbild — killt Sprenkel, füllt Löcher */
const glaetten = (maske, w, h, r = 2) => {
  const I = new Int32Array((w + 1) * (h + 1));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      I[(y + 1) * (w + 1) + x + 1] =
        maske[y * w + x] + I[y * (w + 1) + x + 1] + I[(y + 1) * (w + 1) + x] - I[y * (w + 1) + x];
    }
  }
  const aus = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    const y0 = Math.max(0, y - r), y1 = Math.min(h - 1, y + r);
    for (let x = 0; x < w; x++) {
      const x0 = Math.max(0, x - r), x1 = Math.min(w - 1, x + r);
      const s =
        I[(y1 + 1) * (w + 1) + x1 + 1] - I[y0 * (w + 1) + x1 + 1] -
        I[(y1 + 1) * (w + 1) + x0] + I[y0 * (w + 1) + x0];
      aus[y * w + x] = s * 2 >= (x1 - x0 + 1) * (y1 - y0 + 1) ? 1 : 0;
    }
  }
  return aus;
};

/*
 * Bild -> Zonen.
 *
 * Wasser = blaue Fläche (spaltenweise gefüllt, damit die weißen Glanzstriche
 * im Artwork keine Löcher reißen). Wand = alles Deckende darunter bis zur
 * untersten Tuschelinie derselben Spalte — das ist genau die vordere
 * Beckenwand; der Schlagschatten liegt unterhalb und fällt heraus.
 */
export const zonenVon = ({ breite: w, hoehe: h, rgba }) => {
  const deckend = new Uint8Array(w * h);
  const tusche = new Uint8Array(w * h);
  const blau = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const r = rgba[i * 4], g = rgba[i * 4 + 1], b = rgba[i * 4 + 2], a = rgba[i * 4 + 3];
    if (a <= 128) continue;
    deckend[i] = 1;
    if (Math.max(r, g, b) < 110) tusche[i] = 1;
    if (b > r + 35 && b > 110) blau[i] = 1;
  }
  const wasser = glaetten(blau, w, h);

  const zonen = new Uint8Array(w * h);
  const spalte = { oben: new Int32Array(w).fill(-1), unten: new Int32Array(w).fill(-1) };
  for (let x = 0; x < w; x++) {
    let n = 0, oben = -1, unten = -1;
    for (let y = 0; y < h; y++) {
      if (!wasser[y * w + x]) continue;
      if (oben < 0) oben = y;
      unten = y;
      n++;
    }
    if (n < 5) continue;                       /* Streupixel sind kein Becken */
    spalte.oben[x] = oben;
    spalte.unten[x] = unten;
    for (let y = oben; y <= unten; y++) zonen[y * w + x] = WASSER;

  }

  /*
   * Untere Kante der Wand = unterste Tuschelinie der Spalte. Einzelne
   * Schatten-Striche unter dem Becken würden das Band nach unten ausreißen;
   * deshalb läuft ein Median über 41 Spalten darüber — die Beckenkante ist
   * eine glatte Kurve, der Schatten nicht.
   */
  const rohBoden = new Int32Array(w).fill(-1);
  for (let x = 0; x < w; x++) {
    if (spalte.unten[x] < 0) continue;
    for (let y = h - 1; y > spalte.unten[x]; y--) {
      if (tusche[y * w + x]) { rohBoden[x] = y; break; }
    }
  }
  const boden = new Int32Array(w).fill(-1);
  for (let x = 0; x < w; x++) {
    if (rohBoden[x] < 0) continue;
    const fenster = [];
    for (let k = x - 20; k <= x + 20; k++) if (k >= 0 && k < w && rohBoden[k] >= 0) fenster.push(rohBoden[k]);
    fenster.sort((a, b) => a - b);
    boden[x] = fenster[fenster.length >> 1];
  }

  /*
   * Die Wand ist das Band zwischen Wasserkante und Beckenboden — bewusst
   * geometrisch gefüllt: bei der Rechteck-Zeichnung ist die weiße Wandfläche
   * transparent (nur die Kontur ist gemalt), trotzdem ist es Wand.
   */
  for (let x = 0; x < w; x++) {
    if (spalte.unten[x] < 0 || boden[x] < 0) continue;
    for (let y = spalte.unten[x] + 1; y <= boden[x]; y++) zonen[y * w + x] = WAND;
  }
  return { zonen, spalte, breite: w, hoehe: h };
};

/* Spanne einer Zone in einer Bildspalte */
const spanne = (zonen, w, h, x, zone) => {
  let oben = -1, unten = -1;
  for (let y = 0; y < h; y++) {
    if (zonen[y * w + x] !== zone) continue;
    if (oben < 0) oben = y;
    unten = y;
  }
  return oben < 0 ? null : { oben, unten };
};

/* Waagrechte Ausdehnung einer Zone */
const breiteVon = (zonen, w, h, zone) => {
  let x0 = -1, x1 = -1;
  for (let x = 0; x < w; x++) {
    let da = false;
    for (let y = 0; y < h; y++) if (zonen[y * w + x] === zone) { da = true; break; }
    if (!da) continue;
    if (x0 < 0) x0 = x;
    x1 = x;
  }
  return { x0, x1 };
};

const rund = (v) => Math.round(v * 10) / 10;

/* Erste belegte Spalte ab `x` in Richtung Bildmitte */
const spalteMit = (zonen, w, h, x, zone) => {
  const richtung = x < w / 2 ? 1 : -1;
  for (let k = 0; k < w; k++) {
    const kandidat = x + k * richtung;
    if (kandidat < 0 || kandidat >= w) break;
    const s = spanne(zonen, w, h, kandidat, zone);
    if (s) return { x: kandidat, ...s };
  }
  throw new Error(`keine Spalte mit Zone ${zone} gefunden`);
};

/*
 * Anker einer Form in Prozent des Bildes.
 *
 * pH und RX teilen sich bewusst eine Höhe: die Wand kippt perspektivisch,
 * zwei Kästchen nebeneinander sollen aber auf einer Linie sitzen. Genommen
 * wird die Mitte der Überlappung beider Wandspalten — damit liegt die Höhe
 * garantiert in beiden noch auf der Wand.
 */
export const ankerVon = (bild) => {
  const { zonen, breite: w, hoehe: h } = zonenVon(bild);
  const pc = (v, ganz) => rund((v / ganz) * 100);
  const wasser = breiteVon(zonen, w, h, WASSER);
  const wand = breiteVon(zonen, w, h, WAND);
  const anker = {};

  for (const name of ["thermo", "drain"]) {
    const r = REGELN[name];
    const s = spalteMit(zonen, w, h, Math.round(wasser.x0 + r.x * (wasser.x1 - wasser.x0)), WASSER);
    anker[name] = { left: pc(s.x, w), top: pc(s.oben + r.y * (s.unten - s.oben), h) };
  }

  const ph = spalteMit(zonen, w, h, Math.round(wand.x0 + REGELN.ph.x * (wand.x1 - wand.x0)), WAND);
  const rx = spalteMit(zonen, w, h, Math.round(wand.x0 + REGELN.rx.x * (wand.x1 - wand.x0)), WAND);
  const oben = Math.max(ph.oben, rx.oben);
  const unten = Math.min(ph.unten, rx.unten);
  const hoehe = oben < unten ? pc((oben + unten) / 2, h) : null;
  anker.ph = { left: pc(ph.x, w), top: hoehe ?? pc((ph.oben + ph.unten) / 2, h) };
  anker.rx = { left: pc(rx.x, w), top: hoehe ?? pc((rx.oben + rx.unten) / 2, h) };

  /* Freitext: oben mittig, knapp über der Wasserkante der mittleren Spalte */
  const mitte = spalteMit(zonen, w, h, Math.round((wasser.x0 + wasser.x1) / 2), WASSER);
  anker.label = {
    left: pc((wasser.x0 + wasser.x1) / 2, w),
    top: Math.max(1, pc(mitte.oben - h * 0.01, h)),
  };

  return { anker, zonen, breite: w, hoehe: h };
};

/* Zonenkarte -> grobes Raster aus Zeichen (Mehrheit je Zelle) */
export const gitterVon = (zonen, w, h, zelle = ZELLE) => {
  const spalten = Math.ceil(w / zelle);
  const zeilen = Math.ceil(h / zelle);
  const aus = [];
  for (let cy = 0; cy < zeilen; cy++) {
    let zeile = "";
    for (let cx = 0; cx < spalten; cx++) {
      const zaehler = [0, 0, 0];
      for (let y = cy * zelle; y < Math.min(h, (cy + 1) * zelle); y++) {
        for (let x = cx * zelle; x < Math.min(w, (cx + 1) * zelle); x++) zaehler[zonen[y * w + x]]++;
      }
      const beste = zaehler[WASSER] >= zaehler[WAND] ? WASSER : WAND;
      zeile += ZEICHEN[zaehler[beste] > zaehler[AUSSEN] ? beste : AUSSEN];
    }
    aus.push(zeile);
  }
  return { zelle, spalten, zeilen: aus };
};

/* ---------------- PNG schreiben (nur für --debug) ---------------- */

const CRC = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return (buf) => {
    let c = -1;
    for (const b of buf) c = t[(c ^ b) & 0xff] ^ (c >>> 8);
    return (c ^ -1) >>> 0;
  };
})();

const chunk = (typ, daten) => {
  const kopf = Buffer.alloc(8);
  kopf.writeUInt32BE(daten.length, 0);
  kopf.write(typ, 4, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(CRC(Buffer.concat([kopf.subarray(4), daten])), 0);
  return Buffer.concat([kopf, daten, crc]);
};

const pngSchreiben = (pfad, w, h, rgba) => {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6;
  const roh = Buffer.alloc(h * (w * 4 + 1));
  for (let y = 0; y < h; y++) {
    roh[y * (w * 4 + 1)] = 0;
    Buffer.from(rgba.buffer, y * w * 4, w * 4).copy(roh, y * (w * 4 + 1) + 1);
  }
  writeFileSync(pfad, Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(roh)),
    chunk("IEND", Buffer.alloc(0)),
  ]));
};

/* ---------------- Hauptprogramm ---------------- */

const lauf = () => {
  const modus = process.argv[2] || "";
  const ergebnisse = FORMEN.map(([name, datei]) => {
    const bild = pngLesen(join(wurzel, "dist", datei));
    const { anker, zonen, breite, hoehe } = ankerVon(bild);
    return { name, datei, bild, anker, zonen, breite, hoehe };
  });

  if (modus === "--anker") {
    const feld = (v) => String(v).padStart(6);
    console.log("Form        Thermo         pH             RX             Ablauf         Freitext");
    for (const e of ergebnisse) {
      const s = (a) => `${feld(a.left)}/${feld(a.top)}`;
      console.log(
        `${e.name.padEnd(11)} ${s(e.anker.thermo)}  ${s(e.anker.ph)}  ${s(e.anker.rx)}  ` +
        `${s(e.anker.drain)}  ${s(e.anker.label)}`
      );
    }
    return;
  }

  if (modus === "--debug") {
    for (const e of ergebnisse) {
      const { breite: w, hoehe: h } = e;
      const out = new Uint8Array(e.bild.rgba);
      for (let i = 0; i < w * h; i++) {
        const z = e.zonen[i];
        if (!z) continue;
        const f = z === WASSER ? [0, 255, 0] : [255, 0, 255];
        for (let k = 0; k < 3; k++) out[i * 4 + k] = Math.round(out[i * 4 + k] * 0.6 + f[k] * 0.4);
        out[i * 4 + 3] = 255;
      }
      for (const [, a] of Object.entries(e.anker)) {
        const cx = Math.round((a.left / 100) * w), cy = Math.round((a.top / 100) * h);
        for (let dy = -6; dy <= 6; dy++) {
          for (let dx = -6; dx <= 6; dx++) {
            const x = cx + dx, y = cy + dy;
            if (x < 0 || y < 0 || x >= w || y >= h) continue;
            if (Math.abs(dx) > 4 && Math.abs(dy) > 4) continue;
            const i = (y * w + x) * 4;
            out[i] = 255; out[i + 1] = 0; out[i + 2] = 0; out[i + 3] = 255;
          }
        }
      }
      const ziel = `/tmp/zonen-${e.name}.png`;
      pngSchreiben(ziel, w, h, out);
      console.log(ziel);
    }
    return;
  }

  const fixture = {
    _hinweis:
      "Erzeugt von tools/becken-zonen.mjs aus den Bildern in dist/. Nicht von Hand pflegen. " +
      "w = Wasserfläche, m = vordere Beckenwand, . = außerhalb.",
    zelle: ZELLE,
    formen: {},
  };
  for (const e of ergebnisse) {
    fixture.formen[e.name] = {
      datei: e.datei,
      breite: e.breite,
      hoehe: e.hoehe,
      anker: e.anker,
      ...gitterVon(e.zonen, e.breite, e.hoehe),
    };
  }
  const ziel = join(wurzel, "test/fixtures/becken-zonen.json");
  writeFileSync(ziel, JSON.stringify(fixture, null, 1) + "\n");
  console.log(`${ziel} geschrieben (${FORMEN.length} Formen, Zellengröße ${ZELLE} px)`);
};

if (process.argv[1] && process.argv[1].endsWith("becken-zonen.mjs")) lauf();
