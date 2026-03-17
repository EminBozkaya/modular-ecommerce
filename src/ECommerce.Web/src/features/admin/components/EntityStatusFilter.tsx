import { useState, useCallback, useEffect } from 'react';
import { useGridFilter } from 'ag-grid-react';
import type { CustomFilterProps, CustomFloatingFilterProps } from 'ag-grid-react';

type EntityStatusKey = 'Active' | 'Passive' | 'Deleted';

interface StatusOption {
    key: EntityStatusKey;
    label: string;
    color: string;
}

const statusOptions: StatusOption[] = [
    { key: 'Active', label: 'Aktif', color: '#16a34a' },
    { key: 'Passive', label: 'Pasif', color: '#ca8a04' },
    { key: 'Deleted', label: 'Silinmiş', color: '#dc2626' },
];

const statusLabelMap: Record<EntityStatusKey, string> = {
    Active: 'Aktif',
    Passive: 'Pasif',
    Deleted: 'Silinmiş',
};

export interface EntityStatusFilterModel {
    searchText: string;
    checkedStatuses: EntityStatusKey[] | null; // null = Tümü (show all)
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
    const [filterModel, setFilterModel] = useState<EntityStatusFilterModel>(model ?? DEFAULT_MODEL);

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
                const search = filterModel.searchText.toLocaleLowerCase('tr-TR');
                if (!label.toLocaleLowerCase('tr-TR').includes(search)) return false;
            }

            if (filterModel.checkedStatuses !== null) {
                if (filterModel.checkedStatuses.length === 0) return false;
                if (!filterModel.checkedStatuses.includes(key)) return false;
            }

            return true;
        },
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
            update({ ...filterModel, checkedStatuses: next.length === statusOptions.length ? null : next });
        }
    };

    const handleTumu = () => {
        update({ ...filterModel, checkedStatuses: null });
    };

    return (
        <div style={{ padding: '10px 12px', minWidth: '160px', fontFamily: 'inherit' }}>
            {statusOptions.map((opt) => {
                const isChecked = !isTumu && checkedSet.has(opt.key);
                return (
                    <label
                        key={opt.key}
                        className="flex items-center gap-2 px-1 py-[5px] rounded cursor-pointer hover:bg-gray-50 transition-colors"
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

            <hr className="my-2 border-gray-200" />

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

export default EntityStatusFilter;
