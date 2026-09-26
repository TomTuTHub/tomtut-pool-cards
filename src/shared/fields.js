import { html, css, nothing } from "lit";
import { hasHaElement } from "./ha-elements.js";

/*
 * Baukasten für die visuellen Editoren.
 *
 * Eine Fields-Instanz hängt an genau einem Config-Objekt (Card, Hero oder
 * einem Slot) und meldet jede Änderung über `update(patch)` zurück. Dadurch
 * benutzen alle Kästen des Dashboard-Editors exakt dieselben Eingabefelder.
 *
 * Ein Patch-Wert `undefined` heißt: Schlüssel aus der Config entfernen. So
 * bleibt die YAML sauber, wenn ein Element abgewählt wird.
 */
export const ENTITY_PLACEHOLDER = "Entity auswählen …";

/* Reglerwert fürs Auge (Iteration 22, Bug A18): Komma, höchstens eine Stelle */
export const zahlText = (v) => {
  const n = Number(v);
  if (!isFinite(n)) return String(v ?? "");
  const r = Math.round(n * 10) / 10;
  return String(r).replace(".", ",");
};

export class Fields {
  constructor({ hass, config, defaults = {}, update, idPrefix = "f" }) {
    this.hass = hass;
    this.config = config || {};
    this.defaults = defaults;
    this.update = update;
    this.idPrefix = idPrefix;
  }

  /* Effektiver Wert: eigener Eintrag, sonst Default des Slot-Typs */
  val(key) {
    const v = this.config?.[key];
    return v === undefined || v === null || v === "" ? this.defaults[key] : v;
  }

  raw(key) {
    const v = this.config?.[key];
    return v === undefined || v === null ? "" : v;
  }

  /* An/aus eines Elements — Default kommt aus den Slot-Defaults, sonst true */
  shown(key, def = true) {
    const v = this.config?.[key];
    return v === undefined || v === null ? def : v !== false;
  }

  /*
   * "X anzeigen" (Iteration 23, steht unter Erweitert). Seit es den Block
   * "Elemente anzeigen" nicht mehr gibt, erscheint ein Element, sobald seine
   * Entity gesetzt ist; dieser Haken blendet es trotzdem aus. Abhaken
   * schreibt nur `show_*: false` — die Entity bleibt stehen, Wiederanhaken
   * bringt alles zurück. Ein bestehendes `show_*: false` wirkt weiter.
   */
  zeigen(label, key, def = true) {
    const an = this.shown(key, def);
    return html`
      <label class="haken">
        <input
          type="checkbox"
          data-key="${key}"
          .checked="${an}"
          @change="${(e) => this.update({ [key]: e.target.checked === def ? undefined : e.target.checked })}"
        />
        <span>${label}</span>
      </label>
    `;
  }

  text(label, key, hint = "", placeholder = "") {
    return html`
      <label
        >${label}
        <input
          type="text"
          data-key="${key}"
          .value="${String(this.raw(key))}"
          placeholder="${placeholder}"
          @input="${(e) => this.update({ [key]: e.target.value || undefined })}"
        />
        ${hint ? html`<small>${hint}</small>` : nothing}
      </label>
    `;
  }

  _entityOptions(domains) {
    const states = this.hass?.states ?? {};
    return Object.keys(states)
      .filter((id) => !domains.length || domains.some((d) => id.startsWith(d + ".")))
      .sort();
  }

  /*
   * Entity-Feld. Im laufenden Home Assistant ist das der echte
   * ha-entity-picker (Suche, Namen, Icons) mit Domain-Filter je Feld;
   * ohne Frontend bleibt ein Textfeld mit Vorschlagsliste. In beiden Fällen
   * ist das Feld leer, wenn nichts gewählt wurde — kein Beispielwert.
   */
  entity(label, key, hint = "", ...domains) {
    return this._entityInput({
      label,
      hint,
      domains,
      value: String(this.raw(key)),
      dataKey: key,
      listId: `${this.idPrefix}-${key}`,
      onChange: (v) => this.update({ [key]: v || undefined }),
    });
  }

  /* Entity an Position `index` einer Liste (z.B. stage_entities) */
  entityAt(label, key, index, hint = "", ...domains) {
    const roh = this.config?.[key];
    const list = Array.isArray(roh) ? roh : typeof roh === "string" && roh ? [roh] : [];
    return this._entityInput({
      label,
      hint,
      domains,
      value: String(list[index] ?? ""),
      dataKey: `${key}.${index}`,
      listId: `${this.idPrefix}-${key}-${index}`,
      onChange: (v) => this._updateList(key, index, v),
    });
  }

  _entityInput({ label, hint, domains, value, dataKey, listId, onChange }) {
    if (hasHaElement("ha-entity-picker")) {
      return html`
        <ha-entity-picker
          .hass="${this.hass}"
          .value="${value}"
          .label="${label}"
          .helper="${hint}"
          .includeDomains="${domains.length ? domains : undefined}"
          data-key="${dataKey}"
          allow-custom-entity
          @value-changed="${(e) => {
            e.stopPropagation();
            onChange(e.detail?.value ?? "");
          }}"
        ></ha-entity-picker>
      `;
    }
    return html`
      <label
        >${label}
        <input
          type="text"
          list="${listId}"
          data-key="${dataKey}"
          .value="${value}"
          placeholder="${ENTITY_PLACEHOLDER}"
          @input="${(e) => onChange(e.target.value)}"
          @change="${(e) => onChange(e.target.value)}"
        />
        <datalist id="${listId}">
          ${this._entityOptions(domains).map((id) => html`<option value="${id}"></option>`)}
        </datalist>
        ${hint ? html`<small>${hint}</small>` : nothing}
      </label>
    `;
  }

  _updateList(key, index, value) {
    const roh = this.config?.[key];
    const list = Array.isArray(roh) ? [...roh] : typeof roh === "string" && roh ? [roh] : [];
    while (list.length <= index) list.push("");
    list[index] = value;
    while (list.length && !list[list.length - 1]) list.pop();
    this.update({ [key]: list.length ? list : undefined });
  }

  /*
   * Vorschlag unter einem Entity-Feld (Iteration 23): ein Tipp übernimmt,
   * was der Editor aus einem Nachbarfeld ableitet — z.B. N2/N3/STOP aus N1
   * oder den Leistungssensor aus dem Schalter. patch = { key: entity, … }.
   */
  vorschlag(text, patch) {
    if (!patch || !Object.keys(patch).length) return nothing;
    return html`<button
      type="button"
      class="vorschlag"
      data-vorschlag="${Object.keys(patch).join(",")}"
      @click="${() => this.update(patch)}"
    >
      ↳ ${text}
    </button>`;
  }

  /* Icon-Feld: echter ha-icon-picker mit Vorschau, sonst Textfeld */
  icon(label, key, hint = "") {
    if (hasHaElement("ha-icon-picker")) {
      return html`
        <ha-icon-picker
          .hass="${this.hass}"
          .value="${String(this.raw(key))}"
          .label="${label}"
          .helper="${hint}"
          data-key="${key}"
          @value-changed="${(e) => {
            e.stopPropagation();
            this.update({ [key]: e.detail?.value || undefined });
          }}"
        ></ha-icon-picker>
      `;
    }
    return this.text(label, key, hint, "mdi:lightbulb");
  }

  select(label, key, options, def) {
    const cur = this.config?.[key] ?? def;
    return html`
      <div class="row">
        <span class="row-label">${label}</span>
        <select data-key="${key}" @change="${(e) => this.update({ [key]: e.target.value })}">
          ${options.map(
            ([value, text]) =>
              html`<option value="${value}" ?selected="${String(cur) === String(value)}">${text}</option>`
          )}
        </select>
      </div>
    `;
  }

  /*
   * Schieberegler. Er startet immer auf dem effektiven Wert (Config, sonst
   * Default des Slot-Typs) — sonst stehen alle Regler links, obwohl das
   * Overlay längst richtig sitzt.
   *
   * Ziehen feuert höchstens alle 80 ms ein config-changed (Iteration 23,
   * Befund B: vorher bei jedem Tick); der letzte Wert kommt immer an.
   * `anzeige` rechnet den gespeicherten Wert für Regler und Anzeige um
   * (WP-Tempo: 0–100 gespeichert, 0–10 gezeigt), `zurueck` wieder hin.
   */
  slider(label, key, min, max, unit = "%", step = 1, { anzeige = (x) => x, zurueck = (x) => x } = {}) {
    const raw = this.val(key);
    const gespeichert = raw === undefined || raw === null || raw === "" ? zurueck(min) : raw;
    const v = anzeige(Number(gespeichert));
    return html`
      <div class="row">
        <span class="row-label">${label}</span>
        <input
          type="range"
          min="${min}"
          max="${max}"
          step="${step}"
          data-key="${key}"
          .value="${String(v)}"
          @input="${(e) => this._gedrosselt(key, zurueck(parseFloat(e.target.value)))}"
          @change="${(e) => this._gedrosselt(key, zurueck(parseFloat(e.target.value)), true)}"
        />
        <span class="row-val">${zahlText(v)}${unit}</span>
      </div>
    `;
  }

  _gedrosselt(key, wert, sofort = false) {
    const box = (Fields._drossel ||= {});
    const id = `${this.idPrefix}:${key}`;
    const d = (box[id] ||= { zuletzt: 0, timer: null, wert: null });
    d.wert = wert;
    const jetzt = Date.now();
    const senden = () => {
      d.zuletzt = Date.now();
      d.timer = null;
      this.update({ [key]: d.wert });
    };
    clearTimeout(d.timer);
    if (sofort || jetzt - d.zuletzt >= 80) senden();
    else d.timer = setTimeout(senden, 80 - (jetzt - d.zuletzt));
  }

  toggle(label, key, def) {
    const v = this.config?.[key] ?? def;
    return html`
      <div class="row">
        <span class="row-label">${label}</span>
        <input
          type="checkbox"
          data-key="${key}"
          ?checked="${v}"
          .checked="${!!v}"
          @change="${(e) => this.update({ [key]: e.target.checked })}"
        />
      </div>
    `;
  }
}

export const section = (title, content, open = false) => html`
  <details class="section" ?open="${open}">
    <summary>${title}</summary>
    <div class="section-body">${content}</div>
  </details>
`;

/*
 * Aufbau jedes Kastens (Iteration 23, Testbericht Abschnitt C):
 *   pflicht → anaus → anzeige → optik → EIN zugeklapptes "Erweitert".
 * `abschnitt` gibt jedem Teil eine kleine Überschrift und ein data-Attribut
 * (Tests prüfen die Reihenfolge daran). Leerer Inhalt = kein Abschnitt.
 */
export const ABSCHNITTE = {
  pflicht: "Grunddaten",
  anaus: "Ein / Aus",
  anzeige: "Anzeige",
  optik: "Aussehen",
};
export const abschnitt = (art, inhalt) =>
  inhalt === nothing || inhalt === null || inhalt === undefined
    ? nothing
    : html`<div class="abschnitt" data-abschnitt="${art}">
        <div class="abschnitt-titel">${ABSCHNITTE[art] || art}</div>
        ${inhalt}
      </div>`;

/* Das EINE zugeklappte "Erweitert" je Kasten, innen in Gruppen */
export const erweitert = (...gruppen) => html`
  <details class="section advanced" data-abschnitt="erweitert">
    <summary>Erweitert</summary>
    <div class="section-body">${gruppen}</div>
  </details>
`;
export const gruppe = (titel, inhalt) =>
  inhalt === nothing
    ? nothing
    : html`<div class="gruppe"><div class="gruppe-titel">${titel}</div>${inhalt}</div>`;

export const editorStyles = css`
  .editor {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }
  label {
    display: flex;
    flex-direction: column;
    font-weight: 500;
    gap: 4px;
    font-size: 14px;
  }
  input[type="text"],
  select {
    padding: 8px;
    border: 1px solid var(--divider-color, #ccc);
    border-radius: 4px;
    font-size: 14px;
    font-family: inherit;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #111);
  }
  ha-entity-picker,
  ha-icon-picker {
    display: block;
    width: 100%;
  }
  /* Limit überschritten (Iteration 16, Freifeld mit mehr als 8 Einträgen) */
  .limit-warnung {
    padding: 8px 10px;
    border-radius: 8px;
    border: 2px solid var(--warning-color, #ff9800);
    background: rgba(255, 152, 0, 0.1);
    color: var(--primary-text-color, #111);
    font-size: 13px;
    font-weight: 600;
    line-height: 1.4;
  }
  /* Kiosk-Modus (Iteration 15) — ganz oben im Editor */
  /* Kopfzeile des Editors (Iteration 17): Ansicht + Kiosk nebeneinander,
     auf schmalen Editoren untereinander */
  .kopf-reihe {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: stretch;
  }
  .kopf-reihe > * {
    flex: 1 1 220px;
    min-width: 0;
  }
  .ansicht-block {
    text-align: left;
    border: 2px solid var(--divider-color, #ccc);
    border-radius: 12px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .ansicht-block.mini {
    border-color: var(--primary-color, #03a9f4);
  }
  .ansicht-titel {
    font-size: 17px;
    font-weight: 800;
  }
  .ansicht-wahl {
    display: inline-flex;
    align-self: flex-start;
    border: 1px solid var(--divider-color, #ccc);
    border-radius: 10px;
    overflow: hidden;
  }
  .ansicht-knopf {
    padding: 8px 18px;
    border: none;
    background: transparent;
    color: var(--primary-text-color, #111);
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }
  .ansicht-knopf + .ansicht-knopf {
    border-left: 1px solid var(--divider-color, #ccc);
  }
  .ansicht-knopf.aktiv {
    background: var(--primary-color, #03a9f4);
    color: var(--text-primary-color, #fff);
  }
  /* Positionen der Becken-Teile für Voll / Mini (Iteration 20) */
  .teile-pos {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 12px;
    padding: 6px 0;
  }
  .teil-reset {
    display: block;
    margin: 4px 0 6px;
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid var(--divider-color, #ccc);
    background: transparent;
    color: var(--primary-text-color, #111);
    font: inherit;
    cursor: pointer;
  }
  /* "In Mini anzeigen" je Kasten (Iteration 17) */
  .mini-wahl {
    text-align: left;
    border: 1.5px dashed var(--primary-color, #03a9f4);
    border-radius: 10px;
    padding: 8px 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .mini-wahl-titel {
    font-weight: 800;
  }
  .mini-wahl-werte {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 4px 16px;
  }
  .mini-wahl-zeile {
    display: inline-flex;
    flex-direction: row;
    justify-content: flex-start;
    text-align: left;
    align-items: center;
    gap: 6px;
    font-weight: 400;
    cursor: pointer;
  }
  .mini-wahl-warnung {
    color: var(--warning-color, #ff9800);
    font-weight: 600;
    font-size: 0.9em;
  }
  .kiosk-block {
    text-align: left;
    border: 2px solid var(--divider-color, #ccc);
    border-radius: 12px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .kiosk-block.an {
    border-color: var(--warning-color, #ff9800);
  }
  .kiosk-schalter {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    text-align: left;
    align-items: center;
    gap: 12px;
    font-size: 17px;
    font-weight: 800;
    cursor: pointer;
  }
  .kiosk-schalter input {
    width: 26px;
    height: 26px;
    margin: 0;
  }
  .kiosk-liste {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-left: 4px;
  }
  .kiosk-kasten {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    text-align: left;
    font-weight: 400;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }
  /* Modus-Zuordnung je Gerätewert (Iteration 19) */
  .modus-zeilen {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .modus-zeile {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1.3fr);
    align-items: center;
    gap: 4px 8px;
    padding: 4px 8px;
    border-radius: 8px;
    border-left: 4px solid var(--success-color, #2e7d32);
    background: rgba(127, 127, 127, 0.08);
  }
  .modus-zeile.nein {
    border-left-color: var(--error-color, #c62828);
    background: rgba(198, 40, 40, 0.1);
  }
  .modus-zeile.nein .modus-wert {
    color: var(--error-color, #c62828);
  }
  .modus-wert {
    font-weight: 700;
    overflow-wrap: anywhere;
  }
  .modus-zeile select {
    min-width: 0;
    width: 100%;
  }
  .modus-name {
    grid-column: 1 / -1;
  }
  /* Modus-Erkennung live (Iteration 14) */
  .modus-befund {
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.4));
    font-size: 0.95em;
  }
  .modus-befund.ok {
    border-color: var(--success-color, #43a047);
  }
  .modus-befund.nein {
    border-color: var(--error-color, #db4437);
  }
  .modus-optionen ul {
    margin: 4px 0 0;
    padding-left: 18px;
  }
  .modus-optionen li.nein {
    color: var(--error-color, #db4437);
  }
  small {
    color: var(--secondary-text-color, #888);
    font-weight: 400;
  }
  .section {
    border: 1px solid var(--divider-color, #ccc);
    border-radius: 8px;
    overflow: hidden;
  }
  .section summary {
    padding: 10px 14px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    color: var(--primary-text-color);
    background: var(--card-background-color, rgba(0, 0, 0, 0.05));
    list-style: none;
    display: flex;
    align-items: center;
    gap: 8px;
    user-select: none;
  }
  .section summary::-webkit-details-marker {
    display: none;
  }
  .section summary::before {
    content: "▶";
    font-size: 10px;
    transition: transform 0.2s;
  }
  .section[open] summary::before {
    transform: rotate(90deg);
  }
  .section-body {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px 14px;
  }
  .section.elements {
    border-color: var(--primary-color, #03a9f4);
  }
  .section.elements > summary {
    color: var(--primary-color, #03a9f4);
    background: rgba(3, 169, 244, 0.08);
  }
  .section.advanced {
    border-color: var(--warning-color, #ff9800);
  }
  .section.advanced > summary {
    font-size: 13px;
    color: var(--warning-color, #ff9800);
    background: rgba(255, 152, 0, 0.08);
  }
  .step-head {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: var(--secondary-text-color, #888);
    margin-top: 4px;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .row-label {
    flex: 1;
    font-size: 13px;
    color: var(--primary-text-color);
  }
  .row input[type="range"] {
    flex: 2;
  }
  .row select {
    flex: 2;
    padding: 6px;
    font-size: 13px;
  }
  .row select option[disabled] {
    font-style: italic;
    color: var(--secondary-text-color, #888);
  }
  .row-val {
    width: 54px;
    text-align: right;
    font-size: 13px;
    font-weight: 600;
    color: var(--primary-color);
  }
  .row input[type="checkbox"] {
    width: 18px;
    height: 18px;
  }
  /*
   * Ein Slot-Block im Editor: Trennlinie, große Überschrift, darunter die
   * Karte mit den Feldern. Die Kennfarbe des Slot-Typs (shared/assets.js)
   * kommt als --slot-farbe von außen und wird hier zweimal benutzt:
   * als schmaler Balken links und als sehr dezente Tönung des Blocks.
   * Weil die Tönung aus derselben Farbe gemischt wird, trägt sie in hellen
   * wie in dunklen Themes; die erste Regel ist der Rückfall für Browser
   * ohne color-mix.
   */
  .slot-block {
    display: flex;
    flex-direction: column;
    margin-top: 18px;
    padding-top: 10px;
    border-top: 2px solid var(--slot-farbe, var(--divider-color, #ccc));
  }
  .slot-ueberschrift {
    font-size: 17px;
    font-weight: 800;
    line-height: 1.25;
    margin: 0 0 10px;
    color: var(--primary-text-color);
  }
  .slot-card {
    border: 1px solid var(--divider-color, #ccc);
    border-left: 5px solid var(--slot-farbe, var(--divider-color, #ccc));
    border-radius: 10px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: rgba(127, 127, 127, 0.05);
    background: color-mix(in srgb, var(--slot-farbe, transparent) 9%, transparent);
  }
  .slot-head {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .slot-head .row {
    flex: 1;
  }
  .icon-btn {
    border: 1px solid var(--divider-color, #ccc);
    background: transparent;
    color: var(--primary-text-color);
    border-radius: 6px;
    min-width: 32px;
    height: 32px;
    cursor: pointer;
    font-size: 15px;
    line-height: 1;
    font-family: inherit;
  }
  .icon-btn:hover {
    background: rgba(127, 127, 127, 0.15);
  }
  .icon-btn.danger {
    color: var(--error-color, #d32f2f);
    border-color: var(--error-color, #d32f2f);
  }
  .add-btn {
    align-self: flex-start;
    padding: 8px 14px;
    border-radius: 8px;
    border: 1px solid var(--primary-color, #03a9f4);
    color: var(--primary-color, #03a9f4);
    background: transparent;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
  }
  .add-btn:hover {
    background: rgba(3, 169, 244, 0.1);
  }
  .add-btn.klein {
    padding: 6px 12px;
    font-size: 13px;
  }

  /* ---------------- Iteration 23: Akkordeon-Editor ---------------- */

  .editor {
    gap: 8px;
  }
  .block-titel {
    font-size: 15px;
    font-weight: 800;
  }
  /* Darstellung: der globale Block ganz oben */
  .darstellung {
    text-align: left;
    border: 2px solid var(--divider-color, #ccc);
    border-radius: 12px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .darstellung.mini {
    border-color: var(--primary-color, #03a9f4);
  }
  .darstellung .ansicht-block {
    border: none;
    padding: 0;
    gap: 6px;
  }
  /* Ein Kasten = eine Zeile, bis man ihn aufklappt */
  .slot-block.kasten,
  .kiosk-block.slot-block {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
    border: 1px solid var(--divider-color, #ccc);
    border-left: 5px solid var(--slot-farbe, var(--divider-color, #ccc));
    border-radius: 10px;
    background: rgba(127, 127, 127, 0.04);
    background: color-mix(in srgb, var(--slot-farbe, transparent) 7%, transparent);
    gap: 0;
  }
  .kasten-kopf {
    display: flex;
    align-items: center;
    gap: 4px;
    min-height: 44px;
    padding: 0 6px 0 0;
  }
  .kasten-auf {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border: none;
    background: transparent;
    color: var(--primary-text-color, #111);
    font: inherit;
    text-align: left;
    cursor: pointer;
  }
  .kasten-auf .slot-ueberschrift,
  .kasten-auf .eintrag-titel {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    line-height: 1.25;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .kasten-auf .eintrag-titel {
    font-size: 13px;
    font-weight: 600;
  }
  .pfeil {
    flex: none;
    font-size: 10px;
    color: var(--slot-farbe, var(--secondary-text-color, #888));
    transition: transform 0.15s;
  }
  .pfeil.auf {
    transform: rotate(90deg);
  }
  .kasten-knoepfe {
    display: flex;
    gap: 3px;
    flex: none;
  }
  .kasten-knoepfe .icon-btn {
    min-width: 30px;
    height: 30px;
    font-size: 14px;
    padding: 0;
  }
  .icon-btn[disabled] {
    opacity: 0.3;
    cursor: default;
  }
  .kasten-body {
    padding: 4px 12px 12px;
  }
  .slot-block.kasten .slot-card {
    border: none;
    border-radius: 0;
    background: none;
    padding: 4px 12px 12px;
  }
  .loesch-frage {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin: 0 10px 10px;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1.5px solid var(--error-color, #d32f2f);
    font-size: 13px;
    font-weight: 600;
  }
  .loesch-frage span {
    flex: 1 1 100%;
  }
  .knopf-gefahr,
  .knopf-leise {
    padding: 6px 14px;
    border-radius: 8px;
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }
  .knopf-gefahr {
    border: 1px solid var(--error-color, #d32f2f);
    background: var(--error-color, #d32f2f);
    color: #fff;
  }
  .knopf-leise {
    border: 1px solid var(--divider-color, #ccc);
    background: transparent;
    color: var(--primary-text-color, #111);
  }
  /* Abschnitte im Kasten: Grunddaten -> Ein/Aus -> Anzeige -> Aussehen */
  .abschnitt {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .abschnitt-titel,
  .gruppe-titel {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: var(--secondary-text-color, #888);
    margin-top: 4px;
  }
  .gruppe {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 6px;
    border-bottom: 1px dashed var(--divider-color, #ccc);
  }
  .gruppe:last-child {
    border-bottom: none;
  }
  .unter-gruppe {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .unter-titel {
    font-size: 13px;
    font-weight: 600;
  }
  .haken-reihe {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 16px;
  }
  label.haken {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    font-weight: 400;
    cursor: pointer;
  }
  .vorschlag {
    align-self: flex-start;
    margin-top: -4px;
    padding: 4px 10px;
    border-radius: 14px;
    border: 1px dashed var(--primary-color, #03a9f4);
    background: transparent;
    color: var(--primary-color, #03a9f4);
    font: inherit;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    text-align: left;
    overflow-wrap: anywhere;
  }
  .getrennt {
    margin-top: -4px;
  }
  .stufen-namen input {
    width: 3.6em;
    flex: none;
  }
  /* Neu-Anlage: Typ-Kacheln mit Gerätebild */
  .typ-wahl {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px 12px;
    border: 2px dashed var(--primary-color, #03a9f4);
    border-radius: 12px;
  }
  .typ-kacheln {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
    gap: 8px;
  }
  .typ-kachel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    min-height: 92px;
    padding: 8px 6px;
    border-radius: 10px;
    border: 1px solid var(--divider-color, #ccc);
    border-bottom: 4px solid var(--slot-farbe, var(--divider-color, #ccc));
    background: transparent;
    color: var(--primary-text-color, #111);
    font: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }
  .typ-kachel:hover {
    background: rgba(127, 127, 127, 0.1);
  }
  .typ-kachel img {
    height: 48px;
    max-width: 100%;
    object-fit: contain;
  }
  .typ-kachel ha-icon {
    --mdc-icon-size: 40px;
    color: var(--slot-farbe);
  }
  /* Freifeld-Einträge */
  .eintraege {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .eintrag {
    border: 1px solid var(--divider-color, #ccc);
    border-radius: 8px;
  }
  .eintrag-kopf {
    min-height: 36px;
  }
  .eintrag-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 4px 10px 10px;
  }
  .kiosk-block.slot-block {
    padding: 0;
  }
  .kiosk-block.slot-block.an {
    border-color: var(--warning-color, #ff9800);
  }
  .kiosk-kopf,
  .kiosk-block .kasten-kopf {
    gap: 8px;
  }
  .kiosk-block .kiosk-schalter {
    font-size: 14px;
    gap: 6px;
  }
  .kiosk-block .kiosk-schalter input {
    width: 22px;
    height: 22px;
  }
  .kiosk-block .kasten-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .kiosk-block .kasten-body[hidden],
  .kasten-body[hidden],
  .eintrag-body[hidden] {
    display: none;
  }
  .hinweise {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-weight: 500;
  }
`;
