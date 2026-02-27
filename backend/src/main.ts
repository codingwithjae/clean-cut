import boom from '@hapi/boom';
import cors from 'cors';
import type { RequestHandler } from 'express';
import express from 'express';
import helmet from 'helmet';
import passport from 'passport';
import './config/passport.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import prisma from './config/prisma.js';
import { ShortenController } from './controllers/shorten.controller.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { redirectRateLimiter } from './middlewares/rateLimiter.middleware.js';
import routes from './routes/index.js';

const app = express();
const normalizeOrigin = (origin: string) => origin.trim().replace(/\/$/, '').toLowerCase();
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || env.NODE_ENV !== 'production') {
      callback(null, true);
      return;
    }

    const incomingOrigin = normalizeOrigin(origin);

    if (env.corsOrigins.includes(incomingOrigin)) {
      callback(null, true);
      return;
    }

    callback(new Error('CORS origin not allowed'));
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  optionsSuccessStatus: 204,
};

const trustProxyHops = env.TRUST_PROXY_HOPS ?? (env.NODE_ENV === 'production' ? 1 : 0);
app.set('trust proxy', trustProxyHops);
app.use(helmet());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(passport.initialize() as unknown as RequestHandler);

app.get('/', (_req, res) => {
  res.status(200).json({
    name: 'Korta API',
    status: 'OK',
    health: '/api/v1/health',
  });
});

app.use('/api', routes);

app.get('/:shortId', redirectRateLimiter, ShortenController.redirect);

app.use((_req, _res, next): void => {
  next(boom.notFound('Route not found'));
});

app.use(errorMiddleware);

async function main() {
  try {
    await prisma.$connect();

    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

main();
