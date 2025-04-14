'use client';

import { useState, useEffect } from 'react';
import { CryptoTable } from './CryptoTable';
import { CryptoWatchlist } from './CryptoWatchlist';
import type { CryptoItem, WatchlistItem } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { CryptoSideDrawer } from './CryptoSideDrawer';

export const CryptoContainer = () => {
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [selectedAsset, setSelectedAsset] = useState<CryptoItem | null>(null);

    useEffect(() => {
        const storedWatchlist = localStorage.getItem('watchlist');
        if (storedWatchlist) {
            setWatchlist(JSON.parse(storedWatchlist));
        }
    }, []);

    const addToWatchlist = (item: WatchlistItem) => {
        if (watchlist.some((watchlistItem) => watchlistItem.id === item.id)) {
            toast(`${item.name} is already in your watchlist.`);
            return;
        }
        const updatedWatchlist = [...watchlist, item];
        setWatchlist(updatedWatchlist);
        localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
        toast(`${item.name} has been added to your watchlist.`);
    };

    const removeFromWatchlist = (item: WatchlistItem) => {
        const updatedWatchlist = watchlist.filter(
            (watchlistItem) => watchlistItem.id !== item.id
        );
        setWatchlist(updatedWatchlist);
        localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
        toast(`${item.name} has been removed from your watchlist.`);
    };

    return (
        <main className="p-6">
            {watchlist.length ? (
                <>
                    <h1 className="text-2xl font-semibold mb-4">
                        Your watchlist
                    </h1>
                    <CryptoWatchlist
                        watchlist={watchlist}
                        removeFromWatchlist={removeFromWatchlist}
                        setSelectedAsset={setSelectedAsset}
                    />
                </>
            ) : null}

            <h1 className="text-2xl font-semibold mb-4">
                Top Cryptocurrencies
            </h1>
            <CryptoTable
                watchlist={watchlist}
                setSelectedAsset={setSelectedAsset}
            />

            {selectedAsset ? (
                <CryptoSideDrawer
                    selectedAsset={selectedAsset}
                    setSelectedAsset={setSelectedAsset}
                    addToWatchlist={addToWatchlist}
                    removeFromWatchlist={removeFromWatchlist}
                    watchlist={watchlist}
                />
            ) : null}
        </main>
    );
};
