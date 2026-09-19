/* Kleine Helfer, die alle Slots teilen. Bewusst ohne Abhaengigkeiten. */

export const ON_STATES = [
  "on", "true", "heat", "cool", "heating", "cooling",
  "auto", "dry", "fan_only", "open", "home", "playing",
];

export const isOn = (state) => ON_STATES.includes(String(state).toLowerCase());

/* Zahl mit deutschem Dezimalkomma */
export const fmt = (v, dec = 0) => {
  const n = Number(v);
  if (!isFinite(n)) return "—";
  return n.toFixed(dec).replace(".", ",");
};

/* Leistungssensor -> Watt (kW wird umgerechnet) */
export const toWatt = (entity) => {
  if (!entity) return null;
  const v = parseFloat(entity.state);
  if (isNaN(v)) return null;
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

/* Wert + Einheit einer beliebigen Entity als Text */
export const stateText = (entity) => {
  if (!entity) return "—";
  const unit = entity.attributes?.unit_of_measurement;
  const n = parseFloat(entity.state);
  if (!isNaN(n) && String(entity.state).trim() !== "") {
    const dec = Math.abs(n) >= 100 || Number.isInteger(n) ? 0 : 1;
    return fmt(n, dec) + (unit ? " " + unit : "");
  }
  return String(entity.state) + (unit ? " " + unit : "");
};
