// File: /scripts/test-rate-limiter.mjs

// --- Configuration ---
const API_ENDPOINT = "http://localhost:3000/api/test";
const REQUESTS_TO_FIRE = 15; // Set this higher than your rate limit
const YOUR_RATE_LIMIT = 10;  // The limit you expect to be enforced

// --- Script ---
async function testRateLimiter() {
  console.log(`Firing ${REQUESTS_TO_FIRE} requests to test a limit of ${YOUR_RATE_LIMIT}...`);

  const requests = [];
  for (let i = 1; i <= REQUESTS_TO_FIRE; i++) {
    requests.push(
      fetch(API_ENDPOINT)
        .then(response => {
          console.log(`Request #${i}: Status = ${response.status}`);
          return response.status;
        })
        .catch(error => {
          console.error(`Request #${i}: Failed with error:`, error.message);
        })
    );
  }

  await Promise.all(requests);
  console.log("\n✅ Test finished!");
  console.log("Check the status codes above. You should see some 200s followed by 429s.");
}

testRateLimiter();