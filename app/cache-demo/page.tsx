'use client';

import { Suspense, useState, useEffect } from 'react';
import CachedDataExample from '@/components/CachedDataExample';
import { CACHE_NAMESPACE } from '@/lib/cache-keys';
import { getRedisClient } from '@/lib/redis';

// Type for cache statistics
interface CacheStats {
  hits: number;
  misses: number;
  keys: number;
  memory: string;
}

// Initialize Redis client
const redis = getRedisClient();

export default function CacheDemoPage() {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchCacheStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get all keys in the users namespace
      const keys = await redis.keys(`${CACHE_NAMESPACE.USERS}:*`);
      
      // Get memory usage (simplified - in a real app, you might want to use a different approach)
      // Note: Upstash Redis has limited support for memory commands
      // This is a simplified version - in production, you might want to use a different approach
      const usedMemory = 'N/A'; // Placeholder - replace with actual memory usage if available
      
      // For demo purposes, we'll just log that we're skipping memory info
      console.log('Memory info not available in this demo');
      
      // In a real app, you'd track hits/misses in Redis using MONITOR or custom metrics
      setStats({
        hits: Math.floor(Math.random() * 1000), // Simulated
        misses: Math.floor(Math.random() * 100), // Simulated
        keys: keys.length,
        memory: usedMemory
      });
      
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching cache stats:', err);
      setError('Failed to load cache statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCache = async () => {
    if (!confirm('Are you sure you want to clear the cache? This will remove all cached data.')) {
      return;
    }
    
    try {
      setIsLoading(true);
      const keys = await redis.keys(`${CACHE_NAMESPACE.USERS}:*`);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      await fetchCacheStats();
      alert('Cache cleared successfully!');
    } catch (err) {
      console.error('Error clearing cache:', err);
      setError('Failed to clear cache');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCacheStats();
    
    // Refresh stats every 10 seconds
    const interval = setInterval(fetchCacheStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Redis Caching Demo</h1>
        <div className="text-sm text-gray-500">
          {lastUpdated && `Last updated: ${lastUpdated.toLocaleTimeString()}`}
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">How It Works</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Data is cached in Redis with a configurable TTL</li>
              <li>Subsequent requests are served from cache when available</li>
              <li>Click "Force Refresh" to bypass the cache</li>
              <li>Cache is automatically invalidated when data changes</li>
            </ul>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold">Cache Statistics</h2>
              <button
                onClick={fetchCacheStats}
                disabled={isLoading}
                className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
              >
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
            
            {isLoading && !stats ? (
              <div>Loading cache statistics...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : stats ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-green-50 rounded">
                    <div className="text-sm text-gray-500">Cache Hits</div>
                    <div className="text-xl font-semibold">{stats.hits.toLocaleString()}</div>
                  </div>
                  <div className="p-2 bg-red-50 rounded">
                    <div className="text-sm text-gray-500">Cache Misses</div>
                    <div className="text-xl font-semibold">{stats.misses.toLocaleString()}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-blue-50 rounded">
                    <div className="text-sm text-gray-500">Cached Keys</div>
                    <div className="text-xl font-semibold">{stats.keys}</div>
                  </div>
                  <div className="p-2 bg-purple-50 rounded">
                    <div className="text-sm text-gray-500">Memory Used</div>
                    <div className="text-xl font-semibold">{stats.memory}</div>
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    onClick={clearCache}
                    disabled={isLoading}
                    className="w-full py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-md font-medium disabled:opacity-50"
                  >
                    {isLoading ? 'Clearing...' : 'Clear Cache'}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Cache Configuration</h2>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="font-medium">Cache Provider:</span>
                <span>Upstash Redis</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium">Default TTL:</span>
                <span>5 minutes</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium">Namespace:</span>
                <code className="bg-gray-100 px-2 py-0.5 rounded">reYog:users</code>
              </li>
              <li className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className="inline-flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  Connected
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">User Profile</h2>
            <Suspense fallback={<div>Loading user data...</div>}>
              <CachedDataExample userId="example-user-123" />
            </Suspense>
          </div>
          
          <div className="p-4 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold mb-3">Try It Out</h2>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
              <li>Click "Force Refresh" to see the loading state</li>
              <li>Click it again within 5 minutes to see the cached version</li>
              <li>Check the browser console to see cache hits/misses</li>
              <li>Try clearing the cache with the button below</li>
            </ol>
            <div className="pt-2">
              <button
                onClick={clearCache}
                disabled={isLoading}
                className="w-full py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-md font-medium disabled:opacity-50"
              >
                {isLoading ? 'Clearing...' : 'Clear Cache'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
