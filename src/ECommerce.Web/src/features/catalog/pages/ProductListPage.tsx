import { useRef, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInfiniteProducts } from '../hooks/useInfiniteProducts';
import { useCategories } from '../hooks/useCategories';
import { ProductSearchBar } from '../components/ProductSearchBar';
import { CategoryBreadcrumb } from '../components/CategoryBreadcrumb';
import { ProductGrid } from '../components/ProductGrid';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { ErrorMessage } from '../../../components/shared/ErrorMessage';
import { EmptyState } from '../../../components/shared/EmptyState';
import { useTranslation } from 'react-i18next';

export default function ProductListPage() {
    const { t } = useTranslation('catalog');
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize state from URL params
    const initialSearch = searchParams.get('search') || '';
    const initialCategoryId = searchParams.get('categoryId') || undefined;

    const [search, setSearch] = useState(initialSearch);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(initialCategoryId);
    const pageSize = 20;
    const observerTarget = useRef<HTMLDivElement>(null);

    // Keep local state in sync if URL parameters change externally
    // (e.g. user uses the header search bar while already on the products page)
    useEffect(() => {
        const urlSearch = searchParams.get('search') || '';
        const urlCategoryId = searchParams.get('categoryId') || undefined;

        if (urlSearch !== search) {
            setSearch(urlSearch);
        }
        if (urlCategoryId !== selectedCategoryId) {
            setSelectedCategoryId(urlCategoryId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const { 
        data: infiniteData, 
        isLoading, 
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        error, 
        refetch 
    } = useInfiniteProducts({
        pageSize,
        categoryId: selectedCategoryId,
        search,
    });

    // Flatten all pages into a single array of products
    const products = useMemo(() => {
        return infiniteData?.pages.flatMap(page => page.items) || [];
    }, [infiniteData]);

    const totalCount = infiniteData?.pages[0]?.totalCount || 0;

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const { data: categories } = useCategories();

    const handleSearchChange = (newSearch: string) => {
        setSearch(newSearch);
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
        setSearchParams(prev => {
            if (categoryId) {
                prev.set('categoryId', categoryId);
            } else {
                prev.delete('categoryId');
            }
            return prev;
        });
    };

    const selectedCategory = categories?.find(c => c.id === selectedCategoryId);
    const pageTitle = selectedCategory ? selectedCategory.name : t('list.title');

    return (
        <div className="container mx-auto px-4 py-8">
            <CategoryBreadcrumb 
                categories={categories || []} 
                selectedCategoryId={selectedCategoryId} 
                onSelect={handleCategorySelect} 
            />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground font-serif">{pageTitle}</h1>
                <ProductSearchBar value={search} onChange={handleSearchChange} />
            </div>

            {isLoading && (
                <div className="flex flex-col items-center justify-center py-20">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-muted-foreground font-medium font-serif">{t('list.loading')}</p>
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

            {!isLoading && !error && products && !Array.isArray(products) && (
                <div className="py-12">
                    <ErrorMessage
                        message="Invalid data format received from the server. Please check the API response."
                        onRetry={() => refetch()}
                    />
                </div>
            )}

            {!isLoading && !error && products && Array.isArray(products) && products.length === 0 && (
                <div className="py-12">
                    <EmptyState
                        title={t('list.empty')}
                        description={t('list.emptyDesc')}
                    />
                </div>
            )}

            {!isLoading && !error && products && Array.isArray(products) && products.length > 0 && (
                <>
                    <div className="mb-4 text-sm text-muted-foreground font-medium">
                        {t('list.showingCount', { count: products.length, total: totalCount })}
                    </div>
                    
                    <ProductGrid products={products} />

                    {/* Infinite Scroll Trigger */}
                    <div ref={observerTarget} className="mt-8 py-4 flex justify-center">
                        {isFetchingNextPage && (
                            <div className="flex flex-col items-center">
                                <LoadingSpinner size="md" />
                                <p className="mt-2 text-sm text-muted-foreground">{t('list.loadingMore', { defaultValue: 'Daha fazla ürün yükleniyor...' })}</p>
                            </div>
                        )}
                        {!hasNextPage && products.length > 0 && (
                            <p className="text-sm text-muted-foreground font-medium">{t('list.allLoaded', { defaultValue: 'Tüm ürünler listelendi.' })}</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
