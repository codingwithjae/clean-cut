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
    const response = await api.post<{ shortId: string; shortUrl: string }>('/urls/public', {
      originalUrl,
    });
    return response.data;
  },

  delete: async (shortId: string): Promise<void> => {
    await api.delete(`/urls/${shortId}`);
  },

  update: async (shortId: string, data: { newShortId?: string; originalUrl?: string }): Promise<Link> => {
    const response = await api.patch<Link>(`/urls/${shortId}`, data);
    return response.data;
  },
};
