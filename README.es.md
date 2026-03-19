<div align="center">
  <table>
    <tr>
      <td align="center" width="100"><a href="README.tr.md"><img src="https://flagcdn.com/w40/tr.png" height="18" alt="TR" /><br/><b>TR</b><br/>Türkçe</a></td>
      <td align="center" width="100"><a href="README.md"><img src="https://flagcdn.com/w40/gb.png" height="18" alt="EN" /><br/><b>EN</b><br/>English</a></td>
      <td align="center" width="100"><a href="README.de.md"><img src="https://flagcdn.com/w40/de.png" height="18" alt="DE" /><br/><b>DE</b><br/>Deutsch</a></td>
      <td align="center" width="100"><a href="README.fr.md"><img src="https://flagcdn.com/w40/fr.png" height="18" alt="FR" /><br/><b>FR</b><br/>Français</a></td>
      <td align="center" width="100" bgcolor="#e5e7eb"><b><a href="README.es.md"><img src="https://flagcdn.com/w40/es.png" height="18" alt="ES" /><br/>ES<br/>Español 🟢</a></b></td>
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

<h1 align="center">Plataforma E-Commerce</h1>

<p align="center">
  <b>Plataforma e-commerce full-stack de marca blanca</b><br/>
  <sub>.NET 10 API + React SPA | Monolito Modular | Arquitectura Limpia (Clean Architecture) | CQRS | DDD</sub>
</p>

<p align="center">
  <a href="#-características">Características</a> &bull;
  <a href="#-arquitectura">Arquitectura</a> &bull;
  <a href="#-estructura-del-proyecto">Estructura</a> &bull;
  <a href="#-cómo-configurar-y-ejecutar">Instalación</a> &bull;
  <a href="#-referencia-de-api">API</a> &bull;
  <a href="#-seguridad">Seguridad</a> &bull;
  <a href="#-hoja-de-ruta">Hoja de Ruta</a>
</p>

---

## ✨ ¿Qué distingue a esta plataforma?

Este proyecto no es solo una plantilla estándar de comercio electrónico; es una **plataforma de marca blanca (white-label) totalmente personalizable** diseñada para ofrecer una flexibilidad UI/UX máxima directamente desde el Panel de Administración.

* **Control Total del Diseño:** Los administradores pueden cambiar la identidad visual sin esfuerzo y sin necesidad de modificar el código. Se pueden intercambiar logotipos al instante, actualizar la paleta de colores global y ajustar las fuentes de texto para alinearlas perfectamente con la identidad de cualquier marca.
* **Diseños Flexibles:** Los menús de la tienda se pueden reorganizar libremente. Las secciones del Encabezado (Header) y el Pie de Página (Footer) son altamente configurables, y los banners promocionales pueden alternarse a voluntad entre marquesinas móviles y bloques estáticos fijos.
* **Personalización del Escaparate:** La página de inicio y el escaparate son completamente modulares. Secciones como categorías principales, opiniones de clientes y bloques para el boletín informativo (newsletter) se pueden activar, desactivar o personalizar por completo de forma dinámica.
* **Soporte Multilingüe Profundo (7 Idiomas):** Cada una de las personalizaciones de diseño antes mencionadas, junto con todos los datos de productos y categorías, operan dinámicamente en 7 idiomas preintegrados. Cuando se añade un nuevo producto o categoría, los administradores proporcionan fácilmente traducciones para cualquiera de los 7 idiomas directamente desde el panel de administración, asegurando una experiencia de compra adaptada a un público global.

---

## Características

<table>
<tr>
<td width="50%">

### Tienda (React SPA)
- **Catálogo de productos** &mdash; búsqueda, filtro de categorías, paginación, ordenación.
- **Página principal** &mdash; productos destacados, búsqueda predictiva.
- **Multilingüe (Multi-language)** &mdash; TR / EN / DE, etc., con búsquedas por lenguaje específico; la arquitectura es independiente del idioma (agnóstica), permitiendo que cada servidor configure su propio idioma predeterminado.
- **Carrito de invitado + miembro** &mdash; carrito persistente con capturas instantáneas de precios y medidas de cantidad por unidad (ej: kg, pieza, litro).
- **Flujo de caja y pago** &mdash; dirección de envío &rarr; pago (orquestación en 2 pasos).
- **Historial de pedidos** &mdash; seguimiento de estado, vista de detalles del pedido.
- **Lista de deseos / Favoritos** &mdash; guardar productos para explorarlos más tarde.
- **Autenticación** &mdash; inicio de sesión, registro, restauración de sesión en segundo plano, redireccionamiento tras el inicio.
- **Pagos seguros** &mdash; gestión a cargo de tokens idempotentes; ni un solo dato bancario es almacenado en el sistema local.

</td>
<td width="50%">

### Panel de Administración
- **Dashboard** &mdash; tarjetas resumen, gráficas de ganancias, ventas recientes y alertas de poco inventario (stock bajo).
- **Control de Artículos** &mdash; Creación/Edición/Supresión, vigilancia de stock, sistema de borrado lógico (Soft Delete) y recuperación.
- **Control Categorizado** &mdash; Operaciones con jerarquía madre-hija; sistema de borrado temporal para restaurarse si cabe.
- **Editor de Traducciones** &mdash; Editor interfaz con subpestañas, orientado hacia la administración multi-lenguaje de ítems (inglés, español, francés, etc).
- **Gestión Logística (Pedidos)** &mdash; tabla dinámica, filtrajes para status, pases y confirmación por escalpelo de seguridad manual.
- **Gestión de Cuentas** &mdash; listados de parroquianos (clientes); buseo por alias o correo electrónico.
- **Expulsión e Imprimado de Cifras** &mdash; exportación de base formato CSV/Excel en clientes, géneros o compras.
- **Custodia Rígida De Roles** &mdash; toda y absoluta entrada de Admin requiere confirmación mediante ruta blindada `[Authorize(Roles = "Admin")]`.

</td>
</tr>
</table>

---

## Arquitectura

Esta estructura subyace un "Monolito Modular" con fuertes líneas divisoras para el enfoque central Arquitectura Limpia (Clean Architecture), CQRS alimentado por MediatR y Diseño Impulsado por el Dominio (DDD - Domain Driven Design). Toda normativa técnica está custodiada bajo leyes de compilación forzada `NetArchTest.Rules`.

### Diseño Multilingüe Agnosticista

Para evitar las trampas y deudas de código al crear plataformas "marca-blanca", los registros léxicos para todo "Producto" o "Categoría" se encuentran segregados en una tabla paralela de traducciones (`ProductTranslations`, `CategoryTranslations`) engarzados tras la clave en compuesto `(EntityId, LanguageCode)`. Esto erradica totalmente el pre-juicio de una "Lengua Materna (Default)": todos y cada uno de los idiomas asisten bajo misma escala equitativa.

Dentro del sistema interior de `appsettings.json`, el registro `DefaultLanguage` se usará como lenguaje "Cuna y Auxilio", proveyendo apoyo en pantalla en el hipotético caso en que falte una traducción natural de aquello que un visitante intente observar en su lengua. Este proceder dicta que si usted monta sus propios reinos comerciales ubicados en Colombia, definirá `DefaultLanguage: "es"`, para que su directiva ancle toda novedad primordialmente en la lengua hispanohablante, mientras la tabla proveerá hueco para la derivación del anglosajón, franco o turco a placer posterior.

La cristalización de la citada tecnología propulsa a la magna Obra a comportarse a la par de un modelo Marca Blanca (White Label). Se adaptará global e impecablemente a cualquier nación eximiendo todo tipo de requerida deconstrucción del software interno por desarrolladores.

```text
+--------------------------------------------------------------+
|                         Capa API                              |
|              Controllers | Middleware | DI                    |
+--------------------------------------------------------------+
|                              |                                |
|  +-----------------------+   +----------------------------+   |
|  |     Infraestructura   |   |        Persistencia        |   |
|  |  -----------------    |   |  ----------------------     |   |
|  |  Servicio JWT         |   |  EF Core DbContext         |   |
|  |  Redis Cache          |   |  Configs Fluent API        |   |
|  |  Pago (Simulación)    |   |  Repositorios Agregados    |   |
|  |  CurrentUserService   |   |  Interceptor Soft-Delete   |   |
|  +----------+------------+   +-------------+--------------+   |
|             |                              |                  |
|             v                              v                  |
|  +--------------------------------------------------------+  |
|  |                 Capa de Aplicación (App)                 |  |
|  |  Comandos y Consultas (MediatR CQRS)                    |  |
|  |  Pipeline : Validación -> Reg.Logs -> Caché -> Handler  |  |
|  |  FluentValidation | Serilog | Redis                     |  |
|  |  CERO ACOPLAMIENTOS CON EF CORE                         |  |
|  +----------------------------+---------------------------+   |
|                               |                               |
|                               v                               |
|  +--------------------------------------------------------+  |
|  |                    Capa del Dominio                      |  |
|  |  Entidades y Agregados | Objetos Valor (Dinero)        |  |
|  |  Interfaces Repositorio| Invariaciones de negocio      |  |
|  |  TOTAL INDEPENDENCIA DE MARCOS EXTERNOS (0 DEPENDENCE)   |  |
|  +--------------------------------------------------------+  |
+--------------------------------------------------------------+

+--------------------------------------------------------------+
|                   Vista Frontal (React SPA)                  |
|  Vite + TypeScript | TailwindCSS + shadcn/ui                 |
|  React Query (Estado Server) | Zustand (Estado Cliente-UI)   |
|  Toggle Mock/API Activa | Carga Lazy | Rutas Privadas        |
+--------------------------------------------------------------+
```

### Contextos Delimitados (Bounded Contexts)

| Contexto | Entes Subordinados del Dominio | Principios Invariables Irrenunciables |
|---------|-----------------|----------------|
| **Catálogo** | Género Producto, Jerarquía, Unidad de Medida | Formato económico (Money) imperecedero y >0, Reservas Cantidad > 0, Genealogía categórica coherida. |
| **Cajas (Basket)**| Cesto en Vivo, Ítems del mismo | Retensión firme sobre los valores pecunarios de artículos cuando se depositan, Identificación para Invitados o Loggeados, Admisión de fraccionamientos decimales de pesos para cobros de productos singulares (Kilos/Litros). |
| **Despacho / Órdenes** | Peticiones (Orders), Línea de compra | Estacionamiento y progreso estricto del circuito del artículo (En Espera &rarr; Pago Asimilado &rarr; Producción &rarr; Transporte &rarr; Conclusión / O su defecto Erradicación Total del ciclo). |
| **Monetización** | Comprobante Económico | Bloqueo perenne del cobro reiterado furtivo por accidente (Idempotencia) avalado estrictamente bajo el índice combinado infalible `(OrderId, IdempotencyKey)`. |
| **Baza de Identidad**| AppUser | Sellado en PBKDF2; emisión JWT respaldado severamente en pasaje de código oculto al servidor (httpOnly cookies); la danza interminable del renuevo vitalicio e inexorable por exigencia al Refresh-Token. |
| **Rincones Personales** | Códices Favoritos Guardados | Una simple pero determinante matriz de pertenencia única; jamás podrá repetirse el registro entre cliente `(Id)` e Item anhelado `(Produto Id)`. |

---

## Estructura del Proyecto

```text
ECommerce/
+-- ECommerce.sln
+-- src/
|   +-- ECommerce.Domain/            <- Incorruptibilidad Lógica. Pureza Pura Del Negocio Libre
|   |   +-- Common/                     BaseEntity, BaseAuditableEntity, ISpecification
|   |   +-- Catalog/                    Product, Category, Unit, Money, StockQuantity
|   |   +-- Basket/                     Basket, BasketItem (Sustraedor del Valor Instántaneo)
|   |   +-- Ordering/                   Order, OrderItem, OrderStatus
|   |   +-- Payment/                    PaymentRecord, PaymentStatus
|   |   +-- Identity/                   AppUser, UserRole
|   |   +-- Wishlist/                   WishlistItem
|   |
|   +-- ECommerce.Application/       <- Invocaciones al Servidor Eqrs / MediaR
|   |   +-- Common/                     Behaviors (Amonestaciones transversales intermitentes)
|   |   +-- Catalog/                    Abstracciones Directivas hacia productos físicos.
|   |   +-- Basket/                     Despacho de artículos al seno del Cesto Virtual
|   |   +-- Ordering/                   Generador Logístico De Compra Directa Comercial
|   |   +-- Payment/                    Matemática Cuartelaria Intransigente y de Fiabilidad Monetaria 
|   |   +-- Identity/                   Puerta Legal al ingreso identitario y de rutas de paso validado
|   |   +-- Wishlist/                   Concesiones al Deleite Visual Comercial
|   |   +-- Admin/Queries/              Miradores De Balcón y Rendiciones Contables 
|   |
|   +-- ECommerce.Persistence/       <- Capa Servil Materializada; El Asentamiento Físico PostgreSQL bajo manto EF Core
|   |   +-- Context/                    ApplicationDbContext (Englobe un Filtrage global constant)
|   |   +-- Configurations/             Ordonnances par l'interface verbale "Fluent API" (x8 tables)
|   |   +-- Interceptors/               Audit & Vigilantes Eternos contra borrados irreparables (El famoso Soft Delete) 
|   |   +-- Repositories/               8 Castillos Recolectores para la Integridad Del Agregado.
|   |   +-- Migrations/                 Traductorado Fiel a La Evolución Basílica De Data-Tier.
|   |
|   +-- ECommerce.Infrastructure/    <- Herramientas y Auxiliares al Sistema 
|   |   +-- Identity/                   JwtService, CurrentUserService
|   |   +-- Payment/                    Doble Actor sustitutivo y Simulador Cobros Internacionales Tipo Stripe (Stubbed) 
|   |   +-- Caching/                    Registrador Supersónico de Redis Cache 
|   |
|   +-- ECommerce.API/               <- El Gran Eje Coordinador Magistral y Enrutante 
|       +-- Controllers/                Katalog, Basket, Order, Payment, Auth, Wishlist
|       +-- Controllers/Admin/          AdminController (Conectividad Directiva Y Elitista solo accesible pór ROL)
|       +-- Middlewares/                Agent central pour capturer l'hérésie des "Exceptions" ou crashes.
|       +-- Extensions/                 Contratos Legales sobre las Exigencias DI (Dependencias)
|
+-- src/ECommerce.Web/               <- Portal Magistral y Fachada De Construcción Reactiva (Vite Frameworked) 
|   +-- src/
|       +-- api/                        Interconectividad Estricta Axios y Muros Retentivos Catch.
|       +-- app/                        Árbol Vital de Derivaciones De Páginas al Cliente (Router 6x)
|       +-- components/                 Arquitecturas visuales de Uso común y genérico 
|       +-- features/                   Sectorización De Dominios De Carga Virtual Al Cliente 
|       +-- store/                      Acueductos Informativos Locales (Vía Zustand Formats + React Query Caches) 
|       +-- utils/                      Leyes Tipográficas de conversiones matemáticas para el front.
|
+-- tests/                           <- Muralla Norte Defensiva Estructural 
```

### Curso Circulatorio De Referencias Orgánicas (Dependencias) 

```text
Dominio (Domain) <- (Soberana Independencia -- Ninguna Referencia Externa Contamina)
Aplicación       <- Dominio (Domain)
Persistencia     <- Dominio (Irremediablemente Atada Unipolarmente Al Mismo)
Infraestructura  <- Dominio, Aplicación
Manejo API       <- Aplicación, Persistencia, Infraestructura
```

> Persistencia (Que alude a los dominios rígidos sobre EF Core y la Database PostgreSQL) nunca somete, ni interviene o condiciona al Estado Lógico Aplicativo. Concediéndose Total Inversión de Paradigma de Control a esta Arquitectura y protegiendo el software del caduco a manos del paso cruel de la erosión tecnológica.

---

## 🚀 Cómo Configurar y Ejecutar

Brindamos y disponemos amistosamente de dos avenidas funcionales y plausibles al momento de testear este software y presentarlo hacia terceros. En el eventual caso que su imperiosa necesidad sea el de constatar cómo se ve, cómo transiciona visualmente su front-end, o lo bien que luce este entramado (Para demostraciones express de Portfolio personal), dirija entonces sus acciones al bloque de orden  **Modo Simulación Rápida (Mock Data)**. Caso contrario, usted viene buscando la esencia nuclear, queriendo desollar cada pulso, servicio, conexión o veracidad técnica para sus propios intereses de explotación global. Adelante pues con la marcha severa y directa que requiere el **Modo Central y Funcional Total: Servidores en Concreto Fuerte (Full Stack)**.

### Acuerdos Universales Mínimos

| Herramienta | Versión | Grado De Exigencia |
|------|---------|-------------|
| [Node.js](https://nodejs.org/) | 18+ | Estricto Indispensable, sin esto nada arranca (Aplica a Front / Mock) |
| [.NET SDK](https://dotnet.microsoft.com/download) | 10.0+ | Única puerta al acceso integral del Corazón Funcional API y Sistema .Net |
| [Docker](https://www.docker.com/) | Actual / Latest | Encarecida e Impositiva Sugerencia para ahorrar desastres y confusorías en despliegue de Bases Centrales. |

---

### Opción 1 : Despegue En Seco y A La Simulación Inmediata ("Mock Data") ⚡
Al obrar en conformidad con esta acción se dictamina un encendido condicional que afectará **Solo Y Absolutamente a La Fachada SPA (La Pura React Vite Framework)**. Todos y casa uno de los elementos "Rígidos Base De Datos y Archiveros / API" son ficticiamente emuladores ejecutados virtualmente en su navegador para la visualización del trabajo, permitiendo evaluar al milímetro cómo los carritos y el Multi-Language reacciona a los botones sin comprometer ni perder diez minutos configurando bases masivas en su escritorio local.

```bash
# 1. Copiar y trasladar el material repositorio de UI y Fachada pura. 
git clone <repo-url>
cd ECommerce/src/ECommerce.Web

# 2. Descargar herramientas secundarias al React 
npm install

# 3. Ordenarle firmeza y de forma terminante en la directiva Ambiental que use La Simulación.
# Busque .env.development.local  y asegure a capa y espada que se halle la orden :
# VITE_USE_MOCK_API=true

# 4. Soltar amarras de ejecución 
npm run dev
```

*¡Asuntó Culminado!* Viaje en su nave virtual a la estepa señalizada de forma pronta provista en su consola dictada  por el mismo Vite y deleite las retinas hacia las vistas comerciales plenas en sus navegadores.

---

### Opción 2 : Encendido Central De Factorías Nucleares De Red y Servidores Puros  🏗️
Invocación masiva hacia la integral ejecución de los planos del Ecosistema del "Backend framework de .NET 10" operacionales en alianza a los monstruos de persistencia PostgreSQL y Redis. Esta rama es obligada si se espera comprobar las capacidades sistémicas transaccionales y conectar nuestra web app a ellas de una vez. 

#### Módulo Parte A : Convocación Elemental Y Universal (Containers por Docker)
Encendamos las turbinas y recabemos al ente SQL Base y Entes Cacheadores en 2 comandos fugaces: 
```bash
# La invocatoria Central a SQL 
docker run -d --name ecommerce-db -e POSTGRES_USER=postgresUser -e POSTGRES_PASSWORD=postgresPassword -e POSTGRES_DB=ECommerceDb -p 5432:5432 postgres:16-alpine

# La Cripta De Memoria Cache 
docker run -d --name ecommerce-redis -p 6379:6379 redis:7-alpine
```

#### Módulo Parte B : Soplo Aliento De Vida Sobre .NET
```bash
# Retornar por sus fueros consulares (Vaya a base raiz) en el terminal. 
cd ECommerce

# Acople Y Fundición Estructural De Planos De Tierras (Tablas)
dotnet ef database update --project src/ECommerce.Persistence --startup-project src/ECommerce.API

# Orden de Correr el Motor Central
dotnet run --project src/ECommerce.API
```
*Si su proceder es magno y virtuoso y ningún mal acontece. Enhorabuena se ostentará un Swagger funcional y consultable desde su explorador directo hacia la morada sagrada local: `https://localhost:5001/swagger`*

#### Módulo Parte C : Amarre Transaccional y Final De Vista Cliente / Front-End
Abordará de consiguiente otra terminal neutra dispuesta en su morada local: 
```bash
cd ECommerce/src/ECommerce.Web

# Incorporamientos En Carga Si no se hubieran dado a cabo
npm install

# Inflexibilidad Al Front : Deróquese La Opción De Vuelo Ciego y Órdenese Rumbo Firme A Nuestras Torres Server Central 
# Abriendo de Par en par el bloque oculto y ambiental (Env Var de Entorno local Config) .env.development.local 
# VITE_USE_MOCK_API=false
# VITE_API_BASE_URL=https://localhost:5001

# Todo Corriendo En Órbita Total  
npm run dev
```

*🎉 Extiendasele gratitudes solemnes a su entereza. El Total y Fiel Circuito que enarbola un "Monolítio Modular y Pragmático" vibra y fluye por doquier en las fronteras de su sistema*

---

## Referencia de API

### Vías Comunes Carentes De Fronteras Lógicas

| Conducta HTTP | Paraje Conclusivo | Comentario Acotado |
|--------|----------|-------------|
| `GET` | `/api/catalog/products` | Repositorio Abierto Con Paginajes / Filtreados Varios. |
| `GET` | `/api/catalog/products/{id}` | Lupa Examinadora Concreta |
| `GET` | `/api/catalog/categories` | Esquemas Grupales Listos A Ver |
| `GET` | `/api/catalog/units` | Compendio Métrica Dimensional (Peso Unidad Varios) |
| `GET` | `/api/basket` | Vigilia De Consumos  |
| `POST` | `/api/basket/items` | Adsorción Al Cesto  Y Contrato Previo De Cantidades |
| `PUT` | `/api/basket/items` | Enmendamiento Sobre Excepcies Numéricas De un Interés  |
| `DELETE` | `/api/basket/items/{productId}` | Devolutoria Inmediatable y Descarte De Item   |
| `DELETE` | `/api/basket` | Volcado Estruendoso Al Vacio  |
| `POST` | `/api/order` | Ejecutoria Plena Sobre Traslados  A "Pedidos"   |
| `POST` | `/api/payment` | Conclusiones Económicas Irrevocables Y Definitivas |

### Cuestiones Referentes Al Ser y Permanencia

| Conducta HTTP | Paraje Conclusivo | Comentario Acotado |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Acogimiento Documentario. (Crea Y Asienta Pasaporte httpOnly para resguardo y fe) |
| `POST` | `/api/auth/login` | Bienvenida Institucional (Despliegue Paralelo De Visados Privales "Tokenizado Cookie Encryptado" ) |
| `GET` | `/api/auth/me` | Remembranza Identificadora Rápida.  |
| `POST` | `/api/auth/refresh` | Reavivación y Prórroga de Plazo Cautivo, Rotación Segura Constante de Ciclo de Seguridad Circular .   |
| `POST` | `/api/auth/logout` | Anulación Completa de Existencia Perceptiva  |

### Resguardos Especializados Identitarios En Confidencialidad  `[Authorize]`

| Conducta HTTP | Paraje Conclusivo | Comentario Acotado |
|--------|----------|-------------|
| `GET` | `/api/order/{id}` | Inspecciones Precisas Individuales   |
| `GET` | `/api/order/my` | Retrospectiva Completa Del Consumidor y sus Gastos    |
| `GET` | `/api/wishlist` | Espejismo de Cargas Deseadas Futuras. |
| `GET` | `/api/wishlist/product-ids` | Retorno Ultracompacto Para Agilitar Reflojos Front-End De Marcado Reactivo  |
| `POST` | `/api/wishlist/{productId}` | Clavación A Fuego Como Deseado Favoritivo   |
| `DELETE` | `/api/wishlist/{productId}` | Ente Desamarrado Y Lanzado Fuera Del Interés  |
| `DELETE` | `/api/wishlist` | Purga Total De Deseos No Cumplidos   |

### Salas Maestras Censorias (Control Dirigencial General) `[Authorize(Roles = "Admin")]`

| Conducta HTTP | Paraje Conclusivo | Comentario Acotado |
|--------|----------|-------------|
| `POST` | `/api/admin/products` | Nacimiento Mercante |
| `PUT` | `/api/admin/products` | Deformaciones Correctorias Entidades |
| `DELETE` | `/api/admin/products/{id}` | Engullido Disfrazado Al Exilio (Soft Delete ) |
| `POST` | `/api/admin/products/restore/{id}` | Anmistias Revocatorias De Lo Oculto |
| `PUT` | `/api/admin/products/stock` | Cuentas Racionales Matemáticas de Hangar |
| `POST` | `/api/admin/categories` | Nombramiento Oficial de Gremios Mercantiles  |
| `PUT` | `/api/admin/categories` | Modulares Mutaciones  |
| `DELETE` | `/api/admin/categories/{id}` | Baneo Por Indisciplina Mercante (Fuera Categoría)  |
| `POST` | `/api/admin/categories/restore/{id}` | Clemenza Absolutista Retorna a la Vida a la División Extinta |
| `GET` | `/api/admin/users` | Fisco Constante , Lista Informativa Abierta |
| `GET` | `/api/admin/orders` | Macro Miradores Oculares Hacia  Todas Las Operacionalidades Comerciales Llevadas Por Las Masas |
| `GET` | `/api/admin/orders/{id}` | Miradas Minuciosas  |
| `PUT` | `/api/admin/orders/{id}/status` | Promoción Categórica o Destitutoria de Estados Avanzadilla y Logistica (Transportado etc) |
| `DELETE` | `/api/admin/orders/{id}` | Purga Judicial Severa a Visto Ciego |
| `POST` | `/api/admin/orders/restore/{id}` | Condena Retirada; Reflote Por Error En Falla Transaccional Administrtada |
| `GET` | `/api/admin/dashboard/summary` | Tarjetones Compactos Mostrarios  |
| `GET` | `/api/admin/dashboard/revenue` | Cúspide Ocaso Informativo Capitalista Graficado  |
| `GET` | `/api/admin/dashboard/recent-orders` | Los Temblores Mencionables Apenas Sucedidos Dónde Corre El Capital |
| `GET` | `/api/admin/dashboard/low-stock` | Claxon de Agote Agonizante A Ser Rellenables |

---

## Seguridad

| Postulados  | Maniobras Inexorables (Procederes) |
|---------|----------------|
| Certeza De Existencia Cívil | Los Testimonios se envainan bajo los pesados lazos  y esferas del **httpOnly secure cookies**; Prohibición Tácita  y destituidora a todo aquel que apele a un LocalStorage Periférico  y Vulnerable . |
| Giro Sempervital de Tokens | El Jeton y Firma digital agota su luz y muere. A resurgir renace desde Inéditas Fortalezas por Obligados  y Vigentes Mandatos Refresh Constant y Permanentes|
| Línea Máxima Temporal | Tolerancias estrictas y nulas a brechas . Quince minutos para un acceso al cielo del servicio Token ; Los Retrasos por reloj asincrónico (Clock Skew Validation Cero) están penalizados y derribados en sus nulos efectos .|
| Muralla Inquebrantable de Textos Secretos | Esculpidos férreamente a piedra ( PBKDF2). El SHA256 no teme a los golpes contínuos ni a sus extremas iteraciones  (100.000 Golpes Iterables ). |
| Dinero Etéreo Y Resguardado | **Universo Ciego y Fiel A Fichas Intercambiables Extranjeras (Token Systems).**  Los anales ECommerce de este marco de Proyecto Arquitectural rechaza registrar el paso, copia o visión numérica o de fechas referente a tarjetas y cartones privados bancarios.  |
| Antidoto Contratensional Y Pánico Reiterativo | Enclavamientos Indestructibles `(OrderId, IdempotencyKey)`. Los sistemas frenan las repetibilidades  abducidas  y reingresos ininterrumpidos en Ficheros Mónetarios, frenando al usuario e imponiendo La Idempotencia Eterna e inalterable al Cobro Doble.  |
| Repulsión al Turbe o Multitud Anómala y Tumbativa | Se desestiman por asalto  vías "FixedWindow Limitaciones" todo desbordamiento que restrinja más requerimientos permitibles de una dirección origen IP que cien de ellas por el tramo de un minuto exacto (100 Req).  |
| Pactos Fronterizos Blindados o Admisibilidades Selectas | Negatorias al cruce de Fronteras Web y Restrictores que solo permitirán al paso amigable entre Orígenes Seleccionamos Absurdamente en la sagrada "Whitelist-CORS", custodiando Identitarias Pruebas al viajar hacia nuestros aposentos. . |
| Anales Históricos Imperecederos y Exentos de Crematorio |  Asentamientos Absolutos del sistema. Nada Es Expurgado ni Eliminado de Facto y Materia. El sistema usa un Borrado Virtual Tímidamente de Mascaras . Por consiguiente "Soft-Deletion" a toda escala resguarda a las almas o registros de una destrucción letal permeditada  **Ni la mínima línea será nunca borrada per se de las Bases Místicas SQL.** |
| Fachada Simulacra Frontal En Engaño Protector | Pese a que un atacante derribase murallas visibles visuales o de "Componentes de Cliente  Web"; La Real Máquina Servidora Mantiene Soberano Liderazgo Y Condenas Imperiales a cualquiera en Fallas Desfavorable a Permisos No Concedidos. |
| Altas Camaras Restrictivase | Toda y absoluta labor operaria del Mando , se blinda irrefutablemenre hacia  el rol supremo:   `[Authorize(Roles = "Admin")]`|

---

## Pila Tecnológica (Tech Stack)

<table>
<tr><th colspan="4">Trastienda Profunda Magistral De Cálculo y Persistencias</th><th colspan="4">Mostradores De Vistas Y Presentaciones Del Arte React</th></tr>
<tr>
<td align="center"><b>Cubo Motor</b></td>
<td align="center"><b>Intercesor y Mago Físico</b></td>
<td align="center"><b>Arca Memorística</b></td>
<td align="center"><b>Vías Reflejas e Instántaneas</b></td>
<td align="center"><b>Arquitectura Principal De Vistas</b></td>
<td align="center"><b>Retención Estática y Circulante </b></td>
<td align="center"><b>Herrería y Cincel Acabado UI</b></td>
<td align="center"><b>Forjador Constructo Vite</b></td>
</tr>
<tr>
<td align="center">.NET 10 / C# 14</td>
<td align="center">Core Ancestral (EF) - 10 </td>
<td align="center">PostgreSQL Serie 16 </td>
<td align="center">Fuerza Bruta Cache Redis</td>
<td align="center">Ramas React JSX - 19</td>
<td align="center"> React.Query Enganches + Zustand</td>
<td align="center">Pincel De Viento "Tailwind" & Muros preacabados "ShadCN UI" </td>
<td align="center">Vite Framework Bundel </td>
</tr>
<tr>
<td align="center"><b>Sinfonia Intermediaria</b></td>
<td align="center"><b>Escudo Verificador Validante</b></td>
<td align="center"><b>Escriba Perpétsuo y Crónico</b></td>
<td align="center"><b>Martillo Evaluativo (El Jues)</b></td>
<td align="center"><b>Señalizador de Desvíos Rutas </b></td>
<td align="center"><b>Cartero y Expreso Intergaláctico</b></td>
<td align="center"><b>Presentador Tabulado Analista </b></td>
<td align="center"><b>Artista De Barras Coloridas y Circunvolusiones </b></td>
</tr>
<tr>
<td align="center">Orquestación Limpia MediaR (CQS )</td>
<td align="center">Fluent Validez Estricta </td>
<td align="center">Pluma Eterna Diaria De Seri Log</td>
<td align="center">Módulo Inquisidor Unitario (x-unit) & Fallos Expresados al habla (FluentAssertions) </td>
<td align="center">Seis Generacional Domos de Ruteo  (React Router v6) </td>
<td align="center">Líneas Directas Al Cobre Axios</td>
<td align="center">Cuadriculador Profesional Empresarial "AG GRID" </td>
<td align="center">Recreador Pictórico y Creador Recharts </td>
</tr>
</table>

---

## Hoja de Ruta (Roadmap)

### Pasajes Ya Dominados Por El Hacha Del Progreso

- [x] Establecimiento Fundacional Y Plantación Árbolica de Proyectos (Monolito Modelable y  Clean Architecture Absoluto).
- [x] Definición Categórica A Modos Filosóficos Conceptuales De Vástagos (DDD  Modelado / Value Object Abordados). 
- [x] Invocación a Placas Subterráneas De Memoria Y Su Modulaje En Cemento  (EF Core Tablas + Regímenes Dictatoriales del Guardado Persistente en Códigos Fuente / "Code First" ). 
- [x] Las Magias Del Tubo Conductor de la Doctrina CQRS - MediaR Intersecional e Imlementativo en Órdenes & Pedidos De Datos). 
- [x] Alzamiento De Muros Férreos Autentiticos Front-End-Backend (JWT Emisiones en Blindaje HttpOnly). 
- [x] Confeccionado Malla a Malla Individual de los Patrones Protectos Repositoriales para Entidades Mayores Categóricas (Sin Repositorio Omnipresente). 
- [x] Tienda A Tiempo Completo, Precios Con Congelamiento en Tiempo Suspendido. Vías Flexibles  de Libre Acopio Para Viajeros De Paso E Ilustres Registrados Por Igual .  (Sesiones / Usuarios Reales).  
- [x] El Bloqueo Del Reebote Excéntrico Pagador (Bases Asegurativas Sobre Multiples Envíos Monetarios , Indice Constrictivo Defensor).
- [x] Enramaje De Túneles Superstónicos Interceptorios A Favor de la Eficiencia y Rapidez Del Visto y no visto: Redis Cash Mediat R Integración (Behavior Pipeliene Intertwined)
- [x] Escribano Universal Intervencionista con Voces a Cientos Loggeos En Lengua Clara : Estructurados Logs  Emanentes Desde Entrañas Con "Serilog". 
- [x] Excorcizador De Espíritus Corruptos Exepcionales De Servidor Central C-Sharp (The Global Exception Handling Error Manager Middleware).
- [x] Patíbulos Y Rejas Disuasuorias A Saqueadores de Redes API (Rate Limiting Y Excluyente Regla Cors  Aplicadas ).
- [x] Descenso a los Infiernos Unitarios a Poner En Juicio Crítico Cada Norma y Lógica Funcional a Golpes Duros UnitTest Y El Fiero NetArchTest  Para La Arquitectura Intocable . 
- [x] Alzamiento Magistral Constructivista a Punta de "TypoScript" Del Palacio Transaccional Front-End En Tierra Vite / SPA React . 
- [x] Altar De Adoración y Escrutinio Catologizador De Entes Comerciales Y Ofertorios  Completamente Interactivo a los ojos, (Filtros, Orden y Salto de Capítulos . Paginations)
- [x] Pórticos de Admisión Personalizables  y Formas Formales Inscriptivas Clientales.
- [x] Arcas Consumísticas De Gran Portes Visual, Retros Y Abribles en Muros AuxliareS ("Los Basket Page Views" Y Modal "Drawer")  Calculistica De Cantía Decimal e Integra. 
- [x] El Transcurso de Aprobaciones Contractuales Comerciales en Dobles Gestos : Encomienda Terrenal Domicilial Previa + Pactó Monetarístico Ulterioritario (Checkot Dos Vias Flow). 
- [x] Salones Del Capricho Y la  Fantasía Clientelar Abiertos  ("El Rincón Wishlist Favorits") 
- [x] Atrio Exclusivo A Jerarcas y Gobernadores Del Portal Comercio (Admin Over All View ) Estadístico Manda-Tableros (Dashbars)
- [x] Controles De Manivelas, Poleas Y Cortadoras Ficticias Para Manipular A Antojo Cúspides, Valles Y Vórtices Comerciales Internos Del Stock E-commerce. (Los Modulos Edicion Producto, Agrege Y Quite Y La Jerarquizadora Categoría.  ) 
- [x] Cúpula Suprema de Juzgados Y Sentencias Hacia Destinos Comerciales Post-Factuales (Decisional de Manejo Para Validar Envios / Órdenes Del Sistema - Order Maganemet Process Statu Changer ). 
- [x] Los Tomos Cuestionadores De Presencias Y Personajes Activos Registrales (Manejos Base De Usuario Para Visor de Admins - Users Panels) 
- [x] Los Botonazos De Escape Alterno (Opción Y Clave Rápida para Mutación Mítica FrontEnd Al Mundo Del Env-Mock - Simulación Interfaz vs Conexión Cautiva Server ).  
- [x] Rearticulación Lingüistica Del Total Organismo Para Acogidas Babélicas Dinámicas Vía Header Transmiters "Accept Languages" a las Bóvedas Multi-Lenguaje De Cache.  
- [x] Abolición Monocultista "Por Defecto Nacionalizado Prejuicisoso", Apertura Integral Al Concepto y Norma Totalitaria Agnostica Traduccional  De Archivería de Artículos Multiplicando Su Eje  a "Traduccionales Tablas Paralelas " Independizadas. (Un E-commerce Al Fin Universal Blanco Y Aislable Para La Multi Venta Territorial Clónica .)  
- [x] Panel Descriptivo Editor Al Comando Superior . Formas Administrativas Cíclicas Visuales Múlti-Pestañas Para Admnistración de los 7 Imperios De Los Idiomas Fundantes Del Programa Directo En Vistas Del Administrador Gestor. 

### En Proceso Continuado Forjalistico De Llama Activa 

- [ ] **Alquimia Cognitiva Lingüistica Autómata  ** — Vencimientos Plenos de la Adopción y Cimentado Integral de La Mente Algorítmica Servidora (El API Traductora AI Artificial  ). Encargase está a que al solo hecho de brotar al sol un Objeto o Categoría nueva..  Sea Inmediatamente y sin retardo transcrito , procesado, acomodado  y servido  Instantaneizado en las otras SEIS lenguas foráneas secundarias  que acogen nuestra amada  y plurinacional Plataforma Digital .  Y Al Click De Botón!

### Horizonte Nebuloso Promisor E Ineludible En El Camino Del Éxito

- [ ] Amarramientos Sólidos Al Dinero Palpal Y Divisas Extertoriales Mündanos (Integradoras de Red De Pagos , Las Vías de Efectivo, Stripe Card V. , Las Iyzipay Turkish , Etcs  ). 
- [ ] Cartas Escritas Fieles De Certificación Identidad  De Recieén Llegados - Cúpulas de Confirmation Y  Flow Of Emails  Registrables Veraces Autenticos E-Mails De Vuelta.  
- [ ]  Ataque Coordinado Bélico Y  Ejrcitante Hacia Propias Huestes Internas y Falsos Positivios   (El Integration System Y Los Testeos Generales  )
- [ ] Almacenamiento Estribante Embalado Totalitario Intercomunicable De Raices Inter-Aplicaciones, (Nacimiento de Compose Total Y Localización Universal Local-Containers Dockerizados por completo Front / Backend Unificado).   
- [ ] La Cañería Perpetuante Mágica — CanALES Azure DevOps CI / Los Flujos Ininterrompidos Rápidos GH Actions  CD (Automaciones Integratorias Extensivas Despliegatorias A Red Activa )
- [ ] Inclusión Masiva Eterial "Cloud Native" Flotatoría — Aclimatación De Las Estructuras Complejas Azure Applicativas  ("Azure Container Apps Y El App Service ") AbierTäs a La Visibilidad Y  Transmisiones Digitales A Tolas Cíudades Terrestres Conectivas . 
- [ ] Las Bóvedas Imperiales Del Secreto De Rey. — Fortalezas Y Ocultamientos Cifrados en Claves Vitales Ocultar a Nivel Del Firmamento Las Azure Key Valtus Sistemáticas Cífradas Secretariales Inhacceables E Irrompilbes Físicas Del Codígo En Vivo De La Nube . 

---

<p align="center">
  <sub>L'Élévation de cet édifice s'est tenue par usages conjugués : .NET 10 &bull; React &bull; Clean Architecture &bull; CQRS &bull; Et L'Approche Dominée Au Domaine (DDD)</sub>
</p>
