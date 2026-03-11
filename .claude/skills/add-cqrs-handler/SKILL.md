# add-cqrs-handler
# MediatR CQRS pattern'ine uygun Command veya Query handler olusturur.
# TRIGGER: "command yaz", "query yaz", "handler ekle", "CQRS", "MediatR handler",
#   "command handler", "query handler", "yeni command", "yeni query",
#   "write operation ekle", "read operation ekle", "mediator command"

## Gorev
Projenin CQRS konvansiyonuna uygun Command veya Query + Handler + Validator olustur.
Katman disiplinine uy: Domain → Application → Persistence → API sirasi.

---

## Adim 1 — Tur Belirleme

Kullanicinin istegini analiz et:
- **Veri yazma** (create, update, delete, restore) → Command
- **Veri okuma** (list, get, search, filter) → Query
- Belirsizse SOR — tahminle devam etme

Bounded context tespit et: Catalog | Ordering | Basket | Payment | Identity | Wishlist | Admin

---

## Adim 2 — Command Olusturma (yazma islemi icin)

**Dosya:** `src/ECommerce.Application/{Context}/Commands/{Context}Commands.cs`
(Mevcut dosyaya ekle — yeni dosya OLUSTURMA)

```csharp
public record {Name}Command(...) : IRequest<{ResponseType}>;
```

**Handler:** `src/ECommerce.Application/{Context}/Commands/{Context}CommandHandlers.cs`

```csharp
public class {Name}Handler : IRequestHandler<{Name}Command, {ResponseType}>
{
    // Constructor: repository + ILogger inject et
    // Handle: is mantigi burada, controller'da DEGIL
    // SaveChangesAsync cagir
    // Cache invalidation gerekiyorsa ICacheService kullan
}
```

**Validator:** `src/ECommerce.Application/{Context}/Commands/{Context}CommandValidators.cs`

```csharp
public class {Name}CommandValidator : AbstractValidator<{Name}Command>
{
    // NotEmpty, MaxLength, Range vb. kurallar
    // Bos validator YASAK — en az bir kural olmali
}
```

---

## Adim 3 — Query Olusturma (okuma islemi icin)

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
    // Projection/DTO don — domain entity dogrudan DONME
    // Gereksiz Include() YASAK
}
```

---

## Adim 4 — DTO Tanimla

`src/ECommerce.Application/{Context}/` altinda DTO record'u ekle:
- Immutable record type kullan
- Sadece gerekli alanlari dahil et
- Domain entity dogrudan expose ETME

---

## Adim 5 — Controller Endpoint (istenmisse)

`src/ECommerce.API/Controllers/{Context}Controller.cs`

```csharp
[HttpPost/Get/Put/Delete("route")]
public async Task<IActionResult> {Name}([FromBody/Query] request)
{
    var result = await _mediator.Send(command/query);
    return Ok(result); // SADECE orchestration — is mantigi YASAK
}
```

---

## Adim 6 — Dogrulama

```bash
dotnet build ECommerce.sln --no-restore
dotnet test ECommerce.sln --no-build
```

Sifir hata ile gecmeli. Gecmezse duzelt.

---

## Kontrol Listesi
- [ ] Handler IRequestHandler implement ediyor
- [ ] Command icin Validator mevcut ve en az bir kural var
- [ ] Query'de AsNoTracking() kullaniliyor
- [ ] DTO donuluyor, domain entity degil
- [ ] Controller'da is mantigi yok — sadece _mediator.Send()
- [ ] Serilog ILogger inject edilmis
- [ ] Build + test geciyor
