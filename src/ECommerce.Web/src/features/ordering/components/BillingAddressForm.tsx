import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBillingAddressSchema, type BillingAddressFormData } from '@/lib/validations/checkout.schema';
import type { BillingAddress, InvoiceType, ShippingAddress } from '../types/order';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { CityDistrictSelect } from '../../../components/shared/CityDistrictSelect';

interface BillingAddressFormProps {
    value: BillingAddress;
    onChange: (address: BillingAddress) => void;
    shippingAddress: ShippingAddress;
    disabled?: boolean;
    showSaveOption?: boolean;
    onSaveForLaterChange?: (save: boolean) => void;
}

const errorClass = 'mt-1.5 text-xs font-semibold text-red-600 ml-0.5';

export function BillingAddressForm({ value, onChange, shippingAddress, disabled, showSaveOption, onSaveForLaterChange }: BillingAddressFormProps) {
    const { t } = useTranslation('checkout');
    const billingAddressSchema = useBillingAddressSchema();
    const [sameAsShipping, setSameAsShipping] = useState(true);
    const [saveForLater, setSaveForLater] = useState(true);

    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = useForm<BillingAddressFormData>({
        resolver: zodResolver(billingAddressSchema),
        defaultValues: {
            invoiceType: value.invoiceType || 'individual',
            fullName: value.fullName || '',
            tcKimlikNo: value.tcKimlikNo || '',
            addressLine1: value.addressLine1 || shippingAddress.addressLine1 || '',
            addressLine2: value.addressLine2 || shippingAddress.addressLine2 || '',
            city: value.city || shippingAddress.city || '',
            postalCode: value.postalCode || shippingAddress.postalCode || '',
            country: value.country || shippingAddress.country || '',
        } as BillingAddressFormData,
        mode: 'onChange',
    });

    const invoiceType = watch('invoiceType') as InvoiceType;

    // Stable refs — prevents re-subscribing on every parent render
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const onSaveForLaterChangeRef = useRef(onSaveForLaterChange);
    onSaveForLaterChangeRef.current = onSaveForLaterChange;

    // Track previous sameAsShipping to detect transitions
    const prevSameAsShipping = useRef(true);

    // Sync/clear address fields based on sameAsShipping transitions
    useEffect(() => {
        if (sameAsShipping) {
            setValue('addressLine1', shippingAddress.addressLine1 || '');
            setValue('addressLine2', shippingAddress.addressLine2 || '');
            setValue('city', shippingAddress.city || '');
            setValue('district' as keyof BillingAddressFormData, (shippingAddress.district || '') as never);
            setValue('postalCode', shippingAddress.postalCode || '');
            setValue('country', shippingAddress.country || '');
        } else if (prevSameAsShipping.current) {
            setValue('addressLine1', '');
            setValue('addressLine2', '');
            setValue('city', '');
            setValue('district' as keyof BillingAddressFormData, '' as never);
            setValue('postalCode', '');
            setValue('country', '');
        }
        prevSameAsShipping.current = sameAsShipping;
    }, [sameAsShipping, shippingAddress.addressLine1, shippingAddress.addressLine2, shippingAddress.city, shippingAddress.district, shippingAddress.postalCode, shippingAddress.country, setValue]);

    // Notify parent when saveForLater changes
    useEffect(() => {
        onSaveForLaterChangeRef.current?.(saveForLater);
    }, [saveForLater]);

    // Notify parent of changes — watch is stable, onChange read via ref
    useEffect(() => {
        const subscription = watch((formValues) => {
            onChangeRef.current(formValues as BillingAddress);
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    // When invoice type changes, reset type-specific fields
    useEffect(() => {
        if (invoiceType === 'individual') {
            setValue('companyName' as keyof BillingAddressFormData, undefined as never);
            setValue('taxOffice' as keyof BillingAddressFormData, undefined as never);
            setValue('taxNumber' as keyof BillingAddressFormData, undefined as never);
        } else {
            setValue('fullName' as keyof BillingAddressFormData, undefined as never);
            setValue('tcKimlikNo' as keyof BillingAddressFormData, undefined as never);
        }
    }, [invoiceType, setValue]);

    const inputClass = (hasError: boolean) =>
        `w-full rounded-xl border px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:bg-card focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            hasError
                ? 'border-red-400 bg-red-50/30 dark:bg-red-900/10 focus:border-red-500 focus:ring-red-500/20'
                : 'border-border bg-gray-50/50 dark:bg-white/10 focus:border-[var(--brand-primary)] focus:ring-[var(--brand-primary)]/10'
        }`;

    const labelClass = 'block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 ml-1';

    const tabClass = (active: boolean) =>
        `flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
            active
                ? 'bg-[var(--brand-primary)] text-white shadow-lg shadow-black/5'
                : 'bg-gray-100 dark:bg-white/5 text-muted-foreground hover:bg-gray-200 dark:hover:bg-white/10'
        }`;

    return (
        <div className="space-y-5">
            {/* Same as shipping checkbox */}
            <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                    <input
                        type="checkbox"
                        checked={sameAsShipping}
                        onChange={(e) => setSameAsShipping(e.target.checked)}
                        disabled={disabled}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-border transition-all checked:bg-[var(--brand-primary)] checked:border-[var(--brand-primary)] disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <Check className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity" />
                </div>
                <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                    {t('billing.sameAsShipping')}
                </span>
            </label>

            {/* Invoice type selector */}
            <div>
                <label className={labelClass}>
                    {t('billing.invoiceType')} <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className={tabClass(invoiceType === 'individual')}
                        onClick={() => setValue('invoiceType', 'individual', { shouldValidate: true })}
                        disabled={disabled}
                    >
                        {t('billing.individual')}
                    </button>
                    <button
                        type="button"
                        className={tabClass(invoiceType === 'corporate')}
                        onClick={() => setValue('invoiceType', 'corporate', { shouldValidate: true })}
                        disabled={disabled}
                    >
                        {t('billing.corporate')}
                    </button>
                </div>
            </div>

            {/* Individual fields */}
            {invoiceType === 'individual' && (
                <div className="space-y-4">
                    <div>
                        <label className={labelClass}>
                            {t('billing.fullName')} <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            {...register('fullName')}
                            disabled={disabled}
                            className={inputClass(!!(errors as any).fullName)}
                        />
                        {(errors as any).fullName && <p className={errorClass} role="alert">{(errors as any).fullName.message}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>
                            {t('billing.tcKimlikNo')} <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={11}
                            {...register('tcKimlikNo')}
                            disabled={disabled}
                            className={inputClass(!!(errors as any).tcKimlikNo)}
                        />
                        {(errors as any).tcKimlikNo && <p className={errorClass} role="alert">{(errors as any).tcKimlikNo.message}</p>}
                    </div>
                </div>
            )}

            {/* Corporate fields */}
            {invoiceType === 'corporate' && (
                <div className="space-y-4">
                    <div>
                        <label className={labelClass}>
                            {t('billing.companyName')} <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            {...register('companyName')}
                            disabled={disabled}
                            className={inputClass(!!(errors as any).companyName)}
                        />
                        {(errors as any).companyName && <p className={errorClass} role="alert">{(errors as any).companyName.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass}>
                                {t('billing.taxOffice')} <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                {...register('taxOffice')}
                                disabled={disabled}
                                className={inputClass(!!(errors as any).taxOffice)}
                            />
                            {(errors as any).taxOffice && <p className={errorClass} role="alert">{(errors as any).taxOffice.message}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>
                                {t('billing.taxNumber')} <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={10}
                                {...register('taxNumber')}
                                disabled={disabled}
                                className={inputClass(!!(errors as any).taxNumber)}
                            />
                            {(errors as any).taxNumber && <p className={errorClass} role="alert">{(errors as any).taxNumber.message}</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* Address fields */}
            <div className="space-y-4">
                <div>
                    <label className={labelClass}>
                        {t('billing.addressLine1')} <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        {...register('addressLine1')}
                        disabled={disabled || sameAsShipping}
                        className={inputClass(!!errors.addressLine1)}
                    />
                    {errors.addressLine1 && <p className={errorClass} role="alert">{errors.addressLine1.message}</p>}
                </div>

                <div>
                    <label className={labelClass}>{t('billing.addressLine2')}</label>
                    <input
                        type="text"
                        {...register('addressLine2')}
                        disabled={disabled || sameAsShipping}
                        className={inputClass(!!errors.addressLine2)}
                    />
                </div>

                <div>
                    <label className={labelClass}>
                        {t('billing.country')} <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        {...register('country')}
                        disabled={disabled || sameAsShipping}
                        className={inputClass(!!errors.country)}
                    />
                    {errors.country && <p className={errorClass} role="alert">{errors.country.message}</p>}
                </div>

                <CityDistrictSelect
                    country={watch('country') ?? ''}
                    cityValue={watch('city') ?? ''}
                    districtValue={(watch('district' as keyof BillingAddressFormData) as string) ?? ''}
                    onCityChange={name => setValue('city', name, { shouldValidate: true })}
                    onDistrictChange={name => setValue('district' as keyof BillingAddressFormData, name as never)}
                    disabled={disabled || sameAsShipping}
                    hasErrorCity={!!errors.city}
                    labelClass={labelClass}
                    inputClass={inputClass}
                />

                <div>
                    <label className={labelClass}>
                        {t('billing.postalCode')} <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        {...register('postalCode')}
                        disabled={disabled || sameAsShipping}
                        className={inputClass(!!errors.postalCode)}
                    />
                    {errors.postalCode && <p className={errorClass} role="alert">{errors.postalCode.message}</p>}
                </div>
            </div>

            {/* Save for later — only shown to authenticated users entering a new address */}
            {showSaveOption && !sameAsShipping && (
                <label className="flex items-center gap-3 cursor-pointer group pt-1">
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            checked={saveForLater}
                            onChange={(e) => setSaveForLater(e.target.checked)}
                            disabled={disabled}
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-border transition-all checked:bg-[var(--brand-primary)] checked:border-[var(--brand-primary)] disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <Check className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                        {t('billing.saveForLater')}
                    </span>
                </label>
            )}
        </div>
    );
}
