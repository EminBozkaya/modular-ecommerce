import { apiClient } from '../../../api/client';
import type { DashboardSummary, DashboardPeriod, RevenueDataPoint } from '../types/dashboard';
import type { UpdateOrderStatusRequest } from '../types/adminOrder';
import type { AdminUser } from '../types/adminUser';
import type { Order, OrderStatus } from '../../ordering/types/order';
import type { Product } from '../../catalog/types/product';
import type { PaginatedResult } from '../../../types/api';
import type { AddressFormData } from '@/lib/validations/admin.schema';
import {
    mockGetDashboardSummary,
    mockGetRevenueData,
    mockGetRecentOrders,
    mockGetLowStockProducts,
    mockGetAllOrders,
    mockUpdateOrderStatus,
    mockDeleteOrder,
    mockRestoreOrder,
    mockGetUsers,
    mockCreateUser,
    mockUpdateUser,
    mockDeleteUser,
    mockRestoreUser,
    mockGetAddresses,
    mockCreateAddress,
    mockUpdateAddress,
    mockDeleteAddress,
    mockRestoreAddress,
} from './mock';
import type { CreateUserData, UpdateUserData } from './mock';
import type { AdminAddress, UpdateAddressData } from '../types/adminAddress';
export type { AdminAddress, UpdateAddressData };

// ── Product CRUD ──

export interface CreateProductData {
    name: string;
    description?: string;
    imageUrl?: string;
    price: number;
    currency: string;
    stockQuantity: number;
    categoryId: string;
    unitId: string;
    isActive: boolean;
}

export interface UpdateProductData {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    price: number;
    currency: string;
    categoryId: string;
    unitId: string;
    isActive: boolean;
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

export async function restoreProduct(id: string): Promise<void> {
    await apiClient.post(`/api/admin/products/restore/${id}`);
}

export async function updateStock(data: UpdateStockData): Promise<void> {
    await apiClient.put('/api/admin/products/stock', data);
}

// ── Category CRUD ──

export interface CreateCategoryData {
    name: string;
    description?: string;
    imageUrl?: string;
    isActive: boolean;
    parentCategoryId?: string | null;
}

export interface UpdateCategoryData {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    isActive: boolean;
    parentCategoryId?: string | null;
}

export async function createCategory(data: CreateCategoryData): Promise<string> {
    const response = await apiClient.post<{ id: string }>('/api/admin/categories', data);
    return response.data.id;
}

export async function updateCategory(data: UpdateCategoryData): Promise<void> {
    await apiClient.put('/api/admin/categories', data);
}

export async function deleteCategory(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/categories/${id}`);
}

export async function restoreCategory(id: string): Promise<void> {
    await apiClient.post(`/api/admin/categories/restore/${id}`);
}

// ── Dashboard ──

const isMock = import.meta.env.VITE_USE_MOCK_API === 'true';

export async function getDashboardSummary(period: DashboardPeriod): Promise<DashboardSummary> {
    if (isMock) return mockGetDashboardSummary(period);
    const response = await apiClient.get<DashboardSummary>('/api/admin/dashboard/summary', { params: { period } });
    return response.data;
}

export async function getRevenueData(): Promise<RevenueDataPoint[]> {
    if (isMock) return mockGetRevenueData();
    const response = await apiClient.get<RevenueDataPoint[]>('/api/admin/dashboard/revenue');
    return response.data;
}

export async function getRecentOrders(): Promise<Order[]> {
    if (isMock) return mockGetRecentOrders();
    const response = await apiClient.get<Order[]>('/api/admin/dashboard/recent-orders');
    return response.data;
}

export async function getLowStockProducts(): Promise<Product[]> {
    if (isMock) return mockGetLowStockProducts();
    const response = await apiClient.get<Product[]>('/api/admin/dashboard/low-stock');
    return response.data;
}

// ── Admin Orders ──

export async function getAllOrders(params: { page?: number; pageSize?: number; status?: OrderStatus }): Promise<PaginatedResult<Order>> {
    if (isMock) return mockGetAllOrders(params);
    const response = await apiClient.get<PaginatedResult<Order>>('/api/admin/orders', { params });
    return response.data;
}

export async function updateOrderStatus(req: UpdateOrderStatusRequest): Promise<Order> {
    if (isMock) return mockUpdateOrderStatus(req);
    const response = await apiClient.put<Order>(`/api/admin/orders/${req.orderId}/status`, { newStatus: req.newStatus });
    return response.data;
}

export async function deleteOrder(id: string): Promise<void> {
    if (isMock) return mockDeleteOrder(id);
    await apiClient.delete(`/api/admin/orders/${id}`);
}

export async function restoreOrder(id: string): Promise<void> {
    if (isMock) return mockRestoreOrder(id);
    await apiClient.post(`/api/admin/orders/restore/${id}`);
}

// ── Admin Users ──

export async function getUsers(): Promise<AdminUser[]> {
    if (isMock) return mockGetUsers();
    const response = await apiClient.get<AdminUser[]>('/api/admin/users');
    return response.data;
}

export async function createUser(data: CreateUserData): Promise<string> {
    if (isMock) return mockCreateUser(data);
    const response = await apiClient.post<{ id: string }>('/api/admin/users', data);
    return response.data.id;
}

export async function updateUser(data: UpdateUserData): Promise<void> {
    if (isMock) return mockUpdateUser(data);
    await apiClient.put('/api/admin/users', data);
}

export async function deleteUser(id: string): Promise<void> {
    if (isMock) return mockDeleteUser(id);
    await apiClient.delete(`/api/admin/users/${id}`);
}

export async function restoreUser(id: string): Promise<void> {
    if (isMock) return mockRestoreUser(id);
    await apiClient.post(`/api/admin/users/restore/${id}`);
}

export type { AdminUser };


export async function getAddresses(): Promise<AdminAddress[]> {
    if (isMock) return mockGetAddresses();
    const response = await apiClient.get<AdminAddress[]>('/api/admin/addresses');
    return response.data;
}

export async function createAddress(data: AddressFormData): Promise<string> {
    if (isMock) return mockCreateAddress(data);
    const response = await apiClient.post<{ id: string }>('/api/admin/addresses', data);
    return response.data.id;
}

export async function updateAddress(data: UpdateAddressData): Promise<void> {
    if (isMock) return mockUpdateAddress(data);
    await apiClient.put('/api/admin/addresses', data);
}

export async function deleteAddress(id: string): Promise<void> {
    if (isMock) return mockDeleteAddress(id);
    await apiClient.delete(`/api/admin/addresses/${id}`);
}

export async function restoreAddress(id: string): Promise<void> {
    if (isMock) return mockRestoreAddress(id);
    await apiClient.post(`/api/admin/addresses/restore/${id}`);
}

// ── Translations ──

export interface TranslationData {
    languageCode: string;
    name: string;
    description?: string;
}

export async function getProductTranslations(productId: string): Promise<TranslationData[]> {
    const response = await apiClient.get<TranslationData[]>(`/api/admin/products/${productId}/translations`);
    return response.data;
}

export async function upsertProductTranslation(productId: string, languageCode: string, data: { name: string; description?: string }): Promise<void> {
    await apiClient.put(`/api/admin/products/${productId}/translations/${languageCode}`, data);
}

export async function getCategoryTranslations(categoryId: string): Promise<TranslationData[]> {
    const response = await apiClient.get<TranslationData[]>(`/api/admin/categories/${categoryId}/translations`);
    return response.data;
}

export async function upsertCategoryTranslation(categoryId: string, languageCode: string, data: { name: string; description?: string }): Promise<void> {
    await apiClient.put(`/api/admin/categories/${categoryId}/translations/${languageCode}`, data);
}
