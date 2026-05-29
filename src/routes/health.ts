import type { Express, Request, Response } from 'express';
import { prisma } from '../config/database';

export async function healthHandler(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'degraded', database: 'disconnected' });
  }
}

export function registerHealthRoute(app: Express): void {
  app.get('/health', healthHandler);
}
