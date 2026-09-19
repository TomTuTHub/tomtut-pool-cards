import { html, css, nothing } from "lit";
import { SlotBase } from "./shared/slot-base.js";
import { frameStyles, overlayStyles } from "./shared/styles.js";
import { shapeOf, imagePath, HERO_SPRITES } from "./shared/assets.js";
import { numText } from "./shared/util.js";

/*
 * Hero — das Becken mit seinen Overlays.
 *
 * Die Anker (Thermometer, pH, RX, Bodenablauf, Skimmer, Einlaufdüse) kommen
 * aus der Formen-Tabelle in shared/assets.js und lassen sich pro Card
 * überschreiben. Eine neue Form braucht daher nur ein PNG + einen
 * Tabelleneintrag, keinen Code hier.
 *
 * Skimmer, Einlaufdüse und Bodenablauf sind seit Iteration 5 eigene Sprites
 * (HERO_SPRITES) statt Teil der Zeichnung: sie liegen auf der Wasserfläche,
 * bleiben einzeln abwählbar und gelten für alle Formen gleichermaßen.
 *
 * Auch der Freitext hängt seit Iteration 4 an der Form (`label_anker`): sein
 * Platz ist oben mittig über der Wasserfläche, und die liegt je nach Becken
 * unterschiedlich hoch im Bild.
 *
 * Farben kommen ausschließlich aus `frame.fill` (siehe shared/styles.js);
 * ein früheres `box_color` in einer alten Config wird ignoriert.
 */
export const HERO_DEFAULTS = {
  thermo_scale: 133,
  label_scale: 100,
  /* Rückfall, falls eine Form (noch) keinen gemessenen Freitext-Anker hat */
  label_top: 3,
  label_left: 50,
  /* Sprite-Größen: Breite in Prozent der Beckenbreite */
  skimmer_size: HERO_SPRITES.skimmer.groesse,
  inlet_size: HERO_SPRITES.einlauf.groesse,
  drain_size: HERO_SPRITES.drain.groesse,
};

/* Effektive Anker einer Form — auch der Editor initialisiert damit seine Regler */
export const heroDefaultsFor = (shapeName) => {
  const s = shapeOf(shapeName);
  const anker = {};
  for (const sprite of Object.values(HERO_SPRITES)) {
    const a = s[sprite.anker];
    if (!a) continue;
    anker[`${sprite.anker}_top`] = a.top;
    anker[`${sprite.anker}_left`] = a.left;
  }
  return {
    ...HERO_DEFAULTS,
    thermo_top: s.thermo.top,
    thermo_left: s.thermo.left,
    ph_top: s.ph.top,
    ph_left: s.ph.left,
    rx_top: s.rx.top,
    rx_left: s.rx.left,
    ...anker,
    label_top: s.label_anker?.top ?? HERO_DEFAULTS.label_top,
    label_left: s.label_anker?.left ?? HERO_DEFAULTS.label_left,
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
        ${this._sprites()}

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

  /*
   * Zubehör auf dem Becken (Skimmer, Einlaufdüse, Bodenablauf).
   *
   * Jedes Sprite hängt an seinem Anker der Form, ist einzeln an-/abwählbar
   * (`show_skimmer`, `show_inlet`, `show_drain`) und in der Größe verstellbar
   * (`*_size` = Breite in Prozent der Beckenbreite). Es liegt über der
   * Wasserfläche, aber unter Thermometer, pH/RX und Freitext.
   */
  _sprites() {
    const c = this.config || {};
    return Object.values(HERO_SPRITES).map((sprite) => {
      const gesetzt = c[`show_${sprite.anker}`];
      const an = gesetzt === undefined || gesetzt === null ? sprite.standard : gesetzt !== false;
      if (!an) return nothing;
      const groesse = Number(this._v(`${sprite.anker}_size`));
      const breite = groesse > 0 ? groesse : sprite.groesse;
      return html`<img
        class="hero-sprite sprite-${sprite.anker}"
        src="${imagePath(sprite.file)}"
        alt=""
        style="top:${this._anchor(sprite.anker, "top")}%; left:${this._anchor(
          sprite.anker,
          "left"
        )}%; width:${breite}%;"
      />`;
    });
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
