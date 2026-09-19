import { html, nothing } from "lit";
import { section } from "../shared/fields.js";
import { SHAPES } from "../shared/assets.js";

const VARIANTS = [
  ["transparent", "Transparent (Standard)"],
  ["weiss", "Weiß"],
  ["schwarz", "Schwarz"],
];

/* ---------------- Becken (Hero) ---------------- */

export const heroFields = (f) => html`
  ${f.select(
    "Beckenform",
    "shape",
    Object.entries(SHAPES).map(([k, s]) => [k, s.label]),
    "oval"
  )}
  ${f.entity(
    "Wassertemperatur (optional)",
    "temp_entity",
    "Zeigt das Thermometer auf der Wasserflaeche.",
    "sensor",
    "climate",
    "number"
  )}
  ${f.entity("pH-Wert (optional)", "ph_entity", "Kaestchen auf der Beckenwand.", "sensor", "number")}
  ${f.entity("Redox / RX (optional)", "rx_entity", "Kaestchen auf der Beckenwand.", "sensor", "number")}
  ${f.text("Freitext auf dem Becken (optional)", "label_text", "", "z.B. Pool")}
  ${section(
    "Feinheiten",
    html`
      ${f.toggle("Bodenablauf anzeigen (Grafik folgt)", "show_drain", false)}
      ${f.toggle("Becken mit Rahmen", "framed", false)}
      ${f.select(
        "Kaestchen-Farbe",
        "box_color",
        [
          ["weiss", "Hell"],
          ["schwarz", "Dunkel"],
        ],
        "weiss"
      )}
      ${f.slider("Thermometer-Groesse", "thermo_scale", 50, 200)}
      ${f.slider("Thermometer von oben", "thermo_top", 0, 100, "%", 0.5)}
      ${f.slider("Thermometer von links", "thermo_left", 0, 100, "%", 0.5)}
      ${f.slider("pH von oben", "ph_top", 0, 100, "%", 0.5)}
      ${f.slider("pH von links", "ph_left", 0, 100, "%", 0.5)}
      ${f.slider("RX von oben", "rx_top", 0, 100, "%", 0.5)}
      ${f.slider("RX von links", "rx_left", 0, 100, "%", 0.5)}
    `
  )}
`;

/* ---------------- Waermepumpe ---------------- */

export const heatpumpFields = (f) => html`
  ${f.entity(
    "Powerbutton — Schalter (optional)",
    "switch_entity",
    "z.B. die Shelly-Steckdose der Waermepumpe. Ausschalten fragt immer nach.",
    "switch",
    "input_boolean",
    "light"
  )}
  ${f.entity(
    "Stromverbrauch — Sensor (optional)",
    "power_entity",
    "Leistungssensor in W oder kW (z.B. Shelly).",
    "sensor"
  )}
  ${f.entity(
    "Soll-Temperatur — climate oder number",
    "target_entity",
    "climate.* nutzt die Zieltemperatur, number.* den Wert direkt.",
    "climate",
    "number"
  )}
  ${f.entity(
    "Ist-Temperatur — climate oder sensor",
    "current_entity",
    "climate.* nutzt current_temperature, sensor.* den Zustand.",
    "climate",
    "sensor"
  )}
  ${f.text("Freitext auf der Card (optional)", "label_text", "", "z.B. Pool-Waermepumpe")}
  ${f.select("Bildvariante", "image_variant", VARIANTS, "transparent")}
  ${f.text(
    "Eigenes Bild (optional)",
    "image_url",
    "Leer = mitgeliefertes Bild aus dem Card-Ordner.",
    "/local/meine_waermepumpe.png"
  )}
  ${section(
    "Luefter-Animation",
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
        "Luefter-Entity (optional)",
        "fan_entity",
        "an/aus oder Zahlenwert > 0 = Luefter dreht.",
        "binary_sensor",
        "switch",
        "sensor",
        "fan",
        "climate"
      )}
      ${f.slider("Leistungs-Schwelle", "fan_power_threshold", 0, 2000, " W", 10)}
      ${f.slider("Drehgeschwindigkeit", "fan_speed", 0, 100)}
      ${f.select(
        "Bei Stillstand",
        "fan_inactive",
        [
          ["gray", "Grau + stehend"],
          ["hidden", "Ausblenden"],
        ],
        "gray"
      )}
      ${f.colorSelect("Farbe", "fan_color")}
    `
  )}
  ${section(
    "Elemente anzeigen",
    html`
      ${f.toggle("⏻ Powerbutton", "show_power_button", true)}
      ${f.toggle("⚡ Stromverbrauch", "show_power", true)}
      ${f.toggle("🌡 Ist-Temperatur", "show_current", true)}
      ${f.toggle("🎚 Soll-Temperatur", "show_target", true)}
      ${f.toggle("🌀 Luefter", "show_fan", true)}
    `
  )}
  ${heatpumpAdvanced(f)}
`;

export const heatpumpAdvanced = (f) => html`
  <details class="section advanced">
    <summary>Erweiterte Einstellungen</summary>
    <div class="section-body">
      ${section(
        "Luefter — Position",
        html`
          ${f.slider("Von oben", "fan_top", 0, 100, "%", 0.5)}
          ${f.slider("Von links", "fan_left", 0, 100, "%", 0.5)}
          ${f.slider("Breite", "fan_size", 5, 80, "%", 0.5)}
          ${f.slider("Höhe/Breite", "fan_ratio", 0.5, 2.5, "", 0.02)}
        `
      )}
      ${section(
        "Powerbutton — Position",
        html`
          ${f.slider("Von oben", "power_btn_top", 0, 100)}
          ${f.slider("Von links", "power_btn_left", 0, 100)}
          ${f.slider("Größe", "power_btn_scale", 50, 200)}
        `
      )}
      ${section(
        "Stromverbrauch — Darstellung",
        html`
          ${f.slider("Von oben", "power_top", 0, 100)}
          ${f.slider("Von links", "power_left", 0, 100)}
          ${f.slider("Größe", "power_scale", 50, 150)}
          ${f.slider("Nachkommastellen", "power_decimals", 0, 2, "", 1)}
          ${f.colorSelect("Schriftfarbe", "power_color")}
          ${f.toggle("Box anzeigen", "power_box", true)}
          ${f.toggle("Einheit anzeigen", "power_label", true)}
        `
      )}
      ${section(
        "Ist-Temperatur — Darstellung",
        html`
          ${f.slider("Von unten", "current_bottom", 0, 100)}
          ${f.slider("Von links", "current_left", 0, 100)}
          ${f.slider("Größe", "current_scale", 50, 150)}
          ${f.colorSelect("Schriftfarbe", "current_color")}
          ${f.toggle("Box anzeigen", "current_box", true)}
          ${f.toggle("Label anzeigen", "current_label", true)}
        `
      )}
      ${section(
        "Soll-Temperatur — Darstellung",
        html`
          ${f.slider("Von unten", "target_bottom", 0, 100)}
          ${f.slider("Von links", "target_left", 0, 100)}
          ${f.slider("Größe", "target_scale", 50, 150)}
          ${f.slider("Schrittweite", "target_step", 0.1, 5, "", 0.1)}
          ${f.colorSelect("Schriftfarbe", "target_color")}
          ${f.toggle("Box anzeigen", "target_box", true)}
          ${f.toggle("Label anzeigen", "target_label", true)}
        `
      )}
      ${section(
        "Freitext — Darstellung",
        html`
          ${f.slider("Von oben", "label_top", 0, 100)}
          ${f.slider("Von links", "label_left", 0, 100)}
          ${f.slider("Größe", "label_scale", 50, 200)}
          ${f.colorSelect("Schriftfarbe", "label_color")}
          ${f.toggle("Box anzeigen", "label_box", true)}
        `
      )}
    </div>
  </details>
`;

/* ---------------- Poolpumpe ---------------- */

export const pumpFields = (f) => html`
  ${f.text("Ueberschrift (optional)", "label", "", "z.B. Poolpumpe")}
  ${f.select(
    "Schaltmodell",
    "stage_mode",
    [
      ["momentary", "Impulstaster (Shelly & Co.) — zuletzt gedrueckt gilt"],
      ["latching", "Dauerrelais je Stufe — Zustand ist an/aus"],
    ],
    "momentary"
  )}
  ${f.entityAt("Stufe 1 (N1)", "stage_entities", 0, "", "switch", "input_boolean", "script")}
  ${f.entityAt("Stufe 2 (N2, optional)", "stage_entities", 1, "", "switch", "input_boolean", "script")}
  ${f.entityAt("Stufe 3 (N3, optional)", "stage_entities", 2, "", "switch", "input_boolean", "script")}
  ${f.entity(
    "STOP-Taster (optional)",
    "stop_entity",
    "Bei Impulstastern der eigene STOP-Kanal.",
    "switch",
    "input_boolean",
    "script"
  )}
  ${f.entity(
    "Hauptschalter (optional)",
    "main_entity",
    "Steckdose/Relais der Pumpe — Powerbutton mit Rueckfrage.",
    "switch",
    "input_boolean",
    "light"
  )}
  ${f.entity("Stromverbrauch (optional)", "power_entity", "W oder kW.", "sensor")}
  ${f.entity("Temperaturfuehler (optional)", "temp_entity", "Zeigt das Thermometer.", "sensor", "number")}
  ${f.select("Bildvariante", "image_variant", VARIANTS, "transparent")}
  ${f.text(
    "Eigenes Bild (optional)",
    "image_url",
    "Leer = mitgeliefertes Bild aus dem Card-Ordner.",
    "/local/meine_pumpe.png"
  )}
  ${section(
    "Elemente anzeigen",
    html`
      ${f.toggle("⏻ Powerbutton", "show_power_button", true)}
      ${f.toggle("⚡ Stromverbrauch", "show_power", true)}
      ${f.toggle("🌡 Temperatur", "show_temp", true)}
      ${f.toggle("🌀 Laufrad", "show_fan", true)}
    `
  )}
  <details class="section advanced">
    <summary>Erweiterte Einstellungen</summary>
    <div class="section-body">
      ${section(
        "Laufrad — Position & Tempo",
        html`
          ${f.slider("Von oben", "fan_top", 0, 100, "%", 0.5)}
          ${f.slider("Von links", "fan_left", 0, 100, "%", 0.5)}
          ${f.slider("Breite", "fan_size", 3, 60, "%", 0.5)}
          ${f.slider("Höhe/Breite", "fan_ratio", 0.5, 3, "", 0.05)}
          ${f.slider("Umlaufzeit N1", "fan_dur_1", 0.2, 6, " s", 0.1)}
          ${f.slider("Umlaufzeit N2", "fan_dur_2", 0.2, 6, " s", 0.1)}
          ${f.slider("Umlaufzeit N3", "fan_dur_3", 0.2, 6, " s", 0.1)}
          ${f.select(
            "Bei Stillstand",
            "fan_inactive",
            [
              ["gray", "Grau + stehend"],
              ["hidden", "Ausblenden"],
            ],
            "gray"
          )}
          ${f.colorSelect("Farbe", "fan_color")}
        `
      )}
      ${section(
        "Powerbutton — Position",
        html`
          ${f.slider("Von oben", "power_btn_top", 0, 100)}
          ${f.slider("Von links", "power_btn_left", 0, 100)}
          ${f.slider("Größe", "power_btn_scale", 50, 200)}
        `
      )}
      ${section(
        "Stromverbrauch — Darstellung",
        html`
          ${f.slider("Von unten", "power_bottom", 0, 100)}
          ${f.slider("Von links", "power_left", 0, 100)}
          ${f.slider("Größe", "power_scale", 50, 150)}
          ${f.slider("Nachkommastellen", "power_decimals", 0, 2, "", 1)}
          ${f.colorSelect("Schriftfarbe", "power_color")}
          ${f.toggle("Box anzeigen", "power_box", true)}
          ${f.toggle("Einheit anzeigen", "power_label", true)}
        `
      )}
      ${section(
        "Thermometer — Position",
        html`
          ${f.slider("Von oben", "temp_top", 0, 100)}
          ${f.slider("Von links", "temp_left", 0, 100)}
          ${f.slider("Größe", "temp_scale", 50, 200)}
        `
      )}
      ${section(
        "Plausibilitaet",
        html`${f.slider("Laufrad steht unter …", "idle_watt", 0, 200, " W", 1)}`
      )}
    </div>
  </details>
`;

/* ---------------- Werte / Buttons ---------------- */

export const customFields = (f, entryFields) => html`
  ${f.text("Ueberschrift (optional)", "title", "", "z.B. Wetter")}
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
          "number",
          "climate"
        )}
        ${f.text("Beschriftung (optional)", "label", "", "leer = Name der Entity")}
        ${f.config?.kind === "button" ? f.text("Icon (optional)", "icon", "", "mdi:lightbulb") : nothing}
      `}
`;

/* ---------------- Leerer Rahmen ---------------- */

export const frameFields = (f) => html`
  ${f.text("Ueberschrift (optional)", "title", "", "z.B. Platzhalter")}
  ${f.text("Hinweistext (optional)", "hint", "", "")}
`;
