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

<div dir="rtl">

<h1 align="center">منصة التجارة الإلكترونية</h1>

<p align="center">
  <b>منصة تجارة إلكترونية متكاملة وقابلة للتخصيص بالكامل</b><br/>
  <sub>.NET 10 API + React SPA | بنية معمارية نظيفة | CQRS | DDD</sub>
</p>

---

## ✨ ما الذي يميز هذه المنصة؟

هذا المشروع ليس مجرد قالب تجارة إلكترونية عادي؛ بل هو **منصة قابلة للتخصيص بالكامل** مصممة لتوفير أقصى قدر من المرونة لواجهة المستخدم مباشرة من لوحة التحكم.

* **تحكم كامل في التصميم:** يمكن للمسؤولين تعديل الهوية البصرية بسلاسة دون تعديل التعليمات البرمجية. يمكنك تغيير الشعارات وتحديث الألوان والخطوط.
* **تخطيطات مرنة:** يمكن إعادة ترتيب القوائم، وتكوين أقسام الرأس والتذييل وتخصيص اللافتات (Banners).
* **تخصيص واجهة المتجر:** يمكن تمكين أو تعطيل تخصيص أقسام مثل الفئات الرئيسية وآراء العملاء والنشرات الإخبارية.
* **دعم لغوي شامل (7 لغات):** كل التخصيصات والبيانات تعمل بـ 7 لغات. عند إضافة منتج جديد، يمكنك إدخال الترجمات فورا للغات السبع ونشرها.

---

## 🚀 كيفية البدء

### الخيار ١: التشغيل ببيانات محاكاة (الأسرع) ⚡
يعمل هذا الوضع على تشغيل React SPA فقط، وهو مثالي لمراجعة واجهة المستخدم دون إعداد قاعدة بيانات.

```bash
git clone <repo-url>
cd ECommerce/src/ECommerce.Web
npm install
npm run dev
# تأكد من تعيين VITE_USE_MOCK_API=true في ملف .env.development.local
```

### الخيار ٢: التشغيل الكامل (قاعدة بيانات فعلية) 🏗️

```bash
# تشغيل خوادم قواعد البيانات (Docker)
docker run -d --name ecommerce-db -e POSTGRES_USER=postgresUser -e POSTGRES_PASSWORD=postgresPassword -e POSTGRES_DB=ECommerceDb -p 5432:5432 postgres:16-alpine
docker run -d --name ecommerce-redis -p 6379:6379 redis:7-alpine

# تشغيل واجهة برمجة التطبيقات API
cd ECommerce
dotnet ef database update --project src/ECommerce.Persistence --startup-project src/ECommerce.API
dotnet run --project src/ECommerce.API

# تشغيل واجهة المتجر
cd src/ECommerce.Web
npm run dev
```

---

<p align="center">
  <sub>تم التطوير باستخدام .NET 10 &bull; React &bull; بنية معمارية نظيفة &bull; CQRS &bull; DDD</sub>
</p>

</div>
