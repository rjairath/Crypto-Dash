import { NextRequest, NextResponse } from 'next/server';
import redisClient from '@/lib/redisClient';

const COIN_LIST_KEY = 'crypto:listings:top1000';
const TTL_SECONDS = 3600; // 60 minutes, will change it to 5 minutes once dev done
const CMC_LISTING_URL =
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '100', 10);

        const cachedData = await redisClient?.get(COIN_LIST_KEY);
        if (cachedData) {
            const fullData = JSON.parse(cachedData);
            const start = (page - 1) * limit;
            const paginatedData = fullData.data.slice(start, start + limit);

            return NextResponse.json({
                source: 'cache',
                data: paginatedData,
                meta: {
                    total: fullData.data.length,
                    page,
                    limit,
                },
            });
        }

        const url = `${CMC_LISTING_URL}?start=1&limit=1000`;
        const response = await fetch(url, {
            headers: {
                'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY!,
            },
        });

        if (!response.ok) {
            console.error('Failed to fetch data from CoinMarketCap');
            return new NextResponse('Failed to fetch data from source', {
                status: 500,
            });
        }

        const data = await response.json();
        await redisClient?.set(
            COIN_LIST_KEY,
            JSON.stringify(data),
            'EX',
            TTL_SECONDS
        );

        const start = (page - 1) * limit;
        const paginatedData = data.data.slice(start, start + limit);

        return NextResponse.json({
            source: 'api',
            data: paginatedData,
            meta: {
                total: data.data.length,
                page,
                limit,
            },
        });
    } catch (error) {
        console.error('Error fetching crypto listings:', error);
        return new NextResponse('Server error', { status: 500 });
    }
}
