import { themeQuartz, colorSchemeDark, colorSchemeLight } from 'ag-grid-community';
import { useMemo } from 'react';
import { useThemeStore } from '@/store/themeStore';

const brandParams = {
    accentColor: 'var(--brand-primary, #2C3E50)',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    fontSize: 13,
    headerFontWeight: 600 as const,
    headerFontSize: 12,
};

const lightTheme = themeQuartz
    .withPart(colorSchemeLight)
    .withParams({
        ...brandParams,
        headerTextColor: 'var(--brand-primary, #2C3E50)',
        headerBackgroundColor: 'hsl(var(--card))',
        borderColor: 'hsl(var(--border))',
        selectedRowBackgroundColor: 'hsl(var(--accent))',
        rowHoverColor: 'hsl(var(--accent))',
    });

const darkTheme = themeQuartz
    .withPart(colorSchemeDark)
    .withParams({
        ...brandParams,
        headerTextColor: '#e2e8f0',
        headerBackgroundColor: '#1a1f2e',
        backgroundColor: '#0f1219',
        foregroundColor: '#e2e8f0',
        chromeBackgroundColor: '#1a1f2e',
        borderColor: '#2a3040',
        selectedRowBackgroundColor: '#2a3040',
        rowHoverColor: '#1e2433',
        oddRowBackgroundColor: '#131720',
    });

export function useAgGridTheme() {
    const { resolved } = useThemeStore();
    return useMemo(
        () => (resolved === 'dark' ? darkTheme : lightTheme),
        [resolved]
    );
}

/** Dark-mode-aware row style colors for getRowStyle callbacks */
export function useRowStyleColors() {
    const { resolved } = useThemeStore();
    return useMemo(() => {
        const isDark = resolved === 'dark';
        return {
            deleted: isDark ? 'rgba(239,68,68,0.15)' : '#fef2f2',
            inactive: isDark ? 'rgba(100,116,139,0.15)' : '#f1f5f9',
            active: isDark ? 'rgba(34,197,94,0.12)' : '#f0fdf4',
        };
    }, [resolved]);
}
