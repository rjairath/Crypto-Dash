// /app/api/crypto/chart/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { findUSDTMarket } from '@/lib/binance';
import redisClient from '@/lib/redisClient';

const TTL_SECONDS = 60 * 5; // Cache chart data for 5 minutes

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const symbol = searchParams.get('symbol')?.toUpperCase();
        const interval = searchParams.get('interval') || '1d';
        const limit = parseInt(searchParams.get('limit') || '30', 10);

        if (!symbol) {
            return new NextResponse('Missing symbol', { status: 400 });
        }

        const market = await findUSDTMarket(symbol);
        if (!market) {
            return new NextResponse('Market data not found on Binance', {
                status: 404,
            });
        }

        const redisKey = `chart:${market}:${interval}:${limit}`;
        const cached = await redisClient?.get(redisKey);

        if (cached) {
            return NextResponse.json({
                source: 'cache',
                data: JSON.parse(cached),
            });
        }

        const url = `https://api.binance.com/api/v3/klines?symbol=${market}&interval=${interval}&limit=${limit}`;
        const res = await fetch(url);

        if (!res.ok) {
            return new NextResponse('Failed to fetch data from Binance', {
                status: 500,
            });
        }

        const data = await res.json();
        await redisClient?.set(
            redisKey,
            JSON.stringify(data),
            'EX',
            TTL_SECONDS
        );

        return NextResponse.json({ source: 'api', data });
    } catch (err) {
        console.error('Chart fetch error:', err);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
