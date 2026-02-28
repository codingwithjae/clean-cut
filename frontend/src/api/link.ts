import { type ApiError, api } from './client';

export interface Link {
  id: number;
  originalUrl: string;
  shortId: string;
  clicks: number;
  createdAt: string;
}

export interface CreateLinkData {
  originalUrl: string;
  shortId?: string;
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const RETRYABLE_STATUS_CODES = new Set([500, 502, 503, 504]);
const RETRY_DELAYS_MS = [800, 1600] as const;

const getRetryDelayMs = (attempt: number): number => {
  const index = Math.min(attempt, RETRY_DELAYS_MS.length - 1);
  return RETRY_DELAYS_MS[index] ?? 1600;
};

const isApiError = (error: unknown): error is ApiError =>
  error instanceof Error && (error as Partial<ApiError>).isApiError === true;

const shouldRetryCreatePublic = (error: unknown) => {
  if (!isApiError(error)) {
    return false;
  }

  if (error.statusCode === undefined) {
    return true;
  }

  return RETRYABLE_STATUS_CODES.has(error.statusCode);
};

export const LinkService = {
  getAll: async (): Promise<Link[]> => {
    const response = await api.get<Link[]>('/urls/my-links');
    return response.data;
  },

  create: async (data: CreateLinkData): Promise<Link> => {
    const response = await api.post<Link>('/urls', data);
    return response.data;
  },

  createPublic: async (originalUrl: string): Promise<{ shortId: string; shortUrl: string }> => {
    const maxRetries = RETRY_DELAYS_MS.length;

    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      try {
        const response = await api.post<{ shortId: string; shortUrl: string }>('/urls/public', {
          originalUrl,
        });

        return response.data;
      } catch (error) {
        if (!shouldRetryCreatePublic(error) || attempt >= maxRetries) {
          throw error;
        }

        await sleep(getRetryDelayMs(attempt));
      }
    }

    throw new Error('Failed to shorten URL after retry');
  },

  delete: async (shortId: string): Promise<void> => {
    await api.delete(`/urls/${shortId}`);
  },

  update: async (
    shortId: string,
    data: { newShortId?: string; originalUrl?: string },
  ): Promise<Link> => {
    const response = await api.patch<Link>(`/urls/${shortId}`, data);
    return response.data;
  },
};
