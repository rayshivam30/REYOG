import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { getCachedData, setCachedData, CACHE_TTL } from './redis';

// Re-export CACHE_TTL for convenience
export { CACHE_TTL };
import { CACHE_NAMESPACE } from './cache-keys';

/**
 * Options for the API cache middleware
 */
type ApiCacheOptions = {
  /**
   * Cache namespace for the route
   */
  namespace: keyof typeof CACHE_NAMESPACE;
  /**
   * Cache key generator function
   */
  getCacheKey: (req: NextApiRequest) => string;
  /**
   * Cache TTL (default: 'MEDIUM')
   */
  ttl?: keyof typeof CACHE_TTL;
  /**
   * Whether to bypass the cache (default: false)
   */
  bypassCache?: boolean;
  /**
   * Request methods to cache (default: ['GET'])
   */
  methods?: string[];
};

/**
 * API route cache middleware
 * 
 * @example
 * ```typescript
 * import { withApiCache } from '@/lib/api-cache';
 * 
 * async function handler(req, res) {
 *   // Your API handler logic
 *   res.status(200).json({ data: 'Hello, world!' });
 * }
 * 
 * export default withApiCache(handler, {
 *   namespace: 'api',
 *   getCacheKey: (req) => `route:${req.url}`,
 *   ttl: 'SHORT',
 * });
 * ```
 */
export function withApiCache(
  handler: NextApiHandler,
  options: ApiCacheOptions
): NextApiHandler {
  const {
    namespace,
    getCacheKey,
    ttl = 'MEDIUM',
    bypassCache = false,
    methods = ['GET'],
  } = options;

  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (!methods.includes(req.method || '')) {
      return handler(req, res);
    }

    const cacheKey = getCacheKey(req);
    let response: any = null;
    if (!bypassCache) {
      const cachedResponse = await getCachedData(namespace, cacheKey);
      if (cachedResponse) {
        res.setHeader('X-Cache', 'HIT');
        return res.status(200).json(cachedResponse);
      }
    }

    // Create a response interceptor to capture the response
    const originalJson = res.json.bind(res);
    const originalEnd = res.end.bind(res);
    const chunks: Buffer[] = [];
    let responseSent = false;

    // Override response methods to capture the response
    // @ts-ignore - We're intentionally overriding the response methods
    res.json = function(this: NextApiResponse, body: any) {
      response = body;
      responseSent = true;
      this.setHeader('Content-Type', 'application/json');
      return originalJson.call(this, body);
    };

    // Override end to capture the response
    // @ts-ignore - We're intentionally overriding the end method
    res.end = function(this: NextApiResponse, chunk?: any, encoding?: any, callback?: any) {
      if (chunk) {
        chunks.push(Buffer.from(chunk));
      }
      
      if (!responseSent && chunks.length > 0) {
        try {
          response = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
        } catch (error) {
          console.error('Error parsing response:', error);
        }
      }
      
      return originalEnd.call(this, chunk, encoding, callback);
    };

    try {
      // Call the actual handler
      await handler(req, res);
      
      // Cache the response if successful (2xx status)
      if (response && res.statusCode >= 200 && res.statusCode < 300) {
        // Use the TTL value directly since we're only accepting valid CACHE_TTL keys
        await setCachedData(namespace, cacheKey, response, ttl || 'MEDIUM');
      }
    } catch (error) {
      console.error('API handler error:', error);
      throw error;
    }
  };
}

/**
 * Helper to generate cache keys for API routes
 */
export function generateApiCacheKey(prefix: string, req: NextApiRequest): string {
  const { query, url } = req;
  const queryString = Object.entries(query)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  
  return `${prefix}:${url}${queryString ? `?${queryString}` : ''}`;
}
