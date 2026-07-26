import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError, ApiResponse } from '../types/api.types';
import { storage, STORAGE_KEYS } from '../utils/storage';

const API_BASE_URL = process.env.REACT_APP_BFF_API_URL || 'http://localhost:5001';

class ApiClient {
  private readonly instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({ baseURL: API_BASE_URL, timeout: 30000 });
    this.instance.interceptors.request.use(config => {
      const token = storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    this.instance.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
          storage.remove(STORAGE_KEYS.USER);
        }
        return Promise.reject(this.toApiError(error));
      }
    );
  }

  private toApiError(error: AxiosError): ApiError {
    const data = error.response?.data as { message?: string; title?: string; errors?: Record<string, string[]>; traceId?: string } | undefined;
    return {
      message: data?.message || data?.title || error.message || 'Request failed',
      statusCode: error.response?.status ?? 0,
      errors: data?.errors,
      traceId: data?.traceId
    };
  }

  get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.get(url, config);
  }
  post<T>(url: string, data?: unknown): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.post(url, data);
  }
  put<T>(url: string, data?: unknown): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.put(url, data);
  }
  patch<T>(url: string, data?: unknown): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.patch(url, data);
  }
  delete<T>(url: string): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.delete(url);
  }
}

export const apiClient = new ApiClient();