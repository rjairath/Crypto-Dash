import Redis from 'ioredis';

class RedisClient {
    private static instance: Redis | null;

    private constructor() {}

    public static getInstance() {
        if (!RedisClient.instance) {
            try {
                const redis = new Redis(
                    process.env.REDIS_URL || 'redis://localhost:6379',
                    {
                        retryStrategy: () => null,
                    }
                );
                RedisClient.instance = redis;
            } catch (error) {
                console.error('error connecting to Redis...', error);
                RedisClient.instance = null;
            }
        }
        return RedisClient.instance;
    }
}

const redisInstance = RedisClient.getInstance();
export default redisInstance;
