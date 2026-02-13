import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface TokenPayload {
  id: number;
  email: string;
  name?: string | null;
}

export class AuthService {
  static async tokenGeneration(user: {
    id: number;
    email: string;
    name?: string | null;
  }): Promise<string> {
    return jwt.sign({ id: user.id, email: user.email, name: user.name }, env.jwtSecret, {
      algorithm: 'HS256',
      expiresIn: '1h',
    });
  }

  static async decodeToken(token: string): Promise<TokenPayload> {
    return jwt.verify(token, env.jwtSecret) as TokenPayload;
  }
}
