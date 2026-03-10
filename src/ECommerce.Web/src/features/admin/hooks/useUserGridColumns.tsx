import { useMemo } from 'react';
import {
    type ColDef,
    type ICellRendererParams,
    type ValueFormatterParams,
} from 'ag-grid-community';
import { Edit2, Trash2, RotateCcw } from 'lucide-react';
import type { AdminUser } from '../types/adminUser';

export const localeTextTr: Record<string, string> = {
    filterOoo: 'Filtrele...',
    applyFilter: 'Uygula',
    resetFilter: 'Sifirla',
    clearFilter: 'Temizle',
    dateFormatOoo: 'dd.mm.yyyy',
    dateFilterPlaceholder: 'gg.aa.yyyy',
    before: 'Once', after: 'Sonra',
    equals: 'Esittir', notEqual: 'Esit Degil',
    blank: 'Bos', notBlank: 'Dolu',
    contains: 'Icerir', notContains: 'Icermez',
    startsWith: 'Ile Baslar', endsWith: 'Ile Biter',
    greaterThan: 'Buyuktur', greaterThanOrEqual: 'Buyuktur veya Esittir',
    lessThan: 'Kucuktur', lessThanOrEqual: 'Kucuktur veya Esittir',
    inRange: 'Arasinda', inRangeStart: 'Baslangic', inRangeEnd: 'Bitis',
    andCondition: 'VE', orCondition: 'VEYA',
    sortAscending: 'Artan Siralama', sortDescending: 'Azalan Siralama',
    columnAutoSize: 'Otomatik Genislik',
    page: 'Sayfa', more: 'Daha Fazla', to: '-', of: '/',
    next: 'Sonraki', last: 'Son', first: 'Ilk', previous: 'Onceki',
    pageSizeSelectorLabel: 'Sayfa Boyutu:',
    loadingOoo: 'Yukleniyor...',
    noRowsToShow: 'Henuz kayit bulunamadi.',
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

interface UseUserGridColumnsParams {
    onEdit: (user: AdminUser) => void;
    onDelete: (id: string, fullName: string) => void;
    onRestore: (id: string) => void;
}

export function useUserGridColumns({ onEdit, onDelete, onRestore }: UseUserGridColumnsParams): ColDef<AdminUser>[] {
    return useMemo<ColDef<AdminUser>[]>(() => [
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
            cellRenderer: (params: ICellRendererParams<AdminUser, boolean>) => {
                if (params.data?.isDeleted) return <span style={{ color: '#dc2626', fontWeight: '600' }}>Silinmis</span>;
                return params.value ? <span style={{ color: '#16a34a', fontWeight: '600' }}>Aktif</span> : <span style={{ color: '#ca8a04', fontWeight: '600' }}>Pasif</span>;
            },
        },
        { headerName: 'Ad Soyad', field: 'fullName', filter: 'agTextColumnFilter', sortable: true, width: 200 },
        { headerName: 'E-posta', field: 'email', filter: 'agTextColumnFilter', sortable: true, width: 250 },
        {
            headerName: 'Rol',
            field: 'role',
            filter: 'agTextColumnFilter',
            sortable: true,
            width: 120,
            cellRenderer: (params: ICellRendererParams<AdminUser, string>) => {
                if (!params.value) return '';
                const isAdmin = params.value === 'Admin';
                return (
                    <span style={{ color: isAdmin ? '#7c3aed' : '#374151', backgroundColor: isAdmin ? '#f5f3ff' : '#f3f4f6', padding: '2px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600 }}>
                        {isAdmin ? 'Yonetici' : 'Musteri'}
                    </span>
                );
            },
        },
        {
            headerName: 'E-posta Onayı',
            field: 'isEmailConfirmed',
            filter: 'agTextColumnFilter',
            sortable: true,
            width: 140,
            cellRenderer: (params: ICellRendererParams<AdminUser, boolean>) => {
                const confirmed = params.value;
                return (
                    <span style={{ color: confirmed ? '#16a34a' : '#6b7280', backgroundColor: confirmed ? '#f0fdf4' : '#f3f4f6', padding: '2px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600 }}>
                        {confirmed ? 'Onaylı' : 'Onaysız'}
                    </span>
                );
            },
            filterParams: {
                valueFormatter: (params: ValueFormatterParams<AdminUser, boolean>) => params.value ? 'Onaylı' : 'Onaysız',
            },
        },
        {
            headerName: 'Kayit Tarihi',
            field: 'createdAt',
            sortable: true,
            filter: 'agDateColumnFilter',
            filterParams: { comparator: dateComparator },
            width: 180,
            valueFormatter: (params: ValueFormatterParams<AdminUser, string>) => {
                if (!params.value) return '';
                return new Intl.DateTimeFormat('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(params.value));
            },
        },
        {
            headerName: 'Islemler',
            field: 'id',
            sortable: false,
            filter: false,
            width: 120,
            cellRenderer: (params: ICellRendererParams<AdminUser, string>) => {
                if (!params.data) return null;
                const isDeleted = params.data.isDeleted;
                return (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', height: '100%' }}>
                        {!isDeleted ? (
                            <>
                                <button title="Duzenle" onClick={(e) => { e.stopPropagation(); if (params.data) onEdit(params.data); }} className="p-1 rounded-md transition-colors hover:bg-green-50" style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}><Edit2 size={16} color="#1B5E3F" /></button>
                                <button title="Sil" onClick={(e) => { e.stopPropagation(); if (params.data) onDelete(params.data.id, params.data.fullName); }} className="p-1 rounded-md transition-colors hover:bg-red-50" style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}><Trash2 size={16} color="#dc2626" /></button>
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
