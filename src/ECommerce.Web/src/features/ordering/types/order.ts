export type OrderStatus =
    | 'Pending'
    | 'PaymentProcessing'
    | 'Confirmed'
    | 'Shipped'
    | 'Delivered'
    | 'Cancelled';

export interface OrderItem {
    productId: string;
    productName: string;
    unitPrice: number;
    currency: string;
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
    status: OrderStatus;
    items: OrderItem[];
    totalAmount: number;
    currency: string;
    createdAt: string;
    shippingAddress: ShippingAddress;
}

export interface CreateOrderRequest {
    shippingAddress: ShippingAddress;
}

export interface CreateOrderResponse {
    orderId: string;
    totalAmount: number;
    currency: string;
}
