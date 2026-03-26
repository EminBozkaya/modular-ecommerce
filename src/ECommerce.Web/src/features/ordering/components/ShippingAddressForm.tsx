import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useShippingAddressSchema, type ShippingAddressFormData } from '@/lib/validations/checkout.schema';
import type { ShippingAddress } from '../types/order';
import { useTranslation } from 'react-i18next';
import { CityDistrictSelect } from '../../../components/shared/CityDistrictSelect';

interface ShippingAddressFormProps {
    value: ShippingAddress;
    onChange: (address: ShippingAddress) => void;
    disabled?: boolean;
    hideHeader?: boolean;
}

const errorClass = 'mt-1.5 text-xs font-semibold text-red-600 ml-0.5';

export function ShippingAddressForm({ value, onChange, disabled, hideHeader }: ShippingAddressFormProps) {
    const { t } = useTranslation('checkout');
    const shippingAddressSchema = useShippingAddressSchema();
    const {
        register,
        watch,
        setValue,
        formState: { errors },
        reset,
    } = useForm<ShippingAddressFormData>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: value,
        mode: 'onChange',
    });

    useEffect(() => {
        reset(value);
    }, [value.fullName, value.addressLine1, value.city, value.postalCode, value.country]);

    useEffect(() => {
        const subscription = watch((formValues) => {
            onChange(formValues as ShippingAddress);
        });
        return () => subscription.unsubscribe();
    }, [watch, onChange]);

    const country = watch('country') ?? '';
    const city = watch('city') ?? '';
    const district = watch('district') ?? '';

    const inputClass = (hasError: boolean) =>
        `w-full rounded-xl border px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:bg-card focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            hasError
                ? 'border-red-400 bg-red-50/30 dark:bg-red-900/10 focus:border-red-500 focus:ring-red-500/20'
                : 'border-border bg-gray-50/50 dark:bg-white/10 focus:border-[var(--brand-primary)] focus:ring-[var(--brand-primary)]/10'
        }`;

    const labelClass = 'block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 ml-1';

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
                />
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
                />
                {errors.country && <p className={errorClass} role="alert">{errors.country.message}</p>}
            </div>

            <CityDistrictSelect
                country={country}
                cityValue={city}
                districtValue={district}
                onCityChange={name => setValue('city', name, { shouldValidate: true })}
                onDistrictChange={name => setValue('district', name)}
                disabled={disabled}
                hasErrorCity={!!errors.city}
                labelClass={labelClass}
                inputClass={inputClass}
            />

            <div>
                <label className={labelClass}>
                    {t('shipping.postalCode')} <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    {...register('postalCode')}
                    disabled={disabled}
                    className={inputClass(!!errors.postalCode)}
                />
                {errors.postalCode && <p className={errorClass} role="alert">{errors.postalCode.message}</p>}
            </div>
        </div>
    );

    if (hideHeader) {
        return fields;
    }

    return (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-black/5">
            <div className="flex items-center gap-3 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white text-xs font-bold shrink-0 shadow-lg shadow-black/5">
                    1
                </div>
                <h2 className="text-base font-semibold text-foreground">{t('shipping.sectionTitle')}</h2>
            </div>
            {fields}
        </div>
    );
}
