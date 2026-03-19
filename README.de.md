<p align="center">
  <a href="README.tr.md"><img src="https://flagcdn.com/w40/tr.png" width="32" alt="Türkçe" /></a>&nbsp;&nbsp;&nbsp;
  <a href="README.md"><img src="https://flagcdn.com/w40/gb.png" width="32" alt="English" /></a>&nbsp;&nbsp;&nbsp;
  <a href="README.de.md"><img src="https://flagcdn.com/w40/de.png" width="32" alt="Deutsch" /></a>&nbsp;&nbsp;&nbsp;
  <a href="README.fr.md"><img src="https://flagcdn.com/w40/fr.png" width="32" alt="Français" /></a>&nbsp;&nbsp;&nbsp;
  <a href="README.es.md"><img src="https://flagcdn.com/w40/es.png" width="32" alt="Español" /></a>&nbsp;&nbsp;&nbsp;
  <a href="README.ru.md"><img src="https://flagcdn.com/w40/ru.png" width="32" alt="Русский" /></a>&nbsp;&nbsp;&nbsp;
  <a href="README.ar.md"><img src="https://flagcdn.com/w40/sa.png" width="32" alt="العربية" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/.NET-10.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" />
  <img src="https://img.shields.io/badge/C%23-14-239120?style=for-the-badge&logo=csharp&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-Cache-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Architecture-Clean%20%2B%20CQRS%20%2B%20DDD-blueviolet?style=for-the-badge" />
</p>

<h1 align="center">ECommerce Plattform</h1>

<p align="center">
  <b>Full-Stack, White-Label E-Commerce-Plattform</b><br/>
  <sub>.NET 10 API + React SPA | Modularer Monolith | Clean Architecture | CQRS | DDD</sub>
</p>

<p align="center">
  <a href="#-eigenschaften">Eigenschaften</a> &bull;
  <a href="#-architektur">Architektur</a> &bull;
  <a href="#-projektstruktur">Struktur</a> &bull;
  <a href="#-erste-schritte">Erste Schritte</a> &bull;
  <a href="#-api-referenz">API</a> &bull;
  <a href="#-sicherheit">Sicherheit</a> &bull;
  <a href="#-roadmap">Roadmap</a>
</p>

---

## ✨ Was diese Plattform besonders macht?

Dieses Projekt ist nicht nur eine weitere E-Commerce-Vorlage; es ist eine **vollständig anpassbare White-Label-Plattform**, die entwickelt wurde, um maximale UI/UX-Flexibilität direkt über das Admin-Panel zu bieten.

* **Vollständige Design-Kontrolle:** Administratoren können die visuelle Identität nahtlos ändern, ohne den Code zu berühren. Sie können sofort Logos austauschen, die globale Farbpalette aktualisieren und Schriftarten anpassen, um sie perfekt an jede Markenidentität anzugleichen.
* **Flexible Layouts:** Die Schaufenster-Menüs können frei neu angeordnet werden. Die Header- und Footer-Bereiche sind stark konfigurierbar, und Banners können je nach Wunsch zwischen scrollenden Laufschriften oder festen Blöcken umgeschaltet werden.
* **Schaufenster-Anpassung:** Die Startseite und das Schaufenster sind vollständig modular. Bereiche wie Hauptkategorien, Kundenbewertungen und Newsletter-Blöcke können dynamisch aktiviert, deaktiviert oder vollständig angepasst werden.
* **Umfassende Mehrsprachigkeit (7 Sprachen):** Jede einzelne oben genannte Design-Anpassung funktioniert zusammen mit allen Produkt- und Kategoriedaten dynamisch in 7 integrierten Sprachen. Wenn ein neues Produkt oder eine neue Kategorie hinzugefügt wird, können Administratoren mühelos Übersetzungen für jede dieser 7 Sprachen nativ über das Admin-Panel veröffentlichen und so ein nahtloses Einkaufserlebnis für ein globales Publikum gewährleisten.

---

## Eigenschaften

<table>
<tr>
<td width="50%">

### Schaufenster (React SPA)
- **Produktkatalog** &mdash; Suche, Kategoriefilter, Paginierung, Sortierung
- **Startseite** &mdash; Empfohlene Produkte, Autovervollständigung der Suche
- **Mehrsprachigkeit** &mdash; Dynamische Infrastruktur mit sprachspezifischer Suche; sprachunabhängige Architektur 
- **Warenkorb** &mdash; Dauerhafter Warenkorb (Gäste + Mitglieder) mit Preis-Snapshots, einheitenbasierte Mengen (kg, Stück, Liter)
- **Checkout** &mdash; Lieferadresse &rarr; Zahlung (2-Stufen-Prozess)
- **Bestellhistorie** &mdash; Statusverfolgung, Bestelldetailansicht
- **Wunschzettel / Favoriten** &mdash; Produkte für später speichern
- **Authentifizierung** &mdash; Login, Registrierung, Sitzungswiederherstellung, Weiterleitung nach Login
- **Sichere Zahlungen** &mdash; Tokenisiert, idempotent, es werden niemals Kartendaten gespeichert

</td>
<td width="50%">

### Admin-Panel
- **Dashboard** &mdash; Übersichtskarten, Umsatzdiagramm, letzte Bestellungen, Warnungen bei niedrigem Lagerbestand
- **Produktverwaltung** &mdash; CRUD, Bestandskontrolle, Soft-Delete & Wiederherstellung
- **Kategorieverwaltung** &mdash; CRUD, Eltern-Kind-Hierarchie, Soft-Delete & Wiederherstellung
- **Übersetzungseditor** &mdash; Tab-basierte Benutzeroberfläche zur sprachspezifischen Verwaltung von Produkt- und Kategorienamen
- **Bestellverwaltung** &mdash; Liste mit Statusfilter, Detailansicht, Statusübergänge mit Bestätigung
- **Benutzerverwaltung** &mdash; Kundenliste, Suche nach Name/E-Mail
- **Datenexport** &mdash; CSV/Excel-Export für Produkte, Kategorien, Bestellungen, Benutzer
- **Rollenbasierter Zugriff** &mdash; Alle Admin-Routen sind durch `[Authorize(Roles = "Admin")]` geschützt

</td>
</tr>
</table>

---

## Architektur

Modularer Monolith mit strenger Schichtentrennung nach Clean Architecture, CQRS über MediatR und Domain-Driven Design. Regeln für Schichtenabhängigkeiten werden zur Build-Zeit über `NetArchTest.Rules` erzwungen.

### Sprachunabhängiges Mehrsprachen-Design

Alle Anzeige-Namen von Produkten und Kategorien werden in speziellen Übersetzungstabellen (`ProductTranslations`, `CategoryTranslations`) gespeichert, aufgeschlüsselt nach `(EntityId, LanguageCode)`. Es gibt keine hartcodierte "Basis"-Sprache — jede unterstützte Sprache ist gleichwertig.

Der Wert `DefaultLanguage` in `appsettings.json` bestimmt, welche Sprache als Ausweichoption dient, wenn keine Übersetzung für die angeforderte Sprache existiert.

```
+--------------------------------------------------------------+
|                         API-Schicht                           |
|              Controllers | Middleware | DI                    |
+--------------------------------------------------------------+
|                              |                                |
|  +-----------------------+   +----------------------------+   |
|  |     Infrastruktur     |   |       Datenzugriff         |   |
|  |  -----------------    |   |  ----------------------     |   |
|  |  JWT Service          |   |  EF Core DbContext         |   |
|  |  Redis Cache          |   |  Fluent API Configs        |   |
|  |  Payment (Stub)       |   |  Aggregate Repositories    |   |
|  |  CurrentUserService   |   |  Soft-Delete Interceptor   |   |
|  +----------+------------+   +-------------+--------------+   |
|             |                              |                  |
|             v                              v                  |
|  +--------------------------------------------------------+  |
|  |                 Anwendungsschicht (App)                  |  |
|  |  Commmands & Queries (MediatR CQRS)                     |  |
|  |  Pipeline: Validation -> Logging -> Caching -> Handler  |  |
|  |  FluentValidation | Serilog | Redis                     |  |
|  |  KEINE EF Core Abhängigkeit                             |  |
|  +----------------------------+---------------------------+   |
|                               |                               |
|                               v                               |
|  +--------------------------------------------------------+  |
|  |                    Domänenschicht                        |  |
|  |  Entities & Aggregates | Value Objects (Money, Stock)    |  |
|  |  Repository Interfaces | Geschäftsregeln               |  |
|  |  NULL Infrastrukturabhängigkeiten                       |  |
|  +--------------------------------------------------------+  |
+--------------------------------------------------------------+

+--------------------------------------------------------------+
|                     Frontend (React SPA)                      |
|  Vite + TypeScript | TailwindCSS + shadcn/ui                 |
|  React Query (Server State) | Zustand (UI State)             |
|  Mock/Echte API Variante | Lazy loading | Geschützte Routen  |
+--------------------------------------------------------------+
```

---

## 🚀 Einrichtung & Ausführung

Wir bieten zwei einfache Möglichkeiten, dieses Projekt auszuführen. Wenn Sie lediglich die Benutzeroberfläche und die Designfunktionen überprüfen möchten, nutzen Sie den **Mock-Data**-Ansatz. Wenn Sie die gesamte Backend-Architektur testen möchten, wählen Sie die **Full-Stack**-Version.

### Option 1: Mock-Data (Am schnellsten) ⚡
Führt nur den Frontend aus (`VITE_USE_MOCK_API=true`). Kein Datenbank-Setup nötig.

```bash
git clone <repo-url>
cd ECommerce/src/ECommerce.Web
npm install
npm run dev
```

### Option 2: Full-Stack (Echte Datenbank & Redis) 🏗️
Vollständig funktionsfähige .NET API lokal ausführen.

```bash
# Docker DBs
docker run -d --name ecommerce-db -e POSTGRES_USER=postgresUser -e POSTGRES_PASSWORD=postgresPassword -e POSTGRES_DB=ECommerceDb -p 5432:5432 postgres:16-alpine
docker run -d --name ecommerce-redis -p 6379:6379 redis:7-alpine

# API ausführen
cd ECommerce
dotnet ef database update --project src/ECommerce.Persistence --startup-project src/ECommerce.API
dotnet run --project src/ECommerce.API

# Frontend ausführen (in einem anderen Terminal)
cd src/ECommerce.Web
# (Vergewissern Sie sich, dass VITE_USE_MOCK_API=false ist)
npm run dev
```

---

## Roadmap

- [x] Projekt-Grundgerüst & Clean Architecture
- [x] EF Core + PostgreSQL, CQRS (MediatR)
- [x] Umfassendes Mehrsprachigkeits-System & Übersetzungstabellen
- [x] React SPA & Admin-Dashboard UI vollendet
- [ ] **KI-gestützte Übersetzungs-API** — Automatische Übersetzungen für neue Produkte und Kategorien
- [ ] CI/CD-Pipeline via GitHub Actions & Docker-Orchestrierung

---

<p align="center">
  <sub>Erstellt mit .NET 10 &bull; React &bull; Clean Architecture &bull; CQRS &bull; DDD</sub>
</p>
