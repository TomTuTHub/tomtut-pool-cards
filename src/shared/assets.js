/*
 * Asset- und Formen-Tabelle — die EINZIGE Stelle, an der Bilddateien stehen.
 *
 * Neue Becken-Form = ein PNG nach dist/ legen + einen Eintrag in SHAPES.
 * Kein Eingriff in Layout, Card oder Editor nötig.
 *
 * Alle Anker sind Prozentwerte des jeweiligen Bildes (left/top = Mittelpunkt
 * des Overlays). Grundlage war die Vermessung am Artwork; die Werte wurden
 * danach auf Thomas' Testansicht (Iteration 1, Form "oval") nachgezogen:
 * Für oval stehen exakt seine Werte, die übrigen Formen haben dieselbe
 * Verschiebung bekommen (Thermometer −19,0 % links / +3,7 % oben,
 * pH +6,7 / +1,9, RX +10,3 / +1,9). Jede Form bleibt damit relativ zu ihrem
 * eigenen Becken richtig und folgt trotzdem seiner Aufteilung.
 *
 * Die Bilder werden nur noch transparent ausgeliefert — Hintergrund und
 * Schriftfarbe kommen aus der Card-Option `frame.fill`.
 */

export const IMAGE_BASE = "/local/community/tomtut-pool-cards/";

export const SHAPES = {
  oval: {
    label: "Oval",
    file: "poolbecken_oval.png",
    thermo: { left: 13.5, top: 28.0 },
    ph: { left: 34.5, top: 70.5 },
    rx: { left: 64.0, top: 70.5 },
    drain: { left: 87.4, top: 51.2 },
  },
  rechteck: {
    label: "Rechteck",
    file: "poolbecken_rechteck.png",
    thermo: { left: 12.3, top: 32.5 },
    ph: { left: 32.8, top: 74.9 },
    rx: { left: 64.7, top: 74.9 },
    drain: { left: 91.2, top: 59.2 },
  },
  achtform: {
    label: "Achtform",
    file: "poolbecken_achtform.png",
    thermo: { left: 11.8, top: 30.6 },
    ph: { left: 32.4, top: 73.6 },
    rx: { left: 64.2, top: 73.6 },
    drain: { left: 90.7, top: 59.2 },
  },
  rund: {
    label: "Rund",
    file: "poolbecken_rund.png",
    thermo: { left: 12.8, top: 28.6 },
    ph: { left: 33.6, top: 72.9 },
    rx: { left: 64.2, top: 72.9 },
    drain: { left: 89.2, top: 55.3 },
  },
  niere: {
    label: "Nierenform",
    file: "poolbecken_nierenform.png",
    thermo: { left: 13.1, top: 32.5 },
    ph: { left: 33.9, top: 71.6 },
    rx: { left: 64.5, top: 71.6 },
    drain: { left: 89.4, top: 54.5 },
  },
  freiform: {
    label: "Freiform",
    file: "poolbecken_freiform.png",
    thermo: { left: 12.7, top: 31.6 },
    ph: { left: 33.1, top: 76.2 },
    rx: { left: 65.6, top: 76.2 },
    drain: { left: 92.9, top: 61.9 },
  },
};

export const DEFAULT_SHAPE = "oval";

/* Unbekannte Form -> Fallback oval, nie ein Fehler */
export const shapeOf = (name) => SHAPES[String(name || "").toLowerCase()] || SHAPES[DEFAULT_SHAPE];

/*
 * Geräte-Artwork je Slot-Typ. Es gibt bewusst nur noch die transparente
 * Fassung: ob der Kasten hell, dunkel oder durchsichtig ist, entscheidet
 * allein `frame.fill` — das Bild legt sich einfach darüber.
 */
export const DEVICE_IMAGES = {
  heatpump: "waermepumpe_transparent.png",
  /* Iteration 1: Platzhalter im Vigipool-Skizzenstil.
     Thomas' endgültige Zeichnung ersetzt später genau diese Datei. */
  pump: "poolpumpe_transparent.png",
};

export const imagePath = (file) => IMAGE_BASE + file;

/* Bildpfad eines Geräte-Slots */
export const deviceImage = (kind) => imagePath(DEVICE_IMAGES[kind] || "");

/*
 * Slot-Typen. `ready: false` = für eine spätere Iteration reserviert
 * (Artwork fehlt noch) — solche Slots rendern als leerer Rahmen mit Hinweis.
 * Die Schlüssel sind Teil der Config und ändern sich nie (Update-Sicherheit),
 * nur die Beschriftung im Editor.
 */
export const SLOT_TYPES = {
  heatpump: { label: "Wärmepumpe", ready: true },
  pump: { label: "Poolpumpe", ready: true },
  custom: { label: "Freifeld (benutzerdefiniert)", ready: true },
  frame: { label: "Leerer Rahmen", ready: true },
  hidden: { label: "Ausgeblendet", ready: true },
  uv: { label: "UV-C-Lampe", ready: false, hint: "UV-C-Lampe folgt in einer späteren Version." },
  solar: { label: "Solarheizung", ready: false, hint: "Solarheizung folgt in einer späteren Version." },
  inlet: { label: "Einlaufdüse", ready: false, hint: "Einlaufdüse folgt in einer späteren Version." },
};

/*
 * Reihenfolge im Auswahlfeld des Editors — bewusst anders als die Tabelle
 * oben: zuerst die allgemeinen Slots (Freifeld, Ausgeblendet, Leerer Rahmen),
 * danach ein nicht wählbarer Trenner und erst dann die Gerätetypen.
 * Die Schlüssel selbst bleiben unverändert; das hier ist reine Anzeige.
 */
export const SLOT_TYPE_GROUPS = [
  { trenner: null, keys: ["custom", "hidden", "frame"] },
  { trenner: "— Geräte —", keys: ["heatpump", "pump", "uv", "solar", "inlet"] },
];

/*
 * Flache Optionsliste für das <select>. Ein Eintrag mit `trenner: true` ist
 * die nicht wählbare Zwischenüberschrift (disabled option) — das ist die
 * Variante, die ein natives Select in jedem Browser sauber darstellt.
 * Nicht in einer Gruppe gelistete Typen hängen sich hinten an, damit ein
 * neuer Slot-Typ nie aus dem Editor fällt.
 */
export const slotTypeOptions = () => {
  const genannt = new Set(SLOT_TYPE_GROUPS.flatMap((g) => g.keys));
  const rest = Object.keys(SLOT_TYPES).filter((k) => !genannt.has(k));
  const opt = (key) => ({
    value: key,
    label: SLOT_TYPES[key].label + (SLOT_TYPES[key].ready === false ? " (folgt)" : ""),
  });
  const aus = [];
  for (const g of SLOT_TYPE_GROUPS) {
    if (g.trenner) aus.push({ trenner: true, label: g.trenner });
    for (const k of g.keys) if (SLOT_TYPES[k]) aus.push(opt(k));
  }
  for (const k of rest) aus.push(opt(k));
  return aus;
};
