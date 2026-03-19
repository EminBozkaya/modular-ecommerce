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

<h1 align="center">Plateforme E-Commerce</h1>

<p align="center">
  <b>Plateforme e-commerce full-stack personnalisable</b><br/>
  <sub>.NET 10 API + React SPA | Monolithe Modulaire | Clean Architecture | CQRS | DDD</sub>
</p>

<p align="center">
  <a href="#-fonctionnalités">Fonctionnalités</a> &bull;
  <a href="#-architecture">Architecture</a> &bull;
  <a href="#-configuration">Configuration</a> &bull;
  <a href="#-feuille-de-route">Feuille de route</a>
</p>

---

## ✨ Qu'est-ce qui distingue cette plateforme ?

Ce projet n'est pas un simple modèle e-commerce. C'est une **plateforme en marque blanche** conçue pour offrir une flexibilité UI/UX maximale directement depuis le panneau d'administration.

* **Contrôle complet du design:** Les administrateurs peuvent modifier l'identité visuelle de manière transparente sans toucher au code (logos, couleurs mondiales, polices, etc.).
* **Mise en page flexible:** Les menus, l'en-tête, le pied de page et les bannières sont entièrement configurables.
* **Personnalisation de la vitrine:** Les sections comme les catégories principales, les avis clients et la newsletter peuvent être activées ou personnalisées individuellement.
* **Support multilingue approfondi (7 Langues):** Toutes ces personnalisations, ainsi que les données des produits et des catégories, fonctionnent dynamiquement à travers 7 langues intégrées pour atteindre une audience mondiale.

---

## Fonctionnalités Principales

### Vitrine (React SPA)
- **Catalogue produits** &mdash; recherche, filtre, pagination, tri
- **Multilingue** &mdash; infrastructure dynamique et recherche spécifique par langue
- **Panier** &mdash; snapshot des prix, support des membres/invités
- **Paiements sécurisés** &mdash; données protégées et idempotent (sans doublon de paiement)

### Panneau d'Administration
- **Tableau de bord** &mdash; données financières, niveaux de stock
- **Traduction** &mdash; Éditeur par onglets pour gérer les noms des produits/catégories par langue
- **Accès sécurisé** &mdash; routes réservées par rôles.

---

## Architecture

Monolithe modulaire avec une stricte séparation des couches via Clean Architecture, CQRS avec MediatR, et Domain-Driven Design (DDD). La configuration des langues ne dépend pas d'une langue "par défaut" fixée dans le code.

```
Domain         <- (Indépendant -- AUCUNE référence externe)
Application    <- Domain
Persistence    <- Domain
Infrastructure <- Domain, Application
API            <- Application, Persistence, Infrastructure
```

---

## 🚀 Comment l'exécuter

### Option 1 : Option "Bouchonné" (Mock Data) ⚡
Ne fait tourner que l'interface Frontend sans configurer de base de données.
```bash
git clone <repo-url>
cd ECommerce/src/ECommerce.Web
npm install
npm run dev
# (Assurez-vous que VITE_USE_MOCK_API=true est activé dans .env.development.local)
```

### Option 2 : Option Full-Stack 🏗️
Docker pour les bases de données (Redis + Postgres), puis lancer le projet .NET via API, et ensuite le frontend.

```bash
# Démarrer l'infrastructure
docker run -d --name ecommerce-db -e POSTGRES_USER=postgresUser -e POSTGRES_PASSWORD=postgresPassword -e POSTGRES_DB=ECommerceDb -p 5432:5432 postgres:16-alpine
docker run -d --name ecommerce-redis -p 6379:6379 redis:7-alpine

# Lancer le backend
cd ECommerce
dotnet ef database update --project src/ECommerce.Persistence --startup-project src/ECommerce.API
dotnet run --project src/ECommerce.API

# Lancer le frontend (VITE_USE_MOCK_API=false)
cd src/ECommerce.Web
npm run dev
```

---

<p align="center">
  <sub>Construit avec .NET 10 &bull; React &bull; Clean Architecture &bull; CQRS &bull; DDD</sub>
</p>
