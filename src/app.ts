import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import { registerGraphQL } from './graphql';
import { logger } from './config/logger';
import { errorHandler } from './shared/errors/error-handler';
import { registerHealthRoute } from './routes/health';

let cachedApp: Express | undefined;

/** Lazily builds and caches the Express app (used by Vercel serverless). */
async function getApp(): Promise<Express> {
  if (!cachedApp) {
    await connectDatabase();
    cachedApp = await createApp();
  }
  return cachedApp;
}

/**
 * Vercel serverless entry point.
 * @see https://vercel.com/docs/functions/runtimes/node-js#using-express-with-vercel
 */
export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const app = await getApp();
  app(req, res);
}

export async function createApp() {
  const app = express();

  app.disable('x-powered-by');

  app.use(helmet({ contentSecurityPolicy: env.NODE_ENV === 'production' }));
  app.use(
    cors({
      origin:
        env.CORS_ORIGIN === '*'
          ? true
          : env.CORS_ORIGIN.split(',').map((o) => o.trim()),
    }),
  );
  app.use(pinoHttp({ logger }));
  app.use(express.json({ limit: '1mb' }));

  registerHealthRoute(app);
  await registerGraphQL(app);

  app.use(errorHandler);

  return app;
}
