import { useState, useEffect, useCallback, useRef } from 'react';
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
} from 'ag-grid-community';
import { Plus, Download, FileDown, FolderTree } from 'lucide-react';
import { getCategories } from '../../../catalog/api/catalogApi';
import { createCategory } from '../../api/adminApi';
import type { Category } from '../../../catalog/types/product';
import type { CategoryFormData } from '../components/CategoryFormModal';
import CategoryFormModal from '../components/CategoryFormModal';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Register AG Grid modules
ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    TextFilterModule,
    PaginationModule,
    ValidationModule,
    ColumnAutoSizeModule,
    RowApiModule,
    CellStyleModule,
]);

export default function AdminCategoriesPage() {
    const gridRef = useRef<AgGridReact>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const cats = await getCategories();
            setCategories(cats);
        } catch (err) {
            console.error('Kategoriler yüklenirken hata:', err);
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

    // ── Column Definitions ──
    const columnDefs: ColDef<Category>[] = [
        {
            headerName: 'Kategori Adı',
            field: 'name',
            filter: 'agTextColumnFilter',
            sortable: true,
            flex: 2,
            minWidth: 200,
        },
        {
            headerName: 'Bağlantı Adresi',
            field: 'slug',
            filter: 'agTextColumnFilter',
            sortable: true,
            flex: 2,
            minWidth: 200,
            cellStyle: { color: '#6b7280', fontFamily: 'monospace' },
        },
        {
            headerName: 'Kimlik (ID)',
            field: 'id',
            filter: 'agTextColumnFilter',
            sortable: true,
            flex: 2,
            minWidth: 250,
            cellStyle: { color: '#9ca3af', fontFamily: 'monospace', fontSize: '12px' },
        },
    ];

    // ── CRUD Handlers ──
    const handleFormSubmit = async (data: CategoryFormData) => {
        setSaving(true);
        try {
            await createCategory({
                name: data.name,
                description: data.description || undefined,
                imageUrl: data.imageUrl || undefined,
            });
            setModalOpen(false);
            await fetchData();
        } catch (err) {
            console.error('Kategori kaydedilirken hata:', err);
            alert('Kategori kaydedilirken bir hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    // ── Export Handlers ──
    const exportToExcel = () => {
        const data = categories.map((c) => ({
            'Kategori Adı': c.name,
            'Bağlantı Adresi': c.slug,
            'ID': c.id,
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Kategoriler');
        XLSX.writeFile(wb, 'kategoriler.xlsx');
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('Kategori Listesi', 14, 20);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 14, 28);

        const tableData = categories.map((c) => [c.name, c.slug]);

        (doc as jsPDF & { autoTable: (options: Record<string, unknown>) => void }).autoTable({
            startY: 35,
            head: [['Kategori Adı', 'Bağlantı Adresi']],
            body: tableData,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [27, 94, 63] },
        });

        doc.save('kategoriler.pdf');
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
                        onClick={() => setModalOpen(true)}
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

            {/* AG Grid Table */}
            <div
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                style={{ border: '1px solid #e5e7eb' }}
            >
                <div style={{ height: 'calc(100vh - 260px)', width: '100%' }}>
                    <AgGridReact<Category>
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
                onClose={() => setModalOpen(false)}
                onSubmit={handleFormSubmit}
                loading={saving}
            />
        </div>
    );
}
