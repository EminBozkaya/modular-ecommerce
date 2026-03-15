import { ChevronRight, Home, MoreHorizontal } from 'lucide-react';
import type { Category } from '../types/product';
import { useTranslation } from 'react-i18next';
import { useState, Fragment } from 'react';

interface CategoryBreadcrumbProps {
    categories: Category[];
    selectedCategoryId?: string;
    onSelect: (id: string | undefined) => void;
}

export function CategoryBreadcrumb({ categories, selectedCategoryId, onSelect }: CategoryBreadcrumbProps) {
    const { t } = useTranslation('common');
    const [isExpanded, setIsExpanded] = useState(false);

    const path: Category[] = [];
    let currentId: string | null | undefined = selectedCategoryId;

    // Build path from child to root
    while (currentId) {
        const category = categories.find(c => c.id === currentId);
        if (category) {
            path.unshift(category);
            currentId = category.parentCategoryId;
        } else {
            break;
        }
    }

    // Logic for truncation: If path is long and not expanded, hide middle items
    const MAX_VISIBLE_LENGTH = 3;
    const shouldTruncate = path.length > MAX_VISIBLE_LENGTH && !isExpanded;
    
    // If truncated, show: [First, Ellipsis, Last - 1, Last]
    // Otherwise show all [Full Path]
    const displayPath = shouldTruncate 
        ? [path[0], ...path.slice(-2)] // Show first item and last two
        : path;

    return (
        <nav className="relative flex mb-6 items-center group/nav w-full" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-1 md:space-x-1.5 whitespace-nowrap overflow-x-auto no-scrollbar py-1 w-full">
                {/* 1. Home Link */}
                <li className="inline-flex items-center">
                    <button
                        onClick={() => onSelect(undefined)}
                        className="inline-flex items-center text-xs md:text-[13px] font-medium text-gray-500 hover:text-[var(--color-ebrar-green)] transition-all duration-200 cursor-pointer group"
                    >
                        <Home className="w-3.5 h-3.5 mr-1.5 transition-transform group-hover:scale-110" />
                        <span className="hidden sm:inline">{t('nav.home')}</span>
                    </button>
                </li>
                
                {/* 2. Root Products Link */}
                <li className="flex items-center">
                    <ChevronRight className="w-4 h-4 text-gray-300 mx-0.5 md:mx-1 flex-shrink-0" />
                    <button
                        onClick={() => onSelect(undefined)}
                        className={`text-xs md:text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                            !selectedCategoryId 
                            ? 'text-[var(--color-ebrar-green)] font-bold' 
                            : 'text-gray-500 hover:text-[var(--color-ebrar-green)]'
                        }`}
                    >
                        {t('nav.products')}
                    </button>
                </li>

                {/* 3. Dynamic Category Path */}
                {displayPath.map((cat, index) => {
                    const isLast = index === displayPath.length - 1;
                    const isFirstInDisplay = index === 0;
                    
                    return (
                        <Fragment key={cat.id}>
                            <li className="flex items-center">
                                <ChevronRight className="w-4 h-4 text-gray-300 mx-0.5 md:mx-1 flex-shrink-0" />
                                <button
                                    onClick={() => onSelect(cat.id)}
                                    disabled={isLast}
                                    className={`text-xs md:text-[13px] font-medium transition-all duration-200 ${
                                        isLast 
                                        ? 'text-[var(--color-ebrar-green)] font-bold cursor-default' 
                                        : 'text-gray-500 hover:text-[var(--color-ebrar-green)] cursor-pointer'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            </li>

                            {/* Insert Ellipsis if truncated and we just showed the first visible path item */}
                            {shouldTruncate && isFirstInDisplay && (
                                <li className="flex items-center">
                                    <ChevronRight className="w-4 h-4 text-gray-300 mx-0.5 md:mx-1 flex-shrink-0" />
                                    <button 
                                        onClick={() => setIsExpanded(true)}
                                        className="p-1 hover:bg-gray-100 rounded-md transition-all duration-200 text-gray-400 hover:text-[var(--color-ebrar-green)] active:scale-90"
                                        title="Tüm yolu göster"
                                    >
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </li>
                            )}
                        </Fragment>
                    );
                })}
            </ol>

            {/* Subtle Gradient Shadow for Mobile Scroll Indication */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 md:hidden opacity-100" />
            
            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </nav>
    );
}
