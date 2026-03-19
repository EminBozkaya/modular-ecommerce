/**
 * Color utility functions for dark-mode-aware brand color adjustments.
 *
 * The white-label platform lets each store admin pick arbitrary colours.
 * In dark mode we must guarantee those colours remain *visible* and
 * *aesthetically coherent* on dark backgrounds — regardless of the
 * original hex value the admin chose.
 */

/* ── Hex ↔ HSL conversion ─────────────────────────────────────────── */

export function hexToRgb(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}

export function hexToHsl(hex: string): [number, number, number] {
    const [rr, gg, bb] = hexToRgb(hex);
    const r = rr / 255;
    const g = gg / 255;
    const b = bb / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;

    if (max === min) return [0, 0, l * 100]; // achromatic

    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    let h = 0;
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;

    return [h * 360, s * 100, l * 100];
}

export function hslToHex(h: number, s: number, l: number): string {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };

    let r: number, g: number, b: number;
    if (s === 0) {
        r = g = b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (n: number) =>
        Math.round(n * 255)
            .toString(16)
            .padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/* ── Dark-mode adjustment ──────────────────────────────────────────── */

/**
 * Adjust a brand accent/primary colour so it is clearly visible on a
 * dark background.  Keeps the hue intact to preserve brand identity;
 * lifts lightness into the 50-65 % band and caps saturation to avoid
 * neon artefacts.
 *
 * Examples:
 *   #2C3E50 (very dark blue-grey, L≈30%)  → lifted to ~55 % lightness
 *   #FF6B9D (bright pink, L≈71%)          → pulled down to ~63 %
 *   #4CAF50 (medium green, L≈49%)         → stays roughly the same
 */
export function adjustPrimaryForDark(hex: string): string {
    const [h, s, l] = hexToHsl(hex);
    const newL = l < 45 ? 55 : l > 70 ? 63 : l;
    const newS = Math.min(s, 75);
    return hslToHex(h, newS, newL);
}

/**
 * Generate a very dark background tinted with the brand hue.
 * Used for sidebar / footer in dark mode — maintains brand identity
 * while staying dark enough for a dark theme.
 *
 * Lightness is clamped to 8-12 %, saturation reduced to 20-35 %.
 */
export function brandTintedDarkBg(hex: string): string {
    const [h, s] = hexToHsl(hex);
    const newS = Math.min(Math.max(s * 0.4, 20), 35);
    return hslToHex(h, newS, 10);
}

/**
 * Generate a "pressed" / 3-D border-bottom dark variant.
 * In dark mode this is slightly lighter than the adjusted primary
 * (reverse of light mode where it was darker).
 */
export function adjustDarkVariant(adjustedPrimaryHex: string): string {
    const [h, s, l] = hexToHsl(adjustedPrimaryHex);
    return hslToHex(h, s, Math.min(l + 8, 75));
}
