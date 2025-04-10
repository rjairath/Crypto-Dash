import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

export type QuoteDetails = {
    price: number;
    volume_24h: number;
    percent_change_1h: number;
    percent_change_24h: number;
    percent_change_7d: number;
    market_cap: number;
    last_updated: string;
};

export type CryptoItem = {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    cmc_rank: number;
    num_market_pairs: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number | null;
    last_updated: string;
    date_added: string;
    tags: string[];
    quote: {
        USD: QuoteDetails;
    };
};

type CryptoListResponse = {
    source: 'cache' | 'api';
    data: CryptoItem[];
    meta: {
        total: number;
        page: number;
        limit: number;
    };
};

const TTL_SECONDS = 60 * 60 * 1000; // 1 hour
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
