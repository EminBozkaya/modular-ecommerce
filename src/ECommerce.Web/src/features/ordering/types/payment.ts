export interface PaymentRequest {
    orderId: string;
    idempotencyKey: string;
    cardHolderName: string;
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
}

export interface PaymentResponse {
    success: boolean;
    transactionId: string;
}
