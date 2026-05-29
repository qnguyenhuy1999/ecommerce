import type { CreateAuthClientOptions, AuthUser } from './next/types'
import type { WithAuthOptions } from './next/middleware'
import type { ProtectedRouteOptions } from './next/protected-route'

export type WebAppKind = 'admin' | 'seller' | 'storefront'

export interface WebAuthPreset {
  client: CreateAuthClientOptions
  middleware: WithAuthOptions
  protectedRoute?: ProtectedRouteOptions
}

export function getWebAuthPreset(app: WebAppKind): WebAuthPreset {
  switch (app) {
    case 'admin':
      return {
        client: {
          apiUrl: process.env.NEXT_PUBLIC_ADMIN_API_URL ?? '/api',
          meEndpoint: '/admin/auth/me',
          loginEndpoint: '/admin/auth/login',
          logoutEndpoint: '/admin/auth/logout',
        },
        middleware: {
          apiUrl: process.env.ADMIN_BE_INTERNAL_URL ?? 'http://localhost:4002',
          publicPaths: ['/login', '/api'],
          loginPath: '/login',
          meEndpoint: '/admin/auth/me',
        },
      }
    case 'seller':
      return {
        client: {
          apiUrl: process.env.NEXT_PUBLIC_SELLER_API_URL ?? '/api',
          meEndpoint: '/auth/me',
          loginEndpoint: '/auth/login',
          logoutEndpoint: '/auth/logout',
          requireSeller: true,
          forbiddenRedirectTo: '/',
          loginRedirectTo: '/',
          logoutRedirectTo: '/login',
          unauthenticatedRedirectTo: '/login',
        },
        middleware: {
          apiUrl: process.env.SELLER_BE_INTERNAL_URL ?? 'http://localhost:4003',
          publicPaths: ['/login', '/register', '/forgot-password', '/reset-password', '/api'],
          loginPath: '/login',
          meEndpoint: '/auth/me',
          requireSeller: true,
          forbiddenRedirectTo: '/login',
        },
        protectedRoute: {
          requireSeller: true,
          redirectTo: '/login',
          forbiddenRedirectTo: '/',
        },
      }
    case 'storefront':
      return {
        client: {
          apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
        },
        middleware: {
          apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
          publicPaths: ['/', '/products', '/search', '/login', '/register'],
          loginPath: '/login',
        },
        protectedRoute: {
          redirectTo: '/login',
          forbiddenRedirectTo: '/',
          onForbiddenRedirect: getStorefrontForbiddenRedirect,
        },
      }
  }
}

function getStorefrontForbiddenRedirect(user: AuthUser): string {
  if (user.sellerProfile && typeof user.sellerProfile === 'object') return '/seller/dashboard'
  return '/'
}
