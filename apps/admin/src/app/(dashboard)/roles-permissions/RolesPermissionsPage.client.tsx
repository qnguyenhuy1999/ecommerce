'use client'

import { RolesPermissions } from '@ecom/ui-admin'
import { useRolesPermissionsAdapter } from '@/features/roles/hooks/use-roles-permissions-adapter'

export function RolesPermissionsPageClient() {
  const { loading: _loading, error: _error, ...props } = useRolesPermissionsAdapter()
  return <RolesPermissions {...props} />
}
