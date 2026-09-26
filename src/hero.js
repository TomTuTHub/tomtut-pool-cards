import { html, css, nothing } from "lit";
import { SlotBase } from "./shared/slot-base.js";
import { frameStyles, overlayStyles } from "./shared/styles.js";
import { shapeOf, shapeRatio, imagePath, HERO_SPRITES } from "./shared/assets.js";
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
 * Seit Iteration 6 kann die Einlaufdüse zusätzlich zeigen, was gerade ins
 * Becken läuft: `inlet_temp_entity` rendert ein Kästchen im Stil von pH/RX
 * direkt neben dem Sprite. Den eigenen Einlaufdüsen-Slot gibt es nicht mehr.
 *
 * Auch der Freitext hängt seit Iteration 4 an der Form (`label_anker`): sein
 * Platz ist oben mittig über der Wasserfläche, und die liegt je nach Becken
 * unterschiedlich hoch im Bild.
 *
 * Farben kommen ausschließlich aus `frame.fill` (siehe shared/styles.js);
 * ein früheres `box_color` in einer alten Config wird ignoriert.
 */
/*
 * Versatz des Einlauf-Kästchens gegenüber dem Düsen-Sprite (Prozentpunkte
 * des Bildes): rechts daneben und ein Stück tiefer, damit es weder die Düse
 * noch die hintere Beckenkante verdeckt. Wird die Düse verschoben, wandert
 * das Kästchen mit — es sei denn, es hat eigene Werte in der Config.
 */
export const INLET_TEMP_VERSATZ = { top: 8, left: 11 };

/*
 * Lage der Becken-Teile (Iteration 20) — EINE Rechnung für volle Ansicht
 * und Mini. Schlüssel aus dem Bestand:
 *   voll  <anker>_top / <anker>_left / <anker>_size       (anker = skimmer|inlet|drain)
 *   mini  mini_<anker>_top / mini_<anker>_left / mini_<anker>_size
 * Fehlt ein Mini-Wert, gilt der Voll-Wert (= Verhalten vor Iteration 20),
 * fehlt der, der Anker der Beckenform. `size` = Breite in % der Beckenbreite.
 * Geklemmt wird so, dass das Teil vollständig in der Beckenbild-Fläche
 * bleibt (Höhe über das Seitenverhältnis von Becken und Teil).
 */
export const TEIL_GROESSE_MIN = 2;
export const TEIL_GROESSE_MAX = 40;
const zahl = (v) => (v === undefined || v === null || v === "" || !isFinite(Number(v)) ? null : Number(v));
const klemm = (v, min, max) => Math.min(max, Math.max(min, v));

export const teilLage = (config = {}, sprite, modus = "voll") => {
  const c = config || {};
  const a = sprite.anker;
  const form = shapeOf(c.shape);
  const voll = (achse) => zahl(c[`${a}_${achse}`]) ?? form[a]?.[achse] ?? 50;
  const wert = (achse) => (modus === "mini" ? zahl(c[`mini_${a}_${achse}`]) ?? voll(achse) : voll(achse));
  const g = modus === "mini" ? zahl(c[`mini_${a}_size`]) ?? zahl(c[`${a}_size`]) : zahl(c[`${a}_size`]);
  const breite = klemm(g !== null && g > 0 ? g : sprite.groesse, TEIL_GROESSE_MIN, TEIL_GROESSE_MAX);
  /* Höhe des Teils in % der Beckenhöhe */
  const hoehe = (breite * shapeRatio(c.shape)) / (sprite.ratio || 1);
  const r = (x) => Math.round(x * 100) / 100;
  return {
    left: r(klemm(wert("left"), breite / 2, 100 - breite / 2)),
    top: r(klemm(wert("top"), Math.min(50, hoehe / 2), Math.max(50, 100 - hoehe / 2))),
    breite: r(breite),
  };
};

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
    /* Startwerte der Regler im Editor; beim Rendern folgt das Kästchen der
       tatsächlichen Düsenposition (siehe defaults-Getter unten). */
    inlet_temp_top: (s.inlet?.top ?? 12) + INLET_TEMP_VERSATZ.top,
    inlet_temp_left: (s.inlet?.left ?? 66) + INLET_TEMP_VERSATZ.left,
    label_top: s.label_anker?.top ?? HERO_DEFAULTS.label_top,
    label_left: s.label_anker?.left ?? HERO_DEFAULTS.label_left,
  };
};

export class TomtutPoolHero extends SlotBase {
  get defaults() {
    return {
      ...heroDefaultsFor(this.config?.shape),
      /* an der Düse festgemacht, nicht an der Form: wer das Sprite
         verschiebt, nimmt das Kästchen mit */
      inlet_temp_top: this._anchor("inlet", "top") + INLET_TEMP_VERSATZ.top,
      inlet_temp_left: this._anchor("inlet", "left") + INLET_TEMP_VERSATZ.left,
    };
  }

  /*
   * Ist ein Becken-Sprite eingeschaltet? Ohne Angabe gilt sein Standard
   * (Skimmer und Einlaufdüse an, Bodenablauf aus).
   */
  _spriteAn(anker) {
    const sprite = Object.values(HERO_SPRITES).find((x) => x.anker === anker);
    const gesetzt = this.config?.[`show_${anker}`];
    return gesetzt === undefined || gesetzt === null ? !!sprite?.standard : gesetzt !== false;
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
    /* Die Einlauftemperatur hängt am Sprite: keine Düse, kein Kästchen. */
    const showInletTemp = !!c.inlet_temp_entity && this._spriteAn("inlet");

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
        ${showInletTemp
          ? this._chemBox(
              "Zulauf",
              c.inlet_temp_entity,
              this._v("inlet_temp_top"),
              this._v("inlet_temp_left"),
              "inlet-temp"
            )
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
    return Object.values(HERO_SPRITES).map((sprite) => {
      if (!this._spriteAn(sprite.anker)) return nothing;
      const l = teilLage(this.config, sprite, "voll");
      return html`<img
        class="hero-sprite sprite-${sprite.anker}"
        src="${imagePath(sprite.file)}"
        alt=""
        style="top:${l.top}%; left:${l.left}%; width:${l.breite}%;"
      />`;
    });
  }

  _chemBox(key, entity, top, left, extra = "") {
    const ent = this._ent(entity);
    return html`
      <div
        class="chem-box ${extra}"
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
