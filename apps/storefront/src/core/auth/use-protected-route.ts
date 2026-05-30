'use client'

import { getWebAuthPreset } from '@ecom/auth/web-presets'
import { useProtectedRoute as useProtectedRouteBase } from '@ecom/auth/protected-route'
import { useAuth } from './auth-provider'

interface UseProtectedRouteOptions {
  requiredRoles?: string[]
  redirectTo?: string
}

const { protectedRoute } = getWebAuthPreset('storefront')

export function useProtectedRoute(options: UseProtectedRouteOptions = {}) {
  const { requiredRoles, redirectTo = '/login' } = options

  return useProtectedRouteBase(useAuth, {
    ...(requiredRoles ? { requiredRoles } : {}),
    ...protectedRoute,
    redirectTo,
  })
}
