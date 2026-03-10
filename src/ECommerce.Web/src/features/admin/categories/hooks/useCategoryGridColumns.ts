import { useMemo } from 'react';
import {
    type ColDef,
    type ICellRendererParams,
    type ValueFormatterParams,
} from 'ag-grid-community';
import { Edit2, Trash2, RotateCcw } from 'lucide-react';
import type { Category } from '../../../catalog/types/product';

// ── AG Grid locale (Turkish) ──────────────────────────────────────────────────
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

// ── Date comparator ───────────────────────────────────────────────────────────
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
    }

    const filterDateOnly = new Date(
        filterLocalDate.getFullYear(), filterLocalDate.getMonth(), filterLocalDate.getDate()
    ).getTime();
    const cellDateOnly = new Date(
        cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate()
    ).getTime();
    if (filterDateOnly === cellDateOnly) return 0;
    return cellDateOnly < filterDateOnly ? -1 : 1;
};

// ── Date value formatter ──────────────────────────────────────────────────────
const formatDateCell = (params: ValueFormatterParams<Category, string>) => {
    if (!params.value) return '';
    return new Intl.DateTimeFormat('tr-TR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
    }).format(new Date(params.value));
};

// ── Hook ──────────────────────────────────────────────────────────────────────
interface UseCategoryGridColumnsParams {
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
    onRestore: (id: string) => void;
}

export function useCategoryGridColumns({
    onEdit,
    onDelete,
    onRestore,
}: UseCategoryGridColumnsParams): ColDef<Category>[] {
    return useMemo<ColDef<Category>[]>(() => [
        {
            headerName: 'Durum',
            field: 'isActive',
            filter: 'statusFilter',
            floatingFilter: true,
            floatingFilterComponent: 'statusFilterSummary',
            suppressHeaderMenuButton: true,
            suppressFloatingFilterButton: true,
            suppressMenu: true,
            menuTabs: [],
            sortable: true,
            width: 155,
            minWidth: 155,
            cellRenderer: (params: ICellRendererParams<Category>) => {
                if (params.data?.isDeleted) return <span style={{ color: '#dc2626', fontWeight: '600' }}>Silinmiş</span>;
                return params.value
                    ? <span style={{ color: '#16a34a', fontWeight: '600' }}>Aktif</span>
                    : <span style={{ color: '#ca8a04', fontWeight: '600' }}>Pasif</span>;
            },
        },
        {
            headerName: 'Kategori Adı',
            field: 'name',
            filter: 'agTextColumnFilter',
            sortable: true,
            flex: 2,
            minWidth: 150,
        },
        {
            headerName: 'Üst Kategori',
            field: 'parentCategoryName',
            filter: 'agTextColumnFilter',
            sortable: true,
            flex: 2,
            minWidth: 150,
            cellRenderer: (params: { value?: string | null }) =>
                params.value
                    ? <span className="text-gray-600">{params.value}</span>
                    : <span className="text-gray-400 italic">Ana Kategori</span>,
        },
        {
            headerName: 'Oluşturulma Tarihi',
            field: 'createdAt',
            sortable: true,
            filter: 'agDateColumnFilter',
            filterParams: { comparator: dateComparator },
            width: 180,
            valueFormatter: formatDateCell,
        },
        {
            headerName: 'Oluşturan',
            field: 'createdBy',
            sortable: true,
            filter: 'agTextColumnFilter',
            width: 150,
        },
        {
            headerName: 'Güncellenme Tarihi',
            field: 'updatedAt',
            sortable: true,
            filter: 'agDateColumnFilter',
            filterParams: { comparator: dateComparator },
            width: 180,
            valueFormatter: formatDateCell,
        },
        {
            headerName: 'Güncelleyen',
            field: 'updatedBy',
            sortable: true,
            filter: 'agTextColumnFilter',
            width: 150,
        },
        {
            headerName: 'Silinme Tarihi',
            field: 'deletedAt',
            sortable: true,
            filter: false,
            width: 180,
            hide: true,
            valueFormatter: formatDateCell,
        },
        {
            headerName: 'İşlemler',
            field: 'id',
            sortable: false,
            filter: false,
            width: 120,
            cellRenderer: (params: ICellRendererParams<Category>) => {
                if (!params.data) return null;
                const isDeleted = params.data.isDeleted;
                return (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', height: '100%' }}>
                        {!isDeleted ? (
                            <>
                                <button
                                    title="Düzenle"
                                    onClick={(e) => { e.stopPropagation(); if (params.data) onEdit(params.data); }}
                                    className="p-1 rounded-md transition-colors hover:bg-green-50"
                                    style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}
                                >
                                    <Edit2 size={16} color="#1B5E3F" />
                                </button>
                                <button
                                    title="Sil"
                                    onClick={(e) => { e.stopPropagation(); if (params.data) onDelete(params.data.id); }}
                                    className="p-1 rounded-md transition-colors hover:bg-red-50"
                                    style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}
                                >
                                    <Trash2 size={16} color="#dc2626" />
                                </button>
                            </>
                        ) : (
                            <button
                                title="Geri Yükle"
                                onClick={(e) => { e.stopPropagation(); if (params.data) onRestore(params.data.id); }}
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
