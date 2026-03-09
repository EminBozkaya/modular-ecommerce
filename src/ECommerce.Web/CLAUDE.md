# Frontend Context — ECommerce.Web

## Feature Completion Status
- [x] Scaffold (Vite + TS + Tailwind + shadcn/ui + providers + router)
- [x] Catalog (ProductListPage, ProductDetailPage, CategoryFilter, SearchBar, pagination)
- [x] Auth (LoginPage, RegisterPage, ProtectedRoute, AuthInitializer, authStore)
- [x] Basket (BasketDrawer, BasketItemRow, AddToBasketButton, optimistic remove, uiStore)
- [ ] Ordering (CheckoutPage, OrderConfirmationPage, OrderHistoryPage, OrderDetailPage)
- [ ] Admin Panel (products CRUD, order management, stock control)

## Key Patterns Already Established
- Mock/Real toggle: `VITE_USE_MOCK_API` env var in each `features/*/api/` layer
- Query keys: `src/utils/queryKeys.ts` — always use, never hardcode strings
- Price display: always use `unitPriceSnapshot` from backend — never recalculate
- Auth init: `useInitAuth()` runs at app boot inside `AuthInitializer` — prevents auth flash
- Redirect after login: `?redirect=` query param preserved through login flow

## API Contracts (Backend Endpoints)
### Public
- GET `/api/catalog/products` — PaginatedResult<Product>
- GET `/api/catalog/products/{id}` — Product
- GET `/api/catalog/categories` — Category[]
- GET `/api/basket` — Basket
- POST `/api/basket/items` — AddToBasketRequest → Basket
- DELETE `/api/basket/items/{productId}` — Basket

### Auth
- POST `/api/auth/register` → AuthResponse (sets httpOnly cookie)
- POST `/api/auth/login` → AuthResponse (sets httpOnly cookie)
- POST `/api/auth/refresh` → rotates cookie
- POST `/api/auth/logout` → clears cookie
- GET `/api/auth/me` → AuthUser (session restore on page load)

### Ordering
- POST `/api/order` → CreateOrderResponse
- POST `/api/payment` → PaymentResponse
- GET `/api/orders/my` → Order[]
- GET `/api/orders/my/{id}` → Order

### Admin `[Authorize(Roles = "Admin")]`
- POST/PUT/DELETE `/api/admin/products`
- PUT `/api/admin/products/stock`
- POST `/api/admin/categories`
- GET `/api/admin/users`
- GET `/api/admin/orders`
