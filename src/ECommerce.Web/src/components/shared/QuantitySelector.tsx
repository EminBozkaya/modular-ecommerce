import { Minus, Plus } from 'lucide-react';
import { getUnitConfig } from '../../utils/unitConfig';
import { Button } from '../ui/button';

interface QuantitySelectorProps {
    unitName: string;
    value: number;
    onChange: (newValue: number) => void;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function QuantitySelector({
    unitName,
    value,
    onChange,
    disabled = false,
    size = 'md',
}: QuantitySelectorProps) {
    const config = getUnitConfig(unitName);

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

    const sizeClasses = {
        sm: { btn: 'h-8 w-8 min-h-[44px] min-w-[44px]', text: 'text-sm min-w-[4rem]' },
        md: { btn: 'h-10 w-10 min-h-[44px] min-w-[44px]', text: 'text-base min-w-[5rem]' },
        lg: { btn: 'h-11 w-11 min-h-[44px] min-w-[44px]', text: 'text-lg min-w-[6rem]' },
    };

    const cls = sizeClasses[size];

    return (
        <div
            className="inline-flex items-center gap-1"
            role="spinbutton"
            aria-valuenow={value}
            aria-valuemin={config.min}
        >
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleDecrement}
                disabled={disabled || value <= config.min}
                aria-label="Miktarı azalt"
                className={`${cls.btn} rounded-lg`}
            >
                <Minus className="h-4 w-4" />
            </Button>

            <span className={`${cls.text} text-center font-semibold tabular-nums select-none px-1`}>
                {config.formatValue(value)}
            </span>

            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleIncrement}
                disabled={disabled}
                aria-label="Miktarı artır"
                className={`${cls.btn} rounded-lg`}
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    );
}
