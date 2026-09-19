import { html, nothing } from "lit";
import { SlotBase } from "../shared/slot-base.js";
import { frameStyles, overlayStyles } from "../shared/styles.js";
import { deviceImage } from "../shared/assets.js";
import { numText } from "../shared/util.js";

/*
 * Slot "inlet" — Einlaufdüse.
 *
 * Der schlankeste Slot der Sammlung, und das mit Absicht: eine Einlaufdüse
 * hat nichts zu schalten und nichts zu messen außer dem, was durch sie
 * hindurchfließt. Es gibt deshalb genau eine Entity:
 *   temp_entity   Temperatur des einströmenden Wassers — Thermometer an der
 *                 Düsenöffnung
 *
 * Dieselbe Zeichnung sitzt als Sprite auch auf dem Becken (siehe hero.js);
 * hier im Slot zeigt sie groß, was gerade ins Becken läuft.
 */
export const INLET_DEFAULTS = {
  /* Thermometer — auf der Düsenöffnung */
  temp_top: 50,
  temp_left: 28,
  temp_scale: 115,
};

export const inletHasEntity = (c = {}) => !!c.temp_entity;

export class TomtutPoolSlotInlet extends SlotBase {
  get defaults() {
    return INLET_DEFAULTS;
  }

  /* Rendert immer — auch ohne hass und ohne Entity. */
  render() {
    const c = this.config || {};
    const configured = inletHasEntity(c);
    const showTemp = c.show_temp !== false && !!c.temp_entity;

    return this.renderSlot(html`
      ${c.label ? html`<h3 class="slot-title">${c.label}</h3>` : nothing}
      <div class="img-wrap">
        <img src="${deviceImage("inlet")}" alt="Einlaufdüse" />
        ${showTemp
          ? this.renderThermo({
              value: numText(this._ent(c.temp_entity)),
              top: this._v("temp_top"),
              left: this._v("temp_left"),
              scale: this._v("temp_scale"),
              entity: c.temp_entity,
            })
          : nothing}
      </div>
      ${configured
        ? nothing
        : html`<p class="slot-hint">
            Einlaufdüse: bitte den Temperaturfühler des einströmenden Wassers wählen.
          </p>`}
    `);
  }

  static styles = [frameStyles, overlayStyles];
}

customElements.define("tomtut-pool-slot-inlet", TomtutPoolSlotInlet);
