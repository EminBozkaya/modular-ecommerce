import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useLanguageConfig } from '@/hooks/useLanguageConfig';
import type { TranslationsMap } from '@/features/admin/api/storeSettingsApi';

interface Props {
    value: string;
    onChange: (value: string) => void;
    translations?: TranslationsMap;
    field: string;
    onTranslationChange: (lang: string, field: string, value: string) => void;
    placeholder?: string;
    label?: string;
    className?: string;
    textarea?: boolean;
}

export function TranslatableInput({
    value,
    onChange,
    translations,
    field,
    onTranslationChange,
    placeholder,
    label,
    className = '',
    textarea = false
}: Props) {
    const { i18n } = useTranslation();
    const { languages } = useLanguageConfig();
    const [isOpen, setIsOpen] = useState(false);
    
    // Default active tab to current app language
    const currentLang = i18n.language.split('-')[0].toLowerCase();
    const [activeTab, setActiveTab] = useState(currentLang);
    
    // When main input changes, update the neutral fallback only.
    const handleMainChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    const handleTabChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onTranslationChange(activeTab, field, e.target.value);
    };

    const tabValue = translations?.[activeTab]?.[field] ?? '';

    const inputClasses = "w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-primary)]";
    const textareaClasses = "w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-primary)] min-h-[80px] resize-y";

    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && <label className="block text-xs font-medium text-foreground">{label}</label>}
            <div className="relative group">
                {textarea ? (
                    <textarea 
                        value={value} 
                        onChange={handleMainChange}
                        placeholder={placeholder}
                        className={`${textareaClasses} pr-8`} 
                        rows={3}
                    />
                ) : (
                    <input 
                        type="text" 
                        value={value} 
                        onChange={handleMainChange}
                        placeholder={placeholder}
                        className={`${inputClasses} pr-8`} 
                    />
                )}
                
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute right-2 top-1.5 p-1 text-gray-400 hover:text-[var(--brand-primary)] rounded-md transition-colors"
                    title="Çevirileri Yönet"
                >
                    <Globe size={16} className={isOpen ? 'text-[var(--brand-primary)]' : ''} />
                </button>
            </div>
            
            {isOpen && (
                <div className="mt-2 border border-border/60 rounded-lg p-2.5 bg-gray-50/50 shadow-inner">
                    <div className="flex border-b border-border/80 mb-3 overflow-x-auto pb-0 gap-1 px-0.5">
                        {languages.map(l => (
                            <button
                                key={l.code}
                                type="button"
                                onClick={() => setActiveTab(l.code)}
                                className={`text-[11px] min-w-[58px] justify-center px-2 py-2 border-b-2 border-t border-x whitespace-nowrap flex items-center transition-[background-color,color,border-color,box-shadow] duration-200 group/tab rounded-t-md ${
                                    activeTab === l.code
                                        ? 'border-b-[var(--brand-primary)] border-t-border/40 border-x-border/40 text-[var(--brand-primary)] font-bold bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.05)] z-10'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-white/40 opacity-70 hover:opacity-100'
                                }`}
                            >
                                <span className={`fi fi-${l.flagCode} mr-1.5 rounded-[1px] shadow-sm transition-transform duration-200 ${activeTab === l.code ? 'scale-110' : 'group-hover/tab:scale-105'}`} />
                                <span className="tracking-tight">{l.code.toUpperCase()}</span>
                            </button>
                        ))}
                    </div>
                    
                    <div className="pt-1">
                        {textarea ? (
                            <textarea
                                value={tabValue}
                                onChange={handleTabChange}
                                placeholder={`${activeTab.toUpperCase()} dili için çeviri...`}
                                className={textareaClasses}
                                rows={2}
                            />
                        ) : (
                            <input
                                type="text"
                                value={tabValue}
                                onChange={handleTabChange}
                                placeholder={`${activeTab.toUpperCase()} dili için çeviri...`}
                                className={inputClasses}
                            />
                        )}
                        <p className="text-[10px] text-muted-foreground mt-1.5">
                            Boş bırakılırsa ana kutudaki metin gösterilecektir.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
