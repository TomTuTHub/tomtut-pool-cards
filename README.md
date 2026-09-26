# TomTuT Pool Cards

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/TomTuTHub/tomtut-pool-cards)](https://github.com/TomTuTHub/tomtut-pool-cards/releases/latest)
[![HA Version](https://img.shields.io/badge/Home%20Assistant-2026.3.0%2B-blue)](https://www.home-assistant.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

![Preview](https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/dist/poolbecken_freiform.png)

> Vorläufiges Bild: das mitgelieferte Becken-Artwork (Freiform). Ein echter
> Dashboard-Screenshot folgt.

Eine Lovelace-Card für das **ganze Poolgelände**: oben das Becken mit Live-Werten,
daneben Kästen für Wärmepumpe, Poolpumpe, UV-C-Lampe und eigene Werte. Du wählst in der Card ab,
was du nicht hast — es bleibt kein Loch im Layout, die übrigen Kästen rücken nach.

Die Card ist **generisch**: sie bringt keine eigene Integration mit, sondern hängt an den
Entities, die du ihr zuweist — egal ob die Geräte über Shelly, MQTT, LocalTuya, Modbus oder
eine Herstellerintegration in Home Assistant landen.

> **Disclaimer:** Dieses Projekt ist nicht affiliiert mit einem Pool-, Pumpen- oder
> Wärmepumpen-Hersteller. Nutzung auf eigene Verantwortung.

---

## Was drin ist

| Card | Zweck |
|---|---|
| `custom:tomtut-pool-dashboard` | Die Card der Sammlung: Becken + beliebig viele Geräte-Kästen. Darf mehrfach im Dashboard liegen. |

### Features

- **Becken-Hero** — sechs Formen (Oval, Rechteck, Achtform, Rund, Nierenform, Freiform) mit
  Thermometer für die Wassertemperatur sowie optionalen pH- und RX-Kästchen auf der Beckenwand.
- **Wärmepumpen-Kasten** — Soll-/Ist-Temperatur mit **+/−** direkt auf der Card, Stromverbrauch,
  Powerbutton mit Sicherheitsabfrage, animierter Lüfter in sechs Blatt-Designs (vom
  klassischen Vierblatt bis Batman). Optional mit **Betriebsmodus** (Heizen/Kühlen ×
  Silent/Smart/Auto/Boost): jeder Modus dreht das Rad in seinem eigenen Tempo, auf Wunsch
  rot beim Heizen und blau beim Kühlen. Dazu optional der **Freigabekontakt**
  (`release_entity`): offen = gesperrt, die Card zeigt es rot und das Lüfterrad steht still,
  auch wenn der Schalter an ist — geschlossen = freigegeben.
- **Poolpumpen-Kasten** — Stufen **N1 · N2 · N3** und **STOP** als Taster mit „seit …"-Anzeige,
  drehendes Laufrad mit eigenem Tempo je Stufe, Watt-Anzeige, optionaler Temperaturfühler,
  Hauptschalter mit Rückfrage. Funktioniert mit Impulstastern **und** mit Dauerrelais. Mit
  Leistungssensor erkennt der Kasten die Stufe auch dann, wenn sie direkt an der Pumpe
  umgestellt wurde.
- **UV-C-Lampen-Kasten** — Powerbutton mit Rückfrage, Watt-Anzeige, optionaler
  Temperaturfühler und ein sanft waberndes blau-violettes Glühen über dem Rohr, solange die
  Lampe läuft (Stärke einstellbar, 0 = ruhig). Das Bild lässt sich frei drehen, spiegeln und **in der Größe einstellen**, damit die
  Lampe so im Kasten liegt wie in der Anlage.
- **Solarheizungs-Kasten** — ein **Feld aus drei Absorbern** mit Vorlauf- und
  Rücklauf-Thermometer, optionalem Stromverbrauch und Powerbutton (Solarventil oder -pumpe)
  mit Rückfrage. Zwei Pfeile zeigen die Fließrichtung: blau links unten hinein, rot rechts oben hinaus.
  Der Vergleich der beiden Temperaturen zeigt auf einen Blick, ob die Sonne gerade etwas
  bringt.
- **Zubehör am Becken** — Skimmer, Einlaufdüse und Bodenablauf liegen als eigene kleine
  Bilder auf dem Becken, nicht in der Zeichnung. Jedes ist einzeln an- und abwählbar, in der
  Größe verstellbar und sitzt auf jeder der sechs Formen richtig. Die Einlaufdüse zeigt auf
  Wunsch in einem kleinen Kästchen daneben, wie warm das Wasser ist, das gerade ins Becken
  läuft (`inlet_temp_entity`).
- **Freifeld (benutzerdefiniert)** — freie Überschrift plus bis zu acht Einträge: Entity-Wert,
  Schalt-Button oder Freitext. Als `layout: liste` ein kompakter Schalter-Kasten im Stil der
  HA-Entities-Karte (Titel + 4 Zeilen in 384 × 268 px), als `layout: kacheln` ein 2-Spalten-Raster.
- **Mini-Ansicht** (`view: mini`) — die ganze Anlage kompakt in **einer** Card, z.B. fürs
  kleine Wand-Tablet: oben das Becken mit Temperatur (pH/RX/Zulauf daneben), darunter jedes
  Gerät als Kachel mit Selinas Bild, den ein, zwei wichtigsten Werten und seinem Zustand
  (grün an, rot aus, „Gesperrt" beim offenen Freigabekontakt). Becken + 4 Geräte passen bei
  500 px Breite in unter 290 px Höhe. Ein Tipp auf eine Kachel öffnet den vollen Kasten als
  Dialog — voll bedienbar bzw. nur Anzeige im Kiosk-Modus. Dieselbe Einrichtung wie die volle
  Ansicht, umgeschaltet im Editor ganz oben („Ansicht: Voll / Mini").
- **Eine Optik-Einstellung für alles** — Rahmen an/aus und `fill: transparent | weiss | schwarz`.
  Die Füllung steuert den ganzen Kasten: Hintergrund, Bild, Kästchen, Buttons und Schriftfarbe.
- **Mobil zuerst** — das Raster stapelt auf schmalen Bildschirmen sauber untereinander,
  alle Touch-Ziele sind mindestens 44 px groß, nichts hängt an Hover.
- **Visueller Editor** in drei Schritten (Becken / Geräte / Optik): erst ankreuzen, was das
  Gerät hat, dann erscheinen dessen Felder. Jeder Kasten trägt eine große Überschrift
  („Kasten 3 · Poolpumpe · Filterpumpe") und die Kennfarbe seines Typs, damit man bei sechs
  Kästen nicht den Faden verliert. YAML ist möglich, aber nie nötig.
- **Rückfrage pro Kasten** — die Warnung vor dem Ausschalten ist in jedem Kasten mit
  Schalter einzeln abwählbar („Vor dem Ausschalten nachfragen"); Freifeld-Buttons können sie
  auf Wunsch bekommen.
- **Handgezeichnetes Artwork** — alle Geräte, das Zubehör am Becken, die Richtungspfeile und
  das ovale Becken sind Zeichnungen (© TomTuT). Die übrigen fünf Beckenformen sind noch
  generierte Platzhalter im selben Stil.

---

## Voraussetzungen

- Home Assistant **2026.3.0** oder neuer
- [HACS](https://hacs.xyz/) installiert

> **Keine Integration nötig.** Du brauchst lediglich Entities, die deine Geräte in Home
> Assistant abbilden — woher die kommen, ist der Card egal.

---

## Installation

### Via HACS (empfohlen)

1. HACS in Home Assistant öffnen
2. **Frontend** → Drei-Punkte-Menü → **Benutzerdefinierte Repositories**
3. Repository hinzufügen: `https://github.com/TomTuTHub/tomtut-pool-cards` — Kategorie: **Dashboard**
4. Nach **TomTuT Pool Cards** suchen und **Herunterladen**
5. Browser neu laden

HACS kopiert den Ordner `dist/` nach `config/www/community/tomtut-pool-cards/` — die Bilder
liegen damit automatisch am richtigen Platz und müssen nicht separat kopiert werden.

### Manuelle Installation

1. Aus dem Ordner `dist/`: `tomtut-pool-cards.js` **und alle PNG-Dateien** herunterladen
2. Alles nach `config/www/community/tomtut-pool-cards/` kopieren
3. In HA: **Einstellungen → Dashboards → Ressourcen** → Ressource hinzufügen:
   - URL: `/local/community/tomtut-pool-cards/tomtut-pool-cards.js`
   - Ressourcentyp: **JavaScript-Modul**
4. Browser neu laden

---

## YAML-Beispiele

Im Dashboard-Editor: **Karte hinzufügen** → **TomTuT Pool Dashboard**. Der visuelle Editor
öffnet sich automatisch; die folgenden Beispiele zeigen dasselbe in YAML.

### 1. Alles — Becken, Wärmepumpe, Poolpumpe, UV-Lampe, Solar, Freifeld

```yaml
type: custom:tomtut-pool-dashboard
version: 1
hero:
  shape: freiform
  temp_entity: sensor.pool_wassertemperatur
  ph_entity: sensor.pool_ph
  rx_entity: sensor.pool_redox
  label_text: Pool
  # Skimmer und Einlaufdüse sind ab Werk an, der Bodenablauf nicht
  show_drain: true
  # Kästchen neben der Düse: was gerade ins Becken läuft
  inlet_temp_entity: sensor.einlauf_temperatur
frame:
  enabled: true
  fill: transparent
slots:
  - type: heatpump
    label_text: Wärmepumpe
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
  - type: uv
    label: UV-C-Lampe
    switch_entity: switch.shelly_uv_lampe
    power_entity: sensor.shelly_uv_lampe_power
  - type: solar
    label: Solarheizung
    switch_entity: switch.solarventil
    temp_in_entity: sensor.solar_vorlauf
    temp_out_entity: sensor.solar_ruecklauf
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

### 2. Nur Wärmepumpe

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
    label_text: Pool-Wärmepumpe
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
  fill: schwarz
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
    fan_speed_1: 3
    fan_speed_2: 5
    fan_speed_3: 8
```

---

## Konfiguration

### Card

| Option | Standard | Beschreibung |
|---|---|---|
| `version` | `1` | Config-Version. Bleibt bei `1`, solange diese Card Version 1 versteht. |
| `hero` | – | Das Becken (siehe unten). `hero: {enabled: false}` blendet es aus. |
| `frame` | – | Rahmen und Füllung für **alle** Slots. |
| `slots` | `[]` | Liste der Kästen in ihrer Reihenfolge. |
| `view` | `voll` | `voll` = Becken + Kästen wie gewohnt · `mini` = alles kompakt in einer Card (siehe unten) |
| `mini_tile_fill` | `schwarz` | Hintergrund der Mini-Kacheln **und** der Werte-Kästchen neben dem Becken: `schwarz`, `weiss` oder `transparent` (nur dünner Rand, Theme-Schrift) |
| `mini_card_fill` | `theme` | Hintergrund der äußeren Mini-Card: `theme` (HA-Card-Hintergrund), `schwarz`, `weiss` (jeweils mit passender Schrift) oder `transparent` (ohne Fläche, Rahmen und Schatten) |

#### Mini-Ansicht (`view: mini`)

Dieselbe Config, nur kompakt: Becken klein oben (Form, Temperatur, pH/RX/Zulauf als Kästchen),
darunter die Geräte als Kacheln — ab 440 px Breite in **einer** Zeile (bis 5 Geräte), schmaler
im 2er-Raster. Leere Rahmen und ausgeblendete Slots entfallen. Pro Kachel:

| Gerät | Kachel zeigt |
|---|---|
| `pump` | Stufe (auch aus der Leistung erkannt) + Watt |
| `heatpump` | Modus-Badge (bzw. „Aus") + Watt; „Gesperrt" bei offenem Freigabekontakt |
| `solar` | Vorlauf (blauer Pfeil) + Rücklauf (roter Pfeil) |
| `uv` | An/Aus + Watt (ohne Leistungssensor: nur An/Aus) |
| `custom` | erster Eintrag: Wert + Name |

Ab drei gewählten Werten (`mini_show`) stehen sie paarweise in zwei Spalten unter dem Bild;
passt ein Wert nicht in eine halbe Kachel, bekommt er die ganze Zeile — abgeschnitten wird nie.
Pumpe und Wärmepumpe zeigen ihr Rad auch in der Kachel: es dreht im Tempo des vollen Kastens
(Pumpe je Stufe, WP je Modus) und steht bei Stillstand.
Der Punkt oben rechts: grün = läuft, rot = aus, grau = unbekannt bzw. kein Schalter. Die
Wärmepumpe gilt als aus, sobald ihre `climate`-Entity `off` ist — auch wenn die Steckdose Strom
gibt (dieselbe Regel im vollen Kasten: Modus-Badge „Aus", Rad steht, Powerbutton bernstein mit
„Strom an / WP aus"). Die Solarheizung nimmt `active_entity` (z.B. Ventil-Rückmeldung), falls
gesetzt — eine eingeschaltete Solarsteuerung kann auch auf Bypass stehen.
Ein fehlender Wert (unknown/unavailable) erscheint als „–". Tipp auf eine Kachel oder das
Becken öffnet den vollen Kasten als Dialog über allem (Schließen per ✕, Tipp daneben oder Esc).
Kästen im Kiosk bleiben auch dort reine Anzeige.

```yaml
type: custom:tomtut-pool-dashboard
view: mini
hero: { shape: oval, temp_entity: sensor.pool_temperatur }
slots:
  - { type: heatpump, switch_entity: switch.wp, power_entity: sensor.wp_power, mode_entity: select.wp_modus }
  - { type: pump, stage_entities: [switch.n1, switch.n2, switch.n3], power_entity: sensor.pumpe_power }
  - { type: solar, temp_in_entity: sensor.solar_vorlauf, temp_out_entity: sensor.solar_ruecklauf }
```

### `hero` — das Becken

| Option | Standard | Beschreibung |
|---|---|---|
| `enabled` | `true` | Becken anzeigen |
| `shape` | `oval` | `oval`, `rechteck`, `achtform`, `rund`, `niere`, `freiform`. Unbekannte Werte fallen auf `oval` zurück. |
| `temp_entity` | – | Wassertemperatur → Thermometer auf der Wasserfläche |
| `ph_entity` | – | pH-Wert → Kästchen auf der Beckenwand |
| `rx_entity` | – | Redox/RX → Kästchen auf der Beckenwand |
| `label_text` | – | Freitext auf dem Becken |
| `label_scale` | `100` | Größe des Freitexts in % |
| `label_top` / `label_left` | aus der Formen-Tabelle | Position des Freitexts in % (Standard = oben mittig über der Wasserfläche) |
| `framed` | `false` | Becken mit Rahmen zeichnen |
| `show_thermo` / `show_ph` / `show_rx` | `true` | Einzelne Overlays abschalten |
| `show_skimmer` | `true` | Skimmer am hinteren Beckenrand links |
| `show_inlet` | `true` | Einlaufdüse am hinteren Beckenrand rechts |
| `show_drain` | `false` | Bodenablauf auf der Wasserfläche |
| `thermo_top` / `thermo_left` / `thermo_scale` | aus der Formen-Tabelle | Position und Größe des Thermometers |
| `ph_top` / `ph_left` / `rx_top` / `rx_left` | aus der Formen-Tabelle | Position der Kästchen |
| `skimmer_top` / `skimmer_left` / `skimmer_size` | aus der Formen-Tabelle / `10` | Lage und Breite des Skimmers |
| `inlet_top` / `inlet_left` / `inlet_size` | aus der Formen-Tabelle / `6.5` | Lage und Breite der Einlaufdüse |
| `inlet_temp_entity` | – | Temperatur des einströmenden Wassers → Kästchen neben der Düse (nur mit `show_inlet`) |
| `inlet_temp_top` / `inlet_temp_left` | Düsen-Anker + 8 / + 11 | Position des Kästchens; ohne Angabe wandert es mit der Düse |
| `drain_top` / `drain_left` / `drain_size` | aus der Formen-Tabelle / `9` | Lage und Breite des Bodenablaufs |
| `mini_skimmer_*` / `mini_inlet_*` / `mini_drain_*` | wie Voll | Eigene Lage (`_top`/`_left`) und Breite (`_size`) der drei Teile **nur für die Mini-Ansicht** (Iteration 20) — das Becken ist dort anders proportioniert. Fehlt ein Wert, gilt der der vollen Ansicht. Im Editor über „Positionen der Becken-Teile für: Voll / Mini“. Jedes Teil wird in beiden Ansichten so geklemmt, dass es ganz im Beckenbild bleibt; Breite 2–40 % |

Die Anker der Formen-Tabelle sind an den Bildern vermessen (siehe [Beckenformen](#beckenformen));
alle lassen sich pro Card überschreiben. Die drei `*_size`-Werte sind die **Breite in Prozent
der Beckenbreite** — im Editor steht dafür je ein Regler „Größe".

Skimmer und Einlaufdüse sind ab Werk **an**: so sieht ein Becken aus, das im Betrieb ist.
Wer nur das nackte Becken will, schaltet beide ab. Der Bodenablauf ist ab Werk **aus**, weil
ihn längst nicht jedes Becken hat.

Die Einlauftemperatur hängt an der Düse: ohne `show_inlet` kein Kästchen. Es ist im selben
Stil gezeichnet wie pH und RX und trägt die Beschriftung „Zulauf".

### `frame` — Optik aller Slots

| Option | Standard | Beschreibung |
|---|---|---|
| `enabled` | `true` | Rahmen um jeden Slot |
| `fill` | `transparent` | `transparent` (Theme-Hintergrund von HA), `weiss`, `schwarz` |

`fill` ist die **einzige** Farbeinstellung. Sie gilt für den kompletten Kasten: Hintergrund,
Fläche hinter dem Bild, Wertekästchen, Badges, Buttons, Laufrad und Schriftfarbe. Es gibt
bewusst keine Farbwahl pro Element und keine hellen/dunklen Bildvarianten mehr.

### Slot-Typen

| `type` | Status | Beschreibung |
|---|---|---|
| `heatpump` | fertig | Wärmepumpe |
| `pump` | fertig | Poolpumpe mit Stufen |
| `custom` | fertig | Freifeld (benutzerdefiniert): Werte, Buttons, Freitext |
| `frame` | fertig | Leerer Rahmen — hält das Raster symmetrisch |
| `hidden` | fertig | Slot ausblenden; die übrigen rücken nach |
| `uv` | fertig | UV-C-Lampe im Rohrstrang |
| `solar` | fertig | Solarheizung (Absorberfeld) |
| `inlet` | entfällt | **Abgeschafft in Iteration 6.** Die Einlaufdüse lebt als Sprite am Becken weiter |

Alle wählbaren Typen sind fertig. Ein unbekannter `type` (etwa ein Tippfehler oder ein Typ
aus einer neueren Version) rendert als leerer Rahmen, statt die Card scheitern zu lassen —
und genau das macht auch ein bestehendes `type: inlet`, mit dem Hinweis „Einlaufdüse ist
jetzt Teil des Beckens". Im Auswahlfeld des Editors taucht `inlet` nicht mehr auf.

Im Editor stehen im Auswahlfeld zuerst die allgemeinen Slots (`custom`, `hidden`, `frame`),
danach trennt eine nicht wählbare Zeile „— Geräte —“ die Gerätetypen ab. Die Schlüssel selbst
sind davon unberührt — die Reihenfolge ist reine Anzeige.

### Slot `heatpump`

| Option | Standard | Beschreibung |
|---|---|---|
| `switch_entity` | – | Schalter für den Powerbutton. **Ist er aus, steht der Lüfter immer** — egal, was die Watt sagen. |
| `confirm_off` | `true` | Vor dem Ausschalten nachfragen (Editor: „Vor dem Ausschalten nachfragen"). `false` = sofort aus |
| `power_entity` | – | Leistungssensor in W oder kW |
| `target_entity` | – | Soll-Temperatur: `climate.*` oder `number.*` |
| `current_entity` | – | Ist-Temperatur: `climate.*` (`current_temperature`) oder `sensor.*` |
| `fan_entity` / `fan_source` | – / `auto` | Woher der Lüfter seinen Zustand nimmt: `auto`, `entity`, `power` |
| `fan_power_threshold` | `100` | Ab wie viel Watt der Lüfter als laufend gilt |
| `fan_speed` | `60` | Drehgeschwindigkeit `0`–`100` |
| `fan_inactive` | `gray` | Im Stillstand: `gray` oder `hidden` |
| `fan_top` / `fan_left` / `fan_size` / `fan_ratio` | `49.5` / `26` / `42` / `1.14` | Lage des Lüfterrads in % des Bildes |
| `fan_design` | `klassisch` | Blatt-Design: `klassisch` (4 Blätter), `drei`, `fuenf`, `sichel` (Turbine), `propeller`, `batman` |
| `fan_color_mode` | `neutral` | `neutral` = schwarz/weiß wie die Schrift · `modus` = Heizen rot, Kühlen blau (braucht einen erkannten Betriebsmodus) |
| `show_mode` | `false` im Editor | Betriebsmodus auswerten. In YAML reicht `mode_entity`; `show_mode: false` schaltet ab |
| `mode_entity` | – | Modus-Quelle: `sensor`, `select`, `input_select` oder `climate` |
| `mode_attribute` | – | Statt des Zustands ein Attribut lesen, z.B. `preset_mode` bei `climate.*` |
| `mode_speed_<modus>` | Silent `3` · Smart `5` · Auto `6` · Boost `9` | Tempo je Modus auf der Skala 1–10 (wie die Poolpumpe). `<modus>` = `heiz_silent`, `heiz_smart`, `heiz_auto`, `heiz_boost`, `kuehl_silent`, `kuehl_smart`, `kuehl_auto`, `kuehl_boost` |
| `mode_map_<modus>` | z.B. `Heizen Silent, heat_silent, …` | Welche Gerätezustände dieser Modus heißt — Kommaliste, Groß-/Kleinschreibung, Leerzeichen, `_` und `-` egal. Leer = Vorgabe. Meist unnötig: seit Iteration 14 erkennt die Card Zustände mit Heizen/Kühlen **und** Stufe (Silent, Smart/Eco, Auto, Boost/Power/Turbo) selbst, Umlaute auch als ae/oe/ue. Eine eigene Liste ersetzt für diesen Modus Vorgabe und Automatik. Gilt weiter; im Editor nur noch, wenn die Entity keine Werteliste hat |
| `mode_map` | – | **Zuordnung je Gerätewert** (Iteration 19): `{ "Heizen Power": heiz_smart, "Auto": "" }` — gewinnt vor Listen und Automatik, `""` = bewusst nicht zuordnen. Im Editor unter „Modus-Zuordnung“: pro Wert der Entity eine Zeile mit Dropdown, vorbelegt mit der automatischen Zuordnung; nicht zugeordnete Werte sind rot |
| `mode_names` | – | Eigener Anzeigename für nicht zugeordnete Werte, z.B. `{ Auto: Automatik }` (Badge und Auswahl) |
| `show_mode_badge` | `true` | **Betriebsmodus-Badge** (Iteration 14): Klartext wie „Heizen Boost“, „Kühlen“, „Auto“, „Aus“, bei `climate.*` mit Preset („Heizen · Komfort“); Unbekanntes erscheint als Rohwert. Farbe wie das Rad (Heizen rot, Kühlen blau). Braucht `mode_entity`; `false` blendet nur das Badge aus, Tempo/Farbe bleiben |
| `mode_top` / `mode_left` / `mode_scale` | `86` / `64` / `100` | Lage und Größe des Modus-Badges in % des Bildes |
| (Modus wählen) | – | Seit Iteration 15 ist das Badge ein Knopf: Tippen öffnet die Auswahl aller Modi der Entity (deutsche Namen, aktueller mit ✓). Gesetzt wird per `select.select_option` / `input_select.select_option`, bei `climate.*` per `set_hvac_mode` bzw. `set_preset_mode` (Optionen aus `options` / `hvac_modes` / `preset_modes`). `sensor.*` bleibt reine Anzeige. Ein Fehler beim Umschalten steht sichtbar im Dialog |
| `release_entity` | – | **Freigabekontakt** (optional): `switch`, `input_boolean` oder `binary_sensor`. Offen = die Wärmepumpe darf nicht laufen, geschlossen = freigegeben |
| `show_release` | `false` im Editor | Freigabekontakt anzeigen. In YAML reicht `release_entity`; `show_release: false` schaltet ab |
| `release_top` / `release_left` / `release_scale` | `84` / `24` / `100` | Lage und Größe der Freigabe-Anzeige in % des Bildes |
| `show_release_since` | `false` | Klein unter der Freigabe-Anzeige, wie lange der letzte Wechsel her ist („seit 4 Min“, „seit 2 Std 10 Min“, „seit 3 Tagen“, aus `last_changed`); läuft minütlich mit |
| `label_text` | – | Freitext-Badge auf dem Bild |
| `show_power_button` / `show_power` / `show_current` / `show_target` / `show_fan` / `show_release` | `true` (`show_release`: nur mit Entity) | Einzelne Elemente abwählen — abgewählt heißt: keine Felder im Editor und keine Schlüssel in der Config |
| Positionsfelder | – | `power_*`, `current_*`, `target_*`, `label_*`, `power_btn_*`, `release_*`, `mode_*` — im Editor je Element per Schieberegler |

Mindestens **eine** Entity sollte gesetzt sein; sonst zeigt der Kasten einen Hinweis.

#### Freigabekontakt (`release_entity`)

Der Freigabekontakt ist der potentialfreie Eingang der Wärmepumpe: **offen = sie darf nicht
laufen**, egal was an ihrem eigenen Bedienteil eingestellt ist — **geschlossen = freigegeben**,
sie arbeitet nach ihrer eigenen Logik weiter. Damit sperrt oder gibt man sie von außen frei
(PV-Überschuss, Zeitfenster, Nachtruhe), ohne an ihren Einstellungen zu drehen.

Auf der Card sitzt dafür eine kleine Anzeige mit Kontaktsymbol: **grün + geschlossener Kontakt
= „Frei“**, **rot + abgehobener Hebel = „Gesperrt“**. Ist der Kontakt offen, steht der Lüfter
still — auch wenn der Schalter an ist und Watt anliegen; die Card zeigt damit, dass die
Wärmepumpe gar nicht laufen *kann*. Ein Klick schaltet `switch`/`input_boolean` um, ein
`binary_sensor` wird nur angezeigt. Ohne `release_entity` ändert sich nichts am bisherigen
Verhalten.

### Slot `pump`

| Option | Standard | Beschreibung |
|---|---|---|
| `stage_entities` | – | Liste mit 1–3 Stufen, Reihenfolge = N1..N3 |
| `stop_entity` | – | STOP-Kanal (bei Impulstastern ein eigener Shelly-Ausgang) |
| `stage_mode` | `momentary` | `momentary` (Impulstaster) oder `latching` (Dauerrelais) |
| `stage_labels` | `[N1, N2, N3]` | Eigene Beschriftung der Taster |
| `main_entity` | – | Hauptschalter/Steckdose → Powerbutton |
| `confirm_off` | `true` | Vor dem Ausschalten nachfragen. `false` = sofort aus |
| `power_entity` | – | Leistungssensor in W oder kW |
| `temp_entity` | – | Temperaturfühler → Thermometer auf dem Bild |
| `idle_watt` | `30` | Ruhewatt: unter diesem Verbrauch gilt die Pumpe als stehend (Laufrad grau). Gilt nur ohne Stufen-Erkennung |
| `stage_from_power` | `true` | **Stufe aus Leistung erkennen** (nur mit `power_entity`). Wird die Stufe direkt an der Pumpe umgestellt, weiß HA das nicht — die Leistung schon. Die erkannte Stufe leuchtet und bestimmt das Laufrad-Tempo; die Taster bleiben tippbar |
| `stage_watt_1` / `stage_watt_2` / `stage_watt_3` | `20` / `150` / `500` | Schwellen in W (strikt größer): über `stage_watt_1` = N1 usw., darunter = aus. Passt z.B. zu einer Pumpe mit N1 47 W, N2 271 W, N3 735 W |
| `label` | – | Überschrift über dem Kasten |
| `fan_speed_1` / `fan_speed_2` / `fan_speed_3` | `3` / `5` / `8` | Tempo des Laufrads je Stufe auf der Skala **1–10** (links langsam, rechts schnell) |
| `fan_top` / `fan_left` / `fan_size` | `60` / `61` / `18` | Lage des Laufrads in % des Bildes — ab Werk mittig auf der Volute (dem Spiralgehäuse). Die Box ist immer quadratisch, das Rad bleibt kreisrund |
| `power_btn_top` / `power_btn_left` / `power_btn_scale` | `62` / `80` / `110` | Powerbutton — ab Werk auf dem Motor |
| `power_bottom` / `power_left` / `power_scale` / `power_box` / `power_label` | `9` / `24` / `98` / `true` / `true` | Watt-Box unten links |
| `temp_top` / `temp_left` / `temp_scale` | `11` / `38` / `119` | Thermometer oben neben dem Druckstutzen |
| `show_stages` / `show_power_button` / `show_power` / `show_temp` / `show_fan` | `true` | Einzelne Elemente abwählen |

Mindestens `stage_entities` (≥ 1) **oder** `main_entity` sollte gesetzt sein.

#### Tempo-Skala des Laufrads

Der Editor zeigt drei Schieberegler „Tempo N1/N2/N3" von 1 bis 10, ohne Einheit. Intern wird
das geometrisch auf die Umlaufzeit abgebildet, damit sich jeder Schritt gleich stark anfühlt:

| Tempo | 1 | 3 | 5 | 8 | 10 |
|---|---|---|---|---|---|
| Umlaufzeit | 4,0 s | 2,3 s | 1,4 s | 0,7 s | 0,5 s |

#### Die beiden Schaltmodelle

**`momentary`** — der Normalfall bei nachgerüsteten Tastern (z.B. vier Shelly 1 Mini Gen3,
die den Badu-Net-Link ersetzen). Die Ausgänge fallen selbst wieder auf `off` zurück, ein
Zustand ist also nicht ablesbar. Die Card nimmt deshalb die Entity mit dem **jüngsten
`last_changed`**: was zuletzt ausgelöst wurde, gilt als aktiv. Ist STOP das Jüngste, gilt
die Pumpe als gestoppt. Ein Klick ruft immer `turn_on` — niemals `toggle`.

**`latching`** — je Stufe ein Dauerrelais. Aktiv ist, was auf `on` steht. Beim Umschalten
schaltet die Card **erst die anderen Stufen aus und dann die gewählte ein** (Motorschutz);
STOP schaltet alle Stufen aus.

Dazu zwei Regeln unter „Wann steht die Pumpe?": ist `main_entity` aus, sind die Taster
gesperrt und das Laufrad steht. Liegt `power_entity` unter `idle_watt`, steht das Laufrad
ebenfalls — die Taster bleiben aber bedienbar.

### Slot `uv` — UV-C-Lampe

Alle drei Entities sind optional; es reicht eine.

| Option | Standard | Beschreibung |
|---|---|---|
| `label` | – | Überschrift über dem Bild |
| `switch_entity` | – | Steckdose/Relais der Lampe → Powerbutton (`switch`, `input_boolean`, `light`) |
| `confirm_off` | `true` | Vor dem Ausschalten nachfragen. `false` = sofort aus |
| `power_entity` | – | Leistung in W oder kW → Watt-Box |
| `temp_entity` | – | Temperaturfühler → Thermometer |
| `show_power_button` / `show_power` / `show_temp` / `show_glow` | `true` | Einzelne Elemente abschalten |
| `anschluss` | `seite` | Bildvariante: `seite` (im Editor „Anschlussvariante 1") oder `oben` („Anschlussvariante 2") |
| `rotate` | `0` | Bild drehen, 0–359° |
| `mirror` | `false` | Bild waagrecht spiegeln |
| `uv_size` | `100` | Größe des Bildes im Kasten, `30`–`100` %. `100` = so groß, wie es in der jeweiligen Lage passt |
| `glow_top` / `glow_left` | `35` / `56` | Mitte des Glühbereichs in % |
| `glow_size` / `glow_thickness` | `40` / `13` | Länge und Dicke des Glühbereichs in % |
| `glow_angle` | `-15` | Neigung des Glühbereichs in ° (Neigung des Rohrs im Artwork) |
| `glow_intensity` | `80` | Leuchtstärke in % |
| `glow_pulse` | `40` | Wabern/Glimmen `0`–`300`; `0` = ruhig und statisch, bis `100` sanft (Kurve wie vor Iteration 14), darüber kräftig: größerer Hof, mehr Amplitude, bis 2,5× schnellerer Puls |
| `power_bottom` / `power_left` / `power_scale` / `power_box` / `power_label` | `9` / `76` / `100` / `true` / `true` | Watt-Box |
| `temp_top` / `temp_left` / `temp_scale` | `19` / `40` / `110` | Thermometer |
| `power_btn_top` / `power_btn_left` / `power_btn_scale` | `30` / `11` / `120` | Powerbutton |

```yaml
- type: uv
  label: UV-C-Lampe
  switch_entity: switch.uv_lampe
  power_entity: sensor.uv_lampe_power
  temp_entity: sensor.uv_lampe_temperatur
```

**Glühen:** steht `switch_entity` auf `on`, liegt ein weiches blau-violettes Licht über dem
Rohrkörper. Seit Iteration 9 **atmet** es sanft (`glow_pulse`): der Kern glimmt leicht auf
und ab, darüber wabert ein weicher Hof mit anderer Periode — organisch, kein Blinken. Der Kern
selbst ist unverändert, das Wabern kommt nur obendrauf; `glow_pulse: 0` ist der alte statische
Schein. Wer im Betriebssystem „Bewegung reduzieren" eingestellt hat, sieht es immer ruhig.
Bei `off`, unbekanntem Zustand oder fehlendem Schalter bleibt das Bild ruhig. Ohne
`switch_entity` gibt es kein Glühen.

**Drehen, Spiegeln, Größe:** gedreht wird das Bild **samt Glühen**; Thermometer, Watt-Box und
Powerbutton bleiben aufrecht und lesbar. Der Kasten ändert dabei seine Größe **nicht** — er
hat in jeder Lage das Seitenverhältnis des Artworks. Stattdessen wird das gedrehte Bild so
weit verkleinert, dass seine Hülle hineinpasst (bei 90°/270° einer quer liegenden Lampe also
auf gut 40 %). Genau das ist `uv_size: 100`. Kleinere Werte verkleinern zusätzlich —
Größe und Passfaktor werden multipliziert, deshalb kann auch eine gedrehte, kleine Lampe
nichts über den Kasten hinausschieben; die Nachbar-Cards bleiben unberührt. Nach dem Drehen
sitzen die Overlays anders und wollen im Editor neu gesetzt werden.

> Eine UV-Lampe kann nichts regeln, darum hat der Slot bewusst weder Durchflussfeld noch
> Stufen. In den meisten Anlagen hängt sie ohnehin an einer Zeitschaltuhr parallel zur
> Poolpumpe.

### Slot `solar` — Solarheizung

Eine Solarheizung heizt nicht selbst, sie gibt nur den Weg über die Absorber frei. Alle
Entities sind optional; es reicht eine.

| Option | Standard | Beschreibung |
|---|---|---|
| `label` | – | Überschrift über dem Bild |
| `switch_entity` | – | Solarventil oder Solarpumpe → Powerbutton (`switch`, `input_boolean`, `light`) |
| `confirm_off` | `true` | Vor dem Ausschalten nachfragen. `false` = sofort aus |
| `active_entity` | – | Läuft das Wasser gerade übers Feld? (z.B. `binary_sensor` Ventil „AN“). Bestimmt den Zustand in der Mini-Ansicht; ohne Angabe zählt `switch_entity` |
| `temp_in_entity` | – | Vorlauf (Wasser zum Absorber) → Thermometer am Zulauf **links unten**, beim blauen Pfeil |
| `temp_out_entity` | – | Rücklauf (Wasser zurück ins Becken) → Thermometer am Ablauf **rechts oben**, beim roten Pfeil |
| `power_entity` | – | Leistung der Solarpumpe in W oder kW → Watt-Box |
| `show_power_button` / `show_temp_in` / `show_temp_out` / `show_power` | `true` | Einzelne Elemente abschalten |
| `show_arrows` | `true` | Die beiden Richtungspfeile abschalten |
| `power_btn_top` / `power_btn_left` / `power_btn_scale` | `45` / `8` / `110` | Powerbutton |
| `arrow_in_top` / `arrow_in_left` / `arrow_in_size` | `86` / `8` / `12` | Blauer Pfeil (Zulauf), waagerecht; Größe = Pfeillänge in % der Bildbreite |
| `arrow_out_top` / `arrow_out_left` / `arrow_out_size` | `12.5` / `91` / `12` | Roter Pfeil (Rücklauf), waagerecht |
| `temp_in_top` / `temp_in_left` / `temp_in_scale` | `70` / `14` / `105` | Vorlauf-Thermometer |
| `temp_out_top` / `temp_out_left` / `temp_out_scale` | `25` / `72` / `105` | Rücklauf-Thermometer |
| `power_bottom` / `power_left` / `power_scale` / `power_box` / `power_label` | `8` / `42` / `100` / `true` / `true` | Watt-Box |

**Das Bild ist ein Feld, kein Einzelstück:** drei OKU-Absorber (Selinas Zeichnung) stehen nebeneinander in
Perspektive (siehe [Artwork](#artwork)). Die Fließrichtung steht fest und wird nur
beschriftet: der **blaue Pfeil links unten** zeigt ins Feld hinein (kaltes Wasser), der **rote rechts oben**
vom Feld weg (warmes Wasser) — beide waagerecht nach rechts, quer durchs Feld. Beide sind statisch — eine Fließrichtung kehrt sich nicht um.
Die Thermometer sitzen ab Werk neben ihrem Pfeil; verschieben geht im Editor.

### Kiosk-Modus (Iteration 15)

Dieselbe Card einmal bedienbar (z.B. Admin-Dashboard) und einmal als reine Anzeige (z.B. Flur-Tablet):

| Feld | Default | Bedeutung |
|---|---|---|
| `kiosk` | `false` | `true` = die gewählten Kästen sind nur Anzeige: kein Schalten, kein Modus-Wählen, keine Rückfrage, kein Detail-Dialog (more-info). Cursor normal, kein Hover-/Klick-Feedback, Look sonst identisch |
| `kiosk_slots` | alle | Für welche Kästen: `becken` und die Kasten-Nummern `1`…`n` (wie im Editor „Kasten 3“). Nicht genannte Kästen bleiben bedienbar |

```yaml
type: custom:tomtut-pool-dashboard
kiosk: true
kiosk_slots: [1, 2, 3]   # Becken bleibt bedienbar
```

Im Editor steht dafür ganz oben der Kasten „Kiosk-Modus (nur anzeigen)“ mit einer Liste aller Kästen.

### Slot `custom` — Freifeld (benutzerdefiniert)

| Option | Standard | Beschreibung |
|---|---|---|
| `title` | – | Überschrift |
| `layout` | `klassisch` | `klassisch` (mittig gestapelt), `liste` (Zeilen: Icon · Name · Schalter/Wert), `kacheln` (2 Spalten) |
| `align` | `mitte` (klassisch) / `oben` (liste, kacheln) | `oben`, `mitte`, `unten` |
| `entries` | `[]` | Bis zu **acht** Einträge. Mehr zeigt der Kasten nicht — er meldet „+N weitere ausgeblendet“, der Editor warnt. |

`liste` und `kacheln` tragen bei `fill: transparent` den Karten-Hintergrund und die Schriftfarben
des HA-Themes (`--ha-card-background`, `--primary-text-color`, `--secondary-text-color`,
`--state-icon-color`) und sind damit auf hellem wie dunklem Theme lesbar. Ohne `icon` zeigt jede
Zeile das Icon der Entity (wie in HA). Kiosk-Modus wirkt auch hier.

```yaml
# Schalter-Kasten, so hoch wie eine Entities-Karte mit 4 Zeilen
type: custom:tomtut-pool-dashboard
hero:
  enabled: false
frame:
  enabled: false
slots:
  - type: custom
    title: Poolschalter
    layout: liste
    entries:
      - { kind: button, entity: switch.poolroboter_switch_0 }
      - { kind: button, entity: switch.poollampe_zigbee, confirm_off: true }
      - { kind: entity, entity: sensor.solarheizung_status }
```

Jeder Eintrag:

| Feld | Beschreibung |
|---|---|
| `kind` | `entity` (Wert anzeigen), `button` (schaltet per `toggle`), `text` (Freitext) |
| `entity` | Entity für `entity` und `button` |
| `label` | Beschriftung; leer = Name der Entity |
| `icon` | Icon (klassisch nur für `button`; liste/kacheln für alle), im Editor über den HA-Icon-Picker, z.B. `mdi:lightbulb` |
| `text` | Inhalt für `kind: text` |
| `confirm_off` | Nur `button`: `true` = vor dem Ausschalten nachfragen. Standard `false` (schaltet sofort) |

### Dunkles Theme

Bei `fill: transparent` übernehmen Kästen die Farben des HA-Themes. Viele dunkle Themes (z.B.
„Liquid Glass“) haben einen halbtransparenten Kartenhintergrund — damit Zahlen-Kästchen,
Thermometer-Pillen, pH/RX, Modus-/Freigabe-Badge und Powerbutton auf dem Gerätebild trotzdem
lesbar bleiben, legt die Card bei heller Theme-Schrift automatisch eine deckende dunkle Unterlage
darunter (`--tt-deck`, aus der Schriftfarbe abgeleitet). Helle Themes und `fill: weiss|schwarz`
bleiben unverändert. Braucht einen Browser mit relativer CSS-Farbsyntax (Chrome/WebView 119+,
Safari 16.4+, Firefox 128+); ältere zeigen den bisherigen Look.

### Werte-Anzeige

Overlays zeigen Zahlen einheitlich: Watt ganzzahlig, Temperaturen mit höchstens einer
Nachkommastelle und deutschem Komma. Was kein reiner Zahlenwert ist (`unavailable`, ein
Zeitstempel, Text), wird als **„—"** dargestellt statt als sinnlose Zahl.

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
(`src/shared/assets.js`) mit den Ankern für Thermometer, pH, RX, Bodenablauf, Skimmer,
Einlaufdüse und Freitext. Layout, Card und Editor bleiben unberührt.

Die Anker sind **am Bild vermessen**, nicht geschätzt:

```bash
node tools/becken-zonen.mjs --anker   # Ankertabelle für SHAPES
node tools/becken-zonen.mjs           # Zonenkarte für den Test neu schreiben
```

Das Werkzeug trennt in jedem Bild die Wasserfläche von der vorderen Beckenwand und setzt
danach die Anker: Thermometer links auf dem Wasser, pH und RX nebeneinander auf einer Höhe
mittig auf der Wand, Bodenablauf rechts unten auf dem Wasser, Skimmer und Einlaufdüse auf der
hinteren Wasserkante (links bzw. rechts), Freitext oben mittig. Die Zonenkarte landet in
`test/fixtures/becken-zonen.json`; der Smoke-Test prüft damit, dass jeder Anker wirklich in
seiner Zone liegt.

Das Zubehör am Becken ist bewusst **nicht in die Zeichnung eingebacken**: Skimmer,
Einlaufdüse und Bodenablauf sind eigene PNGs (`HERO_SPRITES` in `src/shared/assets.js`), die
auf ihrem Anker sitzen. So bleibt jedes Teil einzeln abwählbar und funktioniert auf allen
sechs Formen, ohne dass es je Form eine eigene Bildvariante bräuchte.

---

## Artwork

Geräte, Zubehör, die beiden Richtungspfeile und das ovale Becken sind **handgezeichnet** und
stammen aus einem gemeinsamen Satz von Tuschezeichnungen (© TomTuT). Es gibt **keine
KI-generierten Gerätebilder mehr**; die letzten (Poolpumpe, Solarheizung, Einlaufdüse) sind in
Iteration 7 gegen die Originale getauscht worden. **Noch generiert** sind die fünf Beckenformen
außer Oval (Rechteck, Achtform, Rund, Niere, Freiform) — sie warten auf Zeichnungen.

Die Originale liegen bewusst **nicht** im Repo: HACS kopiert den Plugin-Ordner in jede
Home-Assistant-Installation, deshalb enthält `dist/` nur die optimierten Fassungen. Gebaut
werden sie mit einem einzigen Aufruf:

```bash
python3 tools/prepare-assets.py <ordner-mit-originalen> [weiterer ordner ...]
```

| Gruppe | Breite | Behandlung |
|---|---|---|
| Becken | max. 1280 px | Palette reduziert |
| Geräte | max. 1200 px | Palette reduziert, transparenter Rand abgeschnitten |
| Sprites am Becken | max. 640 px | dito — sie werden nie groß angezeigt |
| Richtungspfeile | max. 200 px | dito, zusätzlich um 90° im Uhrzeigersinn gedreht (sie zeigen im Bild nach rechts) |

Danach packt `zopflipng` (Debian: `apt install zopfli`) jede Datei verlustfrei nach — jeder
sichtbare Pixel bleibt gleich, die Dateien werden rund 7 % kleiner.

**Die Solarheizung ist eine Komposition.** Eine Solarheizung ist in Wirklichkeit ein Feld aus
mehreren Absorbern, kein einzelnes Gerät — deshalb gibt es dafür auch kein einzelnes Bild.
`dist/solar_transparent.png` wird aus **drei Kopien** von Selinas gezeichnetem `OKU_Panel.png`
gebaut (Iteration 9–12 kurz Thomas' Foto `OKU.png`, seit Iteration 13 wieder die Zeichnung): jedes Panel
steht um 12 % seiner Breite überlappend neben dem linken Nachbarn und 4 % seiner Höhe tiefer,
gezeichnet von hinten nach vorn. Daraus wird eine Querkachel in der Größenordnung der anderen
Gerätebilder. Die Rechnung steht in `tools/prepare-assets.py` (`SOLAR_UEBERLAPP`,
`SOLAR_VERSATZ_HOCH`); das Werkzeug schreibt sie samt Prüfsumme nach
`test/fixtures/solar-komposition.json`, und der Smoke-Test vergleicht das ausgelieferte PNG
damit. Wer die Panels anders stapeln will, ändert eine Zahl und lässt beides neu erzeugen.

> Die Palettenreduktion hängt an der Pillow-Version: gebaut wird auf der Werkbank
> (Debian 12, `python3-pil`). Ein anderer Rechner kann pixelgleiche, aber byteverschiedene
> PNGs erzeugen — dann meldet der Komposition-Test eine abweichende Prüfsumme.

Nach einem neuen Gerätebild gehören zwei Dinge nachgezogen: das Seitenverhältnis in
`DEVICE_RATIOS` (`src/shared/assets.js`) und die Overlay-Defaults des Slots, die am Motiv
vermessen sind.

---

## Update-Sicherheit

Die Konfiguration trägt `version: 1`. Neue Optionen kommen ausschließlich als **optionale
Felder mit Standardwert** dazu; bestehende Schlüssel werden nicht umbenannt und nicht
entfernt. Eine eingefrorene Beispiel-Config liegt als `test/fixtures/v1-config.yaml` im Repo
und muss in jeder künftigen Version identisch rendern — der Smoke-Test prüft genau das.

Wird ein reservierter Slot-Typ fertig, ersetzt sein Artwork den Platzhalter-Rahmen — die
Konfiguration bleibt dieselbe. Genau so kam in Iteration 4 die UV-Lampe zu einem `type: uv`
und in Iteration 5 die Solarheizung (`type: solar`) zu ihrem Bild; wer sie vorher schon
eingetragen hatte, sieht sie jetzt einfach.

Umgekehrt geht es genauso schonend: der Einlaufdüsen-Slot (`type: inlet`) ist in Iteration 6
**entfallen**, weil ein eigener Kasten für ein Stück Rohr nichts erklärt, was das Becken
nicht besser zeigt. Der Schlüssel bleibt trotzdem gültig — eine bestehende Karte rendert ihn
als leeren Rahmen mit dem Hinweis „Einlaufdüse ist jetzt Teil des Beckens" und bricht nicht.
Die Temperatur des einströmenden Wassers zeigt jetzt `hero.inlet_temp_entity` direkt neben
der Düse am Becken.

Eine Ausnahme von „sieht aus wie vorher" ist bewusst gewählt: seit Iteration 5 zeigt ein
Becken ohne weitere Angabe **Skimmer und Einlaufdüse**. Wer das nicht will, setzt
`show_skimmer: false` bzw. `show_inlet: false`.

Felder, die es nicht mehr gibt (`image_variant`, `image_url`, `box_color`, `fan_dur_*`,
`fan_color`, `power_color` und die übrigen Farbwähler), werden **ignoriert, nie abgelehnt**.
Alte Karten laufen also unverändert weiter, sie holen sich ihre Farben jetzt nur aus
`frame.fill`.

---

## Entwicklung

```bash
npm install
npx playwright install chromium   # einmalig, für den Render-Test
npm run build      # src/ -> dist/tomtut-pool-cards.js
npm test           # beide Tests: jsdom-Smoke + Render im Browser
npm run test:jsdom # nur der Smoke-Test (schnell, ohne Browser)
npm run test:render
```

**Zwei Tests, zwei Fragen.** Der Smoke-Test (`test/smoke.mjs`, jsdom) prüft Logik und
Markup — er kennt kein Layout. Der Render-Test (`test/render.spec.mjs`, Chromium über
Playwright) prüft, was man sieht: er baut die Card in drei Breiten (360/768/1200 px) mit der
UV-Lampe in zehn Lagen und misst, dass Bild und Overlays jedes Slots vollständig in ihrer
Box liegen und kein Slot höher wird als das 1,6-fache seiner Breite. Die Screenshots landen
in `test/render-out/` (nicht versioniert), ein Kontaktbogen zusätzlich unter dem Pfad aus
`RENDER_BELEG`. Ohne Chromium: `SKIP_RENDER_TEST=1 npm test`.

> Anlass war Iteration 6: die gedrehte UV-Lampe wurde riesig gerendert und legte sich über
> die Nachbar-Cards — im jsdom-Test sah alles grün aus. Layout prüft man im Browser.

Aufbau:

```
src/
  tomtut-pool-cards.js   Einstieg, registriert die Card
  dashboard-card.js      Raster aus Hero + Slots
  hero.js                Becken mit Overlays
  slots/                 ein Modul je Slot-Typ
  shared/                Formen-/Asset-Tabelle, Styles, Slot-Basis, Bild-Geometrie, Editor-Felder
  editor/                visueller Editor
test/smoke.mjs           Logik/Markup in jsdom
test/render.spec.mjs     Layout in Chromium (Playwright)
test/fixtures/demo.mjs   Beispiel-Anlage für den Render-Test (hass + Alles-Config)
tools/prepare-assets.py  erzeugt die optimierten PNGs in dist/ (Becken, Geräte, Sprites)
tools/becken-zonen.mjs   vermisst die Becken-Bilder (Anker + Zonen-Fixture)
tools/png-lesen.mjs      minimaler PNG-Leser für das Messwerkzeug
```

Die ausgelieferten Bilder entstehen aus dem Original-Artwork über
`python3 tools/prepare-assets.py <quellordner>` (skaliert und palettiert, ausschließlich
transparent). Die Originale liegen bewusst nicht im Repo — HACS lädt diesen Ordner in jede
Home-Assistant-Installation.

Die Entity- und Icon-Felder des Editors nutzen die Original-Elemente von Home Assistant
(`ha-entity-picker`, `ha-icon-picker`). Sind sie nicht verfügbar, fällt der Editor auf ein
Textfeld mit Vorschlagsliste zurück — die Card bleibt in beiden Fällen bedienbar.

---

## Support & Issues

Bugs und Feature-Requests bitte hier melden:
[https://github.com/TomTuTHub/tomtut-pool-cards/issues](https://github.com/TomTuTHub/tomtut-pool-cards/issues)

---

## Lizenz

MIT License — siehe [LICENSE](LICENSE) für Details.

---

## Über den Autor

Ich bin ausgebildeter Fachinformatiker für Systemintegration mit langjähriger IT-Erfahrung.
Früher war es der MCSE — heute ist es Vibe Coding. Diese Cards wurden mit Hilfe von Claude
gebaut. Ohne KI-Unterstützung hätte ich das nebenbei nie in dieser Form hinbekommen.

Mehr auf [thomasbase.de](https://thomasbase.de) und [YouTube @TomTuT](https://www.youtube.com/@TomTuT).

---

Das war TomTuT, bleib hart am Gas.
