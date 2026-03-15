import { MapPin, Plus, CheckCircle2 } from 'lucide-react';
import { useAddresses } from '../../auth/hooks/useAddresses';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import type { UserAddress } from '../../auth/types/address';
import type { ShippingAddress } from '../types/order';
import { useTranslation } from 'react-i18next';

interface SavedAddressPickerProps {
    selectedId: string | null;
    onSelect: (id: string, address: ShippingAddress) => void;
    onUseNew: () => void;
    disabled?: boolean;
}

function toShippingAddress(addr: UserAddress): ShippingAddress {
    return {
        fullName: addr.fullName,
        addressLine1: addr.addressLine1,
        addressLine2: addr.addressLine2,
        city: addr.city,
        postalCode: addr.postalCode,
        country: addr.country,
    };
}

export function SavedAddressPicker({ selectedId, onSelect, onUseNew, disabled }: SavedAddressPickerProps) {
    const { t } = useTranslation('checkout');
    const { data: addresses, isLoading, isError } = useAddresses();

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 py-3 text-sm text-gray-500">
                <LoadingSpinner size="sm" />
                <span>{t('shipping.loading')}</span>
            </div>
        );
    }

    if (isError || !addresses || addresses.length === 0) {
        return null; // No saved addresses — caller renders the manual form
    }

    return (
        <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                {t('shipping.savedAddresses')}
            </p>

            {addresses.map((addr) => {
                const isSelected = selectedId === addr.id;
                return (
                    <button
                        key={addr.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => onSelect(addr.id, toShippingAddress(addr))}
                        className={[
                            'w-full text-left rounded-xl border px-4 py-3.5 transition-all',
                            'flex items-start gap-3',
                            isSelected
                                ? 'border-[var(--color-ebrar-green)] bg-[var(--color-ebrar-green)]/5 ring-1 ring-[var(--color-ebrar-green)]'
                                : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white',
                            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                        ].join(' ')}
                    >
                        <MapPin
                            className={`mt-0.5 h-4 w-4 shrink-0 ${isSelected ? 'text-[var(--color-ebrar-green)]' : 'text-gray-400'}`}
                        />

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-900 truncate">
                                    {addr.title}
                                </span>
                                {addr.isDefault && (
                                    <span className="shrink-0 rounded-full bg-[var(--color-ebrar-green)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-ebrar-green)]">
                                        {t('shipping.default')}
                                    </span>
                                )}
                            </div>
                            <p className="mt-0.5 text-xs text-gray-500 truncate">
                                {addr.fullName} · {addr.addressLine1}
                            </p>
                            <p className="text-xs text-gray-400">
                                {addr.city}, {addr.postalCode}, {addr.country}
                            </p>
                        </div>

                        {isSelected && (
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--color-ebrar-green)] mt-0.5" />
                        )}
                    </button>
                );
            })}

            {/* Use a new address */}
            <button
                type="button"
                disabled={disabled}
                onClick={onUseNew}
                className={[
                    'w-full text-left rounded-xl border-2 border-dashed px-4 py-3 transition-all',
                    'flex items-center gap-2 text-sm font-medium',
                    selectedId === null
                        ? 'border-[var(--color-ebrar-green)] text-[var(--color-ebrar-green)]'
                        : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500',
                    disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                ].join(' ')}
            >
                <Plus className="h-4 w-4" />
                {t('shipping.useNew')}
            </button>
        </div>
    );
}
