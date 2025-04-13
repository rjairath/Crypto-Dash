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
import CryptoChart from './CryptoChart';
import { Button } from '@/components/ui/button';
import type { CryptoItem, WatchlistItem } from '@/types';
import { PriceAlertForm } from './PriceAlertForm';

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

            <Sheet
                open={!!selectedAsset}
                onOpenChange={(open) => {
                    if (!open) setSelectedAsset(null);
                }}
            >
                <SheetContent
                    side="right"
                    className="w-full sm:w-[400px] md:w-[540px] h-full"
                >
                    <SheetHeader className="border-b fixed top-0">
                        <SheetTitle>
                            {selectedAsset?.name} ({selectedAsset?.symbol})
                            Chart
                        </SheetTitle>
                        <SheetDescription>
                            View detailed information and price chart
                        </SheetDescription>
                    </SheetHeader>
                    <div className="h-[calc(100vh-200px)] overflow-y-auto relative top-[85px] py-2">
                        <div className="px-4 py-2">
                            {selectedAsset && (
                                <CryptoChart symbol={selectedAsset.symbol} />
                            )}
                        </div>
                        <div className="p-4 border-t">
                            {selectedAsset && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            Price
                                        </p>
                                        <p className="font-medium">
                                            $
                                            {selectedAsset.quote.USD.price.toFixed(
                                                2
                                            )}
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            24h Change
                                        </p>
                                        <p
                                            className={`font-medium ${
                                                selectedAsset.quote.USD
                                                    .percent_change_24h >= 0
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                            }`}
                                        >
                                            {selectedAsset.quote.USD.percent_change_24h.toFixed(
                                                2
                                            )}
                                            %
                                        </p>
                                    </div>

                                    <div className="space-y-1 col-span-2">
                                        <p className="text-sm text-muted-foreground">
                                            Market Cap
                                        </p>
                                        <p className="font-medium">
                                            $
                                            {(
                                                selectedAsset.quote.USD
                                                    .market_cap / 1e9
                                            ).toFixed(2)}
                                            B
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <PriceAlertForm
                            selectedAsset={selectedAsset}
                            onAlertsChange={handleAlertsChange}
                        />
                    </div>

                    <SheetFooter className="absolute bottom-0 w-full border-t bg-white dark:bg-gray-950">
                        <Button
                            onClick={() => {
                                addWatchlistHandler(selectedAsset!!);
                                setSelectedAsset(null);
                            }}
                            variant="default"
                            disabled={!alertsValid}
                        >
                            Add to Watchlist
                        </Button>
                        <SheetClose asChild>
                            <Button variant="outline">Close</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

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
