import boom from '@hapi/boom';
import type { NextFunction, Request, Response } from 'express';
import { UrlModel } from '../models/url.model.js';
import type { AuthRequest } from './auth.middleware.js';

export async function linkExistenceValidator(req: Request, _res: Response, next: NextFunction) {
  const { shortId } = req.params;
  if (typeof shortId !== 'string') return next(boom.badRequest('Invalid short ID'));

  try {
    const url = await UrlModel.findByShortId(shortId);
    if (!url) throw boom.notFound('The shortened link does not exist');
    next();
  } catch (error) {
    next(error);
  }
}

export async function linkOwnershipValidator(req: AuthRequest, _res: Response, next: NextFunction) {
  const { shortId } = req.params;
  const userId = req.user?.id;

  if (typeof shortId !== 'string') return next(boom.badRequest('Invalid short ID'));
  if (!userId) return next(boom.unauthorized('User identification required'));

  try {
    const url = await UrlModel.findByShortId(shortId);
    if (!url) throw boom.notFound('The shortened link does not exist');

    if (url.userId !== userId) {
      throw boom.forbidden('You do not have permission to modify this link');
    }

    next();
  } catch (error) {
    next(error);
  }
}
