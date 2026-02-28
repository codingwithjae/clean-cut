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

const getErrorSignals = (error: unknown): { codes: string[]; messages: string[] } => {
  const codes: string[] = [];
  const messages: string[] = [];

  const visit = (value: unknown) => {
    if (!value || typeof value !== 'object') {
      if (typeof value === 'string') {
        messages.push(value.toLowerCase());
      }
      return;
    }

    const maybeCode = (value as { code?: unknown }).code;
    if (typeof maybeCode === 'string' && maybeCode.length > 0) {
      codes.push(maybeCode.toUpperCase());
    }

    const maybeOriginalCode = (value as { originalCode?: unknown }).originalCode;
    if (typeof maybeOriginalCode === 'string' && maybeOriginalCode.length > 0) {
      codes.push(maybeOriginalCode.toUpperCase());
    }

    const maybeMessage = (value as { message?: unknown }).message;
    if (typeof maybeMessage === 'string' && maybeMessage.length > 0) {
      messages.push(maybeMessage.toLowerCase());
    }

    const maybeOriginalMessage = (value as { originalMessage?: unknown }).originalMessage;
    if (typeof maybeOriginalMessage === 'string' && maybeOriginalMessage.length > 0) {
      messages.push(maybeOriginalMessage.toLowerCase());
    }

    const maybeCause = (value as { cause?: unknown }).cause;
    if (maybeCause) {
      visit(maybeCause);
    }
  };

  visit(error);
  return { codes, messages };
};

const isTransientDbError = (error: unknown): boolean => {
  const { codes, messages } = getErrorSignals(error);

  if (codes.some((code) => TRANSIENT_DB_ERROR_CODES.has(code))) {
    return true;
  }

  const fullMessage = messages.join(' ');

  return (
    fullMessage.includes('timed out') ||
    fullMessage.includes('timeout') ||
    fullMessage.includes('connection') ||
    fullMessage.includes('database system is starting up') ||
    fullMessage.includes('database is starting up') ||
    fullMessage.includes('server closed the connection')
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
          await sleep(300 * (attempt + 1));
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
