import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export function ThemeToggle() {
    const { resolved, toggleTheme } = useThemeStore();
    const { t } = useTranslation('common');
    const isDark = resolved === 'dark';

    return (
        <div className="flex flex-col items-center group">
            <button
                type="button"
                onClick={toggleTheme}
                className={cn(
                    'relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gray-50 dark:bg-white/10 text-muted-foreground transition-all duration-300 shadow-sm border border-transparent outline-none',
                    'group-hover:text-[var(--brand-primary)] group-hover:bg-[var(--brand-primary-subtle)] group-hover:border-[var(--brand-primary-light)]',
                    'focus:ring-2 focus:ring-[var(--brand-primary)]/20',
                )}
                aria-label={isDark ? t('theme.switchToLight', 'Gündüz moduna geç') : t('theme.switchToDark', 'Gece moduna geç')}
            >
                {isDark ? (
                    <Sun className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                ) : (
                    <Moon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                )}
            </button>
            <span className="text-[11px] sm:text-[11px] font-bold text-muted-foreground group-hover:text-[var(--brand-primary)] mt-[2px] sm:mt-1 transition-colors">
                {isDark ? t('theme.light', 'Gündüz') : t('theme.dark', 'Gece')}
            </span>
        </div>
    );
}
