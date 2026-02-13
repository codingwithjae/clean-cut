import dotenv from 'dotenv';
import { envSchema } from '../schemas/env.schema.js';

dotenv.config();

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  process.exit(1);
}

export const env = {
  ...parsed.data,
  jwtSecret: parsed.data.JWT_SECRET || parsed.data.JWT_SECRET_KEY || '',
  corsOrigins: parsed.data.CORS_ORIGINS
    ? parsed.data.CORS_ORIGINS.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [parsed.data.FRONTEND_URL],
};
