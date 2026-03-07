import { apiClient } from '../../../api/client';

// ── Product CRUD ──

export interface CreateProductData {
    name: string;
    description?: string;
    imageUrl?: string;
    price: number;
    currency: string;
    stockQuantity: number;
    categoryId: string;
}

export interface UpdateProductData {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    price: number;
    currency: string;
    categoryId: string;
}

export interface UpdateStockData {
    productId: string;
    newQuantity: number;
}

export async function createProduct(data: CreateProductData): Promise<string> {
    const response = await apiClient.post<{ id: string }>('/api/admin/products', data);
    return response.data.id;
}

export async function updateProduct(data: UpdateProductData): Promise<void> {
    await apiClient.put('/api/admin/products', data);
}

export async function deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/products/${id}`);
}

export async function updateStock(data: UpdateStockData): Promise<void> {
    await apiClient.put('/api/admin/products/stock', data);
}

// ── Category CRUD ──

export interface CreateCategoryData {
    name: string;
    description?: string;
    imageUrl?: string;
}

export async function createCategory(data: CreateCategoryData): Promise<string> {
    const response = await apiClient.post<{ id: string }>('/api/admin/categories', data);
    return response.data.id;
}
