import { z } from 'zod';

export const createLinkSchema = z.object({
  originalUrl: z.string().url('Please enter a valid URL'),
  shortId: z
    .string()
    .min(3, 'Short ID must be at least 3 characters')
    .max(5, 'Short ID cannot exceed 5 characters')
    .optional()
    .or(z.literal('')),
});

export type CreateLinkFormData = z.infer<typeof createLinkSchema>;

export const updateLinkSchema = z.object({
  originalUrl: z.string().url('Please enter a valid URL').optional(),
  shortId: z
    .string()
    .min(3, 'Short ID must be at least 3 characters')
    .max(5, 'Short ID cannot exceed 5 characters')
    .optional(),
});

export type UpdateLinkFormData = z.infer<typeof updateLinkSchema>;
