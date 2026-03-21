export type UnitStepConfig = {
    step: number;
    min: number;
    decimals: number;
    /** formatValue uses the translated displayName passed in, not a hardcoded string */
    formatValue: (value: number, displayName: string) => string;
    displayName: string;
};

/**
 * Returns quantity input behaviour config based on the language-neutral unit CODE.
 * Always pass `product.unitCode` (e.g. "kg", "g", "adet") — NOT the translated name.
 * Pass `displayName` as the translated `product.unitName` for correct localised display.
 */
export function getUnitConfig(unitCode: string | null | undefined, displayName?: string): UnitStepConfig {
    const code = (unitCode ?? '').toLowerCase().trim();
    const name = displayName ?? unitCode ?? '';
    const nameLower = name.toLowerCase().trim();

    // Match by code first, then fallback to common localized names
    const isKg = code === 'kg' || nameLower === 'kilogram' || nameLower === 'kg';
    const isGram = code === 'g' || nameLower === 'gram' || nameLower === 'g';
    const isLiter = code === 'lt' || nameLower === 'litre' || nameLower === 'liter' || nameLower === 'lt';

    if (isKg) {
        return {
            step: 0.05,
            min: 0.05,
            decimals: 2,
            displayName: name,
            formatValue: (v, n) => `${v.toFixed(2)} ${n}`,
        };
    }

    if (isGram) {
        return {
            step: 100,
            min: 100,
            decimals: 0,
            displayName: name,
            formatValue: (v, n) => `${v.toFixed(0)} ${n}`,
        };
    }

    if (isLiter) {
        return {
            step: 0.1,
            min: 0.1,
            decimals: 1,
            displayName: name,
            formatValue: (v, n) => `${v.toFixed(1)} ${n}`,
        };
    }

    switch (code) {

        case 'adet':
        case 'paket':
        case 'deste':
        case 'koli':
        case 'kit':
            return {
                step: 1,
                min: 1,
                decimals: 0,
                displayName: name,
                formatValue: (v, n) => `${v.toFixed(0)} ${n}`,
            };

        default:
            // Unknown code — safe integer default, show whatever name was passed
            return {
                step: 1,
                min: 1,
                decimals: 0,
                displayName: name,
                formatValue: (v, n) => `${v.toFixed(0)} ${n}`,
            };
    }
}
