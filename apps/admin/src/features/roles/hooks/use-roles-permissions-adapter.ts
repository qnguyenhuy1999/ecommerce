'use client'

import type { RolesPermissionsProps } from '@ecom/ui-admin'
import { ALL_PERMISSION_ROWS } from '@ecom/ui-admin'
import { useRoles, useUpdateRolePermissions } from './use-roles'
import { mapApiRoleToRoleRecord, mapPermissionKeysToAdminPermissions } from '../mappers/roles.mapper'

export function useRolesPermissionsAdapter(): RolesPermissionsProps & {
  loading: boolean
  error: Error | null
} {
  const rolesQuery = useRoles()
  const updateMutation = useUpdateRolePermissions()

  return {
    loading: rolesQuery.isPending,
    error: rolesQuery.error,
    roles: (rolesQuery.data ?? []).map(mapApiRoleToRoleRecord),
    permissionRows: ALL_PERMISSION_ROWS,
    onSave: async (roleId, permissionKeys) => {
      await updateMutation.mutateAsync({
        roleId,
        permissions: mapPermissionKeysToAdminPermissions(permissionKeys),
      })
    },
    onNewRole: undefined,
    onCancel: undefined,
  }
}
