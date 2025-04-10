import { useQuery } from '@tanstack/react-query';

export type ChartParams = {
    symbol: string;
    interval: string;
    limit: number;
};
const TTL_SECONDS = 60 * 1000; // 1 min
const fetchChart = async ({ symbol, interval, limit }: ChartParams) => {
    const res = await fetch(
        `/api/chart?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );
    if (!res.ok) throw new Error('Failed to fetch chart data');
    const json = await res.json();
    return json.data;
};

export function useCryptoChart(symbol: string, interval = '1d', limit = 30) {
    return useQuery({
        queryKey: ['chart', symbol, interval, limit],
        queryFn: () => fetchChart({ symbol, interval, limit }),
        enabled: !!symbol, // Only run if symbol exists
        retry: 1,
        staleTime: TTL_SECONDS,
    });
}
