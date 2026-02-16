import boom from '@hapi/boom';
import type { Prisma, User } from '@prisma/client';
import prisma from '../config/prisma.js';

export class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({ where: { email } });
    } catch (error) {
      throw boom.internal('Error finding user by email', error);
    }
  }

  static async findById(id: number): Promise<User | null> {
    try {
      return await prisma.user.findUnique({ where: { id } });
    } catch (error) {
      throw boom.internal('Error finding user by ID', error);
    }
  }

  static async findByGoogleId(googleId: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({ where: { googleId } });
    } catch (error) {
      throw boom.internal('Error finding user by Google ID', error);
    }
  }

  static async findByApiKey(apiKey: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({ where: { apiKey } });
    } catch (error) {
      throw boom.internal('Error finding user by API key', error);
    }
  }

  static async findByVerificationToken(token: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({ where: { verificationToken: token } });
    } catch (error) {
      throw boom.internal('Error finding user by verification token', error);
    }
  }

  static async create(data: Prisma.UserCreateInput): Promise<User> {
    try {
      return await prisma.user.create({ data });
    } catch (error) {
      throw boom.internal('Error creating user', error);
    }
  }

  static async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    try {
      return await prisma.user.update({ where: { id }, data });
    } catch (error) {
      throw boom.internal('Error updating user', error);
    }
  }

  static async delete(id: number): Promise<User> {
    try {
      return await prisma.user.delete({ where: { id } });
    } catch (error) {
      throw boom.internal('Error deleting user', error);
    }
  }
}
