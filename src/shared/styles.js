import { css } from "lit";

/*
 * Füllung = die EINE Optik-Einstellung der Card (`frame.fill`).
 *
 * Sie steuert den ganzen Kasten: Kastenhintergrund, Hintergrund hinter dem
 * Bild, Buttons/Badges/Kästchen und die Schriftfarbe. Es gibt bewusst keine
 * Farbwahl pro Element mehr und keine hellen/dunklen Bildvarianten — alles
 * hängt an diesen Tokens:
 *
 *   --tt-bg      Hintergrund des Kastens (und damit hinter dem Bild)
 *   --tt-fg      Schriftfarbe
 *   --tt-line    Rahmen-/Trennlinien
 *   --tt-soft    dezente Flächen (Taster, Powerbutton)
 *   --tt-box-bg  Hintergrund der Overlay-Kästchen auf dem Bild
 *   --tt-box-fg  Schrift in den Overlay-Kästchen
 *   --tt-deck    deckende Unterlage unter Kästchen und Powerbutton (Iteration 16):
 *                nur bei fill transparent UND heller Theme-Schrift (= dunkles
 *                Theme) eine undurchsichtige dunkle Fläche, sonst transparent.
 *
 * transparent = Theme-Hintergrund von Home Assistant, Schrift folgt dem Theme.
 */
/*
 * Die Füllungs-Tokens allein (Iteration 17 herausgelöst): frameStyles bindet
 * sie unverändert ein, die Mini-Ansicht der Card nutzt sie ohne das
 * Slot-Layout. Selektoren und Reihenfolge sind dieselben wie vorher — das
 * Ergebnis ist pixelgleich.
 */
export const fillTokens = css`
  .slot {
    --tt-bg: transparent;
    --tt-fg: var(--primary-text-color, #111);
    --tt-line: rgba(127, 127, 127, 0.55);
    --tt-soft: rgba(127, 127, 127, 0.16);
    --tt-box-bg: var(--ha-card-background, var(--card-background-color, rgba(255, 255, 255, 0.92)));
    --tt-box-fg: var(--primary-text-color, #111);
    --tt-deck: transparent;
  }
  /*
   * Dunkles Theme, fill transparent (Iteration 16, Kiosk-Flur): viele Themes
   * haben einen halbtransparenten Kartenhintergrund (Glas-Look). Als
   * Kästchen-Hintergrund scheint dann das Gerätebild durch, die helle Zahl
   * säuft ab, der Powerbutton verschwindet. --tt-deck legt eine deckende
   * Fläche darunter — abgeleitet aus der Schriftfarbe: Kehrwert der Farbe
   * (helle Schrift -> dunkle Fläche), Deckkraft 1 bei heller, 0 bei dunkler
   * Schrift. Helles Theme bleibt dadurch pixelgleich (Render-Test).
   * Ohne relative Farbsyntax (alte Browser) bleibt alles wie bisher.
   */
  @supports (color: rgb(from red r g b)) {
    .slot.fill-transparent {
      --tt-deck: rgb(
        from var(--tt-box-fg) calc(255 - r * 0.88) calc(255 - g * 0.88) calc(255 - b * 0.88) /
          clamp(0, calc((r + g + b) / 765 * 4 - 2), 1)
      );
    }
  }
  .slot.fill-weiss {
    --tt-bg: #ffffff;
    --tt-fg: #111111;
    --tt-line: rgba(0, 0, 0, 0.55);
    --tt-soft: rgba(0, 0, 0, 0.08);
    --tt-box-bg: rgba(255, 255, 255, 0.92);
    --tt-box-fg: #111111;
  }
  .slot.fill-schwarz {
    --tt-bg: #1e1e1e;
    --tt-fg: #ffffff;
    --tt-line: rgba(255, 255, 255, 0.45);
    --tt-soft: rgba(255, 255, 255, 0.12);
    --tt-box-bg: rgba(30, 30, 30, 0.9);
    --tt-box-fg: #ffffff;
  }
`;

export const frameStyles = css`
  /*
   * Eigener Stacking-Context je Card/Slot.
   *
   * Ohne ihn steigen die z-index-Werte der Overlays (Kaestchen, Thermometer,
   * Powerbutton, Sprites, Pfeile) in den Stapel der Home-Assistant-Oberflaeche
   * auf und legen sich beim Scrollen ueber die Kopfleiste. isolation:isolate
   * sperrt sie ein: innen zaehlt die Reihenfolge 1-5, nach aussen ist die
   * ganze Card ein einziges Element auf z-index 0 — unter der Kopfleiste.
   */
  :host {
    display: block;
    height: 100%;
    position: relative;
    isolation: isolate;
    z-index: 0;
  }
  .slot {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    padding: 10px;
    border-radius: 18px;
    border: 2px solid transparent;
    background: var(--tt-bg);
    color: var(--tt-fg);
  }
  ${fillTokens}
  .slot.framed {
    border-color: var(--tt-line);
  }
  /*
   * Kiosk-Modus (Iteration 15): gleicher Look, aber tot für Zeiger — kein
   * Hand-Cursor, kein Hover-/Klick-Feedback. Die eigentliche Sperre sitzt
   * im JS (SlotBase.bedienbar); das hier ist nur die Optik dazu.
   */
  .slot.kiosk,
  .slot.kiosk * {
    cursor: default !important;
  }
  .slot.kiosk * {
    pointer-events: none !important;
  }
  .slot-title {
    font-size: 0.95em;
    font-weight: 700;
    letter-spacing: 0.3px;
    text-align: center;
    color: var(--tt-fg);
    line-height: 1.2;
    margin: 0;
  }
  .slot-hint {
    font-size: 0.85em;
    opacity: 0.7;
    text-align: center;
    line-height: 1.35;
    margin: 0;
  }
`;

/* Overlays auf den Geräte-/Becken-Bildern: Werte-Box, Powerbutton,
   Thermometer, Laufrad/Lüfter und der Bestätigungs-Dialog.
 *
 * Die z-index-Leiter bleibt bewusst klein und gilt nur innerhalb des
 * Stacking-Context der Card (:host oben):
 *   1 Glimmen (UV)  ·  2 Sprites/Pfeile  ·  3 Werte-Box
 *   4 Freitext, Thermometer, pH/RX       ·  5 Powerbutton
 *   10 Bestätigungs-Dialog (liegt über allem, bleibt aber in der Card)
 * Nichts darf hier über 10 gehen — sonst ueberholt es die HA-Kopfleiste,
 * sobald der Stacking-Context einmal fehlt. */
export const overlayStyles = css`
  .img-wrap {
    position: relative;
    width: 100%;
    line-height: 0;
    /* Alle Overlays skalieren mit der Bildbreite — dadurch sieht der Slot in
       einer schmalen Spalte genauso aus wie in voller Dashboard-Breite. */
    container-type: inline-size;
    font-size: clamp(8px, 3.2cqw, 15px);
  }
  .img-wrap > img {
    width: 100%;
    height: auto;
    display: block;
  }

  /*
   * Bildbereich eines Geräte-Slots (shared/slot-base.js: renderGeraeteBild).
   *
   * Die Höhe kommt aus der Regel aspect-ratio im Inline-Stil, nicht aus dem Bild:
   * der Kasten steht schon vor dem Laden und ist für jeden Slot-Typ nach
   * derselben Regel gebaut. overflow:hidden ist die harte Grenze — der
   * innere Wrapper .bild darf gedreht und gespiegelt werden, hinaus kommt
   * er nie. Gedreht wird um die Mitte.
   */
  .bild-flaeche {
    position: relative;
    width: 100%;
    overflow: hidden;
  }
  .bild-flaeche > .bild {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    line-height: 0;
    transform-origin: center center;
  }
  .bild-flaeche > .bild > img {
    width: 100%;
    height: 100%;
    display: block;
  }

  /*
   * Zubehör-Sprites auf dem Becken (Skimmer, Einlaufdüse, Bodenablauf).
   * Die Breite steht im Inline-Stil (Prozent der Beckenbreite) und schlägt
   * die 100 % der Regel darüber; die Höhe folgt dem Seitenverhältnis.
   * Sie liegen über dem Wasser, aber unter Thermometer, pH/RX und Freitext.
   */
  .img-wrap > img.hero-sprite {
    position: absolute;
    height: auto;
    max-width: none;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 2;
  }

  /*
   * Drehendes Rad (Läufer / Lüfter).
   *
   * Das Laufrad der Poolpumpe ist rund und muss rund bleiben: feste 1:1-Box
   * (--fan-ratio 1) und preserveAspectRatio="xMidYMid meet" im SVG. Nur der
   * Lüfter der Wärmepumpe darf über --fan-ratio elliptisch werden, weil das
   * Gitter im Artwork perspektivisch verzerrt gezeichnet ist.
   * Gedreht wird um die Mitte der viewBox (= Nabe), nicht um den Schwerpunkt
   * der Flächen — sonst eiert das Rad.
   */
  .fan-overlay {
    position: absolute;
    aspect-ratio: 1 / var(--fan-ratio, 1);
    pointer-events: none;
    transform: translate(-50%, -50%);
    color: var(--tt-fan-color, var(--tt-fg));
    opacity: 0.3;
    filter: grayscale(1);
    transition: opacity 0.3s, filter 0.3s;
  }
  .fan-overlay svg {
    width: 100%;
    height: 100%;
    overflow: visible;
    display: block;
  }
  .fan-overlay svg g {
    transform-box: view-box;
    transform-origin: 50% 50%;
  }
  .fan-overlay.hidden {
    opacity: 0;
  }
  .fan-overlay.spinning {
    opacity: 0.9;
    filter: none;
  }
  .fan-overlay.spinning svg g {
    animation: fanSpin var(--fan-dur, 1s) linear infinite;
  }
  @keyframes fanSpin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Powerbutton */
  .power-badge {
    position: absolute;
    cursor: pointer;
    padding: 0.35em;
    border-radius: 50%;
    --mdc-icon-size: 1.75em;
    transition: box-shadow 0.3s, color 0.3s, opacity 0.3s;
    line-height: 0;
    background: linear-gradient(var(--tt-deck), var(--tt-deck)), var(--tt-soft);
    border: 1px solid var(--tt-line);
    transform-origin: top left;
    z-index: 5;
  }
  .power-badge.on {
    color: #4caf50;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.55);
  }
  .power-badge.off {
    color: #f44336;
    opacity: 0.75;
  }
  .power-badge:hover {
    filter: brightness(1.2);
  }
  /* Zustand unbekannt (Iteration 18b): grau, nicht rot */
  .power-badge.unbekannt {
    color: #9e9e9e;
    opacity: 0.85;
  }
  /* Steckdose an, Gerät aus (Iteration 18) */
  .power-badge.standby {
    color: #ffb300;
    box-shadow: 0 0 8px rgba(255, 179, 0, 0.45);
  }
  .power-hinweis {
    position: absolute;
    left: calc(100% + 0.35em);
    /* unter der Knopfmitte: so bleibt er unter dem Freitext-Label oben
       mittig, auch wenn das in schmalen Spalten wächst */
    top: 58%;
    display: flex;
    flex-direction: column;
    padding: 0.2em 0.45em;
    border-radius: 0.45em;
    border: 1px solid var(--tt-line);
    background: linear-gradient(var(--tt-deck), var(--tt-deck)), var(--tt-box-bg);
    color: var(--tt-box-fg);
    font-size: 0.62em;
    line-height: 1.2;
    white-space: nowrap;
    pointer-events: none;
  }
  .power-hinweis b {
    color: inherit;
  }

  /* Wertefelder auf dem Bild */
  .value-box {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(var(--tt-deck), var(--tt-deck)), var(--tt-box-bg);
    color: var(--tt-box-fg);
    border: 1px solid var(--tt-line);
    border-radius: 0.7em;
    padding: 0.4em 1em;
    min-width: 5.2em;
    line-height: 1.2;
    backdrop-filter: blur(4px);
    cursor: default;
    z-index: 3;
  }
  .value-box.no-bg {
    background: none;
    border: none;
    backdrop-filter: none;
    padding: 0.15em 0.4em;
    color: var(--tt-fg);
  }
  .val {
    font-size: 1.4em;
    font-weight: 700;
    color: inherit;
    white-space: nowrap;
  }
  .unit {
    font-size: 0.8em;
    font-weight: 600;
    color: inherit;
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 2px;
  }

  /* Freitext-Badge */
  .label-badge {
    position: absolute;
    padding: 0.15em 0.55em;
    background: linear-gradient(var(--tt-deck), var(--tt-deck)), var(--tt-box-bg);
    color: var(--tt-box-fg);
    border-radius: 0.3em;
    font-size: 0.8em;
    font-weight: 700;
    letter-spacing: 0.5px;
    line-height: 1.3;
    pointer-events: none;
    white-space: nowrap;
    z-index: 4;
  }
  .label-badge.no-bg {
    background: none;
    color: var(--tt-fg);
  }

  /* Thermometer (Skizzen-Look wie das Artwork) */
  .thermo {
    position: absolute;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    gap: 6px;
    line-height: 1;
    z-index: 4;
    cursor: default;
  }
  .thermo svg {
    height: var(--thermo-size, 3.6em);
    width: auto;
    display: block;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25));
  }
  .thermo .thermo-val {
    font-size: 1.05em;
    font-weight: 700;
    padding: 0.2em 0.55em;
    border-radius: 0.55em;
    white-space: nowrap;
    background: linear-gradient(var(--tt-deck), var(--tt-deck)), var(--tt-box-bg);
    color: var(--tt-box-fg);
    border: 1px solid var(--tt-line);
  }

  /* pH-/RX-Kästchen auf der Beckenwand */
  .chem-box {
    position: absolute;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 15%;
    padding: 0.3em 0.7em;
    border-radius: 0.7em;
    background: linear-gradient(var(--tt-deck), var(--tt-deck)), var(--tt-box-bg);
    color: var(--tt-box-fg);
    border: 1.5px solid var(--tt-line);
    line-height: 1.15;
    z-index: 4;
  }
  .chem-box .chem-key {
    font-size: 0.72em;
    font-weight: 700;
    opacity: 0.65;
    letter-spacing: 0.5px;
  }
  .chem-box .chem-val {
    font-size: 1.05em;
    font-weight: 700;
    white-space: nowrap;
  }

  /* Bestätigungs-Dialog */
  .confirm-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    line-height: normal;
    border-radius: 16px;
    animation: fadeIn 0.15s ease-out;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .confirm-panel {
    background: var(--card-background-color, #1e1e1e);
    color: var(--primary-text-color, #fff);
    border-radius: 16px;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
    padding: 18px 20px;
    width: min(92%, 420px);
    max-height: 92%;
    overflow-y: auto;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  .confirm-panel h3 {
    margin: 0 0 10px 0;
    font-size: 1.05em;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--warning-color, #ff9800);
    --mdc-icon-size: 22px;
  }
  .confirm-panel p {
    margin: 0 0 16px 0;
    font-size: 0.9em;
    line-height: 1.45;
  }
  .confirm-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
  .btn {
    padding: 8px 14px;
    border-radius: 8px;
    font-size: 0.9em;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid var(--divider-color, #555);
    background: transparent;
    color: var(--primary-text-color, #fff);
    font-family: inherit;
  }
  .btn.cancel:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  .btn.danger {
    background: #d32f2f;
    border-color: #d32f2f;
    color: #fff;
  }
  .btn.danger:hover {
    background: #b71c1c;
  }
`;
