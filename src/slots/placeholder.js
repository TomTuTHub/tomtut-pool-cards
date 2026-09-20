import { html, nothing } from "lit";
import { SlotBase } from "../shared/slot-base.js";
import { frameStyles, overlayStyles } from "../shared/styles.js";
import { SLOT_TYPES } from "../shared/assets.js";

/*
 * Slot "frame" — ein leerer Rahmen, der das Raster symmetrisch hält.
 *
 * Zugleich der Auffang für jeden Typ mit `ready: false` in SLOT_TYPES: für
 * einen noch nicht gebauten genauso wie für einen abgeschafften (seit
 * Iteration 6 die Einlaufdüse). Beide rendern als Rahmen mit kurzem Hinweis,
 * damit eine bestehende Config nie bricht, sondern erklärt wird.
 */
export class TomtutPoolSlotFrame extends SlotBase {
  static properties = {
    ...SlotBase.properties,
    slotType: { attribute: false },
  };

  render() {
    const c = this.config || {};
    const meta = SLOT_TYPES[this.slotType] || {};
    const hint = meta.ready === false ? meta.hint : c.hint || "";
    return this.renderSlot(html`
      ${c.title || c.label ? html`<h3 class="slot-title">${c.title || c.label}</h3>` : nothing}
      ${hint ? html`<p class="slot-hint">${hint}</p>` : nothing}
    `);
  }

  static styles = [frameStyles, overlayStyles];
}

customElements.define("tomtut-pool-slot-frame", TomtutPoolSlotFrame);
