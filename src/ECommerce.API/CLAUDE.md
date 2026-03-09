# Backend Context — ECommerce (.NET 10)

## Implementation Status
- [x] Domain models (entities, value objects, aggregates)
- [x] EF Core + PostgreSQL (Code First, Fluent API, soft delete interceptor)
- [x] CQRS with MediatR (commands + queries + pipeline behaviors)
- [x] JWT auth (httpOnly cookies, refresh token rotation)
- [x] Admin endpoints (role-gated)
- [x] Global exception handling middleware
- [x] Rate limiting + CORS
- [x] Basket price snapshot
- [x] Payment idempotency (IdempotencyKey + unique index)
- [x] Redis caching layer (MediatR pipeline behavior)
- [x] Serilog structured logging
- [x] Unit tests + architecture tests
- [ ] GET /api/auth/me endpoint (needed by frontend session restore)
- [ ] GET /api/orders/my and GET /api/orders/my/{id} (customer order history)
- [ ] Real payment provider (Iyzico / Stripe)
- [ ] Email confirmation flow

## Missing Endpoints (Frontend is waiting for these)
1. `GET /api/auth/me` → returns `AuthUser` from JWT cookie, or 401 if unauthenticated
2. `GET /api/orders/my` → returns current user's order history
3. `GET /api/orders/my/{id}` → returns single order for current user

## Project Layer Locations
- Domain: `src/ECommerce.Domain/`
- Application: `src/ECommerce.Application/`
- Persistence: `src/ECommerce.Persistence/`
- Infrastructure: `src/ECommerce.Infrastructure/`
- API: `src/ECommerce.API/`

## Adding a New Feature — Required Order
1. Domain: entity/value object/invariant
2. Application: Command or Query + Handler + Validator
3. Persistence: Repository implementation (if new aggregate)
4. API: Controller endpoint (orchestration only)
