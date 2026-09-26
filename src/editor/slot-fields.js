import { html, nothing } from "lit";
import { section, gruppe } from "../shared/fields.js";
import { SHAPES } from "../shared/assets.js";
import { TEIL_GROESSE_MIN, TEIL_GROESSE_MAX } from "../hero.js";
import { FAN_SPEED_MIN, FAN_SPEED_MAX, stufenListe } from "../slots/pump.js";
import { HP_MODES, modeFromState, optionZuordnung } from "../slots/heatpump.js";
import { FAN_DESIGNS, slotLabel } from "../shared/slot-base.js";
import { GROESSE_MIN, GROESSE_MAX } from "../shared/bild.js";
import { domainOf, numOf } from "../shared/util.js";
import {
  CUSTOM_MAX_ENTRIES,
  CUSTOM_LAYOUT_DEFAULT,
  customEintraege,
  customLayout,
} from "../slots/custom.js";

/*
 * Die Felder der einzelnen Kasten-Typen (seit Iteration 23).
 *
 * Jede Funktion liefert die Teile eines Kastens in fester Reihenfolge
 * (Testbericht 26.09.2026, Abschnitt C):
 *   pflicht    was der Kasten braucht, um etwas zu zeigen
 *   anaus      Schalter + "Vor dem Ausschalten nachfragen"
 *   anzeige    weitere Werte auf dem Bild
 *   optik      Aussehen
 *   erweitert  Liste von Gruppen für das EINE zugeklappte "Erweitert":
 *              Positionen, Feintuning, Ausblenden
 * Der Editor (dashboard-editor.js) setzt daraus den Kasten zusammen, mit
 * der Überschrift (`label`) ganz oben.
 *
 * Es gibt keinen Block "Elemente anzeigen" mehr: ein Element erscheint auf
 * der Card, sobald seine Entity gesetzt ist. Ausblenden trotz Entity steht
 * unter Erweitert ("X anzeigen", schreibt show_*: false).
 *
 * Domain-Filter je Feldart, damit im Picker nur Passendes auftaucht.
 */
const SCHALTER = ["switch", "input_boolean", "light"];
const VERBRAUCH = ["sensor", "input_number"];
const MESSWERT = ["sensor", "input_number", "number"];
/* Soll: nur, was sich stellen lässt (Iteration 22, Bug A2) */
const SOLL = ["climate", "number", "input_number"];
const IST = ["climate", "sensor", "input_number", "number"];
const MODUS = ["sensor", "select", "input_select", "climate"];
/* Freigabekontakt: schaltbar (switch/input_boolean) oder nur Meldung */
const FREIGABE = ["switch", "input_boolean", "binary_sensor"];
/* Freifeld (Iteration 23, Bug A14: input_select, select, cover, script, fan fehlten) */
const FREIFELD = [
  "sensor",
  "binary_sensor",
  "switch",
  "light",
  "input_boolean",
  "input_number",
  "number",
  "climate",
  "input_select",
  "select",
  "cover",
  "script",
  "fan",
];

/*
 * "Vor dem Ausschalten nachfragen" — derselbe Schalter in jedem Kasten mit
 * Powerbutton (Iteration 9). Ab Werk an, wie bisher.
 */
const NACHFRAGEN = "Vor dem Ausschalten nachfragen";
const nachfragen = (
  f,
  def = true,
  hinweis = "Aus = ein Tippen auf den Powerbutton schaltet sofort ab, ohne Warnung."
) => html`
  ${f.toggle(NACHFRAGEN, "confirm_off", def)}
  <small>${hinweis}</small>
`;

/* ---------------- Überschrift: einheitlich `label`, ganz oben ---------------- */

/*
 * Iteration 23: jeder Kasten schreibt seine Beschriftung in `label`. Alte
 * Configs mit `label_text` (Wärmepumpe, Becken) oder `title` (Freifeld,
 * Rahmen) werden gelesen und beim ersten Tippen auf `label` umgestellt —
 * die Card zeigt beide gleich (shared/slot-base.js: slotLabel).
 */
export const labelFeld = (f, titel, platzhalter) => html`
  <label class="label-feld"
    >${titel}
    <input
      type="text"
      data-key="label"
      .value="${slotLabel(f.config)}"
      placeholder="${platzhalter}"
      @input="${(e) => f.update({ label: e.target.value || undefined, label_text: undefined, title: undefined })}"
    />
  </label>
`;

/* ---------------- Vorschläge (weniger Klicks bei der Neu-Anlage) ---------------- */

const gibts = (f, id) => !!id && !!f.hass?.states?.[id];

/*
 * Stufen N2/N3/STOP aus N1 ableiten: "switch.shelly_pumpe_n1" ->
 * "_n2", "_n3", "_stopp"/"_stop". Vorgeschlagen wird nur, was es in HA gibt
 * und was noch leer ist.
 */
export const stufenVorschlag = (f) => {
  const liste = stufenListe(f.config);
  const n1 = liste[0];
  if (!n1) return {};
  const m = /^(.*?)(\d)$/.exec(n1);
  if (!m || m[2] !== "1") return {};
  const basis = m[1];
  const patch = {};
  const neu = [...liste];
  for (const [i, z] of [
    [1, "2"],
    [2, "3"],
  ]) {
    if (!neu[i] && neu.length === i && gibts(f, basis + z)) neu[i] = basis + z;
  }
  if (neu.length !== liste.length) patch.stage_entities = neu;
  if (!f.config?.stop_entity) {
    const ohneN = basis.replace(/_?n$/i, "");
    const stop = [basis + "stopp", basis + "stop", `${ohneN}_stopp`, `${ohneN}_stop`, basis + "0"].find((id) =>
      gibts(f, id)
    );
    if (stop) patch.stop_entity = stop;
  }
  return patch;
};

/*
 * Leistungssensor aus dem Schalter ableiten: "switch.poolpumpe" ->
 * "sensor.poolpumpe_power"; "input_boolean.test_wp_schalter" ->
 * "input_number.test_wp_watt". Nur, wenn es die Entity gibt.
 */
export const leistungVorschlag = (f, schalterKey) => {
  const sw = f.config?.[schalterKey];
  if (!sw || f.config?.power_entity) return null;
  const obj = String(sw).split(".")[1] || "";
  const basen = [obj, obj.replace(/_(schalter|switch|haupt|main|steckdose|relay|relais|plug)$/i, "")];
  for (const b of basen) {
    for (const d of ["sensor", "input_number"]) {
      for (const s of ["_power", "_leistung", "_watt", "_current_power", "_power_consumption"]) {
        if (gibts(f, `${d}.${b}${s}`)) return `${d}.${b}${s}`;
      }
    }
  }
  return null;
};

const leistungMitVorschlag = (f, schalterKey, hint) => {
  const v = leistungVorschlag(f, schalterKey);
  return html`
    ${f.entity("Stromverbrauch", "power_entity", hint, ...VERBRAUCH)}
    ${v ? f.vorschlag(`${v} übernehmen`, { power_entity: v }) : nothing}
  `;
};

/* ---------------- Becken (Hero) ---------------- */

/*
 * Größe und Lage eines Becken-Sprites (Skimmer, Einlaufdüse, Bodenablauf).
 * Iteration 20: dieselben drei Regler bearbeiten wahlweise die Werte der
 * vollen Ansicht (<anker>_*) oder der Mini-Ansicht (mini_<anker>_*) — je
 * nach Umschalter "Positionen für" (f.teilePos). Die Card klemmt jedes Teil
 * in die Beckenbild-Fläche (hero.js: teilLage).
 */
const spriteFelder = (f, titel, anker, schalter, standard) => {
  if (!f.shown(schalter, standard)) return nothing;
  const mini = f.teilePos === "mini";
  const k = (achse) => `${mini ? "mini_" : ""}${anker}_${achse}`;
  const eigeneMini = ["top", "left", "size"].some((a) => f.raw(`mini_${anker}_${a}`) !== "");
  return html`
    <div class="unter-gruppe" data-teil="${anker}" data-teil-pos="${mini ? "mini" : "voll"}">
      <div class="unter-titel">${titel} (${mini ? "Mini" : "Voll"})</div>
      ${f.slider("Größe", k("size"), TEIL_GROESSE_MIN, TEIL_GROESSE_MAX, "%", 0.5)}
      ${f.slider("Von links", k("left"), 0, 100, "%", 0.5)}
      ${f.slider("Von oben", k("top"), 0, 100, "%", 0.5)}
      ${mini && eigeneMini
        ? html`<button
            type="button"
            class="teil-reset"
            data-teil-reset="${anker}"
            @click="${() =>
              f.update({
                [`mini_${anker}_top`]: undefined,
                [`mini_${anker}_left`]: undefined,
                [`mini_${anker}_size`]: undefined,
              })}"
          >
            Mini-Werte zurücksetzen (wie Voll)
          </button>`
        : nothing}
    </div>
  `;
};

/* Umschalter "Positionen für: Voll / Mini" (Zustand lebt im Editor) */
const teilePosWahl = (f) =>
  f.setTeilePos
    ? html`<div class="teile-pos" role="group" aria-label="Positionen für">
        <span class="row-label">Positionen der Becken-Teile für</span>
        <div class="ansicht-wahl">
          ${["voll", "mini"].map(
            (w) => html`<button
              type="button"
              class="ansicht-knopf ${f.teilePos === w ? "aktiv" : ""}"
              data-teile-pos="${w}"
              aria-pressed="${f.teilePos === w ? "true" : "false"}"
              @click="${() => f.setTeilePos(w)}"
            >
              ${w === "voll" ? "Voll" : "Mini"}
            </button>`
          )}
        </div>
      </div>`
    : nothing;

export const heroFields = (f) => ({
  pflicht: html`
    ${f.select(
      "Beckenform",
      "shape",
      Object.entries(SHAPES).map(([k, s]) => [k, s.label]),
      "oval"
    )}
    ${f.entity("Wassertemperatur", "temp_entity", "Thermometer auf der Wasserfläche.", ...MESSWERT)}
  `,
  anzeige: html`
    ${f.entity("pH-Wert", "ph_entity", "Kästchen auf der Beckenwand.", ...MESSWERT)}
    ${f.entity("Redox / RX", "rx_entity", "Kästchen auf der Beckenwand.", ...MESSWERT)}
    ${f.entity(
      "Temperatur am Einlauf",
      "inlet_temp_entity",
      "Kleines Kästchen unter der Einlaufdüse — zeigt, was gerade ins Becken läuft.",
      ...MESSWERT
    )}
  `,
  optik: html`
    <div class="haken-reihe">
      ${f.zeigen("Skimmer", "show_skimmer", true)} ${f.zeigen("Einlaufdüse", "show_inlet", true)}
      ${f.zeigen("Bodenablauf", "show_drain", false)}
    </div>
    ${f.toggle("Becken mit Rahmen", "framed", false)}
  `,
  erweitert: [
    gruppe(
      "Thermometer, pH, RX",
      html`
        ${f.slider("Thermometer — Größe", "thermo_scale", 50, 200)}
        ${f.slider("Thermometer — von oben", "thermo_top", 0, 100, "%", 0.5)}
        ${f.slider("Thermometer — von links", "thermo_left", 0, 100, "%", 0.5)}
        ${f.slider("pH — von oben", "ph_top", 0, 100, "%", 0.5)}
        ${f.slider("pH — von links", "ph_left", 0, 100, "%", 0.5)}
        ${f.slider("RX — von oben", "rx_top", 0, 100, "%", 0.5)}
        ${f.slider("RX — von links", "rx_left", 0, 100, "%", 0.5)}
      `
    ),
    f.raw("inlet_temp_entity")
      ? gruppe(
          "Einlauf-Temperatur",
          html`
            ${f.slider("Von oben", "inlet_temp_top", 0, 100, "%", 0.5)}
            ${f.slider("Von links", "inlet_temp_left", 0, 100, "%", 0.5)}
            <small>Ohne eigene Werte hängt das Kästchen unter der Düse und wandert mit ihr.</small>
          `
        )
      : nothing,
    gruppe(
      "Becken-Teile (Skimmer, Düse, Bodenablauf)",
      html`
        ${teilePosWahl(f)} ${spriteFelder(f, "Skimmer", "skimmer", "show_skimmer", true)}
        ${spriteFelder(f, "Einlaufdüse", "inlet", "show_inlet", true)}
        ${spriteFelder(f, "Bodenablauf", "drain", "show_drain", false)}
        <small>Größe = Breite in % der Beckenbreite. Jedes Teil bleibt immer ganz im Beckenbild.</small>
      `
    ),
    slotLabel(f.config)
      ? gruppe(
          "Freitext",
          html`
            ${f.slider("Größe", "label_scale", 50, 200)}
            ${f.slider("Von oben", "label_top", 0, 100, "%", 0.5)}
            ${f.slider("Von links", "label_left", 0, 100, "%", 0.5)}
          `
        )
      : nothing,
    gruppe(
      "Ausblenden",
      html`<div class="haken-reihe">
        ${f.zeigen("Thermometer", "show_thermo")} ${f.zeigen("pH", "show_ph")} ${f.zeigen("RX", "show_rx")}
      </div>`
    ),
  ],
});

/* ---------------- Wärmepumpe ---------------- */

/*
 * Live-Befund der Modus-Erkennung (Iteration 14): was meldet die gewählte
 * Entity gerade, und welcher der acht Modi wird daraus? Dazu — wenn die
 * Entity sie hat — alle ihre Optionen (select: `options`, climate:
 * `preset_modes` bzw. `hvac_modes`) mit ihrer Zuordnung.
 */
export const modusBefund = (hass, c = {}) => {
  const id = c.mode_entity;
  const e = id ? hass?.states?.[id] : null;
  if (!e) return null;
  const attr = String(c.mode_attribute || "").trim();
  const roh = attr ? e.attributes?.[attr] : e.state;
  const a = e.attributes || {};
  const optionen = Array.isArray(a.options)
    ? a.options
    : attr === "preset_mode" && Array.isArray(a.preset_modes)
    ? a.preset_modes
    : !attr && Array.isArray(a.hvac_modes)
    ? a.hvac_modes
    : [];
  return {
    roh: roh ?? "",
    modus: modeFromState(roh, c),
    optionen: optionen.map((o) => ({ wert: String(o), modus: modeFromState(o, c) })),
  };
};

/*
 * Modus-Zuordnung (Iteration 19). Kennt die Entity ihre Werte, steht pro
 * Wert EINE Zeile "Wert → [Modus]", vorbelegt mit dem, was die Card daraus
 * macht. Ändern schreibt mode_map: { Wert: modus } — nur Abweichungen von
 * der Automatik; "" = bewusst nicht zuordnen (dann optional ein eigener
 * Anzeigename in mode_names). Ohne Werteliste: die acht Freitextfelder.
 */
const ohneMap = (c) => {
  const k = { ...(c || {}) };
  delete k.mode_map;
  return k;
};
const ohneSchluessel = (obj, wert) => {
  const n = String(wert).toLowerCase();
  return Object.fromEntries(Object.entries(obj || {}).filter(([k]) => k.toLowerCase() !== n));
};

export const modusZeilen = (hass, c = {}) => {
  const b = modusBefund(hass, c);
  if (!b || !b.optionen.length) return [];
  return b.optionen.map(({ wert }) => {
    const auto = modeFromState(wert, ohneMap(c));
    const eigen = optionZuordnung(wert, c);
    const aktuell = eigen !== undefined ? eigen?.key || "" : auto?.key || "";
    return { wert, auto: auto?.key || "", aktuell, name: String(c.mode_names?.[wert] ?? "") };
  });
};

const modusZuordnungFelder = (f) => {
  const c = f.config || {};
  const b = modusBefund(f.hass, c);
  const zeile = !b
    ? html`<div class="modus-befund">Erst die Modus-Entity wählen.</div>`
    : html`<div class="modus-befund ${b.modus ? "ok" : "nein"}">
        Meldet gerade <b>${String(b.roh) || "—"}</b> →
        ${b.modus ? html`<b>${b.modus.label}</b> ✓` : html`nicht zugeordnet ✗`}
      </div>`;
  const zeilen = modusZeilen(f.hass, c);
  const setzeModus = (wert, auto, v) => {
    const map = ohneSchluessel(c.mode_map, wert);
    if (v !== auto) map[wert] = v;
    const patch = { mode_map: Object.keys(map).length ? map : undefined };
    if (v) {
      const namen = ohneSchluessel(c.mode_names, wert);
      patch.mode_names = Object.keys(namen).length ? namen : undefined;
    }
    f.update(patch);
  };
  const setzeName = (wert, text) => {
    const namen = ohneSchluessel(c.mode_names, wert);
    if (String(text).trim()) namen[wert] = String(text).trim();
    f.update({ mode_names: Object.keys(namen).length ? namen : undefined });
  };
  const auswahl = zeilen.length
    ? html`<div class="modus-zeilen">
        ${zeilen.map(
          (z) => html`<div class="modus-zeile ${z.aktuell ? "ok" : "nein"}" data-modus-wert="${z.wert}">
            <span class="modus-wert">${z.wert}</span>
            <span class="modus-pfeil">→</span>
            <select
              data-modus-select="${z.wert}"
              @change="${(e) => setzeModus(z.wert, z.auto, e.target.value)}"
            >
              <option value="" ?selected="${!z.aktuell}">— nicht zuordnen —</option>
              ${HP_MODES.map(
                (m) => html`<option value="${m.key}" ?selected="${z.aktuell === m.key}">${m.label}</option>`
              )}
            </select>
            ${z.aktuell
              ? nothing
              : html`<input
                  type="text"
                  class="modus-name"
                  data-modus-name="${z.wert}"
                  .value="${z.name}"
                  placeholder="Anzeigename (sonst „${z.wert}“)"
                  @change="${(e) => setzeName(z.wert, e.target.value)}"
                />`}
          </div>`
        )}
      </div>`
    : html`${HP_MODES.map((m) => {
          const key = `mode_map_${m.key}`;
          const standard = m.zustaende.join(", ");
          const eigen = c[key];
          const wert = Array.isArray(eigen)
            ? eigen.join(", ")
            : String(eigen ?? "").trim()
            ? String(eigen)
            : standard;
          return html`<label
            >${m.label}
            <input
              type="text"
              data-key="${key}"
              .value="${wert}"
              @change="${(e) => {
                const v = e.target.value.trim();
                f.update({ [key]: !v || v === standard ? undefined : v });
              }}"
            />
          </label>`;
        })}
        <small>Kommaliste der Gerätezustände je Modus. Leeren = Vorgabe.</small>`;
  return section(
    "Modus-Zuordnung",
    html`${zeile} ${auswahl}`,
    /* zu — außer die aktuelle Meldung ist nicht zugeordnet */
    !!b && !b.modus && String(b.roh) !== "" && !["unknown", "unavailable"].includes(String(b.roh))
  );
};

/*
 * "Klima-Entity" (Iteration 23): EIN Feld füllt Soll und Ist zugleich — die
 * meisten Wärmepumpen liefern beides über dieselbe climate-Entity. Getrennt
 * (z.B. input_number + sensor) geht es unter Erweitert.
 */
const klimaFeld = (f) => {
  const soll = String(f.raw("target_entity"));
  const ist = String(f.raw("current_entity"));
  const gleich = !!soll && soll === ist;
  const getrennt = (soll || ist) && !gleich;
  return html`
    ${f._entityInput({
      label: "Klima-Entity (Soll + Ist)",
      hint: "climate.* der Wärmepumpe — füllt Soll- und Ist-Temperatur in einem.",
      domains: ["climate"],
      value: gleich ? soll : "",
      dataKey: "klima",
      listId: `${f.idPrefix}-klima`,
      onChange: (v) => f.update({ target_entity: v || undefined, current_entity: v || undefined }),
    })}
    ${getrennt
      ? html`<small class="getrennt" data-getrennt
          >Getrennt gesetzt — Soll: <b>${soll || "—"}</b> · Ist: <b>${ist || "—"}</b> (ändern unter
          Erweitert).</small
        >`
      : nothing}
  `;
};

/* Schrittweite von +/−: automatisch aus der Entity, Override unter Erweitert */
const schrittWahl = (f) => {
  const e = f.hass?.states?.[f.config?.target_entity];
  const auto = e
    ? domainOf(f.config.target_entity) === "climate"
      ? numOf(e.attributes?.target_temp_step) ?? 0.5
      : numOf(e.attributes?.step) ?? 0.5
    : null;
  const eigen = f.config?.target_step;
  const leer = eigen === undefined || eigen === null || eigen === "";
  return html`
    <div class="row">
      <span class="row-label">Schrittweite +/−</span>
      <select
        data-key="target_step"
        @change="${(e) =>
          f.update({ target_step: e.target.value === "auto" ? undefined : Number(e.target.value) })}"
      >
        <option value="auto" ?selected="${leer}">
          Automatisch${auto !== null ? ` (aus der Entity: ${String(auto).replace(".", ",")})` : ""}
        </option>
        ${[0.1, 0.2, 0.5, 1].map(
          (w) =>
            html`<option value="${w}" ?selected="${!leer && Number(eigen) === w}">
              ${String(w).replace(".", ",")} °C
            </option>`
        )}
      </select>
    </div>
  `;
};

const STILLSTAND = [
  ["gray", "Grau + stehend"],
  ["hidden", "Ausblenden"],
];

export const heatpumpFields = (f) => {
  const c = f.config || {};
  const modusErkannt = !!modusBefund(f.hass, c)?.modus;
  return {
    pflicht: klimaFeld(f),
    anaus: html`
      ${f.entity(
        "Schalter (Powerbutton)",
        "switch_entity",
        "z.B. die Shelly-Steckdose der Wärmepumpe. Ist er aus, steht der Lüfter immer.",
        ...SCHALTER
      )}
      ${c.switch_entity ? nachfragen(f) : nothing}
    `,
    anzeige: html`
      ${leistungMitVorschlag(f, "switch_entity", "Leistungssensor in W oder kW (z.B. Shelly).")}
      ${f.entity(
        "Betriebsmodus",
        "mode_entity",
        "sensor, select, input_select oder climate — Heizen/Kühlen/Stufe als Badge; tippen wählt den Modus.",
        ...MODUS
      )}
      ${c.mode_entity ? f.toggle("Modus als Badge anzeigen", "show_mode_badge", true) : nothing}
      ${f.entity(
        "Freigabekontakt",
        "release_entity",
        "Potentialfreier Eingang: offen = gesperrt, geschlossen = frei. switch/input_boolean schalten (mit Rückfrage), binary_sensor ist nur Anzeige.",
        ...FREIGABE
      )}
      ${c.release_entity ? f.toggle("„seit …“ unter der Freigabe", "show_release_since", false) : nothing}
    `,
    optik: html`
      ${f.select(
        "Blatt-Design",
        "fan_design",
        Object.entries(FAN_DESIGNS).map(([k, d]) => [k, d.label]),
        "klassisch"
      )}
      ${f.select(
        "Farbe des Rads",
        "fan_color_mode",
        [
          ["neutral", "Schwarz/Weiß (wie die Schrift)"],
          ["modus", "Nach Modus: Heizen rot, Kühlen blau"],
        ],
        "neutral"
      )}
    `,
    erweitert: [
      gruppe(
        "Soll und Ist getrennt",
        html`
          ${f.entity("Soll-Temperatur", "target_entity", "climate.*, number.* oder input_number.* — mit +/−.", ...SOLL)}
          ${f.entity(
            "Ist-Temperatur",
            "current_entity",
            "climate.* (current_temperature), sensor.* oder input_number.*.",
            ...IST
          )}
          ${schrittWahl(f)}
        `
      ),
      gruppe(
        "Lüfter",
        html`
          ${f.select(
            "Dreht, wenn …",
            "fan_source",
            [
              ["auto", "Automatisch (Entity, sonst Leistung)"],
              ["entity", "Nur Entity"],
              ["power", "Nur Leistung"],
            ],
            "auto"
          )}
          ${f.entity(
            "Lüfter-Entity",
            "fan_entity",
            "an/aus oder Zahlenwert > 0 = Lüfter dreht.",
            "binary_sensor",
            "switch",
            "sensor",
            "fan",
            "climate"
          )}
          ${f.slider("Ab Leistung", "fan_power_threshold", 0, 2000, " W", 10)}
          ${modusErkannt
            ? html`<small>Das Tempo kommt aus dem erkannten Betriebsmodus („Tempo je Modus“).</small>`
            : f.slider("Tempo", "fan_speed", 0, 10, "", 0.5, {
                anzeige: (x) => x / 10,
                zurueck: (x) => Math.round(x * 10),
              })}
          ${f.select("Bei Stillstand", "fan_inactive", STILLSTAND, "gray")}
        `
      ),
      c.mode_entity
        ? gruppe(
            "Betriebsmodus",
            html`
              ${f.text(
                "Attribut",
                "mode_attribute",
                "Leer = Zustand der Entity. Bei climate.* z.B. preset_mode.",
                "z.B. preset_mode"
              )}
              ${modusZuordnungFelder(f)}
              ${section(
                "Tempo je Modus",
                html`
                  ${HP_MODES.map((m) =>
                    f.slider(m.label, `mode_speed_${m.key}`, FAN_SPEED_MIN, FAN_SPEED_MAX, "", 1)
                  )}
                  <small>1 = langsam, 10 = schnell — dieselbe Skala wie das Laufrad der Poolpumpe.</small>
                `
              )}
            `
          )
        : nothing,
      gruppe(
        "Position und Größe",
        html`
          ${f.slider("Powerbutton — Größe", "power_btn_scale", 50, 200)}
          ${f.slider("Powerbutton — von oben", "power_btn_top", 0, 100)}
          ${f.slider("Powerbutton — von links", "power_btn_left", 0, 100)}
          ${f.slider("Watt — von oben", "power_top", 0, 100)}
          ${f.slider("Watt — von links", "power_left", 0, 100)}
          ${f.slider("Watt — Größe", "power_scale", 50, 150)}
          ${f.slider("Ist — von unten", "current_bottom", 0, 100)}
          ${f.slider("Ist — von links", "current_left", 0, 100)}
          ${f.slider("Ist — Größe", "current_scale", 50, 150)}
          ${f.slider("Soll — von unten", "target_bottom", 0, 100)}
          ${f.slider("Soll — von links", "target_left", 0, 100)}
          ${f.slider("Soll — Größe", "target_scale", 50, 150)}
          ${f.slider("Freigabe — von oben", "release_top", 0, 100, "%", 0.5)}
          ${f.slider("Freigabe — von links", "release_left", 0, 100, "%", 0.5)}
          ${f.slider("Freigabe — Größe", "release_scale", 50, 200)}
          ${f.slider("Modus — von oben", "mode_top", 0, 100, "%", 0.5)}
          ${f.slider("Modus — von links", "mode_left", 0, 100, "%", 0.5)}
          ${f.slider("Modus — Größe", "mode_scale", 50, 200)}
          ${f.slider("Freitext — von oben", "label_top", 0, 100)}
          ${f.slider("Freitext — von links", "label_left", 0, 100)}
          ${f.slider("Freitext — Größe", "label_scale", 50, 200)}
          ${f.slider("Lüfterrad — von oben", "fan_top", 0, 100, "%", 0.5)}
          ${f.slider("Lüfterrad — von links", "fan_left", 0, 100, "%", 0.5)}
          ${f.slider("Lüfterrad — Breite", "fan_size", 5, 80, "%", 0.5)}
          ${f.slider("Lüfterrad — Höhe/Breite", "fan_ratio", 0.5, 2.5, "", 0.02)}
          <small>Die Vorgaben sind am Bild vermessen — nur ändern, wenn etwas nicht passt.</small>
        `
      ),
      gruppe(
        "Kästchen",
        html`<div class="haken-reihe">
          ${f.zeigen("Watt mit Box", "power_box")} ${f.zeigen("Watt mit Einheit", "power_label")}
          ${f.zeigen("Ist mit Box", "current_box")} ${f.zeigen("Ist mit „Ist“", "current_label")}
          ${f.zeigen("Soll mit Box", "target_box")} ${f.zeigen("Soll mit „Soll“", "target_label")}
          ${f.zeigen("Freitext mit Box", "label_box")}
        </div>`
      ),
      gruppe(
        "Ausblenden",
        html`<div class="haken-reihe">
          ${f.zeigen("Powerbutton", "show_power_button")} ${f.zeigen("Watt", "show_power")}
          ${f.zeigen("Ist", "show_current")} ${f.zeigen("Soll", "show_target")}
          ${f.zeigen("Freigabe", "show_release")} ${f.zeigen("Betriebsmodus", "show_mode")}
          ${f.zeigen("Lüfterrad", "show_fan")}
        </div>`
      ),
    ],
  };
};

/* ---------------- Poolpumpe ---------------- */

export const pumpFields = (f) => {
  const c = f.config || {};
  const vorschlag = stufenVorschlag(f);
  const erkennung = !!c.power_entity && f.val("stage_from_power") !== false;
  const labels = Array.isArray(c.stage_labels) ? c.stage_labels : [];
  const setzeLabel = (i, v) => {
    const neu = [0, 1, 2].map((k) => (k === i ? v : labels[k] || ""));
    while (neu.length && !neu[neu.length - 1]) neu.pop();
    f.update({ stage_labels: neu.length ? neu : undefined });
  };
  const vorschlagText = [
    ...(vorschlag.stage_entities || []).slice(stufenListe(c).length),
    vorschlag.stop_entity,
  ]
    .filter(Boolean)
    .join(" · ");
  return {
    pflicht: html`
      ${f.select(
        "Schaltmodell",
        "stage_mode",
        [
          ["momentary", "Impulstaster (Shelly & Co.) — zuletzt gedrückt gilt"],
          ["latching", "Dauerrelais je Stufe — Zustand ist an/aus"],
        ],
        "momentary"
      )}
      ${f.entityAt("Stufe N1", "stage_entities", 0, "", ...SCHALTER)}
      ${vorschlagText ? f.vorschlag(`übernehmen: ${vorschlagText}`, vorschlag) : nothing}
      ${f.entityAt("Stufe N2 (optional)", "stage_entities", 1, "", ...SCHALTER)}
      ${f.entityAt("Stufe N3 (optional)", "stage_entities", 2, "", ...SCHALTER)}
      ${f.entity("STOP", "stop_entity", "Bei Impulstastern der eigene STOP-Kanal.", ...SCHALTER)}
    `,
    anaus: html`
      ${f.entity("Hauptschalter (Powerbutton)", "main_entity", "Steckdose/Relais der Pumpe.", ...SCHALTER)}
      ${c.main_entity ? nachfragen(f) : nothing}
    `,
    anzeige: html`
      ${leistungMitVorschlag(f, "main_entity", "W oder kW.")}
      ${c.power_entity
        ? html`${f.toggle("Stufe aus Leistung erkennen", "stage_from_power", true)}
            <small
              >Wird die Stufe direkt an der Pumpe umgestellt, weiß Home Assistant davon nichts — die
              Leistung schon. Die erkannte Stufe leuchtet; die Taster bleiben bedienbar.</small
            >`
        : nothing}
      ${f.entity("Temperaturfühler", "temp_entity", "Zeigt das Thermometer.", ...MESSWERT)}
    `,
    optik: html`
      <div class="row stufen-namen">
        <span class="row-label">Beschriftung der Taster</span>
        ${[0, 1, 2].map(
          (i) => html`<input
            type="text"
            data-key="stage_labels.${i}"
            .value="${String(labels[i] || "")}"
            placeholder="N${i + 1}"
            @input="${(e) => setzeLabel(i, e.target.value)}"
          />`
        )}
      </div>
    `,
    erweitert: [
      erkennung
        ? gruppe(
            "Stufe aus Leistung — Schwellen",
            html`
              ${f.slider("N1 ab mehr als", "stage_watt_1", 0, 300, " W", 1)}
              ${f.slider("N2 ab mehr als", "stage_watt_2", 0, 1500, " W", 5)}
              ${f.slider("N3 ab mehr als", "stage_watt_3", 0, 3000, " W", 5)}
              <small>Unter der N1-Schwelle gilt die Pumpe als aus.</small>
            `
          )
        : gruppe(
            "Wann steht die Pumpe?",
            html`
              ${f.slider("Ruhewatt", "idle_watt", 0, 200, " W", 1)}
              <small>Unter diesem Verbrauch gilt die Pumpe als stehend (Laufrad grau).</small>
            `
          ),
      gruppe(
        "Laufrad — Tempo",
        html`
          ${f.slider("Tempo N1", "fan_speed_1", FAN_SPEED_MIN, FAN_SPEED_MAX, "", 1)}
          ${f.slider("Tempo N2", "fan_speed_2", FAN_SPEED_MIN, FAN_SPEED_MAX, "", 1)}
          ${f.slider("Tempo N3", "fan_speed_3", FAN_SPEED_MIN, FAN_SPEED_MAX, "", 1)}
          <small>1 = langsam, 10 = schnell.</small>
          ${f.select("Bei Stillstand", "fan_inactive", STILLSTAND, "gray")}
        `
      ),
      gruppe(
        "Position und Größe",
        html`
          ${f.slider("Powerbutton — Größe", "power_btn_scale", 50, 200)}
          ${f.slider("Powerbutton — von oben", "power_btn_top", 0, 100)}
          ${f.slider("Powerbutton — von links", "power_btn_left", 0, 100)}
          ${f.slider("Watt — von unten", "power_bottom", 0, 100)}
          ${f.slider("Watt — von links", "power_left", 0, 100)}
          ${f.slider("Watt — Größe", "power_scale", 50, 150)}
          ${f.slider("Thermometer — von oben", "temp_top", 0, 100)}
          ${f.slider("Thermometer — von links", "temp_left", 0, 100)}
          ${f.slider("Thermometer — Größe", "temp_scale", 50, 200)}
          ${f.slider("Laufrad — von oben", "fan_top", 0, 100, "%", 0.5)}
          ${f.slider("Laufrad — von links", "fan_left", 0, 100, "%", 0.5)}
          ${f.slider("Laufrad — Größe", "fan_size", 3, 60, "%", 0.5)}
          <small>Die Vorgaben sind am Bild vermessen. Das Laufrad bleibt immer kreisrund.</small>
        `
      ),
      gruppe(
        "Kästchen",
        html`<div class="haken-reihe">
          ${f.zeigen("Watt mit Box", "power_box")} ${f.zeigen("Watt mit Einheit", "power_label")}
        </div>`
      ),
      gruppe(
        "Ausblenden",
        html`<div class="haken-reihe">
          ${f.zeigen("Stufen-Taster", "show_stages")} ${f.zeigen("Powerbutton", "show_power_button")}
          ${f.zeigen("Watt", "show_power")} ${f.zeigen("Thermometer", "show_temp")}
          ${f.zeigen("Laufrad", "show_fan")}
        </div>`
      ),
    ],
  };
};

/* ---------------- UV-C-Lampe ---------------- */

export const uvFields = (f) => {
  const c = f.config || {};
  return {
    pflicht: html`
      ${f.entity("Schalter (Powerbutton)", "switch_entity", "Steckdose/Relais der Lampe.", ...SCHALTER)}
      <small>Die UV-Lampe läuft üblicherweise per Zeitschaltuhr parallel zur Poolpumpe.</small>
    `,
    anaus: c.switch_entity ? nachfragen(f) : nothing,
    anzeige: html`
      ${leistungMitVorschlag(f, "switch_entity", "W oder kW.")}
      ${f.entity("Temperaturfühler", "temp_entity", "Zeigt das Thermometer.", ...MESSWERT)}
    `,
    optik: html`
      ${f.zeigen("Glühen, solange die Lampe an ist", "show_glow")}
      ${f.shown("show_glow") ? f.slider("Wabern / Glimmen", "glow_pulse", 0, 300, "") : nothing}
      ${f.slider("Größe", "uv_size", GROESSE_MIN, GROESSE_MAX)}
      ${f.slider("Drehen", "rotate", 0, 359, "°", 1)}
      ${f.toggle("Waagrecht spiegeln", "mirror", false)}
      ${f.select(
        "Anschlussvariante",
        "anschluss",
        [
          ["seite", "Anschlussvariante 1"],
          ["oben", "Anschlussvariante 2"],
        ],
        "seite"
      )}
      <small>
        Gedreht wird das Bild samt Glühen; Thermometer, Watt-Box und Powerbutton bleiben aufrecht.
        Der Kasten bleibt in jeder Lage gleich groß. Wabern: 0 = ruhig, bis 100 sanft, darüber
        kräftig.
      </small>
    `,
    erweitert: [
      gruppe(
        "Glühen — Lage auf dem Rohr",
        html`
          ${f.slider("Von oben", "glow_top", 0, 100, "%", 0.5)}
          ${f.slider("Von links", "glow_left", 0, 100, "%", 0.5)}
          ${f.slider("Länge", "glow_size", 5, 100, "%", 0.5)}
          ${f.slider("Dicke", "glow_thickness", 2, 60, "%", 0.5)}
          ${f.slider("Neigung", "glow_angle", -90, 90, "°", 1)}
          ${f.slider("Leuchtstärke", "glow_intensity", 10, 100)}
        `
      ),
      gruppe(
        "Position und Größe",
        html`
          ${f.slider("Powerbutton — Größe", "power_btn_scale", 50, 200)}
          ${f.slider("Powerbutton — von oben", "power_btn_top", 0, 100)}
          ${f.slider("Powerbutton — von links", "power_btn_left", 0, 100)}
          ${f.slider("Watt — von unten", "power_bottom", 0, 100)}
          ${f.slider("Watt — von links", "power_left", 0, 100)}
          ${f.slider("Watt — Größe", "power_scale", 50, 150)}
          ${f.slider("Thermometer — von oben", "temp_top", 0, 100)}
          ${f.slider("Thermometer — von links", "temp_left", 0, 100)}
          ${f.slider("Thermometer — Größe", "temp_scale", 50, 200)}
        `
      ),
      gruppe(
        "Kästchen",
        html`<div class="haken-reihe">
          ${f.zeigen("Watt mit Box", "power_box")} ${f.zeigen("Watt mit Einheit", "power_label")}
        </div>`
      ),
      gruppe(
        "Ausblenden",
        html`<div class="haken-reihe">
          ${f.zeigen("Powerbutton", "show_power_button")} ${f.zeigen("Watt", "show_power")}
          ${f.zeigen("Thermometer", "show_temp")}
        </div>`
      ),
    ],
  };
};

/* ---------------- Solarheizung ---------------- */

export const solarFields = (f) => {
  const c = f.config || {};
  return {
    pflicht: html`
      ${f.entity(
        "Vorlauf (links unten, ins Feld)",
        "temp_in_entity",
        "Wasser, das zum Absorber läuft — am blauen Pfeil links unten.",
        ...MESSWERT
      )}
      ${f.entity(
        "Rücklauf (rechts oben, ins Becken)",
        "temp_out_entity",
        "Wasser, das zurück ins Becken läuft — am roten Pfeil rechts oben.",
        ...MESSWERT
      )}
      <small>
        Die Solarheizung heizt nicht selbst — sie gibt nur den Weg über die Absorber frei. Der
        Vergleich Vorlauf/Rücklauf zeigt, ob sie gerade etwas bringt.
      </small>
    `,
    anaus: html`
      ${f.entity("Ventil oder Pumpe (Powerbutton)", "switch_entity", "Solarventil oder Solarpumpe.", ...SCHALTER)}
      ${c.switch_entity ? nachfragen(f) : nothing}
    `,
    anzeige: html`
      ${f.entity(
        "Läuft gerade?",
        "active_entity",
        "Z.B. Ventil-Rückmeldung „AN“ oder ein Status wie Heizen/Bypass. Ohne Angabe zählt der Schalter.",
        "binary_sensor",
        "switch",
        "input_boolean",
        "sensor",
        "input_select",
        "select"
      )}
      ${leistungMitVorschlag(f, "switch_entity", "Solarpumpe in W oder kW.")}
    `,
    optik: f.zeigen("Richtungspfeile (blau hinein, rot hinaus)", "show_arrows"),
    erweitert: [
      gruppe(
        "Richtungspfeile",
        html`
          ${f.slider("Blau — von oben", "arrow_in_top", 0, 100, "%", 0.5)}
          ${f.slider("Blau — von links", "arrow_in_left", 0, 100, "%", 0.5)}
          ${f.slider("Blau — Größe", "arrow_in_size", 2, 20, "%", 0.5)}
          ${f.slider("Rot — von oben", "arrow_out_top", 0, 100, "%", 0.5)}
          ${f.slider("Rot — von links", "arrow_out_left", 0, 100, "%", 0.5)}
          ${f.slider("Rot — Größe", "arrow_out_size", 2, 20, "%", 0.5)}
          <small
            >Beide Pfeile zeigen nach rechts: links unten läuft kaltes Wasser ins Feld, rechts oben
            warmes heraus.</small
          >
        `
      ),
      gruppe(
        "Position und Größe",
        html`
          ${f.slider("Powerbutton — Größe", "power_btn_scale", 50, 200)}
          ${f.slider("Powerbutton — von oben", "power_btn_top", 0, 100)}
          ${f.slider("Powerbutton — von links", "power_btn_left", 0, 100)}
          ${f.slider("Vorlauf — von oben", "temp_in_top", 0, 100, "%", 0.5)}
          ${f.slider("Vorlauf — von links", "temp_in_left", 0, 100, "%", 0.5)}
          ${f.slider("Vorlauf — Größe", "temp_in_scale", 50, 200)}
          ${f.slider("Rücklauf — von oben", "temp_out_top", 0, 100, "%", 0.5)}
          ${f.slider("Rücklauf — von links", "temp_out_left", 0, 100, "%", 0.5)}
          ${f.slider("Rücklauf — Größe", "temp_out_scale", 50, 200)}
          ${f.slider("Watt — von unten", "power_bottom", 0, 100)}
          ${f.slider("Watt — von links", "power_left", 0, 100)}
          ${f.slider("Watt — Größe", "power_scale", 50, 150)}
        `
      ),
      gruppe(
        "Kästchen",
        html`<div class="haken-reihe">
          ${f.zeigen("Watt mit Box", "power_box")} ${f.zeigen("Watt mit Einheit", "power_label")}
        </div>`
      ),
      gruppe(
        "Ausblenden",
        html`<div class="haken-reihe">
          ${f.zeigen("Powerbutton", "show_power_button")} ${f.zeigen("Vorlauf", "show_temp_in")}
          ${f.zeigen("Rücklauf", "show_temp_out")} ${f.zeigen("Watt", "show_power")}
        </div>`
      ),
    ],
  };
};

/* ---------------- Freifeld (benutzerdefiniert) ---------------- */

/*
 * Seit Iteration 23 (Bug A14): Einträge als Liste mit "+ Eintrag", Löschen
 * und ↑↓ je Eintrag — statt fest 3–8 Blöcken, die man nur leeren konnte.
 * `eintraege` rendert der Editor (er kennt die Liste und den Aufklapp-Stand).
 */
export const customFields = (f, eintraege) => {
  const belegt = customEintraege(f.config).length;
  const layout = customLayout(f.config);
  return {
    pflicht: html`
      ${eintraege}
      ${belegt > CUSTOM_MAX_ENTRIES
        ? html`<div class="limit-warnung" role="alert">
            ⚠ ${belegt} Einträge eingetragen — der Kasten zeigt höchstens ${CUSTOM_MAX_ENTRIES}.
            Einträge ${CUSTOM_MAX_ENTRIES + 1}–${belegt} werden ausgeblendet. Bitte entfernen oder
            auf einen zweiten Kasten verteilen.
          </div>`
        : nothing}
    `,
    anzeige: html`
      ${f.select(
        "Darstellung",
        "layout",
        [
          ["klassisch", "Klassisch (mittig gestapelt)"],
          ["liste", "Liste (Zeilen mit Schalter, wie HA-Entities)"],
          ["kacheln", "Kacheln (2 Spalten)"],
        ],
        CUSTOM_LAYOUT_DEFAULT
      )}
      ${layout === "liste" && belegt > 4
        ? html`<small class="limit-hinweis">
            Ab 5 Zeilen wird der Kasten höher als eine Standard-Karte (Titel + 4 Zeilen).
          </small>`
        : nothing}
    `,
    erweitert: [
      gruppe(
        "Ausrichtung",
        f.select(
          "Ausrichtung",
          "align",
          [
            ["oben", "Oben"],
            ["mitte", "Mitte"],
            ["unten", "Unten"],
          ],
          layout === "klassisch" ? "mitte" : "oben"
        )
      ),
    ],
  };
};

export const customEntryFields = (f) => html`
  ${f.select(
    "Art",
    "kind",
    [
      ["entity", "Entity mit Wert"],
      ["button", "Button (schaltet)"],
      ["text", "Freitext"],
    ],
    "entity"
  )}
  ${f.config?.kind === "text"
    ? f.text("Text", "text", "", "z.B. Sommerbetrieb")
    : html`
        ${f.entity("Entity", "entity", "", ...FREIFELD)}
        ${f.text("Beschriftung", "label", "", "leer = Name der Entity")}
        ${f.icon("Icon", "icon", "Leer = Icon der Entity (Liste/Kacheln); klassisch nur bei Buttons.")}
        ${f.config?.kind === "button"
          ? nachfragen(f, false, "An = vor dem Ausschalten kommt eine Rückfrage.")
          : nothing}
      `}
`;

/* ---------------- Leerer Rahmen ---------------- */

export const frameFields = (f) => ({
  pflicht: f.text("Hinweistext", "hint", "", ""),
  erweitert: [],
});
