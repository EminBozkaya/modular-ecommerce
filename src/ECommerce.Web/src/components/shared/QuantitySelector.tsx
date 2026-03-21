import { useState, useRef, useEffect, useCallback } from 'react';
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

// Long-press acceleration thresholds
const LONG_PRESS_INITIAL_DELAY_MS = 500;   // delay before auto-repeat begins
const SPEED_TIER_1_MS = 300;               // repeat interval during slow phase (0.5s – 1.5s)
const SPEED_TIER_2_MS = 150;               // repeat interval during medium phase (1.5s – 3s)
const SPEED_TIER_3_MS = 80;               // repeat interval during fast phase (3s+)
const TIER_2_THRESHOLD_MS = 1500;          // when to switch to medium speed
const TIER_3_THRESHOLD_MS = 3000;          // when to switch to fast speed + bigStep

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

    // Long-press state
    const pressStartRef = useRef<number>(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const currentValueRef = useRef(value);

    // Keep currentValueRef in sync so interval callbacks always read fresh value
    useEffect(() => {
        currentValueRef.current = value;
    }, [value]);

    // Sync external value changes when not editing
    useEffect(() => {
        if (!isFocused) {
            setInputValue(value.toFixed(config.decimals));
        }
    }, [value, config.decimals, isFocused]);

    const stopAutoRepeat = useCallback(() => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    // Clean up on unmount
    useEffect(() => () => stopAutoRepeat(), [stopAutoRepeat]);

    /** Compute a new value clamped to min, rounded to config precision. */
    const computeStep = useCallback(
        (current: number, direction: 1 | -1, useBigStep: boolean): number => {
            const step = useBigStep ? config.bigStep : config.step;
            const raw = current + direction * step;
            const rounded = parseFloat(raw.toFixed(config.decimals + 1));
            return direction === -1 ? Math.max(rounded, config.min) : rounded;
        },
        [config],
    );

    const handleDecrement = useCallback(() => {
        const next = computeStep(currentValueRef.current, -1, false);
        if (next >= config.min) onChange(next);
    }, [computeStep, config.min, onChange]);

    const handleIncrement = useCallback(() => {
        const next = computeStep(currentValueRef.current, 1, false);
        onChange(next);
    }, [computeStep, onChange]);

    /** Start the auto-repeat loop after the initial delay. */
    const startAutoRepeat = useCallback(
        (direction: 1 | -1) => {
            pressStartRef.current = Date.now();

            const tick = () => {
                const elapsed = Date.now() - pressStartRef.current;
                const useBigStep = elapsed >= TIER_3_THRESHOLD_MS;
                const next = computeStep(currentValueRef.current, direction, useBigStep);
                if (direction === -1 && currentValueRef.current <= config.min) return;
                onChange(next);

                // Adjust interval speed based on elapsed time
                const targetInterval =
                    elapsed >= TIER_3_THRESHOLD_MS
                        ? SPEED_TIER_3_MS
                        : elapsed >= TIER_2_THRESHOLD_MS
                          ? SPEED_TIER_2_MS
                          : SPEED_TIER_1_MS;

                if (intervalRef.current !== null) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = setInterval(tick, targetInterval);
                }
            };

            timeoutRef.current = setTimeout(() => {
                // First auto-repeat at slow speed
                intervalRef.current = setInterval(tick, SPEED_TIER_1_MS);
            }, LONG_PRESS_INITIAL_DELAY_MS);
        },
        [computeStep, config.min, onChange],
    );

    const handleMouseDown = useCallback(
        (direction: 1 | -1) => (e: React.MouseEvent) => {
            e.preventDefault();
            if (disabled) return;
            // Immediate single step on press
            if (direction === 1) {
                handleIncrement();
            } else {
                handleDecrement();
            }
            startAutoRepeat(direction);
        },
        [disabled, handleIncrement, handleDecrement, startAutoRepeat],
    );

    const handleTouchStart = useCallback(
        (direction: 1 | -1) => (e: React.TouchEvent) => {
            e.preventDefault(); // prevent ghost click
            if (disabled) return;
            if (direction === 1) {
                handleIncrement();
            } else {
                handleDecrement();
            }
            startAutoRepeat(direction);
        },
        [disabled, handleIncrement, handleDecrement, startAutoRepeat],
    );

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
                onMouseDown={handleMouseDown(-1)}
                onMouseUp={stopAutoRepeat}
                onMouseLeave={stopAutoRepeat}
                onTouchStart={handleTouchStart(-1)}
                onTouchEnd={stopAutoRepeat}
                disabled={disabled || isAtMin}
                aria-label="Miktarı azalt"
                className={`${cls.btn} flex items-center justify-center bg-gray-50 dark:bg-white/5 text-muted-foreground hover:text-white hover:bg-[var(--brand-primary)] active:bg-[var(--brand-primary-dark)] transition-all duration-150 disabled:text-muted-foreground/40 disabled:hover:bg-gray-50 dark:disabled:hover:bg-white/5 border-r border-border cursor-pointer select-none`}
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
                className={`${cls.input} text-center font-bold tabular-nums bg-transparent outline-none text-foreground cursor-text`}
            />

            <button
                type="button"
                onMouseDown={handleMouseDown(1)}
                onMouseUp={stopAutoRepeat}
                onMouseLeave={stopAutoRepeat}
                onTouchStart={handleTouchStart(1)}
                onTouchEnd={stopAutoRepeat}
                disabled={disabled}
                aria-label="Miktarı artır"
                className={`${cls.btn} flex items-center justify-center bg-gray-50 dark:bg-white/5 text-muted-foreground hover:text-white hover:bg-[var(--brand-primary)] active:bg-[var(--brand-primary-dark)] transition-all duration-150 disabled:text-muted-foreground/40 disabled:hover:bg-gray-50 dark:disabled:hover:bg-white/5 border-l border-border cursor-pointer select-none`}
            >
                <Plus className={cls.icon} strokeWidth={2.5} />
            </button>
        </div>
    );
}
