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
app.use('/api', routes);
app.use(errorMiddleware);

describe('Health E2E', () => {
  it('should return api health status', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'OK' });
  });

  it('should return 404 for invalid API prefixes', async () => {
    const apiHealthRes = await request(app).get('/api/health');
    const v1HealthRes = await request(app).get('/v1/health');
    const nonVersionedAuthRes = await request(app).post('/api/auth/login').send({});

    expect(apiHealthRes.status).toBe(404);
    expect(v1HealthRes.status).toBe(404);
    expect(nonVersionedAuthRes.status).toBe(404);
  });

  it('should return 400 on /api/v1/auth/login with invalid payload', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
  });

  it('should rate limit health endpoint bursts', async () => {
    let throttledResponse: { status: number; body: { message?: string } } | null = null;
    const forwardedIp = '203.0.113.100';

    for (let attempt = 0; attempt < 180; attempt += 1) {
      const res = await request(app).get('/api/v1/health').set('X-Forwarded-For', forwardedIp);

      if (res.status === 429) {
        throttledResponse = res;
        break;
      }
    }

    expect(throttledResponse).not.toBeNull();
    expect(throttledResponse?.body.message).toContain('Too many requests');
  });
});
