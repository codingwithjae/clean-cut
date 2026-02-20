import { Router } from 'express';
import { loggerMiddleware } from '../middlewares/logger.middleware.js';
import authRouter from './auth.routes.js';
import urlRouter from './url.routes.js';

const router = Router();
const v1Router = Router();

router.use(loggerMiddleware);

v1Router.use('/auth', authRouter);
v1Router.use('/urls', urlRouter);
v1Router.get('/health', (_req, res): void => {
  res.status(200).json({ status: 'OK' });
});

router.use('/v1', v1Router);

export default router;
