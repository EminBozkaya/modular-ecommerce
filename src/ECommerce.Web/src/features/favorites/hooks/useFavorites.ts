import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getWishlist,
    getWishlistProductIds,
    addToWishlist,
    removeFromWishlist,
} from '../api/favoritesApi';
import { queryKeys } from '../../../utils/queryKeys';
import { useAuthStore } from '../../../store/authStore';
import { useState, useEffect } from 'react';

const GUEST_WISHLIST_KEY = 'ebrar_guest_wishlist';

const getGuestWishlist = (): string[] => {
    const stored = localStorage.getItem(GUEST_WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
};

const setGuestWishlist = (ids: string[]) => {
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(ids));
};

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
    const [guestIds, setGuestIds] = useState<string[]>(getGuestWishlist());

    // Listen for storage changes (for multi-tab or local updates)
    useEffect(() => {
        if (!isAuthenticated) {
            const handleStorage = () => setGuestIds(getGuestWishlist());
            window.addEventListener('storage', handleStorage);
            return () => window.removeEventListener('storage', handleStorage);
        }
    }, [isAuthenticated]);

    const query = useQuery({
        queryKey: queryKeys.wishlist.productIds,
        queryFn: getWishlistProductIds,
        enabled: isAuthenticated,
        staleTime: 60 * 1000,
    });

    return isAuthenticated ? query : { ...query, data: guestIds, isLoading: false };
};

export const useToggleFavorite = () => {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuthStore();

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
        if (isAuthenticated) {
            if (isFavorited) {
                removeMutation.mutate(productId);
            } else {
                addMutation.mutate(productId);
            }
        } else {
            // Guest logic
            const current = getGuestWishlist();
            const updated = isFavorited
                ? current.filter(id => id !== productId)
                : [...current, productId];

            setGuestWishlist(updated);
            // Trigger local update
            window.dispatchEvent(new Event('storage'));
            queryClient.setQueryData(queryKeys.wishlist.productIds, updated);
        }
    };

    return {
        toggle,
        isLoading: addMutation.isPending || removeMutation.isPending,
    };
};
