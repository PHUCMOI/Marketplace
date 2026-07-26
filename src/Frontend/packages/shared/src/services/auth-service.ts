import { apiClient } from './api-client';
import { unwrap } from './service-helpers';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../types/auth.types';
import { storage, STORAGE_KEYS } from '../utils/storage';

export const authService = {
  login: async (request: LoginRequest): Promise<LoginResponse> => {
    const result = unwrap(await apiClient.post<LoginResponse>('/api/auth/login', request));
    storage.set(STORAGE_KEYS.ACCESS_TOKEN, result.accessToken);
    storage.set(STORAGE_KEYS.USER, result.user);
    return result;
  },
  register: async (request: RegisterRequest): Promise<LoginResponse> => {
    const result = unwrap(await apiClient.post<LoginResponse>('/api/auth/register', request));
    storage.set(STORAGE_KEYS.ACCESS_TOKEN, result.accessToken);
    storage.set(STORAGE_KEYS.USER, result.user);
    return result;
  },
  logout: (): void => {
    storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
    storage.remove(STORAGE_KEYS.USER);
  },
  getStoredUser: (): User | null => storage.get<User>(STORAGE_KEYS.USER),
  getStoredToken: (): string | null => storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN),
  isAuthenticated: (): boolean => !!storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN)
};