import { html, css, nothing } from "lit";
import { SlotBase, slotLabel } from "../shared/slot-base.js";
import { frameStyles, overlayStyles } from "../shared/styles.js";
import { FLOW_MARKERS, imagePath } from "../shared/assets.js";
import { numText, isOn, istAktivText } from "../shared/util.js";

/*
 * Slot "solar" — Solarabsorber / Solarheizung.
 *
 * Eine Solarheizung heizt nicht aktiv, sie schaltet nur den Wasserweg über
 * die Absorber frei. Entsprechend schlank ist der Slot; alle Entities sind
 * optional:
 *   switch_entity     Solarventil oder -pumpe — Powerbutton mit Rückfrage
 *   temp_in_entity    Vorlauf  (ins Feld) — Thermometer am Zulauf links unten
 *   temp_out_entity   Rücklauf (zurück ins Becken) — am Ablauf rechts oben
 *   power_entity      Leistung der Solarpumpe in W/kW — Watt-Box
 *
 * Das Bild ist seit Iteration 7 keine einzelne Zeichnung mehr, sondern ein
 * FELD: drei OKU-Panels nebeneinander in Perspektive, zusammengesetzt von
 * tools/prepare-assets.py. Quelle ist Selinas handgezeichnetes Panel
 * (OKU_Panel.png) — Iteration 9 hatte kurz Thomas' Echtfoto OKU.png, seit
 * Iteration 13 ist die Card wieder durchgehend im Zeichenstil. Die
 * Komposition und damit alle Overlay-Defaults unten sind gleich geblieben
 * (beide Motive haben praktisch dasselbe Seitenverhaeltnis).
 * Dazu kommen zwei statische Richtungsmarker, beide waagerecht nach rechts
 * (seit Iteration 14, vorher senkrecht nach unten): blau links unten am
 * ersten Panel (kaltes Wasser hinein), rot rechts oben am dritten (warmes
 * Wasser hinaus) — so wie ein Absorberfeld tatsaechlich durchstroemt wird,
 * von unten nach oben quer durchs Feld. Statisch ist Absicht: die
 * Fliessrichtung eines Absorbers kehrt sich nicht um.
 *
 * Die Thermometer sitzen ab Werk neben ihrem Pfeil (links unten Vorlauf,
 * rechts oben Rücklauf) und sind im Editor frei verschiebbar. Die Watt-Box
 * ist dafür ein Stück nach rechts gerückt (33 -> 42 %), damit sie auch in
 * schmalen Spalten nicht am Vorlauf-Wert klebt.
 */
export const SOLAR_DEFAULTS = {
  /* Powerbutton — freie Fläche auf dem hintersten Panel */
  power_btn_top: 45,
  power_btn_left: 8,
  power_btn_scale: 110,
  /* Richtungsmarker (waagerecht, Spitze nach rechts): blau links unten
     hinein, rot rechts oben hinaus. size = Pfeillänge in % der Bildbreite. */
  arrow_in_top: 86,
  arrow_in_left: 8,
  arrow_in_size: 12,
  arrow_out_top: 12.5,
  arrow_out_left: 91,
  arrow_out_size: 12,
  /* Vorlauf — Zulauf links unten, über dem blauen Pfeil */
  temp_in_top: 70,
  temp_in_left: 14,
  temp_in_scale: 105,
  /* Rücklauf — Ablauf rechts oben, unter dem roten Pfeil */
  temp_out_top: 25,
  temp_out_left: 72,
  temp_out_scale: 105,
  /* Stromverbrauch (Solarpumpe) */
  power_bottom: 8,
  power_left: 42,
  power_scale: 100,
  power_box: true,
  power_label: true,
};

/*
 * Läuft die Solarheizung gerade (Iteration 18)? Mit `active_entity`
 * (z.B. binary_sensor "Motorventil AN") zählt, ob das Wasser tatsächlich
 * übers Feld läuft — eine eingeschaltete Solarsteuerung kann auch auf
 * Bypass stehen. Ohne sie: der Schalter. Rückgabe true/false, null =
 * unbekannt oder nichts konfiguriert.
 */
export const solarAktiv = (c = {}, hass) => {
  for (const id of [c.active_entity, c.switch_entity]) {
    if (!id) continue;
    const e = hass?.states?.[id];
    const s = String(e?.state ?? "").toLowerCase();
    if (!e || ["", "unknown", "unavailable"].includes(s)) return null;
    /* Rückmeldung darf Klartext sein, z.B. input_select "Heizen"/"Bypass"
       (Iteration 22, Bug A21 — vorher zählte nur "on") */
    return id === c.active_entity ? istAktivText(s) : isOn(s);
  }
  return null;
};

/*
 * Zustand der Solarheizung (Iteration 19c) — die EINE Regel für Mini und
 * Voll: aktiv wie solarAktiv; bypass = Steuerung (switch_entity) an, aber
 * das Wasser läuft laut active_entity nicht übers Feld. Dann: Powerbutton
 * bernstein "Steuerung an / Bypass", Panels entsättigt, Pfeile blass.
 */
export const solarZustand = (c = {}, hass) => {
  const aktiv = solarAktiv(c, hass);
  const sw = hass?.states?.[c.switch_entity];
  const steuerungAn = !!sw && isOn(String(sw.state).toLowerCase());
  return { aktiv, bypass: !!c.active_entity && steuerungAn && aktiv === false };
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
   * Ein Richtungsmarker. Das PNG zeigt bereits nach rechts (gedreht beim
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
    const zustand = solarZustand(c, this.hass);
    /* läuft nicht (aus oder Bypass): Panels dezent entsättigt, Pfeile blass */
    const ruht = zustand.aktiv === false;

    return this.renderSlot(html`
      ${slotLabel(c) ? html`<h3 class="slot-title">${slotLabel(c)}</h3>` : nothing}
      <div class="img-wrap ${ruht ? "ruht" : ""} ${zustand.bypass ? "bypass" : ""}">
        ${this.renderGeraeteBild({ kind: "solar", alt: "Solarheizung" })}
        ${showArrows ? html`${this.renderPfeil("in")}${this.renderPfeil("out")}` : nothing}

        ${showPowerBtn
          ? this.renderPowerButton({
              on: this._isOn(c.switch_entity),
              standby: zustand.bypass,
              hinweis: {
                oben: "Steuerung an",
                unten: "Bypass",
                /* mittig am Knopf: darunter sitzt das Vorlauf-Thermometer */
                lage: "mitte",
                titel: "Solarsteuerung an, Wasser läuft aber nicht übers Feld (Bypass) — Steuerung ausschalten (mit Rückfrage)",
              },
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
        z-index: 2;
      }
      /* Iteration 19c: Solarheizung läuft nicht (aus/Bypass) */
      .img-wrap.ruht .bild-flaeche img {
        filter: grayscale(0.7);
        opacity: 0.7;
      }
      .img-wrap.ruht > img.flow-arrow {
        opacity: 0.22;
        filter: grayscale(1);
      }
    `,
  ];
}

customElements.define("tomtut-pool-slot-solar", TomtutPoolSlotSolar);
