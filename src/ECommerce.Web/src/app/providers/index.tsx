import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from '../router';
import { useEffect } from 'react';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

import { useInitAuth } from '@/features/auth/hooks/useInitAuth';
import { useAuthStore } from '@/store/authStore';
import { StoreSettingsProvider, useStoreSettingsStatus } from '@/context/StoreSettingsContext';
import { useThemeStore } from '@/store/themeStore';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { SiteUnavailablePage } from '@/components/shared/SiteUnavailablePage';
import { SplashScreen } from '@/components/shared/SplashScreen';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

// Blocks rendering until store settings are fetched.
// - loading → branded SplashScreen (or default spinner for white-label builds)
// - error   → SiteUnavailablePage (unless VITE_FALLBACK_DEFAULTS=true)
function StoreSettingsGate({ children }: { children: React.ReactNode }) {
    const status = useStoreSettingsStatus();
    if (status === 'loading') return <SplashScreen />;
    if (status === 'error') return <SiteUnavailablePage />;
    return <>{children}</>;
}

function AuthInitializer({ children }: { children: React.ReactNode }) {
    useInitAuth();
    const isAuthLoading = useAuthStore((s) => s.isAuthLoading);

    if (isAuthLoading) return <LoadingSpinner size="lg" className="h-screen w-full flex items-center justify-center" />;
    return <>{children}</>;
}

function SystemThemeListener() {
    const { preference, setTheme } = useThemeStore();

    useEffect(() => {
        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => {
            if (useThemeStore.getState().preference === 'system') {
                setTheme('system');
            }
        };
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync on mount in case the preference was 'system' and system theme changed while app was closed
    useEffect(() => {
        if (preference === 'system') {
            setTheme('system');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}

export function AppProviders() {
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <SystemThemeListener />
                <StoreSettingsProvider>
                    <StoreSettingsGate>
                        <AuthInitializer>
                            <RouterProvider router={router} />
                        </AuthInitializer>
                    </StoreSettingsGate>
                </StoreSettingsProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    );
}

