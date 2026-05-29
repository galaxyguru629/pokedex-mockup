import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { registerGraphQL } from './graphql';
import { logger } from './config/logger';
import { errorHandler } from './shared/errors/error-handler';
import { registerHealthRoute } from './routes/health';

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
