'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'

export interface AuthUser {
  userId: string
  roles?: string[]
  sellerProfile?: unknown
  isStaff?: boolean
  [key: string]: unknown
}

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

type ResolvedAuthOptions = {
  apiUrl: string
  requireSeller: boolean
  forbiddenRedirectTo: string
  publicPaths: string[]
  meEndpoint: string
  loginEndpoint: string
  logoutEndpoint: string
  logoutRedirectTo: string | undefined
  sessionRefreshIntervalMs: number
  shouldRefresh: boolean
  parseUser: (payload: unknown) => AuthUser | null

  requiredRole: string | undefined
  loginRedirectTo: string | undefined
  unauthenticatedRedirectTo: string | undefined
  hasRequiredAccess: ((user: AuthUser) => boolean) | undefined
  onAuthError: ((error: unknown) => void) | undefined
  onForbidden: ((user: AuthUser) => void) | undefined
  onUnauthenticated: (() => void) | undefined
}

interface AuthProviderProps {
  children: ReactNode
  AuthContext: React.Context<AuthContextValue | null>
  options: ResolvedAuthOptions
}

interface AuthRefs {
  userRef: React.RefObject<AuthUser | null>
  pathnameRef: React.RefObject<string>
  hadAuthenticatedSessionRef: React.RefObject<boolean>
  refreshInFlightRef: React.RefObject<Promise<boolean> | null>
}

export function createAuthClient(options: CreateAuthClientOptions = {}) {
  const AuthContext = createContext<AuthContextValue | null>(null)
  const resolvedOptions = resolveAuthOptions(options)

  function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
    return (
      <InternalAuthProvider AuthContext={AuthContext} options={resolvedOptions}>
        {children}
      </InternalAuthProvider>
    )
  }

  function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext)

    if (!ctx) {
      throw new Error('useAuth must be used within AuthProvider')
    }

    return ctx
  }

  return { AuthProvider, useAuth }
}

function InternalAuthProvider({ children, AuthContext, options }: Readonly<AuthProviderProps>) {
  const auth = useAuthProviderValue(options)

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

function useAuthProviderValue(options: ResolvedAuthOptions): AuthContextValue {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const pathname = usePathname()
  const refs = useAuthRefs(user, pathname)

  const userHasAccess = useUserHasAccess(options)
  const redirectToForbidden = useForbiddenRedirect(options, refs.pathnameRef)
  const redirectToUnauthenticated = useUnauthenticatedRedirect(options, refs)

  const refresh = useRefreshAuth({
    options,
    refs,
    setLoading,
    setUser,
    userHasAccess,
    redirectToForbidden,
    redirectToUnauthenticated,
  })

  useInitialRefresh({
    shouldRefresh: options.shouldRefresh,
    publicPaths: options.publicPaths,
    pathname,
    refresh,
    setLoading,
  })

  useSessionRefresh({
    shouldRefresh: options.shouldRefresh,
    sessionRefreshIntervalMs: options.sessionRefreshIntervalMs,
    user,
    loading,
    refresh,
  })

  const login = useLogin(options, refresh, refs.pathnameRef)
  const logout = useLogout(options, refs.hadAuthenticatedSessionRef, setUser)

  return useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      refresh,
    }),
    [user, loading, login, logout, refresh],
  )
}

function resolveAuthOptions(options: CreateAuthClientOptions): ResolvedAuthOptions {
  return {
    apiUrl: options.apiUrl ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
    requiredRole: options.requiredRole,
    requireSeller: options.requireSeller ?? false,
    forbiddenRedirectTo: options.forbiddenRedirectTo ?? '/',
    publicPaths: options.publicPaths ?? ['/login'],
    meEndpoint: options.meEndpoint ?? '/auth/me',
    loginEndpoint: options.loginEndpoint ?? '/auth/login',
    logoutEndpoint: options.logoutEndpoint ?? '/auth/logout',
    logoutRedirectTo: options.logoutRedirectTo,
    loginRedirectTo: options.loginRedirectTo,
    unauthenticatedRedirectTo: options.unauthenticatedRedirectTo,
    sessionRefreshIntervalMs: options.sessionRefreshIntervalMs ?? 60_000,
    shouldRefresh: options.shouldRefresh ?? true,
    parseUser: options.parseUser ?? defaultParseUser,
    hasRequiredAccess: options.hasRequiredAccess,
    onAuthError: options.onAuthError,
    onForbidden: options.onForbidden,
    onUnauthenticated: options.onUnauthenticated,
  }
}

function useAuthRefs(user: AuthUser | null, pathname: string): AuthRefs {
  const userRef = useRef<AuthUser | null>(null)
  const pathnameRef = useRef(pathname)
  const hadAuthenticatedSessionRef = useRef(false)
  const refreshInFlightRef = useRef<Promise<boolean> | null>(null)

  useEffect(() => {
    userRef.current = user
  }, [user])

  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  return useMemo(
    () => ({
      userRef,
      pathnameRef,
      hadAuthenticatedSessionRef,
      refreshInFlightRef,
    }),
    [],
  )
}

function useUserHasAccess(options: ResolvedAuthOptions) {
  const { hasRequiredAccess, requiredRole, requireSeller } = options

  return useCallback(
    (authUser: AuthUser): boolean => {
      if (hasRequiredAccess) {
        return hasRequiredAccess(authUser)
      }

      if (requiredRole && !authUser.roles?.includes(requiredRole)) {
        return false
      }

      if (requireSeller && !hasSellerProfile(authUser)) {
        return false
      }

      return true
    },
    [hasRequiredAccess, requiredRole, requireSeller],
  )
}

function useForbiddenRedirect(options: ResolvedAuthOptions, pathnameRef: React.RefObject<string>) {
  const router = useRouter()
  const { forbiddenRedirectTo, onForbidden } = options

  return useCallback(
    (authUser: AuthUser) => {
      onForbidden?.(authUser)

      if (pathnameRef.current !== forbiddenRedirectTo) {
        router.replace(forbiddenRedirectTo)
      }
    },
    [forbiddenRedirectTo, onForbidden, pathnameRef, router],
  )
}

function useUnauthenticatedRedirect(options: ResolvedAuthOptions, refs: AuthRefs) {
  const router = useRouter()
  const { unauthenticatedRedirectTo, onUnauthenticated } = options

  return useCallback(() => {
    onUnauthenticated?.()

    if (
      refs.hadAuthenticatedSessionRef.current &&
      unauthenticatedRedirectTo &&
      refs.pathnameRef.current !== unauthenticatedRedirectTo
    ) {
      router.replace(unauthenticatedRedirectTo)
    }
  }, [onUnauthenticated, unauthenticatedRedirectTo, refs, router])
}

interface UseRefreshAuthParams {
  options: ResolvedAuthOptions
  refs: AuthRefs
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>
  userHasAccess: (authUser: AuthUser) => boolean
  redirectToForbidden: (authUser: AuthUser) => void
  redirectToUnauthenticated: () => void
}

function useRefreshAuth({
  options,
  refs,
  setLoading,
  setUser,
  userHasAccess,
  redirectToForbidden,
  redirectToUnauthenticated,
}: UseRefreshAuthParams) {
  const { apiUrl, meEndpoint, parseUser, onAuthError } = options

  return useCallback(async () => {
    if (refs.refreshInFlightRef.current) {
      return refs.refreshInFlightRef.current
    }

    const refreshTask = (async () => {
      try {
        const res = await fetch(`${apiUrl}${meEndpoint}`, {
          credentials: 'include',
          cache: 'no-store',
        })

        return await handleRefreshResponse({
          res,
          parseUser,
          refs,
          setUser,
          userHasAccess,
          redirectToForbidden,
          redirectToUnauthenticated,
        })
      } catch (error) {
        onAuthError?.(error)
        return refs.userRef.current !== null
      } finally {
        setLoading(false)
        refs.refreshInFlightRef.current = null
      }
    })()

    refs.refreshInFlightRef.current = refreshTask
    return refreshTask
  }, [
    apiUrl,
    meEndpoint,
    parseUser,
    onAuthError,
    refs,
    setLoading,
    setUser,
    userHasAccess,
    redirectToForbidden,
    redirectToUnauthenticated,
  ])
}

interface HandleRefreshResponseParams {
  res: Response
  parseUser: (payload: unknown) => AuthUser | null
  refs: AuthRefs
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>
  userHasAccess: (authUser: AuthUser) => boolean
  redirectToForbidden: (authUser: AuthUser) => void
  redirectToUnauthenticated: () => void
}

async function handleRefreshResponse({
  res,
  parseUser,
  refs,
  setUser,
  userHasAccess,
  redirectToForbidden,
  redirectToUnauthenticated,
}: HandleRefreshResponseParams): Promise<boolean> {
  if (res.ok) {
    return handleAuthenticatedRefresh({
      res,
      parseUser,
      refs,
      setUser,
      userHasAccess,
      redirectToForbidden,
    })
  }

  if (isUnauthenticatedStatus(res.status)) {
    refs.hadAuthenticatedSessionRef.current = false
    setUser(null)
    redirectToUnauthenticated()
    return false
  }

  if (isForbiddenStatus(res.status)) {
    const currentUser = refs.userRef.current

    setUser(null)

    if (currentUser) {
      redirectToForbidden(currentUser)
    }

    return false
  }

  return refs.userRef.current !== null
}

interface HandleAuthenticatedRefreshParams {
  res: Response
  parseUser: (payload: unknown) => AuthUser | null
  refs: AuthRefs
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>
  userHasAccess: (authUser: AuthUser) => boolean
  redirectToForbidden: (authUser: AuthUser) => void
}

async function handleAuthenticatedRefresh({
  res,
  parseUser,
  refs,
  setUser,
  userHasAccess,
  redirectToForbidden,
}: HandleAuthenticatedRefreshParams): Promise<boolean> {
  const payload = await safeReadJson(res)
  const authUser = parseUser(payload)

  if (!authUser) {
    refs.hadAuthenticatedSessionRef.current = false
    setUser(null)
    return false
  }

  if (!userHasAccess(authUser)) {
    setUser(null)
    redirectToForbidden(authUser)
    return false
  }

  refs.hadAuthenticatedSessionRef.current = true

  setUser((currentUser) => {
    if (isSameAuthUser(currentUser, authUser)) {
      return currentUser
    }

    return authUser
  })

  return true
}

interface UseInitialRefreshParams {
  shouldRefresh: boolean
  publicPaths: string[]
  pathname: string
  refresh: () => Promise<boolean>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

function useInitialRefresh({
  shouldRefresh,
  publicPaths,
  pathname,
  refresh,
  setLoading,
}: UseInitialRefreshParams) {
  const isPublicPath = publicPaths.some((path) => isPathMatch(pathname, path))

  useEffect(() => {
    if (!shouldRefresh || isPublicPath) {
      setLoading(false)
      return
    }

    void refresh()
  }, [shouldRefresh, isPublicPath, refresh, setLoading])
}

interface UseSessionRefreshParams {
  shouldRefresh: boolean
  sessionRefreshIntervalMs: number
  user: AuthUser | null
  loading: boolean
  refresh: () => Promise<boolean>
}

function useSessionRefresh({
  shouldRefresh,
  sessionRefreshIntervalMs,
  user,
  loading,
  refresh,
}: UseSessionRefreshParams) {
  useEffect(() => {
    if (!shouldRefresh || loading || !user) return

    const intervalHandle = globalThis.setInterval(() => {
      void refresh()
    }, sessionRefreshIntervalMs)

    return () => {
      globalThis.clearInterval(intervalHandle)
    }
  }, [shouldRefresh, sessionRefreshIntervalMs, loading, refresh, user?.userId])
}

function useLogin(
  options: ResolvedAuthOptions,
  refresh: () => Promise<boolean>,
  pathnameRef: React.RefObject<string>,
) {
  const router = useRouter()

  const { apiUrl, loginEndpoint, loginRedirectTo } = options

  return useCallback(
    async (email: string, password: string) => {
      const res = await fetch(`${apiUrl}${loginEndpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        throw new Error(await getLoginErrorMessage(res))
      }

      const authenticated = await refresh()

      if (authenticated && loginRedirectTo && pathnameRef.current !== loginRedirectTo) {
        router.replace(loginRedirectTo)
      }
    },
    [apiUrl, loginEndpoint, loginRedirectTo, pathnameRef, refresh, router],
  )
}

function useLogout(
  options: ResolvedAuthOptions,
  hadAuthenticatedSessionRef: React.RefObject<boolean>,
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>,
) {
  const router = useRouter()
  const { apiUrl, logoutEndpoint, logoutRedirectTo } = options

  return useCallback(async () => {
    try {
      await fetch(`${apiUrl}${logoutEndpoint}`, {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      hadAuthenticatedSessionRef.current = false
      setUser(null)
      if (logoutRedirectTo) {
        router.replace(logoutRedirectTo)
      }
    }
  }, [apiUrl, logoutEndpoint, logoutRedirectTo, hadAuthenticatedSessionRef, setUser, router])
}

async function getLoginErrorMessage(response: Response): Promise<string> {
  const payload = await safeReadJson(response)

  if (isRecord(payload)) {
    return getString(payload.message) ?? 'Login failed'
  }

  return 'Login failed'
}

function isUnauthenticatedStatus(status: number): boolean {
  return status === 401
}

function isForbiddenStatus(status: number): boolean {
  return status === 403
}

function isPathMatch(pathname: string, targetPath: string): boolean {
  return pathname === targetPath || pathname.startsWith(`${targetPath}/`)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function unwrapAuthPayload(value: unknown): Record<string, unknown> {
  if (!isRecord(value)) return {}

  const nestedData = value.data

  if (isRecord(nestedData)) {
    return nestedData
  }

  return value
}

function getString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined
}

function getRoles(data: Record<string, unknown>): string[] {
  if (Array.isArray(data.roles)) {
    return data.roles.filter((role): role is string => typeof role === 'string')
  }

  const role = getString(data.role)

  return role ? [role] : []
}

function hasSellerProfile(user: AuthUser): boolean {
  return !!user.sellerProfile && typeof user.sellerProfile === 'object'
}

function defaultParseUser(payload: unknown): AuthUser | null {
  const data = unwrapAuthPayload(payload)
  const roles = getRoles(data)

  const userId = getString(data.userId) ?? getString(data.adminId) ?? getString(data.id)

  if (!userId) return null

  const authUser: AuthUser = {
    ...data,
    userId,
  }

  if (roles.length > 0) {
    authUser.roles = roles
  }

  return authUser
}

function isSameAuthUser(currentUser: AuthUser | null, nextUser: AuthUser): boolean {
  if (!currentUser) return false

  return JSON.stringify(currentUser) === JSON.stringify(nextUser)
}

async function safeReadJson(response: Response): Promise<unknown> {
  try {
    return await response.json()
  } catch {
    return null
  }
}
