import { LitElement, html, nothing } from "lit";
import { isOn, toWatt, fmt, domainOf } from "./util.js";
import { deviceImage, deviceRatio } from "./assets.js";
import { bildTransform } from "./bild.js";

/* Lüfter-/Laufrad-Grafik — übernommen aus der Vigipool-Card (pump_style "fan") */
export const FAN_SVG =
  '<circle cx="20" cy="20" r="3" fill="currentColor"/>' +
  '<path d="M20,17 Q20,6 12,6 Q4,6 6,14 Q8,17 20,17 Z" fill="currentColor" opacity="0.85"/>' +
  '<path d="M23,20 Q34,20 34,12 Q34,4 26,6 Q23,8 23,20 Z" fill="currentColor" opacity="0.85"/>' +
  '<path d="M20,23 Q20,34 28,34 Q36,34 34,26 Q32,23 20,23 Z" fill="currentColor" opacity="0.85"/>' +
  '<path d="M17,20 Q6,20 6,28 Q6,36 14,34 Q17,32 17,20 Z" fill="currentColor" opacity="0.85"/>';

/*
 * Blatt-Designs des Wärmepumpen-Lüfters (Iteration 9, im Editor wählbar).
 *
 * Alle im viewBox 0 0 40 40, gedreht wird um die Nabe (20/20). Gezeichnet im
 * Skizzenstil des Artworks: halbtransparente Fläche plus eine Kontur in
 * derselben Farbe, leicht unregelmäßig. Die Blätter werden über ein
 * transform-ATTRIBUT am <path> verteilt — nie über ein inneres <g>, denn
 * jedes <g> im Lüfter bekommt per CSS die Drehanimation (die würde ein
 * transform-Attribut am <g> überschreiben).
 */
const SKIZZE = 'fill="currentColor" fill-opacity="0.8" stroke="currentColor" stroke-width="0.7" stroke-linejoin="round"';
const verteilt = (d, anzahl, extra = "") =>
  Array.from({ length: anzahl }, (_, i) => {
    const grad = Math.round((360 / anzahl) * i * 100) / 100;
    return `<path d="${d}" ${SKIZZE}${extra}${grad ? ` transform="rotate(${grad} 20 20)"` : ""}/>`;
  }).join("");
const nabe = (r = 3.2) =>
  `<circle cx="20" cy="20" r="${r}" fill="currentColor" stroke="currentColor" stroke-width="0.7"/>`;

export const FAN_DESIGNS = {
  klassisch: { label: "Klassisch (4 Blätter)", svg: FAN_SVG },
  drei: {
    label: "3 Blätter, breit",
    svg: verteilt("M20,20 C21.5,14.5 25,7 31.5,7.2 C36.5,7.6 35.2,13.5 30.5,16.2 C27,18.2 23,19.4 20,20 Z", 3) + nabe(3.6),
  },
  fuenf: {
    label: "5 Blätter, schlank",
    svg: verteilt("M20,20 C20.6,14.2 22.8,6.4 27.2,5.6 C31.2,5.2 30.6,10.6 27.6,14 C25.4,16.6 22.4,18.6 20,20 Z", 5) + nabe(3),
  },
  sichel: {
    label: "Sichel / Turbine",
    svg:
      verteilt("M20.6,17.2 Q29.5,15.2 33.6,5.8 Q35.2,14.8 22.4,20.8 Z", 7) +
      '<circle cx="20" cy="20" r="17.2" fill="none" stroke="currentColor" stroke-width="1.1" stroke-dasharray="7 1.2 11 0.9"/>' +
      nabe(3.4),
  },
  propeller: {
    label: "Propeller",
    svg:
      verteilt("M20,20 C17.6,14.4 17.4,6.2 19.4,2.6 C20.3,1.9 21.4,2.2 22,3.4 C23.4,7.4 22.6,14.6 20,20 Z", 2) +
      '<ellipse cx="20" cy="20" rx="3.4" ry="4.2" fill="currentColor" stroke="currentColor" stroke-width="0.7"/>',
  },
  batman: {
    label: "Batman",
    svg:
      '<path d="M20,27.5 Q23,22 26,26 Q29,21.5 32,24.5 Q39,20 37.5,11 Q31,15.5 24,14.5 Q23,16 22.5,16 ' +
      "L21.7,12.3 L21,15.6 L19,15.6 L18.3,12.3 L17.5,16 Q17,16 16,14.5 Q9,15.5 2.5,11 " +
      'Q1,20 8,24.5 Q11,21.5 14,26 Q17,22 20,27.5 Z" ' +
      SKIZZE +
      "/>",
  },
};
export const FAN_DESIGN_DEFAULT = "klassisch";
export const fanDesignSvg = (key) => (FAN_DESIGNS[key] || FAN_DESIGNS[FAN_DESIGN_DEFAULT]).svg;

/*
 * Thermometer im Skizzenstil des Artworks — eine Grafik für den vollen
 * Kasten (renderThermo) und die Mini-Ansicht (Iteration 17).
 */
export const thermoGrafik = html`<svg viewBox="0 0 24 60" aria-hidden="true">
  <rect x="8" y="3" width="8" height="38" rx="4" fill="#ffffff" stroke="#111" stroke-width="1.6" />
  <circle cx="12" cy="48" r="8" fill="#e8483c" stroke="#111" stroke-width="1.6" />
  <rect x="10" y="20" width="4" height="26" fill="#e8483c" />
  <g stroke="#111" stroke-width="1.2" stroke-linecap="round">
    <line x1="16" y1="10" x2="20" y2="10" />
    <line x1="16" y1="16" x2="20" y2="16" />
    <line x1="16" y1="22" x2="20" y2="22" />
    <line x1="16" y1="28" x2="20" y2="28" />
  </g>
</svg>`;

/*
 * Beschriftung eines Kastens (Iteration 23): einheitlich `label`. Die alten
 * Schlüssel `label_text` (Wärmepumpe, Becken) und `title` (Freifeld, Rahmen)
 * gelten weiter — bestehende Configs sehen gleich aus.
 */
export const slotLabel = (c = {}) => String(c?.label || c?.label_text || c?.title || "").trim();

/*
 * Offene Rückfrage (Iteration 22, Bug A12): höchstens EINE im ganzen
 * Dashboard. Öffnet ein Kasten seine, schließt die des vorigen.
 */
let offenerKasten = null;

/*
 * Overlays, die nie aus dem Kasten ragen dürfen (Iteration 22, Bugs A8/A19).
 * Liegt eins (samt "seit"-Zeile) über dem Rand, wird es per `translate`
 * zurückgeschoben — Lage und Größe in der Config bleiben unangetastet.
 * Grenze ist die Innenkante des Kastens (.slot), nicht das Bild: ein
 * Thermometer, das heute oben ins Polster ragt, bleibt, wo es ist.
 */
const KLEMM_TEILE =
  ".power-badge, .value-box, .thermo, .label-badge, .chem-box, .release-badge, .mode-badge";

/*
 * Gemeinsame Basis aller Slots.
 *
 * Eigenschaften von außen (die Dashboard-Card setzt sie):
 *   hass    — Home-Assistant-Objekt
 *   config  — die Slot-Konfiguration (type + typeigene Felder)
 *   frame   — { enabled: bool, fill: "transparent"|"weiss"|"schwarz" }
 *   kiosk   — true = nur Anzeige (Iteration 15, s. shared/kiosk.js)
 */
export class SlotBase extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    frame: { attribute: false },
    kiosk: { attribute: false },
    _confirmOpen: { state: true },
  };

  constructor() {
    super();
    this.config = {};
    this.frame = { enabled: true, fill: "transparent" };
    this.kiosk = false;
    this._confirmOpen = false;
    /* Inhalt der offenen Rückfrage; null = Standard (Powerbutton ausschalten) */
    this._frage = null;
    this._esc = (ev) => {
      if (ev.key !== "Escape" || !this._dialogOffen) return;
      /* auch im Mini-Dialog schließt Esc zuerst nur die Rückfrage */
      ev.preventDefault();
      ev.stopPropagation();
      this._dialogeSchliessen();
    };
  }

  /* ---------- Rückfragen: Esc, nur eine zugleich (Iteration 22) ---------- */

  /* Ist gerade eine Rückfrage/Auswahl dieses Kastens offen? */
  get _dialogOffen() {
    return this._confirmOpen === true;
  }

  _dialogeSchliessen() {
    this._confirmOpen = false;
    this._frage = null;
  }

  /* Vor dem Öffnen: die Rückfrage eines anderen Kastens schließen */
  _alsOffenMelden() {
    if (offenerKasten && offenerKasten !== this) offenerKasten._dialogeSchliessen();
    offenerKasten = this;
  }

  updated(changed) {
    super.updated?.(changed);
    const offen = this._dialogOffen && this.bedienbar;
    if (offen && !this._escAn && typeof window !== "undefined") {
      window.addEventListener("keydown", this._esc, true);
      this._escAn = true;
    } else if (!offen && this._escAn) {
      window.removeEventListener("keydown", this._esc, true);
      this._escAn = false;
      if (offenerKasten === this) offenerKasten = null;
    }
    this._klemmen();
    this._klemmBeobachter();
  }

  disconnectedCallback() {
    if (this._escAn) window.removeEventListener("keydown", this._esc, true);
    this._escAn = false;
    if (offenerKasten === this) offenerKasten = null;
    this._ro?.disconnect();
    this._ro = null;
    super.disconnectedCallback();
  }

  /* ---------- Overlays im Bild halten (Iteration 22) ---------- */

  _klemmen() {
    const wrap = this.renderRoot?.querySelector?.(".img-wrap");
    const kasten = this.renderRoot?.querySelector?.(".slot");
    if (!wrap?.getBoundingClientRect || !kasten?.getBoundingClientRect) return;
    const k = kasten.getBoundingClientRect();
    if (!k.width || !k.height || !wrap.getBoundingClientRect().height) return;
    this._vorKlemmen(wrap);
    const cs = typeof getComputedStyle === "function" ? getComputedStyle(kasten) : null;
    const rand = (seite) => parseFloat(cs?.[`border${seite}Width`]) || 0;
    const w = {
      left: k.left + rand("Left"),
      right: k.right - rand("Right"),
      top: k.top + rand("Top"),
      bottom: k.bottom - rand("Bottom"),
    };
    for (const el of wrap.querySelectorAll(KLEMM_TEILE)) {
      el.style.translate = "";
      const r = el.getBoundingClientRect();
      if (!r.width && !r.height) continue;
      const box = { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
      for (const kind of el.querySelectorAll(".release-seit")) {
        const k = kind.getBoundingClientRect();
        box.left = Math.min(box.left, k.left);
        box.right = Math.max(box.right, k.right);
        box.bottom = Math.max(box.bottom, k.bottom);
      }
      const dx = box.left < w.left ? w.left - box.left : box.right > w.right ? w.right - box.right : 0;
      const dy = box.top < w.top ? w.top - box.top : box.bottom > w.bottom ? w.bottom - box.bottom : 0;
      if (Math.abs(dx) >= 0.5 || Math.abs(dy) >= 0.5) {
        el.style.translate = `${Math.round(dx * 10) / 10}px ${Math.round(dy * 10) / 10}px`;
      }
    }
  }

  /* Haken für Unterklassen: Layout-Korrekturen vor dem Klemmen */
  _vorKlemmen() {}

  /*
   * Bild geladen, Spalte breiter/schmaler, Icon im Powerbutton erst später
   * da (ha-icon lädt nach, Iteration 24): neu klemmen. Beobachtet werden der
   * Bildbereich und die Overlays, deren Größe erst nach dem Rendern feststeht.
   */
  _klemmBeobachter() {
    const wrap = this.renderRoot?.querySelector?.(".img-wrap");
    if (!wrap || typeof ResizeObserver === "undefined") return;
    const ziele = [wrap, ...wrap.querySelectorAll(".power-badge, .label-badge")];
    if (this._roZiele && ziele.length === this._roZiele.length && ziele.every((z, i) => z === this._roZiele[i])) return;
    this._ro?.disconnect();
    this._ro = new ResizeObserver(() => this._klemmen());
    for (const z of ziele) this._ro.observe(z);
    this._roZiele = ziele;
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

  /* Kiosk = nur Anzeige: hier endet JEDER Schaltwunsch des Slots */
  get bedienbar() {
    return this.kiosk !== true;
  }

  _call(entityId, service, extra = {}) {
    if (!this.bedienbar || !entityId || !this.hass) return;
    this.hass.callService(domainOf(entityId), service, { entity_id: entityId, ...extra });
  }

  _moreInfo(ev) {
    if (!this.bedienbar) return;
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
    return `slot ${f.enabled === false ? "" : "framed"} fill-${fill}${this.bedienbar ? "" : " kiosk"}`;
  }

  renderSlot(content) {
    return html`<div class="${this._frameClasses}">${content}</div>`;
  }

  /* ---------- Bausteine ---------- */

  /*
   * Bildbereich eines Geräte-Slots — die EINE Stelle für alle Slots.
   *
   * Der Kasten bekommt seine Höhe über `aspect-ratio` aus der Maßtabelle
   * (shared/assets.js), nicht aus dem geladenen Bild: er steht damit sofort
   * und bleibt in jeder Lage gleich groß. Gedreht/gespiegelt wird nur der
   * innere Wrapper `.bild`, passend verkleinert (shared/bild.js); alles, was
   * mitdrehen soll (z.B. das Glühen der UV-Lampe), kommt als `inhalt` in
   * denselben Wrapper. `overflow:hidden` auf dem Kasten ist die harte
   * Grenze — aus dem Bildbereich ragt nie etwas heraus.
   *
   * `groesse` (Prozent, seit Iteration 7) verkleinert das Bild im Kasten
   * zusätzlich — der Kasten selbst bleibt auch davon unberührt.
   */
  renderGeraeteBild({
    kind,
    variante,
    alt,
    rotate = 0,
    mirror = false,
    groesse = 100,
    inhalt = nothing,
  }) {
    const ratio = deviceRatio(kind);
    return html`
      <div class="bild-flaeche" style="aspect-ratio:${Math.round(ratio * 10000) / 10000};">
        <div class="bild" style="${bildTransform(rotate, mirror, ratio, groesse)}">
          <img src="${deviceImage(kind, variante)}" alt="${alt}" />
          ${inhalt}
        </div>
      </div>
    `;
  }

  /*
   * round: true  -> starre 1:1-Box, Grafik wird nie gestaucht oder geschert
   *                 (Laufrad der Poolpumpe).
   * ratio        -> nur für den perspektivisch elliptischen Lüfter der
   *                 Wärmepumpe; das SVG darf dort mitverzerren.
   */
  /*
   * design  -> Schlüssel aus FAN_DESIGNS (unbekannt = klassisch)
   * farbe   -> optionale Farbe des Rads (CSS-Wert); ohne = Schriftfarbe
   */
  renderFan({ active, top, left, size, ratio, dur, inactive, round = false, design, farbe }) {
    const cls = active ? "spinning" : inactive === "hidden" ? "hidden" : "idle";
    const r = round ? 1 : Number(ratio) || 1;
    const svg = design ? fanDesignSvg(design) : FAN_SVG;
    const key = design && FAN_DESIGNS[design] ? design : FAN_DESIGN_DEFAULT;
    return html`
      <div
        class="fan-overlay ${cls} ${round ? "round" : ""} design-${key}"
        style="top:${top}%; left:${left}%; width:${size}%; --fan-dur:${dur}s; --fan-ratio:${r};${farbe
          ? ` --tt-fan-color:${farbe};`
          : ""}"
      >
        <svg viewBox="0 0 40 40" preserveAspectRatio="${round ? "xMidYMid meet" : "none"}">
          <g .innerHTML="${svg}"></g>
        </svg>
      </div>
    `;
  }

  /*
   * standby (Iteration 18, Wärmepumpe): Steckdose an, Gerät aber per
   * climate aus — Knopf bernsteinfarben statt grün plus Hinweis daneben,
   * damit "Steckdose an, WP aus" lesbar ist. Der Knopf schaltet weiter die
   * Steckdose.
   */
  /*
   * Zustand der Knopf-Entity unbekannt (unknown/unavailable/fehlt)? Dann
   * zeigt der Knopf grau statt rot — "aus" wäre eine Behauptung
   * (Iteration 18b, gilt für jeden Slot mit Powerbutton).
   */
  get _powerUnbekannt() {
    const id = this.powerEntityId;
    if (!id) return false;
    const s = String(this._ent(id)?.state ?? "").toLowerCase();
    return ["", "unknown", "unavailable"].includes(s);
  }

  renderPowerButton({ on, top, left, scale, standby = false, hinweis = null }) {
    /* hinweis (It19c): { oben, unten, titel } — Standard ist die WP ("Strom an / WP aus") */
    const h = hinweis || {
      oben: "Strom an",
      unten: "WP aus",
      titel: "Steckdose an, Wärmepumpe aus (Standby) — Steckdose ausschalten (mit Rückfrage)",
    };
    const unbekannt = !on && this._powerUnbekannt;
    return html`
      <div
        class="power-badge ${on ? "on" : unbekannt ? "unbekannt" : "off"} ${standby ? "standby" : ""}"
        style="top:${top}%; left:${left}%; transform:scale(${(scale ?? 100) / 100});"
        title="${standby
          ? h.titel
          : unbekannt
          ? "Zustand unbekannt — Einschalten"
          : on
          ? "Ausschalten (mit Rückfrage)"
          : "Einschalten"}"
        @click="${this._onPowerClick}"
      >
        <ha-icon icon="mdi:power"></ha-icon>
        ${standby
          ? html`<span class="power-hinweis ${h.lage || ""}"><b>${h.oben}</b><span>${h.unten}</span></span>`
          : nothing}
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
        ${thermoGrafik}
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

  /*
   * "Vor dem Ausschalten nachfragen" (`confirm_off`, seit Iteration 9) —
   * pro Kasten abwählbar. Default ist, was der Slot-Typ vorgibt: Geräte
   * mit Powerbutton fragen ab Werk nach (confirmDefault true).
   */
  get confirmDefault() {
    return true;
  }

  get fragtNach() {
    const v = this.config?.confirm_off;
    return v === undefined || v === null || v === "" ? this.confirmDefault : v !== false;
  }

  _onPowerClick(ev) {
    ev?.stopPropagation();
    if (!this.bedienbar) return;
    const id = this.powerEntityId;
    if (!id) return;
    if (this._isOn(id)) {
      if (this.fragtNach) this._fragen(null);
      else this._call(id, "turn_off");
    } else {
      this._call(id, "turn_on");
    }
  }

  /*
   * Rückfrage öffnen. frage = null: die Standardfrage des Powerbuttons;
   * sonst { titel, text, knopf, aktion } (z.B. Freigabekontakt).
   */
  _fragen(frage) {
    this._alsOffenMelden();
    this._frage = frage;
    this._confirmOpen = true;
  }

  _confirmOff(ev) {
    ev?.stopPropagation();
    const frage = this._frage;
    this._dialogeSchliessen();
    if (frage?.aktion) frage.aktion();
    else this._call(this.powerEntityId, "turn_off");
  }

  _cancelOff(ev) {
    ev?.stopPropagation();
    this._dialogeSchliessen();
  }

  renderConfirm(title = "Wirklich stromlos schalten?") {
    if (!this._confirmOpen || !this.bedienbar) return nothing;
    const f = this._frage || {};
    return html`
      <div class="confirm-overlay" @click="${this._cancelOff}">
        <div class="confirm-panel" role="alertdialog" @click="${(e) => e.stopPropagation()}">
          <h3><ha-icon icon="mdi:alert"></ha-icon> ${f.titel || title}</h3>
          <p>${f.text || this.powerConfirmText}</p>
          <div class="confirm-actions">
            <button class="btn cancel" @click="${this._cancelOff}">Abbrechen</button>
            <button class="btn danger" @click="${this._confirmOff}">${f.knopf || "Trotzdem ausschalten"}</button>
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
