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
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-ebrar-green)] text-white text-xs font-bold shrink-0">
                        2
                    </div>
                    <h2 className="text-base font-semibold text-gray-900">Odeme Yontemi</h2>
                </div>
                <div className="flex items-center justify-center py-6">
                    <LoadingSpinner size="md" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <ErrorMessage message="Odeme yontemleri yuklenemedi." onRetry={() => refetch()} />
            </div>
        );
    }

    if (!providers || providers.length === 0) {
        return (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <EmptyState
                    title="Odeme yontemi bulunamadi"
                    description="Su anda aktif odeme yontemi bulunmuyor."
                />
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-ebrar-green)] text-white text-xs font-bold shrink-0">
                    2
                </div>
                <h2 className="text-base font-semibold text-gray-900">Odeme Yontemi</h2>
            </div>

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
                                'group w-full flex items-center gap-4 rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-150',
                                isSelected
                                    ? 'border-[var(--color-ebrar-green)] bg-[var(--color-ebrar-green)]/5 shadow-sm'
                                    : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white',
                                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                            ].join(' ')}
                        >
                            {/* Radio circle */}
                            <div
                                className={[
                                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                                    isSelected
                                        ? 'border-[var(--color-ebrar-green)]'
                                        : 'border-gray-300 group-hover:border-gray-400',
                                ].join(' ')}
                            >
                                {isSelected && (
                                    <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-ebrar-green)]" />
                                )}
                            </div>

                            {/* Logo */}
                            <img
                                src={provider.logoUrl}
                                alt={provider.displayName}
                                className="h-7 w-10 object-contain"
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                                }}
                            />

                            {/* Name */}
                            <span
                                className={[
                                    'flex-1 text-sm font-medium transition-colors',
                                    isSelected ? 'text-gray-900' : 'text-gray-600',
                                ].join(' ')}
                            >
                                {provider.displayName}
                            </span>

                            {/* Supported currencies */}
                            <span className="text-[11px] text-gray-400 tabular-nums">
                                {provider.supportedCurrencies.join(' · ')}
                            </span>
                        </button>
                    );
                })}
            </div>

            {!selectedProvider && (
                <p className="mt-3 text-xs text-gray-400">
                    Devam etmek icin bir odeme yontemi secin.
                </p>
            )}
        </div>
    );
}
