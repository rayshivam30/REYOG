import { 
  getCachedData, 
  setCachedData, 
  deleteCachedData, 
  invalidateNamespace, 
  CACHE_TTL 
} from './redis';
import { CACHE_NAMESPACE } from './cache-keys';

type CacheOptions<T> = {
  namespace: keyof typeof CACHE_NAMESPACE;
  key: string;
  ttl?: keyof typeof CACHE_TTL;
  forceRefresh?: boolean;
};

/**
 * Fetches data with caching support
 * 
 * @example
 * ```typescript
 * const user = await withCache({
 *   namespace: 'users',
 *   key: `user:${userId}`,
 *   ttl: 'MEDIUM',
 *   fetch: () => prisma.user.findUnique({ where: { id: userId } })
 * });
 * ```
 */
export async function withCache<T>(
  options: CacheOptions<T> & { fetch: () => Promise<T> }
): Promise<T> {
  const { namespace, key, ttl = 'MEDIUM', forceRefresh = false, fetch } = options;
  
  // Try to get cached data if not forcing refresh
  if (!forceRefresh) {
    const cachedData = await getCachedData<T>(namespace, key);
    if (cachedData) {
      return cachedData;
    }
  }
  
  // Fetch fresh data if no cache or forcing refresh
  const data = await fetch();
  
  // Cache the result if we got data
  if (data !== null && data !== undefined) {
    // Use the TTL string as is, it will be resolved in the setCachedData function
    await setCachedData(namespace, key, data, ttl);
  }
  
  return data;
}

/**
 * Invalidates cache for a specific key or namespace
 */
export async function invalidateCache(
  namespace: keyof typeof CACHE_NAMESPACE,
  key?: string
): Promise<boolean> {
  if (key) {
    // Invalidate specific key
    const result = await deleteCachedData(namespace, key);
    return result;
  } else {
    // Invalidate entire namespace
    const count = await invalidateNamespace(namespace);
    return count > 0;
  }
}

// Re-export common cache functions for convenience
export { 
  getCachedData, 
  setCachedData, 
  deleteCachedData, 
  invalidateNamespace,
  CACHE_TTL
};

export { CACHE_NAMESPACE };
