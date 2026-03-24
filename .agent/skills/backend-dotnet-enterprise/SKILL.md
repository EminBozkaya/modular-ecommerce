---
name: backend-dotnet-enterprise
description: Enterprise-grade ASP.NET Core API tasarımı — Clean Architecture, CQRS, EF Core, production-ready patterns
---

# Backend .NET Enterprise Skill

## Ne Zaman Kullanılır
- Yeni API endpoint oluştururken
- Domain model tasarımında
- Command / Query implementasyonunda
- Transactional business logic yazarken

## Çıktı Hedefleri
- Test edilebilir kod
- Net sorumluluk ayrımı (Separation of Concerns)
- Production-safe pattern kullanımı

## Kurallar
1. **Domain önce** — Entity, Value Object, Invariant'lar tanımlanır
2. **Application ikinci** — Command/Query, Handler, Validator oluşturulur
3. **Infrastructure sonra** — Repository implementasyonları, external servisler
4. **Controller EN SON** — Sadece orchestration, iş mantığı YASAK

## Karar Ağacı
- Yazma işlemi → Command + Handler
- Okuma işlemi → Query + Projection (AsNoTracking zorunlu)
- Dış sistem → Interface (Domain) + Infrastructure implementasyonu

## Stack
- .NET 10, C# 14, ASP.NET Core
- EF Core 10 (Code First), PostgreSQL 16
- MediatR (CQRS), FluentValidation, Serilog, Redis

## EF Core Standartları
- Soft delete ZORUNLU (via `AuditAndSoftDeleteInterceptor`)
- Global query filter: `IsDeleted == false`
- `AsNoTracking()` tüm read query'lerde varsayılan
- Fluent API ile configuration — Data Annotation YASAK
- Raw SQL: sadece performans-kritik durumlar

## Repository Pattern
- Aggregate-specific repository'ler (generic `IRepository<T>` YASAK)
- Interface Domain'de, implementasyon Persistence'da