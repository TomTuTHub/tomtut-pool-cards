import { LitElement, html, css, nothing } from "lit";
import "./hero.js";
import { kioskGilt, KIOSK_BECKEN } from "./shared/kiosk.js";
import "./slots/heatpump.js";
import "./slots/pump.js";
import "./slots/uv.js";
import "./slots/solar.js";
import "./slots/custom.js";
import "./slots/placeholder.js";
import { SLOT_TYPES, DEFAULT_SHAPE } from "./shared/assets.js";
import { fillTokens } from "./shared/styles.js";
import { renderMini, miniStyles, ansichtVon, MINI_TYPEN } from "./mini.js";

/*
 * custom:tomtut-pool-dashboard — die EINE Card der Sammlung.
 *
 * Aufbau: Hero (Becken) + beliebig viele Slots. Die Card darf mehrfach im
 * Dashboard liegen (einmal "alles", einmal "nur Wärmepumpe" …). Was der
 * Nutzer nicht hat, wählt er einfach ab.
 *
 * Update-Sicherheit: die Config trägt `version: 1`. Neue Optionen sind immer
 * optional mit Default, bestehende Schlüssel werden nie umbenannt oder
 * entfernt. Ein eingefrorenes v1-Beispiel liegt in test/fixtures/v1-config.yaml
 * und muss in jeder künftigen Version identisch rendern. Abgeschaffte Felder
 * (image_variant, image_url, *_color, box_color, fan_dur_*) werden ignoriert,
 * nie abgelehnt.
 */
export const CONFIG_VERSION = 1;

export const DEFAULT_FRAME = { enabled: true, fill: "transparent" };

/* Slot-Typen mit eigenem Modul; alles andere landet beim Rahmen-Platzhalter */
const SLOT_TAGS = {
  heatpump: "tomtut-pool-slot-heatpump",
  pump: "tomtut-pool-slot-pump",
  uv: "tomtut-pool-slot-uv",
  solar: "tomtut-pool-slot-solar",
  custom: "tomtut-pool-slot-custom",
  frame: "tomtut-pool-slot-frame",
};

export const slotTagFor = (type) => SLOT_TAGS[type] || "tomtut-pool-slot-frame";

export class TomtutPoolDashboardCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    /* Mini-Ansicht: welcher Kasten gerade als Dialog offen ist
       (null = keiner, "becken" oder die Kasten-Nummer 1..n) */
    _miniOffen: { state: true },
  };

  constructor() {
    super();
    this._miniOffen = null;
  }

  setConfig(config) {
    if (!config || typeof config !== "object") throw new Error("Ungültige Konfiguration");
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
    /* neue Config (Editor-Vorschau) = kein alter Dialog mehr */
    this._miniOffen = null;
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
    if (ansichtVon(c) === "mini") {
      const n = (c.slots || []).filter((s) => MINI_TYPEN.includes(String(s?.type || "").toLowerCase())).length;
      return (c.hero?.enabled === false ? 0 : 3) + (n ? 2 : 0) || 2;
    }
    const slots = (c.slots || []).filter((s) => (s?.type || "frame") !== "hidden");
    return (c.hero?.enabled === false ? 0 : 6) + Math.ceil(slots.length / 3) * 5 || 3;
  }

  get visibleSlots() {
    return (this._config?.slots || [])
      .map((s) => ({ ...(s || {}), type: String(s?.type || "frame").toLowerCase() }))
      .filter((s) => s.type !== "hidden");
  }

  /* Sichtbare Slots samt Kasten-Nummer (1..n über ALLE Slots, wie im
     Editor) — die braucht kiosk_slots. */
  get _slotsMitNummer() {
    return (this._config?.slots || [])
      .map((s, i) => ({ slot: { ...(s || {}), type: String(s?.type || "frame").toLowerCase() }, nr: i + 1 }))
      .filter(({ slot }) => slot.type !== "hidden");
  }

  /* ---- Mini-Ansicht (Iteration 17, src/mini.js) ---- */

  _miniOeffnen(key) {
    this._miniOffen = key;
  }

  _miniZu() {
    if (this._miniOffen !== null) this._miniOffen = null;
  }

  /* Tipp daneben: der Klick landet auf dem <dialog> selbst (Backdrop) */
  _miniBackdrop(ev) {
    if (ev?.target === ev?.currentTarget) this._miniZu();
  }

  /*
   * showModal() hebt den Dialog in den Top-Layer (über die HA-Kopfleiste,
   * ohne z-index). Ohne die Methode (sehr alte Browser, jsdom) bleibt er
   * ein normales offenes <dialog>.
   */
  updated(changed) {
    super.updated?.(changed);
    const d = this.renderRoot?.querySelector?.("dialog.m-dialog");
    if (!d || d.open) return;
    try {
      if (typeof d.showModal === "function") d.showModal();
      else d.setAttribute("open", "");
    } catch (err) {
      console.warn("tomtut-pool-cards: Dialog ohne showModal —", err?.message || err);
      d.setAttribute("open", "");
    }
  }

  render() {
    if (!this._config) return nothing;
    const c = this._config;
    if (ansichtVon(c) === "mini") return renderMini(this);
    const heroOn = c.hero?.enabled !== false;

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
                  .kiosk="${kioskGilt(c, KIOSK_BECKEN)}"
                ></tomtut-pool-hero>`
              : nothing}
            ${this._slotsMitNummer.map(({ slot, nr }) =>
              this._renderSlot(slot, kioskGilt(c, nr))
            )}
          </div>
        </div>
      </ha-card>
    `;
  }

  /*
   * Jeder Slot-Typ bekommt ein eigenes Template — nicht per createElement,
   * damit Lit die Elemente über Renders hinweg wiederverwendet und der
   * Slot-Zustand (Bestätigungsdialog, optimistische Stufe) erhalten bleibt.
   */
  _renderSlot(slot, kiosk = false) {
    const frame = this._config.frame;
    const type = SLOT_TYPES[slot.type]?.ready ? slot.type : "frame";
    switch (type) {
      case "heatpump":
        return html`<tomtut-pool-slot-heatpump
          .hass="${this.hass}"
          .config="${slot}"
          .frame="${frame}"
          .kiosk="${kiosk}"
        ></tomtut-pool-slot-heatpump>`;
      case "pump":
        return html`<tomtut-pool-slot-pump
          .hass="${this.hass}"
          .config="${slot}"
          .frame="${frame}"
          .kiosk="${kiosk}"
        ></tomtut-pool-slot-pump>`;
      case "uv":
        return html`<tomtut-pool-slot-uv
          .hass="${this.hass}"
          .config="${slot}"
          .frame="${frame}"
          .kiosk="${kiosk}"
        ></tomtut-pool-slot-uv>`;
      case "solar":
        return html`<tomtut-pool-slot-solar
          .hass="${this.hass}"
          .config="${slot}"
          .frame="${frame}"
          .kiosk="${kiosk}"
        ></tomtut-pool-slot-solar>`;
      case "custom":
        return html`<tomtut-pool-slot-custom
          .hass="${this.hass}"
          .config="${slot}"
          .frame="${frame}"
          .kiosk="${kiosk}"
        ></tomtut-pool-slot-custom>`;
      default:
        return html`<tomtut-pool-slot-frame
          .hass="${this.hass}"
          .config="${slot}"
          .frame="${frame}"
          .kiosk="${kiosk}"
          .slotType="${slot.type}"
        ></tomtut-pool-slot-frame>`;
    }
  }

  static styles = [
    css`
    /*
     * Der aeussere Riegel gegen das Durchschlagen in die HA-Oberflaeche:
     * Host und ha-card bilden je einen eigenen Stacking-Context. Alles,
     * was in den Slots an z-index vergeben wird (1-10, s. shared/styles.js),
     * bleibt damit innerhalb der Card — beim Scrollen verschwindet sie unter
     * der Kopfleiste, statt darueber zu liegen.
     */
    :host {
      display: block;
      position: relative;
      isolation: isolate;
      z-index: 0;
    }
    ha-card {
      background: transparent;
      border: none;
      box-shadow: none;
      padding: 0;
      overflow: visible;
      position: relative;
      isolation: isolate;
      z-index: 0;
    }
    /* Container-Queries statt Media-Queries: es zählt die Breite der Card,
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
  `,
    fillTokens,
    miniStyles,
  ];
}

customElements.define("tomtut-pool-dashboard", TomtutPoolDashboardCard);
