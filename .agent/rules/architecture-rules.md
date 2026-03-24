# Architecture Rules

## Approach
- Architecture: Modular Monolith — microservices decomposition is FORBIDDEN
- Patterns: Clean Architecture + CQRS + DDD — mandatory on all layers
- Advanced patterns (Saga, Event Sourcing, Read Replicas): ONLY when explicitly requested

## Layer Discipline
- Domain: MUST NOT reference Infrastructure or EF Core attributes
- Application: MUST NOT reference HTTP, DB, or cache concerns
- API: MUST NOT contain business logic — orchestration only
- Persistence depends ONLY on Domain — not on Application

## Dependency Flow (read-only reference)
```
Domain ← (zero dependencies)
Application ← Domain
Persistence ← Domain only
Infrastructure ← Domain, Application
API ← Application, Persistence, Infrastructure
```

## Bounded Contexts
| Context   | Responsibility |
|-----------|----------------|
| Catalog   | Products, categories, stock |
| Basket    | Cart for guests and members |
| Ordering  | Order lifecycle + state machine |
| Payment   | Tokenized, idempotent processing |
| Identity  | JWT auth, roles |

## Decision Protocol
- Explain WHY an approach was chosen
- State which alternatives were rejected and why
- If requirements are incomplete: STOP and ask — do not proceed
