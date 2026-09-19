import { LitElement, html, nothing } from "lit";
import { isOn, toWatt, fmt, domainOf } from "./util.js";

/* Lüfter-/Laufrad-Grafik — übernommen aus der Vigipool-Card (pump_style "fan") */
export const FAN_SVG =
  '<circle cx="20" cy="20" r="3" fill="currentColor"/>' +
  '<path d="M20,17 Q20,6 12,6 Q4,6 6,14 Q8,17 20,17 Z" fill="currentColor" opacity="0.85"/>' +
  '<path d="M23,20 Q34,20 34,12 Q34,4 26,6 Q23,8 23,20 Z" fill="currentColor" opacity="0.85"/>' +
  '<path d="M20,23 Q20,34 28,34 Q36,34 34,26 Q32,23 20,23 Z" fill="currentColor" opacity="0.85"/>' +
  '<path d="M17,20 Q6,20 6,28 Q6,36 14,34 Q17,32 17,20 Z" fill="currentColor" opacity="0.85"/>';

/*
 * Gemeinsame Basis aller Slots.
 *
 * Eigenschaften von außen (die Dashboard-Card setzt sie):
 *   hass    — Home-Assistant-Objekt
 *   config  — die Slot-Konfiguration (type + typeigene Felder)
 *   frame   — { enabled: bool, fill: "transparent"|"weiss"|"schwarz" }
 */
export class SlotBase extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    frame: { attribute: false },
    _confirmOpen: { state: true },
  };

  constructor() {
    super();
    this.config = {};
    this.frame = { enabled: true, fill: "transparent" };
    this._confirmOpen = false;
  }

  /* Defaults des jeweiligen Slots — Unterklassen überschreiben das */
  get defaults() {
    return {};
  }

  _v(key) {
    const v = this.config?.[key];
    return v === undefined || v === null || v === "" ? this.defaults[key] : v;
  }

  _ent(id) {
    return id ? this.hass?.states?.[id] : undefined;
  }

  _isOn(id) {
    const e = this._ent(id);
    return e ? isOn(e.state) : false;
  }

  _watt(id) {
    return toWatt(this._ent(id));
  }

  _call(entityId, service, extra = {}) {
    if (!entityId || !this.hass) return;
    this.hass.callService(domainOf(entityId), service, { entity_id: entityId, ...extra });
  }

  _moreInfo(ev) {
    const id = ev?.currentTarget?.dataset?.entity;
    if (!id) return;
    ev.stopPropagation();
    this.dispatchEvent(
      new CustomEvent("hass-more-info", { detail: { entityId: id }, bubbles: true, composed: true })
    );
  }

  /* ---------- Rahmen ---------- */

  get _frameClasses() {
    const f = this.frame || {};
    const fill = ["transparent", "weiss", "schwarz"].includes(f.fill) ? f.fill : "transparent";
    return `slot ${f.enabled === false ? "" : "framed"} fill-${fill}`;
  }

  renderSlot(content) {
    return html`<div class="${this._frameClasses}">${content}</div>`;
  }

  /* ---------- Bausteine ---------- */

  /*
   * round: true  -> starre 1:1-Box, Grafik wird nie gestaucht oder geschert
   *                 (Laufrad der Poolpumpe).
   * ratio        -> nur für den perspektivisch elliptischen Lüfter der
   *                 Wärmepumpe; das SVG darf dort mitverzerren.
   */
  renderFan({ active, top, left, size, ratio, dur, inactive, round = false }) {
    const cls = active ? "spinning" : inactive === "hidden" ? "hidden" : "idle";
    const r = round ? 1 : Number(ratio) || 1;
    return html`
      <div
        class="fan-overlay ${cls} ${round ? "round" : ""}"
        style="top:${top}%; left:${left}%; width:${size}%; --fan-dur:${dur}s; --fan-ratio:${r};"
      >
        <svg viewBox="0 0 40 40" preserveAspectRatio="${round ? "xMidYMid meet" : "none"}">
          <g .innerHTML="${FAN_SVG}"></g>
        </svg>
      </div>
    `;
  }

  renderPowerButton({ on, top, left, scale }) {
    return html`
      <div
        class="power-badge ${on ? "on" : "off"}"
        style="top:${top}%; left:${left}%; transform:scale(${(scale ?? 100) / 100});"
        title="${on ? "Ausschalten (mit Rückfrage)" : "Einschalten"}"
        @click="${this._onPowerClick}"
      >
        <ha-icon icon="mdi:power"></ha-icon>
      </div>
    `;
  }

  renderValueBox({ value, unit, top, bottom, left, scale, box, entity }) {
    const pos = bottom === undefined ? `top:${top}%;` : `bottom:${bottom}%;`;
    return html`
      <div
        class="value-box ${box === false ? "no-bg" : ""}"
        style="${pos} left:${left}%; transform:translateX(-50%) scale(${(scale ?? 100) / 100});"
        data-entity="${entity || ""}"
        @click="${this._moreInfo}"
      >
        <span class="val">${value}</span>
        ${unit ? html`<span class="unit">${unit}</span>` : nothing}
      </div>
    `;
  }

  /* Thermometer im Skizzenstil des Artworks */
  renderThermo({ value, top, left, scale, entity }) {
    return html`
      <div
        class="thermo"
        style="top:${top}%; left:${left}%; --thermo-size:${((scale ?? 100) / 100) * 3.6}em;"
        data-entity="${entity || ""}"
        @click="${this._moreInfo}"
      >
        <svg viewBox="0 0 24 60" aria-hidden="true">
          <rect x="8" y="3" width="8" height="38" rx="4" fill="#ffffff" stroke="#111" stroke-width="1.6" />
          <circle cx="12" cy="48" r="8" fill="#e8483c" stroke="#111" stroke-width="1.6" />
          <rect x="10" y="20" width="4" height="26" fill="#e8483c" />
          <g stroke="#111" stroke-width="1.2" stroke-linecap="round">
            <line x1="16" y1="10" x2="20" y2="10" />
            <line x1="16" y1="16" x2="20" y2="16" />
            <line x1="16" y1="22" x2="20" y2="22" />
            <line x1="16" y1="28" x2="20" y2="28" />
          </g>
        </svg>
        ${value ? html`<span class="thermo-val">${value}</span>` : nothing}
      </div>
    `;
  }

  /* ---------- Powerbutton mit Rückfrage ---------- */

  /* Unterklassen liefern die Entity + den Warntext */
  get powerEntityId() {
    return null;
  }

  get powerConfirmText() {
    return "Das Gerät wird hart vom Netz getrennt. Wirklich ausschalten?";
  }

  _onPowerClick(ev) {
    ev?.stopPropagation();
    const id = this.powerEntityId;
    if (!id) return;
    if (this._isOn(id)) {
      this._confirmOpen = true;
    } else {
      this._call(id, "turn_on");
    }
  }

  _confirmOff(ev) {
    ev?.stopPropagation();
    this._confirmOpen = false;
    this._call(this.powerEntityId, "turn_off");
  }

  _cancelOff(ev) {
    ev?.stopPropagation();
    this._confirmOpen = false;
  }

  renderConfirm(title = "Wirklich stromlos schalten?") {
    if (!this._confirmOpen) return nothing;
    return html`
      <div class="confirm-overlay" @click="${this._cancelOff}">
        <div class="confirm-panel" @click="${(e) => e.stopPropagation()}">
          <h3><ha-icon icon="mdi:alert"></ha-icon> ${title}</h3>
          <p>${this.powerConfirmText}</p>
          <div class="confirm-actions">
            <button class="btn cancel" @click="${this._cancelOff}">Abbrechen</button>
            <button class="btn danger" @click="${this._confirmOff}">Trotzdem ausschalten</button>
          </div>
        </div>
      </div>
    `;
  }

  /* Watt-Text für die Wertebox — ganzzahlig, nicht-numerisch wird "—" */
  wattText(id, decimals = 0) {
    const w = this._watt(id);
    return w === null ? "—" : fmt(w, decimals);
  }
}
