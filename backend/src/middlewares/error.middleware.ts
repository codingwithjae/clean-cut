import boom from '@hapi/boom';
import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

type ErrorBody = {
  statusCode: number;
  error: string;
  message: string;
  requestId?: string;
  details?: unknown;
};

const getRequestId = (req: Request): string | undefined => {
  const header = req.headers['x-request-id'];
  return typeof header === 'string' && header.trim() ? header.trim() : undefined;
};

const logError = (req: Request, statusCode: number, err: unknown) => {
  const requestId = getRequestId(req);
  const method = req.method;
  const path = req.originalUrl || req.url;
  const idPart = requestId ? ` request-id=${requestId}` : '';

  if (statusCode >= 500) {
    logger.error(`${method} ${path} ${statusCode}${idPart}`, err);
    return;
  }

  logger.warn(`${method} ${path} ${statusCode}${idPart}`);
};

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const requestId = getRequestId(req);

  if (err instanceof ZodError) {
    logError(req, 400, err);
    res.status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation failed',
      ...(requestId ? { requestId } : {}),
      details: err.flatten().fieldErrors,
    });
    return;
  }

  if (boom.isBoom(err)) {
    const { output } = err;
    const statusCode = output.statusCode;
    logError(req, statusCode, err);

    const isProd = env.NODE_ENV === 'production';
    const shouldHide = isProd && statusCode >= 500;
    const message = shouldHide ? 'An unexpected error occurred' : output.payload.message;
    const details = !isProd && err.data !== undefined ? err.data : undefined;

    const body: ErrorBody = {
      statusCode,
      error: output.payload.error,
      message,
      ...(requestId ? { requestId } : {}),
      ...(details !== undefined ? { details } : {}),
    };

    res.status(output.statusCode).json({
      ...body,
    });
    return;
  }

  if (err instanceof Error && err.message === 'CORS origin not allowed') {
    logError(req, 403, err);
    res.status(403).json({
      statusCode: 403,
      error: 'Forbidden',
      message: 'Origin not allowed by CORS policy',
      ...(requestId ? { requestId } : {}),
    });
    return;
  }

  logError(req, 500, err);

  const isProd = env.NODE_ENV === 'production';
  const message = isProd
    ? 'An unexpected error occurred'
    : err instanceof Error
      ? err.message
      : 'An unexpected error occurred';

  res.status(500).json({
    statusCode: 500,
    error: 'Internal Server Error',
    message,
    ...(requestId ? { requestId } : {}),
  });
}
