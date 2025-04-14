'use client';

import { useCryptoListQuery } from '@/hooks/useCryptoListQuery';
import { useState, useRef, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetClose,
} from '@/components/ui/sheet';
import { CryptoChart } from './CryptoChart';
import { Button } from '@/components/ui/button';
import type { CryptoItem, WatchlistItem } from '@/types';
import { PriceAlertForm } from './PriceAlertForm';
import { CryptoSideDrawer } from './CryptoSideDrawer';

type CryptoTableProps = {
    addToWatchlist: (item: WatchlistItem) => void;
};

const limit = 100;
export const CryptoTable = ({ addToWatchlist }: CryptoTableProps) => {
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const [selectedAsset, setSelectedAsset] = useState<CryptoItem | null>(null);
    const [alertsValid, setAlertsValid] = useState(false);
    const [lowerLimit, setLowerLimit] = useState<number | null>(null);
    const [upperLimit, setUpperLimit] = useState<number | null>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
    } = useCryptoListQuery(limit);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const flattenedData = data?.pages.flatMap((page) => page.data) || [];

    const addWatchlistHandler = (item: CryptoItem) => {
        addToWatchlist({
            id: item.id,
            name: item.name,
            symbol: item.symbol,
            quote: {
                USD: {
                    price: item.quote.USD.price,
                },
            },
            alerts: alertsValid
                ? {
                      lowerLimit: lowerLimit!,
                      upperLimit: upperLimit!,
                  }
                : undefined,
        });
    };

    const handleAlertsChange = (
        isValid: boolean,
        lower: number | null,
        upper: number | null
    ) => {
        setAlertsValid(isValid);
        setLowerLimit(lower);
        setUpperLimit(upper);
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead className="min-w-[60px]">Name</TableHead>
                        <TableHead>Symbol</TableHead>
                        <TableHead className="text-right">
                            Price (USD)
                        </TableHead>
                        <TableHead className="text-right">Market Cap</TableHead>
                        <TableHead className="text-right">24h %</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {flattenedData.map((coin) => (
                        <TableRow
                            key={coin.id}
                            className="text-sm border-t"
                            onClick={() => setSelectedAsset(coin)}
                        >
                            <TableCell>{coin.cmc_rank}</TableCell>
                            <TableCell className="font-medium">
                                {coin.name}
                            </TableCell>
                            <TableCell className="font-medium">
                                {coin.symbol}
                            </TableCell>
                            <TableCell className="text-right">
                                ${coin.quote.USD.price.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                                ${(coin.quote.USD.market_cap / 1e9).toFixed(2)}B
                            </TableCell>
                            <TableCell className="text-right">
                                {coin.quote.USD.percent_change_24h.toFixed(2)}%
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addWatchlistHandler(coin);
                                    }}
                                >
                                    Add
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <CryptoSideDrawer
                selectedAsset={selectedAsset}
                setSelectedAsset={setSelectedAsset}
                alertsValid={alertsValid}
                handleAlertsChange={handleAlertsChange}
                addWatchlistHandler={addWatchlistHandler}
            />

            <div ref={loaderRef} className="mt-4 text-center">
                {isFetchingNextPage
                    ? 'Loading more...'
                    : hasNextPage
                    ? 'Scroll to load more'
                    : 'No more results'}
            </div>
        </>
    );
};
