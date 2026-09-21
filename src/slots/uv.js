import { html, css, nothing } from "lit";
import { SlotBase } from "../shared/slot-base.js";
import { frameStyles, overlayStyles } from "../shared/styles.js";
import { deviceRatio } from "../shared/assets.js";
import { numText } from "../shared/util.js";

/* Weiterhin hier exportiert, damit die Paket-Oberfläche gleich bleibt;
   gerechnet wird in shared/bild.js (gilt für alle Slots). */
export { normGrad, passFaktor } from "../shared/bild.js";

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
 *   1. Glüheffekt — läuft die Lampe, liegt ein blau-violetter Schein über
 *      dem Rohrkörper. Seit Iteration 9 "atmet" er sanft (`glow_pulse`,
 *      0 = aus): der Kern glimmt leicht auf und ab, darüber wabert ein
 *      weicher Hof mit anderer Periode — dadurch wirkt es organisch statt
 *      getaktet. Kein Blinken: der Kern fällt höchstens um ein Fünftel ab,
 *      der Hof kommt nur dazu. Bei prefers-reduced-motion steht alles.
 *   2. Drehen/Spiegeln/Größe — die Lampe sitzt je nach Anlage andersherum
 *      im Strang und darf im Kasten kleiner stehen (`uv_size`, 30–100 %).
 *      Gedreht wird das Bild samt Glühen; Thermometer, Watt-Box und
 *      Powerbutton bleiben aufrecht und damit lesbar.
 *
 * Der Bildkasten ist dabei derselbe wie bei jedem anderen Geräte-Slot und
 * ändert seine Größe durch das Drehen NICHT (shared: renderGeraeteBild) —
 * das gedrehte Bild wird stattdessen so weit verkleinert, dass es hineinpasst.
 *
 * Die Positions-Defaults sind am Artwork vermessen (Rohrmitte, Neigung des
 * Rohrs ≈ −15°) und im Editor frei verschiebbar. Powerbutton und Glühen
 * stehen seit Iteration 7 auf Thomas' eigenen Werten aus der Test-Anlage.
 */
export const UV_DEFAULTS = {
  /* Bild — 100 % ist der Zustand vor Iteration 7: so groß wie es passt */
  anschluss: "seite",
  rotate: 0,
  mirror: false,
  uv_size: 100,
  /* Powerbutton */
  power_btn_top: 30,
  power_btn_left: 11,
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
  glow_top: 35,
  glow_left: 56,
  glow_size: 40,
  glow_thickness: 13,
  glow_angle: -15,
  glow_intensity: 80,
  /* Wabern/Glimmen, 0 = aus (statisch wie vor Iteration 9) */
  glow_pulse: 40,
};

export const uvHasEntity = (c = {}) => !!(c.switch_entity || c.power_entity || c.temp_entity);

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

  /*
   * Der Glühbereich ist eine liegende Ellipse auf dem Rohr. Seine Höhe steht
   * in Prozent der Bildhöhe, gesetzt wird sie aber über `aspect-ratio`:
   * prozentuale Höhen würden sich auf den Wrapper beziehen und beim Drehen
   * mitwandern.
   */
  renderGlow() {
    const laenge = Number(this._v("glow_size")) || 0;
    const dicke = Number(this._v("glow_thickness")) || 0;
    if (laenge <= 0 || dicke <= 0) return nothing;
    const verhaeltnis = Math.round(((laenge * deviceRatio("uv")) / dicke) * 1000) / 1000;
    const roh = Number(this._v("glow_intensity"));
    const staerke = Math.min(100, Math.max(0, isFinite(roh) ? roh : 80)) / 100;
    const pulsRoh = Number(this._v("glow_pulse"));
    const puls = Math.min(100, Math.max(0, isFinite(pulsRoh) ? pulsRoh : 0)) / 100;
    const stil = [
      `top:${this._v("glow_top")}%`,
      `left:${this._v("glow_left")}%`,
      `width:${laenge}%`,
      `aspect-ratio:${verhaeltnis}`,
      `opacity:${staerke}`,
      `transform:translate(-50%, -50%) rotate(${Number(this._v("glow_angle")) || 0}deg)`,
      `--glow-pulse:${Math.round(puls * 100) / 100}`,
    ].join("; ");
    return html`<div class="glow ${puls > 0 ? "wabert" : "ruhig"}" style="${stil};"></div>`;
  }

  /* Rendert immer — auch ohne hass und ohne eine einzige Entity. */
  render() {
    const c = this.config || {};
    const configured = uvHasEntity(c);

    const showGlow = c.show_glow !== false;
    const showPowerBtn = c.show_power_button !== false && !!c.switch_entity;
    const showPower = c.show_power !== false && !!c.power_entity;
    const showTemp = c.show_temp !== false && !!c.temp_entity;

    return this.renderSlot(html`
      ${c.label ? html`<h3 class="slot-title">${c.label}</h3>` : nothing}
      <div class="img-wrap">
        ${this.renderGeraeteBild({
          kind: "uv",
          variante: this._v("anschluss"),
          alt: "UV-C-Lampe",
          rotate: this._v("rotate"),
          mirror: this._v("mirror") === true,
          groesse: this._v("uv_size"),
          inhalt: showGlow && configured && this.leuchtet ? this.renderGlow() : nothing,
        })}

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
      /*
       * Der Schein besteht aus drei Lagen:
       *   .glow         Kern — exakt der Verlauf von vorher (Deckkraft über
       *                 den Inline-Stil = Leuchtstärke)
       *   .glow::before derselbe Kern noch einmal, glimmt auf und ab
       *   .glow::after  weicher Hof, größer, wabert mit anderer Periode
       * Zwei ungleiche Perioden (5,3 s / 3,7 s) überlagern sich zu einem
       * Muster, das sich erst nach Minuten wiederholt — organisch statt
       * Metronom. Die Stärke kommt aus --glow-pulse (0..1).
       */
      .glow {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        background: radial-gradient(
          ellipse at center,
          rgba(203, 178, 255, 0.95) 0%,
          rgba(150, 140, 255, 0.72) 35%,
          rgba(104, 128, 255, 0.32) 65%,
          rgba(104, 128, 255, 0) 100%
        );
        filter: blur(0.35em);
      }
      .glow.wabert::before,
      .glow.wabert::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 50%;
        pointer-events: none;
      }
      .glow.wabert::before {
        background: inherit;
        opacity: 0;
        animation: uvGlimmen 5.3s ease-in-out infinite;
      }
      .glow.wabert::after {
        inset: -18% -8%;
        background: radial-gradient(
          ellipse at center,
          rgba(190, 160, 255, 0.75) 0%,
          rgba(130, 120, 255, 0.35) 45%,
          rgba(104, 128, 255, 0) 100%
        );
        filter: blur(0.5em);
        opacity: 0;
        animation: uvWabern 3.7s ease-in-out infinite alternate;
      }
      @keyframes uvGlimmen {
        0% {
          opacity: calc(var(--glow-pulse, 0) * 0.55);
        }
        23% {
          opacity: calc(var(--glow-pulse, 0) * 0.15);
        }
        41% {
          opacity: calc(var(--glow-pulse, 0) * 0.45);
        }
        67% {
          opacity: 0;
        }
        84% {
          opacity: calc(var(--glow-pulse, 0) * 0.35);
        }
        100% {
          opacity: calc(var(--glow-pulse, 0) * 0.55);
        }
      }
      @keyframes uvWabern {
        0% {
          opacity: calc(var(--glow-pulse, 0) * 0.2);
          transform: scale(0.97, 0.94);
        }
        55% {
          opacity: calc(var(--glow-pulse, 0) * 0.7);
          transform: scale(1.03, 1.08);
        }
        100% {
          opacity: calc(var(--glow-pulse, 0) * 0.95);
          transform: scale(1.06, 1.14);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .glow.wabert::before,
        .glow.wabert::after {
          animation: none;
        }
      }
    `,
  ];
}

customElements.define("tomtut-pool-slot-uv", TomtutPoolSlotUv);
