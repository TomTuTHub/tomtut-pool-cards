/*
 * Bildbereich der Geräte-Slots — Geometrie des Drehens.
 *
 * Der Bildbereich eines Slots ist ein Kasten im Seitenverhältnis des
 * ausgelieferten PNGs (`DEVICE_RATIOS`). Er ändert seine Größe NIE — auch
 * nicht, wenn das Bild darin gedreht oder gespiegelt wird. Gedreht wird
 * ausschließlich ein innerer Wrapper per `transform`; damit die gedrehte
 * Hülle im Kasten bleibt, wird derselbe Wrapper passend verkleinert.
 *
 * Hier stehen nur die reinen Rechnungen. Das Markup dazu liefert
 * `SlotBase.renderGeraeteBild()`, die Regeln dazu `shared/styles.js`.
 */

/* Drehwinkel aus der Config: ganze Grad, immer 0..359 */
export const normGrad = (wert) => {
  const n = Number(wert);
  if (!isFinite(n)) return 0;
  return ((Math.round(n) % 360) + 360) % 360;
};

/* Rundungsschmutz von Math.cos/sin (1.2e-16 statt 0) rausfiltern */
const glatt = (x) => (Math.abs(x) < 1e-9 ? 0 : Math.abs(x));

/*
 * Maßstab, mit dem ein gedrehtes Bild gerade noch in seinen Kasten passt.
 *
 * Bild und Kasten sind deckungsgleich (beide `ratio` breit zu 1 hoch). Für
 * den Winkel θ misst die gedrehte Hülle
 *     breit = ratio·|cosθ| + |sinθ|      hoch = ratio·|sinθ| + |cosθ|
 * (in Einheiten der Kastenhöhe). Der Faktor ist das Minimum aus beiden
 * Richtungen und wird nie größer als 1 — vergrößert wird hier nichts.
 *
 * Beispiel UV-Lampe (ratio ≈ 2,47): 0°/180° -> 1, 90°/270° -> 1/ratio ≈ 0,41.
 */
export const passFaktor = (grad, ratio) => {
  const r = Number(ratio) > 0 ? Number(ratio) : 1;
  const rad = (normGrad(grad) * Math.PI) / 180;
  const c = glatt(Math.cos(rad));
  const s = glatt(Math.sin(rad));
  return Math.min(1, r / (r * c + s), 1 / (r * s + c));
};

/* Auf drei Nachkommastellen — mehr sieht man nicht, und 0,9999 wäre 1 */
export const rundFaktor = (f) => Math.round(f * 1000) / 1000;

/*
 * Inline-Stil des drehbaren Wrappers. Reihenfolge der Transformationen:
 * erst spiegeln, dann skalieren, dann drehen (CSS wendet die Liste von
 * rechts nach links an). Ohne Drehung und ohne Spiegel bleibt der Stil leer.
 */
export const bildTransform = (grad, mirror, ratio) => {
  const g = normGrad(grad);
  const f = rundFaktor(passFaktor(g, ratio));
  const teile = [];
  if (g) teile.push(`rotate(${g}deg)`);
  if (f < 1) teile.push(`scale(${f})`);
  if (mirror === true) teile.push("scaleX(-1)");
  return teile.length ? `transform:${teile.join(" ")};` : "";
};
