import type { AuthUser } from '../helpers'

export type { AuthUser }

export interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<boolean>
}

export interface CreateAuthClientOptions {
  apiUrl?: string
  requiredRole?: string
  requireSeller?: boolean
  forbiddenRedirectTo?: string
  publicPaths?: string[]
  meEndpoint?: string
  loginEndpoint?: string
  logoutEndpoint?: string
  logoutRedirectTo?: string
  loginRedirectTo?: string
  unauthenticatedRedirectTo?: string
  sessionRefreshIntervalMs?: number
  shouldRefresh?: boolean
  parseUser?: (payload: unknown) => AuthUser | null
  hasRequiredAccess?: (user: AuthUser) => boolean
  onAuthError?: (error: unknown) => void
  onForbidden?: (user: AuthUser) => void
  onUnauthenticated?: () => void
}
