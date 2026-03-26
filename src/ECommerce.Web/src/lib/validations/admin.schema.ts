import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

// ─── Product ──────────────────────────────────────────────────────────────────
// Backend CreateProductCommand validator ile eşleşiyor

export const useProductSchema = () => {
    const { t } = useTranslation('validation');
    return useMemo(() => z.object({
        name: z
            .string()
            .min(2, t('minLength', { min: 2 }))
            .max(200, t('maxLength', { max: 200 })),
        description: z
            .string()
            .max(2000, t('maxLength', { max: 2000 }))
            .optional()
            .or(z.literal('')),
        imageUrl: z
            .string()
            .optional()
            .or(z.literal('')),
        price: z
            .number({ message: t('invalidPrice') })
            .positive(t('positiveNumber'))
            .multipleOf(0.01),
        currency: z.string().default('TRY'),
        stockQuantity: z
            .number({ message: t('required') })
            .int()
            .min(0, t('minValue', { min: 0 })),
        categoryId: z
            .string()
            .min(1, t('required')),
        unitId: z
            .string()
            .min(1, t('required')),
        isActive: z.boolean().default(true),
    }), [t]);
};

export type ProductFormData = z.output<ReturnType<typeof useProductSchema>>;

// ─── Category ─────────────────────────────────────────────────────────────────
// Backend CreateCategoryCommand validator ile eşleşiyor

export const useCategorySchema = () => {
    const { t } = useTranslation('validation');
    return useMemo(() => z.object({
        name: z
            .string()
            .min(2, t('minLength', { min: 2 }))
            .max(100, t('maxLength', { max: 100 })),
        description: z
            .string()
            .max(500, t('maxLength', { max: 500 }))
            .optional()
            .or(z.literal('')),
        imageUrl: z
            .string()
            .optional()
            .or(z.literal('')),
        isActive: z.boolean().default(true),
        parentCategoryId: z
            .string()
            .optional()
            .or(z.literal('')),
    }), [t]);
};

export type CategoryFormData = z.output<ReturnType<typeof useCategorySchema>>;

// ─── Admin User ───────────────────────────────────────────────────────────────

export const useAdminUserSchema = () => {
    const { t } = useTranslation('validation');
    return useMemo(() => z.object({
        fullName: z
            .string()
            .min(2, t('minLength', { min: 2 }))
            .max(100, t('maxLength', { max: 100 })),
        email: z
            .string()
            .min(1, t('required'))
            .email(t('email')),
        role: z.enum(['Customer', 'Admin']),
        isActive: z.boolean().default(true),
    }), [t]);
};

export type AdminUserFormData = z.output<ReturnType<typeof useAdminUserSchema>>;

// ─── Address ──────────────────────────────────────────────────────────────────

export const useAddressSchema = () => {
    const { t } = useTranslation('validation');
    return useMemo(() => z.object({
        userId: z.string().uuid(t('required')).optional(),
        title: z.string().min(1, t('required')),
        fullName: z.string().min(1, t('required')),
        addressLine1: z.string().min(1, t('required')),
        addressLine2: z.string().optional().or(z.literal('')),
        city: z.string().min(1, t('required')),
        postalCode: z.string().min(1, t('required')),
        country: z.string().min(1, t('required')),
        isActive: z.boolean(),
    }), [t]);
};

export type AddressFormData = z.output<ReturnType<typeof useAddressSchema>>;
