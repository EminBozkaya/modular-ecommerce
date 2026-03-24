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
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { StoreSettingsProvider, useStoreSettingsReady } from '@/context/StoreSettingsContext';
import { useThemeStore } from '@/store/themeStore';

// Blocks rendering until store settings are fetched (or 3-second timeout elapses).
// Prevents the flash of default branding before real settings arrive.
function StoreSettingsGate({ children }: { children: React.ReactNode }) {
    const isReady = useStoreSettingsReady();
    if (!isReady) return <LoadingSpinner size="lg" className="h-screen w-full flex items-center justify-center" />;
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
    );
}

