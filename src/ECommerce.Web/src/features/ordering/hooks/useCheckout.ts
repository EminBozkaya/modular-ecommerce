import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api/orderingApi';
import { initializePayment } from '../api/paymentApi';
import { generateIdempotencyKey } from '../../../utils/idempotency';
import type { ShippingAddress, CreateOrderResponse } from '../types/order';
import type { InitializePaymentRequest, InitializePaymentResponse } from '../types/payment';
import type { ApiError } from '../../../api/errorHandling';

type CheckoutStep = 'idle' | 'creating_order' | 'redirecting' | 'error';

export function useCheckout() {
    const navigate = useNavigate();
    const [step, setStep] = useState<CheckoutStep>('idle');
    const [error, setError] = useState<string | null>(null);

    const createOrderMutation = useMutation<CreateOrderResponse, ApiError, ShippingAddress>({
        mutationFn: (shippingAddress) => createOrder({ shippingAddress }),
    });

    const initializePaymentMutation = useMutation<
        InitializePaymentResponse,
        ApiError,
        InitializePaymentRequest
    >({
        mutationFn: (req) => initializePayment(req),
    });

    const submitCheckout = useCallback(
        async (
            shippingAddress: ShippingAddress,
            providerName: string,
            idempotencyKey: string,
        ): Promise<boolean> => {
            setStep('creating_order');
            setError(null);

            try {
                const orderResponse = await createOrderMutation.mutateAsync(shippingAddress);

                setStep('redirecting');

                const paymentReq: InitializePaymentRequest = {
                    orderId: orderResponse.orderId,
                    providerName,
                    idempotencyKey,
                    returnUrl: `${window.location.origin}/api/payment/callback/${providerName.toLowerCase()}`,
                };

                const paymentResponse = await initializePaymentMutation.mutateAsync(paymentReq);

                if (!paymentResponse.isSuccess) {
                    throw new Error(paymentResponse.errorMessage ?? 'Ödeme başlatılamadı.');
                }

                // Handle embedded HTML content (e.g., Iyzico Checkout Form)
                if (paymentResponse.htmlContent) {
                    navigate('/payment/iyzico', {
                        state: {
                            htmlContent: paymentResponse.htmlContent,
                            orderId: orderResponse.orderId,
                        },
                    });
                    return true;
                }

                if (!paymentResponse.redirectUrl) {
                    throw new Error('Ödeme yönlendirme adresi bulunamadı.');
                }

                const url = paymentResponse.redirectUrl;
                // Same-origin relative paths: use React Router to stay in SPA
                // External URLs (real providers like Stripe, Iyzico): hard navigate
                if (url.startsWith('/') || url.startsWith(window.location.origin)) {
                    const relativePath = url.startsWith(window.location.origin)
                        ? url.slice(window.location.origin.length)
                        : url;
                    navigate(relativePath);
                } else {
                    window.location.href = url;
                }
                return true;
            } catch (err: unknown) {
                setStep('error');
                // Axios errors have response.data.message; Error instances have .message
                const axiosData = (err as { response?: { data?: { message?: string } } })?.response?.data;
                const message =
                    axiosData?.message ??
                    (err instanceof Error ? err.message : null) ??
                    'Bir hata oluştu, lütfen tekrar deneyin.';
                setError(message);
                return false;
            }
        },
        [createOrderMutation, initializePaymentMutation, navigate],
    );

    const isLoading = step === 'creating_order' || step === 'redirecting';

    return {
        submitCheckout,
        isLoading,
        error,
        step,
        generateNewKey: generateIdempotencyKey,
    };
}
