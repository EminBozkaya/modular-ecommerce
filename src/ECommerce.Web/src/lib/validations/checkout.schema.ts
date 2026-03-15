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
