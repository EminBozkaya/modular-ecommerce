# /refactor-backend
# Backend'deki tespit edilmiş sorunları aktif olarak düzeltir.
# KULLANMADAN ÖNCE: /review-backend ve /review-architecture çalıştırın.
# Kullanım: Claude Code'da `/refactor-backend` yazın.

## ÖNEMLİ
Bu komut kod değiştirir. Çalıştırmadan önce:
1. `git status` ile temiz bir branch'te olduğunuzu doğrulayın
2. `/review-backend` ve `/review-architecture` çıktılarını hazırda bulundurun
3. Hangi adımları uygulayacağınızı belirtin (tümü veya seçili adımlar)

---

## Adım 1 — Katman İhlallerini Düzelt

`/review-architecture` çıktısında tespit edilen katman bağımlılık ihlalleri için:

Her ihlal için:
1. İlgili `.csproj` dosyasını aç
2. Yasak referansı kaldır
3. Gerekirse dependency injection ile çöz
4. `dotnet build` ile derlemeyi doğrula

**Değişiklik öncesi etki analizi yap:** Referansı kaldırmak başka derleme hatası üretir mi?
Üretirse, doğru çözümü öner ve BEKLE — otomatik devam etme.

---

## Adım 2 — Controller İş Mantığını Temizle

`/review-backend` Adım 1'de tespit edilen controller içi iş mantığı için:

Her sorunlu controller metodu için:
1. İş mantığını uygun Command veya Query'ye taşı
2. Controller'da yalnızca `_mediator.Send(command)` bırak
3. Taşınan mantık için unit test ekle (veya var olanı güncelle)

---

## Adım 3 — Eksik Validator'ları Ekle

`/review-backend` Adım 2'de tespit edilen validator eksiklikleri için:

Her Command için eksik validator:
1. `AbstractValidator<TCommand>` sınıfı oluştur
2. Temel kuralları ekle (NotEmpty, MaxLength, Range vb.)
3. Validation pipeline behavior'ın kayıtlı olduğunu doğrula

---

## Adım 4 — Loglama Güvenliğini Düzelt

`/review-backend` Adım 4'te tespit edilen hassas veri loglama için:

Her sorunlu log satırı için:
1. Hassas alanı log'dan kaldır
2. Gerekirse alanı mask'le (`****` gibi)
3. Structured log formatına geçir (string interpolation yerine)

---

## Adım 5 — AsNoTracking Ekle

`/review-backend` Adım 1'de tespit edilen Query handler'lardaki eksik `AsNoTracking()` için:

Her Query handler'a:
1. `AsNoTracking()` ekle
2. Projection kullanıyorsa zaten tracking yok — atla
3. `dotnet test` ile mevcut testlerin hâlâ geçtiğini doğrula

---

## Adım 6 — Nullable Reference Type Uyumsuzluklarını Düzelt

`/review-backend` Adım 6'da tespit edilen nullable uyumsuzlukları için:

1. Gerçekten null olabilecek alanları `string?` ile işaretle
2. `null!` kullanımlarını gözden geçir — gereksizse kaldır
3. `dotnet build` ile sıfır warning hedefle

---

## Sonuç Doğrulama

Tüm adımlar tamamlandıktan sonra:

```bash
dotnet build ECommerce.sln
dotnet test ECommerce.sln
```

Her ikisi de sıfır hata ile geçmeli.
Geçmiyorsa DUR ve hataları raporla — otomatik düzeltme yapma.
