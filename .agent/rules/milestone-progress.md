# Milestone Progress & Implementation Status

## Completed ✅

### M1 — Scaffold
Vite + React + TypeScript, TailwindCSS + shadcn/ui, React Query provider, Zustand, React Router v6, Axios client (`withCredentials: true`), centralized queryKeys, shared components, MainLayout + AdminLayout, SuspenseWrapper.

### M2 — Catalog
Product listing, detail, category filter, search, pagination, unit system (kg, adet, litre, etc.), price calculator, mock/real toggle. Backend: CRUD + cache + specifications.

### M2.5 — Multi-language Support (TR/EN/DE/FR/ES/RU/AR)
Translation tables, Accept-Language pipeline, React Query cache keyed by language, i18n UI, cross-language search, RTL support (AR).

### M3 — Auth
Login, register, session restore, route guard, httpOnly cookies, PBKDF2, refresh token rotation. Social Auth: Google, Facebook, X (Twitter).

### M4 — Basket
Guest + member, optimistic update, price snapshot, decimal quantity for weight-based products.

### M5 — Order & Checkout
2-step checkout (address → payment), order state machine, stock decrease, idempotency, clearTrigger pattern.

### M6 — Admin Panel
- Product/Category CRUD (AG Grid, export)
- Dashboard (summary, revenue chart, low stock, recent orders)
- Orders management (status transitions, detail)
- Users management
- StoreSettings — brand & appearance

### Wishlist / Favorites
Full CRUD, quick product-id check for heart icons.

### Cross-Cutting (Backend)
MediatR pipeline behaviors, AuditAndSoftDeleteInterceptor, ExceptionHandlingMiddleware, Rate limiting, CORS, Serilog, Database seeding, Multi-language architecture.

### Tests
9 unit test classes, architecture tests, integration tests (placeholder).

---

## Upcoming / Known Gaps

- [ ] Design settings — Hero Carousel, Nav ordering, Banners/sections
- [ ] Admin translation UI
- [ ] Real payment provider beyond Iyzico sandbox (Stripe, PayTR, PayPal)
- [ ] Email confirmation flow
- [ ] Integration tests (currently placeholder)
- [ ] AdminCategoriesPage_new.tsx cleanup
- [ ] M7 — CI/CD pipeline (partially addressed by Railway auto-deploy)

---

## Database Migrations (chronological)
1. `InitialCreate` — Full schema
2. `CategoryIsActive` — IsActive flag
3. `CategoryHierarchy` — Parent-child self-ref
4. `AddFilteredProductIndex` — DB indices
5. `AddUnitEntity` — Unit entity
6. `AddWishlistItems` — WishlistItem entity
7. `BasketItem_Quantity_Decimal` — Decimal quantity
