// === Provider Selection (3D Secure flow) ===

export interface PaymentProviderInfo {
    providerName: string;
    displayName: string;
    logoUrl: string;
    supportedCurrencies: string[];
}

export interface InitializePaymentRequest {
    orderId: string;
    providerName: string;
    idempotencyKey: string;
    returnUrl: string;
}

export interface InitializePaymentResponse {
    isSuccess: boolean;
    redirectUrl?: string;
    errorMessage?: string;
    htmlContent?: string;
}

export interface PaymentReturnStatus {
    orderId: string;
    status: string;
    isTerminal: boolean;
}

// Legacy types kept to avoid breaking existing imports

/** @deprecated Use InitializePaymentRequest instead */
export interface PaymentRequest {
    orderId: string;
    idempotencyKey: string;
}

/** @deprecated Use InitializePaymentResponse instead */
export interface PaymentResponse {
    isSuccess: boolean;
    redirectUrl?: string;
    errorMessage?: string;
}
