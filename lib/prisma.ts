import { PrismaClient as BasePrismaClient } from "@prisma/client"
import { prismaCacheMiddleware } from "./prisma-cache-middleware"
import { warmupCache } from "./cache-warmup"

// Extend the PrismaClient type to include $use
class PrismaClient extends BasePrismaClient {
  // @ts-ignore - Middleware array for Prisma
  private _middlewares: any[] = [];

  constructor(options?: ConstructorParameters<typeof BasePrismaClient>[0]) {
    super(options);
    
    // Initialize $use method
    this.$use = (middleware) => {
      this._middlewares.push(middleware);
    };
  }
  
  // Type declaration for $use
  $use: (middleware: any) => void;
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Initialize Prisma client with cache middleware
const createPrismaClient = (): PrismaClient => {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        // Configure connection pool settings
        url: process.env.DATABASE_URL,
      },
    },
    // Configure transaction options
    transactionOptions: {
      maxWait: 5000, // Max wait time in ms
      timeout: 10000, // Overall timeout in ms
    },
  });

  // Add our cache middleware
  client.$use(prismaCacheMiddleware);
  
  return client;
};

const prisma = global.prisma || createPrismaClient();

// Enable connection pooling in development
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Warm up cache on startup in production
if (process.env.NODE_ENV === 'production') {
  warmupCache().catch(console.error);
}

export { prisma }
