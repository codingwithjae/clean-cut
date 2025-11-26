import { z } from 'zod';

export const envSchema = z
    .object({
        PORT: z.string().default('5000').transform(Number),
        DATABASE_URL: z.string().url(),
        GOOGLE_CLIENT_ID: z.string(),
        GOOGLE_CLIENT_SECRET: z.string(),
        GOOGLE_CALLBACK_URL: z.string().url(),
        JWT_SECRET: z.string().min(8).optional(),
        JWT_SECRET_KEY: z.string().min(8).optional(),
        NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
        FRONTEND_URL: z.string().url().default('http://localhost:5173'),
        SMTP_HOST: z.string().optional(),
        SMTP_PORT: z.string().default('587').transform(Number),
        SMTP_USER: z.string().optional(),
        SMTP_PASS: z.string().optional(),
        EMAIL_FROM: z.string().email().default('noreply@cleancut.link'),
    })
    .refine((data) => data.JWT_SECRET || data.JWT_SECRET_KEY, {
        message: 'Either JWT_SECRET or JWT_SECRET_KEY must be provided',
        path: ['JWT_SECRET'],
    });
