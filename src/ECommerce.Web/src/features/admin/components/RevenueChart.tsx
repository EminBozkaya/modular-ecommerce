import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, type TooltipProps } from 'recharts';
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import type { RevenueDataPoint } from '../types/dashboard';
import { formatPrice } from '../../../utils/formatters';
import { useStoreSettings } from '@/context/StoreSettingsContext';

interface RevenueChartProps {
    data: RevenueDataPoint[];
}

function formatDateLabel(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}

export function RevenueChart({ data }: RevenueChartProps) {
    // SVG presentation attributes (stopColor, stroke) do not support CSS variables;
    // read the live brand color directly from context instead.
    const { primaryColor } = useStoreSettings();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Gelir Grafiği (Son 30 Gün)</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <AreaChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={formatDateLabel}
                            tick={{ fontSize: 12, fill: '#9ca3af' }}
                            axisLine={{ stroke: '#e5e7eb' }}
                            tickLine={false}
                        />
                        <YAxis
                            tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k`}
                            tick={{ fontSize: 12, fill: '#9ca3af' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            formatter={(value: ValueType, _name: NameType) => [formatPrice(Number(value), 'TRY'), 'Gelir']}
                            labelFormatter={(label: string) => formatDateLabel(label)}
                            contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke={primaryColor}
                            strokeWidth={2}
                            fill="url(#revenueGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
