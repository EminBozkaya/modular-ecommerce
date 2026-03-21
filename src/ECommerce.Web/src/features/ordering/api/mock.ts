import type { CreateOrderRequest, CreateOrderResponse, Order } from '../types/order';
import type { PaymentRequest, PaymentResponse } from '../types/payment';
import { mockGetBasket, mockClearBasket } from '../../basket/api/mock';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockOrders: Order[] = [
    {
        id: 'order-001',
        status: 'Delivered',
        items: [
            {
                productId: 'p1',
                productName: 'Ürün-A1',
                unitPrice: 12.99,
                quantity: 2,
                lineTotal: 25.98,
            },
            {
                productId: 'p3',
                productName: 'Ürün-A3',
                unitPrice: 24.99,
                quantity: 1,
                lineTotal: 24.99,
            },
        ],
        totalAmount: 50.97,
        createdAt: '2026-02-15T14:30:00Z',
        shippingAddress: {
            fullName: 'John Smith',
            addressLine1: '123 Main Street, Apt 4',
            city: 'New York',
            postalCode: '10001',
            country: 'United States',
        },
    },
    {
        id: 'order-002',
        status: 'Shipped',
        items: [
            {
                productId: 'p4',
                productName: 'Ürün-B1',
                unitPrice: 9.99,
                quantity: 3,
                lineTotal: 29.97,
            },
        ],
        totalAmount: 29.97,
        createdAt: '2026-03-01T10:00:00Z',
        shippingAddress: {
            fullName: 'Jane Doe',
            addressLine1: '456 Oak Avenue',
            city: 'London',
            postalCode: 'SW1A 1AA',
            country: 'United Kingdom',
        },
    },
    {
        id: 'order-003',
        status: 'Paid',
        items: [
            {
                productId: 'p6',
                productName: 'Ürün-C1',
                unitPrice: 22.50,
                quantity: 1,
                lineTotal: 22.50,
            },
        ],
        totalAmount: 22.50,
        createdAt: '2026-03-08T16:45:00Z',
        shippingAddress: {
            fullName: 'Sam Wilson',
            addressLine1: '789 Pine Road, Apt 3',
            city: 'Chicago',
            postalCode: '60601',
            country: 'United States',
        },
    },
];

export async function mockCreateOrder(req: CreateOrderRequest): Promise<CreateOrderResponse> {
    await delay(600);

    // Read current basket to build order items
    const basket = await mockGetBasket();
    const orderId = crypto.randomUUID();

    const newOrder: Order = {
        id: orderId,
        status: 'Pending',
        items: basket.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            unitPrice: item.unitPriceSnapshot,
            quantity: item.quantity,
            lineTotal: item.unitPriceSnapshot * item.quantity,
        })),
        totalAmount: basket.totalAmount,
        createdAt: new Date().toISOString(),
        shippingAddress: req.shippingAddress,
    };

    mockOrders.unshift(newOrder);

    // Clear basket after order creation (simulates backend behavior)
    mockClearBasket();

    return {
        orderId,
        totalAmount: basket.totalAmount,
    };
}

export async function mockProcessPayment(req: PaymentRequest): Promise<PaymentResponse> {
    await delay(600);

    if (req.cardNumber.replace(/\s/g, '').endsWith('0000')) {
        throw {
            response: {
                status: 400,
                data: { message: 'Payment declined. Please check your card details and try again.' },
            },
        };
    }

    // Update order status to Paid after successful payment
    const order = mockOrders.find(o => o.id === req.orderId);
    if (order) {
        order.status = 'Paid';
    }

    return {
        success: true,
        transactionId: crypto.randomUUID(),
    };
}

export async function mockGetMyOrders(): Promise<Order[]> {
    await delay(600);
    return mockOrders.map(o => ({ ...o }));
}

export async function mockGetMyOrderById(id: string): Promise<Order> {
    await delay(600);
    const order = mockOrders.find(o => o.id === id);
    if (!order) {
        throw {
            response: {
                status: 404,
                data: { message: 'Order not found' },
            },
        };
    }
    return { ...order };
}
