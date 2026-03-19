import { useState, useCallback, useEffect } from 'react';
import { useGridFilter } from 'ag-grid-react';
import type { CustomFilterProps, CustomFloatingFilterProps } from 'ag-grid-react';
import { useTranslation } from 'react-i18next';

type EntityStatusKey = 'Active' | 'Passive' | 'Deleted';

interface StatusOption {
    key: EntityStatusKey;
    color: string;
}

const statusOptionDefs: StatusOption[] = [
    { key: 'Active', color: '#16a34a' },
    { key: 'Passive', color: '#ca8a04' },
    { key: 'Deleted', color: '#dc2626' },
];

export interface EntityStatusFilterModel {
    searchText: string;
    checkedStatuses: EntityStatusKey[] | null; // null = All (show all)
}

const DEFAULT_MODEL: EntityStatusFilterModel = { searchText: '', checkedStatuses: null };

function hasActiveFilter(m: EntityStatusFilterModel): boolean {
    return m.searchText !== '' || m.checkedStatuses !== null;
}

function rowKey(data: { isActive?: boolean; isDeleted?: boolean }): EntityStatusKey {
    if (data.isDeleted) return 'Deleted';
    return data.isActive ? 'Active' : 'Passive';
}

// ── Parent Filter — Checkbox Popup ──
export const EntityStatusFilter = ({ model, onModelChange }: CustomFilterProps) => {
    const { t } = useTranslation('admin');
    const [filterModel, setFilterModel] = useState<EntityStatusFilterModel>(model ?? DEFAULT_MODEL);

    const statusLabelMap: Record<EntityStatusKey, string> = {
        Active: t('filter.active'),
        Passive: t('filter.passive'),
        Deleted: t('filter.deleted'),
    };

    useEffect(() => {
        setFilterModel(model ?? DEFAULT_MODEL);
    }, [model]);

    const doesFilterPass = useCallback(
        (params: { data: { isActive?: boolean; isDeleted?: boolean } }) => {
            const { data } = params;
            if (!data) return false;

            const key = rowKey(data);
            const label = statusLabelMap[key];

            if (filterModel.searchText) {
                const search = filterModel.searchText.toLocaleLowerCase();
                if (!label.toLocaleLowerCase().includes(search)) return false;
            }

            if (filterModel.checkedStatuses !== null) {
                if (filterModel.checkedStatuses.length === 0) return false;
                if (!filterModel.checkedStatuses.includes(key)) return false;
            }

            return true;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [filterModel],
    );

    useGridFilter({ doesFilterPass });

    const isTumu = filterModel.checkedStatuses === null;
    const checkedSet = new Set(filterModel.checkedStatuses ?? []);

    const update = (next: EntityStatusFilterModel) => {
        setFilterModel(next);
        onModelChange(hasActiveFilter(next) ? next : null);
    };

    const handleToggle = (key: EntityStatusKey) => {
        if (isTumu) {
            update({ ...filterModel, checkedStatuses: [key] });
        } else if (checkedSet.has(key)) {
            const remaining = (filterModel.checkedStatuses ?? []).filter(s => s !== key);
            update({ ...filterModel, checkedStatuses: remaining.length === 0 ? null : remaining });
        } else {
            const next = [...(filterModel.checkedStatuses ?? []), key] as EntityStatusKey[];
            update({ ...filterModel, checkedStatuses: next.length === statusOptionDefs.length ? null : next });
        }
    };

    const handleTumu = () => {
        update({ ...filterModel, checkedStatuses: null });
    };

    return (
        <div className="bg-popover text-popover-foreground" style={{ padding: '10px 12px', minWidth: '160px', fontFamily: 'inherit' }}>
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
export const EntityStatusFloatingFilter = ({ model, onModelChange }: CustomFloatingFilterProps) => {
    const current: EntityStatusFilterModel = model ?? DEFAULT_MODEL;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchText = e.target.value;
        const next: EntityStatusFilterModel = { ...current, searchText };
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

export default EntityStatusFilter;
