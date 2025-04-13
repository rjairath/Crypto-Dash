export type WatchlistItem = {
    id: number;
    name: string;
    symbol: string;
    quote: {
        USD: {
            price: number;
        };
    };
    alerts?: {
        lowerLimit: number;
        upperLimit: number;
    };
};
