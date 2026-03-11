import { useQuery } from '@tanstack/react-query';
import { getPaymentProviders } from '../api/paymentApi';
import { queryKeys } from '../../../utils/queryKeys';
import type { PaymentProviderInfo } from '../types/payment';

const PREFERRED_ORDER_TR = ['Iyzico', 'PayTR', 'Stripe', 'PayPal', 'Stub'];
const PREFERRED_ORDER_EN = ['Stripe', 'PayPal', 'Iyzico', 'PayTR', 'Stub'];

function sortProviders(providers: PaymentProviderInfo[]): PaymentProviderInfo[] {
    const isTurkish = navigator.language.startsWith('tr');
    const order = isTurkish ? PREFERRED_ORDER_TR : PREFERRED_ORDER_EN;
    return [...providers].sort((a, b) => {
        const idxA = order.indexOf(a.providerName);
        const idxB = order.indexOf(b.providerName);
        const rankA = idxA === -1 ? order.length : idxA;
        const rankB = idxB === -1 ? order.length : idxB;
        return rankA - rankB;
    });
}

export function usePaymentProviders() {
    return useQuery({
        queryKey: queryKeys.payment.providers,
        queryFn: getPaymentProviders,
        staleTime: 5 * 60 * 1000, // 5 minutes
        select: sortProviders,
    });
}
