import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { type GridReadyEvent, type GridApi, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { ShoppingBag, ChevronRight, ChevronDown } from 'lucide-react';
import { getAllOrders } from '../../api/adminApi';
import type { Order } from '../../../ordering/types/order';
import { OrderStatusUpdateModal } from '../../components/OrderStatusUpdateModal';
import ConfirmModal from '../../components/ConfirmModal';
import AgGridDatePicker from '../../components/AgGridDatePicker';
import { OrderStatusFilter, OrderStatusFloatingFilter } from '../../components/OrderStatusFilter';
import { useOrderGridColumns, localeTextTr, statusColors, statusLabels } from '../hooks/useOrderGridColumns';
import { useOrderActions, defaultOrderModalSettings, type OrderModalSettings } from '../hooks/useOrderActions';
import { exportOrdersToExcel, exportOrdersToPDF } from '../utils/orderExport';
import excelIcon from '../../../../assets/excel_download_icon.png';
import pdfIcon from '../../../../assets/pdf_download_icon.png';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function AdminOrdersPage() {
    const gridRef = useRef<AgGridReact>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [modalSettings, setModalSettings] = useState<OrderModalSettings>(defaultOrderModalSettings);
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

    const gridComponents = useMemo(() => ({
        agDateInput: AgGridDatePicker,
        orderStatusFilter: OrderStatusFilter,
        orderStatusFloatingFilter: OrderStatusFloatingFilter,
    }), []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllOrders({ page: 1, pageSize: 1000 });
            setOrders(data.items);
        } catch (err) {
            console.error('Siparisler yuklenirken hata:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const { handleEdit, handleDelete, handleRestore, handleConfirmAction, handleModalClose } =
        useOrderActions({ orders, setModalSettings, setSelectedOrder, setDeleting, fetchData });

    const baseColumnDefs = useOrderGridColumns({ onEdit: handleEdit, onDelete: handleDelete, onRestore: handleRestore });
    
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
        const o = params.data as Order;
        const stLabels = statusLabels as any;
        const statusText = o.isDeleted ? 'Silinmiş' : (stLabels[o.status] || o.status);
        const statusCols = statusColors as any;
        const colors = o.isDeleted ? { text: '#dc2626', bg: '#fef2f2' } : (statusCols[o.status] || { text: '#000', bg: '#fff' });

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
                   <div className="font-bold text-[#1B5E3F] text-sm break-all pr-2">Sipariş: #{o.id}</div>
                   <div style={{ color: colors.text, backgroundColor: colors.bg, padding: '2px 8px', borderRadius: '9999px', fontSize: '10px', fontWeight: '700' }}>{statusText}</div>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                    <div className="mobile-detail-item">
                        <span className="mobile-detail-label">Müşteri</span>
                        <span className="mobile-detail-value font-medium">{o.shippingAddress.fullName}</span>
                    </div>
                    <div className="mobile-detail-item">
                        <span className="mobile-detail-label">Tutar</span>
                        <span className="mobile-detail-value font-bold text-lg">TL{o.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="mobile-detail-item">
                        <span className="mobile-detail-label">Ürünler</span>
                        <span className="mobile-detail-value text-sm">{o.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}</span>
                    </div>
                    <div className="mobile-detail-item">
                        <span className="mobile-detail-label">Adres</span>
                        <span className="mobile-detail-value text-xs">{o.shippingAddress.addressLine1}, {o.shippingAddress.city}/{o.shippingAddress.country}</span>
                    </div>
                    <div className="mobile-detail-item">
                        <span className="mobile-detail-label">Tarih</span>
                        <span className="mobile-detail-value">{new Date(o.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    {!o.isDeleted ? (
                        <>
                            <button onClick={(e) => { e.stopPropagation(); handleEdit(o); }} className="flex-1 bg-green-50 text-[#1B5E3F] py-2 rounded-lg font-bold text-sm border border-green-100">DURUM GÜNCELLE</button>
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(o.id); }} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-bold text-sm border border-red-100">SİL</button>
                        </>
                    ) : (
                        <button onClick={(e) => { e.stopPropagation(); handleRestore(o.id); }} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg font-bold text-sm border border-blue-100">GERİ YÜKLE</button>
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
                        <ShoppingBag className="h-5 w-5" style={{ color: '#1B5E3F' }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: '#1B5E3F' }}>Siparişler</h1>
                    </div>
                </div>
                <div className="flex items-center gap-4 self-end sm:self-auto">
                    <button
                        onClick={() => exportOrdersToExcel(orders)}
                        className="flex flex-col items-center gap-1 transition-all duration-200 hover:scale-110 active:scale-95 group"
                        title="Excel'e Aktar"
                    >
                        <div className="w-14 h-14 flex items-center justify-center">
                            <img src={excelIcon} alt="Excel" className="h-full w-full object-contain" />
                        </div>
                        <span className="hidden xs:inline text-[10px] font-bold text-gray-500 uppercase tracking-wider">Excel</span>
                    </button>
                    <button
                        onClick={() => exportOrdersToPDF(orders).catch(() => alert('PDF hatasi.'))}
                        className="flex flex-col items-center gap-1 transition-all duration-200 hover:scale-110 active:scale-95 group"
                        title="PDF'e Aktar"
                    >
                        <div className="w-14 h-14 flex items-center justify-center">
                            <img src={pdfIcon} alt="PDF" className="h-10 w-10 object-contain" />
                        </div>
                        <span className="hidden xs:inline text-[10px] font-bold text-gray-500 uppercase tracking-wider">PDF</span>
                    </button>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-x-auto" style={{ border: '1px solid #e5e7eb' }}>
                <div style={{ minWidth: 'fit-content' }}>
                    <AgGridReact<Order>
                        suppressHorizontalScroll={false}
                        suppressColumnVirtualisation={true}
                        tooltipShowDelay={300}
                        rowSelection={isMobile ? { mode: 'multiRow', enableClickSelection: false } : { mode: 'multiRow', enableSelectionWithoutKeys: false }}
                        enableCellTextSelection={false}
                        ensureDomOrder={true}
                        isFullWidthRow={(params) => isMobile && expandedRows.has(params.rowNode.id || '')}
                        fullWidthCellRenderer={fullWidthCellRenderer}
                        getRowHeight={(params) => {
                            if (isMobile && expandedRows.has(params.node.id || '')) return 400;
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
                        ref={gridRef}
                        components={gridComponents}
                        rowData={orders}
                        columnDefs={columnDefs}
                        onGridReady={onGridReady}
                        pagination={true}
                        paginationPageSize={20}
                        paginationPageSizeSelector={[10, 20, 50, 100]}
                        loading={loading}
                        domLayout="autoHeight"
                        animateRows={true}
                        localeText={localeTextTr}
                        getRowStyle={(params) => {
                            if (!params.data) return undefined;
                            if (params.data.isDeleted) return { backgroundColor: '#fef2f2' };
                            const colors = statusColors[params.data.status];
                            return colors ? { backgroundColor: colors.bg } : undefined;
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
                        overlayNoRowsTemplate="<span style='padding:10px;color:#6b7280'>Henuz siparis bulunamadi.</span>"
                        overlayLoadingTemplate="<span style='padding:10px;color:#1B5E3F'>Siparisler yukleniyor...</span>"
                    />
                </div>
            </div>


            <div className="flex items-center justify-between mt-3 px-1 text-xs text-gray-500">
                <span>Toplam kayit: {orders.length}</span>
                <span>Gosterilen: {gridApi?.getDisplayedRowCount() ?? orders.length} kayit</span>
            </div>

            {
                selectedOrder && (
                    <OrderStatusUpdateModal
                        order={selectedOrder}
                        isOpen={!!selectedOrder}
                        onClose={handleModalClose}
                    />
                )
            }

            <ConfirmModal
                open={modalSettings.open}
                title={modalSettings.title}
                message={modalSettings.message}
                variant={modalSettings.variant}
                confirmText={modalSettings.confirmText}
                showConfirm={modalSettings.showConfirm}
                onConfirm={() => handleConfirmAction(modalSettings)}
                onClose={() => setModalSettings(prev => ({ ...prev, open: false }))}
                loading={deleting}
            />
        </div >
    );
}
