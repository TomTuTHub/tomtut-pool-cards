/*!
 * tomtut-pool-cards.js — Lovelace-Sammlung für Pool-Dashboards
 *
 * Card-Typ:
 *   custom:tomtut-pool-dashboard  — Becken-Hero + frei bestückbare Geräte-Slots
 *
 * Keine Integration nötig: alle Werte kommen aus frei konfigurierbaren
 * Entities. Die Bilder liegen im Repo unter dist/ und werden von HACS nach
 * www/community/tomtut-pool-cards/ kopiert.
 */

import { TomtutPoolDashboardCard } from "./dashboard-card.js";
import { TomtutPoolDashboardEditor } from "./editor/dashboard-editor.js";

window.customCards = window.customCards || [];
window.customCards.push({
  type: "tomtut-pool-dashboard",
  name: "TomTuT Pool Dashboard",
  description:
    "Pool-Becken mit Live-Werten plus Kästen für Wärmepumpe, Poolpumpe und eigene Werte — beliebige Entities, keine Integration nötig",
  preview: true,
  documentationURL: "https://github.com/TomTuTHub/tomtut-pool-cards",
});

export { TomtutPoolDashboardCard, TomtutPoolDashboardEditor };

/* Für den Smoke-Test (und alles, was gegen das Bundle prüfen will) */
export { PUMP_DEFAULTS, fanDuration, stageFromWatt } from "./slots/pump.js";
export { HEATPUMP_DEFAULTS, HP_MODES, MODE_FARBEN, modeFromState } from "./slots/heatpump.js";
export { FAN_DESIGNS, FAN_DESIGN_DEFAULT } from "./shared/slot-base.js";
export { UV_DEFAULTS } from "./slots/uv.js";
export {
  passFaktor,
  normGrad,
  bildTransform,
  groesseFaktor,
  GROESSE_MIN,
  GROESSE_MAX,
} from "./shared/bild.js";
export { SOLAR_DEFAULTS } from "./slots/solar.js";
export { HERO_DEFAULTS, heroDefaultsFor, INLET_TEMP_VERSATZ } from "./hero.js";
export {
  SHAPES,
  HERO_SPRITES,
  DEVICE_IMAGES,
  DEVICE_VARIANTS,
  DEVICE_RATIOS,
  FLOW_MARKERS,
  SLOT_TYPES,
  SLOT_TYPE_GROUPS,
  SLOT_GRAU,
  BLOCK_FARBEN,
  slotFarbe,
  slotTypeOptions,
} from "./shared/assets.js";
export { numText, numOf, toWatt } from "./shared/util.js";
export { applyPatch } from "./editor/dashboard-editor.js";
