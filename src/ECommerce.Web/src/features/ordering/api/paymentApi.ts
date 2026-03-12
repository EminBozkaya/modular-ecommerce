import { apiClient } from '../../../api/client';
import type {
    PaymentProviderInfo,
    InitializePaymentRequest,
    InitializePaymentResponse,
    PaymentReturnStatus,
} from '../types/payment';

const isMock = import.meta.env.VITE_USE_MOCK_API === 'true';

// ─── Mock implementations ─────────────────────────────────────────────────────

async function mockGetProviders(): Promise<PaymentProviderInfo[]> {
    await new Promise((r) => setTimeout(r, 300));
    return [
        {
            providerName: 'Iyzico',
            displayName: 'Kredi / Banka Kartı',
            logoUrl: '/images/providers/iyzico.svg',
            supportedCurrencies: ['TRY', 'USD', 'EUR', 'GBP'],
        },
        {
            providerName: 'Stripe',
            displayName: 'Stripe (Uluslararası Kart)',
            logoUrl: '/images/providers/stripe.svg',
            supportedCurrencies: ['USD', 'EUR', 'GBP', 'TRY', 'JPY'],
        },
        {
            providerName: 'Stub',
            displayName: 'Test Ödemesi',
            logoUrl: '/images/providers/stub.svg',
            supportedCurrencies: ['TRY', 'USD', 'EUR', 'GBP', 'JPY'],
        },
    ];
}

async function mockInitializePayment(req: InitializePaymentRequest): Promise<InitializePaymentResponse> {
    await new Promise((r) => setTimeout(r, 500));
    // Simulate redirect to a waiting page (stub provider)
    return {
        isSuccess: true,
        redirectUrl: `/payment/waiting?orderId=${req.orderId}&mock=true`,
    };
}

async function mockGetReturnStatus(orderId: string): Promise<PaymentReturnStatus> {
    await new Promise((r) => setTimeout(r, 200));
    return { orderId, status: 'Completed', isTerminal: true };
}

// ─── Real API calls ───────────────────────────────────────────────────────────

export async function getPaymentProviders(): Promise<PaymentProviderInfo[]> {
    if (isMock) return mockGetProviders();
    const response = await apiClient.get<PaymentProviderInfo[]>('/api/payment/providers');
    return response.data;
}

export async function initializePayment(req: InitializePaymentRequest): Promise<InitializePaymentResponse> {
    if (isMock) return mockInitializePayment(req);
    const response = await apiClient.post<InitializePaymentResponse>('/api/payment/initialize', req);
    return response.data;
}

export async function getPaymentReturnStatus(orderId: string): Promise<PaymentReturnStatus> {
    if (isMock) return mockGetReturnStatus(orderId);
    const response = await apiClient.get<PaymentReturnStatus>(`/api/payment/return-status?orderId=${orderId}`);
    return response.data;
}
