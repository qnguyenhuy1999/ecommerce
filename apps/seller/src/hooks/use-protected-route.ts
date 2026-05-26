'use client'

import { getWebAuthPreset } from '@ecom/auth'
import { useProtectedRoute as useProtectedRouteBase } from '@ecom/auth/protected-route'
import { useAuth } from '../providers/auth-provider'

const { protectedRoute } = getWebAuthPreset('seller')

export function useProtectedRoute() {
  return useProtectedRouteBase(useAuth, protectedRoute)
}
