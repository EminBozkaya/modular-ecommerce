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

import { getProductById } from '../../catalog/api/catalogApi';
import type { WishlistItem } from '../types/favorite';

const GUEST_WISHLIST_KEY = 'guest_wishlist';

const getGuestWishlist = (): string[] => {
    const stored = localStorage.getItem(GUEST_WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
};

const setGuestWishlist = (ids: string[]) => {
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(ids));
};

const fetchGuestWishlist = async (): Promise<WishlistItem[]> => {
    const ids = getGuestWishlist();
    if (ids.length === 0) return [];

    const items = await Promise.allSettled(ids.map(id => getProductById(id)));
    const validItems: WishlistItem[] = [];

    items.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
            const product = result.value;
            validItems.push({
                id: product.id,
                productId: product.id,
                productName: product.name,
                price: product.price,
                currency: product.currency,
                imageUrl: product.imageUrl ?? null,
                categoryName: product.categoryName ?? '',
                stockQuantity: product.stockQuantity,
                isActive: product.isActive,
                unitName: product.unitName,
                unitCode: product.unitCode,
                addedAt: new Date().toISOString()
            });
        }
    });

    return validItems;
};

export const useWishlist = () => {
    const { isAuthenticated } = useAuthStore();
    return useQuery({
        queryKey: queryKeys.wishlist.items,
        queryFn: isAuthenticated ? getWishlist : fetchGuestWishlist,
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
            queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.items });
        }
    };

    return {
        toggle,
        isLoading: addMutation.isPending || removeMutation.isPending,
    };
};
