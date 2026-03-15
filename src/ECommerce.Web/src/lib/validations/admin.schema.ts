import { z } from 'zod';
import { msg } from './messages';

// ─── Product ──────────────────────────────────────────────────────────────────
// Backend CreateProductCommand validator ile eşleşiyor

export const productSchema = z.object({
    name: z
        .string()
        .min(2, msg('minLength', 2))
        .max(200, msg('maxLength', 200)),
    description: z
        .string()
        .max(2000, msg('maxLength', 2000))
        .optional()
        .or(z.literal('')),
    imageUrl: z
        .string()
        .optional()
        .or(z.literal('')),
    price: z
        .number({ message: msg('invalidPrice') })
        .positive(msg('positiveNumber'))
        .multipleOf(0.01),
    currency: z.string().default('TRY'),
    stockQuantity: z
        .number({ message: msg('required') })
        .int()
        .min(0, msg('minValue', 0)),
    categoryId: z
        .string()
        .min(1, msg('required')),
    unitId: z
        .string()
        .min(1, msg('required')),
    isActive: z.boolean().default(true),
});

export type ProductFormData = z.infer<typeof productSchema>;

// ─── Category ─────────────────────────────────────────────────────────────────
// Backend CreateCategoryCommand validator ile eşleşiyor

export const categorySchema = z.object({
    name: z
        .string()
        .min(2, msg('minLength', 2))
        .max(100, msg('maxLength', 100)),
    description: z
        .string()
        .max(500, msg('maxLength', 500))
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
});

export type CategoryFormData = z.infer<typeof categorySchema>;

// ─── Admin User ───────────────────────────────────────────────────────────────

export const adminUserSchema = z.object({
    fullName: z
        .string()
        .min(2, msg('minLength', 2))
        .max(100, msg('maxLength', 100)),
    email: z
        .string()
        .min(1, msg('required'))
        .email(msg('email')),
    role: z.enum(['Customer', 'Admin']),
    isActive: z.boolean().default(true),
});

export type AdminUserFormData = z.infer<typeof adminUserSchema>;

// ─── Address ──────────────────────────────────────────────────────────────────

export const addressSchema = z.object({
    userId: z.string().uuid(msg('required')).optional(),
    title: z.string().min(1, msg('required')),
    fullName: z.string().min(1, msg('required')),
    addressLine1: z.string().min(1, msg('required')),
    addressLine2: z.string().optional().or(z.literal('')),
    city: z.string().min(1, msg('required')),
    postalCode: z.string().min(1, msg('required')),
    country: z.string().min(1, msg('required')),
    isActive: z.boolean(),
});

export type AddressFormData = z.infer<typeof addressSchema>;
