import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createOrder } from '../api/orderingApi';
import { initializePayment } from '../api/paymentApi';
import { generateIdempotencyKey } from '../../../utils/idempotency';
import type { ShippingAddress, CreateOrderResponse } from '../types/order';
import type { InitializePaymentRequest, InitializePaymentResponse } from '../types/payment';
import type { ApiError } from '../../../api/errorHandling';

type CheckoutStep = 'idle' | 'creating_order' | 'redirecting' | 'error';

export function useCheckout() {
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
                    returnUrl: `${window.location.origin}/payment/waiting`,
                };

                const paymentResponse = await initializePaymentMutation.mutateAsync(paymentReq);

                if (!paymentResponse.isSuccess || !paymentResponse.redirectUrl) {
                    throw new Error(paymentResponse.errorMessage ?? 'Ödeme başlatılamadı.');
                }

                window.location.href = paymentResponse.redirectUrl;
                return true;
            } catch (err: unknown) {
                setStep('error');
                const apiErr = err as ApiError;
                setError(apiErr?.message ?? 'Bir hata oluştu, lütfen tekrar deneyin.');
                return false;
            }
        },
        [createOrderMutation, initializePaymentMutation],
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
