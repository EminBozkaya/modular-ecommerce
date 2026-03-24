---
name: add-cqrs-handler
description: MediatR CQRS pattern'ine uygun Command veya Query handler oluşturur
---

# CQRS Handler Ekleme Skill'i

Projenin CQRS konvansiyonuna uygun Command veya Query + Handler + Validator oluşturur.
Katman disiplinine uyar: Domain → Application → Persistence → API sırası.

---

## Adım 1 — Tür Belirleme

Kullanıcının isteğini analiz et:
- **Veri yazma** (create, update, delete, restore) → Command
- **Veri okuma** (list, get, search, filter) → Query
- Belirsizse SOR — tahminle devam etme

Bounded context tespit et: Catalog | Ordering | Basket | Payment | Identity | Wishlist | Admin

---

## Adım 2 — Command Oluşturma (yazma işlemi için)

**Dosya:** `src/ECommerce.Application/{Context}/Commands/{Context}Commands.cs`
(Mevcut dosyaya ekle — yeni dosya OLUŞTURMA)

```csharp
public record {Name}Command(...) : IRequest<{ResponseType}>;
```

**Handler:** `src/ECommerce.Application/{Context}/Commands/{Context}CommandHandlers.cs`

```csharp
public class {Name}Handler : IRequestHandler<{Name}Command, {ResponseType}>
{
    // Constructor: repository + ILogger inject et
    // Handle: iş mantığı burada, controller'da DEĞİL
    // SaveChangesAsync çağır
    // Cache invalidation gerekiyorsa ICacheService kullan
}
```

**Validator:** `src/ECommerce.Application/{Context}/Commands/{Context}CommandValidators.cs`

```csharp
public class {Name}CommandValidator : AbstractValidator<{Name}Command>
{
    // NotEmpty, MaxLength, Range vb. kurallar
    // Boş validator YASAK — en az bir kural olmalı
}
```

---

## Adım 3 — Query Oluşturma (okuma işlemi için)

**Dosya:** `src/ECommerce.Application/{Context}/Queries/{Context}Queries.cs`

```csharp
public record {Name}Query(...) : IRequest<{ResponseType}>;
// Sayfalama gerekliyse: IRequest<PagedResult<{Dto}>>
// Cache gerekliyse: ICacheableQuery implement et
```

**Handler:** `src/ECommerce.Application/{Context}/Queries/{Context}QueryHandlers.cs`

```csharp
public class {Name}Handler : IRequestHandler<{Name}Query, {ResponseType}>
{
    // AsNoTracking() ZORUNLU
    // Projection/DTO dön — domain entity doğrudan DÖNME
    // Gereksiz Include() YASAK
}
```

---

## Adım 4 — DTO Tanımla

`src/ECommerce.Application/{Context}/` altında DTO record'u ekle:
- Immutable record type kullan
- Sadece gerekli alanları dahil et
- Domain entity doğrudan expose ETME

---

## Adım 5 — Controller Endpoint (istenmişse)

```csharp
[HttpPost/Get/Put/Delete("route")]
public async Task<IActionResult> {Name}([FromBody/Query] request)
{
    var result = await _mediator.Send(command/query);
    return Ok(result); // SADECE orchestration — iş mantığı YASAK
}
```

---

## Adım 6 — Doğrulama

```bash
dotnet build ECommerce.sln --no-restore
dotnet test ECommerce.sln --no-build
```

Sıfır hata ile geçmeli. Geçmezse düzelt.

---

## Kontrol Listesi
- [ ] Handler IRequestHandler implement ediyor
- [ ] Command için Validator mevcut ve en az bir kural var
- [ ] Query'de AsNoTracking() kullanılıyor
- [ ] DTO dönülüyor, domain entity değil
- [ ] Controller'da iş mantığı yok — sadece _mediator.Send()
- [ ] Serilog ILogger inject edilmiş
- [ ] Build + test geçiyor
