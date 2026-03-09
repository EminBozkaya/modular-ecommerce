# Frontend Rules

## Stack
- React (latest stable) + TypeScript strict mode + Vite
- TailwindCSS + shadcn/ui
- React Router v6, TanStack React Query v5, Zustand v4, Axios

## State Management
- Server state → React Query exclusively
- UI/client state → Zustand exclusively
- Never sync server state into Zustand
- Cache invalidation must be explicit
- `useEffect` is restricted to side effects only — no business logic, no orchestration

## API Layer
- No direct `fetch` or `axios` in components
- All HTTP calls go through `src/api/client.ts`
- All API functions return strongly typed DTOs
- Errors: distinguish 4xx vs 5xx — surface only user-safe messages

## Component Design
- Small, single-responsibility components
- No "God Components"
- Hooks encapsulate behavior — components render UI
- Every async component MUST handle: loading state, error state, empty state
- Use shared components: `<LoadingSpinner />`, `<ErrorMessage />`, `<EmptyState />`

## Query Keys
- All React Query keys defined in `src/utils/queryKeys.ts`
- Pattern: `queryKeys.catalog.products.list(params)`, `queryKeys.basket.current`, etc.

## Mock/Real API Toggle
- `VITE_USE_MOCK_API=true` → mock data with simulated delay
- `VITE_USE_MOCK_API=false` → real Axios calls to backend
- Toggle lives in each feature's `api/` layer — zero code changes required to switch

## Auth
- httpOnly cookies — no tokens in localStorage or sessionStorage
- `authStore` holds only: `{ user, isAuthenticated, isAuthLoading }`
- Route guards in `ProtectedRoute.tsx` are UX-only

## Admin Panel
- Lives under `/admin` prefix — same domain, same deployment
- All admin mutations require backend authorization
- Destructive actions MUST have confirmation step

## Scope Control
- Do NOT add screens without explicit request
- Do NOT invent UX flows
- If a UX decision affects security or data integrity: STOP and ask
