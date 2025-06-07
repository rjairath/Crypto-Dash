'use client';

import { CryptoWatchlist } from '@/components/CryptoWatchlist';
import { useWatchlistQuery } from '@/hooks/useWatchlistQuery';
import { useAlertsQuery } from '@/hooks/useAlertsQuery';
import { type CryptoItem, type WatchlistItem } from '@/types';
import { useState } from 'react';
// ...existing imports...

export default function WatchlistPage() {
    const [selectedAsset, setSelectedAsset] = useState<CryptoItem | null>(null);
    const { data: watchlist = [], removeFromWatchlist } = useWatchlistQuery();
    const { data: alerts = [] } = useAlertsQuery();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Your Watchlist</h1>
            <CryptoWatchlist
                watchlist={watchlist}
                alerts={alerts}
                removeFromWatchlist={removeFromWatchlist}
                setSelectedAsset={setSelectedAsset}
            />
            {/* ...existing PriceAlertDialog component... */}
        </div>
    );
}
