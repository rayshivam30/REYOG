# Rate Limiting Environment Variables for Upstash Redis

## Required Environment Variables

Add these environment variables to your `.env.local` file for development and to your Vercel dashboard for production:

### Upstash Redis Configuration
```
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
```

### How to Get These Values

1. **Sign up for Upstash**: Go to [upstash.com](https://upstash.com) and create a free account
2. **Create a Redis Database**:
   - Click "Create Database"
   - Choose "Serverless" type
   - Select your preferred region (choose one close to your users)
   - Copy the REST URL and REST Token from the database details

3. **Add to Vercel**:
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add the environment variables with the same names

## Rate Limiting Configuration

The rate limiting is configured with different limits for different types of endpoints:

- **Authentication endpoints** (`/api/auth/*`): 5 requests per minute
- **Upload endpoints** (`/api/uploads/*`): 20 requests per minute
- **Admin endpoints** (`/api/admin/*`): 50 requests per minute
- **Public endpoints** (`/api/panchayats/*`, `/api/offices/*`, etc.): 200 requests per minute
- **General API routes**: 100 requests per minute

## Production Deployment Notes

1. **Environment Variables**: Make sure to add the Upstash Redis credentials to your Vercel environment variables
2. **Database Connection**: The rate limiting uses serverless Redis, so it scales automatically with your Vercel deployment
3. **Error Handling**: The middleware includes error handling to prevent rate limiting failures from breaking your application
4. **Monitoring**: You can monitor rate limiting usage in your Upstash dashboard

## Security Notes

- Keep your Upstash Redis tokens secure and never commit them to version control
- The rate limiting identifies users by IP address for anonymous requests and by user ID for authenticated requests
- Rate limit headers are included in responses for client-side handling if needed
