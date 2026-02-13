import { Router } from 'express';
import { loggerMiddleware } from '../middlewares/logger.middleware.js';
import { rateLimiterMiddleware } from '../middlewares/rateLimiter.middleware.js';
import authRouter from './auth.routes.js';
import urlRouter from './url.routes.js';

const router = Router();
const v1 = Router();

router.use(loggerMiddleware);
router.use(rateLimiterMiddleware);

v1.use('/auth', authRouter);
v1.use('/urls', urlRouter);
v1.get('/health', (_req, res): void => {
  res.status(200).json({ status: 'OK' });
});

router.use('/v1', v1);

export default router;
