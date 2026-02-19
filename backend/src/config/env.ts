import path from 'node:path';
import dotenv from 'dotenv';
import { envSchema } from '../schemas/env.schema.js';

const resolveEnvFile = () => {
  if (process.env.ENV_FILE) {
    return process.env.ENV_FILE;
  }

  switch (process.env.NODE_ENV) {
    case 'production':
      return '.env.production';
    case 'test':
      return '.env.test';
    default:
      return '.env.development';
  }
};

const envFile = resolveEnvFile();
const envPath = path.resolve(process.cwd(), envFile);
const envLoad = dotenv.config({ path: envPath });
const parsed = envSchema.safeParse(process.env);

const missingEnvFile = envLoad.error && (envLoad.error as NodeJS.ErrnoException).code === 'ENOENT';

if (envLoad.error && (!missingEnvFile || !parsed.success)) {
  process.stderr.write(`[env] Failed to load ${envPath}: ${envLoad.error.message}\n`);
}

if (!parsed.success) {
  process.exit(1);
}

const normalizeOrigin = (origin: string) => origin.trim().replace(/\/$/, '').toLowerCase();

export const env = {
  ...parsed.data,
  jwtSecret: parsed.data.JWT_SECRET || parsed.data.JWT_SECRET_KEY || '',
  corsOrigins: parsed.data.CORS_ORIGINS
    ? parsed.data.CORS_ORIGINS.split(',')
        .map((origin) => normalizeOrigin(origin))
        .filter(Boolean)
    : [normalizeOrigin(parsed.data.FRONTEND_URL)],
};
