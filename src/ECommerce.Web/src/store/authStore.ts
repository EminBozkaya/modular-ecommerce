import { create } from 'zustand';
import type { AuthUser } from '@/features/auth/types/auth';

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isAuthLoading: boolean; // true while getMe() is in flight on app boot
}

interface AuthActions {
    setUser: (user: AuthUser) => void;
    clearUser: () => void;
    setAuthLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
    user: null,
    isAuthenticated: false,
    isAuthLoading: true,

    setUser: (user) => set({ user, isAuthenticated: true }),
    clearUser: () => set({ user: null, isAuthenticated: false }),
    setAuthLoading: (loading) => set({ isAuthLoading: loading }),
}));
