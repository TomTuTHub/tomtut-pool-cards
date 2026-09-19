# TomTuT Pool Cards

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/TomTuTHub/tomtut-pool-cards)](https://github.com/TomTuTHub/tomtut-pool-cards/releases/latest)
[![HA Version](https://img.shields.io/badge/Home%20Assistant-2026.3.0%2B-blue)](https://www.home-assistant.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

![Preview](https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/dist/poolbecken_freiform.png)

> Vorlaeufiges Bild: das mitgelieferte Becken-Artwork (Freiform). Ein echter
> Dashboard-Screenshot folgt.

Eine Lovelace-Card fuer das **ganze Poolgelaende**: oben das Becken mit Live-Werten,
daneben Kaesten fuer Waermepumpe, Poolpumpe und eigene Werte. Du waehlst in der Card ab,
was du nicht hast — es bleibt kein Loch im Layout, die uebrigen Kaesten ruecken nach.

Die Card ist **generisch**: sie bringt keine eigene Integration mit, sondern haengt an den
Entities, die du ihr zuweist — egal ob die Geraete ueber Shelly, MQTT, LocalTuya, Modbus oder
eine Herstellerintegration in Home Assistant landen.

> **Disclaimer:** Dieses Projekt ist nicht affiliiert mit einem Pool-, Pumpen- oder
> Waermepumpen-Hersteller. Nutzung auf eigene Verantwortung.

---

## Was drin ist

| Card | Zweck |
|---|---|
| `custom:tomtut-pool-dashboard` | Die Card der Sammlung: Becken + beliebig viele Geraete-Kaesten. Darf mehrfach im Dashboard liegen. |
| `custom:tomtut-pool-heatpump-card` | Alias fuer bestehende Karten der alten *TomTuT Pool Heatpump Card*. Gleiche Optionen, gleiche Darstellung, neues Artwork. |

### Features

- **Becken-Hero** — sechs Formen (Oval, Rechteck, Achtform, Rund, Nierenform, Freiform) mit
  Thermometer fuer die Wassertemperatur sowie optionalen pH- und RX-Kaestchen auf der Beckenwand.
- **Waermepumpen-Kasten** — Soll-/Ist-Temperatur mit **+/−** direkt auf der Card, Stromverbrauch,
  Powerbutton mit Sicherheitsabfrage, animierter Luefter.
- **Poolpumpen-Kasten** — Stufen **N1 · N2 · N3** und **STOP** als Taster mit „seit …"-Anzeige,
  drehendes Laufrad in drei Geschwindigkeiten, Watt-Anzeige, optionaler Temperaturfuehler,
  Hauptschalter mit Rueckfrage. Funktioniert mit Impulstastern **und** mit Dauerrelais.
- **Werte-/Button-Kasten** — freie Ueberschrift plus bis zu drei Eintraege: Entity-Wert,
  Schalt-Button oder Freitext.
- **Einheitliche Optik** — Rahmen an/aus, Fuellung transparent/weiss/schwarz; die Schriftfarbe
  folgt automatisch.
- **Mobil zuerst** — das Raster stapelt auf schmalen Bildschirmen sauber untereinander,
  alle Touch-Ziele sind mindestens 44 px gross, nichts haengt an Hover.
- **Visueller Editor** in drei Schritten (Becken / Geraete / Optik) — YAML ist moeglich, aber nie noetig.

---

## Voraussetzungen

- Home Assistant **2026.3.0** oder neuer
- [HACS](https://hacs.xyz/) installiert

> **Keine Integration noetig.** Du brauchst lediglich Entities, die deine Geraete in Home
> Assistant abbilden — woher die kommen, ist der Card egal.

---

## Installation

### Via HACS (empfohlen)

1. HACS in Home Assistant oeffnen
2. **Frontend** → Drei-Punkte-Menue → **Benutzerdefinierte Repositories**
3. Repository hinzufuegen: `https://github.com/TomTuTHub/tomtut-pool-cards` — Kategorie: **Dashboard**
4. Nach **TomTuT Pool Cards** suchen und **Herunterladen**
5. Browser neu laden

HACS kopiert den Ordner `dist/` nach `config/www/community/tomtut-pool-cards/` — die Bilder
liegen damit automatisch am richtigen Platz und muessen nicht separat kopiert werden.

### Manuelle Installation

1. Aus dem Ordner `dist/`: `tomtut-pool-cards.js` **und alle PNG-Dateien** herunterladen
2. Alles nach `config/www/community/tomtut-pool-cards/` kopieren
3. In HA: **Einstellungen → Dashboards → Ressourcen** → Ressource hinzufuegen:
   - URL: `/local/community/tomtut-pool-cards/tomtut-pool-cards.js`
   - Ressourcentyp: **JavaScript-Modul**
4. Browser neu laden

---

## YAML-Beispiele

Im Dashboard-Editor: **Karte hinzufuegen** → **TomTuT Pool Dashboard**. Der visuelle Editor
oeffnet sich automatisch; die folgenden Beispiele zeigen dasselbe in YAML.

### 1. Alles — Becken, Waermepumpe, Poolpumpe, Werte-Kasten

```yaml
type: custom:tomtut-pool-dashboard
version: 1
hero:
  shape: freiform
  temp_entity: sensor.pool_wassertemperatur
  ph_entity: sensor.pool_ph
  rx_entity: sensor.pool_redox
  label_text: Pool
frame:
  enabled: true
  fill: transparent
slots:
  - type: heatpump
    label_text: Waermepumpe
    switch_entity: switch.shelly_waermepumpe
    power_entity: sensor.shelly_waermepumpe_power
    target_entity: climate.pool_waermepumpe
    current_entity: climate.pool_waermepumpe
  - type: pump
    label: Poolpumpe
    stage_mode: momentary
    stage_entities:
      - switch.shelly_pumpe_n1
      - switch.shelly_pumpe_n2
      - switch.shelly_pumpe_n3
    stop_entity: switch.shelly_pumpe_stopp
    main_entity: input_boolean.poolpumpe_schalter
    power_entity: sensor.poolpumpe_power
    temp_entity: sensor.temperaturfuehler_poolpumpe_druckseite_temperature
  - type: custom
    title: Werte
    align: mitte
    entries:
      - kind: entity
        entity: sensor.pool_lufttemperatur
        label: Luft
      - kind: button
        entity: switch.poolbeleuchtung
        label: Licht
        icon: mdi:lightbulb
      - kind: text
        text: Sommerbetrieb
  - type: frame
```

### 2. Nur Waermepumpe

```yaml
type: custom:tomtut-pool-dashboard
version: 1
hero:
  enabled: false
frame:
  enabled: true
  fill: weiss
slots:
  - type: heatpump
    label_text: Pool-Waermepumpe
    switch_entity: switch.shelly_waermepumpe
    power_entity: sensor.shelly_waermepumpe_power
    target_entity: climate.pool_waermepumpe
    current_entity: climate.pool_waermepumpe
    fan_power_threshold: 150
```

### 3. Nur Poolpumpe

```yaml
type: custom:tomtut-pool-dashboard
version: 1
hero:
  enabled: false
frame:
  enabled: true
  fill: transparent
slots:
  - type: pump
    label: Poolpumpe
    stage_mode: momentary
    stage_entities:
      - switch.shelly_pumpe_n1
      - switch.shelly_pumpe_n2
      - switch.shelly_pumpe_n3
    stop_entity: switch.shelly_pumpe_stopp
    power_entity: sensor.poolpumpe_power
```

---

## Konfiguration

### Card

| Option | Standard | Beschreibung |
|---|---|---|
| `version` | `1` | Config-Version. Bleibt bei `1`, solange diese Card Version 1 versteht. |
| `hero` | – | Das Becken (siehe unten). `hero: {enabled: false}` blendet es aus. |
| `frame` | – | Rahmen und Fuellung fuer **alle** Slots. |
| `slots` | `[]` | Liste der Kaesten in ihrer Reihenfolge. |

### `hero` — das Becken

| Option | Standard | Beschreibung |
|---|---|---|
| `enabled` | `true` | Becken anzeigen |
| `shape` | `oval` | `oval`, `rechteck`, `achtform`, `rund`, `niere`, `freiform`. Unbekannte Werte fallen auf `oval` zurueck. |
| `temp_entity` | – | Wassertemperatur → Thermometer auf der Wasserflaeche |
| `ph_entity` | – | pH-Wert → Kaestchen auf der Beckenwand |
| `rx_entity` | – | Redox/RX → Kaestchen auf der Beckenwand |
| `label_text` | – | Freitext auf dem Becken |
| `framed` | `false` | Becken mit Rahmen zeichnen |
| `box_color` | `weiss` | Kaestchen hell oder dunkel |
| `show_drain` | `false` | Bodenablauf — Grafik folgt, wird derzeit nicht gezeichnet |
| `thermo_top` / `thermo_left` / `thermo_scale` | aus der Formen-Tabelle | Position und Groesse des Thermometers |
| `ph_top` / `ph_left` / `rx_top` / `rx_left` | aus der Formen-Tabelle | Position der Kaestchen |

### `frame` — Optik aller Slots

| Option | Standard | Beschreibung |
|---|---|---|
| `enabled` | `true` | Rahmen um jeden Slot |
| `fill` | `transparent` | `transparent`, `weiss`, `schwarz` — die Schriftfarbe folgt automatisch |

### Slot-Typen

| `type` | Status | Beschreibung |
|---|---|---|
| `heatpump` | fertig | Waermepumpe |
| `pump` | fertig | Poolpumpe mit Stufen |
| `custom` | fertig | Werte und Buttons |
| `frame` | fertig | Leerer Rahmen — haelt das Raster symmetrisch |
| `hidden` | fertig | Slot ausblenden; die uebrigen ruecken nach |
| `uv` | reserviert | UV-C-Lampe — zeichnet bis dahin einen Rahmen mit Hinweis |
| `solar` | reserviert | Solarheizung — dito |
| `inlet` | reserviert | Einlaufduese — dito |

Reservierte Typen kannst du heute schon eintragen: die Card rendert einen leeren Rahmen und
fuellt ihn, sobald der Typ fertig ist — deine Konfiguration bleibt unveraendert.

### Slot `heatpump`

| Option | Standard | Beschreibung |
|---|---|---|
| `switch_entity` | – | Schalter fuer den Powerbutton. **Ausschalten fragt immer nach.** |
| `power_entity` | – | Leistungssensor in W oder kW |
| `target_entity` | – | Soll-Temperatur: `climate.*` oder `number.*` |
| `current_entity` | – | Ist-Temperatur: `climate.*` (`current_temperature`) oder `sensor.*` |
| `fan_entity` / `fan_source` | – / `auto` | Woher der Luefter seinen Zustand nimmt: `auto`, `entity`, `power` |
| `fan_power_threshold` | `100` | Ab wie viel Watt der Luefter als laufend gilt |
| `fan_speed` | `60` | Drehgeschwindigkeit `0`–`100` |
| `fan_inactive` | `gray` | Im Stillstand: `gray` oder `hidden` |
| `fan_top` / `fan_left` / `fan_size` / `fan_ratio` | `50` / `26` / `42` / `1.14` | Lage des Luefterrads in % des Bildes |
| `image_variant` | `transparent` | `transparent`, `weiss`, `schwarz` |
| `image_url` | – | Eigener Bildpfad, ueberschreibt `image_variant` |
| `label_text` | – | Freitext-Badge auf dem Bild |
| `show_power_button` / `show_power` / `show_current` / `show_target` / `show_fan` | `true` | Einzelne Elemente ausblenden |
| Positions- und Farbfelder | – | `power_*`, `current_*`, `target_*`, `label_*` — im Editor unter *Erweiterte Einstellungen* per Schieberegler |

Mindestens **eine** der vier Entities sollte gesetzt sein; sonst zeigt der Kasten einen Hinweis.

### Slot `pump`

| Option | Standard | Beschreibung |
|---|---|---|
| `stage_entities` | – | Liste mit 1–3 Stufen, Reihenfolge = N1..N3 |
| `stop_entity` | – | STOP-Kanal (bei Impulstastern ein eigener Shelly-Ausgang) |
| `stage_mode` | `momentary` | `momentary` (Impulstaster) oder `latching` (Dauerrelais) |
| `stage_labels` | `[N1, N2, N3]` | Eigene Beschriftung der Taster |
| `main_entity` | – | Hauptschalter/Steckdose → Powerbutton **mit Rueckfrage** |
| `power_entity` | – | Leistungssensor in W oder kW |
| `temp_entity` | – | Temperaturfuehler → Thermometer auf dem Bild |
| `idle_watt` | `5` | Unter diesem Wert gilt die Pumpe als stehend (Laufrad haelt an) |
| `label` | – | Ueberschrift ueber dem Kasten |
| `fan_dur_1` / `fan_dur_2` / `fan_dur_3` | `3` / `1.5` / `0.7` | Umlaufzeit des Laufrads je Stufe in Sekunden |
| `fan_top` / `fan_left` / `fan_size` / `fan_ratio` | `55` / `60` / `18` / `2` | Lage des Laufrads in % des Bildes |
| `image_variant` / `image_url` | `transparent` / – | Bildvariante bzw. eigenes Bild |
| `show_power_button` / `show_power` / `show_temp` / `show_fan` | `true` | Einzelne Elemente ausblenden |

Mindestens `stage_entities` (≥ 1) **oder** `main_entity` sollte gesetzt sein.

#### Die beiden Schaltmodelle

**`momentary`** — der Normalfall bei nachgeruesteten Tastern (z.B. vier Shelly 1 Mini Gen3,
die den Badu-Net-Link ersetzen). Die Ausgaenge fallen selbst wieder auf `off` zurueck, ein
Zustand ist also nicht ablesbar. Die Card nimmt deshalb die Entity mit dem **juengsten
`last_changed`**: was zuletzt ausgeloest wurde, gilt als aktiv. Ist STOP das Juengste, gilt
die Pumpe als gestoppt. Ein Klick ruft immer `turn_on` — niemals `toggle`.

**`latching`** — je Stufe ein Dauerrelais. Aktiv ist, was auf `on` steht. Beim Umschalten
schaltet die Card **erst die anderen Stufen aus und dann die gewaehlte ein** (Motorschutz);
STOP schaltet alle Stufen aus.

Zusaetzlich zwei Plausibilitaets-Regeln: ist `main_entity` aus, sind die Taster gesperrt und
das Laufrad steht. Liegt `power_entity` unter `idle_watt`, steht das Laufrad ebenfalls — die
Taster bleiben aber bedienbar.

### Slot `custom`

| Option | Standard | Beschreibung |
|---|---|---|
| `title` | – | Ueberschrift |
| `align` | `mitte` | `oben`, `mitte`, `unten` |
| `entries` | `[]` | Bis zu **drei** Eintraege |

Jeder Eintrag:

| Feld | Beschreibung |
|---|---|
| `kind` | `entity` (Wert anzeigen), `button` (schaltet per `toggle`), `text` (Freitext) |
| `entity` | Entity fuer `entity` und `button` |
| `label` | Beschriftung; leer = Name der Entity |
| `icon` | Icon fuer `button`, z.B. `mdi:lightbulb` |
| `text` | Inhalt fuer `kind: text` |

---

## Beckenformen

| `shape` | Datei |
|---|---|
| `oval` | `poolbecken_oval.png` |
| `rechteck` | `poolbecken_rechteck.png` |
| `achtform` | `poolbecken_achtform.png` |
| `rund` | `poolbecken_rund.png` |
| `niere` | `poolbecken_nierenform.png` |
| `freiform` | `poolbecken_freiform.png` |

Eine neue Form braucht genau zwei Dinge: das PNG in `dist/` und einen Eintrag in `SHAPES`
(`src/shared/assets.js`) mit den Ankern fuer Thermometer, pH, RX und Bodenablauf. Layout,
Card und Editor bleiben unberuehrt.

> Das Artwork der Poolpumpe ist in dieser Version noch ein **Platzhalter** und wird durch die
> endgueltige Zeichnung ersetzt. Positionen und Bedienung aendern sich dadurch nicht.

---

## Umstieg von der alten Heatpump-Card

Bestehende Karten laufen unveraendert weiter — `custom:tomtut-pool-heatpump-card` gibt es
weiterhin, mit denselben Optionen. Sie rendert intern das Dashboard mit genau einem
Waermepumpen-Kasten, ohne Becken und ohne Rahmen. Neu ist nur das Artwork.

```yaml
type: custom:tomtut-pool-heatpump-card
label_text: Pool-Waermepumpe
target_entity: climate.pool_waermepumpe
current_entity: climate.pool_waermepumpe
power_entity: sensor.shelly_waermepumpe_power
switch_entity: switch.shelly_waermepumpe
```

Wer moechte, stellt spaeter auf `custom:tomtut-pool-dashboard` mit einem `heatpump`-Slot um —
die Feldnamen sind dieselben. Ein Zwang dazu besteht nicht.

**Wichtig:** die alte Card kam aus einem eigenen Repository. Laeuft beides parallel, gibt es
zwei Ressourcen mit demselben Card-Namen. Deinstalliere die alte *TomTuT Pool Heatpump Card*
in HACS, wenn du diese Sammlung nutzt.

---

## Update-Sicherheit

Die Konfiguration traegt `version: 1`. Neue Optionen kommen ausschliesslich als **optionale
Felder mit Standardwert** dazu; bestehende Schluessel werden nicht umbenannt und nicht
entfernt. Eine eingefrorene Beispiel-Config liegt als `test/fixtures/v1-config.yaml` im Repo
und muss in jeder kuenftigen Version identisch rendern — der Smoke-Test prueft genau das.

---

## Entwicklung

```bash
npm install
npm run build     # src/ -> dist/tomtut-pool-cards.js
npm test          # Smoke-Test gegen dist/ (jsdom, ohne Home Assistant)
```

Aufbau:

```
src/
  tomtut-pool-cards.js   Einstieg, registriert beide Cards
  dashboard-card.js      Raster aus Hero + Slots
  alias-heatpump.js      Alias auf die alte Heatpump-Card
  hero.js                Becken mit Overlays
  slots/                 ein Modul je Slot-Typ
  shared/                Formen-/Asset-Tabelle, Styles, Slot-Basis, Editor-Felder
  editor/                visueller Editor
tools/prepare-assets.py  erzeugt die optimierten PNGs in dist/
```

Die ausgelieferten Bilder entstehen aus dem Original-Artwork ueber
`python3 tools/prepare-assets.py <quellordner>` (skaliert, palettiert, plus die Varianten
weiss/schwarz). Die Originale liegen bewusst nicht im Repo — HACS laedt diesen Ordner in jede
Home-Assistant-Installation.

---

## Support & Issues

Bugs und Feature-Requests bitte hier melden:
[https://github.com/TomTuTHub/tomtut-pool-cards/issues](https://github.com/TomTuTHub/tomtut-pool-cards/issues)

---

## Lizenz

MIT License — siehe [LICENSE](LICENSE) fuer Details.

---

## Ueber den Autor

Ich bin ausgebildeter Fachinformatiker fuer Systemintegration mit langjaehriger IT-Erfahrung.
Frueher war es der MCSE — heute ist es Vibe Coding. Diese Cards wurden mit Hilfe von Claude
gebaut. Ohne KI-Unterstuetzung haette ich das nebenbei nie in dieser Form hinbekommen.

Mehr auf [thomasbase.de](https://thomasbase.de) und [YouTube @TomTuT](https://www.youtube.com/@TomTuT).

---

Das war TomTuT, bleib hart am Gas.
