using ECommerce.Domain.Basket.Entities;
using ECommerce.Domain.Catalog.Entities;
using ECommerce.Domain.Identity.Entities;
using ECommerce.Domain.Ordering.Entities;
using ECommerce.Domain.Payment.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Persistence.Context;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    // Catalog
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();

    // Basket
    public DbSet<Basket> Baskets => Set<Basket>();
    public DbSet<BasketItem> BasketItems => Set<BasketItem>();

    // Ordering
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    // Payment
    public DbSet<PaymentRecord> PaymentRecords => Set<PaymentRecord>();

    // Identity
    public DbSet<AppUser> Users => Set<AppUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply all IEntityTypeConfiguration from this assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        // Global soft-delete query filters — backend-rules §3
        modelBuilder.Entity<Product>().HasQueryFilter(p => !p.IsDeleted);
        modelBuilder.Entity<Category>().HasQueryFilter(c => !c.IsDeleted);
        modelBuilder.Entity<Order>().HasQueryFilter(o => !o.IsDeleted);
        modelBuilder.Entity<AppUser>().HasQueryFilter(u => !u.IsDeleted);
    }
}
