import { storeTickerPricesInRedis } from '@/lib/storeTickerPrice';

let pollInterval: NodeJS.Timeout;

async function startPolling() {
    console.log('Ticker poller started...');

    // Initial run
    await storeTickerPricesInRedis();

    // Run every 60 seconds
    pollInterval = setInterval(async () => {
        try {
            await storeTickerPricesInRedis();
            console.log('Updated ticker prices in Redis');
        } catch (error) {
            console.error('Error updating ticker prices:', error);
        }
    }, 60 * 1000); // 60 seconds
}

// Cleanup on process termination
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

function cleanup() {
    console.log('Cleaning up...');
    if (pollInterval) {
        clearInterval(pollInterval);
    }
    process.exit(0);
}

startPolling();
