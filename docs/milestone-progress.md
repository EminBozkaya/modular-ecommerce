# Milestone Progress

## Completed

### M1 — Scaffold ✅
Vite + React + TypeScript, TailwindCSS + shadcn/ui, React Query provider, Zustand, React Router, Axios client (`withCredentials: true`), centralized query key factory, shared components (LoadingSpinner, ErrorMessage, EmptyState), MainLayout + AdminLayout stubs.

### M2 — Catalog ✅
Types (Product, Category, ProductListParams), mock data + paginate utility, catalogApi.ts with mock/real toggle, useProducts + useProduct + useCategories hooks, ProductCard + ProductGrid + CategoryFilter + ProductSearchBar (400ms debounce) components, ProductListPage (pagination, filter, search state), ProductDetailPage, formatPrice utility.

### M3 — Auth ✅
Types (AuthUser, LoginRequest, RegisterRequest, AuthResponse), mockAuth with test users, authApi.ts, authStore (user, isAuthenticated, isAuthLoading), useLogin + useRegister + useLogout + useInitAuth hooks, ProtectedRoute (role-aware), AuthInitializer in AppProviders (prevents auth flash), LoginPage + RegisterPage, Navbar shows auth state, /admin protected for Admin role only.

### M4 — Basket ✅
Types (Basket, BasketItem, AddToBasketRequest), mock in-memory basket, basketApi.ts, useBasket + useAddToBasket + useRemoveFromBasket (with optimistic update + rollback) hooks, basketUiStore (drawer open/close, lastAdded), BasketDrawer + BasketItemRow + BasketSummary + AddToBasketButton components, integrated into ProductCard + ProductDetailPage + Navbar (item count badge), useLogin invalidates basket on auth.

## In Progress

### M5 — Order & Checkout 🔄
- [ ] Types: Order, OrderItem, OrderStatus, ShippingAddress, PaymentRequest/Response
- [ ] Mock: createOrder, processPayment (fails if card ends in 0000), getMyOrders, getMyOrderById
- [ ] orderingApi.ts with mock/real toggle
- [ ] generateIdempotencyKey utility (crypto.randomUUID)
- [ ] useMyOrders + useMyOrder + useCheckout (two-step orchestration) hooks
- [ ] Components: ShippingAddressForm, PaymentForm, OrderSummary, OrderStatusBadge, OrderCard
- [ ] Pages: CheckoutPage, OrderConfirmationPage, OrderHistoryPage, OrderDetailPage
- [ ] Router: /checkout, /orders, /orders/:id, /orders/:id/confirmation (all ProtectedRoute)
- [ ] ProtectedRoute: add redirect param support (?redirect=)
- [ ] useLogin: read redirect param, navigate to destination after login
- [ ] Navbar: "My Orders" link for authenticated users

## Upcoming

### M6 — Admin Panel
- Product CRUD (create, update, soft delete)
- Stock management
- Order management (view all, update status)
- Customer list (view only)
- All actions require Admin role + backend authorization

### M7 — Azure DevOps + CI/CD
- Azure Container Apps deployment
- GitHub Actions pipeline
- Azure Key Vault for secrets
- Docker Compose for local full-stack
- Rollback strategy
