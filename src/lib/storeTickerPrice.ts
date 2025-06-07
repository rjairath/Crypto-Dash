// lib/storeTickerPrices.ts
import redis from '@/lib/redisClient';

export async function storeTickerPricesInRedis() {
    const res = await fetch('https://api.binance.com/api/v3/ticker/price');
    if (!res.ok) {
        console.error('Failed to fetch ticker prices');
        return;
    }

    const data = await res.json();

    // Store each price in Redis as a key-value pair
    const pipeline = redis?.multi();

    for (const { symbol, price } of data) {
        pipeline?.set(symbol, JSON.stringify({ price: parseFloat(price) }));
    }

    await pipeline?.exec();
    console.log('Stored ticker prices in Redis');
}
