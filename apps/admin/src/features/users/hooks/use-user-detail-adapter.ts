'use client'

import type { UserDetailProps } from '@ecom/ui-admin'
import { useUser, useActivateUser, useBanUser, useSuspendUser } from './use-users'
import type { UserDetail } from '../api/users.api'

function mapUserToDetailRecord(user: UserDetail): NonNullable<UserDetailProps['user']> {
  return {
    id: user.id,
    email: user.email,
    name: [user.firstName, user.lastName].filter(Boolean).join(' ') || 'No name',
    phone: user.phone,
    emailVerified: user.emailVerified,
    status: user.status,
    joinedAtLabel: new Date(user.createdAt).toLocaleDateString(),
    canSuspend: user.status === 'ACTIVE',
    canBan: user.status === 'ACTIVE',
    canActivate: ['SUSPENDED', 'BANNED'].includes(user.status),
    sessions: user.sessions.map((s) => ({
      id: s.id,
      userAgent: s.userAgent,
      ipAddress: s.ipAddress,
      createdAtLabel: new Date(s.createdAt).toLocaleDateString(),
    })),
  }
}

export function useUserDetailAdapter(
  id: string,
): UserDetailProps & { loading: boolean; error: Error | null } {
  const { data, isLoading, error } = useUser(id)
  const suspend = useSuspendUser()
  const ban = useBanUser()
  const activate = useActivateUser()

  return {
    loading: isLoading,
    error,
    ...(data !== undefined ? { user: mapUserToDetailRecord(data) } : {}),
    onSuspend: () => suspend.mutate({ id }),
    onBan: () => ban.mutate({ id }),
    onActivate: () => activate.mutate(id),
  }
}
