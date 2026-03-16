# ECommerce Platform — Claude Code Context

## Project Overview
White-label e-commerce SPA + .NET 10 backend. Single codebase, multiple deployments (one per business domain on Azure). Architecture: Modular Monolith + Clean Architecture + CQRS + DDD.

## Repo Structure
```
ECommerce/
├── src/
│   ├── ECommerce.Domain/        # Pure domain — zero dependencies
│   ├── ECommerce.Application/   # CQRS via MediatR — NO EF Core
│   ├── ECommerce.Persistence/   # EF Core + PostgreSQL
│   ├── ECommerce.Infrastructure/# JWT, Payment, Redis, Serilog
│   └── ECommerce.API/           # Controllers + Middleware + DI
│
└── src/ECommerce.Web/           # React SPA (Vite + TypeScript)
    └── src/
        ├── api/                 # Axios client + error handling
        ├── app/                 # Router + Providers
        ├── components/          # Shared UI + Layouts
        ├── features/            # catalog | basket | auth | ordering | admin
        ├── store/               # Zustand (UI state only)
        ├── types/               # Global TS types
        └── utils/               # queryKeys, formatters, idempotency
```

## Current Milestone Status
- [x] M1 — Project scaffold
- [x] M2 — Catalog (listing, detail, category filter, search, pagination)
- [x] M2.5 — Multi-language support (TR/EN/DE): translation tables, Accept-Language pipeline, React Query cache keyed by language, i18n UI, cross-language search
- [x] M3 — Auth (login, register, session restore, route guard)
- [x] M4 — Basket (guest+member, optimistic update, price snapshot)
- [ ] M5 — Order & Checkout
- [ ] M6 — Admin Panel (product/category CRUD scaffolded; translation UI pending architecture refactor)
- [ ] M7 — Azure DevOps + CI/CD

## Active Work: Translation Architecture Refactor
**Status:** Decision made, implementation pending.
**Why:** Current hybrid model (entity.Name = TR, translations table = EN/DE) is architecturally wrong for a global white-label product. A British admin deploying the platform would write English names into a "Turkish field". No TR translation can ever be added post-hoc because TR is treated as the base, not as one peer language.
**Target:** Language-agnostic model — ALL languages (including TR) live in translation tables. `DefaultLanguage` is configurable in `appsettings.json`.
**Blocked by this:** M6 admin panel translation UI.
**Next session:** Start with translation architecture refactor, then continue M6 admin panel.

## Commands
```bash
# Frontend
cd src/ECommerce.Web
npm run dev          # dev server
npm run build        # production build
npx tsc --noEmit     # type check (must pass with 0 errors)

# Backend
dotnet run --project src/ECommerce.API
dotnet test ECommerce.sln
dotnet ef database update --project src/ECommerce.Persistence --startup-project src/ECommerce.API
```

## Environment
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

## Detailed Rules Reference
@.claude/rules/architecture.md
@.claude/rules/frontend.md
@.claude/rules/backend.md
@.claude/rules/security.md

## Scope Control — STOP Conditions
Stop and ask before proceeding if:
- Requirements are ambiguous or incomplete
- A UX decision affects security, authorization, or data integrity
- Proposed change adds endpoints or screens not explicitly requested
- Domain model change is required
