import { apiClient } from '../../../api/client';
import type { CreateOrderRequest, CreateOrderResponse, Order } from '../types/order';
import type { PaymentRequest, PaymentResponse } from '../types/payment';
import { mockCreateOrder, mockProcessPayment, mockGetMyOrders, mockGetMyOrderById } from './mock';

const isMock = import.meta.env.VITE_USE_MOCK_API === 'true';

// NOTE for backend developer:
// GET /api/orders/my and GET /api/orders/my/{id} are customer-facing order endpoints.
// These are not yet documented in the backend README.
// Admin order endpoints (/api/admin/orders) are separate and will be implemented in the Admin milestone.

export async function createOrder(req: CreateOrderRequest): Promise<CreateOrderResponse> {
    if (isMock) {
        return mockCreateOrder(req);
    }
    const response = await apiClient.post<CreateOrderResponse>('/api/order', req);
    return response.data;
}

export async function processPayment(req: PaymentRequest): Promise<PaymentResponse> {
    if (isMock) {
        return mockProcessPayment(req);
    }
    const response = await apiClient.post<PaymentResponse>('/api/payment', req);
    return response.data;
}

export async function getMyOrders(): Promise<Order[]> {
    if (isMock) {
        return mockGetMyOrders();
    }
    const response = await apiClient.get<Order[]>('/api/orders/my');
    return response.data;
}

export async function getMyOrderById(id: string): Promise<Order> {
    if (isMock) {
        return mockGetMyOrderById(id);
    }
    const response = await apiClient.get<Order>(`/api/orders/my/${id}`);
    return response.data;
}
