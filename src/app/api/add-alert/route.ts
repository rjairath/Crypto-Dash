// app/api/add-alert/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { findUSDTMarket } from '@/lib/binance';
import type { SetAlertRequestParams } from '@/types';

// asset symbol here will be the CNC one, match the correct one from Binance
export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const {
            cmc_id,
            name,
            asset_symbol,
            upper_limit,
            lower_limit,
        }: SetAlertRequestParams = await req.json();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const market_symbol = await findUSDTMarket(asset_symbol);
        if (!market_symbol) {
            return new NextResponse('Market data not found on Binance', {
                status: 404,
            });
        }

        const { data, error } = await supabase
            .from('alerts')
            .insert([
                {
                    user_id: user?.id,
                    cmc_id: parseInt(cmc_id, 10),
                    name,
                    asset_symbol: market_symbol,
                    upper_limit,
                    lower_limit,
                    triggered: false,
                },
            ])
            .select();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.log('Error adding alert:', error);
        return NextResponse.json(
            {
                error: 'An unknown error occurred',
            },
            { status: 500 }
        );
    }
}
