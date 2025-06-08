import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import type { CryptoListResponse } from '@/types';

const TTL_SECONDS = 5 * 60 * 1000; // 5 minutes
const fetchCryptoList = async ({
    page = 1,
    limit = 100,
}: {
    page: unknown;
    limit: number;
}): Promise<CryptoListResponse> => {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const response = await fetch(
            `${baseUrl}/api/assets/?page=${page}&limit=${limit}`
        );

        if (!response.ok) {
            throw new Error(
                `Failed to fetch crypto list: ${response.status} ${response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error('error fetching crypto list:', error);
        throw error;
    }
};

export const useCryptoListQuery = (limit: number = 100) => {
    return useInfiniteQuery<CryptoListResponse>({
        queryKey: ['crypto-infinite', limit],
        queryFn: ({ pageParam = 1 }) =>
            fetchCryptoList({ page: pageParam, limit }),
        getNextPageParam: (lastPage) => {
            const { page, limit, total } = lastPage.meta;
            const hasMore = page * limit < total;
            return hasMore ? page + 1 : undefined;
        },
        staleTime: TTL_SECONDS,
        initialPageParam: 1,
    });
};
