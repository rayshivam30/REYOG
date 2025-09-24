import { CACHE_NAMESPACE } from './cache-keys';
import { invalidateNamespace, setCachedData } from './redis';
import { prisma } from './prisma';

/**
 * Warms up the cache with frequently accessed data
 */
export const warmupCache = async () => {
  try {
    console.log('🔄 Warming up cache...');
    
    // Warm up users cache
    await warmupUsersCache();
    
    // Warm up panchayats cache
    await warmupPanchayatsCache();
    
    // Add more warmup functions as needed
    
    console.log('✅ Cache warmup completed');
  } catch (error) {
    console.error('Cache warmup failed:', error);
  }
};

/**
 * Warms up the users cache
 */
const warmupUsersCache = async () => {
  try {
    // Invalidate existing user cache
    await invalidateNamespace(CACHE_NAMESPACE.USERS);
    
    // Fetch and cache active users
    const activeUsers = await prisma.user.findMany({
      where: { status: 'ACTIVE' },
      take: 100, // Limit to prevent overloading
    });
    
    // Cache each user
    for (const user of activeUsers) {
      await setCachedData(
        CACHE_NAMESPACE.USERS,
        `user:${user.id}`,
        user,
        'LONG'
      );
    }
    
    console.log(`🔥 Warmed up cache for ${activeUsers.length} users`);
  } catch (error) {
    console.error('Failed to warm up users cache:', error);
  }
};

/**
 * Warms up the panchayats cache
 */
const warmupPanchayatsCache = async () => {
  try {
    // Invalidate existing panchayat cache
    await invalidateNamespace(CACHE_NAMESPACE.PANCHAYATS);
    
    // Fetch and cache all panchayats
    const panchayats = await prisma.panchayat.findMany({
      take: 500, // Adjust based on your data size
    });
    
    // Cache each panchayat
    for (const panchayat of panchayats) {
      await setCachedData(
        CACHE_NAMESPACE.PANCHAYATS,
        `panchayat:${panchayat.id}`,
        panchayat,
        'LONG'
      );
    }
    
    // Cache the full list of panchayats
    await setCachedData(
      CACHE_NAMESPACE.PANCHAYATS,
      'all',
      panchayats,
      'LONG'
    );
    
    console.log(`🔥 Warmed up cache for ${panchayats.length} panchayats`);
  } catch (error) {
    console.error('Failed to warm up panchayats cache:', error);
  }
};

// Add this to your application startup
// warmupCache().catch(console.error);
