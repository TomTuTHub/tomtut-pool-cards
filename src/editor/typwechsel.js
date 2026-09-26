import { slotLabel } from "../shared/slot-base.js";

/*
 * Typwechsel eines Kastens (Iteration 22, Bug A5).
 *
 * Vorher blieb beim Umstellen z.B. Poolpumpe -> UV-C-Lampe alles stehen:
 * main_entity, stage_* und stop_entity als Leichen, power_entity und
 * temp_entity übernahm die UV-Lampe stillschweigend und zeigte Pumpenwatt.
 *
 * Jetzt nimmt der neue Kasten nur mit, was zu JEDEM Typ gehört:
 *   id           feste Kasten-ID (Kiosk, s. shared/kiosk.js)
 *   label        die Beschriftung (alte Schlüssel label_text/title werden
 *                dabei auf `label` umgestellt)
 *   mini_hidden  "als Kachel zeigen" aus der Mini-Ansicht
 * Alles andere fällt weg. `gemerkt` ist der Kasten, wie er zuletzt in
 * diesem Typ aussah (der Editor merkt ihn sich) — so bringt ein Zurück-
 * stellen alle Felder wieder, ohne dass sie als Leichen in der Config lagen.
 */
export const typWechsel = (alt = {}, typ, gemerkt = null) => {
  const a = alt || {};
  const label = slotLabel(a);
  const basis = gemerkt ? { ...gemerkt } : {};
  delete basis.label_text;
  delete basis.title;
  const neu = { ...basis, type: typ };
  if (a.id) neu.id = a.id;
  else delete neu.id;
  if (label) neu.label = label;
  else delete neu.label;
  if (a.mini_hidden === true) neu.mini_hidden = true;
  else delete neu.mini_hidden;
  return neu;
};
