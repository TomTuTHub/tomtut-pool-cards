import { LitElement, html, nothing } from "lit";
import { Fields, editorStyles } from "../shared/fields.js";
import { loadHaElements } from "../shared/ha-elements.js";
import { DEFAULT_SHAPE, SLOT_TYPES, slotFarbe, slotTypeOptions } from "../shared/assets.js";
import { HEATPUMP_DEFAULTS } from "../slots/heatpump.js";
import { PUMP_DEFAULTS } from "../slots/pump.js";
import { UV_DEFAULTS } from "../slots/uv.js";
import { SOLAR_DEFAULTS } from "../slots/solar.js";
import { heroDefaultsFor } from "../hero.js";
import {
  heroFields,
  heatpumpFields,
  pumpFields,
  uvFields,
  solarFields,
  customFields,
  customEntryFields,
  frameFields,
} from "./slot-fields.js";

/*
 * Visueller Editor in drei Schritten:
 *   1. Becken   — Form + Werte auf dem Becken
 *   2. Geräte   — Slots anlegen, sortieren, Typ wählen; danach erst wählen,
 *                 welche Elemente das Gerät hat, und dann deren Felder
 *   3. Optik    — Rahmen und Füllung (gilt für alle Slots gleich)
 *
 * YAML bleibt jederzeit möglich, ist aber nie nötig.
 */
const SLOT_DEFAULTS = {
  heatpump: HEATPUMP_DEFAULTS,
  pump: PUMP_DEFAULTS,
  uv: UV_DEFAULTS,
  solar: SOLAR_DEFAULTS,
};

/* Patch anwenden; ein Wert `undefined` entfernt den Schlüssel aus der Config */
export const applyPatch = (base, patch) => {
  const next = { ...(base || {}) };
  for (const [k, v] of Object.entries(patch || {})) {
    if (v === undefined) delete next[k];
    else next[k] = v;
  }
  return next;
};

export class TomtutPoolDashboardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  constructor() {
    super();
    /* Merkt abgewählte Felder, damit Wiedereinschalten sie zurückbringt */
    this._stash = {};
  }

  connectedCallback() {
    super.connectedCallback();
    /* ha-entity-picker / ha-icon-picker nachladen und danach neu zeichnen */
    loadHaElements().then((ok) => {
      if (ok) this.requestUpdate();
    });
  }

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
    this._emit({ ...this._config, hero: applyPatch(this._config.hero, patch) });
  }

  _updateFrame(patch) {
    this._emit({ ...this._config, frame: applyPatch(this._config.frame, patch) });
  }

  _slots() {
    return Array.isArray(this._config?.slots) ? this._config.slots : [];
  }

  _updateSlot(index, patch) {
    const slots = this._slots().map((s, i) => (i === index ? applyPatch(s, patch) : s));
    this._emit({ ...this._config, slots });
  }

  _updateEntry(slotIndex, entryIndex, patch) {
    const slot = this._slots()[slotIndex] || {};
    const entries = Array.isArray(slot.entries) ? [...slot.entries] : [];
    while (entries.length <= entryIndex) entries.push({});
    entries[entryIndex] = applyPatch(entries[entryIndex], patch);
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
      stash: this._stash,
    });
  }

  /*
   * Trägt eine bestehende Config einen Typ, den es nicht mehr zu wählen gibt
   * (seit Iteration 6: `inlet`), bekommt er trotzdem seinen eigenen Eintrag —
   * sonst stünde im Auswahlfeld etwas anderes, als in der Config steht.
   * Sobald umgestellt wird, ist der Eintrag weg.
   */
  _altTypOption(type) {
    const meta = SLOT_TYPES[type];
    if (!meta || meta.waehlbar !== false) return nothing;
    return html`<option value="${type}" selected>${meta.label}</option>`;
  }

  /*
   * Überschrift eines Slot-Blocks: "Kasten 3 · Poolpumpe · Filterpumpe".
   * Der dritte Teil ist die Beschriftung, die der Slot selbst trägt — je
   * nach Typ heißt das Feld `label`, `label_text` oder `title`. Fehlt sie,
   * bleibt der Teil weg statt ein leeres " · " zu hinterlassen.
   */
  _slotKopf(slot, index) {
    const typ = SLOT_TYPES[slot?.type]?.label || SLOT_TYPES.frame.label;
    const name = String(slot?.label || slot?.label_text || slot?.title || "").trim();
    return `Kasten ${index + 1} · ${typ}${name ? ` · ${name}` : ""}`;
  }

  _slotBody(index) {
    const slot = this._slots()[index] || {};
    const f = this._fieldsFor(index);
    switch (slot.type) {
      case "heatpump":
        return heatpumpFields(f);
      case "pump":
        return pumpFields(f);
      case "uv":
        return uvFields(f);
      case "solar":
        return solarFields(f);
      case "custom":
        return customFields(f, (entryIndex) =>
          customEntryFields(
            new Fields({
              hass: this.hass,
              config: (Array.isArray(slot.entries) ? slot.entries : [])[entryIndex] || {},
              update: (patch) => this._updateEntry(index, entryIndex, patch),
              idPrefix: `slot${index}e${entryIndex}`,
              stash: this._stash,
            })
          )
        );
      case "hidden":
        return html`<small>Dieser Slot wird nicht angezeigt; die anderen rücken nach.</small>`;
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
      /* Die Anker der gewählten Beckenform sind die Defaults — sonst stehen
         die Regler links, obwohl das Overlay richtig sitzt. */
      defaults: heroDefaultsFor(hero.shape),
      update: (patch) => this._updateHero(patch),
      idPrefix: "hero",
      stash: this._stash,
    });
    const frameF = new Fields({
      hass: this.hass,
      config: frame,
      update: (patch) => this._updateFrame(patch),
      idPrefix: "frame",
      stash: this._stash,
    });
    const slots = this._slots();

    return html`
      <div class="editor">
        <div class="step-head">Schritt 1 — Becken</div>
        ${heroF.toggle("Becken anzeigen", "enabled", true)}
        ${hero.enabled === false ? nothing : heroFields(heroF)}

        <div class="step-head">Schritt 2 — Geräte</div>
        ${slots.map(
          (slot, i) => html`
            <div class="slot-block" style="--slot-farbe:${slotFarbe(slot.type)};">
              <div class="slot-ueberschrift">${this._slotKopf(slot, i)}</div>
              <div class="slot-card">
                <div class="slot-head">
                  <div class="row">
                    <span class="row-label">Typ</span>
                    <select
                      data-key="type"
                      @change="${(e) => this._updateSlot(i, { type: e.target.value })}"
                    >
                      ${this._altTypOption(slot.type)}
                      ${slotTypeOptions().map((o) =>
                        o.trenner
                          ? html`<option disabled data-trenner>${o.label}</option>`
                          : html`
                              <option
                                value="${o.value}"
                                ?selected="${(slot.type || "frame") === o.value}"
                              >
                                ${o.label}
                              </option>
                            `
                      )}
                    </select>
                  </div>
                  <button
                    class="icon-btn"
                    title="nach oben"
                    @click="${() => this._moveSlot(i, -1)}"
                  >
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
            </div>
          `
        )}
        <button class="add-btn" @click="${() => this._addSlot()}">+ Slot hinzufügen</button>

        <div class="step-head">Schritt 3 — Optik</div>
        ${frameF.toggle("Rahmen um die Slots", "enabled", true)}
        ${frameF.select(
          "Füllung",
          "fill",
          [
            ["transparent", "Transparent (Theme)"],
            ["weiss", "Weiß"],
            ["schwarz", "Schwarz"],
          ],
          "transparent"
        )}
        <small>
          Die Füllung gilt für den ganzen Kasten: Hintergrund, Bild, Kästchen, Buttons und
          Schriftfarbe. Transparent nimmt den Hintergrund des HA-Themes.
        </small>
      </div>
    `;
  }

  static styles = [editorStyles];
}

customElements.define("tomtut-pool-dashboard-editor", TomtutPoolDashboardEditor);
