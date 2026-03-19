import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { login } from '@/features/auth/api/authApi';
import type { LoginRequest, AuthResponse } from '@/features/auth/types/auth';
import { useAuthStore } from '@/store/authStore';
import { queryKeys } from '@/utils/queryKeys';
import type { ApiError } from '@/api/errorHandling';
import { addToWishlist } from '@/features/favorites/api/favoritesApi';

const GUEST_WISHLIST_KEY = 'guest_wishlist';

export function useLogin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const setUser = useAuthStore((state) => state.setUser);

    return useMutation<AuthResponse, ApiError, LoginRequest>({
        mutationFn: (data: LoginRequest) => login(data),
        onSuccess: async (response) => {
            setUser(response.user);

            // Sync guest favorites
            const guestWishlist = localStorage.getItem(GUEST_WISHLIST_KEY);
            if (guestWishlist) {
                try {
                    const productIds: string[] = JSON.parse(guestWishlist);
                    if (productIds.length > 0) {
                        // Sync sequentially to avoid overwhelming mock/real API 
                        // and ensure all are added before invalidation
                        for (const id of productIds) {
                            await addToWishlist(id);
                        }
                        localStorage.removeItem(GUEST_WISHLIST_KEY);
                    }
                } catch (error) {
                    console.error('Failed to sync guest wishlist:', error);
                }
            }

            queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
            queryClient.invalidateQueries({ queryKey: queryKeys.basket.current });
            queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.items });
            queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.productIds });

            const redirectTo = searchParams.get('redirect') || '/';
            navigate(redirectTo);
        },
    });
}
