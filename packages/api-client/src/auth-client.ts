// TODO: implement
import type { LoginRequest, RegisterRequest, AuthResponse } from '@ecom/api-types'
import { getApiClient } from './client'

export const authClient = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const { data: response } = await getApiClient().post<{ success: true; data: AuthResponse }>(
      '/auth/register',
      data,
    )
    return response.data
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const { data: response } = await getApiClient().post<{ success: true; data: AuthResponse }>(
      '/auth/login',
      data,
    )
    return response.data
  },

  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const { data: response } = await getApiClient().post<{ success: true; data: AuthResponse }>(
      '/auth/refresh',
      { refreshToken },
    )
    return response.data
  },

  logout: async (): Promise<void> => {
    await getApiClient().post('/auth/logout')
  },
}
