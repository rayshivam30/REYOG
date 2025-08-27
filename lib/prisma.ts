import { PrismaClient } from "@prisma/client"

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma || new PrismaClient({
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
})

// Enable connection pooling in development
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export { prisma }
