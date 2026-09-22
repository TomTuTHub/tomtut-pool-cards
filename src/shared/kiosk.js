/*
 * Kiosk-Modus (Iteration 15) — zentral auf Card-Ebene.
 *
 *   kiosk: true          die Card ist (ganz oder teilweise) nur Anzeige
 *   kiosk_slots: [...]   für welche Kästen; fehlt die Liste = alle.
 *                        Schlüssel: "becken" und die Kasten-Nummer 1..n
 *                        (dieselbe Zählung wie im Editor, "Kasten 3").
 *
 * Betroffene Kästen sind rein lesend: kein Schalten, kein Modus-Wählen,
 * keine Rückfrage, kein more-info (darüber könnte man sonst schalten).
 * Durchgesetzt wird das an EINER Stelle in SlotBase (_call, _moreInfo,
 * Powerbutton, Rückfrage) plus den wenigen Handlern, die vorher lokalen
 * Zustand setzen; das CSS nimmt nur Cursor und Hover-/Klick-Feedback weg.
 */
export const KIOSK_BECKEN = "becken";

const norm = (k) => String(k ?? "").trim().toLowerCase();

/* Alle wählbaren Schlüssel einer Card-Config, in Editor-Reihenfolge */
export const kioskSchluessel = (config = {}) => [
  ...(config.hero?.enabled === false ? [] : [KIOSK_BECKEN]),
  ...(Array.isArray(config.slots) ? config.slots : [])
    .map((s, i) => (String(s?.type || "frame").toLowerCase() === "hidden" ? null : i + 1))
    .filter((x) => x !== null),
];

/* Gilt der Kiosk-Modus für diesen Kasten? */
export const kioskGilt = (config = {}, schluessel) => {
  if (config?.kiosk !== true) return false;
  if (!Array.isArray(config.kiosk_slots)) return true;
  return config.kiosk_slots.some((k) => norm(k) === norm(schluessel));
};
