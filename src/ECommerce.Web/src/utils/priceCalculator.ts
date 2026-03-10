import { formatPrice } from './formatters';

/**
 * Calculates a preview line price for display purposes only.
 * The authoritative total always comes from the backend (unitPriceSnapshot × quantity).
 */
export function calculateLinePrice(
    unitPrice: number,
    quantity: number,
    currency: string,
): string {
    return formatPrice(unitPrice * quantity, currency);
}
