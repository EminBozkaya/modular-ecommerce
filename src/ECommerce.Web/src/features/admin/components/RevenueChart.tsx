import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { useTranslation } from 'react-i18next';
import type { RevenueDataPoint } from '../types/dashboard';
import { formatPrice } from '../../../utils/formatters';
import { useStoreSettings } from '@/context/StoreSettingsContext';
import { SUPPORTED_LANGUAGES } from '@/i18n/languages';

interface RevenueChartProps {
    data: RevenueDataPoint[];
}

export function RevenueChart({ data }: RevenueChartProps) {
    const { t, i18n } = useTranslation('admin');
    const { primaryColor } = useStoreSettings();

    const currentLocale = SUPPORTED_LANGUAGES.find(l => l.code === i18n.language)?.locale ?? 'tr-TR';

    const formatDateLabel = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString(currentLocale, { day: 'numeric', month: 'short' });

    return (
        <div className="bg-card rounded-xl shadow-sm border border-border p-5">
            <h3 className="text-base font-semibold text-foreground mb-4">{t('dashboard.revenueTitle')}</h3>
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
                            formatter={(value: ValueType | undefined) => [formatPrice(typeof value === 'number' ? value : Number(value ?? 0), 'TRY'), t('dashboard.revenueTooltipLabel')]}
                            labelFormatter={(label: unknown) => formatDateLabel(String(label))}
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
