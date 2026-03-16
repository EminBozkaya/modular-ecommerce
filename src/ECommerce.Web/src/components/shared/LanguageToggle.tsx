import { useLanguage } from '@/hooks/useLanguage';
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
    const { t } = useTranslation('common');

    const activeLanguage = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) ?? SUPPORTED_LANGUAGES[0];

    return (
        <div className="flex flex-col items-center group relative">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        id="language-dropdown-trigger"
                        className={cn(
                            "relative flex items-center justify-center w-11 h-11 rounded-full bg-gray-50 text-muted-foreground transition-all duration-300 shadow-sm border border-transparent outline-none",
                            "group-hover:text-[var(--color-ebrar-green)] group-hover:bg-green-50 group-hover:border-green-100",
                            "focus:ring-2 focus:ring-[var(--color-ebrar-green)]/20"
                        )}
                        aria-label={t('language.changeLanguage')}
                    >
                        <span className="text-xl leading-none pointer-events-none transition-transform duration-300 group-hover:scale-110">
                            {activeLanguage.flag}
                        </span>
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronDown className="h-2.5 w-2.5 text-gray-400" />
                        </div>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 bg-white p-1 z-[100] shadow-xl border-gray-100">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                        <DropdownMenuItem
                            key={lang.code}
                            onSelect={() => changeLanguage(lang.code as LanguageCode)}
                            className={cn(
                                "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-xs font-medium transition-colors hover:bg-gray-100",
                                currentLanguage === lang.code && "bg-green-50 font-bold text-[var(--color-ebrar-green)]"
                            )}
                        >
                            <span className="text-lg leading-none">{lang.flag}</span>
                            <span className="flex-1 uppercase">{lang.code}</span>
                            <span className="text-[10px] text-gray-400 font-normal">{lang.label}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-[11px] font-bold text-muted-foreground group-hover:text-[var(--color-ebrar-green)] mt-1 transition-colors uppercase">
                {activeLanguage.code}
            </span>
        </div>
    );
}
