import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface ProductSearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export function ProductSearchBar({ value, onChange }: ProductSearchBarProps) {
    const { t } = useTranslation('catalog');
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputValue !== value) {
                onChange(inputValue);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [inputValue, onChange, value]);

    return (
        <div className="relative max-w-md w-full mb-6">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-20">
                <svg className="h-5 w-5 text-[var(--brand-primary)] opacity-70" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </div>
            <input
                type="text"
                className="block w-full rounded-xl border-0 py-3 pl-11 pr-4 text-foreground bg-background ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-[var(--brand-primary)] sm:text-sm sm:leading-6 shadow-md shadow-black/5 transition-all duration-300 hover:ring-border"
                placeholder={t('list.categorySearchPlaceholder')}
                aria-label={t('list.searchAriaLabel')}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
        </div>
    );
}
