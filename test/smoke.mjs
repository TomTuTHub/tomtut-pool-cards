/*
 * Smoke-Test des gebuendelten Pakets gegen ein jsdom-DOM.
 * Laeuft ohne Home Assistant: hass wird gestubbt, Service-Calls mitgeschrieben.
 *   node test/smoke.mjs
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { JSDOM } from "jsdom";
import { parseYaml } from "./yaml-mini.mjs";

const here = dirname(fileURLToPath(import.meta.url));

const dom = new JSDOM("<!DOCTYPE html><body></body>", { pretendToBeVisual: true });
for (const key of Object.getOwnPropertyNames(dom.window)) {
  if (/^[A-Z]/.test(key) && !(key in globalThis)) {
    try {
      globalThis[key] = dom.window[key];
    } catch {
      /* nicht kopierbare Getter ignorieren */
    }
  }
}
for (const key of ["Event", "CustomEvent", "EventTarget", "DOMException", "AbortSignal"]) {
  globalThis[key] = dom.window[key];
}
for (const key of [
  "document",
  "customElements",
  "requestAnimationFrame",
  "cancelAnimationFrame",
  "getComputedStyle",
]) {
  globalThis[key] = dom.window[key];
}
globalThis.window = dom.window;

const results = [];
const check = (name, fn) => {
  try {
    fn();
    results.push(`  ok   ${name}`);
  } catch (err) {
    results.push(`  FAIL ${name}\n       ${err.message}`);
    process.exitCode = 1;
  }
};

const pkg = await import("../dist/tomtut-pool-cards.js");

const Dashboard = customElements.get("tomtut-pool-dashboard");
const Alias = customElements.get("tomtut-pool-heatpump-card");

/* ------------------------------------------------------------------ */
/* Registrierung                                                       */
/* ------------------------------------------------------------------ */

check("Dashboard-Card registriert", () => assert.ok(Dashboard));
check("Alias-Card registriert", () => assert.ok(Alias));
check("Dashboard-Editor registriert", () =>
  assert.ok(customElements.get("tomtut-pool-dashboard-editor"))
);
check("Heatpump-Editor registriert", () =>
  assert.ok(customElements.get("tomtut-pool-heatpump-card-editor"))
);
check("Slot-Elemente registriert", () => {
  for (const tag of [
    "tomtut-pool-hero",
    "tomtut-pool-slot-heatpump",
    "tomtut-pool-slot-pump",
    "tomtut-pool-slot-custom",
    "tomtut-pool-slot-frame",
  ]) {
    assert.ok(customElements.get(tag), `${tag} fehlt`);
  }
});
check("beide Cards in window.customCards", () => {
  const types = window.customCards.map((c) => c.type);
  assert.ok(types.includes("tomtut-pool-dashboard"));
  assert.ok(types.includes("tomtut-pool-heatpump-card"));
});

/* ------------------------------------------------------------------ */
/* setConfig-Validierung                                               */
/* ------------------------------------------------------------------ */

check("setConfig ohne Objekt wirft", () =>
  assert.throws(() => new Dashboard().setConfig(null), /Ungültige Konfiguration/)
);
check("setConfig mit falschem slots-Typ wirft", () =>
  assert.throws(() => new Dashboard().setConfig({ slots: "nope" }), /slots/)
);
check("setConfig mit falschem hero-Typ wirft", () =>
  assert.throws(() => new Dashboard().setConfig({ hero: [] }), /hero/)
);
check("setConfig mit fremder Version wirft", () =>
  assert.throws(() => new Dashboard().setConfig({ version: 99 }), /Version/)
);
check("leere Config ist gueltig (Hero-Default)", () => {
  const c = new Dashboard();
  c.setConfig({});
  assert.equal(c._config.version, 1);
  assert.equal(c._config.hero.shape, "oval");
  assert.deepEqual(c._config.slots, []);
});
check("getStubConfig liefert eine gueltige Config", () => {
  const stub = Dashboard.getStubConfig();
  const c = new Dashboard();
  c.setConfig(stub);
  assert.equal(stub.version, 1);
});
check("getConfigElement liefert den Dashboard-Editor", () =>
  assert.equal(
    Dashboard.getConfigElement().tagName.toLowerCase(),
    "tomtut-pool-dashboard-editor"
  )
);

/* ------------------------------------------------------------------ */
/* hass-Stub                                                           */
/* ------------------------------------------------------------------ */

const calls = [];
const iso = (secondsAgo) => new Date(Date.now() - secondsAgo * 1000).toISOString();

const makeHass = (overrides = {}) => ({
  config: { unit_system: { temperature: "°C" } },
  callService: (domain, service, data) => calls.push({ domain, service, data }),
  states: {
    "switch.waermepumpe": { state: "on", attributes: {}, last_changed: iso(3600) },
    "sensor.waermepumpe_power": {
      state: "820",
      attributes: { unit_of_measurement: "W" },
      last_changed: iso(60),
    },
    "climate.waermepumpe": {
      state: "heat",
      attributes: {
        temperature: 28,
        current_temperature: 26.4,
        min_temp: 15,
        max_temp: 40,
        target_temp_step: 0.5,
      },
      last_changed: iso(600),
    },
    "sensor.pool_wassertemperatur": {
      state: "24.6",
      attributes: { unit_of_measurement: "°C" },
      last_changed: iso(60),
    },
    "sensor.pool_ph": { state: "7.1", attributes: {}, last_changed: iso(60) },
    "sensor.pool_redox": { state: "712", attributes: { unit_of_measurement: "mV" }, last_changed: iso(60) },
    "sensor.pool_lufttemperatur": {
      state: "21.3",
      attributes: { unit_of_measurement: "°C" },
      last_changed: iso(60),
    },
    "switch.poolbeleuchtung": { state: "off", attributes: {}, last_changed: iso(60) },
    /* Poolpumpe: N2 ist der juengste Taster */
    "switch.shelly_pumpe_n1": { state: "off", attributes: {}, last_changed: iso(13 * 3600) },
    "switch.shelly_pumpe_n2": { state: "off", attributes: {}, last_changed: iso(46 * 60) },
    "switch.shelly_pumpe_n3": { state: "off", attributes: {}, last_changed: iso(4 * 3600) },
    "switch.shelly_pumpe_stopp": { state: "off", attributes: {}, last_changed: iso(26 * 3600) },
    "input_boolean.poolpumpe_schalter": { state: "on", attributes: {}, last_changed: iso(3600) },
    "sensor.poolpumpe_power": {
      state: "737",
      attributes: { unit_of_measurement: "W" },
      last_changed: iso(30),
    },
    "sensor.poolpumpe_druckseite_temperature": {
      state: "27.4",
      attributes: { unit_of_measurement: "°C" },
      last_changed: iso(30),
    },
    ...overrides,
  },
});

const mount = async (Klass, config, hass) => {
  const el = new Klass();
  el.setConfig(config);
  if (hass) el.hass = hass;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
};

/* ------------------------------------------------------------------ */
/* Rendering ohne hass                                                 */
/* ------------------------------------------------------------------ */

const noHass = await mount(Dashboard, {
  hero: { shape: "rund", temp_entity: "sensor.pool_wassertemperatur" },
  slots: [{ type: "heatpump", switch_entity: "switch.waermepumpe" }],
});
check("Rendern ohne hass stuerzt nicht ab", () => {
  assert.ok(noHass.shadowRoot.querySelector("ha-card"));
  assert.ok(noHass.shadowRoot.querySelector("tomtut-pool-hero"));
});
check("Slot ohne hass rendert leeren Rahmen", () => {
  const slot = noHass.shadowRoot.querySelector("tomtut-pool-slot-heatpump");
  assert.ok(slot);
});

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

const heroCard = await mount(
  Dashboard,
  {
    hero: {
      shape: "freiform",
      temp_entity: "sensor.pool_wassertemperatur",
      ph_entity: "sensor.pool_ph",
      rx_entity: "sensor.pool_redox",
      label_text: "Pool",
    },
    slots: [],
  },
  makeHass()
);
const hero = heroCard.shadowRoot.querySelector("tomtut-pool-hero");
await hero.updateComplete;

check("Hero laedt das Bild der gewaehlten Form", () =>
  assert.equal(
    hero.shadowRoot.querySelector("img").getAttribute("src"),
    "/local/community/tomtut-pool-cards/poolbecken_freiform.png"
  )
);
check("Hero zeigt Thermometer mit Wert", () => {
  const t = hero.shadowRoot.querySelector(".thermo");
  assert.ok(t);
  assert.match(t.textContent, /24,6 °C/);
});
check("Hero zeigt pH und RX", () => {
  const boxes = hero.shadowRoot.querySelectorAll(".chem-box");
  assert.equal(boxes.length, 2);
  assert.match(boxes[0].textContent, /pH/);
  assert.match(boxes[0].textContent, /7,1/);
  assert.match(boxes[1].textContent, /712 mV/);
});
check("Hero-Anker kommen aus der Formen-Tabelle", () => {
  const style = hero.shadowRoot.querySelector(".thermo").getAttribute("style");
  assert.match(style, /top:31\.6%/);
  assert.match(style, /left:12\.7%/);
});
check("Bodenablauf wird (noch) nicht gerendert", () =>
  assert.equal(hero.shadowRoot.querySelector(".drain"), null)
);

const fallbackCard = await mount(
  Dashboard,
  { hero: { shape: "dreieck" }, slots: [] },
  makeHass()
);
const fallbackHero = fallbackCard.shadowRoot.querySelector("tomtut-pool-hero");
await fallbackHero.updateComplete;
check("unbekannte Form faellt auf oval zurueck", () =>
  assert.equal(
    fallbackHero.shadowRoot.querySelector("img").getAttribute("src"),
    "/local/community/tomtut-pool-cards/poolbecken_oval.png"
  )
);

/* ------------------------------------------------------------------ */
/* Rahmen / Fuellung                                                   */
/* ------------------------------------------------------------------ */

const framedCard = await mount(
  Dashboard,
  {
    hero: { enabled: false },
    frame: { enabled: true, fill: "schwarz" },
    slots: [{ type: "frame", title: "Leer" }],
  },
  makeHass()
);
const frameSlot = framedCard.shadowRoot.querySelector("tomtut-pool-slot-frame");
await frameSlot.updateComplete;
check("Rahmen an + Fuellung schwarz", () => {
  const cls = frameSlot.shadowRoot.querySelector(".slot").className;
  assert.match(cls, /framed/);
  assert.match(cls, /fill-schwarz/);
});
check("Hero abgeschaltet wird nicht gerendert", () =>
  assert.equal(framedCard.shadowRoot.querySelector("tomtut-pool-hero"), null)
);

const barecard = await mount(
  Dashboard,
  { hero: { enabled: false }, frame: { enabled: false }, slots: [{ type: "frame" }] },
  makeHass()
);
const bareSlot = barecard.shadowRoot.querySelector("tomtut-pool-slot-frame");
await bareSlot.updateComplete;
check("Rahmen aus", () =>
  assert.ok(!bareSlot.shadowRoot.querySelector(".slot").className.includes("framed"))
);

/* ------------------------------------------------------------------ */
/* Slot-Typen: hidden + reserviert                                     */
/* ------------------------------------------------------------------ */

const typesCard = await mount(
  Dashboard,
  {
    hero: { enabled: false },
    slots: [{ type: "hidden" }, { type: "uv" }, { type: "frame" }],
  },
  makeHass()
);
check("hidden-Slot wird nicht gerendert", () => {
  assert.equal(typesCard.visibleSlots.length, 2);
  assert.equal(typesCard.shadowRoot.querySelectorAll("tomtut-pool-slot-frame").length, 2);
});
const uvSlot = typesCard.shadowRoot.querySelectorAll("tomtut-pool-slot-frame")[0];
await uvSlot.updateComplete;
check("reservierter Typ uv rendert als Rahmen mit Hinweis", () =>
  assert.match(uvSlot.shadowRoot.textContent, /UV-C-Lampe folgt/)
);

/* ------------------------------------------------------------------ */
/* Slot heatpump                                                       */
/* ------------------------------------------------------------------ */

const HP_CONFIG = {
  type: "heatpump",
  switch_entity: "switch.waermepumpe",
  power_entity: "sensor.waermepumpe_power",
  target_entity: "climate.waermepumpe",
  current_entity: "climate.waermepumpe",
  label_text: "Pool-Waermepumpe",
};
const hpCard = await mount(
  Dashboard,
  { hero: { enabled: false }, slots: [HP_CONFIG] },
  makeHass()
);
const hp = hpCard.shadowRoot.querySelector("tomtut-pool-slot-heatpump");
await hp.updateComplete;

check("Waermepumpe: Artwork aus dem Card-Ordner", () =>
  assert.equal(
    hp.shadowRoot.querySelector("img").getAttribute("src"),
    "/local/community/tomtut-pool-cards/waermepumpe_transparent.png"
  )
);
check("Waermepumpe: Werte gerendert", () => {
  const txt = hp.shadowRoot.textContent;
  assert.match(txt, /820/);
  assert.match(txt, /26,4 °C/);
  assert.match(txt, /28,0 °C/);
  assert.match(txt, /Pool-Waermepumpe/);
});
check("Waermepumpe: Luefter dreht bei 820 W", () =>
  assert.ok(hp.shadowRoot.querySelector(".fan-overlay.spinning"))
);
check("Waermepumpe: Luefter auf das neue Artwork kalibriert", () => {
  const style = hp.shadowRoot.querySelector(".fan-overlay").getAttribute("style");
  assert.match(style, /left:26%/);
  assert.match(style, /top:49\.5%/);
  assert.match(style, /width:42%/);
  assert.match(style, /--fan-ratio:1\.14/);
});

calls.length = 0;
hp.shadowRoot.querySelector(".power-badge").click();
await hp.updateComplete;
check("Waermepumpe: Ausschalten fragt nach", () => {
  assert.equal(calls.length, 0);
  assert.ok(hp.shadowRoot.querySelector(".confirm-overlay"));
});
hp.shadowRoot.querySelector(".btn.danger").click();
await hp.updateComplete;
check("Waermepumpe: Bestaetigen schaltet aus", () =>
  assert.deepEqual(calls[0], {
    domain: "switch",
    service: "turn_off",
    data: { entity_id: "switch.waermepumpe" },
  })
);

calls.length = 0;
hp.shadowRoot.querySelectorAll(".step")[1].click();
check("Waermepumpe: + setzt die Soll-Temperatur", () =>
  assert.deepEqual(calls[0], {
    domain: "climate",
    service: "set_temperature",
    data: { entity_id: "climate.waermepumpe", temperature: 28.5 },
  })
);

const hpEmpty = await mount(
  Dashboard,
  { hero: { enabled: false }, slots: [{ type: "heatpump" }] },
  makeHass()
);
const hpEmptySlot = hpEmpty.shadowRoot.querySelector("tomtut-pool-slot-heatpump");
await hpEmptySlot.updateComplete;
check("Waermepumpe ohne Entity zeigt Hinweis statt Fehler", () =>
  assert.match(hpEmptySlot.shadowRoot.textContent, /mindestens eine Entity/)
);

/* ------------------------------------------------------------------ */
/* Slot pump — momentary                                               */
/* ------------------------------------------------------------------ */

const PUMP_CONFIG = {
  type: "pump",
  label: "Poolpumpe",
  stage_mode: "momentary",
  stage_entities: ["switch.shelly_pumpe_n1", "switch.shelly_pumpe_n2", "switch.shelly_pumpe_n3"],
  stop_entity: "switch.shelly_pumpe_stopp",
  main_entity: "input_boolean.poolpumpe_schalter",
  power_entity: "sensor.poolpumpe_power",
  temp_entity: "sensor.poolpumpe_druckseite_temperature",
};

const mountPump = async (config = PUMP_CONFIG, hass = makeHass()) => {
  const card = await mount(Dashboard, { hero: { enabled: false }, slots: [config] }, hass);
  const slot = card.shadowRoot.querySelector("tomtut-pool-slot-pump");
  await slot.updateComplete;
  return slot;
};

const pump = await mountPump();
check("Pumpe: vier Taster (N1-N3 + STOP)", () => {
  const btns = pump.shadowRoot.querySelectorAll(".stage-btn");
  assert.equal(btns.length, 4);
  assert.match(btns[0].textContent, /N1/);
  assert.match(btns[3].textContent, /STOP/);
});
check("Pumpe momentary: juengstes last_changed gewinnt (N2)", () => {
  const btns = pump.shadowRoot.querySelectorAll(".stage-btn");
  assert.ok(btns[1].classList.contains("active"), "N2 muesste aktiv sein");
  assert.ok(!btns[0].classList.contains("active"));
  assert.match(btns[1].textContent, /seit 46 Min/);
});
check("Pumpe: Laufrad dreht bei 737 W", () =>
  assert.ok(pump.shadowRoot.querySelector(".fan-overlay.spinning"))
);
check("Pumpe: Watt-Box und Thermometer gerendert", () => {
  assert.match(pump.shadowRoot.textContent, /737/);
  assert.match(pump.shadowRoot.textContent, /27,4 °C/);
});
check("Pumpe: Ueberschrift gerendert", () =>
  assert.match(pump.shadowRoot.querySelector(".slot-title").textContent, /Poolpumpe/)
);

calls.length = 0;
pump.shadowRoot.querySelectorAll(".stage-btn")[0].click();
await pump.updateComplete;
check("Pumpe momentary: Klick ruft turn_on (kein toggle)", () =>
  assert.deepEqual(calls, [
    { domain: "switch", service: "turn_on", data: { entity_id: "switch.shelly_pumpe_n1" } },
  ])
);
check("Pumpe momentary: Klick markiert sofort optimistisch", () =>
  assert.ok(pump.shadowRoot.querySelectorAll(".stage-btn")[0].classList.contains("active"))
);

calls.length = 0;
pump.shadowRoot.querySelectorAll(".stage-btn")[3].click();
await pump.updateComplete;
check("Pumpe momentary: STOP ruft turn_on auf den STOP-Kanal", () =>
  assert.deepEqual(calls, [
    { domain: "switch", service: "turn_on", data: { entity_id: "switch.shelly_pumpe_stopp" } },
  ])
);
check("Pumpe momentary: STOP ist danach aktiv", () =>
  assert.ok(pump.shadowRoot.querySelectorAll(".stage-btn")[3].classList.contains("active"))
);

const stoppedPump = await mountPump(
  PUMP_CONFIG,
  makeHass({
    "switch.shelly_pumpe_stopp": { state: "off", attributes: {}, last_changed: iso(120) },
  })
);
check("Pumpe momentary: juengster STOP = gestoppt", () => {
  const btns = stoppedPump.shadowRoot.querySelectorAll(".stage-btn");
  assert.ok(btns[3].classList.contains("active"));
  assert.ok(!btns[1].classList.contains("active"));
});
check("Pumpe: Laufrad steht bei gestoppter Pumpe", () =>
  assert.ok(stoppedPump.shadowRoot.querySelector(".fan-overlay.idle"))
);

/* ------------------------------------------------------------------ */
/* Slot pump — latching                                                */
/* ------------------------------------------------------------------ */

const latchHass = makeHass({
  "switch.shelly_pumpe_n2": { state: "on", attributes: {}, last_changed: iso(300) },
});
const latch = await mountPump({ ...PUMP_CONFIG, stage_mode: "latching" }, latchHass);
check("Pumpe latching: aktive Stufe ist die eingeschaltete", () =>
  assert.ok(latch.shadowRoot.querySelectorAll(".stage-btn")[1].classList.contains("active"))
);

calls.length = 0;
latch.shadowRoot.querySelectorAll(".stage-btn")[2].click();
await latch.updateComplete;
check("Pumpe latching: erst andere aus, dann die gewaehlte an", () =>
  assert.deepEqual(calls, [
    { domain: "switch", service: "turn_off", data: { entity_id: "switch.shelly_pumpe_n1" } },
    { domain: "switch", service: "turn_off", data: { entity_id: "switch.shelly_pumpe_n2" } },
    { domain: "switch", service: "turn_on", data: { entity_id: "switch.shelly_pumpe_n3" } },
  ])
);

calls.length = 0;
latch.shadowRoot.querySelectorAll(".stage-btn")[3].click();
await latch.updateComplete;
check("Pumpe latching: STOP schaltet alle Stufen aus", () =>
  assert.deepEqual(
    calls.map((c) => `${c.service} ${c.data.entity_id}`),
    [
      "turn_off switch.shelly_pumpe_n1",
      "turn_off switch.shelly_pumpe_n2",
      "turn_off switch.shelly_pumpe_n3",
    ]
  )
);

/* ------------------------------------------------------------------ */
/* Slot pump — Plausibilitaet                                          */
/* ------------------------------------------------------------------ */

const mainOff = await mountPump(
  PUMP_CONFIG,
  makeHass({
    "input_boolean.poolpumpe_schalter": { state: "off", attributes: {}, last_changed: iso(60) },
  })
);
check("Pumpe: Hauptschalter aus sperrt die Taster", () =>
  assert.ok(mainOff.shadowRoot.querySelector(".stages.disabled"))
);
check("Pumpe: Hauptschalter aus stoppt das Laufrad", () =>
  assert.ok(mainOff.shadowRoot.querySelector(".fan-overlay.idle"))
);

const idlePump = await mountPump(
  PUMP_CONFIG,
  makeHass({
    "sensor.poolpumpe_power": {
      state: "2",
      attributes: { unit_of_measurement: "W" },
      last_changed: iso(30),
    },
  })
);
check("Pumpe: unter idle_watt steht das Laufrad, Taster bleiben bedienbar", () => {
  assert.ok(idlePump.shadowRoot.querySelector(".fan-overlay.idle"));
  assert.equal(idlePump.shadowRoot.querySelector(".stages.disabled"), null);
});

const onlyMain = await mountPump({ type: "pump", main_entity: "input_boolean.poolpumpe_schalter" });
check("Pumpe: nur Hauptschalter ist eine gueltige Config", () => {
  assert.equal(onlyMain.shadowRoot.querySelectorAll(".stage-btn").length, 0);
  assert.ok(onlyMain.shadowRoot.querySelector(".power-badge"));
});

const emptyPump = await mountPump({ type: "pump" });
check("Pumpe ohne Entities zeigt Hinweis", () =>
  assert.match(emptyPump.shadowRoot.textContent, /mindestens eine Stufen-Entity/)
);

/* ------------------------------------------------------------------ */
/* Slot custom                                                         */
/* ------------------------------------------------------------------ */

const customCard = await mount(
  Dashboard,
  {
    hero: { enabled: false },
    slots: [
      {
        type: "custom",
        title: "Werte",
        align: "unten",
        entries: [
          { kind: "entity", entity: "sensor.pool_lufttemperatur", label: "Luft" },
          { kind: "button", entity: "switch.poolbeleuchtung", label: "Licht", icon: "mdi:lightbulb" },
          { kind: "text", text: "Sommerbetrieb" },
          { kind: "text", text: "zu viel" },
        ],
      },
    ],
  },
  makeHass()
);
const custom = customCard.shadowRoot.querySelector("tomtut-pool-slot-custom");
await custom.updateComplete;
check("Werte-Slot: Ueberschrift + drei Eintraege (mehr wird gekappt)", () => {
  assert.match(custom.shadowRoot.querySelector(".slot-title").textContent, /Werte/);
  assert.equal(custom.shadowRoot.querySelectorAll(".entry").length, 3);
});
check("Werte-Slot: Entity-Wert, Button und Freitext", () => {
  const txt = custom.shadowRoot.textContent;
  assert.match(txt, /Luft/);
  assert.match(txt, /21,3 °C/);
  assert.match(txt, /Licht/);
  assert.match(txt, /Sommerbetrieb/);
});
check("Werte-Slot: Ausrichtung wird gesetzt", () =>
  assert.ok(custom.shadowRoot.querySelector(".custom.align-unten"))
);

calls.length = 0;
custom.shadowRoot.querySelector(".btn-entry").click();
check("Werte-Slot: Button schaltet die Entity", () =>
  assert.deepEqual(calls, [
    { domain: "switch", service: "toggle", data: { entity_id: "switch.poolbeleuchtung" } },
  ])
);

/* ------------------------------------------------------------------ */
/* Alias — alte Heatpump-YAML                                          */
/* ------------------------------------------------------------------ */

/* genau so steht es in bestehenden Dashboards (README der alten Card) */
const ALT_YAML = {
  type: "custom:tomtut-pool-heatpump-card",
  label_text: "Pool-Waermepumpe",
  image_variant: "transparent",
  target_entity: "climate.waermepumpe",
  current_entity: "climate.waermepumpe",
  power_entity: "sensor.waermepumpe_power",
  switch_entity: "switch.waermepumpe",
  fan_power_threshold: 150,
};

const alias = await mount(Alias, ALT_YAML, makeHass());
const aliasSlot = alias.shadowRoot.querySelector("tomtut-pool-slot-heatpump");
await aliasSlot.updateComplete;

check("Alias: alte YAML wird angenommen", () => {
  assert.equal(alias._config.slots.length, 1);
  assert.equal(alias._config.slots[0].type, "heatpump");
  assert.equal(alias._config.slots[0].switch_entity, "switch.waermepumpe");
  assert.equal(alias._config.slots[0].type === "custom:tomtut-pool-heatpump-card", false);
});
check("Alias: kein Hero, kein Rahmen", () => {
  assert.equal(alias.shadowRoot.querySelector("tomtut-pool-hero"), null);
  assert.ok(!aliasSlot.shadowRoot.querySelector(".slot").className.includes("framed"));
});
check("Alias: rendert dieselben Werte wie frueher", () => {
  const txt = aliasSlot.shadowRoot.textContent;
  assert.match(txt, /Pool-Waermepumpe/);
  assert.match(txt, /820/);
  assert.match(txt, /26,4 °C/);
  assert.match(txt, /28,0 °C/);
});
check("Alias: neues Artwork", () =>
  assert.equal(
    aliasSlot.shadowRoot.querySelector("img").getAttribute("src"),
    "/local/community/tomtut-pool-cards/waermepumpe_transparent.png"
  )
);
check("Alias: eigene Schwelle wird uebernommen", () =>
  assert.equal(alias._config.slots[0].fan_power_threshold, 150)
);
check("Alias: setConfig ohne Entity wirft (wie bisher)", () =>
  assert.throws(() => new Alias().setConfig({}), /Mindestens eine Entity/)
);
check("Alias: getConfigElement liefert den alten Editor", () =>
  assert.equal(
    Alias.getConfigElement().tagName.toLowerCase(),
    "tomtut-pool-heatpump-card-editor"
  )
);

/* ------------------------------------------------------------------ */
/* Eingefrorene v1-Config                                              */
/* ------------------------------------------------------------------ */

const fixture = parseYaml(readFileSync(join(here, "fixtures/v1-config.yaml"), "utf8"));
check("Fixture wird korrekt gelesen", () => {
  assert.equal(fixture.version, 1);
  assert.equal(fixture.slots.length, 6);
  assert.deepEqual(fixture.slots[1].stage_entities, [
    "switch.shelly_pumpe_n1",
    "switch.shelly_pumpe_n2",
    "switch.shelly_pumpe_n3",
  ]);
  assert.equal(fixture.slots[2].entries.length, 3);
});

const { type: _fixtureType, ...fixtureConfig } = fixture;
const frozen = await mount(Dashboard, fixtureConfig, makeHass());
check("v1-Config rendert unveraendert", () => {
  const sr = frozen.shadowRoot;
  assert.ok(sr.querySelector("tomtut-pool-hero"));
  assert.ok(sr.querySelector("tomtut-pool-slot-heatpump"));
  assert.ok(sr.querySelector("tomtut-pool-slot-pump"));
  assert.ok(sr.querySelector("tomtut-pool-slot-custom"));
  /* uv (reserviert) + frame = zwei Rahmen; hidden faellt weg */
  assert.equal(sr.querySelectorAll("tomtut-pool-slot-frame").length, 2);
  assert.equal(frozen.visibleSlots.length, 5);
});
const frozenHero = frozen.shadowRoot.querySelector("tomtut-pool-hero");
const frozenPump = frozen.shadowRoot.querySelector("tomtut-pool-slot-pump");
await frozenHero.updateComplete;
await frozenPump.updateComplete;
check("v1-Config: Hero und Pumpe mit Inhalt", () => {
  assert.match(frozenHero.shadowRoot.querySelector("img").getAttribute("src"), /freiform/);
  assert.equal(frozenPump.shadowRoot.querySelectorAll(".stage-btn").length, 4);
});

/* ------------------------------------------------------------------ */
/* Editoren                                                            */
/* ------------------------------------------------------------------ */

const Editor = customElements.get("tomtut-pool-dashboard-editor");
const editor = new Editor();
editor.setConfig(fixtureConfig);
editor.hass = makeHass();
document.body.appendChild(editor);
await editor.updateComplete;

check("Editor hat drei Schritte", () => {
  const heads = Array.from(editor.shadowRoot.querySelectorAll(".step-head")).map((e) =>
    e.textContent.trim()
  );
  assert.equal(heads.length, 3);
  assert.match(heads[0], /Becken/);
  assert.match(heads[1], /Geräte/);
  assert.match(heads[2], /Optik/);
});
check("Editor zeigt je Slot eine Karte", () =>
  assert.equal(editor.shadowRoot.querySelectorAll(".slot-card").length, 6)
);
check("Editor schlaegt Entities vor", () =>
  assert.ok(editor.shadowRoot.querySelectorAll("datalist option").length > 0)
);
check("Editor bietet die Beckenformen an", () => {
  const sel = editor.shadowRoot.querySelector('select[data-key="shape"]');
  assert.ok(sel);
  assert.equal(sel.querySelectorAll("option").length, 6);
});

let fired = null;
editor.addEventListener("config-changed", (e) => (fired = e.detail.config));
editor.shadowRoot.querySelector(".add-btn").click();
await editor.updateComplete;
check("Editor: Slot hinzufuegen aendert die Config", () => {
  assert.ok(fired);
  assert.equal(fired.slots.length, 7);
  assert.equal(fired.slots[6].type, "frame");
});

fired = null;
const typeSelect = editor.shadowRoot.querySelectorAll('.slot-head select[data-key="type"]')[6];
typeSelect.value = "pump";
typeSelect.dispatchEvent(new dom.window.Event("change"));
await editor.updateComplete;
check("Editor: Slot-Typ umstellen", () => assert.equal(fired.slots[6].type, "pump"));

fired = null;
const stageInput = editor.shadowRoot.querySelector('input[data-key="stage_entities.0"]');
stageInput.value = "switch.test_n1";
stageInput.dispatchEvent(new dom.window.Event("input"));
await editor.updateComplete;
check("Editor: Stufen-Entity schreibt in die Liste", () =>
  assert.deepEqual(fired.slots[1].stage_entities[0], "switch.test_n1")
);

fired = null;
const fillSelect = editor.shadowRoot.querySelector('select[data-key="fill"]');
fillSelect.value = "schwarz";
fillSelect.dispatchEvent(new dom.window.Event("change"));
await editor.updateComplete;
check("Editor: Fuellung umstellen", () => assert.equal(fired.frame.fill, "schwarz"));

fired = null;
editor.shadowRoot.querySelectorAll(".icon-btn.danger")[0].click();
await editor.updateComplete;
check("Editor: Slot entfernen", () => assert.equal(fired.slots.length, 6));

const HpEditor = customElements.get("tomtut-pool-heatpump-card-editor");
const hpEditor = new HpEditor();
hpEditor.setConfig(ALT_YAML);
hpEditor.hass = makeHass();
document.body.appendChild(hpEditor);
await hpEditor.updateComplete;
check("Alias-Editor rendert die alten Felder", () =>
  assert.ok(hpEditor.shadowRoot.querySelector('input[data-key="switch_entity"]'))
);
check("Alias-Editor fuehrt mit 'Elemente anzeigen' an", () => {
  const first = hpEditor.shadowRoot.querySelector(".section");
  assert.ok(first.classList.contains("elements"));
  assert.match(first.textContent, /Elemente anzeigen/);
});
let hpFired = null;
hpEditor.addEventListener("config-changed", (e) => (hpFired = e.detail.config));
const labelInput = Array.from(hpEditor.shadowRoot.querySelectorAll('input[type="text"]')).find(
  (i) => i.value === "Pool-Waermepumpe"
);
labelInput.value = "Neue WP";
labelInput.dispatchEvent(new dom.window.Event("input"));
check("Alias-Editor feuert config-changed", () => assert.equal(hpFired.label_text, "Neue WP"));

/* ================================================================== */
/* Iteration 2 — Thomas' Korrekturen                                   */
/* ================================================================== */

const cssOf = (tag) =>
  customElements
    .get(tag)
    .styles.map((x) => x.cssText)
    .join("\n");

/* ---- frisch angelegter Slot rendert sofort ---- */

const freshCard = await mount(Dashboard, {
  hero: { enabled: false },
  slots: [{ type: "pump" }, { type: "heatpump" }],
});
const freshPump = freshCard.shadowRoot.querySelector("tomtut-pool-slot-pump");
const freshHp = freshCard.shadowRoot.querySelector("tomtut-pool-slot-heatpump");
await freshPump.updateComplete;
await freshHp.updateComplete;

check("frischer Pump-Slot rendert sofort (ohne hass, ohne Entity)", () => {
  assert.equal(
    freshPump.shadowRoot.querySelector("img").getAttribute("src"),
    "/local/community/tomtut-pool-cards/poolpumpe_transparent.png"
  );
  assert.ok(freshPump.shadowRoot.querySelector(".fan-overlay"), "Laufrad fehlt");
  assert.match(freshPump.shadowRoot.textContent, /mindestens eine Stufen-Entity/);
});
check("frischer Waermepumpen-Slot rendert sofort", () => {
  assert.equal(
    freshHp.shadowRoot.querySelector("img").getAttribute("src"),
    "/local/community/tomtut-pool-cards/waermepumpe_transparent.png"
  );
  assert.match(freshHp.shadowRoot.textContent, /mindestens eine Entity/);
});
check("frischer Slot schreibt nichts in die Config", () =>
  assert.deepEqual(freshCard._config.slots[0], { type: "pump" })
);

/* ---- Laufrad bleibt rund ---- */

const roundPump = await mountPump();
check("Laufrad ist eine starre 1:1-Box", () => {
  const fan = roundPump.shadowRoot.querySelector(".fan-overlay");
  assert.ok(fan.classList.contains("round"));
  assert.match(fan.getAttribute("style"), /--fan-ratio:1;/);
  assert.equal(fan.querySelector("svg").getAttribute("preserveAspectRatio"), "xMidYMid meet");
});
check("Laufrad dreht um die Mitte der viewBox", () => {
  const css = cssOf("tomtut-pool-slot-pump");
  assert.match(css, /transform-box:\s*view-box/);
  assert.match(css, /transform-origin:\s*50% 50%/);
});
check("Luefter der Waermepumpe darf weiter elliptisch sein", () =>
  assert.equal(
    hp.shadowRoot.querySelector(".fan-overlay svg").getAttribute("preserveAspectRatio"),
    "none"
  )
);

/* ---- Tempo-Skala 1..10 ---- */

check("Tempo 1..10 wird auf Umlaufzeiten abgebildet", () => {
  assert.equal(pkg.fanDuration(1), 4);
  assert.equal(pkg.fanDuration(10), 0.5);
  assert.ok(pkg.fanDuration(3) > pkg.fanDuration(5));
  assert.ok(pkg.fanDuration(5) > pkg.fanDuration(8));
  assert.equal(pkg.fanDuration(42), 0.5, "ausserhalb der Skala wird geklemmt");
  assert.equal(pkg.fanDuration(undefined), 4);
});
check("Tempo-Defaults sind 3/5/8, Ruhewatt 30", () => {
  assert.equal(pkg.PUMP_DEFAULTS.fan_speed_1, 3);
  assert.equal(pkg.PUMP_DEFAULTS.fan_speed_2, 5);
  assert.equal(pkg.PUMP_DEFAULTS.fan_speed_3, 8);
  assert.equal(pkg.PUMP_DEFAULTS.idle_watt, 30);
});
check("Laufrad-Tempo folgt der aktiven Stufe (N2 -> Tempo 5)", () =>
  assert.match(
    roundPump.shadowRoot.querySelector(".fan-overlay").getAttribute("style"),
    new RegExp(`--fan-dur:${pkg.fanDuration(5)}s`)
  )
);

/* ---- Fuellung steuert den ganzen Kasten ---- */

const darkCard = await mount(
  Dashboard,
  { hero: { enabled: false }, frame: { enabled: true, fill: "schwarz" }, slots: [PUMP_CONFIG] },
  makeHass()
);
const darkPump = darkCard.shadowRoot.querySelector("tomtut-pool-slot-pump");
await darkPump.updateComplete;
check("Fuellung schwarz setzt Schriftfarbe und Kastenfarbe", () => {
  const css = cssOf("tomtut-pool-slot-pump");
  assert.match(css, /\.slot\.fill-schwarz\s*\{[^}]*--tt-fg:\s*#ffffff/);
  assert.match(css, /\.slot\.fill-schwarz\s*\{[^}]*--tt-bg:\s*#1e1e1e/);
  assert.match(css, /\.slot\.fill-schwarz\s*\{[^}]*--tt-box-bg:/);
  assert.ok(darkPump.shadowRoot.querySelector(".slot.fill-schwarz"));
});
check("kein Element faerbt sich mehr selbst", () => {
  const css = cssOf("tomtut-pool-slot-pump") + cssOf("tomtut-pool-slot-heatpump");
  assert.ok(!/--val-color/.test(css), "--val-color lebt noch");
  const box = darkPump.shadowRoot.querySelector(".value-box").getAttribute("style");
  assert.ok(!/color/.test(box), "Wertebox faerbt sich inline");
});
check("Laufrad-Farbe folgt der Fuellung", () =>
  assert.match(cssOf("tomtut-pool-slot-pump"), /color:\s*var\(--tt-fan-color,\s*var\(--tt-fg\)\)/)
);

/* ---- image_variant / image_url sind weg ---- */

check("nur noch transparente Geraetebilder", () =>
  assert.deepEqual(pkg.DEVICE_IMAGES, {
    heatpump: "waermepumpe_transparent.png",
    pump: "poolpumpe_transparent.png",
  })
);

const legacyCard = await mount(
  Dashboard,
  {
    version: 1,
    hero: { enabled: false, box_color: "schwarz" },
    slots: [
      {
        type: "pump",
        image_variant: "schwarz",
        image_url: "/local/alt.png",
        fan_dur_1: 3,
        fan_ratio: 2,
        fan_color: "white",
        power_color: "black",
        main_entity: "input_boolean.poolpumpe_schalter",
      },
    ],
  },
  makeHass()
);
const legacyPump = legacyCard.shadowRoot.querySelector("tomtut-pool-slot-pump");
await legacyPump.updateComplete;
check("alte Schluessel werden ignoriert, nicht abgelehnt", () => {
  assert.equal(
    legacyPump.shadowRoot.querySelector("img").getAttribute("src"),
    "/local/community/tomtut-pool-cards/poolpumpe_transparent.png"
  );
  assert.match(legacyPump.shadowRoot.querySelector(".fan-overlay").getAttribute("style"), /--fan-ratio:1;/);
  assert.ok(legacyPump.shadowRoot.querySelector(".power-badge"));
});

/* ---- Zahlenformat der Overlays ---- */

const oddPump = await mountPump(
  PUMP_CONFIG,
  makeHass({
    "sensor.poolpumpe_power": {
      state: "2026-09-19T12:00:00+00:00",
      attributes: { unit_of_measurement: "W" },
      last_changed: iso(10),
    },
    "sensor.poolpumpe_druckseite_temperature": {
      state: "unavailable",
      attributes: { unit_of_measurement: "°C" },
      last_changed: iso(10),
    },
  })
);
check("nicht-numerische States werden zu —", () => {
  const txt = oddPump.shadowRoot.textContent;
  assert.ok(!/2026/.test(txt), "Zeitstempel als Zahl gelesen");
  assert.ok(!/unavailable/.test(txt));
  assert.ok((txt.match(/—/g) || []).length >= 2);
});

const roundedPump = await mountPump(
  PUMP_CONFIG,
  makeHass({
    "sensor.poolpumpe_power": {
      state: "737.62",
      attributes: { unit_of_measurement: "W" },
      last_changed: iso(10),
    },
    "sensor.poolpumpe_druckseite_temperature": {
      state: "27.46",
      attributes: { unit_of_measurement: "°C" },
      last_changed: iso(10),
    },
  })
);
check("Watt ganzzahlig, Temperatur mit einer Nachkommastelle", () => {
  const txt = roundedPump.shadowRoot.textContent;
  assert.match(txt, /738/);
  assert.ok(!/737,6/.test(txt));
  assert.match(txt, /27,5 °C/);
});
check("kW wird zu Watt, ganze Zahlen ohne Komma", () => {
  assert.equal(pkg.toWatt({ state: "1.2", attributes: { unit_of_measurement: "kW" } }), 1200);
  assert.equal(pkg.numText({ state: "712", attributes: { unit_of_measurement: "mV" } }), "712 mV");
  assert.equal(pkg.numText({ state: "nicht da" }), "—");
  assert.equal(pkg.numOf("2026-09-19T12:00:00"), null);
});

/* ---- Editor: erst waehlen, dann Felder ---- */

const ed2 = new Editor();
ed2.setConfig({
  hero: { enabled: true, shape: "freiform" },
  slots: [
    { type: "pump", temp_entity: "sensor.poolpumpe_druckseite_temperature", temp_top: 12 },
    { type: "pump", fan_top: 12.5 },
  ],
});
ed2.hass = makeHass();
document.body.appendChild(ed2);
await ed2.updateComplete;
let ed2Fired = null;
ed2.addEventListener("config-changed", (e) => (ed2Fired = e.detail.config));

check("Editor: 'Elemente anzeigen' steht in jedem Slot ganz oben", () => {
  const cards = ed2.shadowRoot.querySelectorAll(".slot-card");
  for (const card of cards) {
    const first = card.querySelector(".section");
    assert.ok(first.classList.contains("elements"), "erste Gruppe ist nicht 'Elemente anzeigen'");
  }
});
check("Editor: Regler starten auf dem effektiven Wert", () => {
  const fanTops = ed2.shadowRoot.querySelectorAll('input[data-key="fan_top"]');
  assert.equal(fanTops[0].value, String(pkg.PUMP_DEFAULTS.fan_top), "Default nicht uebernommen");
  assert.equal(fanTops[1].value, "12.5", "Config-Wert nicht uebernommen");
  const thermoTop = ed2.shadowRoot.querySelector('input[data-key="thermo_top"]');
  assert.equal(thermoTop.value, String(pkg.SHAPES.freiform.thermo.top));
  const thermoLeft = ed2.shadowRoot.querySelector('input[data-key="thermo_left"]');
  assert.equal(thermoLeft.value, String(pkg.SHAPES.freiform.thermo.left));
});
check("Editor: Tempo-Regler laufen von 1 bis 10 ohne Einheit", () => {
  const t1 = ed2.shadowRoot.querySelector('input[data-key="fan_speed_1"]');
  assert.equal(t1.getAttribute("min"), "1");
  assert.equal(t1.getAttribute("max"), "10");
  assert.equal(t1.value, "3");
  assert.match(ed2.shadowRoot.textContent, /Tempo N1/);
  assert.match(ed2.shadowRoot.textContent, /Tempo N3/);
});
check("Editor: 'Wann steht die Pumpe?' mit Ruhewatt", () => {
  assert.match(ed2.shadowRoot.textContent, /Wann steht die Pumpe\?/);
  assert.match(ed2.shadowRoot.textContent, /Ruhewatt/);
  assert.match(ed2.shadowRoot.textContent, /gilt die Pumpe als stehend/);
  assert.equal(ed2.shadowRoot.querySelector('input[data-key="idle_watt"]').value, "30");
});
check("Editor: kein image_url / image_variant mehr", () => {
  assert.equal(ed2.shadowRoot.querySelector('[data-key="image_url"]'), null);
  assert.equal(ed2.shadowRoot.querySelector('[data-key="image_variant"]'), null);
  assert.ok(!/Bildvariante/.test(ed2.shadowRoot.textContent));
  assert.ok(!/Eigenes Bild/.test(ed2.shadowRoot.textContent));
});
check("Editor: Entity-Felder sind leer und haben nur einen Platzhalter", () => {
  const inp = ed2.shadowRoot.querySelector('input[data-key="stage_entities.0"]');
  assert.equal(inp.value, "");
  assert.match(inp.getAttribute("placeholder"), /auswählen/);
  assert.ok(!/\.beispiel/.test(ed2.shadowRoot.innerHTML), "Beispielwert lebt noch");
});
check("Editor: echte Umlaute in den Beschriftungen", () => {
  const txt = ed2.shadowRoot.textContent;
  for (const wort of ["Wärmepumpe", "Überschrift", "Füllung", "hinzufügen", "Geräte", "Größe"]) {
    assert.match(txt, new RegExp(wort));
  }
  for (const murks of ["Waerme", "Ueberschrift", "Fuellung", "hinzufuegen", "Geraete", "Groesse"]) {
    assert.ok(!txt.includes(murks), `"${murks}" steht noch im Editor`);
  }
  assert.equal(pkg.SLOT_TYPES.custom.label, "Freifeld (benutzerdefiniert)");
});

const tempBox = ed2.shadowRoot.querySelector('input[data-key="show_temp"]');
tempBox.checked = false;
tempBox.dispatchEvent(new dom.window.Event("change"));
await ed2.updateComplete;
check("Editor: Element abwaehlen raeumt seine Schluessel aus der Config", () => {
  assert.equal(ed2Fired.slots[0].show_temp, false);
  assert.ok(!("temp_entity" in ed2Fired.slots[0]), "temp_entity steht noch drin");
  assert.ok(!("temp_top" in ed2Fired.slots[0]), "temp_top steht noch drin");
  const erster = ed2.shadowRoot.querySelectorAll(".slot-card")[0];
  assert.equal(erster.querySelector('input[data-key="temp_entity"]'), null);
});

const tempBox2 = ed2.shadowRoot.querySelector('input[data-key="show_temp"]');
tempBox2.checked = true;
tempBox2.dispatchEvent(new dom.window.Event("change"));
await ed2.updateComplete;
check("Editor: wieder anwaehlen bringt die Felder zurueck", () => {
  assert.equal(ed2Fired.slots[0].temp_entity, "sensor.poolpumpe_druckseite_temperature");
  assert.equal(ed2Fired.slots[0].temp_top, 12);
  assert.ok(!("show_temp" in ed2Fired.slots[0]), "show_temp bleibt unnoetig in der Config");
  const erster = ed2.shadowRoot.querySelectorAll(".slot-card")[0];
  assert.ok(erster.querySelector('input[data-key="temp_entity"]'));
});
check("Editor: Patch mit undefined entfernt den Schluessel", () =>
  assert.deepEqual(pkg.applyPatch({ a: 1, b: 2 }, { b: undefined, c: 3 }), { a: 1, c: 3 })
);

/* ------------------------------------------------------------------ */

console.log(results.join("\n"));
console.log(
  process.exitCode ? "\nSmoke-Test FEHLGESCHLAGEN" : `\nSmoke-Test ok (${results.length} Checks)`
);
