Frontend Workspace Rules

Activation: Always On

This document defines non-negotiable rules for all frontend development activities, including customer-facing SPA and admin panel interfaces.


1. Technology Stack

-React (latest stable)

- TypeScript strict mode ENABLED

- Vite or equivalent modern bundler

- No JavaScript-only code in production paths

- Type safety is mandatory.
any usage is FORBIDDEN unless explicitly justified and approved.


2. Architectural Principles

- Frontend is a presentation and orchestration layer

- Business rules MUST reside in the backend

- Frontend MUST assume backend as the single source of truth

Frontend logic may:

- Format data

- Manage UI state

- Handle optimistic UX patterns

Frontend logic MUST NOT:

- Enforce business rules

- Derive authorization decisions

- Duplicate backend validations (except UX-level prechecks)


3. State Management Rules

- Server state → React Query (or equivalent)

- Client/UI state → Zustand (or equivalent lightweight store)

Rules:

- No global state for transient UI concerns

- No server data stored in client state

- Cache invalidation must be explicit

useEffect usage is RESTRICTED to:

- Side effects only

- No business logic

- No data orchestration logic


4. API Integration

- All API access MUST go through a dedicated API layer

- No direct fetch or axios calls inside components

- DTOs must be strongly typed

- Backend contracts are authoritative

Error handling MUST:

- Distinguish between 4xx and 5xx

- Surface user-safe messages only

- Never expose internal error details


5. Authentication & Authorization

- Frontend authentication state is derived, not authoritative

- Backend is ALWAYS the source of truth

Rules:

- No token storage in localStorage or sessionStorage

- httpOnly cookie-based auth assumed

- Route guards are UX-level only

Admin access checks MUST:

- Be validated server-side

- Never rely solely on frontend conditions


6. Component Design

Components must be:

- Small

- Predictable

- Single-responsibility

Rules:

- No “god components”

- No implicit data fetching

- Hooks encapsulate behavior, components render UI

Reusable components MUST:

- Be framework-agnostic where possible

- Avoid coupling to business semantics


7. Admin Panel Constraints

- Admin UI is NOT a trusted environment

- All admin actions require backend authorization

Destructive actions MUST:

- Require confirmation

- Be idempotent when possible

- Be auditable via backend logs

Frontend MUST assume:

- Admin users can make mistakes

- Admin UI failures are high impact


8. Performance & UX

- Loading states are MANDATORY

- Error states are MANDATORY

- Empty states are MANDATORY

Rules:

- No blocking renders for async operations

- Pagination and virtualization for large lists

- Avoid premature optimization, but prevent obvious inefficiencies


9. Security Defaults

- No sensitive data logged in browser console

- No secrets embedded in frontend builds

- CSP-friendly patterns preferred

Frontend MUST behave as if:

- Source code is publicly visible

- Requests can be tampered with

- Users are untrusted by default


10. Scope Control

The agent MUST NOT:

- Add new screens without request

- Invent UX flows

- Redesign layouts unless explicitly asked

If a UX decision impacts:

- Security

- Authorization

- Data integrity

- The agent MUST STOP and ask for confirmation.


11. Final Principle

Frontend exists to:

- Serve the user

- Reflect backend truth

- Fail safely

It does NOT exist to:

- Be clever

- Be autonomous

- Be authoritative