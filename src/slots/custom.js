import { html, css, nothing } from "lit";
import { SlotBase } from "../shared/slot-base.js";
import { frameStyles, overlayStyles } from "../shared/styles.js";
import { isOn, stateText, nameOf, domainOf } from "../shared/util.js";

/*
 * Slot "custom" — Ueberschrift + bis zu drei Eintraegen.
 * Jeder Eintrag ist entweder ein Entity-Wert, ein Schalt-Button
 * (switch / light / input_boolean) oder ein Freitext.
 * Immer mittig; die Ausrichtung im Kasten ist grob waehlbar.
 */
export const CUSTOM_MAX_ENTRIES = 3;
const TOGGLE_DOMAINS = ["switch", "light", "input_boolean", "fan", "siren"];

export class TomtutPoolSlotCustom extends SlotBase {
  get _entries() {
    const list = Array.isArray(this.config?.entries) ? this.config.entries : [];
    return list.slice(0, CUSTOM_MAX_ENTRIES).filter((e) => e && (e.entity || e.text || e.label));
  }

  get _align() {
    const a = this.config?.align;
    return ["oben", "mitte", "unten"].includes(a) ? a : "mitte";
  }

  _toggle(entry) {
    const id = entry.entity;
    if (!id) return;
    const domain = domainOf(id);
    const service = TOGGLE_DOMAINS.includes(domain) ? "toggle" : "toggle";
    this._call(id, service);
  }

  _renderEntry(entry) {
    const kind = entry.kind || (entry.entity ? "entity" : "text");
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

  render() {
    const c = this.config || {};
    const entries = this._entries;
    return this.renderSlot(html`
      <div class="custom align-${this._align}">
        ${c.title ? html`<h3 class="slot-title">${c.title}</h3>` : nothing}
        ${entries.length
          ? entries.map((e) => this._renderEntry(e))
          : html`<p class="slot-hint">Noch keine Eintraege — im Editor bis zu drei hinzufuegen.</p>`}
      </div>
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
    `,
  ];
}

customElements.define("tomtut-pool-slot-custom", TomtutPoolSlotCustom);
