# Milestone Progress

## Completed

### M1 — Scaffold ✅
Vite + React + TypeScript, TailwindCSS + shadcn/ui, React Query provider, Zustand, React Router, Axios client (`withCredentials: true`), centralized query key factory, shared components (LoadingSpinner, ErrorMessage, EmptyState), MainLayout + AdminLayout stubs.

### M2 — Catalog ✅
Types (Product, Category, ProductListParams), mock data + paginate utility, catalogApi.ts with mock/real toggle, useProducts + useProduct + useCategories hooks, ProductCard + ProductGrid + CategoryFilter + ProductSearchBar (400ms debounce) components, ProductListPage (pagination, filter, search state), ProductDetailPage, formatPrice utility.

### M3 — Auth ✅
Types (AuthUser, LoginRequest, RegisterRequest, AuthResponse), mockAuth with test users, authApi.ts, authStore (user, isAuthenticated, isAuthLoading), useLogin + useRegister + useLogout + useInitAuth hooks, ProtectedRoute (role-aware, redirect param support), AuthInitializer in AppProviders (prevents auth flash), LoginPage + RegisterPage, Navbar shows auth state, /admin protected for Admin role only.

### M4 — Basket ✅
Types (Basket, BasketItem, AddToBasketRequest), mock in-memory basket, basketApi.ts, useBasket + useAddToBasket + useRemoveFromBasket (optimistic update + rollback) hooks, basketUiStore (drawer open/close, lastAdded), BasketDrawer + BasketItemRow + BasketSummary + AddToBasketButton components, integrated into ProductCard + ProductDetailPage + Navbar (item count badge), useLogin invalidates basket on auth.

### M5 — Order & Checkout ✅
Types (Order, OrderItem, ShippingAddress, CreateOrderRequest/Response, PaymentRequest/Response), mock with 600ms delay (card ending 0000 = payment failure), orderingApi.ts mock/real toggle, generateIdempotencyKey (crypto.randomUUID), useMyOrders + useMyOrder + useCheckout (2-step orchestration: createOrder → processPayment) hooks, ShippingAddressForm + PaymentForm (clearTrigger pattern) + OrderSummary + OrderStatusBadge + OrderCard components, CheckoutPage + OrderConfirmationPage + OrderHistoryPage + OrderDetailPage pages, router updated (/checkout, /orders, /orders/:id, /orders/:id/confirmation — all ProtectedRoute), ProtectedRoute redirect param support, useLogin reads redirect param, Navbar "My Orders" link.

Security: no card data stored anywhere, clearTrigger clears fields post-submit, new idempotency key on every retry, all totals from backend.

## In Progress

### M6 — Admin Panel 🔄

#### Already Implemented (verify only — do not modify)
- [x] Products: table listing + pagination, create form, edit form, soft delete + confirmation dialog
- [x] Categories: table listing + pagination, create form, edit form, soft delete + confirmation dialog

#### To Implement
- [ ] Dashboard: summary cards + recent orders table + low stock table + revenue chart
- [ ] Orders: list with status filter + pagination, detail view, status update with confirmation
- [ ] Users: customer list (Role="Customer", view only), search by name/email

#### Architecture Decision: Users vs Customers
Single `AppUser` table — no separate Customers table needed.
- `Role = "Customer"` → storefront users (alışverişçiler)
- `Role = "Admin"` → admin panel users
Admin panel "Users" section lists only `Role = "Customer"` records.

## Upcoming

### M7 — Azure DevOps + CI/CD
- Azure Container Apps deployment
- GitHub Actions pipeline (build → test → deploy)
- Azure Key Vault for secrets
- Docker Compose for local full-stack
- Database migrations before deployment
- Rollback strategy