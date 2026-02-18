import { faker } from '@faker-js/faker';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import prisma from '../../src/config/prisma.js';
import { errorMiddleware } from '../../src/middlewares/error.middleware.js';
import routes from '../../src/routes/index.js';

vi.mock('../../src/services/email.service.js', () => ({
  EmailService: {
    sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
  },
}));

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use('/api', routes);
app.use(errorMiddleware);

describe('URL Management E2E', () => {
  let accessToken: string;
  let apiKey: string;
  const testUser = {
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
  };

  const createVerifiedUserAndLogin = async () => {
    const user = {
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password({ length: 12, pattern: /[A-Za-z0-9!]/ }),
    };

    await request(app).post('/api/v1/auth/register').send(user);
    await prisma.user.update({ where: { email: user.email }, data: { isVerified: true } });

    const loginRes = await request(app).post('/api/v1/auth/login').send(user);

    return {
      user,
      accessToken: loginRes.body.accessToken as string,
      userId: loginRes.body.user.id as number,
    };
  };

  beforeEach(async () => {
    await prisma.url.deleteMany();
    await prisma.user.deleteMany();

    await request(app).post('/api/v1/auth/register').send(testUser);
    await prisma.user.update({ where: { email: testUser.email }, data: { isVerified: true } });

    const loginRes = await request(app).post('/api/v1/auth/login').send(testUser);
    accessToken = loginRes.body.accessToken;

    const keyRes = await request(app)
      .post('/api/v1/auth/api-key/regenerate')
      .set('Authorization', `Bearer ${accessToken}`);
    apiKey = keyRes.body.apiKey;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should shorten a URL anonymously', async () => {
    const originalUrl = faker.internet.url();
    const res = await request(app).post('/api/v1/urls/public').send({ originalUrl });
    expect(res.status).toBe(201);
    expect(res.body.userId).toBeUndefined();
  });

  it('should shorten a URL as authenticated user (optional auth)', async () => {
    const originalUrl = faker.internet.url();
    const res = await request(app)
      .post('/api/v1/urls/public')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ originalUrl });
    expect(res.status).toBe(201);

    const urls = await prisma.url.findMany({ where: { originalUrl } });
    const firstUrl = urls.at(0);
    expect(firstUrl).toBeDefined();
    if (!firstUrl) {
      return;
    }
    expect(firstUrl.userId).toBeDefined();
  });

  it('should shorten a URL using API Key', async () => {
    const originalUrl = faker.internet.url();
    const res = await request(app)
      .post('/api/v1/urls')
      .set('X-API-Key', apiKey)
      .send({ originalUrl });
    expect(res.status).toBe(201);
  });

  it('should fail to shorten with invalid URL schema', async () => {
    const res = await request(app).post('/api/v1/urls/public').send({ originalUrl: 'not-a-url' });
    expect(res.status).toBe(400);
  });

  it('should fail with unverified API Key owner', async () => {
    const unverifiedUser = { email: faker.internet.email(), password: 'password' };
    await request(app).post('/api/v1/auth/register').send(unverifiedUser);
    const user = await prisma.user.findUnique({ where: { email: unverifiedUser.email } });

    const key = faker.string.uuid();
    await prisma.user.update({ where: { id: user?.id }, data: { apiKey: key } });

    const res = await request(app)
      .post('/api/v1/urls')
      .set('X-API-Key', key)
      .send({ originalUrl: faker.internet.url() });
    expect(res.status).toBe(401);
    expect(res.body.message).toContain('not verified');
  });

  it('should update and delete an owned URL', async () => {
    const originalUrl = faker.internet.url();
    const createRes = await request(app)
      .post('/api/v1/urls')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ originalUrl });
    expect(createRes.status).toBe(201);
    expect(createRes.body.shortId).toBeDefined();

    const createdShortId = createRes.body.shortId as string;
    const updatedShortId = faker.string.alphanumeric(5).toLowerCase();
    const updatedOriginalUrl = faker.internet.url();

    const updateRes = await request(app)
      .patch(`/api/v1/urls/${createdShortId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ newShortId: updatedShortId, originalUrl: updatedOriginalUrl });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.shortId).toBe(updatedShortId);
    expect(updateRes.body.originalUrl).toBe(updatedOriginalUrl);

    const deleteRes = await request(app)
      .delete(`/api/v1/urls/${updatedShortId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.message).toContain('deleted');
  });

  it('should update originalUrl without changing shortId', async () => {
    const originalUrl = faker.internet.url();
    const createRes = await request(app)
      .post('/api/v1/urls')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ originalUrl });
    expect(createRes.status).toBe(201);

    const createdShortId = createRes.body.shortId as string;
    const updatedOriginalUrl = faker.internet.url();

    const updateRes = await request(app)
      .patch(`/api/v1/urls/${createdShortId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ originalUrl: updatedOriginalUrl });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.shortId).toBe(createdShortId);
    expect(updateRes.body.originalUrl).toBe(updatedOriginalUrl);
  });

  it('should reject private URL creation with invalid API key', async () => {
    const res = await request(app)
      .post('/api/v1/urls')
      .set('X-API-Key', faker.string.uuid())
      .send({ originalUrl: faker.internet.url() });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid API Key');
  });

  it('should allow anonymous public creation when X-API-Key is invalid', async () => {
    const originalUrl = faker.internet.url();
    const res = await request(app)
      .post('/api/v1/urls/public')
      .set('X-API-Key', faker.string.uuid())
      .send({ originalUrl });

    expect(res.status).toBe(201);
    expect(res.body.shortId).toBeDefined();

    const createdUrl = await prisma.url.findUnique({
      where: { shortId: res.body.shortId as string },
    });
    expect(createdUrl?.userId).toBeNull();
  });

  it('should block user B from updating or deleting user A links', async () => {
    const createRes = await request(app)
      .post('/api/v1/urls')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ originalUrl: faker.internet.url() });
    expect(createRes.status).toBe(201);

    const otherUser = await createVerifiedUserAndLogin();

    const patchRes = await request(app)
      .patch(`/api/v1/urls/${createRes.body.shortId as string}`)
      .set('Authorization', `Bearer ${otherUser.accessToken}`)
      .send({ originalUrl: faker.internet.url() });
    expect(patchRes.status).toBe(403);
    expect(patchRes.body.message).toContain('permission');

    const deleteRes = await request(app)
      .delete(`/api/v1/urls/${createRes.body.shortId as string}`)
      .set('Authorization', `Bearer ${otherUser.accessToken}`);
    expect(deleteRes.status).toBe(403);
    expect(deleteRes.body.message).toContain('permission');
  });

  it('should reject PATCH with an empty body', async () => {
    const createRes = await request(app)
      .post('/api/v1/urls')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ originalUrl: faker.internet.url() });
    expect(createRes.status).toBe(201);

    const patchRes = await request(app)
      .patch(`/api/v1/urls/${createRes.body.shortId as string}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({});

    expect(patchRes.status).toBe(400);
    expect(patchRes.body.message).toBe('Validation failed');
  });

  it('should reject PATCH with invalid originalUrl', async () => {
    const createRes = await request(app)
      .post('/api/v1/urls')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ originalUrl: faker.internet.url() });
    expect(createRes.status).toBe(201);

    const patchRes = await request(app)
      .patch(`/api/v1/urls/${createRes.body.shortId as string}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ originalUrl: 'not-a-url' });

    expect(patchRes.status).toBe(400);
    expect(patchRes.body.message).toBe('Validation failed');
  });

  it('should reject PATCH with too-long newShortId', async () => {
    const createRes = await request(app)
      .post('/api/v1/urls')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ originalUrl: faker.internet.url() });
    expect(createRes.status).toBe(201);

    const patchRes = await request(app)
      .patch(`/api/v1/urls/${createRes.body.shortId as string}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ newShortId: faker.string.alphanumeric(6).toLowerCase() });

    expect(patchRes.status).toBe(400);
    expect(patchRes.body.message).toBe('Validation failed');
  });

  it('should reject PATCH with conflicting newShortId', async () => {
    const firstRes = await request(app)
      .post('/api/v1/urls')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ originalUrl: faker.internet.url() });
    expect(firstRes.status).toBe(201);

    const secondRes = await request(app)
      .post('/api/v1/urls')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ originalUrl: faker.internet.url() });
    expect(secondRes.status).toBe(201);

    const patchRes = await request(app)
      .patch(`/api/v1/urls/${firstRes.body.shortId as string}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ newShortId: secondRes.body.shortId as string });

    expect(patchRes.status).toBe(409);
    expect(patchRes.body.message).toContain('already in use');
  });

  it('should return not found when PATCH shortId does not exist', async () => {
    const patchRes = await request(app)
      .patch('/api/v1/urls/not00')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ originalUrl: faker.internet.url() });

    expect(patchRes.status).toBe(404);
    expect(patchRes.body.message).toContain('The shortened link does not exist');
  });

  it('should return only owner links in my-links', async () => {
    const owner = await prisma.user.findUnique({ where: { email: testUser.email } });
    expect(owner?.id).toBeDefined();

    const ownerCreate = await request(app)
      .post('/api/v1/urls')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ originalUrl: faker.internet.url() });
    expect(ownerCreate.status).toBe(201);

    const otherUser = await createVerifiedUserAndLogin();
    const otherCreate = await request(app)
      .post('/api/v1/urls')
      .set('Authorization', `Bearer ${otherUser.accessToken}`)
      .send({ originalUrl: faker.internet.url() });
    expect(otherCreate.status).toBe(201);

    const myLinksRes = await request(app)
      .get('/api/v1/urls/my-links')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(myLinksRes.status).toBe(200);
    const links = myLinksRes.body as Array<{ shortId: string; userId: number }>;
    expect(links.some((link) => link.shortId === ownerCreate.body.shortId)).toBe(true);
    expect(links.some((link) => link.shortId === otherCreate.body.shortId)).toBe(false);
    expect(links.every((link) => link.userId === owner?.id)).toBe(true);
  });
});
