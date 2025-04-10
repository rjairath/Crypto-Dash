// components/CryptoChart.tsx
'use client';

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts';
import { useCryptoChart } from '@/hooks/useCryptoChart';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';

type CryptoChartProps = {
    symbol: string;
};

export default function CryptoChart({ symbol }: CryptoChartProps) {
    const { data, isLoading, error } = useCryptoChart(symbol);

    if (isLoading) return <Skeleton className="h-[300px] w-full" />;

    if (error) {
        return (
            <Alert variant="destructive" className="mt-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {error instanceof Error
                        ? error.message
                        : 'An unexpected error occurred while loading the chart.'}
                </AlertDescription>
            </Alert>
        );
    }

    const formattedData = data?.map((d: any) => ({
        time: d[0],
        date: new Date(d[0]),
        close: parseFloat(d[4]),
    }));

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={(value) => format(value, 'MM/dd')}
                        minTickGap={20}
                    />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip
                        formatter={(value: number) => `$${value.toFixed(2)}`}
                        labelFormatter={(label: Date) => format(label, 'PPPpp')}
                    />
                    <Line
                        type="monotone"
                        dataKey="close"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
