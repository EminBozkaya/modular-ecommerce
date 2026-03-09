import type { ReactNode } from 'react';

interface SummaryCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    description?: string;
}

export function SummaryCard({ title, value, icon, description }: SummaryCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
            <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(27, 94, 63, 0.1)' }}
            >
                <div style={{ color: '#1B5E3F' }}>{icon}</div>
            </div>
            <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                {description && (
                    <p className="text-xs text-gray-400 mt-1">{description}</p>
                )}
            </div>
        </div>
    );
}
