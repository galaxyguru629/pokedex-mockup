import { PrismaClient } from '@prisma/client';
import { env } from './env';
import { getAppDatabaseUrl } from './database-url';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: getAppDatabaseUrl() } },
    log:
      env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

// Reuse the client across serverless invocations to limit DB connections.
globalForPrisma.prisma = prisma;

export async function connectDatabase(): Promise<void> {
  await prisma.$connect();
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
