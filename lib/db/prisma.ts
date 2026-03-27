import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

// Ensure we reuse the Prisma client in all environments
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
}

// Handle graceful shutdown
if (typeof window === 'undefined') {
  const cleanup = async () => {
    await prisma.$disconnect()
  }

  process.on('beforeExit', cleanup)
  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)
}

export default prisma
