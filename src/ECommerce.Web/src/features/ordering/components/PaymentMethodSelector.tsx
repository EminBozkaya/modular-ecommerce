import { usePaymentProviders } from '../hooks/usePaymentProviders';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { ErrorMessage } from '../../../components/shared/ErrorMessage';
import { EmptyState } from '../../../components/shared/EmptyState';

interface Props {
    selectedProvider: string | null;
    onSelect: (providerName: string) => void;
    disabled?: boolean;
}

export function PaymentMethodSelector({ selectedProvider, onSelect, disabled }: Props) {
    const { data: providers, isLoading, error, refetch } = usePaymentProviders();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="md" />
            </div>
        );
    }

    if (error) {
        return <ErrorMessage message="Ödeme yöntemleri yüklenemedi." onRetry={() => refetch()} />;
    }

    if (!providers || providers.length === 0) {
        return (
            <EmptyState
                title="Ödeme yöntemi bulunamadı"
                description="Şu anda aktif ödeme yöntemi bulunmuyor."
            />
        );
    }

    return (
        <div className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Ödeme Yöntemi</h2>
            <div className="space-y-2">
                {providers.map((provider) => {
                    const isSelected = selectedProvider === provider.providerName;
                    return (
                        <button
                            key={provider.providerName}
                            type="button"
                            disabled={disabled}
                            onClick={() => onSelect(provider.providerName)}
                            className={[
                                'w-full flex items-center gap-4 rounded-lg border-2 px-4 py-3 text-left transition-colors',
                                isSelected
                                    ? 'border-[var(--color-ebrar-green)] bg-[var(--color-ebrar-green)]/5'
                                    : 'border-gray-200 bg-white hover:border-gray-300',
                                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                            ].join(' ')}
                        >
                            <img
                                src={provider.logoUrl}
                                alt={provider.displayName}
                                className="h-8 w-12 object-contain"
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                                }}
                            />
                            <span className="flex-1 text-sm font-medium text-gray-900">
                                {provider.displayName}
                            </span>
                            <span className="text-xs text-gray-400">
                                {provider.supportedCurrencies.join(', ')}
                            </span>
                            <div
                                className={[
                                    'h-4 w-4 rounded-full border-2 flex-shrink-0',
                                    isSelected
                                        ? 'border-[var(--color-ebrar-green)] bg-[var(--color-ebrar-green)]'
                                        : 'border-gray-300',
                                ].join(' ')}
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
