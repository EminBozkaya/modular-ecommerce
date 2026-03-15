import { useNavigate } from 'react-router-dom';
import type { Product } from '../../catalog/types/product';

interface LowStockTableProps {
    products: Product[];
}

export function LowStockTable({ products }: LowStockTableProps) {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Düşük Stok Uyarıları</h3>
            {products.length === 0 ? (
                <p className="text-sm text-gray-500">Düşük stoklu ürün bulunmuyor.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-2 px-3 text-gray-500 font-medium">Ürün</th>
                                <th className="text-left py-2 px-3 text-gray-500 font-medium">Kategori</th>
                                <th className="text-right py-2 px-3 text-gray-500 font-medium">Stok</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => {
                                        if (!window.getSelection()?.toString()) {
                                            navigate('/admin/products');
                                        }
                                    }}
                                >
                                    <td className="py-2.5 px-3 font-medium text-gray-900">{product.name}</td>
                                    <td className="py-2.5 px-3 text-gray-600">{product.categoryName}</td>
                                    <td className="py-2.5 px-3 text-right">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                product.stockQuantity === 0
                                                    ? 'bg-red-100 text-red-700'
                                                    : product.stockQuantity <= 3
                                                      ? 'bg-orange-100 text-orange-700'
                                                      : 'bg-yellow-100 text-yellow-700'
                                            }`}
                                        >
                                            {product.stockQuantity}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
