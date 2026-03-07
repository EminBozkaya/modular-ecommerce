import { apiClient } from '../../../api/client';
import type { AddToBasketRequest, Basket } from '../types/basket';
import { mockGetBasket, mockAddToBasket, mockRemoveFromBasket } from './mock';

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
