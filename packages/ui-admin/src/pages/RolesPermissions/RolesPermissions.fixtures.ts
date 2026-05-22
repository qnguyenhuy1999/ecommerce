import type {
  PermissionKey,
  PermissionRow,
  RoleRecord,
  RolesPermissionsProps,
} from './RolesPermissions.types'

export const ALL_PERMISSION_ROWS: PermissionRow[] = [
  { resource: 'Users', permission: 'users.view' },
  { resource: 'Users', permission: 'users.edit' },
  { resource: 'Users', permission: 'users.delete' },
  { resource: 'Sellers', permission: 'sellers.view' },
  { resource: 'Sellers', permission: 'sellers.approve' },
  { resource: 'Sellers', permission: 'sellers.suspend' },
  { resource: 'Products', permission: 'products.view' },
  { resource: 'Products', permission: 'products.moderate' },
  { resource: 'Orders', permission: 'orders.view' },
  { resource: 'Orders', permission: 'orders.refund' },
  { resource: 'Disputes', permission: 'disputes.view' },
  { resource: 'Disputes', permission: 'disputes.resolve' },
  { resource: 'Campaigns', permission: 'campaigns.view' },
  { resource: 'Campaigns', permission: 'campaigns.edit' },
  { resource: 'Settings', permission: 'settings.view' },
  { resource: 'Settings', permission: 'settings.edit' },
  { resource: 'Audit', permission: 'audit.view' },
]

const ALL_PERMISSIONS: PermissionKey[] = ALL_PERMISSION_ROWS.map((r) => r.permission)

const MODERATOR_PERMISSIONS: PermissionKey[] = [
  'users.view',
  'sellers.view',
  'products.view',
  'products.moderate',
  'orders.view',
  'disputes.view',
  'disputes.resolve',
  'campaigns.view',
]

const OPERATIONS_PERMISSIONS: PermissionKey[] = [
  'users.view',
  'users.edit',
  'sellers.view',
  'sellers.approve',
  'sellers.suspend',
  'products.view',
  'products.moderate',
  'orders.view',
  'orders.refund',
  'disputes.view',
  'disputes.resolve',
  'campaigns.view',
  'campaigns.edit',
]

const SUPPORT_PERMISSIONS: PermissionKey[] = [
  'users.view',
  'sellers.view',
  'products.view',
  'orders.view',
  'orders.refund',
  'disputes.view',
  'disputes.resolve',
]

const FINANCE_PERMISSIONS: PermissionKey[] = [
  'orders.view',
  'orders.refund',
  'disputes.view',
  'campaigns.view',
  'settings.view',
  'audit.view',
]

export const FIXTURE_ROLES: RoleRecord[] = [
  {
    id: 'role-super-admin',
    name: 'Super Admin',
    description: 'Full platform access incl. settings & audit',
    memberCount: 3,
    permissions: ALL_PERMISSIONS,
  },
  {
    id: 'role-operations',
    name: 'Operations',
    description: 'Day-to-day approvals, disputes, refunds',
    memberCount: 12,
    permissions: OPERATIONS_PERMISSIONS,
  },
  {
    id: 'role-moderator',
    name: 'Moderator',
    description: 'Product & content moderation only',
    memberCount: 18,
    permissions: MODERATOR_PERMISSIONS,
  },
  {
    id: 'role-support',
    name: 'Support',
    description: 'Tickets, refunds, read-only access to data',
    memberCount: 24,
    permissions: SUPPORT_PERMISSIONS,
  },
  {
    id: 'role-finance',
    name: 'Finance',
    description: 'Commission, payouts, settlement reports',
    memberCount: 6,
    permissions: FINANCE_PERMISSIONS,
  },
]

export const rolesPermissionsDefaultProps: RolesPermissionsProps = {
  title: 'Roles & permissions',
  description: 'Define what each role can see and do',
  newRoleLabel: '+ New role',
  saveLabel: 'Save permissions',
  cancelLabel: 'Cancel',
  roles: FIXTURE_ROLES,
  permissionRows: ALL_PERMISSION_ROWS,
}
