import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
    DateFilterModule,
    LocaleModule,
    type ICellRendererParams,
    type ValueFormatterParams,
} from 'ag-grid-community';
import { Plus, Download, FileDown, Package, Edit2, Trash2, RotateCcw } from 'lucide-react';
import { getProducts, getCategories } from '../../../catalog/api/catalogApi';
import { createProduct, updateProduct, deleteProduct, restoreProduct } from '../../api/adminApi';
import type { Product, Category } from '../../../catalog/types/product';
import type { ProductFormData } from '../components/ProductFormModal';
import ProductFormModal from '../components/ProductFormModal';
import ConfirmModal from '../../components/ConfirmModal';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import AgGridDatePicker from '../../components/AgGridDatePicker';

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
    DateFilterModule,
    LocaleModule,
]);

const localeTextTr = {
    // Fill
    filterOoo: 'Filtrele...',
    applyFilter: 'Uygula',
    resetFilter: 'Sıfırla',
    clearFilter: 'Temizle',
    // Date Filter
    dateFormatOoo: 'dd.mm.yyyy',
    dateFilterPlaceholder: 'gg.aa.yyyy',
    before: 'Önce',
    after: 'Sonra',
    equals: 'Eşittir',
    notEqual: 'Eşit Değil',
    blank: 'Boş',
    notBlank: 'Dolu',
    // Number Filter & Text Filter
    contains: 'İçerir',
    notContains: 'İçermez',
    startsWith: 'İle Başlar',
    endsWith: 'İle Biter',
    // Header
    sortAscending: 'Artan Sıralama',
    sortDescending: 'Azalan Sıralama',
    columnAutoSize: 'Otomatik Genişlik',
    // Pagination
    page: 'Sayfa',
    more: 'Daha Fazla',
    to: '-',
    of: '/',
    next: 'Sonraki',
    last: 'Son',
    first: 'İlk',
    previous: 'Önceki',
    pageSizeSelectorLabel: 'Sayfa Boyutu:',
    loadingOoo: 'Yükleniyor...',
    noRowsToShow: 'Henüz kayıt bulunamadı.',
    // Months
    january: 'Ocak',
    february: 'Şubat',
    march: 'Mart',
    april: 'Nisan',
    may: 'Mayıs',
    june: 'Haziran',
    july: 'Temmuz',
    august: 'Ağustos',
    september: 'Eylül',
    october: 'Ekim',
    november: 'Kasım',
    december: 'Aralık',
    // Months Short
    jan: 'Oca',
    feb: 'Şub',
    mar: 'Mar',
    apr: 'Nis',
    mayShort: 'May',
    jun: 'Haz',
    jul: 'Tem',
    aug: 'Ağu',
    sep: 'Eyl',
    oct: 'Eki',
    nov: 'Kas',
    dec: 'Ara',
    // Days
    sunday: 'Pazar',
    monday: 'Pazartesi',
    tuesday: 'Salı',
    wednesday: 'Çarşamba',
    thursday: 'Perşembe',
    friday: 'Cuma',
    saturday: 'Cumartesi',
    // Days Short
    sun: 'Paz',
    mon: 'Pzt',
    tue: 'Sal',
    wed: 'Çar',
    thu: 'Per',
    fri: 'Cum',
    sat: 'Cmt',
    // Misc
    today: 'Bugün',
    clear: 'Temizle',
};

const dateComparator = (filterLocalDate: Date, cellValue: string) => {
    if (cellValue == null) return -1;
    const cellDate = new Date(cellValue);

    // Remove seconds and milliseconds for comparison if we want to match by minute
    const filterTime = new Date(filterLocalDate).setSeconds(0, 0);
    const cellTime = new Date(cellDate).setSeconds(0, 0);

    const result = (filterTime === cellTime) ? 0 : (cellTime < filterTime ? -1 : 1);

    console.log('DATE FILTER COMP (Products):', {
        filter: new Date(filterTime).toLocaleString(),
        cell: new Date(cellTime).toLocaleString(),
        result
    });

    return result;
};

export default function AdminProductsPage() {
    const gridRef = useRef<AgGridReact>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [saving, setSaving] = useState(false);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [showDeleted, setShowDeleted] = useState(false);

    const [modalSettings, setModalSettings] = useState<{
        open: boolean;
        title: string;
        message: string;
        confirmText: string;
        variant: 'danger' | 'warning' | 'info';
        showConfirm: boolean;
        productId: string | null;
        actionType: 'delete' | 'restore' | 'duplicate_archived';
    }>({
        open: false,
        title: '',
        message: '',
        confirmText: '',
        variant: 'danger',
        showConfirm: true,
        productId: null,
        actionType: 'delete'
    });

    const gridComponents = useMemo(() => ({
        agDateInput: AgGridDatePicker,
    }), []);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getProducts({
                page: 1,
                pageSize: 1000,
                includeInactive: true,
                includeDeleted: showDeleted
            });
            setProducts(data.items);
            const cats = await getCategories({ includeDeleted: showDeleted });
            setCategories(cats);
        } catch (err) {
            console.error('Veri yüklenirken hata:', err);
        } finally {
            setLoading(false);
        }
    }, [showDeleted]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onGridReady = (params: GridReadyEvent) => {
        setGridApi(params.api);
        params.api.sizeColumnsToFit();
    };

    // ── CRUD Handlers ──
    const handleEdit = useCallback((product: Product) => {
        setEditingProduct(product);
        setModalOpen(true);
    }, []);

    const handleConfirmDelete = async () => {
        const { productId, actionType } = modalSettings;
        if (!productId) return;

        setDeleting(true);
        try {
            if (actionType === 'restore' || actionType === 'duplicate_archived') {
                await restoreProduct(productId);
            } else {
                await deleteProduct(productId);
            }
            setModalSettings(prev => ({ ...prev, open: false, productId: null }));
            await fetchData();
        } catch (err) {
            console.error('İşlem sırasında hata:', err);
            alert('İşlem sırasında bir hata oluştu.');
        } finally {
            setDeleting(false);
        }
    };

    const handleRestore = useCallback((id: string) => {
        const product = products.find(p => p.id === id);
        if (!product) return;

        // Find the category of the product
        const category = categories.find(c => c.id === product.categoryId);
        const isCategoryDeleted = category?.isDeleted;

        if (isCategoryDeleted) {
            // Force category selection via Edit Modal
            setEditingProduct({
                ...product,
                categoryId: '', // Clear deleted category to force selection
                isActive: true // Default to active for restoration
            });
            setModalOpen(true);
        } else {
            // Normal restoration with confirmation
            setModalSettings({
                open: true,
                title: "Ürünü Geri Yükle",
                message: `"${product.name}" ürününü ve ilgili verilerini geri yüklemek istediğinizden emin misiniz?`,
                confirmText: "Geri Yükle",
                variant: "info",
                showConfirm: true,
                productId: id,
                actionType: 'restore'
            });
        }
    }, [products, categories]);

    // ── Column Definitions ──
    const columnDefs = useMemo<ColDef<Product>[]>(() => [
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
            field: 'priceAmount',
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
            cellRenderer: (params: ICellRendererParams<Product, boolean>) => {
                if (params.data?.isDeleted) {
                    return <span style={{ color: '#94a3b8', fontWeight: '600' }}>Silinmiş</span>;
                }
                return params.value ? (
                    <span style={{ color: '#16a34a', fontWeight: '600' }}>Aktif</span>
                ) : (
                    <span style={{ color: '#dc2626', fontWeight: '600' }}>Pasif</span>
                );
            },
        },
        {
            headerName: 'Oluşturulma Tarihi',
            field: 'createdAt',
            sortable: true,
            filter: false,
            width: 180,
            valueFormatter: (params: ValueFormatterParams<Product, string>) => {
                if (!params.value) return '';
                return new Intl.DateTimeFormat('tr-TR', {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit'
                }).format(new Date(params.value));
            }
        },
        {
            headerName: 'Oluşturan',
            field: 'createdBy',
            sortable: true,
            filter: 'agTextColumnFilter',
            width: 150,
        },
        {
            headerName: 'Güncellenme Tarihi',
            field: 'updatedAt',
            sortable: true,
            filter: false,
            width: 180,
            valueFormatter: (params: ValueFormatterParams<Product, string>) => {
                if (!params.value) return '';
                return new Intl.DateTimeFormat('tr-TR', {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit'
                }).format(new Date(params.value));
            }
        },
        {
            headerName: 'Güncelleyen',
            field: 'updatedBy',
            sortable: true,
            filter: 'agTextColumnFilter',
            width: 150,
        },
        {
            headerName: 'Silinme Tarihi',
            field: 'deletedAt',
            sortable: true,
            filter: false,
            width: 180,
            hide: true,
            valueFormatter: (params: ValueFormatterParams<Product, string>) => {
                if (!params.value) return '';
                return new Intl.DateTimeFormat('tr-TR', {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit'
                }).format(new Date(params.value));
            }
        },
        {
            headerName: 'İşlemler',
            field: 'id',
            sortable: false,
            filter: false,
            width: 120,
            cellRenderer: (params: ICellRendererParams<Product, string>) => {
                if (!params.data) return null;
                const isDeleted = params.data.isDeleted;
                return (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', height: '100%' }}>
                        {!isDeleted ? (
                            <>
                                <button
                                    title="Düzenle"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(params.data!);
                                    }}
                                    className="p-1 rounded-md transition-colors hover:bg-green-50"
                                    style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}
                                >
                                    <Edit2 size={16} color="#1B5E3F" />
                                </button>
                                <button
                                    title="Sil"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const productId = params.data!.id;
                                        setModalSettings({
                                            open: true,
                                            title: "Ürünü Sil",
                                            message: "Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınabilir.",
                                            confirmText: "Sil",
                                            variant: "danger",
                                            showConfirm: true,
                                            productId,
                                            actionType: 'delete'
                                        });
                                    }}
                                    className="p-1 rounded-md transition-colors hover:bg-red-50"
                                    style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}
                                >
                                    <Trash2 size={16} color="#dc2626" />
                                </button>
                            </>
                        ) : (
                            <button
                                title="Geri Yükle"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRestore(params.data!.id);
                                }}
                                className="p-1 rounded-md transition-colors hover:bg-blue-50"
                                style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}
                            >
                                <RotateCcw size={16} color="#2563eb" />
                            </button>
                        )}
                    </div>
                );
            },
        },
    ], [categories, handleEdit, handleRestore]);

    const handleFormSubmit = async (data: ProductFormData) => {
        setSaving(true);
        try {
            if (editingProduct) {
                // If the product was deleted, restore it first
                if (editingProduct.isDeleted) {
                    await restoreProduct(editingProduct.id);
                }

                await updateProduct({
                    id: editingProduct.id,
                    name: data.name,
                    description: data.description || undefined,
                    imageUrl: data.imageUrl || undefined,
                    price: data.price,
                    currency: data.currency,
                    categoryId: data.categoryId,
                    isActive: data.isActive,
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
                    isActive: data.isActive,
                });
            }
            setModalOpen(false);
            setEditingProduct(null);
            await fetchData();
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message || "";
            if (errorMsg.includes("ARCHIVED_DUPLICATE")) {
                const [_, id, name] = errorMsg.split("|");
                setModalOpen(false);
                setModalSettings({
                    open: true,
                    title: "Arşivde Bulundu",
                    message: `"${name}" isminde bir ürün daha önce silinmiş. Bu ürünü arşivdeki verileriyle beraber geri getirmek mi istersiniz, yoksa bu isimle tamamen yeni bir ürün mü oluşturmak istersiniz?`,
                    confirmText: "Arşivdekini Geri Getir",
                    variant: "info",
                    showConfirm: true,
                    productId: id,
                    actionType: 'duplicate_archived'
                });
            } else {
                console.error('Ürün kaydedilirken hata:', err);
                alert('Ürün kaydedilirken bir hata oluştu: ' + errorMsg);
            }
        } finally {
            setSaving(false);
        }
    };

    // ── Export Handlers ──
    const exportToExcel = () => {
        const totalCount = products.length;
        const activeCount = products.filter(p => p.isActive && !p.isDeleted).length;
        const passiveCount = products.filter(p => !p.isActive && !p.isDeleted).length;
        const deletedCount = products.filter(p => p.isDeleted).length;

        const wsData: any[][] = [
            ['Yönetim Paneli - Ürün Listesi'],
            [`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}`],
            [`Toplam Ürün Sayısı: ${totalCount}`],
            [`Aktif Ürün Sayısı: ${activeCount}`],
            [`Pasif Ürün Sayısı: ${passiveCount}`],
            [`Silinmiş Ürün Sayısı: ${deletedCount}`],
            [],
            ['Ürün Adı', 'Açıklama', 'Fiyat (₺)', 'Stok', 'Kategori', 'Durum', 'Oluşturulma Tarihi', 'Oluşturan', 'Güncellenme Tarihi', 'Güncelleyen']
        ];

        const formatDate = (dateStr?: string) => {
            if (!dateStr) return '';
            return new Date(dateStr).toLocaleString('tr-TR');
        };

        products.forEach((p) => {
            wsData.push([
                p.name,
                p.description || '',
                p.priceAmount ?? p.price,
                p.stockQuantity,
                p.categoryName,
                p.isDeleted ? 'Silinmiş' : (p.isActive ? 'Aktif' : 'Pasif'),
                formatDate(p.createdAt || undefined),
                p.createdBy || '',
                formatDate(p.updatedAt || undefined),
                p.updatedBy || ''
            ]);
        });

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        // Column widths
        ws['!cols'] = [
            { width: 30 }, // Ürün Adı
            { width: 40 }, // Açıklama
            { width: 12 }, // Fiyat
            { width: 10 }, // Stok
            { width: 25 }, // Kategori
            { width: 10 }, // Durum
            { width: 20 }, // Oluşturulma
            { width: 15 }, // Oluşturan
            { width: 20 }, // Güncellenme
            { width: 15 }  // Güncelleyen
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Ürünler');
        XLSX.writeFile(wb, 'urunler.xlsx');
    };

    const exportToPDF = async () => {
        try {
            const totalCount = products.length;
            const activeCount = products.filter(p => p.isActive && !p.isDeleted).length;
            const passiveCount = products.filter(p => !p.isActive && !p.isDeleted).length;
            const deletedCount = products.filter(p => p.isDeleted).length;

            // Change to landscape for all columns
            const doc = new jsPDF('l', 'mm', 'a4');

            // Load Turkish font (Roboto)
            const fontUrl = '/fonts/Roboto-Regular.ttf';
            const fontResponse = await fetch(fontUrl);
            const fontBuffer = await fontResponse.arrayBuffer();

            // Convert ArrayBuffer to Base64 in browser
            const bufferToBase64 = (buffer: ArrayBuffer) => {
                let binary = '';
                const bytes = new Uint8Array(buffer);
                const len = bytes.byteLength;
                for (let i = 0; i < len; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                return window.btoa(binary);
            };

            const fontBase64 = bufferToBase64(fontBuffer);
            doc.addFileToVFS('Roboto-Regular.ttf', fontBase64);
            doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
            doc.setFont('Roboto');

            doc.setFontSize(16);
            doc.text('Ürün Listesi Özeti', 14, 20);

            doc.setFontSize(10);
            doc.text(`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}`, 14, 28);
            doc.text(`Toplam Ürün Sayısı: ${totalCount}`, 14, 34);
            doc.text(`Aktif Ürün Sayısı: ${activeCount}`, 14, 40);
            doc.text(`Pasif Ürün Sayısı: ${passiveCount}`, 70, 34);
            doc.text(`Silinmiş Ürün Sayısı: ${deletedCount}`, 70, 40);

            const formatDate = (dateStr?: string) => {
                if (!dateStr) return '';
                const date = new Date(dateStr);
                return new Intl.DateTimeFormat('tr-TR', {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit'
                }).format(date);
            };

            const tableData = products.map((p) => [
                p.name,
                `${(p.priceAmount ?? p.price).toFixed(2)} TL`,
                String(p.stockQuantity),
                p.categoryName,
                p.isDeleted ? 'Silinmiş' : (p.isActive ? 'Aktif' : 'Pasif'),
                formatDate(p.createdAt || undefined),
                p.createdBy || '',
                formatDate(p.updatedAt || undefined),
                p.updatedBy || ''
            ]);

            autoTable(doc, {
                startY: 46,
                head: [['Ürün Adı', 'Fiyat', 'Stok', 'Kategori', 'Durum', 'Oluşturulma', 'Oluşturan', 'Güncellenme', 'Güncelleyen']],
                body: tableData,
                styles: { font: 'Roboto', fontSize: 7 }, // Tiny font for many columns
                headStyles: { font: 'Roboto', fontStyle: 'normal', fillColor: [27, 94, 63] },
                columnStyles: {
                    0: { cellWidth: 35 }, // Ürün Adı
                    1: { cellWidth: 20 }, // Fiyat
                    2: { cellWidth: 15 }, // Stok
                    3: { cellWidth: 35 }, // Kategori
                    4: { cellWidth: 20 }, // Durum
                    5: { cellWidth: 35 }, // Oluşturulma
                    6: { cellWidth: 25 }, // Oluşturan
                    7: { cellWidth: 35 }, // Güncellenme
                    8: { cellWidth: 25 }, // Güncelleyen
                },
                margin: { left: 10, right: 10 }
            });

            doc.save('urunler.pdf');
        } catch (error) {
            console.error('PDF oluşturulurken hata:', error);
            alert('PDF oluşturulurken bir hata oluştu. Font dosyası yüklenememiş olabilir.');
        }
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
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                            type="checkbox"
                            checked={showDeleted}
                            onChange={(e) => setShowDeleted(e.target.checked)}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Silinmişleri Göster</span>
                    </label>
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
            </div>

            {/* AG Grid Table */}
            <div
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                style={{ border: '1px solid #e5e7eb' }}
            >
                <div style={{ height: 'calc(100vh - 260px)', width: '100%' }}>
                    <AgGridReact<Product>
                        ref={gridRef}
                        components={gridComponents}
                        rowData={products}
                        columnDefs={columnDefs}
                        onGridReady={onGridReady}
                        pagination={true}
                        paginationPageSize={20}
                        paginationPageSizeSelector={[10, 20, 50, 100]}
                        loading={loading}
                        animateRows={true}
                        rowSelection={{ mode: 'singleRow' }}
                        localeText={localeTextTr}
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

            {/* Confirm Modal (Multi-purpose) */}
            <ConfirmModal
                open={modalSettings.open}
                title={modalSettings.title}
                message={modalSettings.message}
                variant={modalSettings.variant}
                confirmText={modalSettings.confirmText}
                showConfirm={modalSettings.showConfirm}
                onConfirm={handleConfirmDelete}
                onClose={() => {
                    setModalSettings(prev => ({ ...prev, open: false }));
                }}
                loading={deleting}
            />
        </div>
    );
}
