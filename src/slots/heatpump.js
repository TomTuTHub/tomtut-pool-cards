import { html, css, nothing } from "lit";
import { SlotBase } from "../shared/slot-base.js";
import { frameStyles, overlayStyles } from "../shared/styles.js";
import { deviceImage } from "../shared/assets.js";
import { fmt, isOn } from "../shared/util.js";

/*
 * Slot "heatpump" — die komplette Logik der bisherigen
 * tomtut-pool-heatpump-card, nur als Slot-Modul.
 *
 * Die Feldnamen sind unveraendert, damit alte YAML 1:1 weiterlaeuft
 * (siehe alias-heatpump.js).
 *
 * Die Positions-Defaults sind auf das neue Skizzen-Artwork
 * (waermepumpe_*.png, 988 x 725) vermessen: das Lueftergitter liegt dort
 * bei 5,4–47,2 % der Breite und 17,4–82,5 % der Hoehe, ist also
 * perspektivisch elliptisch — daher fan_ratio statt eines runden Overlays.
 */
export const HEATPUMP_DEFAULTS = {
  /* Luefter */
  fan_top: 50,
  fan_left: 26,
  fan_size: 42,
  fan_ratio: 1.14,
  fan_speed: 60,
  fan_color: "black",
  fan_inactive: "gray",
  fan_power_threshold: 100,
  /* Powerbutton */
  power_btn_top: 20,
  power_btn_left: 54,
  power_btn_scale: 100,
  /* Stromverbrauch */
  power_top: 20,
  power_left: 74,
  power_scale: 95,
  power_box: true,
  power_color: "white",
  power_label: true,
  power_decimals: 0,
  /* Ist-Temperatur */
  current_bottom: 40,
  current_left: 70,
  current_scale: 100,
  current_box: true,
  current_color: "white",
  current_label: true,
  /* Soll-Temperatur */
  target_bottom: 16,
  target_left: 70,
  target_scale: 100,
  target_box: true,
  target_color: "white",
  target_label: true,
  target_step: 0.5,
  /* Freitext-Badge */
  label_top: 4,
  label_left: 50,
  label_scale: 100,
  label_box: true,
  label_color: "white",
};

export const heatpumpHasEntity = (c = {}) =>
  !!(c.switch_entity || c.power_entity || c.target_entity || c.current_entity);

export class TomtutPoolSlotHeatpump extends SlotBase {
  get defaults() {
    return HEATPUMP_DEFAULTS;
  }

  get powerEntityId() {
    return this.config?.switch_entity || null;
  }

  get powerConfirmText() {
    return `Eine laufende Waermepumpe sollte erst am Geraet bzw. ueber den Betriebsmodus
      ausgeschaltet werden — nicht einfach den Stecker ziehen! Hartes Trennen im Betrieb
      kann Kompressor und Elektronik schaden.`;
  }

  /* Soll-Temperatur: climate (attributes.temperature) oder number (state) */
  get _target() {
    const id = this.config.target_entity;
    const e = this._ent(id);
    if (!e) return null;
    const climate = String(id).startsWith("climate.");
    const value = climate ? e.attributes?.temperature : parseFloat(e.state);
    if (value === undefined || value === null || isNaN(value)) return null;
    const a = e.attributes || {};
    return {
      climate,
      value: Number(value),
      min: climate ? a.min_temp ?? 5 : a.min ?? 5,
      max: climate ? a.max_temp ?? 40 : a.max ?? 40,
      step: this.config.target_step ?? (climate ? a.target_temp_step ?? 0.5 : a.step ?? 0.5),
      unit: climate
        ? this.hass?.config?.unit_system?.temperature ?? "°C"
        : a.unit_of_measurement ?? "°C",
    };
  }

  /* Ist-Temperatur: climate (current_temperature) oder sensor (state) */
  get _current() {
    const id = this.config.current_entity;
    const e = this._ent(id);
    if (!e) return null;
    const climate = String(id).startsWith("climate.");
    const value = climate ? e.attributes?.current_temperature : parseFloat(e.state);
    if (value === undefined || value === null || isNaN(value)) return null;
    return {
      value: Number(value),
      unit: climate
        ? this.hass?.config?.unit_system?.temperature ?? "°C"
        : e.attributes?.unit_of_measurement ?? "°C",
    };
  }

  get _fanActive() {
    const mode = this.config.fan_source ?? "auto";
    const fanEnt = this._ent(this.config.fan_entity);
    if (mode !== "power" && fanEnt) {
      const s = String(fanEnt.state).toLowerCase();
      if (isOn(s)) return true;
      const n = parseFloat(s);
      return !isNaN(n) && n > 0;
    }
    if (mode === "entity") return false;
    const w = this._watt(this.config.power_entity);
    if (w === null) return false;
    return w >= Number(this._v("fan_power_threshold"));
  }

  _stepTarget(delta) {
    const t = this._target;
    if (!t || !this.hass) return;
    let next = Math.round((t.value + delta * t.step) / t.step) * t.step;
    next = Math.min(t.max, Math.max(t.min, next));
    next = Math.round(next * 100) / 100;
    if (next === t.value) return;
    if (t.climate) {
      this.hass.callService("climate", "set_temperature", {
        entity_id: this.config.target_entity,
        temperature: next,
      });
    } else {
      this.hass.callService("number", "set_value", {
        entity_id: this.config.target_entity,
        value: next,
      });
    }
  }

  _targetUp(ev) {
    ev?.stopPropagation();
    this._stepTarget(1);
  }

  _targetDown(ev) {
    ev?.stopPropagation();
    this._stepTarget(-1);
  }

  render() {
    const c = this.config || {};
    if (!this.hass) return this.renderSlot(nothing);
    if (!heatpumpHasEntity(c)) {
      return this.renderSlot(
        html`<p class="slot-hint">
          Waermepumpe: bitte mindestens eine Entity waehlen (Schalter, Leistung, Soll oder Ist).
        </p>`
      );
    }

    const showFan = c.show_fan !== false;
    const showPowerBtn = c.show_power_button !== false && !!c.switch_entity;
    const showPower = c.show_power !== false && !!c.power_entity;
    const showTarget = c.show_target !== false && !!c.target_entity;
    const showCurrent = c.show_current !== false && !!c.current_entity;
    const labelText = c.label_text || "";

    const fanSpeed = Number(this._v("fan_speed")) || 0;
    const fanDur = fanSpeed <= 0 ? 0 : Math.max(0.2, 4 - (fanSpeed / 100) * 3.6);
    const target = this._target;
    const current = this._current;

    return this.renderSlot(html`
      <div class="img-wrap">
        <img src="${deviceImage("heatpump", c)}" alt="Waermepumpe" />

        ${showFan
          ? this.renderFan({
              active: this._fanActive,
              top: this._v("fan_top"),
              left: this._v("fan_left"),
              size: this._v("fan_size"),
              ratio: this._v("fan_ratio"),
              dur: fanDur,
              color: this._v("fan_color"),
              inactive: this._v("fan_inactive"),
            })
          : nothing}
        ${showPowerBtn
          ? this.renderPowerButton({
              on: this._isOn(c.switch_entity),
              top: this._v("power_btn_top"),
              left: this._v("power_btn_left"),
              scale: this._v("power_btn_scale"),
            })
          : nothing}
        ${showPower
          ? this.renderValueBox({
              value: this.wattText(c.power_entity, Number(this._v("power_decimals")) || 0),
              unit: this._v("power_label") === false ? "" : "Watt",
              top: this._v("power_top"),
              left: this._v("power_left"),
              scale: this._v("power_scale"),
              box: this._v("power_box"),
              color: this._v("power_color"),
              entity: c.power_entity,
            })
          : nothing}
        ${showCurrent
          ? this.renderValueBox({
              value: current === null ? "—" : fmt(current.value, 1) + " " + current.unit,
              unit: this._v("current_label") === false ? "" : "Ist",
              bottom: this._v("current_bottom"),
              left: this._v("current_left"),
              scale: this._v("current_scale"),
              box: this._v("current_box"),
              color: this._v("current_color"),
              entity: c.current_entity,
            })
          : nothing}
        ${showTarget
          ? html`
              <div
                class="value-box target ${this._v("target_box") === false ? "no-bg" : ""}"
                style="bottom:${this._v("target_bottom")}%; left:${this._v(
                  "target_left"
                )}%; transform:translateX(-50%) scale(${(this._v("target_scale") ?? 100) /
                100}); --val-color:${this._v("target_color") === "black" ? "#111" : "#fff"};"
              >
                <div class="target-row">
                  <button
                    class="step"
                    ?disabled="${target === null}"
                    @click="${this._targetDown}"
                    title="Soll-Temperatur senken"
                  >
                    −
                  </button>
                  <div class="target-val">
                    <span class="val"
                      >${target === null ? "—" : fmt(target.value, 1) + " " + target.unit}</span
                    >
                    ${this._v("target_label") === false
                      ? nothing
                      : html`<span class="unit">Soll</span>`}
                  </div>
                  <button
                    class="step"
                    ?disabled="${target === null}"
                    @click="${this._targetUp}"
                    title="Soll-Temperatur anheben"
                  >
                    +
                  </button>
                </div>
              </div>
            `
          : nothing}
        ${labelText
          ? html`
              <div
                class="label-badge ${this._v("label_box") === false ? "no-bg" : ""}"
                style="top:${this._v("label_top")}%; left:${this._v(
                  "label_left"
                )}%; transform:translateX(-50%) scale(${(this._v("label_scale") ?? 100) /
                100}); color:${this._v("label_color") === "black" ? "#111" : "#fff"};"
              >
                ${labelText}
              </div>
            `
          : nothing}
        ${this.renderConfirm("Wirklich stromlos schalten?")}
      </div>
    `);
  }

  static styles = [
    frameStyles,
    overlayStyles,
    css`
      .value-box.target {
        padding: 0.35em 0.5em;
      }
      .target-row {
        display: flex;
        align-items: center;
        gap: 0.5em;
      }
      .target-val {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .step {
        background: rgba(255, 255, 255, 0.12);
        color: var(--val-color, #fff);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 0.5em;
        width: 1.9em;
        height: 1.9em;
        font-size: 1.15em;
        font-weight: 700;
        line-height: 1;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s, transform 0.1s;
      }
      .step:hover {
        background: rgba(255, 255, 255, 0.24);
      }
      .step:active {
        transform: scale(0.92);
      }
      .step[disabled] {
        opacity: 0.35;
        cursor: not-allowed;
      }
    `,
  ];
}

customElements.define("tomtut-pool-slot-heatpump", TomtutPoolSlotHeatpump);
