<p align="center">
  <a href="README.tr.md"><img src="https://flagcdn.com/w40/tr.png" width="32" alt="Türkçe" /></a>&nbsp;&nbsp;&nbsp;
  <a href="README.md"><img src="https://flagcdn.com/w40/gb.png" width="32" alt="English" /></a>&nbsp;&nbsp;&nbsp;
  <a href="README.de.md"><img src="https://flagcdn.com/w40/de.png" width="32" alt="Deutsch" /></a>&nbsp;&nbsp;&nbsp;
  <a href="README.fr.md"><img src="https://flagcdn.com/w40/fr.png" width="32" alt="Français" /></a>&nbsp;&nbsp;&nbsp;
  <a href="README.es.md"><img src="https://flagcdn.com/w40/es.png" width="32" alt="Español" /></a>&nbsp;&nbsp;&nbsp;
  <a href="README.ru.md"><img src="https://flagcdn.com/w40/ru.png" width="32" alt="Русский" /></a>&nbsp;&nbsp;&nbsp;
  <a href="README.ar.md"><img src="https://flagcdn.com/w40/sa.png" width="32" alt="العربية" /></a>
</p>

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
  <a href="#-başlangıç">Başlangıç</a> &bull;
  <a href="#-api-referansı">API</a> &bull;
  <a href="#-güvenlik">Güvenlik</a> &bull;
  <a href="#-yol-haritası">Yol Haritası</a>
</p>

---

## ✨ Bu Platformu Diğerlerinden Ayıran Nedir?

Bu proje sıradan bir e-ticaret şablonu değildir; doğrudan Admin Paneli üzerinden maksimum UI/UX esnekliği sağlamak üzere tasarlanmış **tamamen özelleştirilebilir, white-label bir platformdur**.

* **Tam Tasarım Kontrolü:** Yöneticiler koda dokunmadan görsel kimliği sorunsuzca değiştirebilir. Herhangi bir marka kimliğine mükemmel şekilde uyum sağlaması için logoları anında değiştirebilir, global renk paletini güncelleyebilir ve metin fontlarını ayarlayabilirsiniz.
* **Esnek Düzenler:** Vitrin menüleri isteğe göre sıralanabilir. Header ve Footer bölümleri yüksek oranda yapılandırılabilir; promosyon Banner'ları tercihinize göre kayan yazı (marquee) veya sabit bloklar olarak değiştirilebilir.
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
- **Çoklu dil** &mdash; dile özel arama destekli dinamik altyapı; dilden bağımsız mimari (her kurulum kendi varsayılan dilini seçebilir)
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

Tüm ürün ve kategori ekran adları, `(EntityId, LanguageCode)` ikilisine bağlı özel çeviri tablolarında (`ProductTranslations`, `CategoryTranslations`) saklanır. Hiçbir dil sabit "temel" dil olarak kodlanmamıştır — desteklenen her dil eşittir.

`appsettings.json` içindeki `DefaultLanguage` değeri, istenen dil için çeviri bulunmadığında hangi dilin yedek olarak hareket edeceğini belirler.

```
+--------------------------------------------------------------+
|                         API Katmanı                           |
|              Controller | Middleware | DI                   |
+--------------------------------------------------------------+
|                              |                                |
|  +-----------------------+   +----------------------------+   |
|  |     Altyapı (Infra)   |   |        Veri (Persistence)   |   |
|  |  -----------------    |   |  ----------------------     |   |
|  |  JWT Service          |   |  EF Core DbContext         |   |
|  |  Redis Cache          |   |  Fluent API Configs        |   |
|  |  Payment (Stub)       |   |  Aggregate Repositories    |   |
|  |  CurrentUserService   |   |  Soft-Delete Interceptor   |   |
|  +----------+------------+   +-------------+--------------+   |
|             |                              |                  |
|             v                              v                  |
|  +--------------------------------------------------------+  |
|  |                  Uygulama Katmanı                        |  |
|  |  Komutlar ve Sorgular (MediatR CQRS)                    |  |
|  |  Boru Hattı: Validation -> Logging -> Caching -> Handler|  |
|  |  FluentValidation | Serilog | Redis                     |  |
|  |  EF Core bağımlılığı YOK                                 |  |
|  +----------------------------+---------------------------+   |
|                               |                               |
|                               v                               |
|  +--------------------------------------------------------+  |
|  |                    Alan (Domain) Katmanı                 |  |
|  |  Entity & Aggregate | Değer Nesneleri (Money, Stock)    |  |
|  |  Repository Interface | İş Kuralları                    |  |
|  |  SIFIR altyapı bağımlılığı                               |  |
|  +--------------------------------------------------------+  |
+--------------------------------------------------------------+

+--------------------------------------------------------------+
|                     Önyüz (React SPA)                        |
|  Vite + TypeScript | TailwindCSS + shadcn/ui                 |
|  React Query (sunucu state) | Zustand (UI state)             |
|  Mock/Gerçek API seçeneği | Lazy loading | Korumalı rotalar  |
+--------------------------------------------------------------+
```

### Bağlamlar (Bounded Contexts)

| Context | Domain Entities | Key Invariants |
|---------|-----------------|----------------|
| **Catalog** | Product, Category, Unit | Money değişmez ve negatif olamaz, StockQuantity >= 0, kategori hiyerarşisi |
| **Basket** | Basket, BasketItem | Eklerken anlık fiyat, ziyaretçi (sessionId) + üye (userId), ağırlıklı birimler için ondalık miktar |
| **Ordering** | Order, OrderItem | Durum makinesi (Pending &rarr; Paid &rarr; Processing &rarr; Shipped &rarr; Delivered / Cancelled) |
| **Payment** | PaymentRecord | Tekil (OrderId, IdempotencyKey) index ile tekrarlı ödeme koruması (idempotency) |
| **Identity** | AppUser | PBKDF2 hash'leme, httpOnly çerez üzerinden JWT, yenileme (refresh) token rotasyonu |
| **Wishlist** | WishlistItem | Kullanıcı + ürün çiftine özel tek kayıt |

---

## Proje Yapısı

```
ECommerce/
+-- ECommerce.sln
+-- src/
|   +-- ECommerce.Domain/            <- Saf Alan (Bağımlılık yok)
|   +-- ECommerce.Application/       <- CQRS Komutları ve Sorguları
|   +-- ECommerce.Persistence/       <- EF Core + PostgreSQL
|   +-- ECommerce.Infrastructure/    <- Dış ilgiler (Identity, Caching)
|   +-- ECommerce.API/               <- Yönetim (İş mantığı yok)
|
+-- src/ECommerce.Web/               <- React SPA (Vite + TypeScript)
+-- tests/                           <- Birim, Mimari ve Entegrasyon Testleri
```

### Bağımlılık Akışı

```
Domain         <- (bağımsız -- SIFIR referans)
Application    <- Domain
Persistence    <- Domain (yalnızca)
Infrastructure <- Domain, Application
API            <- Application, Persistence, Infrastructure
```

> Persistence (Veri) yalnızca Domain katmanına bağlıdır, Application katmanına değil. Repository arayüzleri Domain'de yaşarken, uygulamaları Persistence'da yaşar.

---

## 🚀 Nasıl Kurulur ve Çalıştırılır?

Bu projeyi çalıştırmanın iki farklı yolu vardır. Sadece arayüzü, tasarım özelliklerini ve önyüz akışını incelemek isterseniz **Mock Data** yaklaşımını kullanabilirsiniz. Tam backend mimarisini test etmek için ise **Full Stack** sürümünü kullanın.

### Ön Koşullar

| Araç | Sürüm | Gereksinim |
|------|-------|------------|
| [Node.js](https://nodejs.org/) | 18+ | Frontend ve Mock Data için zorunlu |
| [.NET SDK](https://dotnet.microsoft.com/download) | 10.0+ | Full Stack API için zorunlu |
| [Docker](https://www.docker.com/) | Son Sürüm | Full Stack veritabanları için tavsiye edilir |

---

### Seçenek 1: Mock Data ile Çalıştırmak (En Hızlı Yöntem) ⚡
Bu mod **sadece React SPA (Önyüz)** kısmını çalıştırır. Backend tamamen yerel olarak mock (sahte verilerle) edilir. Veritabanı kurmadan tasarım öğelerini, katalog taramasını, sepet işlemlerini ve 7 dil desteğini anında denemenize olanak tanır.

```bash
# 1. Depoyu klonlayın ve frontend dizinine gidin
git clone <repo-url>
cd ECommerce/src/ECommerce.Web

# 2. Bağımlılıkları yükleyin
npm install

# 3. Ortam değişkenlerinizin Mock API'ye ayarlı olmasını sağlayın
# .env.development.local dosyasında şu ayarı kontrol edin:
# VITE_USE_MOCK_API=true

# 4. Geliştirme sunucusunu başlatın
npm run dev
```

*İşte bu kadar!* Vite tarafından verilen yerel (Local) bağlantıyı tarayıcınızda açarak tamamen çalışan e-ticaret arayüzünü inceleyebilirsiniz.

---

### Seçenek 2: Full Stack (Gerçek Veritabanı & Redis) 🏗️
Bu işlem, gerçek .NET 10 API'sini yerel PostgreSQL ve Redis veritabanlarıyla birlikte, frontend ortamı da bu API'ye bağlanmış bir biçimde çalıştırır.

#### Adım A: Altyapıyı Çalıştırın (Docker)
PostgreSQL ve Redis'i ayağa kaldırın:
```bash
# PostgreSQL konteynerini başlatın
docker run -d --name ecommerce-db -e POSTGRES_USER=postgresUser -e POSTGRES_PASSWORD=postgresPassword -e POSTGRES_DB=ECommerceDb -p 5432:5432 postgres:16-alpine

# Redis konteynerini başlatın
docker run -d --name ecommerce-redis -p 6379:6379 redis:7-alpine
```

#### Adım B: .NET API'yi Çalıştırın
```bash
# Yeni bir terminal açın ve uygulamanın ana dizinine dönün
cd ECommerce

# Şemayı oluşturmak için Entity Framework migration komutunu uygulayın
dotnet ef database update --project src/ECommerce.Persistence --startup-project src/ECommerce.API

# Backend API'yi çalıştırın
dotnet run --project src/ECommerce.API
```
*API ayağa kalkacak ve `https://localhost:5001/swagger` adresinden Swagger üzerinden keşfedilebilecektir.*

#### Adım C: Frontend Kısmını Çalıştırın
Yeni bir terminalde:
```bash
cd ECommerce/src/ECommerce.Web

# Henüz yapmadıysanız bağımlılıkları yükleyin
npm install

# Ortam değişkenlerinin gerçek API'yi göstermesini sağlayın
# .env.development.local içinde şunları ayarlayın:
# VITE_USE_MOCK_API=false
# VITE_API_BASE_URL=https://localhost:5001

# Önyüzü çalıştırın
npm run dev
```

*🎉 Tebrikler! Artık tüm Modüler Monolitik mimariyi baştan sona çalıştırıyorsunuz!*

---

## API Referansı

### Açık Uç Noktalar

| Metot | Uç Nokta (Endpoint) | Açıklama |
|-------|---------------------|----------|
| `GET` | `/api/catalog/products` | Ürün listesi (arama, filtre, sayfalama, vb.) |
| `GET` | `/api/catalog/categories` | Kategori listesi |
| `GET` | `/api/basket` | Güncel sepeti görüntüle |
| `POST` | `/api/order` | Sepetten sipariş oluştur |
| `POST` | `/api/payment` | Ödemeyi tamamla |

### Korumalı ve Yönetici Uç Noktaları
Lütfen tüm listeyi İngilizce tabanlı API tablosu alanında (README.md) inceleyeniz. (Dosya sınırlarını aşmamak için özetlenmiştir.)

---

## Yol Haritası

### Tamamlananlar

- [x] Temiz Mimari ve Modüler yapı dizaynı
- [x] EF Core + PostgreSQL, CQRS (MediatR)
- [x] Ürün/Kategori için çoklu dil desteği
- [x] Admin çeviri arayüzü
- [x] httpOnly JWT Auth, sepet işlemleri ve ödeme tabanı

### Devam Edenler

- [ ] **Yapay Zeka Destekli Çeviri API'si** — Kategori veya ürün eklendiğinde AI aracılığıyla otomatik çeviri desteği

### Yaklaşan Hedefler

- [ ] Gerçek Ödeme Sağlayıcısı Entegrasyonu
- [ ] Backend ve Frontend için tam Docker Compose konteyner orkestrasyonu
- [ ] CI/CD boru hattı — GitHub Actions / Azure DevOps

---

<p align="center">
  <sub>.NET 10 &bull; React &bull; Temiz Mimari &bull; CQRS &bull; DDD ile geliştirildi</sub>
</p>
