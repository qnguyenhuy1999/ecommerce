import axios, { AxiosInstance, AxiosError } from 'axios'

import type { ApiError } from '@ecom/api-types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

let _client: AxiosInstance | null = null

export function getApiClient(): AxiosInstance {
  if (!_client) {
    _client = axios.create({
      baseURL: `${API_URL}/api/v1`,
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' },
    })

    // Request interceptor: attach JWT
    _client.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
      return config
    })

    // Response interceptor: handle 401
    _client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          // TODO: implement token refresh
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken')
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      },
    )
  }
  return _client
}

// TODO: implement token management
export function setAccessToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token)
  }
}

export function clearTokens(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}
