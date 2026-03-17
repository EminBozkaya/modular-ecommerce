import { useState, useCallback, useEffect } from 'react';
import { useGridFilter } from 'ag-grid-react';
import type { CustomFilterProps, CustomFloatingFilterProps } from 'ag-grid-react';
import type { OrderStatus } from '../../ordering/types/order';

interface StatusOption {
    key: OrderStatus | 'Deleted';
    label: string;
    color: string;
}

const statusOptions: StatusOption[] = [
    { key: 'Pending', label: 'Beklemede', color: '#6b7280' },
    { key: 'Processing', label: 'İşleniyor', color: '#ca8a04' },
    { key: 'Paid', label: 'Ödendi', color: '#2563eb' },
    { key: 'Shipped', label: 'Kargoda', color: '#7c3aed' },
    { key: 'Delivered', label: 'Teslim Edildi', color: '#16a34a' },
    { key: 'Cancelled', label: 'İptal', color: '#dc2626' },
    { key: 'Refunded', label: 'İade', color: '#ea580c' },
    { key: 'Deleted', label: 'Silinmiş', color: '#991b1b' },
];

const statusLabelMap: Record<string, string> = Object.fromEntries(
    statusOptions.map(s => [s.key, s.label])
);

export interface OrderStatusFilterModel {
    searchText: string;
    checkedStatuses: string[] | null; // null = Tümü (show all)
}

const DEFAULT_MODEL: OrderStatusFilterModel = { searchText: '', checkedStatuses: null };

function hasActiveFilter(m: OrderStatusFilterModel): boolean {
    return m.searchText !== '' || m.checkedStatuses !== null;
}

// ── Parent Filter — Checkbox Popup ──
export const OrderStatusFilter = ({ model, onModelChange }: CustomFilterProps) => {
    const [filterModel, setFilterModel] = useState<OrderStatusFilterModel>(model ?? DEFAULT_MODEL);

    useEffect(() => {
        setFilterModel(model ?? DEFAULT_MODEL);
    }, [model]);

    const doesFilterPass = useCallback(
        (params: { data: { status?: OrderStatus; isDeleted?: boolean } }) => {
            const { data } = params;
            if (!data) return false;

            const rowKey = data.isDeleted ? 'Deleted' : (data.status ?? '');
            const rowLabel = statusLabelMap[rowKey] ?? '';

            // Text search
            if (filterModel.searchText) {
                const search = filterModel.searchText.toLocaleLowerCase('tr-TR');
                const label = rowLabel.toLocaleLowerCase('tr-TR');
                if (!label.includes(search)) return false;
            }

            // Checkbox filter
            if (filterModel.checkedStatuses !== null) {
                if (filterModel.checkedStatuses.length === 0) return false;
                if (!filterModel.checkedStatuses.includes(rowKey)) return false;
            }

            return true;
        },
        [filterModel],
    );

    useGridFilter({ doesFilterPass });

    const isTumu = filterModel.checkedStatuses === null;
    const checkedSet = new Set(filterModel.checkedStatuses ?? []);

    const update = (next: OrderStatusFilterModel) => {
        setFilterModel(next);
        onModelChange(hasActiveFilter(next) ? next : null);
    };

    const handleToggle = (key: string) => {
        if (isTumu) {
            update({ ...filterModel, checkedStatuses: [key] });
        } else if (checkedSet.has(key)) {
            const remaining = filterModel.checkedStatuses!.filter(s => s !== key);
            update({ ...filterModel, checkedStatuses: remaining.length === 0 ? null : remaining });
        } else {
            const next = [...filterModel.checkedStatuses!, key];
            update({ ...filterModel, checkedStatuses: next.length === statusOptions.length ? null : next });
        }
    };

    const handleTumu = () => {
        update({ ...filterModel, checkedStatuses: null });
    };

    return (
        <div style={{ padding: '10px 12px', minWidth: '190px', fontFamily: 'inherit' }}>
            {statusOptions.map((opt) => {
                const isChecked = !isTumu && checkedSet.has(opt.key);
                return (
                    <label
                        key={opt.key}
                        className="flex items-center gap-2 px-1 py-[5px] rounded cursor-pointer hover:bg-accent transition-colors"
                    >
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggle(opt.key)}
                            style={{ accentColor: opt.color, width: 14, height: 14, cursor: 'pointer' }}
                        />
                        <span
                            style={{
                                color: isChecked ? opt.color : '#374151',
                                fontWeight: isChecked ? 600 : 400,
                                fontSize: '13px',
                            }}
                        >
                            {opt.label}
                        </span>
                    </label>
                );
            })}

            <hr className="my-2 border-border" />

            <label className="flex items-center gap-2 px-1 py-[5px] rounded cursor-pointer hover:bg-green-50 transition-colors">
                <input
                    type="checkbox"
                    checked={isTumu}
                    onChange={handleTumu}
                    style={{ accentColor: 'var(--brand-primary)', width: 14, height: 14, cursor: 'pointer' }}
                />
                <span style={{ color: 'var(--brand-primary)', fontWeight: 600, fontSize: '13px' }}>Tümü</span>
            </label>
        </div>
    );
};

// ── Floating Filter — Text Input ──
export const OrderStatusFloatingFilter = ({ model, onModelChange }: CustomFloatingFilterProps) => {
    const current: OrderStatusFilterModel = model ?? DEFAULT_MODEL;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchText = e.target.value;
        const next: OrderStatusFilterModel = { ...current, searchText };
        onModelChange(hasActiveFilter(next) ? next : null);
    };

    return (
        <div className="flex items-center w-full h-full px-0.5">
            <input
                type="text"
                value={current.searchText}
                onChange={handleChange}
                placeholder="Durum ara..."
                className="ag-input-field-input ag-text-field-input"
                style={{
                    width: '100%',
                    height: '24px',
                    fontSize: '12px',
                    padding: '0 6px',
                    border: '1px solid #babfc7',
                    borderRadius: '3px',
                    outline: 'none',
                    backgroundColor: 'white',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--brand-primary)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#babfc7'; }}
            />
        </div>
    );
};

export default OrderStatusFilter;
