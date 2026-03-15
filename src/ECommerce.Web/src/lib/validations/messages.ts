type Locale = 'tr' | 'en';

// Tarayıcı dilinden locale tespiti
export function getLocale(): Locale {
    return navigator.language.startsWith('tr') ? 'tr' : 'en';
}

export const messages = {
    required: { tr: 'Bu alan zorunludur', en: 'This field is required' },
    email: { tr: 'Geçerli bir e-posta girin', en: 'Enter a valid email' },
    minLength: (n: number) => ({
        tr: `En az ${n} karakter olmalıdır`,
        en: `Must be at least ${n} characters`,
    }),
    maxLength: (n: number) => ({
        tr: `En fazla ${n} karakter olabilir`,
        en: `Must be at most ${n} characters`,
    }),
    passwordMismatch: { tr: 'Şifreler eşleşmiyor', en: 'Passwords do not match' },
    passwordWeak: {
        tr: 'Şifre en az 1 büyük harf, 1 rakam içermelidir',
        en: 'Password must contain at least 1 uppercase letter and 1 number',
    },
    positiveNumber: { tr: 'Pozitif bir sayı girin', en: 'Enter a positive number' },
    invalidPrice: { tr: 'Geçerli bir fiyat girin', en: 'Enter a valid price' },
    minValue: (n: number) => ({
        tr: `En az ${n} olmalıdır`,
        en: `Must be at least ${n}`,
    }),
} as const;

type MessageKey = keyof typeof messages;
type MessageValue = (typeof messages)[MessageKey];

// Kullanım kolaylığı için helper
export function msg(key: MessageKey, ...args: number[]): string {
    const locale = getLocale();
    const entry = messages[key];
    const resolved: MessageValue =
        typeof entry === 'function'
            ? (entry as (n: number) => { tr: string; en: string })(args[0])
            : entry;
    return (resolved as Record<Locale, string>)[locale];
}
