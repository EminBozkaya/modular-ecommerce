---
description: Backend sorunlarını (katman ihlali, validator eksikliği, loglama güvenliği vb.) aktif olarak düzeltir
---

# Backend Refactoring

## ÖNEMLİ
Bu workflow kod değiştirir. Çalıştırmadan önce:
1. `git status` ile temiz bir branch'te olduğunuzu doğrulayın
2. `/review-backend` ve `/review-architecture` çıktılarını hazırda bulundurun
3. Hangi adımları uygulayacağınızı belirtin (tümü veya seçili adımlar)

---

## Adım 1 — Katman İhlallerini Düzelt

Her ihlal için:
1. İlgili `.csproj` dosyasını aç
2. Yasak referansı kaldır
3. Gerekirse dependency injection ile çöz
4. `dotnet build` ile derlemeyi doğrula

---

## Adım 2 — Controller İş Mantığını Temizle

Her sorunlu controller metodu için:
1. İş mantığını uygun Command veya Query'ye taşı
2. Controller'da yalnızca `_mediator.Send(command)` bırak
3. Taşınan mantık için unit test ekle

---

## Adım 3 — Eksik Validator'ları Ekle

Her Command için eksik validator:
1. `AbstractValidator<TCommand>` sınıfı oluştur
2. Temel kuralları ekle (NotEmpty, MaxLength, Range vb.)
3. Validation pipeline behavior'ın kayıtlı olduğunu doğrula

---

## Adım 4 — Loglama Güvenliğini Düzelt

Her sorunlu log satırı için:
1. Hassas alanı log'dan kaldır
2. Gerekirse alanı mask'le
3. Structured log formatına geçir

---

## Adım 5 — AsNoTracking Ekle

Her Query handler'a:
1. `AsNoTracking()` ekle
2. Projection kullanıyorsa zaten tracking yok — atla
3. `dotnet test` ile mevcut testlerin geçtiğini doğrula

---

## Adım 6 — Nullable Reference Type Uyumsuzluklarını Düzelt

1. Gerçekten null olabilecek alanları `string?` ile işaretle
2. `null!` kullanımlarını gözden geçir
3. `dotnet build` ile sıfır warning hedefle

---

## Sonuç Doğrulama

```bash
dotnet build ECommerce.sln
dotnet test ECommerce.sln
```

Her ikisi de sıfır hata ile geçmeli.
Geçmiyorsa DUR ve hataları raporla.
