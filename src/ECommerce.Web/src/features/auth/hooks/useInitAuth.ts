import { useEffect } from 'react';
import { getMe } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/store/authStore';

export function useInitAuth() {
    const setUser = useAuthStore((state) => state.setUser);
    const clearUser = useAuthStore((state) => state.clearUser);
    const setAuthLoading = useAuthStore((state) => state.setAuthLoading);

    useEffect(() => {
        let mounted = true;

        async function init() {
            try {
                const user = await getMe();
                if (mounted) {
                    setUser(user);
                }
            } catch (error) {
                if (mounted) {
                    // If resolving me fails (e.g. 401), we consider them logged out silently
                    clearUser();
                }
            } finally {
                if (mounted) {
                    setAuthLoading(false);
                }
            }
        }

        init();

        return () => {
            mounted = false;
        };
    }, [setUser, clearUser, setAuthLoading]);
}
