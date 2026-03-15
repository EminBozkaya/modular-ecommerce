export function formatPrice(amount: number, currency: string = 'TRY'): string {
    const safeCurrency = currency || 'TRY';
    const locale = safeCurrency === 'TRY' ? 'tr-TR' : 'en-US';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: safeCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount || 0);
}
