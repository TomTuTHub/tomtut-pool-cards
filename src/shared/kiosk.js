/*
 * Kiosk-Modus (Iteration 15) — zentral auf Card-Ebene.
 *
 *   kiosk: true          die Card ist (ganz oder teilweise) nur Anzeige
 *   kiosk_slots: [...]   für welche Kästen; fehlt die Liste = alle.
 *                        Schlüssel: "becken" und je Kasten seine feste
 *                        Kasten-ID (`id` im Slot, seit Iteration 22).
 *                        Alte Configs mit Kasten-Nummern 1..n (dieselbe
 *                        Zählung wie im Editor, "Kasten 3") gelten weiter.
 *
 * Warum IDs (Iteration 22, Bug A3): eine Nummer hängt an der Position. Wurde
 * ein Kasten verschoben oder gelöscht, zeigte `kiosk_slots: [2]` plötzlich
 * auf ein anderes Gerät — die gesperrte Pumpe war wieder schaltbar. Der
 * Editor schreibt deshalb nur noch IDs und stellt alte Nummern beim ersten
 * Verschieben/Löschen/Ändern auf IDs um (kioskMigrieren).
 *
 * Betroffene Kästen sind rein lesend: kein Schalten, kein Modus-Wählen,
 * keine Rückfrage, kein more-info (darüber könnte man sonst schalten).
 * Durchgesetzt wird das an EINER Stelle in SlotBase (_call, _moreInfo,
 * Powerbutton, Rückfrage) plus den wenigen Handlern, die vorher lokalen
 * Zustand setzen; das CSS nimmt nur Cursor und Hover-/Klick-Feedback weg.
 */
export const KIOSK_BECKEN = "becken";

const norm = (k) => String(k ?? "").trim().toLowerCase();
const istNummer = (k) => /^\d+$/.test(norm(k));
const istVersteckt = (s) => String(s?.type || "frame").toLowerCase() === "hidden";

/* Neue Kasten-ID: kurz, nie rein numerisch (sonst wäre sie eine alte Nummer) */
export const neueKastenId = (vergeben = []) => {
  const belegt = new Set(vergeben.map(norm));
  for (;;) {
    const id = "k" + Math.random().toString(36).slice(2, 7);
    if (!belegt.has(id)) return id;
  }
};

/* Schlüssel eines Kastens für kiosk_slots: seine ID, sonst (alt) die Nummer */
export const kastenSchluessel = (slot, nr) => (slot?.id ? String(slot.id) : nr);

/* Alle wählbaren Schlüssel einer Card-Config, in Editor-Reihenfolge */
export const kioskSchluessel = (config = {}) => [
  ...(config.hero?.enabled === false ? [] : [KIOSK_BECKEN]),
  ...(Array.isArray(config.slots) ? config.slots : [])
    .map((s, i) => (istVersteckt(s) ? null : kastenSchluessel(s, i + 1)))
    .filter((x) => x !== null),
];

/*
 * Gilt der Kiosk-Modus für diesen Kasten? `schluessel` = "becken" oder die
 * Kasten-Nummer; mit `slot` zählt zusätzlich dessen ID.
 */
export const kioskGilt = (config = {}, schluessel, slot = null) => {
  if (config?.kiosk !== true) return false;
  if (!Array.isArray(config.kiosk_slots)) return true;
  const id = slot?.id ? norm(slot.id) : null;
  return config.kiosk_slots.some((k) => norm(k) === norm(schluessel) || (id !== null && norm(k) === id));
};

/*
 * Alte Positionsnummern in kiosk_slots auf Kasten-IDs umstellen. Jeder
 * Kasten, auf den eine Nummer zeigt, bekommt dabei eine ID (falls er noch
 * keine hat). Ohne Nummern in der Liste kommt die Config unverändert zurück
 * (gleiches Objekt) — der Editor schreibt dann nichts.
 */
export const kioskMigrieren = (config = {}) => {
  const liste = config?.kiosk_slots;
  if (!Array.isArray(liste) || !liste.some(istNummer)) return config;
  const slots = Array.isArray(config.slots) ? config.slots.map((s) => ({ ...(s || {}) })) : [];
  const ids = slots.map((s) => s.id).filter(Boolean);
  const neu = [];
  for (const k of liste) {
    if (!istNummer(k)) {
      neu.push(k);
      continue;
    }
    const s = slots[Number(norm(k)) - 1];
    if (!s) continue;
    if (!s.id) {
      s.id = neueKastenId(ids);
      ids.push(s.id);
    }
    if (!neu.some((x) => norm(x) === norm(s.id))) neu.push(s.id);
  }
  return { ...config, slots, kiosk_slots: neu };
};
