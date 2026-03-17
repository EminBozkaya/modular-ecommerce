import { create } from 'zustand';

type ThemePreference = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeState {
    preference: ThemePreference;
    resolved: ResolvedTheme;
    setTheme: (pref: ThemePreference) => void;
    toggleTheme: () => void;
}

const STORAGE_KEY = 'theme-preference';

function getSystemTheme(): ResolvedTheme {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(pref: ThemePreference): ResolvedTheme {
    if (pref === 'system') return getSystemTheme();
    return pref;
}

function applyThemeClass(resolved: ResolvedTheme) {
    const el = document.documentElement;
    if (resolved === 'dark') {
        el.classList.add('dark');
    } else {
        el.classList.remove('dark');
    }
}

function loadPreference(): ThemePreference {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
    return 'system';
}

const initialPref = loadPreference();
const initialResolved = resolveTheme(initialPref);
applyThemeClass(initialResolved);

export const useThemeStore = create<ThemeState>((set) => ({
    preference: initialPref,
    resolved: initialResolved,
    setTheme: (pref) => {
        const resolved = resolveTheme(pref);
        localStorage.setItem(STORAGE_KEY, pref);
        applyThemeClass(resolved);
        set({ preference: pref, resolved });
    },
    toggleTheme: () =>
        set((state) => {
            const next: ResolvedTheme = state.resolved === 'light' ? 'dark' : 'light';
            localStorage.setItem(STORAGE_KEY, next);
            applyThemeClass(next);
            return { preference: next, resolved: next };
        }),
}));
