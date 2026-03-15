import { z } from 'zod';
import { msg } from './messages';

// ─── Login ────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, msg('required'))
        .email(msg('email')),
    password: z
        .string()
        .min(1, msg('required')),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ─── Register ─────────────────────────────────────────────────────────────────
// Backend RegisterCommandValidator: FullName min 2 max 100, Email, Password 8+ uppercase+digit

export const registerSchema = z
    .object({
        firstName: z
            .string()
            .min(2, msg('minLength', 2))
            .max(50, msg('maxLength', 50)),
        lastName: z
            .string()
            .min(2, msg('minLength', 2))
            .max(50, msg('maxLength', 50)),
        email: z
            .string()
            .min(1, msg('required'))
            .email(msg('email')),
        password: z
            .string()
            .min(8, msg('minLength', 8))
            .max(100, msg('maxLength', 100))
            .regex(/[A-Z]/, msg('passwordWeak'))
            .regex(/[0-9]/, msg('passwordWeak')),
        confirmPassword: z
            .string()
            .min(1, msg('required')),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: msg('passwordMismatch'),
        path: ['confirmPassword'],
    });

export type RegisterFormData = z.infer<typeof registerSchema>;
