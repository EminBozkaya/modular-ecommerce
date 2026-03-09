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
                productId: '1',
                productName: 'Premium Antep Fistigi',
                unitPrice: 249.90,
                currency: 'TRY',
                quantity: 2,
                lineTotal: 499.80,
            },
            {
                productId: '3',
                productName: 'Kaju',
                unitPrice: 199.90,
                currency: 'TRY',
                quantity: 1,
                lineTotal: 199.90,
            },
        ],
        totalAmount: 699.70,
        currency: 'TRY',
        createdAt: '2026-02-15T14:30:00Z',
        shippingAddress: {
            fullName: 'Ali Yilmaz',
            addressLine1: 'Ataturk Caddesi No: 42',
            city: 'Istanbul',
            postalCode: '34000',
            country: 'Turkiye',
        },
    },
    {
        id: 'order-002',
        status: 'Shipped',
        items: [
            {
                productId: '2',
                productName: 'Karisik Kuruyemis',
                unitPrice: 149.90,
                currency: 'TRY',
                quantity: 3,
                lineTotal: 449.70,
            },
        ],
        totalAmount: 449.70,
        currency: 'TRY',
        createdAt: '2026-03-01T10:00:00Z',
        shippingAddress: {
            fullName: 'Ali Yilmaz',
            addressLine1: 'Ataturk Caddesi No: 42',
            city: 'Istanbul',
            postalCode: '34000',
            country: 'Turkiye',
        },
    },
    {
        id: 'order-003',
        status: 'Confirmed',
        items: [
            {
                productId: '5',
                productName: 'Badem',
                unitPrice: 179.90,
                currency: 'TRY',
                quantity: 1,
                lineTotal: 179.90,
            },
        ],
        totalAmount: 179.90,
        currency: 'TRY',
        createdAt: '2026-03-08T16:45:00Z',
        shippingAddress: {
            fullName: 'Ali Yilmaz',
            addressLine1: 'Istiklal Caddesi No: 100',
            addressLine2: 'Kat: 3',
            city: 'Istanbul',
            postalCode: '34433',
            country: 'Turkiye',
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
            currency: item.currency,
            quantity: item.quantity,
            lineTotal: item.unitPriceSnapshot * item.quantity,
        })),
        totalAmount: basket.totalAmount,
        currency: basket.currency,
        createdAt: new Date().toISOString(),
        shippingAddress: req.shippingAddress,
    };

    mockOrders.unshift(newOrder);

    // Clear basket after order creation (simulates backend behavior)
    mockClearBasket();

    return {
        orderId,
        totalAmount: basket.totalAmount,
        currency: basket.currency,
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

    // Update order status to Confirmed after successful payment
    const order = mockOrders.find(o => o.id === req.orderId);
    if (order) {
        order.status = 'Confirmed';
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
