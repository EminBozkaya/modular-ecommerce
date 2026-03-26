# API Endpoint Reference

## Catalog (public)
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | /api/catalog/products | search, minPrice, maxPrice, categoryId, page, pageSize, sortBy, descending |
| GET | /api/catalog/products/{id} | |
| GET | /api/catalog/categories | |
| GET | /api/catalog/units | |

## Auth
| Method | Endpoint | Notes |
|--------|----------|-------|
| POST | /api/auth/register | Sets httpOnly cookie |
| POST | /api/auth/login | Sets httpOnly cookie |
| GET | /api/auth/me | Returns AuthUser or 401 |
| POST | /api/auth/refresh | Rotates refresh token |
| POST | /api/auth/logout | Clears cookie, [Authorize] |

## Basket
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | /api/basket | Guest or member |
| POST | /api/basket/items | Price snapshot captured |
| PUT | /api/basket/items | |
| DELETE | /api/basket/items/{productId} | |
| DELETE | /api/basket | Clear basket |

## Ordering (protected)
| Method | Endpoint | Notes |
|--------|----------|-------|
| POST | /api/order | Basket → order, stock decrease |
| GET | /api/order/{id} | |
| GET | /api/order/my | [Authorize] |

## Payment
| Method | Endpoint | Notes |
|--------|----------|-------|
| POST | /api/payment | Stub — Iyzico sandbox active |

## Wishlist (protected)
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | /api/wishlist | |
| GET | /api/wishlist/product-ids | Quick check for heart icons |
| POST | /api/wishlist/{productId} | |
| DELETE | /api/wishlist/{productId} | |
| DELETE | /api/wishlist | Clear |

## Store Settings
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | /api/store/settings | Public — storefront reads on boot |
| GET | /api/admin/store-settings | Admin |
| PUT | /api/admin/store-settings | Admin |

## Admin [Authorize(Roles = "Admin")]
| Method | Endpoint | Notes |
|--------|----------|-------|
| POST | /api/admin/products | |
| PUT | /api/admin/products | |
| DELETE | /api/admin/products/{id} | Soft delete |
| POST | /api/admin/products/restore/{id} | |
| PUT | /api/admin/products/stock | |
| POST | /api/admin/categories | |
| PUT | /api/admin/categories | |
| DELETE | /api/admin/categories/{id} | Soft delete |
| POST | /api/admin/categories/restore/{id} | |
| GET | /api/admin/users | Role="Customer" only |
| GET | /api/admin/orders | Paged |
| GET | /api/admin/orders/{id} | |
| PUT | /api/admin/orders/{id}/status | State machine transitions |
| DELETE | /api/admin/orders/{id} | Soft delete |
| POST | /api/admin/orders/restore/{id} | |
| GET | /api/admin/dashboard/summary | |
| GET | /api/admin/dashboard/revenue | Period-based |
| GET | /api/admin/dashboard/recent-orders | |
| GET | /api/admin/dashboard/low-stock | |

## Frontend Routing
| Route | Type | Component |
|-------|------|-----------|
| / | Public | StorefrontHomePage |
| /products | Public | ProductListPage |
| /products/:id | Public | ProductDetailPage |
| /basket | Public | BasketPage |
| /favoriler | Public | FavoritesPage |
| /login | Public | LoginPage |
| /register | Public | RegisterPage |
| /checkout | Protected | CheckoutPage |
| /orders | Protected | OrderHistoryPage |
| /orders/:id | Protected | OrderDetailPage |
| /orders/:id/confirmation | Protected | OrderConfirmationPage |
| /admin | Admin | AdminDashboardPage |
| /admin/products | Admin | AdminProductsPage |
| /admin/categories | Admin | AdminCategoriesPage |
| /admin/orders | Admin | AdminOrdersPage |
| /admin/orders/:id | Admin | AdminOrderDetailPage |
| /admin/users | Admin | AdminUsersPage |
