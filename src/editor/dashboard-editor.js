import { LitElement, html, nothing } from "lit";
import { Fields, editorStyles, abschnitt, erweitert, gruppe } from "../shared/fields.js";
import { loadHaElements } from "../shared/ha-elements.js";
import {
  DEFAULT_SHAPE,
  SLOT_TYPES,
  slotFarbe,
  slotTypeOptions,
  shapeOf,
  deviceImage,
  HERO_SPRITES,
} from "../shared/assets.js";
import { HEATPUMP_DEFAULTS } from "../slots/heatpump.js";
import { PUMP_DEFAULTS } from "../slots/pump.js";
import { UV_DEFAULTS } from "../slots/uv.js";
import { SOLAR_DEFAULTS } from "../slots/solar.js";
import { CUSTOM_MAX_ENTRIES } from "../slots/custom.js";
import { heroDefaultsFor, teilLage } from "../hero.js";
import { slotLabel } from "../shared/slot-base.js";
import {
  kioskSchluessel,
  kioskGilt,
  kioskMigrieren,
  kastenSchluessel,
  neueKastenId,
  KIOSK_BECKEN,
} from "../shared/kiosk.js";
import { configHinweise } from "../shared/pruefen.js";
import { typWechsel } from "./typwechsel.js";
import {
  ansichtVon,
  miniWahl,
  MINI_TYPEN,
  MINI_KACHEL_FILLS,
  miniKachelFill,
  MINI_CARD_FILLS,
  miniCardFill,
} from "../mini.js";
import {
  heroFields,
  heatpumpFields,
  pumpFields,
  uvFields,
  solarFields,
  customFields,
  customEntryFields,
  frameFields,
  labelFeld,
} from "./slot-fields.js";

/*
 * Visueller Editor (seit Iteration 23 — "weniger ist mehr").
 *
 *   Darstellung   Voll/Mini, Rahmen, Füllung — gilt für die ganze Card
 *   Becken        Akkordeon
 *   Kasten 1..n   je ein Akkordeon: Kopfzeile mit Kennfarbe, Typ und Name,
 *                 ↑ ↓ Duplizieren Löschen (mit Rückfrage). Neu angelegt =
 *                 offen, alles andere zu.
 *   + Kasten      erst den Typ wählen (Kacheln mit Gerätebild)
 *   Kiosk         eigener, zugeklappter Block
 *
 * Innen hat jeder Kasten dieselbe Reihenfolge (slot-fields.js): Überschrift
 * → Grunddaten → Ein/Aus → Anzeige → Aussehen → EIN zugeklapptes
 * "Erweitert" mit allen Positionen und dem Feintuning. Kein Regler und kein
 * Schlüssel ist dabei verloren gegangen, sie sind nur nach hinten gewandert.
 *
 * YAML bleibt jederzeit möglich, ist aber nie nötig.
 */
const SLOT_DEFAULTS = {
  heatpump: HEATPUMP_DEFAULTS,
  pump: PUMP_DEFAULTS,
  uv: UV_DEFAULTS,
  solar: SOLAR_DEFAULTS,
};

/* Neu-Anlage: diese Typen als Kacheln, in dieser Reihenfolge */
export const NEU_TYPEN = [
  { typ: "heatpump", bild: "heatpump" },
  { typ: "pump", bild: "pump" },
  { typ: "uv", bild: "uv" },
  { typ: "solar", bild: "solar" },
  { typ: "custom", icon: "mdi:form-select" },
  { typ: "frame", icon: "mdi:crop-square" },
];

/* Überschrift-Platzhalter je Typ */
const LABEL_PLATZHALTER = {
  heatpump: "z.B. Wärmepumpe",
  pump: "z.B. Poolpumpe",
  uv: "z.B. UV-C-Lampe",
  solar: "z.B. Solarheizung",
  custom: "z.B. Poolschalter",
  frame: "z.B. Platzhalter",
};

/* Patch anwenden; ein Wert `undefined` entfernt den Schlüssel aus der Config */
export const applyPatch = (base, patch) => {
  const next = { ...(base || {}) };
  for (const [k, v] of Object.entries(patch || {})) {
    if (v === undefined) delete next[k];
    else next[k] = v;
  }
  return next;
};

/* Frische Card (Stub aus "Karte hinzufügen"): noch nichts eingetragen */
const istFrisch = (c = {}) =>
  !(Array.isArray(c.slots) && c.slots.length) &&
  !["temp_entity", "ph_entity", "rx_entity", "inlet_temp_entity"].some((k) => c.hero?.[k]);

export class TomtutPoolDashboardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _teilePos: { state: true },
    _offen: { state: true },
    _typWahl: { state: true },
    _loeschFrage: { state: true },
    _eintragOffen: { state: true },
    _kioskOffen: { state: true },
  };

  constructor() {
    super();
    this._typWahl = false;
    this._loeschFrage = null;
    this._eintragOffen = new Set();
    this._kioskOffen = false;
    this._typStash = {};
  }

  connectedCallback() {
    super.connectedCallback();
    /* ha-entity-picker / ha-icon-picker nachladen und danach neu zeichnen */
    loadHaElements().then((ok) => {
      if (ok) this.requestUpdate();
    });
  }

  setConfig(config) {
    this._config = {
      version: 1,
      hero: { enabled: true, shape: DEFAULT_SHAPE },
      frame: { enabled: true, fill: "transparent" },
      slots: [],
      ...(config || {}),
    };
    /* Aufklapp-Stand nur beim ersten Mal: eine frische Card öffnet das
       Becken (erster Schritt der Neu-Anlage), sonst ist alles zu */
    if (this._offen === undefined) this._offen = new Set(istFrisch(this._config) ? ["becken"] : []);
  }

  _emit(next) {
    this._config = next;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: next } }));
  }

  _updateHero(patch) {
    this._emit({ ...this._config, hero: applyPatch(this._config.hero, patch) });
  }

  _updateFrame(patch) {
    this._emit({ ...this._config, frame: applyPatch(this._config.frame, patch) });
  }

  _slots() {
    return Array.isArray(this._config?.slots) ? this._config.slots : [];
  }

  /* ---- Akkordeon ---- */

  _istOffen(key) {
    return this._offen?.has(String(key)) === true;
  }

  _umschalten(key) {
    const neu = new Set(this._offen);
    if (neu.has(String(key))) neu.delete(String(key));
    else neu.add(String(key));
    this._offen = neu;
  }

  /* Indizes der Kästen verschieben (nach Löschen, Verschieben, Duplizieren) */
  _offenUmrechnen(fn) {
    const neu = new Set();
    for (const k of this._offen || []) {
      if (!/^\d+$/.test(k)) {
        neu.add(k);
        continue;
      }
      const n = fn(Number(k));
      if (n !== null) neu.add(String(n));
    }
    this._offen = neu;
    this._eintragOffen = new Set(
      [...this._eintragOffen]
        .map((k) => {
          const [s, e] = k.split(":").map(Number);
          const n = fn(s);
          return n === null ? null : `${n}:${e}`;
        })
        .filter(Boolean)
    );
  }

  /* ---- Ansicht Voll / Mini (Iteration 17) ---- */

  _setAnsicht(ansicht) {
    /* voll = Default: Schlüssel raus, die Config bleibt schlank */
    if (ansichtVon(this._config) === ansicht) return;
    this._emit(applyPatch(this._config, { view: ansicht === "mini" ? "mini" : undefined }));
  }

  /*
   * "Darstellung" (Iteration 23): alles, was für die ganze Card gilt, in
   * EINEM Block ganz oben — Ansicht, Rahmen, Füllung, bei Mini die beiden
   * Hintergründe. Vorher standen Rahmen/Füllung als "Schritt 3" ganz unten.
   */
  _renderDarstellung(frameF) {
    const mini = ansichtVon(this._config) === "mini";
    const knopf = (wert, text) => html`<button
      type="button"
      class="ansicht-knopf ${(wert === "mini") === mini ? "aktiv" : ""}"
      data-ansicht="${wert}"
      aria-pressed="${(wert === "mini") === mini ? "true" : "false"}"
      @click="${() => this._setAnsicht(wert)}"
    >
      ${text}
    </button>`;
    return html`
      <div class="darstellung ${mini ? "mini" : ""}" data-block="darstellung">
        <div class="block-titel">Darstellung</div>
        <div class="row">
          <span class="row-label">Ansicht</span>
          <div class="ansicht-wahl" role="group" aria-label="Ansicht">
            ${knopf("voll", "Voll")} ${knopf("mini", "Mini")}
          </div>
        </div>
        ${frameF.toggle("Rahmen um die Kästen", "enabled", true)}
        ${frameF.select(
          "Füllung",
          "fill",
          [
            ["transparent", "Transparent (Theme)"],
            ["weiss", "Weiß"],
            ["schwarz", "Schwarz"],
          ],
          "transparent"
        )}
        ${mini
          ? html`<div class="ansicht-block mini">
              <div class="row">
                <span class="row-label">Kachel-Hintergrund</span>
                <select
                  data-key="mini_tile_fill"
                  @change="${(e) =>
                    this._emit(
                      applyPatch(this._config, {
                        mini_tile_fill: e.target.value === "schwarz" ? undefined : e.target.value,
                      })
                    )}"
                >
                  ${MINI_KACHEL_FILLS.map(
                    ([v, t]) => html`<option value="${v}" ?selected="${miniKachelFill(this._config) === v}">${t}</option>`
                  )}
                </select>
              </div>
              <div class="row">
                <span class="row-label">Außen-Hintergrund</span>
                <select
                  data-key="mini_card_fill"
                  @change="${(e) =>
                    this._emit(
                      applyPatch(this._config, {
                        mini_card_fill: e.target.value === "theme" ? undefined : e.target.value,
                      })
                    )}"
                >
                  ${MINI_CARD_FILLS.map(
                    ([v, t]) => html`<option value="${v}" ?selected="${miniCardFill(this._config) === v}">${t}</option>`
                  )}
                </select>
              </div>
            </div>`
          : nothing}
        <small>
          ${mini
            ? "Mini: die ganze Anlage kompakt — Becken oben, Geräte als Kacheln; Tipp öffnet den vollen Kasten."
            : "Die Füllung gilt für jeden Kasten: Hintergrund, Kästchen, Knöpfe und Schrift. Transparent = Theme."}
        </small>
      </div>
    `;
  }

  /*
   * "In Mini anzeigen" (Zusatz zu Iteration 17) — nur sichtbar, solange die
   * Card auf view: mini steht. Pro Kasten: Kachel zeigen ja/nein
   * (mini_hidden) und welche Werte (mini_show). Entspricht die Auswahl dem
   * Standard, fällt mini_show wieder weg — die Config bleibt schlank.
   */
  _renderMiniWahl(cfg, typRoh, update) {
    if (ansichtVon(this._config) !== "mini") return nothing;
    const typ = String(typRoh || "").toLowerCase();
    if (typ !== "hero" && !MINI_TYPEN.includes(typ)) return nothing;
    const w = miniWahl(cfg || {}, typ);
    const versteckt = typ !== "hero" && cfg?.mini_hidden === true;
    const setzeWert = (key, an) => {
      const neu = w.verfuegbar.map(([k]) => k).filter((k) => (k === key ? an : w.gewaehlt.includes(k)));
      const standard = neu.length === w.standard.length && neu.every((k, i) => k === w.standard[i]);
      update({ mini_show: standard ? undefined : neu });
    };
    return html`
      <div class="mini-wahl" data-mini-wahl="${typ}">
        <div class="mini-wahl-titel">In Mini anzeigen</div>
        ${typ === "hero"
          ? nothing
          : html`<label class="mini-wahl-zeile">
              <input
                type="checkbox"
                data-mini-hidden
                .checked="${!versteckt}"
                @change="${(e) => update({ mini_hidden: e.target.checked ? undefined : true })}"
              />
              <span>Als Kachel zeigen</span>
            </label>`}
        ${versteckt
          ? nothing
          : html`
              <div class="mini-wahl-werte">
                ${w.verfuegbar.map(
                  ([k, label]) => html`<label class="mini-wahl-zeile">
                    <input
                      type="checkbox"
                      data-mini-show="${k}"
                      .checked="${w.gewaehlt.includes(k)}"
                      @change="${(e) => setzeWert(k, e.target.checked)}"
                    />
                    <span>${label}</span>
                  </label>`
                )}
              </div>
              ${w.verfuegbar.length === 0 ? html`<small>Noch keine Werte — erst die Entities wählen.</small>` : nothing}
            `}
      </div>
    `;
  }

  /* ---- Kiosk-Modus (Iteration 15, seit Iteration 23 eigener Block unten) ---- */

  _setKiosk(an) {
    /* aus = beide Schlüssel raus, die Config bleibt schlank */
    if (an) this._kioskOffen = true;
    this._emit(applyPatch(this._config, an ? { kiosk: true } : { kiosk: undefined, kiosk_slots: undefined }));
  }

  /*
   * Kiosk je Kasten (Iteration 22, Bug A3): gespeichert wird die feste
   * Kasten-ID, nicht die Position. `index` = Slot-Index, null = Becken.
   */
  _setKioskKasten(index, an) {
    const cfg = kioskMigrieren(this._config);
    const slots = this._slotsMitIds(cfg, index);
    const basis = { ...cfg, slots, kiosk: true };
    const alle = kioskSchluessel(basis);
    const ziel = index === null ? KIOSK_BECKEN : kastenSchluessel(slots[index], index + 1);
    const gewaehlt = alle.filter((k) =>
      String(k) === String(ziel)
        ? an
        : kioskGilt(basis, k, typeof k === "string" ? slots.find((s) => s.id === k) : null)
    );
    /* alle angehakt = Liste weglassen (Default "alle") */
    this._emit(
      applyPatch(
        { ...cfg, slots },
        {
          kiosk_slots: gewaehlt.length === alle.length ? undefined : gewaehlt,
        }
      )
    );
  }

  /* Jeder sichtbare Kasten (bzw. nur `index`) bekommt eine ID, falls er keine hat */
  _slotsMitIds(cfg, index = undefined) {
    const slots = (Array.isArray(cfg.slots) ? cfg.slots : []).map((s) => ({ ...(s || {}) }));
    const ids = slots.map((s) => s.id).filter(Boolean);
    slots.forEach((s, i) => {
      if (s.id || String(s.type || "frame") === "hidden") return;
      if (index !== undefined && index !== null && i !== index) return;
      s.id = neueKastenId(ids);
      ids.push(s.id);
    });
    return slots;
  }

  _renderKiosk() {
    const an = this._config?.kiosk === true;
    const offen = this._kioskOffen === true;
    const alle = kioskSchluessel(this._config);
    const slots = this._slots();
    return html`
      <div class="kiosk-block slot-block ${an ? "an" : ""}" data-block="kiosk">
        <div class="kasten-kopf">
          <button
            type="button"
            class="kasten-auf"
            data-auf="kiosk"
            aria-expanded="${offen ? "true" : "false"}"
            @click="${() => (this._kioskOffen = !offen)}"
          >
            <span class="pfeil ${offen ? "auf" : ""}">▶</span>
            <span class="slot-ueberschrift">Kiosk (nur anzeigen)</span>
          </button>
          <label class="kiosk-schalter">
            <input
              type="checkbox"
              data-key="kiosk"
              .checked="${an}"
              @change="${(e) => this._setKiosk(e.target.checked)}"
            />
            <span>${an ? "an" : "aus"}</span>
          </label>
        </div>
        <div class="kasten-body" ?hidden="${!offen}">
          <small>
            Für ein Wand-Tablet o.ä.: die gewählten Kästen zeigen alles an, lassen sich aber nicht
            bedienen — kein Schalten, kein Modus-Wählen, keine Detail-Dialoge. Dieselbe Card kann
            woanders ohne Kiosk normal bedienbar stehen.
          </small>
          ${an
            ? html`<div class="kiosk-liste">
                ${alle.map((k) => {
                  const index =
                    k === KIOSK_BECKEN ? null : slots.findIndex((s, i) => kastenSchluessel(s, i + 1) === k);
                  const name = index === null ? "Becken" : this._slotKopf(slots[index], index);
                  return html`<label class="kiosk-kasten">
                    <input
                      type="checkbox"
                      data-kiosk-slot="${index === null ? k : index + 1}"
                      .checked="${kioskGilt(
                        this._config,
                        index === null ? k : index + 1,
                        index === null ? null : slots[index]
                      )}"
                      @change="${(e) => this._setKioskKasten(index, e.target.checked)}"
                    />
                    <span>${name}</span>
                  </label>`;
                })}
              </div>`
            : nothing}
        </div>
      </div>
    `;
  }

  /* ---- Kästen ändern ---- */

  _updateSlot(index, patch) {
    const slots = this._slots().map((s, i) => (i === index ? applyPatch(s, patch) : s));
    this._emit({ ...this._config, slots });
  }

  _updateEntry(slotIndex, entryIndex, patch) {
    const slot = this._slots()[slotIndex] || {};
    const entries = Array.isArray(slot.entries) ? [...slot.entries] : [];
    while (entries.length <= entryIndex) entries.push({});
    entries[entryIndex] = applyPatch(entries[entryIndex], patch);
    this._updateSlot(slotIndex, { entries });
  }

  /*
   * Neuer Kasten (Iteration 23): gleich im gewählten Typ statt als "Leerer
   * Rahmen", offen, alles andere zu. Ein Freifeld startet mit einem offenen
   * Eintrag.
   */
  _addSlot(typ = "frame") {
    const neu = typ === "custom" ? { type: "custom", entries: [{}] } : { type: typ };
    const index = this._slots().length;
    this._typWahl = false;
    this._offen = new Set([String(index)]);
    if (typ === "custom") this._eintragOffen = new Set([...this._eintragOffen, `${index}:0`]);
    this._emit({ ...this._config, slots: [...this._slots(), neu] });
  }

  /*
   * Löschen und Verschieben stellen alte Kiosk-Nummern vorher auf IDs um
   * (Iteration 22, Bug A3) — sonst zeigte kiosk_slots danach auf den
   * falschen Kasten.
   */
  _removeSlot(index) {
    const cfg = kioskMigrieren(this._config);
    const weg = cfg.slots?.[index]?.id;
    const slots = (cfg.slots || []).filter((_, i) => i !== index);
    let kiosk_slots = cfg.kiosk_slots;
    if (Array.isArray(kiosk_slots) && weg) kiosk_slots = kiosk_slots.filter((k) => String(k) !== String(weg));
    this._loeschFrage = null;
    this._offenUmrechnen((i) => (i === index ? null : i > index ? i - 1 : i));
    this._emit(applyPatch({ ...cfg, slots }, { kiosk_slots }));
  }

  _moveSlot(index, delta) {
    const cfg = kioskMigrieren(this._config);
    const slots = [...(cfg.slots || [])];
    const to = index + delta;
    if (to < 0 || to >= slots.length) return;
    const [item] = slots.splice(index, 1);
    slots.splice(to, 0, item);
    /* Aufklapp-Stand wandert mit (Befund B: ging vorher verloren) */
    this._offenUmrechnen((i) => (i === index ? to : i === to ? index : i));
    this._emit({ ...cfg, slots });
  }

  /* Duplizieren (Iteration 23): Kopie direkt dahinter, ohne ID, offen */
  _duplicateSlot(index) {
    const quelle = this._slots()[index];
    if (!quelle) return;
    const kopie = JSON.parse(JSON.stringify(quelle));
    delete kopie.id;
    const name = slotLabel(quelle);
    if (name) {
      kopie.label = `${name} (Kopie)`;
      delete kopie.label_text;
      delete kopie.title;
    }
    const slots = [...this._slots()];
    slots.splice(index + 1, 0, kopie);
    this._offenUmrechnen((i) => (i > index ? i + 1 : i));
    this._offen = new Set([String(index + 1)]);
    this._emit({ ...this._config, slots });
  }

  /*
   * Typ wechseln (Iteration 22, Bug A5): typfremde Schlüssel fliegen raus,
   * statt als Leichen mitzureisen (die UV-Lampe zeigte sonst Pumpenwatt).
   * Der alte Kasten wird gemerkt — zurück auf den alten Typ bringt ihn
   * unverändert wieder.
   */
  _setTyp(index, typ) {
    const alt = this._slots()[index] || {};
    const neu = typWechsel(alt, typ, this._typStash[`${index}:${typ}`]);
    this._typStash[`${index}:${String(alt.type || "frame")}`] = alt;
    const slots = this._slots().map((s, i) => (i === index ? neu : s));
    this._emit({ ...this._config, slots });
  }

  /* ---- Freifeld: Einträge (Iteration 23, Bug A14) ---- */

  _eintraegeSetzen(index, entries, offen) {
    if (offen) this._eintragOffen = new Set(offen);
    this._updateSlot(index, { entries: entries.length ? entries : undefined });
  }

  _eintragNeu(index) {
    const entries = [...(this._slots()[index]?.entries || [])];
    if (entries.length >= CUSTOM_MAX_ENTRIES) return;
    entries.push({});
    this._eintraegeSetzen(index, entries, [...this._eintragOffen, `${index}:${entries.length - 1}`]);
  }

  _eintragWeg(index, j) {
    const entries = [...(this._slots()[index]?.entries || [])];
    entries.splice(j, 1);
    const offen = [...this._eintragOffen]
      .map((k) => {
        const [s, e] = k.split(":").map(Number);
        if (s !== index) return k;
        return e === j ? null : e > j ? `${s}:${e - 1}` : k;
      })
      .filter(Boolean);
    this._eintraegeSetzen(index, entries, offen);
  }

  _eintragSchieben(index, j, delta) {
    const entries = [...(this._slots()[index]?.entries || [])];
    const to = j + delta;
    if (to < 0 || to >= entries.length) return;
    [entries[j], entries[to]] = [entries[to], entries[j]];
    const offen = [...this._eintragOffen].map((k) => {
      const [s, e] = k.split(":").map(Number);
      if (s !== index) return k;
      return e === j ? `${s}:${to}` : e === to ? `${s}:${j}` : k;
    });
    this._eintraegeSetzen(index, entries, offen);
  }

  _eintragUmschalten(key) {
    const neu = new Set(this._eintragOffen);
    if (neu.has(key)) neu.delete(key);
    else neu.add(key);
    this._eintragOffen = neu;
  }

  _renderEintraege(index) {
    const slot = this._slots()[index] || {};
    const liste = Array.isArray(slot.entries) ? slot.entries : [];
    const ART = { entity: "Wert", button: "Button", text: "Freitext" };
    return html`
      <div class="eintraege">
        ${liste.map((e, j) => {
          const key = `${index}:${j}`;
          const offen = this._eintragOffen.has(key);
          const art = e?.kind || (e?.entity ? "entity" : e?.text ? "text" : "entity");
          const name = String(e?.label || e?.text || e?.entity || "").trim();
          return html`<div class="eintrag ${offen ? "offen" : ""}" data-eintrag="${j}">
            <div class="kasten-kopf eintrag-kopf">
              <button
                type="button"
                class="kasten-auf"
                data-auf="eintrag"
                aria-expanded="${offen ? "true" : "false"}"
                @click="${() => this._eintragUmschalten(key)}"
              >
                <span class="pfeil ${offen ? "auf" : ""}">▶</span>
                <span class="eintrag-titel">Eintrag ${j + 1} · ${ART[art] || art}${name ? ` · ${name}` : ""}</span>
              </button>
              <div class="kasten-knoepfe">
                <button type="button" class="icon-btn" data-aktion="eintrag-hoch" title="nach oben" ?disabled="${j === 0}" @click="${() => this._eintragSchieben(index, j, -1)}">↑</button>
                <button type="button" class="icon-btn" data-aktion="eintrag-runter" title="nach unten" ?disabled="${j === liste.length - 1}" @click="${() => this._eintragSchieben(index, j, 1)}">↓</button>
                <button type="button" class="icon-btn danger" data-aktion="eintrag-weg" title="Eintrag löschen" @click="${() => this._eintragWeg(index, j)}">✕</button>
              </div>
            </div>
            <div class="eintrag-body" ?hidden="${!offen}">
              ${customEntryFields(
                new Fields({
                  hass: this.hass,
                  config: e || {},
                  update: (patch) => this._updateEntry(index, j, patch),
                  idPrefix: `slot${index}e${j}`,
                })
              )}
            </div>
          </div>`;
        })}
        ${liste.length < CUSTOM_MAX_ENTRIES
          ? html`<button type="button" class="add-btn klein" data-aktion="eintrag-neu" @click="${() => this._eintragNeu(index)}">
              + Eintrag
            </button>`
          : html`<small>Höchstens ${CUSTOM_MAX_ENTRIES} Einträge je Kasten.</small>`}
      </div>
    `;
  }

  /* ---- Kasten zusammensetzen ---- */

  _fieldsFor(index) {
    const slot = this._slots()[index] || {};
    return new Fields({
      hass: this.hass,
      config: slot,
      defaults: SLOT_DEFAULTS[slot.type] || {},
      update: (patch) => this._updateSlot(index, patch),
      idPrefix: `slot${index}`,
    });
  }

  /*
   * Trägt eine bestehende Config einen Typ, den es nicht mehr zu wählen gibt
   * (seit Iteration 6: `inlet`), bekommt er trotzdem seinen eigenen Eintrag —
   * sonst stünde im Auswahlfeld etwas anderes, als in der Config steht.
   */
  _altTypOption(type) {
    const meta = SLOT_TYPES[type];
    if (!meta || meta.waehlbar !== false) return nothing;
    return html`<option value="${type}" selected>${meta.label}</option>`;
  }

  _typFeld(index) {
    const slot = this._slots()[index] || {};
    return html`
      <div class="row">
        <span class="row-label">Typ ändern</span>
        <select data-key="type" @change="${(e) => this._setTyp(index, e.target.value)}">
          ${this._altTypOption(slot.type)}
          ${slotTypeOptions().map((o) =>
            o.trenner
              ? html`<option disabled data-trenner>${o.label}</option>`
              : html`<option value="${o.value}" ?selected="${(slot.type || "frame") === o.value}">${o.label}</option>`
          )}
        </select>
      </div>
      <small>Beim Wechsel fallen die Felder des alten Typs weg; zurückstellen holt sie wieder.</small>
    `;
  }

  /*
   * Überschrift eines Kastens: "Kasten 3 · Poolpumpe · Filterpumpe".
   * Fehlt die Beschriftung, bleibt der Teil weg.
   */
  _slotKopf(slot, index) {
    const typ = SLOT_TYPES[slot?.type]?.label || SLOT_TYPES.frame.label;
    const name = slotLabel(slot);
    return `Kasten ${index + 1} · ${typ}${name ? ` · ${name}` : ""}`;
  }

  _teile(index) {
    const slot = this._slots()[index] || {};
    const f = this._fieldsFor(index);
    switch (slot.type) {
      case "heatpump":
        return heatpumpFields(f);
      case "pump":
        return pumpFields(f);
      case "uv":
        return uvFields(f);
      case "solar":
        return solarFields(f);
      case "custom":
        return customFields(f, this._renderEintraege(index));
      case "hidden":
        return null;
      default:
        return frameFields(f);
    }
  }

  _slotBody(index) {
    const slot = this._slots()[index] || {};
    const t = this._teile(index);
    if (!t) {
      return html`
        <small>Dieser Kasten wird nicht angezeigt; die anderen rücken nach. Zum Zeigen wieder einen Typ wählen.</small>
        ${this._typFeld(index)}
      `;
    }
    const f = this._fieldsFor(index);
    const typ = String(slot.type || "frame");
    return html`
      ${labelFeld(f, "Überschrift", LABEL_PLATZHALTER[typ] || "")}
      ${abschnitt("pflicht", t.pflicht)} ${abschnitt("anaus", t.anaus)} ${abschnitt("anzeige", t.anzeige)}
      ${abschnitt("optik", t.optik)}
      ${this._renderMiniWahl(slot, slot.type, (patch) => this._updateSlot(index, patch))}
      ${erweitert(...(t.erweitert || []), gruppe("Typ", this._typFeld(index)))}
    `;
  }

  _renderKasten(slot, i, anzahl) {
    const offen = this._istOffen(i);
    return html`
      <div class="slot-block kasten ${offen ? "offen" : ""}" data-kasten="${i}" style="--slot-farbe:${slotFarbe(slot.type)};">
        <div class="kasten-kopf">
          <button
            type="button"
            class="kasten-auf"
            data-auf="${i}"
            aria-expanded="${offen ? "true" : "false"}"
            @click="${() => this._umschalten(i)}"
          >
            <span class="pfeil ${offen ? "auf" : ""}">▶</span>
            <span class="slot-ueberschrift">${this._slotKopf(slot, i)}</span>
          </button>
          <div class="kasten-knoepfe">
            <button type="button" class="icon-btn" data-aktion="hoch" title="nach oben" ?disabled="${i === 0}" @click="${() => this._moveSlot(i, -1)}">↑</button>
            <button type="button" class="icon-btn" data-aktion="runter" title="nach unten" ?disabled="${i === anzahl - 1}" @click="${() => this._moveSlot(i, 1)}">↓</button>
            <button type="button" class="icon-btn" data-aktion="duplizieren" title="Duplizieren" @click="${() => this._duplicateSlot(i)}">⧉</button>
            <button type="button" class="icon-btn danger" data-aktion="loeschen" title="Löschen" @click="${() => (this._loeschFrage = i)}">✕</button>
          </div>
        </div>
        ${this._loeschFrage === i
          ? html`<div class="loesch-frage" role="alertdialog">
              <span>„${this._slotKopf(slot, i)}“ löschen?</span>
              <button type="button" class="knopf-gefahr" data-aktion="loeschen-ja" @click="${() => this._removeSlot(i)}">Löschen</button>
              <button type="button" class="knopf-leise" data-aktion="loeschen-nein" @click="${() => (this._loeschFrage = null)}">Abbrechen</button>
            </div>`
          : nothing}
        <div class="slot-card kasten-body" ?hidden="${!offen}">${this._slotBody(i)}</div>
      </div>
    `;
  }

  _renderBecken(heroF) {
    const hero = this._config.hero || {};
    const offen = this._istOffen("becken");
    const an = hero.enabled !== false;
    const t = heroFields(heroF);
    const name = slotLabel(hero);
    return html`
      <div class="slot-block kasten becken-block ${offen ? "offen" : ""}" data-kasten="becken" style="--slot-farbe:${slotFarbe("hero")};">
        <div class="kasten-kopf">
          <button
            type="button"
            class="kasten-auf"
            data-auf="becken"
            aria-expanded="${offen ? "true" : "false"}"
            @click="${() => this._umschalten("becken")}"
          >
            <span class="pfeil ${offen ? "auf" : ""}">▶</span>
            <span class="slot-ueberschrift"
              >Becken · ${an ? shapeOf(hero.shape).label : "aus"}${an && name ? ` · ${name}` : ""}</span
            >
          </button>
        </div>
        <div class="slot-card becken-card kasten-body" ?hidden="${!offen}">
          ${heroF.toggle("Becken anzeigen", "enabled", true)}
          ${an
            ? html`
                ${labelFeld(heroF, "Freitext auf dem Becken", "z.B. Pool")}
                ${abschnitt("pflicht", t.pflicht)} ${abschnitt("anzeige", t.anzeige)} ${abschnitt("optik", t.optik)}
                ${this._renderMiniWahl(hero, "hero", (patch) => this._updateHero(patch))}
                ${erweitert(...t.erweitert)}
              `
            : nothing}
        </div>
      </div>
    `;
  }

  /* Neu-Anlage: erst den Typ wählen, als Kacheln mit Gerätebild */
  _renderNeu() {
    if (!this._typWahl) {
      return html`<button type="button" class="add-btn" data-aktion="neu" @click="${() => (this._typWahl = true)}">
        + Kasten hinzufügen
      </button>`;
    }
    return html`
      <div class="typ-wahl" data-block="typ-wahl">
        <div class="block-titel">Welcher Kasten?</div>
        <div class="typ-kacheln">
          ${NEU_TYPEN.map(
            (t) => html`<button
              type="button"
              class="typ-kachel"
              data-typ="${t.typ}"
              style="--slot-farbe:${slotFarbe(t.typ)};"
              @click="${() => this._addSlot(t.typ)}"
            >
              ${t.bild
                ? html`<img src="${deviceImage(t.bild)}" alt="" />`
                : html`<ha-icon icon="${t.icon}"></ha-icon>`}
              <span>${SLOT_TYPES[t.typ].label.replace(" (benutzerdefiniert)", "")}</span>
            </button>`
          )}
        </div>
        <button type="button" class="knopf-leise" data-aktion="neu-abbrechen" @click="${() => (this._typWahl = false)}">
          Abbrechen
        </button>
      </div>
    `;
  }

  render() {
    if (!this._config) return nothing;
    const hero = this._config.hero || {};
    const frame = this._config.frame || {};
    const heroF = new Fields({
      hass: this.hass,
      config: hero,
      /* Die Anker der gewählten Beckenform sind die Defaults — sonst stehen
         die Regler links, obwohl das Overlay richtig sitzt. */
      defaults: {
        ...heroDefaultsFor(hero.shape),
        /* Mini-Regler starten auf der Lage der vollen Ansicht (Iteration 20) */
        ...Object.fromEntries(
          Object.values(HERO_SPRITES).flatMap((sp) => {
            const l = teilLage(hero, sp, "voll");
            return [
              [`mini_${sp.anker}_top`, l.top],
              [`mini_${sp.anker}_left`, l.left],
              [`mini_${sp.anker}_size`, l.breite],
            ];
          })
        ),
      },
      update: (patch) => this._updateHero(patch),
      idPrefix: "hero",
    });
    heroF.teilePos = this._teilePos || ansichtVon(this._config);
    heroF.setTeilePos = (w) => {
      this._teilePos = w;
    };
    const frameF = new Fields({
      hass: this.hass,
      config: frame,
      update: (patch) => this._updateFrame(patch),
      idPrefix: "frame",
    });
    const slots = this._slots();
    const hinweise = configHinweise(this._config);

    return html`
      <div class="editor">
        ${hinweise.length
          ? html`<div class="limit-warnung hinweise" role="status">
              ${hinweise.map((h) => html`<div>⚠ ${h}</div>`)}
            </div>`
          : nothing}
        ${this._renderDarstellung(frameF)} ${this._renderBecken(heroF)}
        ${slots.map((slot, i) => this._renderKasten(slot || {}, i, slots.length))} ${this._renderNeu()}
        ${this._renderKiosk()}
      </div>
    `;
  }

  static styles = [editorStyles];
}

customElements.define("tomtut-pool-dashboard-editor", TomtutPoolDashboardEditor);
