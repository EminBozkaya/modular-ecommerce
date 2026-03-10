import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { type GridReadyEvent, type GridApi, ModuleRegistry, ClientSideRowModelModule, TextFilterModule, NumberFilterModule, PaginationModule, ValidationModule, ColumnAutoSizeModule, RowApiModule, CellStyleModule, RowSelectionModule, RowStyleModule, DateFilterModule, LocaleModule, CustomFilterModule } from 'ag-grid-community';
import { Plus, Download, FileDown, Package } from 'lucide-react';
import { getProducts, getCategories, getUnits } from '../../../catalog/api/catalogApi';
import type { Product, Category, Unit } from '../../../catalog/types/product';
import type { ProductFormData } from '../components/ProductFormModal';
import ProductFormModal from '../components/ProductFormModal';
import ConfirmModal from '../../components/ConfirmModal';
import AgGridDatePicker from '../../components/AgGridDatePicker';
import StatusToggleFilter from '../../components/StatusToggleFilter';
import { useProductGridColumns, localeTextTr } from '../hooks/useProductGridColumns';
import { useProductActions, defaultProductModalSettings, type ProductModalSettings } from '../hooks/useProductActions';
import { exportProductsToExcel, exportProductsToPDF } from '../utils/productExport';
ModuleRegistry.registerModules([ClientSideRowModelModule, TextFilterModule, NumberFilterModule, PaginationModule, ValidationModule, ColumnAutoSizeModule, RowApiModule, CellStyleModule, RowSelectionModule, RowStyleModule, DateFilterModule, LocaleModule, CustomFilterModule]);
export default function AdminProductsPage() {
    const gridRef = useRef<AgGridReact>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [saving, setSaving] = useState(false);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [modalSettings, setModalSettings] = useState<ProductModalSettings>(defaultProductModalSettings);
    const gridComponents = useMemo(() => ({ agDateInput: AgGridDatePicker, statusFilter: StatusToggleFilter, statusFilterSummary: StatusToggleFilter }), []);
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [data, cats, unitData] = await Promise.all([
                getProducts({ page: 1, pageSize: 1000, includeInactive: true, includeDeleted: true }),
                getCategories({ includeDeleted: true }),
                getUnits(),
            ]);
            setProducts(data.items);
            setCategories(cats);
            setUnits(unitData);
        } catch (err) {
            console.error('Veri yuklenirken hata:', err);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => { fetchData(); }, [fetchData]);
    const { handleEdit, handleDelete, handleRestore, handleConfirmDelete, handleFormSubmit } = useProductActions({ products, categories, setModalSettings, setModalOpen, setEditingProduct, setDeleting, setSaving, fetchData });
    const columnDefs = useProductGridColumns({ onEdit: handleEdit, onDelete: handleDelete, onRestore: handleRestore });
    const onGridReady = (params: GridReadyEvent) => { setGridApi(params.api); params.api.sizeColumnsToFit(); };
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#ecfdf5' }}>
                        <Package className="h-5 w-5" style={{ color: '#1B5E3F' }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: '#1B5E3F' }}>Urunler</h1>
                        <p className="text-sm text-gray-500">Toplam {products.length} urun kayitli</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => exportProductsToExcel(products)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"><Download className="h-4 w-4" /> Excel</button>
                    <button onClick={() => exportProductsToPDF(products).catch(() => alert('PDF hatasi.'))} className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"><FileDown className="h-4 w-4" /> PDF</button>
                    <button onClick={() => { setEditingProduct(null); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors" style={{ background: '#1B5E3F' }} onMouseEnter={(e) => (e.currentTarget.style.background = '#164A32')} onMouseLeave={(e) => (e.currentTarget.style.background = '#1B5E3F')}><Plus className="h-4 w-4" /> Yeni Urun Ekle</button>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: '1px solid #e5e7eb' }}>
                <div style={{ height: 'calc(100vh - 260px)', width: '100%' }}>
                    <AgGridReact<Product> components={gridComponents} ref={gridRef} rowData={products} columnDefs={columnDefs} onGridReady={onGridReady} pagination={true} paginationPageSize={20} paginationPageSizeSelector={[10, 20, 50, 100]} loading={loading} animateRows={true} localeText={localeTextTr} getRowStyle={(params) => { if (params.data?.isDeleted) return { backgroundColor: '#fef2f2' }; if (params.data?.isActive === false) return { backgroundColor: '#f1f5f9' }; if (params.data?.isActive === true) return { backgroundColor: '#f0fdf4' }; return undefined; }} defaultColDef={{ resizable: true, floatingFilter: true, suppressHeaderMenuButton: true, menuTabs: [] }} overlayNoRowsTemplate="<span style='padding:10px;color:#6b7280'>Henuz urun bulunamadi.</span>" overlayLoadingTemplate="<span style='padding:10px;color:#1B5E3F'>Urunler yukleniyor...</span>" />
                </div>
            </div>
            <div className="flex items-center justify-between mt-3 px-1 text-xs text-gray-500">
                <span>Toplam kayit: {products.length}</span>
                <span>Gosterilen: {gridApi?.getDisplayedRowCount() ?? products.length} kayit</span>
            </div>
            <ProductFormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditingProduct(null); }} onSubmit={(data: ProductFormData) => handleFormSubmit(data, editingProduct)} product={editingProduct} categories={categories} units={units} loading={saving} />
            <ConfirmModal open={modalSettings.open} title={modalSettings.title} message={modalSettings.message} variant={modalSettings.variant} confirmText={modalSettings.confirmText} showConfirm={modalSettings.showConfirm} onConfirm={() => handleConfirmDelete(modalSettings)} onClose={() => setModalSettings(prev => ({ ...prev, open: false }))} loading={deleting} />
        </div>
    );
}
