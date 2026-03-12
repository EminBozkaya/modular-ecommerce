import { z } from 'zod';
import { msg } from './messages';

// ─── Shipping Address ─────────────────────────────────────────────────────────
// Backend CreateOrderCommand / ShippingAddress validator ile eşleşiyor

export const shippingAddressSchema = z.object({
    fullName: z
        .string()
        .min(2, msg('minLength', 2))
        .max(100, msg('maxLength', 100)),
    addressLine1: z
        .string()
        .min(5, msg('minLength', 5))
        .max(200, msg('maxLength', 200)),
    addressLine2: z
        .string()
        .max(200, msg('maxLength', 200))
        .optional()
        .or(z.literal('')),
    city: z
        .string()
        .min(2, msg('minLength', 2))
        .max(100, msg('maxLength', 100)),
    postalCode: z
        .string()
        .min(1, msg('required'))
        .max(20, msg('maxLength', 20)),
    country: z
        .string()
        .min(2, msg('minLength', 2))
        .max(100, msg('maxLength', 100)),
    phone: z
        .string()
        .max(20, msg('maxLength', 20))
        .optional()
        .or(z.literal('')),
});

export type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>;

// ─── Payment Method ───────────────────────────────────────────────────────────
// Kart verisi toplanmıyor (3D Secure) — sadece provider seçimi

export const paymentMethodSchema = z.object({
    providerName: z
        .string()
        .min(1, msg('required')),
});

export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;
