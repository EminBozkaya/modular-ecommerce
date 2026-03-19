import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { tr } from 'date-fns/locale/tr';
import { enUS } from 'date-fns/locale/en-US';
import { de } from 'date-fns/locale/de';
import { fr } from 'date-fns/locale/fr';
import { es } from 'date-fns/locale/es';
import { ru } from 'date-fns/locale/ru';
import { arSA } from 'date-fns/locale/ar-SA';
import 'react-datepicker/dist/react-datepicker.css';
import { useTranslation } from 'react-i18next';
import { getDateConfig } from '@/utils/agGridLocales';

// Register all supported locales once
registerLocale('tr', tr);
registerLocale('en-US', enUS);
registerLocale('de', de);
registerLocale('fr', fr);
registerLocale('es', es);
registerLocale('ru', ru);
registerLocale('ar-SA', arSA);

/**
 * Custom Date Component for AG Grid v35+ using react-datepicker.
 *
 * - Calendar for date selection
 * - Custom 24h time input below calendar (optional)
 * - Time stays empty until user explicitly types it
 * - If no time entered → filter by date only (comparator handles this via 00:00)
 * - If time entered → filter by date + time (minute precision)
 * - Fully locale-aware: format, placeholder and labels change with app language
 *
 * Used in BOTH floating filter row AND column filter popup.
 */
interface AgGridDatePickerProps {
    date: Date | null;
    onDateChange: (date: Date | null) => void;
    filterParams?: Record<string, unknown>;
    location?: string;
    onFocusIn?: () => void;
}

export default function AgGridDatePicker({ date, onDateChange }: AgGridDatePickerProps) {
    const { i18n } = useTranslation();
    const lang = i18n.language?.split('-')[0] ?? 'tr';
    const dateConfig = getDateConfig(lang);

    const [timeStr, setTimeStr] = useState('');

    // Reset time when date is cleared externally (e.g. AG Grid resets filter)
    useEffect(() => {
        if (!date) setTimeStr('');
    }, [date]);

    const buildDate = (baseDate: Date, time: string): Date => {
        const d = new Date(baseDate);
        if (time && /^\d{2}:\d{2}$/.test(time)) {
            const [h, m] = time.split(':').map(Number);
            if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
                d.setHours(h, m, 0, 0);
                return d;
            }
        }
        d.setHours(0, 0, 0, 0);
        return d;
    };

    const handleDateChange = (selectedDate: Date | null) => {
        if (!selectedDate) {
            setTimeStr('');
            onDateChange(null);
            return;
        }
        onDateChange(buildDate(selectedDate, timeStr));
    };

    const handleTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/[^\d:]/g, '');
        if (val.length > 5) val = val.slice(0, 5);
        if (val.length === 2 && !val.includes(':') && timeStr.length < val.length) {
            val = val + ':';
        }
        setTimeStr(val);
        if (date) onDateChange(buildDate(date, val));
    };

    const displayFormat = timeStr && /^\d{2}:\d{2}$/.test(timeStr)
        ? `${dateConfig.dateFormat} HH:mm`
        : dateConfig.dateFormat;

    return (
        <div
            className="flex items-center w-full min-w-[140px] px-1 h-full relative"
            onClick={(e) => e.stopPropagation()}
        >
            <DatePicker
                selected={date}
                onChange={handleDateChange}
                dateFormat={displayFormat}
                locale={dateConfig.dateFnsKey}
                placeholderText={dateConfig.placeholder}
                autoComplete="off"
                isClearable={true}
                shouldCloseOnSelect={false}
                className="w-full pl-7 pr-8 py-1 text-[11px] bg-background border border-border rounded-md
                           focus:ring-1 focus:ring-primary/30 focus:border-primary outline-none
                           transition-all duration-200 placeholder:text-muted-foreground text-foreground h-[26px]"
                calendarClassName="premium-calendar shadow-xl border-none rounded-lg overflow-hidden"
                popperClassName="ag-custom-component-popup"
                showPopperArrow={true}
                popperPlacement="bottom-start"
                popperProps={{ strategy: 'absolute' }}
            >
                {/* Time input inside calendar popup — label and placeholder are locale-aware */}
                <div className="datepicker-time-row">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span className="datepicker-time-label">{dateConfig.timeLabel}</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={timeStr}
                        onChange={handleTimeInput}
                        placeholder={dateConfig.timePlaceholder}
                        maxLength={5}
                        className="datepicker-time-input"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            </DatePicker>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                <Calendar className="w-3 h-3 text-primary opacity-70" />
            </div>
        </div>
    );
}
