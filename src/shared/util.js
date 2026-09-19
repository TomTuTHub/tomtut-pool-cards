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

/* Zahl mit deutschem Dezimalkomma */
export const fmt = (v, dec = 0) => {
  const n = Number(v);
  if (!isFinite(n)) return "—";
  return n.toFixed(dec).replace(".", ",");
};

/* Leistungssensor -> Watt (kW wird umgerechnet) */
export const toWatt = (entity) => {
  if (!entity) return null;
  const v = numOf(entity.state);
  if (v === null) return null;
  const unit = String(entity.attributes?.unit_of_measurement || "W").toLowerCase();
  return unit === "kw" ? v * 1000 : v;
};

/* "seit 46 Min" aus einem last_changed-Zeitstempel */
export const seit = (iso, now = Date.now()) => {
  if (!iso) return "";
  const t = Date.parse(iso);
  if (isNaN(t)) return "";
  const s = Math.max(0, (now - t) / 1000);
  if (s < 60) return `seit ${Math.floor(s)} Sek`;
  const m = s / 60;
  if (m < 60) return `seit ${Math.floor(m)} Min`;
  const h = m / 60;
  if (h < 24) return `seit ${Math.floor(h)} Std`;
  const d = Math.floor(h / 24);
  return d <= 1 ? "seit 1 Tag" : `seit ${d} Tagen`;
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
