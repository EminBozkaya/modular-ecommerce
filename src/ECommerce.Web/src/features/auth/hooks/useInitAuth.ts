import { useEffect } from 'react';
import { getMe } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/store/authStore';

let initStarted = false;

export function useInitAuth() {
    const setUser = useAuthStore((state) => state.setUser);
    const clearUser = useAuthStore((state) => state.clearUser);
    const setAuthLoading = useAuthStore((state) => state.setAuthLoading);

    useEffect(() => {
        if (initStarted) return;
        initStarted = true;

        async function init() {
            try {
                const user = await getMe();
                setUser(user);
            } catch (error) {
                // If resolving me fails (e.g. 401), we consider them logged out silently
                clearUser();
            } finally {
                setAuthLoading(false);
            }
        }

        init();
    }, [setUser, clearUser, setAuthLoading]);
}
