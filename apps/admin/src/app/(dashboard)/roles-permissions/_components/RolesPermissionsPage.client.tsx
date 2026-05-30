'use client'

import { RolesPermissions } from '@ecom/ui-admin/pages/RolesPermissions'
import { useRolesPermissionsAdapter } from '@/features/roles/hooks/use-roles-permissions-adapter'

export function RolesPermissionsPageClient() {
  // eslint-disable-next-line sonarjs/no-unused-vars
  const { loading: _loading, error: _error, ...props } = useRolesPermissionsAdapter()
  return <RolesPermissions {...props} />
}
