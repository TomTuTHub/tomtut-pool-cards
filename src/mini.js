import { html, css, nothing, unsafeCSS } from "lit";
import { TomtutPoolHero, teilLage } from "./hero.js";
import { TomtutPoolSlotPump, pumpHasEntity, fanDuration } from "./slots/pump.js";
import { TomtutPoolSlotHeatpump, MODE_FARBEN, heatpumpHasEntity } from "./slots/heatpump.js";
import { solarZustand } from "./slots/solar.js";
import { customEintraege, DOMAIN_ICONS, TOGGLE_DOMAINS } from "./slots/custom.js";
import { thermoGrafik, fanDesignSvg, FAN_SVG } from "./shared/slot-base.js";
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

/*
 * Hintergrund der Kacheln (Iteration 19, `mini_tile_fill`). Ohne Angabe
 * schwarz — so sahen die Kacheln auf dem dunklen Studio-Tablet schon aus.
 */
export const MINI_KACHEL_FILLS = [
  ["schwarz", "Schwarz"],
  ["weiss", "Weiß"],
  ["transparent", "Transparent (nur Rand)"],
];
export const miniKachelFill = (c = {}) =>
  MINI_KACHEL_FILLS.some(([k]) => k === c?.mini_tile_fill) ? c.mini_tile_fill : "schwarz";

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
 * Was eine Kachel zeigen KANN (`mini_show`, Zusatz zu Iteration 17).
 * Reihenfolge = Reihenfolge auf der Kachel. Schlüssel sind Teil der Config
 * und ändern sich nie; die Beschriftung ist nur für den Editor.
 * `custom` hat keine feste Liste: dort sind es die Einträge 1..n.
 */
export const MINI_WERTE = {
  pump: [
    ["stufe", "Stufe"],
    ["watt", "Watt"],
    ["temp", "Temperatur"],
    ["status", "Status an/aus"],
  ],
  heatpump: [
    ["modus", "Modus"],
    ["watt", "Watt"],
    ["ist", "Ist-Temperatur"],
    ["soll", "Soll-Temperatur"],
    ["freigabe", "Freigabe"],
    ["status", "Status an/aus"],
  ],
  solar: [
    ["vorlauf", "Vorlauf"],
    ["ruecklauf", "Rücklauf"],
    ["watt", "Watt"],
    ["status", "Status an/aus"],
  ],
  uv: [
    ["status", "Status an/aus"],
    ["watt", "Watt"],
    ["temp", "Temperatur"],
  ],
  hero: [
    ["temp", "Temperatur"],
    ["ph", "pH"],
    ["rx", "RX"],
    ["zulauf", "Zulauf"],
  ],
};

/* Kurzname je Wert — steht im Raster (ab 3 Werten) klein über dem Wert (It19b) */
export const MINI_WERT_NAMEN = {
  stufe: "Stufe",
  watt: "Watt",
  temp: "Temp",
  status: "Status",
  modus: "Modus",
  ist: "Ist",
  soll: "Soll",
  freigabe: "Freigabe",
  vorlauf: "Vorlauf",
  ruecklauf: "Rücklauf",
};

/* Ab hier wird die Kachel eng: Schrift kleiner, Editor warnt */
export const MINI_WERTE_EMPFOHLEN = 3;

/* Hat der Slot eine Quelle für diesen Wert? `status` gibt es immer. */
const QUELLE = {
  pump: {
    stufe: (s) => pumpHasEntity(s) || !!s.power_entity,
    watt: (s) => !!s.power_entity,
    temp: (s) => !!s.temp_entity,
  },
  heatpump: {
    modus: () => true,
    watt: (s) => !!s.power_entity,
    ist: (s) => !!s.current_entity,
    soll: (s) => !!s.target_entity,
    freigabe: (s) => !!s.release_entity,
  },
  solar: {
    vorlauf: (s) => !!s.temp_in_entity,
    ruecklauf: (s) => !!s.temp_out_entity,
    watt: (s) => !!s.power_entity,
  },
  uv: { watt: (s) => !!s.power_entity, temp: (s) => !!s.temp_entity },
  hero: {
    temp: (h) => !!h.temp_entity && h.show_thermo !== false,
    ph: (h) => !!h.ph_entity && h.show_ph !== false,
    rx: (h) => !!h.rx_entity && h.show_rx !== false,
    zulauf: (h) => !!h.inlet_temp_entity,
  },
};

const eintragName = (e, i) =>
  String(e?.label || e?.text || e?.entity || "").trim() || `Eintrag ${i + 1}`;

/*
 * Auswahl eines Slots (oder des Beckens, typ "hero"):
 *   verfuegbar  [[schlüssel, beschriftung]] — was der Slot kennt
 *   standard    was ohne mini_show gezeigt wird (1–2 Werte, Becken alle)
 *   gewaehlt    was tatsächlich gezeigt wird
 *   eigen       true, wenn mini_show gesetzt ist
 */
export const miniWahl = (slotRoh = {}, typ = String(slotRoh?.type || "frame").toLowerCase()) => {
  const slot = slotRoh || {};
  let verfuegbar;
  if (typ === "custom") {
    verfuegbar = customEintraege(slot).map((e, i) => [String(i + 1), eintragName(e, i)]);
  } else {
    const q = QUELLE[typ] || {};
    verfuegbar = (MINI_WERTE[typ] || []).filter(([k]) => (q[k] ? q[k](slot) : true));
  }
  const hat = (k) => verfuegbar.some(([x]) => x === k);
  let standard;
  switch (typ) {
    case "pump":
      standard = [hat("stufe") ? "stufe" : "status", hat("watt") ? "watt" : hat("temp") ? "temp" : null];
      break;
    case "heatpump":
      standard = ["modus", hat("watt") ? "watt" : null];
      break;
    case "solar":
      standard =
        hat("vorlauf") || hat("ruecklauf")
          ? ["vorlauf", "ruecklauf"].filter(hat)
          : ["status", hat("watt") ? "watt" : null];
      break;
    case "uv":
      standard = ["status", hat("watt") ? "watt" : hat("temp") ? "temp" : null];
      break;
    case "custom":
      standard = verfuegbar.length ? ["1"] : [];
      break;
    case "hero":
      standard = verfuegbar.map(([k]) => k);
      break;
    default:
      standard = [];
  }
  standard = standard.filter((k) => k && hat(k));
  const eigen = Array.isArray(slot.mini_show);
  const wunsch = eigen ? slot.mini_show.map((x) => String(x).trim().toLowerCase()) : standard;
  /* Reihenfolge immer die der Liste oben — egal, wie sie in der Config steht */
  const gewaehlt = verfuegbar.map(([k]) => k).filter((k) => wunsch.includes(k));
  return { verfuegbar, standard, gewaehlt, eigen };
};

/* Wird der Slot in der Mini-Ansicht gezeigt? */
export const miniSichtbar = (slot = {}) =>
  MINI_TYPEN.includes(String(slot?.type || "").toLowerCase()) && slot?.mini_hidden !== true;

const tempText = (t) => (t ? `${fmt(t.value, Number.isInteger(t.value) ? 0 : 1)} ${t.unit}` : MINI_LEER);

/*
 * Slot-Config -> Kachel. Rückgabe:
 *   { typ, name, bild|null, icon|null, zustand: an|aus|gesperrt|neutral,
 *     gesperrt, zeilen: [{ text, name?, punkt?: heizen|kuehlen,
 *     pfeil?: in|out, warn? }] }
 * Die Zeilen sind die per `mini_show` gewählten Werte (Default 1–2); ein
 * fehlender Wert ist immer MINI_LEER, abgeschnitten wird nie etwas.
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
  const statusText = () =>
    k.zustand === "an" ? "An" : k.zustand === "aus" ? "Aus" : k.zustand === "gesperrt" ? "Gesperrt" : MINI_LEER;
  const { gewaehlt } = miniWahl(slot, typ);
  /* werte: schlüssel -> () => zeile; erst nach dem Zustand ausgewertet */
  let werte = {};

  switch (typ) {
    case "pump": {
      const p = helfer(TomtutPoolSlotPump, slot, hass);
      k.bild = geraeteBild("pump");
      const st = p.state;
      let stufe = null;
      if (p.blockedByMain) {
        stufe = "Aus";
        k.zustand = "aus";
      } else if (pumpHasEntity(slot) && p.running) {
        stufe = p.stageLabels[st.active] || `N${(st.active ?? 0) + 1}`;
        k.zustand = "an";
      } else if (!p.stages.length && !slot.power_entity && slot.main_entity) {
        /* nur Hauptschalter: mehr als an/aus weiß die Card nicht */
        stufe = an(slot.main_entity) ? "An" : "Aus";
        k.zustand = an(slot.main_entity) ? "an" : "aus";
      } else if (pumpHasEntity(slot) || slot.power_entity) {
        stufe = "Stopp";
        k.zustand = "aus";
      }
      if (slot.show_fan !== false) {
        const laeuft = k.zustand === "an";
        const speed = ["fan_speed_1", "fan_speed_2", "fan_speed_3"][st.active ?? 0] || "fan_speed_1";
        k.rad = {
          top: Number(p._v("fan_top")),
          left: Number(p._v("fan_left")),
          /* im Mini deutlich größer als im vollen Kasten, sonst ein Punkt */
          size: Math.max(Number(p._v("fan_size")) * 1.9, 38),
          ratio: 1,
          rund: true,
          dreht: laeuft,
          dur: fanDuration(p._v(speed)),
          svg: FAN_SVG,
        };
      }
      werte = {
        stufe: () => z(stufe),
        watt: () => z(watt(hass, slot.power_entity)),
        temp: () => z(wert(hass, slot.temp_entity)),
        status: () => z(statusText()),
      };
      break;
    }

    case "heatpump": {
      const w = helfer(TomtutPoolSlotHeatpump, slot, hass);
      k.bild = geraeteBild("heatpump");
      const frei = w._freigabe;
      k.gesperrt = frei === false;
      const sw = slot.switch_entity;
      /* climate aus = Aus, dieselbe Regel wie im vollen Kasten (klimaAus) */
      const klimaAus = w._klimaAus;
      const klima = klimaAus || [slot.mode_entity, slot.target_entity, slot.current_entity].some((id) => String(id || "").startsWith("climate."));
      const laeuft = !klimaAus && (da(sw) ? an(sw) : w._fanActive);
      k.zustand = k.gesperrt
        ? "gesperrt"
        : laeuft
        ? "an"
        : sw || slot.power_entity || slot.fan_entity || klima
        ? "aus"
        : "neutral";
      if (slot.show_fan !== false) {
        k.rad = {
          top: Number(w._v("fan_top")),
          left: Number(w._v("fan_left")),
          size: Number(w._v("fan_size")),
          ratio: Number(w._v("fan_ratio")) || 1,
          rund: false,
          /* dieselbe Regel wie im vollen Kasten (Freigabe, climate, Schalter) */
          dreht: w._fanActive && !!heatpumpHasEntity(slot),
          dur: w._fanDur,
          farbe: w._fanFarbe,
          svg: fanDesignSvg(w._v("fan_design")),
        };
      }
      werte = {
        modus: () => {
          if ((da(sw) && !an(sw)) || klimaAus) return z("Aus");
          const b = w._modusBadge;
          if (b) return z(b.text, b.art === "heizen" || b.art === "kuehlen" ? { punkt: b.art } : {});
          return z(laeuft ? "An" : "Aus");
        },
        watt: () => z(watt(hass, slot.power_entity)),
        ist: () => z(tempText(w._current), { name: "Ist" }),
        soll: () => z(tempText(w._target), { name: "Soll" }),
        /* selbsterklärend (It19c): im Raster steht "Freigabe" als Name darüber,
           sonst gehört das Wort mit in den Wert */
        freigabe: () => {
          const w = frei === null ? null : frei ? "frei" : "gesperrt";
          const text = w === null ? null : gewaehlt.length >= 3 ? w : `Freigabe ${w}`;
          return z(text, { ...(frei === false ? { warn: true } : {}), umbruch: gewaehlt.length < 3 });
        },
        status: () => z(statusText(), k.gesperrt ? { warn: true } : {}),
      };
      break;
    }

    case "uv": {
      k.bild = geraeteBild("uv");
      const sw = slot.switch_entity;
      if (da(sw)) k.zustand = an(sw) ? "an" : "aus";
      werte = {
        status: () => z(statusText()),
        watt: () => z(watt(hass, slot.power_entity)),
        temp: () => z(wert(hass, slot.temp_entity)),
      };
      break;
    }

    case "solar": {
      k.bild = geraeteBild("solar");
      const sz = solarZustand(slot, hass);
      if (sz.aktiv !== null) k.zustand = sz.aktiv ? "an" : "aus";
      werte = {
        vorlauf: () => z(wert(hass, slot.temp_in_entity), { pfeil: "in" }),
        ruecklauf: () => z(wert(hass, slot.temp_out_entity), { pfeil: "out" }),
        watt: () => z(watt(hass, slot.power_entity)),
        status: () => z(statusText()),
      };
      break;
    }

    case "custom": {
      const eintraege = customEintraege(slot);
      const e0 = eintraege[Number(gewaehlt[0]) - 1] || eintraege[0];
      const wertVon = (e) => {
        const art = e.kind || (e.entity ? "entity" : "text");
        if (art === "text" || !e.entity) return { text: e.text || e.label, icon: e.icon || "mdi:text" };
        const ent = hass?.states?.[e.entity];
        const dom = domainOf(e.entity);
        const icon = e.icon || ent?.attributes?.icon || DOMAIN_ICONS[dom] || "mdi:circle-medium";
        if (!ent || TOT.includes(String(ent.state).toLowerCase())) return { text: null, icon, name: e.label || nameOf(ent, e.entity) };
        const name = e.label || nameOf(ent, e.entity);
        if (TOGGLE_DOMAINS.includes(dom)) return { text: isOn(ent.state) ? "An" : "Aus", icon, name, schalter: isOn(ent.state) };
        if (numOf(ent.state) !== null) return { text: stateText(ent), icon, name };
        try {
          return { text: hass?.formatEntityState?.(ent) || stateText(ent), icon, name };
        } catch (err) {
          console.warn("tomtut-pool-cards: formatEntityState —", err?.message || err);
          return { text: stateText(ent), icon, name };
        }
      };
      if (!e0) {
        k.icon = "mdi:form-textbox";
        k.zeilen.push(z(slot.title || "Freifeld"));
        return k;
      }
      const w0 = wertVon(e0);
      k.icon = w0.icon;
      if (w0.schalter !== undefined) k.zustand = w0.schalter ? "an" : "aus";
      if (gewaehlt.length === 1) {
        /* ein Eintrag: Wert groß, Name darunter (wie ein Kachel-Titel) */
        k.zeilen.push(z(w0.text));
        const unter = w0.name || slot.title;
        if (unter) k.zeilen.push(z(unter));
        return k;
      }
      for (const key of gewaehlt) {
        const e = eintraege[Number(key) - 1];
        if (!e) continue;
        const w = wertVon(e);
        k.zeilen.push(z(w.text, w.name ? { name: w.name } : {}));
      }
      return k;
    }

    default:
      k.zeilen.push(z(null));
      return k;
  }

  for (const key of gewaehlt) {
    if (!werte[key]) continue;
    const zeile = werte[key]();
    /* Raster: jede Zelle gleich gebaut — Name oben, Wert darunter (Pille ausgenommen) */
    if (gewaehlt.length >= 3 && !zeile.punkt) zeile.name = MINI_WERT_NAMEN[key] || zeile.name;
    k.zeilen.push(zeile);
  }
  return k;
};

/* Becken für den Kopf der Mini-Ansicht (Auswahl über hero.mini_show) */
export const miniBecken = (hero = {}, hass) => {
  const h = helfer(TomtutPoolHero, hero || {}, hass);
  const form = shapeOf(hero?.shape);
  const { gewaehlt } = miniWahl(hero || {}, "hero");
  const zeig = (k) => gewaehlt.includes(k);
  const chips = [];
  if (zeig("ph")) chips.push({ key: "pH", text: wert(hass, hero.ph_entity), entity: hero.ph_entity });
  if (zeig("rx")) chips.push({ key: "RX", text: wert(hass, hero.rx_entity), entity: hero.rx_entity });
  if (zeig("zulauf"))
    chips.push({ key: "Zulauf", text: wert(hass, hero.inlet_temp_entity), entity: hero.inlet_temp_entity });
  const sprites = Object.values(HERO_SPRITES)
    .filter((sp) => h._spriteAn(sp.anker))
    .map((sp) => ({ anker: sp.anker, src: imagePath(sp.file), ...teilLage(hero || {}, sp, "mini") }));
  return {
    bild: imagePath(form.file),
    ratio: shapeRatio(hero?.shape),
    label: form.label,
    temp: zeig("temp") ? wert(hass, hero.temp_entity) : null,
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
      ${b.temp === null
        ? nothing
        : b.temp === MINI_LEER
        ? html`<div class="m-temp leer" title="Wassertemperatur: kein Wert">
            ${thermoGrafik}<span class="m-temp-leer"><span class="m-temp-key">Wasser</span>${MINI_LEER}</span>
          </div>`
        : html`<div class="m-temp">${thermoGrafik}<span class="m-temp-wert">${b.temp}</span></div>`}
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

/* Schrift-Stufe nach Anzahl der Werte: bis 2 normal, 3 kleiner, ab 4 eng */
/* bis 2 Werte untereinander, ab 3 im 2-Spalten-Raster unter dem Bild (It19) */
export const miniDichte = (n) => (n <= 2 ? "normal" : "raster");

const renderRad = (r) =>
  r
    ? html`<div
        class="k-rad ${r.dreht && r.dur > 0 ? "dreht" : "steht"} ${r.rund ? "rund" : ""}"
        style="top:${r.top}%; left:${r.left}%; width:${r.size}%; --k-rad-ratio:${r.ratio}; --k-rad-dur:${r.dur}s;${r.farbe
          ? ` --k-rad-farbe:${r.farbe};`
          : ""}"
      >
        <svg viewBox="0 0 40 40" preserveAspectRatio="${r.rund ? "xMidYMid meet" : "none"}">
          <g .innerHTML="${r.svg}"></g>
        </svg>
      </div>`
    : nothing;

/* ungerade Zahl an Zellen (ohne Pille): die letzte spannt über beide Spalten */
const zellBreit = (zeilen, i) => {
  const zellen = zeilen.map((z, j) => (z.punkt ? -1 : j)).filter((j) => j >= 0);
  return zeilen.length >= 3 && zellen.length % 2 === 1 && zellen[zellen.length - 1] === i;
};

const renderZeile = (x, i, breit = false) => html`<span
  class="k-zeile ${i ? "neben" : "haupt"} ${x.punkt ? `badge ${x.punkt}` : ""} ${x.warn ? "warn" : ""} ${breit ? "breit" : ""} ${x.umbruch ? "umbruch" : ""}"
  >${x.pfeil
    ? html`<img
        class="k-pfeil"
        src="${imagePath(FLOW_MARKERS[x.pfeil])}"
        alt="${x.pfeil === "in" ? "Vorlauf" : "Rücklauf"}"
      />`
    : nothing}${x.name ? html`<span class="k-name">${x.name}</span>` : nothing}<span class="k-text"
    >${x.text}</span
  ></span
>`;

const renderKachel = (card, k, nr) => html`
  <div
    class="kachel ${k.zustand} typ-${k.typ} dichte-${miniDichte(k.zeilen.length)} ${k.zeilen.length >= 5 ? "viele" : ""}"
    role="button"
    tabindex="0"
    data-mini="${nr}"
    title="${k.name} — tippen für den vollen Kasten"
    aria-label="${k.name}: ${k.zeilen.map((x) => (x.name ? `${x.name} ${x.text}` : x.text)).join(", ")}"
    @click="${() => card._miniOeffnen(nr)}"
    @keydown="${taste(() => card._miniOeffnen(nr))}"
  >
    <span class="k-status" title="${{ an: "an", aus: "aus", gesperrt: "gesperrt" }[k.zustand] || "unbekannt"}"></span>
    <div class="k-innen">
      <div class="k-bild">
        ${k.bild
          ? html`<div class="k-bildbox" style="--r:${Math.round(k.bild.ratio * 1000) / 1000};">
              <img src="${k.bild.src}" alt="${k.name}" />${renderRad(k.rad)}
            </div>`
          : html`<ha-icon icon="${k.icon || "mdi:circle-medium"}"></ha-icon>`}
        ${k.gesperrt ? html`<span class="k-sperre">Gesperrt</span>` : nothing}
      </div>
      ${k.zeilen.length ? html`<div class="k-werte">${k.zeilen.map((x, i) => renderZeile(x, i, zellBreit(k.zeilen, i)))}</div>` : nothing}
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
  const heroOn = c.hero?.enabled !== false && c.hero?.mini_hidden !== true;
  const kacheln = card._slotsMitNummer.filter(({ slot }) => miniSichtbar(slot));
  return html`
    <ha-card class="mini-karte slot fill-${fillVon(c)} ${c.frame?.enabled === false ? "" : "framed"}">
      <div class="mini kacheln-${miniKachelFill(c)}" style="--m-spalten:${miniSpalten(kacheln.length)};">
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

  /* ---- Kopf: Becken + Werte (Iteration 18: Becken größer, Werte füllen
     die Spalte — Temperatur als breiter Block, pH/RX/Zulauf als 2er-Raster) ---- */
  .m-kopf {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    border-radius: 10px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .m-becken {
    position: relative;
    flex: 0 0 auto;
    width: min(62%, calc(150px * var(--r)));
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
    align-items: stretch;
    justify-content: center;
    gap: 5px;
  }
  .m-temp {
    display: flex;
    align-items: center;
    gap: 6px;
    line-height: 1;
    min-width: 0;
  }
  .m-temp svg {
    flex: none;
    height: clamp(28px, 7.6cqw, 36px);
    width: auto;
    display: block;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25));
  }
  .m-temp-wert {
    flex: 1 1 auto;
    text-align: center;
    font-size: clamp(18px, 5cqw, 24px);
    font-weight: 800;
    white-space: nowrap;
    padding: 0.1em 0.3em;
    border-radius: 0.4em;
    background: linear-gradient(var(--tt-deck), var(--tt-deck)), var(--tt-box-bg);
    color: var(--tt-box-fg);
    border: 1px solid var(--tt-line);
    font-variant-numeric: tabular-nums;
  }
  /* kein Wert: dezent, ohne großen leeren Kasten */
  .m-temp.leer svg {
    height: clamp(26px, 7cqw, 34px);
    opacity: 0.75;
  }
  .m-temp-leer {
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
    font-size: 16px;
    font-weight: 700;
    color: var(--tt-fg);
  }
  .m-temp-key {
    font-size: 12px;
    font-weight: 700;
    opacity: 0.75;
  }
  /* Werte als kleine Tabelle untereinander: Schlüssel links, Wert rechts */
  .m-chips {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 3px;
  }
  .m-chip {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 4px;
    min-width: 0;
    padding: 2px 9px;
    border-radius: 7px;
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
    font-variant-numeric: tabular-nums;
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
    background: var(--k-bg);
    color: var(--k-fg);
    cursor: pointer;
    transition: filter 0.15s, transform 0.1s;
    -webkit-tap-highlight-color: transparent;
  }
  /* Kachel-Hintergrund (mini_tile_fill): Farben je Füllung, lesbar in
     hellem und dunklem Theme; transparent = nur Rand, Karte scheint durch */
  .mini.kacheln-schwarz .kachel {
    --k-bg: #1e1e1e;
    --k-fg: #ffffff;
    --k-line: rgba(255, 255, 255, 0.22);
  }
  .mini.kacheln-weiss .kachel {
    --k-bg: #ffffff;
    --k-fg: #111111;
    --k-line: rgba(0, 0, 0, 0.22);
  }
  .mini.kacheln-transparent .kachel {
    --k-bg: transparent;
    --k-fg: var(--tt-fg);
    --k-line: var(--tt-line);
    border-color: var(--k-line);
  }
  .mini-karte.framed .kachel {
    border-color: var(--k-line);
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
    --kb-h: 60px;
    position: relative;
    width: 100%;
    height: var(--kb-h);
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
  /* Bildbox im echten Seitenverhältnis: das Rad sitzt prozentgenau wie
     im vollen Kasten */
  .k-bildbox {
    position: relative;
    width: min(100%, calc(var(--kb-h) * var(--r)));
    aspect-ratio: var(--r);
  }
  .k-bildbox > img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
  .kachel.aus .k-bild img,
  .kachel.gesperrt .k-bild img {
    filter: grayscale(0.85);
    opacity: 0.6;
  }
  /* Laufrad / Lüfter (Iteration 19): dreht mit dem Tempo aus dem vollen
     Kasten, steht bei Stillstand */
  .k-rad {
    position: absolute;
    aspect-ratio: 1 / var(--k-rad-ratio, 1);
    transform: translate(-50%, -50%);
    color: var(--k-rad-farbe, #263238);
    pointer-events: none;
  }
  .k-rad.rund {
    color: var(--k-rad-farbe, #1565c0);
    background: rgba(255, 255, 255, 0.92);
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.35);
    padding: 1px;
    box-sizing: border-box;
  }
  .k-rad svg {
    width: 100%;
    height: 100%;
    display: block;
    overflow: visible;
  }
  .k-rad svg g {
    transform-box: view-box;
    transform-origin: 50% 50%;
  }
  .k-rad.dreht svg g {
    animation: kRad var(--k-rad-dur, 1s) linear infinite;
  }
  .k-rad.steht {
    opacity: 0.55;
    filter: grayscale(1);
  }
  @keyframes kRad {
    to {
      transform: rotate(360deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .k-rad.dreht svg g {
      animation: none;
    }
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
    font-size: 14px;
    font-weight: 700;
    line-height: 1.2;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.1px;
  }
  .k-zeile.neben {
    font-size: 13px;
    font-weight: 600;
  }
  /* kleiner Vorsatz vor dem Wert ("Ist", "Soll", Name eines Eintrags) */
  .k-name {
    flex: none;
    font-size: 0.78em;
    font-weight: 700;
    opacity: 0.72;
    letter-spacing: 0.3px;
  }
  .k-zeile.warn .k-text {
    padding: 0 5px;
    border-radius: 5px;
    background: #c62828;
    color: #ffffff;
  }
  /* ab 3 Werten: 2 Spalten × n Zeilen unter dem Bild (Iteration 19) —
     Modus-Pille über die volle Breite, Name ("Ist") darf über den Wert
     umbrechen, abgeschnitten wird nie */
  /* Raster (It19c): Bild kleiner, dafür Werte ≥ 12 px und Namen ≥ 9 px —
     auf dem Tablet lesbar */
  .kachel.dichte-raster .k-bild {
    --kb-h: 40px;
  }
  .kachel.dichte-raster .k-innen {
    padding: 6px 4px 7px;
  }
  /* Raster (It19b): 2 Spalten, jede Zelle gleich — Name klein oben, Wert
     darunter; Pille und eine übrige letzte Zelle über die volle Breite */
  .kachel.dichte-raster .k-werte {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: auto;
    gap: 2px 2px;
    width: 100%;
    align-items: stretch;
  }
  .kachel.dichte-raster .k-zeile,
  .kachel.dichte-raster .k-zeile.neben {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    column-gap: 3px;
    row-gap: 0;
    min-width: 0;
    font-size: 12.5px;
    font-weight: 700;
    letter-spacing: -0.2px;
    line-height: 1.1;
  }
  /* Name klein oben über die ganze Zelle, darunter (Pfeil +) Wert */
  .kachel.dichte-raster .k-zeile .k-name {
    order: -1;
    flex: 0 0 100%;
    text-align: center;
    font-size: 10px;
    line-height: 1.05;
    opacity: 0.75;
    letter-spacing: 0.1px;
  }
  .kachel.dichte-raster .k-zeile .k-pfeil {
    width: 13px;
  }
  .kachel.dichte-raster .k-zeile.breit,
  .kachel.dichte-raster .k-zeile.badge {
    grid-column: 1 / -1;
  }
  .kachel.dichte-raster .k-zeile.badge {
    display: flex;
    justify-content: center;
  }
  .kachel.dichte-raster .k-text,
  .kachel.dichte-raster .k-name {
    white-space: nowrap;
  }
  .kachel.dichte-raster .k-zeile.badge .k-text {
    white-space: normal;
  }
  /* ab 5 Werten: Bild noch etwas kleiner */
  .kachel.dichte-raster.viele .k-bild {
    --kb-h: 36px;
  }
  /* "Freigabe gesperrt" darf zweizeilig werden statt abgeschnitten */
  .k-zeile.umbruch {
    white-space: normal;
    text-align: center;
  }
  .k-zeile.umbruch .k-text {
    white-space: normal;
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
  /* Modus als getönte Pille in der Farbe des Rads (heizen rot, kühlen
     blau) — bleibt auch zweizeilig ein ruhiger Block */
  .k-zeile.heizen {
    --k-modus: ${unsafeCSS(MODE_FARBEN.heizen)};
  }
  .k-zeile.kuehlen {
    --k-modus: ${unsafeCSS(MODE_FARBEN.kuehlen)};
  }
  .k-zeile.badge {
    font-size: 12.5px;
  }
  .k-zeile.badge .k-text {
    padding: 1px 5px;
    border-radius: 7px;
    background: color-mix(in srgb, var(--k-modus) 26%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--k-modus) 75%, transparent);
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
  .kachel.neutral .k-status {
    background: #9e9e9e;
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
      --kb-h: 54px;
      flex: 0 0 42%;
      width: 42%;
    }
    /* Raster bleibt auch in breiten Kacheln unter dem Bild */
    .kachel.dichte-raster .k-innen {
      flex-direction: column;
      gap: 4px;
      padding: 6px 8px 7px;
    }
    .kachel.dichte-raster .k-bild {
      --kb-h: 40px;
      flex: none;
      width: 100%;
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
