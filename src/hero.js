import { html, css, nothing } from "lit";
import { SlotBase } from "./shared/slot-base.js";
import { frameStyles, overlayStyles } from "./shared/styles.js";
import { shapeOf, imagePath } from "./shared/assets.js";
import { stateText } from "./shared/util.js";

/*
 * Hero — das Becken mit seinen Overlays.
 *
 * Die Anker (Thermometer, pH, RX, Bodenablauf) kommen aus der Formen-Tabelle
 * in shared/assets.js und lassen sich pro Card ueberschreiben. Eine neue Form
 * braucht daher nur ein PNG + einen Tabelleneintrag, keinen Code hier.
 *
 * Bodenablauf: der Anker ist vorgesehen, das Sprite fehlt noch — bis dahin
 * wird bewusst nichts gerendert (kein Platzhalter-Kaestchen im Bild).
 */
export const HERO_DEFAULTS = {
  thermo_scale: 100,
  box_color: "weiss",
};

export class TomtutPoolHero extends SlotBase {
  get defaults() {
    return HERO_DEFAULTS;
  }

  get shape() {
    return shapeOf(this.config?.shape);
  }

  /* Anker aus der Formen-Tabelle, per Config ueberschreibbar */
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
    const boxDark = this._v("box_color") === "schwarz";
    const boxVars = boxDark
      ? "--thermo-bg:rgba(30,30,30,0.9); --thermo-fg:#fff;"
      : "--thermo-bg:rgba(255,255,255,0.92); --thermo-fg:#111;";

    const body = html`
      <div class="img-wrap" style="${boxVars}">
        <img src="${imagePath(shape.file)}" alt="Pool ${shape.label}" />

        ${c.temp_entity
          ? this.renderThermo({
              value: stateText(this._ent(c.temp_entity)),
              top: this._anchor("thermo", "top"),
              left: this._anchor("thermo", "left"),
              scale: this._v("thermo_scale"),
              entity: c.temp_entity,
            })
          : nothing}
        ${c.ph_entity
          ? this._chemBox("pH", c.ph_entity, this._anchor("ph", "top"), this._anchor("ph", "left"))
          : nothing}
        ${c.rx_entity
          ? this._chemBox("RX", c.rx_entity, this._anchor("rx", "top"), this._anchor("rx", "left"))
          : nothing}
        ${c.label_text
          ? html`<div
              class="label-badge"
              style="top:${c.label_top ?? 3}%; left:${c.label_left ??
              50}%; transform:translateX(-50%);"
            >
              ${c.label_text}
            </div>`
          : nothing}
      </div>
    `;

    return framed ? this.renderSlot(body) : html`<div class="slot bare">${body}</div>`;
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
        <span class="chem-val">${stateText(ent)}</span>
      </div>
    `;
  }

  static styles = [
    frameStyles,
    overlayStyles,
    css`
      .slot.bare {
        border: none;
        background: none;
        padding: 0;
      }
    `,
  ];
}

customElements.define("tomtut-pool-hero", TomtutPoolHero);
