import boom from '@hapi/boom';
import { rateLimit } from 'express-rate-limit';

import { env } from '../config/env.js';

type LimiterOptions = {
  windowMs: number;
  limit: number;
  message: string;
};

const createBoomRateLimiter = ({ windowMs, limit, message }: LimiterOptions) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, next) => {
      next(boom.tooManyRequests(message));
    },
  });

// Public URL creation: 100 req/IP/hour by default.
export const publicShortenRateLimiter = createBoomRateLimiter({
  windowMs: env.RATE_LIMIT_PUBLIC_SHORTEN_WINDOW_MS,
  limit: env.RATE_LIMIT_PUBLIC_SHORTEN_MAX,
  message: 'Too many shorten requests. Please try again later.',
});

// Hot path: redirects. Keep generous but protect against abuse.
export const redirectRateLimiter = createBoomRateLimiter({
  windowMs: env.RATE_LIMIT_REDIRECT_WINDOW_MS,
  limit: env.RATE_LIMIT_REDIRECT_MAX,
  message: 'Too many redirect requests. Please try again later.',
});

export const authLoginRateLimiter = createBoomRateLimiter({
  windowMs: env.RATE_LIMIT_AUTH_LOGIN_WINDOW_MS,
  limit: env.RATE_LIMIT_AUTH_LOGIN_MAX,
  message: 'Too many login attempts. Please try again later.',
});

export const authRegisterRateLimiter = createBoomRateLimiter({
  windowMs: env.RATE_LIMIT_AUTH_REGISTER_WINDOW_MS,
  limit: env.RATE_LIMIT_AUTH_REGISTER_MAX,
  message: 'Too many registration attempts. Please try again later.',
});

export const authForgotPasswordRateLimiter = createBoomRateLimiter({
  windowMs: env.RATE_LIMIT_AUTH_FORGOT_PASSWORD_WINDOW_MS,
  limit: env.RATE_LIMIT_AUTH_FORGOT_PASSWORD_MAX,
  message: 'Too many password reset requests. Please try again later.',
});

export const authResetPasswordRateLimiter = createBoomRateLimiter({
  windowMs: env.RATE_LIMIT_AUTH_RESET_PASSWORD_WINDOW_MS,
  limit: env.RATE_LIMIT_AUTH_RESET_PASSWORD_MAX,
  message: 'Too many password reset attempts. Please try again later.',
});

export const authApiKeyRegenerateRateLimiter = createBoomRateLimiter({
  windowMs: env.RATE_LIMIT_AUTH_API_KEY_REGENERATE_WINDOW_MS,
  limit: env.RATE_LIMIT_AUTH_API_KEY_REGENERATE_MAX,
  message: 'Too many API key regeneration requests. Please try again later.',
});
