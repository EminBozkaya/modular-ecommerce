import type { ReactNode } from 'react';

interface SummaryCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    description?: string;
}

export function SummaryCard({ title, value, icon, description }: SummaryCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 flex items-start gap-3 sm:gap-4 overflow-hidden">
            <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(27, 94, 63, 0.1)' }}
            >
                <div style={{ color: 'var(--brand-primary)' }} className="h-5 w-5 sm:h-6 sm:w-6">{icon}</div>
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">{title}</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1 break-words">
                    {value}
                </p>
                {description && (
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1 line-clamp-1">{description}</p>
                )}
            </div>
        </div>
    );
}
