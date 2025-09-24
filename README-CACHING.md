# Redis Caching Implementation

This document provides an overview of the Redis caching implementation in the REYOG application.

## Features

- **High-performance caching** using Upstash Redis
- **Automatic cache invalidation** when data changes
- **API route caching** for improved performance
- **Type-safe** cache keys and namespaces
- **Cache warming** for critical data
- **React hooks** for easy integration with components

## Setup

1. **Environment Variables**

   Add these to your `.env` file:
   ```
   UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
   ```

2. **Install Dependencies**
   ```bash
   npm install @upstash/redis
   ```

## Usage

### Basic Caching

```typescript
import { withCache } from '@/lib/cache-utils';
import { CACHE_NAMESPACE } from '@/lib/cache-keys';

// Fetch data with caching
const user = await withCache({
  namespace: CACHE_NAMESPACE.USERS,
  key: `user:${userId}`,
  ttl: 'MEDIUM', // or a number of seconds
  fetch: async () => {
    // Your data fetching logic here
    return prisma.user.findUnique({ where: { id: userId } });
  },
});
```

### API Route Caching

```typescript
import { withApiCache, generateApiCacheKey } from '@/lib/api-cache';
import { CACHE_NAMESPACE } from '@/lib/cache-keys';

export default withApiCache(
  async function handler(req, res) {
    // Your API handler logic
    res.status(200).json({ data: 'Hello, world!' });
  },
  {
    namespace: CACHE_NAMESPACE.API,
    getCacheKey: (req) => generateApiCacheKey('my-api', req),
    ttl: 'SHORT',
    methods: ['GET'],
  }
);
```

### Invalidate Cache

```typescript
import { invalidateCache } from '@/lib/cache-utils';
import { CACHE_NAMESPACE } from '@/lib/cache-keys';

// Invalidate a specific key
await invalidateCache(CACHE_NAMESPACE.USERS, `user:${userId}`);

// Invalidate all keys in a namespace
await invalidateCache(CACHE_NAMESPACE.USERS);
```

## Cache Warming

Cache warming is automatically handled for critical data on application startup. You can also manually trigger it:

```typescript
import { warmupCache } from '@/lib/cache-warmup';

// Warm up all caches
await warmupCache();
```

## Testing

Run the cache demo page to test the caching functionality:

```bash
npm run dev
```

Then navigate to `/cache-demo` in your browser.

## Best Practices

1. **Use meaningful namespaces** to organize your cache keys
2. **Set appropriate TTLs** based on data volatility
3. **Invalidate cache** when data changes
4. **Use the cache utils** for consistent behavior
5. **Monitor cache hit/miss ratios** in production

## Monitoring

Monitor your Upstash Redis dashboard for:
- Memory usage
- Number of keys
- Cache hit/miss ratio
- Latency

## Troubleshooting

### Cache Not Updating
- Check if cache invalidation is working
- Verify TTL values are appropriate
- Check for race conditions

### Performance Issues
- Monitor Redis server metrics
- Consider increasing your Upstash plan if needed
- Check for large cache keys or values
