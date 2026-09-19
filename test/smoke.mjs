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
    "tomtut-pool-slot-uv",
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
    /* UV-C-Lampe */
    "switch.uv_lampe": { state: "on", attributes: {}, last_changed: iso(7200) },
    "sensor.uv_lampe_power": {
      state: "41",
      attributes: { unit_of_measurement: "W" },
      last_changed: iso(60),
    },
    "sensor.uv_lampe_temperatur": {
      state: "31.2",
      attributes: { unit_of_measurement: "°C" },
      last_changed: iso(60),
    },
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
  const anker = pkg.SHAPES.freiform.thermo;
  assert.match(style, new RegExp(`top:${anker.top}%`));
  assert.match(style, new RegExp(`left:${anker.left}%`));
});
check("Becken-Sprites: Skimmer und Einlaufduese ab Werk an, Bodenablauf aus", () => {
  assert.ok(hero.shadowRoot.querySelector("img.sprite-skimmer"), "Skimmer fehlt");
  assert.ok(hero.shadowRoot.querySelector("img.sprite-inlet"), "Einlaufduese fehlt");
  assert.equal(hero.shadowRoot.querySelector("img.sprite-drain"), null);
});
check("Hero-Freitext sitzt auf dem Anker der Form", () => {
  const badge = hero.shadowRoot.querySelector(".label-badge");
  assert.ok(badge, "Freitext-Badge fehlt");
  assert.match(badge.textContent, /Pool/);
  const style = badge.getAttribute("style");
  const anker = pkg.SHAPES.freiform.label_anker;
  assert.match(style, new RegExp(`top:${anker.top}%`));
  assert.match(style, new RegExp(`left:${anker.left}%`));
  assert.match(style, /scale\(1\)/);
  assert.equal(pkg.HERO_DEFAULTS.label_scale, 100);
  /* Formen ohne gemessenen Anker fielen auf die alte feste Stelle zurueck */
  assert.equal(pkg.HERO_DEFAULTS.label_top, 3);
  assert.equal(pkg.HERO_DEFAULTS.label_left, 50);
});

const labelCard = await mount(
  Dashboard,
  {
    hero: { shape: "oval", label_text: "Schwimmbad", label_scale: 150, label_top: 20, label_left: 30 },
    slots: [],
  },
  makeHass()
);
const labelHero = labelCard.shadowRoot.querySelector("tomtut-pool-hero");
await labelHero.updateComplete;
check("Hero-Freitext folgt Groesse und Position aus der Config", () => {
  const style = labelHero.shadowRoot.querySelector(".label-badge").getAttribute("style");
  assert.match(style, /top:20%/);
  assert.match(style, /left:30%/);
  assert.match(style, /scale\(1\.5\)/);
});
const stillCard = await mount(Dashboard, { hero: { shape: "oval" }, slots: [] }, makeHass());
const stillHero = stillCard.shadowRoot.querySelector("tomtut-pool-hero");
await stillHero.updateComplete;
check("Hero ohne Freitext zeichnet kein Badge", () =>
  assert.equal(stillHero.shadowRoot.querySelector(".label-badge"), null)
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
    slots: [{ type: "hidden" }, { type: "solar" }, { type: "frame" }, { type: "gibtsnicht" }],
  },
  makeHass()
);
check("hidden-Slot wird nicht gerendert", () => {
  assert.equal(typesCard.visibleSlots.length, 3);
  assert.ok(typesCard.shadowRoot.querySelector("tomtut-pool-slot-solar"));
});
/* Seit Iteration 5 ist kein Typ mehr reserviert; der Rahmen-Platzhalter
   faengt nur noch voellig unbekannte Typen ab (alte oder vertippte Config). */
const unbekannt = typesCard.shadowRoot.querySelectorAll("tomtut-pool-slot-frame");
check("unbekannter Typ faellt auf den leeren Rahmen zurueck", () => {
  assert.equal(unbekannt.length, 2);
  assert.equal(typesCard.shadowRoot.querySelectorAll("tomtut-pool-slot-solar").length, 1);
});

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
  /* Der uv-Slot von damals ist seit Iteration 4 eine echte UV-Lampe und
     rendert sein Artwork statt des Platzhalters — die Config bleibt gleich. */
  assert.ok(sr.querySelector("tomtut-pool-slot-uv"));
  assert.equal(sr.querySelectorAll("tomtut-pool-slot-frame").length, 1);
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
check("Editor: Slot-Typen in der Reihenfolge mit Geraete-Trenner", () => {
  const sel = editor.shadowRoot.querySelector('.slot-head select[data-key="type"]');
  const opts = Array.from(sel.querySelectorAll("option"));
  assert.deepEqual(
    opts.map((o) => o.textContent.trim()),
    [
      "Freifeld (benutzerdefiniert)",
      "Ausgeblendet",
      "Leerer Rahmen",
      "— Geräte —",
      "Wärmepumpe",
      "Poolpumpe",
      "UV-C-Lampe",
      "Solarheizung",
      "Einlaufdüse",
    ]
  );
  const trenner = opts[3];
  assert.ok(trenner.disabled, "Trenner ist waehlbar");
  assert.ok(!trenner.hasAttribute("value"), "Trenner hat einen Wert");
  assert.equal(sel.value, "heatpump", "gewaehlter Typ nicht mehr vorausgewaehlt");
});
check("slotTypeOptions liefert genau einen Trenner vor den Geraeten", () => {
  const opts = pkg.slotTypeOptions();
  const idx = opts.findIndex((o) => o.trenner);
  assert.equal(opts.filter((o) => o.trenner).length, 1);
  assert.equal(opts[idx].label, "— Geräte —");
  assert.deepEqual(
    opts.slice(0, idx).map((o) => o.value),
    ["custom", "hidden", "frame"]
  );
  assert.deepEqual(
    opts.slice(idx + 1).map((o) => o.value),
    ["heatpump", "pump", "uv", "solar", "inlet"]
  );
  /* jeder Typ aus der Tabelle taucht genau einmal auf */
  const werte = opts.filter((o) => !o.trenner).map((o) => o.value);
  assert.deepEqual([...werte].sort(), Object.keys(pkg.SLOT_TYPES).sort());
});
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

check("nur noch transparente Geraetebilder", () => {
  assert.deepEqual(pkg.DEVICE_IMAGES, {
    heatpump: "waermepumpe_transparent.png",
    pump: "poolpumpe_transparent.png",
    uv: "uv_lampe_transparent.png",
    solar: "solar_transparent.png",
    inlet: "einlaufduese_transparent.png",
  });
  /* auch die Becken-Sprites gibt es nur transparent */
  for (const [name, sprite] of Object.entries(pkg.HERO_SPRITES)) {
    assert.match(sprite.file, /_transparent\.png$/, `${name}: keine transparente Fassung`);
  }
});

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

/* Hero-Regler liegen ausserhalb der Slot-Karten — Slots haben gleichnamige Felder */
const heroReglerVon = (el, key) =>
  Array.from(el.shadowRoot.querySelectorAll(`input[data-key="${key}"]`)).filter(
    (i) => !i.closest(".slot-card")
  )[0];

/* Die Freitext-Regler starten auf dem Anker der gewaehlten Form (Freiform) */
const freitextDefaults = pkg.heroDefaultsFor("freiform");
check("Editor: Freitext-Regler des Beckens starten auf dem Anker der Form", () => {
  assert.equal(heroReglerVon(editor, "label_scale").value, String(pkg.HERO_DEFAULTS.label_scale));
  assert.equal(heroReglerVon(editor, "label_top").value, String(freitextDefaults.label_top));
  assert.equal(heroReglerVon(editor, "label_left").value, String(freitextDefaults.label_left));
  assert.equal(freitextDefaults.label_top, pkg.SHAPES.freiform.label_anker.top);
  assert.match(editor.shadowRoot.textContent, /Freitext — Darstellung/);
});
check("Editor: ohne Freitext bleiben die Becken-Regler ausgeblendet", () => {
  assert.equal(heroReglerVon(ed2, "label_scale"), undefined);
  assert.equal(heroReglerVon(ed2, "label_top"), undefined);
  assert.equal(heroReglerVon(ed2, "label_left"), undefined);
});

const heroText = ed2.shadowRoot.querySelector('input[data-key="label_text"]');
heroText.value = "Schwimmbad";
heroText.dispatchEvent(new dom.window.Event("input"));
await ed2.updateComplete;
check("Editor: Freitext eintragen blendet die Regler ein", () => {
  assert.equal(ed2Fired.hero.label_text, "Schwimmbad");
  assert.equal(heroReglerVon(ed2, "label_scale").value, String(pkg.HERO_DEFAULTS.label_scale));
  assert.equal(heroReglerVon(ed2, "label_top").value, String(freitextDefaults.label_top));
  assert.equal(heroReglerVon(ed2, "label_left").value, String(freitextDefaults.label_left));
});

const heroScale = heroReglerVon(ed2, "label_scale");
heroScale.value = "140";
heroScale.dispatchEvent(new dom.window.Event("input"));
await ed2.updateComplete;
check("Editor: Freitext-Groesse landet in der Hero-Config", () =>
  assert.equal(ed2Fired.hero.label_scale, 140)
);

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

/* ================================================================== */
/* Iteration 4 — UV-C-Lampe                                            */
/* ================================================================== */

const UV_CONFIG = {
  type: "uv",
  label: "UV-C-Lampe",
  switch_entity: "switch.uv_lampe",
  power_entity: "sensor.uv_lampe_power",
  temp_entity: "sensor.uv_lampe_temperatur",
};

const mountUv = async (config = UV_CONFIG, hass = makeHass()) => {
  const card = await mount(Dashboard, { hero: { enabled: false }, slots: [config] }, hass);
  const slot = card.shadowRoot.querySelector("tomtut-pool-slot-uv");
  await slot.updateComplete;
  return slot;
};

const uv = await mountUv();

check("UV: eigener Slot statt Platzhalter", () => {
  assert.equal(pkg.SLOT_TYPES.uv.ready, true);
  assert.equal(pkg.SLOT_TYPES.uv.label, "UV-C-Lampe");
  assert.ok(!("hint" in pkg.SLOT_TYPES.uv), "Platzhalter-Hinweis lebt noch");
});
check("UV: Artwork aus dem Card-Ordner", () =>
  assert.equal(
    uv.shadowRoot.querySelector("img").getAttribute("src"),
    "/local/community/tomtut-pool-cards/uv_lampe_transparent.png"
  )
);
check("UV: Ueberschrift, Watt-Box und Thermometer", () => {
  assert.match(uv.shadowRoot.querySelector(".slot-title").textContent, /UV-C-Lampe/);
  assert.match(uv.shadowRoot.textContent, /41/);
  assert.match(uv.shadowRoot.textContent, /31,2 °C/);
});
check("UV: kein Durchfluss- und kein Luefterelement", () => {
  assert.equal(uv.shadowRoot.querySelector(".fan-overlay"), null);
  assert.ok(!/Durchfluss/.test(uv.shadowRoot.textContent));
});

/* ---- Glueheffekt ---- */

check("UV: Lampe an -> statisches Gluehen auf dem Rohr", () => {
  const glow = uv.shadowRoot.querySelector(".glow");
  assert.ok(glow, "Gluehen fehlt");
  const stil = glow.getAttribute("style");
  assert.match(stil, new RegExp(`left:${pkg.UV_DEFAULTS.glow_left}%`));
  assert.match(stil, new RegExp(`top:${pkg.UV_DEFAULTS.glow_top}%`));
  assert.match(stil, new RegExp(`width:${pkg.UV_DEFAULTS.glow_size}%`));
  assert.match(stil, /rotate\(-15deg\)/);
  assert.match(stil, /aspect-ratio:/);
});
check("UV: das Gluehen ist nicht animiert", () => {
  const css = cssOf("tomtut-pool-slot-uv");
  assert.match(css, /\.glow\s*\{/);
  assert.ok(!/\.glow[^}]*animation/.test(css), "Gluehen animiert");
});
check("UV: Gluehbereich haengt am Seitenverhaeltnis des Bildes", () => {
  const stil = uv.shadowRoot.querySelector(".glow").getAttribute("style");
  const soll =
    Math.round(
      ((pkg.UV_DEFAULTS.glow_size * pkg.DEVICE_RATIOS.uv) / pkg.UV_DEFAULTS.glow_thickness) * 1000
    ) / 1000;
  assert.match(stil, new RegExp(`aspect-ratio:${String(soll).replace(".", "\\.")}`));
});

const uvAus = await mountUv(
  UV_CONFIG,
  makeHass({ "switch.uv_lampe": { state: "off", attributes: {}, last_changed: iso(60) } })
);
check("UV: Lampe aus -> kein Gluehen", () =>
  assert.equal(uvAus.shadowRoot.querySelector(".glow"), null)
);
const uvUnbekannt = await mountUv(
  UV_CONFIG,
  makeHass({ "switch.uv_lampe": { state: "unavailable", attributes: {}, last_changed: iso(60) } })
);
check("UV: unbekannter Zustand -> kein Gluehen", () =>
  assert.equal(uvUnbekannt.shadowRoot.querySelector(".glow"), null)
);
const uvOhneGlow = await mountUv({ ...UV_CONFIG, show_glow: false });
check("UV: Gluehen abwaehlbar", () =>
  assert.equal(uvOhneGlow.shadowRoot.querySelector(".glow"), null)
);

/* ---- Powerbutton mit Rueckfrage ---- */

calls.length = 0;
uv.shadowRoot.querySelector(".power-badge").click();
await uv.updateComplete;
check("UV: Ausschalten fragt nach", () => {
  assert.equal(calls.length, 0);
  const dialog = uv.shadowRoot.querySelector(".confirm-overlay");
  assert.ok(dialog);
  assert.match(dialog.textContent, /UV-C-Lampe ausschalten\?/);
  assert.match(dialog.textContent, /Brennstunden/);
});
uv.shadowRoot.querySelector(".btn.danger").click();
await uv.updateComplete;
check("UV: Bestaetigen schaltet aus", () =>
  assert.deepEqual(calls[0], {
    domain: "switch",
    service: "turn_off",
    data: { entity_id: "switch.uv_lampe" },
  })
);
calls.length = 0;
uvAus.shadowRoot.querySelector(".power-badge").click();
await uvAus.updateComplete;
check("UV: Einschalten geht ohne Rueckfrage", () =>
  assert.deepEqual(calls, [
    { domain: "switch", service: "turn_on", data: { entity_id: "switch.uv_lampe" } },
  ])
);

/* ---- Bildvariante, Drehen, Spiegeln ---- */

const uvOben = await mountUv({ ...UV_CONFIG, anschluss: "oben" });
check("UV: Bildvariante 'Anschluss oben'", () =>
  assert.equal(
    uvOben.shadowRoot.querySelector("img").getAttribute("src"),
    "/local/community/tomtut-pool-cards/uv_lampe_transparent_2.png"
  )
);
const uvKrumm = await mountUv({ ...UV_CONFIG, anschluss: "gibtsnicht" });
check("UV: unbekannte Variante faellt auf das Standardbild zurueck", () =>
  assert.equal(
    uvKrumm.shadowRoot.querySelector("img").getAttribute("src"),
    "/local/community/tomtut-pool-cards/uv_lampe_transparent.png"
  )
);

check("UV: ungedreht bleibt der Kasten wie bei den anderen Geraeten", () => {
  assert.equal(uv.shadowRoot.querySelector(".img-wrap.quadrat"), null);
  assert.equal(uv.shadowRoot.querySelector(".bild").getAttribute("style"), "");
});

const uvGedreht = await mountUv({ ...UV_CONFIG, rotate: 90 });
check("UV: gedrehtes Bild sitzt in einem quadratischen Kasten", () => {
  assert.ok(uvGedreht.shadowRoot.querySelector(".img-wrap.quadrat"));
  assert.match(uvGedreht.shadowRoot.querySelector(".bild").getAttribute("style"), /rotate\(90deg\)/);
});
check("UV: Gluehen dreht mit, die Bedienelemente nicht", () => {
  assert.ok(uvGedreht.shadowRoot.querySelector(".bild .glow"), "Gluehen dreht nicht mit");
  assert.equal(uvGedreht.shadowRoot.querySelector(".bild .thermo"), null);
  assert.equal(uvGedreht.shadowRoot.querySelector(".bild .value-box"), null);
  assert.equal(uvGedreht.shadowRoot.querySelector(".bild .power-badge"), null);
  assert.ok(uvGedreht.shadowRoot.querySelector(".thermo"));
  assert.ok(uvGedreht.shadowRoot.querySelector(".power-badge"));
});
const uv180 = await mountUv({ ...UV_CONFIG, rotate: 180 });
check("UV: 180° braucht keinen quadratischen Kasten", () => {
  assert.equal(uv180.shadowRoot.querySelector(".img-wrap.quadrat"), null);
  assert.match(uv180.shadowRoot.querySelector(".bild").getAttribute("style"), /rotate\(180deg\)/);
});
const uvGespiegelt = await mountUv({ ...UV_CONFIG, mirror: true });
check("UV: Spiegeln ohne Drehung", () => {
  const stil = uvGespiegelt.shadowRoot.querySelector(".bild").getAttribute("style");
  assert.match(stil, /scaleX\(-1\)/);
  assert.ok(!/rotate/.test(stil));
  assert.equal(uvGespiegelt.shadowRoot.querySelector(".img-wrap.quadrat"), null);
});

check("UV: Passfaktor haelt das gedrehte Bild im Kasten", () => {
  const r = pkg.DEVICE_RATIOS.uv;
  assert.equal(pkg.passFaktor(0, r), 1);
  assert.equal(pkg.passFaktor(180, r), 1);
  assert.equal(pkg.passFaktor(90, r), 1);
  for (let grad = 0; grad < 360; grad += 5) {
    const f = pkg.passFaktor(grad, r);
    const rad = (grad * Math.PI) / 180;
    const c = Math.abs(Math.cos(rad)), si = Math.abs(Math.sin(rad));
    const huelleBreit = f * (c + si / r);
    const huelleHoch = f * (si + c / r);
    assert.ok(f > 0 && f <= 1, `Faktor ${f} bei ${grad}°`);
    assert.ok(huelleBreit <= 1.0001 && huelleHoch <= 1.0001, `ragt raus bei ${grad}°`);
  }
  /* ein hochkantes Bild muesste verkleinert werden */
  assert.ok(pkg.passFaktor(45, 1) < 1);
});
check("UV: Drehwinkel wird normalisiert", () => {
  assert.equal(pkg.normGrad(-90), 270);
  assert.equal(pkg.normGrad(360), 0);
  assert.equal(pkg.normGrad(370.4), 10);
  assert.equal(pkg.normGrad("nicht"), 0);
});

const uvLeer = await mountUv({ type: "uv" });
check("UV ohne Entity zeigt Hinweis statt Fehler", () => {
  assert.match(uvLeer.shadowRoot.textContent, /mindestens eine Entity/);
  assert.equal(
    uvLeer.shadowRoot.querySelector("img").getAttribute("src"),
    "/local/community/tomtut-pool-cards/uv_lampe_transparent.png"
  );
  assert.equal(uvLeer.shadowRoot.querySelector(".glow"), null);
});

/* ---- Editor ---- */

const ed4 = new Editor();
ed4.setConfig({ hero: { enabled: false }, slots: [{ ...UV_CONFIG }] });
ed4.hass = makeHass();
document.body.appendChild(ed4);
await ed4.updateComplete;
let ed4Fired = null;
ed4.addEventListener("config-changed", (e) => (ed4Fired = e.detail.config));

check("Editor: UV-Slot hat Elemente, Felder und Hilfetext", () => {
  const txt = ed4.shadowRoot.textContent;
  assert.match(txt, /Glüheffekt/);
  assert.match(txt, /Zeitschaltuhr parallel zur Poolpumpe/);
  assert.ok(ed4.shadowRoot.querySelector('input[data-key="switch_entity"]'));
  assert.ok(ed4.shadowRoot.querySelector('input[data-key="power_entity"]'));
  assert.ok(ed4.shadowRoot.querySelector('input[data-key="temp_entity"]'));
  assert.ok(!/Durchfluss/.test(txt), "UV hat ein Durchflussfeld");
});
check("Editor: UV-Regler starten auf den gemessenen Defaults", () => {
  const val = (key) => ed4.shadowRoot.querySelector(`input[data-key="${key}"]`).value;
  assert.equal(val("glow_left"), String(pkg.UV_DEFAULTS.glow_left));
  assert.equal(val("glow_top"), String(pkg.UV_DEFAULTS.glow_top));
  assert.equal(val("glow_size"), String(pkg.UV_DEFAULTS.glow_size));
  assert.equal(val("glow_angle"), String(pkg.UV_DEFAULTS.glow_angle));
  assert.equal(val("rotate"), "0");
});
check("Editor: UV bietet Bildvariante, Drehen und Spiegeln", () => {
  const sel = ed4.shadowRoot.querySelector('select[data-key="anschluss"]');
  assert.ok(sel);
  assert.deepEqual(
    Array.from(sel.querySelectorAll("option")).map((o) => o.value),
    ["seite", "oben"]
  );
  assert.ok(ed4.shadowRoot.querySelector('input[data-key="mirror"]'));
});

const drehRegler = ed4.shadowRoot.querySelector('input[data-key="rotate"]');
drehRegler.value = "270";
drehRegler.dispatchEvent(new dom.window.Event("input"));
await ed4.updateComplete;
check("Editor: Drehen landet in der Slot-Config", () =>
  assert.equal(ed4Fired.slots[0].rotate, 270)
);

const glowBox = ed4.shadowRoot.querySelector('input[data-key="show_glow"]');
glowBox.checked = false;
glowBox.dispatchEvent(new dom.window.Event("change"));
await ed4.updateComplete;
check("Editor: Gluehen abwaehlen raeumt seine Schluessel aus der Config", () => {
  assert.equal(ed4Fired.slots[0].show_glow, false);
  for (const key of ["glow_top", "glow_left", "glow_size", "glow_angle"]) {
    assert.ok(!(key in ed4Fired.slots[0]), `${key} steht noch drin`);
  }
  assert.equal(ed4.shadowRoot.querySelector('input[data-key="glow_top"]'), null);
});

/* ================================================================== */
/* Iteration 4 — am Bild vermessene Becken-Anker                       */
/* ================================================================== */

const zonen = JSON.parse(readFileSync(join(here, "fixtures/becken-zonen.json"), "utf8"));

/* Zonen-Zeichen an einer Prozentposition: w = Wasser, m = Wand, . = aussen */
const zoneAn = (form, left, top) => {
  const f = zonen.formen[form];
  const x = Math.min(f.zeilen[0].length - 1, Math.floor((left / 100) * f.breite / zonen.zelle));
  const y = Math.min(f.zeilen.length - 1, Math.floor((top / 100) * f.hoehe / zonen.zelle));
  return f.zeilen[y][x];
};

check("Zonenkarte deckt alle Formen ab", () => {
  assert.deepEqual(Object.keys(zonen.formen), Object.keys(pkg.SHAPES));
  for (const [name, form] of Object.entries(pkg.SHAPES)) {
    assert.equal(zonen.formen[name].datei, form.file, `${name}: anderes Bild vermessen`);
    assert.ok(zonen.formen[name].zeilen.length > 10);
  }
});
check("Thermometer, Ablauf, Skimmer und Einlaufduese liegen auf dem Wasser", () => {
  for (const [name, form] of Object.entries(pkg.SHAPES)) {
    for (const anker of ["thermo", "drain", "skimmer", "inlet"]) {
      assert.equal(
        zoneAn(name, form[anker].left, form[anker].top),
        "w",
        `${name}/${anker} liegt nicht auf dem Wasser`
      );
    }
  }
});
check("pH und RX liegen auf der vorderen Beckenwand", () => {
  for (const [name, form] of Object.entries(pkg.SHAPES)) {
    for (const anker of ["ph", "rx"]) {
      assert.equal(
        zoneAn(name, form[anker].left, form[anker].top),
        "m",
        `${name}/${anker} liegt nicht auf der Wand`
      );
    }
  }
});
check("Anker in der Tabelle = Anker der Messung", () => {
  for (const [name, form] of Object.entries(pkg.SHAPES)) {
    const gemessen = zonen.formen[name].anker;
    for (const anker of ["thermo", "ph", "rx", "drain", "skimmer", "inlet"]) {
      assert.deepEqual(form[anker], gemessen[anker], `${name}/${anker} weicht von der Messung ab`);
    }
    assert.deepEqual(form.label_anker, gemessen.label, `${name}/Freitext weicht ab`);
  }
});
check("pH und RX stehen nebeneinander auf einer Hoehe", () => {
  for (const [name, form] of Object.entries(pkg.SHAPES)) {
    assert.equal(form.ph.top, form.rx.top, `${name}: pH und RX auf verschiedener Hoehe`);
    assert.ok(form.rx.left - form.ph.left > 20, `${name}: pH und RX kleben aneinander`);
  }
});
check("Bodenablauf sitzt rechts unten, Thermometer links", () => {
  for (const [name, form] of Object.entries(pkg.SHAPES)) {
    assert.ok(form.thermo.left < 25, `${name}: Thermometer nicht links`);
    assert.ok(form.drain.left > 70, `${name}: Bodenablauf nicht rechts`);
    assert.ok(form.drain.top > form.thermo.top, `${name}: Bodenablauf nicht unterhalb`);
  }
});
check("Freitext steht oben mittig", () => {
  for (const [name, form] of Object.entries(pkg.SHAPES)) {
    assert.ok(Math.abs(form.label_anker.left - 50) <= 5, `${name}: Freitext nicht mittig`);
    assert.ok(form.label_anker.top >= 1 && form.label_anker.top <= 25, `${name}: Freitext zu tief`);
  }
});

const ankerCard = await mount(
  Dashboard,
  {
    hero: {
      shape: "achtform",
      temp_entity: "sensor.pool_wassertemperatur",
      ph_entity: "sensor.pool_ph",
      rx_entity: "sensor.pool_redox",
      label_text: "Pool",
    },
    slots: [],
  },
  makeHass()
);
const ankerHero = ankerCard.shadowRoot.querySelector("tomtut-pool-hero");
await ankerHero.updateComplete;
check("Hero setzt die gemessenen Anker der gewaehlten Form", () => {
  const form = pkg.SHAPES.achtform;
  const thermo = ankerHero.shadowRoot.querySelector(".thermo").getAttribute("style");
  assert.match(thermo, new RegExp(`top:${form.thermo.top}%`));
  assert.match(thermo, new RegExp(`left:${form.thermo.left}%`));
  const boxen = ankerHero.shadowRoot.querySelectorAll(".chem-box");
  assert.match(boxen[0].getAttribute("style"), new RegExp(`left:${form.ph.left}%`));
  assert.match(boxen[1].getAttribute("style"), new RegExp(`left:${form.rx.left}%`));
  const badge = ankerHero.shadowRoot.querySelector(".label-badge").getAttribute("style");
  assert.match(badge, new RegExp(`top:${form.label_anker.top}%`));
});

/* ================================================================== */
/* Iteration 5 — Poolpumpe, Solarheizung, Einlaufduese, Becken-Sprites */
/* ================================================================== */

/* ---- Poolpumpe: Thomas' Zeichnung statt Platzhalter ---- */

check("Pumpe: Artwork und Seitenverhaeltnis des neuen Motivs", () => {
  assert.equal(pkg.DEVICE_IMAGES.pump, "poolpumpe_transparent.png");
  assert.ok(Math.abs(pkg.DEVICE_RATIOS.pump - 1191 / 889) < 1e-9, "Ratio nicht nachgezogen");
});
check("Pumpe: Laufrad sitzt auf der Volute und bleibt darin", () => {
  const d = pkg.PUMP_DEFAULTS;
  assert.equal(d.fan_top, 52);
  assert.equal(d.fan_left, 61);
  assert.equal(d.fan_size, 19);
  /* Die Volute reicht im Bild von rund 52 % bis 70 % der Breite */
  assert.ok(d.fan_left - d.fan_size / 2 >= 51, "Laufrad ragt nach links aus der Volute");
  assert.ok(d.fan_left + d.fan_size / 2 <= 71, "Laufrad ragt nach rechts aus der Volute");
});
check("Pumpe: Overlays stehen auf den vermessenen Defaults", () => {
  const stil = (sel) => pump.shadowRoot.querySelector(sel).getAttribute("style");
  assert.match(stil(".fan-overlay"), /top:52%/);
  assert.match(stil(".fan-overlay"), /left:61%/);
  assert.match(stil(".fan-overlay"), /width:19%/);
  /* Powerbutton auf dem Motor (rechte Bildhaelfte) */
  assert.match(stil(".power-badge"), /top:43%/);
  assert.match(stil(".power-badge"), /left:79%/);
  /* Watt-Box unten links */
  assert.match(stil(".value-box"), /bottom:9%/);
  assert.match(stil(".value-box"), /left:26%/);
  /* Thermometer oben beim Ausgangsstutzen */
  assert.match(stil(".thermo"), /top:10%/);
  assert.match(stil(".thermo"), /left:36%/);
});

/* ---- Solarheizung ---- */

const SOLAR_CONFIG = {
  type: "solar",
  label: "Solarheizung",
  switch_entity: "switch.solarventil",
  temp_in_entity: "sensor.solar_vorlauf",
  temp_out_entity: "sensor.solar_ruecklauf",
  power_entity: "sensor.solar_power",
};
const solarHass = () =>
  makeHass({
    "switch.solarventil": { state: "on", attributes: {}, last_changed: iso(900) },
    "sensor.solar_vorlauf": {
      state: "24.1",
      attributes: { unit_of_measurement: "°C" },
      last_changed: iso(60),
    },
    "sensor.solar_ruecklauf": {
      state: "29.8",
      attributes: { unit_of_measurement: "°C" },
      last_changed: iso(60),
    },
    "sensor.solar_power": {
      state: "0.085",
      attributes: { unit_of_measurement: "kW" },
      last_changed: iso(60),
    },
  });
const mountSolar = async (config = SOLAR_CONFIG, hass = solarHass()) => {
  const card = await mount(Dashboard, { hero: { enabled: false }, slots: [config] }, hass);
  const slot = card.shadowRoot.querySelector("tomtut-pool-slot-solar");
  await slot.updateComplete;
  return slot;
};
const solar = await mountSolar();

check("Solar: eigener Slot statt Platzhalter", () => {
  assert.equal(pkg.SLOT_TYPES.solar.ready, true);
  assert.equal(pkg.SLOT_TYPES.solar.label, "Solarheizung");
  assert.ok(!("hint" in pkg.SLOT_TYPES.solar), "Platzhalter-Hinweis lebt noch");
  assert.ok(customElements.get("tomtut-pool-slot-solar"));
});
check("Solar: Artwork aus dem Card-Ordner", () =>
  assert.equal(
    solar.shadowRoot.querySelector("img").getAttribute("src"),
    "/local/community/tomtut-pool-cards/solar_transparent.png"
  )
);
check("Solar: Vorlauf, Ruecklauf, Watt und Powerbutton", () => {
  const thermos = solar.shadowRoot.querySelectorAll(".thermo");
  assert.equal(thermos.length, 2, "zwei Thermometer erwartet");
  const txt = solar.shadowRoot.textContent;
  assert.match(txt, /24,1 °C/);
  assert.match(txt, /29,8 °C/);
  assert.match(txt, /85/); /* kW -> Watt */
  assert.ok(solar.shadowRoot.querySelector(".power-badge.on"));
  assert.match(solar.shadowRoot.querySelector(".slot-title").textContent, /Solarheizung/);
});
check("Solar: Ruecklauf oben, Vorlauf unten am Stutzen", () => {
  const d = pkg.SOLAR_DEFAULTS;
  assert.ok(d.temp_out_top < 30, "Ruecklauf nicht am oberen Stutzen");
  assert.ok(d.temp_in_top > 70, "Vorlauf nicht am unteren Stutzen");
  assert.equal(d.temp_in_left, d.temp_out_left, "Stutzen liegen uebereinander");
  const stile = Array.from(solar.shadowRoot.querySelectorAll(".thermo")).map((t) =>
    t.getAttribute("style")
  );
  assert.match(stile[0], new RegExp(`top:${d.temp_out_top}%`));
  assert.match(stile[1], new RegExp(`top:${d.temp_in_top}%`));
});

calls.length = 0;
solar.shadowRoot.querySelector(".power-badge").click();
await solar.updateComplete;
check("Solar: Abschalten fragt nach", () => {
  assert.equal(calls.length, 0);
  assert.ok(solar.shadowRoot.querySelector(".confirm-overlay"));
  assert.match(solar.shadowRoot.textContent, /Absorber/);
});
solar.shadowRoot.querySelector(".btn.danger").click();
await solar.updateComplete;
check("Solar: Bestaetigen schaltet ab", () =>
  assert.deepEqual(calls[0], {
    domain: "switch",
    service: "turn_off",
    data: { entity_id: "switch.solarventil" },
  })
);

const solarLeer = await mountSolar({ type: "solar" });
check("Solar ohne Entity rendert trotzdem und zeigt den Hinweis", () => {
  assert.ok(solarLeer.shadowRoot.querySelector("img"));
  assert.equal(solarLeer.shadowRoot.querySelectorAll(".thermo").length, 0);
  assert.match(solarLeer.shadowRoot.textContent, /mindestens eine Entity/);
});
const solarOhneVorlauf = await mountSolar({ ...SOLAR_CONFIG, show_temp_in: false });
check("Solar: einzelnes Element abwaehlbar", () =>
  assert.equal(solarOhneVorlauf.shadowRoot.querySelectorAll(".thermo").length, 1)
);

/* ---- Einlaufduese ---- */

const INLET_CONFIG = {
  type: "inlet",
  label: "Einlaufdüse",
  temp_entity: "sensor.einlauf_temperatur",
};
const inletHass = () =>
  makeHass({
    "sensor.einlauf_temperatur": {
      state: "26.9",
      attributes: { unit_of_measurement: "°C" },
      last_changed: iso(60),
    },
  });
const mountInlet = async (config = INLET_CONFIG, hass = inletHass()) => {
  const card = await mount(Dashboard, { hero: { enabled: false }, slots: [config] }, hass);
  const slot = card.shadowRoot.querySelector("tomtut-pool-slot-inlet");
  await slot.updateComplete;
  return slot;
};
const inlet = await mountInlet();

check("Einlauf: eigener Slot statt Platzhalter", () => {
  assert.equal(pkg.SLOT_TYPES.inlet.ready, true);
  assert.equal(pkg.SLOT_TYPES.inlet.label, "Einlaufdüse");
  assert.ok(!("hint" in pkg.SLOT_TYPES.inlet), "Platzhalter-Hinweis lebt noch");
  assert.ok(customElements.get("tomtut-pool-slot-inlet"));
});
check("Einlauf: Artwork und ein Thermometer an der Duesenoeffnung", () => {
  assert.equal(
    inlet.shadowRoot.querySelector("img").getAttribute("src"),
    "/local/community/tomtut-pool-cards/einlaufduese_transparent.png"
  );
  const thermos = inlet.shadowRoot.querySelectorAll(".thermo");
  assert.equal(thermos.length, 1);
  assert.match(inlet.shadowRoot.textContent, /26,9 °C/);
  const stil = thermos[0].getAttribute("style");
  assert.match(stil, new RegExp(`top:${pkg.INLET_DEFAULTS.temp_top}%`));
  assert.match(stil, new RegExp(`left:${pkg.INLET_DEFAULTS.temp_left}%`));
});
check("Einlauf: kein Schalter, keine Watt-Box, kein Laufrad", () => {
  assert.equal(inlet.shadowRoot.querySelector(".power-badge"), null);
  assert.equal(inlet.shadowRoot.querySelector(".value-box"), null);
  assert.equal(inlet.shadowRoot.querySelector(".fan-overlay"), null);
});
const inletLeer = await mountInlet({ type: "inlet" });
check("Einlauf ohne Entity rendert trotzdem und zeigt den Hinweis", () => {
  assert.ok(inletLeer.shadowRoot.querySelector("img"));
  assert.match(inletLeer.shadowRoot.textContent, /Temperaturfühler/);
});

/* ---- Sprites auf dem Becken ---- */

const spriteCard = await mount(
  Dashboard,
  { hero: { shape: "rechteck", show_drain: true }, slots: [] },
  makeHass()
);
const spriteHero = spriteCard.shadowRoot.querySelector("tomtut-pool-hero");
await spriteHero.updateComplete;

check("Becken: alle drei Sprites mit Bild, Anker und Groesse", () => {
  const form = pkg.SHAPES.rechteck;
  for (const [name, anker] of [
    ["skimmer", "skimmer"],
    ["einlauf", "inlet"],
    ["drain", "drain"],
  ]) {
    const sprite = pkg.HERO_SPRITES[name];
    const el = spriteHero.shadowRoot.querySelector(`img.sprite-${anker}`);
    assert.ok(el, `${name} fehlt`);
    assert.equal(el.getAttribute("src"), "/local/community/tomtut-pool-cards/" + sprite.file);
    const stil = el.getAttribute("style");
    assert.match(stil, new RegExp(`top:${form[anker].top}%`));
    assert.match(stil, new RegExp(`left:${form[anker].left}%`));
    assert.match(stil, new RegExp(`width:${sprite.groesse}%`));
  }
});
check("Becken: Sprites liegen ueber dem Wasser, unter den Messwerten", () => {
  const css = cssOf("tomtut-pool-hero");
  assert.match(css, /img\.hero-sprite/);
  assert.match(css, /z-index:\s*3/);
  /* Thermometer, Kaestchen und Freitext liegen hoeher */
  assert.match(css, /z-index:\s*5/);
});
check("Becken: Sprite-Groessen sind die der Tabelle", () => {
  assert.equal(pkg.HERO_SPRITES.skimmer.groesse, 10);
  assert.equal(pkg.HERO_SPRITES.einlauf.groesse, 6.5);
  assert.equal(pkg.HERO_SPRITES.drain.groesse, 9);
  assert.equal(pkg.HERO_DEFAULTS.skimmer_size, 10);
  assert.equal(pkg.HERO_DEFAULTS.inlet_size, 6.5);
  assert.equal(pkg.HERO_DEFAULTS.drain_size, 9);
});

const spriteAus = await mount(
  Dashboard,
  { hero: { shape: "rechteck", show_skimmer: false, show_inlet: false }, slots: [] },
  makeHass()
);
const spriteAusHero = spriteAus.shadowRoot.querySelector("tomtut-pool-hero");
await spriteAusHero.updateComplete;
check("Becken: jedes Sprite einzeln abwaehlbar", () => {
  assert.equal(spriteAusHero.shadowRoot.querySelectorAll("img.hero-sprite").length, 0);
  assert.ok(spriteAusHero.shadowRoot.querySelector("img"), "Becken-Bild fehlt");
});

const spriteFrei = await mount(
  Dashboard,
  {
    hero: {
      shape: "oval",
      show_drain: true,
      drain_size: 14,
      drain_top: 40,
      drain_left: 55,
      skimmer_size: 12,
    },
    slots: [],
  },
  makeHass()
);
const spriteFreiHero = spriteFrei.shadowRoot.querySelector("tomtut-pool-hero");
await spriteFreiHero.updateComplete;
check("Becken: Groesse und Lage der Sprites sind ueberschreibbar", () => {
  const drain = spriteFreiHero.shadowRoot.querySelector("img.sprite-drain").getAttribute("style");
  assert.match(drain, /top:40%/);
  assert.match(drain, /left:55%/);
  assert.match(drain, /width:14%/);
  const skimmer = spriteFreiHero.shadowRoot
    .querySelector("img.sprite-skimmer")
    .getAttribute("style");
  assert.match(skimmer, /width:12%/);
  /* nicht gesetzte Werte bleiben beim Anker der Form */
  assert.match(skimmer, new RegExp(`top:${pkg.SHAPES.oval.skimmer.top}%`));
});

check("Becken: jede Form hat Anker fuer Skimmer und Einlaufduese", () => {
  for (const [name, form] of Object.entries(pkg.SHAPES)) {
    assert.ok(form.skimmer && form.inlet, `${name}: Anker fehlt`);
    assert.ok(form.skimmer.left < 30, `${name}: Skimmer nicht links hinten`);
    assert.ok(form.inlet.left > 60, `${name}: Einlaufduese nicht rechts hinten`);
    /* beide sitzen hoeher als das Thermometer, also am hinteren Rand */
    assert.ok(form.inlet.top < form.thermo.top, `${name}: Einlaufduese nicht am hinteren Rand`);
    assert.ok(form.skimmer.top < form.ph.top, `${name}: Skimmer nicht am hinteren Rand`);
  }
});

/* ---- Editor: neue Slots und Sprite-Regler ---- */

const ed5 = new Editor();
ed5.setConfig({
  hero: { enabled: true, shape: "oval" },
  slots: [{ type: "solar" }, { type: "inlet" }],
});
ed5.hass = makeHass();
document.body.appendChild(ed5);
await ed5.updateComplete;
let ed5Fired = null;
ed5.addEventListener("config-changed", (e) => (ed5Fired = e.detail.config));

check("Editor: kein Slot-Typ traegt noch '(folgt)'", () => {
  assert.ok(!pkg.slotTypeOptions().some((o) => /folgt/.test(o.label)), "'(folgt)' lebt noch");
  for (const [key, meta] of Object.entries(pkg.SLOT_TYPES)) {
    assert.notEqual(meta.ready, false, `${key} ist noch reserviert`);
  }
});
check("Editor: Solar-Slot hat Elemente, Entities und Regler", () => {
  const txt = ed5.shadowRoot.textContent;
  assert.match(txt, /Vorlauf/);
  assert.match(txt, /Rücklauf/);
  assert.match(txt, /Absorber/);
  for (const key of ["temp_in_top", "temp_out_top", "power_btn_top"]) {
    assert.ok(ed5.shadowRoot.querySelector(`input[data-key="${key}"]`), `${key} fehlt`);
  }
  const regler = ed5.shadowRoot.querySelector('input[data-key="temp_in_top"]');
  assert.equal(regler.value, String(pkg.SOLAR_DEFAULTS.temp_in_top));
});
check("Editor: Einlauf-Slot hat nur das Thermometer", () => {
  const karte = ed5.shadowRoot.querySelectorAll(".slot-card")[1];
  const schalter = karte.querySelectorAll('.elements input[type="checkbox"]');
  assert.equal(schalter.length, 1, "Einlaufduese hat mehr als ein Element");
  assert.equal(schalter[0].dataset.key, "show_temp");
});
check("Editor: Becken bietet Skimmer, Einlaufduese und Bodenablauf", () => {
  const txt = ed5.shadowRoot.textContent;
  assert.match(txt, /Skimmer/);
  assert.match(txt, /Einlaufdüse/);
  assert.match(txt, /Bodenablauf/);
  /* Skimmer und Einlaufduese sind an -> ihre Regler sind da, der Ablauf nicht */
  assert.ok(ed5.shadowRoot.querySelector('input[data-key="skimmer_size"]'));
  assert.ok(ed5.shadowRoot.querySelector('input[data-key="inlet_size"]'));
  assert.equal(ed5.shadowRoot.querySelector('input[data-key="drain_size"]'), null);
});
check("Editor: Sprite-Regler starten auf dem Anker der Form", () => {
  const top = ed5.shadowRoot.querySelector('input[data-key="skimmer_top"]');
  assert.equal(top.value, String(pkg.SHAPES.oval.skimmer.top));
  const groesse = ed5.shadowRoot.querySelector('input[data-key="skimmer_size"]');
  assert.equal(groesse.value, String(pkg.HERO_SPRITES.skimmer.groesse));
});

ed5.shadowRoot.querySelector('.elements input[data-key="show_drain"]').click();
await ed5.updateComplete;
check("Editor: Bodenablauf anhaken bringt seine Regler", () => {
  assert.equal(ed5Fired.hero.show_drain, true);
  assert.ok(ed5.shadowRoot.querySelector('input[data-key="drain_size"]'));
});
ed5.shadowRoot.querySelector('.elements input[data-key="show_skimmer"]').click();
await ed5.updateComplete;
check("Editor: Skimmer abwaehlen raeumt seine Schluessel aus der Config", () => {
  assert.equal(ed5Fired.hero.show_skimmer, false);
  for (const key of ["skimmer_size", "skimmer_top", "skimmer_left"]) {
    assert.ok(!(key in ed5Fired.hero), `${key} steht noch drin`);
  }
  assert.equal(ed5.shadowRoot.querySelector('input[data-key="skimmer_size"]'), null);
});

/* ---- eingefrorene v1-Config bleibt lesbar ---- */

check("v1-Config: neue Slot-Typen aendern die alte Config nicht", () => {
  const roh = readFileSync(join(here, "fixtures/v1-config.yaml"), "utf8");
  assert.match(roh, /type: uv/);
  assert.ok(!/type: solar/.test(roh), "Fixture wurde angefasst");
  const nochmal = new Dashboard();
  nochmal.setConfig(fixtureConfig);
  assert.equal(nochmal._config.slots.length, 6);
});
check("v1-Config: Becken-Sprites kommen ab Werk dazu, ohne die Config zu aendern", () => {
  /* Bewusste Entscheidung aus Iteration 5: ein Becken ohne Angabe zeigt
     Skimmer und Einlaufduese (so sieht ein echtes Becken aus), der
     Bodenablauf bleibt aus. In der Config steht davon nichts. */
  assert.ok(frozenHero.shadowRoot.querySelector("img.sprite-skimmer"));
  assert.ok(frozenHero.shadowRoot.querySelector("img.sprite-inlet"));
  assert.equal(frozenHero.shadowRoot.querySelector("img.sprite-drain"), null);
  assert.ok(!("show_skimmer" in frozen._config.hero));
});

/* ------------------------------------------------------------------ */

console.log(results.join("\n"));
console.log(
  process.exitCode ? "\nSmoke-Test FEHLGESCHLAGEN" : `\nSmoke-Test ok (${results.length} Checks)`
);
