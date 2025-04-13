'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CryptoItem } from '@/types';

type PriceAlertFormProps = {
    selectedAsset: CryptoItem | null;
    onAlertsChange: (
        isValid: boolean,
        lowerLimit: number | null,
        upperLimit: number | null
    ) => void;
};

export function PriceAlertForm({
    selectedAsset,
    onAlertsChange,
}: PriceAlertFormProps) {
    const [lowerLimit, setLowerLimit] = useState<string>('');
    const [upperLimit, setUpperLimit] = useState<string>('');

    // Reset form when asset changes
    useEffect(() => {
        setLowerLimit('');
        setUpperLimit('');
    }, [selectedAsset?.id]);

    // Validate and notify parent component
    useEffect(() => {
        const lower = parseFloat(lowerLimit);
        const upper = parseFloat(upperLimit);
        const isValid = !isNaN(lower) && !isNaN(upper) && lower < upper;

        onAlertsChange(isValid, isValid ? lower : null, isValid ? upper : null);
    }, [lowerLimit, upperLimit]);

    // Calculate suggested values based on current price
    const suggestedLower = selectedAsset
        ? (selectedAsset.quote.USD.price * 0.9).toFixed(2)
        : '0.00';

    const suggestedUpper = selectedAsset
        ? (selectedAsset.quote.USD.price * 1.1).toFixed(2)
        : '0.00';

    return (
        <div className="p-4 border-t">
            <h3 className="text-lg font-semibold mb-3">
                Set Price Alert Range
            </h3>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="lowerLimit">Lower Limit ($)</Label>
                        <Input
                            id="lowerLimit"
                            type="number"
                            step="0.01"
                            value={lowerLimit}
                            onChange={(e) => setLowerLimit(e.target.value)}
                            placeholder={suggestedLower}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="upperLimit">Upper Limit ($)</Label>
                        <Input
                            id="upperLimit"
                            type="number"
                            step="0.01"
                            value={upperLimit}
                            onChange={(e) => setUpperLimit(e.target.value)}
                            placeholder={suggestedUpper}
                        />
                    </div>
                </div>

                {lowerLimit &&
                    upperLimit &&
                    (!isFinite(parseFloat(lowerLimit)) ||
                        !isFinite(parseFloat(upperLimit)) ||
                        parseFloat(lowerLimit) >= parseFloat(upperLimit)) && (
                        <p className="text-sm text-destructive">
                            Lower limit must be less than upper limit
                        </p>
                    )}
            </div>
        </div>
    );
}
