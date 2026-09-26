/*
 * Snapshot-Test gegen Thomas' echte Configs (seit Iteration 22).
 *
 * Leitplanke für jede Iteration nach 21: bestehende Configs sehen identisch
 * aus. Dieser Test rendert die Pool-Cards aus Thomas' Produktiv-Dashboards
 * (test/fixtures/prod-configs.json: "TomTuT Studio" in Mini, "Kiosk Flur"
 * mit drei Cards) in den Breiten, in denen sie dort stehen, und vergleicht
 * die Lage jedes sichtbaren Elements (Bild, Kästchen, Taster, Kacheln …)
 * mit dem eingefrorenen Stand in test/fixtures/prod-snapshot.json.
 * Verglichen wird die Geometrie (1 px Toleranz), nicht die Farbe — Kontrast-
 * Korrekturen sind erlaubt, verrutschte Layouts nicht.
 *
 * Bewusst neu geschrieben (Iteration 26): die drei Kiosk-Flur-Cards haben
 * jetzt den HA-Kartenrand und 16 px Innenabstand (Listen-Titel 5 px tiefer,
 * Pumpenbild 243 statt 255 px breit, Card 10 px höher) — im echten HA mit
 * Liquid Glass verglichen: gleiche Optik bzw. die Pumpe jetzt im Glas-Look
 * wie die Nachbarkarten. Studio-Mini unverändert (0 px).
 *
 * Referenz neu schreiben (nur bewusst, z.B. mit dem Bundle eines alten
 * Stands):  SNAPSHOT_UPDATE=1 [SNAPSHOT_DIST=/pfad/zu/tomtut-pool-cards.js] node test/prod-snapshot.mjs
 */
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const wurzel = join(here, "..");
const REFERENZ = join(here, "fixtures", "prod-snapshot.json");
const UPDATE = process.env.SNAPSHOT_UPDATE === "1";
const DIST = process.env.SNAPSHOT_DIST || join(wurzel, "dist", "tomtut-pool-cards.js");

if (process.env.SKIP_RENDER_TEST === "1") {
  console.log("Snapshot-Test uebersprungen (SKIP_RENDER_TEST=1)");
  process.exit(0);
}

const { chromium } = await import("playwright");
const PROD = JSON.parse(await readFile(join(here, "fixtures", "prod-configs.json"), "utf8"));

const results = [];
const checkAsync = async (name, fn) => {
  try {
    await fn();
    results.push(`  ok   ${name}`);
  } catch (err) {
    results.push(`  FAIL ${name}\n       ${err.message}`);
    process.exitCode = 1;
  }
};

const MIME = {
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".json": "application/json",
  ".woff2": "font/woff2",
};

const SEITE = `<!doctype html>
<html lang="de"><head><meta charset="utf-8">
<style>
  body { margin: 0; background: #0a1a35; font-family: "Roboto", system-ui, sans-serif; }
  @font-face { font-family: "Roboto"; font-weight: 400; src: url("/test/fixtures/fonts/Roboto-Regular.woff2") format("woff2"); }
  @font-face { font-family: "Roboto"; font-weight: 500 600; src: url("/test/fixtures/fonts/Roboto-Medium.woff2") format("woff2"); }
  @font-face { font-family: "Roboto"; font-weight: 700 900; src: url("/test/fixtures/fonts/Roboto-Bold.woff2") format("woff2"); }
</style>
<script>
  /* ha-card wie in Home Assistant: Look über :host im eigenen Shadow-Root,
     damit die Regeln der Card (außen) gewinnen — genau wie im echten HA */
  customElements.define("ha-card", class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" }).innerHTML =
        "<style>:host{display:block;background:var(--ha-card-background,var(--card-background-color,#fff));" +
        "border-radius:var(--ha-card-border-radius,12px);border-width:var(--ha-card-border-width,1px);border-style:solid;" +
        "border-color:var(--ha-card-border-color,var(--divider-color,#e0e0e0));box-shadow:var(--ha-card-box-shadow,none);" +
        "color:var(--primary-text-color)}</style><slot></slot>";
    }
  });
  customElements.define("ha-icon", class extends HTMLElement {
    connectedCallback() {
      this.style.display = "inline-block";
      this.style.width = "var(--mdc-icon-size, 24px)";
      this.style.height = "var(--mdc-icon-size, 24px)";
    }
  });
</script>
<script type="module">
  await import("/bundle.js");
  window.bereit = true;
</script>
</head><body></body></html>`;

const server = createServer(async (req, res) => {
  let pfad = decodeURIComponent((req.url || "/").split("?")[0]);
  if (pfad === "/" || pfad === "/seite") {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(SEITE);
    return;
  }
  let datei;
  if (pfad === "/bundle.js") datei = DIST;
  else if (pfad.startsWith("/local/community/tomtut-pool-cards/")) datei = join(wurzel, "dist", pfad.split("/").pop());
  else datei = join(wurzel, normalize(pfad).replace(/^(\.\.(\/|\\|$))+/, ""));
  try {
    const buf = await readFile(datei);
    res.writeHead(200, { "content-type": MIME[extname(datei)] || "application/octet-stream" });
    res.end(buf);
  } catch {
    res.writeHead(404);
    res.end("nicht gefunden");
  }
});
await new Promise((fertig) => server.listen(0, "127.0.0.1", fertig));
const basis = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1340, height: 800 }, deviceScaleFactor: 1 });
await page.goto(`${basis}/seite`);
await page.waitForFunction(() => window.bereit === true, null, { timeout: 15000 });

/* Die Fälle: Card + Breite, so wie sie in den Dashboards stehen */
const studio = PROD["tomtutstudio-thomas-20260926.yaml"][0];
const flur = PROD["kioskflur-nachher2.yaml"];
const FAELLE = [
  { name: "studio-mini-500", config: studio, breite: 500 },
  { name: "studio-mini-380", config: studio, breite: 380 },
  { name: "flur-heizsteuerung-400", config: flur[0], breite: 400 },
  { name: "flur-poolschalter-400", config: flur[1], breite: 400 },
  { name: "flur-pumpe-420", config: flur[2], breite: 420 },
  { name: "flur-pumpe-360", config: flur[2], breite: 360 },
];

const messen = (config, breite) =>
  page.evaluate(
    async ({ config, breite }) => {
      const t = (sek) => new Date(Date.now() - sek * 1000).toISOString();
      const s = (state, unit, sek = 600) => ({
        state: String(state),
        attributes: unit ? { unit_of_measurement: unit } : {},
        last_changed: t(sek),
      });
      const hass = {
        language: "de",
        config: { unit_system: { temperature: "°C" } },
        callService() {},
        states: {
          "sensor.poollampe_zigbee_poollampe_zigbee_temperatur_skimmer": s(24.6, "°C"),
          "sensor.poollampe_zigbee_poollampe_zigbee_temperatur_einlaufduse": s(25.1, "°C"),
          "sensor.tomtut_dosieranlage_vigipool_ph": s(7.2),
          "sensor.tomtut_dosieranlage_vigipool_orp_redox": s(694, "mV"),
          "switch.shelly_pumpe_n1": s("off", null, 50000),
          "switch.shelly_pumpe_n2": s("off", null, 2000),
          "switch.shelly_pumpe_n3": s("off", null, 9000),
          "switch.shelly_pumpe_stopp": s("off", null, 90000),
          "switch.poolpumpe": s("on", null, 90000),
          "sensor.poolpumpe_power": s(271, "W", 60),
          "sensor.temperaturfuehler_poolpumpe_druckseite_temperature": s(26.3, "°C"),
          "switch.shelly2pm_pool_waermepumpe": s("on", null, 9000),
          "sensor.shelly2pm_pool_waermepumpe_power": s(1840, "W", 60),
          "climate.inverpower_green_inverpower_green": {
            state: "heat",
            attributes: { temperature: 28, current_temperature: 26.4, target_temp_step: 1, min_temp: 8, max_temp: 40 },
            last_changed: t(3000),
          },
          "select.inverpower_green_inverpower_green_modus": {
            state: "Heizen Smart",
            attributes: { options: ["Heizen Smart", "Heizen Silent", "Heizen Power", "Kuehlen Smart", "Auto"] },
            last_changed: t(3000),
          },
          "switch.pooltechnik_pool_wp_freigabekontakt": s("on", null, 7000),
          "switch.uvc_desinfektion": s("on", null, 7000),
          "sensor.pooltechnik_4pm_switch_2_power": s(41, "W"),
          "switch.solarsteuerung_switch": s("on", null, 7000),
          "binary_sensor.solarheizung_motorventil_an": s("off", null, 7000),
          "sensor.solarheizung_motorventil_solarheizung_ausgang_temperature": s(29.8, "°C"),
          "sensor.solarheizung_motorventil_temperature": s(24.1, "°C"),
          "input_boolean.poolwp_pv_logik_aktivieren": s("on"),
          "input_boolean.poolwp_manuell_ein": s("off"),
          "sensor.solarheizung_status": s("Bypass"),
          "switch.poolroboter_switch_0": s("off"),
          "switch.gsa_zigbee": s("off"),
          "switch.poollampe_zigbee": s("on"),
          "input_boolean.pool_manuell_reinigen": s("off"),
        },
      };
      document.body.innerHTML = "";
      const buehne = document.createElement("div");
      buehne.style.width = breite + "px";
      document.body.appendChild(buehne);
      const card = document.createElement("tomtut-pool-dashboard");
      card.setConfig(config);
      card.hass = hass;
      buehne.appendChild(card);
      await card.updateComplete;
      /* alle Shadow-Roots fertig rendern lassen, Bilder laden */
      const alle = [];
      const sammle = (root) => {
        for (const el of root.querySelectorAll("*")) {
          if (el.shadowRoot) {
            alle.push(el);
            sammle(el.shadowRoot);
          }
        }
      };
      sammle(card.shadowRoot);
      await Promise.all(alle.map((el) => el.updateComplete));
      const bilder = [card, ...alle].flatMap((el) => [...el.shadowRoot.querySelectorAll("img")]);
      await Promise.all(
        bilder.map((img) =>
          img.complete && img.naturalWidth > 0
            ? null
            : new Promise((f) => {
                img.addEventListener("load", f, { once: true });
                img.addEventListener("error", f, { once: true });
              })
        )
      );
      await document.fonts.ready;
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      const TEILE =
        "img, .bild-flaeche, .power-badge, .value-box, .thermo, .fan-overlay, .flow-arrow," +
        " .label-badge, .chem-box, .stage-btn, .slot-title, .release-badge, .mode-badge," +
        " .zeile, .kachel, .m-kopf, .m-becken, .m-chip, .m-temp, .k-bild, .k-werte, .k-zeile, .slot";
      const basisR = card.getBoundingClientRect();
      const masse = {};
      const zaehler = {};
      const lauf = (root, pfad) => {
        for (const el of root.querySelectorAll(TEILE)) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue;
          const klasse = String(el.getAttribute("class") || "").trim().split(/\s+/)[0] || "";
          const key = `${pfad}>${el.tagName.toLowerCase()}${klasse ? "." + klasse : ""}`;
          zaehler[key] = (zaehler[key] || 0) + 1;
          masse[`${key}#${zaehler[key]}`] = [
            Math.round(r.left - basisR.left),
            Math.round(r.top - basisR.top),
            Math.round(r.width),
            Math.round(r.height),
          ];
        }
        for (const el of root.querySelectorAll("*")) {
          if (el.shadowRoot) lauf(el.shadowRoot, `${pfad}/${el.tagName.toLowerCase()}`);
        }
      };
      lauf(card.shadowRoot, "card");
      masse.hoehe = [0, 0, Math.round(basisR.width), Math.round(basisR.height)];
      return masse;
    },
    { config, breite }
  );

const TOLERANZ = 1;
const ergebnis = {};
for (const fall of FAELLE) ergebnis[fall.name] = await messen(fall.config, fall.breite);

if (UPDATE) {
  /* eine Zeile je Element — lesbare Diffs */
  const zeilen = Object.entries(ergebnis).map(
    ([fall, m]) =>
      ` ${JSON.stringify(fall)}: {\n` +
      Object.entries(m)
        .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)}`)
        .join(",\n") +
      "\n }"
  );
  await writeFile(REFERENZ, "{\n" + zeilen.join(",\n") + "\n}\n");
  console.log(`Referenz geschrieben: ${REFERENZ} (${FAELLE.length} Fälle, Bundle ${DIST})`);
} else {
  const referenz = JSON.parse(await readFile(REFERENZ, "utf8"));
  for (const fall of FAELLE) {
    await checkAsync(`Prod-Snapshot ${fall.name}: jedes Element liegt wie im Referenzstand (±${TOLERANZ} px)`, async () => {
      const soll = referenz[fall.name];
      const ist = ergebnis[fall.name];
      assert.ok(soll, "keine Referenz für diesen Fall");
      const abw = [];
      for (const [k, v] of Object.entries(soll)) {
        const w = ist[k];
        if (!w) abw.push(`${k} fehlt`);
        else if (v.some((x, i) => Math.abs(x - w[i]) > TOLERANZ)) abw.push(`${k}: soll ${v.join("/")} ist ${w.join("/")}`);
      }
      for (const k of Object.keys(ist)) if (!soll[k]) abw.push(`${k} ist neu`);
      assert.deepEqual(abw, [], "\n       " + abw.slice(0, 12).join("\n       "));
    });
  }
}

await browser.close();
server.close();
if (!UPDATE) {
  console.log(results.join("\n"));
  console.log(process.exitCode ? "\nSnapshot-Test FEHLGESCHLAGEN" : `\nSnapshot-Test ok (${results.length} Fälle)`);
}
