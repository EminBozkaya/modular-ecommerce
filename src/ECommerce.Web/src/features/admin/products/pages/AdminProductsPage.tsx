import { useState, useEffect, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
    type ColDef,
    type GridReadyEvent,
    type GridApi,
    ModuleRegistry,
    ClientSideRowModelModule,
    TextFilterModule,
    NumberFilterModule,
    PaginationModule,
    ValidationModule,
    ColumnAutoSizeModule,
    RowApiModule,
    CellStyleModule,
    RowSelectionModule,
} from 'ag-grid-community';
import { Plus, Download, FileDown, Package } from 'lucide-react';
import { getProducts, getCategories } from '../../../catalog/api/catalogApi';
import { createProduct, updateProduct, deleteProduct } from '../../api/adminApi';
import type { Product, Category } from '../../../catalog/types/product';
import type { ProductFormData } from '../components/ProductFormModal';
import ProductFormModal from '../components/ProductFormModal';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Register AG Grid modules
ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    TextFilterModule,
    NumberFilterModule,
    PaginationModule,
    ValidationModule,
    ColumnAutoSizeModule,
    RowApiModule,
    CellStyleModule,
    RowSelectionModule,
]);

export default function AdminProductsPage() {
    const gridRef = useRef<AgGridReact>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [saving, setSaving] = useState(false);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [prodResult, cats] = await Promise.all([
                getProducts({ page: 1, pageSize: 1000 }),
                getCategories(),
            ]);
            setProducts(prodResult.items);
            setCategories(cats);
        } catch (err) {
            console.error('Veri yüklenirken hata:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onGridReady = (params: GridReadyEvent) => {
        setGridApi(params.api);
        params.api.sizeColumnsToFit();
    };

    const columnDefs: ColDef<Product>[] = [
        {
            headerName: 'Ürün Adı',
            field: 'name',
            filter: 'agTextColumnFilter',
            sortable: true,
            flex: 2,
            minWidth: 180,
        },
        {
            headerName: 'Açıklama',
            field: 'description',
            filter: 'agTextColumnFilter',
            sortable: true,
            flex: 2,
            minWidth: 200,
        },
        {
            headerName: 'Fiyat (₺)',
            field: 'price',
            filter: 'agNumberColumnFilter',
            sortable: true,
            width: 120,
            valueFormatter: (params) =>
                params.value != null ? `₺${Number(params.value).toFixed(2)}` : '',
        },
        {
            headerName: 'Stok',
            field: 'stockQuantity',
            filter: 'agNumberColumnFilter',
            sortable: true,
            width: 100,
            cellStyle: (params) => {
                if (params.value === 0) return { color: '#dc2626', fontWeight: '600' };
                if (params.value < 10) return { color: '#f59e0b', fontWeight: '600' };
                return { color: '#16a34a', fontWeight: '400' };
            },
        },
        {
            headerName: 'Kategori',
            field: 'categoryName',
            filter: 'agTextColumnFilter',
            sortable: true,
            width: 150,
        },
        {
            headerName: 'Durum',
            field: 'isActive',
            sortable: true,
            width: 100,
            cellRenderer: (params: { value: boolean }) => {
                return params.value ? (
                    <span style={{ color: '#16a34a', fontWeight: '600' }}>Aktif</span>
                ) : (
                    <span style={{ color: '#dc2626', fontWeight: '600' }}>Pasif</span>
                );
            },
        },
        {
            headerName: 'İşlemler',
            field: 'id',
            sortable: false,
            filter: false,
            width: 120,
            cellRenderer: (params: { data: Product }) => {
                if (!params.data) return null;
                return (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', height: '100%' }}>
                        <button
                            title="Düzenle"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(params.data);
                            }}
                            className="p-1 rounded-md transition-colors hover:bg-green-50"
                            style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B5E3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                <path d="m15 5 4 4" />
                            </svg>
                        </button>
                        <button
                            title="Sil"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(params.data.id);
                            }}
                            className="p-1 rounded-md transition-colors hover:bg-red-50"
                            style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                        </button>
                    </div>
                );
            },
        },
    ];

    // ── CRUD Handlers ──
    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
        try {
            await deleteProduct(id);
            await fetchData();
        } catch (err) {
            console.error('Ürün silinirken hata:', err);
            alert('Ürün silinirken bir hata oluştu.');
        }
    };

    const handleFormSubmit = async (data: ProductFormData) => {
        setSaving(true);
        try {
            if (editingProduct) {
                await updateProduct({
                    id: editingProduct.id,
                    name: data.name,
                    description: data.description || undefined,
                    imageUrl: data.imageUrl || undefined,
                    price: data.price,
                    currency: data.currency,
                    categoryId: data.categoryId,
                });
            } else {
                await createProduct({
                    name: data.name,
                    description: data.description || undefined,
                    imageUrl: data.imageUrl || undefined,
                    price: data.price,
                    currency: data.currency,
                    stockQuantity: data.stockQuantity,
                    categoryId: data.categoryId,
                });
            }
            setModalOpen(false);
            setEditingProduct(null);
            await fetchData();
        } catch (err) {
            console.error('Ürün kaydedilirken hata:', err);
            alert('Ürün kaydedilirken bir hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    // ── Export Handlers ──
    const exportToExcel = () => {
        const data = products.map((p) => ({
            'Ürün Adı': p.name,
            'Açıklama': p.description,
            'Fiyat (₺)': p.price,
            'Stok': p.stockQuantity,
            'Kategori': p.categoryName,
            'Durum': p.isActive ? 'Aktif' : 'Pasif',
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Ürünler');
        XLSX.writeFile(wb, 'urunler.xlsx');
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('Ürün Listesi', 14, 20);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 14, 28);

        const tableData = products.map((p) => [
            p.name,
            `${p.price.toFixed(2)} TL`,
            String(p.stockQuantity),
            p.categoryName,
            p.isActive ? 'Aktif' : 'Pasif',
        ]);

        (doc as jsPDF & { autoTable: (options: Record<string, unknown>) => void }).autoTable({
            startY: 35,
            head: [['Ürün Adı', 'Fiyat', 'Stok', 'Kategori', 'Durum']],
            body: tableData,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [27, 94, 63] },
        });

        doc.save('urunler.pdf');
    };

    return (
        <div>
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: '#ecfdf5' }}
                    >
                        <Package className="h-5 w-5" style={{ color: '#1B5E3F' }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: '#1B5E3F' }}>Ürünler</h1>
                        <p className="text-sm text-gray-500">
                            Toplam {products.length} ürün kayıtlı
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={exportToExcel}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Excel
                    </button>
                    <button
                        onClick={exportToPDF}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <FileDown className="h-4 w-4" />
                        PDF
                    </button>
                    <button
                        onClick={() => {
                            setEditingProduct(null);
                            setModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                        style={{ background: '#1B5E3F' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#164A32')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#1B5E3F')}
                    >
                        <Plus className="h-4 w-4" />
                        Yeni Ürün Ekle
                    </button>
                </div>
            </div>

            {/* AG Grid Table */}
            <div
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                style={{ border: '1px solid #e5e7eb' }}
            >
                <div style={{ height: 'calc(100vh - 260px)', width: '100%' }}>
                    <AgGridReact<Product>
                        ref={gridRef}
                        rowData={products}
                        columnDefs={columnDefs}
                        onGridReady={onGridReady}
                        pagination={true}
                        paginationPageSize={20}
                        paginationPageSizeSelector={[10, 20, 50, 100]}
                        loading={loading}
                        animateRows={true}
                        rowSelection={{ mode: 'singleRow' }}
                        defaultColDef={{
                            resizable: true,
                            floatingFilter: true,
                        }}
                        overlayNoRowsTemplate="<span style='padding:10px;color:#6b7280'>Henüz ürün bulunamadı.</span>"
                        overlayLoadingTemplate="<span style='padding:10px;color:#1B5E3F'>Ürünler yükleniyor...</span>"
                    />
                </div>
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between mt-3 px-1 text-xs text-gray-500">
                <span>Toplam kayıt: {products.length}</span>
                <span>
                    Gösterilen: {gridApi?.getDisplayedRowCount() ?? products.length} kayıt
                </span>
            </div>

            {/* Product Form Modal */}
            <ProductFormModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingProduct(null);
                }}
                onSubmit={handleFormSubmit}
                product={editingProduct}
                categories={categories}
                loading={saving}
            />
        </div>
    );
}
