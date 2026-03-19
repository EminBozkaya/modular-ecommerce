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

<h1 align="center">Plataforma E-Commerce</h1>

<p align="center">
  <b>Plataforma e-commerce full-stack de marca blanca</b><br/>
  <sub>.NET 10 API + React SPA | Monolito Modular | Clean Architecture | CQRS | DDD</sub>
</p>

<p align="center">
  <a href="#-características">Características</a> &bull;
  <a href="#-arquitectura">Arquitectura</a> &bull;
  <a href="#-inicio">Inicio</a> &bull;
  <a href="#-hoja-de-ruta">Hoja de ruta</a>
</p>

---

## ✨ ¿Qué distingue a esta plataforma?

Este proyecto es una **plataforma de marca blanca totalmente personalizable** diseñada para ofrecer la máxima flexibilidad UI/UX directamente desde el panel de administración.

* **Control Total del Diseño:** Los administradores pueden modificar la identidad visual al instante sin tocar el código (colores, logotipos, fuentes, etc.).
* **Diseños Flexibles:** El orden de los menús es libre. El Encabezado, Pie de Página y los Banners promocionales son altamente configurables mediante bloques estáticos o marquesinas de desplazamiento.
* **Escaparate Personalizado:** Se pueden habilitar o personalizar completamente todas las secciones, como categorías principales, opiniones de clientes o banners.
* **Soporte Dinámico Multi-Idioma (7 Idiomas):** Todas las partes de la interfaz y las traducciones a bases de datos dinámicas funcionan y son accesibles en 7 idiomas en todo el mundo.

---

## Características Principales

### Frente (React SPA)
- **Catálogo de productos** &mdash; Búsqueda, filtrado, paginación, ordenación
- **Multilingüismo dinámico** &mdash; Arquitectura agnóstica sin depender de un idioma codificado.
- **Carrito de múltiples sesiones** &mdash; Actualizaciones automáticas y fijación de precios al momento
- **Diseño de pago seguro** &mdash; Fuerte control de estado de transacción, con protección frente a los pagos duplicados

### Panel de Administración
- **Panel de control completo** &mdash; Informes, bajas existencias, gestión general
- **Gestión de Traducciones** &mdash; Sistema en línea con menús para actualizar el texto en cualquier idioma
- **Acceso seguro** &mdash; Todas las funciones del administrador requieren autenticación firme basada en roles

---

## Arquitectura

Monolito Modular con estricta separación de capas mediante Clen Architecture. Patrón CQRS respaldado por MediatR. Control y validación rigurosa de las dependencias usando reglas explícitas durante la compilación.

```
Domain         <- (Independiente -- CERO referencias)
Application    <- Domain
Persistence    <- Domain (exclusivamente)
Infrastructure <- Domain, Application
API            <- Application, Persistence, Infrastructure
```

---

## 🚀 Cómo configurarlo y ejecutarlo

### Opción 1: Ejecutar con datos falsos de Mock (Más Rápido) ⚡
Perfecto para revisar la UI/UX completa de forma rápida e inmediata.

```bash
git clone <repo-url>
cd ECommerce/src/ECommerce.Web
npm install
npm run dev
# (Asegúrate de que .env.development.local contenga la siguiente variable: VITE_USE_MOCK_API=true)
```

### Opción 2: Ejecutar de manera completa (Full-Stack Data Real) 🏗️
Servicios de BD de contenedor y acceso al Backend API.

```bash
# Iniciar servicios DB
docker run -d --name ecommerce-db -e POSTGRES_USER=postgresUser -e POSTGRES_PASSWORD=postgresPassword -e POSTGRES_DB=ECommerceDb -p 5432:5432 postgres:16-alpine
docker run -d --name ecommerce-redis -p 6379:6379 redis:7-alpine

# Lanzar Back-end
cd ECommerce
dotnet ef database update --project src/ECommerce.Persistence --startup-project src/ECommerce.API
dotnet run --project src/ECommerce.API

# Lanzar Front-end en una nueva ventana
cd src/ECommerce.Web
npm run dev
```

---

<p align="center">
  <sub>Construido a partir de .NET 10 &bull; React &bull; Clean Architecture &bull; CQRS &bull; DDD</sub>
</p>
