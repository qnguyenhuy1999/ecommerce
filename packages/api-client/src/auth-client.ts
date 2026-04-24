import { getApiClient } from './client'

export interface AuthUser {
  id: string
  email: string
  role: string
  status: string
}

export interface AuthResponse {
  user: AuthUser
}

export interface RegisterRequest {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export const authClient = {
  register: (data: RegisterRequest) =>
    getApiClient().post<AuthResponse>('/auth/register', data),

  login: (data: LoginRequest) =>
    getApiClient().post<AuthResponse>('/auth/login', data),

  refresh: () =>
    getApiClient().post<AuthResponse>('/auth/refresh'),

  logout: () =>
    getApiClient().post<{ message: string }>('/auth/logout'),

  me: () =>
    getApiClient().get<AuthResponse>('/auth/me'),
}
