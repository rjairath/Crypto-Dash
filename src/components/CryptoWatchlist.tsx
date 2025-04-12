'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { WatchlistItem } from '@/types';
import { FaRegTrashAlt } from 'react-icons/fa';

type CryptoWatchlistProps = {
    watchlist: WatchlistItem[];
    removeFromWatchlist: (item: WatchlistItem) => void;
};

export const CryptoWatchlist = ({
    watchlist,
    removeFromWatchlist,
}: CryptoWatchlistProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {watchlist.map((item) => (
                <Card
                    key={item.id}
                    className="shadow-md hover:shadow-lg transition-shadow"
                >
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>{item.name}</CardTitle>
                            <FaRegTrashAlt
                                onClick={() => removeFromWatchlist(item)}
                                className="cursor-pointer"
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p>Symbol: {item.symbol}</p>
                        <p>Price: ${item.quote.USD.price.toFixed(2)}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
