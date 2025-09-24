// File: /scripts/test-auth-rate-limiter.mjs

// --- Configuration ---
const API_ENDPOINT = "http://localhost:3000/api/complaints"; // A PROTECTED route
const AUTH_TOKEN = "PASTE_YOUR_AUTH_TOKEN_HERE"; // 👈 Paste your token here
const REQUESTS_TO_FIRE = 110; // Higher than the general limit of 100

// --- Script ---
async function testAuthRateLimiter() {
  if (AUTH_TOKEN === "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJjbWZjOWVhcXg") {
    console.error("❌ Please paste a valid auth token into the script.");
    return;
  }
  
  console.log(`Firing ${REQUESTS_TO_FIRE} authenticated requests...`);

  const requests = [];
  for (let i = 1; i <= REQUESTS_TO_FIRE; i++) {
    requests.push(
      fetch(API_ENDPOINT, {
        headers: {
          // This is the important part!
          'Authorization': `Bearer ${AUTH_TOKEN}` 
        }
      }).then(response => {
        console.log(`Request #${i}: Status = ${response.status}`);
        return response.status;
      })
    );
  }

  await Promise.all(requests);
  console.log("\n✅ Authenticated test finished!");
}

testAuthRateLimiter();