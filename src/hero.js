import { html, css, nothing } from "lit";
import { SlotBase, slotLabel } from "./shared/slot-base.js";
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
 * Lage des Einlauf-Kästchens gegenüber dem Düsen-Sprite (Prozentpunkte des
 * Bildes). Seit Iteration 22 (Bug A9) hängt es mit seiner OBERKANTE `top`
 * Punkte unter der Unterkante der Düse, um `left` Punkte versetzt — so
 * verdeckt es die Düse in keiner Breite, egal wie hoch das Kästchen gerade
 * ist. Vorher (Mitte 8/11 neben der Mitte der Düse) lag es rechts unten AUF
 * der Düse und bei Oval/Rechteck zum Teil auf dem Bodenablauf. Der
 * Render-Test misst das für alle sechs Formen in drei Breiten.
 * Wird die Düse verschoben, wandert das Kästchen mit. Eigene Werte
 * (inlet_temp_top/-_left) gelten wie bisher als Mitte des Kästchens.
 */
export const INLET_TEMP_VERSATZ = { top: 2, left: -2.5 };

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
    /* Startwerte der Regler im Editor (Mitte des Kästchens, ungefähr); beim
       Rendern hängt es ohne eigene Werte unter der Düse (einlaufLage) */
    inlet_temp_top: (s.inlet?.top ?? 12) + 17,
    inlet_temp_left: (s.inlet?.left ?? 66) + INLET_TEMP_VERSATZ.left,
    label_top: s.label_anker?.top ?? HERO_DEFAULTS.label_top,
    label_left: s.label_anker?.left ?? HERO_DEFAULTS.label_left,
  };
};

export class TomtutPoolHero extends SlotBase {
  get defaults() {
    return heroDefaultsFor(this.config?.shape);
  }

  /*
   * Wo sitzt das Einlauf-Kästchen? Mit eigenen Werten wie bisher (Mitte);
   * sonst unter der Düse, wie sie tatsächlich liegt (geklemmt, teilLage) —
   * wer das Sprite verschiebt, nimmt das Kästchen mit.
   */
  _einlaufLage() {
    const c = this.config || {};
    const eigen = (k) => (c[k] === undefined || c[k] === null || c[k] === "" ? null : Number(c[k]));
    const duese = teilLage(c, HERO_SPRITES.einlauf, "voll");
    const halb = (duese.breite * shapeRatio(c.shape)) / (HERO_SPRITES.einlauf.ratio || 1) / 2;
    const top = eigen("inlet_temp_top");
    const left = eigen("inlet_temp_left");
    return {
      unter: top === null,
      top: top ?? Math.round((duese.top + halb + INLET_TEMP_VERSATZ.top) * 100) / 100,
      left: left ?? Math.round((duese.left + INLET_TEMP_VERSATZ.left) * 100) / 100,
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
        ${showInletTemp ? this._einlaufBox() : nothing}
        ${slotLabel(c)
          ? html`<div
              class="label-badge"
              style="top:${this._v("label_top")}%; left:${this._v(
                "label_left"
              )}%; transform:translateX(-50%) scale(${(this._v("label_scale") ?? 100) / 100}); max-width:${this._labelMax()}%;"
              title="${slotLabel(c)}"
            >
              ${slotLabel(c)}
            </div>`
          : nothing}
      </div>
    `;

    return framed
      ? this.renderSlot(body)
      : html`<div class="${this._frameClasses} bare">${body}</div>`;
  }

  /* Freitext nie breiter als das Becken (Iteration 22, Bug A4) */
  _labelMax() {
    const s = (Number(this._v("label_scale")) || 100) / 100;
    const l = Math.min(100, Math.max(0, Number(this._v("label_left")) || 0));
    return Math.max(10, Math.round(((Math.min(l, 100 - l) * 2 - 2) / s) * 10) / 10);
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

  _einlaufBox() {
    const l = this._einlaufLage();
    return this._chemBox("Zulauf", this.config.inlet_temp_entity, l.top, l.left, `inlet-temp${l.unter ? " unter-duese" : ""}`);
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
      /* Oberkante an der Düse statt Mitte (Iteration 22, Bug A9) */
      .chem-box.inlet-temp.unter-duese {
        transform: translate(-50%, 0);
      }
    `,
  ];
}

customElements.define("tomtut-pool-hero", TomtutPoolHero);
