/*!
 * tomtut-pool-cards.js — Lovelace-Sammlung fuer Pool-Dashboards
 *
 * Enthaelt zwei Card-Typen aus einem Bundle:
 *   custom:tomtut-pool-dashboard      — Becken-Hero + frei bestueckbare Geraete-Slots
 *   custom:tomtut-pool-heatpump-card  — Alias fuer bestehende Waermepumpen-Karten
 *
 * Keine Integration noetig: alle Werte kommen aus frei konfigurierbaren
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
      "Pool-Becken mit Live-Werten plus Kaesten fuer Waermepumpe, Poolpumpe und eigene Werte — beliebige Entities, keine Integration noetig",
    preview: true,
    documentationURL: "https://github.com/TomTuTHub/tomtut-pool-cards",
  },
  {
    type: "tomtut-pool-heatpump-card",
    name: "TomTuT Pool Heatpump",
    description:
      "Generische Card fuer Pool-Waermepumpen: Soll-/Ist-Temperatur, Stromverbrauch, Powerbutton mit Rueckfrage und animierter Luefter",
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
