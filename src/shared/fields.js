import { html, css, nothing } from "lit";

/*
 * Baukasten fuer die visuellen Editoren.
 *
 * Eine Fields-Instanz haengt an genau einem Config-Objekt (Card, Hero oder
 * einem Slot) und meldet jede Aenderung ueber `update(patch)` zurueck. Dadurch
 * benutzen Dashboard-Editor und Alias-Editor exakt dieselben Eingabefelder.
 */
export class Fields {
  constructor({ hass, config, defaults = {}, update, idPrefix = "f" }) {
    this.hass = hass;
    this.config = config || {};
    this.defaults = defaults;
    this.update = update;
    this.idPrefix = idPrefix;
  }

  val(key) {
    const v = this.config?.[key];
    return v === undefined || v === null || v === "" ? this.defaults[key] : v;
  }

  raw(key) {
    const v = this.config?.[key];
    return v === undefined || v === null ? "" : v;
  }

  _entityOptions(domains) {
    const states = this.hass?.states ?? {};
    return Object.keys(states)
      .filter((id) => !domains.length || domains.some((d) => id.startsWith(d + ".")))
      .sort();
  }

  text(label, key, hint = "", placeholder = "") {
    return html`
      <label
        >${label}
        <input
          type="text"
          .value="${String(this.raw(key))}"
          placeholder="${placeholder}"
          @input="${(e) => this.update({ [key]: e.target.value })}"
        />
        ${hint ? html`<small>${hint}</small>` : nothing}
      </label>
    `;
  }

  entity(label, key, hint = "", ...domains) {
    const listId = `${this.idPrefix}-${key}`;
    return html`
      <label
        >${label}
        <input
          type="text"
          list="${listId}"
          data-key="${key}"
          .value="${String(this.raw(key))}"
          placeholder="${(domains[0] || "sensor") + ".beispiel"}"
          @input="${(e) => this.update({ [key]: e.target.value })}"
          @change="${(e) => this.update({ [key]: e.target.value })}"
        />
        <datalist id="${listId}">
          ${this._entityOptions(domains).map((id) => html`<option value="${id}"></option>`)}
        </datalist>
        ${hint ? html`<small>${hint}</small>` : nothing}
      </label>
    `;
  }

  /* Entity an Position `index` einer Liste (z.B. stage_entities) */
  entityAt(label, key, index, hint = "", ...domains) {
    const listId = `${this.idPrefix}-${key}-${index}`;
    const list = Array.isArray(this.config?.[key]) ? this.config[key] : [];
    return html`
      <label
        >${label}
        <input
          type="text"
          list="${listId}"
          data-key="${key}.${index}"
          .value="${String(list[index] ?? "")}"
          placeholder="${(domains[0] || "switch") + ".beispiel"}"
          @input="${(e) => this._updateList(key, index, e.target.value)}"
          @change="${(e) => this._updateList(key, index, e.target.value)}"
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
    this.update({ [key]: list });
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

  slider(label, key, min, max, unit = "%", step = 1) {
    const v = this.val(key) ?? min;
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

  colorSelect(label, key) {
    return this.select(
      label,
      key,
      [
        ["white", "Weiß"],
        ["black", "Schwarz"],
      ],
      this.val(key) ?? "white"
    );
  }
}

export const section = (title, content, open = false) => html`
  <details class="section" ?open="${open}">
    <summary>${title}</summary>
    <div class="section-body">${content}</div>
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
  .slot-card {
    border: 1px solid var(--divider-color, #ccc);
    border-radius: 10px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
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
