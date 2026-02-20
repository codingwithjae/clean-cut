import boom from '@hapi/boom';
import type { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/user.model.js';
import { AuthService } from '../services/auth.service.js';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    name?: string | null;
  };
}

export async function authMiddleware(req: AuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'];

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (!token) return next(boom.unauthorized('Invalid token format'));

    try {
      const payload = await AuthService.decodeToken(token);
      const user = await UserModel.findByEmail(payload.email);
      if (!user) return next(boom.unauthorized('Invalid or expired token'));
      if (!user.isVerified) return next(boom.unauthorized('Please verify your email address'));
      req.user = payload;
      return next();
    } catch (_error) {
      return next(boom.unauthorized('Invalid or expired token'));
    }
  }

  if (apiKey && typeof apiKey === 'string') {
    try {
      const user = await UserModel.findByApiKey(apiKey);
      if (!user) return next(boom.unauthorized('Invalid API Key'));
      if (!user.isVerified) {
        return next(boom.unauthorized('User account not verified'));
      }

      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
      };
      return next();
    } catch (error) {
      return next(error);
    }
  }

  return next(boom.unauthorized('No authentication provided (Bearer token or X-API-Key required)'));
}

export async function bearerAuthMiddleware(req: AuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(boom.unauthorized('Bearer token required'));
  }

  const token = authHeader.split(' ')[1];
  if (!token) return next(boom.unauthorized('Invalid token format'));

  try {
    const payload = await AuthService.decodeToken(token);
    const user = await UserModel.findByEmail(payload.email);
    if (!user) return next(boom.unauthorized('Invalid or expired token'));
    if (!user.isVerified) return next(boom.unauthorized('Please verify your email address'));
    req.user = payload;
    return next();
  } catch (_error) {
    return next(boom.unauthorized('Invalid or expired token'));
  }
}

export async function optionalAuthMiddleware(req: AuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'];

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        const payload = await AuthService.decodeToken(token);
        req.user = payload;
        return next();
      } catch (_error) {}
    }
  }

  if (apiKey && typeof apiKey === 'string') {
    try {
      const user = await UserModel.findByApiKey(apiKey);
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          name: user.name,
        };
        return next();
      }
    } catch (_error) {}
  }

  next();
}
