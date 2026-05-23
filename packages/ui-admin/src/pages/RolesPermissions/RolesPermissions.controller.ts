import { useCallback, useMemo, useState } from 'react'
import type {
  PermissionKey,
  PermissionRow,
  RoleRecord,
  RolesPermissionsProps,
} from './RolesPermissions.types'

export interface RolesPermissionsControllerProps {
  roles: RoleRecord[]
  permissionRows: PermissionRow[]
  onNewRole?: RolesPermissionsProps['onNewRole']
  onSave?: RolesPermissionsProps['onSave']
}

function groupByResource(rows: PermissionRow[]) {
  const map = new Map<string, PermissionRow[]>()
  for (const row of rows) {
    const existing = map.get(row.resource) ?? []
    existing.push(row)
    map.set(row.resource, existing)
  }
  return map
}

export function useRolesPermissionsController({
  roles,
  permissionRows,
  onNewRole,
  onSave,
}: RolesPermissionsControllerProps) {
  const [selectedRoleId, setSelectedRoleId] = useState(roles[0]?.id ?? '')
  const [pendingPermissions, setPendingPermissions] = useState<PermissionKey[]>(
    () => roles[0]?.permissions ?? [],
  )
  const [dialogOpen, setDialogOpen] = useState(false)

  const selectedRole = useMemo(
    () => roles.find((r) => r.id === selectedRoleId),
    [roles, selectedRoleId],
  )
  const resourceGroups = useMemo(() => groupByResource(permissionRows), [permissionRows])

  const handleSelectRole = useCallback((role: RoleRecord) => {
    setSelectedRoleId(role.id)
    setPendingPermissions([...role.permissions])
  }, [])

  const handleTogglePermission = useCallback((key: PermissionKey, checked: boolean) => {
    setPendingPermissions((prev) => (checked ? [...prev, key] : prev.filter((p) => p !== key)))
  }, [])

  const handleSave = useCallback(() => {
    void onSave?.(selectedRoleId, pendingPermissions)
  }, [onSave, pendingPermissions, selectedRoleId])

  const handleNewRole = useCallback(
    (name: string, description: string) => {
      setDialogOpen(false)
      void onNewRole?.(name, description)
    },
    [onNewRole],
  )

  const openDialog = useCallback(() => {
    setDialogOpen(true)
  }, [])

  return {
    state: {
      selectedRoleId,
      pendingPermissions,
      dialogOpen,
    },
    computed: {
      selectedRole,
      resourceGroups,
    },
    handlers: {
      handleSelectRole,
      handleTogglePermission,
      handleSave,
      handleNewRole,
      openDialog,
      setDialogOpen,
    },
  }
}
