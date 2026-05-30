import type { PermissionKey, RoleRecord } from '@ecom/ui-admin/pages/RolesPermissions'
import type { RoleApiItem } from '../api/roles.api'

export const PERMISSION_KEY_TO_ADMIN_PERMISSION: Record<PermissionKey, string> = {
  'users.view': 'USER_VIEW',
  'users.edit': 'USER_MANAGE',
  'users.delete': 'USER_MANAGE',
  'sellers.view': 'SELLER_VIEW',
  'sellers.approve': 'SELLER_APPROVE',
  'sellers.suspend': 'SELLER_SUSPEND',
  'products.view': 'PRODUCT_VIEW',
  'products.moderate': 'PRODUCT_MODERATE',
  'orders.view': 'ORDER_VIEW',
  'orders.refund': 'REFUND_MANAGE',
  'disputes.view': 'REFUND_VIEW',
  'disputes.resolve': 'REFUND_MANAGE',
  'campaigns.view': 'MARKETING_MANAGE',
  'campaigns.edit': 'MARKETING_MANAGE',
  'settings.view': 'SETTINGS_MANAGE',
  'settings.edit': 'SETTINGS_MANAGE',
  'audit.view': 'AUDIT_VIEW',
}

export const ADMIN_PERMISSION_TO_PERMISSION_KEYS: Record<string, PermissionKey[]> = {
  USER_VIEW: ['users.view'],
  USER_MANAGE: ['users.edit', 'users.delete'],
  SELLER_VIEW: ['sellers.view'],
  SELLER_APPROVE: ['sellers.approve'],
  SELLER_SUSPEND: ['sellers.suspend'],
  PRODUCT_VIEW: ['products.view'],
  PRODUCT_MODERATE: ['products.moderate'],
  ORDER_VIEW: ['orders.view'],
  REFUND_MANAGE: ['orders.refund', 'disputes.resolve'],
  REFUND_VIEW: ['disputes.view'],
  MARKETING_MANAGE: ['campaigns.view', 'campaigns.edit'],
  SETTINGS_MANAGE: ['settings.view', 'settings.edit'],
  AUDIT_VIEW: ['audit.view'],
}

export function mapApiPermissionsToPermissionKeys(adminPermissions: string[]): PermissionKey[] {
  const keys = new Set<PermissionKey>()
  for (const p of adminPermissions) {
    const mapped = ADMIN_PERMISSION_TO_PERMISSION_KEYS[p] ?? []
    for (const k of mapped) keys.add(k)
  }
  return Array.from(keys)
}

export function mapPermissionKeysToAdminPermissions(keys: PermissionKey[]): string[] {
  return [...new Set(keys.map((k) => PERMISSION_KEY_TO_ADMIN_PERMISSION[k]))]
}

export function mapApiRoleToRoleRecord(role: RoleApiItem): RoleRecord {
  return {
    id: role.id,
    name: role.name,
    description: role.description ?? '',
    memberCount: role.memberCount,
    permissions: mapApiPermissionsToPermissionKeys(role.permissions.map((p) => p.permission)),
  } satisfies RoleRecord
}
