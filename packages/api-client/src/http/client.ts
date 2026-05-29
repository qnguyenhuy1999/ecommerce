export type ApiParams = Record<string, string | number | boolean>
export type ApiParamsInput = Record<string, string | number | boolean | null | undefined>
export type WebAppKind = 'admin' | 'seller' | 'storefront'

export const API_PORTS = {
  admin: 4002,
  seller: 4003,
  storefront: 4000,
} as const

export interface ApiOptions extends RequestInit {
  baseUrl?: string
  params?: ApiParamsInput
}

const inflightGetRequests = new Map<string, Promise<unknown>>()

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: Record<string, unknown>,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function isApiErrorBody(value: unknown): value is Record<string, unknown> & { message?: string } {
  return !!value && typeof value === 'object'
}

function getRequestMethod(options: RequestInit): string {
  return (options.method ?? 'GET').toUpperCase()
}

function getInflightRequestKey(method: string, url: string): string {
  return `${method} ${url}`
}

export function createApiClient(defaultOptions: { baseUrl: string }) {
  return async <T = unknown>(path: string, options: ApiOptions = {}): Promise<T> => {
    const { params, baseUrl, ...fetchOptions } = options
    const base = baseUrl ?? defaultOptions.baseUrl

    let url = `${base}${path}`

    if (params) {
      const searchParams = new URLSearchParams()
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value))
        }
      }
      const qs = searchParams.toString()
      if (qs) url += `?${qs}`
    }
    const method = getRequestMethod(fetchOptions)

    const performRequest = async (): Promise<T> => {
      const res = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
        ...fetchOptions,
      })

      if (!res.ok) {
        const body: unknown = await res.json().catch(() => ({}))
        const message =
          isApiErrorBody(body) && typeof body.message === 'string' ? body.message : 'Request failed'
        throw new ApiError(res.status, message, isApiErrorBody(body) ? body : undefined)
      }

      if (res.status === 204) return undefined as unknown as T

      return (await res.json()) as T
    }

    if (method !== 'GET' || fetchOptions.signal) {
      return performRequest()
    }

    const requestKey = getInflightRequestKey(method, url)
    const existingRequest = inflightGetRequests.get(requestKey)

    if (existingRequest) {
      return existingRequest as Promise<T>
    }

    const request = performRequest().finally(() => {
      inflightGetRequests.delete(requestKey)
    })

    inflightGetRequests.set(requestKey, request)

    return request
  }
}

export function getWebApiBaseUrl(app: WebAppKind): string {
  switch (app) {
    case 'admin':
      return process.env.NEXT_PUBLIC_ADMIN_API_URL ?? `http://localhost:${API_PORTS.admin}`
    case 'seller':
      return process.env.NEXT_PUBLIC_SELLER_API_URL ?? `http://localhost:${API_PORTS.seller}`
    case 'storefront':
      return process.env.NEXT_PUBLIC_API_URL ?? `http://localhost:${API_PORTS.storefront}`
  }
}

export function createWebApiClient(app: WebAppKind) {
  return createApiClient({ baseUrl: getWebApiBaseUrl(app) })
}
