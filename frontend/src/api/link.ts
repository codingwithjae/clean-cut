import axios from 'axios';
import { api } from './client';

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

const isRetryableColdStartError = (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const status = error.response?.status;
  if (status === 500 || status === 502 || status === 503 || status === 504) {
    return true;
  }

  const payload = error.response?.data as
    | {
        error?: string;
        message?: string;
      }
    | undefined;

  const message = [payload?.error, payload?.message, error.message]
    .filter((value): value is string => typeof value === 'string' && value.length > 0)
    .join(' ')
    .toLowerCase();

  return (
    message.includes('timed out') ||
    message.includes('timeout') ||
    message.includes('service unavailable') ||
    message.includes('gateway') ||
    message.includes('upstream')
  );
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
    const maxRetries = 1;

    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      try {
        const response = await api.post<{ shortId: string; shortUrl: string }>('/urls/public', {
          originalUrl,
        });

        return response.data;
      } catch (error) {
        const shouldRetry = isRetryableColdStartError(error) && attempt < maxRetries;
        if (!shouldRetry) {
          throw error;
        }

        await sleep(1200);
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
