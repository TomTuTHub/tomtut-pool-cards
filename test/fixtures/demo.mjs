/*
 * Beispiel-Anlage für den Render-Test: ein Pool mit allem dran.
 *
 * Bewusst als eigenes ES-Modul: derselbe Datensatz wird vom Node-Test
 * importiert UND vom Browser geladen (die Testseite zieht die Datei direkt
 * über den kleinen Dateiserver). Eine Quelle, keine Kopie.
 */

export const iso = (vorSekunden) => new Date(Date.now() - vorSekunden * 1000).toISOString();

const grad = (wert, vor = 60) => ({
  state: String(wert),
  attributes: { unit_of_measurement: "°C" },
  last_changed: iso(vor),
});
const watt = (wert, vor = 30) => ({
  state: String(wert),
  attributes: { unit_of_measurement: "W" },
  last_changed: iso(vor),
});
const schalter = (an, vor = 3600) => ({
  state: an ? "on" : "off",
  attributes: {},
  last_changed: iso(vor),
});

export const DEMO_HASS = {
  language: "de",
  callService() {},
  states: {
    /* Becken */
    "sensor.pool_wassertemperatur": grad(24.6),
    "sensor.pool_ph": { state: "7.1", attributes: {}, last_changed: iso(60) },
    "sensor.pool_redox": {
      state: "712",
      attributes: { unit_of_measurement: "mV" },
      last_changed: iso(60),
    },
    "sensor.pool_lufttemperatur": grad(21.3),
    "switch.poolbeleuchtung": schalter(false),
    /* Wärmepumpe */
    "switch.waermepumpe": schalter(true),
    "sensor.waermepumpe_power": watt(1840),
    "climate.waermepumpe": {
      state: "heat",
      attributes: {
        temperature: 28,
        current_temperature: 27,
        min_temp: 15,
        max_temp: 40,
        target_temp_step: 0.5,
      },
      last_changed: iso(600),
    },
    /* Poolpumpe */
    "switch.shelly_pumpe_n1": schalter(false, 13 * 3600),
    "switch.shelly_pumpe_n2": schalter(false, 46 * 60),
    "switch.shelly_pumpe_n3": schalter(false, 4 * 3600),
    "switch.shelly_pumpe_stopp": schalter(false, 26 * 3600),
    "input_boolean.poolpumpe_schalter": schalter(true),
    "sensor.poolpumpe_power": watt(737),
    "sensor.poolpumpe_druckseite_temperature": grad(27.4),
    /* UV-C-Lampe */
    "switch.uv_lampe": schalter(true, 7200),
    "sensor.uv_lampe_power": watt(41),
    "sensor.uv_lampe_temperatur": grad(31.2),
    /* Solarheizung */
    "switch.solarventil": schalter(true, 900),
    "sensor.solar_vorlauf": grad(24.1),
    "sensor.solar_ruecklauf": grad(29.8),
    "sensor.solar_power": watt(58),
    /* Einlaufdüse */
    "sensor.einlauf_temperatur": grad(26.9),
  },
};

/* UV-Slot in einer bestimmten Lage — der Fall, um den es in Iteration 6 geht */
export const uvSlot = (rotate = 0, mirror = false) => ({
  type: "uv",
  label: "UV-C-Lampe",
  switch_entity: "switch.uv_lampe",
  power_entity: "sensor.uv_lampe_power",
  temp_entity: "sensor.uv_lampe_temperatur",
  rotate,
  mirror,
});

/* Alles, was die Card kann, in einer Config */
export const allesConfig = (rotate = 0, mirror = false) => ({
  type: "custom:tomtut-pool-dashboard",
  version: 1,
  hero: {
    enabled: true,
    shape: "freiform",
    temp_entity: "sensor.pool_wassertemperatur",
    ph_entity: "sensor.pool_ph",
    rx_entity: "sensor.pool_redox",
    label_text: "Pool",
    show_drain: true,
    inlet_temp_entity: "sensor.einlauf_temperatur",
  },
  frame: { enabled: true, fill: "transparent" },
  slots: [
    {
      type: "heatpump",
      label_text: "Waermepumpe",
      switch_entity: "switch.waermepumpe",
      power_entity: "sensor.waermepumpe_power",
      target_entity: "climate.waermepumpe",
      current_entity: "climate.waermepumpe",
    },
    {
      type: "pump",
      label: "Poolpumpe",
      stage_mode: "momentary",
      stage_entities: [
        "switch.shelly_pumpe_n1",
        "switch.shelly_pumpe_n2",
        "switch.shelly_pumpe_n3",
      ],
      stop_entity: "switch.shelly_pumpe_stopp",
      main_entity: "input_boolean.poolpumpe_schalter",
      power_entity: "sensor.poolpumpe_power",
      temp_entity: "sensor.poolpumpe_druckseite_temperature",
    },
    uvSlot(rotate, mirror),
    {
      type: "solar",
      label: "Solarheizung",
      switch_entity: "switch.solarventil",
      temp_in_entity: "sensor.solar_vorlauf",
      temp_out_entity: "sensor.solar_ruecklauf",
      power_entity: "sensor.solar_power",
    },
    /* Altlast-Probe: der Typ gibt es seit Iteration 6 nicht mehr, die Card
       macht daraus einen Rahmen mit Hinweis statt zu brechen. */
    { type: "inlet", label: "Einlaufduese", temp_entity: "sensor.einlauf_temperatur" },
    {
      type: "custom",
      title: "Werte",
      align: "mitte",
      entries: [
        { kind: "entity", entity: "sensor.pool_lufttemperatur", label: "Luft" },
        { kind: "button", entity: "switch.poolbeleuchtung", label: "Licht", icon: "mdi:lightbulb" },
        { kind: "text", text: "Sommerbetrieb" },
      ],
    },
    { type: "frame", title: "Platz fuer spaeter" },
  ],
});

/* Die Lagen, in denen die UV-Lampe geprüft wird */
export const UV_LAGEN = [0, 45, 90, 180, 270].flatMap((grad) => [
  { grad, mirror: false },
  { grad, mirror: true },
]);
