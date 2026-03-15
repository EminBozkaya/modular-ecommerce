import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useShippingAddressSchema, type ShippingAddressFormData } from '@/lib/validations/checkout.schema';
import type { ShippingAddress } from '../types/order';
import { useTranslation } from 'react-i18next';

interface ShippingAddressFormProps {
    value: ShippingAddress;
    onChange: (address: ShippingAddress) => void;
    disabled?: boolean;
    /** When true, hides the card wrapper and header (used when embedded inside a parent card) */
    hideHeader?: boolean;
}

const errorClass = 'mt-1.5 text-xs font-semibold text-red-600 ml-0.5';

export function ShippingAddressForm({ value, onChange, disabled, hideHeader }: ShippingAddressFormProps) {
    const { t } = useTranslation('checkout');
    const shippingAddressSchema = useShippingAddressSchema();
    const {
        register,
        watch,
        formState: { errors },
        reset,
    } = useForm<ShippingAddressFormData>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: value,
        mode: 'onChange',
    });

    // Parent value değişince formu senkronize et (kayıtlı adres seçimi gibi durumlarda)
    useEffect(() => {
        reset(value);
    }, [value.fullName, value.addressLine1, value.city, value.postalCode, value.country]);

    // İzlenen değerleri parent'a bildiren effect
    useEffect(() => {
        const subscription = watch((formValues) => {
            onChange(formValues as ShippingAddress);
        });
        return () => subscription.unsubscribe();
    }, [watch, onChange]);

    const inputClass = (hasError: boolean) =>
        `w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:bg-white focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            hasError
                ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-200 bg-gray-50 focus:border-[var(--color-ebrar-green)] focus:ring-[var(--color-ebrar-green)]/20'
        }`;

    const labelClass = 'block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5';

    const fields = (
        <div className="space-y-4">
            <div>
                <label className={labelClass}>
                    {t('shipping.fullName')} <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    {...register('fullName')}
                    disabled={disabled}
                    className={inputClass(!!errors.fullName)}
                    placeholder={t('shipping.fullNamePlaceholder')}
                />
                {errors.fullName && <p className={errorClass} role="alert">{errors.fullName.message}</p>}
            </div>

            <div>
                <label className={labelClass}>
                    {t('shipping.address1')} <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    {...register('addressLine1')}
                    disabled={disabled}
                    className={inputClass(!!errors.addressLine1)}
                    placeholder={t('shipping.address1Placeholder')}
                />
                {errors.addressLine1 && <p className={errorClass} role="alert">{errors.addressLine1.message}</p>}
            </div>

            <div>
                <label className={labelClass}>{t('shipping.address2')}</label>
                <input
                    type="text"
                    {...register('addressLine2')}
                    disabled={disabled}
                    className={inputClass(!!errors.addressLine2)}
                    placeholder={t('shipping.address2Placeholder')}
                />
                {errors.addressLine2 && <p className={errorClass} role="alert">{errors.addressLine2.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelClass}>
                        {t('shipping.city')} <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        {...register('city')}
                        disabled={disabled}
                        className={inputClass(!!errors.city)}
                        placeholder={t('shipping.cityPlaceholder')}
                    />
                    {errors.city && <p className={errorClass} role="alert">{errors.city.message}</p>}
                </div>
                <div>
                    <label className={labelClass}>
                        {t('shipping.postalCode')} <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        {...register('postalCode')}
                        disabled={disabled}
                        className={inputClass(!!errors.postalCode)}
                        placeholder={t('shipping.postalCodePlaceholder')}
                    />
                    {errors.postalCode && <p className={errorClass} role="alert">{errors.postalCode.message}</p>}
                </div>
            </div>

            <div>
                <label className={labelClass}>
                    {t('shipping.country')} <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    {...register('country')}
                    disabled={disabled}
                    className={inputClass(!!errors.country)}
                    placeholder={t('shipping.countryPlaceholder')}
                />
                {errors.country && <p className={errorClass} role="alert">{errors.country.message}</p>}
            </div>
        </div>
    );

    if (hideHeader) {
        return fields;
    }

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-ebrar-green)] text-white text-xs font-bold shrink-0">
                    1
                </div>
                <h2 className="text-base font-semibold text-gray-900">{t('shipping.sectionTitle')}</h2>
            </div>
            {fields}
        </div>
    );
}
