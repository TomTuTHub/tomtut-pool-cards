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
import { UV_LAGEN } from "./fixtures/demo.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const wurzel = join(here, "..");
const ausgabe = join(here, "render-out");
/* Beleg für die Karte im Studio-Cockpit (ka-839); fehlt der Ordner, wird er
   übersprungen — der Test hängt nicht am NAS. */
const BELEG =
  process.env.RENDER_BELEG ||
  "/mnt/nas/proxmox-container/studio/vorgaenge/ka-839/pool-cards-it6-render.png";

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
        " .label-badge, .chem-box, .stage-btn, .slot-title, .entries";
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
