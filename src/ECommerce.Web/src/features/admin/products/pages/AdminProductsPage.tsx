import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { type GridReadyEvent, type GridApi, ModuleRegistry, ClientSideRowModelModule, TextFilterModule, NumberFilterModule, PaginationModule, ValidationModule, ColumnAutoSizeModule, RowApiModule, CellStyleModule, RowSelectionModule, RowStyleModule, DateFilterModule, LocaleModule, CustomFilterModule, TooltipModule } from 'ag-grid-community';
import { PackagePlus, Package } from 'lucide-react';
import { getProducts, getCategories, getUnits } from '../../../catalog/api/catalogApi';
import type { Product, Category, Unit } from '../../../catalog/types/product';
import type { ProductFormData } from '../components/ProductFormModal';
import ProductFormModal from '../components/ProductFormModal';
import ConfirmModal from '../../components/ConfirmModal';
import AgGridDatePicker from '../../components/AgGridDatePicker';
import { EntityStatusFilter, EntityStatusFloatingFilter } from '../../components/EntityStatusFilter';
import { useProductGridColumns, localeTextTr } from '../hooks/useProductGridColumns';
import { useProductActions, defaultProductModalSettings, type ProductModalSettings } from '../hooks/useProductActions';
import { exportProductsToExcel, exportProductsToPDF } from '../utils/productExport';
import excelIcon from '../../../../assets/excel_download_icon.png';
import pdfIcon from '../../../../assets/pdf_download_icon.png';
ModuleRegistry.registerModules([ClientSideRowModelModule, TextFilterModule, NumberFilterModule, PaginationModule, ValidationModule, ColumnAutoSizeModule, RowApiModule, CellStyleModule, RowSelectionModule, RowStyleModule, DateFilterModule, LocaleModule, CustomFilterModule, TooltipModule]);
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
    const gridComponents = useMemo(() => ({ agDateInput: AgGridDatePicker, entityStatusFilter: EntityStatusFilter, entityStatusFloatingFilter: EntityStatusFloatingFilter }), []);
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#ecfdf5' }}>
                        <Package className="h-5 w-5" style={{ color: '#1B5E3F' }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: '#1B5E3F' }}>Ürünler</h1>
                    </div>
                </div>
                <div className="flex items-center gap-4 self-end sm:self-auto">
                    <button
                        onClick={() => exportProductsToExcel(products)}
                        className="flex flex-col items-center gap-1 transition-all duration-200 hover:scale-110 active:scale-95 group"
                        title="Excel'e Aktar"
                    >
                        <div className="w-14 h-14 flex items-center justify-center">
                            <img src={excelIcon} alt="Excel" className="h-full w-full object-contain" />
                        </div>
                        <span className="hidden xs:inline text-[10px] font-bold text-gray-500 uppercase tracking-wider">Excel</span>
                    </button>
                    <button
                        onClick={() => exportProductsToPDF(products).catch(() => alert('PDF hatasi.'))}
                        className="flex flex-col items-center gap-1 transition-all duration-200 hover:scale-110 active:scale-95 group"
                        title="PDF'e Aktar"
                    >
                        <div className="w-14 h-14 flex items-center justify-center">
                            <img src={pdfIcon} alt="PDF" className="h-10 w-10 object-contain" />
                        </div>
                        <span className="hidden xs:inline text-[10px] font-bold text-gray-500 uppercase tracking-wider">PDF</span>
                    </button>
                    <div className="flex flex-col items-center gap-1">
                        <button
                            onClick={() => { setEditingProduct(null); setModalOpen(true); }}
                            className="flex items-center justify-center w-14 h-14 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md shrink-0"
                            style={{ background: '#1B5E3F' }}
                            title="Yeni Ürün Ekle"
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#164A32')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = '#1B5E3F')}
                        >
                            <PackagePlus className="h-6 w-6" />
                        </button>
                        <span className="hidden xs:inline text-[10px] font-bold text-gray-500 uppercase tracking-wider">EKLE</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-x-auto" style={{ border: '1px solid #e5e7eb' }}>
                <div style={{ minWidth: 'fit-content' }}>
                    <AgGridReact<Product>
                        components={gridComponents}
                        ref={gridRef}
                        rowData={products}
                        columnDefs={columnDefs}
                        onGridReady={onGridReady}
                        pagination={true}
                        paginationPageSize={20}
                        paginationPageSizeSelector={[10, 20, 50, 100]}
                        loading={loading}
                        domLayout="autoHeight"
                        suppressColumnVirtualisation={true}
                        animateRows={true}
                        localeText={localeTextTr}
                        getRowStyle={(params) => {
                            if (params.data?.isDeleted) return { backgroundColor: '#fef2f2' };
                            if (params.data?.isActive === false) return { backgroundColor: '#f1f5f9' };
                            if (params.data?.isActive === true) return { backgroundColor: '#f0fdf4' };
                            return undefined;
                        }}
                        suppressHorizontalScroll={true}
                        tooltipShowDelay={300}
                        defaultColDef={{
                            resizable: true,
                            floatingFilter: true,
                            suppressHeaderMenuButton: true,
                            menuTabs: [],
                            suppressMovable: false,
                            cellStyle: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
                        }}
                        overlayNoRowsTemplate="<span style='padding:10px;color:#6b7280'>Henuz urun bulunamadi.</span>"
                        overlayLoadingTemplate="<span style='padding:10px;color:#1B5E3F'>Urunler yukleniyor...</span>"
                    />
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


