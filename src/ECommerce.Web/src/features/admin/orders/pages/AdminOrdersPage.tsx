import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
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
    RowStyleModule,
    DateFilterModule,
    LocaleModule,
    CustomFilterModule,
    TooltipModule,
} from 'ag-grid-community';
import { ShoppingBag } from 'lucide-react';
import { getAllOrders } from '../../api/adminApi';
import type { Order } from '../../../ordering/types/order';
import { OrderStatusUpdateModal } from '../../components/OrderStatusUpdateModal';
import ConfirmModal from '../../components/ConfirmModal';
import AgGridDatePicker from '../../components/AgGridDatePicker';
import { OrderStatusFilter, OrderStatusFloatingFilter } from '../../components/OrderStatusFilter';
import { useOrderGridColumns, localeTextTr, statusColors } from '../hooks/useOrderGridColumns';
import { useOrderActions, defaultOrderModalSettings, type OrderModalSettings } from '../hooks/useOrderActions';
import { exportOrdersToExcel, exportOrdersToPDF } from '../utils/orderExport';
import excelIcon from '../../../../assets/excel_download_icon.png';
import pdfIcon from '../../../../assets/pdf_download_icon.png';

ModuleRegistry.registerModules([
    ClientSideRowModelModule, TextFilterModule, NumberFilterModule, PaginationModule,
    ValidationModule, ColumnAutoSizeModule, RowApiModule, CellStyleModule,
    RowSelectionModule, RowStyleModule, DateFilterModule, LocaleModule, CustomFilterModule, TooltipModule,
]);

export default function AdminOrdersPage() {
    const gridRef = useRef<AgGridReact>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [modalSettings, setModalSettings] = useState<OrderModalSettings>(defaultOrderModalSettings);

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

    const columnDefs = useOrderGridColumns({ onEdit: handleEdit, onDelete: handleDelete, onRestore: handleRestore });

    const onGridReady = (params: GridReadyEvent) => {
        setGridApi(params.api);
        params.api.sizeColumnsToFit();
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
                        suppressHorizontalScroll={true}
                        suppressColumnVirtualisation={true}
                        tooltipShowDelay={300}
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
