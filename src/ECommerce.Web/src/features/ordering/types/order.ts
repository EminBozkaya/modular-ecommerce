export type OrderStatus =
    | 'Pending'
    | 'Processing'
    | 'Paid'
    | 'Shipped'
    | 'Delivered'
    | 'Cancelled'
    | 'Refunded';

export interface OrderItem {
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
}

export interface ShippingAddress {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface Order {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    items: OrderItem[];
    totalAmount: number;
    currency: string;
    createdAt: string;
    shippingAddress: ShippingAddress;
    isDeleted?: boolean;
}

export interface CreateOrderRequest {
    shippingAddress: ShippingAddress;
}

export interface CreateOrderResponse {
    orderId: string;
    totalAmount: number;
    currency: string;
}
