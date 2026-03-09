# Architecture Reference

## Dependency Flow
```
Domain         ← zero dependencies
Application    ← Domain
Persistence    ← Domain only (NOT Application)
Infrastructure ← Domain, Application
API            ← Application, Persistence, Infrastructure
```

## Bounded Contexts & Responsibilities
| Context   | Domain Entities | Key Invariants |
|-----------|----------------|----------------|
| Catalog   | Product, Category | StockQuantity >= 0, Money immutable |
| Basket    | Basket, BasketItem | Price snapshot on add, guest+member support |
| Ordering  | Order, OrderItem | State machine, price re-validation at checkout |
| Payment   | PaymentRecord | Idempotency: unique (OrderId, IdempotencyKey) |
| Identity  | AppUser | PBKDF2 hashing, JWT via httpOnly cookie |

## Frontend Feature → Backend Endpoint Mapping
| Frontend Feature | Endpoints Used |
|-----------------|---------------|
| Catalog listing | GET /api/catalog/products |
| Product detail  | GET /api/catalog/products/{id} |
| Category filter | GET /api/catalog/categories |
| Basket          | GET/POST/DELETE /api/basket/items |
| Login           | POST /api/auth/login |
| Register        | POST /api/auth/register |
| Session restore | GET /api/auth/me |
| Checkout step 1 | POST /api/order |
| Checkout step 2 | POST /api/payment |
| Order history   | GET /api/orders/my |
| Admin products  | /api/admin/products (CRUD) |
| Admin orders    | GET /api/admin/orders |

## White-Label Deployment Model
- Single codebase → multiple Azure deployments
- Each deployment: different domain, branding, product catalog
- Branding config: per-deployment environment variables (future: tenant config layer)
- Admin panel: same domain under `/admin` prefix — no separate domain needed
