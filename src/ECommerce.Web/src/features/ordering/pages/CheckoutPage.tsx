import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBasket } from '../../basket/hooks/useBasket';
import { useCheckout } from '../hooks/useCheckout';
import { ShippingAddressForm } from '../components/ShippingAddressForm';
import { PaymentMethodSelector } from '../components/PaymentMethodSelector';
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

export default function CheckoutPage() {
    const { data: basket, isLoading: isBasketLoading, error: basketError, refetch } = useBasket();
    const { submitCheckout, isLoading, error: checkoutError, step } = useCheckout();

    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(emptyAddress);
    const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
    const [idempotencyKey, setIdempotencyKey] = useState(() => generateIdempotencyKey());

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedProvider) return;

        const success = await submitCheckout(shippingAddress, selectedProvider, idempotencyKey);

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
                        {step === 'redirecting' && 'Odeme sayfasina yonlendiriliyor...'}
                    </span>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <ShippingAddressForm
                            value={shippingAddress}
                            onChange={setShippingAddress}
                            disabled={isLoading}
                        />
                        <PaymentMethodSelector
                            selectedProvider={selectedProvider}
                            onSelect={setSelectedProvider}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !selectedProvider}
                            className="w-full rounded-md bg-[var(--color-ebrar-green)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--color-ebrar-green-dark)] disabled:opacity-50 transition-colors"
                        >
                            {isLoading ? 'Isleniyor...' : 'Odemeye Gec'}
                        </button>
                    </div>

                    <div>
                        <OrderSummary basket={basket} />
                    </div>
                </div>
            </form>
        </div>
    );
}
