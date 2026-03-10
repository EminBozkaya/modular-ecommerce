import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { useProducts } from '@/features/catalog/hooks/useProducts';

export function HeaderSearchAutocomplete() {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const { data: result, isLoading, isError } = useProducts({
        search: debouncedQuery,
        pageSize: 5 // We only need a few results for autocomplete
    });

    const products = Array.isArray(result?.items) ? result.items : [];

    // Open dropdown when user types
    useEffect(() => {
        if (searchQuery.trim().length > 0) {
            setIsDropdownOpen(true);
        } else {
            setIsDropdownOpen(false);
        }
    }, [searchQuery]);

    const handleSearchSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsDropdownOpen(false);
        }
    };

    const handleProductClick = (productId: string) => {
        navigate(`/products/${productId}`);
        setIsDropdownOpen(false);
        setSearchQuery('');
    };

    return (
        <div className="relative w-full max-w-xl mb-3" ref={dropdownRef}>
            <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="flex items-center border border-border rounded-md overflow-hidden bg-white shadow-sm relative z-10 transition-colors focus-within:ring-2 focus-within:ring-[var(--color-ebrar-green)] focus-within:border-[var(--color-ebrar-green)]">
                    <input
                        type="text"
                        placeholder="Premium ürünlerimizde arayın..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => {
                            if (searchQuery.trim().length > 0) setIsDropdownOpen(true);
                        }}
                        className="flex-1 px-4 h-10 text-sm outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
                    />
                    <button
                        type="submit"
                        className="h-10 w-10 flex items-center justify-center bg-[var(--color-ebrar-green)] hover:bg-[var(--color-ebrar-green-dark)] text-white transition-colors"
                    >
                        {isLoading && debouncedQuery !== searchQuery ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Search className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </form>

            {/* Dropdown Results */}
            {isDropdownOpen && debouncedQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {isLoading ? (
                        <div className="p-4 flex items-center justify-center text-muted-foreground gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="text-sm font-medium">Aranıyor...</span>
                        </div>
                    ) : isError ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            Arama sırasında bir hata oluştu.
                        </div>
                    ) : products.length > 0 ? (
                        <div>
                            <div className="py-2">
                                {products.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => handleProductClick(product.id)}
                                        className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                                    >
                                        <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                                            {product.imageUrl ? (
                                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xs text-gray-400">Görsel Yok</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-foreground truncate">{product.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{product.categoryName}</p>
                                        </div>
                                        <div className="font-bold text-sm text-[var(--color-ebrar-green)]">
                                            {(product.priceAmount ?? product.price ?? 0).toLocaleString('tr-TR')} {product.priceCurrency ?? product.currency ?? '₺'}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-border p-2 bg-gray-50 flex justify-center">
                                <button
                                    onClick={() => handleSearchSubmit()}
                                    className="text-sm font-semibold text-[var(--color-ebrar-green)] hover:text-[var(--color-ebrar-green-dark)] py-1.5 px-4 transition-colors"
                                >
                                    Tüm "{debouncedQuery}" sonuçlarını gör ({result?.totalCount})
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 flex flex-col items-center justify-center text-center text-muted-foreground">
                            <Search className="h-8 w-8 mb-2 opacity-20" />
                            <p className="text-sm font-medium">"{debouncedQuery}" için sonuç bulunamadı.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
