/*
 * Nachladen der Home-Assistant-Eingabefelder (ha-entity-picker, ha-icon-picker).
 *
 * Diese Elemente gehören zum HA-Frontend, sind aber erst registriert, wenn
 * irgendein Editor sie einmal gebraucht hat. Der übliche Weg: sich über
 * `loadCardHelpers()` den Editor der eingebauten Entities-Card holen — dabei
 * lädt HA das ganze Paket an Pickern mit.
 *
 * Alles daran ist optional: gibt es die Elemente nicht (alte HA-Version,
 * Testlauf ohne Frontend), fallen die Felder auf ein einfaches Textfeld mit
 * Vorschlagsliste zurück. Die Card funktioniert in beiden Fällen.
 */
const NEEDED = ["ha-entity-picker", "ha-icon-picker"];

let pending = null;

export const haElementsReady = () =>
  typeof customElements !== "undefined" && NEEDED.every((tag) => !!customElements.get(tag));

export const hasHaElement = (tag) =>
  typeof customElements !== "undefined" && !!customElements.get(tag);

export const loadHaElements = () => {
  if (haElementsReady()) return Promise.resolve(true);
  if (typeof window === "undefined" || typeof window.loadCardHelpers !== "function") {
    return Promise.resolve(false);
  }
  if (!pending) {
    pending = (async () => {
      try {
        const helpers = await window.loadCardHelpers();
        const card = await helpers?.createCardElement?.({ type: "entities", entities: [] });
        await card?.constructor?.getConfigElement?.();
      } catch (err) {
        /* Kein stilles Schlucken: eine Zeile in die Konsole, dann Fallback. */
        console.warn("tomtut-pool-cards: HA-Eingabefelder nicht ladbar —", err?.message || err);
      }
      return haElementsReady();
    })();
  }
  return pending;
};
