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
                <span className="ml-2 text-sm text-gray-500">Loading categories...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mb-6">
                <ErrorMessage
                    message="Failed to load categories"
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategoryId === undefined
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
            >
                All
            </button>
            {categories?.map((category) => (
                <button
                    key={category.id}
                    role="tab"
                    aria-selected={selectedCategoryId === category.id}
                    onClick={() => onSelect(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategoryId === category.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}
