import { html, css, nothing } from "lit";
import { SlotBase } from "../shared/slot-base.js";
import { frameStyles, overlayStyles } from "../shared/styles.js";
import { deviceImage, deviceRatio } from "../shared/assets.js";
import { numText } from "../shared/util.js";

/*
 * Slot "uv" — UV-C-Lampe im Rohrstrang.
 *
 * Bewusst schlank: eine UV-Lampe kann nichts regeln, sie ist an oder aus.
 * Es gibt daher nur drei Entities (alle optional) und kein Durchflussfeld:
 *   switch_entity  Steckdose/Relais — Powerbutton mit Rückfrage
 *   power_entity   Leistung in W/kW — Watt-Box
 *   temp_entity    Temperaturfühler — Thermometer
 *
 * Zwei Besonderheiten gegenüber den anderen Geräte-Slots:
 *   1. Glüheffekt — läuft die Lampe, liegt ein statischer blau-violetter
 *      Schein über dem Rohrkörper. Statisch ist Absicht: ein UV-Strahler
 *      flackert nicht, und eine Animation würde im Dashboard nur nerven.
 *   2. Drehen/Spiegeln — die Lampe sitzt je nach Anlage andersherum im
 *      Strang. Gedreht wird das Bild samt Glühen; Thermometer, Watt-Box und
 *      Powerbutton bleiben aufrecht und damit lesbar.
 *
 * Die Positions-Defaults sind am Artwork vermessen (Rohrmitte, Neigung des
 * Rohrs ≈ −15°) und im Editor frei verschiebbar.
 */
export const UV_DEFAULTS = {
  /* Bild */
  anschluss: "seite",
  rotate: 0,
  mirror: false,
  /* Powerbutton */
  power_btn_top: 6,
  power_btn_left: 3,
  power_btn_scale: 120,
  /* Stromverbrauch */
  power_bottom: 9,
  power_left: 76,
  power_scale: 100,
  power_box: true,
  power_label: true,
  /* Thermometer — in der freien Fläche über dem Rohr, neben dem Powerbutton */
  temp_top: 19,
  temp_left: 40,
  temp_scale: 110,
  /* Glüheffekt — Mitte, Länge und Neigung des Rohrkörpers */
  glow_top: 40,
  glow_left: 56,
  glow_size: 40,
  glow_thickness: 13,
  glow_angle: -15,
  glow_intensity: 80,
};

export const uvHasEntity = (c = {}) => !!(c.switch_entity || c.power_entity || c.temp_entity);

/* Drehwinkel aus der Config: ganze Grad, immer 0..359 */
export const normGrad = (wert) => {
  const n = Number(wert);
  if (!isFinite(n)) return 0;
  return ((Math.round(n) % 360) + 360) % 360;
};

/*
 * Maßstab, damit ein gedrehtes Bild nicht aus seinem Kasten ragt.
 *
 * Gerechnet wird in Vielfachen der Kastenbreite: der Kasten ist bei einer
 * Drehung quadratisch, das Bild darin `1 : ratio`. Zurück kommt der Faktor,
 * mit dem die gedrehte Hülle gerade noch hineinpasst (nie über 1 — kleiner
 * als nötig wird nie skaliert).
 */
export const passFaktor = (grad, ratio) => {
  const r = Number(ratio) > 0 ? Number(ratio) : 1;
  const rad = (normGrad(grad) * Math.PI) / 180;
  const c = Math.abs(Math.cos(rad));
  const s = Math.abs(Math.sin(rad));
  const h = 1 / r;
  return Math.min(1, 1 / (c + h * s), 1 / (s + h * c));
};

export class TomtutPoolSlotUv extends SlotBase {
  get defaults() {
    return UV_DEFAULTS;
  }

  get powerEntityId() {
    return this.config?.switch_entity || null;
  }

  get powerConfirmText() {
    return `Ein UV-C-Strahler altert vor allem beim Schalten: jeder Start kostet Brennstunden,
      häufiges Ein und Aus mehr als Durchlauf. Und nach dem Einschalten braucht die Lampe
      einige Minuten, bis sie wieder volle Leistung bringt.`;
  }

  get leuchtet() {
    return this._isOn(this.config?.switch_entity);
  }

  /* Bild + Glühen drehen sich, die Bedienelemente nicht */
  get _bildStil() {
    const grad = normGrad(this._v("rotate"));
    const faktor = passFaktor(grad, deviceRatio("uv"));
    const teile = [];
    if (grad) teile.push(`rotate(${grad}deg)`);
    if (faktor < 1) teile.push(`scale(${Math.round(faktor * 1000) / 1000})`);
    if (this._v("mirror") === true) teile.push("scaleX(-1)");
    return teile.length ? `transform:${teile.join(" ")};` : "";
  }

  /*
   * Der Glühbereich ist eine liegende Ellipse auf dem Rohr. Seine Höhe steht
   * in Prozent der Bildhöhe, gesetzt wird sie aber über `aspect-ratio`:
   * prozentuale Höhen hätten im automatisch hohen Bildkasten keinen Bezug.
   */
  renderGlow() {
    const laenge = Number(this._v("glow_size")) || 0;
    const dicke = Number(this._v("glow_thickness")) || 0;
    if (laenge <= 0 || dicke <= 0) return nothing;
    const verhaeltnis = Math.round(((laenge * deviceRatio("uv")) / dicke) * 1000) / 1000;
    const roh = Number(this._v("glow_intensity"));
    const staerke = Math.min(100, Math.max(0, isFinite(roh) ? roh : 80)) / 100;
    const stil = [
      `top:${this._v("glow_top")}%`,
      `left:${this._v("glow_left")}%`,
      `width:${laenge}%`,
      `aspect-ratio:${verhaeltnis}`,
      `opacity:${staerke}`,
      `transform:translate(-50%, -50%) rotate(${Number(this._v("glow_angle")) || 0}deg)`,
    ].join("; ");
    return html`<div class="glow" style="${stil};"></div>`;
  }

  /* Rendert immer — auch ohne hass und ohne eine einzige Entity. */
  render() {
    const c = this.config || {};
    const configured = uvHasEntity(c);
    const gedreht = normGrad(this._v("rotate")) % 180 !== 0;

    const showGlow = c.show_glow !== false;
    const showPowerBtn = c.show_power_button !== false && !!c.switch_entity;
    const showPower = c.show_power !== false && !!c.power_entity;
    const showTemp = c.show_temp !== false && !!c.temp_entity;

    return this.renderSlot(html`
      ${c.label ? html`<h3 class="slot-title">${c.label}</h3>` : nothing}
      <div class="img-wrap ${gedreht ? "quadrat" : ""}">
        <div class="bild" style="${this._bildStil}">
          <img src="${deviceImage("uv", this._v("anschluss"))}" alt="UV-C-Lampe" />
          ${showGlow && configured && this.leuchtet ? this.renderGlow() : nothing}
        </div>

        ${showPowerBtn
          ? this.renderPowerButton({
              on: this.leuchtet,
              top: this._v("power_btn_top"),
              left: this._v("power_btn_left"),
              scale: this._v("power_btn_scale"),
            })
          : nothing}
        ${showPower
          ? this.renderValueBox({
              value: this.wattText(c.power_entity),
              unit: this._v("power_label") === false ? "" : "Watt",
              bottom: this._v("power_bottom"),
              left: this._v("power_left"),
              scale: this._v("power_scale"),
              box: this._v("power_box"),
              entity: c.power_entity,
            })
          : nothing}
        ${showTemp
          ? this.renderThermo({
              value: numText(this._ent(c.temp_entity)),
              top: this._v("temp_top"),
              left: this._v("temp_left"),
              scale: this._v("temp_scale"),
              entity: c.temp_entity,
            })
          : nothing}
        ${this.renderConfirm("UV-C-Lampe ausschalten?")}
      </div>
      ${configured
        ? nothing
        : html`<p class="slot-hint">
            UV-C-Lampe: bitte mindestens eine Entity wählen (Schalter, Leistung oder Temperatur).
          </p>`}
    `);
  }

  static styles = [
    frameStyles,
    overlayStyles,
    css`
      /* Ungedreht bleibt alles wie bei den anderen Geräten: der Kasten ist so
         hoch wie das Bild. Erst beim Drehen wird er quadratisch, damit die
         Ecken des gedrehten Bildes Platz haben. */
      .bild {
        position: relative;
        width: 100%;
        line-height: 0;
        transform-origin: center center;
      }
      .img-wrap.quadrat {
        aspect-ratio: 1 / 1;
        display: flex;
        align-items: center;
      }
      .glow {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        z-index: 2;
        background: radial-gradient(
          ellipse at center,
          rgba(203, 178, 255, 0.95) 0%,
          rgba(150, 140, 255, 0.72) 35%,
          rgba(104, 128, 255, 0.32) 65%,
          rgba(104, 128, 255, 0) 100%
        );
        filter: blur(0.35em);
      }
    `,
  ];
}

customElements.define("tomtut-pool-slot-uv", TomtutPoolSlotUv);
