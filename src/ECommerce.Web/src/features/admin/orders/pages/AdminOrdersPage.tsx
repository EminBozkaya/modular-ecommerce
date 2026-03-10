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
} from 'ag-grid-community';
import { ShoppingBag, Download, FileDown } from 'lucide-react';
import { getAllOrders } from '../../api/adminApi';
import type { Order } from '../../../ordering/types/order';
import { OrderStatusUpdateModal } from '../../components/OrderStatusUpdateModal';
import ConfirmModal from '../../components/ConfirmModal';
import AgGridDatePicker from '../../components/AgGridDatePicker';
import { OrderStatusFilter, OrderStatusFloatingFilter } from '../../components/OrderStatusFilter';
import { useOrderGridColumns, localeTextTr, statusColors } from '../hooks/useOrderGridColumns';
import { useOrderActions, defaultOrderModalSettings, type OrderModalSettings } from '../hooks/useOrderActions';
import { exportOrdersToExcel, exportOrdersToPDF } from '../utils/orderExport';

ModuleRegistry.registerModules([
    ClientSideRowModelModule, TextFilterModule, NumberFilterModule, PaginationModule,
    ValidationModule, ColumnAutoSizeModule, RowApiModule, CellStyleModule,
    RowSelectionModule, RowStyleModule, DateFilterModule, LocaleModule, CustomFilterModule,
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
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#ecfdf5' }}>
                        <ShoppingBag className="h-5 w-5" style={{ color: '#1B5E3F' }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: '#1B5E3F' }}>Siparisler</h1>
                        <p className="text-sm text-gray-500">Toplam {orders.length} siparis kayitli</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => exportOrdersToExcel(orders)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors">
                        <Download className="h-4 w-4" /> Excel
                    </button>
                    <button onClick={() => exportOrdersToPDF(orders).catch(() => alert('PDF hatasi.'))} className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors">
                        <FileDown className="h-4 w-4" /> PDF
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: '1px solid #e5e7eb' }}>
                <div style={{ height: 'calc(100vh - 260px)', width: '100%' }}>
                    <AgGridReact<Order>
                        ref={gridRef}
                        components={gridComponents}
                        rowData={orders}
                        columnDefs={columnDefs}
                        onGridReady={onGridReady}
                        pagination={true}
                        paginationPageSize={20}
                        paginationPageSizeSelector={[10, 20, 50, 100]}
                        loading={loading}
                        animateRows={true}
                        localeText={localeTextTr}
                        getRowStyle={(params) => {
                            if (!params.data) return undefined;
                            if (params.data.isDeleted) return { backgroundColor: '#fef2f2' };
                            const colors = statusColors[params.data.status];
                            return colors ? { backgroundColor: colors.bg } : undefined;
                        }}
                        defaultColDef={{ resizable: true, floatingFilter: true, suppressHeaderMenuButton: true, menuTabs: [] }}
                        overlayNoRowsTemplate="<span style='padding:10px;color:#6b7280'>Henuz siparis bulunamadi.</span>"
                        overlayLoadingTemplate="<span style='padding:10px;color:#1B5E3F'>Siparisler yukleniyor...</span>"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between mt-3 px-1 text-xs text-gray-500">
                <span>Toplam kayit: {orders.length}</span>
                <span>Gosterilen: {gridApi?.getDisplayedRowCount() ?? orders.length} kayit</span>
            </div>

            {selectedOrder && (
                <OrderStatusUpdateModal
                    order={selectedOrder}
                    isOpen={!!selectedOrder}
                    onClose={handleModalClose}
                />
            )}

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
        </div>
    );
}
