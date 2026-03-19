# ECommerce Platform — Project Context

## Overview
Full-stack, white-label e-commerce platform. Single codebase, multiple deployments (one per business domain). Currently development phase — all core features implemented, CI/CD and real payment provider pending.

- Backend: .NET 10, C# 14, ASP.NET Core, EF Core 10, PostgreSQL 16, Redis, MediatR, FluentValidation, Serilog
- Frontend: React 19, TypeScript (strict mode), Vite, TailwindCSS, shadcn/ui, React Query v5, Zustand v4, Axios, AG Grid, Recharts, React Router v6
- Architecture: Modular Monolith + Clean Architecture + CQRS + DDD
- Testing: xUnit, FluentAssertions, NSubstitute, NetArchTest.Rules

---

## Repository Structure

```
ECommerce/
├── src/
│   ├── ECommerce.Domain/            # Pure domain — ZERO dependencies
│   ├── ECommerce.Application/       # CQRS via MediatR — NO EF Core
│   ├── ECommerce.Persistence/       # EF Core + PostgreSQL
│   ├── ECommerce.Infrastructure/    # JWT, Redis, Payment stub, CurrentUser
│   └── ECommerce.API/               # Controllers + Middleware + DI
│
├── src/ECommerce.Web/               # React SPA
│   └── src/
│       ├── api/                     # Axios client (withCredentials) + error handling
│       ├── app/                     # Router + Providers (QueryClient + AuthInitializer)
│       ├── components/              # Shared (LoadingSpinner, ErrorMessage, EmptyState, QuantitySelector) + Layouts
│       ├── features/                # catalog | basket | auth | ordering | admin | favorites
│       ├── hooks/                   # Global hooks (useDebounce)
│       ├── store/                   # Zustand (authStore, basketUiStore, uiStore)
│       ├── types/                   # ApiResponse<T>, PaginatedResult<T>
│       └── utils/                   # queryKeys, formatters, idempotency, unitConfig, priceCalculator
│
├── tests/
│   ├── ECommerce.UnitTests/         # Domain + handler tests
│   ├── ECommerce.ArchitectureTests/ # Layer dependency enforcement
│   └── ECommerce.IntegrationTests/  # Placeholder
│
├── docs/                            # architecture.md, milestone-progress.md
└── .claude/                         # rules/, commands/, skills/
```

---

## Dependency Flow (strict — enforced by architecture tests)

```
Domain         ← zero dependencies
Application    ← Domain only
Persistence    ← Domain only (NOT Application)
Infrastructure ← Domain, Application
API            ← Application, Persistence, Infrastructure
```

---

## Bounded Contexts

### Catalog
- Entities: Product, Category, Unit (all BaseAuditableEntity)
- Value Objects: Money (record: Amount decimal, Currency string — immutable, non-negative, no cross-currency ops), StockQuantity (record: Value int — non-negative, Increase/Decrease methods)
- Repositories: IProductRepository, ICategoryRepository, IUnitRepository (interfaces in Domain, implementations in Persistence)
- Specifications: ProductsWithFiltersSpecification (search, price range, category, sorting, pagination), ProductsByCategoriesSpec
- Commands: CreateProduct, UpdateProduct, DeleteProduct, RestoreProduct, UpdateStock, CreateCategory, UpdateCategory, DeleteCategory, RestoreCategory
- Queries: GetProducts (ICacheableQuery, 5min), GetProductById, GetCategories, GetUnits (ICacheableQuery, 24h)
- DTOs: ProductDto, CategoryDto, UnitDto (immutable records)
- Features: Category hierarchy (parent-child self-ref), product soft delete and restore, filtered product DB index

### Basket
- Entities: Basket (UserId or SessionId), BasketItem (ProductId, ProductName, UnitPriceSnapshot as Money, Quantity as decimal, LineTotalSnapshot)
- Repository: IBasketRepository (GetByUserIdAsync, GetBySessionIdAsync, tracked variants)
- Commands: AddToBasket, UpdateBasketItemQuantity, RemoveFromBasket, ClearBasket
- Queries: GetBasket
- Features: Guest + member support, price snapshot captured on add, decimal quantity for weight-based products (kg, g, litre)

### Ordering
- Entities: Order (OrderNumber, UserId/GuestEmail, ShippingAddress JSON, Status, Items), OrderItem (ProductId, ProductName, UnitPrice Money, Quantity, LineTotal computed)
- Enum: OrderStatus — Pending, Paid, Processing, Shipped, Delivered, Cancelled
- Repository: IOrderRepository (GetByIdWithItemsAsync, GetPagedAsync, tracked variants)
- Commands: CreateOrder (basket to order, stock decrease, price validation, basket clear), UpdateOrderStatus (state machine), DeleteOrder, RestoreOrder
- Queries: GetOrders, GetPagedOrders, GetOrderById
- DTOs: OrderDto, OrderItemDto, ShippingAddressDto

### Payment
- Entity: PaymentRecord (OrderId, Amount Money, Provider, ProviderTransactionId, Status, FailureReason, IdempotencyKey)
- Enum: PaymentStatus — Pending, Succeeded, Failed, Refunded
- Repository: IPaymentRepository
- Commands: ProcessPayment (stub implementation — real provider TBD)
- Idempotency: Unique index on (OrderId, IdempotencyKey) prevents duplicate charges

### Identity
- Entity: AppUser (FirstName, LastName, Email, PasswordHash, Role, IsEmailConfirmed, RefreshToken, RefreshTokenExpiresAt)
- Enum: UserRole — Customer, Admin
- Repository: IUserRepository
- Commands: Register, Login, RefreshToken, Logout
- Queries: GetCurrentUser
- Auth flow: JWT in httpOnly secure cookies, 15min access token, refresh token rotation on every use, PBKDF2 SHA-256 100K iterations

### Wishlist
- Entity: WishlistItem (UserId, ProductId)
- Repository: IWishlistRepository
- Commands: AddToWishlist, RemoveFromWishlist
- Queries: GetWishlist

---

## Application Layer Pipeline (MediatR)

```
Request → ValidationBehavior (FluentValidation) → LoggingBehavior (Serilog) → CachingBehavior (Redis, ICacheableQuery only) → Handler → Repository
```

- Every Command MUST have a FluentValidation Validator (no empty validators)
- Every Query handler MUST use AsNoTracking()
- Handlers return DTOs, NEVER domain entities
- ICacheableQuery interface: CacheKey + Expiration
- Cache invalidation: prefix-based removal on mutations

---

## Persistence Layer

- DbContext: ApplicationDbContext with global query filters (IsDeleted == false) on all auditable entities
- Interceptor: AuditAndSoftDeleteInterceptor — auto-sets CreatedAt, UpdatedAt, CreatedBy, UpdatedBy; converts Delete to soft delete
- Configurations: 8 IEntityTypeConfiguration classes (Fluent API only, no data annotations)
- Owned types: Money, StockQuantity configured as owned
- Migrations (7): InitialCreate, CategoryIsActive, CategoryHierarchy, AddFilteredProductIndex, AddUnitEntity, AddWishlistItems, BasketItem_Quantity_Decimal
- Repositories: 8 aggregate-specific (no generic IRepository<T>)
- DbInitializer: Seeds initial data (products, categories, units, demo users)

---

## Infrastructure Layer

- JwtService: Generates access token (15min) with claims (sub, email, jti, role, firstName, lastName). Secret from env var JWT__Secret then appsettings fallback. Reads JWT from httpOnly cookie "access_token" (OnMessageReceived event)
- CurrentUserService: Extracts UserId from HttpContext claims
- RedisCacheService: JSON serialize/deserialize, TTL support, prefix-based bulk removal, graceful error handling
- StubPaymentService: Placeholder for Stripe/Iyzico

---

## API Layer

### Controllers (8):
- CatalogController — GET products (with filters), GET products/{id}, GET categories, GET units
- BasketController — GET basket, POST items, PUT items, DELETE items/{productId}, DELETE (clear)
- OrderController — POST (create), GET {id}, GET my [Authorize]
- PaymentController — POST (process)
- AuthController — POST register, POST login, GET me, POST refresh, POST logout
- WishlistController — GET, GET product-ids, POST {productId}, DELETE {productId}, DELETE (clear)
- AdminController [Authorize(Roles="Admin")] — Products CRUD + restore + stock, Categories CRUD + restore, Users list, Orders list + detail + status update + delete + restore, Dashboard (summary, revenue, recent-orders, low-stock)

### Middleware and Config:
- ExceptionHandlingMiddleware (global, 4xx/5xx distinction)
- Rate limiting: 100 req/min per IP (FixedWindowLimiter)
- CORS: whitelist policy (configurable origins, credentials allowed)
- Pipeline: ExceptionHandling, HTTPS, CORS, RateLimiter, Auth, AuthZ, Controllers

---

## Frontend Architecture

### Feature Modules (6):
Each follows: api/ (mock+real toggle) then hooks/ (React Query) then components/ then pages/ then types/

1. catalog — StorefrontHomePage, ProductListPage, ProductDetailPage, HeaderSearchAutocomplete, CategoryFilter, ProductCard, ProductGrid, ProductSearchBar
2. auth — LoginPage, RegisterPage, useInitAuth (session restore on boot), useLogin (redirect param), useLogout, useRegister
3. basket — BasketDrawer, BasketPage, BasketItemRow, BasketSummary, AddToBasketButton, QuantitySelector (unit-aware)
4. ordering — CheckoutPage (2-step: address then payment), OrderConfirmationPage, OrderHistoryPage, OrderDetailPage, ShippingAddressForm, PaymentForm (clearTrigger), OrderSummary, OrderStatusBadge, OrderCard
5. admin — AdminDashboardPage (SummaryCard, RevenueChart, LowStockTable, AdminOrdersTable), AdminProductsPage + ProductFormModal, AdminCategoriesPage + CategoryFormModal, AdminOrdersPage + AdminOrderDetailPage + OrderStatusUpdateModal, AdminUsersPage + UserFormModal. All with AG Grid, export utilities, ConfirmModal for destructive actions
6. favorites — FavoritesPage, useFavorites

### State Management:
- Server state: React Query ONLY. All queries via centralized queryKeys.ts. staleTime configured. Mutation then invalidateQueries.
- UI state: Zustand ONLY. authStore (user, isAuthenticated, isAuthLoading — NO tokens), basketUiStore (drawer, lastAdded), uiStore (sidebar)
- NEVER sync server state into Zustand

### API Layer:
- All HTTP through src/api/client.ts (Axios, withCredentials:true)
- Direct fetch/axios in components FORBIDDEN
- Mock/Real toggle: VITE_USE_MOCK_API env var, checked in each feature's api/ file
- Mock functions include 300-600ms simulated delay
- 401 interceptor redirects to /login (except /login and /me calls)

### Routing:
- Public: /, /products, /products/:id, /basket, /favoriler, /login, /register
- Protected (ProtectedRoute): /checkout, /orders, /orders/:id, /orders/:id/confirmation
- Admin (ProtectedRoute allowedRoles=['Admin']): /admin, /admin/products, /admin/categories, /admin/orders, /admin/orders/:id, /admin/users
- Lazy loading all pages with SuspenseWrapper

### Key Utilities:
- queryKeys.ts — factory: queryKeys.catalog.products.list(params), queryKeys.basket.current, etc.
- formatters.ts — formatPrice(amount, currency) with Intl.NumberFormat
- idempotency.ts — generateIdempotencyKey() via crypto.randomUUID()
- unitConfig.ts — getUnitConfig(unitName) returns step/min/decimals/displayName per unit
- priceCalculator.ts — calculateLinePrice (display only, backend is authoritative)

---

## Tests

### Unit Tests (9 test classes):
- Domain: MoneyTests, StockQuantityTests, ProductTests, BasketTests, OrderTests, PaymentRecordTests
- Application: CreateOrderHandlerTests, ProcessPaymentHandlerTests, AddToBasketHandlerTests
- Framework: xUnit + FluentAssertions, AAA pattern, NSubstitute for mocks

### Architecture Tests:
- Domain has zero dependencies
- Application has zero EF Core references
- Persistence has zero Application references
- Controllers have zero Domain references
- Domain entities have no public setters (except audit fields)

### Integration Tests:
- Placeholder structure (minimal)

---

## Milestone Status (as of March 2026)

- M1 Scaffold: Complete
- M2 Catalog: Complete
- M3 Auth: Complete
- M4 Basket: Complete
- M5 Order and Checkout: Complete
- M6 Admin Panel: Complete
- Wishlist / Favorites: Complete
- M7 Azure DevOps + CI/CD: Not started

---

## Known Gaps
- Real payment provider (Stripe/Iyzico) — StubPaymentService in place
- Email confirmation flow — not implemented
- Integration tests — placeholder only
- AdminCategoriesPage_new.tsx exists alongside AdminCategoriesPage.tsx — likely needs cleanup
- Docker Compose for full-stack local dev — not yet created

---

## Non-Negotiable Rules

### General:
- TypeScript strict mode — "any" is FORBIDDEN
- No direct fetch/axios in components — all HTTP through api/client.ts
- Server state via React Query. UI state via Zustand. Never mix.
- No tokens in localStorage/sessionStorage — httpOnly cookies only
- Frontend route guards are UX-only — backend always enforces authorization
- Every data-fetching component MUST handle: loading, error, empty states
- Backend is single source of truth — never recalculate totals/prices on frontend
- Soft delete mandatory on all backend entities
- Domain layer has ZERO infrastructure dependencies
- Controllers contain ZERO business logic — orchestration only via MediatR

### Backend Design Order:
1. Domain first (entities, value objects, invariants)
2. Application second (commands, queries, handlers, validators)
3. Persistence third (repository implementations, configurations)
4. API last (controllers — orchestration only)

### Frontend Design Order:
1. Types first
2. API layer (with mock/real toggle)
3. React Query hooks
4. Components (loading/error/empty states mandatory)
5. Pages
6. Router update

### Scope Control — STOP and ask before proceeding if:
- Requirements are ambiguous or incomplete
- A UX decision affects security, authorization, or data integrity
- Proposed change adds endpoints or screens not explicitly requested
- Domain model change is required

---

## Commands Reference

```
# Frontend
cd src/ECommerce.Web
npm run dev           # dev server
npm run build         # production build
npx tsc --noEmit      # type check (must pass with 0 errors)

# Backend
dotnet run --project src/ECommerce.API
dotnet test ECommerce.sln
dotnet build ECommerce.sln
dotnet ef database update --project src/ECommerce.Persistence --startup-project src/ECommerce.API
dotnet ef migrations add <Name> --project src/ECommerce.Persistence --startup-project src/ECommerce.API
```
