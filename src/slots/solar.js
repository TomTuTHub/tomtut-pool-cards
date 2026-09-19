import { html, nothing } from "lit";
import { SlotBase } from "../shared/slot-base.js";
import { frameStyles, overlayStyles } from "../shared/styles.js";
import { deviceImage } from "../shared/assets.js";
import { numText } from "../shared/util.js";

/*
 * Slot "solar" — Solarabsorber / Solarheizung.
 *
 * Eine Solarheizung heizt nicht aktiv, sie schaltet nur den Wasserweg über
 * die Absorber frei. Entsprechend schlank ist der Slot; alle Entities sind
 * optional:
 *   switch_entity     Solarventil oder -pumpe — Powerbutton mit Rückfrage
 *   temp_in_entity    Vorlauf  (ins Feld) — Thermometer am unteren Stutzen
 *   temp_out_entity   Rücklauf (zurück ins Becken) — Thermometer am oberen
 *   power_entity      Leistung der Solarpumpe in W/kW — Watt-Box
 *
 * Welcher Stutzen welcher ist, sagt die Position: die beiden Thermometer
 * sitzen ab Werk an den zwei Rohrstutzen rechts im Bild (unten Vorlauf, oben
 * Rücklauf) und sind im Editor frei verschiebbar.
 */
export const SOLAR_DEFAULTS = {
  /* Powerbutton (oben links auf der Absorberfläche) */
  power_btn_top: 8,
  power_btn_left: 4,
  power_btn_scale: 110,
  /* Vorlauf — unterer Rohrstutzen rechts */
  temp_in_top: 84,
  temp_in_left: 76,
  temp_in_scale: 105,
  /* Rücklauf — oberer Rohrstutzen rechts */
  temp_out_top: 17,
  temp_out_left: 76,
  temp_out_scale: 105,
  /* Stromverbrauch (Solarpumpe) */
  power_bottom: 6,
  power_left: 30,
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

  /* Rendert immer — auch ohne hass und ohne eine einzige Entity. */
  render() {
    const c = this.config || {};
    const configured = solarHasEntity(c);
    const showPowerBtn = c.show_power_button !== false && !!c.switch_entity;
    const showIn = c.show_temp_in !== false && !!c.temp_in_entity;
    const showOut = c.show_temp_out !== false && !!c.temp_out_entity;
    const showPower = c.show_power !== false && !!c.power_entity;

    return this.renderSlot(html`
      ${c.label ? html`<h3 class="slot-title">${c.label}</h3>` : nothing}
      <div class="img-wrap">
        <img src="${deviceImage("solar")}" alt="Solarheizung" />

        ${showPowerBtn
          ? this.renderPowerButton({
              on: this._isOn(c.switch_entity),
              top: this._v("power_btn_top"),
              left: this._v("power_btn_left"),
              scale: this._v("power_btn_scale"),
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
        ${showIn
          ? this.renderThermo({
              value: numText(this._ent(c.temp_in_entity)),
              top: this._v("temp_in_top"),
              left: this._v("temp_in_left"),
              scale: this._v("temp_in_scale"),
              entity: c.temp_in_entity,
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

  static styles = [frameStyles, overlayStyles];
}

customElements.define("tomtut-pool-slot-solar", TomtutPoolSlotSolar);
