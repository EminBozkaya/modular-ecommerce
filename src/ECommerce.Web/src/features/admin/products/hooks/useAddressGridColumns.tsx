import { useMemo } from 'react';
import {
    type ColDef,
    type ICellRendererParams,
} from 'ag-grid-community';
import { Edit2, Trash2, RotateCcw } from 'lucide-react';
import type { AdminAddress } from '../../api/adminApi';

interface UseAddressGridColumnsParams {
    onEdit: (address: AdminAddress) => void;
    onDelete: (id: string) => void;
    onRestore: (id: string) => void;
}

export const localeTextTr: Record<string, string> = {
    filterOoo: 'Filtrele...',
    applyFilter: 'Uygula',
    resetFilter: 'Sıfırla',
    clearFilter: 'Temizle',
    contains: 'İçerir',
    notContains: 'İçermez',
    startsWith: 'İle Başlar',
    endsWith: 'İle Biter',
    equals: 'Eşittir',
    notEqual: 'Eşit Değil',
    blank: 'Boş',
    notBlank: 'Dolu',
    noRowsToShow: 'Henüz kayıt bulunamadı.',
    loadingOoo: 'Yükleniyor...',
};

const formatDate = (value: string | undefined) => {
    if (!value) return '';
    return new Intl.DateTimeFormat('tr-TR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(value));
};

export function useAddressGridColumns({ onEdit, onDelete, onRestore }: UseAddressGridColumnsParams): ColDef<AdminAddress>[] {
    return useMemo<ColDef<AdminAddress>[]>(() => [
        {
            headerName: 'Durum',
            field: 'isActive',
            filter: 'entityStatusFilter',
            floatingFilter: true,
            floatingFilterComponent: 'entityStatusFloatingFilter',
            suppressHeaderMenuButton: true,
            sortable: true,
            minWidth: 100,
            cellRenderer: (params: ICellRendererParams<AdminAddress, boolean>) => {
                if (params.data?.isDeleted) return <span style={{ color: '#dc2626', fontWeight: '600' }}>Silinmiş</span>;
                return params.value ? <span style={{ color: '#16a34a', fontWeight: '600' }}>Aktif</span> : <span style={{ color: '#ca8a04', fontWeight: '600' }}>Pasif</span>;
            },
        },
        { headerName: 'Kullanıcı', field: 'userFullName', filter: 'agTextColumnFilter', sortable: true, minWidth: 160 },
        { headerName: 'Başlık', field: 'title', filter: 'agTextColumnFilter', sortable: true, minWidth: 130 },
        { headerName: 'Alıcı Ad Soyad', field: 'fullName', filter: 'agTextColumnFilter', sortable: true, minWidth: 160 },
        { headerName: 'Adres Satırı 1', field: 'addressLine1', filter: 'agTextColumnFilter', sortable: true, minWidth: 200 },
        { headerName: 'Şehir', field: 'city', filter: 'agTextColumnFilter', sortable: true, minWidth: 110 },
        { headerName: 'Ülke', field: 'country', filter: 'agTextColumnFilter', sortable: true, minWidth: 110 },
        { headerName: 'Posta Kodu', field: 'postalCode', filter: 'agTextColumnFilter', sortable: true, minWidth: 100 },
        {
            headerName: 'Varsayılan',
            field: 'isDefault',
            sortable: true,
            minWidth: 100,
            cellRenderer: (params: ICellRendererParams<AdminAddress, boolean>) => {
                return params.value ? <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">Evet</span> : null;
            }
        },
        {
            headerName: 'Oluşturulma',
            field: 'createdAt',
            sortable: true,
            minWidth: 160,
            valueFormatter: (params) => formatDate(params.value)
        },
        {
            headerName: 'İşlemler',
            field: 'id',
            sortable: false,
            filter: false,
            width: 90,
            cellRenderer: (params: ICellRendererParams<AdminAddress, string>) => {
                if (!params.data) return null;
                const isDeleted = params.data.isDeleted;
                return (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', height: '100%' }}>
                        {!isDeleted ? (
                            <>
                                <button title="Düzenle" onClick={(e) => { e.stopPropagation(); if (params.data) onEdit(params.data); }} className="p-1 rounded-md transition-colors hover:bg-green-50" style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}><Edit2 size={16} color="var(--brand-primary)" /></button>
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
