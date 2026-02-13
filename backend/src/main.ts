import boom from '@hapi/boom';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import passport from 'passport';
import './config/passport.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import prisma from './config/prisma.js';
import { ShortenController } from './controllers/shorten.controller.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import routes from './routes/index.js';

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.NODE_ENV !== 'production') {
        callback(null, true);
        return;
      }

      if (env.corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('CORS origin not allowed'));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(passport.initialize());

app.get('/', (_req, res) => {
  res.status(200).json({
    name: 'Clean Cut API',
    status: 'OK',
    health: '/api/v1/health',
  });
});

app.use('/api', routes);

app.get('/:shortId', ShortenController.redirect);

app.use((_req, _res, next): void => {
  next(boom.notFound('Route not found'));
});

app.use(errorMiddleware);

async function main() {
  try {
    await prisma.$connect();

    app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

main();
