# Security Rules

## Authentication
- JWT via httpOnly secure cookies — mandatory
- Access tokens: 15-minute lifetime
- Refresh token rotation: mandatory on every use
- Frontend auth state is derived, never authoritative

## Authorization
- Backend is ALWAYS the source of truth
- Frontend route guards are UX-only (`ProtectedRoute.tsx`)
- Admin endpoints: `[Authorize(Roles = "Admin")]` on all controllers

## Absolute Prohibitions
- Tokens in localStorage or sessionStorage: FORBIDDEN
- Card data persistence anywhere: FORBIDDEN
- Hardcoded secrets in any file: FORBIDDEN
- Sensitive data in browser console logs: FORBIDDEN

## Payment Security
- Tokenized payments only — no raw card data stored
- Idempotency key: `(OrderId, IdempotencyKey)` unique index prevents duplicate charges
- Card fields cleared from frontend state immediately after submission

## Secure Defaults
- HTTPS mandatory in all environments
- Rate limiting: 100 req/min per IP (already implemented)
- CORS: strict whitelist policy
- Password hashing: PBKDF2 SHA-256, 100K iterations

## Threat Model Assumption
- Frontend source code is publicly visible
- All requests can be intercepted and tampered with
- Users are untrusted by default
