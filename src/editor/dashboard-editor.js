import { LitElement, html, nothing } from "lit";
import { Fields, editorStyles } from "../shared/fields.js";
import { loadHaElements } from "../shared/ha-elements.js";
import { DEFAULT_SHAPE, SLOT_TYPES, slotFarbe, slotTypeOptions } from "../shared/assets.js";
import { HEATPUMP_DEFAULTS } from "../slots/heatpump.js";
import { PUMP_DEFAULTS } from "../slots/pump.js";
import { UV_DEFAULTS } from "../slots/uv.js";
import { SOLAR_DEFAULTS } from "../slots/solar.js";
import { heroDefaultsFor, teilLage } from "../hero.js";
import { HERO_SPRITES } from "../shared/assets.js";
import { kioskSchluessel, kioskGilt, KIOSK_BECKEN } from "../shared/kiosk.js";
import { ansichtVon, miniWahl, MINI_TYPEN, MINI_KACHEL_FILLS, miniKachelFill, MINI_CARD_FILLS, miniCardFill } from "../mini.js";
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
    _teilePos: { state: true },
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

  /* ---- Ansicht Voll / Mini (Iteration 17) ---- */

  _setAnsicht(ansicht) {
    /* voll = Default: Schlüssel raus, die Config bleibt schlank */
    if (ansichtVon(this._config) === ansicht) return;
    this._emit(applyPatch(this._config, { view: ansicht === "mini" ? "mini" : undefined }));
  }

  _renderAnsicht() {
    const mini = ansichtVon(this._config) === "mini";
    const knopf = (wert, text) => html`<button
      type="button"
      class="ansicht-knopf ${(wert === "mini") === mini ? "aktiv" : ""}"
      data-ansicht="${wert}"
      aria-pressed="${(wert === "mini") === mini ? "true" : "false"}"
      @click="${() => this._setAnsicht(wert)}"
    >
      ${text}
    </button>`;
    return html`
      <div class="ansicht-block ${mini ? "mini" : ""}">
        <span class="ansicht-titel">Ansicht</span>
        <div class="ansicht-wahl" role="group" aria-label="Ansicht">
          ${knopf("voll", "Voll")} ${knopf("mini", "Mini")}
        </div>
        ${mini
          ? html`<div class="row">
              <span class="row-label">Kachel-Hintergrund</span>
              <select
                data-key="mini_tile_fill"
                @change="${(e) =>
                  this._emit(
                    applyPatch(this._config, {
                      mini_tile_fill: e.target.value === "schwarz" ? undefined : e.target.value,
                    })
                  )}"
              >
                ${MINI_KACHEL_FILLS.map(
                  ([v, t]) => html`<option value="${v}" ?selected="${miniKachelFill(this._config) === v}">${t}</option>`
                )}
              </select>
            </div>
            <div class="row">
              <span class="row-label">Außen-Hintergrund</span>
              <select
                data-key="mini_card_fill"
                @change="${(e) =>
                  this._emit(
                    applyPatch(this._config, {
                      mini_card_fill: e.target.value === "theme" ? undefined : e.target.value,
                    })
                  )}"
              >
                ${MINI_CARD_FILLS.map(
                  ([v, t]) => html`<option value="${v}" ?selected="${miniCardFill(this._config) === v}">${t}</option>`
                )}
              </select>
            </div>`
          : nothing}
        <small>
          Mini: die ganze Anlage kompakt in einer Card (z.B. kleines Tablet) — Becken oben, Geräte als
          Kacheln. Tipp auf eine Kachel öffnet den vollen Kasten. Dieselbe Einrichtung wie Voll.
        </small>
      </div>
    `;
  }

  /*
   * "In Mini anzeigen" (Zusatz zu Iteration 17) — nur sichtbar, solange die
   * Card auf view: mini steht. Pro Kasten: Kachel zeigen ja/nein
   * (mini_hidden) und welche Werte (mini_show). Entspricht die Auswahl dem
   * Standard, fällt mini_show wieder weg — die Config bleibt schlank.
   */
  _renderMiniWahl(cfg, typRoh, update) {
    if (ansichtVon(this._config) !== "mini") return nothing;
    const typ = String(typRoh || "").toLowerCase();
    if (typ !== "hero" && !MINI_TYPEN.includes(typ)) return nothing;
    const w = miniWahl(cfg || {}, typ);
    const versteckt = typ !== "hero" && cfg?.mini_hidden === true;
    const setzeWert = (key, an) => {
      const neu = w.verfuegbar.map(([k]) => k).filter((k) => (k === key ? an : w.gewaehlt.includes(k)));
      const standard = neu.length === w.standard.length && neu.every((k, i) => k === w.standard[i]);
      update({ mini_show: standard ? undefined : neu });
    };
    return html`
      <div class="mini-wahl" data-mini-wahl="${typ}">
        <div class="mini-wahl-titel">In Mini anzeigen</div>
        ${typ === "hero"
          ? nothing
          : html`<label class="mini-wahl-zeile">
              <input
                type="checkbox"
                data-mini-hidden
                .checked="${!versteckt}"
                @change="${(e) => update({ mini_hidden: e.target.checked ? undefined : true })}"
              />
              <span>Als Kachel zeigen</span>
            </label>`}
        ${versteckt
          ? nothing
          : html`
              <div class="mini-wahl-werte">
                ${w.verfuegbar.map(
                  ([k, label]) => html`<label class="mini-wahl-zeile">
                    <input
                      type="checkbox"
                      data-mini-show="${k}"
                      .checked="${w.gewaehlt.includes(k)}"
                      @change="${(e) => setzeWert(k, e.target.checked)}"
                    />
                    <span>${label}</span>
                  </label>`
                )}
              </div>
              ${w.verfuegbar.length === 0
                ? html`<small>Noch keine Werte — erst oben die Entities wählen.</small>`
                : nothing}

            `}
      </div>
    `;
  }

  /* ---- Kiosk-Modus (Iteration 15) ---- */

  _setKiosk(an) {
    /* aus = beide Schlüssel raus, die Config bleibt schlank */
    this._emit(applyPatch(this._config, an ? { kiosk: true } : { kiosk: undefined, kiosk_slots: undefined }));
  }

  _setKioskKasten(schluessel, an) {
    const alle = kioskSchluessel(this._config);
    const gewaehlt = alle.filter((k) =>
      String(k) === String(schluessel) ? an : kioskGilt({ ...this._config, kiosk: true }, k)
    );
    /* alle angehakt = Liste weglassen (Default "alle") */
    this._emit(
      applyPatch(this._config, {
        kiosk_slots: gewaehlt.length === alle.length ? undefined : gewaehlt,
      })
    );
  }

  _renderKiosk() {
    const an = this._config?.kiosk === true;
    const alle = kioskSchluessel(this._config);
    const slots = this._slots();
    return html`
      <div class="kiosk-block ${an ? "an" : ""}">
        <label class="kiosk-schalter">
          <input
            type="checkbox"
            data-key="kiosk"
            ?checked="${an}"
            @change="${(e) => this._setKiosk(e.target.checked)}"
          />
          <span>Kiosk-Modus (nur anzeigen)</span>
        </label>
        <small>
          Für ein Wand-Tablet o.ä.: die gewählten Kästen zeigen alles an, lassen sich aber nicht
          bedienen — kein Schalten, kein Modus-Wählen, keine Detail-Dialoge. Dieselbe Card kann
          woanders ohne Kiosk normal bedienbar stehen.
        </small>
        ${an
          ? html`<div class="kiosk-liste">
              ${alle.map((k) => {
                const name =
                  k === KIOSK_BECKEN ? "Becken" : this._slotKopf(slots[k - 1], k - 1);
                return html`<label class="kiosk-kasten">
                  <input
                    type="checkbox"
                    data-kiosk-slot="${k}"
                    ?checked="${kioskGilt(this._config, k)}"
                    @change="${(e) => this._setKioskKasten(k, e.target.checked)}"
                  />
                  <span>${name}</span>
                </label>`;
              })}
            </div>`
          : nothing}
      </div>
    `;
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
      defaults: {
        ...heroDefaultsFor(hero.shape),
        /* Mini-Regler starten auf der Lage der vollen Ansicht (Iteration 20) */
        ...Object.fromEntries(
          Object.values(HERO_SPRITES).flatMap((sp) => {
            const l = teilLage(hero, sp, "voll");
            return [
              [`mini_${sp.anker}_top`, l.top],
              [`mini_${sp.anker}_left`, l.left],
              [`mini_${sp.anker}_size`, l.breite],
            ];
          })
        ),
      },
      update: (patch) => this._updateHero(patch),
      idPrefix: "hero",
      stash: this._stash,
    });
    heroF.teilePos = this._teilePos || ansichtVon(this._config);
    heroF.setTeilePos = (w) => {
      this._teilePos = w;
      this.requestUpdate();
    };
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
        <div class="kopf-reihe">${this._renderAnsicht()} ${this._renderKiosk()}</div>
        <div class="step-head">Schritt 1 — Becken</div>
        <div class="slot-block becken-block" style="--slot-farbe:${slotFarbe("hero")};">
          <div class="slot-ueberschrift">Becken</div>
          <div class="slot-card becken-card">
            ${heroF.toggle("Becken anzeigen", "enabled", true)}
            ${hero.enabled === false
              ? nothing
              : this._renderMiniWahl(hero, "hero", (patch) => this._updateHero(patch))}
            ${hero.enabled === false ? nothing : heroFields(heroF)}
          </div>
        </div>

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
                ${this._renderMiniWahl(slot, slot.type, (patch) => this._updateSlot(i, patch))}
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
