import boom from '@hapi/boom';
import type { Prisma, Url } from '@prisma/client';
import prisma from '../config/prisma.js';

export class UrlModel {
  static async findByShortId(shortId: string): Promise<Url | null> {
    try {
      return await prisma.url.findUnique({ where: { shortId } });
    } catch (error) {
      throw boom.internal('Error fetching URL by shortId', error);
    }
  }

  static async create(data: Prisma.UrlCreateInput): Promise<Url> {
    try {
      return await prisma.url.create({ data });
    } catch (error) {
      throw boom.internal('Error creating shortened URL', error);
    }
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
