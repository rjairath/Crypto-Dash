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
import type { Alert, CryptoItem, WatchlistItem } from '@/types';
import { FaRegStar, FaStar } from 'react-icons/fa';

type CryptoTableProps = {
    watchlist: Alert[];
    setSelectedAsset: (asset: CryptoItem | null) => void;
};

const limit = 100;
export const CryptoTable = ({
    setSelectedAsset,
    watchlist,
}: CryptoTableProps) => {
    const loaderRef = useRef<HTMLDivElement | null>(null);

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

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead className="min-w-[50px]">Name</TableHead>
                        <TableHead>Symbol</TableHead>
                        <TableHead className="text-right">
                            Price (USD)
                        </TableHead>
                        <TableHead className="text-right">Market Cap</TableHead>
                        <TableHead className="text-right">24h %</TableHead>
                        <TableHead className="text-center"></TableHead>
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
                            <TableCell className="text-center">
                                {watchlist.some(
                                    (item) => item.cmc_id === coin.id
                                ) ? (
                                    <span className="text-amber-600 flex justify-center items-center">
                                        <FaStar className="w-4 h-4 text-amber-600 text-center" />
                                    </span>
                                ) : (
                                    <span className="text-muted-foreground flex justify-center items-center">
                                        <FaRegStar className="w-4 h-4 text-center" />
                                    </span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

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
