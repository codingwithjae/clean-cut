import { z } from 'zod';

export const shortenSchema = z.object({
  body: z.object({
    originalUrl: z.string().url(),
    shortId: z.string().max(5, 'Short ID must not exceed 5 characters').optional(),
  }),
});

export const updateShortIdSchema = z.object({
  params: z.object({
    shortId: z.string(),
  }),
  body: z.object({
    newShortId: z.string().min(1).max(5, 'The new shortId must not exceed 5 characters'),
  }),
});
