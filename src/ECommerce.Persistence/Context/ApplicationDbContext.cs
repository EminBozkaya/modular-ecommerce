using ECommerce.Domain.Basket.Entities;
using ECommerce.Domain.Catalog.Entities;
using ECommerce.Domain.Identity.Entities;
using ECommerce.Domain.Ordering.Entities;
using ECommerce.Domain.Payment.Entities;
using ECommerce.Domain.Settings.Entities;
using ECommerce.Domain.Wishlist.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Persistence.Context;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    // Catalog
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Unit> Units => Set<Unit>();
    public DbSet<ProductTranslation> ProductTranslations => Set<ProductTranslation>();
    public DbSet<CategoryTranslation> CategoryTranslations => Set<CategoryTranslation>();
    public DbSet<UnitTranslation> UnitTranslations => Set<UnitTranslation>();

    // Basket
    public DbSet<Basket> Baskets => Set<Basket>();
    public DbSet<BasketItem> BasketItems => Set<BasketItem>();

    // Ordering
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    // Payment
    public DbSet<PaymentRecord> PaymentRecords => Set<PaymentRecord>();
    public DbSet<PaymentProviderLog> PaymentProviderLogs => Set<PaymentProviderLog>();

    // Identity
    public DbSet<AppUser> Users => Set<AppUser>();
    public DbSet<ExternalLogin> ExternalLogins => Set<ExternalLogin>();
    public DbSet<UserAddress> UserAddresses => Set<UserAddress>();
    public DbSet<UserBillingAddress> UserBillingAddresses => Set<UserBillingAddress>();
    public DbSet<Country> Countries => Set<Country>();
    public DbSet<City> Cities => Set<City>();
    public DbSet<District> Districts => Set<District>();

    // Wishlist
    public DbSet<WishlistItem> WishlistItems => Set<WishlistItem>();

    // Settings
    public DbSet<StoreSettings> StoreSettings => Set<StoreSettings>();
    public DbSet<AppSettings> AppSettings => Set<AppSettings>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply all IEntityTypeConfiguration from this assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        // Global soft-delete query filters — backend-rules §3
        modelBuilder.Entity<Product>().HasQueryFilter(p => !p.IsDeleted);
        modelBuilder.Entity<Category>().HasQueryFilter(c => !c.IsDeleted);
        modelBuilder.Entity<Unit>().HasQueryFilter(u => !u.IsDeleted);
        modelBuilder.Entity<Order>().HasQueryFilter(o => !o.IsDeleted);
        modelBuilder.Entity<AppUser>().HasQueryFilter(u => !u.IsDeleted);
        modelBuilder.Entity<ExternalLogin>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<WishlistItem>().HasQueryFilter(w => !w.IsDeleted);
        modelBuilder.Entity<UserAddress>().HasQueryFilter(a => !a.IsDeleted);
        modelBuilder.Entity<ProductTranslation>().HasQueryFilter(t => !t.IsDeleted);
        modelBuilder.Entity<CategoryTranslation>().HasQueryFilter(t => !t.IsDeleted);
        modelBuilder.Entity<UnitTranslation>().HasQueryFilter(t => !t.IsDeleted);
    }
}
