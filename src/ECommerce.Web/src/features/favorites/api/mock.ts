import type { WishlistItem } from '../types/favorite';
import { mockProducts } from '../../catalog/api/mock';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let mockWishlistProductIds: string[] = [];

export async function mockGetWishlist(): Promise<WishlistItem[]> {
    await delay(300);
    return mockWishlistProductIds
        .map((pid) => {
            const product = mockProducts.find((p) => p.id === pid);
            if (!product) return null;
            return {
                id: `wl-${pid}`,
                productId: product.id,
                productName: product.name,
                price: product.price,
                currency: product.currency,
                imageUrl: product.imageUrl,
                categoryName: product.categoryName,
                stockQuantity: product.stockQuantity,
                isActive: product.isActive,
                unitName: product.unitName,
                unitCode: product.unitCode,
                addedAt: new Date().toISOString(),
            } satisfies WishlistItem;
        })
        .filter((item): item is WishlistItem => item !== null);
}

export async function mockGetWishlistProductIds(): Promise<string[]> {
    await delay(200);
    return [...mockWishlistProductIds];
}

export async function mockAddToWishlist(productId: string): Promise<void> {
    await delay(300);
    if (!mockWishlistProductIds.includes(productId)) {
        mockWishlistProductIds.push(productId);
    }
}

export async function mockRemoveFromWishlist(productId: string): Promise<void> {
    await delay(300);
    mockWishlistProductIds = mockWishlistProductIds.filter((id) => id !== productId);
}

export async function mockClearWishlist(): Promise<void> {
    await delay(300);
    mockWishlistProductIds = [];
}
