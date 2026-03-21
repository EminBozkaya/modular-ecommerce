import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBasket } from '../../basket/hooks/useBasket';
import { useCheckout } from '../hooks/useCheckout';
import { useAddresses } from '../../auth/hooks/useAddresses';
import { ShippingAddressForm } from '../components/ShippingAddressForm';
import { SavedAddressPicker } from '../components/SavedAddressPicker';
import { PaymentMethodSelector } from '../components/PaymentMethodSelector';
import { OrderSummary } from '../components/OrderSummary';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { ErrorMessage } from '../../../components/shared/ErrorMessage';
import { EmptyState } from '../../../components/shared/EmptyState';
import { generateIdempotencyKey } from '../../../utils/idempotency';
import type { ShippingAddress } from '../types/order';
import { usePaymentProviders } from '../hooks/usePaymentProviders';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';

const emptyAddress: ShippingAddress = {
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    country: '',
};

export default function CheckoutPage() {
    const { t } = useTranslation('checkout');
    const { data: basket, isLoading: isBasketLoading, error: basketError, refetch } = useBasket();
    const { data: savedAddresses } = useAddresses();
    const { submitCheckout, isLoading, error: checkoutError, step } = useCheckout();

    const hasSaved = (savedAddresses?.length ?? 0) > 0;

    const [selectedSavedId, setSelectedSavedId] = useState<string | null>(null);
    const [useNewAddress, setUseNewAddress] = useState(false);
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(emptyAddress);
    const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
    const [idempotencyKey, setIdempotencyKey] = useState(() => generateIdempotencyKey());
    const [agreedTerms, setAgreedTerms] = useState(false);

    const { data: providers } = usePaymentProviders();

    // Auto-select provider if only one exists
    useEffect(() => {
        if (providers && providers.length === 1 && !selectedProvider) {
            setSelectedProvider(providers[0].providerName);
        }
    }, [providers, selectedProvider]);

    // Auto-select default saved address
    const effectiveSelectedId =
        !hasSaved || useNewAddress
            ? null
            : selectedSavedId ?? savedAddresses?.find((a) => a.isDefault)?.id ?? savedAddresses?.[0]?.id ?? null;

    // Determine final address to submit
    const activeAddress: ShippingAddress = (() => {
        if (!useNewAddress && effectiveSelectedId && savedAddresses) {
            const found = savedAddresses.find((a) => a.id === effectiveSelectedId);
            if (found) {
                return {
                    fullName: found.fullName,
                    addressLine1: found.addressLine1,
                    addressLine2: found.addressLine2,
                    city: found.city,
                    postalCode: found.postalCode,
                    country: found.country,
                };
            }
        }
        return shippingAddress;
    })();

    const handleSelectSaved = (id: string, address: ShippingAddress) => {
        setSelectedSavedId(id);
        setUseNewAddress(false);
        setShippingAddress(address);
    };

    const handleUseNew = () => {
        setUseNewAddress(true);
        setSelectedSavedId(null);
        setShippingAddress(emptyAddress);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProvider) return;
        const success = await submitCheckout(activeAddress, selectedProvider, idempotencyKey);
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
            <div className="container mx-auto px-4 py-16 text-center">
                <EmptyState
                    title={t('page.emptyBasket')}
                    description={t('page.emptyBasketDesc')}
                />
                <Link
                    to="/products"
                    className="mt-6 inline-block rounded-2xl bg-[var(--brand-primary)] px-8 py-3.5 text-sm font-bold text-white hover:bg-[var(--brand-primary-dark)] transition-all shadow-lg shadow-black/5 active:scale-95"
                >
                    {t('page.continueShopping')}
                </Link>
            </div>
        );
    }

    const stepLabel =
        step === 'creating_order'
            ? t('page.creatingOrder')
            : t('page.redirecting');

    const showManualForm = !hasSaved || useNewAddress;

    return (
        <div className="min-h-screen bg-gray-50/60 dark:bg-background">
            <div className="container mx-auto max-w-5xl px-4 py-10">
                {/* Page title */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-foreground">{t('page.title')}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {t('page.subtitle')}
                    </p>
                </div>

                {/* Error banner */}
                {checkoutError && (
                    <div className="mb-6">
                        <ErrorMessage
                            message={checkoutError}
                            onRetry={() => setIdempotencyKey(generateIdempotencyKey())}
                        />
                    </div>
                )}

                {/* Loading banner */}
                {isLoading && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/20 px-5 py-3.5 text-sm font-medium text-blue-700 dark:text-blue-400">
                        <LoadingSpinner size="sm" />
                        <span>{stepLabel}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Left: forms */}
                        <div className="space-y-4 lg:col-span-2">
                            {/* Shipping address card */}
                            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-black/5">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white text-xs font-bold shrink-0 shadow-lg shadow-black/5">
                                        1
                                    </div>
                                    <h2 className="text-base font-bold text-foreground">
                                        {t('shipping.sectionTitle')}
                                    </h2>
                                </div>

                                {hasSaved && (
                                    <SavedAddressPicker
                                        selectedId={effectiveSelectedId ?? null}
                                        onSelect={handleSelectSaved}
                                        onUseNew={handleUseNew}
                                        disabled={isLoading}
                                    />
                                )}

                                {showManualForm && (
                                    <div className={hasSaved ? 'mt-4 pt-4 border-t border-border' : ''}>
                                        <ShippingAddressForm
                                            value={shippingAddress}
                                            onChange={setShippingAddress}
                                            disabled={isLoading}
                                            hideHeader
                                        />
                                    </div>
                                )}
                            </div>

                            <PaymentMethodSelector
                                selectedProvider={selectedProvider}
                                onSelect={setSelectedProvider}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Right: summary + CTA */}
                        <div className="space-y-4">
                            <OrderSummary basket={basket} />

                            {/* Terms and Conditions */}
                            <div className="rounded-2xl border border-border bg-card p-5">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="relative flex items-center mt-0.5">
                                        <input
                                            type="checkbox"
                                            checked={agreedTerms}
                                            onChange={(e) => setAgreedTerms(e.target.checked)}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-border transition-all checked:bg-[var(--brand-primary)] checked:border-[var(--brand-primary)]"
                                        />
                                        <Check className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity" />
                                    </div>
                                    <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                                        Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formu'nu okudum, kabul ediyorum.
                                    </span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !selectedProvider || !agreedTerms}
                                className="w-full rounded-2xl bg-[var(--brand-primary)] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-black/5 transition-all hover:bg-[var(--brand-primary-dark)] disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <LoadingSpinner size="sm" />
                                        {t('page.processing')}
                                    </span>
                                ) : (
                                    t('page.proceed')
                                )}
                            </button>

                            <p className="text-center text-xs text-muted-foreground">
                                {t('page.terms')}{' '}
                                <span className="font-medium text-muted-foreground">{t('page.termsLink')}</span>{' '}
                                {t('page.termsEnd')}
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
