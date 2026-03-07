export function formatPrice(amount: number, currency: string): string {
    const locale = currency === 'TRY' ? 'tr-TR' : 'en-US';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}
