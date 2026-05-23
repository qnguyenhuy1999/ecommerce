'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRoles, updateRolePermissions } from '../api/roles.api'
import { roleKeys } from '../query-keys'

export function useRoles() {
  return useQuery({
    queryKey: roleKeys.lists(),
    queryFn: async () => (await getRoles()).data,
  })
}

export function useUpdateRolePermissions() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ roleId, permissions }: { roleId: string; permissions: string[] }) =>
      updateRolePermissions(roleId, permissions),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: roleKeys.all })
    },
  })
}
