import { apiClient } from '../../../api/client';
import type { Category, Product, ProductListParams } from '../types/product';
import type { PaginatedResult } from '../../../types/api';
import { mockCategories, mockProducts, mockPaginate } from './mock';

const isMock = import.meta.env.VITE_USE_MOCK_API === 'true';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getProducts(params: ProductListParams): Promise<PaginatedResult<Product>> {
    if (isMock) {
        await delay(400);
        let items = [...mockProducts];

        if (params.categoryId) {
            items = items.filter(p => p.categoryId === params.categoryId);
        }

        if (params.search) {
            const searchLower = params.search.toLowerCase();
            items = items.filter(p =>
                p.name.toLowerCase().includes(searchLower) ||
                p.description.toLowerCase().includes(searchLower)
            );
        }

        return mockPaginate<Product>(items, params);
    }

    const response = await apiClient.get<PaginatedResult<Product>>('/api/catalog/products', { params });
    return response.data;
}

export async function getProductById(id: string): Promise<Product> {
    if (isMock) {
        await delay(400);
        const product = mockProducts.find(p => p.id === id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    const response = await apiClient.get<Product>(`/api/catalog/products/${id}`);
    return response.data;
}

export async function getCategories(): Promise<Category[]> {
    if (isMock) {
        await delay(400);
        return mockCategories;
    }

    const response = await apiClient.get<Category[]>('/api/catalog/categories');
    return response.data;
}
