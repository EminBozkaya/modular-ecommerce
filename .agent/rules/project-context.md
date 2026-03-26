# Project Overview & Context

## What Is This Project?
White-label e-commerce platform. Single codebase, multiple deployments (one per business domain).
Currently in staging — deployed to Railway (API), Cloudflare Pages (SPA), Neon (PostgreSQL), Upstash (Redis).

## Tech Stack
- **Backend:** .NET 10, C# 14, ASP.NET Core, EF Core 10, PostgreSQL 16, Redis, MediatR, FluentValidation, Serilog
- **Frontend:** React 19, TypeScript (strict mode), Vite, TailwindCSS, shadcn/ui, React Query v5, Zustand v4, Axios, AG Grid, Recharts, React Router v6
- **Architecture:** Modular Monolith + Clean Architecture + CQRS + DDD
- **Testing:** xUnit, FluentAssertions, NSubstitute, NetArchTest.Rules

## Repo Structure
```
ECommerce/
├── src/
│   ├── ECommerce.Domain/          # Pure domain — ZERO dependencies
│   ├── ECommerce.Application/     # CQRS via MediatR — NO EF Core
│   ├── ECommerce.Persistence/     # EF Core + PostgreSQL
│   ├── ECommerce.Infrastructure/  # JWT, Redis, Payment stub, CurrentUser
│   └── ECommerce.API/             # Controllers + Middleware + DI
│
├── src/ECommerce.Web/             # React SPA
│   └── src/
│       ├── api/                   # Axios client (withCredentials) + error handling
│       ├── app/                   # Router + Providers (QueryClient + AuthInitializer)
│       ├── components/            # Shared (LoadingSpinner, ErrorMessage, EmptyState) + Layouts
│       ├── features/              # catalog | basket | auth | ordering | admin | favorites
│       ├── hooks/                 # Global hooks (useDebounce)
│       ├── store/                 # Zustand (authStore, basketUiStore, uiStore)
│       ├── types/                 # ApiResponse<T>, PaginatedResult<T>
│       └── utils/                 # queryKeys, formatters, idempotency, unitConfig, priceCalculator
│
└── tests/
    ├── ECommerce.UnitTests/       # Domain + handler tests
    ├── ECommerce.ArchitectureTests/ # Layer dependency enforcement
    └── ECommerce.IntegrationTests/  # Placeholder
```

## Dependency Flow (strict — enforced by architecture tests)
```
Domain         ← zero dependencies
Application    ← Domain only
Persistence    ← Domain only (NOT Application)
Infrastructure ← Domain, Application
API            ← Application, Persistence, Infrastructure
```

## StoreSettings Architecture (implemented)
- Backend: `StoreSettings` entity → `jsonb` Settings column in PostgreSQL
- Public endpoint: `GET /api/store/settings` (no auth — storefront reads on boot)
- Admin endpoints: `GET|PUT /api/admin/store-settings` (Admin role)
- Frontend: `StoreSettingsContext` + `useStoreSettings()` hook wraps the whole app
- Dynamic: `MainLayout` + `AppHeader` read backgroundColor, primaryColor, logo, banner from context

## White-Label Deployment Model
- Single codebase → multiple deployments
- Each deployment: different domain, branding, product catalog
- Branding config: per-deployment environment variables
- Admin panel: same domain under `/admin` prefix — no separate domain needed

## Commands Reference
```bash
# Frontend
cd src/ECommerce.Web
npm run dev           # dev server
npm run build         # production build
npx tsc --noEmit      # type check (must pass with 0 errors)

# Backend
dotnet run --project src/ECommerce.API
dotnet test ECommerce.sln
dotnet build ECommerce.sln
dotnet ef database update --project src/ECommerce.Persistence --startup-project src/ECommerce.API
dotnet ef migrations add <Name> --project src/ECommerce.Persistence --startup-project src/ECommerce.API
```

## Environment Variables
```
VITE_API_BASE_URL=https://localhost:5001
VITE_USE_MOCK_API=true   # false when backend is running
```

## Non-Negotiable Rules (Always Apply)
- TypeScript strict mode — `any` is FORBIDDEN
- No direct `fetch`/`axios` in components — all HTTP through `src/api/client.ts`
- Server state → React Query only. UI state → Zustand only. Never mix.
- No tokens in `localStorage` or `sessionStorage` — httpOnly cookies only
- Frontend route guards are UX-only — backend always enforces authorization
- Every data-fetching component MUST handle: loading, error, empty states
- Backend is the single source of truth — never recalculate totals/prices on frontend
- Soft delete is mandatory on all backend entities
- Domain layer has ZERO infrastructure dependencies
- Controllers contain ZERO business logic

## Scope Control — STOP Conditions
Stop and ask before proceeding if:
- Requirements are ambiguous or incomplete
- A UX decision affects security, authorization, or data integrity
- Proposed change adds endpoints or screens not explicitly requested
- Domain model change is required
