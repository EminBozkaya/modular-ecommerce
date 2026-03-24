---
name: add-migration
description: EF Core migration oluşturur ve veritabanı şema değişikliklerini yönetir
---

# EF Core Migration Skill'i

EF Core Code First migration oluştur, doğrula ve uygula.
Soft delete, audit trail ve global query filter kurallarına uygundur.

---

## Adım 1 — Değişikliği Analiz Et

Domain entity değişikliğini incele:
- Hangi entity değişti? (`src/ECommerce.Domain/`)
- Yeni entity mi, mevcut entity'ye alan ekleme mi, ilişki değişikliği mi?
- `BaseAuditableEntity`'den inherit ediyor mu? (ZORUNLU)
- `IsDeleted` alanı mevcut mu? (BaseAuditableEntity'den gelir)

---

## Adım 2 — Entity Configuration Kontrolü

`src/ECommerce.Persistence/Configurations/` altında:
- Yeni entity için `IEntityTypeConfiguration<T>` oluştur
- Mevcut entity için configuration'ı güncelle
- Fluent API kullan — Data Annotation YASAK
- Money value object → owned type olarak configure et

**Zorunlu configuration kuralları:**
```csharp
// Soft delete global query filter
builder.HasQueryFilter(e => !e.IsDeleted);

// İlişkiler Fluent API ile
builder.HasMany(x => x.Items)
    .WithOne()
    .HasForeignKey(x => x.ParentId)
    .OnDelete(DeleteBehavior.Cascade);
```

---

## Adım 3 — DbContext Kontrolü

`src/ECommerce.Persistence/Context/ApplicationDbContext.cs`:
- Yeni entity için `DbSet<T>` eklendi mi?
- `modelBuilder.ApplyConfigurationsFromAssembly()` zaten var — ayrı Apply çağrısı GEREKMEZ

---

## Adım 4 — Migration Oluştur

```bash
dotnet ef migrations add {MigrationName} --project src/ECommerce.Persistence --startup-project src/ECommerce.API
```

Migration isim konvansiyonu: PascalCase (tarih prefix'i EF otomatik ekler)

---

## Adım 5 — Migration SQL İncelemesi

Oluşan migration dosyasını oku:
- Fiziksel `DELETE` SQL'i var mı? → YASAK
- `DROP TABLE` var mı? → Kullanıcıya UYAR
- `ALTER COLUMN` veri kaybı riski var mı? → Kullanıcıya UYAR

---

## Adım 6 — Build Doğrulama

```bash
dotnet build ECommerce.sln --no-restore
dotnet test ECommerce.sln --no-build
```

---

## Adım 7 — Database Update (ONAY GEREKLİ)

Migration uygulamadan önce kullanıcıya SOR.
Kullanıcı onaylamadan ÇALIŞTIRMA.

---

## Kontrol Listesi
- [ ] Entity `BaseAuditableEntity`'den inherit ediyor
- [ ] `IEntityTypeConfiguration<T>` mevcut ve Fluent API kullanıyor
- [ ] Global query filter `IsDeleted` için tanımlı
- [ ] `DbSet<T>` ApplicationDbContext'e eklenmiş
- [ ] Migration SQL'inde fiziksel DELETE yok
- [ ] `dotnet build` ve `dotnet test` geçiyor
- [ ] Database update için kullanıcı onayı alınmış
