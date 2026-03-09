import { useState, useCallback, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createOrder, processPayment } from '../api/orderingApi';
import { queryKeys } from '../../../utils/queryKeys';
import type { ShippingAddress, CreateOrderResponse } from '../types/order';
import type { PaymentRequest, PaymentResponse } from '../types/payment';
import type { ApiError } from '../../../api/errorHandling';

type CheckoutStep = 'idle' | 'creating_order' | 'processing_payment' | 'success' | 'error';

interface PaymentData {
    cardHolderName: string;
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
}

export function useCheckout() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [step, setStep] = useState<CheckoutStep>('idle');
    const [error, setError] = useState<string | null>(null);
    const navigatedRef = useRef(false);

    const createOrderMutation = useMutation<CreateOrderResponse, ApiError, ShippingAddress>({
        mutationFn: (shippingAddress) => createOrder({ shippingAddress }),
    });

    const processPaymentMutation = useMutation<PaymentResponse, ApiError, PaymentRequest>({
        mutationFn: (paymentReq) => processPayment(paymentReq),
    });

    const submitCheckout = useCallback(
        async (
            shippingAddress: ShippingAddress,
            paymentData: PaymentData,
            idempotencyKey: string,
        ): Promise<boolean> => {
            setStep('creating_order');
            setError(null);
            navigatedRef.current = false;

            try {
                const orderResponse = await createOrderMutation.mutateAsync(shippingAddress);

                setStep('processing_payment');

                const paymentRequest: PaymentRequest = {
                    orderId: orderResponse.orderId,
                    idempotencyKey,
                    cardHolderName: paymentData.cardHolderName,
                    cardNumber: paymentData.cardNumber.replace(/\s/g, ''),
                    expiryMonth: paymentData.expiryMonth,
                    expiryYear: paymentData.expiryYear,
                    cvv: paymentData.cvv,
                };

                await processPaymentMutation.mutateAsync(paymentRequest);

                setStep('success');

                queryClient.invalidateQueries({ queryKey: queryKeys.basket.current });
                queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });

                navigatedRef.current = true;
                navigate(`/orders/${orderResponse.orderId}/confirmation`);
                return true;
            } catch (err: unknown) {
                setStep('error');
                const apiErr = err as ApiError;
                setError(apiErr?.message || 'An unexpected error occurred. Please try again.');
                return false;
            }
        },
        [createOrderMutation, processPaymentMutation, queryClient, navigate],
    );

    const isLoading = step === 'creating_order' || step === 'processing_payment';

    return {
        submitCheckout,
        isLoading,
        error,
        step,
    };
}
