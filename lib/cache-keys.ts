/**
 * Cache key generator for consistent key naming
 */

// Cache namespaces
export const CACHE_NAMESPACE = {
  USERS: 'users',
  PANCHAYATS: 'panchayats',
  QUERIES: 'queries',
  API: 'api',
  // Add more namespaces as needed
} as const;

/**
 * Generate cache keys for users
 */
export const userCacheKeys = {
  byId: (userId: string) => `user:${userId}`,
  byEmail: (email: string) => `user:email:${email}`,
  all: 'users:all',
};

/**
 * Generate cache keys for panchayats
 */
export const panchayatCacheKeys = {
  byId: (panchayatId: string) => `panchayat:${panchayatId}`,
  byDistrict: (district: string) => `panchayats:district:${district}`,
  all: 'panchayats:all',
};

/**
 * Generate cache keys for queries
 */
export const queryCacheKeys = {
  byId: (queryId: string) => `query:${queryId}`,
  byUser: (userId: string) => `queries:user:${userId}`,
  byStatus: (status: string) => `queries:status:${status}`,
  all: 'queries:all',
};
