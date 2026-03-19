<div align="center">
  <table>
    <tr>
      <td align="center" width="100" bgcolor="#e5e7eb"><b><a href="README.tr.md"><img src="https://flagcdn.com/w40/tr.png" height="18" alt="TR" /><br/>TR<br/>Türkçe 🟢</a></b></td>
      <td align="center" width="100"><a href="README.md"><img src="https://flagcdn.com/w40/gb.png" height="18" alt="EN" /><br/><b>EN</b><br/>English</a></td>
      <td align="center" width="100"><a href="README.de.md"><img src="https://flagcdn.com/w40/de.png" height="18" alt="DE" /><br/><b>DE</b><br/>Deutsch</a></td>
      <td align="center" width="100"><a href="README.fr.md"><img src="https://flagcdn.com/w40/fr.png" height="18" alt="FR" /><br/><b>FR</b><br/>Français</a></td>
      <td align="center" width="100"><a href="README.es.md"><img src="https://flagcdn.com/w40/es.png" height="18" alt="ES" /><br/><b>ES</b><br/>Español</a></td>
      <td align="center" width="100"><a href="README.ru.md"><img src="https://flagcdn.com/w40/ru.png" height="18" alt="RU" /><br/><b>RU</b><br/>Русский</a></td>
      <td align="center" width="100"><a href="README.ar.md"><img src="https://flagcdn.com/w40/sa.png" height="18" alt="AR" /><br/><b>AR</b><br/>العربية</a></td>
    </tr>
  </table>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/.NET-10.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" />
  <img src="https://img.shields.io/badge/C%23-14-239120?style=for-the-badge&logo=csharp&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-Cache-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Architecture-Clean%20%2B%20CQRS%20%2B%20DDD-blueviolet?style=for-the-badge" />
</p>

<h1 align="center">ECommerce Platform</h1>

<p align="center">
  <b>Full-stack, kapsamlı e-ticaret platformu</b><br/>
  <sub>.NET 10 API + React SPA | Modüler Monolit | Temiz Mimari | CQRS | DDD</sub>
</p>

<p align="center">
  <a href="#-özellikler">Özellikler</a> &bull;
  <a href="#-mimari">Mimari</a> &bull;
  <a href="#-proje-yapısı">Yapı</a> &bull;
  <a href="#-nasıl-kurulur-ve-çalıştırılır">Kurulum</a> &bull;
  <a href="#-api-referansı">API</a> &bull;
  <a href="#-güvenlik">Güvenlik</a> &bull;
  <a href="#-yol-haritası">Yol Haritası</a>
</p>

---

## ✨ Bu Platformu Diğerlerinden Ayıran Nedir?

Bu proje sıradan bir e-ticaret şablonu değildir; doğrudan Admin Paneli üzerinden maksimum UI/UX esnekliği sağlamak üzere tasarlanmış **tamamen özelleştirilebilir, white-label bir platformdur**.

* **Tam Tasarım Kontrolü:** Yöneticiler koda dokunmadan görsel kimliği sorunsuzca değiştirebilir. Herhangi bir marka kimliğine mükemmel şekilde uyum sağlaması için logoları anında değiştirebilir, global renk paletini güncelleyebilir ve metin fontlarını ayarlayabilirsiniz.
* **Esnek Düzenler:** Vitrin menüleri isteğe göre sıralanabilir. Header (Üst Bilgi) ve Footer (Alt Bilgi) bölümleri yüksek oranda yapılandırılabilir; promosyon Banner'ları tercihinize göre kayan yazı (marquee) veya sabit bloklar olarak değiştirilebilir.
* **Vitrin Özelleştirmesi:** Ana sayfa ve vitrin tamamen modülerdir. Ana kategoriler, müşteri yorumları ve e-bülten blokları gibi bölümler dinamik olarak etkinleştirilebilir, devre dışı bırakılabilir veya tamamen özelleştirilebilir.
* **Derinlemesine Çoklu Dil Desteği (7 Dil):** Yukarıda bahsedilen her bir tasarım özelleştirmesi ve tüm ürün/kategori verileri önceden entegre edilmiş 7 dil genelinde dinamik olarak çalışır. Yeni bir ürün veya kategori eklendiğinde, yöneticiler bu 7 dilin herhangi biri için çevirileri kolayca belirleyebilir ve küresel çapta yerelleştirilmiş bir alışveriş deneyimi sunulabilir.

---

## Özellikler

<table>
<tr>
<td width="50%">

### Vitrin (React SPA)
- **Ürün kataloğu** &mdash; arama, kategori filtresi, sayfalama, sıralama
- **Ana sayfa** &mdash; öne çıkan ürünler, otomatik tamamlamalı arama
- **Çoklu dil** &mdash; TR / EN / DE vb. dile özel arama; dilden bağımsız mimari (her kurulum kendi varsayılan dilini seçebilir)
- **Ziyaretçi + üye sepeti** &mdash; fiyat anlık görüntüleriyle kalıcı sepet, birime duyarlı miktarlar (kg, adet, litre)
- **Ödeme akışı** &mdash; teslimat adresi &rarr; ödeme (2 adımlı orkestrasyon)
- **Sipariş geçmişi** &mdash; durum takibi, sipariş detay görünümü
- **İstek Listesi / Favoriler** &mdash; ürünleri daha sonrası için kaydetme
- **Kimlik Doğrulama** &mdash; giriş, kayıt, oturum yenileme, giriş sonrası yönlendirme
- **Güvenli ödemeler** &mdash; token tabanlı, birbiriyle çakışmayan (idempotent), kart verisi saklanmayan sistem

</td>
<td width="50%">

### Admin Paneli
- **Dashboard** &mdash; özet kartları, gelir grafiği, son siparişler, düşük stok uyarıları
- **Ürün yönetimi** &mdash; CRUD, stok kontrolü, geçici silme (soft delete) ve geri getirme
- **Kategori yönetimi** &mdash; CRUD, ebeveyn-çocuk hiyerarşisi, geçici silme ve geri getirme
- **Çeviri editörü** &mdash; dillere göre ürün/kategori isimlerini yönetmek için sekme tabanlı arayüz
- **Sipariş yönetimi** &mdash; durum filtreli liste, detay görünümü, onaylı durum geçişleri
- **Kullanıcı yönetimi** &mdash; müşteri listesi, isim/eposta ile arama
- **Veri dışa aktarımı** &mdash; ürünler, kategoriler, siparişler ve kullanıcılar için CSV/Excel çıktısı
- **Role dayalı erişim** &mdash; tüm admin rotaları `[Authorize(Roles = "Admin")]` ile korunur

</td>
</tr>
</table>

---

## Mimari

Sıkı Clean Architecture (Temiz Mimari) katman ayrımına sahip, MediatR üzerinden CQRS kullanan ve Domain-Driven Design (Alan Odaklı Tasarım) tabanlı Modüler Monolit. Katman bağımlılığı kuralları derleme zamanında `NetArchTest.Rules` ile denetlenir.

### Dilden Bağımsız Çoklu Dil Tasarımı

Tüm ürün ve kategori ekran adları, `(EntityId, LanguageCode)` ikilisine bağlı özel çeviri tablolarında (`ProductTranslations`, `CategoryTranslations`) saklanır. Hiçbir dil sabit "temel" dil olarak kodlanmamıştır — desteklenen her dil doğrudan bir akrandır.

`appsettings.json` içindeki `DefaultLanguage` değeri, istenen dil için çeviri bulunmadığında hangi dilin yedek olarak hareket edeceğini belirler. Almanya'daki bir kurulum `DefaultLanguage: "de"` ayarlar ve adminler ilk olarak Almanca içerikleri girer; Türkçe veya İngilizce sonradan çeviri editörü ile eklenebilir.

Bu tasarım, projeyi gerçekten marka-bağımsız (white-label) ve küresel çapta deploy edilebilir yapar.

```text
+--------------------------------------------------------------+
|                         API Katmanı                           |
|              Controllers | Middleware | DI                    |
+--------------------------------------------------------------+
|                              |                                |
|  +-----------------------+   +----------------------------+   |
|  |     Altyapı           |   |       Veritabanı           |   |
|  |  -----------------    |   |  ----------------------     |   |
|  |  JWT Service          |   |  EF Core DbContext         |   |
|  |  Redis Cache          |   |  Fluent API Configs        |   |
|  |  Payment (Stub)       |   |  Aggregate Repositories    |   |
|  |  CurrentUserSvc       |   |  Soft-Delete Interceptor   |   |
|  +----------+------------+   +-------------+--------------+   |
|             |                              |                  |
|             v                              v                  |
|  +--------------------------------------------------------+  |
|  |                  Uygulama Katmanı                        |  |
|  |  Komutlar ve Sorgular (MediatR CQRS)                    |  |
|  |  Boru Hattı: Validation -> Logging -> Caching -> Handler|  |
|  |  FluentValidation | Serilog | Redis                     |  |
|  |  NO EF Core (EF Core bağımlılığı yoktur)                  |  |
|  +----------------------------+---------------------------+   |
|                               |                               |
|                               v                               |
|  +--------------------------------------------------------+  |
|  |                    Alan (Domain) Katmanı                 |  |
|  |  Entities & Aggregates | Value Objects (Money, Stock)    |  |
|  |  Repository Interfaces | Business Invariants            |  |
|  |  SIFIR altyapı bağımlılığı                               |  |
|  +--------------------------------------------------------+  |
+--------------------------------------------------------------+

+--------------------------------------------------------------+
|                     Önyüz (React SPA)                        |
|  Vite + TypeScript | TailwindCSS + shadcn/ui                 |
|  React Query (sunucu durumu) | Zustand (Arayüz durumu)       |
|  Mock/Real API Değişimi | Lazy loading | Protected routes    |
+--------------------------------------------------------------+
```

### Bağlamlar (Bounded Contexts)

| Context | Domain Entities | Temel Kurallar |
|---------|-----------------|----------------|
| **Katalog** | Product, Category, Unit | Money (Para) değişmez ve negatif olamaz, StockQuantity >= 0, kategori hiyerarşisi |
| **Sepet** | Basket, BasketItem | Ekleme anında fiyatın kopyalanması, misafir (sessionId) + üye (userId), ağırlık için ondalıklı adet |
| **Sipariş** | Order, OrderItem | Durum makinesi (Beklemede &rarr; Ödendi &rarr; İşleniyor &rarr; Kargolandı &rarr; Teslim Edildi / İptal) |
| **Ödeme** | PaymentRecord | Tekrar engellemesi (Idempotency) unique (OrderId, IdempotencyKey) index'i ile sağlanır |
| **Kimlik** | AppUser | PBKDF2 şifreleme, httpOnly çerezlerle JWT, oturum token rotasyonu |
| **İstek Listesi** | WishlistItem | Kullanıcı + ürün bazında tek kayıt |

---

## Proje Yapısı

```text
ECommerce/
+-- ECommerce.sln
+-- src/
|   +-- ECommerce.Domain/            <- Saf domain (sıfır bağımlılık)
|   |   +-- Common/                     BaseEntity, BaseAuditableEntity, ISpecification
|   |   +-- Catalog/                    Product, Category, Unit, Money, StockQuantity
|   |   +-- Basket/                     Basket, BasketItem (fiyat kopyası)
|   |   +-- Ordering/                   Order, OrderItem, OrderStatus
|   |   +-- Payment/                    PaymentRecord, PaymentStatus
|   |   +-- Identity/                   AppUser, UserRole
|   |   +-- Wishlist/                   WishlistItem
|   |
|   +-- ECommerce.Application/       <- CQRS Komutları & Sorguları (EF Core YOK)
|   |   +-- Common/                     Boru hatları (Validation, Logging, Caching)
|   |   +-- Catalog/                    Product & Category CRUD, Stock, Units
|   |   +-- Basket/                     Ekle, Güncelle, Sil, Temizle, Getir
|   |   +-- Ordering/                   SiparişOluştur, DurumGüncelle, Sil/GeriAl
|   |   +-- Payment/                    Ödemeİşle (idempotent)
|   |   +-- Identity/                   Register, Login, Refresh, Logout, MevcutKullanıcı
|   |   +-- Wishlist/                   Ekle, Çıkar, Getir
|   |   +-- Admin/Queries/              Dashboard analizleri
|   |
|   +-- ECommerce.Persistence/       <- EF Core + PostgreSQL
|   |   +-- Context/                    ApplicationDbContext (Genel sorgu filtreleri)
|   |   +-- Configurations/             Entity yapılandırmaları (Fluent API)
|   |   +-- Interceptors/               Audit ve SoftDelete Interceptor'ları
|   |   +-- Repositories/               Özel aggregate repositor'leri
|   |   +-- Migrations/                 Migration dosyaları
|   |
|   +-- ECommerce.Infrastructure/    <- Dış ilgiler (External concerns)
|   |   +-- Identity/                   JwtService, CurrentUserService
|   |   +-- Payment/                    StubPaymentService
|   |   +-- Caching/                    RedisCacheService
|   |
|   +-- ECommerce.API/               <- Orkestratör (İş mantığı barındırmaz)
|       +-- Controllers/                Katalog, Sepet, Sipariş, Ödeme, Kimlik, İstek
|       +-- Controllers/Admin/          AdminController (role bağlı CRUD + dashboard)
|       +-- Middlewares/                Hata yakalama ara katmanı
|       +-- Extensions/                 DI ayarları, önbellek yardımcıları
|
+-- src/ECommerce.Web/               <- React SPA (Vite + TypeScript)
|   +-- src/
|       +-- api/                        Axios istemcisi (withCredentials) + error handling
|       +-- app/                        Yönlendirme (React Router v6) + Sağlayıcılar
|       +-- components/                 Paylaşılan Arayüz + Layoutlar (Main, Admin)
|       +-- features/                   Katalog, Kimlik, Sepet, Sipariş, Admin, Favoriler
|       +-- store/                      Zustand veri merkezleri
|       +-- utils/                      queryKey tutucular, fiyat formları, vs.
|
+-- tests/                           <- Birim(Unit), Mimari ve Entegrasyon testleri
```

### Bağımlılık Akışı

```text
Domain         <- (Bağımsız -- SIFIR referans)
Application    <- Domain
Persistence    <- Domain (yalnızca)
Infrastructure <- Domain, Application
API            <- Application, Persistence, Infrastructure
```

> Persistence sadece Domain'e bağlıdır — Application'a değil. Repository arayüzleri Domain'de yaşar, uygulanmaları Persistence'da.

---

## 🚀 Nasıl Kurulur ve Çalıştırılır

Bu projeyi çalıştırmanın iki basit yolu vardır. Sadece arayüzü, tasarım özelliklerini ve önyüz akışını hızlıca incelemek isterseniz **Mock Data (Sahte Veri)** yaklaşımını kullanın. Arka uç mimarisini tam manasıyla ayağa kaldırmak için **Full Stack (Tam Yığın)** versiyonunu seçin.

### Ön Koşullar

| Araç | Sürüm | Gereksinim |
|------|-------|------------|
| [Node.js](https://nodejs.org/) | 18+ | Frontend & Mock Data için Zorunlu |
| [.NET SDK](https://dotnet.microsoft.com/download) | 10.0+ | Full Stack API için Zorunlu |
| [Docker](https://www.docker.com/) | Son Sürüm | Full Stack veritabanları için tavsiye edilir |

---

### Seçenek 1: Mock Data ile Çalıştır (En Hızlısı) ⚡
Bu mod **yalnızca React SPA'yı (Önyüz)** çalıştırır. Arka uç yerel olarak tamamen sahte verilerle taklit edilir, veritabanı kurmadan arayüzü, 7 ayrı dili, sepet ve tasarım süreçlerini anında görmenizi sağlar.

```bash
# 1. Depoyu klonlayın ve önyüz dizinine gidin
git clone <repo-url>
cd ECommerce/src/ECommerce.Web

# 2. Bağığımlıkları yükleyin
npm install

# 3. Ortamın Mock API kullanacak şekilde ayarlandığından emin olun
# .env.development.local dosyasındaki ayar:
# VITE_USE_MOCK_API=true

# 4. Geliştirme sunucusunu başlatın
npm run dev
```

*Hepsi bu kadar!* Tarayıcınızdan Vite'in vereceği localhost linkini açarak UI üzerinde anında gezinebilirsiniz.

---

### Seçenek 2: Full Stack Çalıştır (Gerçek Veritabanı & Redis) 🏗️
Bu durum uygulamanın tamamen işlevsel .NET 10 API'si ile arkada PostgreSQL, Redis kullanarak, önyüzün de doğrudan bunlara bağlanarak çalışmasını sağlar.

#### Adım A: Altyapı Hazırlığı (Docker)
Öncelikle PostgreSQL ve Redis'i Docker üzerinden ayağa kaldırın:
```bash
# PostgreSQL konteynerini başlatın
docker run -d --name ecommerce-db -e POSTGRES_USER=postgresUser -e POSTGRES_PASSWORD=postgresPassword -e POSTGRES_DB=ECommerceDb -p 5432:5432 postgres:16-alpine

# Redis konteynerini başlatın
docker run -d --name ecommerce-redis -p 6379:6379 redis:7-alpine
```

#### Adım B: .NET API'sini Çalıştırın
```bash
# Yeni bir terminal açıp çözüm (solution) ana klasörüne gidin
cd ECommerce

# Entity Framework migration'larını veritabanına uygulayın
dotnet ef database update --project src/ECommerce.Persistence --startup-project src/ECommerce.API

# Backend API'yi başlatın
dotnet run --project src/ECommerce.API
```
*API ayağa kalkmış olacak ve `https://localhost:5001/swagger` adresinden görüntülenebilecektir.*

#### Adım C: Frontend Kısmını Çalıştırın
Pencerenin diğer terminalinde:
```bash
cd ECommerce/src/ECommerce.Web

# Bağımlılıkları yükleyin
npm install

# .env.development.local üzerinde ortam değişkenini gerçek API'ye ayarlayın:
# VITE_USE_MOCK_API=false
# VITE_API_BASE_URL=https://localhost:5001

# Önyüzü çalıştırın
npm run dev
```

*🎉 Tebrikler! Şu anda Modüler Monolith mimariyi uçtan uca baştan aşağı tam sürümüyle çalıştırıyorsunuz!*

---

## API Referansı

### Açık Uç Noktalar

| Metot | Uç Nokta (Endpoint) | Açıklama |
|-------|---------------------|----------|
| `GET` | `/api/catalog/products` | Ürünleri listele (arama, filtre vb.) |
| `GET` | `/api/catalog/products/{id}` | Ürün detayı |
| `GET` | `/api/catalog/categories` | Kategorileri listele |
| `GET` | `/api/catalog/units` | Ölçü birimlerini listele |
| `GET` | `/api/basket` | Güncel sepeti görüntüle |
| `POST` | `/api/basket/items` | Sepete ürün ekle |
| `PUT` | `/api/basket/items` | Sepet miktarını güncelle |
| `DELETE` | `/api/basket/items/{productId}` | Ürünü sepetten çıkar |
| `DELETE` | `/api/basket` | Sepeti temizle |
| `POST` | `/api/order` | Sepetten sipariş yarat |
| `POST` | `/api/payment` | Ödemeyi tamamla |

### Kimlik Doğrulama Uç Noktaları

| Metot | Uç Nokta | Açıklama |
|-------|----------|----------|
| `POST` | `/api/auth/register` | Yeni hesap oluştur (httpOnly cookie ayarlar) |
| `POST` | `/api/auth/login` | Giriş (httpOnly cookie ayarlar) |
| `GET` | `/api/auth/me` | Güncel kullanıcı (session geri çağırma) |
| `POST` | `/api/auth/refresh` | Yenileme token rotasyonu |
| `POST` | `/api/auth/logout` | Çerezleri temizle ve çıkış yap |

### Korumalı Uç Noktalar `[Authorize]`

| Metot | Uç Nokta | Açıklama |
|-------|----------|----------|
| `GET` | `/api/order/{id}` | Sipariş detayı al |
| `GET` | `/api/order/my` | Mevcut kullanıcının önceki siparişleri |
| `GET` | `/api/wishlist` | İstek listesi |
| `GET` | `/api/wishlist/product-ids` | İstek listesindeki id'leri toplu döndürür |
| `POST` | `/api/wishlist/{productId}` | İstek listesine ekle |
| `DELETE` | `/api/wishlist/{productId}` | İstek listesinden çıkar |
| `DELETE` | `/api/wishlist` | İstek listesini temizle |

### Yönetici Uç Noktaları `[Authorize(Roles = "Admin")]`

| Metot | Uç Nokta | Açıklama |
|-------|----------|----------|
| `POST` | `/api/admin/products` | Ürün oluştur |
| `PUT` | `/api/admin/products` | Ürün güncelle |
| `DELETE` | `/api/admin/products/{id}` | Ürünü pasife al (soft delete) |
| `POST` | `/api/admin/products/restore/{id}` | Ürünü geri getir |
| `PUT` | `/api/admin/products/stock` | Stok güncelle |
| `POST` | `/api/admin/categories` | Kategori oluştur |
| `PUT` | `/api/admin/categories` | Kategori güncelle |
| `DELETE` | `/api/admin/categories/{id}` | Kategoriyi pasife al |
| `POST` | `/api/admin/categories/restore/{id}` | Kategoriyi geri getir |
| `GET` | `/api/admin/users` | Tüm müşterileri listele |
| `GET` | `/api/admin/orders` | Tüm siparişleri listele (sayfalı) |
| `GET` | `/api/admin/orders/{id}` | Sipariş detayları |
| `PUT` | `/api/admin/orders/{id}/status` | Siparişin durumunu güncelle |
| `DELETE` | `/api/admin/orders/{id}` | Siparişi geçici sil |
| `POST` | `/api/admin/orders/restore/{id}` | Siparişi geri yükle |
| `GET` | `/api/admin/dashboard/summary` | Dashboard özet verileri |
| `GET` | `/api/admin/dashboard/revenue` | Gelir analizleri |
| `GET` | `/api/admin/dashboard/recent-orders` | Son verilen siparişler |
| `GET` | `/api/admin/dashboard/low-stock` | Düşük stoklu ürün bildirimleri |

---

## Güvenlik

| Özellik | Gerçekleştirim (Implementation) |
|---------|----------------|
| Kimlik | **httpOnly secure cookies** (localStorage kullanılmaz) vasıtasıyla JWT |
| Jeton Döngüsü | Her kullanımda zorunlu olarak token (refresh token) güncellenmesi |
| Jeton Ömrü | 15 dakikalık access token'lar, sıfır saat sapması |
| Parola Şifreleme | SHA-256 ile PBKDF2 (100.000 döngü) |
| Ödeme Güvenliği | **Kesinlikle token bazlıdır** &mdash; Hiçbir kart bilgisi sistemde depolanmaz |
| Ödeme İstikrarı | Unique `(OrderId, IdempotencyKey)` indeksi, çift/tekrarlı çekimleri kalıcı olarak engeller |
| Hız Sınırlandırma | IP başına dakikada maksimum 100 istek (FixedWindowLimiter) |
| CORS | Güvenli çerezlerle ve yalnızca sıkı **beyaz-liste** kurallarıyla (whitelist policy) yapılandırılmıştır |
| Veri Silinmesi | "Soft Delete" aracılığıyla hiçbir veri sistemden fiziksel olarak kalkmaz |
| Önyüz Koruması | Yalnızca kullanıcı deneyimi (UX) bazlıdır, doğrulamaların nihai karar merkezi daima Backend'dir |
| Yönetici Erişimi | Yönetici (Admin) eylemleri tamamen `[Authorize(Roles = "Admin")]` etiketiyle sınırlıdır |

---

## Teknoloji Yığını

<table>
<tr><th colspan="4">Arka Uç (Backend)</th><th colspan="4">Ön Yüz (Frontend)</th></tr>
<tr>
<td align="center"><b>Platform</b></td>
<td align="center"><b>ORM</b></td>
<td align="center"><b>Veritabanı</b></td>
<td align="center"><b>Önbellek</b></td>
<td align="center"><b>Framework</b></td>
<td align="center"><b>Durum(State)</b></td>
<td align="center"><b>UI (Arayüz)</b></td>
<td align="center"><b>Build (Derleme)</b></td>
</tr>
<tr>
<td align="center">.NET 10 / C# 14</td>
<td align="center">EF Core 10</td>
<td align="center">PostgreSQL 16</td>
<td align="center">Redis</td>
<td align="center">React 19</td>
<td align="center">React Query + Zustand</td>
<td align="center">TailwindCSS + shadcn/ui</td>
<td align="center">Vite</td>
</tr>
<tr>
<td align="center"><b>CQRS</b></td>
<td align="center"><b>Doğrulama</b></td>
<td align="center"><b>Log Tutma</b></td>
<td align="center"><b>Test</b></td>
<td align="center"><b>Rotasyon</b></td>
<td align="center"><b>İstemci (HTTP)</b></td>
<td align="center"><b>Tablolar</b></td>
<td align="center"><b>Grafikler</b></td>
</tr>
<tr>
<td align="center">MediatR</td>
<td align="center">FluentValidation</td>
<td align="center">Serilog</td>
<td align="center">xUnit + FluentAssertions</td>
<td align="center">React Router v6</td>
<td align="center">Axios</td>
<td align="center">AG Grid</td>
<td align="center">Recharts</td>
</tr>
</table>

---

## Yol Haritası

### Tamamlananlar

- [x] Temel mimari dizaynı ve proje iskeleti (Modular Monolith + Clean Architecture)
- [x] Domain Driven Design öğeleri bulunduran kalıcı modeller (valua object, entity vb.)
- [x] Bilgi merkezli EF Core + PostgreSQL (Code First, Fluent API, soft-delete eklentisi)
- [x] CQRS temelli MediatR tabanı kurulumları (commands, queries, pipeline modülleri)
- [x] JWT oturum sistemi kurulumu (httpOnly cookies, token yenilemeleri)
- [x] Tematik Özel Repository kalıpları
- [x] Misafir ve tam üye kullanımı ile aktif olan Sepet sistemi ve geçmiş fiyat takip özellikleri
- [x] Güvenilir sipariş ödeme idempotency mimarisi (IdempotencyKey + unique index)
- [x] Sisteme Redis Cache entegrasyonu (MediatR aracı olarak kullanıldı)
- [x] Kapsamlı (Structured) rapor ve log dökümü tutma sistemi (Serilog)
- [x] Evrensel (Global) Hata denetimi aracı (Middleware)
- [x] Çoklu sistem koruyucuları (Rate limit sınırları ve CORS filtrelemeleri)
- [x] Unit test (domain testleri ve işlem testleri)
- [x] Temel Mimari (NetArchTest) katmanlarının kurallı testi
- [x] React SPA paneli sistemi (Vite + TypeScript) aktif hâle getirilmesi
- [x] Ürün katalog sayfası yapısı (liste, kategori, detay, sayfalama ve özel veri aratma aracı)
- [x] Sisteme giriş (Login, Register), yetkilendirme yönlendirmesi uygulamaları
- [x] Müşteri web sepet arayüzü
- [x] Sepet ödeme döngüsü, onay ekran formülasyonu, sipariş yönetim tabloları
- [x] Tüm kullanıcılara açık istek (Wishlist / Favorites) yönetim sekmesi
- [x] Satış izlenimi yaratan Yönetici "Dashboard" grafik ve uyarı sistemleri (Summary, Chart v.b)
- [x] Detaylı Yönetici paneli tabanlı Kategori, Ürün eklenti sistemleri
- [x] Yönetici bazlı Sipariş onay durum değişim sistemleri
- [x] Yönetici kullanıcı (Müşteri) analiz ekranı arama tabloları
- [x] İsteğe göre yerel 'Mock' ya da API arası tek tuşla geçiş sağlayıcı 'Toggle' opsiyonu (env değişkeni)
- [x] Çoklu Dil Mimarisi (TR/EN/DE) Redis Cache entegreli, Accept-Language tabanlı tam dil altyapısı çapraz veri okuyucu
- [x] Çeviri mimarisinin TR tabanlı karma durumdan merkezi çoklu esnek veritabanı (translation table) yapısına alınması
- [x] Admin panelinden tabanlı aktif Kategori/Ürün dil ayarlama arayüzü modülü

### Devam Edenler

- [ ] **Yapay Zeka Destekli Çeviri API'si** — Tamamen eklenen menülerin anında sistem içerisine otomatik dağıtım mekanizmalarının entegrasyonu

### Yaklaşan Hedefler

- [ ] Tam Ödeme Sağlayıcıları Entegratörlüğü bağlayışları (Iyzico / Stripe vs.)
- [ ] Email güvenlik onay bağlantıları (Confirmation Flow)
- [ ] Temel Entegrasyon test serileri
- [ ] Tüm sistem parçacıkları için kapsamlı tam teşekküllü (Docker Compose container) operasyon testleri
- [ ] CI/CD Devre Mimarisi Boru Hattı — Azure DevOps / GitHub Actions
- [ ] Azure Container Apps tam dağıtım
- [ ] Gizli uygulama veri anahtarı deposu sağlama işlemleri (Azure Key Vault)

---

<p align="center">
  <sub>.NET 10 &bull; React &bull; Clean Architecture &bull; CQRS &bull; DDD ile inşa edildi</sub>
</p>
