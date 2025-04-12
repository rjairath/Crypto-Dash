export type WatchlistItem = {
    id: number;
    name: string;
    symbol: string;
    quote: {
        USD: {
            price: number;
        };
    };
};
