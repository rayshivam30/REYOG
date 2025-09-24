'use client';

import { useState, useEffect } from 'react';
import { withCache } from '@/lib/cache-utils';
import { CACHE_NAMESPACE } from '@/lib/cache-keys';

interface UserData {
  id: string;
  name: string;
  email: string;
  lastUpdated: string;
}

export default function CachedDataExample({ userId }: { userId: string }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [forceRefresh, setForceRefresh] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simulate an API call with caching
        const data = await withCache<UserData>({
          namespace: 'USERS',
          key: `user:${userId}`,
          ttl: 'SHORT', // 5 minutes
          forceRefresh,
          fetch: async () => {
            // In a real app, this would be an actual API call
            console.log('Fetching fresh user data...');
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
            
            // Simulated API response
            return {
              id: userId,
              name: 'John Doe',
              email: 'john@example.com',
              lastUpdated: new Date().toISOString(),
            };
          },
        });
        
        setUserData(data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
        setForceRefresh(false);
      }
    };
    
    fetchUserData();
  }, [userId, forceRefresh]);

  const handleRefresh = () => {
    setForceRefresh(true);
  };

  if (isLoading && !userData) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 border rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">User Profile (Cached)</h2>
      {userData && (
        <div className="space-y-2">
          <p><span className="font-medium">Name:</span> {userData.name}</p>
          <p><span className="font-medium">Email:</span> {userData.email}</p>
          <p className="text-sm text-gray-500">
            Last updated: {new Date(userData.lastUpdated).toLocaleString()}
          </p>
        </div>
      )}
      <div className="mt-4">
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Refreshing...' : 'Force Refresh'}
        </button>
        <p className="mt-2 text-sm text-gray-500">
          Try clicking "Force Refresh" to bypass the cache and fetch fresh data.
        </p>
      </div>
    </div>
  );
}
