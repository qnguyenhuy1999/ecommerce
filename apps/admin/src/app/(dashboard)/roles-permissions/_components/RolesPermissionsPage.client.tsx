'use client'

import { RolesPermissions } from '@ecom/ui-admin/pages/RolesPermissions'
import { useRolesPermissionsAdapter } from '@/features/roles/hooks/use-roles-permissions-adapter'

export function RolesPermissionsPageClient() {
  const { loading, error, ...props } = useRolesPermissionsAdapter()
  void loading
  void error

  return <RolesPermissions {...props} />
}
