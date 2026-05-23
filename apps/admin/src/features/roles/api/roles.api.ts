import { apiFetch } from '@/lib/api'
import type { AdminOperations } from '@ecom/contracts/generated'

export interface RolePermission {
  permission: string
}

export interface RoleApiItem {
  id: string
  name: string
  description: string | null
  memberCount: number
  permissions: RolePermission[]
  createdAt: string
  updatedAt: string
}

type RolesListResponse =
  AdminOperations['RolesController_findAll']['responses']['200']['content']['application/json'] & {
    data: RoleApiItem[]
  }

type UpdateRolePermissionsResponse =
  AdminOperations['RolesController_updatePermissions']['responses']['200']['content']['application/json'] & {
    data: RoleApiItem
  }

export async function getRoles() {
  return apiFetch<RolesListResponse>('/admin/roles')
}

export async function updateRolePermissions(roleId: string, permissions: string[]) {
  return apiFetch<UpdateRolePermissionsResponse>(`/admin/roles/${roleId}/permissions`, {
    method: 'POST',
    body: JSON.stringify({ permissions }),
  })
}
