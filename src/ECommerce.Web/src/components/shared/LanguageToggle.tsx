import { useLanguage } from '@/hooks/useLanguage';
import { useLanguageConfig } from '@/hooks/useLanguageConfig';
import { useTranslation } from 'react-i18next';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { SUPPORTED_LANGUAGES, type LanguageCode } from '@/i18n/languages';

export function LanguageToggle() {
    const { currentLanguage, changeLanguage } = useLanguage();
    const { languages } = useLanguageConfig();
    const { t } = useTranslation('common');

    const activeLanguage =
        languages.find((l) => l.code === currentLanguage) ??
        SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) ??
        languages[0];

    return (
        <div className="flex flex-col items-center group relative">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        id="language-dropdown-trigger"
                        className={cn(
                            "relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gray-50 dark:bg-white/10 text-muted-foreground transition-all duration-300 shadow-sm border border-transparent outline-none",
                            "group-hover:text-[var(--brand-primary)] group-hover:bg-[var(--brand-primary-subtle)] group-hover:border-[var(--brand-primary-light)]",
                            "focus:ring-2 focus:ring-[var(--brand-primary)]/20"
                        )}
                        aria-label={t('language.changeLanguage')}
                    >
                        <span className="text-[17px] sm:text-xl leading-none pointer-events-none transition-transform duration-300 group-hover:scale-110">
                            {activeLanguage.flag}
                        </span>
                        <div className="absolute -bottom-1 -right-1 bg-card rounded-full p-[1px] sm:p-0.5 shadow-sm border border-border opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronDown className="h-2.5 w-2.5 text-muted-foreground" />
                        </div>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 bg-card p-1 z-[100] shadow-xl border-border">
                    {languages.map((lang) => (
                        <DropdownMenuItem
                            key={lang.code}
                            onSelect={() => changeLanguage(lang.code as LanguageCode)}
                            className={cn(
                                "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-xs font-medium transition-colors hover:bg-accent",
                                currentLanguage === lang.code && "bg-[var(--brand-primary-subtle)] font-bold text-[var(--brand-primary)]"
                            )}
                        >
                            <span className="text-lg leading-none">{lang.flag}</span>
                            <span className="flex-1 uppercase">{lang.code}</span>
                            <span className="text-[10px] text-muted-foreground font-normal">{lang.label}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-[11px] sm:text-[11px] font-bold text-muted-foreground group-hover:text-[var(--brand-primary)] mt-[2px] sm:mt-1 transition-colors uppercase">
                {activeLanguage.code}
            </span>
        </div>
    );
}
