import { Redis } from '@upstash/redis';

// Validate environment variables
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
  console.error('❌ Missing required environment variables for Upstash Redis');
  console.log('Please set the following environment variables:');
  console.log('UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url');
  console.log('UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token');
  
  // Create a mock Redis client in development to prevent runtime errors
  if (process.env.NODE_ENV !== 'production') {
    console.warn('⚠️  Running in development mode with mock Redis client. API calls will work but no caching will occur.');
    
    const mockRedis = {
      get: () => Promise.resolve(null),
      set: () => Promise.resolve('OK'),
      del: () => Promise.resolve(0),
      keys: () => Promise.resolve([]),
      info: () => Promise.resolve(''),
      // Add other Redis methods as needed
    } as unknown as Redis;
    
    // @ts-ignore
    var redis = mockRedis;
  } else {
    throw new Error('Missing required environment variables for Upstash Redis');
  }
} else {
  // Initialize the real Redis client
  var redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });
  
  console.log('✅ Redis client initialized successfully');
}

// Cache configuration
export const CACHE_TTL = {
  SHORT: 60 * 5, // 5 minutes
  MEDIUM: 60 * 60, // 1 hour
  LONG: 60 * 60 * 24, // 24 hours
} as const;

type CacheKey = string;
type CacheValue = string | object | number | boolean | null;

// Export the Redis client instance
export const getRedisClient = () => redis;

export type { Redis };

/**
 * Generate a namespaced cache key
 */
const generateKey = (namespace: string, key: string): CacheKey => {
  return `reYog:${namespace}:${key}`;
};

/**
 * Get cached data by key
 */
export const getCachedData = async <T = any>(
  namespace: string,
  key: string
): Promise<T | null> => {
  try {
    const cacheKey = generateKey(namespace, key);
    const data = await redis.get(cacheKey);
    return data as T;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
};

/**
 * Set data in cache with TTL
 */
export const setCachedData = async (
  namespace: string,
  key: string,
  value: CacheValue,
  ttl: keyof typeof CACHE_TTL = 'MEDIUM'
): Promise<boolean> => {
  try {
    const cacheKey = generateKey(namespace, key);
    await redis.set(cacheKey, value, { ex: CACHE_TTL[ttl] });
    return true;
  } catch (error) {
    console.error('Redis set error:', error);
    return false;
  }
};

/**
 * Delete cached data by key
 */
export const deleteCachedData = async (
  namespace: string,
  key: string
): Promise<boolean> => {
  try {
    const cacheKey = generateKey(namespace, key);
    await redis.del(cacheKey);
    return true;
  } catch (error) {
    console.error('Redis delete error:', error);
    return false;
  }
};

/**
 * Invalidate all cache entries for a namespace
 */
export const invalidateNamespace = async (
  namespace: string
): Promise<number> => {
  try {
    // This is a simple implementation that deletes all keys matching the namespace
    // In production, consider using SCAN for large datasets
    const keys = await redis.keys(`reYog:${namespace}:*`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    return keys.length;
  } catch (error) {
    console.error('Redis namespace invalidation error:', error);
    return 0;
  }
};

/**
 * Cache middleware for API routes
 */
export const withCache = async <T>(
  namespace: string,
  key: string,
  fetchFn: () => Promise<T>,
  options: {
    ttl?: keyof typeof CACHE_TTL;
    bypassCache?: boolean;
  } = {}
): Promise<T> => {
  const { ttl = 'MEDIUM', bypassCache = false } = options;

  // Try to get cached data first
  if (!bypassCache) {
    const cachedData = await getCachedData<T>(namespace, key);
    if (cachedData) {
      return cachedData;
    }
  }

  // If no cache or bypassing, fetch fresh data
  const freshData = await fetchFn();
  
  // Cache the fresh data
  if (freshData !== null && freshData !== undefined) {
    await setCachedData(namespace, key, freshData, ttl);
  }

  return freshData;
};

export default redis;
