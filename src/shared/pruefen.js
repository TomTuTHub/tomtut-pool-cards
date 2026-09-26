import { SHAPES, SLOT_TYPES, shapeKey } from "./assets.js";

/*
 * Stille Rückfälle sichtbar machen (Iteration 22, Bug A17).
 *
 * Die Card lehnt eine krumme Config nie ab — unbekannte Werte fallen auf
 * einen Standard zurück (Form -> Oval, Ansicht -> Voll …). Das bleibt so,
 * aber niemand soll sich mehr wundern: diese Liste zeigt der Editor oben als
 * Hinweis, die Card schreibt sie einmal in die Konsole.
 */
const wert = (v) => String(v ?? "").trim();
const unbekannt = (v, erlaubt) => wert(v) !== "" && !erlaubt.includes(wert(v).toLowerCase());

export const configHinweise = (config = {}) => {
  const c = config || {};
  const h = [];
  const form = c.hero?.shape;
  if (wert(form) && !shapeKey(form)) {
    h.push(`Beckenform „${wert(form)}“ gibt es nicht — es gilt Oval. Möglich: ${Object.keys(SHAPES).join(", ")}.`);
  }
  if (unbekannt(c.view, ["voll", "mini"])) h.push(`Ansicht „${wert(c.view)}“ gibt es nicht — es gilt Voll.`);
  if (unbekannt(c.frame?.fill, ["transparent", "weiss", "schwarz"])) {
    h.push(`Füllung „${wert(c.frame.fill)}“ gibt es nicht — es gilt Transparent.`);
  }
  if (unbekannt(c.mini_tile_fill, ["schwarz", "weiss", "transparent"])) {
    h.push(`Kachel-Hintergrund „${wert(c.mini_tile_fill)}“ gibt es nicht — es gilt Schwarz.`);
  }
  if (unbekannt(c.mini_card_fill, ["theme", "schwarz", "weiss", "transparent"])) {
    h.push(`Außen-Hintergrund „${wert(c.mini_card_fill)}“ gibt es nicht — es gilt Theme.`);
  }
  (Array.isArray(c.slots) ? c.slots : []).forEach((s, i) => {
    const typ = wert(s?.type || "frame").toLowerCase();
    if (!SLOT_TYPES[typ]) h.push(`Kasten ${i + 1}: Typ „${wert(s?.type)}“ gibt es nicht — er erscheint als leerer Rahmen.`);
    if (typ === "custom" && unbekannt(s.layout, ["klassisch", "liste", "kacheln"])) {
      h.push(`Kasten ${i + 1}: Darstellung „${wert(s.layout)}“ gibt es nicht — es gilt Klassisch.`);
    }
    if (typ === "pump" && unbekannt(s.stage_mode, ["momentary", "latching"])) {
      h.push(`Kasten ${i + 1}: Schaltmodell „${wert(s.stage_mode)}“ gibt es nicht — es gilt Impulstaster.`);
    }
  });
  return h;
};
