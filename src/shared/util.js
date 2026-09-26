/* Kleine Helfer, die alle Slots teilen. Bewusst ohne Abhängigkeiten. */

export const ON_STATES = [
  "on", "true", "heat", "cool", "heating", "cooling",
  "auto", "dry", "fan_only", "open", "home", "playing",
];

export const isOn = (state) => ON_STATES.includes(String(state).toLowerCase());

/*
 * Strenger Zahl-Check. parseFloat wäre zu gutmütig: aus einem Zeitstempel
 * ("2026-09-19T12:00:00+02:00") macht es klaglos die Zahl 2026. Genau so kam
 * es im Test zu einer Watt-Box mit "2684485632". Nur ein durchgehend
 * numerischer State gilt hier als Zahl, alles andere ist "kein Wert".
 */
export const numOf = (raw) => {
  if (raw === undefined || raw === null) return null;
  const s = String(raw).trim().replace(",", ".");
  if (!/^[+-]?(\d+(\.\d+)?|\.\d+)([eE][+-]?\d+)?$/.test(s)) return null;
  const n = Number(s);
  return isFinite(n) ? n : null;
};

/*
 * Zahl mit deutschem Dezimalkomma. Ab fünf Stellen vor dem Komma mit
 * Tausenderpunkt (Iteration 22, Bug A18: "123.456.789 W" wie in HA) —
 * vierstellige Werte bleiben ohne ("2690 W"), so wie bisher und wie es
 * DIN 5008 erlaubt.
 */
export const fmt = (v, dec = 0) => {
  const n = Number(v);
  if (!isFinite(n)) return "—";
  const [ganz, rest] = n.toFixed(dec).split(".");
  const ziffern = ganz.replace("-", "");
  const gruppiert = ziffern.length > 4 ? ziffern.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ziffern;
  return (ganz.startsWith("-") ? "-" : "") + gruppiert + (rest ? "," + rest : "");
};

/* Leistungssensor -> Watt (kW wird umgerechnet) */
export const toWatt = (entity) => {
  if (!entity) return null;
  const v = numOf(entity.state);
  if (v === null) return null;
  const unit = String(entity.attributes?.unit_of_measurement || "W").toLowerCase();
  return unit === "kw" ? v * 1000 : v;
};

/* "seit 46 Min" aus einem last_changed-Zeitstempel; unter einer Minute
   "gerade eben" (Iteration 24 — "seit 0 Sek" las sich wie ein Fehler) */
export const seit = (iso, now = Date.now()) => {
  if (!iso) return "";
  const t = Date.parse(iso);
  if (isNaN(t)) return "";
  const s = Math.max(0, (now - t) / 1000);
  if (s < 60) return "gerade eben";
  const m = s / 60;
  if (m < 60) return `seit ${Math.floor(m)} Min`;
  const h = m / 60;
  if (h < 24) return `seit ${Math.floor(h)} Std`;
  const d = Math.floor(h / 24);
  return d <= 1 ? "seit 1 Tag" : `seit ${d} Tagen`;
};

/*
 * Wie `seit`, aber minutengenau unter einem Tag (Iteration 14, Freigabe-
 * kontakt): "seit 4 Min", "seit 2 Std 10 Min", "seit 3 Tagen". Unter einer
 * Minute "gerade eben" (seit Iteration 24) — der Text läuft nur minütlich mit.
 */
export const seitMinuten = (iso, now = Date.now()) => {
  if (!iso) return "";
  const t = Date.parse(iso);
  if (isNaN(t)) return "";
  const min = Math.floor(Math.max(0, now - t) / 60000);
  if (min < 1) return "gerade eben";
  if (min < 60) return `seit ${min} Min`;
  if (min < 24 * 60) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m ? `seit ${h} Std ${m} Min` : `seit ${h} Std`;
  }
  const d = Math.floor(min / (24 * 60));
  return d <= 1 ? "seit 1 Tag" : `seit ${d} Tagen`;
};

/* Zustand ohne brauchbaren Wert (Iteration 22): zählt nie als "an" oder "ausgelöst" */
export const TOT_STATES = ["", "unknown", "unavailable", "none"];
export const istTot = (state) => TOT_STATES.includes(String(state ?? "").trim().toLowerCase());

/*
 * "Läuft gerade?" aus einem beliebigen Zustand (Iteration 22, Bug A21):
 * on/off wie immer, dazu Klartext-Zustände wie ein input_select
 * "Heizen"/"Bypass". Ausschluss-Wörter gewinnen ("Heizen aus" = aus).
 * Unbekannte Wörter bleiben aus — lieber grau als eine falsche Behauptung.
 */
const AUS_WOERTER = /\b(aus|off|bypass|zu|closed|geschlossen|inaktiv|inactive|stop|stopp|idle|standby|false)\b/;
const AN_WOERTER = /\b(an|ein|heizen|heizt|heating|heat|aktiv|active|läuft|laeuft|running|run|offen|open|auf|solar|true)\b/;
export const istAktivText = (state) => {
  const s = String(state ?? "").trim().toLowerCase();
  if (istTot(s)) return false;
  if (isOn(s)) return true;
  if (AUS_WOERTER.test(s)) return false;
  return AN_WOERTER.test(s);
};

/* Domain einer Entity-ID ("switch.pumpe" -> "switch") */
export const domainOf = (id) => String(id || "").split(".")[0];

/* Anzeigename einer Entity (friendly_name, sonst die ID) */
export const nameOf = (entity, id) =>
  entity?.attributes?.friendly_name || String(id || "").split(".")[1] || String(id || "");

/*
 * Zahlenwert einer Entity für ein Overlay (Thermometer, pH/RX, Watt …):
 * höchstens eine Nachkommastelle, Einheit dahinter, nicht-numerisch -> "—".
 * Ganze Zahlen bleiben ohne Komma ("712 mV", nicht "712,0 mV").
 */
export const numText = (entity, { decimals } = {}) => {
  const n = numOf(entity?.state);
  if (n === null) return "—";
  const dec = decimals ?? (Number.isInteger(n) ? 0 : 1);
  const unit = entity.attributes?.unit_of_measurement;
  return fmt(n, Math.min(dec, 1)) + (unit ? " " + unit : "");
};

/*
 * Freier Text einer Entity (Werte-Slot): Zahlen wie oben, sonst der State
 * im Klartext — dort sind "on"/"Sommerbetrieb" gewollte Anzeigen.
 */
export const stateText = (entity) => {
  if (!entity) return "—";
  const n = numOf(entity.state);
  const unit = entity.attributes?.unit_of_measurement;
  if (n !== null) return fmt(n, Number.isInteger(n) ? 0 : 1) + (unit ? " " + unit : "");
  return String(entity.state) + (unit ? " " + unit : "");
};
