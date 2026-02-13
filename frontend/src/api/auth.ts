import type { LoginFormData, RegisterFormData } from '@/schemas/auth.schema';
import { api } from './client';

interface AuthResponse {
  message: string;
  accessToken: string;
  user: {
    id: number;
    email: string;
    name?: string | null;
    isVerified: boolean;
  };
}

interface RegisterResponse {
  message: string;
}

interface MeResponse {
  user: {
    id: number;
    email: string;
    name?: string | null;
    isVerified: boolean;
  };
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

  getApiKey: async (): Promise<{ apiKey: string | null }> => {
    const response = await api.get<{ apiKey: string | null }>('/auth/api-key');
    return response.data;
  },

  regenerateApiKey: async (): Promise<{ apiKey: string; message: string }> => {
    const response = await api.post<{ apiKey: string; message: string }>(
      '/auth/api-key/regenerate',
    );
    return response.data;
  },

  getCurrentUser: async () => {},
  getMe: async (): Promise<MeResponse> => {
    const response = await api.get<MeResponse>('/auth/me');
    return response.data;
  },
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response = await api.get<{ message: string }>(`/auth/verify/${token}`);
    return response.data;
  },
};
