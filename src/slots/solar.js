import { html, css, nothing } from "lit";
import { SlotBase } from "../shared/slot-base.js";
import { frameStyles, overlayStyles } from "../shared/styles.js";
import { FLOW_MARKERS, imagePath } from "../shared/assets.js";
import { numText } from "../shared/util.js";

/*
 * Slot "solar" — Solarabsorber / Solarheizung.
 *
 * Eine Solarheizung heizt nicht aktiv, sie schaltet nur den Wasserweg über
 * die Absorber frei. Entsprechend schlank ist der Slot; alle Entities sind
 * optional:
 *   switch_entity     Solarventil oder -pumpe — Powerbutton mit Rückfrage
 *   temp_in_entity    Vorlauf  (ins Feld) — Thermometer am oberen Anschluss
 *   temp_out_entity   Rücklauf (zurück ins Becken) — am unteren Anschluss
 *   power_entity      Leistung der Solarpumpe in W/kW — Watt-Box
 *
 * Das Bild ist seit Iteration 7 keine einzelne Zeichnung mehr, sondern ein
 * FELD: drei OKU-Panels nebeneinander in Perspektive, zusammengesetzt von
 * tools/prepare-assets.py. Dazu kommen zwei statische Richtungsmarker —
 * blau am oberen Anschluss (kaltes Wasser hinein), rot am unteren (warmes
 * Wasser hinaus). Statisch ist Absicht: die Fliessrichtung eines Absorbers
 * kehrt sich nicht um, sie muss nur einmal erklärt werden.
 *
 * Die Thermometer sitzen ab Werk neben ihrem Pfeil (oben Vorlauf, unten
 * Rücklauf) und sind im Editor frei verschiebbar.
 */
export const SOLAR_DEFAULTS = {
  /* Powerbutton — freie Fläche auf dem hintersten Panel */
  power_btn_top: 45,
  power_btn_left: 8,
  power_btn_scale: 110,
  /* Richtungsmarker: blau oben hinein, rot unten hinaus */
  arrow_in_top: 20,
  arrow_in_left: 11,
  arrow_in_size: 6.5,
  arrow_out_top: 86,
  arrow_out_left: 82,
  arrow_out_size: 6.5,
  /* Vorlauf — oberer Anschluss, neben dem blauen Pfeil */
  temp_in_top: 21,
  temp_in_left: 32,
  temp_in_scale: 105,
  /* Rücklauf — unterer Anschluss, neben dem roten Pfeil */
  temp_out_top: 79,
  temp_out_left: 66,
  temp_out_scale: 105,
  /* Stromverbrauch (Solarpumpe) */
  power_bottom: 8,
  power_left: 33,
  power_scale: 100,
  power_box: true,
  power_label: true,
};

export const solarHasEntity = (c = {}) =>
  !!(c.switch_entity || c.temp_in_entity || c.temp_out_entity || c.power_entity);

export class TomtutPoolSlotSolar extends SlotBase {
  get defaults() {
    return SOLAR_DEFAULTS;
  }

  get powerEntityId() {
    return this.config?.switch_entity || null;
  }

  get powerConfirmText() {
    return `Die Solarheizung wird abgeschaltet — das Beckenwasser läuft dann nicht mehr über
      die Absorber. Bei voller Sonne steht das Wasser im abgesperrten Absorber und wird sehr
      heiß; nach dem Wiedereinschalten kommt kurz ein Schwall davon ins Becken.`;
  }

  /*
   * Ein Richtungsmarker. Das PNG zeigt bereits nach unten (gedreht beim
   * Bauen der Assets), hier wird es nur platziert — keine Animation, kein
   * Zustand, nichts, was sich bewegen könnte.
   */
  renderPfeil(welche) {
    const groesse = Number(this._v(`arrow_${welche}_size`));
    if (!(groesse > 0)) return nothing;
    return html`<img
      class="flow-arrow flow-${welche}"
      src="${imagePath(FLOW_MARKERS[welche])}"
      alt=""
      style="top:${this._v(`arrow_${welche}_top`)}%; left:${this._v(
        `arrow_${welche}_left`
      )}%; width:${groesse}%;"
    />`;
  }

  /* Rendert immer — auch ohne hass und ohne eine einzige Entity. */
  render() {
    const c = this.config || {};
    const configured = solarHasEntity(c);
    const showPowerBtn = c.show_power_button !== false && !!c.switch_entity;
    const showIn = c.show_temp_in !== false && !!c.temp_in_entity;
    const showOut = c.show_temp_out !== false && !!c.temp_out_entity;
    const showPower = c.show_power !== false && !!c.power_entity;
    const showArrows = c.show_arrows !== false;

    return this.renderSlot(html`
      ${c.label ? html`<h3 class="slot-title">${c.label}</h3>` : nothing}
      <div class="img-wrap">
        ${this.renderGeraeteBild({ kind: "solar", alt: "Solarheizung" })}
        ${showArrows ? html`${this.renderPfeil("in")}${this.renderPfeil("out")}` : nothing}

        ${showPowerBtn
          ? this.renderPowerButton({
              on: this._isOn(c.switch_entity),
              top: this._v("power_btn_top"),
              left: this._v("power_btn_left"),
              scale: this._v("power_btn_scale"),
            })
          : nothing}
        ${showIn
          ? this.renderThermo({
              value: numText(this._ent(c.temp_in_entity)),
              top: this._v("temp_in_top"),
              left: this._v("temp_in_left"),
              scale: this._v("temp_in_scale"),
              entity: c.temp_in_entity,
            })
          : nothing}
        ${showOut
          ? this.renderThermo({
              value: numText(this._ent(c.temp_out_entity)),
              top: this._v("temp_out_top"),
              left: this._v("temp_out_left"),
              scale: this._v("temp_out_scale"),
              entity: c.temp_out_entity,
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
        ${this.renderConfirm("Solarheizung abschalten?")}
      </div>
      ${configured
        ? nothing
        : html`<p class="slot-hint">
            Solarheizung: bitte mindestens eine Entity wählen (Ventil/Pumpe, Vorlauf, Rücklauf
            oder Leistung).
          </p>`}
    `);
  }

  static styles = [
    frameStyles,
    overlayStyles,
    css`
      /* Die Breite steht im Inline-Stil (Prozent der Bildbreite) und schlägt
         die 100 % der allgemeinen Bildregel; die Höhe folgt dem Motiv. */
      .img-wrap > img.flow-arrow {
        position: absolute;
        height: auto;
        max-width: none;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 3;
      }
    `,
  ];
}

customElements.define("tomtut-pool-slot-solar", TomtutPoolSlotSolar);
