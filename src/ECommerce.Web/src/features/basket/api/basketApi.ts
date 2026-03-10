import { apiClient } from '../../../api/client';
import type { AddToBasketRequest, Basket, UpdateBasketItemRequest } from '../types/basket';
import { mockGetBasket, mockAddToBasket, mockRemoveFromBasket, mockUpdateBasketItem } from './mock';

const isMock = import.meta.env.VITE_USE_MOCK_API === 'true';

export async function getBasket(): Promise<Basket> {
    if (isMock) {
        return mockGetBasket();
    }
    const response = await apiClient.get<Basket>('/api/basket');
    return response.data;
}

export async function addToBasket(req: AddToBasketRequest): Promise<Basket> {
    if (isMock) {
        return mockAddToBasket(req);
    }
    const response = await apiClient.post<Basket>('/api/basket/items', req);
    return response.data;
}

export async function removeFromBasket(productId: string): Promise<Basket> {
    if (isMock) {
        return mockRemoveFromBasket(productId);
    }
    const response = await apiClient.delete<Basket>(`/api/basket/items/${productId}`);
    return response.data;
}

export async function updateBasketItem(req: UpdateBasketItemRequest): Promise<Basket> {
    if (isMock) {
        return mockUpdateBasketItem(req);
    }
    // PUT /api/basket/items — not yet implemented on backend, falls back to mock in VITE_USE_MOCK_API=false mode
    const response = await apiClient.put<Basket>('/api/basket/items', req);
    return response.data;
}
