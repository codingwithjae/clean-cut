import boom from '@hapi/boom';
import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation failed',
      details: err.flatten().fieldErrors,
    });
    return;
  }

  if (boom.isBoom(err)) {
    const { output } = err;
    res.status(output.statusCode).json({
      statusCode: output.statusCode,
      error: output.payload.error,
      message: output.payload.message,
      ...(err.data ? { details: err.data } : {}),
    });
    return;
  }

  if (err instanceof Error && err.message === 'CORS origin not allowed') {
    res.status(403).json({
      statusCode: 403,
      error: 'Forbidden',
      message: 'Origin not allowed by CORS policy',
    });
    return;
  }

  process.stderr.write(`Unhandled Error: ${err}\n`);

  res.status(500).json({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
}
