'use client'

import { useQuery } from '@tanstack/react-query'
import { getAdminProfile, type AdminProfile } from '../api/auth.api'

export function useAdminProfile() {
  return useQuery({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const res = await getAdminProfile()
      return res.data
    },
    retry: false,
  })
}

export function useHasPermission(profile: AdminProfile | undefined, permission: string): boolean {
  if (!profile) return false
  return profile.permissions.includes(permission)
}
