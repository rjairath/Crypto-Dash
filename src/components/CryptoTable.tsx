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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import CryptoChart from './CryptoChart';

const limit = 100;
const CryptoTable = () => {
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
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
                        <TableHead className="min-w-[60px]">Name</TableHead>
                        <TableHead>Symbol</TableHead>
                        <TableHead className="text-right">
                            Price (USD)
                        </TableHead>
                        <TableHead className="text-right">Market Cap</TableHead>
                        <TableHead className="text-right">24h %</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {flattenedData.map((coin) => (
                        <TableRow
                            key={coin.id}
                            className="text-sm border-t"
                            onClick={() => setSelectedSymbol(coin.symbol)}
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
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog
                open={!!selectedSymbol}
                onOpenChange={() => setSelectedSymbol(null)}
            >
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>{selectedSymbol} Chart</DialogTitle>
                    </DialogHeader>
                    {selectedSymbol && <CryptoChart symbol={selectedSymbol} />}
                </DialogContent>
            </Dialog>

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

export default CryptoTable;
