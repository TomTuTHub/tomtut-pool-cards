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

export class Fields {
  constructor({ hass, config, defaults = {}, update, idPrefix = "f", stash = null }) {
    this.hass = hass;
    this.config = config || {};
    this.defaults = defaults;
    this.update = update;
    this.idPrefix = idPrefix;
    this.stash = stash;
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
   * Element-Schalter der Gruppe "Elemente anzeigen".
   *
   * Abwählen versteckt nicht nur die Felder, es räumt auch die zugehörigen
   * Schlüssel aus der Config (owned). Damit die Auswahl beim Wiedereinschalten
   * nicht verloren ist, merkt sich der Editor sie so lange im Stash.
   */
  element(label, key, owned = [], def = true) {
    const on = this.shown(key, def);
    return html`
      <div class="row">
        <span class="row-label">${label}</span>
        <input
          type="checkbox"
          data-key="${key}"
          ?checked="${on}"
          @change="${(e) => this._toggleElement(key, owned, def, e.target.checked)}"
        />
      </div>
    `;
  }

  _toggleElement(key, owned, def, checked) {
    const patch = {};
    const box = this.stash;
    if (checked) {
      patch[key] = def === true ? undefined : true;
      const saved = box?.[`${this.idPrefix}:${key}`];
      if (saved) {
        Object.assign(patch, saved);
        delete box[`${this.idPrefix}:${key}`];
      }
    } else {
      patch[key] = false;
      const saved = {};
      for (const k of owned) {
        if (this.config?.[k] !== undefined) saved[k] = this.config[k];
        patch[k] = undefined;
      }
      if (box && Object.keys(saved).length) box[`${this.idPrefix}:${key}`] = saved;
    }
    this.update(patch);
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
          @input="${(e) => this.update({ [key]: e.target.value })}"
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
    const list = Array.isArray(this.config?.[key]) ? this.config[key] : [];
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
    const list = Array.isArray(this.config?.[key]) ? [...this.config[key]] : [];
    while (list.length <= index) list.push("");
    list[index] = value;
    while (list.length && !list[list.length - 1]) list.pop();
    this.update({ [key]: list.length ? list : undefined });
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
              html`<option value="${value}" ?selected="${cur === value}">${text}</option>`
          )}
        </select>
      </div>
    `;
  }

  /*
   * Schieberegler. Wichtig: er startet immer auf dem effektiven Wert
   * (Config, sonst Default des Slot-Typs) — sonst stehen alle Regler links,
   * obwohl das Overlay längst richtig sitzt.
   */
  slider(label, key, min, max, unit = "%", step = 1) {
    const raw = this.val(key);
    const v = raw === undefined || raw === null || raw === "" ? min : raw;
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
          @input="${(e) => this.update({ [key]: parseFloat(e.target.value) })}"
        />
        <span class="row-val">${v}${unit}</span>
      </div>
    `;
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

/* Die Gruppe "Elemente anzeigen" steht in jedem Slot ganz oben und offen. */
export const elementsGroup = (content) => html`
  <details class="section elements" open>
    <summary>Elemente anzeigen</summary>
    <div class="section-body">
      ${content}
      <small>Nur angehakte Elemente haben Felder — und landen in der Konfiguration.</small>
    </div>
  </details>
`;

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
`;
