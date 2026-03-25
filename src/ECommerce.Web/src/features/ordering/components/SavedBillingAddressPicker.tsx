import { FileText, Plus, CheckCircle2 } from 'lucide-react';
import { useBillingAddresses } from '../../auth/hooks/useBillingAddresses';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import type { UserBillingAddress } from '../../auth/types/address';
import { resolveInvoiceType } from '../../auth/types/address';
import type { BillingAddress } from '../types/order';
import { useTranslation } from 'react-i18next';

interface SavedBillingAddressPickerProps {
    selectedId: string | null;
    onSelect: (id: string, address: BillingAddress) => void;
    onUseNew: () => void;
    disabled?: boolean;
}

function toBillingAddress(addr: UserBillingAddress): BillingAddress {
    return {
        invoiceType: resolveInvoiceType(addr.invoiceType),
        fullName: addr.fullName,
        tcKimlikNo: addr.tcKimlikNo,
        companyName: addr.companyName,
        taxOffice: addr.taxOffice,
        taxNumber: addr.taxNumber,
        addressLine1: addr.addressLine1,
        addressLine2: addr.addressLine2,
        city: addr.city,
        postalCode: addr.postalCode,
        country: addr.country,
    };
}

export function SavedBillingAddressPicker({ selectedId, onSelect, onUseNew, disabled }: SavedBillingAddressPickerProps) {
    const { t } = useTranslation('checkout');
    const { data: addresses, isLoading, isError } = useBillingAddresses();

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
                <LoadingSpinner size="sm" />
                <span>{t('shipping.loading')}</span>
            </div>
        );
    }

    if (isError || !addresses || addresses.length === 0) {
        return null;
    }

    return (
        <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                {t('billing.savedAddresses')}
            </p>

            {addresses.map((addr) => {
                const isSelected = selectedId === addr.id;
                const isIndividual = resolveInvoiceType(addr.invoiceType) === 'individual';
                return (
                    <button
                        key={addr.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => onSelect(addr.id, toBillingAddress(addr))}
                        className={[
                            'w-full text-left rounded-xl border px-4 py-3.5 transition-all',
                            'flex items-start gap-3',
                            isSelected
                                ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-light)] ring-1 ring-[var(--brand-primary)]'
                                : 'border-border bg-gray-50/50 dark:bg-white/10 hover:border-border hover:bg-card',
                            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                        ].join(' ')}
                    >
                        <FileText
                            className={`mt-0.5 h-4 w-4 shrink-0 ${isSelected ? 'text-[var(--brand-primary)]' : 'text-gray-400'}`}
                        />

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-foreground truncate">
                                    {addr.title}
                                </span>
                                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                                    isIndividual
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                        : 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                                }`}>
                                    {isIndividual ? t('billing.individual') : t('billing.corporate')}
                                </span>
                                {addr.isDefault && (
                                    <span className="shrink-0 rounded-full bg-[var(--brand-primary-light)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--brand-primary)]">
                                        {t('shipping.default')}
                                    </span>
                                )}
                            </div>
                            <p className="mt-0.5 text-xs text-muted-foreground truncate">
                                {isIndividual ? addr.fullName : addr.companyName} · {addr.addressLine1}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {addr.city}, {addr.postalCode}, {addr.country}
                            </p>
                        </div>

                        {isSelected && (
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--brand-primary)] mt-0.5" />
                        )}
                    </button>
                );
            })}

            <button
                type="button"
                disabled={disabled}
                onClick={onUseNew}
                className={[
                    'w-full text-left rounded-xl border-2 border-dashed px-4 py-3 transition-all',
                    'flex items-center gap-2 text-sm font-medium',
                    selectedId === null
                        ? 'border-[var(--brand-primary)] text-[var(--brand-primary)] bg-[var(--brand-primary-subtle)]'
                        : 'border-border text-muted-foreground hover:border-border hover:text-foreground',
                    disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                ].join(' ')}
            >
                <Plus className="h-4 w-4" />
                {t('billing.useNew')}
            </button>
        </div>
    );
}
