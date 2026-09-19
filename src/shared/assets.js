/*
 * Asset- und Formen-Tabelle — die EINZIGE Stelle, an der Bilddateien stehen.
 *
 * Neue Becken-Form = ein PNG nach dist/ legen + einen Eintrag in SHAPES.
 * Kein Eingriff in Layout, Card oder Editor noetig.
 *
 * Alle Anker sind Prozentwerte des jeweiligen Bildes (left/top = Mittelpunkt
 * des Overlays). Sie wurden auf dem mitgelieferten Artwork vermessen.
 */

export const IMAGE_BASE = "/local/community/tomtut-pool-cards/";

export const SHAPES = {
  oval: {
    label: "Oval",
    file: "poolbecken_oval.png",
    thermo: { left: 32.5, top: 24.3 },
    ph: { left: 27.8, top: 68.6 },
    rx: { left: 53.7, top: 68.6 },
    drain: { left: 87.4, top: 51.2 },
  },
  rechteck: {
    label: "Rechteck",
    file: "poolbecken_rechteck.png",
    thermo: { left: 31.3, top: 28.8 },
    ph: { left: 26.1, top: 73.0 },
    rx: { left: 54.4, top: 73.0 },
    drain: { left: 91.2, top: 59.2 },
  },
  achtform: {
    label: "Achtform",
    file: "poolbecken_achtform.png",
    thermo: { left: 30.8, top: 26.9 },
    ph: { left: 25.7, top: 71.7 },
    rx: { left: 53.9, top: 71.7 },
    drain: { left: 90.7, top: 59.2 },
  },
  rund: {
    label: "Rund",
    file: "poolbecken_rund.png",
    thermo: { left: 31.8, top: 24.9 },
    ph: { left: 26.9, top: 71.0 },
    rx: { left: 53.9, top: 71.0 },
    drain: { left: 89.2, top: 55.3 },
  },
  niere: {
    label: "Nierenform",
    file: "poolbecken_nierenform.png",
    thermo: { left: 32.1, top: 28.8 },
    ph: { left: 27.2, top: 69.7 },
    rx: { left: 54.2, top: 69.7 },
    drain: { left: 89.4, top: 54.5 },
  },
  freiform: {
    label: "Freiform",
    file: "poolbecken_freiform.png",
    thermo: { left: 31.7, top: 27.9 },
    ph: { left: 26.4, top: 74.3 },
    rx: { left: 55.3, top: 74.3 },
    drain: { left: 92.9, top: 61.9 },
  },
};

export const DEFAULT_SHAPE = "oval";

/* Unbekannte Form -> Fallback oval, nie ein Fehler */
export const shapeOf = (name) => SHAPES[String(name || "").toLowerCase()] || SHAPES[DEFAULT_SHAPE];

/* Geraete-Artwork je Slot-Typ und Variante */
export const DEVICE_IMAGES = {
  heatpump: {
    transparent: "waermepumpe_transparent.png",
    weiss: "waermepumpe_weiss.png",
    schwarz: "waermepumpe_schwarz.png",
  },
  /* Iteration 1: Platzhalter im Vigipool-Skizzenstil.
     Thomas' endgueltige Zeichnung ersetzt spaeter genau diese drei Dateien. */
  pump: {
    transparent: "poolpumpe_transparent.png",
    weiss: "poolpumpe_weiss.png",
    schwarz: "poolpumpe_schwarz.png",
  },
};

export const imagePath = (file) => IMAGE_BASE + file;

/* Bildpfad eines Geraete-Slots: image_url schlaegt image_variant */
export const deviceImage = (kind, config = {}) => {
  if (config.image_url) return config.image_url;
  const set = DEVICE_IMAGES[kind] || {};
  const variant = config.image_variant || "transparent";
  return imagePath(set[variant] || set.transparent || "");
};

/*
 * Slot-Typen. `ready: false` = fuer eine spaetere Iteration reserviert
 * (Artwork fehlt noch) — solche Slots rendern als leerer Rahmen mit Hinweis.
 */
export const SLOT_TYPES = {
  heatpump: { label: "Waermepumpe", ready: true },
  pump: { label: "Poolpumpe", ready: true },
  custom: { label: "Werte / Buttons", ready: true },
  frame: { label: "Leerer Rahmen", ready: true },
  hidden: { label: "Ausgeblendet", ready: true },
  uv: { label: "UV-C-Lampe", ready: false, hint: "UV-C-Lampe folgt in einer spaeteren Version." },
  solar: { label: "Solarheizung", ready: false, hint: "Solarheizung folgt in einer spaeteren Version." },
  inlet: { label: "Einlaufduese", ready: false, hint: "Einlaufduese folgt in einer spaeteren Version." },
};
