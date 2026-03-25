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
    district?: string;
    postalCode: string;
    country: string;
}

export type InvoiceType = 'individual' | 'corporate';

export interface BillingAddress {
    invoiceType: InvoiceType;
    fullName?: string;
    tcKimlikNo?: string;
    companyName?: string;
    taxOffice?: string;
    taxNumber?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    district?: string;
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
    billingAddress?: BillingAddress;
    isDeleted?: boolean;
}

export interface CreateOrderRequest {
    shippingAddress: ShippingAddress;
    billingAddress?: BillingAddress;
    guestEmail?: string;
}

export interface CreateOrderResponse {
    orderId: string;
    totalAmount: number;
    currency: string;
}
