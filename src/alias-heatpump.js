import { TomtutPoolDashboardCard, CONFIG_VERSION } from "./dashboard-card.js";
import { heatpumpHasEntity } from "./slots/heatpump.js";

/*
 * custom:tomtut-pool-heatpump-card — duenner Alias auf das Dashboard.
 *
 * Er nimmt die Konfiguration der bisherigen Einzel-Card 1:1 an (gleiche
 * Feldnamen) und rendert daraus ein Dashboard ohne Hero und ohne Rahmen mit
 * genau einem heatpump-Slot. Bestehende YAML laeuft damit unveraendert weiter;
 * neu ist nur das Artwork.
 */
export class TomtutPoolHeatpumpCard extends TomtutPoolDashboardCard {
  setConfig(config) {
    if (!config || typeof config !== "object") throw new Error("Ungueltige Konfiguration");
    if (!heatpumpHasEntity(config)) {
      throw new Error(
        "Mindestens eine Entity noetig: switch_entity, power_entity, target_entity oder current_entity"
      );
    }
    /* `type` gehoert zur Lovelace-Card, nicht in die Slot-Config */
    const { type, ...rest } = config;
    this._aliasConfig = { ...config };
    super.setConfig({
      version: CONFIG_VERSION,
      hero: { enabled: false },
      frame: { enabled: false, fill: "transparent" },
      slots: [{ type: "heatpump", ...rest }],
    });
  }

  static getConfigElement() {
    return document.createElement("tomtut-pool-heatpump-card-editor");
  }

  static getStubConfig() {
    return {
      image_variant: "transparent",
      switch_entity: "",
      power_entity: "",
      target_entity: "",
      current_entity: "",
      label_text: "Pool-Waermepumpe",
    };
  }

  getCardSize() {
    return 6;
  }
}

customElements.define("tomtut-pool-heatpump-card", TomtutPoolHeatpumpCard);
