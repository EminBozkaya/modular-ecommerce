import { useState, useCallback, useEffect } from 'react';
import { useGridFilter } from 'ag-grid-react';
import type { CustomFloatingFilterProps, IRowNode } from 'ag-grid-react';

const StatusToggleFilter = ({ onModelChange, model }: CustomFloatingFilterProps) => {
    // Initial state: all ON as requested
    const [filterState, setFilterState] = useState(model || {
        active: true,
        passive: true,
        deleted: true
    });

    // Update state when model changes from outside (e.g. grid API)
    useEffect(() => {
        if (model) {
            setFilterState(model);
        }
    }, [model]);

    const doesFilterPass = useCallback((params: { node: IRowNode; data: Record<string, unknown> }) => {
        const { data } = params;
        if (!data) return false;

        if (data.isDeleted) return filterState.deleted;
        if (data.isActive) return filterState.active;
        return filterState.passive;
    }, [filterState]);

    // Use modern hook for filtering logic
    useGridFilter({
        doesFilterPass,
    });

    const toggle = (key: keyof typeof filterState) => {
        const newState = { ...filterState, [key]: !filterState[key] };
        setFilterState(newState);

        // Notify grid of changes
        // Default is all ON. If anything is OFF, model is active.
        const isActive = !newState.active || !newState.passive || !newState.deleted;
        onModelChange(isActive ? newState : null);
    };

    const ToggleSwitch = ({
        label,
        isOn,
        onClick,
        activeColor
    }: {
        label: string,
        isOn: boolean,
        onClick: () => void,
        activeColor: string
    }) => (
        <div
            className="flex flex-col items-center gap-1 cursor-pointer select-none group"
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            <span className={`text-[9px] font-bold uppercase transition-colors ${isOn ? 'text-gray-700' : 'text-gray-300'}`}>
                {label}
            </span>
            <div
                className={`relative w-8 h-4 rounded-full transition-all duration-300 ease-in-out border ${isOn ? 'border-transparent shadow-sm' : 'bg-gray-100 border-gray-200'
                    }`}
                style={{ backgroundColor: isOn ? activeColor : undefined }}
            >
                <div
                    className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-md transition-all duration-300 transform ${isOn ? 'translate-x-4.5' : 'translate-x-0.5'
                        }`}
                />
            </div>
        </div>
    );

    return (
        <div className="flex items-center justify-around w-full h-full px-1 py-1 bg-white/50 backdrop-blur-sm">
            <ToggleSwitch
                label="Aktif"
                isOn={filterState.active}
                onClick={() => toggle('active')}
                activeColor="#16a34a"
            />
            <ToggleSwitch
                label="Pasif"
                isOn={filterState.passive}
                onClick={() => toggle('passive')}
                activeColor="#ca8a04"
            />
            <ToggleSwitch
                label="Silinmiş"
                isOn={filterState.deleted}
                onClick={() => toggle('deleted')}
                activeColor="#dc2626"
            />
        </div>
    );
};

export default StatusToggleFilter;
