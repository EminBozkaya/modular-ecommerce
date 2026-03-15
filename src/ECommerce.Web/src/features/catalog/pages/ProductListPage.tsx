import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductSearchBar } from '../components/ProductSearchBar';
import { CategoryFilter } from '../components/CategoryFilter';
import { ProductGrid } from '../components/ProductGrid';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { ErrorMessage } from '../../../components/shared/ErrorMessage';
import { EmptyState } from '../../../components/shared/EmptyState';
import { useTranslation } from 'react-i18next';

export default function ProductListPage() {
    const { t } = useTranslation('catalog');
    const { t: tc } = useTranslation('common');
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize state from URL params
    const initialSearch = searchParams.get('search') || '';
    const initialCategoryId = searchParams.get('categoryId') || undefined;

    const [search, setSearch] = useState(initialSearch);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(initialCategoryId);
    const [page, setPage] = useState(1);
    const pageSize = 8;

    // Keep local state in sync if URL parameters change externally
    // (e.g. user uses the header search bar while already on the products page)
    useEffect(() => {
        const urlSearch = searchParams.get('search') || '';
        const urlCategoryId = searchParams.get('categoryId') || undefined;

        if (urlSearch !== search) {
            setSearch(urlSearch);
            setPage(1);
        }
        if (urlCategoryId !== selectedCategoryId) {
            setSelectedCategoryId(urlCategoryId);
            setPage(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const { data: result, isLoading, error, refetch } = useProducts({
        page,
        pageSize,
        categoryId: selectedCategoryId,
        search,
    });

    const handleSearchChange = (newSearch: string) => {
        setSearch(newSearch);
        setPage(1); // Reset to first page on new search
        setSearchParams(prev => {
            if (newSearch) {
                prev.set('search', newSearch);
            } else {
                prev.delete('search');
            }
            return prev;
        });
    };

    const handleCategorySelect = (categoryId: string | undefined) => {
        setSelectedCategoryId(categoryId);
        setPage(1); // Reset to first page on category change
        setSearchParams(prev => {
            if (categoryId) {
                prev.set('categoryId', categoryId);
            } else {
                prev.delete('categoryId');
            }
            return prev;
        });
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(p => p - 1);
    };

    const handleNextPage = () => {
        if (result && page * pageSize < result.totalCount) {
            setPage(p => p + 1);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-serif">{t('list.title')}</h1>
                <ProductSearchBar value={search} onChange={handleSearchChange} />
            </div>

            <CategoryFilter
                selectedCategoryId={selectedCategoryId}
                onSelect={handleCategorySelect}
            />

            {isLoading && (
                <div className="flex flex-col items-center justify-center py-20">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-gray-500 font-medium font-serif">{t('list.loading')}</p>
                </div>
            )}

            {!isLoading && error && (
                <div className="py-12">
                    <ErrorMessage
                        message={error instanceof Error ? error.message : t('list.loadError')}
                        onRetry={() => refetch()}
                    />
                </div>
            )}

            {!isLoading && !error && result && !Array.isArray(result.items) && (
                <div className="py-12">
                    <ErrorMessage
                        message="Invalid data format received from the server. Please check the API response."
                        onRetry={() => refetch()}
                    />
                </div>
            )}

            {!isLoading && !error && result && Array.isArray(result.items) && result.items.length === 0 && (
                <div className="py-12">
                    <EmptyState
                        title={t('list.empty')}
                        description={t('list.emptyDesc')}
                    />
                </div>
            )}

            {!isLoading && !error && result && Array.isArray(result.items) && result.items.length > 0 && (
                <>
                    <ProductGrid products={result.items} />

                    {result.totalCount > pageSize && (
                        <div className="mt-12 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={page === 1}
                                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {tc('pagination.prev')}
                                </button>
                                <button
                                    onClick={handleNextPage}
                                    disabled={page * pageSize >= result.totalCount}
                                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {tc('pagination.next')}
                                </button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        {t('list.showing', { count: result.totalCount, start: (page - 1) * pageSize + 1, end: Math.min(page * pageSize, result.totalCount) })}
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        <button
                                            onClick={handlePrevPage}
                                            disabled={page === 1}
                                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="sr-only">{tc('pagination.prev')}</span>
                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                                            {tc('pagination.page', { page })}
                                        </span>
                                        <button
                                            onClick={handleNextPage}
                                            disabled={page * pageSize >= result.totalCount}
                                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="sr-only">{tc('pagination.next')}</span>
                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
