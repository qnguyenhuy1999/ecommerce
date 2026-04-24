import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

let _client: ReturnType<typeof axios.create> | null = null

function createClient() {
  const client = axios.create({
    baseURL: `${API_URL}/api/v1`,
    timeout: 15_000,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
  })

  client.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
      if (
        error.response?.status === 401 &&
        !original._retry &&
        !original.url?.includes('/auth/refresh')
      ) {
        original._retry = true
        try {
          await client.post('/auth/refresh')
          return await client(original)
        } catch {
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
      }
      return Promise.reject(error)
    },
  )

  return client
}

export function getApiClient() {
  if (!_client) _client = createClient()
  return _client
}
