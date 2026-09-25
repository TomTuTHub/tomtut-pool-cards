/*
 * Smoke-Test des gebuendelten Pakets gegen ein jsdom-DOM.
 * Laeuft ohne Home Assistant: hass wird gestubbt, Service-Calls mitgeschrieben.
 *   node test/smoke.mjs
 */
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
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

/* Erwartete Bild-URL inkl. Cache-Buster (?v=<Version>) */
const bild = (datei) =>
  "/local/community/tomtut-pool-cards/" + datei + "?v=" + encodeURIComponent(pkg.ASSET_VERSION);

const Dashboard = customElements.get("tomtut-pool-dashboard");

/* ------------------------------------------------------------------ */
/* Registrierung                                                       */
/* ------------------------------------------------------------------ */

check("Dashboard-Card registriert", () => assert.ok(Dashboard));
check("Dashboard-Editor registriert", () =>
  assert.ok(customElements.get("tomtut-pool-dashboard-editor"))
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
check("Dashboard-Card in window.customCards", () => {
  const types = window.customCards.map((c) => c.type);
  assert.deepEqual(types, ["tomtut-pool-dashboard"]);
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
    bild("poolbecken_freiform.png")
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
    bild("poolbecken_oval.png")
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
    bild("waermepumpe_transparent.png")
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
  /* Hier wird die Schalter-Logik geprueft; die Erkennung aus der Leistung
     (Iteration 9, ab Werk an) hat ihre eigenen Tests weiter unten. */
  stage_from_power: false,
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
check("Werte-Slot: Ueberschrift + alle vier Eintraege (seit It16 bis 8)", () => {
  assert.match(custom.shadowRoot.querySelector(".slot-title").textContent, /Werte/);
  assert.equal(custom.shadowRoot.querySelectorAll(".entry").length, 4);
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
  assert.equal(editor.shadowRoot.querySelectorAll(".slot-card:not(.becken-card)").length, 6)
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
    ["heatpump", "pump", "uv", "solar"]
  );
  /* jeder waehlbare Typ aus der Tabelle taucht genau einmal auf */
  const werte = opts.filter((o) => !o.trenner).map((o) => o.value);
  const waehlbar = Object.keys(pkg.SLOT_TYPES).filter(
    (k) => pkg.SLOT_TYPES[k].waehlbar !== false
  );
  assert.deepEqual([...werte].sort(), waehlbar.sort());
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

/* ================================================================== */
/* Iteration 2 — Thomas' Korrekturen                                   */
/* ================================================================== */

const cssOf = (tag) => {
  const el = customElements.get(tag);
  if (!el) throw new Error(`Baustein ${tag} ist nicht registriert`);
  /* static styles ist mal ein Array, mal ein einzelnes CSSResult */
  return [el.styles].flat(2).map((x) => x.cssText).join("\n");
};

/* Der z-index einer Regel — gelesen aus dem Block, der mit dem Selektor
   beginnt. jsdom rechnet kein Layout, also wird der Wert am Text geprueft. */
const zIndexVon = (css, selektor) => {
  const i = css.indexOf(selektor + " {");
  if (i < 0) throw new Error(`Selektor ${selektor} nicht gefunden`);
  const block = css.slice(i, css.indexOf("}", i));
  const treffer = block.match(/z-index:\s*(-?\d+)/);
  return treffer ? Number(treffer[1]) : null;
};

/* Alle z-index-Werte eines Bausteins */
const alleZIndex = (css) => [...css.matchAll(/z-index:\s*(-?\d+)/g)].map((m) => Number(m[1]));

const ALLE_BAUSTEINE = [
  "tomtut-pool-dashboard",
  "tomtut-pool-hero",
  "tomtut-pool-slot-heatpump",
  "tomtut-pool-slot-pump",
  "tomtut-pool-slot-uv",
  "tomtut-pool-slot-solar",
  "tomtut-pool-slot-custom",
  "tomtut-pool-slot-frame",
  "tomtut-pool-dashboard-editor",
];

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
    bild("poolpumpe_transparent.png")
  );
  assert.ok(freshPump.shadowRoot.querySelector(".fan-overlay"), "Laufrad fehlt");
  assert.match(freshPump.shadowRoot.textContent, /mindestens eine Stufen-Entity/);
});
check("frischer Waermepumpen-Slot rendert sofort", () => {
  assert.equal(
    freshHp.shadowRoot.querySelector("img").getAttribute("src"),
    bild("waermepumpe_transparent.png")
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
    bild("poolpumpe_transparent.png")
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
  const cards = ed2.shadowRoot.querySelectorAll(".slot-card:not(.becken-card)");
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
    (i) => !i.closest(".slot-card:not(.becken-card)")
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
  const erster = ed2.shadowRoot.querySelectorAll(".slot-card:not(.becken-card)")[0];
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
  const erster = ed2.shadowRoot.querySelectorAll(".slot-card:not(.becken-card)")[0];
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
    bild("uv_lampe_transparent.png")
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
check("UV: der Kern des Gluehens bleibt statisch (Wabern nur obendrauf)", () => {
  /* Iteration 9: Thomas' Einstellung (Gluehen max, schwarzer Grund) darf
     nicht schlechter werden — der Kern ist unveraendert und unanimiert,
     das Wabern kommt nur ueber ::before/::after dazu. */
  const css = cssOf("tomtut-pool-slot-uv");
  const i = css.indexOf(".glow {");
  assert.ok(i >= 0);
  const kern = css.slice(i, css.indexOf("}", i));
  assert.ok(!/animation/.test(kern), "Kern animiert");
  assert.match(kern, /radial-gradient/);
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
    bild("uv_lampe_transparent_2.png")
  )
);
const uvKrumm = await mountUv({ ...UV_CONFIG, anschluss: "gibtsnicht" });
check("UV: unbekannte Variante faellt auf das Standardbild zurueck", () =>
  assert.equal(
    uvKrumm.shadowRoot.querySelector("img").getAttribute("src"),
    bild("uv_lampe_transparent.png")
  )
);

/*
 * Iteration 6: Der Bildkasten hat IMMER das Seitenverhaeltnis des PNGs und
 * aendert seine Groesse beim Drehen nicht. Vorher wurde er quadratisch --
 * damit wuchs der Slot und das Bild legte sich ueber die Nachbar-Cards.
 */
const kastenStil = (el) => el.shadowRoot.querySelector(".bild-flaeche").getAttribute("style");
const UV_KASTEN = `aspect-ratio:${Math.round(pkg.DEVICE_RATIOS.uv * 10000) / 10000};`;
const bildStil = (el) => el.shadowRoot.querySelector(".bild").getAttribute("style");
const skala = (grad) => Math.round(pkg.passFaktor(grad, pkg.DEVICE_RATIOS.uv) * 1000) / 1000;

check("UV: ungedreht ohne Transform, Kasten im Bildverhaeltnis", () => {
  assert.equal(bildStil(uv), "");
  assert.equal(kastenStil(uv), UV_KASTEN);
  assert.equal(uv.shadowRoot.querySelector(".img-wrap.quadrat"), null);
});

const uvGedreht = await mountUv({ ...UV_CONFIG, rotate: 90 });
check("UV: 90 Grad dreht nur das Bild, der Kasten bleibt gleich", () => {
  assert.match(bildStil(uvGedreht), /rotate\(90deg\)/);
  assert.equal(kastenStil(uvGedreht), UV_KASTEN);
});
check("UV: gedrehtes Bild wird passend verkleinert", () => {
  /* quer liegendes Bild hochkant gedreht -> passt nur auf 1/ratio */
  const f = skala(90);
  assert.ok(Math.abs(f - 1 / pkg.DEVICE_RATIOS.uv) < 0.001, `Faktor ${f}`);
  assert.ok(bildStil(uvGedreht).includes(`scale(${f})`), bildStil(uvGedreht));
});
const uv45 = await mountUv({ ...UV_CONFIG, rotate: 45 });
check("UV: schraeg gedreht wird ebenfalls verkleinert", () => {
  const stil = bildStil(uv45);
  assert.match(stil, /rotate\(45deg\)/);
  assert.ok(skala(45) < 1 && skala(45) > 0, `Faktor ${skala(45)}`);
  assert.ok(stil.includes(`scale(${skala(45)})`), stil);
  assert.equal(kastenStil(uv45), UV_KASTEN);
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
check("UV: 180 Grad dreht ohne zu verkleinern", () => {
  const stil = bildStil(uv180);
  assert.match(stil, /rotate\(180deg\)/);
  assert.ok(!/scale\(/.test(stil), stil);
  assert.equal(kastenStil(uv180), UV_KASTEN);
});
const uvGespiegelt = await mountUv({ ...UV_CONFIG, mirror: true });
check("UV: Spiegeln ohne Drehung", () => {
  const stil = bildStil(uvGespiegelt);
  assert.match(stil, /scaleX\(-1\)/);
  assert.ok(!/rotate/.test(stil));
  assert.equal(kastenStil(uvGespiegelt), UV_KASTEN);
});
const uvGedrehtGespiegelt = await mountUv({ ...UV_CONFIG, rotate: 90, mirror: true });
check("UV: gedreht UND gespiegelt bleibt im selben Kasten", () => {
  const stil = bildStil(uvGedrehtGespiegelt);
  assert.match(stil, /rotate\(90deg\)/);
  assert.match(stil, /scaleX\(-1\)/);
  assert.ok(stil.includes(`scale(${skala(90)})`), stil);
  assert.equal(kastenStil(uvGedrehtGespiegelt), UV_KASTEN);
});

check("UV: Passfaktor haelt das gedrehte Bild im Kasten", () => {
  /* Kasten = ratio breit, 1 hoch (dieselbe Form wie das Bild). */
  for (const r of [pkg.DEVICE_RATIOS.uv, pkg.DEVICE_RATIOS.pump, 1, 0.5]) {
    assert.equal(pkg.passFaktor(0, r), 1, `0 Grad bei ratio ${r}`);
    assert.equal(pkg.passFaktor(180, r), 1, `180 Grad bei ratio ${r}`);
    for (let grad = 0; grad < 360; grad += 5) {
      const f = pkg.passFaktor(grad, r);
      const rad = (grad * Math.PI) / 180;
      const c = Math.abs(Math.cos(rad)), si = Math.abs(Math.sin(rad));
      const huelleBreit = f * (r * c + si);
      const huelleHoch = f * (r * si + c);
      assert.ok(f > 0 && f <= 1, `Faktor ${f} bei ${grad} Grad`);
      assert.ok(
        huelleBreit <= r * 1.0001 && huelleHoch <= 1.0001,
        `ragt raus bei ${grad} Grad (ratio ${r})`
      );
    }
  }
  /* quer liegendes Bild hochkant -> genau 1/ratio; quadratisch -> 1 */
  assert.ok(Math.abs(pkg.passFaktor(90, 2) - 0.5) < 1e-9);
  assert.equal(pkg.passFaktor(90, 1), 1);
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
    bild("uv_lampe_transparent.png")
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
  /* Iteration 7: Selinas Zeichnung `Pumpe.png` statt des KI-Platzhalters */
  assert.ok(Math.abs(pkg.DEVICE_RATIOS.pump - 1126 / 756) < 1e-9, "Ratio nicht nachgezogen");
});
check("Pumpe: Laufrad sitzt auf der Volute und bleibt darin", () => {
  const d = pkg.PUMP_DEFAULTS;
  assert.equal(d.fan_top, 60);
  assert.equal(d.fan_left, 61);
  assert.equal(d.fan_size, 18);
  /* Die Volute reicht im neuen Bild von rund 50 % bis 72 % der Breite und
     von rund 28 % bis 92 % der Hoehe; das Laufrad ist rund, seine Hoehe in
     Prozent der Bildhoehe also fan_size * ratio. */
  const hoch = d.fan_size * pkg.DEVICE_RATIOS.pump;
  assert.ok(d.fan_left - d.fan_size / 2 >= 50, "Laufrad ragt nach links aus der Volute");
  assert.ok(d.fan_left + d.fan_size / 2 <= 72, "Laufrad ragt nach rechts aus der Volute");
  assert.ok(d.fan_top - hoch / 2 >= 28, "Laufrad ragt oben aus der Volute");
  assert.ok(d.fan_top + hoch / 2 <= 92, "Laufrad ragt unten aus der Volute");
});
check("Pumpe: Overlays stehen auf den vermessenen Defaults", () => {
  const stil = (sel) => pump.shadowRoot.querySelector(sel).getAttribute("style");
  assert.match(stil(".fan-overlay"), /top:60%/);
  assert.match(stil(".fan-overlay"), /left:61%/);
  assert.match(stil(".fan-overlay"), /width:18%/);
  /* Powerbutton auf dem Motor (rechte Bildhaelfte) */
  assert.match(stil(".power-badge"), /top:62%/);
  assert.match(stil(".power-badge"), /left:80%/);
  /* Watt-Box unten links, in der freien Ecke */
  assert.match(stil(".value-box"), /bottom:9%/);
  assert.match(stil(".value-box"), /left:24%/);
  /* Thermometer oben neben dem Druckstutzen */
  assert.match(stil(".thermo"), /top:11%/);
  assert.match(stil(".thermo"), /left:38%/);
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
    bild("solar_transparent.png")
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
/*
 * Iteration 14: das Feld wird LINKS UNTEN gespeist und gibt RECHTS OBEN ab
 * (quer durchs Feld, wie ein Absorber real durchstroemt wird). Vorlauf
 * steht deshalb links unten, Ruecklauf rechts oben — jeweils bei seinem Pfeil.
 */
check("Solar: Vorlauf links unten, Ruecklauf rechts oben", () => {
  const d = pkg.SOLAR_DEFAULTS;
  assert.ok(d.temp_in_top > 60 && d.temp_in_left < 40, "Vorlauf nicht links unten");
  assert.ok(d.temp_out_top < 40 && d.temp_out_left > 60, "Ruecklauf nicht rechts oben");
  const stile = Array.from(solar.shadowRoot.querySelectorAll(".thermo")).map((t) =>
    t.getAttribute("style")
  );
  assert.match(stile[0], new RegExp(`top:${d.temp_in_top}%`));
  assert.match(stile[1], new RegExp(`top:${d.temp_out_top}%`));
});
check("Solar: jedes Thermometer steht neben seinem Pfeil", () => {
  const d = pkg.SOLAR_DEFAULTS;
  const nah = (a, b) => Math.abs(a - b) <= 16;
  assert.ok(nah(d.temp_in_top, d.arrow_in_top), "Vorlauf steht nicht beim blauen Pfeil");
  assert.ok(nah(d.temp_out_top, d.arrow_out_top), "Ruecklauf steht nicht beim roten Pfeil");
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

/* ---- Einlaufduese: Slot abgeschafft, lebt am Becken weiter (It. 6) ---- */

const einlaufHass = () =>
  makeHass({
    "sensor.einlauf_temperatur": {
      state: "26.9",
      attributes: { unit_of_measurement: "°C" },
      last_changed: iso(60),
    },
  });

const altInlet = await mount(
  Dashboard,
  { hero: { enabled: false }, slots: [{ type: "inlet", label: "Einlaufdüse", temp_entity: "sensor.einlauf_temperatur" }] },
  einlaufHass()
);
check("Einlauf: alte Config mit type inlet bricht nicht, sondern erklaert sich", () => {
  /* Update-Schutz: der Typ verschwindet nie aus SLOT_TYPES, er wird nur
     unfertig gestellt und faellt damit auf den Rahmen-Slot zurueck. */
  assert.equal(altInlet.shadowRoot.querySelector("tomtut-pool-slot-inlet"), null);
  const rahmen = altInlet.shadowRoot.querySelector("tomtut-pool-slot-frame");
  assert.ok(rahmen, "kein Rahmen-Fallback");
  assert.match(rahmen.shadowRoot.textContent, /Einlaufdüse ist jetzt Teil des Beckens/);
  assert.equal(altInlet._config.slots[0].type, "inlet", "Config wurde angefasst");
});
check("Einlauf: kein eigener Slot-Typ mehr", () => {
  assert.equal(pkg.SLOT_TYPES.inlet.ready, false);
  assert.equal(pkg.SLOT_TYPES.inlet.waehlbar, false);
  assert.equal(customElements.get("tomtut-pool-slot-inlet"), undefined);
  assert.ok(!("inlet" in pkg.DEVICE_IMAGES), "Geraetebild lebt noch");
  assert.ok(!("inlet" in pkg.DEVICE_RATIOS), "Ratio lebt noch");
  assert.ok(!pkg.slotTypeOptions().some((o) => o.value === "inlet"), "steht noch im Picker");
});
check("Einlauf: das Sprite-Bild bleibt ausgeliefert", () =>
  assert.equal(pkg.HERO_SPRITES.einlauf.file, "einlaufduese_transparent.png")
);

/* ---- Einlauftemperatur als Kaestchen am Becken ---- */

const mountBecken = async (hero) => {
  const card = await mount(Dashboard, { hero, slots: [] }, einlaufHass());
  const becken = card.shadowRoot.querySelector("tomtut-pool-hero");
  await becken.updateComplete;
  return becken;
};

const beckenEinlauf = await mountBecken({
  shape: "oval",
  inlet_temp_entity: "sensor.einlauf_temperatur",
});
check("Becken: Einlauftemperatur sitzt als Kaestchen neben der Duese", () => {
  const box = beckenEinlauf.shadowRoot.querySelector(".chem-box.inlet-temp");
  assert.ok(box, "kein Kaestchen");
  assert.match(box.textContent, /Zulauf/);
  assert.match(box.textContent, /26,9 °C/);
  const anker = pkg.SHAPES.oval.inlet;
  const stil = box.getAttribute("style");
  assert.match(stil, new RegExp(`top:${anker.top + pkg.INLET_TEMP_VERSATZ.top}%`));
  assert.match(stil, new RegExp(`left:${anker.left + pkg.INLET_TEMP_VERSATZ.left}%`));
});
check("Becken: Kaestchen oeffnet die Entity (more-info)", () =>
  assert.equal(
    beckenEinlauf.shadowRoot.querySelector(".chem-box.inlet-temp").dataset.entity,
    "sensor.einlauf_temperatur"
  )
);

const beckenVerschoben = await mountBecken({
  shape: "oval",
  inlet_temp_entity: "sensor.einlauf_temperatur",
  inlet_top: 30,
  inlet_left: 40,
});
check("Becken: das Kaestchen wandert mit der verschobenen Duese", () => {
  const stil = beckenVerschoben.shadowRoot
    .querySelector(".chem-box.inlet-temp")
    .getAttribute("style");
  assert.match(stil, new RegExp(`top:${30 + pkg.INLET_TEMP_VERSATZ.top}%`));
  assert.match(stil, new RegExp(`left:${40 + pkg.INLET_TEMP_VERSATZ.left}%`));
});

const beckenEigenePos = await mountBecken({
  shape: "oval",
  inlet_temp_entity: "sensor.einlauf_temperatur",
  inlet_temp_top: 55,
  inlet_temp_left: 22,
});
check("Becken: eigene Position schlaegt den Versatz", () => {
  const stil = beckenEigenePos.shadowRoot
    .querySelector(".chem-box.inlet-temp")
    .getAttribute("style");
  assert.match(stil, /top:55%/);
  assert.match(stil, /left:22%/);
});

const beckenOhneDuese = await mountBecken({
  shape: "oval",
  show_inlet: false,
  inlet_temp_entity: "sensor.einlauf_temperatur",
});
check("Becken: ohne Duese auch kein Kaestchen", () => {
  assert.equal(beckenOhneDuese.shadowRoot.querySelector("img.sprite-inlet"), null);
  assert.equal(beckenOhneDuese.shadowRoot.querySelector(".chem-box.inlet-temp"), null);
});

const beckenOhneEntity = await mountBecken({ shape: "oval" });
check("Becken: ohne Entity bleibt es beim blossen Sprite", () => {
  assert.ok(beckenOhneEntity.shadowRoot.querySelector("img.sprite-inlet"));
  assert.equal(beckenOhneEntity.shadowRoot.querySelector(".chem-box.inlet-temp"), null);
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
    assert.equal(el.getAttribute("src"), bild(sprite.file));
    const stil = el.getAttribute("style");
    assert.match(stil, new RegExp(`top:${form[anker].top}%`));
    assert.match(stil, new RegExp(`left:${form[anker].left}%`));
    assert.match(stil, new RegExp(`width:${sprite.groesse}%`));
  }
});
check("Becken: Sprites liegen ueber dem Wasser, unter den Messwerten", () => {
  const css = cssOf("tomtut-pool-hero");
  assert.match(css, /img\.hero-sprite/);
  assert.equal(zIndexVon(css, "img.hero-sprite"), 2);
  /* Thermometer, Kaestchen und Freitext liegen hoeher */
  assert.equal(zIndexVon(css, ".thermo"), 4);
  assert.equal(zIndexVon(css, ".chem-box"), 4);
  assert.equal(zIndexVon(css, ".label-badge"), 4);
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

check("Editor: kein waehlbarer Slot-Typ ist unfertig", () => {
  assert.ok(!pkg.slotTypeOptions().some((o) => /folgt/.test(o.label)), "'(folgt)' lebt noch");
  for (const [key, meta] of Object.entries(pkg.SLOT_TYPES)) {
    if (meta.waehlbar === false) continue;
    assert.notEqual(meta.ready, false, `${key} ist noch reserviert`);
  }
  /* genau ein abgeschaffter Typ: die Einlaufduese */
  assert.deepEqual(
    Object.keys(pkg.SLOT_TYPES).filter((k) => pkg.SLOT_TYPES[k].waehlbar === false),
    ["inlet"]
  );
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
check("Editor: alter Einlauf-Slot zeigt sich als abgeschafft", () => {
  const karte = ed5.shadowRoot.querySelectorAll(".slot-card:not(.becken-card)")[1];
  /* kein Gerätekasten mehr, sondern die Felder des leeren Rahmens */
  assert.equal(karte.querySelectorAll('.elements input[type="checkbox"]').length, 0);
  assert.ok(karte.querySelector('input[data-key="hint"]'), "Rahmen-Felder fehlen");
  /* und im Auswahlfeld steht, was in der Config steht */
  const sel = karte.querySelector('select[data-key="type"]');
  assert.equal(sel.value, "inlet");
  assert.match(sel.selectedOptions[0].textContent, /entfällt/);
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

/* ---- Bildbereich: eine Regel fuer alle Geraete-Slots ---- */

check("Geraete-Ratios stimmen mit den ausgelieferten PNGs ueberein", () => {
  /* Seit Iteration 6 bestimmt DEVICE_RATIOS die Kastenhoehe (aspect-ratio).
     Passt eine Zahl nicht zum Bild, wird das Artwork verzerrt. */
  for (const [kind, datei] of Object.entries(pkg.DEVICE_IMAGES)) {
    const png = readFileSync(join(here, "../dist", datei));
    assert.equal(png.readUInt32BE(12), 0x49484452, `${datei}: kein PNG-Header`);
    const breit = png.readUInt32BE(16);
    const hoch = png.readUInt32BE(20);
    assert.ok(
      Math.abs(breit / hoch - pkg.DEVICE_RATIOS[kind]) < 1e-6,
      `${kind}: PNG ist ${breit}x${hoch}, Tabelle sagt ${pkg.DEVICE_RATIOS[kind]}`
    );
  }
});



check("Alle Geraete-Slots bauen den Bildbereich aus shared/", () => {
  for (const [name, el, kind] of [
    ["Waermepumpe", hp, "heatpump"],
    ["Poolpumpe", pump, "pump"],
    ["UV-Lampe", uv, "uv"],
    ["Solarheizung", solar, "solar"],
  ]) {
    const flaeche = el.shadowRoot.querySelector(".img-wrap > .bild-flaeche");
    assert.ok(flaeche, `${name}: kein gemeinsamer Bildbereich`);
    assert.equal(
      flaeche.getAttribute("style"),
      `aspect-ratio:${Math.round(pkg.DEVICE_RATIOS[kind] * 10000) / 10000};`,
      `${name}: falsches Seitenverhaeltnis`
    );
    const bild = flaeche.querySelector(":scope > .bild");
    assert.ok(bild, `${name}: kein Dreh-Wrapper`);
    assert.ok(bild.querySelector(":scope > img"), `${name}: Bild sitzt nicht im Wrapper`);
  }
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

/* ================================================================== */
/* Iteration 7 — Selinas Artwork, Solarfeld, UV-Groesse, Editor-Farben */
/* ================================================================== */

const pngGroesse = (datei) => {
  const png = readFileSync(join(here, "../dist", datei));
  assert.equal(png.readUInt32BE(12), 0x49484452, `${datei}: kein PNG-Header`);
  return [png.readUInt32BE(16), png.readUInt32BE(20)];
};

/* ---- alle Bilder kommen aus demselben handgezeichneten Satz ---- */

check("Bilder: jede URL traegt den Cache-Buster ?v=<Version>", () => {
  assert.match(pkg.ASSET_VERSION, /^\d+\.\d+\.\d+-[0-9a-f]{8}$/, "Version beim Build nicht eingesetzt");
  assert.equal(
    pkg.imagePath("solar_transparent.png"),
    "/local/community/tomtut-pool-cards/solar_transparent.png?v=" + pkg.ASSET_VERSION
  );
  assert.ok(pkg.imagePath("x.png").includes("?v="));
  /* Hash ueber die PNGs in dist/ — wie in rollup.config.js */
  const h = createHash("sha256");
  for (const f of readdirSync(join(here, "../dist")).filter((x) => x.endsWith(".png")).sort()) {
    h.update(f);
    h.update(readFileSync(join(here, "../dist", f)));
  }
  assert.ok(pkg.ASSET_VERSION.endsWith("-" + h.digest("hex").slice(0, 8)), "Version passt nicht zu den PNGs");
});
check("Artwork: jede ausgelieferte Datei ist im Bundle benannt", () => {
  /* Eine Quelle fuer Dateinamen (shared/assets.js) — kein Bild aus einer
     anderen Ecke, keine Karteileiche in dist/. */
  const genannt = new Set([
    ...Object.values(pkg.DEVICE_IMAGES),
    ...Object.values(pkg.DEVICE_VARIANTS.uv),
    ...Object.values(pkg.HERO_SPRITES).map((x) => x.file),
    ...Object.values(pkg.FLOW_MARKERS),
    ...Object.values(pkg.SHAPES).map((x) => x.file),
  ]);
  const dateien = readdirSync(join(here, "../dist")).filter((f) => f.endsWith(".png"));
  assert.deepEqual(
    dateien.filter((f) => !genannt.has(f)),
    [],
    "unbenutzte PNGs in dist/"
  );
  for (const f of genannt) assert.ok(dateien.includes(f), `${f} fehlt in dist/`);
});
check("Artwork: Sprites und Marker werden klein ausgeliefert", () => {
  /* HACS kopiert dist/ in jede Installation: was nur als Sprite auf dem
     Becken liegt, braucht keine Geraete-Aufloesung. */
  for (const sprite of Object.values(pkg.HERO_SPRITES)) {
    const [breit] = pngGroesse(sprite.file);
    assert.ok(breit <= 640, `${sprite.file} ist ${breit} px breit`);
  }
  for (const datei of Object.values(pkg.FLOW_MARKERS)) {
    const [breit] = pngGroesse(datei);
    assert.ok(breit <= 200, `${datei} ist ${breit} px breit`);
  }
});

/* ---- Solarfeld: drei Panels, deterministisch zusammengesetzt ---- */

const komposition = JSON.parse(
  readFileSync(join(here, "fixtures/solar-komposition.json"), "utf8")
);

check("Solar: das Feld ist die Komposition aus drei OKU-Panels", () => {
  /* Selinas gezeichnetes Panel — Iteration 9 hatte kurz Thomas' Echtfoto
     OKU.png, seit Iteration 13 ist die Card wieder durchgehend gezeichnet */
  assert.equal(komposition.quelle, "OKU_Panel.png");
  assert.equal(komposition.panels, 3);
  assert.equal(komposition.datei, pkg.DEVICE_IMAGES.solar);
  const [breit, hoch] = komposition.panel_groesse;
  const [dx, dy] = komposition.versatz_px;
  /* Versatz = Panelbreite minus Ueberlapp, Hoehenversatz wie eingestellt */
  assert.equal(dx, Math.round(breit * (1 - komposition.ueberlapp)));
  assert.equal(dy, Math.round(hoch * komposition.versatz_hoch));
  /* und die Leinwand ist genau so gross, wie die drei Panels es machen */
  assert.deepEqual(komposition.groesse, [breit + dx * 2, hoch + dy * 2]);
});
check("Solar: das ausgelieferte PNG ist genau diese Komposition", () => {
  const roh = readFileSync(join(here, "../dist", pkg.DEVICE_IMAGES.solar));
  assert.equal(createHash("sha256").update(roh).digest("hex"), komposition.sha256);
  assert.deepEqual(pngGroesse(pkg.DEVICE_IMAGES.solar), komposition.groesse);
});
check("Solar: das Feld liegt quer wie die anderen Geraetebilder", () => {
  const [breit, hoch] = komposition.groesse;
  assert.ok(Math.abs(pkg.DEVICE_RATIOS.solar - breit / hoch) < 1e-9, "Ratio nicht nachgezogen");
  assert.ok(pkg.DEVICE_RATIOS.solar > 1.2, "Solarfeld ist hochkant — der Slot wuerde zu hoch");
});

/* ---- Richtungsmarker ---- */

const solarPfeile = (el) =>
  Array.from(el.shadowRoot.querySelectorAll("img.flow-arrow")).map((x) => ({
    src: x.getAttribute("src"),
    stil: x.getAttribute("style"),
  }));

check("Solar: blauer Pfeil links unten hinein, roter rechts oben hinaus", () => {
  const pfeile = solarPfeile(solar);
  assert.equal(pfeile.length, 2, "zwei Marker erwartet");
  assert.equal(pfeile[0].src, bild(pkg.FLOW_MARKERS.in));
  assert.equal(pfeile[1].src, bild(pkg.FLOW_MARKERS.out));
  const d = pkg.SOLAR_DEFAULTS;
  assert.match(pfeile[0].stil, new RegExp(`top:${d.arrow_in_top}%`));
  assert.match(pfeile[0].stil, new RegExp(`left:${d.arrow_in_left}%`));
  assert.match(pfeile[0].stil, new RegExp(`width:${d.arrow_in_size}%`));
  assert.match(pfeile[1].stil, new RegExp(`top:${d.arrow_out_top}%`));
  assert.match(pfeile[1].stil, new RegExp(`left:${d.arrow_out_left}%`));
  assert.ok(d.arrow_in_top > d.arrow_out_top, "der blaue Pfeil sitzt nicht unten");
  assert.ok(d.arrow_in_left < d.arrow_out_left, "der blaue Pfeil sitzt nicht links");
  assert.ok(d.arrow_in_left < 20 && d.arrow_in_top > 75, "blau nicht am ersten Panel unten");
  assert.ok(d.arrow_out_left > 80 && d.arrow_out_top < 25, "rot nicht am dritten Panel oben");
});
check("Solar: die Marker liegen ueber dem Bild, aber unter den Messwerten", () => {
  const css = cssOf("tomtut-pool-slot-solar");
  assert.match(css, /img\.flow-arrow/);
  assert.equal(zIndexVon(css, "img.flow-arrow"), 2);
  assert.ok(zIndexVon(css, "img.flow-arrow") < zIndexVon(css, ".thermo"));
});

const solarOhnePfeile = await mountSolar({ ...SOLAR_CONFIG, show_arrows: false });
check("Solar: die Marker sind abwaehlbar, alles andere bleibt", () => {
  assert.equal(solarPfeile(solarOhnePfeile).length, 0);
  assert.equal(solarOhnePfeile.shadowRoot.querySelectorAll(".thermo").length, 2);
});
const solarLeerPfeile = await mountSolar({ type: "solar" });
check("Solar: die Marker stehen auch ohne Entity (sie erklaeren das Bild)", () =>
  assert.equal(solarPfeile(solarLeerPfeile).length, 2)
);

/* ---- UV: frei waehlbare Bildgroesse ---- */

check("UV: 100 Prozent ist der Zustand von vorher", () => {
  assert.equal(pkg.UV_DEFAULTS.uv_size, 100);
  assert.equal(pkg.groesseFaktor(100), 1);
  assert.equal(pkg.bildTransform(0, false, pkg.DEVICE_RATIOS.uv, 100), "");
  assert.equal(
    pkg.bildTransform(90, false, pkg.DEVICE_RATIOS.uv, 100),
    pkg.bildTransform(90, false, pkg.DEVICE_RATIOS.uv)
  );
});
check("UV: Groesse wird gekappt statt krumm uebernommen", () => {
  assert.equal(pkg.GROESSE_MIN, 30);
  assert.equal(pkg.GROESSE_MAX, 100);
  assert.equal(pkg.groesseFaktor(0), 0.3);
  assert.equal(pkg.groesseFaktor(500), 1);
  assert.equal(pkg.groesseFaktor("nicht"), 1);
});
check("UV: Groesse und Drehung multiplizieren sich", () => {
  for (const grad of [0, 45, 90, 180, 270]) {
    for (const groesse of [30, 55, 100]) {
      const soll =
        Math.round(pkg.passFaktor(grad, pkg.DEVICE_RATIOS.uv) * (groesse / 100) * 1000) / 1000;
      const stil = pkg.bildTransform(grad, false, pkg.DEVICE_RATIOS.uv, groesse);
      assert.ok(soll <= 1, "groesser als der Kasten");
      /* Faktor 1 heisst: gar nicht skalieren — dann steht auch nichts da. */
      if (soll === 1) assert.ok(!/scale\(/.test(stil), `${grad} Grad / ${groesse} %: ${stil}`);
      else assert.ok(stil.includes(`scale(${soll})`), `${grad} Grad / ${groesse} %: ${stil}`);
    }
  }
});

const uvKlein = await mountUv({ ...UV_CONFIG, uv_size: 50 });
check("UV: die Groesse wirkt auf das Bild, nicht auf den Kasten", () => {
  assert.ok(bildStil(uvKlein).includes("scale(0.5)"), bildStil(uvKlein));
  assert.equal(kastenStil(uvKlein), UV_KASTEN);
});
const uvKleinGedreht = await mountUv({ ...UV_CONFIG, uv_size: 50, rotate: 90 });
check("UV: klein UND gedreht bleibt im Kasten", () => {
  const f = Math.round(pkg.passFaktor(90, pkg.DEVICE_RATIOS.uv) * 0.5 * 1000) / 1000;
  const stil = bildStil(uvKleinGedreht);
  assert.match(stil, /rotate\(90deg\)/);
  assert.ok(stil.includes(`scale(${f})`), stil);
  assert.equal(kastenStil(uvKleinGedreht), UV_KASTEN);
});

check("UV: Powerbutton und Gluehen stehen auf Thomas' Werten", () => {
  assert.equal(pkg.UV_DEFAULTS.power_btn_top, 30);
  assert.equal(pkg.UV_DEFAULTS.power_btn_left, 11);
  assert.equal(pkg.UV_DEFAULTS.glow_top, 35);
  assert.equal(pkg.UV_DEFAULTS.rotate, 0);
  const stil = (sel) => uv.shadowRoot.querySelector(sel).getAttribute("style");
  assert.match(stil(".power-badge"), /top:30%/);
  assert.match(stil(".power-badge"), /left:11%/);
  assert.match(stil(".glow"), /top:35%/);
});

/* ---- Editor: Bild-Abschnitt der UV-Lampe ---- */

const ed7 = new Editor();
ed7.setConfig({
  hero: { enabled: false },
  slots: [
    { type: "uv", label: "Entkeimung", switch_entity: "switch.uv_lampe" },
    { type: "pump", label: "Filterpumpe" },
    { type: "solar" },
    { type: "frame" },
  ],
});
ed7.hass = makeHass();
document.body.appendChild(ed7);
await ed7.updateComplete;
let ed7Fired = null;
ed7.addEventListener("config-changed", (e) => (ed7Fired = e.detail.config));

check("Editor: UV hat den Groessen-Regler nach Drehen und Spiegeln", () => {
  const karte = ed7.shadowRoot.querySelectorAll(".slot-card:not(.becken-card)")[0];
  const regler = karte.querySelector('input[data-key="uv_size"]');
  assert.ok(regler, "Groessen-Regler fehlt");
  assert.equal(regler.value, "100");
  assert.equal(regler.getAttribute("min"), "30");
  assert.equal(regler.getAttribute("max"), "100");
  /* Reihenfolge im Abschnitt: Drehen, Spiegeln, Groesse, Anschlussvariante */
  const felder = Array.from(karte.querySelectorAll("[data-key]"))
    .map((el) => el.dataset.key)
    .filter((k) => ["rotate", "mirror", "uv_size", "anschluss"].includes(k));
  assert.deepEqual(felder, ["rotate", "mirror", "uv_size", "anschluss"]);
});
check("Editor: die Anschlussvarianten heissen 1 und 2, die Werte bleiben", () => {
  const sel = ed7.shadowRoot.querySelector('select[data-key="anschluss"]');
  assert.deepEqual(
    Array.from(sel.querySelectorAll("option")).map((o) => [o.value, o.textContent.trim()]),
    [
      ["seite", "Anschlussvariante 1"],
      ["oben", "Anschlussvariante 2"],
    ]
  );
});

const groessenRegler = ed7.shadowRoot.querySelector('input[data-key="uv_size"]');
groessenRegler.value = "60";
groessenRegler.dispatchEvent(new dom.window.Event("input"));
await ed7.updateComplete;
check("Editor: die Groesse landet in der Slot-Config", () =>
  assert.equal(ed7Fired.slots[0].uv_size, 60)
);

/* ---- Editor: Orientierung ueber Ueberschrift und Kennfarbe ---- */

check("Editor: jeder Slot-Block traegt Nummer, Typ und Beschriftung", () => {
  const kopf = Array.from(ed7.shadowRoot.querySelectorAll(".slot-block:not(.becken-block) .slot-ueberschrift")).map((el) =>
    el.textContent.trim()
  );
  assert.deepEqual(kopf, [
    "Kasten 1 · UV-C-Lampe · Entkeimung",
    "Kasten 2 · Poolpumpe · Filterpumpe",
    "Kasten 3 · Solarheizung",
    "Kasten 4 · Leerer Rahmen",
  ]);
});
check("Editor: jeder Slot-Typ hat seine Kennfarbe", () => {
  const farben = Array.from(ed7.shadowRoot.querySelectorAll(".slot-block:not(.becken-block)")).map((el) =>
    el.getAttribute("style")
  );
  assert.deepEqual(farben, [
    `--slot-farbe:${pkg.slotFarbe("uv")};`,
    `--slot-farbe:${pkg.slotFarbe("pump")};`,
    `--slot-farbe:${pkg.slotFarbe("solar")};`,
    `--slot-farbe:${pkg.slotFarbe("frame")};`,
  ]);
  /* jede Geraetefarbe ist eigen, die allgemeinen Slots bleiben grau */
  const geraete = ["heatpump", "pump", "uv", "solar"].map(pkg.slotFarbe);
  assert.equal(new Set(geraete).size, 4, "zwei Geraete teilen sich eine Farbe");
  assert.ok(!geraete.includes(pkg.SLOT_GRAU), "ein Geraet ist grau");
  for (const key of ["frame", "hidden"]) assert.equal(pkg.slotFarbe(key), pkg.SLOT_GRAU);
  assert.equal(pkg.slotFarbe("gibtsnicht"), pkg.SLOT_GRAU);
});
check("Editor: die Kennfarbe wird als Balken und Toenung benutzt", () => {
  const css = cssOf("tomtut-pool-dashboard-editor");
  assert.match(css, /\.slot-block[\s\S]*border-top:\s*2px solid var\(--slot-farbe/);
  assert.match(css, /border-left:\s*5px solid var\(--slot-farbe/);
  assert.match(css, /color-mix\(in srgb, var\(--slot-farbe/);
});

const beckenBlock = (ed) => ed.shadowRoot.querySelector(".slot-block.becken-block");
check("Editor: Becken-Block ist verpackt wie die Geraete (Iteration 10)", () => {
  const block = beckenBlock(editor);
  assert.ok(block, "Becken-Block fehlt");
  assert.equal(block.getAttribute("style"), `--slot-farbe:${pkg.slotFarbe("hero")};`);
  assert.equal(pkg.slotFarbe("hero"), pkg.BLOCK_FARBEN.hero);
  const belegt = Object.keys(pkg.SLOT_TYPES).map(pkg.slotFarbe);
  assert.ok(!belegt.includes(pkg.slotFarbe("hero")), "Beckenfarbe kollidiert mit Slot-Farbe");
  assert.equal(block.querySelector(".slot-ueberschrift").textContent.trim(), "Becken");
  const karte = block.querySelector(".slot-card.becken-card");
  assert.ok(karte, "Becken-Karte fehlt");
  assert.ok(karte.querySelector('input[data-key="enabled"]'), "Toggle nicht in der Becken-Karte");
  assert.ok(karte.querySelector('input[data-key="label_scale"]'), "heroFields nicht in der Becken-Karte");
  assert.equal(editor.shadowRoot.querySelector(".slot-block"), block, "Becken ist nicht der erste Block");
  assert.ok(!pkg.slotTypeOptions().some((o) => o.value === "hero"), "hero ist waehlbar");
});
check("Editor: Becken aus -> Kasten bleibt, nur mit Toggle", () => {
  const block = beckenBlock(ed7);
  assert.ok(block, "Becken-Block fehlt bei ausgeschaltetem Becken");
  const karte = block.querySelector(".slot-card.becken-card");
  assert.ok(karte.querySelector('input[data-key="enabled"]'));
  assert.equal(karte.querySelectorAll("input, select").length, 1, "mehr als der Toggle sichtbar");
});

/* ---- Stapel-Ordnung: nichts schlaegt in die HA-Oberflaeche durch ---- */

check("Stapel: jede Card und jeder Slot bildet einen eigenen Stacking-Context", () => {
  for (const tag of ALLE_BAUSTEINE) {
    if (tag === "tomtut-pool-dashboard-editor") continue;
    const css = cssOf(tag);
    const i = css.indexOf(":host {");
    assert.ok(i >= 0, `${tag} hat keine :host-Regel`);
    const block = css.slice(i, css.indexOf("}", i));
    assert.match(block, /isolation:\s*isolate/, `${tag}: :host ohne isolation`);
    assert.match(block, /position:\s*relative/, `${tag}: :host ohne position:relative`);
    assert.match(block, /z-index:\s*0/, `${tag}: :host ohne z-index 0`);
  }
});
check("Stapel: die ha-card der Dashboard-Card sperrt ebenfalls ein", () => {
  const css = cssOf("tomtut-pool-dashboard");
  const i = css.indexOf("ha-card {");
  const block = css.slice(i, css.indexOf("}", i));
  assert.match(block, /isolation:\s*isolate/);
  assert.match(block, /position:\s*relative/);
});
check("Stapel: kein Baustein vergibt einen z-index ueber 10", () => {
  for (const tag of ALLE_BAUSTEINE) {
    for (const z of alleZIndex(cssOf(tag))) {
      assert.ok(z <= 10, `${tag} vergibt z-index ${z}`);
    }
  }
});
check("Stapel: die Leiter der Overlays stimmt (Glimmen unten, Dialog oben)", () => {
  const hero = cssOf("tomtut-pool-hero");
  const uv = cssOf("tomtut-pool-slot-uv");
  const solar = cssOf("tomtut-pool-slot-solar");
  assert.equal(zIndexVon(uv, ".glow"), 1);
  assert.equal(zIndexVon(solar, "img.flow-arrow"), 2);
  assert.equal(zIndexVon(hero, "img.hero-sprite"), 2);
  assert.equal(zIndexVon(hero, ".value-box"), 3);
  assert.equal(zIndexVon(hero, ".chem-box"), 4);
  assert.equal(zIndexVon(hero, ".power-badge"), 5);
  assert.equal(zIndexVon(hero, ".confirm-overlay"), 10);
});

/* ================================================================== */
/* Iteration 9 — Thomas' Feedback von der Dev-HA                       */
/* ================================================================== */

const mountSlotTyp = async (config, hass = makeHass()) => {
  const card = await mount(Dashboard, { hero: { enabled: false }, slots: [config] }, hass);
  const slot = card.shadowRoot.querySelector(`tomtut-pool-slot-${config.type}`);
  await slot.updateComplete;
  return slot;
};
const wattZustand = (w) => ({
  state: String(w),
  attributes: { unit_of_measurement: "W" },
  last_changed: iso(20),
});
const aktiveTaste = (slot) =>
  [...slot.shadowRoot.querySelectorAll(".stage-btn")].findIndex((b) =>
    b.classList.contains("active")
  );

/* ---- 1. Poolpumpe: Stufe aus der Leistung ---- */

check("Watt->Stufe: Default-Schwellen 20/150/500, Erkennung ab Werk an", () => {
  assert.equal(pkg.PUMP_DEFAULTS.stage_from_power, true);
  assert.equal(pkg.PUMP_DEFAULTS.stage_watt_1, 20);
  assert.equal(pkg.PUMP_DEFAULTS.stage_watt_2, 150);
  assert.equal(pkg.PUMP_DEFAULTS.stage_watt_3, 500);
});
check("Watt->Stufe: Schwellen sind strikt groesser, darunter aus", () => {
  const s = [20, 300, 500];
  assert.equal(pkg.stageFromWatt(0, s), null);
  assert.equal(pkg.stageFromWatt(20, s), null);
  assert.equal(pkg.stageFromWatt(20.1, s), 0);
  assert.equal(pkg.stageFromWatt(47, s), 0);
  assert.equal(pkg.stageFromWatt(300, s), 0);
  assert.equal(pkg.stageFromWatt(301, s), 1);
  assert.equal(pkg.stageFromWatt(735, s), 2);
  assert.equal(pkg.stageFromWatt(null, s), null);
  assert.equal(pkg.stageFromWatt("x", s), null);
});
check("Watt->Stufe: Thomas' Pumpe (47/271/735 W) mit den Defaults", () => {
  const s = [1, 2, 3].map((i) => pkg.PUMP_DEFAULTS[`stage_watt_${i}`]);
  assert.deepEqual([47, 271, 735].map((w) => pkg.stageFromWatt(w, s)), [0, 1, 2]);
});
check("Watt->Stufe: weniger Stufen als erkannt -> hoechste vorhandene", () => {
  assert.equal(pkg.stageFromWatt(735, [20, 300, 500], 2), 1);
  assert.equal(pkg.stageFromWatt(735, [20, 300, 500], 1), 0);
});

const PUMP_WATT = { ...PUMP_CONFIG, stage_from_power: undefined };
delete PUMP_WATT.stage_from_power;

/* Schalter sagen N2 (juengstes last_changed), die Leistung sagt N1 */
const pumpN1 = await mountPump(
  PUMP_WATT,
  makeHass({ "sensor.poolpumpe_power": wattZustand(47) })
);
check("Pumpe: 47 W -> N1 leuchtet, obwohl zuletzt N2 gedrueckt wurde", () =>
  assert.equal(aktiveTaste(pumpN1), 0)
);
check("Pumpe: erkannte Stufe steuert das Laufrad-Tempo (N1 -> Tempo 3)", () => {
  const f = pumpN1.shadowRoot.querySelector(".fan-overlay");
  assert.ok(f.classList.contains("spinning"));
  assert.match(f.getAttribute("style"), new RegExp(`--fan-dur:${pkg.fanDuration(3)}s`));
});
check("Pumpe: bei abweichender Stufe kein falsches 'seit …'", () =>
  assert.ok(!/seit/.test(pumpN1.shadowRoot.querySelectorAll(".stage-btn")[0].textContent))
);
const pumpN3 = await mountPump(PUMP_WATT, makeHass({ "sensor.poolpumpe_power": wattZustand(735) }));
check("Pumpe: 735 W -> N3 leuchtet, Tempo 8", () => {
  assert.equal(aktiveTaste(pumpN3), 2);
  assert.match(
    pumpN3.shadowRoot.querySelector(".fan-overlay").getAttribute("style"),
    new RegExp(`--fan-dur:${pkg.fanDuration(8)}s`)
  );
});
const pumpAusW = await mountPump(PUMP_WATT, makeHass({ "sensor.poolpumpe_power": wattZustand(4) }));
check("Pumpe: 4 W -> aus: STOP leuchtet, Laufrad steht", () => {
  assert.equal(aktiveTaste(pumpAusW), 3);
  assert.ok(pumpAusW.shadowRoot.querySelector(".fan-overlay.idle"));
});
const pumpEigen = await mountPump(
  { ...PUMP_WATT, stage_watt_2: 280 },
  makeHass({ "sensor.poolpumpe_power": wattZustand(271) })
);
check("Pumpe: eigene Schwelle aus der Config (N2 > 280 W, 271 W -> N1)", () =>
  assert.equal(aktiveTaste(pumpEigen), 0)
);
const pumpAbgewaehlt = await mountPump(
  { ...PUMP_WATT, stage_from_power: false },
  makeHass({ "sensor.poolpumpe_power": wattZustand(47) })
);
check("Pumpe: Erkennung abgewaehlt -> es zaehlen wieder die Schalter (N2)", () =>
  assert.equal(aktiveTaste(pumpAbgewaehlt), 1)
);
const pumpOhneWatt = await mountPump({ ...PUMP_WATT, power_entity: undefined });
check("Pumpe: ohne Leistungssensor aendert sich nichts (N2)", () =>
  assert.equal(aktiveTaste(pumpOhneWatt), 1)
);
calls.length = 0;
pumpN1.shadowRoot.querySelectorAll(".stage-btn")[2].click();
await pumpN1.updateComplete;
check("Pumpe: N-Taster bleiben bei Erkennung tippbar", () => {
  assert.deepEqual(calls, [
    { domain: "switch", service: "turn_on", data: { entity_id: "switch.shelly_pumpe_n3" } },
  ]);
  assert.equal(aktiveTaste(pumpN1), 2, "Klick wird nicht optimistisch angezeigt");
});

/* ---- 2b. Waermepumpe: Schalter aus -> Rad steht ---- */

const hpAus = await mountSlotTyp(
  HP_CONFIG,
  makeHass({ "switch.waermepumpe": { state: "off", attributes: {}, last_changed: iso(60) } })
);
check("Waermepumpe: Schalter aus -> Rad steht trotz 820 W", () => {
  const f = hpAus.shadowRoot.querySelector(".fan-overlay");
  assert.ok(!f.classList.contains("spinning"));
  assert.ok(f.classList.contains("idle"));
});
const hpAusEntity = await mountSlotTyp(
  { ...HP_CONFIG, fan_entity: "switch.poolbeleuchtung", fan_source: "entity" },
  makeHass({
    "switch.waermepumpe": { state: "off", attributes: {}, last_changed: iso(60) },
    "switch.poolbeleuchtung": { state: "on", attributes: {}, last_changed: iso(60) },
  })
);
check("Waermepumpe: Schalter aus schlaegt auch die Luefter-Entity", () =>
  assert.ok(!hpAusEntity.shadowRoot.querySelector(".fan-overlay.spinning"))
);

/* ---- 2c. Blatt-Designs ---- */

check("Luefter: mindestens sechs Designs, klassisch ist Default, Batman ist dabei", () => {
  const keys = Object.keys(pkg.FAN_DESIGNS);
  assert.ok(keys.length >= 6, keys.join(","));
  for (const k of ["klassisch", "drei", "fuenf", "sichel", "propeller", "batman"]) {
    assert.ok(keys.includes(k), `${k} fehlt`);
  }
  assert.equal(pkg.FAN_DESIGN_DEFAULT, "klassisch");
  assert.equal(pkg.HEATPUMP_DEFAULTS.fan_design, "klassisch");
});
check("Luefter: jedes Design ist leichtes SVG ohne inneres <g>", () => {
  for (const [k, d] of Object.entries(pkg.FAN_DESIGNS)) {
    assert.ok(d.svg.length < 2500, `${k} ist ${d.svg.length} Zeichen`);
    assert.ok(!/<g[\s>]/.test(d.svg), `${k} hat ein <g> (wuerde die Drehung erben)`);
    assert.ok(/<(path|circle|ellipse)/.test(d.svg), `${k} zeichnet nichts`);
    assert.ok(d.label && !/ae|oe|ue/.test(d.label.replace(/Blue|Turbine/g, "")), `${k}: Label`);
  }
});
const hpBat = await mountSlotTyp({ ...HP_CONFIG, fan_design: "batman" });
check("Luefter: Design 'batman' wird gezeichnet", () => {
  const f = hpBat.shadowRoot.querySelector(".fan-overlay");
  assert.ok(f.classList.contains("design-batman"));
  assert.equal(f.querySelectorAll("svg g path").length, 1);
});
const hpDrei = await mountSlotTyp({ ...HP_CONFIG, fan_design: "drei" });
check("Luefter: Design 'drei' hat drei Blaetter", () =>
  assert.equal(hpDrei.shadowRoot.querySelectorAll(".fan-overlay svg g path").length, 3)
);
const hpUnbekannt = await mountSlotTyp({ ...HP_CONFIG, fan_design: "gibtsnicht" });
check("Luefter: unbekanntes Design faellt auf klassisch zurueck", () =>
  assert.ok(hpUnbekannt.shadowRoot.querySelector(".fan-overlay.design-klassisch"))
);
check("Luefter: ohne Angabe klassisch — Pumpen-Laufrad bleibt unveraendert", () => {
  assert.ok(hp.shadowRoot.querySelector(".fan-overlay.design-klassisch"));
  assert.ok(pump.shadowRoot.querySelector(".fan-overlay.design-klassisch"));
});

/* ---- 2d/e. Betriebsmodus -> Tempo und Farbe ---- */

check("Modus: acht Modi, je vier fuer Heizen und Kuehlen", () => {
  assert.equal(pkg.HP_MODES.length, 8);
  assert.equal(pkg.HP_MODES.filter((m) => m.art === "heizen").length, 4);
  assert.equal(pkg.HP_MODES.filter((m) => m.art === "kuehlen").length, 4);
  assert.deepEqual(
    pkg.HP_MODES.map((m) => m.label),
    [
      "Heizen Silent", "Heizen Smart", "Heizen Auto", "Heizen Boost",
      "Kühlen Silent", "Kühlen Smart", "Kühlen Auto", "Kühlen Boost",
    ]
  );
});
check("Modus: Zuordnung ist tolerant (Gross/klein, _ und Leerzeichen)", () => {
  assert.equal(pkg.modeFromState("Kühlen Boost").key, "kuehl_boost");
  assert.equal(pkg.modeFromState("heat_silent").key, "heiz_silent");
  assert.equal(pkg.modeFromState("HEAT-SMART").key, "heiz_smart");
  assert.equal(pkg.modeFromState("irgendwas"), null);
  assert.equal(pkg.modeFromState(""), null);
});
check("Modus: eigene Zuordnung ersetzt die Vorgabe", () => {
  const c = { mode_map_heiz_smart: "ECO, sparen" };
  assert.equal(pkg.modeFromState("eco", c).key, "heiz_smart");
  assert.equal(pkg.modeFromState("Heizen Smart", c), null, "Vorgabe gilt nicht mehr");
});

const HP_MODUS = {
  ...HP_CONFIG,
  show_mode: true,
  mode_entity: "input_select.wp_modus",
};
const modusHass = (zustand, extra = {}) =>
  makeHass({
    "input_select.wp_modus": { state: zustand, attributes: {}, last_changed: iso(60) },
    ...extra,
  });
const durVon = (slot) =>
  slot.shadowRoot.querySelector(".fan-overlay").getAttribute("style").match(/--fan-dur:([\d.]+)s/)[1];

const hpBoost = await mountSlotTyp(HP_MODUS, modusHass("Kühlen Boost"));
const hpSilent = await mountSlotTyp(HP_MODUS, modusHass("Heizen Silent"));
check("Modus -> Tempo: Boost 9, Silent 3 (Defaults)", () => {
  assert.equal(Number(durVon(hpBoost)), pkg.fanDuration(9));
  assert.equal(Number(durVon(hpSilent)), pkg.fanDuration(3));
});
const hpEigenTempo = await mountSlotTyp(
  { ...HP_MODUS, mode_speed_heiz_silent: 7 },
  modusHass("Heizen Silent")
);
check("Modus -> Tempo: pro Modus einstellbar", () =>
  assert.equal(Number(durVon(hpEigenTempo)), pkg.fanDuration(7))
);
const hpUnbekannterModus = await mountSlotTyp(HP_MODUS, modusHass("Abtauen"));
check("Modus -> Tempo: unbekannter Zustand = alte Drehgeschwindigkeit", () =>
  assert.equal(durVon(hpUnbekannterModus), durVon(hp))
);
const hpModusAus = await mountSlotTyp({ ...HP_MODUS, show_mode: false }, modusHass("Kühlen Boost"));
check("Modus -> Tempo: abgewaehlt = alte Drehgeschwindigkeit", () =>
  assert.equal(durVon(hpModusAus), durVon(hp))
);
const hpPreset = await mountSlotTyp(
  { ...HP_CONFIG, show_mode: true, mode_entity: "climate.waermepumpe", mode_attribute: "preset_mode" },
  makeHass({
    "climate.waermepumpe": {
      state: "heat",
      attributes: { temperature: 28, current_temperature: 26.4, preset_mode: "boost_heat" },
      last_changed: iso(60),
    },
  })
);
check("Modus: climate-Attribut (preset_mode) als Quelle", () =>
  assert.equal(Number(durVon(hpPreset)), pkg.fanDuration(9))
);

const farbeVon = (slot) =>
  (slot.shadowRoot.querySelector(".fan-overlay").getAttribute("style").match(/--tt-fan-color:([^;]+);/) ||
    [])[1] || null;
check("Farbe: Default schwarz/weiss — keine Modusfarbe", () => {
  assert.equal(pkg.HEATPUMP_DEFAULTS.fan_color_mode, "neutral");
  assert.equal(farbeVon(hpBoost), null);
});
const hpBlau = await mountSlotTyp({ ...HP_MODUS, fan_color_mode: "modus" }, modusHass("Kühlen Smart"));
const hpRot = await mountSlotTyp({ ...HP_MODUS, fan_color_mode: "modus" }, modusHass("Heizen Auto"));
const hpOhneModus = await mountSlotTyp({ ...HP_MODUS, fan_color_mode: "modus" }, modusHass("Abtauen"));
check("Farbe nach Modus: Kuehlen blau, Heizen rot, unbekannt neutral", () => {
  assert.equal(farbeVon(hpBlau), pkg.MODE_FARBEN.kuehlen);
  assert.equal(farbeVon(hpRot), pkg.MODE_FARBEN.heizen);
  assert.equal(farbeVon(hpOhneModus), null);
});
const hpModusSchalterAus = await mountSlotTyp(
  { ...HP_MODUS, fan_color_mode: "modus" },
  modusHass("Kühlen Boost", {
    "switch.waermepumpe": { state: "off", attributes: {}, last_changed: iso(60) },
  })
);
check("Modus: Schalter aus -> Rad steht auch bei Boost", () =>
  assert.ok(!hpModusSchalterAus.shadowRoot.querySelector(".fan-overlay.spinning"))
);

/* ---- 3. UV: Wabern ---- */

check("UV: Wabern ab Werk an (40), per Regler bis 0 abschaltbar", () => {
  assert.equal(pkg.UV_DEFAULTS.glow_pulse, 40);
  const g = uv.shadowRoot.querySelector(".glow");
  assert.ok(g.classList.contains("wabert"));
  assert.match(g.getAttribute("style"), /--glow-pulse:0\.4/);
});
const uvRuhig = await mountUv({ ...UV_CONFIG, glow_pulse: 0 });
check("UV: Wabern 0 -> ruhig, statisch wie frueher", () => {
  const g = uvRuhig.shadowRoot.querySelector(".glow");
  assert.ok(g.classList.contains("ruhig"));
  assert.ok(!g.classList.contains("wabert"));
});
const uvMax = await mountUv({ ...UV_CONFIG, glow_pulse: 999, glow_intensity: 100 });
check("UV: Wabern wird auf 0..300 geklemmt, Leuchtstaerke bleibt am Kern", () => {
  const stil = uvMax.shadowRoot.querySelector(".glow").getAttribute("style");
  assert.match(stil, /--glow-pulse:1;/);
  assert.match(stil, /--glow-boost:1(;|$)/);
  assert.match(stil, /opacity:1(;|$)/);
});
/* Iteration 14: Bereich 0..300 — alte Werte muessen exakt gleich bleiben */
check("UV-Wabern: alte Werte 0..100 rechnen exakt wie vorher, ohne Boost", () => {
  assert.equal(pkg.GLOW_PULSE_MAX, 300);
  for (const alt of [0, 1, 25, 40, 60, 99, 100]) {
    assert.deepEqual(pkg.glowPulsWerte(alt), { puls: alt / 100, boost: 0 }, `Wert ${alt}`);
  }
  assert.deepEqual(pkg.glowPulsWerte(200), { puls: 1, boost: 0.5 });
  assert.deepEqual(pkg.glowPulsWerte(300), { puls: 1, boost: 1 });
  assert.deepEqual(pkg.glowPulsWerte(-5), { puls: 0, boost: 0 });
  assert.deepEqual(pkg.glowPulsWerte("x"), { puls: 0, boost: 0 });
});
check("UV-Wabern: alter Stil bleibt Zeichen fuer Zeichen (kein --glow-boost bis 100)", () => {
  const stil = uv.shadowRoot.querySelector(".glow").getAttribute("style");
  assert.ok(!/--glow-boost/.test(stil));
  assert.match(stil, /--glow-pulse:0\.4;$/);
});
check("UV-Wabern: jede Boost-Formel faellt bei 0 auf den alten Wert", () => {
  const css = cssOf("tomtut-pool-slot-uv");
  /* alle Vorkommen von --glow-boost haben den Fallback 0 */
  const ohneFallback = css.match(/var\(--glow-boost\)/g);
  assert.equal(ohneFallback, null);
  assert.match(css, /inset:\s*calc\(-18% - var\(--glow-boost, 0\) \* 22%\)/);
  assert.match(css, /animation-duration:\s*calc\(3\.7s \/ \(1 \+ var\(--glow-boost, 0\) \* 1\.5\)\)/);
});
check("UV: Wabern ist sanft — ungleiche Perioden, kein Blinken, reduced-motion", () => {
  const css = cssOf("tomtut-pool-slot-uv");
  assert.match(css, /\.glow\.wabert::before[^}]*animation:\s*uvGlimmen\s+5\.3s ease-in-out/);
  assert.match(css, /\.glow\.wabert::after[^}]*animation:\s*uvWabern\s+3\.7s ease-in-out/);
  assert.ok(!/steps\(/.test(css), "Stufen-Animation = Blinken");
  assert.match(css, /prefers-reduced-motion:\s*reduce[\s\S]*animation:\s*none/);
});

/* ---- 5. Vor dem Ausschalten nachfragen ---- */

const GERAETE_MIT_SCHALTER = [
  { type: "heatpump", schalter: "switch_entity", entity: "switch.waermepumpe" },
  { type: "pump", schalter: "main_entity", entity: "input_boolean.poolpumpe_schalter" },
  { type: "uv", schalter: "switch_entity", entity: "switch.uv_lampe" },
  { type: "solar", schalter: "switch_entity", entity: "switch.solarventil" },
];
const geraeteHass = () =>
  makeHass({ "switch.solarventil": { state: "on", attributes: {}, last_changed: iso(60) } });
for (const g of GERAETE_MIT_SCHALTER) {
  const mit = await mountSlotTyp({ type: g.type, [g.schalter]: g.entity }, geraeteHass());
  calls.length = 0;
  mit.shadowRoot.querySelector(".power-badge").click();
  await mit.updateComplete;
  check(`Nachfragen ${g.type}: ab Werk an -> Dialog, kein Schaltbefehl`, () => {
    assert.equal(calls.length, 0);
    assert.ok(mit.shadowRoot.querySelector(".confirm-overlay"));
  });
  const ohne = await mountSlotTyp(
    { type: g.type, [g.schalter]: g.entity, confirm_off: false },
    geraeteHass()
  );
  calls.length = 0;
  ohne.shadowRoot.querySelector(".power-badge").click();
  await ohne.updateComplete;
  check(`Nachfragen ${g.type}: abgewaehlt -> schaltet direkt aus`, () => {
    assert.equal(ohne.shadowRoot.querySelector(".confirm-overlay"), null);
    assert.deepEqual(calls, [
      { domain: g.entity.split(".")[0], service: "turn_off", data: { entity_id: g.entity } },
    ]);
  });
}

const CUSTOM_BTN = (extra = {}) => ({
  type: "custom",
  title: "Licht",
  entries: [{ kind: "button", entity: "switch.poolbeleuchtung", label: "Licht", ...extra }],
});
const lichtAn = () =>
  makeHass({ "switch.poolbeleuchtung": { state: "on", attributes: {}, last_changed: iso(60) } });
const customDirekt = await mountSlotTyp(CUSTOM_BTN(), lichtAn());
calls.length = 0;
customDirekt.shadowRoot.querySelector(".btn-entry").click();
await customDirekt.updateComplete;
check("Nachfragen Freifeld-Button: ab Werk aus -> toggle wie bisher", () => {
  assert.equal(customDirekt.shadowRoot.querySelector(".confirm-overlay"), null);
  assert.deepEqual(calls, [
    { domain: "switch", service: "toggle", data: { entity_id: "switch.poolbeleuchtung" } },
  ]);
});
const customFrag = await mountSlotTyp(CUSTOM_BTN({ confirm_off: true }), lichtAn());
calls.length = 0;
customFrag.shadowRoot.querySelector(".btn-entry").click();
await customFrag.updateComplete;
check("Nachfragen Freifeld-Button: an -> Dialog vor dem Ausschalten", () => {
  assert.equal(calls.length, 0);
  const d = customFrag.shadowRoot.querySelector(".confirm-overlay");
  assert.ok(d);
  assert.match(d.textContent, /„Licht" wird ausgeschaltet/);
});
customFrag.shadowRoot.querySelector(".btn.danger").click();
await customFrag.updateComplete;
check("Nachfragen Freifeld-Button: Bestaetigen schaltet aus", () =>
  assert.deepEqual(calls, [
    { domain: "switch", service: "turn_off", data: { entity_id: "switch.poolbeleuchtung" } },
  ])
);
const customAusFrag = await mountSlotTyp(CUSTOM_BTN({ confirm_off: true }));
calls.length = 0;
customAusFrag.shadowRoot.querySelector(".btn-entry").click();
await customAusFrag.updateComplete;
check("Nachfragen Freifeld-Button: Einschalten fragt nie", () =>
  assert.deepEqual(calls, [
    { domain: "switch", service: "toggle", data: { entity_id: "switch.poolbeleuchtung" } },
  ])
);

/* ---- Editor: die neuen Felder ---- */

const ed9 = new Editor();
ed9.setConfig({
  hero: { enabled: false },
  slots: [
    { type: "heatpump", switch_entity: "switch.waermepumpe", show_mode: true },
    { type: "pump", main_entity: "input_boolean.poolpumpe_schalter", power_entity: "sensor.poolpumpe_power" },
    { type: "uv", switch_entity: "switch.uv_lampe", confirm_off: false },
    { type: "solar", switch_entity: "switch.solarventil" },
    CUSTOM_BTN(),
    { type: "pump" },
  ],
});
ed9.hass = makeHass();
document.body.appendChild(ed9);
await ed9.updateComplete;
const slotKarten9 = () => [...ed9.shadowRoot.querySelectorAll(".slot-card:not(.becken-card)")];
const feld9 = (i, key) => slotKarten9()[i].querySelector(`[data-key="${key}"]`);

check("Editor: 'Vor dem Ausschalten nachfragen' in jedem Geraet, Default an", () => {
  for (const i of [0, 1, 3]) {
    const t = feld9(i, "confirm_off");
    assert.ok(t, `Kasten ${i + 1} ohne Schalter`);
    assert.equal(t.checked, true);
  }
  assert.equal(feld9(2, "confirm_off").checked, false, "UV: Config false nicht uebernommen");
  assert.match(ed9.shadowRoot.textContent, /Vor dem Ausschalten nachfragen/);
});
check("Editor: Freifeld-Button hat die Rueckfrage, ab Werk aus", () => {
  const t = feld9(4, "confirm_off");
  assert.ok(t);
  assert.equal(t.checked, false);
});
check("Editor: Poolpumpe mit Leistung -> 'Stufe aus Leistung erkennen' + 3 Schwellen", () => {
  assert.equal(feld9(1, "stage_from_power").checked, true);
  assert.equal(feld9(1, "stage_watt_1").value, "20");
  assert.equal(feld9(1, "stage_watt_2").value, "150");
  assert.equal(feld9(1, "stage_watt_3").value, "500");
});
check("Editor: Poolpumpe ohne Leistungssensor -> keine Schwellen", () =>
  assert.equal(feld9(5, "stage_watt_1"), null)
);
check("Editor: Waermepumpe — Blatt-Design, Farbe, Modus-Entity, 8 Tempi, 8 Zuordnungen", () => {
  const design = feld9(0, "fan_design");
  assert.ok(design);
  assert.ok([...design.options].some((o) => o.value === "batman"));
  assert.equal(design.value, "klassisch");
  assert.equal(feld9(0, "fan_color_mode").value, "neutral");
  assert.ok(feld9(0, "mode_entity"));
  for (const m of pkg.HP_MODES) {
    assert.ok(feld9(0, `mode_speed_${m.key}`), `Tempo ${m.key} fehlt`);
    assert.ok(feld9(0, `mode_map_${m.key}`), `Zuordnung ${m.key} fehlt`);
  }
});
check("Editor: UV — Regler 'Wabern / Glimmen' 0..300 (seit Iteration 14)", () => {
  const r = feld9(2, "glow_pulse");
  assert.ok(r);
  assert.equal(r.getAttribute("min"), "0");
  assert.equal(r.getAttribute("max"), "300");
  assert.equal(r.value, "40");
});
let ed9Fired = null;
ed9.addEventListener("config-changed", (e) => (ed9Fired = e.detail.config));
const modusBox = feld9(0, "show_mode");
modusBox.checked = false;
modusBox.dispatchEvent(new dom.window.Event("change"));
await ed9.updateComplete;
check("Editor: Betriebsmodus abwaehlen raeumt die Modus-Felder", () => {
  assert.equal(ed9Fired.slots[0].show_mode, false);
  assert.equal(feld9(0, "mode_entity"), null);
  assert.equal(feld9(0, "mode_speed_heiz_boost"), null);
});

/* ------------------------------------------------------------------ */
/* Iteration 12: Freigabekontakt der Waermepumpe                       */
/* ------------------------------------------------------------------ */

/*
 * Der Freigabekontakt ist der potentialfreie Eingang der Waermepumpe:
 * offen = sie darf NICHT laufen (egal, was am Bedienteil steht),
 * geschlossen = freigegeben. Die Karte zeigt den Zustand und stellt bei
 * "gesperrt" das Rad still — auch bei eingeschaltetem Schalter und
 * anliegenden Watt. Ohne release_entity aendert sich gar nichts.
 */

const FREI_ENT = "input_boolean.wp_freigabe";
const freigabeHass = (an, extra = {}) =>
  makeHass({
    [FREI_ENT]: { state: an ? "on" : "off", attributes: {}, last_changed: iso(30) },
    ...extra,
  });
const HP_FREI = { ...HP_CONFIG, release_entity: FREI_ENT };

const hpFrei = await mountSlotTyp(HP_FREI, freigabeHass(true));
const hpGesperrt = await mountSlotTyp(HP_FREI, freigabeHass(false));

check("Freigabe: Lage und Groesse haben Vorgaben", () => {
  assert.equal(pkg.HEATPUMP_DEFAULTS.release_top, 84);
  assert.equal(pkg.HEATPUMP_DEFAULTS.release_left, 24);
  assert.equal(pkg.HEATPUMP_DEFAULTS.release_scale, 100);
});
check("Freigabe: Kontakt geschlossen -> 'Frei', das Rad dreht weiter", () => {
  const b = hpFrei.shadowRoot.querySelector(".release-badge");
  assert.ok(b, "kein Freigabe-Element");
  assert.ok(b.classList.contains("frei"), b.className);
  assert.match(b.textContent.replace(/\s+/g, " "), /Frei/);
  assert.ok(hpFrei.shadowRoot.querySelector(".fan-overlay.spinning"), "Rad steht trotz Freigabe");
});
check("Freigabe: Kontakt offen -> 'Gesperrt', Rad steht trotz Schalter an und 820 W", () => {
  const b = hpGesperrt.shadowRoot.querySelector(".release-badge");
  assert.ok(b.classList.contains("gesperrt"), b.className);
  assert.match(b.textContent.replace(/\s+/g, " "), /Gesperrt/);
  const f = hpGesperrt.shadowRoot.querySelector(".fan-overlay");
  assert.ok(!f.classList.contains("spinning"), "Rad dreht trotz Sperre");
  assert.ok(f.classList.contains("idle"));
});

const hpGesperrtEntity = await mountSlotTyp(
  { ...HP_FREI, fan_entity: "switch.poolbeleuchtung", fan_source: "entity" },
  freigabeHass(false, {
    "switch.poolbeleuchtung": { state: "on", attributes: {}, last_changed: iso(60) },
  })
);
check("Freigabe: gesperrt schlaegt auch eine laufende Luefter-Entity", () =>
  assert.ok(!hpGesperrtEntity.shadowRoot.querySelector(".fan-overlay.spinning"))
);

check("Freigabe: ohne release_entity bleibt alles wie bisher", () => {
  assert.equal(hp.shadowRoot.querySelector(".release-badge"), null);
  assert.ok(hp.shadowRoot.querySelector(".fan-overlay.spinning"));
});

calls.length = 0;
hpGesperrt.shadowRoot.querySelector(".release-badge").click();
await hpGesperrt.updateComplete;
check("Freigabe: Klick schaltet die Entity um (toggle)", () =>
  assert.deepEqual(calls, [
    { domain: "input_boolean", service: "toggle", data: { entity_id: FREI_ENT } },
  ])
);

const hpSensor = await mountSlotTyp(
  { ...HP_CONFIG, release_entity: "binary_sensor.wp_freigabe" },
  makeHass({
    "binary_sensor.wp_freigabe": { state: "off", attributes: {}, last_changed: iso(30) },
  })
);
calls.length = 0;
hpSensor.shadowRoot.querySelector(".release-badge").click();
await hpSensor.updateComplete;
check("Freigabe: binary_sensor ist nur Anzeige — Klick schaltet nichts", () => {
  assert.deepEqual(calls, []);
  const b = hpSensor.shadowRoot.querySelector(".release-badge");
  assert.ok(b.classList.contains("nur-anzeige"), b.className);
  assert.ok(b.classList.contains("gesperrt"));
  assert.ok(!hpSensor.shadowRoot.querySelector(".fan-overlay.spinning"));
});

const hpUnbekannt2 = await mountSlotTyp(
  HP_FREI,
  freigabeHass(true, {
    [FREI_ENT]: { state: "unavailable", attributes: {}, last_changed: iso(30) },
  })
);
check("Freigabe: unbekannter Zustand sperrt nicht", () => {
  assert.ok(hpUnbekannt2.shadowRoot.querySelector(".release-badge.unbekannt"));
  assert.ok(hpUnbekannt2.shadowRoot.querySelector(".fan-overlay.spinning"));
});

const hpFreigabeAus = await mountSlotTyp({ ...HP_FREI, show_release: false }, freigabeHass(false));
check("Freigabe: abgewaehlt -> kein Element und keine Wirkung aufs Rad", () => {
  assert.equal(hpFreigabeAus.shadowRoot.querySelector(".release-badge"), null);
  assert.ok(hpFreigabeAus.shadowRoot.querySelector(".fan-overlay.spinning"));
});

const hpFreiPos = await mountSlotTyp(
  { ...HP_FREI, release_top: 40, release_left: 70, release_scale: 150 },
  freigabeHass(true)
);
check("Freigabe: Lage und Groesse sind einstellbar", () => {
  const stil = hpFreiPos.shadowRoot.querySelector(".release-badge").getAttribute("style");
  assert.match(stil, /top:40%/);
  assert.match(stil, /left:70%/);
  assert.match(stil, /scale\(1\.5\)/);
});

const hpNurFreigabe = await mountSlotTyp({ type: "heatpump", release_entity: FREI_ENT }, freigabeHass(true));
check("Freigabe: allein reicht als Konfiguration (kein 'bitte Entity waehlen')", () =>
  assert.ok(!/mindestens eine Entity/.test(hpNurFreigabe.shadowRoot.textContent))
);

/* ---- Editor ---- */

const ed12 = new Editor();
ed12.setConfig({
  hero: { enabled: false },
  slots: [
    {
      type: "heatpump",
      switch_entity: "switch.waermepumpe",
      show_release: true,
      release_entity: FREI_ENT,
    },
    { type: "heatpump", switch_entity: "switch.waermepumpe" },
  ],
});
ed12.hass = freigabeHass(true);
document.body.appendChild(ed12);
await ed12.updateComplete;
const karten12 = () => [...ed12.shadowRoot.querySelectorAll(".slot-card:not(.becken-card)")];
const feld12 = (i, key) => karten12()[i].querySelector(`[data-key="${key}"]`);

check("Editor: Freigabekontakt ist ein eigenes Element mit Entity und drei Reglern", () => {
  assert.equal(feld12(0, "show_release").checked, true);
  assert.ok(feld12(0, "release_entity"), "Entity-Feld fehlt");
  for (const k of ["release_top", "release_left", "release_scale"]) {
    assert.ok(feld12(0, k), `${k} fehlt`);
  }
  assert.match(ed12.shadowRoot.textContent, /Freigabekontakt/);
});
check("Editor: Freigabekontakt ab Werk aus — ohne Haken keine Felder", () => {
  assert.equal(feld12(1, "show_release").checked, false);
  assert.equal(feld12(1, "release_entity"), null);
});
let ed12Fired = null;
ed12.addEventListener("config-changed", (e) => (ed12Fired = e.detail.config));
const box12 = feld12(0, "show_release");
box12.checked = false;
box12.dispatchEvent(new dom.window.Event("change"));
await ed12.updateComplete;
check("Editor: Freigabe abwaehlen raeumt release_entity aus der Config", () => {
  assert.equal(ed12Fired.slots[0].show_release, false);
  assert.equal(ed12Fired.slots[0].release_entity, undefined);
  assert.equal(feld12(0, "release_entity"), null);
});

/* ---- 2a. Umlaute in allem, was man sieht ---- */

/*
 * Alles Sichtbare sammeln (Text, Titel, Platzhalter, Alt-Texte) — aus einer
 * Card mit jedem Slot-Typ und jedem Element, allen Dialogen und dem Editor
 * mit allen Abschnitten — und nach Ersatzschreibweisen suchen. Entity-IDs
 * und Config-Schluessel sind keine UI-Texte und werden vorher entfernt.
 */
const ERSATZ =
  /(Waerme|waerme|Rueck|rueck|Groess|groess|Hoehe|hoehe|Laenge|laenge|Staerke|staerke|Kaestchen|Duese|duese|Luefter|luefter|Glueh|glueh|\bfuer\b|\bFuer\b|ueber|Ueber|koenn|muess|waehl|Waehl|Schluessel|oeffn|Oeffn|aender|Aender|laeuft|Fuell|fuell|Bestaetig|bestaetig|zurueck|Pruef|pruef|Kuehl|kuehl|\bheiss|\bweiss\b|\bWeiss\b|spaeter|Spaeter|Blaetter|Taetig|Stroem|stroem|Aussen|aussen|fliess|Fliess|Schliess|schliess|Waehrend|waehrend)/;
const sichtbar = (root, sammel = []) => {
  const walk = (n) => {
    if (n.nodeType === 3) sammel.push(n.textContent);
    if (n.nodeType === 1) {
      if (["STYLE", "SCRIPT"].includes(n.tagName)) return;
      for (const a of ["title", "placeholder", "alt", "label", "aria-label"]) {
        if (n.getAttribute(a)) sammel.push(n.getAttribute(a));
      }
      if (n.label && typeof n.label === "string") sammel.push(n.label);
      if (n.helper && typeof n.helper === "string") sammel.push(n.helper);
      if (n.shadowRoot) walk(n.shadowRoot);
    }
    for (const k of n.childNodes || []) walk(k);
  };
  walk(root);
  return sammel;
};
const ohneIds = (t) => t.replace(/\b[a-z_]+\.[a-z0-9_]+\b/g, " ");

const vollCard = await mount(
  Dashboard,
  {
    hero: {
      shape: "oval",
      temp_entity: "sensor.pool_wassertemperatur",
      ph_entity: "sensor.pool_ph",
      rx_entity: "sensor.pool_redox",
      show_drain: true,
      inlet_temp_entity: "sensor.pool_wassertemperatur",
      label_text: "Pool",
    },
    slots: [
      { ...HP_MODUS, label_text: "Wärmepumpe", release_entity: FREI_ENT },
      { ...PUMP_WATT },
      { ...UV_CONFIG },
      {
        type: "solar",
        label: "Solarheizung",
        switch_entity: "switch.solarventil",
        temp_in_entity: "sensor.pool_wassertemperatur",
        temp_out_entity: "sensor.pool_wassertemperatur",
        power_entity: "sensor.poolpumpe_power",
      },
      CUSTOM_BTN({ confirm_off: true }),
      { type: "frame" },
      { type: "inlet" },
      { type: "heatpump" },
      { type: "pump" },
      { type: "uv" },
      { type: "solar" },
      { type: "custom" },
    ],
  },
  modusHass("Heizen Boost", {
    "switch.solarventil": { state: "on", attributes: {}, last_changed: iso(60) },
    "switch.poolbeleuchtung": { state: "on", attributes: {}, last_changed: iso(60) },
  })
);
/* Alle Rueckfrage-Dialoge oeffnen, damit ihre Texte mitgeprueft werden */
for (const el of vollCard.shadowRoot.querySelector(".grid").children) {
  await el.updateComplete;
  const knopf = el.shadowRoot?.querySelector(".power-badge.on, .btn-entry.on");
  if (knopf) {
    knopf.click();
    await el.updateComplete;
  }
}
const edVoll = new Editor();
edVoll.setConfig({
  hero: { enabled: true, shape: "oval", show_drain: true, label_text: "Pool", inlet_temp_entity: "sensor.x" },
  slots: [
    { type: "heatpump", show_mode: true, label_text: "x", show_release: true, release_entity: FREI_ENT },
    { type: "pump", power_entity: "sensor.poolpumpe_power" },
    { type: "uv" },
    { type: "solar" },
    { type: "custom", entries: [{ kind: "button", entity: "switch.a" }, { kind: "entity" }, { kind: "text" }] },
    { type: "frame" },
    { type: "hidden" },
    { type: "inlet" },
  ],
});
edVoll.hass = makeHass();
document.body.appendChild(edVoll);
await edVoll.updateComplete;

check("Umlaute: kein ae/oe/ue/ss-Ersatz in Card, Dialogen und Editor", () => {
  const texte = [...sichtbar(vollCard), ...sichtbar(edVoll)].map(ohneIds);
  const treffer = texte.filter((t) => ERSATZ.test(t)).map((t) => t.trim().slice(0, 80));
  assert.deepEqual([...new Set(treffer)], []);
  const alles = texte.join(" ");
  assert.match(alles, /Wärmepumpe/);
  assert.match(alles, /Größe/);
  assert.match(alles, /Kühlen Boost/);
  assert.match(alles, /Rückfrage|Rücklauf/);
});
check("Umlaute: die Pruefung selbst schlaegt an", () => {
  assert.ok(ERSATZ.test("Waermepumpe"));
  assert.ok(ERSATZ.test("Groesse"));
  assert.ok(ERSATZ.test("Kuehlen"));
  assert.ok(!ERSATZ.test("Wärmepumpe · Größe · Kühlen · Rücklauf · weiß"));
});
check("Umlaute: auch die Card-Beschreibung im Kartenwaehler", () => {
  const eintrag = window.customCards.find((c) => c.type === "tomtut-pool-dashboard");
  assert.ok(!ERSATZ.test(eintrag.name + " " + eintrag.description));
});

/* ------------------------------------------------------------------ */
/* Iteration 14: Betriebsmodus-Badge, "seit" am Freigabekontakt,       */
/* automatische Modus-Zuordnung (LocalTuya-Anzeigenamen)               */
/* ------------------------------------------------------------------ */

const WP_SEL = "select.wp_modus_tuya";
const TUYA_OPTIONEN = [
  "Auto", "Heizen Power", "Kuehlen Power", "Heizen Smart", "Kuehlen Smart", "Heizen Silent", "Kuehlen Silent",
];
const badgeVon = (zustand, c = {}, attrs = {}) =>
  pkg.modeBadge({ state: zustand, attributes: attrs }, { mode_entity: WP_SEL, ...c });

check("Modus automatisch: Thomas' LocalTuya-Optionen landen alle bis auf 'Auto'", () => {
  const erkannt = Object.fromEntries(TUYA_OPTIONEN.map((o) => [o, pkg.modeFromState(o)?.key || null]));
  assert.deepEqual(erkannt, {
    Auto: null,
    "Heizen Power": "heiz_boost",
    "Kuehlen Power": "kuehl_boost",
    "Heizen Smart": "heiz_smart",
    "Kuehlen Smart": "kuehl_smart",
    "Heizen Silent": "heiz_silent",
    "Kuehlen Silent": "kuehl_silent",
  });
});
check("Modus automatisch: braucht Art UND Stufe", () => {
  assert.equal(pkg.modeAuto("Heizen"), null);
  assert.equal(pkg.modeAuto("Auto"), null);
  assert.equal(pkg.modeAuto("heat_cool"), null);
  assert.equal(pkg.modeAuto("cool_eco").key, "kuehl_smart");
  assert.equal(pkg.modeAuto("HEAT-TURBO").key, "heiz_boost");
});
check("Modus automatisch: Umlaute gefaltet — 'Kuehlen Smart' trifft die Vorgabe 'Kühlen Smart'", () =>
  assert.equal(pkg.modeFromState("Kuehlen Smart").label, "Kühlen Smart")
);
check("Modus automatisch: eigene Liste schlaegt die Automatik fuer diesen Modus", () =>
  assert.equal(pkg.modeFromState("Heizen Power", { mode_map_heiz_boost: "Volldampf" }), null)
);

check("Modus-Badge: Mapping auf deutschen Klartext", () => {
  assert.deepEqual(badgeVon("Heizen Boost"), { text: "Heizen Boost", art: "heizen" });
  assert.deepEqual(badgeVon("Kuehlen Power"), { text: "Kühlen Boost", art: "kuehlen" });
  assert.deepEqual(badgeVon("off"), { text: "Aus", art: "aus" });
  assert.deepEqual(badgeVon("Auto"), { text: "Auto", art: null });
  assert.deepEqual(badgeVon("fan_only"), { text: "Nur Lüfter", art: null });
  assert.deepEqual(badgeVon("unavailable"), { text: "—", art: null });
});
check("Modus-Badge: unbekannter Wert kommt als Rohwert, nicht versteckt", () =>
  assert.deepEqual(badgeVon("Abtauen"), { text: "Abtauen", art: null })
);
check("Modus-Badge: climate = hvac_mode + Preset", () => {
  const cl = { mode_entity: "climate.wp" };
  assert.deepEqual(pkg.modeBadge({ state: "heat", attributes: { preset_mode: "eco" } }, cl), {
    text: "Heizen Smart",
    art: "heizen",
  });
  assert.deepEqual(pkg.modeBadge({ state: "heat", attributes: { preset_mode: "comfort" } }, cl), {
    text: "Heizen · Komfort",
    art: "heizen",
  });
  assert.deepEqual(pkg.modeBadge({ state: "cool", attributes: { preset_mode: "none" } }, cl), {
    text: "Kühlen",
    art: "kuehlen",
  });
  assert.deepEqual(pkg.modeBadge({ state: "off", attributes: { preset_mode: "boost" } }, cl), {
    text: "Aus",
    art: "aus",
  });
});

const MODUS_SEL = { ...HP_CONFIG, show_mode: true, mode_entity: WP_SEL };
const selHass = (zustand, extra = {}) =>
  makeHass({
    [WP_SEL]: { state: zustand, attributes: { options: TUYA_OPTIONEN }, last_changed: iso(60) },
    ...extra,
  });
const badge = (slot) => slot.shadowRoot.querySelector(".mode-badge");

check("Modus-Badge: Vorgaben fuer Lage und Groesse", () => {
  const d = pkg.HEATPUMP_DEFAULTS;
  assert.equal(d.mode_top, 86);
  assert.equal(d.mode_left, 64);
  assert.equal(d.mode_scale, 100);
});
const hpKuehl = await mountSlotTyp({ ...MODUS_SEL, fan_color_mode: "modus" }, selHass("Kuehlen Smart"));
check("Modus-Badge: zeigt Klartext in der Farbe des Rads", () => {
  const b = badge(hpKuehl);
  assert.ok(b, "kein Badge");
  assert.equal(b.querySelector(".val").textContent.trim(), "Kühlen Smart");
  assert.ok(b.classList.contains("kuehlen"));
  assert.match(b.getAttribute("style"), new RegExp(`--tt-mode-farbe:${pkg.MODE_FARBEN.kuehlen}`));
  assert.equal(farbeVon(hpKuehl), pkg.MODE_FARBEN.kuehlen, "Rad und Badge nicht gleich gefaerbt");
  assert.match(b.getAttribute("style"), /top:86%; left:64%/);
});
const hpRoh = await mountSlotTyp(MODUS_SEL, selHass("Abtauen"));
check("Modus-Badge: unbekannt -> Rohwert, neutral ohne Farbe", () => {
  const b = badge(hpRoh);
  assert.equal(b.querySelector(".val").textContent.trim(), "Abtauen");
  assert.ok(b.classList.contains("neutral"));
  assert.ok(!/--tt-mode-farbe/.test(b.getAttribute("style")));
});
const hpBadgeAus = await mountSlotTyp(
  { ...MODUS_SEL, fan_color_mode: "modus", show_mode_badge: false },
  selHass("Heizen Power")
);
check("Modus-Badge: show_mode_badge false blendet nur das Badge aus, das Rad bleibt rot", () => {
  assert.equal(badge(hpBadgeAus), null);
  assert.equal(farbeVon(hpBadgeAus), pkg.MODE_FARBEN.heizen);
});
const hpModusGanzAus = await mountSlotTyp({ ...MODUS_SEL, show_mode: false }, selHass("Heizen Power"));
check("Modus-Badge: ohne Modus-Auswertung (show_mode false / keine Entity) kein Badge", () => {
  assert.equal(badge(hpModusGanzAus), null);
  assert.equal(badge(hp), null);
});
const hpLage = await mountSlotTyp({ ...MODUS_SEL, mode_top: 10, mode_left: 30, mode_scale: 150 }, selHass("Auto"));
check("Modus-Badge: Lage und Groesse einstellbar", () =>
  assert.match(badge(hpLage).getAttribute("style"), /top:10%; left:30%; transform:translateX\(-50%\) scale\(1\.5\)/)
);
check("Modus-Badge: liegt in der z-index-Leiter (<= 10)", () => {
  const z = zIndexVon(cssOf("tomtut-pool-slot-heatpump"), ".mode-badge");
  assert.ok(z > 0 && z <= 10, `z-index ${z}`);
});

/* ---- "seit" am Freigabekontakt ---- */

check("seit (minutengenau): Format", () => {
  const jetzt = Date.parse("2026-09-22T12:00:00Z");
  const vor = (min) => new Date(jetzt - min * 60000).toISOString();
  assert.equal(pkg.seitMinuten(vor(0.5), jetzt), "seit < 1 Min");
  assert.equal(pkg.seitMinuten(vor(4), jetzt), "seit 4 Min");
  assert.equal(pkg.seitMinuten(vor(120), jetzt), "seit 2 Std");
  assert.equal(pkg.seitMinuten(vor(130), jetzt), "seit 2 Std 10 Min");
  assert.equal(pkg.seitMinuten(vor(24 * 60 + 5), jetzt), "seit 1 Tag");
  assert.equal(pkg.seitMinuten(vor(3 * 24 * 60 + 70), jetzt), "seit 3 Tagen");
  assert.equal(pkg.seitMinuten("", jetzt), "");
});
const seitHass = () =>
  makeHass({ [FREI_ENT]: { state: "on", attributes: {}, last_changed: iso(4 * 60 + 5) } });
check("Freigabe-seit: ab Werk aus", () => {
  assert.equal(pkg.HEATPUMP_DEFAULTS.show_release_since, false);
  assert.equal(hpFrei.shadowRoot.querySelector(".release-seit"), null);
  assert.equal(hpFrei._seitTimer, undefined, "Timer laeuft ohne Option");
});
const hpSeit = await mountSlotTyp({ ...HP_FREI, show_release_since: true }, seitHass());
check("Freigabe-seit: an -> 'seit 4 Min' unter dem Badge, Timer laeuft", () => {
  const s = hpSeit.shadowRoot.querySelector(".release-badge .release-seit");
  assert.ok(s, "kein seit-Text");
  assert.equal(s.textContent.trim(), "seit 4 Min");
  assert.ok(hpSeit._seitTimer, "kein Minuten-Timer");
});
{
  /* Minuten-Takt: der Timer stoesst ein Neuzeichnen an */
  const vorher = hpSeit._tick;
  hpSeit._tick = Date.now() + 1;
  await hpSeit.updateComplete;
  check("Freigabe-seit: Takt zeichnet neu", () => assert.notEqual(hpSeit._tick, vorher));
}
hpSeit.remove();
check("Freigabe-seit: Card entfernt -> Timer abgeraeumt", () =>
  assert.equal(hpSeit._seitTimer, undefined)
);

/* ---- Editor ---- */

const ed14 = new Editor();
ed14.setConfig({
  hero: { enabled: false },
  slots: [
    { type: "heatpump", show_mode: true, mode_entity: WP_SEL, show_release: true, release_entity: FREI_ENT },
    { type: "heatpump", show_mode: true, mode_entity: "select.wp_modus_fremd" },
  ],
});
ed14.hass = selHass("Heizen Smart", {
  [FREI_ENT]: { state: "on", attributes: {}, last_changed: iso(60) },
  "select.wp_modus_fremd": { state: "Abtauen", attributes: { options: ["Abtauen"] }, last_changed: iso(60) },
});
document.body.appendChild(ed14);
await ed14.updateComplete;
const karten14 = () => [...ed14.shadowRoot.querySelectorAll(".slot-card:not(.becken-card)")];
const erweitert14 = (i) =>
  [...karten14()[i].querySelectorAll("details.section")].find((d) =>
    /Erweitert: Modus-Namen anpassen/.test(d.querySelector("summary").textContent)
  );

check("Editor: Freigabe hat den Schalter 'Zeit seit dem letzten Wechsel', ab Werk aus", () => {
  const t = karten14()[0].querySelector('[data-key="show_release_since"]');
  assert.ok(t);
  assert.equal(t.checked, false);
});
check("Editor: Abschnitt heisst 'Erweitert: Modus-Namen anpassen' und ist zu, wenn erkannt", () => {
  const d = erweitert14(0);
  assert.ok(d, "Abschnitt fehlt");
  assert.equal(d.open, false);
  assert.ok(!/Zuordnung Gerätezustand/.test(ed14.shadowRoot.textContent), "alter Titel noch da");
});
check("Editor: Live-Befund 'meldet gerade … erkannt als … ✓' plus Optionsliste", () => {
  const d = erweitert14(0);
  const zeile = d.querySelector(".modus-befund").textContent.replace(/\s+/g, " ");
  assert.match(zeile, /Deine Pumpe meldet gerade: Heizen Smart → erkannt als Heizen Smart ✓/);
  const li = [...d.querySelectorAll(".modus-optionen li")].map((x) => x.textContent.replace(/\s+/g, " ").trim());
  assert.equal(li.length, 7);
  assert.ok(li.includes("Kuehlen Power → Kühlen Boost ✓"), li.join(" | "));
  assert.ok(li.includes("Auto → nicht erkannt ✗"));
});
check("Editor: nicht erkannt -> Hinweis, und der Abschnitt klappt von selbst auf", () => {
  const d = erweitert14(1);
  assert.equal(d.open, true);
  assert.match(d.querySelector(".modus-befund").textContent, /nicht erkannt ✗ – bitte unten zuordnen/);
});
check("Editor: Badge-Schalter und drei Regler beim Betriebsmodus", () => {
  for (const k of ["show_mode_badge", "mode_top", "mode_left", "mode_scale"]) {
    assert.ok(karten14()[0].querySelector(`[data-key="${k}"]`), `${k} fehlt`);
  }
  assert.equal(karten14()[0].querySelector('[data-key="show_mode_badge"]').checked, true);
});
ed14.remove();

/* ------------------------------------------------------------------ */
/* Iteration 15: Modus waehlen + Kiosk-Modus                           */
/* ------------------------------------------------------------------ */

const klick = async (el, slot) => {
  el.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, composed: true }));
  await slot.updateComplete;
};

/* ---- Modus waehlen ---- */

check("Modus waehlen: select -> select_option, Anzeigenamen deutsch, aktueller markiert", () => {
  const g = pkg.modusWahl(
    { state: "Heizen Smart", attributes: { options: TUYA_OPTIONEN } },
    { mode_entity: WP_SEL }
  );
  assert.equal(g.length, 1);
  assert.equal(g[0].domain, "select");
  assert.equal(g[0].service, "select_option");
  assert.equal(g[0].feld, "option");
  assert.deepEqual(
    g[0].optionen.map((o) => o.text),
    ["Auto", "Heizen Boost", "Kühlen Boost", "Heizen Smart", "Kühlen Smart", "Heizen Silent", "Kühlen Silent"]
  );
  assert.deepEqual(g[0].optionen.filter((o) => o.aktiv).map((o) => o.wert), ["Heizen Smart"]);
});
check("Modus waehlen: climate -> hvac_mode + Presets, preset_mode-Attribut -> nur Presets, sensor -> nichts", () => {
  const cl = { state: "heat", attributes: { hvac_modes: ["heat", "cool", "off"], preset_modes: ["eco", "boost"], preset_mode: "eco" } };
  const g = pkg.modusWahl(cl, { mode_entity: "climate.wp" });
  assert.deepEqual(g.map((x) => x.service), ["set_hvac_mode", "set_preset_mode"]);
  assert.deepEqual(g[0].optionen.map((o) => o.text), ["Heizen", "Kühlen", "Aus"]);
  assert.equal(g[1].optionen.find((o) => o.aktiv).wert, "eco");
  const p = pkg.modusWahl(cl, { mode_entity: "climate.wp", mode_attribute: "preset_mode" });
  assert.deepEqual(p.map((x) => x.feld), ["preset_mode"]);
  assert.deepEqual(pkg.modusWahl({ state: "Heizen", attributes: {} }, { mode_entity: "sensor.wp_modus" }), []);
  assert.deepEqual(pkg.modusWahl({ state: "x", attributes: { options: ["x"] } }, { mode_entity: WP_SEL, mode_attribute: "foo" }), []);
});

const hpWahl = await mountSlotTyp(MODUS_SEL, selHass("Heizen Smart"));
check("Modus waehlen: Badge ist ein Knopf, Auswahl ab Werk zu", () => {
  assert.ok(badge(hpWahl).classList.contains("waehlbar"));
  assert.equal(hpWahl.shadowRoot.querySelector(".modus-overlay"), null);
});
await klick(badge(hpWahl), hpWahl);
check("Modus waehlen: Tippen oeffnet die Auswahl mit allen Optionen, aktueller markiert", () => {
  const ov = hpWahl.shadowRoot.querySelector(".confirm-overlay.modus-overlay");
  assert.ok(ov, "keine Auswahl");
  const opt = [...ov.querySelectorAll(".modus-option")];
  assert.equal(opt.length, 7);
  const aktiv = opt.filter((b) => b.classList.contains("aktiv"));
  assert.equal(aktiv.length, 1);
  assert.match(aktiv[0].textContent, /✓\s*Heizen Smart/);
});
calls.length = 0;
await klick(hpWahl.shadowRoot.querySelector('.modus-option[data-wert="Kuehlen Power"]'), hpWahl);
await new Promise((r) => setTimeout(r, 0));
await hpWahl.updateComplete;
check("Modus waehlen: ruft select.select_option mit der Roh-Option und schliesst", () => {
  assert.deepEqual(calls, [
    { domain: "select", service: "select_option", data: { entity_id: WP_SEL, option: "Kuehlen Power" } },
  ]);
  assert.equal(hpWahl.shadowRoot.querySelector(".modus-overlay"), null);
});

const CL_ENT = "climate.wp_klima";
const clHass = (extra = {}) =>
  makeHass({
    [CL_ENT]: {
      state: "heat",
      attributes: { hvac_modes: ["heat", "cool", "off"], preset_modes: ["eco", "boost"], preset_mode: "eco", temperature: 28 },
      last_changed: iso(60),
    },
    ...extra,
  });
const hpKlima = await mountSlotTyp({ ...HP_CONFIG, show_mode: true, mode_entity: CL_ENT }, clHass());
await klick(badge(hpKlima), hpKlima);
calls.length = 0;
await klick(hpKlima.shadowRoot.querySelector('.modus-option[data-wert="cool"]'), hpKlima);
await new Promise((r) => setTimeout(r, 0));
await klick(badge(hpKlima), hpKlima);
await klick(hpKlima.shadowRoot.querySelector('.modus-option[data-wert="boost"]'), hpKlima);
await new Promise((r) => setTimeout(r, 0));
check("Modus waehlen: climate -> set_hvac_mode bzw. set_preset_mode", () => {
  assert.deepEqual(calls, [
    { domain: "climate", service: "set_hvac_mode", data: { entity_id: CL_ENT, hvac_mode: "cool" } },
    { domain: "climate", service: "set_preset_mode", data: { entity_id: CL_ENT, preset_mode: "boost" } },
  ]);
});

const hassFehler = selHass("Heizen Smart");
hassFehler.callService = () => Promise.reject(new Error("Gerät offline"));
const hpFehler = await mountSlotTyp(MODUS_SEL, hassFehler);
const konsoleVorher = console.error;
const konsole = [];
console.error = (...a) => konsole.push(a);
await klick(badge(hpFehler), hpFehler);
await klick(hpFehler.shadowRoot.querySelector('.modus-option[data-wert="Auto"]'), hpFehler);
await new Promise((r) => setTimeout(r, 0));
await hpFehler.updateComplete;
console.error = konsoleVorher;
check("Modus waehlen: Fehler beim Dienst wird sichtbar gemeldet, Auswahl bleibt offen", () => {
  const f = hpFehler.shadowRoot.querySelector(".modus-fehler");
  assert.ok(f, "kein Fehlerhinweis");
  assert.equal(f.getAttribute("role"), "alert");
  assert.match(f.textContent, /Auto.*fehlgeschlagen: Gerät offline/);
  assert.ok(hpFehler.shadowRoot.querySelector(".modus-overlay"));
  assert.equal(konsole.length, 1, "nicht in der Konsole protokolliert");
});

const hpNurSensor = await mountSlotTyp(
  { ...HP_CONFIG, show_mode: true, mode_entity: "sensor.wp_modus_x" },
  makeHass({ "sensor.wp_modus_x": { state: "Heizen Boost", attributes: {}, last_changed: iso(60) } })
);
await klick(badge(hpNurSensor), hpNurSensor);
check("Modus waehlen: sensor ist nur Anzeige — kein Knopf, keine Auswahl", () => {
  assert.ok(!badge(hpNurSensor).classList.contains("waehlbar"));
  assert.equal(hpNurSensor.shadowRoot.querySelector(".modus-overlay"), null);
});
check("Modus waehlen: Auswahl sitzt in der Dialog-Stufe (z-index 10, nicht hoeher)", () => {
  const css = cssOf("tomtut-pool-slot-heatpump");
  assert.equal(zIndexVon(css, ".confirm-overlay"), 10);
  assert.ok(!/z-index:\s*(1[1-9]|[2-9]\d|\d{3,})/.test(css), "z-index > 10");
});

/* ---- Kiosk-Modus ---- */

const KIOSK_HASS = () =>
  selHass("Heizen Smart", { [FREI_ENT]: { state: "on", attributes: {}, last_changed: iso(60) } });
const KIOSK_SLOTS = [
  { ...MODUS_SEL, release_entity: FREI_ENT, confirm_off: true },
  PUMP_CONFIG,
  CUSTOM_BTN(),
];
const kioskCard = async (extra) =>
  mount(Dashboard, { hero: { enabled: true, temp_entity: "sensor.pool_wassertemperatur" }, slots: KIOSK_SLOTS, ...extra }, KIOSK_HASS());
const slotsVon = async (card) => {
  const el = [...card.shadowRoot.querySelector(".grid").children];
  await Promise.all(el.map((e) => e.updateComplete));
  return el;
};

/* Alles anklicken, was sich in einem Slot anklicken laesst; zaehlt Dienste,
   more-info-Events und geoeffnete Dialoge. */
const allesAnklicken = async (slot) => {
  const mehrInfo = [];
  slot.addEventListener("hass-more-info", (e) => mehrInfo.push(e.detail.entityId));
  const ziele = [
    ...slot.shadowRoot.querySelectorAll(
      ".power-badge, .stage-btn, .release-badge, .mode-badge, .step, .value-box, .thermo, .entry, .entry button, [data-entity]"
    ),
  ];
  for (const z of ziele) await klick(z, slot);
  await new Promise((r) => setTimeout(r, 0));
  return {
    ziele: ziele.length,
    mehrInfo,
    dialog: !!slot.shadowRoot.querySelector(".confirm-overlay"),
  };
};

check("Kiosk: ab Werk aus", () => {
  assert.equal(pkg.kioskGilt({}, 1), false);
  assert.equal(pkg.kioskGilt({ kiosk: false }, "becken"), false);
  assert.equal(pkg.kioskGilt({ kiosk: true }, 3), true);
  assert.equal(pkg.kioskGilt({ kiosk: true, kiosk_slots: [1, "2"] }, 2), true);
  assert.equal(pkg.kioskGilt({ kiosk: true, kiosk_slots: [1, "2"] }, "becken"), false);
  assert.deepEqual(
    pkg.kioskSchluessel({ slots: [{ type: "pump" }, { type: "hidden" }, { type: "uv" }] }),
    ["becken", 1, 3]
  );
});

const kAus = await kioskCard({});
const kAusSlots = await slotsVon(kAus);
calls.length = 0;
const kAusErgebnis = [];
for (const s of kAusSlots) kAusErgebnis.push(await allesAnklicken(s));
check("Kiosk aus: alles bedienbar (Dienste, more-info, Rueckfrage)", () => {
  assert.ok(calls.length > 0, "keine Dienste");
  assert.ok(kAusErgebnis.some((e) => e.mehrInfo.length > 0), "kein more-info");
  assert.ok(!kAusSlots.some((s) => s.shadowRoot.querySelector(".slot.kiosk")));
});

const kAn = await kioskCard({ kiosk: true });
const kAnSlots = await slotsVon(kAn);
calls.length = 0;
const kAnErgebnis = [];
for (const s of kAnSlots) kAnErgebnis.push(await allesAnklicken(s));
check("Kiosk an: KEIN hass.callService, kein more-info, kein Dialog — in keinem Kasten", () => {
  assert.ok(kAnErgebnis.reduce((n, e) => n + e.ziele, 0) > 8, "zu wenig angeklickt");
  assert.deepEqual(calls, []);
  assert.deepEqual(kAnErgebnis.flatMap((e) => e.mehrInfo), []);
  assert.ok(!kAnErgebnis.some((e) => e.dialog), "Dialog offen");
});
check("Kiosk an: Kaesten tragen .kiosk, das Becken auch; Werte bleiben sichtbar", () => {
  assert.equal(kAnSlots.length, 4);
  for (const s of kAnSlots) assert.ok(s.kiosk === true && s.shadowRoot.querySelector(".slot.kiosk, .kiosk"), s.tagName);
  assert.match(kAnSlots[1].shadowRoot.querySelector(".mode-badge").textContent, /Heizen Smart/);
  assert.ok(!kAnSlots[1].shadowRoot.querySelector(".mode-badge").classList.contains("waehlbar"));
});
check("Kiosk: CSS nimmt Cursor und Zeiger-Feedback weg", () => {
  const css = cssOf("tomtut-pool-slot-heatpump");
  assert.match(css, /\.slot\.kiosk \*[^}]*pointer-events:\s*none\s*!important/);
  assert.match(css, /\.slot\.kiosk,\s*\.slot\.kiosk \*[^}]*cursor:\s*default\s*!important/);
});
{
  /* Powerbutton direkt ausloesen (am CSS vorbei, wie ein Skript es koennte) */
  const wp = kAnSlots[1];
  calls.length = 0;
  wp._onPowerClick();
  wp._stepTarget(1);
  wp._onReleaseClick();
  wp._onModeClick();
  await wp.updateComplete;
  check("Kiosk: auch direkte Handler-Aufrufe schalten nichts", () => {
    assert.deepEqual(calls, []);
    assert.equal(wp.shadowRoot.querySelector(".confirm-overlay"), null);
  });
}

const kTeil = await kioskCard({ kiosk: true, kiosk_slots: [2] });
const kTeilSlots = await slotsVon(kTeil);
check("Kiosk-Teilmenge: nur Kasten 2 (Pumpe) gesperrt, Becken und die anderen bedienbar", () => {
  assert.deepEqual(kTeilSlots.map((s) => s.kiosk === true), [false, false, true, false]);
});
calls.length = 0;
await allesAnklicken(kTeilSlots[2]);
check("Kiosk-Teilmenge: gesperrter Kasten ruft nichts", () => assert.deepEqual(calls, []));
calls.length = 0;
await allesAnklicken(kTeilSlots[3]);
check("Kiosk-Teilmenge: freier Kasten schaltet weiter", () =>
  assert.ok(calls.some((c) => c.data.entity_id === "switch.poolbeleuchtung"))
);

/* ---- Editor ---- */

const ed15 = new Editor();
ed15.setConfig({ hero: { enabled: true }, slots: [{ type: "heatpump", label_text: "WP" }, { type: "pump", label: "Filter" }] });
ed15.hass = makeHass();
document.body.appendChild(ed15);
await ed15.updateComplete;
let ed15Fired = null;
ed15.addEventListener("config-changed", (e) => (ed15Fired = e.detail.config));
const kioskBox = () => ed15.shadowRoot.querySelector('.kiosk-block input[data-key="kiosk"]');
check("Editor: Kiosk-Kasten steht ganz oben (Kopfzeile, seit It17 neben der Ansicht), Schalter aus, keine Liste", () => {
  const kopf = ed15.shadowRoot.querySelector(".editor").firstElementChild;
  const erstes = kopf.querySelector(".kiosk-block");
  assert.ok(kopf.classList.contains("kopf-reihe") && erstes, "nicht ganz oben");
  assert.match(erstes.textContent, /Kiosk-Modus \(nur anzeigen\)/);
  assert.equal(kioskBox().checked, false);
  assert.equal(ed15.shadowRoot.querySelectorAll("[data-kiosk-slot]").length, 0);
});
kioskBox().checked = true;
kioskBox().dispatchEvent(new dom.window.Event("change"));
await ed15.updateComplete;
check("Editor: Kiosk an -> kiosk: true, Liste aller Kaesten (Becken + Slots mit Typ/Label), alle angehakt", () => {
  assert.equal(ed15Fired.kiosk, true);
  assert.equal(ed15Fired.kiosk_slots, undefined);
  const boxen = [...ed15.shadowRoot.querySelectorAll("[data-kiosk-slot]")];
  assert.deepEqual(boxen.map((b) => b.dataset.kioskSlot), ["becken", "1", "2"]);
  assert.ok(boxen.every((b) => b.checked));
  assert.match(boxen[1].parentElement.textContent, /Kasten 1 · Wärmepumpe · WP/);
});
{
  const becken = ed15.shadowRoot.querySelector('[data-kiosk-slot="becken"]');
  becken.checked = false;
  becken.dispatchEvent(new dom.window.Event("change"));
  await ed15.updateComplete;
}
check("Editor: Becken abhaken -> kiosk_slots [1, 2]", () => assert.deepEqual(ed15Fired.kiosk_slots, [1, 2]));
{
  const becken = ed15.shadowRoot.querySelector('[data-kiosk-slot="becken"]');
  becken.checked = true;
  becken.dispatchEvent(new dom.window.Event("change"));
  await ed15.updateComplete;
}
check("Editor: wieder alle angehakt -> Liste faellt weg (= alle)", () =>
  assert.equal("kiosk_slots" in ed15Fired, false)
);
kioskBox().checked = false;
kioskBox().dispatchEvent(new dom.window.Event("change"));
await ed15.updateComplete;
check("Editor: Kiosk aus raeumt beide Schluessel", () => {
  assert.equal("kiosk" in ed15Fired, false);
  assert.equal("kiosk_slots" in ed15Fired, false);
});
ed15.remove();

/* ------------------------------------------------------------------ */
/* Iteration 16: Freifeld bis 8 Einträge, layout liste/kacheln        */
/* ------------------------------------------------------------------ */

const I16_HASS = () => {
  const h = makeHass();
  const an = (s) => ({ state: s, attributes: {}, last_changed: iso(60) });
  Object.assign(h.states, {
    "input_boolean.poolwp_pv_logik_aktivieren": { state: "on", attributes: { friendly_name: "PV Logik aktivieren" }, last_changed: iso(60) },
    "input_boolean.poolwp_manuell_ein": { state: "off", attributes: { friendly_name: "Pool WP manuell einschalten" }, last_changed: iso(60) },
    "switch.solarsteuerung_switch": { state: "off", attributes: { friendly_name: "Solarsteuerung", icon: "mdi:power" }, last_changed: iso(60) },
    "sensor.solarheizung_status": { state: "Bypass", attributes: { friendly_name: "Solarheizung" }, last_changed: iso(60) },
    "switch.poolroboter_switch_0": an("on"),
    "switch.gsa_zigbee": an("off"),
    "switch.poollampe_zigbee": an("off"),
    "input_boolean.pool_manuell_reinigen": an("on"),
  });
  return h;
};
const HEIZ = (extra = {}) => ({
  type: "custom",
  title: "Pool: Heizsteuerung",
  layout: "liste",
  entries: [
    { kind: "button", entity: "input_boolean.poolwp_pv_logik_aktivieren" },
    { kind: "button", entity: "input_boolean.poolwp_manuell_ein", confirm_off: true },
    { kind: "button", entity: "switch.solarsteuerung_switch" },
    { kind: "entity", entity: "sensor.solarheizung_status" },
  ],
  ...extra,
});
const mountCustom = async (slot, extra = {}) => {
  const card = await mount(Dashboard, { hero: { enabled: false }, frame: { enabled: false }, slots: [slot], ...extra }, I16_HASS());
  const el = card.shadowRoot.querySelector("tomtut-pool-slot-custom");
  await el.updateComplete;
  return el;
};

check("It16: Limit 8, Layouts klassisch/liste/kacheln, Default klassisch", () => {
  assert.equal(pkg.CUSTOM_MAX_ENTRIES, 8);
  assert.deepEqual(pkg.CUSTOM_LAYOUTS, ["klassisch", "liste", "kacheln"]);
  assert.equal(pkg.customLayout({}), "klassisch");
  assert.equal(pkg.customLayout({ layout: "quatsch" }), "klassisch");
  assert.equal(pkg.customLayout({ layout: "liste" }), "liste");
});

{
  const ohne = await mountCustom({ type: "custom", title: "Alt", entries: [{ kind: "text", text: "a" }] });
  check("It16: bestehende Config ohne layout rendert klassisch (mittig, .btn-entry-Welt)", () => {
    assert.ok(ohne.shadowRoot.querySelector(".slot.layout-klassisch"));
    assert.ok(ohne.shadowRoot.querySelector(".custom.layout-klassisch.align-mitte"));
    assert.equal(ohne.shadowRoot.querySelector(".zeile, .kachel"), null);
  });
}

const heiz = await mountCustom(HEIZ());
check("It16 liste: Titel + 4 Zeilen, 3 Schalter + 1 Status-Text", () => {
  const sr = heiz.shadowRoot;
  assert.match(sr.querySelector(".slot-title").textContent, /Pool: Heizsteuerung/);
  assert.equal(sr.querySelectorAll(".zeile").length, 4);
  assert.equal(sr.querySelectorAll(".zeile.schaltbar").length, 3);
  assert.equal(sr.querySelectorAll(".schalter").length, 3);
  const wert = sr.querySelector(".zeile.wert");
  assert.match(wert.querySelector(".z-name").textContent, /Solarheizung/);
  assert.equal(wert.querySelector(".z-wert").textContent.trim(), "Bypass");
  assert.ok(sr.querySelector(".custom.layout-liste.align-oben"));
});
check("It16 liste: an/aus deutlich — Klasse, aria-checked, Name aus friendly_name", () => {
  const z = [...heiz.shadowRoot.querySelectorAll(".zeile.schaltbar")];
  assert.deepEqual(z.map((e) => e.classList.contains("on")), [true, false, false]);
  assert.deepEqual(z.map((e) => e.getAttribute("aria-checked")), ["true", "false", "false"]);
  assert.match(z[0].textContent, /PV Logik aktivieren/);
  const css = cssOf("tomtut-pool-slot-custom");
  assert.match(css, /\.zeile\.on \.schalter\s*\{[^}]*background:\s*var\(--tt-on\)/);
  assert.match(css, /\.zeile\.on \.knopf\s*\{[^}]*left:\s*20px/);
});
calls.length = 0;
heiz.shadowRoot.querySelectorAll(".zeile.schaltbar")[2].click();
await heiz.updateComplete;
check("It16 liste: Zeile schaltet per toggle", () =>
  assert.deepEqual(calls, [{ domain: "switch", service: "toggle", data: { entity_id: "switch.solarsteuerung_switch" } }])
);
{
  /* confirm_off pro Eintrag: an Eintrag 2 (aus) -> direkt; an Eintrag 1 (an, ohne confirm) -> direkt */
  const h = await mountCustom(HEIZ({ entries: [{ kind: "button", entity: "input_boolean.poolwp_pv_logik_aktivieren", confirm_off: true }] }));
  calls.length = 0;
  h.shadowRoot.querySelector(".zeile.schaltbar").click();
  await h.updateComplete;
  check("It16 liste: confirm_off pro Eintrag öffnet die Rückfrage", () => {
    assert.deepEqual(calls, []);
    assert.ok(h.shadowRoot.querySelector(".confirm-overlay"));
    assert.match(h.shadowRoot.querySelector(".confirm-panel").textContent, /PV Logik aktivieren/);
  });
  h.shadowRoot.querySelector(".btn.danger").click();
  await h.updateComplete;
  check("It16 liste: nach Bestätigung turn_off", () =>
    assert.deepEqual(calls, [
      { domain: "input_boolean", service: "turn_off", data: { entity_id: "input_boolean.poolwp_pv_logik_aktivieren" } },
    ])
  );
}

const ACHT = Array.from({ length: 10 }, (_, i) => ({ kind: "text", text: `T${i + 1}` }));
{
  const viele = await mountCustom({ type: "custom", layout: "liste", entries: ACHT });
  check("It16: bis 8 Einträge sichtbar, darüber sichtbarer Hinweis statt stillem Kappen", () => {
    assert.equal(viele.shadowRoot.querySelectorAll(".zeile").length, 8);
    assert.match(viele.shadowRoot.querySelector(".slot-hint.mehr").textContent, /\+2 weitere Einträge ausgeblendet \(höchstens 8\)/);
  });
  const genau = await mountCustom({ type: "custom", entries: ACHT.slice(0, 8) });
  check("It16: genau 8 Einträge -> kein Hinweis (auch klassisch)", () => {
    assert.equal(genau.shadowRoot.querySelectorAll(".entry").length, 8);
    assert.equal(genau.shadowRoot.querySelector(".slot-hint.mehr"), null);
  });
}

const kach = await mountCustom({
  type: "custom",
  title: "Poolschalter",
  layout: "kacheln",
  entries: [
    { kind: "button", entity: "switch.poolroboter_switch_0", label: "Poolroboter" },
    { kind: "button", entity: "switch.gsa_zigbee", label: "Gegenstromanlage" },
    { kind: "button", entity: "switch.poollampe_zigbee", label: "Poollampe" },
    { kind: "entity", entity: "sensor.solarheizung_status" },
  ],
});
check("It16 kacheln: 2-Spalten-Raster, An/Aus-Text, Status-Kachel", () => {
  const sr = kach.shadowRoot;
  assert.equal(sr.querySelectorAll(".kacheln > .kachel").length, 4);
  assert.match(cssOf("tomtut-pool-slot-custom"), /\.kacheln\s*\{[^}]*grid-template-columns:\s*repeat\(2/);
  const k = [...sr.querySelectorAll(".kachel")];
  assert.ok(k[0].classList.contains("on"));
  assert.equal(k[0].querySelector(".k-zustand").textContent.trim(), "An");
  assert.equal(k[1].querySelector(".k-zustand").textContent.trim(), "Aus");
  assert.equal(k[3].querySelector(".k-zustand").textContent.trim(), "Bypass");
});

{
  const kc = await mount(
    Dashboard,
    { hero: { enabled: false }, frame: { enabled: false }, kiosk: true, slots: [HEIZ(), { ...HEIZ(), layout: "kacheln" }] },
    I16_HASS()
  );
  const els = await slotsVon(kc);
  calls.length = 0;
  let mehrInfo = 0;
  for (const s of els) {
    s.addEventListener("hass-more-info", () => mehrInfo++);
    for (const z of s.shadowRoot.querySelectorAll(".zeile, .kachel")) await klick(z, s);
    s._toggle(HEIZ().entries[0]);
    await s.updateComplete;
  }
  check("It16: Kiosk wirkt in liste und kacheln (kein Dienst, kein more-info, kein Dialog)", () => {
    assert.deepEqual(calls, []);
    assert.equal(mehrInfo, 0);
    assert.ok(els.every((s) => s.shadowRoot.querySelector(".slot.kiosk") && !s.shadowRoot.querySelector(".confirm-overlay")));
  });
}

check("It16: ohne Rahmenfüllung trägt liste den HA-Kartenhintergrund und die Theme-Schrift", () => {
  const css = cssOf("tomtut-pool-slot-custom");
  assert.match(css, /\.slot\.layout-liste\.fill-transparent[^{]*\{[^}]*--tt-bg:\s*var\(--ha-card-background/);
  assert.match(css, /--tt-fg2:\s*var\(--secondary-text-color/);
  assert.ok(heiz.shadowRoot.querySelector(".slot.fill-transparent.layout-liste"));
});

/* ---- Editor ---- */
{
  const ed16 = new Editor();
  ed16.setConfig({ hero: { enabled: false }, slots: [{ type: "custom", layout: "liste", entries: ACHT }] });
  ed16.hass = makeHass();
  document.body.appendChild(ed16);
  await ed16.updateComplete;
  const txt = ed16.shadowRoot.textContent;
  check("It16 Editor: sichtbare Warnung bei mehr als 8 Einträgen", () => {
    const w = ed16.shadowRoot.querySelector(".limit-warnung");
    assert.ok(w, "keine Warnung");
    assert.match(w.textContent, /10 Einträge eingetragen/);
    assert.match(w.textContent, /höchstens 8/);
    assert.match(w.textContent, /9–10/);
  });
  check("It16 Editor: bis zu 8 Eintrag-Blöcke + Darstellung wählbar", () => {
    assert.match(txt, /Eintrag 8/);
    assert.doesNotMatch(txt, /Eintrag 9/);
    const sel = ed16.shadowRoot.querySelector('select[data-key="layout"]');
    assert.ok(sel);
    assert.deepEqual([...sel.options].map((o) => o.value), ["klassisch", "liste", "kacheln"]);
    assert.equal(sel.value, "liste");
  });
  ed16.setConfig({ hero: { enabled: false }, slots: [{ type: "custom", entries: ACHT.slice(0, 4) }] });
  await ed16.updateComplete;
  check("It16 Editor: 4 Einträge -> 5 Blöcke (einer frei), keine Warnung", () => {
    assert.equal(ed16.shadowRoot.querySelector(".limit-warnung"), null);
    assert.match(ed16.shadowRoot.textContent, /Eintrag 5/);
    assert.doesNotMatch(ed16.shadowRoot.textContent, /Eintrag 6/);
  });
  ed16.remove();
}

/* ------------------------------------------------------------------ */
/* Iteration 17: Mini-Ansicht (view: mini)                             */
/* ------------------------------------------------------------------ */

const LEER = pkg.MINI_LEER;
check("It17: view ist ab Werk voll, nur 'mini' schaltet um", () => {
  assert.equal(pkg.ANSICHT_DEFAULT, "voll");
  assert.deepEqual(pkg.ANSICHTEN, ["voll", "mini"]);
  assert.equal(pkg.ansichtVon({}), "voll");
  assert.equal(pkg.ansichtVon({ view: "voll" }), "voll");
  assert.equal(pkg.ansichtVon({ view: "Mini " }), "mini");
  assert.equal(pkg.ansichtVon({ view: "kompakt" }), "voll");
  assert.equal(LEER, "–");
});
check("It17: Spalten — bis 5 Geräte eine Zeile, darüber zwei Zeilen", () => {
  assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 8].map(pkg.miniSpalten), [1, 2, 3, 4, 5, 3, 4, 4]);
});
check("It17: Becken-Seitenverhältnisse passen zu den PNGs in dist/", () => {
  for (const [datei, ratio] of Object.entries(pkg.BECKEN_RATIOS)) {
    const b = readFileSync(join(here, "..", "dist", datei));
    const w = b.readUInt32BE(16);
    const h = b.readUInt32BE(20);
    assert.ok(Math.abs(w / h - ratio) < 0.002, `${datei}: ${w}x${h} vs ${ratio}`);
  }
  for (const form of Object.keys(pkg.SHAPES)) assert.ok(pkg.shapeRatio(form) > 1, form);
});

const zeilen = (k) => k.zeilen.map((z) => z.text);

/* ---- Pumpe: Stufe + Watt ---- */
check("It17 Kachel Pumpe: Stufe aus Watt (737 W -> N3) + Watt, an", () => {
  const k = pkg.miniKachel({ ...PUMP_CONFIG, stage_from_power: true }, makeHass());
  assert.equal(k.typ, "pump");
  assert.deepEqual(zeilen(k), ["N3", "737 W"]);
  assert.equal(k.zustand, "an");
  assert.match(k.bild.src, /poolpumpe_transparent\.png/);
});
check("It17 Kachel Pumpe: ohne Watt-Erkennung zählt der jüngste Taster (N2)", () => {
  const k = pkg.miniKachel(PUMP_CONFIG, makeHass());
  assert.deepEqual(zeilen(k), ["N2", "737 W"]);
});
check("It17 Kachel Pumpe: Hauptschalter aus -> Aus, grau", () => {
  const k = pkg.miniKachel(
    PUMP_CONFIG,
    makeHass({ "input_boolean.poolpumpe_schalter": { state: "off", attributes: {}, last_changed: iso(60) } })
  );
  assert.deepEqual(zeilen(k), ["Aus", "737 W"]);
  assert.equal(k.zustand, "aus");
});
check("It17 Kachel Pumpe: 10 W -> Stopp; Watt unknown -> '–'", () => {
  const w = (s) => ({ "sensor.poolpumpe_power": { state: s, attributes: { unit_of_measurement: "W" }, last_changed: iso(5) } });
  const k1 = pkg.miniKachel({ ...PUMP_CONFIG, stage_from_power: true }, makeHass(w("10")));
  assert.deepEqual(zeilen(k1), ["Stopp", "10 W"]);
  assert.equal(k1.zustand, "aus");
  const k2 = pkg.miniKachel(PUMP_CONFIG, makeHass(w("unknown")));
  assert.equal(zeilen(k2)[1], LEER);
});

/* ---- Wärmepumpe: Modus-Badge + Watt, gesperrt ---- */
check("It17 Kachel WP: Modus-Badge (Punkt heizen) + Watt, an", () => {
  const k = pkg.miniKachel({ ...MODUS_SEL, release_entity: FREI_ENT }, selHass("Heizen Smart", {
    [FREI_ENT]: { state: "on", attributes: {}, last_changed: iso(60) },
  }));
  assert.deepEqual(zeilen(k), ["Heizen Smart", "820 W"]);
  assert.equal(k.zeilen[0].punkt, "heizen");
  assert.equal(k.zustand, "an");
  assert.equal(k.gesperrt, false);
});
check("It17 Kachel WP: Freigabekontakt offen -> gesperrt", () => {
  const k = pkg.miniKachel({ ...MODUS_SEL, release_entity: FREI_ENT }, selHass("Kuehlen Smart", {
    [FREI_ENT]: { state: "off", attributes: {}, last_changed: iso(60) },
  }));
  assert.equal(k.gesperrt, true);
  assert.equal(k.zustand, "gesperrt");
  assert.equal(k.zeilen[0].text, "Kühlen Smart");
  assert.equal(k.zeilen[0].punkt, "kuehlen");
});
check("It17 Kachel WP: Schalter aus -> 'Aus' statt Modus", () => {
  const k = pkg.miniKachel(MODUS_SEL, selHass("Heizen Smart", {
    "switch.waermepumpe": { state: "off", attributes: {}, last_changed: iso(60) },
  }));
  assert.deepEqual(zeilen(k), ["Aus", "820 W"]);
  assert.equal(k.zustand, "aus");
});

/* ---- Solar, UV, custom ---- */
const SOLAR_MINI = {
  type: "solar",
  switch_entity: "switch.solarventil",
  temp_in_entity: "sensor.solar_vorlauf",
  temp_out_entity: "sensor.solar_ruecklauf",
};
const solarMiniHass = (vor) =>
  makeHass({
    "switch.solarventil": { state: "on", attributes: {}, last_changed: iso(60) },
    "sensor.solar_vorlauf": { state: vor, attributes: { unit_of_measurement: "°C" }, last_changed: iso(60) },
    "sensor.solar_ruecklauf": { state: "21.0", attributes: { unit_of_measurement: "°C" }, last_changed: iso(60) },
  });
check("It17 Kachel Solar: Vorlauf (Pfeil blau) + Rücklauf (Pfeil rot), an", () => {
  const k = pkg.miniKachel(SOLAR_MINI, solarMiniHass("22.81"));
  assert.deepEqual(zeilen(k), ["22,8 °C", "21 °C"]);
  assert.deepEqual(k.zeilen.map((z) => z.pfeil), ["in", "out"]);
  assert.equal(k.zustand, "an");
});
check("It17 Kachel Solar: unknown -> '–'", () => {
  const k = pkg.miniKachel(SOLAR_MINI, solarMiniHass("unknown"));
  assert.equal(zeilen(k)[0], LEER);
});
check("It17 Kachel UV: an/aus + Watt; ohne Watt-Sensor nur an/aus", () => {
  const k = pkg.miniKachel({ type: "uv", switch_entity: "switch.uv_lampe", power_entity: "sensor.uv_lampe_power" }, makeHass());
  assert.deepEqual(zeilen(k), ["An", "41 W"]);
  assert.equal(k.zustand, "an");
  const k2 = pkg.miniKachel(
    { type: "uv", switch_entity: "switch.uv_lampe" },
    makeHass({ "switch.uv_lampe": { state: "off", attributes: {}, last_changed: iso(60) } })
  );
  assert.deepEqual(zeilen(k2), ["Aus"]);
  assert.equal(k2.zustand, "aus");
});
check("It17 Kachel custom: erster Wert + Name; Schalter an/aus; Text", () => {
  const k = pkg.miniKachel(
    { type: "custom", title: "Werte", entries: [{ kind: "entity", entity: "sensor.pool_lufttemperatur", label: "Luft" }, { kind: "text", text: "x" }] },
    makeHass()
  );
  assert.deepEqual(zeilen(k), ["21,3 °C", "Luft"]);
  assert.equal(k.zustand, "neutral");
  const k2 = pkg.miniKachel(CUSTOM_BTN(), lichtAn());
  assert.deepEqual(zeilen(k2), ["An", "Licht"]);
  assert.equal(k2.zustand, "an");
  const k3 = pkg.miniKachel({ type: "custom", entries: [{ kind: "text", text: "Sommerbetrieb" }] }, makeHass());
  assert.deepEqual(zeilen(k3), ["Sommerbetrieb"]);
});
check("It17 Becken: Temperatur unknown -> '–', pH/RX als Kästchen", () => {
  const b = pkg.miniBecken(
    { temp_entity: "sensor.pool_wassertemperatur", ph_entity: "sensor.pool_ph", rx_entity: "sensor.pool_redox" },
    makeHass({ "sensor.pool_wassertemperatur": { state: "unknown", attributes: { unit_of_measurement: "°C" }, last_changed: iso(5) } })
  );
  assert.equal(b.temp, LEER);
  assert.deepEqual(b.chips.map((c) => [c.key, c.text]), [["pH", "7,1"], ["RX", "712 mV"]]);
  assert.match(b.bild, /poolbecken_oval\.png/);
  assert.ok(b.sprites.length >= 2);
});

/* ---- Card im Mini-Modus ---- */
const MINI_SLOTS = [
  { ...MODUS_SEL, release_entity: FREI_ENT, label_text: "WP" },
  PUMP_CONFIG,
  { type: "uv", label: "UV", switch_entity: "switch.uv_lampe", power_entity: "sensor.uv_lampe_power" },
  { type: "frame", title: "leer" },
  { type: "hidden" },
  CUSTOM_BTN(),
];
const miniCard = async (extra = {}) =>
  mount(
    Dashboard,
    { view: "mini", hero: { temp_entity: "sensor.pool_wassertemperatur", ph_entity: "sensor.pool_ph" }, slots: MINI_SLOTS, ...extra },
    KIOSK_HASS()
  );
const mc = await miniCard();
const mcRoot = () => mc.shadowRoot;
check("It17 Card: mini rendert Kopf + Kacheln statt Kästen, Rahmen/hidden fallen weg", () => {
  assert.ok(mcRoot().querySelector("ha-card.mini-karte .mini"));
  assert.equal(mcRoot().querySelector(".grid"), null);
  assert.ok(mcRoot().querySelector('.m-kopf[data-mini="becken"]'));
  const k = [...mcRoot().querySelectorAll(".kachel")];
  assert.deepEqual(k.map((x) => x.dataset.mini), ["1", "2", "3", "6"]);
  assert.equal(mcRoot().querySelector(".mini").style.getPropertyValue("--m-spalten").trim(), "4");
  assert.equal(mcRoot().querySelectorAll("tomtut-pool-slot-pump, tomtut-pool-slot-heatpump").length, 0);
  assert.equal(mcRoot().querySelectorAll("button.stage-btn, .step, input[type=range]").length, 0);
});
check("It17 Card: Kachelwerte und Zustandsklassen im DOM", () => {
  const k = [...mcRoot().querySelectorAll(".kachel")];
  assert.match(k[0].textContent, /Heizen Smart/);
  assert.match(k[0].textContent, /820 W/);
  assert.ok(k[0].classList.contains("an"));
  assert.match(k[1].textContent, /N2/);
  assert.match(k[2].textContent, /An/);
  assert.match(k[2].textContent, /41 W/);
  assert.match(mcRoot().querySelector(".m-temp-wert").textContent, /24,6 °C/);
});
check("It17 Card: volle Ansicht bleibt Default (ohne view kein Mini)", () => {
  assert.ok(kAus.shadowRoot.querySelector(".grid"));
  assert.equal(kAus.shadowRoot.querySelector(".mini"), null);
});

/* Tipp auf Kachel 2 (Pumpe) */
mcRoot().querySelector('.kachel[data-mini="2"]').click();
await mc.updateComplete;
const dlg = () => mcRoot().querySelector("dialog.m-dialog");
check("It17 Tipp: öffnet den vollen Kasten der Pumpe als Dialog", () => {
  assert.ok(dlg(), "kein Dialog");
  assert.ok(dlg().open || dlg().hasAttribute("open"), "Dialog nicht offen");
  assert.equal(dlg().dataset.miniDialog, "2");
  const slot = dlg().querySelector("tomtut-pool-slot-pump");
  assert.ok(slot, "kein Pumpen-Kasten");
  assert.equal(slot.config.stage_entities.length, 3);
  assert.equal(slot.kiosk, false);
  assert.match(dlg().querySelector(".m-dialog-titel").textContent, /Poolpumpe/);
});
{
  const slot = dlg().querySelector("tomtut-pool-slot-pump");
  await slot.updateComplete;
  calls.length = 0;
  slot.shadowRoot.querySelectorAll(".stage-btn")[2].click();
  await slot.updateComplete;
  check("It17 Dialog: voll bedienbar (Stufe N3 -> turn_on)", () =>
    assert.deepEqual(calls.map((c) => [c.service, c.data.entity_id]), [["turn_on", "switch.shelly_pumpe_n3"]])
  );
}
dlg().querySelector(".m-zu").click();
await mc.updateComplete;
check("It17 Dialog: X schließt", () => assert.equal(dlg(), null));

mcRoot().querySelector('.kachel[data-mini="1"]').click();
await mc.updateComplete;
check("It17 Tipp: Kachel 1 öffnet die Wärmepumpe (Kasten-Nummer bleibt die aus dem Editor)", () => {
  assert.equal(dlg().dataset.miniDialog, "1");
  assert.ok(dlg().querySelector("tomtut-pool-slot-heatpump"));
});
dlg().querySelector(".m-dialog-inhalt").click();
await mc.updateComplete;
check("It17 Dialog: Tipp in den Inhalt schließt NICHT", () => assert.ok(dlg()));
dlg().dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
await mc.updateComplete;
check("It17 Dialog: Tipp daneben (Backdrop = der Dialog selbst) schließt", () => assert.equal(dlg(), null));

mcRoot().querySelector(".m-kopf").click();
await mc.updateComplete;
check("It17 Tipp aufs Becken öffnet den Becken-Kasten", () => {
  assert.equal(dlg().dataset.miniDialog, "becken");
  assert.ok(dlg().querySelector("tomtut-pool-hero"));
});
{
  const hero = dlg().querySelector("tomtut-pool-hero");
  await hero.updateComplete;
  const mehr = [];
  const lausch = (e) => mehr.push(e.detail.entityId);
  document.body.addEventListener("hass-more-info", lausch);
  hero.shadowRoot.querySelector(".thermo").click();
  await mc.updateComplete;
  document.body.removeEventListener("hass-more-info", lausch);
  check("It17 Dialog: more-info geht an HA durch und schließt unseren Dialog vorher", () => {
    assert.deepEqual(mehr, ["sensor.pool_wassertemperatur"]);
    assert.equal(dlg(), null);
  });
}

/* Kiosk im Dialog */
const mk = await miniCard({ kiosk: true, kiosk_slots: [2] });
mk.shadowRoot.querySelector('.kachel[data-mini="2"]').click();
await mk.updateComplete;
{
  const d = mk.shadowRoot.querySelector("dialog.m-dialog");
  const slot = d.querySelector("tomtut-pool-slot-pump");
  await slot.updateComplete;
  calls.length = 0;
  const erg = await allesAnklicken(slot);
  check("It17 Kiosk: Kasten im Dialog ist nur Anzeige (kein Dienst, kein more-info)", () => {
    assert.equal(slot.kiosk, true);
    assert.ok(slot.shadowRoot.querySelector(".slot.kiosk"));
    assert.deepEqual(calls, []);
    assert.deepEqual(erg.mehrInfo, []);
    assert.match(d.querySelector(".m-dialog-titel").textContent, /nur Anzeige/);
  });
  d.querySelector(".m-zu").click();
  await mk.updateComplete;
  mk.shadowRoot.querySelector('.kachel[data-mini="1"]').click();
  await mk.updateComplete;
  const wp = mk.shadowRoot.querySelector("dialog.m-dialog tomtut-pool-slot-heatpump");
  check("It17 Kiosk-Teilmenge: nicht gesperrter Kasten bleibt im Dialog bedienbar", () => assert.equal(wp.kiosk, false));
}
check("It17 Card: getCardSize im Mini-Modus klein", () => {
  assert.ok(mc.getCardSize() <= 5, String(mc.getCardSize()));
});

/* ---- Editor: Umschalter Voll / Mini ---- */
{
  const ed = new Editor();
  ed.setConfig({ hero: { enabled: true }, slots: [{ type: "pump" }] });
  ed.hass = makeHass();
  document.body.appendChild(ed);
  await ed.updateComplete;
  let fired = null;
  ed.addEventListener("config-changed", (e) => (fired = e.detail.config));
  const kopf = ed.shadowRoot.querySelector(".editor").firstElementChild;
  check("It17 Editor: Kopfzeile ganz oben = Ansicht-Umschalter neben dem Kiosk-Kasten", () => {
    assert.ok(kopf.classList.contains("kopf-reihe"));
    assert.deepEqual([...kopf.children].map((x) => x.className.split(" ")[0]), ["ansicht-block", "kiosk-block"]);
    assert.match(kopf.textContent, /Ansicht/);
    const k = [...kopf.querySelectorAll("[data-ansicht]")];
    assert.deepEqual(k.map((x) => [x.dataset.ansicht, x.textContent.trim(), x.classList.contains("aktiv")]), [
      ["voll", "Voll", true],
      ["mini", "Mini", false],
    ]);
  });
  kopf.querySelector('[data-ansicht="mini"]').click();
  await ed.updateComplete;
  check("It17 Editor: Mini -> view: mini", () => {
    assert.equal(fired.view, "mini");
    assert.ok(ed.shadowRoot.querySelector('[data-ansicht="mini"]').classList.contains("aktiv"));
  });
  ed.shadowRoot.querySelector('[data-ansicht="voll"]').click();
  await ed.updateComplete;
  check("It17 Editor: Voll -> Schlüssel view fällt weg (Default)", () => assert.equal("view" in fired, false));
  ed.remove();
}

/* ---- It17-Zusatz: mini_show / mini_hidden ---- */

check("It17 mini_show: Schlüssel je Typ wie vereinbart", () => {
  const k = (t) => pkg.MINI_WERTE[t].map(([x]) => x);
  assert.deepEqual(k("pump"), ["stufe", "watt", "temp", "status"]);
  assert.deepEqual(k("heatpump"), ["modus", "watt", "ist", "soll", "freigabe", "status"]);
  assert.deepEqual(k("solar"), ["vorlauf", "ruecklauf", "watt", "status"]);
  assert.deepEqual(k("uv"), ["status", "watt", "temp"]);
  assert.deepEqual(k("hero"), ["temp", "ph", "rx", "zulauf"]);
  assert.equal(pkg.MINI_WERTE_EMPFOHLEN, 3);
});
check("It17 mini_show: Standard = 1–2 Werte, nur was eine Quelle hat", () => {
  assert.deepEqual(pkg.miniWahl(PUMP_CONFIG).standard, ["stufe", "watt"]);
  assert.deepEqual(pkg.miniWahl({ ...MODUS_SEL }).standard, ["modus", "watt"]);
  assert.deepEqual(pkg.miniWahl(SOLAR_MINI).standard, ["vorlauf", "ruecklauf"]);
  assert.deepEqual(pkg.miniWahl({ type: "uv", switch_entity: "switch.uv_lampe" }).standard, ["status"]);
  assert.deepEqual(pkg.miniWahl({ type: "uv", switch_entity: "x", temp_entity: "y" }).standard, ["status", "temp"]);
  assert.deepEqual(pkg.miniWahl(CUSTOM_BTN()).standard, ["1"]);
  assert.deepEqual(
    pkg.miniWahl({ temp_entity: "a", rx_entity: "b" }, "hero").verfuegbar.map(([x]) => x),
    ["temp", "rx"]
  );
  /* ohne Quelle nicht wählbar */
  assert.deepEqual(pkg.miniWahl({ type: "uv", switch_entity: "x" }).verfuegbar.map(([x]) => x), ["status"]);
});
check("It17 mini_show: Reihenfolge der Liste, unbekannte/ungedeckte Schlüssel fallen weg", () => {
  const w = pkg.miniWahl({ ...PUMP_CONFIG, mini_show: ["status", "WATT", "quatsch", "temp"] });
  assert.deepEqual(w.gewaehlt, ["watt", "temp", "status"]);
  assert.equal(w.eigen, true);
});
check("It17 mini_show Pumpe: temp + status", () => {
  const k = pkg.miniKachel({ ...PUMP_CONFIG, mini_show: ["temp", "status"] }, makeHass());
  assert.deepEqual(zeilen(k), ["27,4 °C", "An"]);
});
check("It17 mini_show WP: alle sechs Werte, Ist/Soll mit Vorsatz, Freigabe als Warnung", () => {
  const cfg = { ...MODUS_SEL, release_entity: FREI_ENT, mini_show: ["modus", "watt", "ist", "soll", "freigabe", "status"] };
  const k = pkg.miniKachel(cfg, selHass("Heizen Smart", { [FREI_ENT]: { state: "off", attributes: {}, last_changed: iso(60) } }));
  assert.deepEqual(zeilen(k), ["Heizen Smart", "820 W", "26,4 °C", "28 °C", "Gesperrt", "Gesperrt"]);
  assert.deepEqual(k.zeilen.map((z) => z.name || ""), ["", "", "Ist", "Soll", "", ""]);
  assert.equal(k.zeilen[4].warn, true);
  assert.equal(pkg.miniDichte(k.zeilen.length), "eng");
  assert.deepEqual([1, 2, 3, 4].map(pkg.miniDichte), ["normal", "normal", "dicht", "eng"]);
});
check("It17 mini_show Solar: watt + status statt Temperaturen", () => {
  const k = pkg.miniKachel({ ...SOLAR_MINI, power_entity: "sensor.poolpumpe_power", mini_show: ["watt", "status"] }, solarMiniHass("20"));
  assert.deepEqual(zeilen(k), ["737 W", "An"]);
});
check("It17 mini_show UV: temp statt Watt", () => {
  const k = pkg.miniKachel({ type: "uv", switch_entity: "switch.uv_lampe", temp_entity: "sensor.uv_lampe_temperatur", mini_show: ["temp"] }, makeHass());
  assert.deepEqual(zeilen(k), ["31,2 °C"]);
});
check("It17 mini_show custom: Einträge 1 und 3 als Zeilen mit Namen", () => {
  const cfg = {
    type: "custom",
    entries: [
      { kind: "entity", entity: "sensor.pool_lufttemperatur", label: "Luft" },
      { kind: "button", entity: "switch.poolbeleuchtung", label: "Licht" },
      { kind: "entity", entity: "sensor.pool_ph", label: "pH" },
    ],
    mini_show: [1, 3],
  };
  const k = pkg.miniKachel(cfg, makeHass());
  assert.deepEqual(zeilen(k), ["21,3 °C", "7,1"]);
  assert.deepEqual(k.zeilen.map((z) => z.name), ["Luft", "pH"]);
});
check("It17 mini_show Becken: nur temp + rx", () => {
  const b = pkg.miniBecken(
    { temp_entity: "sensor.pool_wassertemperatur", ph_entity: "sensor.pool_ph", rx_entity: "sensor.pool_redox", mini_show: ["temp", "rx"] },
    makeHass()
  );
  assert.equal(b.temp, "24,6 °C");
  assert.deepEqual(b.chips.map((c) => c.key), ["RX"]);
  const b2 = pkg.miniBecken({ temp_entity: "sensor.pool_wassertemperatur", ph_entity: "sensor.pool_ph", mini_show: ["ph"] }, makeHass());
  assert.equal(b2.temp, null);
});
{
  const card = await mount(
    Dashboard,
    {
      view: "mini",
      hero: { temp_entity: "sensor.pool_wassertemperatur" },
      slots: [
        { ...PUMP_CONFIG, mini_hidden: true },
        { ...MODUS_SEL, mini_show: ["modus", "watt", "ist", "soll"] },
        { type: "uv", switch_entity: "switch.uv_lampe", power_entity: "sensor.uv_lampe_power" },
      ],
    },
    makeHass()
  );
  const k = [...card.shadowRoot.querySelectorAll(".kachel")];
  check("It17 mini_hidden: Kachel fehlt, Nummern bleiben die aus dem Editor", () => {
    assert.deepEqual(k.map((x) => x.dataset.mini), ["2", "3"]);
    assert.equal(card.shadowRoot.querySelector(".mini").style.getPropertyValue("--m-spalten").trim(), "2");
  });
  check("It17 mini_show im DOM: 4 Werte -> dichte-eng, Namen als k-name", () => {
    assert.ok(k[0].classList.contains("dichte-eng"));
    assert.equal(k[0].querySelectorAll(".k-zeile").length, 4);
    assert.deepEqual([...k[0].querySelectorAll(".k-name")].map((x) => x.textContent), ["Ist", "Soll"]);
    assert.ok(k[1].classList.contains("dichte-normal"));
  });
  card.setConfig({ view: "mini", hero: { temp_entity: "sensor.pool_wassertemperatur", mini_hidden: true }, slots: [PUMP_CONFIG] });
  await card.updateComplete;
  check("It17 mini_hidden am Becken: kein Kopf", () => assert.equal(card.shadowRoot.querySelector(".m-kopf"), null));
  card.remove();
}

/* ---- Editor: "In Mini anzeigen" ---- */
{
  const ed = new Editor();
  const basis = { hero: { enabled: true, temp_entity: "sensor.a", ph_entity: "sensor.b" }, slots: [{ ...PUMP_CONFIG }, { type: "frame" }] };
  ed.setConfig(basis);
  ed.hass = makeHass();
  document.body.appendChild(ed);
  await ed.updateComplete;
  let fired = null;
  ed.addEventListener("config-changed", (e) => {
    fired = e.detail.config;
    ed.setConfig(fired);
  });
  check("It17 Editor: 'In Mini anzeigen' fehlt in der vollen Ansicht", () =>
    assert.equal(ed.shadowRoot.querySelectorAll(".mini-wahl").length, 0)
  );
  ed.shadowRoot.querySelector('[data-ansicht="mini"]').click();
  await ed.updateComplete;
  const wahl = (typ) => ed.shadowRoot.querySelector(`.mini-wahl[data-mini-wahl="${typ}"]`);
  check("It17 Editor: bei Mini je Kasten eine Gruppe (Becken + Pumpe, nicht der leere Rahmen)", () => {
    assert.deepEqual([...ed.shadowRoot.querySelectorAll(".mini-wahl")].map((x) => x.dataset.miniWahl), ["hero", "pump"]);
    const boxen = [...wahl("pump").querySelectorAll("[data-mini-show]")];
    assert.deepEqual(boxen.map((b) => [b.dataset.miniShow, b.checked]), [
      ["stufe", true],
      ["watt", true],
      ["temp", false],
      ["status", false],
    ]);
    assert.match(wahl("pump").textContent, /In Mini anzeigen/);
    assert.deepEqual([...wahl("hero").querySelectorAll("[data-mini-show]")].map((b) => b.dataset.miniShow), ["temp", "ph"]);
  });
  const klickBox = async (typ, key) => {
    const b = wahl(typ).querySelector(`[data-mini-show="${key}"]`);
    b.checked = !b.checked;
    b.dispatchEvent(new dom.window.Event("change"));
    await ed.updateComplete;
  };
  await klickBox("pump", "temp");
  check("It17 Editor: Haken bei Temperatur -> mini_show [stufe, watt, temp]", () =>
    assert.deepEqual(fired.slots[0].mini_show, ["stufe", "watt", "temp"])
  );
  check("It17 Editor: 3 Werte noch ohne Warnung", () => assert.equal(wahl("pump").querySelector(".mini-wahl-warnung"), null));
  await klickBox("pump", "status");
  check("It17 Editor: 4 Werte -> Warnung (Schrift wird kleiner, nichts abgeschnitten)", () => {
    const w = wahl("pump").querySelector(".mini-wahl-warnung");
    assert.ok(w);
    assert.match(w.textContent, /4 Werte/);
    assert.match(w.textContent, /abgeschnitten wird nichts/);
  });
  await klickBox("pump", "temp");
  await klickBox("pump", "status");
  check("It17 Editor: zurück auf den Standard -> mini_show fällt weg", () => assert.equal("mini_show" in fired.slots[0], false));
  await klickBox("hero", "ph");
  check("It17 Editor: Becken ohne pH -> hero.mini_show [temp]", () => assert.deepEqual(fired.hero.mini_show, ["temp"]));
  {
    const b = wahl("pump").querySelector("[data-mini-hidden]");
    b.checked = false;
    b.dispatchEvent(new dom.window.Event("change"));
    await ed.updateComplete;
  }
  check("It17 Editor: 'Als Kachel zeigen' aus -> mini_hidden: true, Werte-Haken verschwinden", () => {
    assert.equal(fired.slots[0].mini_hidden, true);
    assert.equal(wahl("pump").querySelectorAll("[data-mini-show]").length, 0);
  });
  {
    const b = wahl("pump").querySelector("[data-mini-hidden]");
    b.checked = true;
    b.dispatchEvent(new dom.window.Event("change"));
    await ed.updateComplete;
  }
  check("It17 Editor: wieder an -> mini_hidden fällt weg", () => assert.equal("mini_hidden" in fired.slots[0], false));
  ed.remove();
}

check("It17 Kachel WP: Steckdose an, climate off (Standby) -> 'Aus', grau", () => {
  const k = pkg.miniKachel(
    MODUS_SEL,
    selHass("Heizen Smart", {
      "climate.waermepumpe": { state: "off", attributes: { temperature: 28, current_temperature: 26.4 }, last_changed: iso(60) },
    })
  );
  assert.deepEqual(zeilen(k), ["Aus", "820 W"]);
  assert.equal(k.zustand, "aus");
});

/* ------------------------------------------------------------------ */
/* Iteration 18: climate aus = Aus überall, Solar active_entity, Punkt */
/* ------------------------------------------------------------------ */
{
  const klimaAusHass = () =>
    selHass("Heizen Boost", {
      "climate.waermepumpe": { state: "off", attributes: { temperature: 32, current_temperature: 23.6 }, last_changed: iso(60) },
    });
  check("It18 klimaAus: zentrale Regel (climate off = aus, unknown nicht)", () => {
    const h = klimaAusHass();
    assert.equal(pkg.klimaAus(MODUS_SEL, h), true);
    assert.equal(pkg.klimaAus({ switch_entity: "switch.waermepumpe" }, h), false);
    assert.equal(pkg.klimaAus(MODUS_SEL, selHass("x")), false);
    const u = selHass("x", { "climate.waermepumpe": { state: "unavailable", attributes: {}, last_changed: iso(5) } });
    assert.equal(pkg.klimaAus(MODUS_SEL, u), false);
  });
  const wp = await mountSlotTyp({ ...MODUS_SEL, fan_color_mode: "modus" }, klimaAusHass());
  const sr = wp.shadowRoot;
  check("It18 voller Kasten: climate off -> Badge 'Aus' grau, Rad steht", () => {
    assert.equal(sr.querySelector(".mode-badge .val").textContent.trim(), "Aus");
    assert.ok(sr.querySelector(".mode-badge").classList.contains("aus"));
    assert.ok(!sr.querySelector(".fan-overlay").classList.contains("spinning"));
  });
  check("It18 voller Kasten: Steckdose an + climate off -> Powerbutton 'standby' mit Hinweis", () => {
    const k = sr.querySelector(".power-badge");
    assert.ok(k.classList.contains("on") && k.classList.contains("standby"));
    assert.match(k.querySelector(".power-hinweis").textContent, /Strom an\s*WP aus/);
    assert.match(k.getAttribute("title"), /Steckdose an, Wärmepumpe aus/);
  });
  check("It18 Mini-Kachel und voller Kasten sagen dasselbe", () => {
    const k = pkg.miniKachel(MODUS_SEL, klimaAusHass());
    assert.equal(k.zeilen[0].text, sr.querySelector(".mode-badge .val").textContent.trim());
    assert.equal(k.zustand, "aus");
  });
  const wpAn = await mountSlotTyp(MODUS_SEL, selHass("Heizen Smart"));
  check("It18: climate heat -> kein Standby, Badge wie bisher", () => {
    assert.ok(!wpAn.shadowRoot.querySelector(".power-badge").classList.contains("standby"));
    assert.equal(wpAn.shadowRoot.querySelector(".power-hinweis"), null);
    assert.match(wpAn.shadowRoot.querySelector(".mode-badge").textContent, /Heizen Smart/);
  });
  calls.length = 0;
  wp._onPowerClick();
  await wp.updateComplete;
  check("It18: Powerbutton schaltet im Standby weiter die Steckdose (mit Rückfrage)", () =>
    assert.ok(wp.shadowRoot.querySelector(".confirm-overlay"))
  );
}
{
  const s = (st) => ({ state: st, attributes: {}, last_changed: iso(60) });
  const SOL = { type: "solar", switch_entity: "switch.solarventil", active_entity: "binary_sensor.ventil_an", temp_in_entity: "sensor.solar_vorlauf" };
  check("It18 Solar: Steuerung an, Ventil auf Bypass -> aus (roter Punkt)", () => {
    const h = makeHass({ "switch.solarventil": s("on"), "binary_sensor.ventil_an": s("off") });
    assert.equal(pkg.solarAktiv(SOL, h), false);
    assert.equal(pkg.miniKachel(SOL, h).zustand, "aus");
  });
  check("It18 Solar: Ventil an -> an; ohne active_entity zählt der Schalter", () => {
    assert.equal(pkg.miniKachel(SOL, makeHass({ "switch.solarventil": s("off"), "binary_sensor.ventil_an": s("on") })).zustand, "an");
    const ohne = { ...SOL, active_entity: undefined };
    assert.equal(pkg.miniKachel(ohne, makeHass({ "switch.solarventil": s("off") })).zustand, "aus");
    assert.equal(pkg.miniKachel(ohne, makeHass({ "switch.solarventil": s("on") })).zustand, "an");
  });
  check("It18 Punkt: unknown / kein Schalter -> neutral (grau)", () => {
    assert.equal(pkg.miniKachel(SOL, makeHass({ "switch.solarventil": s("on"), "binary_sensor.ventil_an": s("unknown") })).zustand, "neutral");
    assert.equal(pkg.miniKachel({ type: "uv", power_entity: "sensor.uv_lampe_power" }, makeHass()).zustand, "neutral");
    assert.equal(pkg.miniKachel({ type: "uv", switch_entity: "switch.fehlt" }, makeHass()).zustand, "neutral");
  });
  const c = await mount(Dashboard, { view: "mini", hero: { enabled: false }, slots: [{ type: "uv", power_entity: "sensor.uv_lampe_power" }] }, makeHass());
  check("It18 Punkt: auch neutrale Kacheln haben einen (grauen) Punkt", () => {
    const p = c.shadowRoot.querySelector(".kachel.neutral .k-status");
    assert.ok(p);
    assert.equal(p.title, "unbekannt");
    assert.match(cssOf("tomtut-pool-dashboard"), /\.kachel\.neutral \.k-status\s*\{[^}]*background:\s*var\(--tt-line\)/);
  });
  c.remove();
}
{
  const c = await mount(
    Dashboard,
    { view: "mini", hero: { temp_entity: "sensor.pool_wassertemperatur", ph_entity: "sensor.pool_ph" }, slots: [] },
    makeHass({ "sensor.pool_wassertemperatur": { state: "unknown", attributes: {}, last_changed: iso(5) } })
  );
  check("It18 Kopf: unknown-Temperatur dezent ('Wasser –'), kein großer Kasten", () => {
    const t = c.shadowRoot.querySelector(".m-temp");
    assert.ok(t.classList.contains("leer"));
    assert.equal(c.shadowRoot.querySelector(".m-temp-wert"), null);
    assert.match(t.textContent.replace(/\s+/g, " "), /Wasser\s*–/);
  });
  c.remove();
}

/* ------------------------------------------------------------------ */

console.log(results.join("\n"));
console.log(
  process.exitCode ? "\nSmoke-Test FEHLGESCHLAGEN" : `\nSmoke-Test ok (${results.length} Checks)`
);
