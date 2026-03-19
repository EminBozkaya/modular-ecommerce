# Milestone Progress

## Completed

### M1 — Scaffold ✅
Vite + React + TypeScript, TailwindCSS + shadcn/ui, React Query provider, Zustand, React Router v6, Axios client (`withCredentials: true`), centralized query key factory (`src/utils/queryKeys.ts`), shared components (LoadingSpinner, ErrorMessage, EmptyState), MainLayout + AdminLayout, SuspenseWrapper for lazy loading.

### M2 — Catalog ✅
Types (Product, Category, Unit, ProductListParams), mock data + paginate utility, catalogApi.ts with mock/real toggle, useProducts + useProduct + useCategories hooks, useDebounce hook (global), ProductCard + ProductGrid + CategoryFilter + ProductSearchBar (400ms debounce) + HeaderSearchAutocomplete components, StorefrontHomePage (homepage with featured products), ProductListPage (pagination, filter, search state), ProductDetailPage, formatPrice utility, unitConfig utility (kg, g, litre, adet, koli, deste, duzine), priceCalculator utility (display-only line price calculation).

Backend: Product + Category + Unit entities, Money + StockQuantity value objects, ProductsWithFiltersSpecification, CRUD commands/queries with handlers + validators, ICacheableQuery on product listing (5min) and units (24h), category hierarchy (parent-child), soft delete + restore commands.

### M3 — Auth ✅
Types (AuthUser, LoginRequest, RegisterRequest, AuthResponse), mockAuth with test users, authApi.ts (login, register, logout, getMe), authStore (user, isAuthenticated, isAuthLoading — no tokens), useLogin + useRegister + useLogout + useInitAuth hooks, ProtectedRoute (role-aware, redirect param support), AuthInitializer in AppProviders (prevents auth flash), LoginPage + RegisterPage, Navbar shows auth state, /admin protected for Admin role only.

Backend: AppUser entity (FirstName, LastName, Email, PasswordHash, Role, RefreshToken), UserRole enum (Customer, Admin), JwtService (15min access token via httpOnly cookie, refresh token rotation), RegisterCommand + LoginCommand + RefreshTokenCommand + LogoutCommand + GetCurrentUserQuery, AuthController with GET /api/auth/me endpoint, PBKDF2 SHA-256 hashing.

### M4 — Basket ✅
Types (Basket, BasketItem, AddToBasketRequest, UpdateBasketItemRequest), mock in-memory basket, basketApi.ts (getBasket, addToBasket, removeFromBasket, updateBasketItem), useBasket + useAddToBasket + useRemoveFromBasket + useUpdateBasketItem (optimistic update + rollback) hooks, basketUiStore (drawer open/close, lastAdded), BasketDrawer + BasketItemRow + BasketSummary + AddToBasketButton + QuantitySelector (unit-aware) components, BasketPage (full-page basket view), integrated into ProductCard + ProductDetailPage + Navbar (item count badge), useLogin invalidates basket on auth.

Backend: Basket + BasketItem entities (BasketItem.Quantity as decimal for weight-based products), unitPriceSnapshot (Money), AddToBasketCommand + UpdateBasketItemQuantityCommand + RemoveFromBasketCommand + ClearBasketCommand + GetBasketQuery, guest + member basket support (userId or sessionId).

### M5 — Order & Checkout ✅
Types (Order, OrderItem, ShippingAddress, CreateOrderRequest/Response, PaymentRequest/Response, OrderStatus enum), mock with 600ms delay (card ending 0000 = payment failure), orderingApi.ts mock/real toggle, generateIdempotencyKey (crypto.randomUUID), useMyOrders + useMyOrder + useCheckout (2-step orchestration: createOrder → processPayment) hooks, ShippingAddressForm + PaymentForm (clearTrigger pattern) + OrderSummary + OrderStatusBadge + OrderCard components, CheckoutPage + OrderConfirmationPage + OrderHistoryPage + OrderDetailPage pages, router updated (/checkout, /orders, /orders/:id, /orders/:id/confirmation — all ProtectedRoute), ProtectedRoute redirect param support, useLogin reads redirect param, Navbar "My Orders" link.

Backend: Order + OrderItem entities, OrderStatus enum (Pending, Paid, Processing, Shipped, Delivered, Cancelled), CreateOrderCommand (basket → order, stock decrease, price validation), PaymentRecord entity (idempotency via unique OrderId+IdempotencyKey index), StubPaymentService (placeholder for Stripe/Iyzico), GET /api/order/my + GET /api/order/{id} endpoints.

Security: no card data stored anywhere, clearTrigger clears fields post-submit, new idempotency key on every retry, all totals from backend.

### M6 — Admin Panel ✅
**Products:** AdminProductsPage (AG Grid table + pagination + search + status filter), ProductFormModal (create/edit), soft delete + restore + confirmation dialog, useProductActions + useProductGridColumns hooks, productExport utility (CSV/Excel).

**Categories:** AdminCategoriesPage (AG Grid table + pagination), CategoryFormModal (create/edit with parent category support), soft delete + restore + confirmation dialog, useCategoryActions + useCategoryGridColumns hooks, categoryExport utility, category hierarchy management.

**Dashboard:** AdminDashboardPage, SummaryCard components (total orders, revenue, customers, products), RevenueChart (period-based analytics), AdminOrdersTable (recent orders), LowStockTable, useDashboard hook. Backend: GET /api/admin/dashboard/summary, GET /api/admin/dashboard/revenue, GET /api/admin/dashboard/recent-orders, GET /api/admin/dashboard/low-stock.

**Orders:** AdminOrdersPage (AG Grid + status filter + pagination), AdminOrderDetailPage, OrderStatusUpdateModal (status transitions with confirmation), OrderStatusFilter, useAdminOrders + useOrderActions + useOrderGridColumns hooks, orderExport utility. Backend: GET /api/admin/orders, GET /api/admin/orders/{id}, PUT /api/admin/orders/{id}/status, DELETE + restore.

**Users:** AdminUsersPage (AG Grid + search), AdminUsersTable, UserFormModal, useAdminUsers + useUserActions + useUserGridColumns hooks, userExport utility. Backend: GET /api/admin/users. Architecture: single AppUser table, Role="Customer" for storefront users, Role="Admin" for admin users.

**Shared Admin Components:** ConfirmModal, EntityStatusFilter, StatusToggleFilter, AgGridDatePicker.

### Wishlist / Favorites ✅
Types (Favorite), favoritesApi.ts with mock/real toggle, useFavorites hook, FavoritesPage (/favoriler route — public), FavoriteButton in header.

Backend: WishlistItem entity (BaseAuditableEntity), IWishlistRepository, AddToWishlistCommand + RemoveFromWishlistCommand + GetWishlistQuery, WishlistController (GET /api/wishlist, GET /api/wishlist/product-ids, POST /api/wishlist/{productId}, DELETE /api/wishlist/{productId}, DELETE /api/wishlist).

### Cross-Cutting (Backend) ✅
- MediatR pipeline behaviors: ValidationBehavior, LoggingBehavior, CachingBehavior (Redis)
- AuditAndSoftDeleteInterceptor (auto CreatedAt/UpdatedAt/IsDeleted)
- ExceptionHandlingMiddleware (global, 4xx/5xx distinction)
- Rate limiting: 100 req/min per IP (FixedWindowLimiter)
- CORS: whitelist policy with credentials support
- Serilog structured logging
- Database seeding (DbInitializer)
- Dynamic Multi-language architecture — language-agnostic per-entity translations mapped via Accept-Language header

### Tests ✅
- **Unit tests:** MoneyTests, StockQuantityTests, ProductTests, BasketTests, OrderTests, PaymentRecordTests, CreateOrderHandlerTests, ProcessPaymentHandlerTests, AddToBasketHandlerTests
- **Architecture tests:** Domain zero dependencies, Application no EF Core, Persistence no Application ref, Controllers no Domain ref, no public setters on entities
- **Integration tests:** Placeholder structure (minimal)

## Upcoming

### AI-Powered Dynamic Translation
- Auto-translate new categories and products via an AI-powered API integration

### M7 — CI/CD & Docker Containerization
- Docker Compose for full-stack local application containerization
- CI/CD pipeline via GitHub Actions / Azure DevOps (build → test → deploy)
- Azure Container Apps deployment
- Azure Key Vault for secrets management
- Database migrations before deployment
- Rollback strategy

## Known Gaps (Not Milestone-Blocked)
- Real payment provider integration (Stripe / Iyzico) — StubPaymentService in place
- Email confirmation flow
- Integration tests (currently placeholder)
- `AdminCategoriesPage_new.tsx` exists alongside `AdminCategoriesPage.tsx` — likely needs cleanup
