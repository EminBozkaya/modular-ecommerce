import { useCategories } from '../hooks/useCategories';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { ErrorMessage } from '../../../components/shared/ErrorMessage';

interface CategoryFilterProps {
    selectedCategoryId: string | undefined;
    onSelect: (id: string | undefined) => void;
}

export function CategoryFilter({ selectedCategoryId, onSelect }: CategoryFilterProps) {
    const { data: categories, isLoading, error, refetch } = useCategories();

    if (isLoading) {
        return (
            <div className="flex items-center py-2 mb-6">
                <LoadingSpinner size="sm" />
                <span className="ml-2 text-sm text-gray-500 font-medium font-serif">Kategoriler yükleniyor...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mb-6">
                <ErrorMessage
                    message="Kategoriler yüklenemedi"
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Category filters">
            <button
                role="tab"
                aria-selected={selectedCategoryId === undefined}
                onClick={() => onSelect(undefined)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-sm border ${selectedCategoryId === undefined
                    ? 'bg-[var(--color-ebrar-green)] text-white border-[var(--color-ebrar-green-dark)]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[var(--color-ebrar-green)] hover:text-[var(--color-ebrar-green)]'
                    }`}
            >
                Tümü
            </button>
            {categories?.map((category) => (
                <button
                    key={category.id}
                    role="tab"
                    aria-selected={selectedCategoryId === category.id}
                    onClick={() => onSelect(category.id)}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-sm border ${selectedCategoryId === category.id
                        ? 'bg-[var(--color-ebrar-green)] text-white border-[var(--color-ebrar-green-dark)]'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-[var(--color-ebrar-green)] hover:text-[var(--color-ebrar-green)]'
                        }`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}
