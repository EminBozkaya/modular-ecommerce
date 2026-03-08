import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
    type ColDef,
    type GridReadyEvent,
    type GridApi,
    ModuleRegistry,
    ClientSideRowModelModule,
    TextFilterModule,
    PaginationModule,
    ValidationModule,
    ColumnAutoSizeModule,
    RowApiModule,
    CellStyleModule,
    DateFilterModule,
    LocaleModule,
    type ICellRendererParams,
    type ValueFormatterParams,
} from 'ag-grid-community';
import { Plus, Download, FileDown, FolderTree } from 'lucide-react';
import { getCategories, getProducts } from '../../../catalog/api/catalogApi';
import { createCategory, updateCategory, deleteCategory, restoreCategory } from '../../api/adminApi';
import { Trash2, Edit2, RotateCcw } from 'lucide-react';
import type { Category, Product } from '../../../catalog/types/product';
import type { CategoryFormData } from '../components/CategoryFormModal';
import CategoryFormModal from '../components/CategoryFormModal';
import ConfirmModal from '../../components/ConfirmModal';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import AgGridDatePicker from '../../components/AgGridDatePicker';

// Register AG Grid modules
ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    TextFilterModule,
    PaginationModule,
    ValidationModule,
    ColumnAutoSizeModule,
    RowApiModule,
    CellStyleModule,
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


export default function AdminCategoriesPage() {
    const gridRef = useRef<AgGridReact>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [saving, setSaving] = useState(false);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [showDeleted, setShowDeleted] = useState(false);

    const gridComponents = useMemo(() => ({
        agDateInput: AgGridDatePicker,
    }), []);

    const [modalSettings, setModalSettings] = useState<{
        open: boolean;
        title: string;
        message: string;
        confirmText: string;
        variant: 'danger' | 'warning' | 'info';
        showConfirm: boolean;
        categoryId: string | null;
        actionType: 'delete' | 'deactivate' | 'restore' | 'duplicate_archived';
    }>({
        open: false,
        title: '',
        message: '',
        confirmText: '',
        variant: 'danger',
        showConfirm: true,
        categoryId: null,
        actionType: 'delete'
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [cats, prods] = await Promise.all([
                getCategories({ includeDeleted: showDeleted }),
                getProducts({ page: 1, pageSize: 1000, includeInactive: true, includeDeleted: showDeleted })
            ]);
            setCategories(cats);
            setProducts(prods.items);
        } catch (err) {
            console.error('Kategoriler yüklenirken hata:', err);
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

    const handleEdit = useCallback((category: Category) => {
        setEditingCategory(category);
        setModalOpen(true);
    }, []);

    const handleDelete = useCallback((id: string) => {
        console.log('Categories handleDelete called for ID:', id);
        const category = categories.find(c => c.id === id);
        if (!category) {
            console.warn('Category not found for deletion:', id);
            return;
        }

        const isRoot = !category.parentCategoryId;
        const subCats = categories.filter(c => c.parentCategoryId === id && !c.isDeleted);
        const hasProducts = products.some(p => p.categoryId === id);

        const subCatsWithProductsCount = subCats.filter(sc =>
            products.some(p => p.categoryId === sc.id)
        ).length;

        if (isRoot) {
            if (hasProducts || (subCats.length > 1 && subCatsWithProductsCount > 0) || subCatsWithProductsCount > 1) {
                setModalSettings({
                    open: true,
                    title: "İşlem Engellendi",
                    message: hasProducts
                        ? "Bu kategori içerisinde aktif ürünler bulunduğu için silinemez. Lütfen önce ürünleri başka bir kategoriye taşıyın."
                        : "Bu kategoriye bağlı alt kategorilerden en az birinde aktif ürün bulunmaktadır. Veri bütünlüğünü korumak adına bu kategori silinemez.",
                    confirmText: "",
                    variant: "warning",
                    showConfirm: false,
                    categoryId: id,
                    actionType: 'delete'
                });
                return;
            }

            if (!hasProducts && subCats.length === 1 && subCatsWithProductsCount === 1) {
                setModalSettings({
                    open: true,
                    title: "Kategori Terfisi",
                    message: `"${category.name}" ana kategorisi silinecektir. İçinde ürün bulunan tek alt kategorisi olan "${subCats[0].name}" artık yeni bir ana kategori olarak atanacaktır. Onaylıyor musunuz?`,
                    confirmText: "Onayla ve Terfi Ettir",
                    variant: "info",
                    showConfirm: true,
                    categoryId: id,
                    actionType: 'delete'
                });
                return;
            }

            if (!hasProducts && subCatsWithProductsCount === 0) {
                setModalSettings({
                    open: true,
                    title: "Kategori Ağacını Sil",
                    message: subCats.length > 0
                        ? `"${category.name}" ana kategorisi ve ona bağlı olan ${subCats.length} adet boş alt kategori kalıcı olarak silinecektir. Onaylıyor musunuz?`
                        : `"${category.name}" kategorisini silmek istediğinizden emin misiniz?`,
                    confirmText: "Sil",
                    variant: "danger",
                    showConfirm: true,
                    categoryId: id,
                    actionType: 'delete'
                });
                return;
            }
        } else {
            if (hasProducts) {
                setModalSettings({
                    open: true,
                    title: "İşlem Engellendi",
                    message: `Bu kategori içerisinde aktif ürünler bulunduğu için silinemez. Lütfen önce ürünleri başka bir kategoriye taşıyın.`,
                    confirmText: "",
                    variant: "warning",
                    showConfirm: false,
                    categoryId: id,
                    actionType: 'delete'
                });
            } else {
                setModalSettings({
                    open: true,
                    title: "Kategoriyi Sil",
                    message: `"${category.name}" alt kategorisini silmek istediğinizden emin misiniz?`,
                    confirmText: "Sil",
                    variant: "danger",
                    showConfirm: true,
                    categoryId: id,
                    actionType: 'delete'
                });
            }
        }
    }, [categories, products]);

    const handleRestore = useCallback((id: string) => {
        const category = categories.find(c => c.id === id);
        if (!category) return;

        setModalSettings({
            open: true,
            title: "Kategoriyi Geri Yükle",
            message: `"${category.name}" kategorisini ve arşivdeki verilerini geri yüklemek istediğinizden emin misiniz?`,
            confirmText: "Geri Yükle",
            variant: "info",
            showConfirm: true,
            categoryId: id,
            actionType: 'restore'
        });
    }, [categories]);


    // ── Column Definitions ──
    const columnDefs = useMemo<ColDef<Category>[]>(() => [
        {
            headerName: 'Kategori Adı',
            field: 'name',
            filter: 'agTextColumnFilter',
            sortable: true,
            flex: 2,
            minWidth: 150,
        },
        {
            headerName: 'Üst Kategori',
            field: 'parentCategoryName',
            filter: 'agTextColumnFilter',
            sortable: true,
            flex: 2,
            minWidth: 150,
            cellRenderer: (params: { value?: string | null }) => {
                return params.value ? (
                    <span className="text-gray-600">{params.value}</span>
                ) : (
                    <span className="text-gray-400 italic">Ana Kategori</span>
                );
            }
        },
        {
            headerName: 'Durum',
            field: 'isActive',
            sortable: true,
            width: 100,
            cellRenderer: (params: ICellRendererParams<Category>) => {
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
            valueFormatter: (params: ValueFormatterParams<Category, string>) => {
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
            valueFormatter: (params: ValueFormatterParams<Category, string>) => {
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
            valueFormatter: (params: ValueFormatterParams<Category, string>) => {
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
            cellRenderer: (params: ICellRendererParams<Category>) => {
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
                                        if (params.data) handleEdit(params.data);
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
                                        if (params.data) handleDelete(params.data.id);
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
                                    if (params.data) handleRestore(params.data.id);
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
    ], [categories, products, handleEdit, handleDelete]);

    // ── CRUD Handlers ──

    const handleConfirmDelete = async () => {
        const { categoryId, actionType } = modalSettings;
        if (!categoryId) return;

        setDeleting(true);
        try {
            if (actionType === 'deactivate') {
                const cat = categories.find(c => c.id === categoryId);
                if (cat) {
                    await updateCategory({
                        id: cat.id,
                        name: cat.name,
                        description: (cat as any).description,
                        imageUrl: (cat as any).imageUrl,
                        isActive: false,
                        parentCategoryId: cat.parentCategoryId
                    });
                }
            } else if (actionType === 'restore' || actionType === 'duplicate_archived') {
                await restoreCategory(categoryId);
            } else {
                await deleteCategory(categoryId);
            }

            setModalSettings(prev => ({ ...prev, open: false, categoryId: null }));
            await fetchData();
        } catch (err: any) {
            console.error('İşlem sırasında hata:', err);
            const errorMessage = err.response?.data?.message || err.message || 'İşlem sırasında bir hata oluştu.';
            alert(errorMessage);
        } finally {
            setDeleting(false);
        }
    };


    const handleFormSubmit = async (data: CategoryFormData) => {
        if (editingCategory) {
            const willDeactivate = editingCategory.isActive && !data.isActive;
            if (willDeactivate) {
                const id = editingCategory.id;
                const hasProducts = products.some(p => p.categoryId === id);
                const subCats = categories.filter(c => c.parentCategoryId === id && !c.isDeleted);

                if (hasProducts || subCats.length > 0) {
                    setModalOpen(false);
                    setModalSettings({
                        open: true,
                        title: "Kategoriyi Pasife Al",
                        message: "Bu kategoriyi pasife alırsanız, satış ekranında bu kategoriniz ve altındaki bağlı tüm kategoriler ve ürünler satış için görünmeyecektir. Yine de pasife almak istediğinizden emin misiniz?",
                        confirmText: "Evet, Pasife Çek",
                        variant: "warning",
                        showConfirm: true,
                        categoryId: id,
                        actionType: 'deactivate'
                    });
                    return;
                }
            }
        }

        setSaving(true);
        try {
            if (editingCategory) {
                await updateCategory({
                    id: editingCategory.id,
                    name: data.name,
                    description: data.description || undefined,
                    imageUrl: data.imageUrl || undefined,
                    isActive: data.isActive,
                    parentCategoryId: data.parentCategoryId || undefined,
                });
            } else {
                await createCategory({
                    name: data.name,
                    description: data.description || undefined,
                    imageUrl: data.imageUrl || undefined,
                    isActive: data.isActive,
                    parentCategoryId: data.parentCategoryId || undefined,
                });
            }
            setModalOpen(false);
            setEditingCategory(null);
            await fetchData();
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message || "";
            if (errorMsg.includes("ARCHIVED_DUPLICATE")) {
                const [_, id, name] = errorMsg.split("|");
                setModalOpen(false);
                setModalSettings({
                    open: true,
                    title: "Arşivde Bulundu",
                    message: `"${name}" isminde bir kategori daha önce silinmiş. Bu kategoriyi arşivdeki verileriyle beraber geri getirmek ister misiniz?`,
                    confirmText: "Geri Getir",
                    variant: "info",
                    showConfirm: true,
                    categoryId: id,
                    actionType: 'duplicate_archived'
                });
            } else {
                console.error('Kategori kaydedilirken hata:', err);
                alert('Kategori kaydedilirken bir hata oluştu: ' + errorMsg);
            }
        } finally {
            setSaving(false);
        }
    };

    // ── Export Handlers ──
    const exportToExcel = () => {
        const activeCount = categories.filter(c => c.isActive !== false).length;
        const totalCount = categories.length;

        const wsData: any[][] = [
            ['Yönetim Paneli - Kategori Listesi'],
            [`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}`],
            [`Toplam Kategori Sayısı: ${totalCount}`],
            [`Aktif Kategori Sayısı: ${activeCount}`],
            [],
            ['Kategori Adı', 'Durum']
        ];

        categories.forEach((c) => {
            wsData.push([
                c.name,
                c.isActive !== false ? 'Aktif' : 'Pasif',
            ]);
        });

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        ws['!cols'] = [{ width: 40 }, { width: 15 }];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Kategoriler');
        XLSX.writeFile(wb, 'kategoriler.xlsx');
    };

    const exportToPDF = async () => {
        try {
            const activeCount = categories.filter(c => c.isActive !== false).length;
            const totalCount = categories.length;

            const doc = new jsPDF('p', 'mm', 'a4');

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
            doc.text('Kategori Listesi Özeti', 14, 20);

            doc.setFontSize(10);
            doc.text(`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}`, 14, 28);
            doc.text(`Toplam Kategori Sayısı: ${totalCount}`, 14, 34);
            doc.text(`Aktif Kategori Sayısı: ${activeCount}`, 14, 40);

            const tableData = categories.map((c) => [
                c.name,
                c.isActive !== false ? 'Aktif' : 'Pasif',
            ]);

            autoTable(doc, {
                startY: 46,
                head: [['Kategori Adı', 'Durum']],
                body: tableData,
                styles: { font: 'Roboto', fontSize: 10 },
                headStyles: { font: 'Roboto', fontStyle: 'normal', fillColor: [27, 94, 63] },
            });

            doc.save('kategoriler.pdf');
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
                        <FolderTree className="h-5 w-5" style={{ color: '#1B5E3F' }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: '#1B5E3F' }}>Kategoriler</h1>
                        <p className="text-sm text-gray-500">
                            Toplam {categories.length} kategori kayıtlı
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
                                setEditingCategory(null);
                                setModalOpen(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                            style={{ background: '#1B5E3F' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#164A32')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = '#1B5E3F')}
                        >
                            <Plus className="h-4 w-4" />
                            Yeni Kategori Ekle
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
                    <AgGridReact<Category>
                        components={gridComponents}
                        ref={gridRef}
                        rowData={categories}
                        columnDefs={columnDefs}
                        onGridReady={onGridReady}
                        pagination={true}
                        paginationPageSize={20}
                        paginationPageSizeSelector={[10, 20, 50, 100]}
                        loading={loading}
                        animateRows={true}
                        defaultColDef={{
                            resizable: true,
                            floatingFilter: true,
                        }}
                        localeText={localeTextTr}
                        overlayNoRowsTemplate="<span style='padding:10px;color:#6b7280'>Henüz kategori bulunamadı.</span>"
                        overlayLoadingTemplate="<span style='padding:10px;color:#1B5E3F'>Kategoriler yükleniyor...</span>"
                    />
                </div>
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between mt-3 px-1 text-xs text-gray-500">
                <span>Toplam kayıt: {categories.length}</span>
                <span>
                    Gösterilen: {gridApi?.getDisplayedRowCount() ?? categories.length} kayıt
                </span>
            </div>

            {/* Category Form Modal */}
            <CategoryFormModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingCategory(null);
                }}
                onSubmit={handleFormSubmit}
                category={editingCategory}
                categories={categories}
                loading={saving}
            />

            {/* Confirm Delete / Deactivate Modal */}
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
