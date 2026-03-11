import { useMutation } from '@tanstack/react-query';
import { initializePayment } from '../api/paymentApi';
import type { InitializePaymentRequest, InitializePaymentResponse } from '../types/payment';
import type { ApiError } from '../../../api/errorHandling';

export function useInitializePayment() {
    return useMutation<InitializePaymentResponse, ApiError, InitializePaymentRequest>({
        mutationFn: initializePayment,
        onSuccess: (data) => {
            if (data.isSuccess && data.redirectUrl) {
                window.location.href = data.redirectUrl;
            }
        },
    });
}
