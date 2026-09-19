/*!
 * tomtut-pool-cards.js — Lovelace-Sammlung für Pool-Dashboards
 *
 * Enthält zwei Card-Typen aus einem Bundle:
 *   custom:tomtut-pool-dashboard      — Becken-Hero + frei bestückbare Geräte-Slots
 *   custom:tomtut-pool-heatpump-card  — Alias für bestehende Wärmepumpen-Karten
 *
 * Keine Integration nötig: alle Werte kommen aus frei konfigurierbaren
 * Entities. Die Bilder liegen im Repo unter dist/ und werden von HACS nach
 * www/community/tomtut-pool-cards/ kopiert.
 */

import { TomtutPoolDashboardCard } from "./dashboard-card.js";
import { TomtutPoolHeatpumpCard } from "./alias-heatpump.js";
import {
  TomtutPoolDashboardEditor,
  TomtutPoolHeatpumpCardEditor,
} from "./editor/dashboard-editor.js";

window.customCards = window.customCards || [];
window.customCards.push(
  {
    type: "tomtut-pool-dashboard",
    name: "TomTuT Pool Dashboard",
    description:
      "Pool-Becken mit Live-Werten plus Kästen für Wärmepumpe, Poolpumpe und eigene Werte — beliebige Entities, keine Integration nötig",
    preview: true,
    documentationURL: "https://github.com/TomTuTHub/tomtut-pool-cards",
  },
  {
    type: "tomtut-pool-heatpump-card",
    name: "TomTuT Pool Heatpump",
    description:
      "Generische Card für Pool-Wärmepumpen: Soll-/Ist-Temperatur, Stromverbrauch, Powerbutton mit Rückfrage und animierter Lüfter",
    preview: true,
    documentationURL: "https://github.com/TomTuTHub/tomtut-pool-cards",
  }
);

export {
  TomtutPoolDashboardCard,
  TomtutPoolHeatpumpCard,
  TomtutPoolDashboardEditor,
  TomtutPoolHeatpumpCardEditor,
};

/* Für den Smoke-Test (und alles, was gegen das Bundle prüfen will) */
export { PUMP_DEFAULTS, fanDuration } from "./slots/pump.js";
export { HEATPUMP_DEFAULTS } from "./slots/heatpump.js";
export { HERO_DEFAULTS, heroDefaultsFor } from "./hero.js";
export { SHAPES, DEVICE_IMAGES, SLOT_TYPES } from "./shared/assets.js";
export { numText, numOf, toWatt } from "./shared/util.js";
export { applyPatch } from "./editor/dashboard-editor.js";
