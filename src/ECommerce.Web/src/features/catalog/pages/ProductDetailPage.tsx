import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { formatPrice } from '../../../utils/formatters';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { ErrorMessage } from '../../../components/shared/ErrorMessage';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ArrowLeft } from 'lucide-react';
import { AddToBasketButton } from '../../basket/components/AddToBasketButton';

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // id should always be present from the route, but TS needs us to handle the potential undefined case
    const safeId = id || '';

    const { data: product, isLoading, error, refetch } = useProduct(safeId);

    const handleBack = () => {
        navigate('/products');
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[50vh]">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-500 font-medium">Loading product details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-2xl">
                <button
                    onClick={handleBack}
                    className="mb-8 flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to products
                </button>
                <ErrorMessage
                    message={error instanceof Error ? error.message : "Failed to load product details. Please try again."}
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-2xl">
                <button
                    onClick={handleBack}
                    className="mb-8 flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to products
                </button>
                <EmptyState
                    title="Product not found"
                    description="The product you're looking for doesn't exist or has been removed."
                />
            </div>
        );
    }

    const inStock = product.stockQuantity > 0;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <button
                onClick={handleBack}
                className="mb-8 flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to products
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Image Gallery Area */}
                    <div className="md:w-1/2 p-8 md:p-12 bg-gray-50 flex items-center justify-center md:border-r border-gray-100 min-h-[400px]">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="max-w-full h-auto object-contain max-h-[500px] hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400">
                                <svg className="h-24 w-24 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-lg font-medium">No image available</span>
                            </div>
                        )}
                    </div>

                    {/* Product Info Area */}
                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
                        <div className="mb-2">
                            <span className="text-sm font-bold tracking-wider text-blue-600 uppercase">
                                {product.categoryName}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {product.name}
                        </h1>

                        <div className="flex items-end mb-6">
                            <span className="text-3xl font-extrabold text-gray-900">
                                {formatPrice(product.price, product.currency)}
                            </span>
                        </div>

                        <div className="mb-6 flex items-center space-x-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                <span className={`w-2 h-2 rounded-full mr-2 ${inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                {inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                            {inStock && (
                                <span className="text-sm font-medium text-gray-500 border border-gray-200 py-1 px-3 rounded-full">
                                    {product.stockQuantity} available
                                </span>
                            )}
                        </div>

                        <div className="prose prose-sm md:prose-base text-gray-600 max-w-none mb-8 flex-1">
                            <p className="leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        <div className="pt-6 border-t border-gray-100 mt-auto">
                            <AddToBasketButton productId={product.id} disabled={!inStock} />
                            <p className="text-xs text-center text-gray-400 mt-4">
                                Free shipping on orders over $50
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
