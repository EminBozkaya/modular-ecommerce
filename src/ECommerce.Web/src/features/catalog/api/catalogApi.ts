import i18next from 'i18next';
import { apiClient } from '../../../api/client';
import type { Category, Product, ProductListParams, Unit } from '../types/product';
import type { PaginatedResult } from '../../../types/api';
import { mockCategories, mockProducts, mockPaginate, translateUnitCode, translateCategoryName, translateProductName, UNIT_NAME_TRANSLATIONS } from './mock';

/** Applies language-aware translations (name + unit) to a mock product */
function applyMockTranslations(product: Product): Product {
    const lang = i18next.language?.split('-')[0] ?? 'tr';
    return {
        ...product,
        name: translateProductName(product.id, product.name, lang),
        unitName: translateUnitCode(product.unitCode, lang),
    };
}

/** Applies language-aware name translation to a mock category */
function applyMockCategoryTranslation(category: Category): Category {
    const lang = i18next.language?.split('-')[0] ?? 'tr';
    return { ...category, name: translateCategoryName(category.id, category.name, lang) };
}

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

        const paginated = mockPaginate<Product>(items, params);
        return { ...paginated, items: paginated.items.map(applyMockTranslations) };
    }

    console.log('🛰️ [CATALOG-API] Fetching products from API...');
    const response = await apiClient.get<PaginatedResult<Product> | { value: PaginatedResult<Product> }>('/api/catalog/products', { params });
    console.log('✅ [CATALOG-API] API Response:', response.data);


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
        return applyMockTranslations(product);
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
        return items.map(applyMockCategoryTranslation);
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
        const lang = i18next.language?.split('-')[0] ?? 'tr';
        const unitDefs: { id: string; code: string }[] = [
            { id: '1', code: 'kg' },
            { id: '2', code: 'g' },
            { id: '3', code: 'adet' },
            { id: '4', code: 'lt' },
            { id: '5', code: 'paket' },
            { id: '6', code: 'deste' },
            { id: '7', code: 'koli' },
            { id: '8', code: 'kit' },
        ];
        return unitDefs.map(u => ({
            id: u.id,
            name: (UNIT_NAME_TRANSLATIONS[u.code]?.[lang] ?? UNIT_NAME_TRANSLATIONS[u.code]?.['tr'] ?? u.code),
            code: u.code,
        }));
    }

    const response = await apiClient.get<Unit[] | { value: Unit[] }>('/api/catalog/units');

    if (response.data && 'value' in response.data && Array.isArray(response.data.value)) {
        return response.data.value;
    }

    return response.data as Unit[];
}

export interface CategoryOrderItem {
    categoryId: string;
    displayOrder: number;
}

export async function reorderCategories(items: CategoryOrderItem[]): Promise<void> {
    if (isMock) {
        await delay(300);
        return;
    }
    await apiClient.put('/api/admin/categories/reorder', { items });
}
