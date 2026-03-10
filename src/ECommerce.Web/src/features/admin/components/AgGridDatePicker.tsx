import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { tr } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('tr', tr);

/**
 * Custom Date Component for AG Grid v35+ using react-datepicker.
 * 
 * - Calendar for date selection
 * - Custom 24h time input below calendar (optional)
 * - Time stays empty until user explicitly types it
 * - If no time entered → filter by date only (comparator handles this via 00:00)
 * - If time entered → filter by date + time (minute precision)
 * 
 * Used in BOTH floating filter row AND column filter popup.
 * Uses fixed positioning strategy to prevent calendar from flying off-screen
 * when opened inside AG Grid's column filter popup.
 */
interface AgGridDatePickerProps {
    date: Date | null;
    onDateChange: (date: Date | null) => void;
    filterParams?: Record<string, unknown>;
    location?: string;
    onFocusIn?: () => void;
}

export default function AgGridDatePicker({ date, onDateChange }: AgGridDatePickerProps) {
    // Track time separately — empty means "no time filter"
    const [timeStr, setTimeStr] = useState('');

    // Reset time when date is cleared externally (e.g. AG Grid resets filter)
    useEffect(() => {
        if (!date) {
            setTimeStr('');
        }
    }, [date]);

    // Build a Date with hours=0, minutes=0 for "date-only" mode
    const buildDate = (baseDate: Date, time: string): Date => {
        const d = new Date(baseDate);
        if (time && /^\d{2}:\d{2}$/.test(time)) {
            const [h, m] = time.split(':').map(Number);
            if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
                d.setHours(h, m, 0, 0);
                return d;
            }
        }
        // No valid time → set to 00:00 so comparator does date-only
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
        let val = e.target.value;

        // Allow only digits and colon, max 5 chars (HH:MM)
        val = val.replace(/[^\d:]/g, '');
        if (val.length > 5) val = val.slice(0, 5);

        // Auto-insert colon after 2 digits
        if (val.length === 2 && !val.includes(':') && timeStr.length < val.length) {
            val = val + ':';
        }

        setTimeStr(val);

        // If we have a date selected, update it with the new time (or reset to 00:00)
        if (date) {
            onDateChange(buildDate(date, val));
        }
    };

    // Format display: show date only (time is visible in the time input below)
    const displayFormat = timeStr && /^\d{2}:\d{2}$/.test(timeStr)
        ? "dd.MM.yyyy HH:mm"
        : "dd.MM.yyyy";

    return (
        <div
            className="flex items-center w-full min-w-[140px] px-1 h-full relative"
            onClick={(e) => e.stopPropagation()}
        >
            <DatePicker
                selected={date}
                onChange={handleDateChange}
                dateFormat={displayFormat}
                locale="tr"
                placeholderText="gg.aa.yyyy"
                autoComplete="off"
                isClearable={true}
                shouldCloseOnSelect={false}
                className="w-full pl-7 pr-8 py-1 text-[11px] bg-white border border-gray-200 rounded-md 
                           focus:ring-1 focus:ring-ebrar-green/30 focus:border-ebrar-green outline-none 
                           transition-all duration-200 placeholder:text-gray-400 h-[26px]"
                calendarClassName="premium-calendar shadow-xl border-none rounded-lg overflow-hidden"
                popperClassName="ag-custom-component-popup"
                showPopperArrow={true}
                popperPlacement="bottom-start"
                popperProps={{
                    strategy: 'absolute'
                }}
            >
                {/* Custom 24h time input rendered inside the calendar popup */}
                <div className="datepicker-time-row">
                    <Clock className="w-3.5 h-3.5 text-ebrar-green" />
                    <span className="datepicker-time-label">Saat:</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={timeStr}
                        onChange={handleTimeInput}
                        placeholder="SS:DD"
                        maxLength={5}
                        className="datepicker-time-input"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            </DatePicker>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                <Calendar className="w-3 h-3 text-ebrar-green opacity-70" />
            </div>
        </div>
    );
}
