import { UserRole } from './enums';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  organizationId?: string;
}

export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest {
  email: string;
  fullName: string;
  password: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
  organizationType?: string;
  contactPhone?: string;
}
export interface LoginResponse {
  accessToken: string;
  expiresAt: string;
  user: User;
}
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}