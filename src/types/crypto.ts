export type ChartQueryParams = {
    symbol: string;
    interval: string;
    limit: number;
};

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

export type CryptoListResponse = {
    source: 'cache' | 'api';
    data: CryptoItem[];
    meta: {
        total: number;
        page: number;
        limit: number;
    };
};
