import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { type GridReadyEvent, type GridApi, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { FolderPlus, FolderTree, ChevronRight, ChevronDown } from 'lucide-react';
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
import excelIcon from '../../../../assets/excel_download_icon.png';
import pdfIcon from '../../../../assets/pdf_download_icon.png';
ModuleRegistry.registerModules([AllCommunityModule]);
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
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [isMobile, setIsMobile] = useState(false);
    const isDragging = useRef(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const handleMouseUp = () => { isDragging.current = false; };
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, []);

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
    
    const baseColumnDefs = useCategoryGridColumns({ onEdit: handleEdit, onDelete: handleDelete, onRestore: handleRestore });
    
    const columnDefs = useMemo(() => {
        if (!isMobile) return baseColumnDefs;
        const expandCol: any = {
            headerName: '',
            width: 50,
            minWidth: 50,
            maxWidth: 50,
            pinned: 'left',
            cellRenderer: (params: any) => {
                const isExpanded = expandedRows.has(params.node.id);
                return (
                    <div className="flex items-center justify-center h-full cursor-pointer" onClick={(e) => {
                        e.stopPropagation();
                        const newExpanded = new Set(expandedRows);
                        if (isExpanded) newExpanded.delete(params.node.id);
                        else newExpanded.add(params.node.id);
                        setExpandedRows(newExpanded);
                        setTimeout(() => {
                            params.api.resetRowHeights();
                            params.api.redrawRows({ rowNodes: [params.node] });
                        }, 0);
                    }}>
                        {isExpanded ? <ChevronDown size={20} className="text-[#1B5E3F]" /> : <ChevronRight size={20} className="text-gray-400" />}
                    </div>
                );
            }
        };
        return [expandCol, ...baseColumnDefs];
    }, [baseColumnDefs, isMobile, expandedRows]);

    const fullWidthCellRenderer = useMemo(() => (params: any) => {
        const c = params.data as Category;
        const status = c.isDeleted ? 'Silinmiş' : (c.isActive ? 'Aktif' : 'Pasif');
        const statusColor = c.isDeleted ? '#dc2626' : (c.isActive ? '#16a34a' : '#ca8a04');

        return (
            <div className="mobile-detail-card" onClick={() => {
                const newExpanded = new Set(expandedRows);
                newExpanded.delete(params.node.id);
                setExpandedRows(newExpanded);
                setTimeout(() => {
                    params.api.resetRowHeights();
                    params.api.redrawRows({ rowNodes: [params.node] });
                }, 0);
            }}>
                <div className="flex justify-between items-start border-b border-gray-100 pb-2 mb-2">
                   <div className="font-bold text-[#1B5E3F] text-lg">{c.name}</div>
                   <div style={{ color: statusColor, fontWeight: '700', fontSize: '12px' }}>{status}</div>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                    <div className="mobile-detail-item">
                        <span className="mobile-detail-label">Üst Kategori</span>
                        <span className="mobile-detail-value font-medium">{c.parentCategoryName || 'Ana Kategori'}</span>
                    </div>
                    <div className="mobile-detail-item">
                        <span className="mobile-detail-label">Oluşturan</span>
                        <span className="mobile-detail-value">{c.createdBy}</span>
                    </div>
                    <div className="mobile-detail-item">
                        <span className="mobile-detail-label">Tarih</span>
                        <span className="mobile-detail-value">{new Date(c.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    {!c.isDeleted ? (
                        <>
                            <button onClick={(e) => { e.stopPropagation(); handleEdit(c); }} className="flex-1 bg-green-50 text-[#1B5E3F] py-2 rounded-lg font-bold text-sm border border-green-100">DÜZENLE</button>
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-bold text-sm border border-red-100">SİL</button>
                        </>
                    ) : (
                        <button onClick={(e) => { e.stopPropagation(); handleRestore(c.id); }} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg font-bold text-sm border border-blue-100">GERİ YÜKLE</button>
                    )}
                </div>
            </div>
        );
    }, [expandedRows, handleEdit, handleDelete, handleRestore]);
    const onGridReady = (params: GridReadyEvent) => { 
        setGridApi(params.api); 
    };
    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#ecfdf5' }}>
                        <FolderTree className="h-5 w-5" style={{ color: '#1B5E3F' }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: '#1B5E3F' }}>Kategoriler</h1>
                    </div>
                </div>
                <div className="flex items-center gap-4 self-end sm:self-auto">
                    <button
                        onClick={() => exportCategoriesToExcel(categories)}
                        className="flex flex-col items-center gap-1 transition-all duration-200 hover:scale-110 active:scale-95 group"
                        title="Excel'e Aktar"
                    >
                        <div className="w-14 h-14 flex items-center justify-center">
                            <img src={excelIcon} alt="Excel" className="h-full w-full object-contain" />
                        </div>
                        <span className="hidden xs:inline text-[10px] font-bold text-gray-500 uppercase tracking-wider">Excel</span>
                    </button>
                    <button
                        onClick={() => exportCategoriesToPDF(categories).catch(() => alert('PDF hatasi.'))}
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
                            onClick={() => { setEditingCategory(null); setModalOpen(true); }}
                            className="flex items-center justify-center w-14 h-14 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md shrink-0"
                            style={{ background: '#1B5E3F' }}
                            title="Yeni Kategori Ekle"
                            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.background = '#164A32')}
                            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.background = '#1B5E3F')}
                        >
                            <FolderPlus className="h-6 w-6" />
                        </button>
                        <span className="hidden xs:inline text-[10px] font-bold text-gray-500 uppercase tracking-wider">EKLE</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-x-auto" style={{ border: '1px solid #e5e7eb' }}>
                <div style={{ minWidth: 'fit-content' }}>
                    <AgGridReact<Category>
                        suppressHorizontalScroll={false}
                        suppressColumnVirtualisation={true}
                        tooltipShowDelay={300}
                        rowSelection={isMobile ? { mode: 'multiRow', enableClickSelection: false } : { mode: 'multiRow', enableSelectionWithoutKeys: false }}
                        enableCellTextSelection={false}
                        ensureDomOrder={true}
                        isFullWidthRow={(params) => isMobile && expandedRows.has(params.rowNode.id || '')}
                        fullWidthCellRenderer={fullWidthCellRenderer}
                        getRowHeight={(params) => {
                            if (isMobile && expandedRows.has(params.node.id || '')) return 240;
                            return 48;
                        }}
                        suppressCellFocus={isMobile}
                        onCellMouseDown={(params) => {
                            const mouseEvent = params.event as MouseEvent;
                            if (mouseEvent?.button !== 0 || (params.event as any).pointerType === 'touch' || isMobile) return;
                            const target = mouseEvent?.target as HTMLElement;
                            if (target.closest('button')) return;
                            
                            isDragging.current = true;
                            if (!mouseEvent.ctrlKey && !mouseEvent.shiftKey) {
                                params.api.deselectAll();
                            }
                            params.node.setSelected(true);
                        }}
                        onCellMouseOver={(params) => {
                            if (isDragging.current && (params.event as any).pointerType !== 'touch') {
                                params.node.setSelected(true);
                            }
                        }}
                        onCellDoubleClicked={(params) => {
                            const cell = params.event?.target as HTMLElement;
                            if (cell) {
                                cell.style.userSelect = 'text';
                                const range = document.createRange();
                                range.selectNodeContents(cell);
                                const selection = window.getSelection();
                                if (selection) {
                                    selection.removeAllRanges();
                                    selection.addRange(range);
                                }
                            }
                        }}
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
                        autoSizeStrategy={{
                            type: 'fitCellContents'
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

