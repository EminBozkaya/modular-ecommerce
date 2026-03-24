# Bounded Contexts & Domain Reference

## Bounded Contexts

### Catalog
- **Entities:** Product, Category, Unit (all BaseAuditableEntity)
- **Value Objects:** Money (record: Amount decimal, Currency string — immutable, non-negative), StockQuantity (record: Value int — non-negative, Increase/Decrease methods)
- **Repositories:** IProductRepository, ICategoryRepository, IUnitRepository (interfaces in Domain, implementations in Persistence)
- **Specifications:** ProductsWithFiltersSpecification (search, price range, category, sorting, pagination)
- **Commands:** CreateProduct, UpdateProduct, DeleteProduct, RestoreProduct, UpdateStock, CreateCategory, UpdateCategory, DeleteCategory, RestoreCategory
- **Queries:** GetProducts (ICacheableQuery, 5min), GetProductById, GetCategories, GetUnits (ICacheableQuery, 24h)
- **DTOs:** ProductDto, CategoryDto, UnitDto (immutable records)
- **Features:** Category hierarchy (parent-child self-ref), product soft delete and restore, filtered product DB index

### Basket
- **Entities:** Basket (UserId or SessionId), BasketItem (ProductId, ProductName, UnitPriceSnapshot as Money, Quantity as decimal, LineTotalSnapshot)
- **Repository:** IBasketRepository (GetByUserIdAsync, GetBySessionIdAsync, tracked variants)
- **Commands:** AddToBasket, UpdateBasketItemQuantity, RemoveFromBasket, ClearBasket
- **Queries:** GetBasket
- **Features:** Guest + member support, price snapshot captured on add, decimal quantity for weight-based products (kg, g, litre)

### Ordering
- **Entities:** Order (OrderNumber, UserId/GuestEmail, ShippingAddress JSON, Status, Items), OrderItem (ProductId, ProductName, UnitPrice Money, Quantity, LineTotal computed)
- **Enum:** OrderStatus — Pending, Paid, Processing, Shipped, Delivered, Cancelled
- **Repository:** IOrderRepository (GetByIdWithItemsAsync, GetPagedAsync, tracked variants)
- **Commands:** CreateOrder (basket to order, stock decrease, price validation, basket clear), UpdateOrderStatus (state machine), DeleteOrder, RestoreOrder
- **Queries:** GetOrders, GetPagedOrders, GetOrderById

### Payment
- **Entity:** PaymentRecord (OrderId, Amount Money, Provider, ProviderTransactionId, Status, FailureReason, IdempotencyKey)
- **Enum:** PaymentStatus — Pending, Succeeded, Failed, Refunded
- **Repository:** IPaymentRepository
- **Commands:** ProcessPayment (stub — real provider TBD: Iyzico active in sandbox)
- **Idempotency:** Unique index on (OrderId, IdempotencyKey) prevents duplicate charges

### Identity
- **Entity:** AppUser (FirstName, LastName, Email, PasswordHash, Role, IsEmailConfirmed, RefreshToken, RefreshTokenExpiresAt)
- **Enum:** UserRole — Customer, Admin
- **Repository:** IUserRepository
- **Commands:** Register, Login, RefreshToken, Logout
- **Queries:** GetCurrentUser
- **Auth flow:** JWT in httpOnly secure cookies, 15min access token, refresh token rotation, PBKDF2 SHA-256 100K iterations
- **Social Auth:** Google, Facebook, X (Twitter) — configured via SocialAuth__* env vars

### Wishlist
- **Entity:** WishlistItem (UserId, ProductId)
- **Repository:** IWishlistRepository
- **Commands:** AddToWishlist, RemoveFromWishlist
- **Queries:** GetWishlist

---

## CQRS Pipeline (MediatR)

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

- DbContext: ApplicationDbContext with global query filters (IsDeleted == false)
- Interceptor: AuditAndSoftDeleteInterceptor — auto CreatedAt/UpdatedAt/IsDeleted
- Configurations: IEntityTypeConfiguration classes (Fluent API only)
- Owned types: Money, StockQuantity configured as owned
- Repositories: aggregate-specific (no generic IRepository<T>)
- DbInitializer: Seeds initial data

---

## Infrastructure Layer

- **JwtService:** 15min access token via httpOnly cookie, reads from "access_token" cookie
- **CurrentUserService:** Extracts UserId from HttpContext claims
- **RedisCacheService:** JSON serialize/deserialize, TTL, prefix-based bulk removal
- **StubPaymentService:** Placeholder for real providers
- **IyzicoPaymentService:** Sandbox-active (Payment__Iyzico__* env vars)
