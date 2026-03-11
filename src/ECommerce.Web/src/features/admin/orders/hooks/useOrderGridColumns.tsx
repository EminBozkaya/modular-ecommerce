import { useMemo } from 'react';
import { type ColDef, type ICellRendererParams, type ValueFormatterParams } from 'ag-grid-community';
import { Edit2, Trash2, RotateCcw } from 'lucide-react';
import type { Order, OrderStatus } from '../../../ordering/types/order';

export const localeTextTr = {
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

export const statusLabels: Record<OrderStatus, string> = {
    Pending: 'Beklemede',
    Processing: 'İşleniyor',
    Paid: 'Ödendi',
    Shipped: 'Kargoda',
    Delivered: 'Teslim Edildi',
    Cancelled: 'İptal Edildi',
    Refunded: 'İade Edildi',
};

export const statusColors: Record<OrderStatus, { text: string; bg: string }> = {
    Pending: { text: '#6b7280', bg: '#f3f4f6' },
    Processing: { text: '#ca8a04', bg: '#fefce8' },
    Paid: { text: '#2563eb', bg: '#eff6ff' },
    Shipped: { text: '#7c3aed', bg: '#f5f3ff' },
    Delivered: { text: '#16a34a', bg: '#f0fdf4' },
    Cancelled: { text: '#dc2626', bg: '#fef2f2' },
    Refunded: { text: '#ea580c', bg: '#fff7ed' },
};

export const dateComparator = (filterLocalDate: Date, cellValue: string) => {
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

interface UseOrderGridColumnsParams {
    onEdit: (order: Order) => void;
    onDelete: (id: string) => void;
    onRestore: (id: string) => void;
}

export function useOrderGridColumns({
    onEdit,
    onDelete,
    onRestore,
}: UseOrderGridColumnsParams): ColDef<Order>[] {
    return useMemo<ColDef<Order>[]>(() => [
        {
            headerName: 'Durum',
            field: 'status',
            filter: 'orderStatusFilter',
            floatingFilter: true,
            floatingFilterComponent: 'orderStatusFloatingFilter',
            suppressHeaderMenuButton: true,
            sortable: true,
            minWidth: 130,
            cellRenderer: (params: ICellRendererParams<Order, OrderStatus>) => {
                if (!params.value) return null;
                if (params.data?.isDeleted) {
                    return (
                        <span style={{ color: '#dc2626', backgroundColor: '#fef2f2', padding: '2px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600 }}>
                            Silinmiş
                        </span>
                    );
                }
                const colors = statusColors[params.value];
                return (
                    <span style={{ color: colors.text, backgroundColor: colors.bg, padding: '2px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600 }}>
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
            minWidth: 130,
            tooltipValueGetter: (params) => params.value ?? '',
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
            minWidth: 160,
            tooltipValueGetter: (params) => params.value ?? '',
        },
        {
            headerName: 'Ürün Sayısı',
            valueGetter: (params) => {
                if (!params.data) return 0;
                return params.data.items.reduce((sum, item) => sum + item.quantity, 0);
            },
            filter: 'agNumberColumnFilter',
            sortable: true,
            minWidth: 110,
            tooltipValueGetter: (params) => params.value != null ? String(params.value) : '',
        },
        {
            headerName: 'Tutar (TL)',
            field: 'totalAmount',
            filter: 'agNumberColumnFilter',
            sortable: true,
            minWidth: 110,
            valueFormatter: (params) =>
                params.value != null ? `TL${Number(params.value).toFixed(2)}` : '',
            tooltipValueGetter: (params) =>
                params.value != null ? `TL${Number(params.value).toFixed(2)}` : '',
        },
        {
            headerName: 'Şehir',
            valueGetter: (params) => params.data?.shippingAddress.city ?? '',
            filter: 'agTextColumnFilter',
            sortable: true,
            minWidth: 110,
            tooltipValueGetter: (params) => params.value ?? '',
        },
        {
            headerName: 'Ürünler',
            valueGetter: (params) => {
                if (!params.data) return '';
                return params.data.items.map(i => i.productName).join(', ');
            },
            filter: 'agTextColumnFilter',
            sortable: true,
            minWidth: 200,
            tooltipValueGetter: (params) => params.value ?? '',
        },
        {
            headerName: 'Sipariş Tarihi',
            field: 'createdAt',
            sortable: true,
            filter: 'agDateColumnFilter',
            filterParams: { comparator: dateComparator },
            minWidth: 180,
            valueFormatter: (params: ValueFormatterParams<Order, string>) => {
                if (!params.value) return '';
                return new Intl.DateTimeFormat('tr-TR', {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit',
                }).format(new Date(params.value));
            },
            tooltipValueGetter: (params) => {
                if (!params.value) return '';
                return new Intl.DateTimeFormat('tr-TR', {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit',
                }).format(new Date(params.value as string));
            },
        },
        {
            headerName: 'İşlemler',
            field: 'id',
            sortable: false,
            filter: false,
            minWidth: 110,
            cellRenderer: (params: ICellRendererParams<Order, string>) => {
                if (!params.data) return null;
                const isDeleted = params.data.isDeleted;
                return (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', height: '100%' }}>
                        {!isDeleted ? (
                            <>
                                <button
                                    title="Durum Güncelle"
                                    onClick={(e) => { e.stopPropagation(); onEdit(params.data!); }}
                                    className="p-1 rounded-md transition-colors hover:bg-green-50"
                                    style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}
                                >
                                    <Edit2 size={16} color="#1B5E3F" />
                                </button>
                                <button
                                    title="Sil"
                                    onClick={(e) => { e.stopPropagation(); onDelete(params.data!.id); }}
                                    className="p-1 rounded-md transition-colors hover:bg-red-50"
                                    style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}
                                >
                                    <Trash2 size={16} color="#dc2626" />
                                </button>
                            </>
                        ) : (
                            <button
                                title="Geri Yükle"
                                onClick={(e) => { e.stopPropagation(); onRestore(params.data!.id); }}
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
    ], [onEdit, onDelete, onRestore]);
}
