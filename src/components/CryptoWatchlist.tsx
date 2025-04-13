'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { WatchlistItem } from '@/types';
import { FaBell, FaRegTrashAlt } from 'react-icons/fa';

type CryptoWatchlistProps = {
    watchlist: WatchlistItem[];
    removeFromWatchlist: (item: WatchlistItem) => void;
};

const calculatePricePosition = (
    price: number,
    lowerLimit: number,
    upperLimit: number
) => {
    // If price is below lower limit, cap at 0%
    if (price <= lowerLimit) return -3;

    // If price is above upper limit, cap at 100%
    if (price >= upperLimit) return 100;

    // Otherwise calculate percentage position within the range
    return ((price - lowerLimit) / (upperLimit - lowerLimit)) * 100;
};

export const CryptoWatchlist = ({
    watchlist,
    removeFromWatchlist,
}: CryptoWatchlistProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {watchlist.map((item) => {
                const hasAlerts = item.alerts !== undefined;
                const currentPrice = item.quote.USD.price;

                // Determine alert status
                let alertStatus = 'No alerts set';
                let statusColor = 'bg-gray-200';

                if (hasAlerts) {
                    const { lowerLimit, upperLimit } = item.alerts!;
                    if (currentPrice < lowerLimit) {
                        alertStatus = 'Below target range';
                        statusColor = 'bg-red-500';
                    } else if (currentPrice > upperLimit) {
                        alertStatus = 'Above target range';
                        statusColor = 'bg-yellow-500';
                    } else {
                        alertStatus = 'Within target range';
                        statusColor = 'bg-green-500';
                    }
                }

                return (
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
                            <div className="text-sm text-gray-500">
                                {item.symbol}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center">
                                <span>
                                    Current: ${item.quote.USD.price.toFixed(2)}
                                </span>
                            </div>

                            {hasAlerts ? (
                                <div className="space-y-4">
                                    {/* Price range indicator */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>
                                                $
                                                {item.alerts!.lowerLimit.toFixed(
                                                    2
                                                )}
                                            </span>
                                            <span>Target Range</span>
                                            <span>
                                                $
                                                {item.alerts!.upperLimit.toFixed(
                                                    2
                                                )}
                                            </span>
                                        </div>

                                        {/* Simplified range visualization */}
                                        <div className="relative h-6 w-full">
                                            {/* Base track */}
                                            <div className="absolute w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full top-1/2 transform -translate-y-1/2" />

                                            {/* Target range indicator (colored band) */}
                                            <div
                                                className={`absolute h-2 rounded-full ${statusColor} top-1/2 transform -translate-y-1/2`}
                                                style={{
                                                    left: '0%',
                                                    width: '100%',
                                                }}
                                            />

                                            {/* Lower and upper limit markers */}
                                            <div className="absolute w-2 h-6 bg-gray-400 rounded-full left-0 top-1/2 transform -translate-y-1/2" />
                                            <div className="absolute w-2 h-6 bg-gray-400 rounded-full right-0 top-1/2 transform -translate-y-1/2" />

                                            {/* Current price marker */}
                                            <div
                                                className="absolute w-3 h-8 bg-blue-600 rounded-full z-10 top-1/2 transform -translate-y-1/2"
                                                style={{
                                                    left: `${calculatePricePosition(
                                                        currentPrice,
                                                        item.alerts!.lowerLimit,
                                                        item.alerts!.upperLimit
                                                    )}%`,
                                                }}
                                            />
                                        </div>

                                        <Badge
                                            variant="outline"
                                            className={`flex items-center gap-1 text-white ${statusColor}`}
                                        >
                                            <FaBell className="h-3 w-3" />
                                            <span>{alertStatus}</span>
                                        </Badge>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500 italic">
                                    {alertStatus}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};
