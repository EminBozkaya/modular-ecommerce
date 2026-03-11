# add-migration
# EF Core migration olusturur ve veritabani sema degisikliklerini yonetir.
# TRIGGER: "migration olustur", "migration ekle", "veritabani degistir", "tablo ekle",
#   "entity degistirdim", "EF migration", "database update", "schema change",
#   "kolon ekle", "alan ekle", "iliski ekle", "index ekle", "db migration"

## Gorev
EF Core Code First migration olustur, dogrula ve uygula.
Soft delete, audit trail ve global query filter kurallarina uy.

---

## Adim 1 — Degisikligi Analiz Et

Domain entity degisikligini incele:
- Hangi entity degisti? (`src/ECommerce.Domain/`)
- Yeni entity mi, mevcut entity'ye alan ekleme mi, iliski degisikligi mi?
- `BaseAuditableEntity`'den inherit ediyor mu? (ZORUNLU)
- `IsDeleted` alani mevcut mu? (BaseAuditableEntity'den gelir)

---

## Adim 2 — Entity Configuration Kontrolu

`src/ECommerce.Persistence/Configurations/` altinda:
- Yeni entity icin `IEntityTypeConfiguration<T>` olustur
- Mevcut entity icin configuration'i guncelle
- Fluent API kullan — Data Annotation YASAK
- Money value object → owned type olarak configure et
- StockQuantity → owned type olarak configure et

**Zorunlu configuration kurallari:**
```csharp
// Soft delete global query filter
builder.HasQueryFilter(e => !e.IsDeleted);

// Iliskiler Fluent API ile
builder.HasMany(x => x.Items)
    .WithOne()
    .HasForeignKey(x => x.ParentId)
    .OnDelete(DeleteBehavior.Cascade);
```

---

## Adim 3 — DbContext Kontrolu

`src/ECommerce.Persistence/Context/ApplicationDbContext.cs` dosyasini incele:
- Yeni entity icin `DbSet<T>` eklendi mi?
- Global query filter `OnModelCreating`'de tanimli mi?
- `modelBuilder.ApplyConfigurationsFromAssembly()` zaten var — ayri Apply cagrisi GEREKMEZ

---

## Adim 4 — Migration Olustur

```bash
dotnet ef migrations add {MigrationName} \
  --project src/ECommerce.Persistence \
  --startup-project src/ECommerce.API
```

Migration isim konvansiyonu: `{AciklamaYazisi}` (PascalCase, tarih prefix'i EF otomatik ekler)
Ornekler: `AddWishlistItems`, `BasketItem_Quantity_Decimal`, `AddFilteredProductIndex`

---

## Adim 5 — Migration SQL Incelemesi

Olusan migration dosyasini (`src/ECommerce.Persistence/Migrations/`) oku:
- Fiziksel `DELETE` SQL'i var mi? → YASAK (soft delete kullanilmali)
- `DROP TABLE` var mi? → Kullaniciya UYAR, onay al
- `ALTER COLUMN` veri kaybi riski var mi? → Kullaniciya UYAR
- Index eklenmesi gerekiyor mu? (sik sorgulanan alanlar icin)

---

## Adim 6 — Build Dogrulama

```bash
dotnet build ECommerce.sln --no-restore
dotnet test ECommerce.sln --no-build
```

Sifir hata ile gecmeli.

---

## Adim 7 — Database Update (ONAY GEREKLI)

Migration uygulamadan once kullaniciya SOR:

> Migration hazir. Veritabanina uygulamak ister misiniz?
> ```bash
> dotnet ef database update --project src/ECommerce.Persistence --startup-project src/ECommerce.API
> ```

Kullanici onaylamadan CALISTIRMA.

---

## Kontrol Listesi
- [ ] Entity `BaseAuditableEntity`'den inherit ediyor
- [ ] `IEntityTypeConfiguration<T>` mevcut ve Fluent API kullaniyor
- [ ] Global query filter `IsDeleted` icin tanimli
- [ ] `DbSet<T>` ApplicationDbContext'e eklenmis
- [ ] Migration SQL'inde fiziksel DELETE yok
- [ ] Repository interface Domain'de, implementasyon Persistence'da
- [ ] `dotnet build` ve `dotnet test` geciyor
- [ ] Database update icin kullanici onayi alinmis
