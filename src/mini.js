import { html, css, nothing, unsafeCSS } from "lit";
import { TomtutPoolHero } from "./hero.js";
import { TomtutPoolSlotPump, pumpHasEntity } from "./slots/pump.js";
import { TomtutPoolSlotHeatpump, MODE_FARBEN } from "./slots/heatpump.js";
import { customEintraege, DOMAIN_ICONS, TOGGLE_DOMAINS } from "./slots/custom.js";
import { thermoGrafik } from "./shared/slot-base.js";
import { kioskGilt, KIOSK_BECKEN } from "./shared/kiosk.js";
import {
  SLOT_TYPES,
  HERO_SPRITES,
  FLOW_MARKERS,
  imagePath,
  deviceImage,
  deviceRatio,
  shapeOf,
  shapeRatio,
} from "./shared/assets.js";
import { isOn, numOf, numText, fmt, toWatt, stateText, nameOf, domainOf } from "./shared/util.js";

/*
 * Mini-Ansicht (Iteration 17) — die ganze Anlage kompakt in EINER Card.
 *
 * Anlass: Thomas' Studio-Tablet (Lenovo Tab M9, 1340 × 800, dpr 1, Theme
 * "Liquid Glass"). Dort hängt heute ein handgebautes picture-elements-
 * Kästchen von 500 × 282 px: Becken + Pooltemperatur, Solar mit Vor-/
 * Rücklauf, drei kleine Kacheln. Genau diese Dichte, aber in der Optik der
 * Card (Selinas Zeichnungen) und ohne zweite Konfiguration:
 *
 *   view: mini     dieselbe Config (hero + slots) wie die volle Ansicht
 *   view: voll     Default — alles wie bisher (auch ohne den Schlüssel)
 *
 * Aufbau: oben das Becken klein (Form + Temperatur, pH/RX/Zulauf als
 * Kästchen daneben), darunter die Geräte als Kacheln — ab 440 px Card-Breite
 * in EINER Zeile (bis 5 Geräte, darüber zwei Zeilen), schmaler im 2er-Raster
 * mit liegenden Kacheln. Pro Kachel Selinas Bild, die 1–2 wichtigsten Werte
 * und der Zustand farbig; keine Taster, keine Regler.
 *
 * Tipp auf eine Kachel (oder das Becken) öffnet den vollen Kasten als
 * Dialog — voll bedienbar bzw. nur Anzeige, wenn der Kasten im Kiosk steht.
 * Der Dialog ist ein natives <dialog> mit showModal(): er liegt im Top-Layer
 * des Browsers und damit über der HA-Kopfleiste, OHNE einen einzigen
 * z-index (Regel aus Iteration 8: nichts über 10). Schließen per X, Tipp
 * daneben oder Esc; öffnet ein Kasten HA's Detail-Dialog (more-info), geht
 * unserer vorher zu, damit er nicht davor liegt.
 *
 * Die Werte einer Kachel kommen aus derselben Logik wie im vollen Kasten
 * (Stufe aus Watt, Modus-Badge, Freigabekontakt …): die Kachel fragt eine
 * nie eingehängte Instanz des Slots. Nicht verbundene Lit-Elemente rendern
 * nie — es wird nur gerechnet, nichts gezeichnet.
 */

export const ANSICHTEN = ["voll", "mini"];
export const ANSICHT_DEFAULT = "voll";
export const ansichtVon = (config) =>
  String(config?.view ?? "").trim().toLowerCase() === "mini" ? "mini" : ANSICHT_DEFAULT;

/* Diese Slot-Typen werden zur Kachel; Rahmen/Platzhalter/Altlasten nicht */
export const MINI_TYPEN = ["heatpump", "pump", "uv", "solar", "custom"];

/* "Kein Wert" in der Mini-Ansicht (unknown, unavailable, fehlt) */
export const MINI_LEER = "–";

/* Spalten ab 440 px: alle in eine Zeile bis 5 Geräte, darüber zwei Zeilen */
export const MINI_MAX_SPALTEN = 5;
export const miniSpalten = (anzahl) => {
  const n = Math.max(1, Math.floor(Number(anzahl) || 0));
  return n <= MINI_MAX_SPALTEN ? n : Math.ceil(n / 2);
};

const TOT = ["", "unknown", "unavailable", "none"];
const leer = (t) => (t === undefined || t === null || t === "" || t === "—" ? MINI_LEER : t);
const wert = (hass, id) => leer(numText(hass?.states?.[id]));
const watt = (hass, id) => {
  const w = toWatt(hass?.states?.[id]);
  return w === null ? MINI_LEER : `${fmt(w, 0)} W`;
};

/* Nie eingehängte Slot-Instanz — nur zum Rechnen (s. Kopfkommentar) */
const helfer = (Klasse, config, hass) => {
  const el = new Klasse();
  el.config = config || {};
  el.hass = hass;
  return el;
};

export const kachelName = (slot) =>
  String(slot?.label || slot?.label_text || slot?.title || "").trim() ||
  SLOT_TYPES[slot?.type]?.label ||
  "Kasten";

const geraeteBild = (kind) => ({ src: deviceImage(kind), ratio: deviceRatio(kind) });

/*
 * Slot-Config -> Kachel. Rückgabe:
 *   { typ, name, bild|null, icon|null, zustand: an|aus|gesperrt|neutral,
 *     gesperrt, zeilen: [{ text, punkt?: heizen|kuehlen, pfeil?: in|out }] }
 * Höchstens zwei Zeilen; ein fehlender Wert ist immer MINI_LEER.
 */
export const miniKachel = (slotRoh = {}, hass) => {
  const typ = String(slotRoh?.type || "frame").toLowerCase();
  const slot = { ...(slotRoh || {}), type: typ };
  const k = {
    typ,
    name: kachelName(slot),
    bild: null,
    icon: null,
    zustand: "neutral",
    gesperrt: false,
    zeilen: [],
  };
  const z = (text, extra = {}) => ({ text: leer(text), ...extra });
  const da = (id) => !!id && !!hass?.states?.[id];
  const an = (id) => isOn(hass?.states?.[id]?.state);

  switch (typ) {
    case "pump": {
      const p = helfer(TomtutPoolSlotPump, slot, hass);
      k.bild = geraeteBild("pump");
      const st = p.state;
      if (p.blockedByMain) {
        k.zeilen.push(z("Aus"));
        k.zustand = "aus";
      } else if (pumpHasEntity(slot) && p.running) {
        k.zeilen.push(z(p.stageLabels[st.active] || `N${(st.active ?? 0) + 1}`));
        k.zustand = "an";
      } else if (!p.stages.length && !slot.power_entity && slot.main_entity) {
        /* nur Hauptschalter: mehr als an/aus weiß die Card nicht */
        k.zeilen.push(z(an(slot.main_entity) ? "An" : "Aus"));
        k.zustand = an(slot.main_entity) ? "an" : "aus";
      } else if (pumpHasEntity(slot) || slot.power_entity) {
        k.zeilen.push(z("Stopp"));
        k.zustand = "aus";
      } else {
        k.zeilen.push(z(null));
      }
      if (slot.power_entity) k.zeilen.push(z(watt(hass, slot.power_entity)));
      else if (slot.temp_entity) k.zeilen.push(z(wert(hass, slot.temp_entity)));
      return k;
    }

    case "heatpump": {
      const w = helfer(TomtutPoolSlotHeatpump, slot, hass);
      k.bild = geraeteBild("heatpump");
      k.gesperrt = w._freigabe === false;
      const sw = slot.switch_entity;
      const laeuft = da(sw) ? an(sw) : w._fanActive;
      const badge = w._modusBadge;
      if (da(sw) && !an(sw)) k.zeilen.push(z("Aus"));
      else if (badge) {
        k.zeilen.push(
          z(badge.text, badge.art === "heizen" || badge.art === "kuehlen" ? { punkt: badge.art } : {})
        );
      } else k.zeilen.push(z(laeuft ? "An" : "Aus"));
      if (slot.power_entity) k.zeilen.push(z(watt(hass, slot.power_entity)));
      k.zustand = k.gesperrt
        ? "gesperrt"
        : laeuft
        ? "an"
        : sw || slot.power_entity || slot.fan_entity
        ? "aus"
        : "neutral";
      return k;
    }

    case "uv": {
      k.bild = geraeteBild("uv");
      const sw = slot.switch_entity;
      if (sw) {
        k.zeilen.push(z(da(sw) ? (an(sw) ? "An" : "Aus") : null));
        if (da(sw)) k.zustand = an(sw) ? "an" : "aus";
      }
      if (slot.power_entity) k.zeilen.push(z(watt(hass, slot.power_entity)));
      else if (slot.temp_entity) k.zeilen.push(z(wert(hass, slot.temp_entity)));
      if (!k.zeilen.length) k.zeilen.push(z(null));
      return k;
    }

    case "solar": {
      k.bild = geraeteBild("solar");
      const sw = slot.switch_entity;
      if (da(sw)) k.zustand = an(sw) ? "an" : "aus";
      if (slot.temp_in_entity) k.zeilen.push(z(wert(hass, slot.temp_in_entity), { pfeil: "in" }));
      if (slot.temp_out_entity) k.zeilen.push(z(wert(hass, slot.temp_out_entity), { pfeil: "out" }));
      if (!k.zeilen.length) {
        if (sw) k.zeilen.push(z(da(sw) ? (an(sw) ? "An" : "Aus") : null));
        if (slot.power_entity) k.zeilen.push(z(watt(hass, slot.power_entity)));
      }
      if (!k.zeilen.length) k.zeilen.push(z(null));
      return k;
    }

    case "custom": {
      const e = customEintraege(slot)[0];
      if (!e) {
        k.icon = "mdi:form-textbox";
        k.zeilen.push(z(slot.title || "Freifeld"));
        return k;
      }
      const art = e.kind || (e.entity ? "entity" : "text");
      if (art === "text" || !e.entity) {
        k.icon = e.icon || "mdi:text";
        k.zeilen.push(z(e.text || e.label));
        if (slot.title) k.zeilen.push(z(slot.title));
        return k;
      }
      const ent = hass?.states?.[e.entity];
      const dom = domainOf(e.entity);
      k.icon = e.icon || ent?.attributes?.icon || DOMAIN_ICONS[dom] || "mdi:circle-medium";
      let text;
      if (!ent || TOT.includes(String(ent.state).toLowerCase())) text = null;
      else if (TOGGLE_DOMAINS.includes(dom)) {
        text = isOn(ent.state) ? "An" : "Aus";
        k.zustand = isOn(ent.state) ? "an" : "aus";
      } else {
        try {
          text = hass?.formatEntityState?.(ent) || stateText(ent);
        } catch (err) {
          console.warn("tomtut-pool-cards: formatEntityState —", err?.message || err);
          text = stateText(ent);
        }
        if (numOf(ent.state) !== null) text = stateText(ent);
      }
      k.zeilen.push(z(text));
      k.zeilen.push(z(e.label || nameOf(ent, e.entity)));
      return k;
    }

    default:
      k.zeilen.push(z(null));
      return k;
  }
};

/* Becken für den Kopf der Mini-Ansicht */
export const miniBecken = (hero = {}, hass) => {
  const h = helfer(TomtutPoolHero, hero || {}, hass);
  const form = shapeOf(hero?.shape);
  const chips = [];
  if (hero?.show_ph !== false && hero?.ph_entity)
    chips.push({ key: "pH", text: wert(hass, hero.ph_entity), entity: hero.ph_entity });
  if (hero?.show_rx !== false && hero?.rx_entity)
    chips.push({ key: "RX", text: wert(hass, hero.rx_entity), entity: hero.rx_entity });
  if (hero?.inlet_temp_entity && h._spriteAn("inlet"))
    chips.push({ key: "Zulauf", text: wert(hass, hero.inlet_temp_entity), entity: hero.inlet_temp_entity });
  const sprites = Object.values(HERO_SPRITES)
    .filter((sp) => h._spriteAn(sp.anker))
    .map((sp) => {
      const g = Number(h._v(`${sp.anker}_size`));
      return {
        anker: sp.anker,
        src: imagePath(sp.file),
        top: h._anchor(sp.anker, "top"),
        left: h._anchor(sp.anker, "left"),
        breite: g > 0 ? g : sp.groesse,
      };
    });
  return {
    bild: imagePath(form.file),
    ratio: shapeRatio(hero?.shape),
    label: form.label,
    temp: hero?.temp_entity && hero?.show_thermo !== false ? wert(hass, hero.temp_entity) : null,
    chips,
    sprites,
  };
};

/* ------------------------------------------------------------------ */
/* Rendern — `card` ist die Dashboard-Card (Zustand + _renderSlot)     */
/* ------------------------------------------------------------------ */

const taste = (fn) => (ev) => {
  if (ev.key === "Enter" || ev.key === " ") {
    ev.preventDefault();
    fn();
  }
};

const fillVon = (c) =>
  ["transparent", "weiss", "schwarz"].includes(c?.frame?.fill) ? c.frame.fill : "transparent";

const renderKopf = (card, b) => html`
  <div
    class="m-kopf"
    role="button"
    tabindex="0"
    data-mini="${KIOSK_BECKEN}"
    title="Becken — tippen für den vollen Kasten"
    @click="${() => card._miniOeffnen(KIOSK_BECKEN)}"
    @keydown="${taste(() => card._miniOeffnen(KIOSK_BECKEN))}"
  >
    <div class="m-becken" style="--r:${Math.round(b.ratio * 1000) / 1000};">
      <img class="m-becken-bild" src="${b.bild}" alt="Pool ${b.label}" />
      ${b.sprites.map(
        (sp) => html`<img
          class="m-sprite sprite-${sp.anker}"
          src="${sp.src}"
          alt=""
          style="top:${sp.top}%; left:${sp.left}%; width:${sp.breite}%;"
        />`
      )}
    </div>
    <div class="m-werte">
      ${b.temp !== null
        ? html`<div class="m-temp">${thermoGrafik}<span class="m-temp-wert">${b.temp}</span></div>`
        : nothing}
      ${b.chips.length
        ? html`<div class="m-chips">
            ${b.chips.map(
              (ch) => html`<span class="m-chip" data-entity="${ch.entity}"
                ><span class="m-chip-key">${ch.key}</span><span class="m-chip-wert">${ch.text}</span></span
              >`
            )}
          </div>`
        : nothing}
    </div>
  </div>
`;

const renderKachel = (card, k, nr) => html`
  <div
    class="kachel ${k.zustand} typ-${k.typ}"
    role="button"
    tabindex="0"
    data-mini="${nr}"
    title="${k.name} — tippen für den vollen Kasten"
    aria-label="${k.name}: ${k.zeilen.map((x) => x.text).join(", ")}"
    @click="${() => card._miniOeffnen(nr)}"
    @keydown="${taste(() => card._miniOeffnen(nr))}"
  >
    ${k.zustand === "neutral" ? nothing : html`<span class="k-status"></span>`}
    <div class="k-innen">
      <div class="k-bild">
        ${k.bild
          ? html`<img src="${k.bild.src}" alt="${k.name}" />`
          : html`<ha-icon icon="${k.icon || "mdi:circle-medium"}"></ha-icon>`}
        ${k.gesperrt ? html`<span class="k-sperre">Gesperrt</span>` : nothing}
      </div>
      <div class="k-werte">
        ${k.zeilen.slice(0, 2).map(
          (x, i) => html`<span class="k-zeile ${i ? "neben" : "haupt"} ${x.punkt ? "badge" : ""}"
            >${x.punkt ? html`<span class="k-punkt ${x.punkt}"></span>` : nothing}${x.pfeil
              ? html`<img
                  class="k-pfeil"
                  src="${imagePath(FLOW_MARKERS[x.pfeil])}"
                  alt="${x.pfeil === "in" ? "Vorlauf" : "Rücklauf"}"
                />`
              : nothing}<span class="k-text">${x.text}</span></span
          >`
        )}
      </div>
    </div>
  </div>
`;

const renderDialog = (card) => {
  const key = card._miniOffen;
  if (key === null || key === undefined) return nothing;
  const c = card._config;
  let titel;
  let kiosk;
  let inhalt;
  if (key === KIOSK_BECKEN) {
    if (c.hero?.enabled === false) return nothing;
    titel = "Becken";
    kiosk = kioskGilt(c, KIOSK_BECKEN);
    inhalt = html`<tomtut-pool-hero
      .hass="${card.hass}"
      .config="${c.hero}"
      .frame="${c.frame}"
      .kiosk="${kiosk}"
    ></tomtut-pool-hero>`;
  } else {
    const e = card._slotsMitNummer.find((x) => x.nr === key);
    if (!e) return nothing;
    titel = kachelName(e.slot);
    kiosk = kioskGilt(c, e.nr);
    inhalt = card._renderSlot(e.slot, kiosk);
  }
  return html`
    <dialog
      class="m-dialog slot fill-${fillVon(c)}"
      data-mini-dialog="${key}"
      aria-label="${titel}"
      @click="${(ev) => card._miniBackdrop(ev)}"
      @close="${() => card._miniZu()}"
    >
      <div class="m-dialog-kopf">
        <span class="m-dialog-titel"
          >${titel}${kiosk ? html` <small class="m-nur-anzeige">nur Anzeige</small>` : nothing}</span
        >
        <button class="m-zu" type="button" title="Schließen" aria-label="Schließen" @click="${() => card._miniZu()}">
          ✕
        </button>
      </div>
      <div class="m-dialog-inhalt" @hass-more-info="${() => card._miniZu()}">${inhalt}</div>
    </dialog>
  `;
};

export const renderMini = (card) => {
  const c = card._config;
  const hass = card.hass;
  const heroOn = c.hero?.enabled !== false;
  const kacheln = card._slotsMitNummer.filter(({ slot }) => MINI_TYPEN.includes(slot.type));
  return html`
    <ha-card class="mini-karte slot fill-${fillVon(c)} ${c.frame?.enabled === false ? "" : "framed"}">
      <div class="mini" style="--m-spalten:${miniSpalten(kacheln.length)};">
        ${heroOn ? renderKopf(card, miniBecken(c.hero, hass)) : nothing}
        ${kacheln.length
          ? html`<div class="m-kacheln">
              ${kacheln.map(({ slot, nr }) => renderKachel(card, miniKachel(slot, hass), nr))}
            </div>`
          : nothing}
      </div>
      ${renderDialog(card)}
    </ha-card>
  `;
};

/* ------------------------------------------------------------------ */
/* Styles — nur Tokens (shared/styles.js: fillTokens), keine Farbe hart */
/* außer den festen Zustandsfarben (an/aus/gesperrt, Modus wie das Rad) */
/* ------------------------------------------------------------------ */

export const miniStyles = css`
  ha-card.mini-karte {
    display: block;
    box-sizing: border-box;
    background: var(--ha-card-background, var(--card-background-color, transparent));
    border-radius: var(--ha-card-border-radius, 12px);
    border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, transparent));
    box-shadow: var(--ha-card-box-shadow, none);
    backdrop-filter: var(--ha-card-backdrop-filter, none);
    color: var(--tt-fg);
  }
  ha-card.mini-karte.fill-weiss,
  ha-card.mini-karte.fill-schwarz {
    background: var(--tt-bg);
  }
  /* Innenabstand wächst mit dem Eckradius des Themes (Liquid Glass: 34 px),
     damit keine Kachel-Ecke in der Rundung der Card hängt */
  .mini {
    container-type: inline-size;
    box-sizing: border-box;
    padding: clamp(8px, calc(var(--ha-card-border-radius, 12px) * 0.3), 14px);
    display: flex;
    flex-direction: column;
    gap: 8px;
    line-height: 1.2;
  }

  /* ---- Kopf: Becken + Werte ---- */
  .m-kopf {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    border-radius: 10px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .m-becken {
    position: relative;
    flex: 0 0 auto;
    width: min(58%, calc(128px * var(--r)));
    aspect-ratio: var(--r);
  }
  .m-becken > img {
    position: absolute;
    display: block;
    pointer-events: none;
  }
  .m-becken > .m-becken-bild {
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .m-becken > .m-sprite {
    height: auto;
    transform: translate(-50%, -50%);
  }
  .m-werte {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 8px;
  }
  .m-temp {
    display: flex;
    align-items: center;
    gap: 6px;
    line-height: 1;
    max-width: 100%;
  }
  .m-temp svg {
    flex: none;
    height: clamp(34px, 9.5cqw, 46px);
    width: auto;
    display: block;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25));
  }
  .m-temp-wert {
    font-size: clamp(19px, 5.8cqw, 28px);
    font-weight: 800;
    white-space: nowrap;
    padding: 0.14em 0.42em;
    border-radius: 0.4em;
    background: linear-gradient(var(--tt-deck), var(--tt-deck)), var(--tt-box-bg);
    color: var(--tt-box-fg);
    border: 1px solid var(--tt-line);
  }
  .m-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    max-width: 100%;
  }
  .m-chip {
    display: inline-flex;
    align-items: baseline;
    gap: 4px;
    padding: 3px 8px;
    border-radius: 8px;
    border: 1px solid var(--tt-line);
    background: linear-gradient(var(--tt-deck), var(--tt-deck)), var(--tt-box-bg);
    color: var(--tt-box-fg);
    line-height: 1.15;
    white-space: nowrap;
  }
  .m-chip-key {
    font-size: 11px;
    font-weight: 700;
    opacity: 0.75;
  }
  .m-chip-wert {
    font-size: 14px;
    font-weight: 700;
  }

  /* ---- Kacheln ---- */
  .m-kacheln {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @container (min-width: 440px) {
    .m-kacheln {
      grid-template-columns: repeat(var(--m-spalten, 4), minmax(0, 1fr));
    }
  }
  .kachel {
    container-type: inline-size;
    position: relative;
    min-width: 0;
    box-sizing: border-box;
    border-radius: 12px;
    border: 1.5px solid transparent;
    background: linear-gradient(var(--tt-deck), var(--tt-deck)), var(--tt-box-bg);
    color: var(--tt-box-fg);
    cursor: pointer;
    transition: filter 0.15s, transform 0.1s;
    -webkit-tap-highlight-color: transparent;
  }
  .mini-karte.framed .kachel {
    border-color: var(--tt-line);
  }
  .kachel:hover {
    filter: brightness(1.05);
  }
  .kachel:active {
    transform: scale(0.98);
  }
  .kachel:focus-visible,
  .m-kopf:focus-visible {
    outline: 2px solid var(--primary-color, #03a9f4);
    outline-offset: 2px;
  }
  .k-innen {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 6px 6px 7px;
  }
  .k-bild {
    position: relative;
    width: 100%;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    --mdc-icon-size: 34px;
  }
  .k-bild > img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    display: block;
  }
  .kachel.aus .k-bild > img,
  .kachel.gesperrt .k-bild > img {
    filter: grayscale(0.85);
    opacity: 0.6;
  }
  .k-werte {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    min-width: 0;
    max-width: 100%;
  }
  .k-zeile {
    display: flex;
    align-items: center;
    gap: 4px;
    max-width: 100%;
    white-space: nowrap;
    font-size: 13px;
    font-weight: 700;
    line-height: 1.2;
  }
  .k-zeile.neben {
    font-size: 12.5px;
    font-weight: 600;
  }
  .k-text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  /* Modus-Badge ("Kühlen Silent") ist das längste Wort der Kacheln: es darf
     am Leerzeichen umbrechen statt abgeschnitten zu werden */
  .k-zeile.badge {
    white-space: normal;
    align-items: center;
  }
  .k-zeile.badge .k-text {
    overflow-wrap: normal;
    text-align: center;
  }
  .k-punkt {
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
  }
  .k-punkt.heizen {
    background: ${unsafeCSS(MODE_FARBEN.heizen)};
  }
  .k-punkt.kuehlen {
    background: ${unsafeCSS(MODE_FARBEN.kuehlen)};
  }
  .k-pfeil {
    flex: none;
    width: 16px;
    height: auto;
    display: block;
  }
  .k-status {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
  }
  .kachel.an .k-status {
    background: #4caf50;
    box-shadow: 0 0 6px rgba(76, 175, 80, 0.8);
  }
  .kachel.aus .k-status {
    background: #f44336;
    opacity: 0.8;
  }
  .kachel.gesperrt .k-status {
    background: #c62828;
  }
  .k-sperre {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    padding: 1px 6px;
    border-radius: 6px;
    background: #c62828;
    color: #ffffff;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.3px;
    line-height: 1.3;
    white-space: nowrap;
  }
  /* breite Kachel (schmale Card, 2er-Raster): Bild links, Werte rechts */
  @container (min-width: 165px) {
    .k-innen {
      flex-direction: row;
      gap: 8px;
      padding: 6px 8px;
    }
    .k-bild {
      flex: 0 0 42%;
      width: 42%;
      height: 52px;
    }
    .k-werte {
      flex: 1 1 auto;
      align-items: flex-start;
    }
    .k-zeile.badge .k-text {
      text-align: left;
    }
  }

  /* ---- Dialog (Top-Layer, kein z-index) ---- */
  dialog.m-dialog {
    padding: 0;
    border: none;
    box-sizing: border-box;
    width: min(94vw, 560px);
    max-width: 94vw;
    max-height: 92vh;
    overflow: auto;
    border-radius: var(--ha-dialog-border-radius, 20px);
    background: linear-gradient(var(--card-background-color, transparent), var(--card-background-color, transparent)),
      var(--primary-background-color, #fafafa);
    color: var(--primary-text-color, #111);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
  }
  dialog.m-dialog.fill-weiss,
  dialog.m-dialog.fill-schwarz {
    background: var(--tt-bg);
    color: var(--tt-fg);
  }
  dialog.m-dialog::backdrop {
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(3px);
  }
  .m-dialog-kopf {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 10px 0 16px;
  }
  .m-dialog-titel {
    font-size: 17px;
    font-weight: 700;
  }
  .m-nur-anzeige {
    font-size: 12px;
    font-weight: 600;
    opacity: 0.75;
    margin-left: 6px;
  }
  .m-zu {
    flex: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid var(--tt-line);
    background: transparent;
    color: inherit;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    font-family: inherit;
  }
  .m-dialog-inhalt {
    padding: 8px 12px 14px;
  }
`;
