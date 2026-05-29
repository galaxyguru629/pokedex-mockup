import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import type { Express } from 'express';
import express from 'express';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { formatGraphQLError } from '../shared/errors/error-handler';

export async function registerGraphQL(app: Express): Promise<void> {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: formatGraphQLError,
    introspection: true,
  });

  await server.start();

  app.use(
    '/graphql',
    express.json({ limit: '1mb' }),
    expressMiddleware(server),
  );

  app.use(
    '/',
    express.json({ limit: '1mb' }),
    expressMiddleware(server),
  );
}
