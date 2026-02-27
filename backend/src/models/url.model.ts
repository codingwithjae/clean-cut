import boom from '@hapi/boom';
import type { Prisma, Url } from '@prisma/client';
import prisma from '../config/prisma.js';

const TRANSIENT_DB_ERROR_CODES = new Set([
  'ETIMEDOUT',
  'ECONNRESET',
  'ECONNREFUSED',
  'EHOSTUNREACH',
  'P1001',
  'P1008',
  '57P01',
  '57P02',
  '57P03',
]);

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const getErrorCode = (error: unknown): string | undefined => {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  const maybeCode = (error as { code?: unknown }).code;
  if (typeof maybeCode === 'string' && maybeCode.length > 0) {
    return maybeCode.toUpperCase();
  }

  return undefined;
};

const isTransientDbError = (error: unknown): boolean => {
  const code = getErrorCode(error);
  if (code && TRANSIENT_DB_ERROR_CODES.has(code)) {
    return true;
  }

  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error ?? '').toLowerCase();

  return (
    message.includes('timed out') ||
    message.includes('timeout') ||
    message.includes('connection') ||
    message.includes('database is starting up') ||
    message.includes('server closed the connection')
  );
};

export class UrlModel {
  static async findByShortId(shortId: string): Promise<Url | null> {
    try {
      return await prisma.url.findUnique({ where: { shortId } });
    } catch (error) {
      throw boom.internal('Error fetching URL by shortId', error);
    }
  }

  static async create(data: Prisma.UrlCreateInput): Promise<Url> {
    const maxRetries = 2;

    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      try {
        return await prisma.url.create({ data });
      } catch (error) {
        const transient = isTransientDbError(error);
        const hasRetry = attempt < maxRetries;

        if (transient && hasRetry) {
          await sleep(200 * (attempt + 1));
          continue;
        }

        if (transient) {
          throw boom.serverUnavailable('Service is waking up. Please retry in a few seconds.', {
            cause: error,
          });
        }

        throw boom.internal('Error creating shortened URL', error);
      }
    }

    throw boom.serverUnavailable('Service is waking up. Please retry in a few seconds.');
  }

  static async incrementClicks(shortId: string): Promise<Url> {
    try {
      return await prisma.url.update({
        where: { shortId },
        data: { clicks: { increment: 1 } },
      });
    } catch (error) {
      throw boom.internal('Error incrementing click count', error);
    }
  }

  static async delete(shortId: string): Promise<Url> {
    try {
      return await prisma.url.delete({ where: { shortId } });
    } catch (error) {
      throw boom.internal('Error deleting URL', error);
    }
  }

  static async update(shortId: string, data: Prisma.UrlUpdateInput): Promise<Url> {
    try {
      return await prisma.url.update({
        where: { shortId },
        data,
      });
    } catch (error) {
      throw boom.internal('Error updating URL', error);
    }
  }

  static async findByUserId(userId: number): Promise<Url[]> {
    try {
      return await prisma.url.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw boom.internal('Error fetching user links', error);
    }
  }
}
