import { html, css, nothing } from "lit";
import { SlotBase } from "../shared/slot-base.js";
import { frameStyles, overlayStyles } from "../shared/styles.js";
import { fmt, isOn, numOf, seitMinuten, domainOf } from "../shared/util.js";
import { fanDuration } from "./pump.js";

/*
 * Slot "heatpump" — Wärmepumpe mit Soll-/Ist-Temperatur, Verbrauch,
 * Powerbutton und Lüfter.
 *
 * `image_variant` und `image_url` gibt es nicht mehr; stehen sie in einer
 * alten Config, werden sie einfach ignoriert.
 *
 * Die Positions-Defaults stammen aus Thomas' Testansicht (2026-09-19).
 * Der Lüfter bleibt bewusst elliptisch (fan_ratio): das Gitter ist im
 * Artwork perspektivisch gezeichnet.
 */
export const HEATPUMP_DEFAULTS = {
  /* Lüfter */
  fan_top: 49.5,
  fan_left: 26,
  fan_size: 42,
  fan_ratio: 1.14,
  fan_speed: 60,
  fan_inactive: "gray",
  fan_power_threshold: 100,
  /* Blatt-Design (shared/slot-base.js: FAN_DESIGNS) und Färbung */
  fan_design: "klassisch",
  fan_color_mode: "neutral",
  /* Betriebsmodus -> Tempo (Skala 1..10 wie bei der Poolpumpe) */
  mode_speed_heiz_silent: 3,
  mode_speed_heiz_smart: 5,
  mode_speed_heiz_auto: 6,
  mode_speed_heiz_boost: 9,
  mode_speed_kuehl_silent: 3,
  mode_speed_kuehl_smart: 5,
  mode_speed_kuehl_auto: 6,
  mode_speed_kuehl_boost: 9,
  /* Powerbutton */
  power_btn_top: 5,
  power_btn_left: 3,
  power_btn_scale: 139,
  /* Freigabekontakt (Iteration 12) — unter dem Lüfter, links unten */
  release_top: 84,
  release_left: 24,
  release_scale: 100,
  /* "seit …" unter dem Freigabe-Badge (Iteration 14) — ab Werk aus */
  show_release_since: false,
  /* Betriebsmodus-Badge (Iteration 14) — rechts neben dem Freigabekontakt,
     unter der Soll-Box */
  mode_top: 86,
  mode_left: 64,
  mode_scale: 100,
  /* Stromverbrauch */
  power_top: 22,
  power_left: 62,
  power_scale: 100,
  power_box: true,
  power_label: true,
  /* Ist-Temperatur */
  current_bottom: 40,
  current_left: 62,
  current_scale: 100,
  current_box: true,
  current_label: true,
  /* Soll-Temperatur */
  target_bottom: 16,
  target_left: 63,
  target_scale: 119,
  target_box: true,
  target_label: true,
  target_step: 0.5,
  /* Freitext-Badge */
  label_top: 4,
  label_left: 50,
  label_scale: 180,
  label_box: true,
};

/*
 * Betriebsmodi (Iteration 9). Die Schlüssel sind Teil der Config und
 * bleiben fest; `zustaende` ist die Default-Zuordnung "Gerätezustand ->
 * Modus" (Vergleich ohne Groß-/Kleinschreibung, Leerzeichen/_/- egal).
 * Echte Geräte liefern sehr verschiedene Strings — deshalb ist jede
 * Zuordnung im Editor überschreibbar (`mode_map_<schlüssel>`, Kommaliste).
 */
export const HP_MODES = [
  { key: "heiz_silent", label: "Heizen Silent", art: "heizen", zustaende: ["Heizen Silent", "heat_silent", "heating_silent", "silent_heat"] },
  { key: "heiz_smart", label: "Heizen Smart", art: "heizen", zustaende: ["Heizen Smart", "heat_smart", "heating_smart", "smart_heat"] },
  { key: "heiz_auto", label: "Heizen Auto", art: "heizen", zustaende: ["Heizen Auto", "heat_auto", "heating_auto", "auto_heat"] },
  { key: "heiz_boost", label: "Heizen Boost", art: "heizen", zustaende: ["Heizen Boost", "heat_boost", "heating_boost", "boost_heat", "heat_turbo", "heat_powerful"] },
  { key: "kuehl_silent", label: "Kühlen Silent", art: "kuehlen", zustaende: ["Kühlen Silent", "cool_silent", "cooling_silent", "silent_cool"] },
  { key: "kuehl_smart", label: "Kühlen Smart", art: "kuehlen", zustaende: ["Kühlen Smart", "cool_smart", "cooling_smart", "smart_cool"] },
  { key: "kuehl_auto", label: "Kühlen Auto", art: "kuehlen", zustaende: ["Kühlen Auto", "cool_auto", "cooling_auto", "auto_cool"] },
  { key: "kuehl_boost", label: "Kühlen Boost", art: "kuehlen", zustaende: ["Kühlen Boost", "cool_boost", "cooling_boost", "boost_cool", "cool_turbo", "cool_powerful"] },
];

/* Farben für "Rad nach Modus einfärben" */
export const MODE_FARBEN = { heizen: "#e0452c", kuehlen: "#2f7fd0" };

/* Umlaute werden gefaltet (Iteration 14): LocalTuya liefert bei Thomas'
   Inverpower "Kuehlen Smart", die Vorgabe heisst "Kühlen Smart". */
const normZustand = (s) =>
  String(s ?? "")
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[\s_-]+/g, " ")
    .trim();

/* Zuordnungsliste eines Modus: aus der Config (Kommaliste) oder Default */
export const modeZustaende = (c = {}, mode) => {
  const eigen = c[`mode_map_${mode.key}`];
  if (typeof eigen === "string" && eigen.trim()) {
    return eigen.split(",").map((s) => s.trim()).filter(Boolean);
  }
  if (Array.isArray(eigen) && eigen.length) return eigen.map(String);
  return mode.zustaende;
};

/*
 * Automatische Zuordnung (Iteration 14): ein Gerätezustand, der eine
 * Heiz-/Kühl-Angabe UND eine Stufe enthält, wird ohne Liste erkannt —
 * "Kuehlen Power" = Kühlen Boost, "heat_eco" = Heizen Smart. Beides muss
 * drinstehen; "Auto" oder "Heizen" allein bleiben unerkannt (dann zeigt das
 * Badge den Klartext, Tempo/Farbe bleiben neutral). Hintergrund: LocalTuya
 * legt seine Rohwert->Anzeigename-Tabelle im Config-Entry ab, den das
 * Frontend nicht lesen kann — sichtbar sind nur Zustand und `options` der
 * Select-Entity, also die Anzeigenamen. Daran setzt diese Erkennung an.
 */
const AUTO_ART = [
  ["heizen", /heiz|heat/],
  ["kuehlen", /kuehl|cool/],
];
const AUTO_STUFE = [
  ["silent", /silent|leise|quiet|mute/],
  ["smart", /smart|eco/],
  ["boost", /boost|power|turbo|max|strong/],
  ["auto", /auto/],
];
export const modeAuto = (state) => {
  const s = normZustand(state);
  if (!s) return null;
  const arten = AUTO_ART.filter(([, re]) => re.test(s)).map(([a]) => a);
  if (arten.length !== 1) return null;
  const stufe = AUTO_STUFE.find(([, re]) => re.test(s));
  if (!stufe) return null;
  const key = `${arten[0] === "heizen" ? "heiz" : "kuehl"}_${stufe[0]}`;
  return HP_MODES.find((m) => m.key === key) || null;
};

/* Hat der Nutzer die Zuordnung eines Modus selbst gesetzt? */
const eigeneZuordnung = (c, m) => {
  const eigen = c?.[`mode_map_${m.key}`];
  return (typeof eigen === "string" && !!eigen.trim()) || (Array.isArray(eigen) && eigen.length > 0);
};

/*
 * Gerätezustand -> Modus-Eintrag aus HP_MODES (oder null).
 * Reihenfolge: eigene/Vorgabe-Liste, dann die automatische Erkennung — die
 * greift aber nie für einen Modus, dessen Liste der Nutzer selbst gesetzt
 * hat (eigene Zuordnung ist verbindlich).
 */
export const modeFromState = (state, c = {}) => {
  const s = normZustand(state);
  if (!s) return null;
  const liste = HP_MODES.find((m) => modeZustaende(c, m).some((z) => normZustand(z) === s));
  if (liste) return liste;
  const auto = modeAuto(state);
  return auto && !eigeneZuordnung(c, auto) ? auto : null;
};

/*
 * Betriebsmodus als Klartext (Iteration 14) — fürs Badge auf der Card.
 * Übersetzt die üblichen HA-Werte (hvac_mode, preset_mode) ins Deutsche;
 * alles Unbekannte kommt als Rohwert durch (lieber "Abtauen" oder
 * "defrost" zeigen als gar nichts).
 */
export const MODE_WOERTER = {
  off: "Aus",
  aus: "Aus",
  heat: "Heizen",
  heating: "Heizen",
  heizen: "Heizen",
  cool: "Kühlen",
  cooling: "Kühlen",
  kuehlen: "Kühlen",
  kühlen: "Kühlen",
  auto: "Auto",
  "heat cool": "Heizen/Kühlen",
  dry: "Entfeuchten",
  "fan only": "Nur Lüfter",
  idle: "Bereit",
  standby: "Standby",
  silent: "Silent",
  smart: "Smart",
  boost: "Boost",
  turbo: "Turbo",
  powerful: "Power",
  eco: "Eco",
  comfort: "Komfort",
  away: "Abwesend",
  sleep: "Nacht",
  home: "Zuhause",
  activity: "Aktiv",
};

/* Grund-Art eines Werts: heizen / kuehlen / aus — sonst null (neutral) */
const MODE_ART = {
  off: "aus",
  aus: "aus",
  heat: "heizen",
  heating: "heizen",
  heizen: "heizen",
  cool: "kuehlen",
  cooling: "kuehlen",
  kuehlen: "kuehlen",
  kühlen: "kuehlen",
};

const totWert = (s) => ["", "unknown", "unavailable", "none"].includes(normZustand(s));

export const modeWort = (s) => {
  const n = normZustand(s);
  return Object.prototype.hasOwnProperty.call(MODE_WOERTER, n)
    ? MODE_WOERTER[n]
    : String(s ?? "").trim();
};

/*
 * Entity-Zustand -> { text, art } fürs Badge (art: heizen|kuehlen|aus|null).
 *   1. Trifft der Wert einen der acht Modi (HP_MODES), gilt dessen Label —
 *      exakt das, woraus auch Tempo und Farbe des Rads kommen.
 *   2. Bei climate.* wird hvac_mode (Zustand) mit preset_mode kombiniert:
 *      erst als Modus-Kombination ("heat" + "silent" = Heizen Silent), sonst
 *      als "Heizen · Eco". "off" ist immer "Aus", egal welches Preset.
 *   3. Sonst übersetzt, und was keiner kennt, als Rohwert.
 * Ohne brauchbaren Wert (unknown/unavailable): "—".
 */
export const modeBadge = (e, c = {}) => {
  if (!e) return null;
  const attr = String(c.mode_attribute || "").trim();
  const roh = attr ? e.attributes?.[attr] : e.state;
  const m = modeFromState(roh, c);
  if (m) return { text: m.label, art: m.art };
  const climate = String(c.mode_entity || "").startsWith("climate.");
  let basis = roh;
  let preset = null;
  if (climate && (!attr || attr === "preset_mode")) {
    basis = e.state;
    preset = attr ? roh : e.attributes?.preset_mode;
  }
  if (totWert(basis) && totWert(preset)) return { text: "—", art: null };
  const art = MODE_ART[normZustand(basis)] || null;
  if (art === "aus") return { text: "Aus", art };
  if (!totWert(basis) && !totWert(preset)) {
    const kombi = modeFromState(`${basis} ${preset}`, c);
    if (kombi) return { text: kombi.label, art: kombi.art };
  }
  const teile = [basis, preset].filter((x) => !totWert(x)).map(modeWort);
  return { text: teile.join(" · "), art };
};

/*
 * Freigabekontakt (Iteration 12) — Thomas' Erklärstück fürs Video
 * ---------------------------------------------------------------
 * Der Freigabekontakt ist der potentialfreie Eingang der Wärmepumpe:
 *
 *   offen       = die Wärmepumpe darf NICHT laufen — egal, was an ihrem
 *                 eigenen Bedienteil eingestellt ist.
 *   geschlossen = freigegeben; die Wärmepumpe arbeitet nach ihrer eigenen
 *                 Logik weiter.
 *
 * Typischer Zweck: von außen sperren oder freigeben (PV-Überschuss,
 * Zeitfenster, Nachtruhe), ohne in die Einstellungen der Wärmepumpe
 * einzugreifen. In Thomas' Anlage ist das seit 22.09.2026 der Schalter
 * switch.pooltechnik_pool_wp_freigabekontakt.
 *
 * In der Card ist `release_entity` rein optional:
 *   nicht gesetzt -> alles bleibt exakt wie bisher (rückwärtskompatibel)
 *   gesetzt + zu  -> Anzeige "Frei", sonst ändert sich nichts
 *   gesetzt + auf -> Anzeige "Gesperrt" UND der Lüfter steht still, auch
 *                    wenn der Schalter an ist und Watt anliegen. Genau das
 *                    ist der didaktische Kern: die Karte zeigt, dass die
 *                    Wärmepumpe gar nicht laufen KANN.
 * switch/input_boolean lassen sich per Klick umschalten, binary_sensor ist
 * nur Anzeige (dort gibt es nichts zu schalten).
 */
/*
 * Modus wählen (Iteration 15): welche Werte bietet die Modus-Entity an, und
 * mit welchem Dienst wird gesetzt? Liefert Gruppen (meist eine):
 *   select / input_select  -> <domain>.select_option  { option }
 *   climate                -> climate.set_hvac_mode   { hvac_mode }
 *                             climate.set_preset_mode { preset_mode }
 * Mit mode_attribute "preset_mode" nur die Presets; mit einem anderen
 * Attribut oder bei sensor.* ist nichts wählbar (nur Anzeige).
 * Anzeigenamen über dasselbe Mapping wie das Badge.
 */
const optionText = (wert, c) => modeFromState(wert, c)?.label || modeWort(wert);

export const modusWahl = (e, c = {}) => {
  const id = c.mode_entity;
  if (!e || !id) return [];
  const domain = domainOf(id);
  const a = e.attributes || {};
  const attr = String(c.mode_attribute || "").trim();
  const gruppe = (titel, dienstDomain, dienst, feld, liste, aktuell) =>
    Array.isArray(liste) && liste.length
      ? [
          {
            titel,
            domain: dienstDomain,
            service: dienst,
            feld,
            optionen: liste.map((w) => ({
              wert: String(w),
              text: optionText(w, c),
              aktiv: normZustand(w) === normZustand(aktuell),
            })),
          },
        ]
      : [];
  if ((domain === "select" || domain === "input_select") && !attr) {
    return gruppe("Betriebsmodus", domain, "select_option", "option", a.options, e.state);
  }
  if (domain === "climate") {
    if (attr === "preset_mode") {
      return gruppe("Betriebsmodus", "climate", "set_preset_mode", "preset_mode", a.preset_modes, a.preset_mode);
    }
    if (!attr) {
      return [
        ...gruppe("Betriebsart", "climate", "set_hvac_mode", "hvac_mode", a.hvac_modes, e.state),
        ...gruppe("Stufe / Preset", "climate", "set_preset_mode", "preset_mode", a.preset_modes, a.preset_mode),
      ];
    }
  }
  return [];
};

export const heatpumpHasEntity = (c = {}) =>
  !!(
    c.switch_entity ||
    c.power_entity ||
    c.target_entity ||
    c.current_entity ||
    c.release_entity
  );

export class TomtutPoolSlotHeatpump extends SlotBase {
  static properties = {
    ...SlotBase.properties,
    _tick: { state: true },
    _modusWahlOffen: { state: true },
    _modusFehler: { state: true },
  };

  get defaults() {
    return HEATPUMP_DEFAULTS;
  }

  /*
   * "seit …" am Freigabekontakt läuft minütlich mit — der Timer existiert
   * nur, solange die Option an ist und die Card im DOM hängt.
   */
  get _seitAn() {
    const c = this.config || {};
    return c.show_release_since === true && c.show_release !== false && !!c.release_entity;
  }

  _seitTimerPruefen() {
    const soll = this.isConnected && this._seitAn;
    if (soll && !this._seitTimer) {
      this._seitTimer = setInterval(() => {
        this._tick = Date.now();
      }, 60000);
      if (typeof this._seitTimer?.unref === "function") this._seitTimer.unref();
    } else if (!soll && this._seitTimer) {
      clearInterval(this._seitTimer);
      this._seitTimer = undefined;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._seitTimerPruefen();
  }

  disconnectedCallback() {
    clearInterval(this._seitTimer);
    this._seitTimer = undefined;
    super.disconnectedCallback();
  }

  updated(changed) {
    super.updated?.(changed);
    this._seitTimerPruefen();
  }

  get powerEntityId() {
    return this.config?.switch_entity || null;
  }

  get powerConfirmText() {
    return `Eine laufende Wärmepumpe sollte erst am Gerät bzw. über den Betriebsmodus
      ausgeschaltet werden — nicht einfach den Stecker ziehen! Hartes Trennen im Betrieb
      kann Kompressor und Elektronik schaden.`;
  }

  /*
   * Zustand des Freigabekontakts:
   *   null  = keiner konfiguriert, abgewählt oder Entity (noch) unbekannt
   *   true  = Kontakt geschlossen -> freigegeben
   *   false = Kontakt offen -> gesperrt, die Wärmepumpe kann nicht laufen
   * Ein unbekannter/nicht erreichbarer Zustand sperrt bewusst NICHT — eine
   * fehlende Entity darf die Anzeige nicht stillstellen.
   */
  get _freigabe() {
    const c = this.config || {};
    if (c.show_release === false || !c.release_entity) return null;
    const e = this._ent(c.release_entity);
    if (!e) return null;
    const s = String(e.state).toLowerCase();
    if (s === "unknown" || s === "unavailable" || s === "") return null;
    return isOn(s);
  }

  /* binary_sensor ist eine Meldung, kein Schalter — nur Anzeige. */
  get _releaseSchaltbar() {
    const id = this.config?.release_entity;
    return !!id && !String(id).startsWith("binary_sensor.");
  }

  _onReleaseClick(ev) {
    ev?.stopPropagation();
    if (!this.bedienbar || !this._releaseSchaltbar) return;
    this._call(this.config.release_entity, "toggle");
  }

  /*
   * Kleines Kontaktsymbol plus Wort: geschlossener Hebel + grün = frei,
   * abgehobener Hebel + rot = gesperrt. Positionierbar wie jedes andere
   * Overlay (release_top/-_left/-_scale).
   */
  _renderRelease() {
    const freigabe = this._freigabe;
    const gesperrt = freigabe === false;
    const zustand = freigabe === null ? "unbekannt" : gesperrt ? "gesperrt" : "frei";
    const schaltbar = this._releaseSchaltbar;
    const titel =
      freigabe === null
        ? "Freigabekontakt — Zustand unbekannt"
        : !schaltbar
        ? gesperrt
          ? "Freigabekontakt offen — die Wärmepumpe ist gesperrt (nur Anzeige)"
          : "Freigabekontakt geschlossen — die Wärmepumpe ist freigegeben (nur Anzeige)"
        : gesperrt
        ? "Freigabe geben (Kontakt schließen)"
        : "Freigabe entziehen (Kontakt öffnen)";
    return html`
      <div
        class="release-badge ${zustand} ${schaltbar ? "schaltbar" : "nur-anzeige"}"
        style="top:${this._v("release_top")}%; left:${this._v(
          "release_left"
        )}%; transform:translateX(-50%) scale(${(this._v("release_scale") ?? 100) / 100});"
        title="${titel}"
        @click="${this._onReleaseClick}"
      >
        <svg viewBox="0 0 34 20" aria-hidden="true">
          <line x1="1.5" y1="15" x2="8" y2="15" />
          <line x1="26" y1="15" x2="32.5" y2="15" />
          <line x1="8" y1="15" x2="${gesperrt ? 24 : 26}" y2="${gesperrt ? 3.5 : 15}" />
          <circle cx="8" cy="15" r="2.4" />
          <circle cx="26" cy="15" r="2.4" />
        </svg>
        <span class="release-text">
          <span class="val">${freigabe === null ? "—" : gesperrt ? "Gesperrt" : "Frei"}</span>
          <span class="unit">Freigabe</span>
        </span>
        ${this._seitAn && freigabe !== null
          ? html`<span class="release-seit"
              >${seitMinuten(this._ent(this.config.release_entity)?.last_changed)}</span
            >`
          : nothing}
      </div>
    `;
  }

  /* Soll-Temperatur: climate (attributes.temperature) oder number (state) */
  get _target() {
    const id = this.config.target_entity;
    const e = this._ent(id);
    if (!e) return null;
    const climate = String(id).startsWith("climate.");
    const value = climate ? numOf(e.attributes?.temperature) : numOf(e.state);
    if (value === null) return null;
    const a = e.attributes || {};
    return {
      climate,
      value,
      min: climate ? a.min_temp ?? 5 : a.min ?? 5,
      max: climate ? a.max_temp ?? 40 : a.max ?? 40,
      step: this.config.target_step ?? (climate ? a.target_temp_step ?? 0.5 : a.step ?? 0.5),
      unit: climate
        ? this.hass?.config?.unit_system?.temperature ?? "°C"
        : a.unit_of_measurement ?? "°C",
    };
  }

  /* Ist-Temperatur: climate (current_temperature) oder sensor (state) */
  get _current() {
    const id = this.config.current_entity;
    const e = this._ent(id);
    if (!e) return null;
    const climate = String(id).startsWith("climate.");
    const value = climate ? numOf(e.attributes?.current_temperature) : numOf(e.state);
    if (value === null) return null;
    return {
      value,
      unit: climate
        ? this.hass?.config?.unit_system?.temperature ?? "°C"
        : e.attributes?.unit_of_measurement ?? "°C",
    };
  }

  /*
   * Erkannter Betriebsmodus oder null. Quelle ist der Zustand der
   * Modus-Entity oder — wenn `mode_attribute` gesetzt ist (z.B. bei
   * climate.* "preset_mode") — dieses Attribut.
   */
  get _modus() {
    const c = this.config || {};
    if (c.show_mode === false || !c.mode_entity) return null;
    const e = this._ent(c.mode_entity);
    if (!e) return null;
    const attr = String(c.mode_attribute || "").trim();
    const roh = attr ? e.attributes?.[attr] : e.state;
    return modeFromState(roh, c);
  }

  /* Badge-Inhalt (Iteration 14) — null, wenn kein Modus ausgewertet wird */
  get _modusBadge() {
    const c = this.config || {};
    if (c.show_mode === false || c.show_mode_badge === false || !c.mode_entity) return null;
    return modeBadge(this._ent(c.mode_entity), c) || { text: "—", art: null };
  }

  /*
   * Betriebsmodus als Text-Badge — einzeilig (Punkt + Wort), damit es
   * auch in schmalen Spalten neben den Freigabekontakt passt. Farbe = dieselbe Palette wie das Rad
   * (MODE_FARBEN, über die CSS-Variable --tt-mode-farbe); Aus/unbekannt
   * bleibt neutral im Box-Look. Reine Anzeige, kein Klick.
   */
  /* Gruppen der Modus-Auswahl — leer = nur Anzeige */
  get _modusGruppen() {
    const c = this.config || {};
    return modusWahl(this._ent(c.mode_entity), c);
  }

  _onModeClick(ev) {
    ev?.stopPropagation();
    if (!this.bedienbar || !this._modusGruppen.length) return;
    this._modusFehler = "";
    this._modusWahlOffen = true;
  }

  _modusSchliessen(ev) {
    ev?.stopPropagation();
    this._modusWahlOffen = false;
    this._modusFehler = "";
  }

  /*
   * Setzt den gewählten Modus. Ein fehlgeschlagener Dienstaufruf bleibt
   * sichtbar im Dialog stehen (und landet in der Konsole) — nie still.
   */
  async _modusSetzen(gruppe, opt, ev) {
    ev?.stopPropagation();
    if (!this.bedienbar || !this.hass) return;
    this._modusFehler = "";
    try {
      await this.hass.callService(gruppe.domain, gruppe.service, {
        entity_id: this.config.mode_entity,
        [gruppe.feld]: opt.wert,
      });
      this._modusWahlOffen = false;
    } catch (err) {
      const grund = err?.message || err?.error?.message || String(err);
      console.error("tomtut-pool-cards: Modus setzen fehlgeschlagen", err);
      this._modusFehler = `Umschalten auf „${opt.text}“ fehlgeschlagen: ${grund}`;
    }
  }

  _renderModusWahl() {
    if (!this._modusWahlOffen || !this.bedienbar) return nothing;
    const gruppen = this._modusGruppen;
    return html`
      <div class="confirm-overlay modus-overlay" @click="${this._modusSchliessen}">
        <div class="confirm-panel modus-panel" @click="${(e) => e.stopPropagation()}">
          <h3 class="modus-kopf">Betriebsmodus wählen</h3>
          ${gruppen.map(
            (g) => html`
              ${gruppen.length > 1 ? html`<div class="modus-gruppe">${g.titel}</div>` : nothing}
              <div class="modus-optionen">
                ${g.optionen.map(
                  (o) => html`<button
                    class="modus-option ${o.aktiv ? "aktiv" : ""}"
                    data-wert="${o.wert}"
                    aria-pressed="${o.aktiv ? "true" : "false"}"
                    @click="${(e) => this._modusSetzen(g, o, e)}"
                  >
                    <span class="modus-haken">${o.aktiv ? "✓" : ""}</span>${o.text}
                  </button>`
                )}
              </div>
            `
          )}
          ${this._modusFehler
            ? html`<div class="modus-fehler" role="alert">${this._modusFehler}</div>`
            : nothing}
          <div class="confirm-actions">
            <button class="btn cancel" @click="${this._modusSchliessen}">Schließen</button>
          </div>
        </div>
      </div>
    `;
  }

  _renderModeBadge(b) {
    const farbe = MODE_FARBEN[b.art] || "";
    const waehlbar = this.bedienbar && this._modusGruppen.length > 0;
    return html`
      <div
        class="mode-badge ${b.art || "neutral"} ${waehlbar ? "waehlbar" : ""}"
        style="top:${this._v("mode_top")}%; left:${this._v(
          "mode_left"
        )}%; transform:translateX(-50%) scale(${(this._v("mode_scale") ?? 100) / 100});${farbe
          ? ` --tt-mode-farbe:${farbe};`
          : ""}"
        title="Betriebsmodus: ${b.text}${waehlbar ? " — tippen zum Ändern" : ""}"
        @click="${this._onModeClick}"
      >
        <span class="mode-punkt"></span>
        <span class="val">${b.text}</span>
      </div>
    `;
  }

  /* Umlaufzeit des Rads: aus dem Modus, sonst der alte 0..100-Regler */
  get _fanDur() {
    const modus = this._modus;
    if (modus) return fanDuration(this._v(`mode_speed_${modus.key}`));
    const fanSpeed = Number(this._v("fan_speed")) || 0;
    return fanSpeed <= 0 ? 0 : Math.max(0.2, 4 - (fanSpeed / 100) * 3.6);
  }

  /* Farbe des Rads: nur bei "nach Modus" und erkanntem Modus */
  get _fanFarbe() {
    if (this._v("fan_color_mode") !== "modus") return "";
    const modus = this._modus;
    return modus ? MODE_FARBEN[modus.art] : "";
  }

  get _fanActive() {
    /* Freigabekontakt offen = die Wärmepumpe KANN nicht laufen. Das schlägt
       alles andere: Schalter an, Lüfter-Entity, anliegende Watt — egal. */
    if (this._freigabe === false) return false;
    /* Schalter aus = das Rad steht. Immer — egal, was die Watt sagen
       (Nachlauf, träger Sensor, Standby-Verbrauch). */
    const sw = this.config.switch_entity;
    if (sw && this._ent(sw) && !this._isOn(sw)) return false;
    const mode = this.config.fan_source ?? "auto";
    const fanEnt = this._ent(this.config.fan_entity);
    if (mode !== "power" && fanEnt) {
      const s = String(fanEnt.state).toLowerCase();
      if (isOn(s)) return true;
      const n = numOf(s);
      return n !== null && n > 0;
    }
    if (mode === "entity") return false;
    const w = this._watt(this.config.power_entity);
    if (w === null) return false;
    return w >= Number(this._v("fan_power_threshold"));
  }

  _stepTarget(delta) {
    const t = this._target;
    if (!this.bedienbar || !t || !this.hass) return;
    let next = Math.round((t.value + delta * t.step) / t.step) * t.step;
    next = Math.min(t.max, Math.max(t.min, next));
    next = Math.round(next * 100) / 100;
    if (next === t.value) return;
    if (t.climate) {
      this.hass.callService("climate", "set_temperature", {
        entity_id: this.config.target_entity,
        temperature: next,
      });
    } else {
      this.hass.callService("number", "set_value", {
        entity_id: this.config.target_entity,
        value: next,
      });
    }
  }

  _targetUp(ev) {
    ev?.stopPropagation();
    this._stepTarget(1);
  }

  _targetDown(ev) {
    ev?.stopPropagation();
    this._stepTarget(-1);
  }

  /* Rendert immer — auch ohne hass und ohne eine einzige Entity. */
  render() {
    const c = this.config || {};
    const configured = heatpumpHasEntity(c);

    const showFan = c.show_fan !== false;
    const showPowerBtn = c.show_power_button !== false && !!c.switch_entity;
    const showRelease = c.show_release !== false && !!c.release_entity;
    const showPower = c.show_power !== false && !!c.power_entity;
    const showTarget = c.show_target !== false && !!c.target_entity;
    const showCurrent = c.show_current !== false && !!c.current_entity;
    const labelText = c.label_text || "";
    const modusBadge = this._modusBadge;

    const fanDur = this._fanDur;
    const target = this._target;
    const current = this._current;

    return this.renderSlot(html`
      <div class="img-wrap">
        ${this.renderGeraeteBild({ kind: "heatpump", alt: "Wärmepumpe" })}

        ${showFan
          ? this.renderFan({
              active: configured && this._fanActive,
              top: this._v("fan_top"),
              left: this._v("fan_left"),
              size: this._v("fan_size"),
              ratio: this._v("fan_ratio"),
              dur: fanDur,
              inactive: this._v("fan_inactive"),
              design: this._v("fan_design"),
              farbe: this._fanFarbe,
            })
          : nothing}
        ${showPowerBtn
          ? this.renderPowerButton({
              on: this._isOn(c.switch_entity),
              top: this._v("power_btn_top"),
              left: this._v("power_btn_left"),
              scale: this._v("power_btn_scale"),
            })
          : nothing}
        ${showRelease ? this._renderRelease() : nothing}
        ${modusBadge ? this._renderModeBadge(modusBadge) : nothing}
        ${showPower
          ? this.renderValueBox({
              value: this.wattText(c.power_entity),
              unit: this._v("power_label") === false ? "" : "Watt",
              top: this._v("power_top"),
              left: this._v("power_left"),
              scale: this._v("power_scale"),
              box: this._v("power_box"),
              entity: c.power_entity,
            })
          : nothing}
        ${showCurrent
          ? this.renderValueBox({
              value: current === null ? "—" : fmt(current.value, 1) + " " + current.unit,
              unit: this._v("current_label") === false ? "" : "Ist",
              bottom: this._v("current_bottom"),
              left: this._v("current_left"),
              scale: this._v("current_scale"),
              box: this._v("current_box"),
              entity: c.current_entity,
            })
          : nothing}
        ${showTarget
          ? html`
              <div
                class="value-box target ${this._v("target_box") === false ? "no-bg" : ""}"
                style="bottom:${this._v("target_bottom")}%; left:${this._v(
                  "target_left"
                )}%; transform:translateX(-50%) scale(${(this._v("target_scale") ?? 100) / 100});"
              >
                <div class="target-row">
                  <button
                    class="step"
                    ?disabled="${target === null}"
                    @click="${this._targetDown}"
                    title="Soll-Temperatur senken"
                  >
                    −
                  </button>
                  <div class="target-val">
                    <span class="val"
                      >${target === null ? "—" : fmt(target.value, 1) + " " + target.unit}</span
                    >
                    ${this._v("target_label") === false
                      ? nothing
                      : html`<span class="unit">Soll</span>`}
                  </div>
                  <button
                    class="step"
                    ?disabled="${target === null}"
                    @click="${this._targetUp}"
                    title="Soll-Temperatur anheben"
                  >
                    +
                  </button>
                </div>
              </div>
            `
          : nothing}
        ${labelText
          ? html`
              <div
                class="label-badge ${this._v("label_box") === false ? "no-bg" : ""}"
                style="top:${this._v("label_top")}%; left:${this._v(
                  "label_left"
                )}%; transform:translateX(-50%) scale(${(this._v("label_scale") ?? 100) / 100});"
              >
                ${labelText}
              </div>
            `
          : nothing}
        ${this.renderConfirm("Wirklich stromlos schalten?")} ${this._renderModusWahl()}
      </div>
      ${configured
        ? nothing
        : html`<p class="slot-hint">
            Wärmepumpe: bitte mindestens eine Entity wählen (Schalter, Leistung, Soll oder Ist).
          </p>`}
    `);
  }

  static styles = [
    frameStyles,
    overlayStyles,
    css`
      .value-box.target {
        padding: 0.35em 0.5em;
      }
      .target-row {
        display: flex;
        align-items: center;
        gap: 0.5em;
      }
      .target-val {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .step {
        background: var(--tt-soft);
        color: inherit;
        border: 1px solid var(--tt-line);
        border-radius: 0.5em;
        width: 1.9em;
        height: 1.9em;
        font-size: 1.15em;
        font-weight: 700;
        line-height: 1;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s, transform 0.1s;
      }
      .step:hover {
        filter: brightness(1.15);
      }
      .step:active {
        transform: scale(0.92);
      }
      .step[disabled] {
        opacity: 0.35;
        cursor: not-allowed;
      }

      /*
       * Freigabekontakt (Iteration 12). Zwei Zustände, sofort erkennbar:
       * geschlossener Kontakt + grün = frei, abgehobener Hebel + rot =
       * gesperrt. Der Kasten sitzt in derselben z-index-Leiter wie die
       * übrigen Overlays (4, nie über 10 — s. shared/styles.js).
       */
      .release-badge {
        position: absolute;
        display: flex;
        align-items: center;
        gap: 0.45em;
        padding: 0.3em 0.6em;
        border-radius: 0.7em;
        background: var(--tt-box-bg);
        color: var(--tt-box-fg);
        border: 1.5px solid var(--tt-line);
        line-height: 1.15;
        white-space: nowrap;
        backdrop-filter: blur(4px);
        cursor: default;
        transition: border-color 0.3s, box-shadow 0.3s;
        z-index: 4;
      }
      .release-badge.schaltbar {
        cursor: pointer;
      }
      .release-badge.schaltbar:hover {
        filter: brightness(1.15);
      }
      .release-badge svg {
        width: 2.3em;
        height: auto;
        display: block;
        fill: none;
        stroke: currentColor;
        stroke-width: 2.2;
        stroke-linecap: round;
        color: #9e9e9e;
      }
      .release-badge svg circle {
        fill: currentColor;
        stroke: none;
      }
      .release-badge .release-text {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
      .release-badge .val {
        font-size: 1.05em;
      }
      .release-badge .unit {
        margin-top: 0;
      }
      .release-badge.frei {
        border-color: #4caf50;
      }
      .release-badge.frei svg,
      .release-badge.frei .val {
        color: #4caf50;
      }
      .release-badge.gesperrt {
        border-color: #ef5350;
        box-shadow: 0 0 9px rgba(244, 67, 54, 0.45);
      }
      .release-badge.gesperrt svg,
      .release-badge.gesperrt .val {
        color: #ef5350;
      }

      /* "seit …" klein unter dem Freigabe-Badge (Iteration 14) */
      .release-badge .release-seit {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 0.15em;
        padding: 0.05em 0.45em;
        border-radius: 0.5em;
        background: var(--tt-box-bg);
        color: var(--tt-box-fg);
        font-size: 0.72em;
        font-weight: 600;
        white-space: nowrap;
      }

      /*
       * Betriebsmodus-Badge (Iteration 14). Gleicher Kasten wie der
       * Freigabekontakt; Rand, Punkt und Wort nehmen die Modusfarbe des
       * Rads an (--tt-mode-farbe aus MODE_FARBEN). Ohne Farbe: Box-Look.
       */
      .mode-badge {
        position: absolute;
        display: flex;
        align-items: center;
        gap: 0.45em;
        padding: 0.35em 0.7em;
        border-radius: 0.7em;
        background: var(--tt-box-bg);
        color: var(--tt-box-fg);
        border: 1.5px solid var(--tt-mode-farbe, var(--tt-line));
        line-height: 1.15;
        white-space: nowrap;
        backdrop-filter: blur(4px);
        pointer-events: none;
        z-index: 4;
      }
      .mode-badge .mode-punkt {
        width: 0.75em;
        height: 0.75em;
        border-radius: 50%;
        background: var(--tt-mode-farbe, var(--tt-line));
        flex: none;
      }
      .mode-badge .val {
        font-size: 1.05em;
        color: var(--tt-mode-farbe, inherit);
      }
      .mode-badge .unit {
        margin-top: 0;
      }
      .mode-badge.aus {
        opacity: 0.75;
      }
      /* Iteration 15: mit wählbarer Entity ist das Badge ein Knopf */
      .mode-badge.waehlbar {
        pointer-events: auto;
        cursor: pointer;
      }
      .mode-badge.waehlbar:hover {
        filter: brightness(1.12);
      }

      /* Modus-Auswahl — sitzt in der Dialog-Stufe (confirm-overlay, z 10) */
      .modus-panel {
        padding: 14px 16px;
      }
      .modus-panel .modus-kopf {
        color: var(--primary-text-color, inherit);
        margin-bottom: 6px;
      }
      .modus-gruppe {
        margin: 6px 0 4px;
        font-size: 0.8em;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        opacity: 0.7;
      }
      .modus-optionen {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(9.5em, 1fr));
        gap: 6px;
        margin-bottom: 8px;
      }
      .modus-option {
        display: flex;
        align-items: center;
        gap: 0.4em;
        padding: 0.4em 0.6em;
        border-radius: 10px;
        border: 1.5px solid var(--divider-color, var(--tt-line));
        background: transparent;
        color: inherit;
        font: inherit;
        font-weight: 600;
        text-align: left;
        cursor: pointer;
      }
      .modus-option:hover {
        filter: brightness(1.15);
      }
      .modus-option.aktiv {
        border-color: var(--primary-color, currentColor);
        background: var(--tt-soft);
      }
      .modus-haken {
        width: 1em;
        color: var(--primary-color, currentColor);
      }
      .modus-fehler {
        margin: 0 0 12px;
        padding: 8px 10px;
        border-radius: 8px;
        border: 1px solid var(--error-color, currentColor);
        color: var(--error-color, inherit);
        font-size: 0.9em;
      }
    `,
  ];
}

customElements.define("tomtut-pool-slot-heatpump", TomtutPoolSlotHeatpump);
