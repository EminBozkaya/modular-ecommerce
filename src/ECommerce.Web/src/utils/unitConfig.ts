export type UnitStepConfig = {
    step: number;
    min: number;
    decimals: number;
    formatValue: (value: number) => string;
    displayName: string;
};

export function getUnitConfig(unitName: string): UnitStepConfig {
    const lower = unitName.toLowerCase().trim();

    if (lower.includes('kg') || lower.includes('kilogram')) {
        return {
            step: 0.05,
            min: 0.05,
            decimals: 2,
            displayName: 'Kilogram',
            formatValue: (v) => `${v.toFixed(2)} kg`,
        };
    }

    if (lower.includes('litre') || lower.includes('liter') || lower === 'l') {
        return {
            step: 0.1,
            min: 0.1,
            decimals: 1,
            displayName: 'Litre',
            formatValue: (v) => `${v.toFixed(1)} L`,
        };
    }

    // 'g' check must come after 'kg' check to avoid false match
    if (lower.includes('gram') || lower === 'g') {
        return {
            step: 100,
            min: 100,
            decimals: 0,
            displayName: 'Gram',
            formatValue: (v) => `${v.toFixed(0)} g`,
        };
    }

    if (
        lower.includes('koli') ||
        lower.includes('deste') ||
        lower.includes('düzine') ||
        lower.includes('dozen')
    ) {
        return {
            step: 1,
            min: 1,
            decimals: 0,
            displayName: unitName,
            formatValue: (v) => `${v.toFixed(0)} ${lower.includes('koli') ? 'koli' : lower.includes('deste') ? 'deste' : 'düzine'}`,
        };
    }

    if (
        lower.includes('adet') ||
        lower.includes('piece') ||
        lower.includes('pcs')
    ) {
        return {
            step: 1,
            min: 1,
            decimals: 0,
            displayName: 'Adet',
            formatValue: (v) => `${v.toFixed(0)} adet`,
        };
    }

    // Safe default for unrecognized units
    return {
        step: 1,
        min: 1,
        decimals: 0,
        displayName: unitName,
        formatValue: (v) => `${v.toFixed(0)} ${unitName}`,
    };
}
