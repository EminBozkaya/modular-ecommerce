---
description: Admin panel özelliği ekleme workflow'u — yetkilendirme, backend endpoint, admin UI tasarımı
---

# Admin Panel Feature Workflow

Step 1 — Access & Scope

Required role(s)

Read-only or mutating operation?

Audit requirement?

If unclear: ASK and STOP

Step 2 — Activate Skills

frontend-react-enterprise

backend-dotnet-enterprise

security-enterprise

Step 3 — Backend Capability Check

Existing endpoint reusable?

Authorization policy defined?

Validation and constraints clear?

WAIT for approval.

Step 4 — Admin UI Design

Data table / form / dashboard pattern

Filtering, sorting, pagination

Destructive action confirmation

Step 5 — End-to-End Wiring

Secure API integration

Optimistic vs pessimistic updates

Error and rollback handling

Step 6 — Review

Authorization enforcement (backend-first)

Audit/logging verification

UX safety for destructive actions

STOP.