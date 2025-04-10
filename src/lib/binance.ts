// lib/binance.ts
import redis from './redisClient';

const EXCHANGE_INFO_KEY = 'binance:exchangeInfo';
const TTL_SECONDS = 60 * 60; // 1 hour
const BINANCE_EXCHANGE_INFO_URL = 'https://api.binance.com/api/v3/exchangeInfo';

type BinanceSymbolInfo = {
    symbol: string;
    baseAsset: string;
    quoteAsset: string;
};

export async function getBinanceExchangeInfo() {
    const cached = await redis?.get(EXCHANGE_INFO_KEY);
    if (cached) return JSON.parse(cached);

    const res = await fetch(BINANCE_EXCHANGE_INFO_URL);
    if (!res.ok) throw new Error('Failed to fetch Binance exchange info');

    const data = await res.json();
    await redis?.set(
        EXCHANGE_INFO_KEY,
        JSON.stringify(data),
        'EX',
        TTL_SECONDS
    );

    return data;
}

export async function findUSDTMarket(cmcSymbol: string) {
    const info = await getBinanceExchangeInfo();
    const markets = info.symbols as BinanceSymbolInfo[];

    return markets.find(
        (m) =>
            m.baseAsset === cmcSymbol.toUpperCase() && m.quoteAsset === 'USDT'
    )?.symbol;
}
