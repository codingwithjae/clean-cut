import { faker } from '@faker-js/faker';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import '../../src/config/passport.js';
import { env } from '../../src/config/env.js';
import prisma from '../../src/config/prisma.js';
import { errorMiddleware } from '../../src/middlewares/error.middleware.js';
import routes from '../../src/routes/index.js';
import { EmailService } from '../../src/services/email.service.js';

vi.mock('../../src/services/email.service.js', () => ({
  EmailService: {
    sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
    sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
  },
}));

const app = express();
app.set('trust proxy', 1);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(passport.initialize());
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

  it('should resend verification when registering an existing unverified email', async () => {
    const user = createTestUser();

    const firstRegister = await request(app).post('/api/v1/auth/register').send(user);
    expect(firstRegister.status).toBe(201);

    const secondRegister = await request(app)
      .post('/api/v1/auth/register')
      .send({
        ...user,
        password: faker.internet.password({ length: 12, pattern: /[A-Za-z0-9!]/ }),
      });

    expect(secondRegister.status).toBe(200);
    expect(secondRegister.body.message).toContain('pending verification');
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
    expect(updatedUser?.verificationToken).toBe(token);

    const verifyAgainRes = await request(app).get(`/api/v1/auth/verify/${token}`);
    expect(verifyAgainRes.status).toBe(200);
    expect(verifyAgainRes.body.message).toContain('already verified');
  });

  it('should return not found for invalid verification token', async () => {
    const res = await request(app).get(`/api/v1/auth/verify/${faker.string.uuid()}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toContain('Invalid or expired verification token');
  });

  it('should invalidate old verification token after re-registering unverified email', async () => {
    const user = createTestUser();

    const firstRegister = await request(app).post('/api/v1/auth/register').send(user);
    expect(firstRegister.status).toBe(201);

    const firstDbUser = await prisma.user.findUnique({ where: { email: user.email } });
    const firstToken = firstDbUser?.verificationToken;
    expect(firstToken).toBeDefined();

    const secondRegister = await request(app)
      .post('/api/v1/auth/register')
      .send({
        ...user,
        password: faker.internet.password({ length: 14, pattern: /[A-Za-z0-9!]/ }),
      });
    expect(secondRegister.status).toBe(200);

    const secondDbUser = await prisma.user.findUnique({ where: { email: user.email } });
    const latestToken = secondDbUser?.verificationToken;
    expect(latestToken).toBeDefined();
    expect(latestToken).not.toBe(firstToken);

    const oldTokenRes = await request(app).get(`/api/v1/auth/verify/${firstToken}`);
    expect(oldTokenRes.status).toBe(404);
    expect(oldTokenRes.body.message).toContain('Invalid or expired verification token');

    const latestTokenRes = await request(app).get(`/api/v1/auth/verify/${latestToken}`);
    expect(latestTokenRes.status).toBe(200);
    expect(latestTokenRes.body.message).toBe('Email verified successfully');
  });

  it('should reject /me when authentication is missing', async () => {
    const res = await request(app).get('/api/v1/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.message).toContain('No authentication provided');
  });

  it('should reject /me with malformed bearer token', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer malformed.token.value');

    expect(res.status).toBe(401);
    expect(res.body.message).toContain('Invalid or expired token');
  });

  it('should reject /me with empty bearer token value', async () => {
    const res = await request(app).get('/api/v1/auth/me').set('Authorization', 'Bearer ');

    expect(res.status).toBe(401);
    expect([
      'Invalid token format',
      'Invalid or expired token',
      'No authentication provided (Bearer token or X-API-Key required)',
    ]).toContain(res.body.message as string);
  });

  it('should reject /me with expired bearer token', async () => {
    const user = createTestUser();
    const registerRes = await request(app).post('/api/v1/auth/register').send(user);
    expect(registerRes.status).toBe(201);

    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    expect(dbUser?.id).toBeDefined();

    await prisma.user.update({ where: { email: user.email }, data: { isVerified: true } });

    const expiredToken = jwt.sign(
      {
        id: dbUser?.id,
        email: user.email,
        name: user.name,
      },
      env.jwtSecret,
      { algorithm: 'HS256', expiresIn: '-1s' },
    );

    const meRes = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(meRes.status).toBe(401);
    expect(meRes.body.message).toContain('Invalid or expired token');
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

  it('should not allow X-API-Key auth for API key management endpoints', async () => {
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
      .post('/api/v1/auth/api-key/regenerate')
      .set('Authorization', `Bearer ${token}`);
    expect(createRes.status).toBe(200);
    const apiKey = createRes.body.apiKey as string;
    expect(apiKey).toBeDefined();

    const getWithKey = await request(app).get('/api/v1/auth/api-key').set('X-API-Key', apiKey);
    expect(getWithKey.status).toBe(401);
    expect(getWithKey.body.message).toContain('Bearer token required');

    const regenWithKey = await request(app)
      .post('/api/v1/auth/api-key/regenerate')
      .set('X-API-Key', apiKey);
    expect(regenWithKey.status).toBe(401);
    expect(regenWithKey.body.message).toContain('Bearer token required');
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

  it('should return generic forgot-password response for existing and non-existing emails', async () => {
    const user = createTestUser();
    const registerRes = await request(app).post('/api/v1/auth/register').send(user);
    expect(registerRes.status).toBe(201);

    vi.mocked(EmailService.sendPasswordResetEmail).mockClear();

    const existingRes = await request(app).post('/api/v1/auth/forgot-password').send({
      email: user.email,
    });
    expect(existingRes.status).toBe(200);
    expect(existingRes.body.message).toBe(
      'If an account with that email exists, we sent password reset instructions.',
    );

    const nonExistingRes = await request(app).post('/api/v1/auth/forgot-password').send({
      email: faker.internet.email().toLowerCase(),
    });
    expect(nonExistingRes.status).toBe(200);
    expect(nonExistingRes.body.message).toBe(
      'If an account with that email exists, we sent password reset instructions.',
    );

    expect(vi.mocked(EmailService.sendPasswordResetEmail)).toHaveBeenCalledTimes(1);
  });

  it('should reset password with valid token and invalidate old password', async () => {
    const user = createTestUser();
    const registerRes = await request(app).post('/api/v1/auth/register').send(user);
    expect(registerRes.status).toBe(201);

    const resetToken = faker.string.uuid();
    await prisma.user.update({
      where: { email: user.email },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });

    const newPassword = faker.internet.password({ length: 14, pattern: /[A-Za-z0-9!]/ });

    const resetRes = await request(app).post('/api/v1/auth/reset-password').send({
      token: resetToken,
      newPassword,
      confirmPassword: newPassword,
    });
    expect(resetRes.status).toBe(200);
    expect(resetRes.body.message).toContain('Password reset successfully');

    const updatedUser = await prisma.user.findUnique({ where: { email: user.email } });
    expect(updatedUser?.isVerified).toBe(true);

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

  it('should reject reset-password with invalid token', async () => {
    const newPassword = faker.internet.password({ length: 14, pattern: /[A-Za-z0-9!]/ });
    const res = await request(app).post('/api/v1/auth/reset-password').send({
      token: faker.string.uuid(),
      newPassword,
      confirmPassword: newPassword,
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Invalid or expired password reset token');
  });

  it('should reject reset-password with expired token', async () => {
    const user = createTestUser();
    const registerRes = await request(app).post('/api/v1/auth/register').send(user);
    expect(registerRes.status).toBe(201);

    await prisma.user.update({
      where: { email: user.email },
      data: {
        passwordResetToken: faker.string.uuid(),
        passwordResetExpiresAt: new Date(Date.now() - 60 * 1000),
      },
    });

    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    expect(dbUser?.passwordResetToken).toBeDefined();

    const newPassword = faker.internet.password({ length: 14, pattern: /[A-Za-z0-9!]/ });
    const res = await request(app).post('/api/v1/auth/reset-password').send({
      token: dbUser?.passwordResetToken,
      newPassword,
      confirmPassword: newPassword,
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Invalid or expired password reset token');
  });

  it('should not allow reusing reset token after successful reset', async () => {
    const user = createTestUser();
    const registerRes = await request(app).post('/api/v1/auth/register').send(user);
    expect(registerRes.status).toBe(201);

    const resetToken = faker.string.uuid();
    await prisma.user.update({
      where: { email: user.email },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });

    const newPassword = faker.internet.password({ length: 14, pattern: /[A-Za-z0-9!]/ });

    const firstReset = await request(app).post('/api/v1/auth/reset-password').send({
      token: resetToken,
      newPassword,
      confirmPassword: newPassword,
    });
    expect(firstReset.status).toBe(200);

    const secondReset = await request(app).post('/api/v1/auth/reset-password').send({
      token: resetToken,
      newPassword,
      confirmPassword: newPassword,
    });
    expect(secondReset.status).toBe(400);
    expect(secondReset.body.message).toContain('Invalid or expired password reset token');
  });

  it('should rate limit auth abuse-sensitive unauthenticated endpoints per IP', async () => {
    const ip = '203.0.113.30';
    const resetPassword = faker.internet.password({ length: 14, pattern: /[A-Za-z0-9!]/ });

    const cases = [
      {
        name: 'login',
        max: env.RATE_LIMIT_AUTH_LOGIN_MAX,
        expectedMessage: 'Too many login attempts',
        makeRequest: () =>
          request(app)
            .post('/api/v1/auth/login')
            .set('X-Forwarded-For', ip)
            .send({
              email: faker.internet.email().toLowerCase(),
              password: faker.internet.password({ length: 12, pattern: /[A-Za-z0-9!]/ }),
            }),
      },
      {
        name: 'register',
        max: env.RATE_LIMIT_AUTH_REGISTER_MAX,
        expectedMessage: 'Too many registration attempts',
        makeRequest: () =>
          request(app)
            .post('/api/v1/auth/register')
            .set('X-Forwarded-For', ip)
            .send({
              email: faker.internet.email().toLowerCase(),
              password: faker.internet.password({ length: 12, pattern: /[A-Za-z0-9!]/ }),
              name: faker.person.fullName(),
            }),
      },
      {
        name: 'forgot-password',
        max: env.RATE_LIMIT_AUTH_FORGOT_PASSWORD_MAX,
        expectedMessage: 'Too many password reset requests',
        makeRequest: () =>
          request(app).post('/api/v1/auth/forgot-password').set('X-Forwarded-For', ip).send({
            email: faker.internet.email().toLowerCase(),
          }),
      },
      {
        name: 'reset-password',
        max: env.RATE_LIMIT_AUTH_RESET_PASSWORD_MAX,
        expectedMessage: 'Too many password reset attempts',
        makeRequest: () =>
          request(app).post('/api/v1/auth/reset-password').set('X-Forwarded-For', ip).send({
            token: faker.string.uuid(),
            newPassword: resetPassword,
            confirmPassword: resetPassword,
          }),
      },
    ] as const;

    for (const testCase of cases) {
      for (let i = 0; i < testCase.max; i++) {
        const res = await testCase.makeRequest();
        expect(res.status).not.toBe(429);
      }

      const blocked = await testCase.makeRequest();
      expect(blocked.status, `endpoint: ${testCase.name}`).toBe(429);
      expect(blocked.body.statusCode).toBe(429);
      expect(blocked.body.error).toBe('Too Many Requests');
      expect(blocked.body.message).toContain(testCase.expectedMessage);
    }
  });

  it('should rate limit api-key regeneration endpoint per IP', async () => {
    const ip = '203.0.113.31';
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

    for (let i = 0; i < env.RATE_LIMIT_AUTH_API_KEY_REGENERATE_MAX; i++) {
      const res = await request(app)
        .post('/api/v1/auth/api-key/regenerate')
        .set('Authorization', `Bearer ${token}`)
        .set('X-Forwarded-For', ip);
      expect(res.status).toBe(200);
    }

    const blocked = await request(app)
      .post('/api/v1/auth/api-key/regenerate')
      .set('Authorization', `Bearer ${token}`)
      .set('X-Forwarded-For', ip);

    expect(blocked.status).toBe(429);
    expect(blocked.body.statusCode).toBe(429);
    expect(blocked.body.error).toBe('Too Many Requests');
    expect(blocked.body.message).toContain('Too many API key regeneration requests');
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

  it('should reject reused access token after account deletion', async () => {
    const user = createTestUser();
    const registerRes = await request(app).post('/api/v1/auth/register').send(user);
    expect(registerRes.status).toBe(201);

    await prisma.user.update({ where: { email: user.email }, data: { isVerified: true } });

    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: user.email,
      password: user.password,
    });
    expect(loginRes.status).toBe(200);

    const token = loginRes.body.accessToken as string;

    const deleteRes = await request(app)
      .delete('/api/v1/auth/account')
      .set('Authorization', `Bearer ${token}`);
    expect(deleteRes.status).toBe(200);

    const meRes = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${token}`);
    expect(meRes.status).toBe(401);
    expect(meRes.body.message).toContain('Invalid or expired token');
  });

  it('should redirect to frontend login on google callback failure', async () => {
    const res = await request(app).get('/api/v1/auth/google/callback?error=access_denied');
    const expectedLocation = new URL('/login', env.FRONTEND_URL).toString();

    expect(res.status).toBeGreaterThanOrEqual(300);
    expect(res.status).toBeLessThan(400);
    expect(res.headers.location).toBe(expectedLocation);
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
