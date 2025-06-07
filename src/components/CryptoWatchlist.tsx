'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CryptoItem, Alert } from '@/types';
import { FaBell, FaRegTrashAlt } from 'react-icons/fa';

type CryptoWatchlistProps = {
    watchlist: Alert[];
    removeFromWatchlist: (item: Alert) => void;
    setSelectedAsset: (asset: CryptoItem | null) => void;
};

const calculatePricePosition = (
    price: number,
    lowerLimit: number,
    upperLimit: number
) => {
    // If price is below lower limit, cap at 0%
    if (price <= lowerLimit) return 0;

    // If price is above upper limit, cap at 100%
    if (price >= upperLimit) return 100;

    // Otherwise calculate percentage position within the range
    return ((price - lowerLimit) / (upperLimit - lowerLimit)) * 100;
};

export const CryptoWatchlist = ({
    watchlist,
    removeFromWatchlist,
    setSelectedAsset,
}: CryptoWatchlistProps) => {
    const handleCardClick = (item: Alert) => {};
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {watchlist.map((item) => {
                const hasAlerts = item.lower_limit && item.upper_limit;
                const currentPrice = item.current_price ?? 0;

                // Determine alert status
                let alertStatus = 'No alerts';
                let statusColor = 'bg-gray-200';

                if (hasAlerts) {
                    if (currentPrice < item.lower_limit) {
                        alertStatus = 'Below target';
                        statusColor = 'bg-red-500';
                    } else if (currentPrice > item.upper_limit) {
                        alertStatus = 'Above target';
                        statusColor = 'bg-yellow-500';
                    } else {
                        alertStatus = 'Within target';
                        statusColor = 'bg-green-500';
                    }
                }

                return (
                    <Card
                        key={item.id}
                        className="shadow-md hover:shadow-lg transition-shadow cursor-pointer gap-2"
                        onClick={() => handleCardClick(item)}
                    >
                        <CardHeader className="py-3 px-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-baseline gap-2">
                                    <CardTitle className="text-base">
                                        {item.name}
                                    </CardTitle>
                                    <span className="text-xs text-gray-500">
                                        {item.asset_symbol}
                                    </span>
                                </div>
                                <FaRegTrashAlt
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFromWatchlist(item);
                                    }}
                                    className="cursor-pointer h-3.5 w-3.5 text-gray-400 hover:text-red-500"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="py-2 px-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">
                                    ${item.current_price?.toFixed(2)}
                                </span>
                                {hasAlerts && (
                                    <Badge
                                        variant="outline"
                                        className={`flex items-center gap-1 text-white ${statusColor} text-xs py-0.5`}
                                    >
                                        <FaBell className="h-2.5 w-2.5" />
                                        <span>{alertStatus}</span>
                                    </Badge>
                                )}
                            </div>

                            {hasAlerts ? (
                                <div>
                                    <div className="relative h-4 w-full mb-1">
                                        {/* Base track */}
                                        <div className="absolute w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full top-1/2 transform -translate-y-1/2" />

                                        {/* Target range indicator (colored band) */}
                                        <div
                                            className={`absolute h-1.5 rounded-full ${statusColor} top-1/2 transform -translate-y-1/2`}
                                            style={{
                                                left: '0%',
                                                width: '100%',
                                            }}
                                        />

                                        {/* Current price marker */}
                                        <div
                                            className="absolute w-2.5 h-4 bg-blue-600 rounded-full z-10 top-1/2 transform -translate-y-1/2"
                                            style={{
                                                left: `${calculatePricePosition(
                                                    currentPrice,
                                                    item.lower_limit,
                                                    item.upper_limit
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>
                                            ${item.lower_limit.toFixed(2)}
                                        </span>
                                        <span>
                                            ${item.upper_limit.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-500 italic">
                                    No price alerts set
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};
