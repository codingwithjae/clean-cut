import { faker } from '@faker-js/faker';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import prisma from '../../src/config/prisma.js';
import { errorMiddleware } from '../../src/middlewares/error.middleware.js';
import routes from '../../src/routes/index.js';
import { EmailService } from '../../src/services/email.service.js';

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

describe('Authentication & API Keys E2E', () => {
  beforeEach(async () => {
    await prisma.url.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const createTestUser = () => ({
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password({ length: 12, pattern: /[A-Za-z0-9!]/ }),
    name: faker.person.fullName(),
  });

  it('should register a user and require verification', async () => {
    const user = createTestUser();
    const res = await request(app).post('/api/v1/auth/register').send(user);
    expect(res.status).toBe(201);
    expect(res.body.message).toContain('Please check your email');

    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: user.email,
      password: user.password,
    });
    expect(loginRes.status).toBe(401);
    expect(loginRes.body.message).toContain('verify your email');
  });

  it('should verify email successfully', async () => {
    const user = createTestUser();
    const regRes = await request(app).post('/api/v1/auth/register').send(user);
    expect(regRes.status).toBe(201);

    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    const token = dbUser?.verificationToken;
    expect(token).toBeDefined();

    const verifyRes = await request(app).get(`/api/v1/auth/verify/${token}`);
    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.message).toBe('Email verified successfully');

    const updatedUser = await prisma.user.findUnique({ where: { email: user.email } });
    expect(updatedUser?.isVerified).toBe(true);
    expect(updatedUser?.verificationToken).toBeNull();
  });

  it('should manage API Keys lifecycle', async () => {
    const user = createTestUser();
    const regRes = await request(app).post('/api/v1/auth/register').send(user);
    expect(regRes.status).toBe(201);

    await prisma.user.update({ where: { email: user.email }, data: { isVerified: true } });

    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: user.email,
      password: user.password,
    });
    expect(loginRes.status).toBe(200);
    const token = loginRes.body.accessToken;

    const getRes = await request(app)
      .get('/api/v1/auth/api-key')
      .set('Authorization', `Bearer ${token}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.apiKey).toBeNull();

    const createRes = await request(app)
      .post('/api/v1/auth/api-key/regenerate')
      .set('Authorization', `Bearer ${token}`);
    expect(createRes.status).toBe(200);
    expect(createRes.body.message).toBe('API Key created successfully');
    expect(createRes.body.apiKey).toBeDefined();
    const firstKey = createRes.body.apiKey;

    const regenRes = await request(app)
      .post('/api/v1/auth/api-key/regenerate')
      .set('Authorization', `Bearer ${token}`);
    expect(regenRes.status).toBe(200);
    expect(regenRes.body.message).toBe('API Key regenerated successfully');
    expect(regenRes.body.apiKey).not.toBe(firstKey);
  });

  it('should change password successfully', async () => {
    const user = createTestUser();
    const regRes = await request(app).post('/api/v1/auth/register').send(user);
    expect(regRes.status).toBe(201);

    await prisma.user.update({ where: { email: user.email }, data: { isVerified: true } });

    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: user.email,
      password: user.password,
    });
    expect(loginRes.status).toBe(200);
    const token = loginRes.body.accessToken as string;

    const newPassword = faker.internet.password({ length: 14, pattern: /[A-Za-z0-9!]/ });
    const changeRes = await request(app)
      .post('/api/v1/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: user.password, newPassword });
    expect(changeRes.status).toBe(200);
    expect(changeRes.body.message).toContain('Password changed successfully');

    const oldLoginRes = await request(app).post('/api/v1/auth/login').send({
      email: user.email,
      password: user.password,
    });
    expect(oldLoginRes.status).toBe(401);

    const newLoginRes = await request(app).post('/api/v1/auth/login').send({
      email: user.email,
      password: newPassword,
    });
    expect(newLoginRes.status).toBe(200);
  });

  it('should reject password change with wrong current password', async () => {
    const user = createTestUser();
    const regRes = await request(app).post('/api/v1/auth/register').send(user);
    expect(regRes.status).toBe(201);

    await prisma.user.update({ where: { email: user.email }, data: { isVerified: true } });

    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: user.email,
      password: user.password,
    });
    expect(loginRes.status).toBe(200);

    const changeRes = await request(app)
      .post('/api/v1/auth/change-password')
      .set('Authorization', `Bearer ${loginRes.body.accessToken as string}`)
      .send({
        currentPassword: `${user.password}-wrong`,
        newPassword: faker.internet.password({ length: 14, pattern: /[A-Za-z0-9!]/ }),
      });
    expect(changeRes.status).toBe(401);
    expect(changeRes.body.message).toContain('Current password is incorrect');
  });

  it('should delete account and owned URLs', async () => {
    const user = createTestUser();
    const regRes = await request(app).post('/api/v1/auth/register').send(user);
    expect(regRes.status).toBe(201);

    await prisma.user.update({ where: { email: user.email }, data: { isVerified: true } });

    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: user.email,
      password: user.password,
    });
    expect(loginRes.status).toBe(200);
    const token = loginRes.body.accessToken as string;

    const createRes = await request(app)
      .post('/api/v1/urls')
      .set('Authorization', `Bearer ${token}`)
      .send({ originalUrl: faker.internet.url() });
    expect(createRes.status).toBe(201);

    const deleteRes = await request(app)
      .delete('/api/v1/auth/account')
      .set('Authorization', `Bearer ${token}`);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.message).toContain('Account deleted successfully');

    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    expect(dbUser).toBeNull();

    const userUrls = await prisma.url.findMany({
      where: { userId: loginRes.body.user.id as number },
    });
    expect(userUrls).toHaveLength(0);
  });

  it('should fail registration with invalid email schema', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      email: 'invalid-email',
      password: '123',
    });
    expect(res.status).toBe(400);
    expect(res.body.statusCode).toBe(400);
    expect(res.body.error).toBe('Bad Request');
    expect(res.body.message).toBe('Validation failed');
    expect(res.body.details).toBeDefined();
  });

  it('should rollback user creation when verification email fails', async () => {
    const user = createTestUser();
    vi.mocked(EmailService.sendVerificationEmail).mockRejectedValueOnce(new Error('SMTP failure'));

    const res = await request(app).post('/api/v1/auth/register').send(user);

    expect(res.status).toBe(503);
    expect(res.body.message).toContain('Unable to send verification email');

    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    expect(dbUser).toBeNull();
  });
});
