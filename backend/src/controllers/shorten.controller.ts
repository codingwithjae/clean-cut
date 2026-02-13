import boom from '@hapi/boom';
import type { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import type { AuthRequest } from '../middlewares/auth.middleware.js';
import { UrlModel } from '../models/url.model.js';

export class ShortenController {
  static async privateShorten(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const { originalUrl, shortId: customShortId } = req.body;
    const userId = req.user?.id;
    const shortId = customShortId || uuidv4().slice(0, 5);

    try {
      if (customShortId) {
        const existing = await UrlModel.findByShortId(customShortId);
        if (existing) throw boom.conflict('Short ID already in use');
      }

      const url = await UrlModel.create({
        originalUrl,
        shortId,
        user: userId ? { connect: { id: userId } } : undefined,
      });

      res.status(201).json(url);
    } catch (error) {
      next(error);
    }
  }

  static async publicShorten(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const { originalUrl } = req.body;
    const userId = req.user?.id;
    const shortId = uuidv4().slice(0, 5);

    try {
      await UrlModel.create({
        originalUrl,
        shortId,
        user: userId ? { connect: { id: userId } } : undefined,
      });

      res.status(201).json({
        message: 'URL shortened successfully',
        shortUrl: `${req.protocol}://${req.get('host')}/${shortId}`,
        shortId,
      });
    } catch (error) {
      next(error);
    }
  }

  static async redirect(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { shortId } = req.params;

    if (typeof shortId !== 'string') return next(boom.badRequest('Invalid short ID'));

    try {
      const url = await UrlModel.findByShortId(shortId);

      if (!url) throw boom.notFound('URL not found');

      await UrlModel.incrementClicks(shortId);

      res.redirect(url.originalUrl);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const { shortId } = req.params;
    const userId = req.user?.id;

    if (typeof shortId !== 'string') return next(boom.badRequest('Invalid short ID'));

    try {
      const url = await UrlModel.findByShortId(shortId);

      if (!url) throw boom.notFound('URL not found');
      if (url.userId !== userId)
        throw boom.forbidden('You do not have permission to delete this URL');

      await UrlModel.delete(shortId);

      res.status(200).json({ message: 'URL deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const { shortId } = req.params;
    const { newShortId, originalUrl } = req.body;
    const userId = req.user?.id;

    if (typeof shortId !== 'string') return next(boom.badRequest('Invalid short ID'));

    try {
      const url = await UrlModel.findByShortId(shortId);

      if (!url) throw boom.notFound('URL not found');
      if (url.userId !== userId)
        throw boom.forbidden('You do not have permission to update this URL');

      if (newShortId && newShortId !== shortId) {
        const existing = await UrlModel.findByShortId(newShortId);
        if (existing) throw boom.conflict('New Short ID already in use');
      }

      const updatedUrl = await UrlModel.update(shortId, {
        shortId: newShortId || undefined,
        originalUrl: originalUrl || undefined,
      });

      res.status(200).json(updatedUrl);
    } catch (error) {
      next(error);
    }
  }

  static async getUserLinks(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.id;
    if (!userId) return next(boom.unauthorized());

    try {
      const links = await UrlModel.findByUserId(userId);
      res.status(200).json(links);
    } catch (error) {
      next(error);
    }
  }
}
