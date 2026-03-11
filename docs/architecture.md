# Architecture Reference

## Dependency Flow
```
Domain         ← zero dependencies
Application    ← Domain
Persistence    ← Domain only (NOT Application)
Infrastructure ← Domain, Application
API            ← Application, Persistence, Infrastructure
```

## Project Structure
```
ECommerce/
├── src/
│   ├── ECommerce.Domain/          # Entities, value objects, repository interfaces, enums
│   ├── ECommerce.Application/     # CQRS commands/queries, handlers, validators, DTOs, pipeline behaviors
│   ├── ECommerce.Persistence/     # EF Core DbContext, configurations, repositories, migrations, interceptors
│   ├── ECommerce.Infrastructure/  # JWT, Redis cache, payment stub, current user service
│   └── ECommerce.API/             # Controllers, middleware, Program.cs (DI + pipeline)
│
├── src/ECommerce.Web/             # React SPA (Vite + TypeScript)
│   └── src/
│       ├── api/                   # Axios client (withCredentials) + error handling
│       ├── app/                   # Router (React Router v6) + Providers (QueryClient + AuthInitializer)
│       ├── components/            # Shared UI (LoadingSpinner, ErrorMessage, EmptyState, QuantitySelector) + Layouts
│       ├── features/              # catalog | basket | auth | ordering | admin | favorites
│       ├── hooks/                 # Global hooks (useDebounce)
│       ├── store/                 # Zustand stores (authStore, basketUiStore, uiStore)
│       ├── types/                 # Global TS types (ApiResponse, PaginatedResult)
│       └── utils/                 # queryKeys, formatters, idempotency, unitConfig, priceCalculator
│
└── tests/
    ├── ECommerce.UnitTests/       # Domain + Application handler tests (xUnit + FluentAssertions)
    ├── ECommerce.ArchitectureTests/ # NetArchTest layer dependency enforcement
    └── ECommerce.IntegrationTests/  # Placeholder
```

## Bounded Contexts & Responsibilities

| Context   | Domain Entities              | Value Objects          | Key Invariants |
|-----------|------------------------------|------------------------|----------------|
| Catalog   | Product, Category, Unit      | Money, StockQuantity   | StockQuantity >= 0, Money immutable + non-negative, category hierarchy (parent-child) |
| Basket    | Basket, BasketItem           | Money (snapshot)       | Price snapshot on add, guest (sessionId) + member (userId) support, decimal quantity for weight-based |
| Ordering  | Order, OrderItem             | Money (lineTotal)      | State machine (Pending→Paid→Processing→Shipped→Delivered / Cancelled), stock decrease on create |
| Payment   | PaymentRecord                | Money (amount)         | Idempotency: unique (OrderId, IdempotencyKey), status: Pending→Succeeded/Failed/Refunded |
| Identity  | AppUser                      | —                      | PBKDF2 hashing, JWT via httpOnly cookie, refresh token rotation, UserRole: Customer/Admin |
| Wishlist  | WishlistItem                 | —                      | One entry per user+product pair |

## CQRS Pipeline (MediatR)

```
Controller → _mediator.Send(command/query)
    → ValidationBehavior (FluentValidation — commands only)
    → LoggingBehavior (Serilog structured logging)
    → CachingBehavior (Redis — ICacheableQuery queries only)
    → Handler (business logic)
    → Repository (data access)
```

### Caching Strategy
- `ICacheableQuery` interface: CacheKey + Expiration
- Product listing: 5-minute cache
- Units: 24-hour cache
- Cache invalidation: prefix-based removal on mutations (`catalog:*`)
- Redis via `StackExchange.Redis`

## Frontend Feature → Backend Endpoint Mapping

### Catalog (public)
| Frontend Feature       | Method | Endpoint                    | Notes |
|------------------------|--------|-----------------------------|-------|
| Product listing        | GET    | /api/catalog/products       | search, minPrice, maxPrice, categoryId, page, pageSize, sortBy, descending |
| Product detail         | GET    | /api/catalog/products/{id}  | |
| Category listing       | GET    | /api/catalog/categories     | |
| Unit listing           | GET    | /api/catalog/units          | |

### Auth
| Frontend Feature       | Method | Endpoint                    | Notes |
|------------------------|--------|-----------------------------|-------|
| Register               | POST   | /api/auth/register          | Sets httpOnly cookie |
| Login                  | POST   | /api/auth/login             | Sets httpOnly cookie |
| Session restore        | GET    | /api/auth/me                | Returns AuthUser or 401 |
| Token refresh          | POST   | /api/auth/refresh           | Rotates refresh token |
| Logout                 | POST   | /api/auth/logout            | Clears cookie, [Authorize] |

### Basket
| Frontend Feature       | Method | Endpoint                          | Notes |
|------------------------|--------|-----------------------------------|-------|
| Get basket             | GET    | /api/basket                       | Guest or member |
| Add item               | POST   | /api/basket/items                 | Price snapshot captured |
| Update quantity        | PUT    | /api/basket/items                 | |
| Remove item            | DELETE | /api/basket/items/{productId}     | |
| Clear basket           | DELETE | /api/basket                       | |

### Ordering (protected)
| Frontend Feature       | Method | Endpoint                    | Notes |
|------------------------|--------|-----------------------------|-------|
| Create order           | POST   | /api/order                  | Basket → order, stock decrease |
| Get order              | GET    | /api/order/{id}             | |
| My orders              | GET    | /api/order/my               | [Authorize] |

### Payment
| Frontend Feature       | Method | Endpoint                    | Notes |
|------------------------|--------|-----------------------------|-------|
| Process payment        | POST   | /api/payment                | Stub — real provider TBD |

### Wishlist (protected)
| Frontend Feature       | Method | Endpoint                          | Notes |
|------------------------|--------|-----------------------------------|-------|
| Get wishlist           | GET    | /api/wishlist                     | |
| Get product IDs        | GET    | /api/wishlist/product-ids         | Quick check for heart icons |
| Add to wishlist        | POST   | /api/wishlist/{productId}         | |
| Remove from wishlist   | DELETE | /api/wishlist/{productId}         | |
| Clear wishlist         | DELETE | /api/wishlist                     | |

### Admin [Authorize(Roles = "Admin")]
| Frontend Feature       | Method | Endpoint                                | Notes |
|------------------------|--------|-----------------------------------------|-------|
| Create product         | POST   | /api/admin/products                     | |
| Update product         | PUT    | /api/admin/products                     | |
| Delete product         | DELETE | /api/admin/products/{id}                | Soft delete |
| Restore product        | POST   | /api/admin/products/restore/{id}        | |
| Update stock           | PUT    | /api/admin/products/stock               | |
| Create category        | POST   | /api/admin/categories                   | |
| Update category        | PUT    | /api/admin/categories                   | |
| Delete category        | DELETE | /api/admin/categories/{id}              | Soft delete |
| Restore category       | POST   | /api/admin/categories/restore/{id}      | |
| List users             | GET    | /api/admin/users                        | Role="Customer" only |
| List orders            | GET    | /api/admin/orders                       | Paged |
| Get order detail       | GET    | /api/admin/orders/{id}                  | |
| Update order status    | PUT    | /api/admin/orders/{id}/status           | State machine transitions |
| Delete order           | DELETE | /api/admin/orders/{id}                  | Soft delete |
| Restore order          | POST   | /api/admin/orders/restore/{id}          | |
| Dashboard summary      | GET    | /api/admin/dashboard/summary            | |
| Revenue data           | GET    | /api/admin/dashboard/revenue            | Period-based |
| Recent orders          | GET    | /api/admin/dashboard/recent-orders      | |
| Low stock products     | GET    | /api/admin/dashboard/low-stock          | |

## Frontend State Management

| Concern        | Tool          | Location                 | Rule |
|----------------|---------------|--------------------------|------|
| Server state   | React Query   | Feature hooks            | Single source of truth, explicit cache invalidation |
| Auth state     | Zustand       | `store/authStore.ts`     | Only: user, isAuthenticated, isAuthLoading — NO tokens |
| Basket UI      | Zustand       | `store/basketUiStore.ts` | Drawer open/close, lastAddedProductId |
| Global UI      | Zustand       | `store/uiStore.ts`       | Sidebar toggle |

## Database (PostgreSQL 16)

### Migrations (chronological)
1. `InitialCreate` — Full schema: Products, Categories, Baskets, Orders, Payments, Users
2. `CategoryIsActive` — IsActive flag on Category
3. `CategoryHierarchy` — Parent-child self-referencing relationship
4. `AddFilteredProductIndex` — DB indices for product queries
5. `AddUnitEntity` — Unit entity (kg, adet, litre, etc.)
6. `AddWishlistItems` — WishlistItem entity
7. `BasketItem_Quantity_Decimal` — BasketItem.Quantity as decimal (weight-based products)

### Key Conventions
- Soft delete mandatory (AuditAndSoftDeleteInterceptor)
- Global query filters: `IsDeleted == false` on all auditable entities
- Fluent API configuration only (no data annotations)
- Owned types for value objects (Money, StockQuantity)

## White-Label Deployment Model
- Single codebase → multiple Azure deployments
- Each deployment: different domain, branding, product catalog
- Branding config: per-deployment environment variables (future: tenant config layer)
- Admin panel: same domain under `/admin` prefix — no separate domain needed

## Security Summary
- JWT in httpOnly secure cookies (not localStorage)
- Access token: 15 minutes, refresh token rotation on every use
- Rate limiting: 100 req/min per IP (FixedWindowLimiter)
- CORS: whitelist policy (configurable origins, credentials allowed)
- Admin endpoints: [Authorize(Roles = "Admin")] on all routes
- Payment: tokenized only, no card data stored, idempotency enforced
- Frontend route guards: UX-only (backend always authoritative)
