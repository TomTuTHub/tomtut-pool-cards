/*
 * Asset- und Formen-Tabelle — die EINZIGE Stelle, an der Bilddateien stehen.
 *
 * Neue Becken-Form = ein PNG nach dist/ legen + einen Eintrag in SHAPES.
 * Kein Eingriff in Layout, Card oder Editor nötig.
 *
 * Alle Anker sind Prozentwerte des jeweiligen Bildes (left/top = Mittelpunkt
 * des Overlays).
 *
 * Seit Iteration 4 ist jeder Anker am Bild nachgemessen statt aus dem Oval
 * hochgerechnet: `node tools/becken-zonen.mjs --anker` liest die PNGs in
 * dist/, trennt Wasserfläche und vordere Beckenwand und liefert genau diese
 * Tabelle. Wird ein Artwork ersetzt, einmal neu messen und die Zahlen hier
 * eintragen — die Regeln dazu stehen im Werkzeug. Zur Kontrolle prüft der
 * Smoke-Test jeden Anker gegen die Zonenkarte in
 * test/fixtures/becken-zonen.json (Thermometer und Bodenablauf auf Wasser,
 * pH und RX auf der Wand).
 *
 * Die Bilder werden nur noch transparent ausgeliefert — Hintergrund und
 * Schriftfarbe kommen aus der Card-Option `frame.fill`.
 */

export const IMAGE_BASE = "/local/community/tomtut-pool-cards/";

export const SHAPES = {
  oval: {
    label: "Oval",
    file: "poolbecken_oval.png",
    thermo: { left: 16.1, top: 28.2 },
    ph: { left: 34.1, top: 69.5 },
    rx: { left: 63.9, top: 69.5 },
    drain: { left: 78.0, top: 30.9 },
    label_anker: { left: 49.8, top: 1.3 },
  },
  rechteck: {
    label: "Rechteck",
    file: "poolbecken_rechteck.png",
    thermo: { left: 13.3, top: 31.2 },
    ph: { left: 32.6, top: 68.5 },
    rx: { left: 64.5, top: 68.5 },
    drain: { left: 79.6, top: 33.4 },
    label_anker: { left: 49.4, top: 13.2 },
  },
  achtform: {
    label: "Achtform",
    file: "poolbecken_achtform.png",
    thermo: { left: 13.0, top: 34.0 },
    ph: { left: 32.7, top: 68.2 },
    rx: { left: 65.1, top: 68.2 },
    drain: { left: 80.4, top: 34.8 },
    label_anker: { left: 49.7, top: 15.6 },
  },
  rund: {
    label: "Rund",
    file: "poolbecken_rund.png",
    thermo: { left: 14.7, top: 25.6 },
    ph: { left: 33.5, top: 72.4 },
    rx: { left: 64.5, top: 72.4 },
    drain: { left: 79.3, top: 39.1 },
    label_anker: { left: 49.8, top: 1.0 },
  },
  niere: {
    label: "Nierenform",
    file: "poolbecken_nierenform.png",
    thermo: { left: 15.9, top: 31.6 },
    ph: { left: 34.4, top: 65.3 },
    rx: { left: 65.0, top: 65.3 },
    drain: { left: 79.5, top: 35.7 },
    label_anker: { left: 50.5, top: 10.2 },
  },
  freiform: {
    label: "Freiform",
    file: "poolbecken_freiform.png",
    thermo: { left: 13.4, top: 38.3 },
    ph: { left: 33.4, top: 75.4 },
    rx: { left: 66.6, top: 75.4 },
    drain: { left: 82.3, top: 47.1 },
    label_anker: { left: 50.9, top: 6.7 },
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
  uv: "uv_lampe_transparent.png",
};

/*
 * Bildvarianten eines Geräts. Nur die UV-Lampe hat welche: die Zeichnung
 * gibt es mit seitlichem und mit obenliegendem Anschluss am linken T-Stück —
 * sonst sind beide Dateien identisch.
 */
export const DEVICE_VARIANTS = {
  uv: {
    seite: "uv_lampe_transparent.png",
    oben: "uv_lampe_transparent_2.png",
  },
};

/*
 * Seitenverhältnis (Breite/Höhe) der ausgelieferten Geräte-PNGs. Gebraucht
 * wird es überall dort, wo aus einer Prozentangabe der Bildhöhe eine Länge
 * werden muss, ohne das Bild geladen zu haben — beim Drehen der UV-Lampe und
 * für die Höhe ihres Glühbereichs. Wird ein Artwork ersetzt, gehört der Wert
 * hier mit korrigiert.
 */
export const DEVICE_RATIOS = {
  heatpump: 988 / 725,
  pump: 221 / 150,
  uv: 947 / 384,
};

export const imagePath = (file) => IMAGE_BASE + file;

/* Bildpfad eines Geräte-Slots, optional in einer Bildvariante */
export const deviceImage = (kind, variante) =>
  imagePath(DEVICE_VARIANTS[kind]?.[variante] || DEVICE_IMAGES[kind] || "");

/* Seitenverhältnis eines Geräte-Bildes (unbekannt -> 1, also quadratisch) */
export const deviceRatio = (kind) => DEVICE_RATIOS[kind] || 1;

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
  uv: { label: "UV-C-Lampe", ready: true },
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
