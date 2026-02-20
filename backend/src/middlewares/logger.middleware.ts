import type { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger.js';

export function loggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = process.hrtime.bigint();
  const requestIdHeader = req.headers['x-request-id'];
  const requestId = typeof requestIdHeader === 'string' ? requestIdHeader : undefined;

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    const method = req.method;
    const path = req.originalUrl || req.url;
    const status = res.statusCode;
    const idPart = requestId ? ` request-id=${requestId}` : '';
    logger.info(`${method} ${path} ${status} ${durationMs.toFixed(1)}ms${idPart}`);
  });
  next();
}
