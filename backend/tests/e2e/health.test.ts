import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { errorMiddleware } from '../../src/middlewares/error.middleware.js';
import routes from '../../src/routes/index.js';

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use('/api/v1', routes);
app.use(errorMiddleware);

describe('Health E2E', () => {
  it('should return api health status', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'OK' });
  });
});
