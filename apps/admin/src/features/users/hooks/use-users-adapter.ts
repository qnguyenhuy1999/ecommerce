'use client'

import type { UsersProps } from '@ecom/ui-admin'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { useUsers, useUserStatusCounts } from '../hooks/use-users'
import { mapUserToAccountRecord, buildUsersStatusTabs } from '../mappers/user.mapper'

export function useUsersAdapter(): UsersProps & { loading: boolean; error: Error | null } {
  const usersQuery = useUsers({ page: 1, limit: PAGINATION_DEFAULTS.PAGE_SIZE })
  const countsQuery = useUserStatusCounts()

  return {
    loading: usersQuery.isPending,
    error: usersQuery.error,
    items: (usersQuery.data?.items ?? []).map(mapUserToAccountRecord),
    statusTabs: buildUsersStatusTabs(countsQuery.data ?? {}),
  }
}
