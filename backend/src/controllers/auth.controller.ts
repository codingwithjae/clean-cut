import boom from '@hapi/boom';
import argon2 from 'argon2';
import type { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/prisma.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';
import { UserModel } from '../models/user.model.js';
import { AuthService } from '../services/auth.service.js';
import { EmailService } from '../services/email.service.js';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password, name } = req.body;

    try {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        throw boom.conflict('Email already in use');
      }

      const passwordHash = await argon2.hash(password);
      const verificationToken = uuidv4();

      await UserModel.create({
        email,
        password: passwordHash,
        name,
        verificationToken,
        isVerified: false,
      });

      await EmailService.sendVerificationEmail(email, (name as string) || email, verificationToken);

      res.status(201).json({
        message: 'Registration successful. Please check your email to verify your account.',
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { token } = req.params as { token: string };

    try {
      const user = await UserModel.findByVerificationToken(token);
      if (!user) {
        throw boom.notFound('Invalid or expired verification token');
      }

      await UserModel.update(user.id, {
        isVerified: true,
        verificationToken: null,
      });

      res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;

    try {
      const user = await UserModel.findByEmail(email);

      if (!user || !user.password) {
        throw boom.unauthorized('Email does not exist, must register first');
      }

      const isValid = await argon2.verify(user.password, password);
      if (!isValid) {
        throw boom.unauthorized('Invalid credentials');
      }

      if (!user.isVerified) {
        throw boom.unauthorized('Please verify your email address before logging in');
      }

      const token = await AuthService.tokenGeneration({
        id: user.id,
        email: user.email,
        name: user.name,
      });

      res.status(200).json({
        message: `Welcome back, ${user.name || user.email}`,
        accessToken: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isVerified: user.isVerified,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.id;
    if (!userId) return next(boom.unauthorized());

    try {
      const user = await UserModel.findById(userId);
      if (!user) throw boom.notFound('User not found');

      res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isVerified: user.isVerified,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getApiKey(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.id;
    if (!userId) return next(boom.unauthorized());

    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw boom.notFound('User not found');

      res.status(200).json({ apiKey: user.apiKey });
    } catch (error) {
      next(error);
    }
  }

  static async regenerateApiKey(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const userId = req.user?.id;
    if (!userId) return next(boom.unauthorized());

    const newApiKey = uuidv4();

    try {
      const user = await UserModel.update(userId, { apiKey: newApiKey });

      res.status(200).json({
        message: user.apiKey ? 'API Key regenerated successfully' : 'API Key created successfully',
        apiKey: user.apiKey,
      });
    } catch (error) {
      next(error);
    }
  }
}
