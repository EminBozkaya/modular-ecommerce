/**
 * @deprecated Artık i18next validation namespace kullanılıyor.
 * Bu dosya geriye dönük uyumluluk için korunmaktadır.
 * Yeni kod için: import i18n from '@/i18n/index'; i18n.t('key', { ns: 'validation' })
 */
import i18n from '@/i18n/index';

export const messages = {
    required: {
        get tr() { return i18n.t('required', { ns: 'validation', lng: 'tr' }); },
        get en() { return i18n.t('required', { ns: 'validation', lng: 'en' }); },
    },
    email: {
        get tr() { return i18n.t('email', { ns: 'validation', lng: 'tr' }); },
        get en() { return i18n.t('email', { ns: 'validation', lng: 'en' }); },
    },
    minLength: (n: number) => ({
        get tr() { return i18n.t('minLength', { ns: 'validation', lng: 'tr', min: n }); },
        get en() { return i18n.t('minLength', { ns: 'validation', lng: 'en', min: n }); },
    }),
    maxLength: (n: number) => ({
        get tr() { return i18n.t('maxLength', { ns: 'validation', lng: 'tr', max: n }); },
        get en() { return i18n.t('maxLength', { ns: 'validation', lng: 'en', max: n }); },
    }),
    passwordMismatch: {
        get tr() { return i18n.t('passwordMismatch', { ns: 'validation', lng: 'tr' }); },
        get en() { return i18n.t('passwordMismatch', { ns: 'validation', lng: 'en' }); },
    },
    passwordWeak: {
        get tr() { return i18n.t('passwordWeak', { ns: 'validation', lng: 'tr' }); },
        get en() { return i18n.t('passwordWeak', { ns: 'validation', lng: 'en' }); },
    },
    positiveNumber: {
        get tr() { return i18n.t('positiveNumber', { ns: 'validation', lng: 'tr' }); },
        get en() { return i18n.t('positiveNumber', { ns: 'validation', lng: 'en' }); },
    },
    invalidPrice: {
        get tr() { return i18n.t('invalidPrice', { ns: 'validation', lng: 'tr' }); },
        get en() { return i18n.t('invalidPrice', { ns: 'validation', lng: 'en' }); },
    },
    minValue: (n: number) => ({
        get tr() { return i18n.t('minValue', { ns: 'validation', lng: 'tr', min: n }); },
        get en() { return i18n.t('minValue', { ns: 'validation', lng: 'en', min: n }); },
    }),
} as const;

/** Aktif dile göre validation mesajı döner */
export function msg(key: keyof Omit<typeof messages, 'minLength' | 'maxLength' | 'minValue'>, ...args: number[]): string {
    const lang = i18n.language as 'tr' | 'en';
    const k = key as string;

    if (k === 'minLength' || k === 'maxLength' || k === 'minValue') {
        const fn = messages[key as keyof typeof messages] as (n: number) => { tr: string; en: string };
        return fn(args[0])[lang];
    }
    return (messages[key] as { tr: string; en: string })[lang];
}

export function getLocale(): 'tr' | 'en' {
    return (i18n.language as 'tr' | 'en') ?? 'tr';
}
