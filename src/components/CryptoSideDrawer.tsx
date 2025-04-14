import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetClose,
} from '@/components/ui/sheet';
import { CryptoItem } from '@/types/crypto';
import { CryptoChart } from './CryptoChart';
import { PriceAlertForm } from './PriceAlertForm';
import { Button } from '@/components/ui/button';

type CryptoSideDrawerProps = {
    selectedAsset: CryptoItem | null;
    setSelectedAsset: (asset: CryptoItem | null) => void;

    handleAlertsChange: (
        isValid: boolean,
        lowerLimit: number | null,
        upperLimit: number | null
    ) => void;
    addWatchlistHandler: (asset: CryptoItem) => void;
    alertsValid: boolean;
};

export const CryptoSideDrawer = ({
    selectedAsset,
    setSelectedAsset,
    alertsValid,
    handleAlertsChange,
    addWatchlistHandler,
}: CryptoSideDrawerProps) => {
    return (
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
                        {selectedAsset?.name} ({selectedAsset?.symbol}) Chart
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
                                            selectedAsset.quote.USD.market_cap /
                                            1e9
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
    );
};
