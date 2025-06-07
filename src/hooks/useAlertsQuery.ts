import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { Alert } from '@/types';

async function fetchAlerts(): Promise<Alert[]> {
    const response = await fetch('/api/alerts');
    if (!response.ok) {
        throw new Error('Failed to fetch alerts');
    }
    return response.json();
}

export function useAlertsQuery(
    options?: Partial<UseQueryOptions<Alert[], Error>>
) {
    return useQuery<Alert[], Error>({
        queryKey: ['alerts'],
        queryFn: fetchAlerts,
        ...options,
    });
}
