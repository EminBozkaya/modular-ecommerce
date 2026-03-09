import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getWishlist,
    getWishlistProductIds,
    addToWishlist,
    removeFromWishlist,
} from '../api/favoritesApi';
import { queryKeys } from '../../../utils/queryKeys';
import { useAuthStore } from '../../../store/authStore';

export const useWishlist = () => {
    const { isAuthenticated } = useAuthStore();
    return useQuery({
        queryKey: queryKeys.wishlist.items,
        queryFn: getWishlist,
        enabled: isAuthenticated,
        staleTime: 60 * 1000,
    });
};

export const useWishlistProductIds = () => {
    const { isAuthenticated } = useAuthStore();
    return useQuery({
        queryKey: queryKeys.wishlist.productIds,
        queryFn: getWishlistProductIds,
        enabled: isAuthenticated,
        staleTime: 60 * 1000,
    });
};

export const useToggleFavorite = () => {
    const queryClient = useQueryClient();

    const addMutation = useMutation({
        mutationFn: addToWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.items });
            queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.productIds });
        },
    });

    const removeMutation = useMutation({
        mutationFn: removeFromWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.items });
            queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.productIds });
        },
    });

    const toggle = (productId: string, isFavorited: boolean) => {
        if (isFavorited) {
            removeMutation.mutate(productId);
        } else {
            addMutation.mutate(productId);
        }
    };

    return {
        toggle,
        isLoading: addMutation.isPending || removeMutation.isPending,
    };
};
