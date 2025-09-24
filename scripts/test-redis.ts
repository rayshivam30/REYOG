import { getCachedData, setCachedData, invalidateNamespace } from '../lib/redis';
import { CACHE_NAMESPACE } from '../lib/cache-keys';

async function testRedisCache() {
  const testKey = 'test-key';
  const testData = { message: 'Hello, Redis!', timestamp: new Date().toISOString() };
  const namespace = 'test' as const;

  console.log('🚀 Testing Redis Cache...\n');

  // Test 1: Set data in cache
  console.log('1️⃣ Setting data in cache...');
  const setResult = await setCachedData(namespace, testKey, testData, 'SHORT');
  console.log(`✅ Set result: ${setResult ? 'Success' : 'Failed'}`);

  // Test 2: Get data from cache
  console.log('\n2️⃣ Getting data from cache...');
  const cachedData = await getCachedData<typeof testData>(namespace, testKey);
  console.log('📦 Cached data:', JSON.stringify(cachedData, null, 2));

  // Test 3: Delete data from cache
  console.log('\n3️⃣ Deleting data from cache...');
  const deleteResult = await invalidateNamespace(namespace);
  console.log(`🗑️  Deleted ${deleteResult} keys from namespace '${namespace}'`);

  // Test 4: Verify data is deleted
  console.log('\n4️⃣ Verifying data is deleted...');
  const deletedData = await getCachedData(namespace, testKey);
  console.log(`🔍 Data after deletion: ${deletedData ? 'Still exists' : 'Not found (expected)'}`);

  console.log('\n🎉 Redis cache test completed!');
}

// Run the test
testRedisCache().catch(console.error);
