import type { Express } from 'express';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { createApp } from '../src/app';
import { connectDatabase } from '../src/config/database';

let cachedApp: Express | undefined;

async function getApp(): Promise<Express> {
  if (!cachedApp) {
    await connectDatabase();
    cachedApp = await createApp();
  }
  return cachedApp;
}

/** Vercel serverless entry — all routes are rewritten here. */
export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const app = await getApp();
  app(req, res);
}
