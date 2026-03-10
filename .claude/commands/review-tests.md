# /review-tests
# Test kalitesini, coverage anlamlılığını ve architecture test uyumunu inceler.
# Kullanım: Claude Code'da `/review-tests` yazın.

## Görev
`tests/` altındaki tüm test projelerini aşağıdaki adımlarla incele.
Format: "✅ Temiz" veya "⚠️ [dosya:satır] — açıklama"

---

## Adım 1 — Unit Test Varlık Kontrolü

`ECommerce.UnitTests/` altını tara:

Aşağıdaki her alan için test sınıfı var mı?
- Domain entity'leri (Product, Order, Basket vb.)
- Value object'ler (Money, StockQuantity)
- Command handler'lar (en az kritik olanlar)
- Domain invariant'ları (örn: negatif stok, sıfır fiyat engeli)

Eksik olan test alanlarını listele.

---

## Adım 2 — Unit Test Kalite Kontrolü

Mevcut unit test'leri incele:

**Naming convention:**
- Test metot isimleri `MethodName_Scenario_ExpectedResult` formatında mı?
- Anlaşılmaz isimler (`Test1`, `TestMethod`) var mı? → UYARI

**Test içeriği:**
- AAA pattern (Arrange / Act / Assert) uygulanıyor mu?
- Assert'siz test var mı? → YASAK
- Birden fazla davranışı test eden (multiple Act) test var mı? → UYARI
- Magic number/string kullanımı var mı? (sabit tanımlanmamış) → UYARI

**Mock kullanımı:**
- NSubstitute doğru kullanılıyor mu?
- Gerçek DB veya HTTP çağrısı yapan unit test var mı? → YASAK

---

## Adım 3 — Domain Invariant Test Kontrolü

Domain entity'lerinin invariant'larını test eden case'ler var mı?

Kontrol edilmesi gereken senaryolar:
- `StockQuantity` negatif olamaz → test var mı?
- `Money` amount sıfırdan küçük olamaz → test var mı?
- Sipariş iptali yalnızca uygun statüslerde yapılabilir → test var mı?
- Basket'e stoksuz ürün eklenemiyor mu → test var mı?

Eksik invariant testlerini listele.

---

## Adım 4 — Architecture Test Kontrolü

`ECommerce.ArchitectureTests/` altındaki test sınıflarını incele:

Aşağıdaki kurallar test ediliyor mu?
- Domain → Infrastructure referansı yok
- Application → EF Core referansı yok
- Controller'lar → sadece MediatR kullanıyor
- Domain entity'leri → public setter yok (encapsulation)

Eksik olan architecture test kurallarını listele.

---

## Adım 5 — Integration Test Durumu

`ECommerce.IntegrationTests/` klasörünü incele:

- Placeholder mı yoksa gerçek test var mı?
- Varsa: in-memory DB mi yoksa test container mı kullanıyor?
- En az şu akışlar için test var mı:
  - Ürün oluşturma → listeleme
  - Login → token cookie set
  - Sepete ürün ekleme

Durumu raporla, eksikleri listele.

---

## Adım 6 — Test Çalıştırma Kontrolü

```bash
dotnet test ECommerce.sln --no-build
```
komutunun çıktısını analiz et:

- Kaç test var, kaçı geçiyor?
- Başarısız test var mı?
- Skip edilmiş test var mı? Gerekçesi var mı?

---

## Özet Rapor

| Adım | Durum | Bulgu Sayısı |
|------|-------|--------------|
| Unit test varlığı | ✅/⚠️ | N |
| Unit test kalitesi | ✅/⚠️ | N |
| Domain invariant testleri | ✅/⚠️ | N |
| Architecture testleri | ✅/⚠️ | N |
| Integration test durumu | ✅/⚠️ | N |
| Test çalıştırma | ✅/⚠️ | N |

**En kritik eksik testler (öncelik sırasıyla):**
