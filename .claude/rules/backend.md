# Backend Rules

## Stack
- .NET 10, C# 14, ASP.NET Core
- EF Core 10 (Code First), PostgreSQL 16
- MediatR (CQRS), FluentValidation, Serilog, Redis

## CQRS Convention
- Every write operation → Command + Handler
- Every read operation → Query + Projection
- Controllers perform orchestration only — no business logic

## EF Core Standards
- Soft delete is MANDATORY on all entities (via `AuditAndSoftDeleteInterceptor`)
- Global query filters MUST filter soft-deleted records
- `AsNoTracking()` is the default for all read queries
- Raw SQL: only for performance-critical cases with justification

## Domain Design Order
1. Domain layer first (entities, value objects, invariants)
2. Application layer second (commands, queries, handlers, validation)
3. Infrastructure/Persistence last
4. Controllers written LAST

## Repository Pattern
- Aggregate-specific repositories only (no generic `IRepository<T>`)
- Repository interfaces live in Domain
- Implementations live in Persistence

## Logging
- Serilog structured logging — mandatory
- Sensitive data (passwords, card data, tokens) MUST NOT be logged

## Scope Control
- Do NOT add extra endpoints beyond what was requested
- Do NOT propose scope expansion
