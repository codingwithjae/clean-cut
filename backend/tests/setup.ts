import path from 'node:path';
import dotenv from 'dotenv';

const envFile = process.env.ENV_FILE ?? '.env.development';
const envPath = path.resolve(process.cwd(), envFile);

dotenv.config({ path: envPath });

process.env.NODE_ENV = 'test';
process.env.PORT ??= '5001';
process.env.JWT_SECRET ??= 'test-secret-key';
process.env.FRONTEND_URL ??= 'http://localhost:5173';
process.env.GOOGLE_CLIENT_ID ??= 'test-google-client-id';
process.env.GOOGLE_CLIENT_SECRET ??= 'test-google-client-secret';
process.env.GOOGLE_CALLBACK_URL ??= 'http://localhost:5000/api/v1/auth/google/callback';
process.env.DATABASE_URL ??=
  process.env.TEST_DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/cleancut_test';
