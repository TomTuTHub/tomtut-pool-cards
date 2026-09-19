/*
 * Minimaler PNG-Leser (nur was die Artwork-Dateien brauchen).
 *
 * Node bringt keinen Bild-Decoder mit, und das Repo soll für eine reine
 * Messaufgabe keine Bild-Abhängigkeit bekommen. Unterstützt werden
 * nicht-interlaced PNGs mit Bittiefe 8 in den Farbtypen 0/2/3/4/6 —
 * genau das, was tools/prepare-assets.py nach dist/ schreibt.
 */
import { readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";

const KANAELE = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };

const unfilter = (roh, breite, hoehe, bpp) => {
  const zeile = breite * bpp;
  const aus = Buffer.alloc(zeile * hoehe);
  let p = 0;
  for (let y = 0; y < hoehe; y++) {
    const typ = roh[p++];
    const z = y * zeile;
    const o = z - zeile;
    for (let i = 0; i < zeile; i++) {
      const x = roh[p + i];
      const a = i >= bpp ? aus[z + i - bpp] : 0;
      const b = y > 0 ? aus[o + i] : 0;
      const c = i >= bpp && y > 0 ? aus[o + i - bpp] : 0;
      let v;
      switch (typ) {
        case 0: v = x; break;
        case 1: v = x + a; break;
        case 2: v = x + b; break;
        case 3: v = x + ((a + b) >> 1); break;
        case 4: {
          const pa = Math.abs(b - c), pb = Math.abs(a - c), pc = Math.abs(a + b - 2 * c);
          v = x + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c);
          break;
        }
        default: throw new Error(`Unbekannter Filtertyp ${typ} in Zeile ${y}`);
      }
      aus[z + i] = v & 0xff;
    }
    p += zeile;
  }
  return aus;
};

/* -> { breite, hoehe, rgba: Uint8Array (4 Byte je Pixel) } */
export const pngLesen = (pfad) => {
  const buf = readFileSync(pfad);
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error(`${pfad}: kein PNG`);
  let pos = 8;
  let ihdr = null, plte = null, trns = null;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const typ = buf.toString("ascii", pos + 4, pos + 8);
    const daten = buf.subarray(pos + 8, pos + 8 + len);
    if (typ === "IHDR") {
      ihdr = {
        breite: daten.readUInt32BE(0),
        hoehe: daten.readUInt32BE(4),
        tiefe: daten[8],
        farbtyp: daten[9],
        interlace: daten[12],
      };
    } else if (typ === "PLTE") plte = Buffer.from(daten);
    else if (typ === "tRNS") trns = Buffer.from(daten);
    else if (typ === "IDAT") idat.push(Buffer.from(daten));
    else if (typ === "IEND") break;
    pos += 12 + len;
  }
  if (!ihdr) throw new Error(`${pfad}: IHDR fehlt`);
  if (ihdr.tiefe !== 8) throw new Error(`${pfad}: nur Bittiefe 8 unterstützt (ist ${ihdr.tiefe})`);
  if (ihdr.interlace) throw new Error(`${pfad}: Interlace wird nicht unterstützt`);
  const kanaele = KANAELE[ihdr.farbtyp];
  if (!kanaele) throw new Error(`${pfad}: Farbtyp ${ihdr.farbtyp} wird nicht unterstützt`);

  const { breite, hoehe } = ihdr;
  const flach = unfilter(inflateSync(Buffer.concat(idat)), breite, hoehe, kanaele);
  const rgba = new Uint8Array(breite * hoehe * 4);
  for (let i = 0, n = breite * hoehe; i < n; i++) {
    const s = i * kanaele, d = i * 4;
    let r, g, b, a = 255;
    switch (ihdr.farbtyp) {
      case 0: r = g = b = flach[s]; break;
      case 4: r = g = b = flach[s]; a = flach[s + 1]; break;
      case 2: r = flach[s]; g = flach[s + 1]; b = flach[s + 2]; break;
      case 6: r = flach[s]; g = flach[s + 1]; b = flach[s + 2]; a = flach[s + 3]; break;
      case 3: {
        const idx = flach[s];
        r = plte[idx * 3]; g = plte[idx * 3 + 1]; b = plte[idx * 3 + 2];
        a = trns && idx < trns.length ? trns[idx] : 255;
        break;
      }
    }
    rgba[d] = r; rgba[d + 1] = g; rgba[d + 2] = b; rgba[d + 3] = a;
  }
  return { breite, hoehe, rgba };
};
