import { SellerListPage } from '../../organisms'
import { rolesPermissionsDefaultProps } from './RolesPermissions.fixtures'
import { RolesPermissionsClient } from './RolesPermissions.client'
import type { RolesPermissionsProps } from './RolesPermissions.types'

export function RolesPermissions({
  title = rolesPermissionsDefaultProps.title,
  description = rolesPermissionsDefaultProps.description,
  newRoleLabel = rolesPermissionsDefaultProps.newRoleLabel,
  saveLabel = rolesPermissionsDefaultProps.saveLabel,
  cancelLabel = rolesPermissionsDefaultProps.cancelLabel,
  roles = rolesPermissionsDefaultProps.roles,
  permissionRows = rolesPermissionsDefaultProps.permissionRows,
  onNewRole = rolesPermissionsDefaultProps.onNewRole,
  onSave = rolesPermissionsDefaultProps.onSave,
  onCancel = rolesPermissionsDefaultProps.onCancel,
}: RolesPermissionsProps) {
  return (
    <SellerListPage
      title={title}
      description={description}
      breadcrumb={[{ label: 'Admin', href: '#' }, { label: 'Roles' }]}
      mainClassName="space-y-5"
    >
      <RolesPermissionsClient
        newRoleLabel={newRoleLabel ?? '+ New role'}
        saveLabel={saveLabel ?? 'Save permissions'}
        cancelLabel={cancelLabel ?? 'Cancel'}
        roles={roles ?? []}
        permissionRows={permissionRows ?? []}
        onNewRole={onNewRole}
        onSave={onSave}
        onCancel={onCancel}
      />
    </SellerListPage>
  )
}
