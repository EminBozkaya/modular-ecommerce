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

<h1 align="center">Платформа E-Commerce</h1>

<p align="center">
  <b>Полнофункциональная e-commerce платформа White-Label</b><br/>
  <sub>.NET 10 API + React SPA | Модульный монолит | Чистая архитектура | CQRS | DDD</sub>
</p>

<p align="center">
  <a href="#-особенности">Особенности</a> &bull;
  <a href="#-архитектура">Архитектура</a> &bull;
  <a href="#-начало-работы">Начало работы</a>
</p>

---

## ✨ Что выделяет эту платформу?

Этот проект — **полностью настраиваемая платформа White-Label**, предоставляющая максимальные возможности UI/UX прямо из панели администратора.

* **Полный контроль дизайна:** Администраторы могут менять логотипы, цветовую палитру и шрифты на лету без изменения кода.
* **Гибкие макеты:** Меню могут быть переупорядочены. Разделы заголовков, футеров и баннеров можно с легкостью настроить.
* **Кастомизация витрины:** Модульная главная страница, где каждый блок — от отзывов до главных категорий — управляется из панели.
* **Глубокая многоязычность (7 языков):** Все элементы дизайна и данные постоянно доступны на 7 языках, при добавлении продукта вы можете сразу ввести все 7 переводов.

---

## 🚀 Как запустить

### Вариант 1: Запуск с мок-данными (Самый быстрый) ⚡
Запуск только Front-end для просмотра интерфейса. База данных не требуется.

```bash
git clone <repo-url>
cd ECommerce/src/ECommerce.Web
npm install
npm run dev
# Обязательно добавьте VITE_USE_MOCK_API=true файл в .env.development.local
```

### Вариант 2: Полный цикл (База данных PostgreSQL & Redis) 🏗️
Полная локальная версия.

```bash
# Docker 
docker run -d --name ecommerce-db -e POSTGRES_USER=postgresUser -e POSTGRES_PASSWORD=postgresPassword -e POSTGRES_DB=ECommerceDb -p 5432:5432 postgres:16-alpine
docker run -d --name ecommerce-redis -p 6379:6379 redis:7-alpine

# API .NET
cd ECommerce
dotnet ef database update --project src/ECommerce.Persistence --startup-project src/ECommerce.API
dotnet run --project src/ECommerce.API

# Frontend
cd src/ECommerce.Web
npm run dev
```

---

<p align="center">
  <sub>Создано с помощью .NET 10 &bull; React &bull; Clean Architecture &bull; CQRS &bull; DDD</sub>
</p>
