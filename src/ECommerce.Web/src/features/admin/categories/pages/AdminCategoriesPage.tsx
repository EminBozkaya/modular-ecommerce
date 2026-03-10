import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { type GridReadyEvent, type GridApi, ModuleRegistry, ClientSideRowModelModule, TextFilterModule, PaginationModule, ValidationModule, ColumnAutoSizeModule, RowApiModule, CellStyleModule, RowSelectionModule, RowStyleModule, DateFilterModule, LocaleModule, CustomFilterModule, TooltipModule } from 'ag-grid-community';
import { FolderPlus, Download, FileDown, FolderTree } from 'lucide-react';
import { getCategories, getProducts } from '../../../catalog/api/catalogApi';
import type { Category, Product } from '../../../catalog/types/product';
import type { CategoryFormData } from '../components/CategoryFormModal';
import CategoryFormModal from '../components/CategoryFormModal';
import ConfirmModal from '../../components/ConfirmModal';
import AgGridDatePicker from '../../components/AgGridDatePicker';
import { EntityStatusFilter, EntityStatusFloatingFilter } from '../../components/EntityStatusFilter';
import { useCategoryGridColumns, localeTextTr } from '../hooks/useCategoryGridColumns';
import { useCategoryActions, defaultModalSettings, type ModalSettings } from '../hooks/useCategoryActions';
import { exportCategoriesToExcel, exportCategoriesToPDF } from '../utils/categoryExport';
ModuleRegistry.registerModules([ClientSideRowModelModule, TextFilterModule, PaginationModule, ValidationModule, ColumnAutoSizeModule, RowApiModule, CellStyleModule, RowSelectionModule, RowStyleModule, DateFilterModule, LocaleModule, CustomFilterModule, TooltipModule]);
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
    const [modalSettings, setModalSettings] = useState<ModalSettings>(defaultModalSettings);
    const gridComponents = useMemo(() => ({ agDateInput: AgGridDatePicker, entityStatusFilter: EntityStatusFilter, entityStatusFloatingFilter: EntityStatusFloatingFilter }), []);
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [cats, prods] = await Promise.all([getCategories({ includeDeleted: true }), getProducts({ page: 1, pageSize: 1000, includeInactive: true, includeDeleted: true })]);
            setCategories(cats);
            setProducts(prods.items);
        } catch (err) {
            console.error('Kategoriler yuklenirken hata:', err);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => { fetchData(); }, [fetchData]);
    const { handleEdit, handleDelete, handleRestore, handleConfirmDelete, handleFormSubmit } = useCategoryActions({ categories, products, setModalSettings, setModalOpen, setEditingCategory, setDeleting, setSaving, fetchData });
    const columnDefs = useCategoryGridColumns({ onEdit: handleEdit, onDelete: handleDelete, onRestore: handleRestore });
    const onGridReady = (params: GridReadyEvent) => { setGridApi(params.api); params.api.sizeColumnsToFit(); };
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#ecfdf5' }}>
                        <FolderTree className="h-5 w-5" style={{ color: '#1B5E3F' }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: '#1B5E3F' }}>Kategoriler</h1>
                        <p className="text-sm text-gray-500">Toplam {categories.length} kategori kayitli</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => exportCategoriesToExcel(categories)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"><Download className="h-4 w-4" /> Excel</button>
                    <button onClick={() => exportCategoriesToPDF(categories).catch(() => alert('PDF hatasi.'))} className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"><FileDown className="h-4 w-4" /> PDF</button>
                    <button
                        onClick={() => { setEditingCategory(null); setModalOpen(true); }}
                        className="flex items-center justify-center w-10 h-10 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                        style={{ background: '#1B5E3F' }}
                        title="Yeni Kategori Ekle"
                        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.background = '#164A32')}
                        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.background = '#1B5E3F')}
                    >
                        <FolderPlus className="h-5 w-5" />
                    </button>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-x-auto" style={{ border: '1px solid #e5e7eb' }}>
                <div style={{ minWidth: 'fit-content' }}>
                    <AgGridReact<Category>
                        suppressHorizontalScroll={true}
                        suppressColumnVirtualisation={true}
                        tooltipShowDelay={300}
                        components={gridComponents}
                        ref={gridRef}
                        rowData={categories}
                        columnDefs={columnDefs}
                        onGridReady={onGridReady}
                        pagination={true}
                        paginationPageSize={20}
                        paginationPageSizeSelector={[10, 20, 50, 100]}
                        loading={loading}
                        domLayout="autoHeight"
                        animateRows={true}
                        getRowStyle={(params) => {
                            if (params.data?.isDeleted) return { backgroundColor: '#fef2f2' };
                            if (params.data?.isActive === false) return { backgroundColor: '#f1f5f9' };
                            if (params.data?.isActive === true) return { backgroundColor: '#f0fdf4' };
                            return undefined;
                        }}
                        defaultColDef={{
                            resizable: true,
                            floatingFilter: true,
                            suppressHeaderMenuButton: true,
                            menuTabs: [],
                            suppressMovable: false,
                            cellStyle: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
                        }}
                        localeText={localeTextTr}
                        overlayNoRowsTemplate="<span style='padding:10px;color:#6b7280'>Henuz kategori bulunamadi.</span>"
                        overlayLoadingTemplate="<span style='padding:10px;color:#1B5E3F'>Kategoriler yukleniyor...</span>"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between mt-3 px-1 text-xs text-gray-500">
                <span>Toplam kayit: {categories.length}</span>
                <span>Gosterilen: {gridApi?.getDisplayedRowCount() ?? categories.length} kayit</span>
            </div>
            <CategoryFormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditingCategory(null); }} onSubmit={(data: CategoryFormData) => handleFormSubmit(data, editingCategory)} category={editingCategory} categories={categories} loading={saving} />
            <ConfirmModal open={modalSettings.open} title={modalSettings.title} message={modalSettings.message} variant={modalSettings.variant} confirmText={modalSettings.confirmText} showConfirm={modalSettings.showConfirm} onConfirm={() => handleConfirmDelete(modalSettings)} onClose={() => setModalSettings(prev => ({ ...prev, open: false }))} loading={deleting} />
        </div>
    );
}

