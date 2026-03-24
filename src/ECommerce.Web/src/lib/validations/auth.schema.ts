import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

// ─── Login ────────────────────────────────────────────────────────────────────

export const useLoginSchema = () => {
    const { t } = useTranslation('validation');
    return useMemo(() => z.object({
        email: z
            .string()
            .min(1, t('required'))
            .email(t('email')),
        password: z
            .string()
            .min(1, t('required')),
    }), [t]);
};

export type LoginFormData = z.infer<ReturnType<typeof useLoginSchema>>;

// ─── Register ─────────────────────────────────────────────────────────────────
// Backend RegisterCommandValidator: FullName min 2 max 100, Email, Password 8+ uppercase+digit

export const useRegisterSchema = () => {
    const { t } = useTranslation('validation');
    return useMemo(() => z
        .object({
            firstName: z
                .string()
                .min(2, t('minLength', { min: 2 }))
                .max(50, t('maxLength', { max: 50 })),
            lastName: z
                .string()
                .min(2, t('minLength', { min: 2 }))
                .max(50, t('maxLength', { max: 50 })),
            email: z
                .string()
                .min(1, t('required'))
                .email(t('email')),
            password: z
                .string()
                .min(4, t('minLength', { min: 4 }))
                .max(100, t('maxLength', { max: 100 })),
            confirmPassword: z
                .string()
                .min(1, t('required')),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: t('passwordMismatch'),
            path: ['confirmPassword'],
        }), [t]);
};

export type RegisterFormData = z.infer<ReturnType<typeof useRegisterSchema>>;
