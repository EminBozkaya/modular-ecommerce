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
    resetFilter: 'Sifirla',
    clearFilter: 'Temizle',
    dateFormatOoo: 'dd.mm.yyyy',
    dateFilterPlaceholder: 'gg.aa.yyyy',
    before: 'Once',
    after: 'Sonra',
    equals: 'Esittir',
    notEqual: 'Esit Degil',
    blank: 'Bos',
    notBlank: 'Dolu',
    contains: 'Icerir',
    notContains: 'Icermez',
    startsWith: 'Ile Baslar',
    endsWith: 'Ile Biter',
    greaterThan: 'Buyuktur',
    greaterThanOrEqual: 'Buyuktur veya Esittir',
    lessThan: 'Kucuktur',
    lessThanOrEqual: 'Kucuktur veya Esittir',
    inRange: 'Arasinda',
    inRangeStart: 'Baslangic',
    inRangeEnd: 'Bitis',
    andCondition: 'VE',
    orCondition: 'VEYA',
    sortAscending: 'Artan Siralama',
    sortDescending: 'Azalan Siralama',
    columnAutoSize: 'Otomatik Genislik',
    page: 'Sayfa',
    more: 'Daha Fazla',
    to: '-',
    of: '/',
    next: 'Sonraki',
    last: 'Son',
    first: 'Ilk',
    previous: 'Onceki',
    pageSizeSelectorLabel: 'Sayfa Boyutu:',
    loadingOoo: 'Yukleniyor...',
    noRowsToShow: 'Henuz kayit bulunamadi.',
    january: 'Ocak', february: 'Subat', march: 'Mart', april: 'Nisan',
    may: 'Mayis', june: 'Haziran', july: 'Temmuz', august: 'Agustos',
    september: 'Eylul', october: 'Ekim', november: 'Kasim', december: 'Aralik',
    jan: 'Oca', feb: 'Sub', mar: 'Mar', apr: 'Nis', mayShort: 'May',
    jun: 'Haz', jul: 'Tem', aug: 'Agu', sep: 'Eyl', oct: 'Eki', nov: 'Kas', dec: 'Ara',
    sunday: 'Pazar', monday: 'Pazartesi', tuesday: 'Sali', wednesday: 'Carsamba',
    thursday: 'Persembe', friday: 'Cuma', saturday: 'Cumartesi',
    sun: 'Paz', mon: 'Pzt', tue: 'Sal', wed: 'Car', thu: 'Per', fri: 'Cum', sat: 'Cmt',
    today: 'Bugun', clear: 'Temizle',
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
            width: 90,
            cellRenderer: (params: ICellRendererParams<Product, boolean>) => {
                if (params.data?.isDeleted) return <span style={{ color: '#dc2626', fontWeight: '600' }}>Silinmis</span>;
                return params.value ? <span style={{ color: '#16a34a', fontWeight: '600' }}>Aktif</span> : <span style={{ color: '#ca8a04', fontWeight: '600' }}>Pasif</span>;
            },
        },
        { headerName: 'Urun Adi', field: 'name', filter: 'agTextColumnFilter', sortable: true, width: 160, tooltipValueGetter: (p) => p.value ?? '' },
        { headerName: 'Birim', field: 'unitName', filter: 'agTextColumnFilter', sortable: true, width: 80, tooltipValueGetter: (p) => p.value ?? '' },
        {
            headerName: 'Fiyat (TL)',
            field: 'priceAmount',
            filter: 'agNumberColumnFilter',
            sortable: true,
            width: 100,
            valueFormatter: (params) => params.value != null ? String(Number(params.value).toFixed(2)) + ' TL' : '',
            tooltipValueGetter: (params) => params.value != null ? String(Number(params.value).toFixed(2)) + ' TL' : '',
        },
        {
            headerName: 'Stok',
            field: 'stockQuantity',
            filter: 'agNumberColumnFilter',
            sortable: true,
            width: 70,
            cellStyle: (params) => {
                if (params.value === 0) return { color: '#dc2626', fontWeight: '600' };
                if (params.value < 10) return { color: '#f59e0b', fontWeight: '600' };
                return { color: '#16a34a', fontWeight: '400' };
            },
            tooltipValueGetter: (p) => p.value != null ? String(p.value) : '',
        },
        { headerName: 'Kategori', field: 'categoryName', filter: 'agTextColumnFilter', sortable: true, width: 130, tooltipValueGetter: (p) => p.value ?? '' },
        { headerName: 'Aciklama', field: 'description', filter: 'agTextColumnFilter', sortable: true, width: 160, tooltipValueGetter: (p) => p.value ?? '' },
        { headerName: 'Olusturulma Tarihi', field: 'createdAt', sortable: true, filter: 'agDateColumnFilter', filterParams: { comparator: dateComparator }, width: 155, valueFormatter: formatDateCell, tooltipValueGetter: (p) => { if (!p.value) return ''; return new Intl.DateTimeFormat('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(p.value as string)); } },
        { headerName: 'Olusturan', field: 'createdBy', sortable: true, filter: 'agTextColumnFilter', width: 120, tooltipValueGetter: (p) => p.value ?? '' },
        { headerName: 'Guncellenme Tarihi', field: 'updatedAt', sortable: true, filter: 'agDateColumnFilter', filterParams: { comparator: dateComparator }, width: 155, valueFormatter: formatDateCell, tooltipValueGetter: (p) => { if (!p.value) return ''; return new Intl.DateTimeFormat('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(p.value as string)); } },
        { headerName: 'Guncelleyen', field: 'updatedBy', sortable: true, filter: 'agTextColumnFilter', width: 120, tooltipValueGetter: (p) => p.value ?? '' },
        { headerName: 'Silinme Tarihi', field: 'deletedAt', sortable: true, filter: false, width: 155, hide: true, valueFormatter: formatDateCell },
        {
            headerName: 'Islemler',
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
                                <button title="Duzenle" onClick={(e) => { e.stopPropagation(); if (params.data) onEdit(params.data); }} className="p-1 rounded-md transition-colors hover:bg-green-50" style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}><Edit2 size={16} color="#1B5E3F" /></button>
                                <button title="Sil" onClick={(e) => { e.stopPropagation(); if (params.data) onDelete(params.data.id); }} className="p-1 rounded-md transition-colors hover:bg-red-50" style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}><Trash2 size={16} color="#dc2626" /></button>
                            </>
                        ) : (
                            <button title="Geri Yukle" onClick={(e) => { e.stopPropagation(); if (params.data) onRestore(params.data.id); }} className="p-1 rounded-md transition-colors hover:bg-blue-50" style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}><RotateCcw size={16} color="#2563eb" /></button>
                        )}
                    </div>
                );
            },
        },
    ], [onEdit, onDelete, onRestore]);
}
