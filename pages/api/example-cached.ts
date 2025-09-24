import { NextApiRequest, NextApiResponse } from 'next';
import { withApiCache, generateApiCacheKey } from '@/lib/api-cache';
import { CACHE_NAMESPACE } from '@/lib/cache-keys';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Simulate a slow API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const data = {
    message: 'This is a cached API response',
    timestamp: new Date().toISOString(),
    query: req.query,
  };

  res.status(200).json(data);
}

// Wrap the handler with the cache middleware
export default withApiCache(handler, {
  namespace: CACHE_NAMESPACE.API,
  getCacheKey: (req) => generateApiCacheKey('example', req),
  ttl: 'SHORT', // 5 minutes
  methods: ['GET'],
});
