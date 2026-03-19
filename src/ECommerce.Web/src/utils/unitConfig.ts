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

    switch (code) {
        case 'kg':
            return {
                step: 0.05,
                min: 0.05,
                decimals: 2,
                displayName: name,
                formatValue: (v, n) => `${v.toFixed(2)} ${n}`,
            };

        case 'g':
            return {
                step: 100,
                min: 100,
                decimals: 0,
                displayName: name,
                formatValue: (v, n) => `${v.toFixed(0)} ${n}`,
            };

        case 'lt':
            return {
                step: 0.1,
                min: 0.1,
                decimals: 1,
                displayName: name,
                formatValue: (v, n) => `${v.toFixed(1)} ${n}`,
            };

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
