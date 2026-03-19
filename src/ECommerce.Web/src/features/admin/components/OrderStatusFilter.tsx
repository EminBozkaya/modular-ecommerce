import { useState, useCallback, useEffect } from 'react';
import { useGridFilter } from 'ag-grid-react';
import type { CustomFilterProps, CustomFloatingFilterProps } from 'ag-grid-react';
import type { OrderStatus } from '../../ordering/types/order';
import { useTranslation } from 'react-i18next';

interface StatusOption {
    key: OrderStatus | 'Deleted';
    color: string;
}

const statusOptionDefs: StatusOption[] = [
    { key: 'Pending', color: '#6b7280' },
    { key: 'Processing', color: '#ca8a04' },
    { key: 'Paid', color: '#2563eb' },
    { key: 'Shipped', color: '#7c3aed' },
    { key: 'Delivered', color: '#16a34a' },
    { key: 'Cancelled', color: '#dc2626' },
    { key: 'Refunded', color: '#ea580c' },
    { key: 'Deleted', color: '#991b1b' },
];

export interface OrderStatusFilterModel {
    searchText: string;
    checkedStatuses: string[] | null; // null = All (show all)
}

const DEFAULT_MODEL: OrderStatusFilterModel = { searchText: '', checkedStatuses: null };

function hasActiveFilter(m: OrderStatusFilterModel): boolean {
    return m.searchText !== '' || m.checkedStatuses !== null;
}

// ── Parent Filter — Checkbox Popup ──
export const OrderStatusFilter = ({ model, onModelChange }: CustomFilterProps) => {
    const { t } = useTranslation('admin');
    const [filterModel, setFilterModel] = useState<OrderStatusFilterModel>(model ?? DEFAULT_MODEL);

    const statusLabelMap: Record<string, string> = {
        Pending: t('status.Pending'),
        Processing: t('status.Processing'),
        Paid: t('status.Paid'),
        Shipped: t('status.Shipped'),
        Delivered: t('status.Delivered'),
        Cancelled: t('status.Cancelled'),
        Refunded: t('status.Refunded'),
        Deleted: t('filter.deleted'),
    };

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
                const search = filterModel.searchText.toLocaleLowerCase();
                const label = rowLabel.toLocaleLowerCase();
                if (!label.includes(search)) return false;
            }

            // Checkbox filter
            if (filterModel.checkedStatuses !== null) {
                if (filterModel.checkedStatuses.length === 0) return false;
                if (!filterModel.checkedStatuses.includes(rowKey)) return false;
            }

            return true;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            update({ ...filterModel, checkedStatuses: next.length === statusOptionDefs.length ? null : next });
        }
    };

    const handleTumu = () => {
        update({ ...filterModel, checkedStatuses: null });
    };

    return (
        <div className="bg-popover text-popover-foreground" style={{ padding: '10px 12px', minWidth: '190px', fontFamily: 'inherit' }}>
            {statusOptionDefs.map((opt) => {
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
                                color: isChecked ? opt.color : undefined,
                                fontWeight: isChecked ? 600 : 400,
                                fontSize: '13px',
                            }}
                        >
                            {statusLabelMap[opt.key]}
                        </span>
                    </label>
                );
            })}

            <hr className="my-2 border-border" />

            <label className="flex items-center gap-2 px-1 py-[5px] rounded cursor-pointer hover:bg-accent transition-colors">
                <input
                    type="checkbox"
                    checked={isTumu}
                    onChange={handleTumu}
                    style={{ accentColor: 'var(--brand-primary)', width: 14, height: 14, cursor: 'pointer' }}
                />
                <span style={{ color: 'var(--brand-primary)', fontWeight: 600, fontSize: '13px' }}>{t('filter.all')}</span>
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
                placeholder="..."
                className="ag-input-field-input ag-text-field-input w-full h-6 text-xs px-1.5 rounded-sm outline-none bg-transparent border border-border text-foreground placeholder:text-muted-foreground focus:border-[var(--brand-primary)]"
            />
        </div>
    );
};

export default OrderStatusFilter;
