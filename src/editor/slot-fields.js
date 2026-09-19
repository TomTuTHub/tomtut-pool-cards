import { html, nothing } from "lit";
import { section, elementsGroup } from "../shared/fields.js";
import { SHAPES } from "../shared/assets.js";
import { FAN_SPEED_MIN, FAN_SPEED_MAX } from "../slots/pump.js";

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

/* ---------------- Becken (Hero) ---------------- */

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
    ${f.element("⚓ Bodenablauf (Grafik folgt)", "show_drain", [], false)}
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

export const heatpumpFields = (f) => html`
  ${elementsGroup(html`
    ${f.element("⏻ Powerbutton", "show_power_button", [
      "switch_entity",
      "power_btn_top",
      "power_btn_left",
      "power_btn_scale",
    ])}
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
    ])}
  `)}
  ${f.shown("show_power_button")
    ? html`
        ${f.entity(
          "Powerbutton — Schalter",
          "switch_entity",
          "z.B. die Shelly-Steckdose der Wärmepumpe. Ausschalten fragt immer nach.",
          ...SCHALTER
        )}
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
          `,
          true
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
        ${f.entity(
          "Hauptschalter",
          "main_entity",
          "Steckdose/Relais der Pumpe — Powerbutton mit Rückfrage.",
          ...SCHALTER
        )}
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
            <small>Unter diesem Verbrauch gilt die Pumpe als stehend (Laufrad grau).</small>
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
    ])}
  `)}
  <small>Die UV-Lampe läuft üblicherweise per Zeitschaltuhr parallel zur Poolpumpe.</small>
  ${f.text("Überschrift (optional)", "label", "", "z.B. UV-C-Lampe")}
  ${f.shown("show_power_button")
    ? html`
        ${f.entity(
          "Powerbutton — Schalter",
          "switch_entity",
          "Steckdose/Relais der Lampe. Ausschalten fragt immer nach.",
          ...SCHALTER
        )}
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
          <small>Leuchtet nur, solange der Schalter an ist — ohne Animation.</small>
        `
      )
    : nothing}
  ${section(
    "Bild — Anschluss, Drehung, Spiegelung",
    html`
      ${f.select(
        "Anschluss am linken T-Stück",
        "anschluss",
        [
          ["seite", "Seitlich (Standard)"],
          ["oben", "Nach oben"],
        ],
        "seite"
      )}
      ${f.slider("Drehen", "rotate", 0, 359, "°", 1)}
      ${f.toggle("Waagrecht spiegeln", "mirror", false)}
      <small>
        Gedreht wird das Bild samt Glühen; Thermometer, Watt-Box und Powerbutton bleiben
        aufrecht. Bei gedrehtem Bild wird der Kasten quadratisch, damit nichts abgeschnitten
        wird — die Overlays wollen dann neu gesetzt werden.
      </small>
    `
  )}
`;

/* ---------------- Freifeld (benutzerdefiniert) ---------------- */

export const customFields = (f, entryFields) => html`
  ${f.text("Überschrift (optional)", "title", "", "z.B. Wetter")}
  ${f.select(
    "Ausrichtung",
    "align",
    [
      ["oben", "Oben"],
      ["mitte", "Mitte"],
      ["unten", "Unten"],
    ],
    "mitte"
  )}
  ${[0, 1, 2].map((i) => section(`Eintrag ${i + 1}`, entryFields(i), i === 0))}
`;

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
      `}
`;

/* ---------------- Leerer Rahmen ---------------- */

export const frameFields = (f) => html`
  ${f.text("Überschrift (optional)", "title", "", "z.B. Platzhalter")}
  ${f.text("Hinweistext (optional)", "hint", "", "")}
`;
