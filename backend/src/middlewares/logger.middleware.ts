import type { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger.js';

export function loggerMiddleware(req: Request, _res: Response, next: NextFunction): void {
    if (req.method && req.originalUrl) {
        logger.info(`${req.method} request to: ${req.originalUrl}`);
    }
    next();
}
