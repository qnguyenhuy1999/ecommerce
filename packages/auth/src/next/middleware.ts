import { NextResponse } from 'next/server'
import { SESSION_COOKIE_NAME } from '../cookie.config'

export interface WithAuthOptions {
  apiUrl?: string
  publicPaths?: string[]
  loginPath?: string
  requiredRole?: string
  requiredRoles?: string[]
  requireSeller?: boolean
  meEndpoint?: string
  forbiddenRedirectTo?: string
  fetchTimeoutMs?: number
  preserveRedirect?: boolean
}

export interface WithAuthRequest {
  nextUrl: { pathname: string }
  cookies: { get: (name: string) => { value?: string } | undefined }
  url: string
}

export function createWithAuth(options: WithAuthOptions = {}) {
  const {
    apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
    publicPaths = ['/login'],
    loginPath = '/login',
    requiredRole,
    requiredRoles,
    requireSeller = false,
    meEndpoint,
    forbiddenRedirectTo = '/',
    fetchTimeoutMs = 5000,
    preserveRedirect = true,
  } = options

  const normalizedRequiredRoles = [
    ...(requiredRole ? [requiredRole] : []),
    ...(requiredRoles ?? []),
  ]

  return async function withAuth(request: WithAuthRequest) {
    const { pathname } = request.nextUrl

    if (publicPaths.some((path) => isPathMatch(pathname, path))) {
      return NextResponse.next()
    }

    const sid = request.cookies.get(SESSION_COOKIE_NAME)?.value

    if (!sid) {
      return redirectToLogin(request, loginPath, preserveRedirect)
    }

    if (!meEndpoint) {
      return NextResponse.next()
    }

    try {
      const res = await fetchWithTimeout(`${apiUrl}${meEndpoint}`, {
        headers: {
          Cookie: `${SESSION_COOKIE_NAME}=${encodeURIComponent(sid)}`,
        },
        cache: 'no-store',
        timeoutMs: fetchTimeoutMs,
      })

      if (!res.ok) {
        const response = redirectToLogin(request, loginPath, preserveRedirect)

        if (isUnauthenticatedStatus(res.status)) {
          response.cookies.delete(SESSION_COOKIE_NAME)
        }

        return response
      }

      if (normalizedRequiredRoles.length > 0 || requireSeller) {
        const payload: unknown = await res.json()
        const authData = unwrapAuthPayload(payload)

        if (normalizedRequiredRoles.length > 0) {
          const roles = parseRoles(authData)
          const hasRequiredRole = normalizedRequiredRoles.some((role) => roles.includes(role))

          if (!hasRequiredRole) {
            return NextResponse.redirect(new URL(forbiddenRedirectTo, request.url))
          }
        }

        if (requireSeller && !hasSellerProfile(authData)) {
          return NextResponse.redirect(new URL(forbiddenRedirectTo, request.url))
        }
      }

      return NextResponse.next()
    } catch {
      return redirectToLogin(request, loginPath, preserveRedirect)
    }
  }
}

function isPathMatch(pathname: string, targetPath: string): boolean {
  return pathname === targetPath || pathname.startsWith(`${targetPath}/`)
}

function redirectToLogin(request: WithAuthRequest, loginPath: string, preserveRedirect: boolean) {
  const loginUrl = new URL(loginPath, request.url)

  if (preserveRedirect) {
    loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
  }

  return NextResponse.redirect(loginUrl)
}

function isUnauthenticatedStatus(status: number): boolean {
  return status === 401 || status === 403
}

async function fetchWithTimeout(
  input: string,
  options: RequestInit & { timeoutMs: number },
): Promise<Response> {
  const { timeoutMs, ...fetchOptions } = options

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(input, {
      ...fetchOptions,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }
}

function unwrapAuthPayload(value: unknown): Record<string, unknown> {
  if (!isRecord(value)) return {}

  const nestedData = value.data

  if (isRecord(nestedData)) {
    return nestedData
  }

  return value
}

function parseRoles(value: unknown): string[] {
  if (!isRecord(value)) return []

  const roles = value.roles

  if (!Array.isArray(roles)) return []

  return roles.filter((role): role is string => typeof role === 'string')
}

function hasSellerProfile(value: unknown): boolean {
  if (!isRecord(value)) return false

  const sellerProfile = value.sellerProfile

  return isRecord(sellerProfile)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}
