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
| `custom:tomtut-pool-heatpump-card` | Alias für bestehende Karten der alten *TomTuT Pool Heatpump Card*. Gleiche Optionen, gleiche Darstellung, neues Artwork. |

### Features

- **Becken-Hero** — sechs Formen (Oval, Rechteck, Achtform, Rund, Nierenform, Freiform) mit
  Thermometer für die Wassertemperatur sowie optionalen pH- und RX-Kästchen auf der Beckenwand.
- **Wärmepumpen-Kasten** — Soll-/Ist-Temperatur mit **+/−** direkt auf der Card, Stromverbrauch,
  Powerbutton mit Sicherheitsabfrage, animierter Lüfter.
- **Poolpumpen-Kasten** — Stufen **N1 · N2 · N3** und **STOP** als Taster mit „seit …"-Anzeige,
  drehendes Laufrad mit eigenem Tempo je Stufe, Watt-Anzeige, optionaler Temperaturfühler,
  Hauptschalter mit Rückfrage. Funktioniert mit Impulstastern **und** mit Dauerrelais.
- **UV-C-Lampen-Kasten** — Powerbutton mit Rückfrage, Watt-Anzeige, optionaler
  Temperaturfühler und ein ruhiges blau-violettes Glühen über dem Rohr, solange die Lampe
  läuft. Das Bild lässt sich frei drehen und spiegeln, damit die Lampe so im Kasten liegt
  wie in der Anlage.
- **Solarheizungs-Kasten** — Absorberfeld mit Vorlauf- und Rücklauf-Thermometer an den
  beiden Rohrstutzen, optionalem Stromverbrauch und Powerbutton (Solarventil oder -pumpe)
  mit Rückfrage. Der Vergleich der beiden Temperaturen zeigt auf einen Blick, ob die Sonne
  gerade etwas bringt.
- **Einlaufdüsen-Kasten** — bewusst minimal: ein Thermometer an der Düsenöffnung zeigt, wie
  warm das Wasser ist, das gerade ins Becken läuft.
- **Zubehör am Becken** — Skimmer, Einlaufdüse und Bodenablauf liegen als eigene kleine
  Bilder auf dem Becken, nicht in der Zeichnung. Jedes ist einzeln an- und abwählbar, in der
  Größe verstellbar und sitzt auf jeder der sechs Formen richtig.
- **Freifeld (benutzerdefiniert)** — freie Überschrift plus bis zu drei Einträge: Entity-Wert,
  Schalt-Button oder Freitext.
- **Eine Optik-Einstellung für alles** — Rahmen an/aus und `fill: transparent | weiss | schwarz`.
  Die Füllung steuert den ganzen Kasten: Hintergrund, Bild, Kästchen, Buttons und Schriftfarbe.
- **Mobil zuerst** — das Raster stapelt auf schmalen Bildschirmen sauber untereinander,
  alle Touch-Ziele sind mindestens 44 px groß, nichts hängt an Hover.
- **Visueller Editor** in drei Schritten (Becken / Geräte / Optik): erst ankreuzen, was das
  Gerät hat, dann erscheinen dessen Felder. YAML ist möglich, aber nie nötig.

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

### 1. Alles — Becken, Wärmepumpe, Poolpumpe, UV-Lampe, Solar, Einlaufdüse, Freifeld

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
  - type: inlet
    label: Einlaufdüse
    temp_entity: sensor.einlauf_temperatur
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
| `drain_top` / `drain_left` / `drain_size` | aus der Formen-Tabelle / `9` | Lage und Breite des Bodenablaufs |

Die Anker der Formen-Tabelle sind an den Bildern vermessen (siehe [Beckenformen](#beckenformen));
alle lassen sich pro Card überschreiben. Die drei `*_size`-Werte sind die **Breite in Prozent
der Beckenbreite** — im Editor steht dafür je ein Regler „Größe".

Skimmer und Einlaufdüse sind ab Werk **an**: so sieht ein Becken aus, das im Betrieb ist.
Wer nur das nackte Becken will, schaltet beide ab. Der Bodenablauf ist ab Werk **aus**, weil
ihn längst nicht jedes Becken hat.

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
| `inlet` | fertig | Einlaufdüse |

Alle Typen sind fertig — es gibt keinen reservierten Typ mehr. Ein unbekannter `type` (etwa
ein Tippfehler oder ein Typ aus einer neueren Version) rendert weiterhin als leerer Rahmen,
statt die Card scheitern zu lassen.

Im Editor stehen im Auswahlfeld zuerst die allgemeinen Slots (`custom`, `hidden`, `frame`),
danach trennt eine nicht wählbare Zeile „— Geräte —“ die Gerätetypen ab. Die Schlüssel selbst
sind davon unberührt — die Reihenfolge ist reine Anzeige.

### Slot `heatpump`

| Option | Standard | Beschreibung |
|---|---|---|
| `switch_entity` | – | Schalter für den Powerbutton. **Ausschalten fragt immer nach.** |
| `power_entity` | – | Leistungssensor in W oder kW |
| `target_entity` | – | Soll-Temperatur: `climate.*` oder `number.*` |
| `current_entity` | – | Ist-Temperatur: `climate.*` (`current_temperature`) oder `sensor.*` |
| `fan_entity` / `fan_source` | – / `auto` | Woher der Lüfter seinen Zustand nimmt: `auto`, `entity`, `power` |
| `fan_power_threshold` | `100` | Ab wie viel Watt der Lüfter als laufend gilt |
| `fan_speed` | `60` | Drehgeschwindigkeit `0`–`100` |
| `fan_inactive` | `gray` | Im Stillstand: `gray` oder `hidden` |
| `fan_top` / `fan_left` / `fan_size` / `fan_ratio` | `49.5` / `26` / `42` / `1.14` | Lage des Lüfterrads in % des Bildes |
| `label_text` | – | Freitext-Badge auf dem Bild |
| `show_power_button` / `show_power` / `show_current` / `show_target` / `show_fan` | `true` | Einzelne Elemente abwählen — abgewählt heißt: keine Felder im Editor und keine Schlüssel in der Config |
| Positionsfelder | – | `power_*`, `current_*`, `target_*`, `label_*`, `power_btn_*` — im Editor je Element per Schieberegler |

Mindestens **eine** der vier Entities sollte gesetzt sein; sonst zeigt der Kasten einen Hinweis.

### Slot `pump`

| Option | Standard | Beschreibung |
|---|---|---|
| `stage_entities` | – | Liste mit 1–3 Stufen, Reihenfolge = N1..N3 |
| `stop_entity` | – | STOP-Kanal (bei Impulstastern ein eigener Shelly-Ausgang) |
| `stage_mode` | `momentary` | `momentary` (Impulstaster) oder `latching` (Dauerrelais) |
| `stage_labels` | `[N1, N2, N3]` | Eigene Beschriftung der Taster |
| `main_entity` | – | Hauptschalter/Steckdose → Powerbutton **mit Rückfrage** |
| `power_entity` | – | Leistungssensor in W oder kW |
| `temp_entity` | – | Temperaturfühler → Thermometer auf dem Bild |
| `idle_watt` | `30` | Ruhewatt: unter diesem Verbrauch gilt die Pumpe als stehend (Laufrad grau) |
| `label` | – | Überschrift über dem Kasten |
| `fan_speed_1` / `fan_speed_2` / `fan_speed_3` | `3` / `5` / `8` | Tempo des Laufrads je Stufe auf der Skala **1–10** (links langsam, rechts schnell) |
| `fan_top` / `fan_left` / `fan_size` | `52` / `61` / `19` | Lage des Laufrads in % des Bildes — ab Werk mittig auf der Volute (dem Spiralgehäuse). Die Box ist immer quadratisch, das Rad bleibt kreisrund |
| `power_btn_top` / `power_btn_left` / `power_btn_scale` | `43` / `79` / `110` | Powerbutton — ab Werk auf dem Motor |
| `power_bottom` / `power_left` / `power_scale` / `power_box` / `power_label` | `9` / `26` / `98` / `true` / `true` | Watt-Box unten links |
| `temp_top` / `temp_left` / `temp_scale` | `10` / `36` / `119` | Thermometer oben am Ausgangsstutzen |
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
| `switch_entity` | – | Steckdose/Relais der Lampe → Powerbutton mit Rückfrage (`switch`, `input_boolean`, `light`) |
| `power_entity` | – | Leistung in W oder kW → Watt-Box |
| `temp_entity` | – | Temperaturfühler → Thermometer |
| `show_power_button` / `show_power` / `show_temp` / `show_glow` | `true` | Einzelne Elemente abschalten |
| `anschluss` | `seite` | Bildvariante: `seite` (Anschluss seitlich) oder `oben` |
| `rotate` | `0` | Bild drehen, 0–359° |
| `mirror` | `false` | Bild waagrecht spiegeln |
| `glow_top` / `glow_left` | `40` / `56` | Mitte des Glühbereichs in % |
| `glow_size` / `glow_thickness` | `40` / `13` | Länge und Dicke des Glühbereichs in % |
| `glow_angle` | `-15` | Neigung des Glühbereichs in ° (Neigung des Rohrs im Artwork) |
| `glow_intensity` | `80` | Leuchtstärke in % |
| `power_bottom` / `power_left` / `power_scale` / `power_box` / `power_label` | `9` / `76` / `100` / `true` / `true` | Watt-Box |
| `temp_top` / `temp_left` / `temp_scale` | `19` / `40` / `110` | Thermometer |
| `power_btn_top` / `power_btn_left` / `power_btn_scale` | `6` / `3` / `120` | Powerbutton |

```yaml
- type: uv
  label: UV-C-Lampe
  switch_entity: switch.uv_lampe
  power_entity: sensor.uv_lampe_power
  temp_entity: sensor.uv_lampe_temperatur
```

**Glühen:** steht `switch_entity` auf `on`, liegt ein weiches blau-violettes Licht über dem
Rohrkörper — **statisch, ohne Animation**. Bei `off`, unbekanntem Zustand oder fehlendem
Schalter bleibt das Bild ruhig. Ohne `switch_entity` gibt es kein Glühen.

**Drehen und Spiegeln:** gedreht wird das Bild **samt Glühen**; Thermometer, Watt-Box und
Powerbutton bleiben aufrecht und lesbar. Bei einer Drehung, die nicht 0° oder 180° ist, wird
der Kasten quadratisch und das Bild so weit verkleinert, dass nichts heraussteht — die
Overlays sitzen dann anders und wollen im Editor neu gesetzt werden.

> Eine UV-Lampe kann nichts regeln, darum hat der Slot bewusst weder Durchflussfeld noch
> Stufen. In den meisten Anlagen hängt sie ohnehin an einer Zeitschaltuhr parallel zur
> Poolpumpe.

### Slot `solar` — Solarheizung

Eine Solarheizung heizt nicht selbst, sie gibt nur den Weg über die Absorber frei. Alle
Entities sind optional; es reicht eine.

| Option | Standard | Beschreibung |
|---|---|---|
| `label` | – | Überschrift über dem Bild |
| `switch_entity` | – | Solarventil oder Solarpumpe → Powerbutton mit Rückfrage (`switch`, `input_boolean`, `light`) |
| `temp_in_entity` | – | Vorlauf (Wasser zum Absorber) → Thermometer am unteren Stutzen |
| `temp_out_entity` | – | Rücklauf (Wasser zurück ins Becken) → Thermometer am oberen Stutzen |
| `power_entity` | – | Leistung der Solarpumpe in W oder kW → Watt-Box |
| `show_power_button` / `show_temp_in` / `show_temp_out` / `show_power` | `true` | Einzelne Elemente abschalten |
| `power_btn_top` / `power_btn_left` / `power_btn_scale` | `8` / `4` / `110` | Powerbutton |
| `temp_in_top` / `temp_in_left` / `temp_in_scale` | `84` / `76` / `105` | Vorlauf-Thermometer |
| `temp_out_top` / `temp_out_left` / `temp_out_scale` | `17` / `76` / `105` | Rücklauf-Thermometer |
| `power_bottom` / `power_left` / `power_scale` / `power_box` / `power_label` | `6` / `30` / `100` / `true` / `true` | Watt-Box |

Welcher Stutzen welcher ist, sagt die Position: die Defaults sitzen an den beiden Rohrstutzen
rechts im Bild — unten Vorlauf, oben Rücklauf. Verschieben geht im Editor.

### Slot `inlet` — Einlaufdüse

Der schlankeste Slot der Sammlung: eine Einlaufdüse hat nichts zu schalten.

| Option | Standard | Beschreibung |
|---|---|---|
| `label` | – | Überschrift über dem Bild |
| `temp_entity` | – | Temperatur des einströmenden Wassers → Thermometer an der Düsenöffnung |
| `show_temp` | `true` | Thermometer abschalten |
| `temp_top` / `temp_left` / `temp_scale` | `50` / `28` / `115` | Thermometer |

Dieselbe Zeichnung sitzt zusätzlich als kleines Bild am Becken selbst (`hero.show_inlet`).

### Slot `custom` — Freifeld (benutzerdefiniert)

| Option | Standard | Beschreibung |
|---|---|---|
| `title` | – | Überschrift |
| `align` | `mitte` | `oben`, `mitte`, `unten` |
| `entries` | `[]` | Bis zu **drei** Einträge |

Jeder Eintrag:

| Feld | Beschreibung |
|---|---|
| `kind` | `entity` (Wert anzeigen), `button` (schaltet per `toggle`), `text` (Freitext) |
| `entity` | Entity für `entity` und `button` |
| `label` | Beschriftung; leer = Name der Entity |
| `icon` | Icon für `button`, im Editor über den HA-Icon-Picker, z.B. `mdi:lightbulb` |
| `text` | Inhalt für `kind: text` |

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

## Umstieg von der alten Heatpump-Card

Bestehende Karten laufen unverändert weiter — `custom:tomtut-pool-heatpump-card` gibt es
weiterhin, mit denselben Optionen. Sie rendert intern das Dashboard mit genau einem
Wärmepumpen-Kasten, ohne Becken und ohne Rahmen. Neu ist nur das Artwork.

```yaml
type: custom:tomtut-pool-heatpump-card
label_text: Pool-Wärmepumpe
target_entity: climate.pool_waermepumpe
current_entity: climate.pool_waermepumpe
power_entity: sensor.shelly_waermepumpe_power
switch_entity: switch.shelly_waermepumpe
```

Wer möchte, stellt später auf `custom:tomtut-pool-dashboard` mit einem `heatpump`-Slot um —
die Feldnamen sind dieselben. Ein Zwang dazu besteht nicht.

**Wichtig:** die alte Card kam aus einem eigenen Repository. Läuft beides parallel, gibt es
zwei Ressourcen mit demselben Card-Namen. Deinstalliere die alte *TomTuT Pool Heatpump Card*
in HACS, wenn du diese Sammlung nutzt.

---

## Update-Sicherheit

Die Konfiguration trägt `version: 1`. Neue Optionen kommen ausschließlich als **optionale
Felder mit Standardwert** dazu; bestehende Schlüssel werden nicht umbenannt und nicht
entfernt. Eine eingefrorene Beispiel-Config liegt als `test/fixtures/v1-config.yaml` im Repo
und muss in jeder künftigen Version identisch rendern — der Smoke-Test prüft genau das.

Wird ein reservierter Slot-Typ fertig, ersetzt sein Artwork den Platzhalter-Rahmen — die
Konfiguration bleibt dieselbe. Genau so kam in Iteration 4 die UV-Lampe zu einem `type: uv`
und in Iteration 5 die Solarheizung (`type: solar`) und die Einlaufdüse (`type: inlet`) zu
ihrem Bild; wer sie vorher schon eingetragen hatte, sieht sie jetzt einfach.

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
