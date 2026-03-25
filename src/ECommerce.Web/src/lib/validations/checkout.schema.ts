import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

// ─── Shipping Address ─────────────────────────────────────────────────────────
// Backend CreateOrderCommand / ShippingAddress validator ile eşleşiyor

export const useShippingAddressSchema = () => {
    const { t } = useTranslation('validation');
    return useMemo(() => z.object({
        fullName: z
            .string()
            .min(2, t('minLength', { min: 2 }))
            .max(100, t('maxLength', { max: 100 })),
        addressLine1: z
            .string()
            .min(5, t('minLength', { min: 5 }))
            .max(200, t('maxLength', { max: 200 })),
        addressLine2: z
            .string()
            .max(200, t('maxLength', { max: 200 }))
            .optional()
            .or(z.literal('')),
        city: z
            .string()
            .min(2, t('minLength', { min: 2 }))
            .max(100, t('maxLength', { max: 100 })),
        district: z
            .string()
            .max(100, t('maxLength', { max: 100 }))
            .optional()
            .or(z.literal('')),
        postalCode: z
            .string()
            .min(1, t('required'))
            .max(20, t('maxLength', { max: 20 })),
        country: z
            .string()
            .min(2, t('minLength', { min: 2 }))
            .max(100, t('maxLength', { max: 100 })),
        phone: z
            .string()
            .max(20, t('maxLength', { max: 20 }))
            .optional()
            .or(z.literal('')),
    }), [t]);
};

export type ShippingAddressFormData = z.input<ReturnType<typeof useShippingAddressSchema>>;

// ─── TC Kimlik No Validation Algorithm ───────────────────────────────────────

function validateTcKimlikNo(value: string): boolean {
    if (value.length !== 11 || value[0] === '0') return false;
    const d = value.split('').map(Number);
    const oddSum = d[0] + d[2] + d[4] + d[6] + d[8];
    const evenSum = d[1] + d[3] + d[5] + d[7];
    let d10 = (oddSum * 7 - evenSum) % 10;
    if (d10 < 0) d10 += 10;
    if (d[9] !== d10) return false;
    let totalSum = 0;
    for (let i = 0; i < 10; i++) totalSum += d[i];
    return d[10] === totalSum % 10;
}

// ─── Billing Address ─────────────────────────────────────────────────────────

export const useBillingAddressSchema = () => {
    const { t } = useTranslation('validation');
    return useMemo(() => {
        const commonAddress = {
            addressLine1: z
                .string()
                .min(5, t('minLength', { min: 5 }))
                .max(200, t('maxLength', { max: 200 })),
            addressLine2: z
                .string()
                .max(200, t('maxLength', { max: 200 }))
                .optional()
                .or(z.literal('')),
            city: z
                .string()
                .min(2, t('minLength', { min: 2 }))
                .max(100, t('maxLength', { max: 100 })),
            district: z
                .string()
                .max(100, t('maxLength', { max: 100 }))
                .optional()
                .or(z.literal('')),
            postalCode: z
                .string()
                .min(1, t('required'))
                .max(20, t('maxLength', { max: 20 })),
            country: z
                .string()
                .min(2, t('minLength', { min: 2 }))
                .max(100, t('maxLength', { max: 100 })),
        };

        return z.discriminatedUnion('invoiceType', [
            z.object({
                invoiceType: z.literal('individual'),
                fullName: z
                    .string()
                    .min(2, t('minLength', { min: 2 }))
                    .max(100, t('maxLength', { max: 100 })),
                tcKimlikNo: z
                    .string()
                    .length(11, t('tcKimlikLength'))
                    .regex(/^\d{11}$/, t('tcKimlikLength'))
                    .refine(validateTcKimlikNo, { message: t('tcKimlikInvalid') }),
                ...commonAddress,
            }),
            z.object({
                invoiceType: z.literal('corporate'),
                companyName: z
                    .string()
                    .min(2, t('minLength', { min: 2 }))
                    .max(200, t('maxLength', { max: 200 })),
                taxOffice: z
                    .string()
                    .min(2, t('minLength', { min: 2 }))
                    .max(100, t('maxLength', { max: 100 })),
                taxNumber: z
                    .string()
                    .length(10, t('taxNumberLength'))
                    .regex(/^\d{10}$/, t('taxNumberDigits')),
                ...commonAddress,
            }),
        ]);
    }, [t]);
};

export type BillingAddressFormData = z.input<ReturnType<typeof useBillingAddressSchema>>;

// ─── Payment Method ───────────────────────────────────────────────────────────
// Kart verisi toplanmıyor (3D Secure) — sadece provider seçimi

export const usePaymentMethodSchema = () => {
    const { t } = useTranslation('validation');
    return useMemo(() => z.object({
        providerName: z
            .string()
            .min(1, t('required')),
    }), [t]);
};

export type PaymentMethodFormData = z.input<ReturnType<typeof usePaymentMethodSchema>>;
