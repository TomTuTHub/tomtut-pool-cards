# TomTuT Pool Cards

[![HACS](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/TomTuTHub/tomtut-pool-cards)](https://github.com/TomTuTHub/tomtut-pool-cards/releases/latest)
[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2026.3.0%2B-blue)](https://www.home-assistant.io/)

Deine ganze Poolanlage in **einer** Karte für Home Assistant: Becken, Poolpumpe, Wärmepumpe,
UV-Lampe und Solar, handgezeichnet und live mit deinen eigenen Sensoren. Du stellst alles
per Klick ein, YAML brauchst du nicht.

<p align="center">
  <a href="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/alles-hell.webp"><img src="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/alles-hell.webp" width="600" alt="TomTuT Pool Dashboard: Becken, Wärmepumpe, Poolpumpe, UV-Lampe und Solar in einer Karte"></a>
</p>

## Was die Karte kann

Links hell, rechts dunkel. Klick aufs Bild für die große Ansicht.

<table>
<tr>
<td><a href="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/becken-hell.webp"><img src="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/becken-hell-klein.webp" width="280" alt="Becken hell"></a></td>
<td><a href="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/becken-dunkel.webp"><img src="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/becken-dunkel-klein.webp" width="280" alt="Becken dunkel"></a></td>
</tr>
<tr><td colspan="2"><b>Becken:</b> Wassertemperatur, pH, Redox und Zulauf direkt am Pool, Skimmer und Düsen nach Wunsch.</td></tr>
<tr>
<td colspan="2"><a href="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/formen-hell.webp"><img src="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/formen-hell-klein.webp" width="572" alt="Sechs Beckenformen"></a></td>
</tr>
<tr><td colspan="2"><b>Sechs Beckenformen:</b> Rechteck, Oval, Rund, Achtform, Nierenform und Freiform.</td></tr>
<tr>
<td><a href="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/poolpumpe-hell.webp"><img src="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/poolpumpe-hell-klein.webp" width="280" alt="Poolpumpe hell"></a></td>
<td><a href="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/poolpumpe-dunkel.webp"><img src="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/poolpumpe-dunkel-klein.webp" width="280" alt="Poolpumpe dunkel"></a></td>
</tr>
<tr><td colspan="2"><b>Poolpumpe:</b> Stufen N1 bis N3 und Stopp per Tipp, mit Strommessung erkennt die Karte die Stufe selbst.</td></tr>
<tr>
<td><a href="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/waermepumpe-hell.webp"><img src="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/waermepumpe-hell-klein.webp" width="280" alt="Wärmepumpe hell"></a></td>
<td><a href="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/waermepumpe-dunkel.webp"><img src="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/waermepumpe-dunkel-klein.webp" width="280" alt="Wärmepumpe dunkel"></a></td>
</tr>
<tr><td colspan="2"><b>Wärmepumpe:</b> Lüfter dreht im Takt, Soll-Temperatur mit + und −, Modus und Freigabe auf einen Blick.</td></tr>
<tr>
<td><a href="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/uv-hell.webp"><img src="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/uv-hell-klein.webp" width="280" alt="UV-Lampe hell"></a></td>
<td><a href="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/uv-dunkel.webp"><img src="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/uv-dunkel-klein.webp" width="280" alt="UV-Lampe dunkel"></a></td>
</tr>
<tr><td colspan="2"><b>UV-C-Lampe:</b> An/Aus, Watt und Temperatur, das Rohr leuchtet, solange sie läuft.</td></tr>
<tr>
<td><a href="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/solar-hell.webp"><img src="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/solar-hell-klein.webp" width="280" alt="Solar hell"></a></td>
<td><a href="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/solar-dunkel.webp"><img src="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/solar-dunkel-klein.webp" width="280" alt="Solar dunkel"></a></td>
</tr>
<tr><td colspan="2"><b>Solar:</b> Vorlauf und Rücklauf nebeneinander, so siehst du sofort, ob die Sonne heizt.</td></tr>
<tr>
<td><a href="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/schalter-hell.webp"><img src="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/schalter-hell-klein.webp" width="280" alt="Schalter-Liste hell"></a></td>
<td><a href="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/schalter-dunkel.webp"><img src="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/schalter-dunkel-klein.webp" width="280" alt="Schalter-Liste dunkel"></a></td>
</tr>
<tr><td colspan="2"><b>Schalter-Liste:</b> Poolroboter, Licht, Gegenstrom und Co., auf Wunsch mit Rückfrage vorm Ausschalten.</td></tr>
<tr>
<td><a href="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/mini-hell.webp"><img src="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/mini-hell-klein.webp" width="280" alt="Mini-Ansicht hell"></a></td>
<td><a href="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/mini-dunkel.webp"><img src="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/mini-dunkel-klein.webp" width="280" alt="Mini-Ansicht dunkel"></a></td>
</tr>
<tr><td colspan="2"><b>Mini-Ansicht:</b> Die ganze Anlage klein fürs Wand-Tablet, ein Tipp öffnet das Gerät in groß.</td></tr>
<tr>
<td><a href="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/editor-hell.webp"><img src="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/editor-hell-klein.webp" width="220" alt="Visueller Editor hell"></a></td>
<td><a href="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/editor-dunkel.webp"><img src="https://raw.githubusercontent.com/TomTuTHub/tomtut-pool-cards/main/docs/images/editor-dunkel-klein.webp" width="220" alt="Visueller Editor dunkel"></a></td>
</tr>
<tr><td colspan="2"><b>Visueller Editor:</b> Jedes Gerät ist ein Kasten: aufklappen, Sensor wählen, fertig. Was du nicht hast, lässt du weg.</td></tr>
</table>

## Installation in 3 Schritten

1. **HACS öffnen** → oben rechts **⋮** → **Benutzerdefinierte Repositories**.
   URL `https://github.com/TomTuTHub/tomtut-pool-cards` eintragen, Typ **Dashboard**, hinzufügen.
   Oder direkt per Klick:<br>
   [![In HACS öffnen](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=TomTuTHub&repository=tomtut-pool-cards&category=plugin)
2. **TomTuT Pool Cards** auswählen → **Herunterladen** → Browser neu laden.
   *Sobald die Card im HACS-Katalog steht, suchst du in HACS einfach nach „TomTuT“.*
3. **Dashboard bearbeiten** → **Karte hinzufügen** → **TomTuT Pool Dashboard**.
   Jetzt im visuellen Editor deine Sensoren und Schalter auswählen. Kein YAML nötig.

Du brauchst **Home Assistant 2026.3 oder neuer** und [HACS](https://hacs.xyz/). Eine eigene
Integration braucht die Karte nicht: Sie nimmt einfach die Entitäten, die du schon hast
(Shelly, Tuya, MQTT, Hersteller-Integration, egal).

<details>
<summary><b>Lieber YAML? Hier ein kurzes Beispiel</b></summary>

```yaml
type: custom:tomtut-pool-dashboard
version: 1
hero:
  shape: oval
  temp_entity: sensor.pool_wassertemperatur
  ph_entity: sensor.pool_ph
slots:
  - type: pump
    label: Poolpumpe
    main_entity: switch.poolpumpe
    power_entity: sensor.poolpumpe_power
  - type: heatpump
    label: Wärmepumpe
    switch_entity: switch.waermepumpe
    current_entity: climate.pool_waermepumpe
    target_entity: climate.pool_waermepumpe
```

</details>

**[Alle Optionen im Detail → docs/KONFIGURATION.md](docs/KONFIGURATION.md)**

## Sonstiges

- **Zeichnungen:** Alle Geräte-Bilder hat **Selina** von Hand gezeichnet. Danke!
- **Fehler gefunden oder eine Idee?** Ab damit in die [Issues](https://github.com/TomTuTHub/tomtut-pool-cards/issues).
- **Lizenz:** MIT, siehe [LICENSE](LICENSE).
- Mehr von mir auf [YouTube @TomTuT](https://www.youtube.com/@TomTuT) und [thomasbase.de](https://thomasbase.de).

Das war TomTuT, bleib hart am Gas.

---

**English:** A hand-drawn pool dashboard card for Home Assistant: pool, pump, heat pump, UV
lamp and solar heating in one card, live with your own sensors. Install via HACS (custom
repository, type *Dashboard*), then add the card **TomTuT Pool Dashboard** and set everything
up in the visual editor, no YAML needed. The interface is in German; all options are
documented in [docs/KONFIGURATION.md](docs/KONFIGURATION.md).
