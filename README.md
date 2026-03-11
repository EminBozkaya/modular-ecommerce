<p align="center">
  <img src="https://img.shields.io/badge/.NET-10.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" />
  <img src="https://img.shields.io/badge/C%23-14-239120?style=for-the-badge&logo=csharp&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-Cache-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Architecture-Clean%20%2B%20CQRS%20%2B%20DDD-blueviolet?style=for-the-badge" />
</p>

<h1 align="center">ECommerce Platform</h1>

<p align="center">
  <b>Full-stack, white-label e-commerce platform</b><br/>
  <sub>.NET 10 API + React SPA | Modular Monolith | Clean Architecture | CQRS | DDD</sub>
</p>

<p align="center">
  <a href="#-features">Features</a> &bull;
  <a href="#-architecture">Architecture</a> &bull;
  <a href="#-project-structure">Structure</a> &bull;
  <a href="#-getting-started">Getting Started</a> &bull;
  <a href="#-api-reference">API</a> &bull;
  <a href="#-security">Security</a> &bull;
  <a href="#-roadmap">Roadmap</a>
</p>

---

## Features

<table>
<tr>
<td width="50%">

### Storefront (React SPA)
- **Product catalog** &mdash; search, category filter, pagination, sorting
- **Homepage** &mdash; featured products, autocomplete search
- **Guest + member basket** &mdash; persistent cart with price snapshots, unit-aware quantities (kg, adet, litre)
- **Checkout flow** &mdash; shipping address &rarr; payment (2-step orchestration)
- **Order history** &mdash; status tracking, order detail view
- **Wishlist / Favorites** &mdash; save products for later
- **Auth** &mdash; login, register, session restore, redirect-after-login
- **Secure payments** &mdash; tokenized, idempotent, card data never stored

</td>
<td width="50%">

### Admin Panel
- **Dashboard** &mdash; summary cards, revenue chart, recent orders, low stock alerts
- **Product management** &mdash; CRUD, stock control, soft delete & restore
- **Category management** &mdash; CRUD, parent-child hierarchy, soft delete & restore
- **Order management** &mdash; list with status filter, detail view, status transitions with confirmation
- **User management** &mdash; customer list, search by name/email
- **Data export** &mdash; CSV/Excel export for products, categories, orders, users
- **Role-based access** &mdash; all admin routes gated by `[Authorize(Roles = "Admin")]`

</td>
</tr>
</table>

---

## Architecture

Modular Monolith with strict Clean Architecture layer separation, CQRS via MediatR, and Domain-Driven Design. Layer dependency rules are enforced at build time via `NetArchTest.Rules`.

```
+--------------------------------------------------------------+
|                         API Layer                             |
|              Controllers | Middleware | DI                    |
+--------------------------------------------------------------+
|                              |                                |
|  +-----------------------+   +----------------------------+   |
|  |    Infrastructure     |   |       Persistence          |   |
|  |  -----------------    |   |  ----------------------     |   |
|  |  JWT Service          |   |  EF Core DbContext         |   |
|  |  Redis Cache          |   |  Fluent API Configs        |   |
|  |  Payment (Stub)       |   |  Aggregate Repositories    |   |
|  |  CurrentUserService   |   |  Soft-Delete Interceptor   |   |
|  +----------+------------+   +-------------+--------------+   |
|             |                              |                  |
|             v                              v                  |
|  +--------------------------------------------------------+  |
|  |                  Application Layer                      |  |
|  |  Commands & Queries (MediatR CQRS)                      |  |
|  |  Pipeline: Validation -> Logging -> Caching -> Handler  |  |
|  |  FluentValidation | Serilog | Redis                     |  |
|  |  NO EF Core dependency                                  |  |
|  +----------------------------+---------------------------+   |
|                               |                               |
|                               v                               |
|  +--------------------------------------------------------+  |
|  |                    Domain Layer                          |  |
|  |  Entities & Aggregates | Value Objects (Money, Stock)    |  |
|  |  Repository Interfaces | Business Invariants            |  |
|  |  ZERO infrastructure dependencies                       |  |
|  +--------------------------------------------------------+  |
+--------------------------------------------------------------+

+--------------------------------------------------------------+
|                     Frontend (React SPA)                      |
|  Vite + TypeScript | TailwindCSS + shadcn/ui                 |
|  React Query (server state) | Zustand (UI state)             |
|  Mock/Real API toggle | Lazy loading | Protected routes      |
+--------------------------------------------------------------+
```

### Bounded Contexts

| Context | Domain Entities | Key Invariants |
|---------|-----------------|----------------|
| **Catalog** | Product, Category, Unit | Money immutable & non-negative, StockQuantity >= 0, category hierarchy |
| **Basket** | Basket, BasketItem | Price snapshot on add, guest (sessionId) + member (userId), decimal qty for weight-based |
| **Ordering** | Order, OrderItem | State machine (Pending &rarr; Paid &rarr; Processing &rarr; Shipped &rarr; Delivered / Cancelled) |
| **Payment** | PaymentRecord | Idempotency via unique (OrderId, IdempotencyKey) index |
| **Identity** | AppUser | PBKDF2 hashing, JWT via httpOnly cookie, refresh token rotation |
| **Wishlist** | WishlistItem | One entry per user + product pair |

---

## Project Structure

```
ECommerce/
+-- ECommerce.sln
+-- src/
|   +-- ECommerce.Domain/            <- Pure domain (zero dependencies)
|   |   +-- Common/                     BaseEntity, BaseAuditableEntity, ISpecification
|   |   +-- Catalog/                    Product, Category, Unit, Money, StockQuantity
|   |   +-- Basket/                     Basket, BasketItem (price snapshot)
|   |   +-- Ordering/                   Order, OrderItem, OrderStatus
|   |   +-- Payment/                    PaymentRecord, PaymentStatus
|   |   +-- Identity/                   AppUser, UserRole
|   |   +-- Wishlist/                   WishlistItem
|   |
|   +-- ECommerce.Application/       <- CQRS Commands & Queries (NO EF Core)
|   |   +-- Common/                     Behaviors (Validation, Logging, Caching), Interfaces
|   |   +-- Catalog/                    Product & Category CRUD, Stock, Units
|   |   +-- Basket/                     Add, Update, Remove, Clear, Get
|   |   +-- Ordering/                   CreateOrder, UpdateStatus, Delete/Restore
|   |   +-- Payment/                    ProcessPayment (idempotent)
|   |   +-- Identity/                   Register, Login, Refresh, Logout, GetCurrentUser
|   |   +-- Wishlist/                   Add, Remove, Get
|   |   +-- Admin/Queries/              Dashboard analytics
|   |
|   +-- ECommerce.Persistence/       <- EF Core + PostgreSQL
|   |   +-- Context/                    ApplicationDbContext (global query filters)
|   |   +-- Configurations/             8 entity configs (Fluent API)
|   |   +-- Interceptors/               AuditAndSoftDeleteInterceptor
|   |   +-- Repositories/               8 aggregate-specific repositories
|   |   +-- Migrations/                 7 migrations
|   |
|   +-- ECommerce.Infrastructure/    <- External concerns
|   |   +-- Identity/                   JwtService, CurrentUserService
|   |   +-- Payment/                    StubPaymentService
|   |   +-- Caching/                    RedisCacheService
|   |
|   +-- ECommerce.API/               <- Orchestrator (no business logic)
|       +-- Controllers/                Catalog, Basket, Order, Payment, Auth, Wishlist
|       +-- Controllers/Admin/          AdminController (role-gated CRUD + dashboard)
|       +-- Middlewares/                ExceptionHandlingMiddleware
|       +-- Extensions/                 DI registrations, cache helpers
|
+-- src/ECommerce.Web/               <- React SPA (Vite + TypeScript)
|   +-- src/
|       +-- api/                        Axios client (withCredentials) + error handling
|       +-- app/                        Router (React Router v6) + Providers
|       +-- components/                 Shared UI + Layouts (Main, Admin)
|       +-- features/
|       |   +-- catalog/                ProductListPage, ProductDetailPage, StorefrontHomePage
|       |   +-- auth/                   LoginPage, RegisterPage, session restore
|       |   +-- basket/                 BasketDrawer, BasketPage, optimistic updates
|       |   +-- ordering/               CheckoutPage, OrderHistory, OrderDetail, Confirmation
|       |   +-- admin/                  Dashboard, Products, Categories, Orders, Users (AG Grid)
|       |   +-- favorites/              FavoritesPage, wishlist management
|       +-- store/                      Zustand (authStore, basketUiStore, uiStore)
|       +-- utils/                      queryKeys, formatters, idempotency, unitConfig
|
+-- tests/
    +-- ECommerce.UnitTests/          <- Domain & handler tests (xUnit + FluentAssertions)
    +-- ECommerce.ArchitectureTests/  <- Layer dependency enforcement (NetArchTest)
    +-- ECommerce.IntegrationTests/   <- Placeholder
```

### Dependency Flow

```
Domain         <- (independent -- ZERO references)
Application    <- Domain
Persistence    <- Domain (only)
Infrastructure <- Domain, Application
API            <- Application, Persistence, Infrastructure
```

> Persistence depends only on Domain &mdash; not on Application. Repository interfaces live in Domain, implementations in Persistence.

---

## Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| [.NET SDK](https://dotnet.microsoft.com/download) | 10.0+ |
| [Node.js](https://nodejs.org/) | 18+ (for frontend) |
| [PostgreSQL](https://www.postgresql.org/) | 14+ |
| [Redis](https://redis.io/) | 6+ |
| [Docker](https://www.docker.com/) | Optional |

### Backend

```bash
# 1. Clone the repository
git clone <repo-url>
cd EbrarKuruyemis

# 2. Update connection string
#    src/ECommerce.API/appsettings.Development.json

# 3. Apply migrations
dotnet ef database update \
  --project src/ECommerce.Persistence \
  --startup-project src/ECommerce.API

# 4. Run the API
dotnet run --project src/ECommerce.API

# 5. Run tests
dotnet test ECommerce.sln

# Swagger UI: https://localhost:5001/swagger
```

### Frontend

```bash
cd src/ECommerce.Web

# 1. Install dependencies
npm install

# 2. Configure environment
#    .env.development.local:
#    VITE_API_BASE_URL=https://localhost:5001
#    VITE_USE_MOCK_API=true

# 3. Start dev server
npm run dev

# 4. Type check
npx tsc --noEmit

# 5. Production build
npm run build
```

> Set `VITE_USE_MOCK_API=true` to run the frontend with mock data (no backend required).
> Set `VITE_USE_MOCK_API=false` to connect to the real .NET API.

### Docker (PostgreSQL & Redis)

```bash
docker run -d \
  --name ecommerce-db \
  -e POSTGRES_USER=postgresUser \
  -e POSTGRES_PASSWORD=postgresPassword \
  -e POSTGRES_DB=ECommerceDb \
  -p 5432:5432 \
  postgres:16-alpine

docker run -d \
  --name ecommerce-redis \
  -p 6379:6379 \
  redis:7-alpine
```

---

## API Reference

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/catalog/products` | List products (search, filter, paginate, sort) |
| `GET` | `/api/catalog/products/{id}` | Product detail |
| `GET` | `/api/catalog/categories` | List categories |
| `GET` | `/api/catalog/units` | List measurement units |
| `GET` | `/api/basket` | View current basket |
| `POST` | `/api/basket/items` | Add item to basket |
| `PUT` | `/api/basket/items` | Update item quantity |
| `DELETE` | `/api/basket/items/{productId}` | Remove item |
| `DELETE` | `/api/basket` | Clear basket |
| `POST` | `/api/order` | Create order from basket |
| `POST` | `/api/payment` | Process payment |

### Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new account (sets httpOnly cookie) |
| `POST` | `/api/auth/login` | Login (sets httpOnly cookie) |
| `GET` | `/api/auth/me` | Get current user (session restore) |
| `POST` | `/api/auth/refresh` | Refresh token rotation |
| `POST` | `/api/auth/logout` | Clear auth cookies |

### Protected Endpoints `[Authorize]`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/order/{id}` | Get order detail |
| `GET` | `/api/order/my` | Current user's order history |
| `GET` | `/api/wishlist` | Get wishlist |
| `GET` | `/api/wishlist/product-ids` | Get wishlisted product IDs |
| `POST` | `/api/wishlist/{productId}` | Add to wishlist |
| `DELETE` | `/api/wishlist/{productId}` | Remove from wishlist |
| `DELETE` | `/api/wishlist` | Clear wishlist |

### Admin Endpoints `[Authorize(Roles = "Admin")]`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/products` | Create product |
| `PUT` | `/api/admin/products` | Update product |
| `DELETE` | `/api/admin/products/{id}` | Soft delete product |
| `POST` | `/api/admin/products/restore/{id}` | Restore product |
| `PUT` | `/api/admin/products/stock` | Update stock |
| `POST` | `/api/admin/categories` | Create category |
| `PUT` | `/api/admin/categories` | Update category |
| `DELETE` | `/api/admin/categories/{id}` | Soft delete category |
| `POST` | `/api/admin/categories/restore/{id}` | Restore category |
| `GET` | `/api/admin/users` | List customers |
| `GET` | `/api/admin/orders` | List all orders (paged) |
| `GET` | `/api/admin/orders/{id}` | Order detail |
| `PUT` | `/api/admin/orders/{id}/status` | Update order status |
| `DELETE` | `/api/admin/orders/{id}` | Soft delete order |
| `POST` | `/api/admin/orders/restore/{id}` | Restore order |
| `GET` | `/api/admin/dashboard/summary` | Dashboard summary cards |
| `GET` | `/api/admin/dashboard/revenue` | Revenue analytics |
| `GET` | `/api/admin/dashboard/recent-orders` | Recent orders |
| `GET` | `/api/admin/dashboard/low-stock` | Low stock alerts |

---

## Security

| Feature | Implementation |
|---------|----------------|
| Authentication | JWT via **httpOnly secure cookies** (not localStorage) |
| Token Rotation | Refresh tokens with **mandatory rotation** on every use |
| Token Lifetime | 15-minute access tokens, zero clock skew |
| Password Hashing | PBKDF2 with SHA-256 (100K iterations) |
| Payment Safety | **Tokenized only** &mdash; no card data stored anywhere |
| Payment Idempotency | Unique `(OrderId, IdempotencyKey)` index prevents duplicate charges |
| Rate Limiting | 100 req/min per IP (FixedWindowLimiter) |
| CORS | Strict **whitelist** policy with credentials |
| Soft Delete | Data **never** physically deleted |
| Frontend Guards | UX-only &mdash; backend **always** authoritative |
| Admin Access | `[Authorize(Roles = "Admin")]` on all admin endpoints |

---

## Tech Stack

<table>
<tr><th colspan="4">Backend</th><th colspan="4">Frontend</th></tr>
<tr>
<td align="center"><b>Runtime</b></td>
<td align="center"><b>ORM</b></td>
<td align="center"><b>Database</b></td>
<td align="center"><b>Caching</b></td>
<td align="center"><b>Framework</b></td>
<td align="center"><b>State</b></td>
<td align="center"><b>UI</b></td>
<td align="center"><b>Build</b></td>
</tr>
<tr>
<td align="center">.NET 10 / C# 14</td>
<td align="center">EF Core 10</td>
<td align="center">PostgreSQL 16</td>
<td align="center">Redis</td>
<td align="center">React 19</td>
<td align="center">React Query + Zustand</td>
<td align="center">TailwindCSS + shadcn/ui</td>
<td align="center">Vite</td>
</tr>
<tr>
<td align="center"><b>CQRS</b></td>
<td align="center"><b>Validation</b></td>
<td align="center"><b>Logging</b></td>
<td align="center"><b>Testing</b></td>
<td align="center"><b>Routing</b></td>
<td align="center"><b>HTTP</b></td>
<td align="center"><b>Tables</b></td>
<td align="center"><b>Charts</b></td>
</tr>
<tr>
<td align="center">MediatR</td>
<td align="center">FluentValidation</td>
<td align="center">Serilog</td>
<td align="center">xUnit + FluentAssertions</td>
<td align="center">React Router v6</td>
<td align="center">Axios</td>
<td align="center">AG Grid</td>
<td align="center">Recharts</td>
</tr>
</table>

---

## Roadmap

### Completed

- [x] Solution architecture & project scaffold (Modular Monolith + Clean Architecture)
- [x] Domain models with DDD (entities, value objects, aggregates, specifications)
- [x] EF Core + PostgreSQL (Code First, Fluent API, soft-delete interceptor)
- [x] CQRS with MediatR (commands, queries, pipeline behaviors)
- [x] JWT authentication (httpOnly cookies, refresh token rotation)
- [x] Aggregate-specific repositories (no generic IRepository)
- [x] Basket with price snapshots & guest/member support
- [x] Payment idempotency (IdempotencyKey + unique index)
- [x] Redis caching layer (MediatR pipeline behavior)
- [x] Structured logging (Serilog)
- [x] Global exception handling middleware
- [x] Rate limiting & CORS
- [x] Unit tests (domain invariants + handler tests)
- [x] Architecture tests (NetArchTest layer enforcement)
- [x] React SPA (Vite + TypeScript strict mode)
- [x] Product catalog (listing, detail, search, category filter, pagination)
- [x] Auth flow (login, register, session restore, route guards)
- [x] Shopping basket (drawer + full page, optimistic updates, unit-aware quantities)
- [x] Checkout & ordering (2-step flow, order history, status tracking)
- [x] Wishlist / favorites
- [x] Admin dashboard (summary, revenue chart, recent orders, low stock)
- [x] Admin product & category management (CRUD, hierarchy, soft delete/restore)
- [x] Admin order management (status transitions, detail view)
- [x] Admin user management (customer list, search)
- [x] Mock/real API toggle (zero-code switch via env var)

### Upcoming

- [ ] Real payment provider integration (Iyzico / Stripe)
- [ ] Email confirmation flow
- [ ] Integration tests
- [ ] Docker Compose for full-stack local development
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Azure Container Apps deployment
- [ ] Azure Key Vault for secrets management

---

<p align="center">
  <sub>Built with .NET 10 &bull; React &bull; Clean Architecture &bull; CQRS &bull; DDD</sub>
</p>
