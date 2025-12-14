import type { LoginFormData, RegisterFormData } from '@/schemas/auth.schema';
import { api } from './client';

interface AuthResponse {
  message: string;
  accessToken: string;
  user?: {
    id: number;
    email: string;
    name?: string;
  };
}

interface RegisterResponse {
  message: string;
  apiKey: string;
}

export const AuthService = {
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterFormData): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
  },

  getApiKey: async (): Promise<{ apiKey: string }> => {
    const response = await api.get<{ apiKey: string }>('/auth/api-key');
    return response.data;
  },

  regenerateApiKey: async (): Promise<{ apiKey: string; message: string }> => {
    const response = await api.post<{ apiKey: string; message: string }>(
      '/auth/api-key/regenerate',
    );
    return response.data;
  },

  getCurrentUser: async () => { },
  getMe: async (): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>('/auth/me');
    return response.data;
  },
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response = await api.get<{ message: string }>(`/auth/verify/${token}`);
    return response.data;
  },
};
