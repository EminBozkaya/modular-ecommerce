import { apiClient } from '../../../api/client';
import type { WishlistItem } from '../types/favorite';
import {
    mockGetWishlist,
    mockGetWishlistProductIds,
    mockAddToWishlist,
    mockRemoveFromWishlist,
    mockClearWishlist,
} from './mock';

const isMock = import.meta.env.VITE_USE_MOCK_API === 'true';

export async function getWishlist(): Promise<WishlistItem[]> {
    if (isMock) return mockGetWishlist();
    const response = await apiClient.get<WishlistItem[]>('/api/wishlist');
    return response.data;
}

export async function getWishlistProductIds(): Promise<string[]> {
    if (isMock) return mockGetWishlistProductIds();
    const response = await apiClient.get<string[]>('/api/wishlist/product-ids');
    return response.data;
}

export async function addToWishlist(productId: string): Promise<void> {
    if (isMock) return mockAddToWishlist(productId);
    await apiClient.post(`/api/wishlist/${productId}`);
}

export async function removeFromWishlist(productId: string): Promise<void> {
    if (isMock) return mockRemoveFromWishlist(productId);
    await apiClient.delete(`/api/wishlist/${productId}`);
}

export async function clearWishlist(): Promise<void> {
    if (isMock) return mockClearWishlist();
    await apiClient.delete('/api/wishlist');
}
