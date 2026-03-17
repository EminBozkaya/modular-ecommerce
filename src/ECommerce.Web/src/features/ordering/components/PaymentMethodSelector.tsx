import { usePaymentProviders } from '../hooks/usePaymentProviders';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { ErrorMessage } from '../../../components/shared/ErrorMessage';
import { EmptyState } from '../../../components/shared/EmptyState';
import { useTranslation } from 'react-i18next';

interface Props {
    selectedProvider: string | null;
    onSelect: (providerName: string) => void;
    disabled?: boolean;
}

export function PaymentMethodSelector({ selectedProvider, onSelect, disabled }: Props) {
    const { t } = useTranslation('checkout');
    const { data: providers, isLoading, error, refetch } = usePaymentProviders();

    if (isLoading) {
        return (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-black/5">
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white text-xs font-bold shrink-0 shadow-lg shadow-black/5">
                        2
                    </div>
                    <h2 className="text-base font-bold text-foreground">{t('payment.sectionTitle')}</h2>
                </div>
                <div className="flex items-center justify-center py-6">
                    <LoadingSpinner size="md" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <ErrorMessage message={t('payment.loadError')} onRetry={() => refetch()} />
            </div>
        );
    }

    if (!providers || providers.length === 0) {
        return (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-black/5">
                <EmptyState
                    title={t('payment.notFound')}
                    description={t('payment.notFoundDesc')}
                />
            </div>
        );
    }

    return (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-black/5">
            <div className="flex items-center gap-3 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white text-xs font-bold shrink-0 shadow-lg shadow-black/5">
                    2
                </div>
                <h2 className="text-base font-bold text-foreground">{t('payment.sectionTitle')}</h2>
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
                                    ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-light)]'
                                    : 'border-border bg-gray-50 dark:bg-white/10 hover:border-border hover:bg-card',
                                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                            ].join(' ')}
                        >
                            {/* Radio circle */}
                            <div
                                className={[
                                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                                    isSelected
                                        ? 'border-[var(--brand-primary)]'
                                        : 'border-border group-hover:border-muted-foreground',
                                ].join(' ')}
                            >
                                {isSelected && (
                                    <div className="h-2.5 w-2.5 rounded-full bg-[var(--brand-primary)]" />
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
                                    isSelected ? 'text-foreground' : 'text-muted-foreground',
                                ].join(' ')}
                            >
                                {provider.displayName}
                            </span>

                            {/* Supported currencies */}
                            <span className="text-[11px] text-muted-foreground tabular-nums">
                                {provider.supportedCurrencies.join(' · ')}
                            </span>
                        </button>
                    );
                })}
            </div>

            {!selectedProvider && (
                <p className="mt-3 text-xs text-muted-foreground">
                    {t('payment.selectRequired')}
                </p>
            )}
        </div>
    );
}
