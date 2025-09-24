import { Prisma } from '@prisma/client';
import { CACHE_NAMESPACE } from './cache-keys';
import { invalidateNamespace } from './redis';

type PrismaMiddleware = (params: any, next: (params: any) => Promise<any>) => Promise<any>;

/**
 * Prisma middleware for automatic cache invalidation
 */
/**
 * Prisma middleware for automatic cache invalidation
 */
export const prismaCacheMiddleware: PrismaMiddleware = async (params, next) => {
  const { model, action, args } = params;
  
  // Call the next middleware in the chain
  const result = await next(params);
  
  // Invalidate cache based on the model and action
  try {
    if (model) {
      switch (model) {
        case 'User':
          await handleUserCacheInvalidation(action, args, result);
          break;
        case 'Panchayat':
          await handlePanchayatCacheInvalidation(action, args, result);
          break;
        case 'Query':
          await handleQueryCacheInvalidation(action, args, result);
          break;
        // Add more models as needed
      }
    }
  } catch (error) {
    console.error('Cache invalidation error:', error);
    // Don't fail the request if cache invalidation fails
  }
  
  return result;
};

// Handle user-related cache invalidation
async function handleUserCacheInvalidation(
  action: string,
  args: any,
  result: any
) {
  if (['create', 'update', 'delete', 'upsert'].includes(action)) {
    // Invalidate the entire users namespace for simplicity
    // In a real app, you might want to be more granular
    await invalidateNamespace(CACHE_NAMESPACE.USERS);
    
    // If we have a specific user ID, we could be more targeted
    const userId = result?.id || args?.where?.id;
    if (userId) {
      // Invalidate specific user cache
      await invalidateNamespace(`${CACHE_NAMESPACE.USERS}:${userId}`);
    }
  }
}

// Handle panchayat-related cache invalidation
async function handlePanchayatCacheInvalidation(
  action: string,
  args: any,
  result: any
) {
  if (['create', 'update', 'delete', 'upsert'].includes(action)) {
    // Invalidate the entire panchayats namespace
    await invalidateNamespace(CACHE_NAMESPACE.PANCHAYATS);
    
    // Invalidate specific panchayat cache if we have an ID
    const panchayatId = result?.id || args?.where?.id;
    if (panchayatId) {
      await invalidateNamespace(`${CACHE_NAMESPACE.PANCHAYATS}:${panchayatId}`);
    }
  }
}

// Handle query-related cache invalidation
async function handleQueryCacheInvalidation(
  action: string,
  args: any,
  result: any
) {
  if (['create', 'update', 'delete', 'upsert'].includes(action)) {
    // Invalidate the entire queries namespace
    await invalidateNamespace(CACHE_NAMESPACE.QUERIES);
    
    // Invalidate specific query cache if we have an ID
    const queryId = result?.id || args?.where?.id;
    if (queryId) {
      await invalidateNamespace(`${CACHE_NAMESPACE.QUERIES}:${queryId}`);
    }
    
    // If this is a user's query, invalidate their query list
    const userId = result?.userId || args?.data?.userId;
    if (userId) {
      await invalidateNamespace(`${CACHE_NAMESPACE.QUERIES}:user:${userId}`);
    }
  }
}

// To use this middleware, add it to your Prisma client like this:
/*
import { PrismaClient } from '@prisma/client';
import { prismaCacheMiddleware } from './lib/prisma-cache-middleware';

const prisma = new PrismaClient();
prisma.$use(prismaCacheMiddleware);

export { prisma };
*/
