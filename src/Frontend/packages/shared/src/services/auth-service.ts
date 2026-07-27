import { apiClient } from './api-client';
import { unwrap } from './service-helpers';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../types/auth.types';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { clearAuthSession, notifyAuthSessionChanged, subscribeToAuthSession } from './auth-session';

type JwtPayload = Record<string, unknown>;

const getTokenPayload = (token: string): JwtPayload | null => {
  try {
    const encoded = token.split('.')[1];
    if (!encoded) return null;
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64)) as JwtPayload;
  } catch {
    return null;
  }
};

const getOrganizationIdFromToken = (token: string | null): string | undefined => {
  if (!token) return undefined;
  const payload = getTokenPayload(token);
  const value = payload?.OrganizationId ?? payload?.organizationId;
  return typeof value === 'string' && value.length > 0 ? value : undefined;
};

const normalizeUser = (user: User, token: string): User => {
  const organizationId = user.organizationId ?? getOrganizationIdFromToken(token);
  return organizationId ? { ...user, organizationId } : user;
};

const saveSession = (result: LoginResponse): LoginResponse => {
  const normalized = { ...result, user: normalizeUser(result.user, result.accessToken) };
  storage.set(STORAGE_KEYS.ACCESS_TOKEN, normalized.accessToken);
  storage.set(STORAGE_KEYS.USER, normalized.user);
  notifyAuthSessionChanged();
  return normalized;
};

export const authService = {
  login: async (request: LoginRequest): Promise<LoginResponse> => {
    const result = unwrap(await apiClient.post<LoginResponse>('/api/auth/login', request));
    return saveSession(result);
  },
  register: async (request: RegisterRequest): Promise<LoginResponse> => {
    const result = unwrap(await apiClient.post<LoginResponse>('/api/auth/register', request));
    return saveSession(result);
  },
  logout: clearAuthSession,
  getStoredUser: (): User | null => {
    const user = storage.get<User>(STORAGE_KEYS.USER);
    const token = storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
    return user && token ? normalizeUser(user, token) : null;
  },
  getStoredToken: (): string | null => storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN),
  isAuthenticated: (): boolean =>
    !!storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN) && !!storage.get<User>(STORAGE_KEYS.USER),
  subscribe: subscribeToAuthSession
};