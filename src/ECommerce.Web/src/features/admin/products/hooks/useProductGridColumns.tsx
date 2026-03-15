import { useMemo } from 'react';
import {
    type ColDef,
    type ICellRendererParams,
    type ValueFormatterParams,
} from 'ag-grid-community';
import { Edit2, Trash2, RotateCcw } from 'lucide-react';
import type { Product } from '../../../catalog/types/product';

export const localeTextTr: Record<string, string> = {
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
    january: 'Ocak', february: 'Şubat', march: 'Mart', april: 'Nisan',
    may: 'Mayıs', june: 'Haziran', july: 'Temmuz', august: 'Ağustos',
    september: 'Eylül', october: 'Ekim', november: 'Kasım', december: 'Aralık',
    jan: 'Oca', feb: 'Şub', mar: 'Mar', apr: 'Nis', mayShort: 'May',
    jun: 'Haz', jul: 'Tem', aug: 'Ağu', sep: 'Eyl', oct: 'Eki', nov: 'Kas', dec: 'Ara',
    sunday: 'Pazar', monday: 'Pazartesi', tuesday: 'Salı', wednesday: 'Çarşamba',
    thursday: 'Perşembe', friday: 'Cuma', saturday: 'Cumartesi',
    sun: 'Paz', mon: 'Pzt', tue: 'Sal', wed: 'Çar', thu: 'Per', fri: 'Cum', sat: 'Cmt',
    today: 'Bugün', clear: 'Temizle',
};

export const dateComparator = (filterLocalDate: Date, cellValue: string) => {
    if (cellValue == null) return -1;
    const cellDate = new Date(cellValue);
    const filterHasTime = filterLocalDate.getHours() !== 0 || filterLocalDate.getMinutes() !== 0;
    if (filterHasTime) {
        const filterTime = new Date(filterLocalDate.getFullYear(), filterLocalDate.getMonth(), filterLocalDate.getDate(), filterLocalDate.getHours(), filterLocalDate.getMinutes()).getTime();
        const cellTime = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate(), cellDate.getHours(), cellDate.getMinutes()).getTime();
        if (filterTime === cellTime) return 0;
        return cellTime < filterTime ? -1 : 1;
    }
    const filterDateOnly = new Date(filterLocalDate.getFullYear(), filterLocalDate.getMonth(), filterLocalDate.getDate()).getTime();
    const cellDateOnly = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate()).getTime();
    if (filterDateOnly === cellDateOnly) return 0;
    return cellDateOnly < filterDateOnly ? -1 : 1;
};

const formatDateCell = (params: ValueFormatterParams<Product, string>) => {
    if (!params.value) return '';
    return new Intl.DateTimeFormat('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(params.value));
};

interface UseProductGridColumnsParams {
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
    onRestore: (id: string) => void;
}

export function useProductGridColumns({ onEdit, onDelete, onRestore }: UseProductGridColumnsParams): ColDef<Product>[] {
    return useMemo<ColDef<Product>[]>(() => [
        {
            headerName: 'Durum',
            field: 'isActive',
            filter: 'entityStatusFilter',
            floatingFilter: true,
            floatingFilterComponent: 'entityStatusFloatingFilter',
            suppressHeaderMenuButton: true,
            sortable: true,
            minWidth: 100,
            cellRenderer: (params: ICellRendererParams<Product, boolean>) => {
                if (params.data?.isDeleted) return <span style={{ color: '#dc2626', fontWeight: '600' }}>Silinmiş</span>;
                return params.value ? <span style={{ color: '#16a34a', fontWeight: '600' }}>Aktif</span> : <span style={{ color: '#ca8a04', fontWeight: '600' }}>Pasif</span>;
            },
        },
        { headerName: 'Ürün Adı', field: 'name', filter: 'agTextColumnFilter', sortable: true, minWidth: 160 },
        { headerName: 'Birim', field: 'unitName', filter: 'agTextColumnFilter', sortable: true, minWidth: 80 },
        {
            headerName: 'Fiyat (TL)',
            field: 'priceAmount',
            filter: 'agNumberColumnFilter',
            sortable: true,
            minWidth: 120,
            valueFormatter: (params) => params.value != null ? String(Number(params.value).toFixed(2)) + ' TL' : '',
        },
        {
            headerName: 'Stok',
            field: 'stockQuantity',
            filter: 'agNumberColumnFilter',
            sortable: true,
            minWidth: 80,
            cellStyle: (params) => {
                if (params.value === 0) return { color: '#dc2626', fontWeight: '600' };
                if (params.value < 10) return { color: '#f59e0b', fontWeight: '600' };
                return { color: '#16a34a', fontWeight: '400' };
            },
        },
        { headerName: 'Kategori', field: 'categoryName', filter: 'agTextColumnFilter', sortable: true, minWidth: 130 },
        { headerName: 'Açıklama', field: 'description', filter: 'agTextColumnFilter', sortable: true, minWidth: 160 },
        { headerName: 'Oluşturulma Tarihi', field: 'createdAt', sortable: true, filter: 'agDateColumnFilter', filterParams: { comparator: dateComparator }, minWidth: 180, valueFormatter: formatDateCell },
        { headerName: 'Oluşturan', field: 'createdBy', sortable: true, filter: 'agTextColumnFilter', minWidth: 120 },
        { headerName: 'Güncellenme Tarihi', field: 'updatedAt', sortable: true, filter: 'agDateColumnFilter', filterParams: { comparator: dateComparator }, minWidth: 180, valueFormatter: formatDateCell },
        { headerName: 'Güncelleyen', field: 'updatedBy', sortable: true, filter: 'agTextColumnFilter', minWidth: 120 },
        { headerName: 'Silinme Tarihi', field: 'deletedAt', sortable: true, filter: false, minWidth: 180, hide: true, valueFormatter: formatDateCell },
        {
            headerName: 'İşlemler',
            field: 'id',
            sortable: false,
            filter: false,
            width: 90,
            cellRenderer: (params: ICellRendererParams<Product, string>) => {
                if (!params.data) return null;
                const isDeleted = params.data.isDeleted;
                return (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', height: '100%' }}>
                        {!isDeleted ? (
                            <>
                                <button title="Düzenle" onClick={(e) => { e.stopPropagation(); if (params.data) onEdit(params.data); }} className="p-1 rounded-md transition-colors hover:bg-green-50" style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}><Edit2 size={16} color="#1B5E3F" /></button>
                                <button title="Sil" onClick={(e) => { e.stopPropagation(); if (params.data) onDelete(params.data.id); }} className="p-1 rounded-md transition-colors hover:bg-red-50" style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}><Trash2 size={16} color="#dc2626" /></button>
                            </>
                        ) : (
                            <button title="Geri Yükle" onClick={(e) => { e.stopPropagation(); if (params.data) onRestore(params.data.id); }} className="p-1 rounded-md transition-colors hover:bg-blue-50" style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}><RotateCcw size={16} color="#2563eb" /></button>
                        )}
                    </div>
                );
            },
        },
    ], [onEdit, onDelete, onRestore]);
}
