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
    RowStyleModule,
    DateFilterModule,
    LocaleModule,
    CustomFilterModule,
    type ICellRendererParams,
    type ValueFormatterParams,
} from 'ag-grid-community';
import { ShoppingBag, Download, FileDown, Edit2, Trash2, RotateCcw } from 'lucide-react';
import { getAllOrders, deleteOrder, restoreOrder } from '../../api/adminApi';
import type { Order, OrderStatus } from '../../../ordering/types/order';
import { OrderStatusUpdateModal } from '../../components/OrderStatusUpdateModal';
import ConfirmModal from '../../components/ConfirmModal';
import AgGridDatePicker from '../../components/AgGridDatePicker';
import { OrderStatusFilter, OrderStatusFloatingFilter } from '../../components/OrderStatusFilter';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    RowStyleModule,
    DateFilterModule,
    LocaleModule,
    CustomFilterModule,
]);

const localeTextTr = {
    filterOoo: 'Filtrele...',
    applyFilter: 'Uygula',
    resetFilter: 'Sıfırla',
    clearFilter: 'Temizle',
    dateFormatOoo: 'dd.mm.yyyy',
    dateFilterPlaceholder: 'gg.aa.yyyy',
    before: 'Önce',
    after: 'Sonra',
    equals: 'Eşittir',
    notEqual: 'Eşit Değil',
    blank: 'Boş',
    notBlank: 'Dolu',
    contains: 'İçerir',
    notContains: 'İçermez',
    startsWith: 'İle Başlar',
    endsWith: 'İle Biter',
    greaterThan: 'Büyüktür',
    greaterThanOrEqual: 'Büyüktür veya Eşittir',
    lessThan: 'Küçüktür',
    lessThanOrEqual: 'Küçüktür veya Eşittir',
    inRange: 'Arasında',
    inRangeStart: 'Başlangıç',
    inRangeEnd: 'Bitiş',
    andCondition: 'VE',
    orCondition: 'VEYA',
    sortAscending: 'Artan Sıralama',
    sortDescending: 'Azalan Sıralama',
    columnAutoSize: 'Otomatik Genişlik',
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
};

const statusLabels: Record<OrderStatus, string> = {
    Pending: 'Beklemede',
    Processing: 'İşleniyor',
    Paid: 'Ödendi',
    Shipped: 'Kargoda',
    Delivered: 'Teslim Edildi',
    Cancelled: 'İptal Edildi',
    Refunded: 'İade Edildi',
};

const statusColors: Record<OrderStatus, { text: string; bg: string }> = {
    Pending: { text: '#6b7280', bg: '#f3f4f6' },
    Processing: { text: '#ca8a04', bg: '#fefce8' },
    Paid: { text: '#2563eb', bg: '#eff6ff' },
    Shipped: { text: '#7c3aed', bg: '#f5f3ff' },
    Delivered: { text: '#16a34a', bg: '#f0fdf4' },
    Cancelled: { text: '#dc2626', bg: '#fef2f2' },
    Refunded: { text: '#ea580c', bg: '#fff7ed' },
};

const dateComparator = (filterLocalDate: Date, cellValue: string) => {
    if (cellValue == null) return -1;
    const cellDate = new Date(cellValue);

    const filterHasTime = filterLocalDate.getHours() !== 0 || filterLocalDate.getMinutes() !== 0;

    if (filterHasTime) {
        const filterTime = new Date(
            filterLocalDate.getFullYear(), filterLocalDate.getMonth(), filterLocalDate.getDate(),
            filterLocalDate.getHours(), filterLocalDate.getMinutes()
        ).getTime();
        const cellTime = new Date(
            cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate(),
            cellDate.getHours(), cellDate.getMinutes()
        ).getTime();

        if (filterTime === cellTime) return 0;
        return cellTime < filterTime ? -1 : 1;
    } else {
        const filterDateOnly = new Date(
            filterLocalDate.getFullYear(), filterLocalDate.getMonth(), filterLocalDate.getDate()
        ).getTime();
        const cellDateOnly = new Date(
            cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate()
        ).getTime();

        if (filterDateOnly === cellDateOnly) return 0;
        return cellDateOnly < filterDateOnly ? -1 : 1;
    }
};

export default function AdminOrdersPage() {
    const gridRef = useRef<AgGridReact>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [modalSettings, setModalSettings] = useState<{
        open: boolean;
        title: string;
        message: string;
        confirmText: string;
        variant: 'danger' | 'warning' | 'info';
        showConfirm: boolean;
        orderId: string | null;
        actionType: 'delete' | 'restore';
    }>({
        open: false,
        title: '',
        message: '',
        confirmText: '',
        variant: 'danger',
        showConfirm: true,
        orderId: null,
        actionType: 'delete',
    });

    const gridComponents = useMemo(() => ({
        agDateInput: AgGridDatePicker,
        orderStatusFilter: OrderStatusFilter,
        orderStatusFloatingFilter: OrderStatusFloatingFilter,
    }), []);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAllOrders({ page: 1, pageSize: 1000 });
            setOrders(data.items);
        } catch (err) {
            console.error('Siparişler yüklenirken hata:', err);
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

    const handleEdit = useCallback((order: Order) => {
        setSelectedOrder(order);
    }, []);

    const handleRestore = useCallback((id: string) => {
        const order = orders.find(o => o.id === id);
        if (!order) return;

        setModalSettings({
            open: true,
            title: 'Siparişi Geri Yükle',
            message: `"${order.id}" numaralı siparişi geri yüklemek istediğinizden emin misiniz?`,
            confirmText: 'Geri Yükle',
            variant: 'info',
            showConfirm: true,
            orderId: id,
            actionType: 'restore',
        });
    }, [orders]);

    const handleConfirmAction = async () => {
        const { orderId, actionType } = modalSettings;
        if (!orderId) return;

        setDeleting(true);
        try {
            if (actionType === 'restore') {
                await restoreOrder(orderId);
            } else {
                await deleteOrder(orderId);
            }
            setModalSettings(prev => ({ ...prev, open: false, orderId: null }));
            await fetchData();
        } catch (err) {
            console.error('İşlem sırasında hata:', err);
            alert('İşlem sırasında bir hata oluştu.');
        } finally {
            setDeleting(false);
        }
    };

    const handleModalClose = useCallback(() => {
        setSelectedOrder(null);
        fetchData();
    }, [fetchData]);

    // ── Column Definitions ──
    const columnDefs = useMemo<ColDef<Order>[]>(() => [
        {
            headerName: 'Durum',
            field: 'status',
            filter: 'orderStatusFilter',
            floatingFilter: true,
            floatingFilterComponent: 'orderStatusFloatingFilter',
            suppressHeaderMenuButton: true,
            sortable: true,
            width: 160,
            cellRenderer: (params: ICellRendererParams<Order, OrderStatus>) => {
                if (!params.value) return null;
                if (params.data?.isDeleted) {
                    return (
                        <span
                            style={{
                                color: '#dc2626',
                                backgroundColor: '#fef2f2',
                                padding: '2px 10px',
                                borderRadius: '9999px',
                                fontSize: '12px',
                                fontWeight: 600,
                            }}
                        >
                            Silinmiş
                        </span>
                    );
                }
                const colors = statusColors[params.value];
                return (
                    <span
                        style={{
                            color: colors.text,
                            backgroundColor: colors.bg,
                            padding: '2px 10px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                            fontWeight: 600,
                        }}
                    >
                        {statusLabels[params.value]}
                    </span>
                );
            },
        },
        {
            headerName: 'Sipariş No',
            field: 'id',
            filter: 'agTextColumnFilter',
            sortable: true,
            width: 140,
            cellRenderer: (params: ICellRendererParams<Order, string>) => {
                if (!params.value) return '';
                return (
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#374151' }}>
                        {params.value.length > 12 ? `${params.value.slice(0, 12)}...` : params.value}
                    </span>
                );
            },
        },
        {
            headerName: 'Müşteri',
            valueGetter: (params) => params.data?.shippingAddress.fullName ?? '',
            filter: 'agTextColumnFilter',
            sortable: true,
            flex: 2,
            minWidth: 160,
        },
        {
            headerName: 'Ürün Sayısı',
            valueGetter: (params) => {
                if (!params.data) return 0;
                return params.data.items.reduce((sum, item) => sum + item.quantity, 0);
            },
            filter: 'agNumberColumnFilter',
            sortable: true,
            width: 130,
        },
        {
            headerName: 'Tutar (₺)',
            field: 'totalAmount',
            filter: 'agNumberColumnFilter',
            sortable: true,
            width: 140,
            valueFormatter: (params) =>
                params.value != null ? `₺${Number(params.value).toFixed(2)}` : '',
        },
        {
            headerName: 'Şehir',
            valueGetter: (params) => params.data?.shippingAddress.city ?? '',
            filter: 'agTextColumnFilter',
            sortable: true,
            width: 140,
        },
        {
            headerName: 'Ürünler',
            valueGetter: (params) => {
                if (!params.data) return '';
                return params.data.items.map(i => i.productName).join(', ');
            },
            filter: 'agTextColumnFilter',
            sortable: true,
            flex: 2,
            minWidth: 200,
        },
        {
            headerName: 'Sipariş Tarihi',
            field: 'createdAt',
            sortable: true,
            filter: 'agDateColumnFilter',
            filterParams: {
                comparator: dateComparator,
            },
            width: 180,
            valueFormatter: (params: ValueFormatterParams<Order, string>) => {
                if (!params.value) return '';
                return new Intl.DateTimeFormat('tr-TR', {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit'
                }).format(new Date(params.value));
            },
        },
        {
            headerName: 'İşlemler',
            field: 'id',
            sortable: false,
            filter: false,
            width: 120,
            cellRenderer: (params: ICellRendererParams<Order, string>) => {
                if (!params.data) return null;
                const isDeleted = params.data.isDeleted;
                return (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', height: '100%' }}>
                        {!isDeleted ? (
                            <>
                                <button
                                    title="Durum Güncelle"
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
                                        const orderId = params.data!.id;
                                        setModalSettings({
                                            open: true,
                                            title: 'Siparişi Sil',
                                            message: `"${orderId}" numaralı siparişi silmek istediğinizden emin misiniz? Bu işlem geri alınabilir.`,
                                            confirmText: 'Sil',
                                            variant: 'danger',
                                            showConfirm: true,
                                            orderId,
                                            actionType: 'delete',
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
    ], [handleEdit, handleRestore]);

    // ── Export Handlers ──
    const exportToExcel = () => {
        const totalCount = orders.length;
        const statusCounts = orders.reduce((acc, o) => {
            acc[o.status] = (acc[o.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

        const wsData: (string | number)[][] = [
            ['Yönetim Paneli - Sipariş Listesi'],
            [`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}`],
            [`Toplam Sipariş Sayısı: ${totalCount}`],
            [`Toplam Ciro: ₺${totalRevenue.toFixed(2)}`],
            ...Object.entries(statusCounts).map(([status, count]) =>
                [`${statusLabels[status as OrderStatus] || status}: ${count}`]
            ),
            [],
            ['Durum', 'Sipariş No', 'Müşteri', 'Ürün Sayısı', 'Tutar (₺)', 'Şehir', 'Ürünler', 'Sipariş Tarihi'],
        ];

        const formatDate = (dateStr: string) => {
            return new Date(dateStr).toLocaleString('tr-TR');
        };

        orders.forEach((o) => {
            wsData.push([
                o.isDeleted ? 'Silinmiş' : statusLabels[o.status],
                o.id,
                o.shippingAddress.fullName,
                o.items.reduce((sum, item) => sum + item.quantity, 0),
                o.totalAmount,
                o.shippingAddress.city,
                o.items.map(i => i.productName).join(', '),
                formatDate(o.createdAt),
            ]);
        });

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        ws['!cols'] = [
            { width: 15 },  // Durum
            { width: 15 },  // Sipariş No
            { width: 20 },  // Müşteri
            { width: 12 },  // Ürün Sayısı
            { width: 12 },  // Tutar
            { width: 15 },  // Şehir
            { width: 40 },  // Ürünler
            { width: 20 },  // Tarih
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Siparişler');
        XLSX.writeFile(wb, 'siparisler.xlsx');
    };

    const exportToPDF = async () => {
        try {
            const totalCount = orders.length;
            const statusCounts = orders.reduce((acc, o) => {
                acc[o.status] = (acc[o.status] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);
            const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

            const doc = new jsPDF('l', 'mm', 'a4');

            // Load Turkish font
            const fontUrl = '/fonts/Roboto-Regular.ttf';
            const fontResponse = await fetch(fontUrl);
            const fontBuffer = await fontResponse.arrayBuffer();

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
            doc.text('Sipariş Listesi Özeti', 14, 20);

            doc.setFontSize(10);
            doc.text(`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}`, 14, 28);
            doc.text(`Toplam Sipariş: ${totalCount}`, 14, 34);
            doc.text(`Toplam Ciro: ₺${totalRevenue.toFixed(2)}`, 14, 40);

            let yPos = 34;
            let xPos = 70;
            Object.entries(statusCounts).forEach(([status, count]) => {
                doc.text(`${statusLabels[status as OrderStatus] || status}: ${count}`, xPos, yPos);
                yPos += 6;
                if (yPos > 40) {
                    yPos = 34;
                    xPos += 50;
                }
            });

            const formatDate = (dateStr: string) => {
                return new Intl.DateTimeFormat('tr-TR', {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit'
                }).format(new Date(dateStr));
            };

            const tableData = orders.map((o) => [
                o.isDeleted ? 'Silinmiş' : statusLabels[o.status],
                o.id,
                o.shippingAddress.fullName,
                String(o.items.reduce((sum, item) => sum + item.quantity, 0)),
                `₺${o.totalAmount.toFixed(2)}`,
                o.shippingAddress.city,
                o.items.map(i => i.productName).join(', '),
                formatDate(o.createdAt),
            ]);

            autoTable(doc, {
                startY: 46,
                head: [['Durum', 'Sipariş No', 'Müşteri', 'Adet', 'Tutar', 'Şehir', 'Ürünler', 'Tarih']],
                body: tableData,
                styles: { font: 'Roboto', fontSize: 7 },
                headStyles: { font: 'Roboto', fontStyle: 'normal', fillColor: [27, 94, 63] },
                columnStyles: {
                    0: { cellWidth: 20 },
                    1: { cellWidth: 25 },
                    2: { cellWidth: 30 },
                    3: { cellWidth: 12 },
                    4: { cellWidth: 20 },
                    5: { cellWidth: 25 },
                    6: { cellWidth: 60 },
                    7: { cellWidth: 30 },
                },
                margin: { left: 10, right: 10 },
            });

            doc.save('siparisler.pdf');
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
                        <ShoppingBag className="h-5 w-5" style={{ color: '#1B5E3F' }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: '#1B5E3F' }}>Siparişler</h1>
                        <p className="text-sm text-gray-500">
                            Toplam {orders.length} sipariş kayıtlı
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
                </div>
            </div>

            {/* AG Grid Table */}
            <div
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                style={{ border: '1px solid #e5e7eb' }}
            >
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
                            if (params.data.isDeleted) {
                                return { backgroundColor: '#fef2f2' };
                            }
                            const colors = statusColors[params.data.status];
                            if (colors) {
                                return { backgroundColor: colors.bg };
                            }
                            return undefined;
                        }}
                        defaultColDef={{
                            resizable: true,
                            floatingFilter: true,
                            suppressHeaderMenuButton: true,
                            menuTabs: [],
                        }}
                        overlayNoRowsTemplate="<span style='padding:10px;color:#6b7280'>Henüz sipariş bulunamadı.</span>"
                        overlayLoadingTemplate="<span style='padding:10px;color:#1B5E3F'>Siparişler yükleniyor...</span>"
                    />
                </div>
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between mt-3 px-1 text-xs text-gray-500">
                <span>Toplam kayıt: {orders.length}</span>
                <span>
                    Gösterilen: {gridApi?.getDisplayedRowCount() ?? orders.length} kayıt
                </span>
            </div>

            {/* Order Status Update Modal */}
            {selectedOrder && (
                <OrderStatusUpdateModal
                    order={selectedOrder}
                    isOpen={!!selectedOrder}
                    onClose={handleModalClose}
                />
            )}

            {/* Confirm Modal */}
            <ConfirmModal
                open={modalSettings.open}
                title={modalSettings.title}
                message={modalSettings.message}
                variant={modalSettings.variant}
                confirmText={modalSettings.confirmText}
                showConfirm={modalSettings.showConfirm}
                onConfirm={handleConfirmAction}
                onClose={() => {
                    setModalSettings(prev => ({ ...prev, open: false }));
                }}
                loading={deleting}
            />
        </div>
    );
}
