'use client';

import { useState } from 'react';
import { CryptoTable } from './CryptoTable';
import { CryptoWatchlist } from './CryptoWatchlist';
import type { Alert, CryptoItem, WatchlistItem } from '@/types';
import { toast } from 'sonner';
import { CryptoSideDrawer } from './CryptoSideDrawer';
import { LoginModal } from './LoginModal';
import { useAuth } from '@/hooks/useAuth';
import { useAlertsQuery } from '@/hooks/useAlertsQuery';

export const CryptoContainer = () => {
    const [selectedAsset, setSelectedAsset] = useState<CryptoItem | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { isLoggedIn } = useAuth();
    const { data: alerts = [] } = useAlertsQuery({
        enabled: isLoggedIn,
        queryKey: ['alerts', isLoggedIn],
    });

    const addToWatchlist = async (item: WatchlistItem) => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
            setSelectedAsset(null);
            toast('Please log in to add items to your watchlist.');
            return;
        }

        try {
            const response = await fetch('/api/add-alert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cmc_id: item.id,
                    name: item.name,
                    asset_symbol: item.symbol,
                    upper_limit: item?.alerts?.upperLimit,
                    lower_limit: item?.alerts?.lowerLimit,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add alert');
            }

            toast(`${item.name} has been added to your watchlist.`);
        } catch (error) {
            toast.error('Failed to add to watchlist');
        }
    };

    const removeFromWatchlist = async (item: Alert) => {};

    return (
        <main className="p-6">
            {isLoggedIn && alerts.length > 0 && (
                <>
                    <h1 className="text-2xl font-semibold mb-4">
                        Your watchlist
                    </h1>
                    <CryptoWatchlist
                        watchlist={alerts}
                        removeFromWatchlist={removeFromWatchlist}
                        setSelectedAsset={setSelectedAsset}
                    />
                </>
            )}

            <h1 className="text-2xl font-semibold mb-4">
                Top Cryptocurrencies
            </h1>
            <CryptoTable
                watchlist={alerts}
                setSelectedAsset={setSelectedAsset}
            />

            {selectedAsset && (
                <CryptoSideDrawer
                    selectedAsset={selectedAsset}
                    setSelectedAsset={setSelectedAsset}
                    addToWatchlist={addToWatchlist}
                    removeFromWatchlist={removeFromWatchlist}
                    watchlist={alerts}
                />
            )}

            <LoginModal
                showLoginModal={showLoginModal}
                setShowLoginModal={setShowLoginModal}
            />
        </main>
    );
};
