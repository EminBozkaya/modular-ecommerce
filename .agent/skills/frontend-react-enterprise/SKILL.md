---
name: frontend-react-enterprise
description: Production-grade React + TypeScript SPA — separation of concerns, predictable state management, performance focus
---

# Frontend React Enterprise Skill

## Ne Zaman Kullanılır
- Müşteri SPA feature'ları (Catalog, Basket, Checkout, Orders)
- Admin panel ekranları
- API entegrasyonları
- Yeni component/hook geliştirme

## Stack
- React (latest stable) + TypeScript strict mode + Vite
- TailwindCSS + shadcn/ui
- React Router v6, TanStack React Query v5, Zustand v4, Axios

## Kurallar

### State Yönetimi
- Server state → React Query (exclusively)
- UI/client state → Zustand (exclusively)
- useEffect: SADECE side effects — iş mantığı / orchestration YASAK

### API Katmanı
- Tüm HTTP çağrıları `src/api/client.ts` üzerinden
- Component içinde doğrudan fetch/axios YASAK
- Tüm API fonksiyonları strongly typed DTO döner
- 4xx vs 5xx ayrımı — sadece user-safe mesajlar gösterilir

### Component Tasarımı
- Küçük, tek sorumluluklu component'ler
- Hook'lar davranışı kapsar — component'ler UI render eder
- Her async component: loading, error, empty state handle ZORUNLU
- Shared component'ler: `<LoadingSpinner />`, `<ErrorMessage />`, `<EmptyState />`

### Query Key Yönetimi
- Tüm key'ler `src/utils/queryKeys.ts` içinde tanımlı
- Pattern: `queryKeys.catalog.products.list(params)`

### Auth
- httpOnly cookies — localStorage/sessionStorage YASAK
- `authStore`: yalnızca `{ user, isAuthenticated, isAuthLoading }`
- Route guard'lar: UX-only (`ProtectedRoute.tsx`)

### Admin Panel
- `/admin` prefix — aynı domain, aynı deployment
- Tüm admin mutation'lar backend authorization gerektirir
- Destructive action'larda confirmation step ZORUNLU

## Çıktı Hedefleri
- Type-safe API kullanımı
- Responsive UI
- Tamamen handle edilmiş error/loading state'ler