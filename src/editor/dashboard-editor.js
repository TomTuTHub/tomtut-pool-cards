import { LitElement, html, nothing } from "lit";
import { Fields, editorStyles } from "../shared/fields.js";
import { SLOT_TYPES, DEFAULT_SHAPE } from "../shared/assets.js";
import { HEATPUMP_DEFAULTS } from "../slots/heatpump.js";
import { PUMP_DEFAULTS } from "../slots/pump.js";
import { HERO_DEFAULTS } from "../hero.js";
import {
  heroFields,
  heatpumpFields,
  pumpFields,
  customFields,
  customEntryFields,
  frameFields,
} from "./slot-fields.js";

/*
 * Visueller Editor in drei Schritten:
 *   1. Becken   — Form + Werte auf dem Becken
 *   2. Geraete  — Slots anlegen, sortieren, Typ waehlen; danach nur noch die
 *                 Felder dieses Typs
 *   3. Optik    — Rahmen und Fuellung (gilt fuer alle Slots gleich)
 *
 * YAML bleibt jederzeit moeglich, ist aber nie noetig.
 */
const SLOT_DEFAULTS = {
  heatpump: HEATPUMP_DEFAULTS,
  pump: PUMP_DEFAULTS,
};

export class TomtutPoolDashboardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  setConfig(config) {
    this._config = {
      version: 1,
      hero: { enabled: true, shape: DEFAULT_SHAPE },
      frame: { enabled: true, fill: "transparent" },
      slots: [],
      ...(config || {}),
    };
  }

  _emit(next) {
    this._config = next;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: next } }));
  }

  _updateHero(patch) {
    this._emit({ ...this._config, hero: { ...(this._config.hero || {}), ...patch } });
  }

  _updateFrame(patch) {
    this._emit({ ...this._config, frame: { ...(this._config.frame || {}), ...patch } });
  }

  _slots() {
    return Array.isArray(this._config?.slots) ? this._config.slots : [];
  }

  _updateSlot(index, patch) {
    const slots = this._slots().map((s, i) => (i === index ? { ...s, ...patch } : s));
    this._emit({ ...this._config, slots });
  }

  _updateEntry(slotIndex, entryIndex, patch) {
    const slot = this._slots()[slotIndex] || {};
    const entries = Array.isArray(slot.entries) ? [...slot.entries] : [];
    while (entries.length <= entryIndex) entries.push({});
    entries[entryIndex] = { ...entries[entryIndex], ...patch };
    this._updateSlot(slotIndex, { entries });
  }

  _addSlot() {
    this._emit({ ...this._config, slots: [...this._slots(), { type: "frame" }] });
  }

  _removeSlot(index) {
    this._emit({ ...this._config, slots: this._slots().filter((_, i) => i !== index) });
  }

  _moveSlot(index, delta) {
    const slots = [...this._slots()];
    const to = index + delta;
    if (to < 0 || to >= slots.length) return;
    const [item] = slots.splice(index, 1);
    slots.splice(to, 0, item);
    this._emit({ ...this._config, slots });
  }

  _fieldsFor(index) {
    const slot = this._slots()[index] || {};
    return new Fields({
      hass: this.hass,
      config: slot,
      defaults: SLOT_DEFAULTS[slot.type] || {},
      update: (patch) => this._updateSlot(index, patch),
      idPrefix: `slot${index}`,
    });
  }

  _slotBody(index) {
    const slot = this._slots()[index] || {};
    const f = this._fieldsFor(index);
    switch (slot.type) {
      case "heatpump":
        return heatpumpFields(f);
      case "pump":
        return pumpFields(f);
      case "custom":
        return customFields(f, (entryIndex) =>
          customEntryFields(
            new Fields({
              hass: this.hass,
              config: (Array.isArray(slot.entries) ? slot.entries : [])[entryIndex] || {},
              update: (patch) => this._updateEntry(index, entryIndex, patch),
              idPrefix: `slot${index}e${entryIndex}`,
            })
          )
        );
      case "hidden":
        return html`<small>Dieser Slot wird nicht angezeigt; die anderen ruecken nach.</small>`;
      default:
        return frameFields(f);
    }
  }

  render() {
    if (!this._config) return nothing;
    const hero = this._config.hero || {};
    const frame = this._config.frame || {};
    const heroF = new Fields({
      hass: this.hass,
      config: hero,
      defaults: HERO_DEFAULTS,
      update: (patch) => this._updateHero(patch),
      idPrefix: "hero",
    });
    const frameF = new Fields({
      hass: this.hass,
      config: frame,
      update: (patch) => this._updateFrame(patch),
      idPrefix: "frame",
    });
    const slots = this._slots();

    return html`
      <div class="editor">
        <div class="step-head">Schritt 1 — Becken</div>
        ${heroF.toggle("Becken anzeigen", "enabled", true)}
        ${hero.enabled === false ? nothing : heroFields(heroF)}

        <div class="step-head">Schritt 2 — Geraete</div>
        ${slots.map(
          (slot, i) => html`
            <div class="slot-card">
              <div class="slot-head">
                <div class="row">
                  <span class="row-label">Slot ${i + 1}</span>
                  <select
                    data-key="type"
                    @change="${(e) => this._updateSlot(i, { type: e.target.value })}"
                  >
                    ${Object.entries(SLOT_TYPES).map(
                      ([key, meta]) => html`
                        <option value="${key}" ?selected="${(slot.type || "frame") === key}">
                          ${meta.label}${meta.ready === false ? " (folgt)" : ""}
                        </option>
                      `
                    )}
                  </select>
                </div>
                <button class="icon-btn" title="nach oben" @click="${() => this._moveSlot(i, -1)}">
                  ↑
                </button>
                <button class="icon-btn" title="nach unten" @click="${() => this._moveSlot(i, 1)}">
                  ↓
                </button>
                <button
                  class="icon-btn danger"
                  title="entfernen"
                  @click="${() => this._removeSlot(i)}"
                >
                  ✕
                </button>
              </div>
              ${this._slotBody(i)}
            </div>
          `
        )}
        <button class="add-btn" @click="${() => this._addSlot()}">+ Slot hinzufuegen</button>

        <div class="step-head">Schritt 3 — Optik</div>
        ${frameF.toggle("Rahmen um die Slots", "enabled", true)}
        ${frameF.select(
          "Fuellung",
          "fill",
          [
            ["transparent", "Transparent"],
            ["weiss", "Weiß"],
            ["schwarz", "Schwarz"],
          ],
          "transparent"
        )}
        <small>Die Schriftfarbe folgt der Fuellung automatisch.</small>
      </div>
    `;
  }

  static styles = [editorStyles];
}

customElements.define("tomtut-pool-dashboard-editor", TomtutPoolDashboardEditor);

/* ---------------------------------------------------------------- */

/*
 * Editor des Alias custom:tomtut-pool-heatpump-card — arbeitet direkt auf der
 * flachen Alt-Config, damit bestehende Karten unveraendert bearbeitbar bleiben.
 */
export class TomtutPoolHeatpumpCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  setConfig(config) {
    this._config = { ...(config || {}) };
  }

  _update(patch) {
    const next = { ...this._config, ...patch };
    this._config = next;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: next } }));
  }

  render() {
    if (!this._config) return nothing;
    const f = new Fields({
      hass: this.hass,
      config: this._config,
      defaults: HEATPUMP_DEFAULTS,
      update: (patch) => this._update(patch),
      idPrefix: "hp",
    });
    return html`<div class="editor">${heatpumpFields(f)}</div>`;
  }

  static styles = [editorStyles];
}

customElements.define("tomtut-pool-heatpump-card-editor", TomtutPoolHeatpumpCardEditor);
