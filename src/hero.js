import { html, css, nothing } from "lit";
import { SlotBase } from "./shared/slot-base.js";
import { frameStyles, overlayStyles } from "./shared/styles.js";
import { shapeOf, imagePath } from "./shared/assets.js";
import { numText } from "./shared/util.js";

/*
 * Hero — das Becken mit seinen Overlays.
 *
 * Die Anker (Thermometer, pH, RX, Bodenablauf) kommen aus der Formen-Tabelle
 * in shared/assets.js und lassen sich pro Card überschreiben. Eine neue Form
 * braucht daher nur ein PNG + einen Tabelleneintrag, keinen Code hier.
 *
 * Bodenablauf: der Anker ist vorgesehen, das Sprite fehlt noch — bis dahin
 * wird bewusst nichts gerendert (kein Platzhalter-Kästchen im Bild).
 *
 * Farben kommen ausschließlich aus `frame.fill` (siehe shared/styles.js);
 * ein früheres `box_color` in einer alten Config wird ignoriert.
 */
export const HERO_DEFAULTS = {
  thermo_scale: 133,
  /* Freitext-Badge — die Defaults sind die bisherige feste Position,
     damit bestehende Configs unverändert aussehen. */
  label_top: 3,
  label_left: 50,
  label_scale: 100,
};

/* Effektive Anker einer Form — auch der Editor initialisiert damit seine Regler */
export const heroDefaultsFor = (shapeName) => {
  const s = shapeOf(shapeName);
  return {
    ...HERO_DEFAULTS,
    thermo_top: s.thermo.top,
    thermo_left: s.thermo.left,
    ph_top: s.ph.top,
    ph_left: s.ph.left,
    rx_top: s.rx.top,
    rx_left: s.rx.left,
  };
};

export class TomtutPoolHero extends SlotBase {
  get defaults() {
    return heroDefaultsFor(this.config?.shape);
  }

  get shape() {
    return shapeOf(this.config?.shape);
  }

  /* Anker aus der Formen-Tabelle, per Config überschreibbar */
  _anchor(name, axis) {
    const key = `${name}_${axis}`;
    const v = this.config?.[key];
    if (v !== undefined && v !== null && v !== "") return Number(v);
    return this.shape[name]?.[axis] ?? 50;
  }

  render() {
    const c = this.config || {};
    const shape = this.shape;
    const framed = c.framed === true;
    const showThermo = c.show_thermo !== false && !!c.temp_entity;
    const showPh = c.show_ph !== false && !!c.ph_entity;
    const showRx = c.show_rx !== false && !!c.rx_entity;

    const body = html`
      <div class="img-wrap">
        <img src="${imagePath(shape.file)}" alt="Pool ${shape.label}" />

        ${showThermo
          ? this.renderThermo({
              value: numText(this._ent(c.temp_entity)),
              top: this._anchor("thermo", "top"),
              left: this._anchor("thermo", "left"),
              scale: this._v("thermo_scale"),
              entity: c.temp_entity,
            })
          : nothing}
        ${showPh
          ? this._chemBox("pH", c.ph_entity, this._anchor("ph", "top"), this._anchor("ph", "left"))
          : nothing}
        ${showRx
          ? this._chemBox("RX", c.rx_entity, this._anchor("rx", "top"), this._anchor("rx", "left"))
          : nothing}
        ${c.label_text
          ? html`<div
              class="label-badge"
              style="top:${this._v("label_top")}%; left:${this._v(
                "label_left"
              )}%; transform:translateX(-50%) scale(${(this._v("label_scale") ?? 100) / 100});"
            >
              ${c.label_text}
            </div>`
          : nothing}
      </div>
    `;

    return framed
      ? this.renderSlot(body)
      : html`<div class="${this._frameClasses} bare">${body}</div>`;
  }

  _chemBox(key, entity, top, left) {
    const ent = this._ent(entity);
    return html`
      <div
        class="chem-box"
        style="top:${top}%; left:${left}%;"
        data-entity="${entity}"
        @click="${this._moreInfo}"
      >
        <span class="chem-key">${key}</span>
        <span class="chem-val">${numText(ent)}</span>
      </div>
    `;
  }

  static styles = [
    frameStyles,
    overlayStyles,
    css`
      .slot.bare {
        border: none;
        padding: 0;
      }
    `,
  ];
}

customElements.define("tomtut-pool-hero", TomtutPoolHero);
