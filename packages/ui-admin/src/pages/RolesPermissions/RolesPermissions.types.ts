export type PermissionKey =
  | 'users.view'
  | 'users.edit'
  | 'users.delete'
  | 'sellers.view'
  | 'sellers.approve'
  | 'sellers.suspend'
  | 'products.view'
  | 'products.moderate'
  | 'orders.view'
  | 'orders.refund'
  | 'disputes.view'
  | 'disputes.resolve'
  | 'campaigns.view'
  | 'campaigns.edit'
  | 'settings.view'
  | 'settings.edit'
  | 'audit.view'

export type ResourceKey =
  | 'Users'
  | 'Sellers'
  | 'Products'
  | 'Orders'
  | 'Disputes'
  | 'Campaigns'
  | 'Settings'
  | 'Audit'

export interface PermissionRow {
  resource: ResourceKey
  permission: PermissionKey
}

export interface RoleRecord {
  id: string
  name: string
  description: string
  memberCount: number
  permissions: PermissionKey[]
}

export interface RolesPermissionsProps {
  title?: string
  description?: string
  newRoleLabel?: string
  saveLabel?: string
  cancelLabel?: string
  roles?: RoleRecord[]
  permissionRows?: PermissionRow[]
  onNewRole?: ((name: string, description: string) => void | Promise<void>) | undefined
  onSave?: ((roleId: string, permissions: PermissionKey[]) => void | Promise<void>) | undefined
  onCancel?: (() => void) | undefined
}
