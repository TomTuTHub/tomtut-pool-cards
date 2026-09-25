/*
 * Render-Test im echten Browser — die Ergänzung zum jsdom-Smoke-Test.
 *
 * jsdom kennt kein Layout: dort sieht ein Bild, das aus seinem Kasten
 * herausragt, genauso aus wie eines, das sitzt. Genau dieser Fehler war der
 * Anlass (Iteration 6: die gedrehte UV-Lampe legte sich über die
 * Nachbar-Cards). Deshalb läuft die gebaute Card hier in Chromium, mit
 * echten Bildern, und jede Position wird gemessen statt behauptet:
 *
 *   1. Bild und alle Overlays liegen vollständig in ihrer Slot-Box (1 px).
 *   2. Kein Slot ist höher als das 1,6-fache seiner Breite.
 *
 * Seit Iteration 7 kommen zwei Messungen dazu: die frei einstellbare Größe
 * der UV-Lampe (mal Drehung — beides zusammen darf nie herausragen) und die
 * zwei Richtungsmarker des Solarfelds.
 *
 * Geprüft wird in drei Breiten (360 / 768 / 1200 px — eine Spalte, zwei,
 * drei) und mit der UV-Lampe in zehn Lagen (0/45/90/180/270 Grad, jeweils
 * mit und ohne Spiegelung); alle anderen Slot-Typen sind in jedem Durchgang
 * dabei.
 *
 * Voraussetzung: `npm i` (playwright) + `npx playwright install chromium`.
 * Ohne Chromium abschaltbar mit SKIP_RENDER_TEST=1 (auf der Werkbank 229
 * läuft er).
 */
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, rm } from "node:fs/promises";
import { dirname, join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { UV_LAGEN, UV_GROESSEN } from "./fixtures/demo.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const wurzel = join(here, "..");
const ausgabe = join(here, "render-out");
/* Beleg für die Karte im Studio-Cockpit (ka-973 "TomTuT Pool Dashboard",
   seit 21.09.2026 eigener Vorgang, vorher ka-839). Fehlt der Ordner, wird
   der Beleg übersprungen — der Test hängt nicht am NAS. */
const BELEG =
  process.env.RENDER_BELEG ||
  "/mnt/nas/proxmox-container/studio/vorgaenge/ka-973/pool-cards-it9-render.png";

if (process.env.SKIP_RENDER_TEST === "1") {
  console.log("Render-Test uebersprungen (SKIP_RENDER_TEST=1)");
  process.exit(0);
}

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch (err) {
  console.error(
    "Render-Test: playwright fehlt — 'npm i' und 'npx playwright install chromium' ausfuehren.\n" +
      "  (" + (err?.message || err) + ")"
  );
  process.exit(1);
}

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

/* Auch ein Schritt, der im Browser platzt, ist ein Testergebnis und kein
   Absturz — sonst steht am Ende nichts da, was man lesen koennte. */
const checkAsync = async (name, fn) => {
  try {
    await fn();
    results.push(`  ok   ${name}`);
  } catch (err) {
    results.push(`  FAIL ${name}\n       ${err.message}`);
    process.exitCode = 1;
  }
};

/* ------------------------------------------------------------------ */
/* Kleiner Dateiserver: dist/, test/ und der HA-Pfad /local/community/ */
/* ------------------------------------------------------------------ */

const MIME = {
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".json": "application/json",
};

const SEITE = `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><title>tomtut-pool-cards — Render-Test</title>
<style>
  body { margin: 0; background: #eceff1; font-family: system-ui, sans-serif; }
  .buehne { margin: 0 auto; }
  .kopf { font: 600 13px/1.6 system-ui; color: #37474f; padding: 10px 0 4px; }
</style>
<script>
  /* Platzhalter fuer die beiden HA-Elemente, die die Card benutzt. Sie
     stylen sich selbst per Inline-Stil — nur so wirkt es auch in den
     Shadow-Roots der Slots. Groesse = die des Originals. */
  customElements.define("ha-card", class extends HTMLElement {
    connectedCallback() { this.style.display = "block"; }
  });
  customElements.define("ha-icon", class extends HTMLElement {
    connectedCallback() {
      this.style.display = "inline-block";
      this.style.width = "var(--mdc-icon-size, 24px)";
      this.style.height = "var(--mdc-icon-size, 24px)";
      this.style.background = "currentColor";
      this.style.borderRadius = "20%";
    }
  });
</script>
<script type="module">
  import * as demo from "/test/fixtures/demo.mjs";
  await import("/dist/tomtut-pool-cards.js");
  window.demo = demo;
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
  /* So liegen die Bilder auch in Home Assistant */
  if (pfad.startsWith("/local/community/tomtut-pool-cards/")) {
    pfad = "/dist/" + pfad.split("/").pop();
  }
  const datei = join(wurzel, normalize(pfad).replace(/^(\.\.(\/|\\|$))+/, ""));
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

/* ------------------------------------------------------------------ */
/* Browser                                                             */
/* ------------------------------------------------------------------ */

await rm(ausgabe, { recursive: true, force: true });
await mkdir(ausgabe, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1320, height: 1000 }, deviceScaleFactor: 1 });
const konsolenfehler = [];
page.on("pageerror", (err) => konsolenfehler.push(String(err?.message || err)));
page.on("console", (msg) => {
  if (msg.type() === "error") konsolenfehler.push(msg.text());
});
await page.goto(`${basis}/seite`);
await page.waitForFunction(() => window.bereit === true, null, { timeout: 15000 });

/*
 * Baut eine Bühne fester Breite, rendert die Alles-Config darin und misst.
 * Rückgabe: Liste der Beanstandungen (leer = alles sitzt).
 */
const bauenUndMessen = (breite, grad, mirror) =>
  page.evaluate(
    async ({ breite, grad, mirror }) => {
      document.body.innerHTML = "";
      const buehne = document.createElement("div");
      buehne.className = "buehne";
      buehne.id = "buehne";
      buehne.style.width = breite + "px";
      document.body.appendChild(buehne);

      const card = document.createElement("tomtut-pool-dashboard");
      card.setConfig(window.demo.allesConfig(grad, mirror));
      card.hass = window.demo.DEMO_HASS;
      buehne.appendChild(card);
      await card.updateComplete;

      const kinder = [...card.shadowRoot.querySelector(".grid").children];
      await Promise.all(kinder.map((el) => el.updateComplete));
      const bilder = kinder.flatMap((el) => [...(el.shadowRoot?.querySelectorAll("img") || [])]);
      await Promise.all(
        bilder.map((img) =>
          img.complete && img.naturalWidth > 0
            ? null
            : new Promise((fertig) => {
                img.addEventListener("load", fertig, { once: true });
                img.addEventListener("error", fertig, { once: true });
              })
        )
      );
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      const TOLERANZ = 1;
      const MAX_HOCH = 1.6;
      const TEILE =
        "img, .bild, .bild-flaeche, .glow, .power-badge, .value-box, .thermo, .fan-overlay," +
        " .flow-arrow, .label-badge, .chem-box, .stage-btn, .slot-title, .entries," +
        " .release-badge";
      const klarname = (el) =>
        el.tagName.toLowerCase() + (el.className ? "." + String(el.className).split(" ")[0] : "");
      const probleme = [];
      const masse = [];

      for (const el of kinder) {
        const name = el.tagName.toLowerCase().replace("tomtut-pool-", "");
        const aussen = el.getBoundingClientRect();
        if (aussen.width === 0 && aussen.height === 0) continue;
        masse.push({ name, breite: Math.round(aussen.width), hoehe: Math.round(aussen.height) });
        const istSlot = el.tagName.toLowerCase().startsWith("tomtut-pool-slot-");
        if (istSlot && aussen.height > aussen.width * MAX_HOCH + TOLERANZ) {
          probleme.push(
            `${name}: ${Math.round(aussen.height)} px hoch bei nur ${Math.round(aussen.width)} px Breite`
          );
        }
        const sr = el.shadowRoot;
        if (!sr) continue;
        for (const teil of sr.querySelectorAll(TEILE)) {
          const r = teil.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue;
          const raus = [];
          if (r.left < aussen.left - TOLERANZ) raus.push(`links ${Math.round(aussen.left - r.left)}`);
          if (r.top < aussen.top - TOLERANZ) raus.push(`oben ${Math.round(aussen.top - r.top)}`);
          if (r.right > aussen.right + TOLERANZ) raus.push(`rechts ${Math.round(r.right - aussen.right)}`);
          if (r.bottom > aussen.bottom + TOLERANZ) raus.push(`unten ${Math.round(r.bottom - aussen.bottom)}`);
          if (raus.length) probleme.push(`${name} > ${klarname(teil)} ragt heraus (${raus.join(", ")} px)`);
        }
      }
      return { probleme, masse };
    },
    { breite, grad, mirror }
  );

const BREITEN = [360, 768, 1200];
let laeufe = 0;
let belegPfad = "";

for (const breite of BREITEN) {
  for (const lage of UV_LAGEN) {
    const titel = `Layout ${breite} px, UV ${lage.grad} Grad${lage.mirror ? " gespiegelt" : ""}`;
    let probleme = ["nicht gemessen"];
    await checkAsync(titel, async () => {
      ({ probleme } = await bauenUndMessen(breite, lage.grad, lage.mirror));
      laeufe += 1;
      assert.deepEqual(probleme, [], "\n       " + probleme.join("\n       "));
    });
    await page
      .locator("#buehne")
      .screenshot({
        path: join(ausgabe, `${breite}-uv${String(lage.grad).padStart(3, "0")}${lage.mirror ? "-gespiegelt" : ""}.png`),
      });
  }
}

/* ---- Sonderfall: UV-Kasten ist in jeder Lage gleich gross ---- */

let uvMasse = [];
await checkAsync("UV: Bildkasten und Bild sind messbar", async () => {
  uvMasse = await page.evaluate(async () => {
  const messen = async (grad) => {
    document.body.innerHTML = "";
    const buehne = document.createElement("div");
    buehne.style.width = "600px";
    document.body.appendChild(buehne);
    const card = document.createElement("tomtut-pool-dashboard");
    card.setConfig({ hero: { enabled: false }, slots: [window.demo.uvSlot(grad, false)] });
    card.hass = window.demo.DEMO_HASS;
    buehne.appendChild(card);
    await card.updateComplete;
    const slot = card.shadowRoot.querySelector("tomtut-pool-slot-uv");
    await slot.updateComplete;
    const flaeche = slot.shadowRoot.querySelector(".bild-flaeche").getBoundingClientRect();
    const bild = slot.shadowRoot.querySelector(".bild").getBoundingClientRect();
    return {
      grad,
      kasten: [Math.round(flaeche.width), Math.round(flaeche.height)],
      bild: [Math.round(bild.width), Math.round(bild.height)],
    };
  };
    const aus = [];
    for (const grad of [0, 45, 90, 180, 270]) aus.push(await messen(grad));
    return aus;
  });
  assert.equal(uvMasse.length, 5);
});

check("UV: der Bildkasten bleibt in jeder Lage gleich gross", () => {
  const soll = uvMasse[0].kasten;
  for (const m of uvMasse) {
    assert.deepEqual(m.kasten, soll, `bei ${m.grad} Grad: ${m.kasten} statt ${soll}`);
  }
});
check("UV: das gedrehte Bild bleibt im Kasten", () => {
  for (const m of uvMasse) {
    assert.ok(
      m.bild[0] <= m.kasten[0] + 1 && m.bild[1] <= m.kasten[1] + 1,
      `bei ${m.grad} Grad misst das Bild ${m.bild} im Kasten ${m.kasten}`
    );
  }
});
check("UV: 90 Grad dreht wirklich (Bild wird hochkant)", () => {
  const quer = uvMasse.find((m) => m.grad === 0);
  const hoch = uvMasse.find((m) => m.grad === 90);
  assert.ok(quer.bild[0] > quer.bild[1], "0 Grad ist nicht quer");
  assert.ok(hoch.bild[1] > hoch.bild[0], "90 Grad ist nicht hochkant");
});

/* ---- Becken: Einlauf-Kaestchen und die Altlast aus Iteration 6 ---- */

let becken = null;
await checkAsync("Becken: Einlauf-Kaestchen und Alt-Slot sind messbar", async () => {
  becken = await page.evaluate(async () => {
    document.body.innerHTML = "";
    const buehne = document.createElement("div");
    buehne.style.width = "900px";
    document.body.appendChild(buehne);
    const card = document.createElement("tomtut-pool-dashboard");
    card.setConfig(window.demo.allesConfig(0, false));
    card.hass = window.demo.DEMO_HASS;
    buehne.appendChild(card);
    await card.updateComplete;
    const kinder = [...card.shadowRoot.querySelector(".grid").children];
    await Promise.all(kinder.map((el) => el.updateComplete));
    const hero = card.shadowRoot.querySelector("tomtut-pool-hero");
    const masse = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { links: r.left, oben: r.top, rechts: r.right, unten: r.bottom, breit: r.width, hoch: r.height };
    };
    const rahmen = kinder.find(
      (el) => el.tagName.toLowerCase() === "tomtut-pool-slot-frame" &&
        /Einlaufdüse/.test(el.shadowRoot.textContent)
    );
    return {
      bild: masse(hero.shadowRoot.querySelector(".img-wrap > img")),
      sprite: masse(hero.shadowRoot.querySelector("img.sprite-inlet")),
      kasten: masse(hero.shadowRoot.querySelector(".chem-box.inlet-temp")),
      kastenText: hero.shadowRoot.querySelector(".chem-box.inlet-temp")?.textContent.trim(),
      altText: rahmen ? rahmen.shadowRoot.textContent.replace(/\s+/g, " ").trim() : null,
      slotUv: !!card.shadowRoot.querySelector("tomtut-pool-slot-uv"),
    };
  });
  assert.ok(becken.bild && becken.sprite && becken.kasten, "Becken unvollstaendig gerendert");
});

check("Becken: das Einlauf-Kaestchen liegt im Bild, neben der Duese", () => {
  const { bild, sprite, kasten } = becken;
  assert.ok(kasten.links >= bild.links - 1 && kasten.rechts <= bild.rechts + 1, "ragt seitlich raus");
  assert.ok(kasten.oben >= bild.oben - 1 && kasten.unten <= bild.unten + 1, "ragt oben/unten raus");
  assert.ok(kasten.links > sprite.links, "sitzt nicht rechts von der Duese");
  const abstand = kasten.links - sprite.rechts;
  assert.ok(abstand > -sprite.breit && abstand < bild.breit * 0.2, `Abstand ${Math.round(abstand)} px`);
  assert.match(becken.kastenText, /Zulauf/);
  assert.match(becken.kastenText, /26,9/);
});

check("Alte Config: type inlet wird zum Rahmen mit Hinweis", () =>
  assert.match(String(becken.altText), /Einlaufdüse ist jetzt Teil des Beckens/)
);

/* ---- UV: Groesse mal Drehung ---- */

let uvGroessen = [];
await checkAsync("UV: Groesse mal Drehung ist messbar", async () => {
  uvGroessen = await page.evaluate(async () => {
    const messen = async (grad, groesse) => {
      document.body.innerHTML = "";
      const buehne = document.createElement("div");
      buehne.style.width = "600px";
      document.body.appendChild(buehne);
      const card = document.createElement("tomtut-pool-dashboard");
      card.setConfig({ hero: { enabled: false }, slots: [window.demo.uvSlot(grad, false, groesse)] });
      card.hass = window.demo.DEMO_HASS;
      buehne.appendChild(card);
      await card.updateComplete;
      const slot = card.shadowRoot.querySelector("tomtut-pool-slot-uv");
      await slot.updateComplete;
      const flaeche = slot.shadowRoot.querySelector(".bild-flaeche").getBoundingClientRect();
      const bild = slot.shadowRoot.querySelector(".bild").getBoundingClientRect();
      return {
        grad,
        groesse,
        kasten: [Math.round(flaeche.width), Math.round(flaeche.height)],
        bild: [Math.round(bild.width), Math.round(bild.height)],
      };
    };
    const aus = [];
    for (const grad of [0, 45, 90]) {
      for (const groesse of [30, 65, 100]) aus.push(await messen(grad, groesse));
    }
    return aus;
  });
  assert.equal(uvGroessen.length, 9);
});

check("UV: der Kasten bleibt auch bei kleinerem Bild gleich gross", () => {
  const soll = uvGroessen[0].kasten;
  for (const m of uvGroessen) {
    assert.deepEqual(m.kasten, soll, `${m.grad} Grad / ${m.groesse} %: ${m.kasten}`);
  }
});
check("UV: kleiner gestellt heisst wirklich kleiner — und nie groesser als der Kasten", () => {
  for (const grad of [0, 45, 90]) {
    const reihe = uvGroessen.filter((m) => m.grad === grad).sort((a, b) => a.groesse - b.groesse);
    for (let i = 1; i < reihe.length; i += 1) {
      assert.ok(
        reihe[i].bild[0] > reihe[i - 1].bild[0],
        `${grad} Grad: ${reihe[i - 1].groesse} % ist nicht kleiner als ${reihe[i].groesse} %`
      );
    }
    for (const m of reihe) {
      assert.ok(
        m.bild[0] <= m.kasten[0] + 1 && m.bild[1] <= m.kasten[1] + 1,
        `${grad} Grad / ${m.groesse} %: Bild ${m.bild} im Kasten ${m.kasten}`
      );
    }
    /* 30 % ist rund ein Drittel von 100 % — der Faktor wirkt linear */
    const klein = reihe[0];
    const voll = reihe[reihe.length - 1];
    assert.ok(
      Math.abs(klein.bild[0] / voll.bild[0] - 0.3) < 0.02,
      `${grad} Grad: 30 % misst ${klein.bild[0]} von ${voll.bild[0]}`
    );
  }
});

/* ---- Solar: die beiden Richtungsmarker ---- */

let solarMarker = null;
await checkAsync("Solar: die Richtungsmarker sind messbar", async () => {
  solarMarker = await page.evaluate(async () => {
    document.body.innerHTML = "";
    const buehne = document.createElement("div");
    buehne.style.width = "600px";
    document.body.appendChild(buehne);
    const card = document.createElement("tomtut-pool-dashboard");
    card.setConfig({
      hero: { enabled: false },
      slots: [window.demo.allesConfig(0, false).slots.find((s) => s.type === "solar")],
    });
    card.hass = window.demo.DEMO_HASS;
    buehne.appendChild(card);
    await card.updateComplete;
    const slot = card.shadowRoot.querySelector("tomtut-pool-slot-solar");
    await slot.updateComplete;
    const bilder = [...slot.shadowRoot.querySelectorAll("img")];
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
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const masse = (el) => {
      const r = el.getBoundingClientRect();
      return { links: r.left, oben: r.top, rechts: r.right, unten: r.bottom, breit: r.width, hoch: r.height };
    };
    const thermos = [...slot.shadowRoot.querySelectorAll(".thermo")];
    return {
      feld: masse(slot.shadowRoot.querySelector(".bild-flaeche")),
      blau: masse(slot.shadowRoot.querySelector("img.flow-in")),
      rot: masse(slot.shadowRoot.querySelector("img.flow-out")),
      thermos: thermos.map(masse),
      knopf: masse(slot.shadowRoot.querySelector(".power-badge")),
      watt: masse(slot.shadowRoot.querySelector(".value-box")),
      geladen: [...slot.shadowRoot.querySelectorAll("img")].every((i) => i.naturalWidth > 0),
    };
  });
  assert.ok(solarMarker.blau && solarMarker.rot, "Marker fehlen");
  assert.ok(solarMarker.geladen, "ein Bild des Solar-Slots laedt nicht");
});

/* Iteration 14: waagerechte Pfeile, blau links unten hinein, rot rechts oben hinaus */
check("Solar: beide Marker liegen im Bild, blau links unten, rot rechts oben", () => {
  const { feld, blau, rot, thermos } = solarMarker;
  for (const [name, m] of [["blau", blau], ["rot", rot]]) {
    assert.ok(m.links >= feld.links - 1 && m.rechts <= feld.rechts + 1, `${name} ragt seitlich raus`);
    assert.ok(m.oben >= feld.oben - 1 && m.unten <= feld.unten + 1, `${name} ragt oben/unten raus`);
    assert.ok(m.hoch > 0 && m.breit > m.hoch, `${name} ist kein liegender Pfeil`);
  }
  const mitteX = (feld.links + feld.rechts) / 2;
  const mitteY = (feld.oben + feld.unten) / 2;
  assert.ok(blau.rechts < mitteX && blau.oben > mitteY, "blau sitzt nicht links unten");
  assert.ok(rot.links > mitteX && rot.unten < mitteY, "rot sitzt nicht rechts oben");
  /* jedes Thermometer steht bei seinem Marker */
  assert.equal(thermos.length, 2);
  assert.ok(thermos[0].links < mitteX && thermos[0].oben > mitteY, "Vorlauf steht nicht links unten");
  assert.ok(thermos[1].rechts > mitteX && thermos[1].unten < mitteY, "Ruecklauf steht nicht rechts oben");
  assert.ok(thermos[0].unten <= blau.oben + 2, "Vorlauf-Thermometer liegt auf dem blauen Pfeil");
  assert.ok(thermos[1].oben >= rot.unten - 2, "Ruecklauf-Thermometer liegt auf dem roten Pfeil");
});
check("Solar: Pfeile, Thermometer, Watt-Box und Knopf ueberlappen sich nicht", () => {
  const { blau, rot, thermos, knopf, watt } = solarMarker;
  const teile = { blau, rot, vorlauf: thermos[0], ruecklauf: thermos[1], knopf, watt };
  const namen = Object.keys(teile);
  for (let i = 0; i < namen.length; i++)
    for (let j = i + 1; j < namen.length; j++) {
      const a = teile[namen[i]];
      const b = teile[namen[j]];
      const ueber =
        a.links < b.rechts - 1 && b.links < a.rechts - 1 && a.oben < b.unten - 1 && b.oben < a.unten - 1;
      assert.ok(!ueber, `${namen[i]} ueberlappt ${namen[j]}`);
    }
});

/* ---- Freigabekontakt: Anzeige und Wirkung aufs Rad (Iteration 12) ---- */

/*
 * jsdom kann nur Klassen lesen — hier wird gemessen: sitzt die Anzeige im
 * Bild, unterscheiden sich die beiden Zustaende sichtbar (Farbe, Wort) und
 * steht das Rad bei gesperrter Freigabe wirklich still (computed
 * animation-name)?
 */
let freigabe = null;
await checkAsync("Freigabekontakt: die Anzeige ist messbar", async () => {
  freigabe = await page.evaluate(async () => {
    const messen = async (fall) => {
      document.body.innerHTML = "";
      const buehne = document.createElement("div");
      buehne.style.width = "600px";
      document.body.appendChild(buehne);
      const card = document.createElement("tomtut-pool-dashboard");
      card.setConfig({ hero: { enabled: false }, slots: [window.demo.wpFreigabe(fall)] });
      card.hass = window.demo.DEMO_HASS;
      buehne.appendChild(card);
      await card.updateComplete;
      const slot = card.shadowRoot.querySelector("tomtut-pool-slot-heatpump");
      await slot.updateComplete;
      const bilder = [...slot.shadowRoot.querySelectorAll("img")];
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
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const masse = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          links: r.left, oben: r.top, rechts: r.right, unten: r.bottom,
          breit: r.width, hoch: r.height,
        };
      };
      const badge = slot.shadowRoot.querySelector(".release-badge");
      const rad = slot.shadowRoot.querySelector(".fan-overlay svg g");
      return {
        flaeche: masse(slot.shadowRoot.querySelector(".bild-flaeche")),
        badge: masse(badge),
        text: badge ? badge.textContent.replace(/\s+/g, " ").trim() : "",
        farbe: badge ? getComputedStyle(badge).borderTopColor : "",
        zeiger: badge ? getComputedStyle(badge).cursor : "",
        dreht: getComputedStyle(rad).animationName !== "none",
      };
    };
    return {
      frei: await messen("frei"),
      gesperrt: await messen("gesperrt"),
      meldung: await messen("meldung"),
    };
  });
  assert.ok(freigabe.frei.badge && freigabe.gesperrt.badge, "Anzeige fehlt");
});

check("Freigabekontakt: die Anzeige liegt im Bild und ist lesbar gross", () => {
  for (const [name, m] of Object.entries(freigabe)) {
    const { flaeche, badge } = m;
    assert.ok(badge.links >= flaeche.links - 1 && badge.rechts <= flaeche.rechts + 1, `${name}: ragt seitlich aus dem Bild`);
    assert.ok(badge.oben >= flaeche.oben - 1 && badge.unten <= flaeche.unten + 1, `${name}: ragt oben/unten aus dem Bild`);
    assert.ok(badge.breit > 40 && badge.hoch > 14, `${name}: Anzeige misst nur ${Math.round(badge.breit)}x${Math.round(badge.hoch)} px`);
  }
});

check("Freigabekontakt: frei und gesperrt sehen verschieden aus", () => {
  assert.match(freigabe.frei.text, /Frei/);
  assert.match(freigabe.gesperrt.text, /Gesperrt/);
  assert.notEqual(freigabe.frei.farbe, freigabe.gesperrt.farbe);
});

check("Freigabekontakt: gesperrt stellt das Rad still, frei laesst es drehen", () => {
  assert.equal(freigabe.frei.dreht, true, "Rad steht trotz Freigabe");
  assert.equal(freigabe.gesperrt.dreht, false, "Rad dreht trotz Sperre");
  assert.equal(freigabe.meldung.dreht, false, "binary_sensor offen: Rad muesste stehen");
});

check("Freigabekontakt: schaltbar zeigt den Zeigefinger, binary_sensor nicht", () => {
  assert.equal(freigabe.frei.zeiger, "pointer");
  assert.equal(freigabe.meldung.zeiger, "default");
});

/* ---- Iteration 14: Modus-Badge, "seit" am Freigabekontakt, UV-Wabern max ---- */

let it14 = null;
await checkAsync("Iteration 14: Modus-Badge, seit-Text und UV-Wabern sind messbar", async () => {
  it14 = await page.evaluate(async () => {
    const S = window.demo.DEMO_HASS.states;
    S["select.it14_modus"] = { state: "Kuehlen Smart", attributes: { options: ["Kuehlen Smart"] }, last_changed: new Date().toISOString() };
    S["input_boolean.wp_freigabe"] = {
      ...(S["input_boolean.wp_freigabe"] || { state: "on", attributes: {} }),
      last_changed: new Date(Date.now() - 130 * 60000).toISOString(),
    };
    const bauen = async (slotCfg, typ) => {
      document.body.innerHTML = "";
      const buehne = document.createElement("div");
      buehne.style.width = "600px";
      document.body.appendChild(buehne);
      const card = document.createElement("tomtut-pool-dashboard");
      card.setConfig({ hero: { enabled: false }, slots: [slotCfg] });
      card.hass = window.demo.DEMO_HASS;
      buehne.appendChild(card);
      await card.updateComplete;
      const slot = card.shadowRoot.querySelector(`tomtut-pool-slot-${typ}`);
      await slot.updateComplete;
      await Promise.all(
        [...slot.shadowRoot.querySelectorAll("img")].map((img) =>
          img.complete && img.naturalWidth > 0
            ? null
            : new Promise((f) => {
                img.addEventListener("load", f, { once: true });
                img.addEventListener("error", f, { once: true });
              })
        )
      );
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      return slot;
    };
    const masse = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { links: r.left, oben: r.top, rechts: r.right, unten: r.bottom, breit: r.width, hoch: r.height };
    };
    const wp = await bauen(
      {
        ...window.demo.allesConfig(0, false).slots[0],
        show_mode: true,
        mode_entity: "select.it14_modus",
        fan_color_mode: "modus",
        show_release_since: true,
      },
      "heatpump"
    );
    const q = (s) => wp.shadowRoot.querySelector(s);
    const wpMasse = {
      flaeche: masse(q(".bild-flaeche")),
      modus: masse(q(".mode-badge")),
      modusText: q(".mode-badge")?.textContent.trim() || "",
      modusFarbe: q(".mode-badge") ? getComputedStyle(q(".mode-badge")).borderTopColor : "",
      radFarbe: q(".fan-overlay") ? getComputedStyle(q(".fan-overlay")).getPropertyValue("--tt-fan-color").trim() : "",
      freigabe: masse(q(".release-badge")),
      seit: masse(q(".release-seit")),
      seitText: q(".release-seit")?.textContent.trim() || "",
      andere: [...wp.shadowRoot.querySelectorAll(".value-box, .power-badge, .label-badge")].map(masse),
    };
    const uvWerte = async (pulse) => {
      const uv = await bauen({ ...window.demo.uvSlot(0, false), glow_intensity: 100, glow_pulse: pulse }, "uv");
      const g = uv.shadowRoot.querySelector(".glow");
      const hof = getComputedStyle(g, "::after");
      const kern = getComputedStyle(g, "::before");
      return {
        glow: masse(g),
        flaeche: masse(uv.shadowRoot.querySelector(".bild-flaeche")),
        hofDauer: parseFloat(hof.animationDuration),
        kernDauer: parseFloat(kern.animationDuration),
        hofLinks: parseFloat(hof.left),
        hofOben: parseFloat(hof.top),
      };
    };
    return { wp: wpMasse, uvAlt: await uvWerte(100), uvNeu: await uvWerte(300), uv40: await uvWerte(40) };
  });
  assert.ok(it14.wp.modus, "Modus-Badge fehlt");
});

const ueberlappt = (a, b) =>
  a.links < b.rechts - 1 && b.links < a.rechts - 1 && a.oben < b.unten - 1 && b.oben < a.unten - 1;

check("Modus-Badge: liegt im Bild, Klartext, Farbe wie das Rad", () => {
  const { flaeche, modus, modusText, modusFarbe } = it14.wp;
  assert.ok(modus.links >= flaeche.links - 1 && modus.rechts <= flaeche.rechts + 1, "ragt seitlich raus");
  assert.ok(modus.oben >= flaeche.oben - 1 && modus.unten <= flaeche.unten + 1, "ragt oben/unten raus");
  assert.equal(modusText, "Kühlen Smart");
  assert.equal(modusFarbe, "rgb(47, 127, 208)", "Rahmen nicht in Kuehl-Blau");
});
check("Modus-Badge: kollidiert weder mit Freigabe (samt seit-Text) noch mit anderen Kaestchen", () => {
  const { modus, freigabe, seit, andere } = it14.wp;
  assert.ok(!ueberlappt(modus, freigabe), "Modus liegt auf dem Freigabekontakt");
  assert.ok(!ueberlappt(modus, seit), "Modus liegt auf dem seit-Text");
  andere.forEach((m, i) => assert.ok(!ueberlappt(modus, m), `Modus liegt auf Kaestchen ${i}`));
});
check("Freigabe-seit: steht unter dem Badge, im Bild, 'seit 2 Std 10 Min'", () => {
  const { flaeche, freigabe, seit, seitText } = it14.wp;
  assert.equal(seitText, "seit 2 Std 10 Min");
  assert.ok(seit.oben >= freigabe.unten - 2, "seit-Text nicht unter dem Badge");
  assert.ok(seit.unten <= flaeche.unten + 1, "seit-Text ragt unten aus dem Bild");
});
check("UV-Wabern: bis 100 exakt die alte Kurve (3,7 s / 5,3 s, alter Hof)", () => {
  for (const w of [it14.uv40, it14.uvAlt]) {
    assert.equal(w.hofDauer, 3.7);
    assert.equal(w.kernDauer, 5.3);
  }
  assert.equal(Math.round(it14.uvAlt.hofLinks * 100), Math.round(it14.uv40.hofLinks * 100));
});
check("UV-Wabern bei Maximum (300): schneller, groesserer Hof, Glow bleibt im Bild", () => {
  const { uvAlt, uvNeu } = it14;
  assert.ok(uvNeu.hofDauer < uvAlt.hofDauer / 2, `Hof-Puls nur ${uvNeu.hofDauer}s`);
  assert.ok(uvNeu.kernDauer < uvAlt.kernDauer / 2, `Kern-Puls nur ${uvNeu.kernDauer}s`);
  assert.ok(uvNeu.hofLinks < uvAlt.hofLinks, "Hof nicht breiter");
  assert.ok(uvNeu.hofOben < uvAlt.hofOben, "Hof nicht hoeher");
  const { glow, flaeche } = uvNeu;
  assert.ok(glow.links >= flaeche.links - 1 && glow.rechts <= flaeche.rechts + 1, "Glow ragt raus");
});

/* ---- Iteration 15: Modus-Auswahl und Kiosk im echten Browser ---- */

let it15 = null;
await checkAsync("Iteration 15: Modus-Auswahl und Kiosk sind messbar", async () => {
  it15 = await page.evaluate(async () => {
    const S = window.demo.DEMO_HASS.states;
    S["select.it15_modus"] = {
      state: "Heizen Smart",
      attributes: { options: ["Auto", "Heizen Power", "Kuehlen Power", "Heizen Smart", "Kuehlen Smart", "Heizen Silent", "Kuehlen Silent"] },
      last_changed: new Date().toISOString(),
    };
    const bauen = async (config) => {
      document.body.innerHTML = "";
      const buehne = document.createElement("div");
      buehne.style.width = "600px";
      document.body.appendChild(buehne);
      const card = document.createElement("tomtut-pool-dashboard");
      card.setConfig(config);
      card.hass = window.demo.DEMO_HASS;
      buehne.appendChild(card);
      await card.updateComplete;
      const slot = card.shadowRoot.querySelector("tomtut-pool-slot-heatpump");
      await slot.updateComplete;
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      return slot;
    };
    const masse = (el) => {
      const r = el.getBoundingClientRect();
      return { links: r.left, oben: r.top, rechts: r.right, unten: r.bottom };
    };
    const wpCfg = { ...window.demo.allesConfig(0, false).slots[0], show_mode: true, mode_entity: "select.it15_modus" };
    const wp = await bauen({ hero: { enabled: false }, slots: [wpCfg] });
    const b = wp.shadowRoot.querySelector(".mode-badge");
    const bm = masse(b);
    const mitte = [(bm.links + bm.rechts) / 2, (bm.oben + bm.unten) / 2];
    /* echter Klick an die Stelle, an der das Badge sichtbar ist */
    const cursorBadge = getComputedStyle(b).cursor;
    const card = document.querySelector("tomtut-pool-dashboard");
    b.click();
    await wp.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));
    const ov = wp.shadowRoot.querySelector(".modus-overlay");
    const panel = wp.shadowRoot.querySelector(".modus-panel");
    const auswahl = ov
      ? {
          slot: masse(wp.shadowRoot.querySelector(".slot")),
          overlay: masse(ov),
          panel: masse(panel),
          optionen: panel.querySelectorAll(".modus-option").length,
          aktiv: panel.querySelector(".modus-option.aktiv")?.textContent.replace(/\s+/g, " ").trim(),
          zOverlay: getComputedStyle(ov).zIndex,
        }
      : null;

    const kioskSlot = await bauen({ hero: { enabled: false }, kiosk: true, slots: [wpCfg] });
    const pb = kioskSlot.shadowRoot.querySelector(".power-badge");
    const pm = masse(pb);
    const oben = kioskSlot.shadowRoot.elementFromPoint((pm.links + pm.rechts) / 2, (pm.oben + pm.unten) / 2);
    return {
      cursorBadge,
      auswahl,
      mitte,
      kiosk: {
        cursorKnopf: getComputedStyle(pb).cursor,
        zeigerKnopf: getComputedStyle(pb).pointerEvents,
        trefferIstKnopf: !!oben && (oben === pb || pb.contains(oben)),
        badgeWaehlbar: kioskSlot.shadowRoot.querySelector(".mode-badge").classList.contains("waehlbar"),
      },
    };
  });
  assert.ok(it15.auswahl, "Auswahl ging nicht auf");
});

check("Modus-Auswahl: Badge zeigt die Hand, Auswahl liegt im Kasten mit 7 Optionen", () => {
  const { auswahl } = it15;
  assert.equal(it15.cursorBadge, "pointer");
  assert.equal(auswahl.optionen, 7);
  assert.match(auswahl.aktiv, /✓\s*Heizen Smart/);
  assert.ok(auswahl.panel.links >= auswahl.slot.links - 1 && auswahl.panel.rechts <= auswahl.slot.rechts + 1, "Panel ragt seitlich raus");
  assert.ok(auswahl.panel.oben >= auswahl.slot.oben - 1 && auswahl.panel.unten <= auswahl.slot.unten + 1, "Panel ragt oben/unten raus");
  assert.equal(auswahl.zOverlay, "10");
});
check("Kiosk: kein Hand-Cursor, Knopf nimmt keine Zeiger an, Badge nicht waehlbar", () => {
  const { kiosk } = it15;
  assert.equal(kiosk.cursorKnopf, "default");
  assert.equal(kiosk.zeigerKnopf, "none");
  assert.equal(kiosk.trefferIstKnopf, false);
  assert.equal(kiosk.badgeWaehlbar, false);
});

/* ---- Kopfleiste: nichts schiebt sich beim Scrollen darueber ---- */

/*
 * Der Befund aus Iteration 8: beim Scrollen im Dashboard lagen die pH/RX-
 * Kaestchen des Beckens ueber der Kopfleiste von Home Assistant. Ursache war
 * der fehlende eigene Stacking-Context der Card — die z-index-Werte der
 * Overlays zaehlten gegen die HA-Oberflaeche statt nur gegeneinander.
 *
 * Hier steht eine Kopfleiste wie die echte (fest, z-index 4) ueber der Seite.
 * Jedes Overlay wird einzeln unter die Leiste gescrollt und an seiner Mitte
 * per elementFromPoint gefragt, wer dort oben liegt. Richtig ist: die
 * Kopfleiste — nie das Overlay (bzw. dessen Card).
 */
const KOPF_HOCH = 56;
let kopfProbe = null;
await checkAsync("Kopfleiste: Overlays sind messbar", async () => {
  kopfProbe = await page.evaluate(async (KOPF_HOCH) => {
    document.body.innerHTML = "";
    window.scrollTo(0, 0);

    const kopf = document.createElement("div");
    kopf.id = "kopf";
    kopf.style.cssText =
      `position:fixed;top:0;left:0;right:0;height:${KOPF_HOCH}px;z-index:4;` +
      "background:#03a9f4;color:#fff;font:600 14px/56px system-ui;" +
      "padding:0 16px;box-sizing:border-box;";
    kopf.textContent = "Home Assistant";
    document.body.appendChild(kopf);

    const oben = document.createElement("div");
    oben.style.height = "400px";
    document.body.appendChild(oben);

    const buehne = document.createElement("div");
    buehne.style.cssText = "width:900px;margin:0 auto";
    document.body.appendChild(buehne);

    const card = document.createElement("tomtut-pool-dashboard");
    card.setConfig(window.demo.allesConfig(0, false));
    card.hass = window.demo.DEMO_HASS;
    buehne.appendChild(card);
    await card.updateComplete;

    const kinder = [...card.shadowRoot.querySelector(".grid").children];
    await Promise.all(kinder.map((el) => el.updateComplete));
    const bilder = kinder.flatMap((el) => [...(el.shadowRoot?.querySelectorAll("img") || [])]);
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

    const unten = document.createElement("div");
    unten.style.height = "1600px";
    document.body.appendChild(unten);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    const OVERLAYS =
      ".chem-box, .thermo, .label-badge, img.hero-sprite, .power-badge," +
      " .value-box, img.flow-arrow, .glow, .fan-overlay, .stage-btn, .release-badge";
    const klarname = (el) =>
      el.tagName.toLowerCase() + (el.className ? "." + String(el.className).split(" ")[0] : "");

    /* 1. Stacking-Context der Card selbst */
    const cs = getComputedStyle(card);
    const riegel = { isolation: cs.isolation, position: cs.position, zIndex: cs.zIndex };

    /* 2. computed z-index im ganzen Shadow-DOM */
    const zuHoch = [];
    for (const el of [card, ...kinder]) {
      const wurzeln = [el.shadowRoot].filter(Boolean);
      for (const wurzel of wurzeln) {
        for (const teil of wurzel.querySelectorAll("*")) {
          const z = getComputedStyle(teil).zIndex;
          if (z !== "auto" && Number(z) > 10) {
            zuHoch.push(`${el.tagName.toLowerCase()} > ${klarname(teil)}: z-index ${z}`);
          }
        }
      }
    }

    /* 3. jedes Overlay einzeln unter die Kopfleiste scrollen und fragen */
    const proben = [];
    for (const el of kinder) {
      const name = el.tagName.toLowerCase().replace("tomtut-pool-", "");
      for (const teil of el.shadowRoot.querySelectorAll(OVERLAYS)) proben.push({ name, teil });
    }
    const treffer = [];
    for (const { name, teil } of proben) {
      const r0 = teil.getBoundingClientRect();
      if (r0.width < 2 || r0.height < 2) continue;
      const mitteImDokument = r0.top + window.scrollY + r0.height / 2;
      window.scrollTo(0, Math.max(0, Math.round(mitteImDokument - KOPF_HOCH / 2)));
      await new Promise((f) => requestAnimationFrame(f));
      const r = teil.getBoundingClientRect();
      const x = Math.round(r.left + r.width / 2);
      const y = Math.round(r.top + r.height / 2);
      const etikett = `${name} > ${klarname(teil)}`;
      if (y < 0 || y > KOPF_HOCH) {
        treffer.push({ etikett, y, fehler: "nicht unter die Kopfleiste gescrollt" });
        continue;
      }
      const oberstes = document.elementFromPoint(x, y);
      treffer.push({
        etikett,
        y,
        kopf: !!(oberstes && (oberstes === kopf || kopf.contains(oberstes))),
        getroffen: oberstes ? klarname(oberstes) : "nichts",
      });
    }
    window.scrollTo(0, 0);
    return { riegel, zuHoch, treffer };
  }, KOPF_HOCH);
  assert.ok(kopfProbe.treffer.length >= 8, `nur ${kopfProbe.treffer.length} Overlays gemessen`);
});

check("Kopfleiste: die Card bildet einen eigenen Stacking-Context", () => {
  assert.equal(kopfProbe.riegel.isolation, "isolate");
  assert.equal(kopfProbe.riegel.position, "relative");
  assert.equal(kopfProbe.riegel.zIndex, "0");
});

check("Kopfleiste: kein Element im Shadow-DOM hat einen z-index ueber 10", () =>
  assert.deepEqual(kopfProbe.zuHoch, [], "\n       " + kopfProbe.zuHoch.join("\n       "))
);

check("Kopfleiste: jedes Overlay verschwindet darunter, keines darueber", () => {
  const schlecht = kopfProbe.treffer.filter((t) => t.kopf !== true);
  assert.deepEqual(
    schlecht.map((t) => `${t.etikett} (y=${t.y}): ${t.fehler || "oben liegt " + t.getroffen}`),
    [],
    "\n       " +
      schlecht
        .map((t) => `${t.etikett} (y=${t.y}): ${t.fehler || "oben liegt " + t.getroffen}`)
        .join("\n       ")
  );
});

/* ------------------------------------------------------------------ */
/* Iteration 16: Schalter-Kasten (layout liste) fürs Flur-Tablet       */
/* ------------------------------------------------------------------ */
/*
 * Zusage: Titel + 4 Zeilen `liste` passen bei exakt 384 px Kartenbreite in
 * 268 px Höhe — so groß sind die zwei Entities-Karten auf Thomas'
 * Kiosk-Tablet (1280 × 800 @ 1,5), die der Kasten ersetzen soll. Gemessen
 * in hellem UND dunklem HA-Theme; dazu Lesbarkeit (Kontrast Schrift gegen
 * Kartenhintergrund) und dass nichts aus dem Kasten ragt.
 */
const I16_BREITE = 384;
const I16_MAX_HOEHE = 268;
const I16_THEMES = {
  hell: {
    seite: "#fafafa",
    vars: {
      "--primary-text-color": "#212121",
      "--secondary-text-color": "#727272",
      "--ha-card-background": "#ffffff",
      "--state-icon-color": "#44739e",
      "--ha-card-box-shadow": "0 2px 2px rgba(0,0,0,.14), 0 1px 5px rgba(0,0,0,.12)",
      "--ha-card-border-radius": "12px",
    },
  },
  dunkel: {
    seite: "linear-gradient(180deg, #0b1a33, #121820)",
    vars: {
      "--primary-text-color": "#e1e1e1",
      "--secondary-text-color": "#9b9b9b",
      "--ha-card-background": "linear-gradient(180deg, #3b4a66, #2b313d)",
      "--card-background-color": "#2f3747",
      "--state-icon-color": "#e1e1e1",
      "--ha-card-box-shadow": "none",
      "--ha-card-border-radius": "24px",
    },
  },
};
const I16_KAESTEN = [
  {
    type: "custom",
    title: "Pool: Heizsteuerung",
    layout: "liste",
    entries: [
      { kind: "button", entity: "input_boolean.poolwp_pv_logik_aktivieren", label: "PV Logik aktivieren", icon: "mdi:sun-clock" },
      { kind: "button", entity: "input_boolean.poolwp_manuell_ein", label: "Pool WP manuell einschalten", icon: "mdi:gesture-tap-button" },
      { kind: "button", entity: "switch.solarsteuerung_switch", label: "Solarsteuerung", icon: "mdi:power" },
      { kind: "entity", entity: "sensor.solarheizung_status", label: "Solarheizung", icon: "mdi:solar-power" },
    ],
  },
  {
    type: "custom",
    title: "Poolschalter",
    layout: "liste",
    entries: [
      { kind: "button", entity: "switch.poolroboter_switch_0", label: "Poolroboter", icon: "mdi:robot-vacuum" },
      { kind: "button", entity: "switch.gsa_zigbee", label: "Gegenstromanlage", icon: "mdi:waves-arrow-right" },
      { kind: "button", entity: "switch.poollampe_zigbee", label: "Poollampe", icon: "mdi:lightbulb-on-outline" },
      { kind: "button", entity: "input_boolean.pool_manuell_reinigen", label: "Pool manuell reinigen", icon: "mdi:broom", confirm_off: true },
    ],
  },
];

/* Baut beide Kästen (je eine eigene Card, frame aus) untereinander in einer
   384 px breiten Spalte im gewählten Theme und misst. */
const i16Bauen = (themeName) =>
  page.evaluate(
    async ({ theme, kaesten, breite }) => {
      document.body.innerHTML = "";
      document.body.style.background = theme.seite;
      const buehne = document.createElement("div");
      buehne.id = "buehne";
      buehne.style.cssText = `width:${breite}px;margin:0;padding:0;display:flex;flex-direction:column;gap:8px`;
      for (const [k, v] of Object.entries(theme.vars)) buehne.style.setProperty(k, v);
      document.body.appendChild(buehne);
      const s = (st, vor = 60) => ({ state: st, attributes: {}, last_changed: new Date(Date.now() - vor * 1000).toISOString() });
      const hass = {
        ...window.demo.DEMO_HASS,
        states: {
          ...window.demo.DEMO_HASS.states,
          "input_boolean.poolwp_pv_logik_aktivieren": s("on"),
          "input_boolean.poolwp_manuell_ein": s("off"),
          "switch.solarsteuerung_switch": s("off"),
          "sensor.solarheizung_status": s("Bypass"),
          "switch.poolroboter_switch_0": s("on"),
          "switch.gsa_zigbee": s("off"),
          "switch.poollampe_zigbee": s("off"),
          "input_boolean.pool_manuell_reinigen": s("on"),
        },
      };
      const cards = [];
      for (const slot of kaesten) {
        const card = document.createElement("tomtut-pool-dashboard");
        card.setConfig({ hero: { enabled: false }, frame: { enabled: false, fill: "transparent" }, slots: [slot] });
        card.hass = hass;
        buehne.appendChild(card);
        cards.push(card);
      }
      await Promise.all(cards.map((c) => c.updateComplete));
      const slots = cards.map((c) => c.shadowRoot.querySelector("tomtut-pool-slot-custom"));
      await Promise.all(slots.map((e) => e.updateComplete));
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      /* relative Leuchtdichte -> WCAG-Kontrast */
      const rgb = (t) => (t.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
      const lum = ([r, g, b]) => {
        const f = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const kontrast = (a, b) => {
        const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
        return (x + 0.05) / (y + 0.05);
      };
      return slots.map((el) => {
        const sr = el.shadowRoot;
        const box = el.getBoundingClientRect();
        const slotDiv = sr.querySelector(".slot");
        const cs = getComputedStyle(slotDiv);
        /* Hintergrund: bei Verlauf die erste Farbe des Verlaufs */
        const bgBild = cs.backgroundImage !== "none" ? cs.backgroundImage : cs.backgroundColor;
        const raus = [];
        for (const t of sr.querySelectorAll(".slot-title, .zeile, .schalter, .z-wert, .z-name")) {
          const r = t.getBoundingClientRect();
          if (r.right > box.right + 1 || r.bottom > box.bottom + 1 || r.left < box.left - 1 || r.top < box.top - 1)
            raus.push(t.className);
        }
        return {
          titel: sr.querySelector(".slot-title")?.textContent,
          breite: Math.round(box.width * 10) / 10,
          hoehe: Math.round(box.height * 10) / 10,
          zeilen: sr.querySelectorAll(".zeile").length,
          kontrast: Math.round(kontrast(rgb(getComputedStyle(sr.querySelector(".z-name")).color), rgb(bgBild)) * 10) / 10,
          raus,
        };
      });
    },
    { theme: I16_THEMES[themeName], kaesten: I16_KAESTEN, breite: I16_BREITE }
  );

const i16Masse = {};
for (const themeName of Object.keys(I16_THEMES)) {
  await checkAsync(`It16: Titel + 4 Zeilen liste bei ${I16_BREITE} px <= ${I16_MAX_HOEHE} px, Theme ${themeName}`, async () => {
    const m = await i16Bauen(themeName);
    i16Masse[themeName] = m;
    for (const k of m) {
      assert.equal(k.zeilen, 4, k.titel);
      assert.equal(k.breite, I16_BREITE, `${k.titel}: Breite ${k.breite}`);
      assert.ok(k.hoehe <= I16_MAX_HOEHE, `${k.titel}: ${k.hoehe} px hoch (max ${I16_MAX_HOEHE})`);
      assert.deepEqual(k.raus, [], `${k.titel}: ragt heraus`);
      assert.ok(k.kontrast >= 4.5, `${k.titel}: Kontrast nur ${k.kontrast}:1`);
    }
    results.push(
      `       gemessen (${themeName}): ` + m.map((k) => `${k.titel} ${k.breite}x${k.hoehe} px, Kontrast ${k.kontrast}:1`).join(" · ")
    );
  });
  await page.locator("#buehne").screenshot({ path: join(ausgabe, `it16-schalter-${themeName}.png`) });
}

/* Beleg: beide Kästen im dunklen Theme neben Thomas' Originalausschnitt
   (gleicher Maßstab, @1,5 wie das Tablet). Fehlt das Original, entfällt
   der Beleg — der Test hängt nicht am NAS. */
const I16_ORIGINAL =
  process.env.IT16_ORIGINAL ||
  "/mnt/nas/proxmox-container/studio/vorgaenge/ka-973/prod-ist/ausschnitt-kioskflur-heizsteuerung-poolschalter.png";
const I16_BELEG =
  process.env.IT16_BELEG || "/mnt/nas/proxmox-container/studio/vorgaenge/ka-973/pool-cards-it16-schalter.png";
await checkAsync("It16: Beleg dunkel neben Original", async () => {
  let original = null;
  try {
    original = (await readFile(I16_ORIGINAL)).toString("base64");
  } catch {
    results.push("       ohne Original-Ausschnitt, Beleg nur aus render-out");
  }
  const p2 = await browser.newPage({ viewport: { width: 860, height: 200 }, deviceScaleFactor: 1.5 });
  await p2.goto(`${basis}/seite`);
  await p2.waitForFunction(() => window.bereit === true, null, { timeout: 15000 });
  try {
    /* eigene Seite in @1,5 — Aufbau wie i16Bauen, plus Original daneben */
    await p2.evaluate(
      async ({ theme, kaesten, breite, original }) => {
        document.body.innerHTML = "";
        document.body.style.cssText = `margin:0;padding:16px;background:${theme.seite};font-family:system-ui,sans-serif`;
        const reihe = document.createElement("div");
        reihe.id = "beleg";
        reihe.style.cssText = "display:flex;gap:24px;align-items:flex-start";
        document.body.appendChild(reihe);
        const spalte = (titel) => {
          const d = document.createElement("div");
          d.innerHTML = `<div style="color:#e1e1e1;font:600 13px system-ui;margin:0 0 8px">${titel}</div>`;
          reihe.appendChild(d);
          return d;
        };
        if (original) {
          const img = document.createElement("img");
          img.src = "data:image/png;base64," + original;
          img.style.cssText = `width:${breite}px;display:block`;
          spalte("Original (HA-Entities-Karten, Prod)").appendChild(img);
          await img.decode();
        }
        const ziel = spalte("tomtut-pool-dashboard · layout: liste (It16)");
        const buehne = document.createElement("div");
        buehne.style.cssText = `width:${breite}px;display:flex;flex-direction:column;gap:8px`;
        for (const [k, v] of Object.entries(theme.vars)) buehne.style.setProperty(k, v);
        ziel.appendChild(buehne);
        const s = (st) => ({ state: st, attributes: {}, last_changed: new Date().toISOString() });
        const hass = {
          ...window.demo.DEMO_HASS,
          states: {
            "input_boolean.poolwp_pv_logik_aktivieren": s("on"),
            "input_boolean.poolwp_manuell_ein": s("off"),
            "switch.solarsteuerung_switch": s("off"),
            "sensor.solarheizung_status": s("Bypass"),
            "switch.poolroboter_switch_0": s("on"),
            "switch.gsa_zigbee": s("off"),
            "switch.poollampe_zigbee": s("off"),
            "input_boolean.pool_manuell_reinigen": s("on"),
          },
        };
        const cards = kaesten.map((slot) => {
          const card = document.createElement("tomtut-pool-dashboard");
          card.setConfig({ hero: { enabled: false }, frame: { enabled: false, fill: "transparent" }, slots: [slot] });
          card.hass = hass;
          buehne.appendChild(card);
          return card;
        });
        await Promise.all(cards.map((c) => c.updateComplete));
        await Promise.all(cards.map((c) => c.shadowRoot.querySelector("tomtut-pool-slot-custom").updateComplete));
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      },
      { theme: I16_THEMES.dunkel, kaesten: I16_KAESTEN, breite: I16_BREITE, original }
    );
    const pfad = join(ausgabe, "it16-beleg.png");
    await p2.screenshot({ path: pfad, fullPage: true });
    try {
      await p2.screenshot({ path: I16_BELEG, fullPage: true });
    } catch (err) {
      results.push(`       ohne Beleg auf dem NAS (${err?.message || err})`);
    }
  } finally {
    await p2.close();
  }
});

/* ------------------------------------------------------------------ */
/* Iteration 16: Overlays im dunklen Theme deckend, helles unverändert */
/* ------------------------------------------------------------------ */
/*
 * Anlass: Kiosk-Flur (Prod, Theme "Liquid Glass" dunkel). Dessen
 * --ha-card-background ist rgba(0,0,0,0.3) — als Kästchen-Hintergrund schien
 * das Pumpenbild durch, "736 WATT" war kaum lesbar, der Powerbutton fast
 * unsichtbar. Geprüft wird jetzt für ALLE Overlays der Alles-Config
 * (Becken, WP, Pumpe, UV, Solar): Unterlage deckend + Kontrast; und dass das
 * helle Theme pixelgleich bleibt (Screenshot mit und ohne --tt-deck).
 */
const I16_OVERLAYS =
  ".value-box:not(.no-bg), .thermo-val, .chem-box, .label-badge:not(.no-bg), .mode-badge, .release-badge, .power-badge";
const I16_DUNKEL_THEMES = {
  "Liquid Glass dunkel": {
    "--primary-text-color": "rgba(255, 255, 255, 0.96)",
    "--secondary-text-color": "rgba(222, 222, 222, 0.96)",
    "--ha-card-background": "rgba(0, 0, 0, 0.3)",
  },
  "HA-Standard dunkel": {
    "--primary-text-color": "#e1e1e1",
    "--secondary-text-color": "#9b9b9b",
    "--card-background-color": "#1c1c1c",
  },
};
const i16Alles = (vars, breite = 1200) =>
  page.evaluate(
    async ({ vars, breite, sel }) => {
      document.body.innerHTML = "";
      document.body.style.background = Object.keys(vars).length ? "#101826" : "";
      const buehne = document.createElement("div");
      buehne.id = "buehne";
      buehne.style.width = breite + "px";
      for (const [k, v] of Object.entries(vars)) buehne.style.setProperty(k, v);
      document.body.appendChild(buehne);
      const card = document.createElement("tomtut-pool-dashboard");
      const cfg = window.demo.allesConfig(0, false);
      card.setConfig({ ...cfg, frame: { enabled: true, fill: "transparent" } });
      card.hass = window.demo.DEMO_HASS;
      buehne.appendChild(card);
      await card.updateComplete;
      const kinder = [...card.shadowRoot.querySelector(".grid").children];
      await Promise.all(kinder.map((el) => el.updateComplete));
      const bilder = kinder.flatMap((el) => [...(el.shadowRoot?.querySelectorAll("img") || [])]);
      await Promise.all(bilder.map((img) => (img.complete ? null : new Promise((f) => { img.onload = img.onerror = f; }))));
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      /* erste Farbe eines Werts; Chromium serialisiert relative Farben als
         color(srgb 0..1 …), klassische als rgb()/rgba() mit 0..255 */
      const farbe = (t) => {
        const m = String(t).match(/(rgba?|color)\(([^)]+)\)/);
        if (!m) return null;
        const teile = m[2].replace("srgb", "").split(/[ ,/]+/).filter(Boolean).map(Number);
        const [r, g, b, a = 1] = teile;
        const k = m[1] === "color" ? 255 : 1;
        return { r: r * k, g: g * k, b: b * k, a };
      };
      const lum = ({ r, g, b }) => {
        const f = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const kontrast = (x, y) => {
        const [h, d] = [lum(x), lum(y)].sort((m, n) => n - m);
        return (h + 0.05) / (d + 0.05);
      };
      const befunde = [];
      for (const el of kinder) {
        const name = el.tagName.toLowerCase().replace("tomtut-pool-", "");
        for (const o of el.shadowRoot?.querySelectorAll(sel) || []) {
          const cs = getComputedStyle(o);
          const deck = farbe(cs.backgroundImage);
          const text = farbe(o.classList.contains("power-badge") ? cs.color : cs.color);
          befunde.push({
            wo: `${name} > .${String(o.className).split(" ").join(".")}`,
            deckAlpha: deck ? deck.a : null,
            kontrast: deck && text ? Math.round(kontrast(text, deck) * 10) / 10 : null,
            power: o.classList.contains("power-badge"),
          });
        }
      }
      return befunde;
    },
    { vars, breite, sel: I16_OVERLAYS }
  );

for (const [thema, vars] of Object.entries(I16_DUNKEL_THEMES)) {
  await checkAsync(`It16 dunkel (${thema}): alle Overlays deckend + lesbar (Becken, WP, Pumpe, UV, Solar)`, async () => {
    const b = await i16Alles(vars);
    const typen = new Set(b.map((x) => x.wo.split(" > ")[0]));
    for (const t of ["hero", "slot-heatpump", "slot-pump", "slot-uv", "slot-solar"]) assert.ok(typen.has(t), `keine Overlays in ${t}`);
    const schlecht = b.filter((x) => x.deckAlpha !== 1 || x.kontrast < (x.power ? 3 : 4.5));
    assert.deepEqual(schlecht, [], JSON.stringify(schlecht));
    const min = Math.min(...b.filter((x) => !x.power).map((x) => x.kontrast));
    results.push(`       ${thema}: ${b.length} Overlays deckend, kleinster Text-Kontrast ${min}:1`);
  });
  await page.locator("#buehne").screenshot({ path: join(ausgabe, `it16-dunkel-${thema.replace(/\W+/g, "-")}.png`), animations: "disabled" });
}

await checkAsync("It16 hell: --tt-deck ist unsichtbar, Alles-Config pixelgleich mit und ohne Unterlage", async () => {
  const b = await i16Alles({});
  assert.ok(b.length > 10, "zu wenig Overlays");
  assert.deepEqual(b.filter((x) => x.deckAlpha !== 0), [], "Unterlage im hellen Theme sichtbar");
  const mit = await page.locator("#buehne").screenshot({ animations: "disabled" });
  await page.evaluate(() => {
    const card = document.querySelector("tomtut-pool-dashboard");
    for (const el of card.shadowRoot.querySelector(".grid").children) {
      const st = document.createElement("style");
      st.textContent = ".slot { --tt-deck: transparent !important; }";
      el.shadowRoot.appendChild(st);
    }
  });
  await new Promise((r) => setTimeout(r, 50));
  const ohne = await page.locator("#buehne").screenshot({ animations: "disabled" });
  assert.ok(mit.equals(ohne), "helles Theme sieht mit Unterlage anders aus");
});

/* ------------------------------------------------------------------ */
/* Iteration 17: Mini-Ansicht (view: mini) fürs Studio-Tablet          */
/* ------------------------------------------------------------------ */
/*
 * Zusage: Becken + 4 Geräte passen bei 500 px Kartenbreite in <= 290 px
 * Höhe — Thomas' handgebautes Kästchen auf dem Studio-Tablet (Lenovo Tab M9,
 * 1340 × 800, dpr 1, Theme "Liquid Glass") ist 500 × 282. Bei 380 px darf
 * es höher werden (2er-Raster), muss aber lesbar bleiben. Gemessen in
 * hellem Theme und in Liquid Glass (Variablen 1:1 vom Dev-HA); dazu:
 * kein Wert abgeschnitten (kein Ellipsis), alles in seiner Kachel, keine
 * Überlappung, Kontrast >= 4,5:1, deckende Kacheln im Dunkeln.
 */
const I17_MAX_500 = 290;
const I17_MAX_380 = 400;
const I17_THEMES = {
  hell: I16_THEMES.hell,
  "Liquid Glass": {
    seite: "linear-gradient(180deg, #1a3a6b 0%, #0a1a35 50%, #020508 100%)",
    vars: {
      "--primary-text-color": "rgba(255, 255, 255, 0.96)",
      "--secondary-text-color": "rgba(222, 222, 222, 0.96)",
      "--primary-background-color": "rgb(18, 11, 25)",
      "--secondary-background-color": "rgb(18, 11, 25)",
      "--card-background-color": "rgb(18, 11, 25)",
      "--ha-card-background": "rgba(0, 0, 0, 0.3)",
      "--ha-card-border-radius": "34px",
      "--ha-card-border-width": "0",
      "--ha-card-backdrop-filter": "blur(8px)",
      "--ha-card-box-shadow":
        "3px 3px 0.5px -3.5px rgba(255, 255, 255, 0.30) inset, -2px -2px 0.5px -2px rgba(255, 255, 255, 0.30) inset, 0 0 8px 1px rgba(255, 255, 255, 0.10) inset, 0 0 2px 0 rgba(0, 0, 0, 0.10)",
      "--divider-color": "rgba(152, 152, 157, 0.3)",
      "--primary-color": "#FF9F0A",
    },
  },
};

const i17Bauen = (pg, breite, theme, extra = {}) =>
  pg.evaluate(
    async ({ breite, theme, extra }) => {
      document.body.innerHTML = "";
      document.body.style.cssText = `margin:0;padding:20px;background:${theme.seite};min-height:100vh`;
      const buehne = document.createElement("div");
      buehne.id = "buehne";
      buehne.style.cssText = `width:${breite}px`;
      for (const [k, v] of Object.entries(theme.vars)) document.body.style.setProperty(k, v);
      document.body.appendChild(buehne);
      const card = document.createElement("tomtut-pool-dashboard");
      card.setConfig(window.demo.miniConfig(extra));
      card.hass = {
        ...window.demo.DEMO_HASS,
        states: {
          ...window.demo.DEMO_HASS.states,
          "input_select.wp_modus_heizen": { state: "Heizen Smart", attributes: {}, last_changed: new Date().toISOString() },
        },
      };
      buehne.appendChild(card);
      await card.updateComplete;
      const sr = card.shadowRoot;
      const bilder = [...sr.querySelectorAll("img")];
      await Promise.all(bilder.map((img) => (img.complete && img.naturalWidth ? null : new Promise((f) => { img.onload = img.onerror = f; }))));
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      const farbe = (t) => {
        const m = String(t).match(/(rgba?|color)\(([^)]+)\)/);
        if (!m) return null;
        const [r, g, b, a = 1] = m[2].replace("srgb", "").split(/[ ,/]+/).filter(Boolean).map(Number);
        const k = m[1] === "color" ? 255 : 1;
        return { r: r * k, g: g * k, b: b * k, a };
      };
      const lum = ({ r, g, b }) => {
        const f = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const kontrast = (x, y) => {
        const [h, d] = [lum(x), lum(y)].sort((m, n) => n - m);
        return (h + 0.05) / (d + 0.05);
      };
      const R = (el) => el.getBoundingClientRect();
      const karte = R(sr.querySelector("ha-card"));
      const kopf = R(sr.querySelector(".m-kopf"));
      const kacheln = [...sr.querySelectorAll(".kachel")];
      const befunde = [];
      const drin = (r, box, name) => {
        if (r.left < box.left - 0.5 || r.right > box.right + 0.5 || r.top < box.top - 0.5 || r.bottom > box.bottom + 0.5)
          befunde.push(`${name} ragt heraus`);
      };
      const ueber = (a, b) => a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5;
      for (const el of sr.querySelectorAll(".m-becken, .m-temp, .m-chip")) drin(R(el), kopf, el.className);
      drin(kopf, karte, "Kopf");
      let minKontrast = 99;
      let deckAlpha = [];
      kacheln.forEach((k, i) => {
        const kr = R(k);
        drin(kr, karte, `Kachel ${i + 1}`);
        if (ueber(kr, kopf)) befunde.push(`Kachel ${i + 1} liegt über dem Kopf`);
        kacheln.forEach((k2, j) => { if (j > i && ueber(kr, R(k2))) befunde.push(`Kachel ${i + 1}/${j + 1} überlappen`); });
        for (const el of k.querySelectorAll(".k-bild, .k-zeile, .k-sperre, .k-status")) drin(R(el), kr, `Kachel ${i + 1} ${el.className}`);
        for (const t of k.querySelectorAll(".k-text")) {
          if (t.scrollWidth > t.clientWidth + 0.5) befunde.push(`Kachel ${i + 1}: "${t.textContent}" abgeschnitten`);
        }
        const cs = getComputedStyle(k);
        const deck = farbe(cs.backgroundImage);
        deckAlpha.push(deck ? deck.a : null);
        const grund = deck && deck.a === 1 ? deck : farbe(cs.backgroundColor);
        for (const z of k.querySelectorAll(".k-zeile")) {
          const c = farbe(getComputedStyle(z).color);
          if (grund && c) minKontrast = Math.min(minKontrast, kontrast(c, grund));
        }
      });
      const kaputt = bilder.filter((b) => !b.naturalWidth).map((b) => b.src);
      const r1 = (x) => Math.round(x * 10) / 10;
      return {
        breite: r1(karte.width),
        hoehe: r1(karte.height),
        kopfHoehe: r1(kopf.height),
        kachelMasse: kacheln.map((k) => `${r1(R(k).width)}x${r1(R(k).height)}`),
        reihen: new Set(kacheln.map((k) => Math.round(R(k).top))).size,
        texte: kacheln.map((k) => [...k.querySelectorAll(".k-text")].map((t) => t.textContent)),
        temp: sr.querySelector(".m-temp-wert")?.textContent,
        minKontrast: r1(minKontrast),
        deckAlpha,
        befunde,
        kaputt,
      };
    },
    { breite, theme, extra }
  );

const i17Masse = {};
for (const [themeName, theme] of Object.entries(I17_THEMES)) {
  for (const breite of [500, 380]) {
    await checkAsync(`It17 Mini ${breite} px, ${themeName}: passt, lesbar, nichts abgeschnitten`, async () => {
      const m = await i17Bauen(page, breite, theme);
      i17Masse[`${breite}-${themeName}`] = m;
      assert.equal(m.breite, breite);
      assert.equal(m.kachelMasse.length, 4, "nicht 4 Kacheln");
      assert.deepEqual(m.kaputt, [], "Bild lädt nicht");
      assert.deepEqual(m.befunde, []);
      assert.ok(m.minKontrast >= 4.5, `Kontrast nur ${m.minKontrast}:1`);
      if (breite === 500) {
        assert.ok(m.hoehe <= I17_MAX_500, `${m.hoehe} px hoch (max ${I17_MAX_500})`);
        assert.equal(m.reihen, 1, "bei 500 px nicht in einer Zeile");
      } else {
        assert.ok(m.hoehe <= I17_MAX_380, `${m.hoehe} px hoch (max ${I17_MAX_380})`);
        assert.equal(m.reihen, 2, "bei 380 px kein 2er-Raster");
      }
      if (themeName !== "hell") assert.ok(m.deckAlpha.every((a) => a === 1), `Kacheln nicht deckend: ${m.deckAlpha}`);
      assert.deepEqual(m.texte[0], ["Heizen Smart", "1840 W"]);
      results.push(
        `       gemessen ${breite} px ${themeName}: Card ${m.breite}x${m.hoehe} px (Kopf ${m.kopfHoehe}), Kacheln ${m.kachelMasse.join(" ")}, Kontrast min ${m.minKontrast}:1`
      );
    });
    await page.locator("#buehne").screenshot({ path: join(ausgabe, `it17-mini-${breite}-${themeName.replace(/\W+/g, "-")}.png`), animations: "disabled" });
  }
}

check("It17 Mini: Pooltemperatur mit Wert", () => assert.equal(i17Masse["500-hell"]?.temp, "24,6 °C"));
/* ab hier: 500 px in Liquid Glass (Studio-Tablet) */
await i17Bauen(page, 500, I17_THEMES["Liquid Glass"]);
await checkAsync("It17 Mini: unknown -> '–' im Browser", async () => {
  const t = await page.evaluate(async () => {
    const card = document.querySelector("tomtut-pool-dashboard");
    card.hass = { ...card.hass, states: { ...card.hass.states, "sensor.pool_wassertemperatur": { state: "unknown", attributes: { unit_of_measurement: "°C" } } } };
    await card.updateComplete;
    return card.shadowRoot.querySelector(".m-temp-wert").textContent;
  });
  assert.equal(t, "–");
});

/*
 * Dialog: Tipp auf die WP-Kachel öffnet den vollen Kasten. Er muss über
 * einer (simulierten) HA-Kopfleiste mit z-index 1000 liegen — ohne selbst
 * einen z-index > 10 zu vergeben (Top-Layer via showModal).
 */
await checkAsync("It17 Dialog: Top-Layer über der Kopfleiste, voller WP-Kasten, kein z-index > 10", async () => {
  const d = await page.evaluate(async () => {
    const kopf = document.createElement("div");
    kopf.style.cssText = "position:fixed;top:0;left:0;right:0;height:56px;background:#123;z-index:1000";
    document.body.appendChild(kopf);
    const card = document.querySelector("tomtut-pool-dashboard");
    card.shadowRoot.querySelector('.kachel[data-mini="1"]').click();
    await card.updateComplete;
    const dlg = card.shadowRoot.querySelector("dialog.m-dialog");
    const slot = dlg.querySelector("tomtut-pool-slot-heatpump");
    await slot.updateComplete;
    await Promise.all([...slot.shadowRoot.querySelectorAll("img")].map((i) => (i.complete ? null : new Promise((f) => (i.onload = i.onerror = f)))));
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const r = dlg.getBoundingClientRect();
    const sr = slot.getBoundingClientRect();
    /* was liegt oben links im Dialog (unter der Kopfleiste)? */
    const x = r.left + r.width / 2;
    const y = Math.max(r.top + 5, 20);
    const oben = document.elementFromPoint(x, y);
    const zmax = [card.shadowRoot, slot.shadowRoot]
      .flatMap((root) => [...root.querySelectorAll("*")])
      .map((el) => parseInt(getComputedStyle(el).zIndex, 10))
      .filter((z) => !isNaN(z));
    return {
      modal: dlg.matches(":modal"),
      dialog: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)],
      slot: [Math.round(sr.width), Math.round(sr.height)],
      obenIstCard: oben === card,
      vp: [innerWidth, innerHeight],
      zmax: Math.max(0, ...zmax),
    };
  });
  assert.ok(d.modal, "nicht modal (kein Top-Layer)");
  assert.ok(d.obenIstCard, "Kopfleiste liegt über dem Dialog");
  assert.ok(d.slot[0] > 300 && d.slot[1] > 200, `Kasten zu klein: ${d.slot}`);
  assert.ok(d.dialog[1] >= 0 && d.dialog[1] + d.dialog[3] <= d.vp[1] + 1, `Dialog passt nicht in den Viewport: ${d.dialog}`);
  assert.ok(d.zmax <= 10, `z-index ${d.zmax}`);
  results.push(`       Dialog ${d.dialog[2]}x${d.dialog[3]} px, Kasten ${d.slot.join("x")} px, max z-index ${d.zmax}`);
});
await page.screenshot({ path: join(ausgabe, "it17-dialog.png"), animations: "disabled" });
await page.evaluate(async () => {
  const card = document.querySelector("tomtut-pool-dashboard");
  card.shadowRoot.querySelector(".m-zu").click();
  await card.updateComplete;
});

/* Beleg: Mini (Liquid Glass, dpr 1) neben Thomas' Original-Kästchen im
   gleichen Maßstab. Fehlt das Original, entfällt es — der Test hängt nicht
   am NAS. */
const I17_ORIGINAL =
  process.env.IT17_ORIGINAL ||
  "/mnt/nas/proxmox-container/studio/vorgaenge/ka-973/prod-ist/ausschnitt-tomtutstudio-poolkaestchen.png";
await checkAsync("It17: Beleg Mini neben Original (500 px, dpr 1)", async () => {
  let original = null;
  try {
    original = (await readFile(I17_ORIGINAL)).toString("base64");
  } catch {
    results.push("       ohne Original-Ausschnitt");
  }
  await page.evaluate(
    async ({ theme, original }) => {
      const card = document.querySelector("tomtut-pool-dashboard");
      const buehne = document.getElementById("buehne");
      const reihe = document.createElement("div");
      reihe.id = "beleg";
      reihe.style.cssText = "display:flex;gap:24px;align-items:flex-start;width:max-content";
      document.body.insertBefore(reihe, buehne);
      const spalte = (titel) => {
        const d = document.createElement("div");
        d.innerHTML = `<div style="color:#e1e1e1;font:600 13px system-ui;margin:0 0 8px">${titel}</div>`;
        reihe.appendChild(d);
        return d;
      };
      if (original) {
        const img = document.createElement("img");
        img.src = "data:image/png;base64," + original;
        img.style.cssText = "width:500px;display:block";
        spalte("Original (picture-elements, Studio-Tablet)").appendChild(img);
        await img.decode();
      }
      spalte("tomtut-pool-dashboard · view: mini (It17)").appendChild(buehne);
      card.hass = window.demo.DEMO_HASS;
      await card.updateComplete;
    },
    { theme: I17_THEMES["Liquid Glass"], original }
  );
  const letzte = Object.keys(I17_THEMES).at(-1);
  assert.equal(letzte, "Liquid Glass");
  await page.locator("#beleg").screenshot({ path: join(ausgabe, "it17-beleg.png"), animations: "disabled" });
});

check("keine Fehler in der Browser-Konsole", () =>
  assert.deepEqual(konsolenfehler, [], konsolenfehler.join(" | "))
);

/* ------------------------------------------------------------------ */
/* Kontaktbogen als Beleg                                              */
/* ------------------------------------------------------------------ */

const kontaktbogen = async () => {
  await page.evaluate(async () => {
  document.body.innerHTML = "";
  const abschnitt = async (titel, breite, bauen) => {
    const kopf = document.createElement("div");
    kopf.className = "kopf";
    kopf.style.width = breite + "px";
    kopf.style.margin = "0 auto";
    kopf.textContent = titel;
    document.body.appendChild(kopf);
    const buehne = document.createElement("div");
    buehne.className = "buehne";
    buehne.style.width = breite + "px";
    document.body.appendChild(buehne);
    await bauen(buehne);
  };

  const karte = async (buehne, config) => {
    const card = document.createElement("tomtut-pool-dashboard");
    card.setConfig(config);
    card.hass = window.demo.DEMO_HASS;
    buehne.appendChild(card);
    await card.updateComplete;
    await Promise.all(
      [...card.shadowRoot.querySelector(".grid").children].map((el) => el.updateComplete)
    );
  };

  for (const breite of [1200, 768, 360]) {
    await abschnitt(`Alles-Config, ${breite} px breit`, breite, (b) =>
      karte(b, window.demo.allesConfig(0, false))
    );
  }
  await abschnitt("UV-C-Lampe in drei Größen (30 / 65 / 100 Prozent, ungedreht)", 1200, async (b) => {
    const reihe = document.createElement("div");
    reihe.style.cssText = "display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:1200px";
    b.appendChild(reihe);
    for (const groesse of window.demo.UV_GROESSEN) {
      const zelle = document.createElement("div");
      reihe.appendChild(zelle);
      const card = document.createElement("tomtut-pool-dashboard");
      card.setConfig({ hero: { enabled: false }, slots: [window.demo.uvSlot(0, false, groesse)] });
      card.hass = window.demo.DEMO_HASS;
      zelle.appendChild(card);
      await card.updateComplete;
    }
  });
  await abschnitt("UV-C-Lampe in allen Lagen (0/45/90/180/270 Grad, unten gespiegelt)", 1200, async (b) => {
    for (const mirror of [false, true]) {
      const reihe = document.createElement("div");
      reihe.style.cssText = "display:grid;grid-template-columns:repeat(5,1fr);gap:10px;width:1200px";
      b.appendChild(reihe);
      for (const grad of [0, 45, 90, 180, 270]) {
        const zelle = document.createElement("div");
        reihe.appendChild(zelle);
        const card = document.createElement("tomtut-pool-dashboard");
        card.setConfig({ hero: { enabled: false }, slots: [window.demo.uvSlot(grad, mirror)] });
        card.hass = window.demo.DEMO_HASS;
        zelle.appendChild(card);
        await card.updateComplete;
      }
    }
  });

  /* ---- Iteration 9 ---- */
  const reihe = async (b, spalten, configs, fill = "transparent") => {
    const r = document.createElement("div");
    r.style.cssText = `display:grid;grid-template-columns:repeat(${spalten},1fr);gap:10px;width:1200px`;
    b.appendChild(r);
    for (const slot of configs) {
      const zelle = document.createElement("div");
      r.appendChild(zelle);
      const card = document.createElement("tomtut-pool-dashboard");
      card.setConfig({ hero: { enabled: false }, frame: { enabled: true, fill }, slots: [slot] });
      card.hass = window.demo.DEMO_HASS;
      zelle.appendChild(card);
      await card.updateComplete;
    }
  };
  const wp = (extra) => ({
    type: "heatpump",
    switch_entity: "switch.waermepumpe",
    power_entity: "sensor.waermepumpe_power",
    ...extra,
  });
  await abschnitt(
    "Wärmepumpe: Blatt-Designs (klassisch · 3 Blätter · 5 Blätter · Sichel · Propeller · Batman)",
    1200,
    (b) =>
      reihe(
        b,
        3,
        [
          ["klassisch", "Klassisch"],
          ["drei", "3 Blätter"],
          ["fuenf", "5 Blätter"],
          ["sichel", "Sichel"],
          ["propeller", "Propeller"],
          ["batman", "Batman"],
        ].map(([d, name]) => wp({ fan_design: d, label_text: name }))
      )
  );
  await abschnitt(
    "Wärmepumpe: Rad nach Modus einfärben (Heizen Boost rot · Kühlen Smart blau · Default schwarz/weiß)",
    1200,
    (b) =>
      reihe(b, 3, [
        wp({ show_mode: true, mode_entity: "input_select.wp_modus_heizen", fan_color_mode: "modus", fan_design: "batman", label_text: "Heizen Boost" }),
        wp({ show_mode: true, mode_entity: "input_select.wp_modus_kuehlen", fan_color_mode: "modus", fan_design: "sichel", label_text: "Kühlen Smart" }),
        wp({ show_mode: true, mode_entity: "input_select.wp_modus_heizen", label_text: "neutral" }),
      ])
  );
  /* ---- Iteration 12 ---- */
  await abschnitt(
    "Wärmepumpe: Freigabekontakt (geschlossen = frei · offen = gesperrt, Rad steht · binary_sensor = nur Anzeige)",
    1200,
    (b) => reihe(b, 3, [window.demo.wpFreigabe("frei"), window.demo.wpFreigabe("gesperrt"), window.demo.wpFreigabe("meldung")])
  );

  await abschnitt("Schwarze Füllung: UV-Glühen max + Wabern, Solarfeld (Thomas' Foto), Wärmepumpe", 1200, (b) =>
    reihe(
      b,
      3,
      [
        { ...window.demo.uvSlot(0, false), glow_intensity: 100, glow_pulse: 60 },
        window.demo.allesConfig().slots[3],
        wp({ show_mode: true, mode_entity: "input_select.wp_modus_kuehlen", fan_color_mode: "modus", label_text: "Kühlen" }),
      ],
      "schwarz"
    )
  );

  await abschnitt("Editor: Kasten-Überschriften und Kennfarben je Slot-Typ", 640, async (b) => {
    const editor = document.createElement("tomtut-pool-dashboard-editor");
    editor.setConfig({
      hero: { enabled: false },
      slots: [
        { type: "heatpump", label_text: "Wärmepumpe" },
        { type: "pump", label: "Filterpumpe" },
        { type: "uv", label: "Entkeimung" },
        { type: "solar", label: "Absorberfeld" },
        { type: "custom", title: "Wetter" },
        { type: "frame" },
      ],
    });
    editor.hass = window.demo.DEMO_HASS;
    editor.style.cssText = "display:block;background:#fff;border-radius:12px";
    b.appendChild(editor);
    await editor.updateComplete;
    /* nur die Koepfe zeigen — die Feldlisten wuerden den Bogen sprengen */
    for (const karte of editor.shadowRoot.querySelectorAll(".slot-card:not(.becken-card)")) {
      for (const kind of [...karte.children]) {
        if (!kind.classList.contains("slot-head")) kind.remove();
      }
    }
  });

  const bilder = [...document.querySelectorAll("tomtut-pool-dashboard")]
    .flatMap((c) => [...c.shadowRoot.querySelector(".grid").children])
    .flatMap((el) => [...(el.shadowRoot?.querySelectorAll("img") || [])]);
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
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  });

  const bogen = join(ausgabe, "kontaktbogen.png");
  await page.screenshot({ path: bogen, fullPage: true });
  belegPfad = bogen;
  try {
    await page.screenshot({ path: BELEG, fullPage: true });
    belegPfad = BELEG;
  } catch (err) {
    results.push(`  ohne Beleg auf dem NAS (${err?.message || err})`);
  }
};

await checkAsync("Kontaktbogen gerendert", kontaktbogen);

await browser.close();
server.close();

console.log(results.join("\n"));
console.log(
  process.exitCode
    ? "\nRender-Test FEHLGESCHLAGEN"
    : `\nRender-Test ok (${results.length} Checks, ${laeufe} Layouts gemessen)\n` +
        `Screenshots: ${ausgabe}\nKontaktbogen: ${belegPfad}`
);
