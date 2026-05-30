'use client'

import { Users } from '@ecom/ui-admin/pages/Users'
import { useUsersAdapter } from '@/features/users/hooks/use-users-adapter'
import { stripAdapterMeta } from '@ecom/shared/utils/adapter-utils'

export function UsersPageClient() {
  return <Users {...stripAdapterMeta(useUsersAdapter())} />
}
