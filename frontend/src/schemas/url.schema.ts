import { z } from 'zod';
import { normalizeHttpUrl } from '@/shared/utils/url';

const normalizedUrlField = z
  .string()
  .min(1, 'Please enter a valid URL')
  .refine((value) => normalizeHttpUrl(value) !== null, {
    message: 'Please enter a valid URL',
  });

export const createLinkSchema = z.object({
  originalUrl: normalizedUrlField,
  shortId: z
    .string()
    .transform((value) => value.trim())
    .pipe(
      z.union([
        z.literal(''),
        z
          .string()
          .min(3, 'Short ID must be at least 3 characters')
          .max(5, 'Short ID cannot exceed 5 characters'),
      ]),
    )
    .optional(),
});

export type CreateLinkFormData = z.infer<typeof createLinkSchema>;

export const updateLinkSchema = z.object({
  originalUrl: normalizedUrlField.optional(),
  shortId: z
    .string()
    .transform((value) => value.trim())
    .pipe(
      z.union([
        z.literal(''),
        z
          .string()
          .min(3, 'Short ID must be at least 3 characters')
          .max(5, 'Short ID cannot exceed 5 characters'),
      ]),
    )
    .optional(),
});

export type UpdateLinkFormData = z.infer<typeof updateLinkSchema>;
