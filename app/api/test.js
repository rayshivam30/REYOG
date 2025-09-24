// File: /pages/api/test.js

import { rateLimiter } from '@/lib/rate-limiter'; // Your rate limiter logic

export default async function handler(req, res) {
  // 1. Run the rate limiter
  const identifier = 'user-ip-address'; // Or user ID
  const { success } = await rateLimiter.limit(identifier);

  // 2. If limit is exceeded, return an error
  if (!success) {
    return res.status(429).json({ error: 'Too Many Requests' });
  }

  // 3. If limit is not exceeded, proceed with the API logic
  return res.status(200).json({ message: 'Success! Your data is here.' });
}