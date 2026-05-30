'use client'

import { UserDetail } from '@ecom/ui-admin'
import { useUserDetailAdapter } from '@/features/users/hooks/use-user-detail-adapter'
import { stripAdapterMeta } from '@ecom/shared'

export function UserDetailPageClient({ id }: { id: string }) {
  return <UserDetail {...stripAdapterMeta(useUserDetailAdapter(id))} backHref="/buyers" />
}
