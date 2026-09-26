import { html, css, nothing } from "lit";
import { SlotBase, slotLabel } from "../shared/slot-base.js";
import { frameStyles, overlayStyles } from "../shared/styles.js";
import { isOn, stateText, nameOf, domainOf } from "../shared/util.js";
import { hasHaElement } from "../shared/ha-elements.js";

/*
 * Slot "custom" — im Editor "Freifeld (benutzerdefiniert)": Überschrift plus
 * bis zu acht Einträgen (bis Iteration 15: drei, der Rest wurde still
 * gekappt). Jeder Eintrag ist entweder ein Entity-Wert, ein Schalt-Button
 * (switch / light / input_boolean …) oder ein Freitext.
 *
 * Drei Darstellungen (`layout`, seit Iteration 16):
 *   klassisch (Default)  mittig gestapelt, wie immer — bestehende Configs
 *                        sehen unverändert aus.
 *   liste                kompakte Zeilen: Icon · Name · Schalter/Wert rechts,
 *                        wie eine HA-Entities-Karte, aber in unserer Optik.
 *                        Titel + 4 Zeilen passen in 384 × 268 px (Test).
 *   kacheln              2-Spalten-Raster aus Buttons.
 *
 * Mehr als CUSTOM_MAX_ENTRIES Einträge werden nicht mehr still verschluckt:
 * der Kasten zeigt "+N weitere ausgeblendet", der Editor warnt.
 */
export const CUSTOM_MAX_ENTRIES = 8;
export const CUSTOM_LAYOUTS = ["klassisch", "liste", "kacheln"];
export const CUSTOM_LAYOUT_DEFAULT = "klassisch";
export const TOGGLE_DOMAINS = ["switch", "light", "input_boolean", "fan", "siren"];

/* Fallback-Icons, wenn weder `icon` gesetzt ist noch ha-state-icon existiert */
export const DOMAIN_ICONS = {
  switch: "mdi:toggle-switch-variant",
  input_boolean: "mdi:toggle-switch-outline",
  light: "mdi:lightbulb",
  fan: "mdi:fan",
  siren: "mdi:bullhorn",
  sensor: "mdi:eye",
  binary_sensor: "mdi:checkbox-blank-circle-outline",
  climate: "mdi:thermostat",
  number: "mdi:ray-vertex",
  input_number: "mdi:ray-vertex",
};

/* Gültige Einträge einer Slot-Config (leere zählen nicht) */
export const customEintraege = (config) =>
  (Array.isArray(config?.entries) ? config.entries : []).filter(
    (e) => e && (e.entity || e.text || e.label)
  );

export const customLayout = (config) =>
  CUSTOM_LAYOUTS.includes(config?.layout) ? config.layout : CUSTOM_LAYOUT_DEFAULT;

export class TomtutPoolSlotCustom extends SlotBase {
  /*
   * Buttons fragen ab Werk NICHT nach (so war es immer). Pro Eintrag
   * einschaltbar: `confirm_off: true` — dann kommt vor dem Ausschalten
   * derselbe Dialog wie beim Powerbutton der Geräte.
   */
  get confirmDefault() {
    return false;
  }

  get powerEntityId() {
    return this._wartet?.entity || null;
  }

  get powerConfirmText() {
    const name = this._wartet?.label || nameOf(this._ent(this._wartet?.entity), this._wartet?.entity);
    return `„${name}" wird ausgeschaltet.`;
  }

  get _entries() {
    return customEintraege(this.config).slice(0, CUSTOM_MAX_ENTRIES);
  }

  get _ausgeblendet() {
    return Math.max(0, customEintraege(this.config).length - CUSTOM_MAX_ENTRIES);
  }

  get _layout() {
    return customLayout(this.config);
  }

  get _align() {
    const a = this.config?.align;
    if (["oben", "mitte", "unten"].includes(a)) return a;
    /* Liste/Kacheln sitzen wie eine HA-Karte oben; klassisch bleibt mittig */
    return this._layout === "klassisch" ? "mitte" : "oben";
  }

  get _frameClasses() {
    return `${super._frameClasses} layout-${this._layout}`;
  }

  _kind(entry) {
    return entry.kind || (entry.entity ? "entity" : "text");
  }

  _schaltbar(entry) {
    return TOGGLE_DOMAINS.includes(domainOf(entry.entity));
  }

  _toggle(entry) {
    const id = entry.entity;
    if (!id || !this.bedienbar) return;
    /* toggle gibt es in allen schaltbaren Domains gleichermaßen */
    if (!this._schaltbar(entry)) return;
    if (entry.confirm_off === true && this._isOn(id)) {
      this._wartet = entry;
      this._fragen(null);
      return;
    }
    this._call(id, "toggle");
  }

  /* HA formatiert den State selbst (übersetzt, Zahlen mit Einheit); ohne
     diese Funktion (ältere HA, Test) greift unser stateText. */
  _zustand(ent) {
    if (!ent) return "—";
    try {
      const t = this.hass?.formatEntityState?.(ent);
      if (t) return t;
    } catch (err) {
      console.warn("tomtut-pool-cards: formatEntityState —", err?.message || err);
    }
    return stateText(ent);
  }

  _icon(entry, ent) {
    if (entry.icon) return html`<ha-icon icon="${entry.icon}"></ha-icon>`;
    if (ent && hasHaElement("ha-state-icon")) {
      return html`<ha-state-icon .hass="${this.hass}" .stateObj="${ent}"></ha-state-icon>`;
    }
    const icon = ent?.attributes?.icon || DOMAIN_ICONS[domainOf(entry.entity)] || "mdi:circle-medium";
    return html`<ha-icon icon="${icon}"></ha-icon>`;
  }

  /* ---------------- klassisch (unverändert seit Iteration 1) ---------------- */

  _renderEntry(entry) {
    const kind = this._kind(entry);
    if (kind === "text") {
      return html`<div class="entry text">${entry.text || entry.label || ""}</div>`;
    }
    const ent = this._ent(entry.entity);
    if (kind === "button") {
      const on = ent ? isOn(ent.state) : false;
      return html`
        <button class="entry btn-entry ${on ? "on" : ""}" @click="${() => this._toggle(entry)}">
          ${entry.icon ? html`<ha-icon icon="${entry.icon}"></ha-icon>` : nothing}
          <span>${entry.label || nameOf(ent, entry.entity)}</span>
        </button>
      `;
    }
    return html`
      <div class="entry value" data-entity="${entry.entity || ""}" @click="${this._moreInfo}">
        <span class="entry-label">${entry.label || nameOf(ent, entry.entity)}</span>
        <span class="entry-value">${stateText(ent)}</span>
      </div>
    `;
  }

  /* ---------------- liste ---------------- */

  _renderZeile(entry) {
    const kind = this._kind(entry);
    if (kind === "text") {
      return html`<div class="entry zeile text"><span class="z-text">${entry.text || entry.label || ""}</span></div>`;
    }
    const ent = this._ent(entry.entity);
    const name = entry.label || nameOf(ent, entry.entity);
    const weg = !ent || ["unavailable", "unknown"].includes(ent.state);
    if (kind === "button" && this._schaltbar(entry)) {
      const on = ent ? isOn(ent.state) : false;
      return html`
        <button
          class="entry zeile schaltbar ${on ? "on" : "off"} ${weg ? "weg" : ""}"
          role="switch"
          aria-checked="${on ? "true" : "false"}"
          title="${name}: ${on ? "an" : "aus"}"
          @click="${() => this._toggle(entry)}"
        >
          <span class="z-icon">${this._icon(entry, ent)}</span>
          <span class="z-name">${name}</span>
          <span class="schalter" aria-hidden="true"><span class="knopf"></span></span>
        </button>
      `;
    }
    return html`
      <div class="entry zeile wert" data-entity="${entry.entity || ""}" @click="${this._moreInfo}">
        <span class="z-icon">${this._icon(entry, ent)}</span>
        <span class="z-name">${name}</span>
        <span class="z-wert">${this._zustand(ent)}</span>
      </div>
    `;
  }

  /* ---------------- kacheln ---------------- */

  _renderKachel(entry) {
    const kind = this._kind(entry);
    if (kind === "text") {
      return html`<div class="entry kachel text"><span class="k-name">${entry.text || entry.label || ""}</span></div>`;
    }
    const ent = this._ent(entry.entity);
    const name = entry.label || nameOf(ent, entry.entity);
    if (kind === "button" && this._schaltbar(entry)) {
      const on = ent ? isOn(ent.state) : false;
      return html`
        <button
          class="entry kachel schaltbar ${on ? "on" : "off"}"
          role="switch"
          aria-checked="${on ? "true" : "false"}"
          @click="${() => this._toggle(entry)}"
        >
          <span class="k-icon">${this._icon(entry, ent)}</span>
          <span class="k-text">
            <span class="k-name">${name}</span>
            <span class="k-zustand">${on ? "An" : "Aus"}</span>
          </span>
        </button>
      `;
    }
    return html`
      <div class="entry kachel wert" data-entity="${entry.entity || ""}" @click="${this._moreInfo}">
        <span class="k-icon">${this._icon(entry, ent)}</span>
        <span class="k-text">
          <span class="k-name">${name}</span>
          <span class="k-zustand">${this._zustand(ent)}</span>
        </span>
      </div>
    `;
  }

  render() {
    const c = this.config || {};
    const entries = this._entries;
    const layout = this._layout;
    const mehr = this._ausgeblendet;
    let inhalt;
    if (!entries.length) {
      inhalt = html`<p class="slot-hint">Noch keine Einträge — im Editor bis zu ${CUSTOM_MAX_ENTRIES} hinzufügen.</p>`;
    } else if (layout === "liste") {
      inhalt = html`<div class="zeilen">${entries.map((e) => this._renderZeile(e))}</div>`;
    } else if (layout === "kacheln") {
      inhalt = html`<div class="kacheln">${entries.map((e) => this._renderKachel(e))}</div>`;
    } else {
      inhalt = entries.map((e) => this._renderEntry(e));
    }
    return this.renderSlot(html`
      <div class="custom layout-${layout} align-${this._align}">
        ${slotLabel(c) ? html`<h3 class="slot-title">${slotLabel(c)}</h3>` : nothing}
        ${inhalt}
        ${mehr
          ? html`<p class="slot-hint mehr">+${mehr} weitere ${mehr === 1 ? "Eintrag" : "Einträge"} ausgeblendet (höchstens ${CUSTOM_MAX_ENTRIES})</p>`
          : nothing}
      </div>
      ${this.renderConfirm("Wirklich ausschalten?")}
    `);
  }

  static styles = [
    frameStyles,
    overlayStyles,
    css`
      .custom {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        height: 100%;
        text-align: center;
      }
      .custom.align-oben {
        justify-content: flex-start;
      }
      .custom.align-mitte {
        justify-content: center;
      }
      .custom.align-unten {
        justify-content: flex-end;
      }
      .entry {
        display: flex;
        flex-direction: column;
        align-items: center;
        line-height: 1.25;
        max-width: 100%;
      }
      .entry.value {
        cursor: default;
      }
      .entry-label {
        font-size: 0.78em;
        opacity: 0.7;
        letter-spacing: 0.3px;
      }
      .entry-value {
        font-size: 1.35em;
        font-weight: 700;
        white-space: nowrap;
      }
      .entry.text {
        font-size: 0.95em;
        opacity: 0.9;
      }
      .btn-entry {
        flex-direction: row;
        gap: 8px;
        min-height: 44px;
        padding: 8px 16px;
        border-radius: 22px;
        border: 1px solid var(--tt-line);
        background: var(--tt-soft);
        color: var(--tt-fg);
        font-family: inherit;
        font-size: 0.95em;
        font-weight: 600;
        cursor: pointer;
        --mdc-icon-size: 20px;
      }
      .btn-entry:hover {
        filter: brightness(1.06);
      }
      .btn-entry.on {
        background: linear-gradient(145deg, #00c878, #00a064);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.28);
        box-shadow: 0 0 10px rgba(0, 200, 120, 0.4);
      }
      .slot-hint.mehr {
        font-size: 12px;
        color: var(--warning-color, #ff9800);
        opacity: 1;
      }

      /*
       * Liste + Kacheln (Iteration 16).
       *
       * Ohne Rahmenfüllung (fill transparent) trägt der Kasten den
       * Karten-Hintergrund des HA-Themes und dessen Schriftfarben — so ist er
       * auf hellem wie dunklem Theme lesbar und sieht aus wie die übrigen
       * Karten daneben. weiss/schwarz bleiben, was sie sind.
       * Maße in px statt em: die Höhe (Titel + 4 Zeilen <= 268 px bei 384 px
       * Breite) ist per Render-Test zugesagt und darf nicht an der
       * Schriftgröße der Umgebung hängen.
       */
      .slot.layout-liste,
      .slot.layout-kacheln {
        justify-content: flex-start;
        gap: 0;
        padding: 10px 14px;
        border-radius: var(--ha-card-border-radius, 12px);
        --tt-on: #00b36b;
        --tt-fg2: var(--secondary-text-color, rgba(127, 127, 127, 0.95));
        --tt-icon: var(--state-icon-color, var(--tt-fg2));
      }
      .slot.layout-liste.fill-transparent,
      .slot.layout-kacheln.fill-transparent {
        --tt-bg: var(--ha-card-background, var(--card-background-color, #ffffff));
        box-shadow: var(--ha-card-box-shadow, none);
      }
      .slot.fill-weiss.layout-liste,
      .slot.fill-weiss.layout-kacheln {
        --tt-fg2: rgba(0, 0, 0, 0.6);
        --tt-icon: rgba(0, 0, 0, 0.6);
      }
      .slot.fill-schwarz.layout-liste,
      .slot.fill-schwarz.layout-kacheln {
        --tt-fg2: rgba(255, 255, 255, 0.7);
        --tt-icon: rgba(255, 255, 255, 0.75);
      }
      .custom.layout-liste,
      .custom.layout-kacheln {
        align-items: stretch;
        text-align: left;
        gap: 0;
      }
      .layout-liste .slot-title,
      .layout-kacheln .slot-title {
        text-align: left;
        font-size: 21px;
        font-weight: 500;
        letter-spacing: 0;
        line-height: 28px;
        padding: 2px 2px 4px;
      }
      .zeilen {
        display: flex;
        flex-direction: column;
      }
      .zeile {
        box-sizing: border-box;
        display: grid;
        grid-template-columns: 36px minmax(0, 1fr) auto;
        align-items: center;
        column-gap: 10px;
        width: 100%;
        min-height: 48px;
        padding: 0 4px 0 2px;
        margin: 0;
        border: none;
        border-radius: 10px;
        background: none;
        color: var(--tt-fg);
        font-family: inherit;
        font-size: 15px;
        line-height: 1.25;
        text-align: left;
      }
      .zeile.schaltbar {
        cursor: pointer;
      }
      .zeile.schaltbar:hover {
        background: var(--tt-soft);
      }
      .zeile.text {
        display: flex;
        min-height: 36px;
        color: var(--tt-fg2);
      }
      .z-icon,
      .k-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--tt-icon);
        --mdc-icon-size: 24px;
        transition: color 0.2s;
      }
      .zeile.on .z-icon,
      .kachel.on .k-icon {
        color: var(--tt-on);
      }
      .z-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .z-wert {
        white-space: nowrap;
        font-weight: 500;
        justify-self: end;
      }
      .zeile.weg {
        opacity: 0.5;
      }
      /* Schalter: aus = graue Bahn, Knopf links · an = grüne Bahn, Knopf rechts */
      .schalter {
        position: relative;
        box-sizing: border-box;
        width: 42px;
        height: 24px;
        border-radius: 12px;
        background: rgba(127, 127, 127, 0.38);
        border: 1px solid var(--tt-line);
        transition: background 0.2s, border-color 0.2s;
      }
      .knopf {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #ffffff;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        transition: left 0.2s;
      }
      .zeile.on .schalter {
        background: var(--tt-on);
        border-color: var(--tt-on);
        box-shadow: 0 0 8px rgba(0, 179, 107, 0.45);
      }
      .zeile.on .knopf {
        left: 20px;
      }

      .kacheln {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
        padding-top: 4px;
      }
      .kachel {
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        min-height: 56px;
        padding: 8px 10px;
        margin: 0;
        border-radius: 14px;
        border: 1px solid var(--tt-line);
        background: var(--tt-soft);
        color: var(--tt-fg);
        font-family: inherit;
        font-size: 14px;
        line-height: 1.2;
        text-align: left;
      }
      .kachel.schaltbar {
        cursor: pointer;
      }
      .kachel.schaltbar:hover {
        filter: brightness(1.06);
      }
      .kachel.on {
        background: linear-gradient(145deg, #00c878, #00a064);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.28);
        box-shadow: 0 0 10px rgba(0, 200, 120, 0.4);
      }
      .kachel.on .k-icon {
        color: #ffffff;
      }
      .kachel.text {
        grid-column: span 2;
        min-height: 36px;
        color: var(--tt-fg2);
        background: none;
        border-style: dashed;
      }
      .k-text {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .k-name {
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .k-zustand {
        font-size: 12px;
        opacity: 0.8;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `,
  ];
}

customElements.define("tomtut-pool-slot-custom", TomtutPoolSlotCustom);
