import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from '../router';

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

function AuthInitializer({ children }: { children: React.ReactNode }) {
    useInitAuth();
    const isAuthLoading = useAuthStore((s) => s.isAuthLoading);

    if (isAuthLoading) return <LoadingSpinner size="lg" className="h-screen w-full flex items-center justify-center" />;
    return <>{children}</>;
}

export function AppProviders() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthInitializer>
                <RouterProvider router={router} />
            </AuthInitializer>
        </QueryClientProvider>
    );
}

