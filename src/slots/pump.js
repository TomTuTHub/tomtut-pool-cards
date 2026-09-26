import { html, css, nothing } from "lit";
import { SlotBase, slotLabel } from "../shared/slot-base.js";
import { frameStyles, overlayStyles } from "../shared/styles.js";
import { isOn, seit, numText, istTot, domainOf } from "../shared/util.js";

/*
 * Slot "pump" — Poolpumpe mit 1–3 Stufen (N1..N3) und optionalem STOP.
 *
 * Zwei Schaltmodelle:
 *   momentary (Default) — Impulstaster (z.B. Shelly 1 Mini Gen3), die selbst
 *     auf "off" zurückfallen. Aktiv ist die Entity mit dem jüngsten
 *     last_changed; ist STOP die jüngste, gilt die Pumpe als gestoppt.
 *     Ein Klick ruft immer turn_on (niemals toggle).
 *   latching — je Stufe ein Dauerrelais. Aktiv ist die Entity mit state "on".
 *     Beim Umschalten werden erst alle anderen Stufen ausgeschaltet, dann die
 *     gewählte eingeschaltet (Motorschutz). STOP schaltet alle Stufen aus.
 *
 * Die Positions-Defaults sind an Selinas Zeichnung vermessen (Iteration 7,
 * 2026-09-21, Motiv `Pumpe.png`) und im Editor frei verschiebbar:
 *   Laufrad       mittig auf der Volute (dem gerippten Spiralgehäuse zwischen
 *                 Vorfilter und Motor), klein genug, um darin zu bleiben
 *   Powerbutton   auf dem Motorgehäuse rechts
 *   Watt-Box      unten links, in der freien Ecke unter dem Saugstutzen
 *   Thermometer   oben, in der freien Fläche neben dem Druckstutzen
 */
export const PUMP_DEFAULTS = {
  /* Laufrad — immer rund, nur Ort, Größe und Tempo sind einstellbar */
  fan_top: 60,
  fan_left: 61,
  fan_size: 18,
  fan_inactive: "gray",
  /* Tempo je Stufe auf der Skala 1 (langsam) bis 10 (schnell) */
  fan_speed_1: 3,
  fan_speed_2: 5,
  fan_speed_3: 8,
  /* Powerbutton (main_entity) */
  power_btn_top: 62,
  power_btn_left: 80,
  power_btn_scale: 110,
  /* Watt-Box */
  power_bottom: 9,
  power_left: 24,
  power_scale: 98,
  power_box: true,
  power_label: true,
  /* Thermometer */
  temp_top: 11,
  temp_left: 38,
  temp_scale: 119,
  /* Unter dieser Leistung gilt die Pumpe als stehend */
  idle_watt: 30,
  /*
   * Stufe aus Leistung erkennen (Iteration 9). Wird die Stufe direkt an der
   * Pumpe umgestellt, erfährt Home Assistant davon nichts — die Leistung
   * verrät sie trotzdem. Ab der jeweiligen Schwelle (Watt, strikt größer)
   * gilt die Stufe; unter der N1-Schwelle steht die Pumpe.
   * Thomas' Pumpe zum Vergleich: N1 47 W, N2 271 W, N3 735 W.
   */
  stage_from_power: true,
  stage_watt_1: 20,
  stage_watt_2: 150,
  stage_watt_3: 500,
};

/*
 * Leistung -> Stufe. Rückgabe: Index 0..anzahl-1 oder null (= steht).
 * Schwellen sind "strikt größer": 20 W bei Schwelle 20 ist noch aus.
 * Hat die Anlage weniger Stufen als erkannt, gilt die höchste vorhandene.
 * Unsinnige Schwellen (nicht aufsteigend) werden nicht korrigiert — es
 * zählt die höchste überschrittene.
 */
export const stageFromWatt = (w, schwellen = [20, 150, 500], anzahl = 3) => {
  const n = Number(w);
  if (w === null || w === undefined || !isFinite(n) || anzahl < 1) return null;
  let stufe = null;
  schwellen.slice(0, 3).forEach((s, i) => {
    const grenze = Number(s);
    if (isFinite(grenze) && n > grenze) stufe = i;
  });
  return stufe === null ? null : Math.min(stufe, anzahl - 1);
};

export const FAN_SPEED_MIN = 1;
export const FAN_SPEED_MAX = 10;

/*
 * Tempo-Skala -> Umlaufzeit.
 *
 * Der Nutzer stellt 1..10 ein (links langsam, rechts schnell), die Animation
 * braucht eine Umlaufzeit in Sekunden. Abgebildet wird geometrisch, damit die
 * Schritte über den ganzen Weg gleich stark wirken:
 *   1 -> 4,0 s · 3 -> 2,3 s · 5 -> 1,4 s · 8 -> 0,7 s · 10 -> 0,5 s
 */
export const fanDuration = (speed) => {
  const s = Math.min(FAN_SPEED_MAX, Math.max(FAN_SPEED_MIN, Number(speed) || FAN_SPEED_MIN));
  const dur = 4 * Math.pow(0.5 / 4, (s - FAN_SPEED_MIN) / (FAN_SPEED_MAX - FAN_SPEED_MIN));
  return Math.round(dur * 100) / 100;
};

/*
 * Stufen-Entities als Liste. Eine einzelne Entity als Text (statt Liste)
 * gilt als Stufe 1 (Iteration 22, Bug A17 — vorher still "keine Stufen").
 */
export const stufenListe = (c = {}) => {
  const roh = c?.stage_entities;
  const liste = Array.isArray(roh) ? roh : typeof roh === "string" && roh.trim() ? [roh.trim()] : [];
  return liste.filter(Boolean).slice(0, 3);
};

/*
 * Domains, deren last_changed ein Tastendruck ist (Impulstaster). Ein
 * sensor o.ä. ändert sich ständig und würde sonst als "zuletzt gedrückt"
 * leuchten (Iteration 22, Bug A7).
 */
export const TASTER_DOMAINS = ["switch", "input_boolean", "light", "button", "input_button", "script"];

export const pumpHasEntity = (c = {}) => !!(stufenListe(c).length || c.main_entity);

const OPTIMISTIC_MS = 6000;

export class TomtutPoolSlotPump extends SlotBase {
  static properties = {
    ...SlotBase.properties,
    _tick: { state: true },
  };

  constructor() {
    super();
    this._tick = 0;
    this._optimistic = null;
  }

  get defaults() {
    return PUMP_DEFAULTS;
  }

  /* "seit …" muss mitlaufen, auch wenn sich in HA nichts ändert */
  connectedCallback() {
    super.connectedCallback();
    this._timer = setInterval(() => {
      this._tick = Date.now();
    }, 30000);
    /* Im Browser ist das eine Zahl; unter Node (Tests) hielte der Timer sonst
       den Prozess am Leben. */
    if (this._timer && typeof this._timer.unref === "function") this._timer.unref();
  }

  disconnectedCallback() {
    clearInterval(this._timer);
    this._timer = undefined;
    clearTimeout(this._optiTimer);
    super.disconnectedCallback();
  }

  get powerEntityId() {
    return this.config?.main_entity || null;
  }

  get powerConfirmText() {
    return `Die Poolpumpe wird hart vom Netz getrennt. Läuft sie gerade, sollte sie erst
      über STOP bzw. die Stufensteuerung heruntergefahren werden — sonst kann die Anlage
      Schaden nehmen (Druckschlag, trockenlaufende Gleitringdichtung).`;
  }

  get stages() {
    return stufenListe(this.config);
  }

  get stopEntity() {
    return this.config?.stop_entity || "";
  }

  get mode() {
    return this.config?.stage_mode === "latching" ? "latching" : "momentary";
  }

  get stageLabels() {
    const custom = Array.isArray(this.config?.stage_labels) ? this.config.stage_labels : [];
    return this.stages.map((_, i) => custom[i] || `N${i + 1}`);
  }

  /* Hauptschalter aus -> Pumpe kann gar nicht laufen */
  get blockedByMain() {
    return !!this.config?.main_entity && !this._isOn(this.config.main_entity);
  }

  /*
   * Ist die Erkennung aus der Leistung aktiv? Nur mit Leistungssensor, und
   * nur wenn der einen Zahlenwert liefert — sonst zählen wie bisher die
   * Schalter.
   */
  get _wattStufeAktiv() {
    return this._v("stage_from_power") !== false && !!this.config?.power_entity;
  }

  _wattStufe() {
    if (!this._wattStufeAktiv) return undefined;
    const w = this._watt(this.config.power_entity);
    if (w === null) return undefined;
    const schwellen = [1, 2, 3].map((i) => this._v(`stage_watt_${i}`));
    return stageFromWatt(w, schwellen, Math.max(1, this.stages.length));
  }

  /*
   * Zustand: Schalter, bei aktiver Erkennung überstimmt von der Leistung.
   * Widersprechen sich Relais und Watt, gewinnt die Messung (Iteration 22,
   * Bug A6) — auch bei latching: ein Relais kann "an" melden, während die
   * Pumpe längst auf einer anderen Stufe läuft.
   */
  _derive() {
    const schalter = this._deriveSchalter();
    const stufe = this._wattStufe();
    if (stufe === undefined) return schalter;
    if (stufe === null) {
      return { active: null, stopped: true, since: schalter.stopped ? schalter.since : null };
    }
    /* "seit …" nur, wenn die Schalter dieselbe Stufe meinen — sonst wissen
       wir nicht, wann an der Pumpe umgestellt wurde. */
    const since = schalter.active === stufe && !schalter.stopped ? schalter.since : null;
    return { active: stufe, stopped: false, since, ausLeistung: true };
  }

  /* Zustand aus den Schalter-Entities ableiten */
  _deriveSchalter() {
    const none = { active: null, stopped: false, since: null };
    if (this.mode === "latching") {
      let best = null;
      this.stages.forEach((id, i) => {
        const e = this._ent(id);
        if (!e || !isOn(e.state)) return;
        const t = Date.parse(e.last_changed || 0) || 0;
        if (!best || t > best.t) best = { i, t, since: e.last_changed };
      });
      if (!best) {
        /* "seit" = wann die letzte Stufe aus ging, nicht wann STOP zuletzt
           gedrückt wurde (Iteration 22, Bug A13) */
        let aus = null;
        for (const id of this.stages) {
          const e = this._ent(id);
          if (!e || istTot(e.state)) continue;
          const t = Date.parse(e.last_changed || 0) || 0;
          if (!aus || t > aus.t) aus = { t, since: e.last_changed };
        }
        return { active: null, stopped: true, since: aus?.since || null };
      }
      return { active: best.i, stopped: false, since: best.since };
    }

    /* momentary: jüngstes last_changed gewinnt */
    const candidates = this.stages.map((id, i) => ({ id, i }));
    if (this.stopEntity) candidates.push({ id: this.stopEntity, i: -1 });
    let best = null;
    for (const c of candidates) {
      const e = this._ent(c.id);
      if (!e || !e.last_changed) continue;
      /* nicht erreichbar oder kein Taster: zählt nicht als gedrückt (Bug A7) */
      if (istTot(e.state) || !TASTER_DOMAINS.includes(domainOf(c.id))) continue;
      const t = Date.parse(e.last_changed);
      if (isNaN(t)) continue;
      if (!best || t > best.t) best = { ...c, t, since: e.last_changed };
    }
    if (!best) return none;
    return best.i === -1
      ? { active: null, stopped: true, since: best.since }
      : { active: best.i, stopped: false, since: best.since };
  }

  /*
   * Nach einem Klick sofort optimistisch anzeigen, bis HA nachzieht. Läuft
   * die Frist ab, wird neu gezeichnet (Bug A6: ohne neuen HA-Zustand blieb
   * die Wunschstufe sonst bis zum 30-s-Takt stehen, auch gegen die Watt).
   */
  _optimistischSetzen(i) {
    this._optimistic = { i, t: Date.now() };
    clearTimeout(this._optiTimer);
    this._optiTimer = setTimeout(() => this.requestUpdate(), OPTIMISTIC_MS + 50);
    if (typeof this._optiTimer?.unref === "function") this._optiTimer.unref();
    this.requestUpdate();
  }

  get state() {
    const derived = this._derive();
    const o = this._optimistic;
    if (o && Date.now() - o.t < OPTIMISTIC_MS) {
      if (o.i === -1 && !derived.stopped) return { active: null, stopped: true, since: null };
      if (o.i >= 0 && derived.active !== o.i) return { active: o.i, stopped: false, since: null };
    }
    return derived;
  }

  get running() {
    const st = this.state;
    if (this.blockedByMain) return false;
    if (st.stopped || st.active === null) return false;
    /* Bei Erkennung aus der Leistung ist die N1-Schwelle die Ruhegrenze */
    if (st.ausLeistung) return true;
    const idle = Number(this._v("idle_watt"));
    const w = this._watt(this.config?.power_entity);
    if (w !== null && isFinite(idle) && w < idle) return false;
    return true;
  }

  _clickStage(i) {
    if (!this.bedienbar || this.blockedByMain) return;
    const id = this.stages[i];
    if (!id) return;
    this._optimistischSetzen(i);
    if (this.mode === "latching") {
      this.stages.forEach((other, k) => {
        if (k !== i) this._call(other, "turn_off");
      });
      this._call(id, "turn_on");
    } else {
      this._call(id, "turn_on");
    }
  }

  _clickStop() {
    if (!this.bedienbar || this.blockedByMain) return;
    this._optimistischSetzen(-1);
    if (this.mode === "latching") {
      this.stages.forEach((id) => this._call(id, "turn_off"));
    } else if (this.stopEntity) {
      this._call(this.stopEntity, "turn_on");
    }
  }

  get _showStop() {
    return !!this.stopEntity || this.mode === "latching";
  }

  /*
   * Rendern ist bewusst bedingungslos: ein frisch angelegter Slot zeigt sofort
   * Bild, Laufrad und Hinweistext — auch ohne hass und ohne eine einzige
   * Entity. Vorher blieb der Kasten leer, bis man ein Feld angeklickt hatte.
   */
  render() {
    const c = this.config || {};
    const configured = pumpHasEntity(c);
    const st = this.state;
    const speedKey = ["fan_speed_1", "fan_speed_2", "fan_speed_3"][st.active ?? 0] || "fan_speed_1";
    const showPower = c.show_power !== false && !!c.power_entity;
    const showTemp = c.show_temp !== false && !!c.temp_entity;
    const showBtn = c.show_power_button !== false && !!c.main_entity;
    const showStages = c.show_stages !== false && (this.stages.length > 0 || this._showStop);

    return this.renderSlot(html`
      ${slotLabel(c) ? html`<h3 class="slot-title">${slotLabel(c)}</h3>` : nothing}
      <div class="pump">
        <div class="img-wrap">
          ${this.renderGeraeteBild({ kind: "pump", alt: "Poolpumpe" })}
          ${c.show_fan === false
            ? nothing
            : this.renderFan({
                active: configured && this.running,
                top: this._v("fan_top"),
                left: this._v("fan_left"),
                size: this._v("fan_size"),
                dur: fanDuration(this._v(speedKey)),
                inactive: this._v("fan_inactive"),
                round: true,
              })}
          ${showBtn
            ? this.renderPowerButton({
                on: this._isOn(c.main_entity),
                top: this._v("power_btn_top"),
                left: this._v("power_btn_left"),
                scale: this._v("power_btn_scale"),
              })
            : nothing}
          ${showPower
            ? this.renderValueBox({
                value: this.wattText(c.power_entity),
                unit: this._v("power_label") === false ? "" : "Watt",
                bottom: this._v("power_bottom"),
                left: this._v("power_left"),
                scale: this._v("power_scale"),
                box: this._v("power_box"),
                entity: c.power_entity,
              })
            : nothing}
          ${showTemp
            ? this.renderThermo({
                value: numText(this._ent(c.temp_entity)),
                top: this._v("temp_top"),
                left: this._v("temp_left"),
                scale: this._v("temp_scale"),
                entity: c.temp_entity,
              })
            : nothing}
          ${this.renderConfirm("Poolpumpe stromlos schalten?")}
        </div>

        ${showStages
          ? html`
              <div class="stages ${this.blockedByMain ? "disabled" : ""}">
                ${this.stages.map(
                  (id, i) => html`
                    <button
                      class="stage-btn ${st.active === i && !st.stopped ? "active" : ""}"
                      @click="${() => this._clickStage(i)}"
                      title="${this.stageLabels[i]}"
                    >
                      <span class="stage-name">${this.stageLabels[i]}</span>
                      ${st.active === i && !st.stopped && st.since
                        ? html`<span class="stage-since">${seit(st.since)}</span>`
                        : nothing}
                    </button>
                  `
                )}
                ${this._showStop
                  ? html`
                      <button
                        class="stage-btn stop ${st.stopped ? "active" : ""}"
                        @click="${() => this._clickStop()}"
                        title="Pumpe stoppen"
                      >
                        <span class="stage-name">STOP</span>
                        ${st.stopped && st.since
                          ? html`<span class="stage-since">${seit(st.since)}</span>`
                          : nothing}
                      </button>
                    `
                  : nothing}
              </div>
            `
          : nothing}
      </div>
      ${configured
        ? nothing
        : html`<p class="slot-hint">
            Poolpumpe: bitte mindestens eine Stufen-Entity oder den Hauptschalter wählen.
          </p>`}
    `);
  }

  static styles = [
    frameStyles,
    overlayStyles,
    css`
      /* Laufrad dunkel (Iteration 22, Befund D): das Pumpenbild ist in jeder
         Füllung hell gezeichnet — ein weißes Rad (Schrift auf Schwarz)
         verschwand darauf */
      .fan-overlay.round {
        color: var(--tt-fan-color, #1f2d38);
      }
      .pump {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .pump .img-wrap {
        flex: 1 1 auto;
        min-width: 0;
      }
      .stages {
        flex: 0 0 clamp(72px, 30%, 124px);
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      /* Hauptschalter aus: gesperrt, aber lesbar (Iteration 22, Befund D —
         im Glas-Look waren die Taster vorher dunkelblau auf blau) */
      .stages.disabled .stage-btn {
        opacity: 0.6;
        border-style: dashed;
        filter: grayscale(1);
        pointer-events: none;
      }
      .stage-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        padding: 6px 8px;
        border-radius: 22px;
        border: 1px solid var(--tt-line);
        background: linear-gradient(var(--tt-deck), var(--tt-deck)), var(--tt-soft);
        color: var(--tt-fg);
        font-family: inherit;
        cursor: pointer;
        transition: background 0.15s, box-shadow 0.15s, transform 0.1s;
      }
      .stage-btn:hover {
        filter: brightness(1.06);
      }
      .stage-btn:active {
        transform: scale(0.97);
      }
      .stage-btn.active {
        background: linear-gradient(145deg, #00c878, #00a064);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.28);
        box-shadow: 0 0 10px rgba(0, 200, 120, 0.45);
      }
      .stage-btn.stop {
        color: var(--tt-stop, #c62828);
        border-color: var(--tt-stop, #c62828);
        font-weight: 800;
      }
      .stage-btn.stop.active {
        background: linear-gradient(145deg, #ff5a5a, #c62828);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.28);
        box-shadow: 0 0 10px rgba(255, 60, 60, 0.4);
      }
      .stage-name {
        font-size: 0.95em;
        font-weight: 700;
        line-height: 1.1;
      }
      .stage-since {
        font-size: 0.68em;
        opacity: 0.8;
        margin-top: 2px;
        line-height: 1.1;
        white-space: nowrap;
      }
    `,
  ];
}

customElements.define("tomtut-pool-slot-pump", TomtutPoolSlotPump);
