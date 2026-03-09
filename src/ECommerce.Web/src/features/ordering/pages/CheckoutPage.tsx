import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useBasket } from '../../basket/hooks/useBasket';
import { useCheckout } from '../hooks/useCheckout';
import { ShippingAddressForm } from '../components/ShippingAddressForm';
import { PaymentForm } from '../components/PaymentForm';
import { OrderSummary } from '../components/OrderSummary';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { ErrorMessage } from '../../../components/shared/ErrorMessage';
import { EmptyState } from '../../../components/shared/EmptyState';
import { generateIdempotencyKey } from '../../../utils/idempotency';
import type { ShippingAddress } from '../types/order';

const emptyAddress: ShippingAddress = {
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    country: '',
};

interface PaymentData {
    cardHolderName: string;
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
}

const emptyPaymentData: PaymentData = {
    cardHolderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
};

export default function CheckoutPage() {
    const { data: basket, isLoading: isBasketLoading, error: basketError, refetch } = useBasket();
    const { submitCheckout, isLoading, error: checkoutError, step } = useCheckout();

    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(emptyAddress);
    const [paymentData, setPaymentData] = useState<PaymentData>(emptyPaymentData);
    const [idempotencyKey, setIdempotencyKey] = useState(() => generateIdempotencyKey());
    const [clearTrigger, setClearTrigger] = useState(0);

    const handlePaymentChange = useCallback((data: PaymentData) => {
        setPaymentData(data);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const success = await submitCheckout(shippingAddress, paymentData, idempotencyKey);

        // Clear card data from local state regardless of outcome
        setPaymentData(emptyPaymentData);
        setClearTrigger((prev) => prev + 1);

        // Generate new idempotency key for retry on failure
        if (!success) {
            setIdempotencyKey(generateIdempotencyKey());
        }
    };

    if (isBasketLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (basketError) {
        return (
            <div className="container mx-auto px-4 py-8">
                <ErrorMessage message={basketError.message} onRetry={() => refetch()} />
            </div>
        );
    }

    if (!basket || basket.items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <EmptyState
                    title="Sepetiniz bos"
                    description="Odeme yapabilmek icin sepetinize urun ekleyin."
                />
                <div className="mt-4 text-center">
                    <Link to="/products" className="text-sm font-medium text-primary hover:underline">
                        Alisverise Devam Et
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Odeme</h1>

            {checkoutError && (
                <div className="mb-6">
                    <ErrorMessage
                        message={checkoutError}
                        onRetry={() => setIdempotencyKey(generateIdempotencyKey())}
                    />
                </div>
            )}

            {isLoading && (
                <div className="mb-6 flex items-center gap-3 rounded-md bg-blue-50 p-4 text-sm text-blue-700">
                    <LoadingSpinner size="sm" />
                    <span>
                        {step === 'creating_order' && 'Siparissiniz olusturuluyor...'}
                        {step === 'processing_payment' && 'Odemeniz isleniyor...'}
                    </span>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-2 space-y-8">
                        <ShippingAddressForm
                            value={shippingAddress}
                            onChange={setShippingAddress}
                            disabled={isLoading}
                        />
                        <PaymentForm
                            disabled={isLoading}
                            onChange={handlePaymentChange}
                            clearTrigger={clearTrigger}
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-md bg-[var(--color-ebrar-green)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--color-ebrar-green-dark)] disabled:opacity-50 transition-colors"
                        >
                            {isLoading ? 'Isleniyor...' : 'Siparisi Onayla'}
                        </button>
                    </div>

                    {/* Right Column: Summary */}
                    <div>
                        <OrderSummary basket={basket} />
                    </div>
                </div>
            </form>
        </div>
    );
}
