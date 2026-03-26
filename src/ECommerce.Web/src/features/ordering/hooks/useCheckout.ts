import { useState, useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createOrder } from '../api/orderingApi';
import { initializePayment } from '../api/paymentApi';
import { generateIdempotencyKey } from '../../../utils/idempotency';
import type { ShippingAddress, BillingAddress, CreateOrderResponse } from '../types/order';
import type { InitializePaymentRequest, InitializePaymentResponse } from '../types/payment';
import type { ApiError } from '../../../api/errorHandling';

type CheckoutStep = 'idle' | 'creating_order' | 'redirecting' | 'error';

export function useCheckout() {
    const navigate = useNavigate();
    const [step, setStep] = useState<CheckoutStep>('idle');
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation('checkout');

    // Check for payment errors in the URL (e.g., from a callback redirect)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const errorParam = params.get('error');
        const messageParam = params.get('message');

        if (errorParam === 'payment_failed') {
            setError(messageParam || t('errors.paymentFailed') || 'Ödeme başarısız.');
            // Clear URL params to avoid persistent error UI on refresh
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, [t]);

    const createOrderMutation = useMutation<CreateOrderResponse, ApiError, { shippingAddress: ShippingAddress; billingAddress?: BillingAddress; guestEmail?: string }>({
        mutationFn: (req) => createOrder(req),
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
            billingAddress: BillingAddress | undefined,
            providerName: string,
            idempotencyKey: string,
            guestEmail?: string
        ): Promise<boolean> => {
            setStep('creating_order');
            setError(null);


            try {
                const orderResponse = await createOrderMutation.mutateAsync({ shippingAddress, billingAddress, guestEmail: guestEmail || undefined });

                setStep('redirecting');

                const paymentReq: InitializePaymentRequest = {
                    orderId: orderResponse.orderId,
                    providerName,
                    idempotencyKey,
                    returnUrl: `${import.meta.env.VITE_API_BASE_URL}/api/payment/callback/${providerName.toLowerCase()}?orderId=${orderResponse.orderId}`,
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
                const isInternalSpa = (url.startsWith('/') || url.startsWith(window.location.origin)) 
                                     && !url.includes('/api/');

                if (isInternalSpa) {
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
                const rawMessage =
                    axiosData?.message ??
                    (err instanceof Error ? err.message : null);
                
                let message = rawMessage ?? 'Bir hata oluştu, lütfen tekrar deneyin.';
                
                // Translate known backend error messages
                if (rawMessage === 'Insufficient stock.') {
                    message = t('errors.insufficientStock', { defaultValue: 'Yetersiz stok.' });
                }
                
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
