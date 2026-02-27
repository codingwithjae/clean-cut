import axios from 'axios';

type ApiErrorPayload = {
  statusCode?: number;
  error?: string;
  message?: string;
  details?: unknown;
};

const STATUS_DEFAULT_MESSAGES: Record<number, string> = {
  400: 'Invalid request.',
  401: 'Unauthorized. Please sign in again.',
  403: 'You do not have permission to perform this action.',
  404: 'Resource not found.',
  409: 'Conflict detected. Please refresh and try again.',
  422: 'Validation failed.',
  429: 'Too many requests. Please try again later.',
  500: 'Server error. Please try again in a moment.',
};

const COLD_START_MESSAGE = 'Waking up Korta... first request can take a few seconds.';

const isColdStartError = (error: unknown, statusCode?: number) => {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  if (statusCode === 502 || statusCode === 503 || statusCode === 504) {
    return true;
  }

  const data = (error.response?.data ?? {}) as ApiErrorPayload;
  const messageText = [data.error, data.message, error.message]
    .filter((value): value is string => typeof value === 'string' && value.length > 0)
    .join(' ')
    .toLowerCase();

  return (
    messageText.includes('gateway timeout') ||
    messageText.includes('bad gateway') ||
    messageText.includes('service unavailable') ||
    messageText.includes('upstream')
  );
};

export interface ApiError extends Error {
  isApiError: true;
  statusCode?: number;
  details?: unknown;
  raw?: unknown;
}

const toApiError = (error: unknown): ApiError => {
  if ((error as ApiError)?.isApiError) {
    return error as ApiError;
  }

  if (axios.isAxiosError(error)) {
    const data = (error.response?.data ?? {}) as ApiErrorPayload;
    const statusCode = data.statusCode ?? error.response?.status;
    const coldStartMessage = isColdStartError(error, statusCode) ? COLD_START_MESSAGE : undefined;
    const message =
      coldStartMessage ??
      data.message ??
      (statusCode ? STATUS_DEFAULT_MESSAGES[statusCode] : undefined) ??
      error.message ??
      'Something went wrong.';

    return {
      name: 'ApiError',
      message,
      isApiError: true,
      statusCode,
      details: data.details,
      raw: error,
    };
  }

  if (error instanceof Error) {
    return {
      name: 'ApiError',
      message: error.message,
      isApiError: true,
      raw: error,
    };
  }

  return {
    name: 'ApiError',
    message: 'Something went wrong.',
    isApiError: true,
    raw: error,
  };
};

export const getApiErrorMessage = (error: unknown, fallback = 'Something went wrong.') => {
  const apiError = toApiError(error);
  return apiError.message || fallback;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = toApiError(error);

    if (apiError.statusCode === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }

    return Promise.reject(apiError);
  },
);
