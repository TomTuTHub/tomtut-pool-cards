import { LitElement, html, css, nothing } from "lit";
import "./hero.js";
import "./slots/heatpump.js";
import "./slots/pump.js";
import "./slots/custom.js";
import "./slots/placeholder.js";
import { SLOT_TYPES, DEFAULT_SHAPE } from "./shared/assets.js";

/*
 * custom:tomtut-pool-dashboard — die EINE Card der Sammlung.
 *
 * Aufbau: Hero (Becken) + beliebig viele Slots. Die Card darf mehrfach im
 * Dashboard liegen (einmal "alles", einmal "nur Waermepumpe" …). Was der
 * Nutzer nicht hat, waehlt er einfach ab.
 *
 * Update-Sicherheit: die Config traegt `version: 1`. Neue Optionen sind immer
 * optional mit Default, bestehende Schluessel werden nie umbenannt oder
 * entfernt. Ein eingefrorenes v1-Beispiel liegt in test/fixtures/v1-config.yaml
 * und muss in jeder kuenftigen Version identisch rendern.
 */
export const CONFIG_VERSION = 1;

export const DEFAULT_FRAME = { enabled: true, fill: "transparent" };

/* Slot-Typen mit eigenem Modul; alles andere landet beim Rahmen-Platzhalter */
const SLOT_TAGS = {
  heatpump: "tomtut-pool-slot-heatpump",
  pump: "tomtut-pool-slot-pump",
  custom: "tomtut-pool-slot-custom",
  frame: "tomtut-pool-slot-frame",
};

export const slotTagFor = (type) => SLOT_TAGS[type] || "tomtut-pool-slot-frame";

export class TomtutPoolDashboardCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  setConfig(config) {
    if (!config || typeof config !== "object") throw new Error("Ungueltige Konfiguration");
    if (config.slots !== undefined && !Array.isArray(config.slots)) {
      throw new Error("`slots` muss eine Liste sein");
    }
    if (config.hero !== undefined && (typeof config.hero !== "object" || Array.isArray(config.hero))) {
      throw new Error("`hero` muss ein Objekt sein");
    }
    if (config.version !== undefined && Number(config.version) !== CONFIG_VERSION) {
      throw new Error(
        `Unbekannte Config-Version ${config.version} — diese Card kennt Version ${CONFIG_VERSION}`
      );
    }
    this._config = {
      version: CONFIG_VERSION,
      ...config,
      hero: { enabled: true, shape: DEFAULT_SHAPE, ...(config.hero || {}) },
      frame: { ...DEFAULT_FRAME, ...(config.frame || {}) },
      slots: Array.isArray(config.slots) ? config.slots : [],
    };
  }

  static getConfigElement() {
    return document.createElement("tomtut-pool-dashboard-editor");
  }

  static getStubConfig() {
    return {
      version: CONFIG_VERSION,
      hero: { enabled: true, shape: DEFAULT_SHAPE },
      frame: { enabled: true, fill: "transparent" },
      slots: [],
    };
  }

  getCardSize() {
    const c = this._config || {};
    const slots = (c.slots || []).filter((s) => (s?.type || "frame") !== "hidden");
    return (c.hero?.enabled === false ? 0 : 6) + Math.ceil(slots.length / 3) * 5 || 3;
  }

  get visibleSlots() {
    return (this._config?.slots || [])
      .map((s) => ({ ...(s || {}), type: String(s?.type || "frame").toLowerCase() }))
      .filter((s) => s.type !== "hidden");
  }

  render() {
    if (!this._config) return nothing;
    const c = this._config;
    const heroOn = c.hero?.enabled !== false;
    const slots = this.visibleSlots;

    return html`
      <ha-card>
        <div class="wrap">
          <div class="grid">
            ${heroOn
              ? html`<tomtut-pool-hero
                  class="hero"
                  .hass="${this.hass}"
                  .config="${c.hero}"
                  .frame="${c.frame}"
                ></tomtut-pool-hero>`
              : nothing}
            ${slots.map((slot) => this._renderSlot(slot))}
          </div>
        </div>
      </ha-card>
    `;
  }

  /*
   * Jeder Slot-Typ bekommt ein eigenes Template — nicht per createElement,
   * damit Lit die Elemente ueber Renders hinweg wiederverwendet und der
   * Slot-Zustand (Bestaetigungsdialog, optimistische Stufe) erhalten bleibt.
   */
  _renderSlot(slot) {
    const frame = this._config.frame;
    const type = SLOT_TYPES[slot.type]?.ready ? slot.type : "frame";
    switch (type) {
      case "heatpump":
        return html`<tomtut-pool-slot-heatpump
          .hass="${this.hass}"
          .config="${slot}"
          .frame="${frame}"
        ></tomtut-pool-slot-heatpump>`;
      case "pump":
        return html`<tomtut-pool-slot-pump
          .hass="${this.hass}"
          .config="${slot}"
          .frame="${frame}"
        ></tomtut-pool-slot-pump>`;
      case "custom":
        return html`<tomtut-pool-slot-custom
          .hass="${this.hass}"
          .config="${slot}"
          .frame="${frame}"
        ></tomtut-pool-slot-custom>`;
      default:
        return html`<tomtut-pool-slot-frame
          .hass="${this.hass}"
          .config="${slot}"
          .frame="${frame}"
          .slotType="${slot.type}"
        ></tomtut-pool-slot-frame>`;
    }
  }

  static styles = css`
    ha-card {
      background: transparent;
      border: none;
      box-shadow: none;
      padding: 0;
      overflow: visible;
    }
    /* Container-Queries statt Media-Queries: es zaehlt die Breite der Card,
       nicht die des Fensters — sonst bricht das Raster in Sections-Views. */
    .wrap {
      container-type: inline-size;
      width: 100%;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 14px;
      align-items: stretch;
    }
    @container (min-width: 620px) {
      .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .hero {
        grid-column: span 2;
      }
    }
    @container (min-width: 980px) {
      .grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
      .hero {
        grid-column: span 2;
      }
    }
  `;
}

customElements.define("tomtut-pool-dashboard", TomtutPoolDashboardCard);
