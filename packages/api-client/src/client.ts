import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

let _client: ReturnType<typeof axios.create> | null = null

const AUTH_ENDPOINTS_TO_SKIP = ['/auth/refresh', '/auth/login', '/auth/register']

function createClient() {
  const client = axios.create({
    baseURL: `${API_URL}/api/v1`,
    timeout: 15_000,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
  })

  // Serialize concurrent refresh calls so that a burst of 401s (e.g. parallel
  // requests firing immediately after the access token expires) only triggers
  // one refresh round-trip. Without this, the second refresh would send the
  // already-rotated cookie, the server would treat it as token reuse and
  // revoke the whole family — logging the user out.
  let refreshInFlight: Promise<void> | null = null
  const refreshTokens = (): Promise<void> => {
    refreshInFlight ??= client.post('/auth/refresh').then(
      () => {
        refreshInFlight = null
      },
      (err: unknown) => {
        refreshInFlight = null
        throw err instanceof Error ? err : new Error(String(err))
      },
    )
    return refreshInFlight
  }

  client.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
      const url = original.url ?? ''
      const isAuthEndpoint = AUTH_ENDPOINTS_TO_SKIP.some((path) => url.includes(path))
      if (error.response?.status === 401 && !original._retry && !isAuthEndpoint) {
        original._retry = true
        try {
          await refreshTokens()
        } catch {
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
          return Promise.reject(error)
        }
        // Refresh succeeded — retry the original request. If the retry itself
        // fails we propagate that error to the caller instead of redirecting,
        // since the user IS now authenticated.
        return client(original)
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
