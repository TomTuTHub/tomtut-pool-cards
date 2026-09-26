import { html, nothing } from "lit";
import { section, elementsGroup } from "../shared/fields.js";
import { SHAPES } from "../shared/assets.js";
import { TEIL_GROESSE_MIN, TEIL_GROESSE_MAX } from "../hero.js";
import { FAN_SPEED_MIN, FAN_SPEED_MAX } from "../slots/pump.js";
import { HP_MODES, modeFromState, optionZuordnung, modeZustaende } from "../slots/heatpump.js";
import { FAN_DESIGNS } from "../shared/slot-base.js";
import { GROESSE_MIN, GROESSE_MAX } from "../shared/bild.js";
import {
  CUSTOM_MAX_ENTRIES,
  CUSTOM_LAYOUT_DEFAULT,
  customEintraege,
  customLayout,
} from "../slots/custom.js";

/*
 * Die Feldgruppen der einzelnen Slot-Typen.
 *
 * Aufbau überall gleich (seit Iteration 2):
 *   1. "Elemente anzeigen" ganz oben — was hat das Gerät überhaupt?
 *   2. Erst danach die Felder der angehakten Elemente. Abgewählte Elemente
 *      haben keine Felder und schreiben auch nichts in die Konfiguration.
 *
 * Domain-Filter je Feldart, damit im Picker nur Passendes auftaucht.
 */
const SCHALTER = ["switch", "input_boolean", "light"];
const VERBRAUCH = ["sensor", "input_number"];
const MESSWERT = ["sensor", "input_number", "number"];
const KLIMA = ["climate", "number", "input_number", "sensor"];
const MODUS = ["sensor", "select", "input_select", "climate"];
/* Freigabekontakt: schaltbar (switch/input_boolean) oder nur Meldung */
const FREIGABE = ["switch", "input_boolean", "binary_sensor"];

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

/* ---------------- Becken (Hero) ---------------- */

/*
 * Größe und Lage eines Becken-Sprites (Skimmer, Einlaufdüse, Bodenablauf).
 * Alle drei haben dieselben drei Regler — deshalb eine Funktion statt
 * dreimal derselbe Block. `anker` ist der Name in der Formen-Tabelle.
 */
/*
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
  return section(
    `${titel} — Größe und Lage (${mini ? "Mini" : "Voll"})`,
    html`
      <div data-teil="${anker}" data-teil-pos="${mini ? "mini" : "voll"}">
        ${f.slider("Größe", k("size"), TEIL_GROESSE_MIN, TEIL_GROESSE_MAX, "%", 0.5)}
        ${f.slider("Links ↔ rechts", k("left"), 0, 100, "%", 0.5)}
        ${f.slider("Oben ↕ unten", k("top"), 0, 100, "%", 0.5)}
        ${mini && eigeneMini
          ? html`<button
              type="button"
              class="teil-reset"
              data-teil-reset="${anker}"
              @click="${() =>
                f.update({ [`mini_${anker}_top`]: undefined, [`mini_${anker}_left`]: undefined, [`mini_${anker}_size`]: undefined })}"
            >
              Mini-Werte zurücksetzen (wie Voll)
            </button>`
          : nothing}
        <small>
          Größe = Breite in % der Beckenbreite. Das Teil bleibt immer ganz im Beckenbild.
          ${mini ? "Ohne eigene Mini-Werte gilt die Lage der vollen Ansicht." : ""}
        </small>
      </div>
    `
  );
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

export const heroFields = (f) => html`
  ${elementsGroup(html`
    ${f.element("🌡 Thermometer", "show_thermo", [
      "temp_entity",
      "thermo_scale",
      "thermo_top",
      "thermo_left",
    ])}
    ${f.element("🧪 pH-Kästchen", "show_ph", ["ph_entity", "ph_top", "ph_left"])}
    ${f.element("⚗ Redox / RX-Kästchen", "show_rx", ["rx_entity", "rx_top", "rx_left"])}
    ${f.element("🛟 Skimmer", "show_skimmer", ["skimmer_size", "skimmer_top", "skimmer_left"])}
    ${f.element("💦 Einlaufdüse", "show_inlet", [
      "inlet_size",
      "inlet_top",
      "inlet_left",
      "inlet_temp_entity",
      "inlet_temp_top",
      "inlet_temp_left",
    ])}
    ${f.element("⚓ Bodenablauf", "show_drain", ["drain_size", "drain_top", "drain_left"], false)}
  `)}
  ${f.select(
    "Beckenform",
    "shape",
    Object.entries(SHAPES).map(([k, s]) => [k, s.label]),
    "oval"
  )}
  ${f.shown("show_thermo")
    ? html`
        ${f.entity("Wassertemperatur", "temp_entity", "Zeigt das Thermometer auf der Wasserfläche.", ...MESSWERT)}
        ${section(
          "Thermometer — Position",
          html`
            ${f.slider("Größe", "thermo_scale", 50, 200)}
            ${f.slider("Von oben", "thermo_top", 0, 100, "%", 0.5)}
            ${f.slider("Von links", "thermo_left", 0, 100, "%", 0.5)}
          `
        )}
      `
    : nothing}
  ${f.shown("show_ph")
    ? html`
        ${f.entity("pH-Wert", "ph_entity", "Kästchen auf der Beckenwand.", ...MESSWERT)}
        ${section(
          "pH — Position",
          html`
            ${f.slider("Von oben", "ph_top", 0, 100, "%", 0.5)}
            ${f.slider("Von links", "ph_left", 0, 100, "%", 0.5)}
          `
        )}
      `
    : nothing}
  ${f.shown("show_rx")
    ? html`
        ${f.entity("Redox / RX", "rx_entity", "Kästchen auf der Beckenwand.", ...MESSWERT)}
        ${section(
          "RX — Position",
          html`
            ${f.slider("Von oben", "rx_top", 0, 100, "%", 0.5)}
            ${f.slider("Von links", "rx_left", 0, 100, "%", 0.5)}
          `
        )}
      `
    : nothing}
  ${teilePosWahl(f)}
  ${spriteFelder(f, "Skimmer", "skimmer", "show_skimmer", true)}
  ${spriteFelder(f, "Einlaufdüse", "inlet", "show_inlet", true)}
  ${f.shown("show_inlet", true)
    ? html`
        ${f.entity(
          "Temperatur am Einlauf (optional)",
          "inlet_temp_entity",
          "Kleines Kästchen neben der Düse — zeigt, was gerade ins Becken läuft.",
          ...MESSWERT
        )}
        ${f.raw("inlet_temp_entity")
          ? section(
              "Einlauf-Temperatur — Position",
              html`
                ${f.slider("Von oben", "inlet_temp_top", 0, 100, "%", 0.5)}
                ${f.slider("Von links", "inlet_temp_left", 0, 100, "%", 0.5)}
                <small>Ohne eigene Werte sitzt das Kästchen automatisch neben der Düse.</small>
              `
            )
          : nothing}
      `
    : nothing}
  ${spriteFelder(f, "Bodenablauf", "drain", "show_drain", false)}
  ${f.text("Freitext auf dem Becken (optional)", "label_text", "", "z.B. Pool")}
  ${f.raw("label_text")
    ? section(
        "Freitext — Darstellung",
        html`
          ${f.slider("Größe", "label_scale", 50, 200)}
          ${f.slider("Von oben", "label_top", 0, 100, "%", 0.5)}
          ${f.slider("Von links", "label_left", 0, 100, "%", 0.5)}
        `
      )
    : nothing}
  ${f.toggle("Becken mit Rahmen", "framed", false)}
`;

/* ---------------- Wärmepumpe ---------------- */

/*
 * Live-Befund der Modus-Erkennung (Iteration 14): was meldet die gewählte
 * Entity gerade, und welcher der acht Modi wird daraus? Dazu — wenn die
 * Entity sie hat — alle ihre Optionen (select: `options`, climate:
 * `preset_modes` bzw. `hvac_modes`) mit ihrer Zuordnung. Mehr sieht das
 * Frontend nicht: die Rohwert-Tabelle von LocalTuya liegt im Config-Entry.
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
 * Modus-Zuordnung (Iteration 19). Kennt die Entity ihre Werte (select
 * options / climate presets), steht pro Wert EINE Zeile "Wert → [Modus]",
 * vorbelegt mit dem, was die Card daraus macht. Ändern schreibt
 * mode_map: { Wert: modus } — nur Abweichungen von der Automatik; "" =
 * bewusst nicht zuordnen (dann optional ein eigener Anzeigename in
 * mode_names). Ohne Werteliste: die acht Freitextfelder wie bisher, aber mit
 * dem tatsächlichen Default als echtem Inhalt. Alte mode_map_*-Listen
 * gelten weiter (sie fließen in die "automatische" Vorbelegung ein).
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
    ? html`<div class="modus-befund">Erst oben die Modus-Entity wählen.</div>`
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
        const wert = Array.isArray(eigen) ? eigen.join(", ") : String(eigen ?? "").trim() ? String(eigen) : standard;
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

export const heatpumpFields = (f) => html`
  ${elementsGroup(html`
    ${f.element("⏻ Powerbutton", "show_power_button", [
      "switch_entity",
      "confirm_off",
      "power_btn_top",
      "power_btn_left",
      "power_btn_scale",
    ])}
    ${f.element(
      "🔌 Freigabekontakt",
      "show_release",
      ["release_entity", "release_top", "release_left", "release_scale", "show_release_since"],
      false
    )}
    ${f.element("⚡ Stromverbrauch", "show_power", [
      "power_entity",
      "power_top",
      "power_left",
      "power_scale",
      "power_box",
      "power_label",
    ])}
    ${f.element("🌡 Ist-Temperatur", "show_current", [
      "current_entity",
      "current_bottom",
      "current_left",
      "current_scale",
      "current_box",
      "current_label",
    ])}
    ${f.element("🎚 Soll-Temperatur", "show_target", [
      "target_entity",
      "target_bottom",
      "target_left",
      "target_scale",
      "target_step",
      "target_box",
      "target_label",
    ])}
    ${f.element("🌀 Lüfter", "show_fan", [
      "fan_source",
      "fan_entity",
      "fan_power_threshold",
      "fan_speed",
      "fan_top",
      "fan_left",
      "fan_size",
      "fan_ratio",
      "fan_inactive",
      "fan_design",
      "fan_color_mode",
    ])}
    ${f.element(
      "🔁 Betriebsmodus",
      "show_mode",
      [
        "mode_entity",
        "mode_attribute",
        "show_mode_badge",
        "mode_top",
        "mode_left",
        "mode_scale",
        ...HP_MODES.flatMap((m) => [`mode_speed_${m.key}`, `mode_map_${m.key}`]),
        "mode_map",
        "mode_names",
      ],
      false
    )}
  `)}
  ${f.shown("show_power_button")
    ? html`
        ${f.entity(
          "Powerbutton — Schalter",
          "switch_entity",
          "z.B. die Shelly-Steckdose der Wärmepumpe. Ist er aus, steht der Lüfter immer.",
          ...SCHALTER
        )}
        ${nachfragen(f)}
        ${section(
          "Powerbutton — Position",
          html`
            ${f.slider("Von oben", "power_btn_top", 0, 100)}
            ${f.slider("Von links", "power_btn_left", 0, 100)}
            ${f.slider("Größe", "power_btn_scale", 50, 200)}
          `
        )}
      `
    : nothing}
  ${f.shown("show_release", false)
    ? html`
        ${f.entity(
          "Freigabekontakt — Entity",
          "release_entity",
          "Der potentialfreie Eingang der Wärmepumpe: offen = sie darf nicht laufen, geschlossen = freigegeben.",
          ...FREIGABE
        )}
        <small>
          Damit sperrt oder gibt man die Wärmepumpe von außen frei (PV-Überschuss, Zeitfenster) —
          ohne an ihren eigenen Einstellungen zu drehen. Ist der Kontakt offen, zeigt die Karte
          „Gesperrt" und der Lüfter steht still, auch wenn der Schalter an ist. Ein binary_sensor
          wird nur angezeigt, switch und input_boolean schalten per Klick um.
        </small>
        ${section(
          "Freigabekontakt — Position",
          html`
            ${f.slider("Von oben", "release_top", 0, 100, "%", 0.5)}
            ${f.slider("Von links", "release_left", 0, 100, "%", 0.5)}
            ${f.slider("Größe", "release_scale", 50, 200)}
          `
        )}
        ${f.toggle("Zeit seit dem letzten Wechsel anzeigen", "show_release_since", false)}
        <small>Klein unter dem Badge, z.B. „seit 2 Std 10 Min" — läuft minütlich mit.</small>
      `
    : nothing}
  ${f.shown("show_power")
    ? html`
        ${f.entity(
          "Stromverbrauch — Sensor",
          "power_entity",
          "Leistungssensor in W oder kW (z.B. Shelly).",
          ...VERBRAUCH
        )}
        ${section(
          "Stromverbrauch — Darstellung",
          html`
            ${f.slider("Von oben", "power_top", 0, 100)}
            ${f.slider("Von links", "power_left", 0, 100)}
            ${f.slider("Größe", "power_scale", 50, 150)}
            ${f.toggle("Box anzeigen", "power_box", true)}
            ${f.toggle("Einheit anzeigen", "power_label", true)}
          `
        )}
      `
    : nothing}
  ${f.shown("show_current")
    ? html`
        ${f.entity(
          "Ist-Temperatur",
          "current_entity",
          "climate.* nutzt current_temperature, sensor.* den Zustand.",
          ...KLIMA
        )}
        ${section(
          "Ist-Temperatur — Darstellung",
          html`
            ${f.slider("Von unten", "current_bottom", 0, 100)}
            ${f.slider("Von links", "current_left", 0, 100)}
            ${f.slider("Größe", "current_scale", 50, 150)}
            ${f.toggle("Box anzeigen", "current_box", true)}
            ${f.toggle("Label anzeigen", "current_label", true)}
          `
        )}
      `
    : nothing}
  ${f.shown("show_target")
    ? html`
        ${f.entity(
          "Soll-Temperatur",
          "target_entity",
          "climate.* nutzt die Zieltemperatur, number.* den Wert direkt.",
          ...KLIMA
        )}
        ${section(
          "Soll-Temperatur — Darstellung",
          html`
            ${f.slider("Von unten", "target_bottom", 0, 100)}
            ${f.slider("Von links", "target_left", 0, 100)}
            ${f.slider("Größe", "target_scale", 50, 150)}
            ${f.slider("Schrittweite", "target_step", 0.1, 5, "", 0.1)}
            ${f.toggle("Box anzeigen", "target_box", true)}
            ${f.toggle("Label anzeigen", "target_label", true)}
          `
        )}
      `
    : nothing}
  ${f.shown("show_fan")
    ? html`
        ${section(
          "Lüfter — wann dreht er?",
          html`
            ${f.select(
              "Aktiv wenn …",
              "fan_source",
              [
                ["auto", "Automatisch (Entity, sonst Leistung)"],
                ["entity", "Nur Entity"],
                ["power", "Nur Leistung"],
              ],
              "auto"
            )}
            ${f.entity(
              "Lüfter-Entity (optional)",
              "fan_entity",
              "an/aus oder Zahlenwert > 0 = Lüfter dreht.",
              "binary_sensor",
              "switch",
              "sensor",
              "fan",
              "climate"
            )}
            ${f.slider("Leistungs-Schwelle", "fan_power_threshold", 0, 2000, " W", 10)}
            ${f.slider("Drehgeschwindigkeit", "fan_speed", 0, 100)}
            <small>
              Ist der Schalter der Wärmepumpe aus, steht der Lüfter immer. Mit erkanntem
              Betriebsmodus gilt statt der Drehgeschwindigkeit das Tempo des Modus.
            </small>
          `,
          true
        )}
        ${section(
          "Lüfter — Aussehen",
          html`
            ${f.select(
              "Blatt-Design",
              "fan_design",
              Object.entries(FAN_DESIGNS).map(([k, d]) => [k, d.label]),
              "klassisch"
            )}
            ${f.select(
              "Farbe",
              "fan_color_mode",
              [
                ["neutral", "Schwarz/Weiß (wie die Schrift)"],
                ["modus", "Nach Modus: Heizen rot, Kühlen blau"],
              ],
              "neutral"
            )}
            <small>Die Färbung nach Modus braucht einen erkannten Betriebsmodus.</small>
          `
        )}
        ${section(
          "Lüfter — Position",
          html`
            ${f.slider("Von oben", "fan_top", 0, 100, "%", 0.5)}
            ${f.slider("Von links", "fan_left", 0, 100, "%", 0.5)}
            ${f.slider("Breite", "fan_size", 5, 80, "%", 0.5)}
            ${f.slider("Höhe/Breite", "fan_ratio", 0.5, 2.5, "", 0.02)}
            ${f.select(
              "Bei Stillstand",
              "fan_inactive",
              [
                ["gray", "Grau + stehend"],
                ["hidden", "Ausblenden"],
              ],
              "gray"
            )}
          `
        )}
      `
    : nothing}
  ${f.shown("show_mode", false)
    ? html`
        ${f.entity(
          "Betriebsmodus — Entity",
          "mode_entity",
          "sensor, select, input_select oder climate — liefert den Modus der Wärmepumpe.",
          ...MODUS
        )}
        ${f.text(
          "Attribut (optional)",
          "mode_attribute",
          "Leer = Zustand der Entity. Bei climate.* z.B. preset_mode.",
          "z.B. preset_mode"
        )}
        ${section(
          "Betriebsmodus — Anzeige auf der Card",
          html`
            ${f.toggle("Modus als Badge anzeigen", "show_mode_badge", true)}
            ${f.slider("Von oben", "mode_top", 0, 100, "%", 0.5)}
            ${f.slider("Von links", "mode_left", 0, 100, "%", 0.5)}
            ${f.slider("Größe", "mode_scale", 50, 200)}
            <small>
              Klartext wie Heizen, Kühlen, Auto, Aus — bei climate.* mit Preset (z.B.
              Heizen · Eco). Unbekannte Werte erscheinen unübersetzt. Farbe wie das Rad.
            </small>
          `
        )}
        ${section(
          "Betriebsmodus — Tempo je Modus",
          html`
            ${HP_MODES.map((m) =>
              f.slider(m.label, `mode_speed_${m.key}`, FAN_SPEED_MIN, FAN_SPEED_MAX, "", 1)
            )}
            <small>Links langsam, rechts schnell (1–10, ohne Einheit).</small>
          `,
          true
        )}
        ${modusZuordnungFelder(f)}
      `
    : nothing}
  ${f.text("Freitext auf der Card (optional)", "label_text", "", "z.B. Pool-Wärmepumpe")}
  ${section(
    "Freitext — Darstellung",
    html`
      ${f.slider("Von oben", "label_top", 0, 100)}
      ${f.slider("Von links", "label_left", 0, 100)}
      ${f.slider("Größe", "label_scale", 50, 200)}
      ${f.toggle("Box anzeigen", "label_box", true)}
    `
  )}
`;

/* ---------------- Poolpumpe ---------------- */

export const pumpFields = (f) => html`
  ${elementsGroup(html`
    ${f.element("🎚 Stufen-Taster", "show_stages", [
      "stage_mode",
      "stage_entities",
      "stop_entity",
      "stage_labels",
    ])}
    ${f.element("⏻ Powerbutton", "show_power_button", [
      "main_entity",
      "confirm_off",
      "power_btn_top",
      "power_btn_left",
      "power_btn_scale",
    ])}
    ${f.element("⚡ Stromverbrauch", "show_power", [
      "power_entity",
      "power_bottom",
      "power_left",
      "power_scale",
      "power_box",
      "power_label",
      "stage_from_power",
      "stage_watt_1",
      "stage_watt_2",
      "stage_watt_3",
    ])}
    ${f.element("🌡 Temperatur", "show_temp", [
      "temp_entity",
      "temp_top",
      "temp_left",
      "temp_scale",
    ])}
    ${f.element("🌀 Laufrad", "show_fan", [
      "fan_top",
      "fan_left",
      "fan_size",
      "fan_speed_1",
      "fan_speed_2",
      "fan_speed_3",
      "fan_inactive",
      "idle_watt",
    ])}
  `)}
  ${f.text("Überschrift (optional)", "label", "", "z.B. Poolpumpe")}
  ${f.shown("show_power_button")
    ? html`
        ${f.entity(
          "Hauptschalter",
          "main_entity",
          "Steckdose/Relais der Pumpe — Powerbutton.",
          ...SCHALTER
        )}
        ${nachfragen(f)}
      `
    : nothing}
  ${f.shown("show_stages")
    ? html`
        ${f.select(
          "Schaltmodell",
          "stage_mode",
          [
            ["momentary", "Impulstaster (Shelly & Co.) — zuletzt gedrückt gilt"],
            ["latching", "Dauerrelais je Stufe — Zustand ist an/aus"],
          ],
          "momentary"
        )}
        ${f.entityAt("Stufe 1 (N1)", "stage_entities", 0, "", ...SCHALTER)}
        ${f.entityAt("Stufe 2 (N2, optional)", "stage_entities", 1, "", ...SCHALTER)}
        ${f.entityAt("Stufe 3 (N3, optional)", "stage_entities", 2, "", ...SCHALTER)}
        ${f.entity(
          "STOP-Taster (optional)",
          "stop_entity",
          "Bei Impulstastern der eigene STOP-Kanal.",
          ...SCHALTER
        )}
      `
    : nothing}
  ${f.shown("show_power_button")
    ? html`
        ${section(
          "Powerbutton — Position",
          html`
            ${f.slider("Von oben", "power_btn_top", 0, 100)}
            ${f.slider("Von links", "power_btn_left", 0, 100)}
            ${f.slider("Größe", "power_btn_scale", 50, 200)}
          `
        )}
      `
    : nothing}
  ${f.shown("show_power")
    ? html`
        ${f.entity("Stromverbrauch", "power_entity", "W oder kW.", ...VERBRAUCH)}
        ${section(
          "Stromverbrauch — Darstellung",
          html`
            ${f.slider("Von unten", "power_bottom", 0, 100)}
            ${f.slider("Von links", "power_left", 0, 100)}
            ${f.slider("Größe", "power_scale", 50, 150)}
            ${f.toggle("Box anzeigen", "power_box", true)}
            ${f.toggle("Einheit anzeigen", "power_label", true)}
          `
        )}
        ${f.raw("power_entity")
          ? section(
              "Stufe aus Leistung erkennen",
              html`
                ${f.toggle("Stufe aus Leistung erkennen", "stage_from_power", true)}
                ${f.val("stage_from_power") !== false
                  ? html`
                      ${f.slider("N1 ab mehr als", "stage_watt_1", 0, 300, " W", 1)}
                      ${f.slider("N2 ab mehr als", "stage_watt_2", 0, 1500, " W", 5)}
                      ${f.slider("N3 ab mehr als", "stage_watt_3", 0, 3000, " W", 5)}
                    `
                  : nothing}
                <small>
                  Wird die Stufe direkt an der Pumpe umgestellt, weiß Home Assistant davon
                  nichts — die Leistung schon. Unter der N1-Schwelle gilt die Pumpe als aus.
                  Die erkannte Stufe leuchtet und bestimmt das Tempo des Laufrads; die
                  Taster bleiben bedienbar.
                </small>
              `
            )
          : nothing}
      `
    : nothing}
  ${f.shown("show_temp")
    ? html`
        ${f.entity("Temperaturfühler", "temp_entity", "Zeigt das Thermometer.", ...MESSWERT)}
        ${section(
          "Thermometer — Position",
          html`
            ${f.slider("Von oben", "temp_top", 0, 100)}
            ${f.slider("Von links", "temp_left", 0, 100)}
            ${f.slider("Größe", "temp_scale", 50, 200)}
          `
        )}
      `
    : nothing}
  ${f.shown("show_fan")
    ? html`
        ${section(
          "Laufrad — Tempo",
          html`
            ${f.slider("Tempo N1", "fan_speed_1", FAN_SPEED_MIN, FAN_SPEED_MAX, "", 1)}
            ${f.slider("Tempo N2", "fan_speed_2", FAN_SPEED_MIN, FAN_SPEED_MAX, "", 1)}
            ${f.slider("Tempo N3", "fan_speed_3", FAN_SPEED_MIN, FAN_SPEED_MAX, "", 1)}
            <small>Links langsam, rechts schnell (1–10, ohne Einheit).</small>
          `,
          true
        )}
        ${section(
          "Laufrad — Position",
          html`
            ${f.slider("Von oben", "fan_top", 0, 100, "%", 0.5)}
            ${f.slider("Von links", "fan_left", 0, 100, "%", 0.5)}
            ${f.slider("Größe", "fan_size", 3, 60, "%", 0.5)}
            ${f.select(
              "Bei Stillstand",
              "fan_inactive",
              [
                ["gray", "Grau + stehend"],
                ["hidden", "Ausblenden"],
              ],
              "gray"
            )}
            <small>Das Laufrad bleibt immer kreisrund.</small>
          `
        )}
        ${section(
          "Wann steht die Pumpe?",
          html`
            ${f.slider("Ruhewatt", "idle_watt", 0, 200, " W", 1)}
            <small>Unter diesem Verbrauch gilt die Pumpe als stehend (Laufrad grau).
              Bei „Stufe aus Leistung erkennen" gilt stattdessen die N1-Schwelle.</small>
          `
        )}
      `
    : nothing}
`;

/* ---------------- UV-C-Lampe ---------------- */

export const uvFields = (f) => html`
  ${elementsGroup(html`
    ${f.element("⏻ Powerbutton", "show_power_button", [
      "switch_entity",
      "confirm_off",
      "power_btn_top",
      "power_btn_left",
      "power_btn_scale",
    ])}
    ${f.element("⚡ Stromverbrauch", "show_power", [
      "power_entity",
      "power_bottom",
      "power_left",
      "power_scale",
      "power_box",
      "power_label",
    ])}
    ${f.element("🌡 Temperatur", "show_temp", [
      "temp_entity",
      "temp_top",
      "temp_left",
      "temp_scale",
    ])}
    ${f.element("💡 Glüheffekt", "show_glow", [
      "glow_top",
      "glow_left",
      "glow_size",
      "glow_thickness",
      "glow_angle",
      "glow_intensity",
      "glow_pulse",
    ])}
  `)}
  <small>Die UV-Lampe läuft üblicherweise per Zeitschaltuhr parallel zur Poolpumpe.</small>
  ${f.text("Überschrift (optional)", "label", "", "z.B. UV-C-Lampe")}
  ${f.shown("show_power_button")
    ? html`
        ${f.entity(
          "Powerbutton — Schalter",
          "switch_entity",
          "Steckdose/Relais der Lampe.",
          ...SCHALTER
        )}
        ${nachfragen(f)}
        ${section(
          "Powerbutton — Position",
          html`
            ${f.slider("Von oben", "power_btn_top", 0, 100)}
            ${f.slider("Von links", "power_btn_left", 0, 100)}
            ${f.slider("Größe", "power_btn_scale", 50, 200)}
          `
        )}
      `
    : nothing}
  ${f.shown("show_power")
    ? html`
        ${f.entity("Stromverbrauch", "power_entity", "W oder kW.", ...VERBRAUCH)}
        ${section(
          "Stromverbrauch — Darstellung",
          html`
            ${f.slider("Von unten", "power_bottom", 0, 100)}
            ${f.slider("Von links", "power_left", 0, 100)}
            ${f.slider("Größe", "power_scale", 50, 150)}
            ${f.toggle("Box anzeigen", "power_box", true)}
            ${f.toggle("Einheit anzeigen", "power_label", true)}
          `
        )}
      `
    : nothing}
  ${f.shown("show_temp")
    ? html`
        ${f.entity("Temperaturfühler", "temp_entity", "Zeigt das Thermometer.", ...MESSWERT)}
        ${section(
          "Thermometer — Position",
          html`
            ${f.slider("Von oben", "temp_top", 0, 100)}
            ${f.slider("Von links", "temp_left", 0, 100)}
            ${f.slider("Größe", "temp_scale", 50, 200)}
          `
        )}
      `
    : nothing}
  ${f.shown("show_glow")
    ? section(
        "Glüheffekt — Lage auf dem Rohr",
        html`
          ${f.slider("Von oben", "glow_top", 0, 100, "%", 0.5)}
          ${f.slider("Von links", "glow_left", 0, 100, "%", 0.5)}
          ${f.slider("Länge", "glow_size", 5, 100, "%", 0.5)}
          ${f.slider("Dicke", "glow_thickness", 2, 60, "%", 0.5)}
          ${f.slider("Neigung", "glow_angle", -90, 90, "°", 1)}
          ${f.slider("Leuchtstärke", "glow_intensity", 10, 100)}
          ${f.slider("Wabern / Glimmen", "glow_pulse", 0, 300)}
          <small>
            Leuchtet nur, solange der Schalter an ist. „Wabern" lässt den Schein sanft
            atmen — 0 = ruhig und statisch, bis 100 sanft, darüber bis 300 richtig kräftig
            (größerer Hof, schnellerer Puls). Wer im System „Bewegung reduzieren" eingestellt
            hat, sieht ihn immer ruhig.
          </small>
        `
      )
    : nothing}
  ${section(
    "Bild — Drehen, Spiegeln, Größe, Anschlussvariante",
    html`
      ${f.slider("Drehen", "rotate", 0, 359, "°", 1)}
      ${f.toggle("Waagrecht spiegeln", "mirror", false)}
      ${f.slider("Größe", "uv_size", GROESSE_MIN, GROESSE_MAX)}
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
        Gedreht wird das Bild samt Glühen; Thermometer, Watt-Box und Powerbutton bleiben
        aufrecht. Der Kasten bleibt in jeder Lage gleich groß — das gedrehte Bild wird so
        weit verkleinert, dass es hineinpasst. 100 % Größe ist genau das; kleiner stellt das
        Bild zusätzlich ein Stück zurück, ohne dass etwas herausragen kann.
      </small>
    `
  )}
`;

/* ---------------- Solarheizung ---------------- */

export const solarFields = (f) => html`
  ${elementsGroup(html`
    ${f.element("⏻ Powerbutton", "show_power_button", [
      "switch_entity",
      "confirm_off",
      "power_btn_top",
      "power_btn_left",
      "power_btn_scale",
    ])}
    ${f.element("🌡 Vorlauf (oben, ins Feld)", "show_temp_in", [
      "temp_in_entity",
      "temp_in_top",
      "temp_in_left",
      "temp_in_scale",
    ])}
    ${f.element("🌡 Rücklauf (unten, ins Becken)", "show_temp_out", [
      "temp_out_entity",
      "temp_out_top",
      "temp_out_left",
      "temp_out_scale",
    ])}
    ${f.element("➡ Richtungspfeile", "show_arrows", [
      "arrow_in_top",
      "arrow_in_left",
      "arrow_in_size",
      "arrow_out_top",
      "arrow_out_left",
      "arrow_out_size",
    ])}
    ${f.element("⚡ Stromverbrauch", "show_power", [
      "power_entity",
      "power_bottom",
      "power_left",
      "power_scale",
      "power_box",
      "power_label",
    ])}
  `)}
  <small>
    Die Solarheizung heizt nicht selbst — sie gibt nur den Weg über die Absorber frei. Der
    Vergleich Vorlauf/Rücklauf zeigt, ob sie gerade etwas bringt. Das Bild zeigt ein Feld aus
    drei Absorbern; der blaue Pfeil links unten ist der Zulauf, der rote rechts oben der Rücklauf.
  </small>
  ${f.text("Überschrift (optional)", "label", "", "z.B. Solarheizung")}
  ${f.shown("show_power_button")
    ? html`
        ${f.entity(
          "Powerbutton — Ventil oder Pumpe",
          "switch_entity",
          "Solarventil oder Solarpumpe.",
          ...SCHALTER
        )}
        ${nachfragen(f)}
      `
    : nothing}
  ${f.entity(
    "Läuft gerade? (optional)",
    "active_entity",
    "Z.B. Ventil-Rückmeldung „AN“: an = Wasser läuft übers Feld. Bestimmt den Zustand in der Mini-Ansicht; ohne Angabe zählt der Schalter.",
    "binary_sensor",
    "switch",
    "input_boolean",
    "sensor"
  )}
  ${f.shown("show_power_button")
    ? html`
        ${section(
          "Powerbutton — Position",
          html`
            ${f.slider("Von oben", "power_btn_top", 0, 100)}
            ${f.slider("Von links", "power_btn_left", 0, 100)}
            ${f.slider("Größe", "power_btn_scale", 50, 200)}
          `
        )}
      `
    : nothing}
  ${f.shown("show_temp_in")
    ? html`
        ${f.entity(
          "Vorlauf-Temperatur",
          "temp_in_entity",
          "Wasser, das zum Absorber läuft — Zulauf links unten (blauer Pfeil).",
          ...MESSWERT
        )}
        ${section(
          "Vorlauf — Position",
          html`
            ${f.slider("Von oben", "temp_in_top", 0, 100, "%", 0.5)}
            ${f.slider("Von links", "temp_in_left", 0, 100, "%", 0.5)}
            ${f.slider("Größe", "temp_in_scale", 50, 200)}
          `
        )}
      `
    : nothing}
  ${f.shown("show_temp_out")
    ? html`
        ${f.entity(
          "Rücklauf-Temperatur",
          "temp_out_entity",
          "Wasser, das zurück ins Becken läuft — Ablauf rechts oben (roter Pfeil).",
          ...MESSWERT
        )}
        ${section(
          "Rücklauf — Position",
          html`
            ${f.slider("Von oben", "temp_out_top", 0, 100, "%", 0.5)}
            ${f.slider("Von links", "temp_out_left", 0, 100, "%", 0.5)}
            ${f.slider("Größe", "temp_out_scale", 50, 200)}
          `
        )}
      `
    : nothing}
  ${f.shown("show_power")
    ? html`
        ${f.entity("Stromverbrauch", "power_entity", "Solarpumpe in W oder kW.", ...VERBRAUCH)}
        ${section(
          "Stromverbrauch — Darstellung",
          html`
            ${f.slider("Von unten", "power_bottom", 0, 100)}
            ${f.slider("Von links", "power_left", 0, 100)}
            ${f.slider("Größe", "power_scale", 50, 150)}
            ${f.toggle("Box anzeigen", "power_box", true)}
            ${f.toggle("Einheit anzeigen", "power_label", true)}
          `
        )}
      `
    : nothing}
  ${f.shown("show_arrows")
    ? section(
        "Richtungspfeile — Lage",
        html`
          ${f.slider("Zulauf (blau) — Von oben", "arrow_in_top", 0, 100, "%", 0.5)}
          ${f.slider("Zulauf (blau) — Von links", "arrow_in_left", 0, 100, "%", 0.5)}
          ${f.slider("Zulauf (blau) — Größe", "arrow_in_size", 2, 20, "%", 0.5)}
          ${f.slider("Rücklauf (rot) — Von oben", "arrow_out_top", 0, 100, "%", 0.5)}
          ${f.slider("Rücklauf (rot) — Von links", "arrow_out_left", 0, 100, "%", 0.5)}
          ${f.slider("Rücklauf (rot) — Größe", "arrow_out_size", 2, 20, "%", 0.5)}
          <small>
            Beide Pfeile zeigen nach rechts: links unten läuft kaltes Wasser ins Feld, rechts
            oben warmes heraus. Sie sind reine Beschriftung und ändern sich nie.
          </small>
        `
      )
    : nothing}
`;

/* ---------------- Freifeld (benutzerdefiniert) ---------------- */

/*
 * Seit Iteration 16: bis zu CUSTOM_MAX_ENTRIES Einträge (vorher 3, der Rest
 * wurde still gekappt) und die Darstellung `layout`. Sichtbar sind die
 * belegten Einträge plus ein leerer zum Weiterschreiben, mindestens drei.
 * Wer mehr einträgt, als der Kasten zeigt, bekommt eine Warnung — nichts
 * verschwindet mehr stillschweigend.
 */
export const customFields = (f, entryFields) => {
  const liste = Array.isArray(f.config?.entries) ? f.config.entries : [];
  const belegt = customEintraege(f.config).length;
  const sichtbar = Math.min(CUSTOM_MAX_ENTRIES, Math.max(3, liste.length + 1));
  const layout = customLayout(f.config);
  return html`
    ${f.text("Überschrift (optional)", "title", "", "z.B. Wetter")}
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
    ${f.select(
      "Ausrichtung",
      "align",
      [
        ["oben", "Oben"],
        ["mitte", "Mitte"],
        ["unten", "Unten"],
      ],
      layout === "klassisch" ? "mitte" : "oben"
    )}
    ${belegt > CUSTOM_MAX_ENTRIES
      ? html`<div class="limit-warnung" role="alert">
          ⚠ ${belegt} Einträge eingetragen — der Kasten zeigt höchstens ${CUSTOM_MAX_ENTRIES}.
          Einträge ${CUSTOM_MAX_ENTRIES + 1}–${belegt} werden ausgeblendet. Bitte entfernen oder
          auf einen zweiten Kasten verteilen.
        </div>`
      : nothing}
    ${layout === "liste" && belegt > 4
      ? html`<small class="limit-hinweis">
          Ab 5 Zeilen wird der Kasten höher als eine Standard-Karte (Titel + 4 Zeilen).
        </small>`
      : nothing}
    ${Array.from({ length: sichtbar }, (_, i) =>
      section(`Eintrag ${i + 1}`, entryFields(i), i === 0)
    )}
    <small>Bis zu ${CUSTOM_MAX_ENTRIES} Einträge. Leere Einträge werden nicht angezeigt.</small>
  `;
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
        ${f.entity(
          "Entity",
          "entity",
          "",
          "sensor",
          "binary_sensor",
          "switch",
          "light",
          "input_boolean",
          "input_number",
          "number",
          "climate"
        )}
        ${f.text("Beschriftung (optional)", "label", "", "leer = Name der Entity")}
        ${f.config?.kind === "button" ? f.icon("Icon (optional)", "icon") : nothing}
        ${f.config?.kind === "button" ? nachfragen(f, false, "An = vor dem Ausschalten kommt eine Rückfrage.")
          : nothing}
      `}
`;

/* ---------------- Leerer Rahmen ---------------- */

export const frameFields = (f) => html`
  ${f.text("Überschrift (optional)", "title", "", "z.B. Platzhalter")}
  ${f.text("Hinweistext (optional)", "hint", "", "")}
`;
