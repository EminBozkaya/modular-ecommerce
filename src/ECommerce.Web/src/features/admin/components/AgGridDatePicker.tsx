import * as React from 'react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { tr } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';


registerLocale('tr', tr);

/**
 * Custom Date Component for AG Grid using react-datepicker.
 * Provides a modern, interactive calendar that matches Ebrar's theme.
 */
export default forwardRef<any, any>((props, ref) => {
    const [date, setDate] = useState<Date | null>(null);

    // useImperativeHandle is critical for AG Grid to communicate with this component
    useImperativeHandle(ref, () => ({
        getDate() {
            return date;
        },
        setDate(newDate: Date | null) {
            // AG Grid sets this when filter is reset or programmatically changed
            setDate(newDate ? new Date(newDate) : null);
        },
        destroy() { }
    }));

    const onDateChanged = (selectedDate: Date | null) => {
        setDate(selectedDate);
        // We notify AG Grid AFTER the state update is scheduled
        // Passing the date directly ensures AG Grid gets the latest value immediately
        props.onDateChanged();
    };

    return (
        <div
            className="flex items-center w-full min-w-[140px] px-1 h-full relative"
            onClick={(e) => e.stopPropagation()}
        >
            <DatePicker
                selected={date}
                onChange={onDateChanged}
                dateFormat="dd.MM.yyyy HH:mm"
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Saat"
                locale="tr"
                placeholderText="gg.aa.yyyy ss:dd"
                autoComplete="off"
                isClearable={true}
                // Allow manual typing of time
                showTimeInput={false}
                className="w-full pl-7 pr-8 py-1 text-[11px] bg-white border border-gray-200 rounded-md 
                           focus:ring-1 focus:ring-ebrar-green/30 focus:border-ebrar-green outline-none 
                           transition-all duration-200 placeholder:text-gray-400 h-[26px]"
                calendarClassName="premium-calendar shadow-xl border-none rounded-lg overflow-hidden"
                showPopperArrow={false}
                shouldCloseOnSelect={false}
                portalId="root-portal"
            />
            <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                <Calendar className="w-3 h-3 text-ebrar-green opacity-70" />
            </div>
            {/* Custom Apply Button inside the input area if needed, but AG Grid handles it usually */}
        </div>
    );
});
