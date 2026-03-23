import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    type ColDef,
    type ICellRendererParams,
} from 'ag-grid-community';
import { Edit2, Trash2, RotateCcw } from 'lucide-react';
import type { AdminAddress } from '../../api/adminApi';
import { SUPPORTED_LANGUAGES } from '@/i18n/languages';

interface UseAddressGridColumnsParams {
    onEdit: (address: AdminAddress) => void;
    onDelete: (id: string) => void;
    onRestore: (id: string) => void;
}

// AG Grid internal UI text — kept separate from i18n translations
// These are AG Grid filter/menu labels, not user-facing column headers
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

export function useAddressGridColumns({ onEdit, onDelete, onRestore }: UseAddressGridColumnsParams): ColDef<AdminAddress>[] {
    const { t, i18n } = useTranslation('admin');

    const currentLocale = SUPPORTED_LANGUAGES.find(l => l.code === i18n.language)?.locale ?? 'tr-TR';

    const formatDate = (value: string | undefined) => {
        if (!value) return '';
        return new Intl.DateTimeFormat(currentLocale, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(value));
    };

    return useMemo<ColDef<AdminAddress>[]>(() => [
        {
            headerName: t('addresses.grid.status'),
            field: 'isActive',
            filter: 'entityStatusFilter',
            floatingFilter: true,
            floatingFilterComponent: 'entityStatusFloatingFilter',
            suppressHeaderMenuButton: true,
            sortable: true,
            minWidth: 100,
            cellRenderer: (params: ICellRendererParams<AdminAddress, boolean>) => {
                if (params.data?.isDeleted) return <span style={{ color: '#dc2626', fontWeight: '600' }}>{t('filter.deleted')}</span>;
                return params.value
                    ? <span style={{ color: '#16a34a', fontWeight: '600' }}>{t('filter.active')}</span>
                    : <span style={{ color: '#ca8a04', fontWeight: '600' }}>{t('filter.passive')}</span>;
            },
        },
        { headerName: t('addresses.grid.user'), field: 'userFullName', filter: 'agTextColumnFilter', sortable: true, minWidth: 160 },
        { headerName: t('addresses.grid.title'), field: 'title', filter: 'agTextColumnFilter', sortable: true, minWidth: 130 },
        { headerName: t('addresses.grid.address'), field: 'fullName', filter: 'agTextColumnFilter', sortable: true, minWidth: 160 },
        { headerName: t('addresses.grid.line1'), field: 'addressLine1', filter: 'agTextColumnFilter', sortable: true, minWidth: 200 },
        { headerName: t('addresses.grid.city'), field: 'city', filter: 'agTextColumnFilter', sortable: true, minWidth: 110 },
        { headerName: t('addresses.grid.country'), field: 'country', filter: 'agTextColumnFilter', sortable: true, minWidth: 110 },
        { headerName: t('addresses.grid.postalCode'), field: 'postalCode', filter: 'agTextColumnFilter', sortable: true, minWidth: 100 },
        {
            headerName: t('addresses.grid.isDefault'),
            field: 'isDefault',
            sortable: true,
            minWidth: 100,
            cellRenderer: (params: ICellRendererParams<AdminAddress, boolean>) => {
                return params.value
                    ? <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">{t('addresses.mobile.defaultBadge')}</span>
                    : null;
            }
        },
        {
            headerName: t('addresses.grid.createdAt'),
            field: 'createdAt',
            sortable: true,
            minWidth: 160,
            valueFormatter: (params) => formatDate(params.value)
        },
        {
            headerName: t('addresses.grid.actions'),
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
                                <button title={t('buttons.updating')} onClick={(e) => { e.stopPropagation(); if (params.data) onEdit(params.data); }} className="p-1 rounded-md transition-colors hover:bg-green-50" style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}><Edit2 size={16} color="var(--brand-primary)" /></button>
                                <button title={t('common:deleted')} onClick={(e) => { e.stopPropagation(); if (params.data) onDelete(params.data.id); }} className="p-1 rounded-md transition-colors hover:bg-red-50" style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}><Trash2 size={16} color="#dc2626" /></button>
                            </>
                        ) : (
                            <button title={t('buttons.restore')} onClick={(e) => { e.stopPropagation(); if (params.data) onRestore(params.data.id); }} className="p-1 rounded-md transition-colors hover:bg-blue-50" style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}><RotateCcw size={16} color="#2563eb" /></button>
                        )}
                    </div>
                );
            },
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ], [t, currentLocale, onEdit, onDelete, onRestore]);
}
