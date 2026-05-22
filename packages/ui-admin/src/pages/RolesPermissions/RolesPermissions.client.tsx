'use client'

import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Typography,
} from '@ecom/core-ui'
import { cn } from '@ecom/shared/utils'
import { Users } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { SellerListPage } from '../../organisms'
import type {
  PermissionKey,
  PermissionRow,
  RoleRecord,
  RolesPermissionsProps,
} from './RolesPermissions.types'

export interface RolesPermissionsClientProps {
  newRoleLabel: string
  saveLabel: string
  cancelLabel: string
  roles: RoleRecord[]
  permissionRows: PermissionRow[]
  onNewRole?: RolesPermissionsProps['onNewRole']
  onSave?: RolesPermissionsProps['onSave']
  onCancel?: RolesPermissionsProps['onCancel']
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

function NewRoleDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (name: string, description: string) => void
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = useCallback(() => {
    if (!name.trim()) return
    onConfirm(name.trim(), description.trim())
    setName('')
    setDescription('')
  }, [description, name, onConfirm])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New role</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="role-name">Name</Label>
            <Input
              id="role-name"
              placeholder="e.g. Finance"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role-description">Description</Label>
            <Input
              id="role-description"
              placeholder="e.g. Commission, payouts, settlement reports"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            Create role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function RoleListPanel({
  roles,
  selectedRoleId,
  onSelectRole,
}: {
  roles: RoleRecord[]
  selectedRoleId: string
  onSelectRole: (role: RoleRecord) => void
}) {
  return (
    <div className="bg-background w-[280px] shrink-0 rounded-2xl border p-3">
      <Typography
        as="div"
        variant="label"
        className="text-muted-foreground mb-2 px-2 text-xs tracking-wide uppercase"
      >
        Roles
      </Typography>
      <ul className="space-y-0.5">
        {roles.map((role) => {
          const isActive = role.id === selectedRoleId
          return (
            <li key={role.id}>
              <button
                type="button"
                onClick={() => onSelectRole(role)}
                className={cn(
                  'text-foreground flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors',
                  isActive ? 'bg-primary' : 'hover:bg-muted',
                )}
              >
                <div className="min-w-0">
                  <Typography
                    as="div"
                    variant="label"
                    className={cn(
                      'truncate text-sm',
                      isActive ? 'text-primary-foreground' : 'text-foreground',
                    )}
                  >
                    {role.name}
                  </Typography>
                  <Typography
                    variant="body-sm"
                    className={cn(
                      'mt-0.5 truncate text-xs',
                      isActive ? 'text-primary-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {role.description}
                  </Typography>
                </div>
                <div
                  className={cn(
                    'ml-3 flex shrink-0 items-center gap-1',
                    isActive ? 'text-primary-foreground' : 'text-muted-foreground',
                  )}
                >
                  <Users className="size-3.5" />
                  <Typography variant="body-sm" className="text-xs font-medium">
                    {role.memberCount}
                  </Typography>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function PermissionGrid({
  selectedRole,
  pendingPermissions,
  resourceGroups,
  saveLabel,
  cancelLabel,
  onTogglePermission,
  onSave,
  onCancel,
}: {
  selectedRole: RoleRecord
  pendingPermissions: PermissionKey[]
  resourceGroups: Map<string, PermissionRow[]>
  saveLabel: string
  cancelLabel: string
  onTogglePermission: (key: PermissionKey, checked: boolean) => void
  onSave: () => void
  onCancel?: (() => void) | undefined
}) {
  return (
    <div className="bg-background min-w-0 flex-1 rounded-2xl border">
      <div className="px-6 py-5">
        <Typography as="div" variant="label" className="text-foreground text-base font-semibold">
          {selectedRole.name}
        </Typography>
        <Typography variant="body-sm" className="text-muted-foreground mt-0.5">
          {selectedRole.description}
        </Typography>
        <Typography variant="body-sm" className="text-muted-foreground mt-2 text-sm">
          {pendingPermissions.length} permissions selected · {selectedRole.memberCount} members
        </Typography>
      </div>
      <table className="w-full border-t">
        <thead>
          <tr className="bg-muted/30 border-b">
            <th className="text-muted-foreground w-1/3 px-6 py-3 text-left text-xs font-medium tracking-wide uppercase">
              Resource
            </th>
            <th className="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wide uppercase">
              Permission
            </th>
            <th className="text-muted-foreground w-24 px-6 py-3 text-right text-xs font-medium tracking-wide uppercase">
              Allowed
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from(resourceGroups.entries()).map(([resource, rows]) =>
            rows.map((row, rowIndex) => (
              <tr key={row.permission} className="border-b last:border-0">
                <td className="px-6 py-3 align-middle">
                  {rowIndex === 0 ? (
                    <Typography variant="label" className="text-foreground font-semibold">
                      {resource}
                    </Typography>
                  ) : null}
                </td>
                <td className="px-6 py-3 align-middle">
                  <Typography variant="body-sm" className="text-muted-foreground font-mono text-sm">
                    {row.permission}
                  </Typography>
                </td>
                <td className="px-6 py-3 text-right align-middle">
                  <Checkbox
                    checked={pendingPermissions.includes(row.permission)}
                    onCheckedChange={(checked) =>
                      onTogglePermission(row.permission, Boolean(checked))
                    }
                    aria-label={`Allow ${row.permission}`}
                    className="ml-auto"
                  />
                </td>
              </tr>
            )),
          )}
        </tbody>
      </table>
      <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
        <Button variant="outline" onClick={() => onCancel?.()}>
          {cancelLabel}
        </Button>
        <Button onClick={onSave}>{saveLabel}</Button>
      </div>
    </div>
  )
}

export function RolesPermissionsClient({
  newRoleLabel,
  saveLabel,
  cancelLabel,
  roles,
  permissionRows,
  onNewRole,
  onSave,
  onCancel,
}: RolesPermissionsClientProps) {
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

  return (
    <>
      <SellerListPage.Header>
        <div className="flex items-center justify-end">
          <SellerListPage.Actions>
            <Button type="button" onClick={() => setDialogOpen(true)}>
              {newRoleLabel}
            </Button>
          </SellerListPage.Actions>
        </div>
      </SellerListPage.Header>

      <div className="flex items-start gap-5">
        <RoleListPanel
          roles={roles}
          selectedRoleId={selectedRoleId}
          onSelectRole={handleSelectRole}
        />
        {selectedRole ? (
          <PermissionGrid
            selectedRole={selectedRole}
            pendingPermissions={pendingPermissions}
            resourceGroups={resourceGroups}
            saveLabel={saveLabel}
            cancelLabel={cancelLabel}
            onTogglePermission={handleTogglePermission}
            onSave={handleSave}
            onCancel={onCancel}
          />
        ) : (
          <div className="bg-background flex min-h-48 flex-1 items-center justify-center rounded-2xl border">
            <Typography variant="body-sm" className="text-muted-foreground">
              Select a role to manage permissions.
            </Typography>
          </div>
        )}
      </div>

      <NewRoleDialog open={dialogOpen} onOpenChange={setDialogOpen} onConfirm={handleNewRole} />
    </>
  )
}
