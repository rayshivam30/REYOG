# Redis Caching Layer

This document outlines the Redis caching implementation for the REYOG application using Upstash Redis.

## Setup

1. **Prerequisites**:
   - Node.js 16+
   - Upstash Redis database

2. **Environment Variables**:
   Add these to your `.env` file:
   ```
   UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
   ```

## Implementation Details

### Cache Structure
- **Namespacing**: All cache keys are prefixed with `reYog:` followed by the namespace and key
- **TTL**: Different TTLs are defined for different types of data

### Key Components

1. **Redis Client** (`lib/redis.ts`)
   - Handles Redis connection and basic operations
   - Provides utility functions for getting, setting, and deleting cached data
   - Implements cache invalidation by namespace

2. **Cache Keys** (`lib/cache-keys.ts`)
   - Centralized key generation for consistent cache key naming
   - Organized by domain (users, panchayats, queries)

3. **Cache Warming** (`lib/cache-warmup.ts`)
   - Preloads frequently accessed data on application startup
   - Currently warms up user and panchayat caches

4. **Prisma Middleware** (`lib/prisma-cache-middleware.ts`)
   - Automatically invalidates cache when data changes
   - Handles create, update, delete operations

## Usage

### Basic Caching

```typescript
import { getCachedData, setCachedData } from '@/lib/redis';
import { CACHE_NAMESPACE } from '@/lib/cache-keys';

// Get data from cache or fetch from database
const getData = async (id: string) => {
  return getCachedData(CACHE_NAMESPACE.MY_DATA, id) || await fetchDataFromDB(id);
};

// Set data in cache
const setData = async (id: string, data: any) => {
  await setCachedData(CACHE_NAMESPACE.MY_DATA, id, data, 'MEDIUM');
};
```

### Using Cache Middleware

The Prisma middleware automatically handles cache invalidation. No additional code is needed for basic CRUD operations.

### Cache Warming

Cache warming runs automatically in production. To manually trigger it:

```typescript
import { warmupCache } from '@/lib/cache-warmup';

// Warm up all caches
await warmupCache();
```

## Best Practices

1. **Key Naming**: Always use the utility functions in `cache-keys.ts` to generate cache keys
2. **TTL**: Choose appropriate TTL based on data volatility
3. **Bulk Operations**: Use batch operations when dealing with multiple items
4. **Error Handling**: Always handle cache misses gracefully

## Monitoring

Monitor your Upstash Redis dashboard for:
- Memory usage
- Number of keys
- Cache hit/miss ratio
- Latency

## Troubleshooting

1. **Cache Inconsistencies**:
   - Check if the cache invalidation is working correctly
   - Verify TTL values are appropriate for your use case

2. **Performance Issues**:
   - Check Redis server metrics
   - Consider increasing your Upstash plan if needed

3. **Connection Issues**:
   - Verify environment variables are set correctly
   - Check network connectivity to Upstash Redis
