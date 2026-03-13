import { apiClient } from '../../../api/client';
import type { Category, Product, ProductListParams, Unit } from '../types/product';
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

    const response = await apiClient.get<PaginatedResult<Product> | { value: PaginatedResult<Product> }>('/api/catalog/products', { params });

    let result: PaginatedResult<Product>;
    if (response.data && 'value' in response.data && response.data.value && 'items' in response.data.value) {
        result = response.data.value;
    } else {
        result = response.data as PaginatedResult<Product>;
    }

    // Map price and currency fields for frontend compatibility
    if (result.items) {
        result.items = result.items.map(p => ({
            ...p,
            price: p.price ?? p.priceAmount,
            currency: p.currency ?? p.priceCurrency
        }));
    }

    return result;
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
    const product = response.data;

    // Map price and currency fields for frontend compatibility
    return {
        ...product,
        price: product.price ?? product.priceAmount,
        currency: product.currency ?? product.priceCurrency
    };
}

export async function getCategories(params?: { includeDeleted?: boolean, onlyMain?: boolean }): Promise<Category[]> {
    if (isMock) {
        await delay(400);
        let items = [...mockCategories];
        if (params?.includeDeleted === false || params?.includeDeleted === undefined) {
            items = items.filter(c => !c.isDeleted);
        }
        if (params?.onlyMain) {
            items = items.filter(c => !c.parentCategoryId);
        }
        return items;
    }

    const response = await apiClient.get<Category[] | { value: Category[] }>('/api/catalog/categories', { params });

    // Check if the response is wrapped in an object with a 'value' array
    if (response.data && 'value' in response.data && Array.isArray(response.data.value)) {
        return response.data.value;
    }

    // Otherwise, assume it's directly an array
    return response.data as Category[];
}

export async function getUnits(): Promise<Unit[]> {
    if (isMock) {
        await delay(400);
        return [
            { id: '1', name: 'Kilogram', code: 'kg' },
            { id: '2', name: 'Gram', code: 'g' },
            { id: '3', name: 'Adet', code: 'adet' },
        ];
    }

    const response = await apiClient.get<Unit[] | { value: Unit[] }>('/api/catalog/units');

    if (response.data && 'value' in response.data && Array.isArray(response.data.value)) {
        return response.data.value;
    }

    return response.data as Unit[];
}
