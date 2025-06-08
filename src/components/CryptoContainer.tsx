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
import { useAddAlertMutation } from '@/hooks/useAddAlertMutation';
import { useRemoveAlertMutation } from '@/hooks/useRemoveAlertMutation';

export const CryptoContainer = () => {
    const [selectedAsset, setSelectedAsset] = useState<CryptoItem | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { isLoggedIn } = useAuth();
    const { data: alerts = [] } = useAlertsQuery({
        enabled: isLoggedIn,
    });

    const { mutateAsync: addAlert } = useAddAlertMutation({
        onSuccess: (item) => {
            toast(`${item.name} has been added to your watchlist.`);
        },
    });

    const { mutateAsync: removeAlertAsync } = useRemoveAlertMutation({
        onSuccess: (item) => {
            toast(`${item.name} has been removed from your watchlist.`);
        },
    });

    const addToWatchlist = async (item: WatchlistItem) => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
            setSelectedAsset(null);
            toast('Please log in to add items to your watchlist.');
            return;
        }

        await addAlert(item);
    };

    const removeFromWatchlist = async (item: Alert) => {
        if (!isLoggedIn) {
            toast('You must be logged in to manage your watchlist.');
            return;
        }

        await removeAlertAsync(item);
    };

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
