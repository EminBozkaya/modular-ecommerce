<div align="center">
  <table>
    <tr>
      <td align="center" width="100"><a href="README.tr.md"><img src="https://flagcdn.com/w40/tr.png" height="18" alt="TR" /><br/><b>TR</b><br/>Türkçe</a></td>
      <td align="center" width="100"><a href="README.md"><img src="https://flagcdn.com/w40/gb.png" height="18" alt="EN" /><br/><b>EN</b><br/>English</a></td>
      <td align="center" width="100"><a href="README.de.md"><img src="https://flagcdn.com/w40/de.png" height="18" alt="DE" /><br/><b>DE</b><br/>Deutsch</a></td>
      <td align="center" width="100" bgcolor="#e5e7eb"><b><a href="README.fr.md"><img src="https://flagcdn.com/w40/fr.png" height="18" alt="FR" /><br/>FR<br/>Français 🟢</a></b></td>
      <td align="center" width="100"><a href="README.es.md"><img src="https://flagcdn.com/w40/es.png" height="18" alt="ES" /><br/><b>ES</b><br/>Español</a></td>
      <td align="center" width="100"><a href="README.ru.md"><img src="https://flagcdn.com/w40/ru.png" height="18" alt="RU" /><br/><b>RU</b><br/>Русский</a></td>
      <td align="center" width="100"><a href="README.ar.md"><img src="https://flagcdn.com/w40/sa.png" height="18" alt="AR" /><br/><b>AR</b><br/>العربية</a></td>
    </tr>
  </table>
</div>

<br/>

> "Ce projet a été initié dans le but de mettre en pratique mon expérience concrète de la Clean Architecture et du Domain-Driven Design, tout en accélérant au maximum le processus de développement grâce aux assistants de codage modernes basés sur l'IA d'aujourd'hui.
>
> La fondation de ce processus de développement repose sur le répertoire `.agent`, que j'ai structuré spécifiquement pour fonctionner en totale intégration avec l'éditeur **Anti-Gravity**. En définissant des fichiers personnalisés `Rules` (Règles), `Workflows` (Flux de travail) et `Skills` (Compétences) sous ce répertoire, le squelette architectural du projet et les instructions de l'assistant ont été sécurisés. En nous appuyant sur ces bases solides et guidés par des modèles de langage avancés tels que **Claude**, nous continuerons à construire et à développer les éléments centraux du projet de manière hautement modulaire, sans erreur et évolutive.
>
> À la lumière des avancées technologiques rapides, j'espère sincèrement que ce projet servira de guide et d'inspiration pour d'autres développeurs qui commencent tout juste à intégrer des outils et des assistants basés sur l'IA dans leurs processus de développement logiciel, ou qui souhaitent simplement se perfectionner dans ce domaine en pleine évolution."

<br/>

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
  <b>Plateforme e-commerce full-stack en marque blanche</b><br/>
  <sub>.NET 10 API + React SPA | Monolithe Modulaire | Clean Architecture | CQRS | DDD</sub>
</p>

<p align="center">
  <a href="#-fonctionnalités">Fonctionnalités</a> &bull;
  <a href="#-architecture">Architecture</a> &bull;
  <a href="#-structure-du-projet">Structure</a> &bull;
  <a href="#-comment-installer-et-exécuter">Installation</a> &bull;
  <a href="#-référence-api">API</a> &bull;
  <a href="#-sécurité">Sécurité</a> &bull;
  <a href="#-feuille-de-route">Feuille de Route</a>
</p>

---

## ✨ Ce qui distingue cette plateforme ?

Ce projet n'est pas un simple modèle e-commerce. C'est une **plateforme en marque blanche, entièrement personnalisable**, conçue pour offrir une flexibilité UI/UX maximale directement depuis le panneau d'administration.

* **Contrôle complet du design:** Les administrateurs peuvent modifier l'identité visuelle de manière transparente sans toucher au code. Vous pouvez instantanément échanger les logos, mettre à jour la palette de couleurs globale et ajuster les polices de texte pour vous aligner parfaitement avec l'identité de n'importe quelle marque.
* **Mises en page flexibles:** Les menus de la vitrine peuvent être librement réorganisés. L'en-tête (Header) et le pied de page (Footer) sont hautement configurables, et les bannières promotionnelles peuvent basculer entre des chapiteaux défilants ou des blocs statiques fixes selon vos préférences.
* **Personnalisation de la vitrine:** La page d'accueil et la vitrine sont entièrement modulaires. Des sections telles que les catégories principales, les avis clients et les blocs de newsletter peuvent être activées, désactivées ou entièrement personnalisées.
* **Support multilingue approfondi (7 Langues):** Chaque personnalisation de conception mentionnée ci-dessus, ainsi que toutes les données de produits et de catégories, fonctionne dynamiquement sur 7 langues intégrées. Lorsqu'un nouveau produit ou une nouvelle catégorie est ajouté, les administrateurs peuvent facilement publier les traductions pour l'une de ces 7 langues de manière native depuis le panneau de gestion, assurant ainsi une expérience d'achat fluide pour un public mondial.

---

## Fonctionnalités

<table>
<tr>
<td width="50%">

### Vitrine (React SPA)
- **Catalogue produits** &mdash; recherche, filtre de catégorie, pagination, tri
- **Page d'accueil** &mdash; produits phares, recherche par saisie automatique
- **Multilingue (Multi-language)** &mdash; TR / EN / DE etc. avec recherche spécifique à la langue ; architecture agnostique aux langues (chaque déploiement peut configurer sa langue par défaut)
- **Panier visiteur + membre** &mdash; panier persistant avec instantané des prix (price snapshots), quantités adaptées aux unités (kg, pièce, litre)
- **Processus de paiement (Checkout flow)** &mdash; adresse de livraison &rarr; paiement (orchestration en 2 étapes)
- **Historique des commandes** &mdash; suivi du statut, vue détaillée de la commande
- **Liste de souhaits / Favoris** &mdash; enregistrer les produits pour plus tard
- **Authentification** &mdash; connexion, inscription, restauration de session, redirection post-connexion
- **Paiements sécurisés** &mdash; tokenisés, idem-potents, aucune donnée de carte n'est physiquement enregistrée sur le serveur

</td>
<td width="50%">

### Panneau d'Administration
- **Tableau de bord (Dashboard)** &mdash; cartes de résumé, graphique de revenus, commandes récentes, alertes de stock faible
- **Gestion des produits** &mdash; CRUD (créer, lire, mettre à jour, supprimer), contrôle des stocks, suppression logique (soft-delete) & restauration
- **Gestion des catégories** &mdash; CRUD, hiérarchie parent-enfant, suppression logique & restauration
- **Éditeur de traduction** &mdash; Interface utilisateur par onglets afin de gérer les noms de produits et catégories selon les langues (FR, EN, DE, etc.)
- **Gestion des commandes** &mdash; liste avec option de filtre de statut, vue détaillée, transitions de statut avec confirmation
- **Gestion des utilisateurs** &mdash; liste des clients, outil de recherche via nom / e-mail
- **Exportation de données** &mdash; export CSV/Excel vers produits, catégories, commandes, utilisateurs
- **Accès basé sur les rôles** &mdash; toutes restrictions sur les routes d'administration validées par le module `[Authorize(Roles = "Admin")]`

</td>
</tr>
</table>

---

## Architecture

"Monolithe modulaire" avec une séparation stricte des couches selon la Clean Architecture (Architecture Propre), CQRS propulsé via MediatR, et la logique Domain-Driven Design (DDD - Conception Pilotée par le Domaine). Les dépendances inter-couches sont validées à la compilation au moyen de l'outil `NetArchTest.Rules`.

### Conception Multilingue Agnostique

Les appellations (affichages) de l'ensemble des produits et catégories ne résident pas avec leurs bases d'objets, mais sont logées dans un tableau propre et scindé pour la traduction (`ProductTranslations`, `CategoryTranslations`), et indexées selon la clé composée `(EntityId, LanguageCode)`. Aucune langue précise n'est forgée en tant que "racine" du code — chaque langage officiellement autorisé demeure pair face aux autres.

Au sein du document `appsettings.json`, c'est la métadonnée `DefaultLanguage` qui définira systématiquement la "langue de secours", au cas où aucune version adéquate n'aie préalablement été spécifiée pour une recherche multilingue. Un serveur hébergé situé en France indiquera le par-défaut `DefaultLanguage: "fr"`, suite à quoi les administrateurs introduiront les articles primordialement en français. Les transcriptions anglophones voire arabiques s'invitent par la suite commodément à travers de l'éditeur de traduction de la plateforme de gestion.

Le fruit de cette conceptualisation technique amène l'opportunité de formuler la plateforme en une proposition native "Marque-Blanche" (White Label), capable d'opérer mondialement sans encourir à une unique modification du cœur de code originel de l'app.

```text
+--------------------------------------------------------------+
|                         Couche API                            |
|              Controllers | Middleware | DI                    |
+--------------------------------------------------------------+
|                              |                                |
|  +-----------------------+   +----------------------------+   |
|  |     Infrastructure    |   |         Persistance        |   |
|  |  -----------------    |   |  ----------------------     |   |
|  |  Service JWT          |   |  EF Core DbContext         |   |
|  |  Cache Redis          |   |  Configurations Fluent API |   |
|  |  Paiement (Stub)      |   |  Entrepôts d'Agrégats      |   |
|  |  CurrentUserService   |   |  Soft-Delete Interceptor   |   |
|  +----------+------------+   +-------------+--------------+   |
|             |                              |                  |
|             v                              v                  |
|  +--------------------------------------------------------+  |
|  |                 Couche Application (App)                 |  |
|  |  Commandes & Requêtes (MediatR CQRS)                    |  |
|  |  Pipeline : Validation -> Logging -> Caching -> Handler |  |
|  |  FluentValidation | Serilog | Redis                     |  |
|  |  ZERO DE CÂBLAGE EF CORE                                |  |
|  +----------------------------+---------------------------+   |
|                               |                               |
|                               v                               |
|  +--------------------------------------------------------+  |
|  |                    Couche Domaine                        |  |
|  |  Entités & Agrégats    | Objets Qualitatifs (Monnaie)    |  |
|  |  Interfaces d'Entrepôt | Invariabilités Commerciales     |  |
|  |  SANS DÉPENDANCES LÉGIFIÉES EXTERNES                     |  |
|  +--------------------------------------------------------+  |
+--------------------------------------------------------------+

+--------------------------------------------------------------+
|                     Interface (React SPA)                    |
|  Vite + TypeScript | TailwindCSS + shadcn/ui                 |
|  React Query (état serveur) | Zustand (état visuel UI)       |
|  Mock/Vraie Base Active | Chargement à la volée | Routes priv.|
+--------------------------------------------------------------+
```

### Contextes Limités (Bounded Contexts)

| Contexte | Entités liées au Domaine | Invariabilités Critiques |
|---------|-----------------|----------------|
| **Catalogue** | Produit, Catégorie, Mesure | L'objet "Argent (Money)" est impénétrable & >0. StockQuantity >= 0. |
| **Paniers** | Panier(Basket), Article de Panier | Le prix facturé est encapsulé lors du check out. Visiteurs(sessionId) & Membre(userID). Quantité chiffrée décimale autorisée (Kg/Gr) |
| **Commandes** | Ordonnance(Order), Article de Com. | État régis (En-Suspend &rarr; Soldée &rarr; Processus en route &rarr; Naviguée &rarr; Livrée / Anéantie) |
| **Paiements** | Registre du Paiement | Bloquage strict des double-règlements (Idempotence) au titre de cléf d'index `(OrderId, IdempotencyKey)` |
| **Identités** | AppUser | Cryptions PBKDF2 sur hashage, JWT soutenu par "httpOnly cookie", actualité du renouvellement de sésame (refresh token) |
| **Souhaits** | Option Favorite | Association restrictive une seule entité conjointe au nom exclusif du visiteur/produit |

---

## Structure du Projet

```text
ECommerce/
+-- ECommerce.sln
+-- src/
|   +-- ECommerce.Domain/            <- Domaine Pur (Ne porte aucune contrainte logicielle adjointe)
|   |   +-- Common/                     BaseEntity, BaseAuditableEntity, ISpecification
|   |   +-- Catalog/                    Product, Category, Unit, Money, StockQuantity
|   |   +-- Basket/                     Basket, BasketItem (Capture d'historique Prix)
|   |   +-- Ordering/                   Order, OrderItem, OrderStatus
|   |   +-- Payment/                    PaymentRecord, PaymentStatus
|   |   +-- Identity/                   AppUser, UserRole
|   |   +-- Wishlist/                   WishlistItem
|   |
|   +-- ECommerce.Application/       <- Commandes EQRS sans accroche structurelle à EF-Core
|   |   +-- Common/                     Behaviors (Opérandes en chaînes : Vérification, Caching)
|   |   +-- Catalog/                    Enrobage de Produits / Catégorie Systématiques (Unité & Réserves)
|   |   +-- Basket/                     Manipulation totale du panier de visite
|   |   +-- Ordering/                   Finalisations postales d'agencements
|   |   +-- Payment/                    Calcul & Sécurisation Immuables
|   |   +-- Identity/                   Identification logicielle & Routage Connectif
|   |   +-- Wishlist/                   Outils pour l'attente du client
|   |   +-- Admin/Queries/              Lectures visuelles et Statistiques des chiffres internes
|   |
|   +-- ECommerce.Persistence/       <- Le pilier PostgreSQL aux fondements logiques EF-Core
|   |   +-- Context/                    ApplicationDbContext (Englobe un Filtrage global constant)
|   |   +-- Configurations/             Ordonnances par l'interface verbale "Fluent API" (x8 tables)
|   |   +-- Interceptors/               Audit & Gardiens des disparitions passives (SoftDelete)
|   |   +-- Repositories/               8 Centres d'Entrepôt de l'agrégation
|   |   +-- Migrations/                 Traductions des schémas base de données (x7 Migrations)
|   |
|   +-- ECommerce.Infrastructure/    <- Prérogatives Secondaires Logicielles
|   |   +-- Identity/                   JwtService, CurrentUserService
|   |   +-- Payment/                    Service factice remplaçant Iyzico ou Stripe (Stub)
|   |   +-- Caching/                    Service d'Enregistrement Rapide de Redis
|   |
|   +-- ECommerce.API/               <- Orchestrateur Général Centralisant L'Action
|       +-- Controllers/                Katalog, Basket, Order, Payment, Auth, Wishlist
|       +-- Controllers/Admin/          AdminController (Limité exclusivement aux cadres Dirigeants-ROLES)
|       +-- Middlewares/                Agent central pour capturer l'hérésie des "Exceptions" ou crashes.
|       +-- Extensions/                 Centrale du DI via Service Collection
|
+-- src/ECommerce.Web/               <- Interface Web en Architecture React (via environnement Vite & Typage)
|   +-- src/
|       +-- api/                        Réalisateur d'appel d'état par le modèle Axios
|       +-- app/                        Arbre de redirection sécurisé de pages
|       +-- components/                 Widgets UI, et Panneaux globaux.
|       +-- features/                   Étagation hiérarchique : Commandes, Profil, Boutiques, Admis.
|       +-- store/                      Référentiels du Cache local (Zustand & RQ)
|       +-- utils/                      Conversions typographiques, formates
|
+-- tests/                           <- Terres De Contrôle Systématique
```

### Le Cycle De Dépandance

```text
Domaine (Domain) <- (Libre -- NÉANT absolu d'attaches ou parenté conceptuelle)
App-Logiciel     <- Domaine (Domain)
Persistance      <- Domaine (strictement Domain uniquement)
Infrastucture    <- Domaine, App-Logiciel
APIs Opération   <- App-Logiciel, Persistance, Infrastucture
```

> Persistance (La logique gérante EF Core et Tableaux PostgreSQL) n'est point subordonnée au couche Logicielle (Application Layer). Toute configuration Repository trouve naissance dans le corps du Domaine (Domaine/Interfaces) tout en trouvant sa charpente pratique d'existence une fois ancrées à La Persistance. Induisant une Inversion De Contrôle Optimisée.

---

## 🚀 Comment Installer et Exécuter

Nous proposons deux façons simples d'exécuter ce projet. Si vous souhaitez simplement examiner l'interface utilisateur, les fonctionnalités de conception et le flux front-end (idéal pour un portefolio illustratif en un temps record), utilisez l'approche **Données Fictives (Mock)**. Si vous avez l'intention d'éprouver l'entièreté de l'architecture "Full Backend", utilisez la version **Pile Complète (Full Stack)**.

### Prérequis Indispensables

| Le Logiciel | Niveau Requis | Raison |
|------|---------|-------------|
| [Node.js](https://nodejs.org/) | 18+ | Strictement exigé à fin opératoire Frontend / Mock Data |
| [.NET SDK](https://dotnet.microsoft.com/download) | 10.0+ | Vital face à l'invocation structurelle d'API en Full Stack |
| [Docker](https://www.docker.com/) | Actualisé | Recommandé fortement lors du lancement local SQL et Cache |

---

### Option 1 : Démarrer Sous Condition Liminale ("Mock Data") ⚡
Ce mode exploite **exclusivement l'Interface React SPA (Frontend)**. L'univers "Backend" demeure statiquement émulé sur la machine locale. Cette manœuvre certifie une exploration et vision directe des conceptions frontales d'étalagiste, telles le remplissage partiel, sélections sur panier, langues interactives des 7 zones, sans jamais se lier aux affres d'une base de données non établie.

```bash
# 1. Copier le contenu repositoire ciblant par nature le Frontend
git clone <repo-url>
cd ECommerce/src/ECommerce.Web

# 2. Implanter les noeuds d'interlocution (Packages / Modules)
npm install

# 3. Contrôler si votre fondement d'actions (.env) assume formellement d'engager le Mocking
# Ouvrez et ciblez .env.development.local en constatant l'exact :
# VITE_USE_MOCK_API=true

# 4. Inonder le tunnel local aux desseins de compilation
npm run dev
```

*Clap de fin!* Naviguer vers le lien diffusé promptement par Vite afin de prospecter un carrefour E-commerce visuellement affranchi et opérable.

---

### Option 2 : Lancement Du Système Integral (Base SQL / Redis en dur) 🏗️
Mode intégral convoquant localement la plénitude du Framework serveur .NET de version 10. Y rattacher des noyaux dynamiques PostgreSQL ainsi qu'une force de cache (Redis DB), afin de confronter l'étendue React frontal (qui pointera derechef à cette architecture).

#### Étape A : Actionner "L'Infrastructure" (Container Docker)
Soulever au premier ordre un "PostgreSQL" ainsi que la résonance "Redis"  depuis une requête Docker :
```bash
# Intégralité du réacteur PostgreSQL
docker run -d --name ecommerce-db -e POSTGRES_USER=postgresUser -e POSTGRES_PASSWORD=postgresPassword -e POSTGRES_DB=ECommerceDb -p 5432:5432 postgres:16-alpine

# Accélération du porteur Redis DB
docker run -d --name ecommerce-redis -p 6379:6379 redis:7-alpine
```

#### Étape B : Souffler La Braise Du .NET Central "API"
```bash
# Convoquer depuis un terminal neutre un déplacement global sur plateforme initiale.
cd ECommerce

# Bâtissez le schéma organique PostgreSQL aux ententes de L'Entity Framework
dotnet ef database update --project src/ECommerce.Persistence --startup-project src/ECommerce.API

# Amorcer le feu sur point d'ancrage "Backend"
dotnet run --project src/ECommerce.API
```
*Votre API opérante vient par ce biais propager sa vision. Les protocoles swagger sont explorables via `https://localhost:5001/swagger`*

#### Étape C : Synchroniser le Front
Soutirer l'activation au travers d'un commandement secondaire Terminalis :
```bash
cd ECommerce/src/ECommerce.Web

# Assigner npm à sa suite logique au besoin
npm install

# Contraindre expressément la direction environnementale sur fondations du dur.
# Via .env.development.local, imposez l'absolu formel de :
# VITE_USE_MOCK_API=false
# VITE_API_BASE_URL=https://localhost:5001

# Lancer la foudre
npm run dev
```

*🎉 Joie. Votre édifice "Monolithe Modulaire" traverse depuis tous terminaux un cycle de production de bout-en-bout accompli!*

---

## Référence API

### Points Publics

| Verbe | Adressage (Endpoint) | Précisions et Rôle |
|--------|----------|-------------|
| `GET` | `/api/catalog/products` | Récapitulatif Total du Magasin (Incluant la force paginate, filter) |
| `GET` | `/api/catalog/products/{id}` | Visée chirurgicale pour un produit distinct |
| `GET` | `/api/catalog/categories` | Vue sur sections primaires et enfants |
| `GET` | `/api/catalog/units` | Table d'appuis de grandeurs métriques ou logiques (Poids/Nombres) |
| `GET` | `/api/basket` | Inspection panier direct |
| `POST` | `/api/basket/items` | Adjonction marchandise de vente dans le cadre enclos |
| `PUT` | `/api/basket/items` | Majoration/Dévaluation quantitative de marchandise |
| `DELETE` | `/api/basket/items/{productId}` | Rejet formel du contenu indiqué |
| `DELETE` | `/api/basket` | Extinction et balayage radical du panier actuel |
| `POST` | `/api/order` | Engrenage effectif actant un Panier (Basket) devenant une requise (Order) |
| `POST` | `/api/payment` | Enclenchement de la monétisation |

### Points Restreints d'Auth (Identité Membres)

| Verbe | Adressage (Endpoint) | Précisions et Rôle |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Formation comptable naissante (Crée un HttpOnly Cookie en sceau de validation) |
| `POST` | `/api/auth/login` | Attestation légale (Crée également un sceau cookie limitrophe) |
| `GET` | `/api/auth/me` | Rappel des spécificités identitaires ("Get current User", permet le sessionnement) |
| `POST` | `/api/auth/refresh` | Action de redressement de validité au temps imparti de session token (Refresh/Rotate Token Act) |
| `POST` | `/api/auth/logout` | Annihilation décisive de validités de cookies certifiants |

### Points Sous Couvertures Protégées (Sécurisation Client) `[Authorize]`

| Verbe | Adressage (Endpoint) | Précisions et Rôle |
|--------|----------|-------------|
| `GET` | `/api/order/{id}` | Extirpation claire sur donnée de vente singulière |
| `GET` | `/api/order/my` | Rétrospection de l'usager dans sa propre ligne temporelle d'acquisition |
| `GET` | `/api/wishlist` | Le regard sur ses aspirations sauvegardées d'achats |
| `GET` | `/api/wishlist/product-ids` | Une chaîne condensée d'Id orientée économie d'appel, idéale vers UI "Redirection" de boutons virtuels |
| `POST` | `/api/wishlist/{productId}` | Marque l'empreinte de la faveur |
| `DELETE` | `/api/wishlist/{productId}` | Rétracte la tendresse vouée à l'objet mentionné |
| `DELETE` | `/api/wishlist` | Table Rase purificatrice de la liste dite. |

### L'Échelon Administratif Des Points Dirigeants `[Authorize(Roles = "Admin")]`

| Verbe | Adressage (Endpoint) | Précisions et Rôle |
|--------|----------|-------------|
| `POST` | `/api/admin/products` | Forgeron D'entité product |
| `PUT` | `/api/admin/products` | Amendements sur Entité |
| `DELETE` | `/api/admin/products/{id}` | Masquage temporaire sur Entité (Soft Delete/Écroulement Logique) |
| `POST` | `/api/admin/products/restore/{id}` | Levée du masquage de Discrétion (Exhumation des entités passées au Soft Delete) |
| `PUT` | `/api/admin/products/stock` | Réflexion logistique simple afin de pallier aux flux physiques des hangars |
| `POST` | `/api/admin/categories` | Troncation génitrice d'Arborescence Mère |
| `PUT` | `/api/admin/categories` | Changements nomminaux ou d'embranchements |
| `DELETE` | `/api/admin/categories/{id}` | Déclaration d'inapplicabilité logique (Soft Delete Category) |
| `POST` | `/api/admin/categories/restore/{id}` | Survie inespérée d'une hiéarchie effacée |
| `GET` | `/api/admin/users` | Observatoire listé, scrutateur des clients abonnés de plateforme |
| `GET` | `/api/admin/orders` | Visionnage tentaculaire de toute réquisition commerciale en base. Pagination assujetie. |
| `GET` | `/api/admin/orders/{id}` | Plongement sur spécificité exacte d'une ordre (Nom / Acheteur/ Adresse livraison) |
| `PUT` | `/api/admin/orders/{id}/status` | Validation par Admin d'un cursus de livraison (Shipping Progress Tracker status effect) |
| `DELETE` | `/api/admin/orders/{id}` | Effacement sans casse matérielle (Logique de purge Order) |
| `POST` | `/api/admin/orders/restore/{id}` | Résurection de réquisition commerciale effacée par un agent en administration des flux. |
| `GET` | `/api/admin/dashboard/summary` | Triptyques chiffrés propulsés dans l'index du tableau des bords Administra. |
| `GET` | `/api/admin/dashboard/revenue` | Algorythmes purement informatifs aux rentabilités de capitaux |
| `GET` | `/api/admin/dashboard/recent-orders` | Les Derniers exploits de caisse réalisés et constatés |
| `GET` | `/api/admin/dashboard/low-stock` | Clochette D'alarme ou Radar des denrées et objets tendant prochement vers leur fin dans les locaux physiques (Stock limit Alerting) |

---

## Sécurité

| Mécanisme | Intégration / Procédé (Implementation) |
|---------|----------------|
| Authenticité d'Utilisateur | Validateur JWT orchestré intégral par sceau **httpOnly secure cookie** (Proscription formelle de dépôt de données via LocalStorage sensible) |
| Rotation Séraphique De Token | Invalidation de sceau au bout termier, et régénération inopinée (Forcée rotation de sécurité permanente) |
| Temporisation De Vie du Jeton | Permissive fixée à 15 minutes, l'horlogerie ne souffrant aucune intercession (Zero Clock Skew Validation). |
| Brouillage de mots de passes | Forteresse de chiffrage reposante sur "PBKDF2" accouplée par chaîne d'entrelacs 100K ("SHA-256 Iterations") |
| Maintient Financière de Paie | **Exclusive manipulation sur jeton tierce**. L'architecturale bloque tout enregistrement de carte (Credit Card) en ses lignes propres. |
| Résilience Aux Tocs "Paiement" | Protection Index exclusive par agrégat lié `(OrderId, IdempotencyKey)`. Bloque structurel tout clic de transaction par stress/désarroi des clients. |
| Freinage de la Charge (Rate Limite) | Filtrages limitant toute machine IP du vaste internet d'aborder plus que 100 Req (Requêtes) vers Backend/Mn (Rôle des FixeedWindow). |
| Partages CORS Limites | Encloturage politique strict autorisant d'Unique Listes Blanches (Whitelist) alliables pour le transport de session "Identificatrice / Cookies Credentials". |
| Infaillibilité Mnémonique (Delete) | Par postulat absolu ; Les datas en bases (Database) de notre environnement ne font qu'expirer (Soft Delete mode de masquage absolu) - L'effacement véritable **N'arrive Jamais (Data non Physiquement Deleted)**. |
| Clartés de Bouclier Frontal | Le SPA dresse barrières aux clients non-admis. Il s'agit d'une façade pure de "Expérience", La justice absolue, **référant continuellement aux validations de Base de Backend**. L'Autorité revient toujours au Backend de .NET. |
| Cordon Rouge "Management" | Par nature et architecture formelle, n'importe quels "Routes (Endpoint)" administratives, se trouvent protégées par sceau magistral  `[Authorize(Roles = "Admin")]`|

---

## Modèle de Technologie (Stack)

<table>
<tr><th colspan="4">Face Arrière Sombre (Technicité Backend)</th><th colspan="4">Face Visuelle De Présentoir (Frontend SPA)</th></tr>
<tr>
<td align="center"><b>Cœur Moteur</b></td>
<td align="center"><b>Translateur Physique (ORM)</b></td>
<td align="center"><b>Bibliothèque Donnée</b></td>
<td align="center"><b>Réserves Momentanées</b></td>
<td align="center"><b>Canevas d'Environnement</b></td>
<td align="center"><b>Contrôle d'État Vivace</b></td>
<td align="center"><b>Composant d'Harmonies / Peintres</b></td>
<td align="center"><b>L'Architecteur/Fondateur au Build</b></td>
</tr>
<tr>
<td align="center">.NET 10 / C# 14</td>
<td align="center">EF Framework "Core 10"</td>
<td align="center">Modèle PostgreSQL 16</td>
<td align="center">Redis Mnémonique</td>
<td align="center">React JS - 19</td>
<td align="center">Query React + Concept Zustand</td>
<td align="center">Tailwind.CSS & Shadcn / Modulateurs / ui</td>
<td align="center">Vite Construct.</td>
</tr>
<tr>
<td align="center"><b>Agencement Stratégique</b></td>
<td align="center"><b>Filtrage Préemptif Qualitatif</b></td>
<td align="center"><b>Enregistreur Journalier</b></td>
<td align="center"><b>L'Éléctrode De Véracité (Les Tests)</b></td>
<td align="center"><b>Traceur Aux Lignes Privées/Communes</b></td>
<td align="center"><b>Transporteur Requital Extramuros</b></td>
<td align="center"><b>Classeurs / Présentoirs</b></td>
<td align="center"><b>Cartographie Des Fluctuations (Charts)</b></td>
</tr>
<tr>
<td align="center">Modulations (CQRS via MediatR)</td>
<td align="center">Fluent-Valid.</td>
<td align="center">Systéme Log (Serilog)</td>
<td align="center">Le Module de Validation xUnit & Fluid-Assertions (FluentAssertions)</td>
<td align="center">Directives (React Router En Série v6)</td>
<td align="center">Interlocuteur Axios Client</td>
<td align="center">La Matrice / Lignes de Cellules AG Grid</td>
<td align="center">Concepteur Visu Graph (Recharts)</td>
</tr>
</table>

---

## Feuille de Route Du Projet (Roadmap)

### Phases Accomplies

- [x] Confection de L'Arbre Racine L'app Modulaire / Architecture Propre (Clean Architecture).
- [x] L'Etablissement Des Rôles Dans L'Espace via Normes de Domain Driven Design (Conformité entitaire sur valeur, Agrégat distinctes etc.)
- [x] Élever l'ensemble PostgreSQL & Code First, compléxifié par L'Audit-SoftDelete (Défenseur Temporel).
- [x] CQRS Orchestrés à la symphonie par l'Engine "MediaR" (La magie des pipes, vérificateurs d'actions par Commands).
- [x] Fortifications Auth - via Déploiment JWT (Cookie "Seuls Visibles en HTTP", & Renouvellements Automatiques De Sûreté)
- [x] Un Réseau Repository Distinct pour Agrégats propres (Réfutation conceptuelle de Repository-Unique Totalitaire).
- [x] Un Carrefour Panière Résistant En Temps & Espace - "Prise d'Arrêt" Fixation Constante au tarif D'Achat, Accueille au Mieux Invités/Loggés Clients Mêlés.
- [x] Neutralisation Du Bégayage Facturier (Payment Indulgence de Rebondement à cause de la Cléf Exclusive et Son Index Idempotent).
- [x] Couches Interdépendantes De Gardes Momentanées - L'Implémentation Redis de cache via Pipeline MediaR d'efficacités redoutables.
- [x] Appareillages Loggings d'Historiques (En Structure Serilog) aux Finesse Indiscutable .
- [x] Filtrage Interceptif aux Désagréments Inopinées - (Global Middleware sur Erreur Exceptionnelle / Extinction de Bougies Applicatives).
- [x] Barrage De Résistance (Rate limit IP Control par Fenêtres d'Appui Régulier) & Assiègements Légalistes du Code à la CORS Frontière.
- [x] Banc d'Épreuve : Validations Multi-Scalaire. (Aisance Handler-Tests & Norme d'Invariabilité sur les Piliers de nos "Domains").
- [x] Les Rôles Arbitrant ("Layer Dependency Guards" en l'Armure de NetArchTest. Règles et Défenses Fixes).
- [x] Bâtiment Frontend érigé sous l'ère Vite, encré solidement aux règles stricts en typographie Typo-Screptial ("TypeScript Strict Native").
- [x] Magasins de Listes de Produits Visibles. (Système Multi-Rôles / Paginage Dynamisé & Outils Filtrants).
- [x] Fleuves Cérébraux De Passations Visiteurs (Authentification Logue "Log/Reg"/ Retour sur Scène de Sessions Antérieurs "Auto-Retrieve")..
- [x] Merveilles Techniques Liées Au Panier de L'Usager : Dispositif D'attente (Le Tiroir Visuel & Les Tableaux Majestueux "Full-Page"). Systèmes unitaires en fraction d'intégrité (Poids et Unité, Kg..L. Gr.)
- [x] Flot d'Engagement Concrétisés En Deux Mouvements (CheckOut par "Adressage d'Embarquement de colis" / Vers Action Terminale De Finance "Paiement") + Panneaux De Suivies Statut-Visuelles (Order Follow-up Views).
- [x] Listes Dédiées aux Rêves Lointins D'achats : Section Globale Faveurs Clientèles (Wishlists). 
- [x] Un Haut-Bureau pour Maires Analytiques — (Dashboad Administratifs avec Revenus chiffrants, Baisse critique des Matériaux "Low Stock").
- [x] La Forge des Marchands : Gestions d'Ajouts Innombrables d'Item Commercial ou Famille Entière de Groupes (Product & Categorizations Management Boards by Soft-Delete Toggling).
- [x] Administration Absolu En Trésorerie Du Sort Du "Colis" / Commandement : Validations Statut Entées via Demande de Validations d'Agents de Gérance.
- [x] Oeil De L'Olympe / Carnets Clientèle: (Admin Endpoints For Global Users Browsings By Mail / Nominatif Keys).
- [x] Switch de Dimension : Possibilité pure et immédiate De basculer depuis Les Réels Champs SQL aux Virtualités Mock (Mock By "Vite-Toggle").
- [x] Électro-Aimant Mondial De Communication: Multilangues (Tr-En-De), via Accept Header Language / Avec Indexations Dédiées de Langages Exclusifs Au Cache Central.
- [x] Refontes Majeures en Ingéniere - Le Projet, Jadis Hybride aux Normes "Turques Par-Défaut", Mute avec succès aux Architectures Tables De Traductions Globales ("Agnostiques"). La voie ouverte pour des Installations Blanches Mondialement Vierge de Code Culturel Originaire.
- [x] Mappage Multi-Dialecte par le Trône (Tabulaté) du Chef d'Exploitation : Permet Une Gestion Simplifiée Aux Terminologies Et Traductions Plurielle depuis le Coeur du Control-Admin Panel ("Translation UI").

### Ouvrages De Forge Actuels (En Processus Actif)

- [ ] **L'Oracle Algorithmique Aux Traductions** — L'Intégration et Déploiement De L'API d'Intelligence Artificielle "Traductive En Temps Réels". Lorsqu'une pièce de Marché Inédite Nait En Base... 7 Langues s'Automatisent via ce Penseur (AI Provider Engine Translator).

### Les Voies Futures Attendues Du Projet

- [ ] La Branche Sur Prestations Monétaires Autenthiques - Validateurs Stripe, ou bien Iyzico "Réels" et palpables au sein du système.
- [ ] Confidentiels Couriers Confirmatoires / Flux Des E-Mails Authen. - Email Confirmation Service.
- [ ] Une Armées De "Bot Validateurs En Lignes Croisées" - Créations Assidues pour l'Opus "Testes D'Intelligence Intégrativités" (Int-Tests / Modules Entiers).
- [ ] Confinements Virtuels Sur L'Intégral Base Locale - Container-Orchestrat / Full-Stack Dockerisation Compose Complete En Run Direct Aux Environnments D'Ingénieurs. 
- [ ] Usine Aux Multi-Fabrications  Pipeline — Azure DevoPs Pipelines / Github Action (CI - Constante Incorporation / CD - Constante Délivrance des Solutions Live)
- [ ] Flottement Serveur Des "Nuages Actifs Célestes "  ("Deploy Azure / Azure-App" Formations et Fixation Sur Host Global.)
- [ ] Gardiens de Clefs du Roy - Incorporation Systémique des Protections Secret d'Etat sur Base "Azure Key Vaults Architecture". 

---

<p align="center">
  <sub>L'Élévation de cet édifice s'est tenue par usages conjugués : .NET 10 &bull; React &bull; Clean Architecture &bull; CQRS &bull; Et L'Approche Dominée Au Domaine (DDD)</sub>
</p>
