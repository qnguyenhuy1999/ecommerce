'use client'

import { Users } from '@ecom/ui-admin'
import { useUsersAdapter } from '@/features/users/hooks/use-users-adapter'
import { stripAdapterMeta } from '@ecom/shared'

export function UsersPageClient() {
  return <Users {...stripAdapterMeta(useUsersAdapter())} />
}
