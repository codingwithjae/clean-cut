import boom from '@hapi/boom';
import { rateLimit } from 'express-rate-limit';

export const rateLimiterMiddleware = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, next) => {
        next(boom.tooManyRequests('Too many requests, please try again later.'));
    },
});
