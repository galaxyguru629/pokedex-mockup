import type { Request, Response, NextFunction } from 'express';
import type { GraphQLFormattedError } from 'graphql';
import { AppError } from './app-error';
import { logger } from '../../config/logger';
import { env } from '../../config/env';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  logger.error({ err }, 'Unhandled error');

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message:
        env.NODE_ENV === 'production'
          ? 'An unexpected error occurred'
          : err instanceof Error
            ? err.message
            : 'Unknown error',
    },
  });
}

export function formatGraphQLError(
  formattedError: GraphQLFormattedError,
  error: unknown,
): GraphQLFormattedError {
  const original =
    error instanceof Error && 'originalError' in error
      ? (error as { originalError?: unknown }).originalError
      : error;

  if (original instanceof AppError) {
    return {
      ...formattedError,
      message: original.message,
      extensions: {
        ...formattedError.extensions,
        code: original.code,
        statusCode: original.statusCode,
      },
    };
  }

  if (env.NODE_ENV === 'production') {
    return {
      ...formattedError,
      message: 'An unexpected error occurred',
      extensions: {
        ...formattedError.extensions,
        code: 'INTERNAL_ERROR',
      },
    };
  }

  return formattedError;
}
