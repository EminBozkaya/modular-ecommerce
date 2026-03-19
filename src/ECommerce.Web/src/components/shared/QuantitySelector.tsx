import { useState, useRef, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';
import { getUnitConfig } from '../../utils/unitConfig';

interface QuantitySelectorProps {
    unitCode: string | null | undefined;
    unitName: string;
    value: number;
    onChange: (newValue: number) => void;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function QuantitySelector({
    unitCode,
    unitName,
    value,
    onChange,
    disabled = false,
    size = 'md',
}: QuantitySelectorProps) {
    const config = getUnitConfig(unitCode, unitName);
    const [inputValue, setInputValue] = useState(() => value.toFixed(config.decimals));
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync external value changes when not editing
    useEffect(() => {
        if (!isFocused) {
            setInputValue(value.toFixed(config.decimals));
        }
    }, [value, config.decimals, isFocused]);

    const handleDecrement = () => {
        const next = parseFloat((value - config.step).toFixed(config.decimals + 1));
        if (next >= config.min) {
            onChange(next);
        }
    };

    const handleIncrement = () => {
        const next = parseFloat((value + config.step).toFixed(config.decimals + 1));
        onChange(next);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Allow: digits, dot, backspace, delete, tab, arrows, enter
        const allowed = [
            'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight',
            'ArrowUp', 'ArrowDown', 'Enter', 'Home', 'End',
        ];
        if (allowed.includes(e.key)) {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                handleIncrement();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                handleDecrement();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                inputRef.current?.blur();
            }
            return;
        }

        // Allow digits
        if (/^\d$/.test(e.key)) return;

        // Allow single dot for decimals
        if (e.key === '.' && config.decimals > 0 && !inputValue.includes('.')) return;

        // Block everything else
        e.preventDefault();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        // Allow empty, partial inputs like "0.", "1."
        if (raw === '' || /^\d*\.?\d*$/.test(raw)) {
            setInputValue(raw);
        }
    };

    const commitValue = () => {
        setIsFocused(false);
        const parsed = parseFloat(inputValue);
        if (isNaN(parsed) || parsed < config.min) {
            onChange(config.min);
            setInputValue(config.min.toFixed(config.decimals));
        } else {
            // Snap to step
            const snapped = Math.round(parsed / config.step) * config.step;
            const clamped = Math.max(snapped, config.min);
            const final = parseFloat(clamped.toFixed(config.decimals));
            onChange(final);
            setInputValue(final.toFixed(config.decimals));
        }
    };

    const sizeClasses = {
        sm: {
            wrapper: 'h-10',
            btn: 'min-h-[44px] min-w-[44px] px-3',
            icon: 'h-4 w-4',
            input: 'text-sm w-12',
        },
        md: {
            wrapper: 'h-11',
            btn: 'min-h-[48px] min-w-[48px] px-4',
            icon: 'h-4.5 w-4.5',
            input: 'text-base w-14',
        },
        lg: {
            wrapper: 'h-12',
            btn: 'min-h-[52px] min-w-[52px] px-5',
            icon: 'h-5 w-5',
            input: 'text-lg w-16',
        },
    };

    const cls = sizeClasses[size];
    const isAtMin = value <= config.min;

    return (
        <div
            className={`inline-flex items-stretch ${cls.wrapper} rounded-xl border border-border bg-background overflow-hidden transition-all duration-200 ${isFocused ? 'ring-2 ring-[var(--brand-primary)]/30 border-[var(--brand-primary)]' : 'hover:border-border'} ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
            role="spinbutton"
            aria-valuenow={value}
            aria-valuemin={config.min}
        >
            <button
                type="button"
                onClick={handleDecrement}
                disabled={disabled || isAtMin}
                aria-label="Miktarı azalt"
                className={`${cls.btn} flex items-center justify-center bg-gray-50 dark:bg-white/5 text-muted-foreground hover:text-white hover:bg-[var(--brand-primary)] active:bg-[var(--brand-primary-dark)] transition-all duration-150 disabled:text-muted-foreground/40 disabled:hover:bg-gray-50 dark:disabled:hover:bg-white/5 border-r border-border`}
            >
                <Minus className={cls.icon} strokeWidth={2.5} />
            </button>

            <input
                ref={inputRef}
                type="text"
                inputMode="decimal"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={(e) => {
                    setIsFocused(true);
                    e.target.select();
                }}
                onBlur={commitValue}
                disabled={disabled}
                className={`${cls.input} text-center font-bold tabular-nums bg-transparent outline-none text-foreground`}
            />

            <button
                type="button"
                onClick={handleIncrement}
                disabled={disabled}
                aria-label="Miktarı artır"
                className={`${cls.btn} flex items-center justify-center bg-gray-50 dark:bg-white/5 text-muted-foreground hover:text-white hover:bg-[var(--brand-primary)] active:bg-[var(--brand-primary-dark)] transition-all duration-150 disabled:text-muted-foreground/40 disabled:hover:bg-gray-50 dark:disabled:hover:bg-white/5 border-l border-border`}
            >
                <Plus className={cls.icon} strokeWidth={2.5} />
            </button>
        </div>
    );
}
